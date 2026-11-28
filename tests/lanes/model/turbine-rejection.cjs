/* Phase 11 RIN 2026-11-28: full load rejection (52G opens at 150 MW, no turbine trip; Plant-menu fault 'gen.52g'). The physics of
   unit.js / turbine.js: the swing equation with the no-load generator losses, the PLU fast closing (AN_TBV CV 0.15 s, ICV 0.21 s), the
   steam trapped behind the valves (AN_TB tSc / tXo from the casing volumes) and the house-load speed governor; the No.3 NRVs shut by
   reverse flow (tcs-dev.js, YUI) cut the deaerator back-steam. Judged against the design only:
   - the peak stays under the TG manual figure for a full rejection, about 106 % in about 1 s
     (docs/versions/updates/phase11-rin-load-rejection-2026-11-28.md), and it comes within 3 s: only the steam already in the turbine
     drives the rotor (a later peak = steam still coming in behind shut valves, e.g. heater back-steam through an open NRV);
   - the speed rises (the rotor takes the steam already in the turbine: above 100.5 %);
   - the turbine stays latched (no trip: the rejection is not a trip case) and the governor brings the speed back to 3600 +- 1 % by 60 s. */
const path = require('path'),
  W = require(path.resolve(__dirname, '..', '..', '..', 'tools', 'trace', 'world.cjs'));
let bad = 0;
const ok = (c, t) => {
  if (!c) bad++;
  console.log((c ? 'PASS ' : 'FAIL ') + t);
};
(async () => {
  const E = W.load();
  await E.start('150');
  E.step(4, 0.5);
  const U = E.AN.unit;
  E.js("WORLD.ftrip('gen.52g',true)");
  let pk = 0, tp = 0;
  for (let i = 1; i <= 120; i++) {
    E.step(1, 0.5);
    if (U.tb.rpm > pk) (pk = U.tb.rpm), (tp = i * 0.5);
  }
  const rpm = U.tb.rpm, st = U.tb.st, trip = !!(U.tc && U.tc.trip);
  ok(pk < 3600 * 1.06, 'peak ' + pk.toFixed(0) + ' rpm = ' + ((100 * pk) / 3600).toFixed(1) + ' % at ' + tp + ' s, under the TG manual about 106 %');
  ok(tp <= 3, 'the peak comes within 3 s of the 52G opening (' + tp + ' s; TG manual about 1 s)');
  ok(pk > 3600 * 1.005, 'the speed rises on the steam left in the turbine (above 100.5 %)');
  ok(!trip && st !== 'off', 'turbine latched, not tripped (state ' + st + ')');
  ok(Math.abs(rpm - 3600) < 36, 'speed at 60 s ' + rpm.toFixed(0) + ' rpm, back to 3600 +- 1 % on the house-load governor');
  process.exit(bad ? 1 : 0);
})();
