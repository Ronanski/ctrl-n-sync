/* Phase 10 item 3 (docs/PHASES.md row 10): the alarm behaviour of the plant DCS (Fuji MICREX-VieW XX: the operator screen header of
   snapshot 03.png = newest alarm line with time, tag, text and state; ACK; recovery message of each alarm bit, DCS textbook
   INC-TN5A2099) on the Operator Station page, headless, page engine at a fixed 0.5 s step (AN.runFixed), from 150 MW:
     1. an alarm comes: it is in the alarm list, not acknowledged, with its level and the plant time (h:mm:ss), and the event log has its
        ALM line at that time;
     2. its priority is the one of its row (AN.almPri: HIGH-HIGH = 2);
     3. ACK of that line: acknowledged, an ACK line in the log; the line stays while the value is still over;
     4. the value back: a "back to normal" line (RTN) and the line leaves the list (acknowledged and back);
     5. two alarms, ACK ALL: none left unacknowledged, one "acknowledged (ACK ALL)" line;
     6. the event log is in plant time order (sequence of events), newest first, to the second.
   The forced points: PT-MS1002 main steam pressure (STN101 AI0131 on ABC-001C, list HH 134) and the neutral amine tank LOW-LOW switch
   LSLL-CH1103 (a field state the instructor sets, AN.fault('fs.CH1103.ll')).
   Usage: node tests/gate/alarms.cjs <station.html>. PLAYWRIGHT_MODULE / CHROMIUM env as the behaviour gate. */
const fs = require('fs'),
  url = require('url');
