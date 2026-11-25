/* The signals of the three turbine protection controllers (TPC A / B / C) to the EHG and MD controllers (lane 0 YUA 2026-11-25, user
   "Interconnected din dapat ang mga logic: DITL ABC TCS"). On the input sheets TCE060 ~ TCE119A every signal comes three times, from the sheet
   TCP1nnn, TCP2nnn and TCP3nnn of the TPC. Those sheets are not in the repository; the same signals are on the interlock block diagram
   (310SC90-794, sheets TA: tcs-ibd-data.js, run by tcs-trip.js) and on the Modbus list of the TCS (tce-io.js MB). Each one here names that one
   source, so the sheets read the trip logic and the transmitters, never a copy. The three controllers read the same value: the model has one
   transmitter.
   Not linked, they keep 0 (no source in the documents read): the input errors (E1 ~ E7) and TCP500 / 501 / 503.A of TCE476 (the model has no card
   fault), the SPARE channels, the rotor position (TCE066: no model), BOILER MFT 1 AND 2 NOT SYN. (one MFT), CRT OPE. PERM. of the solenoid test
   (TCE118 / 119) and the energize commands of the fast acting solenoids (TCE099 / 099A, TCE116): the IBD sheets TA-31 ~ TA-38 draw them, the
   reader has no net for them. */
