// 3.2.1-beta.19: page 07 DRUM AND MAIN STEAM (hmi-mock-ms.js). At "Start at 150 MW" (one world, plant model ON):
// (1) the feedwater / spray tags that page 06 FEEDWATER shows (PT-FW1160, FT-FW1109 / 1119 / 1149 / 1059, ZT-FW1110 / 1120) show the
//     SAME value on page 07 (one tag, one value; before: '-----' on page 07, a number on page 06);
// (2) the drum, main steam and reheat transmitters of the logic show a number; turbine speed 3600 rpm;
// (3) no page error. NO-SOURCE tags (data-ns, no sheet and no plant model) stay '-----' and are listed, not failed.
// 1.0.0-beta.336: ported to the HX pages (pages 06 / 07 are gone); start = "At 150 MW".
// Usage: node tests/regress/ms_page_values.js [html]
const fs = require('fs');
const { open } = require('./lib.js');
const html =
  process.argv.find(a => /\.html$/.test(a)) ||
  'dist/' + fs.readdirSync('dist').find(x => /^logic-sim-v[\d.]+(?:-beta\.\d+)?\.html$/.test(x));
(async () => {
  const { browser, page, errs } = await open(html);
  let fail = 0;
  const ck = (ok, w) => {
    console.log((ok ? 'PASS ' : 'FAIL ') + w);
    if (!ok) fail++;
  };
  await page.setViewportSize({ width: 1600, height: 900 });
  await page.waitForFunction(() => AN.sheets && AN.sheets.length >= 54 && window.WORLD && WORLD.idx && window.DITL150 && window.LS_MOCK, null, {
    timeout: 120000
  });
  await page.waitForTimeout(2000);
  /* 1.0.0-beta.336 (JENNIE): the start the operator uses, "At 150 MW" (AN.loadStart + the DITL + the steady state st150); the bare
     AN.plantLoad150 + DITL150.apply has no steady state and drifts. The old pages 06 / 07 (hmi-mock) are gone: the same tags are on
     the HX pages now (Drum and steam, Feedwater, Reheat steam, Overview, Turbine). read() opens each page as the operator does and
     reads the value it shows (HX.data.value, the same call the page draws with) */
  await page.evaluate(async () => {
    await AN.ades();
    WORLD.set(true);
    document.getElementById("load150").click();
    await AN._startP;
  });
  await page.evaluate(async () => {
    const C1 = AN.sheets.find(s => s.name === "ABC-001C");
    for (let i = 0; i < 600; i++) {
      WORLD.live = true;
      AN.stepSet(C1, 0.5);
      WORLD.tick(0.5);
      if (i % 100 === 99) await new Promise(r => setTimeout(r, 0));
    }
    WORLD.live = true;
  });
  await page.evaluate(() => lsPlant(true));
  await page.waitForTimeout(1000);
  const PG = {
    "HX-drum-steam": ["PT-BR1001-1", "ABC-010|LIBR10011.PV", "PT-MS1002", "FT-MS1031", "FT-FW1109", "FT-FW1119", "ZT-FW1110-1", "ZT-FW1120-1"],
    "HX-feedwater": ["PT-FW1160"],
    "HX-reheat-steam": ["FT-FW1149", "FT-FW1059", "PT-MS1006-1", "TT-MS1022-1", "PT-HR1003-1", "TT-HR1004"],
    "HX-overview": ["PT-MS1002"],
    "HX-turbine": ["PT-MS1006-1"]
  };
  /* all pages read the same plant instant: no stepping between the reads */
  await page.evaluate(() => (AN.run = false));
  const v = {};
  for (const p in PG) {
    await page.evaluate(p => document.querySelector(`#pllist button[data-id="${p}"]`).click(), p);
    await page.waitForTimeout(2500);
    v[p] = await page.evaluate(K => Object.fromEntries(K.map(k => [k, HX.data.value(k) == null ? null : String(HX.data.value(k))])), PG[p]);
  }
  console.log(JSON.stringify(v));
  const num = x => x != null && isFinite(parseFloat(x));
  const all = Object.values(v).flatMap(o => Object.entries(o));
  ck(all.every(([, x]) => num(x)), "every drum / main steam / feedwater / spray / reheat transmitter shows a number: " + all.filter(([, x]) => !num(x)).map(([k]) => k).join(", "));
  ck(v["HX-overview"]["PT-MS1002"] === v["HX-drum-steam"]["PT-MS1002"], `one tag, one value: PT-MS1002 ${v["HX-overview"]["PT-MS1002"]} (Overview) = ${v["HX-drum-steam"]["PT-MS1002"]} (Drum and steam)`);
  ck(v["HX-turbine"]["PT-MS1006-1"] === v["HX-reheat-steam"]["PT-MS1006-1"], `one tag, one value: PT-MS1006-1 ${v["HX-turbine"]["PT-MS1006-1"]} (Turbine) = ${v["HX-reheat-steam"]["PT-MS1006-1"]} (Reheat steam)`);
  const d = v["HX-drum-steam"];
  ck(parseFloat(d["PT-MS1002"]) > 115 && parseFloat(d["PT-MS1002"]) < 135 && parseFloat(d["FT-MS1031"]) > 400, `150 MW: main steam ${d["PT-MS1002"]} kg/cm2, ${d["FT-MS1031"]} T/H`);
  const rpm = await page.evaluate(() => Math.round(AN.srcSt().rpm));
  ck(rpm > 3500 && rpm < 3700, "turbine speed " + rpm + " rpm");
  ck(errs.length === 0, 'no page error' + (errs.length ? ': ' + errs.join(' | ') : ''));
  console.log(fail ? 'FAILED ' + fail : 'ALL PASS');
  await browser.close();
  process.exit(fail ? 1 : 0);
})();