const pw = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const html = process.argv[2];
if (!html || !fs.existsSync(html)) {
  console.log('LOAD ERROR: no station html', html);
  process.exit(2);
}
(async () => {
  const b = await pw.chromium.launch({ executablePath: process.env.CHROMIUM || undefined, headless: true });
  const p = await b.newPage({ viewport: { width: 1600, height: 1000 } });
  const errs = [];
  p.on('pageerror', e => errs.push(String(e.message)));
  await p.addInitScript(() => {
    window.open = () => null;
  });
  await p.goto(url.pathToFileURL(html).href + '?worker=0');
  await p.waitForFunction(() => window.AN && window.lsSaves && window.lsAlarms, null, { timeout: 240000 });
  await p.waitForTimeout(3000);
  await p.getByRole('button', { name: 'Later' }).click({ timeout: 5000 }).catch(() => {});
  await p.getByText('Normal operation at full load').click({ timeout: 120000 });
  await p.waitForFunction(() => AN.sheets && AN.sheets.length >= 54 && AN.unit && AN.unit.MW > 140 && !AN._loading, null, { timeout: 240000 });
  await p.waitForTimeout(15000);
  await p.waitForFunction(() => { AN.clockFixed(true); AN.run = true; return AN.run; }, null, { timeout: 60000, polling: 1000 });
  let bad = 0;
  const ck = (ok, m) => (console.log((ok ? 'PASS ' : 'FAIL ') + m), ok || bad++);
  /* plant seconds, then two scans of the alarm table (it scans every 500 ms of the page clock) */
  const run = s => p.evaluate(async s => { if (!(await AN.runFixed(s, 0.5))) throw new Error('AN.runFixed refused'); }, s).then(() => p.waitForTimeout(1300));
  const state = () =>
    p.evaluate(() => ({
      t: AN.plantT(),
      L: lsAlarms.list().map(e => ({ k: e.k, nm: e.nm, lv: e.lv, t: e.t, ack: !!e.ack, rtn: !!e.rtn, sd: !!e.sd, p: AN.almPri(e).p })),
      un: lsAlarms.unacked(),
      log: lsEvents.slice(0, 40).map(e => ({ t: e.t, kind: e.kind, text: e.text }))
    }));
  const ms = e => /PT-MS1002|PIMS1002/.test(e.nm);
  await run(10);
  const s0 = await state();
  ck(!s0.L.some(ms), 'main steam pressure normal at 150 MW: no line');
  /* 1 - 2 */
  await p.evaluate(() => {
    const S = AN.sheets.find(s => s.name === 'ABC-001C').S,
      b = S.blk.find(z => z.k === 'AI' && z.o && z.o.length && String(AN.nm(S, z.o[0]) || '').replace(/^S\d\s*/, '').trim() === 'AI0131');
    S.rt.force[b.o[0]] = 141;
    window.__msN = [S, b.o[0]];
  });
  await run(6);
  let s = await state();
  const a = s.L.find(ms);
  ck(!!a && a.lv === 'HIGH-HIGH' && !a.ack, '1. PT-MS1002 at 141 (HH 134): line ' + (a ? a.nm + ' ' + a.lv + ' ack ' + a.ack : 'none'));
  ck(!!a && /^\d+:\d{2}(:\d{2})?$/.test(a.t), '1. the line has its plant time: ' + (a && a.t));
  const almLog = s.log.find(e => e.kind === 'ALM' && /PT-MS1002|PIMS1002/.test(e.text));
  ck(!!almLog && almLog.t === a.t, '1. the event log has its ALM line at ' + (almLog && almLog.t));
  ck(!!a && a.p === 2, '2. priority ' + (a && a.p) + ' (HIGH-HIGH = 2, HIGH)');
  /* 3 */
  await p.evaluate(k => lsAlarms.ack(k), a && a.k);
  await run(4);
  s = await state();
  const a2 = s.L.find(ms);
  ck(!!a2 && a2.ack, '3. ACK: the line stays, acknowledged');
  ck(s.log.some(e => e.kind === 'ACK' && /PT-MS1002|PIMS1002/.test(e.text)), '3. an ACK line in the event log');
  /* 4 */
  await p.evaluate(() => { const [S, n] = window.__msN; delete S.rt.force[n]; });
  await run(6);
  s = await state();
  ck(!s.L.some(ms), '4. back to normal and acknowledged: the line has left the list');
  ck(s.log.some(e => e.kind === 'RTN' && /PT-MS1002|PIMS1002/.test(e.text) && /back to normal/.test(e.text)), '4. a "back to normal" line in the event log');
  /* 5 */
  await p.evaluate(() => {
    const [S, n] = window.__msN;
    S.rt.force[n] = 141;
    AN.fault('fs.CH1103.ll', true);
  });
  await run(6);
  s = await state();
  const two = s.L.filter(e => ms(e) || /LSLL-CH1103/.test(e.nm));
  ck(two.length === 2 && two.every(e => !e.ack), '5. two alarms up, not acknowledged: ' + two.map(e => e.nm.split(' ')[0] + ' ' + e.lv).join(', '));
  const lsl = two.find(e => /LSLL-CH1103/.test(e.nm));
  ck(!!lsl && lsl.p === 2, '5. LSLL-CH1103 LOW-LOW priority ' + (lsl && lsl.p));
  await p.evaluate(() => lsAlarms.ack());
  await run(2);
  s = await state();
  ck(s.un === 0, '5. ACK ALL: unacknowledged ' + s.un);
  ck(s.log.some(e => e.kind === 'ACK' && /acknowledged \(ACK ALL\)/.test(e.text)), '5. one "acknowledged (ACK ALL)" line');
  await p.evaluate(() => {
    const [S, n] = window.__msN;
    delete S.rt.force[n];
    AN.fault('fs.CH1103.ll', false);
  });
  await run(6);
  s = await state();
  ck(!s.L.some(e => ms(e) || /LSLL-CH1103/.test(e.nm)), '5. both back to normal: gone from the list');
  /* 6 */
  const sec = x => x.split(':').reduce((a, b) => a * 60 + +b, 0);
  const ts = s.log.map(e => e.t).filter(Boolean);
  ck(ts.length > 6 && ts.every((x, i) => i === 0 || sec(ts[i - 1]) >= sec(x)) && ts.every(x => /:\d{2}$/.test(x)), '6. event log newest first, to the second: ' + ts.slice(0, 6).join(' '));
  ck(!errs.length, 'no page error' + (errs.length ? ': ' + errs.slice(0, 3).join(' | ') : ''));
  await b.close();
  console.log((bad ? 'FAIL' : 'PASS') + ' alarm behaviour: ' + bad + ' failed');
  process.exit(bad ? 1 : 0);
})().catch(e => {
  console.log('FAIL alarm behaviour: ' + e.message);
  process.exit(1);
});