const TCS_TPC = (() => {
  const T = {},
    mb = n => U => (window.TCE_IO_LIVE ? window.TCE_IO_LIVE.mbRead(U, 'MB:' + n) : NaN),
    ib = (sh, n) => (U, c) => tcsIbNet(c, sh, n),
    put = (sheet, port, f) => (T[sheet + '.' + port] = f),
    abc = (no, port, n) => [0, 1, 2].forEach(i => put(no + 2 * i, port, mb(n + i)));
  /* analogue: TCPn070 ~ 075, the rows of the Modbus list */
  abc(70, 'D1', 30001); /* TCE060 HP turbine exhaust steam press. A / B / C (PT-CR1901) */
  abc(70, 'D2', 30007); /* TCE061 bearing oil press. (PT-LO1003) */
  abc(70, 'D3', 30010); /* TCE062 control oil press. (PT-LO1006) */
  abc(70, 'D4', 30013); /* TCE063 turbine trip oil press. (PT-LO1007) */
  [70, 72, 74].forEach(s => put(s, 'D5', U => tcsFst(U))); /* TCE064 HP turbine first stage steam press. (PT-ST1001, IBD TA-21) */
  abc(71, 'D1', 30029); /* TCE065 LP exhaust hood steam press., condenser vacuum (PT-ST1110) */
  put(70, 'D6', mb(30131)); /* TCE070 gen. MW (A) / (B) */
  put(72, 'D6', mb(30132));
  [70, 71, 72, 73, 74, 75].forEach((s, i) => put(s, 'D7', mb(30092 + i))); /* TCE071 / 072 shaft vibration No.1 X, Y ~ No.3 X, Y */
  put(74, 'D6', mb(30098)); /* TCE073 shaft vibration No.4 X, Y */
  put(75, 'D6', mb(30099));
  /* digital: TCPn050 ~ 055 */
  [50, 52, 54].forEach(s => [14, 16, 18, 20].forEach((n, i) => put(s, 'B' + (i + 1), ib('TA-17', n)))); /* shaft vibration very high No.1 ~ No.4 */
  put(50, 'B7', ib('TA-9', 22)); /* BOILER MFT 1 / MFT 2 */
  put(52, 'B7', ib('TA-9', 21));
  put(50, 'B5', ib('TA-9', 17)); /* gen. / unit trans. protection A (86T) */
  put(50, 'B6', ib('TA-9', 19)); /* protection B (86T) */
  put(50, 'B8', ib('TA-9', 17)); /* generator lockout relay A */
  put(52, 'B8', ib('TA-9', 19)); /* generator lockout relay B */
  put(50, 'B9', ib('TA-1', 10)); /* turbine manual trip PB 1 / PB 2 of the central control room */
  put(52, 'B9', ib('TA-1', 10));
  [50, 51, 52, 53, 54, 55].forEach(s => put(s, 'B16', () => 1)); /* P.S. NORMAL: no power fault in the model */
  put(51, 'B1', mb(10023)); /* ventilator valve full close / full open */
  put(51, 'B2', mb(10024));
  put(53, 'B1', mb(10037)); /* blowdown valve full close / full open */
  put(53, 'B2', mb(10036));
  put(51, 'B14', mb(10012)); /* master trip solenoid A1 / B1, A2 / B2 trip position (ZS-ST1001-1 ~ 4) */
  put(51, 'B15', mb(10014));
  put(53, 'B14', mb(10013));
  put(53, 'B15', mb(10015));
  /* trip signals: TCPn105 / 120 / 121 = the trip logic of IBD TA-9 and TA-1 */
  [10, 11, 12, 14].forEach((n, i) => put(105, 'ABCD'[i] + '2', ib('TA-9', n))); /* shaft vibration very high trip No.1 ~ No.4 */
  [1, 0, 2, 3].forEach((n, i) => put(120, 'B' + (i + 1), ib('TA-9', n))); /* vacuum, main steam temp., thrust front, rear */
  put(120, 'B5', ib('TA-13', 3)); /* control oil, bearing oil, exhaust hood temp., trip oil: the outputs of TA-13 / TA-14 */
  put(120, 'B6', ib('TA-13', 11));
  put(120, 'B7', ib('TA-14', 17));
  put(120, 'B8', ib('TA-14', 8));
  put(120, 'B9', ib('TA-9', 13)); /* HP exhaust temp., HP inlet / exhaust diff. press., HP exhaust press. */
  put(120, 'B10', ib('TA-9', 24));
  put(120, 'B11', ib('TA-9', 25));
  put(120, 'B12', (U, c) => tcsIbNet(c, 'TA-9', 21) || tcsIbNet(c, 'TA-9', 22)); /* BOILER MFT */
  put(120, 'B13', (U, c) => tcsIbNet(c, 'TA-9', 17) || tcsIbNet(c, 'TA-9', 19)); /* gen. / unit trans. protection & lockout operated */
  put(120, 'B14', ib('TA-9', 18)); /* turbine shutdown command */
  put(121, 'A1', ib('TA-1', 13)); /* TURBINE TRIP */
  put(121, 'D1', ib('TA-1', 11)); /* turbine manual trip: OR of the two */
  put(121, 'F2', ib('TA-1', 9)); /* trip PB (TCS HMI) */
  put(121, 'E3', ib('TA-1', 10)); /* turbine manual trip PB (CCR) */
  /* master trip solenoid test: TA-2 (A1, A2) and TA-3 (B1, B2): de-energized, test push button */
  [
    ['C4', 'TA-2', 15],
    ['C5', 'TA-2', 16],
    ['C2', 'TA-2', 1],
    ['C3', 'TA-2', 4],
    ['C9', 'TA-3', 15],
    ['C10', 'TA-3', 16],
    ['C7', 'TA-3', 1],
    ['C8', 'TA-3', 4]
  ].forEach(([p, sh, n]) => put(200, p, ib(sh, n)));
  return T;
})();
/* the ports of the program: [[slots of the three controllers], value] */
function tcsTpcPorts(p) {
  const L = [];
  for (const k in TCS_TPC) {
    const [s, port] = k.split('.'),
      at = [1, 2, 3].map(n => p.idx.get('CON:TCP' + (1000 * n + +s) + '.' + port)).filter(i => i !== undefined);
    if (at.length) L.push([at, TCS_TPC[k]]);
  }
  return L;
}
function tcsTpcFeed(p, U, c) {
  const io = window.TCE_IO_LIVE,
    run = () => {
      for (const [at, f] of p.tpc) {
        const x = +f(U, c);
        if (isFinite(x)) for (const i of at) p.v[i] = x;
      }
    };
  if (io) io.batch(U, run);
  else run();
}
