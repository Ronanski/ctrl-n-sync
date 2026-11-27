/* TCS field devices with no state before (lane 2 TCS IO : TSUBASA, 2026-11-25; YUA's hand-over of needs-for-yua.md groups 1, 4, 10):
   the turbine drain motor valves, the extraction / cold reheat non return valves and the LP exhaust hood spray valve, as positions with
   their limit and torque switches, so the TCS I/O list (src/digital/tce-io.js) reads them. Plain data under U.dev (saved with the unit);
   nothing else of the unit is written here (not c.mop / c.cop / c.eop / c.vex / c.gse, not the IBD memories, not the DCS).
   What moves each valve is what already runs in the app, one path each:
     - the drain MOVs: the OPEN / CLOSE command nets of their IBD sheets (tcs-trip.js, c.ib.v), the outputs that go to the MCC;
     - the HP turbine warming valve MV-AS1011: its position is the engine's own U.tt['ZT-AS1011'] (unit.js anAsTagStep), only read;
     - the steam seal feed inlet valve MV-GS1030: the engine's c.ssfv (IBD TC-31 OPEN / CLOSE, tcs-trip.js TCS_IBD_DEV);
     - the hood spray valve FV-CD1904: the engine's c.hso (IBD TC-35);
     - the non return valves: a swing check valve with an air cylinder and a solenoid (IBD TC-19, TC-41 ~ TC-45): free to open with the
       steam flow while the solenoid is energized, closed by the cylinder when the TCS de-energizes it (turbine trip, TA-7 link "1").
       The extraction steam flows only while the turbine is on load; with a trip or the generator off line the valve closes.
   Travel and limit settings, from the drawings (TCS soft logic 331DM09788, Aug 2017; IBD 310SC90-794 Rev 2 typical sheets 16 ~ 23):
     - TORQUE (SEAL-IN) LMA594A / B (TCA610, 611, 615, 616, 625, 626 = TC-1, 2, 7, 8, 12, 13) and POSITION (SEAL-IN) LMA594C / D
       (TCA650 = TC-31): TP 35.0 s = "VALVE OPENING (CLOSING) TIME + 5 sec" (IBD sheet 16 / 18 t1 / t2), so the travel is 30 s;
     - TORQUE (INCHING) LMA589 (TCA618 = TC-5): the position simulation R 2.5 %/s (its POS.S out, FTR 033), so 40 s end to end;
     - AIR OPERATED VALVE LMA593 (TCA605 ...): R 20.0 %/s, 5 s end to end;
     - every macro: K 99.0 % = OPENED, K 1.0 % = CLOSED.
   Torque switches: a TORQUE SEAT valve stops on its torque switch at the closed seat (IBD sheet 16 / 20 "TORQUE SEAT"), so the close
   side torque switch is made while the motor still drives it shut at the seat (the scan of that step); the open side stops on its limit
   switch, so its torque switch stays 0 (no jam in the model). The POSITION SEAT valve (TC-31) stops on its limit switches both ways.
   Starting state (a new unit or a save point made before this file): the drains closed when ICV TO CV TRANSFER COMPLETE holds (tb.xfer, the
   auto close of TCA610 ~ 626), else open (their auto open by 52G OPEN); the NRVs and the other valves from their own state above. */
const TCS_DEV = {
  trav: 30 /* s, seal-in MOV travel: TP 35.0 s - 5 s (TCA610 ~ 626, TCA650; IBD sheet 16 / 18) */,
  rInch: 2.5 /* %/s, TORQUE (INCHING) TCA618 R */,
  rAov: 20 /* %/s, AIR OPERATED VALVE macro R (TCA605) */,
  op: 99 /* % OPENED (K 99.0 %) */,
  cl: 1 /* % CLOSED (K 1.0 %) */,
  /* [key, IBD sheet, OPEN net, CLOSE net, kind] (the command nets: tcs-ibd-data.js inputs named "...OPEN" / "CLOSE" at the right edge) */
  mov: [
    ['msvA', 'TC-1', 23, 25, 'seal'] /* MSV(A) ABOVE SEAT SECONDARY DRAIN VALVE */,
    ['msvB', 'TC-2', 17, 19, 'seal'] /* MSV(B) ABOVE SEAT */,
    ['cvA', 'TC-7', 30, 32, 'seal'] /* CV(A) ABOVE SEAT */,
    ['cvB', 'TC-8', 22, 24, 'seal'] /* CV(B) ABOVE SEAT */,
    ['crvA', 'TC-12', 16, 18, 'seal'] /* CRV(A) BELOW SEAT */,
    ['crvB', 'TC-13', 16, 18, 'seal'] /* CRV(B) BELOW SEAT */,
    ['cvBw', 'TC-5', 20, 22, 'inch'] /* CV(B) BELOW SEAT SECONDARY WARMING DRAIN VALVE ZT-STn008 */
  ],
  /* Phase 11 RIN 2026-11-28: the NRV closing on the trip (the ETS relay dump vents the air cylinder, the spring assist shuts the disc):
     100 % in 2 s, KARATU swing check data sheet "within 2 sec" on air dump (YUA read, /mnt/project-files/rin-extraction-2026-11-28.md).
     The normal stroke stays the AOV rate rAov */
  rNrvDump: 50,
  nrv: ['crv', 'ex2', 'ex3p', 'ex3s', 'ex4', 'ex5'] /* TC-19 cold reheat, TC-41 No.2, TC-42 / 43 No.3 primary / secondary, TC-44 No.4, TC-45 No.5 */
};
/* the limit / torque switches of a position (open, closed) */
function tcsDevSw(v, p) {
  v.p = Math.max(0, Math.min(100, p));
  v.o = v.p >= TCS_DEV.op ? 1 : 0;
  v.c = v.p <= TCS_DEV.cl ? 1 : 0;
}
/* a valve that runs toward a target position at a rate (%/s); tqC set while it drives shut onto the seat (torque seat) */
function tcsDevRun(v, aim, rate, dt, seat) {
  const p = v.p,
    d = aim - p,
    s = Math.sign(d) * Math.min(Math.abs(d), rate * dt);
  tcsDevSw(v, p + s);
  v.tqO = 0;
  v.tqC = seat && aim <= 0 && p > 0 && v.p <= 0 ? 1 : 0;
}
function tcsDev(U, dt) {
  const c = U.tc || U.tco,
    tb = U.tb;
  if (!c || !tb || !(dt > 0)) return;
  const K = TCS_DEV,
    ib = (c.ib && c.ib.v) || {},
    net = (sh, n) => (ib[sh] && +ib[sh][n] > 0.5 ? 1 : 0),
    onLoad = tb.st === 'sync' || tb.st === 'load',
    d = U.dev || (U.dev = {}),
    mov = d.mov || (d.mov = {}),
    nrv = d.nrv || (d.nrv = {});
  /* the drain MOVs: seal-in = a command pulse runs the motor to the end; inching = it runs only while the command is held */
  for (const [k, sh, on, off, kind] of K.mov) {
    let v = mov[k];
    if (!v) {
      v = mov[k] = { dir: 0 };
      tcsDevSw(v, tb.xfer ? 0 : 100);
      v.tqO = v.tqC = 0;
    }
    const o = net(sh, on),
      x = net(sh, off);
    if (kind === 'inch') v.dir = o && !x ? 1 : x && !o ? -1 : 0;
    else if (o && !x) v.dir = 1;
    else if (x && !o) v.dir = -1;
    const rate = kind === 'inch' ? K.rInch : 100 / K.trav;
    if (v.dir > 0) tcsDevRun(v, 100, rate, dt, false);
    else if (v.dir < 0) tcsDevRun(v, 0, rate, dt, true);
    else v.tqO = v.tqC = 0;
    if (kind === 'seal' && ((v.dir > 0 && v.o) || (v.dir < 0 && v.p <= 0))) v.dir = 0;
  }
  /* MV-AS1011 HP turbine warming valve: the engine's position, its switches here (TORQUE (INCHING): K 99 / 1 %) */
  {
    const v = mov.wv || (mov.wv = { p: 0 }),
      p0 = v.p,
      p = U.tt && isFinite(U.tt['ZT-AS1011']) ? +U.tt['ZT-AS1011'] : 0;
    tcsDevSw(v, p);
    v.tqO = 0;
    v.tqC = p0 > 0 && v.p <= 0 ? 1 : 0;
  }
  /* MV-GS1030 steam seal feed inlet valve (POSITION (SEAL-IN), 30 s): runs to the engine's c.ssfv */
  {
    let v = mov.ssfi;
    if (!v) tcsDevSw((v = mov.ssfi = {}), c.ssfv ? 100 : 0);
    tcsDevRun(v, c.ssfv ? 100 : 0, 100 / K.trav, dt, false);
  }
  /* the non return valves: open with the steam flow while the solenoid holds (turbine on load, no trip), closed by the cylinder */
  const nOpen = onLoad && !c.trip;
  for (const k of K.nrv) {
    let v = nrv[k];
    if (!v) tcsDevSw((v = nrv[k] = {}), nOpen ? 100 : 0);
    /* they close on the TURBINE TRIP only (the ETS relay dump; not on OPC / PLU: TEQ via YUA, /mnt/project-files/mei-lph-flash-reads-2026-11-28.md):
       off load without a trip (a load rejection, 52G open) they keep their position */
    tcsDevRun(v, c.trip ? 0 : nOpen ? 100 : v.p, c.trip ? K.rNrvDump : K.rAov, dt, false);
  }
  /* the generator watt-hour meter of the generator control panel (GCP-AI1003, a pulse counter to the DCS): the integral of the MW,
     counted from 0 when this state is made (a meter reading of the plant is not a physics value) */
  d.mwh = (isFinite(d.mwh) ? d.mwh : 0) + (Math.max(0, +U.MW || 0) * dt) / 3600;
  /* Phase 9 (2026-11-26): the var-hour meter of the same panel (GCP-AI1006): the integral of the generator Mvar (tcs-gen.js g.Q x
     176.5 MVA), counted like the watt-hour (only the lagging, exported Mvar: INFERRED, the meter form is not in the drawing) */
  {
    const q = U.gen && isFinite(U.gen.Q) ? U.gen.Q * 176.5 : 0;
    d.mvarh = (isFinite(d.mvarh) ? d.mvarh : 0) + (Math.max(0, q) * dt) / 3600;
  }
  /* FV-CD1904 LP exhaust hood water spray valve (solenoid valve, AOV travel): the engine's c.hso (IBD TC-35) */
  {
    let v = d.hood;
    if (!v) tcsDevSw((v = d.hood = {}), c.hso ? 100 : 0);
    tcsDevRun(v, c.hso ? 100 : 0, K.rAov, dt, false);
  }
}
