// The TCS I/O list of the app (lane 2 TCS IO, docs/audit/lane-plan-content-first-2026-11-25.md): src/data/tcs-io.json.
// usage: node tools/data/tcs_io.mjs [--xsmm <rows.json>] [--check]
//
// Sources, in the order they win (RULES 3.8: TCE / TCA of Aug 2017 win where they overlap):
//  1. The PI/O tables of the TCS soft logic set, typed from the drawing (Hitachi 331DM09784 TCE9xx = EHG, 331DM09788 TCA9xx = COMM;
//     src/digital/tce/TC[AE]9xx.js): one row per channel of each card, with its unit, slot, card type, channel, the signal name as drawn,
//     the ranges and the instrument number. These rows are THE TCS I/O of the app; nothing is added that the tables do not show.
//  2. The sheet pin of each row: the logic sheet that carries the PI/O box of that row, found by the reference the drawing prints at the
//     box, "(TCE901-3)" (DI / AI / DO / AO / servo sheets; one table row can be on more than one sheet).
//  3. The TCS I/O list XSMM_IO_List_R1.xlsx (iolist-tcs.zip, PC only), sheet "IO LIST R.1 (3)": tag, description, kind, use, redundancy,
//     range, controller, FROM / TO (FIELD, DCS, MCC, TSI, SV, AOV ...), and the DCS I/O list sheet number. Read on the PC by
//     tools/data/tcs_io_xsmm.py into a rows file; matched to the table rows by the instrument number, else by the words.
// --check: rebuild in memory and fail when src/data/tcs-io.json differs (the table sheets changed and the list was not made again).
import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const dir = path.join(root, 'src/digital/tce');
const out = path.join(root, 'src/data/tcs-io.json');
const arg = k => {
  const i = process.argv.indexOf(k);
  return i > 0 ? process.argv[i + 1] : null;
};
const lib = fs.readFileSync(path.join(dir, '_lib.js'), 'utf8');
const sheets = [];
for (const f of fs
  .readdirSync(dir)
  .filter(f => /^(TC[AE]|G-|IBD).*\.js$/.test(f))
  .sort()) {
  const win = {};
  vm.runInNewContext(lib + ';' + fs.readFileSync(path.join(dir, f), 'utf8'), { window: win });
  sheets.push(...(win.TCE_SHEETS || []));
}
const TAB = /^TC[AE]9\d\d$/;
const kindOf = title => {
  const m = /(DI|AI|DO|AO|THC|RTD|PTI|SERVO) TABLE/.exec(title);
  return m ? m[1] : '?';
};
const ctlOf = c => (/^EHG/.test(c) ? 'EHG' : /^COM/.test(c) ? 'COM' : c);
/* the lines of a sheet: text items grouped by height (the tables are drawn row by row) */
function lines(s) {
  const t = [...s.t].filter(x => typeof x[2] === 'string').sort((a, b) => a[1] - b[1] || a[0] - b[0]);
  const L = [];
  let cur = null;
  for (const x of t) {
    if (!cur || Math.abs(x[1] - cur.y) > 6) L.push((cur = { y: x[1], it: [] }));
    cur.it.push({ x: x[0], s: x[2].trim() });
  }
  L.forEach(l => l.it.sort((a, b) => a.x - b.x));
  return L;
}
const INS = /^[A-Z]{1,5}-[A-Z]{2}[-n0-9]/;
const num = s => (/^[-+]?\d*\.?\d+$/.test(s) ? +s : null);
function tableRows(s) {
  const kind = kindOf(s.title),
    rows = [];
  let card = null,
    sub = kind;
  for (const l of lines(s)) {
    const w = l.it.map(i => i.s);
    const iu = w.indexOf('UNIT');
    if (iu >= 0 && w[0] === 'SLOT') {
      /* SLOT TYPE UNIT <u> SLOT <s> TYPE <card> DVA TYPE (a card with no unit / slot / type printed keeps them empty) */
      const after = w.slice(iu + 1);
      const u = after[0] !== 'SLOT' ? after[0] : '';
      const i2 = after.indexOf('SLOT'),
        sl = after[i2 + 1] !== 'TYPE' ? after[i2 + 1] : '';
      const i3 = after.indexOf('TYPE', i2 + 1),
        ty = after[i3 + 1] && after[i3 + 1] !== 'DVA' ? after[i3 + 1] : '';
      card = { unit: u, slot: sl, card: ty };
      continue;
    }
    if (w.some(x => /Signal Name$/.test(x))) {
      const n = w.find(x => /Signal Name$/.test(x));
      sub = kind === 'SERVO' ? (/^AO/.test(n) ? 'SERVO-AO' : 'SERVO-AI') : kind;
      continue;
    }
    if (w.length < 2 || num(w[0]) == null || !/^[0-9A-F]{1,2}$/i.test(w[1])) continue;
    const no = +w[0],
      ch = w[1].toUpperCase();
    const name = w[2] && num(w[2]) == null ? w[2] : '';
    const rest = w.slice(name ? 3 : 2);
    const ins = rest.find(x => INS.test(x)) || '';
    const nums = rest.filter(x => !INS.test(x));
    const r = {
      id: s.id + '-' + no,
      tab: s.id,
      ctl: ctlOf(s.ctl),
      kind: sub,
      unit: card ? card.unit : '',
      slot: card ? card.slot : '',
      card: card ? card.card : '',
      no,
      ch,
      name: name || '(SPARE)'
    };
    if (ins) r.ins = ins;
    /* AI / THC / RTD / servo: bare low, up, unit, span, eng low, up, unit, ...: the engineering range is the second triple */
    if (/AI|AO|THC|RTD|SERVO/.test(sub) && nums.length >= 7 && num(nums[4]) != null)
      r.range = [num(nums[4]), num(nums[5]), nums[6]];
    if (r.name === '(SPARE)' || /^\(?SPARE\)?$/.test(r.name)) r.spare = 1;
    rows.push(r);
  }
  /* the drawn rows beside the table that only say a channel is SPARE are read as spare */
  return rows;
}
const rows = [];
for (const s of sheets.filter(s => TAB.test(s.id))) rows.push(...tableRows(s));
/* sheet pins: every "(TCE901-3)" the logic sheets print */
const REF = /^\((TC[AE]9\d\d)-(\d+)\)$/;
const pins = {};
for (const s of sheets) {
  if (TAB.test(s.id)) continue;
  for (const x of s.t || []) {
    const m = typeof x[2] === 'string' && REF.exec(x[2].trim());
    if (!m) continue;
    const id = m[1] + '-' + m[2];
    /* the PI/O box nearest to the reference (DI sheets: the key di<n>; DO / AO sheets: the box at the right of the mark) */
    let best = null,
      bd = 1e9;
    for (const b of s.r || []) {
      const cx = Math.max(b[1], Math.min(x[0], b[1] + b[3])),
        cy = Math.max(b[2], Math.min(x[1], b[2] + b[4])),
        d = Math.hypot(cx - x[0], cy - x[1]);
      if (d < bd) ((bd = d), (best = b));
    }
    const p = { sheet: s.id };
    if (best && bd < 260 && best[0] && !/^pe|^pioErr/.test(best[0])) p.box = best[0];
    (pins[id] = pins[id] || []).some(q => q.sheet === p.sheet && q.box === p.box) || pins[id].push(p);
  }
}
/* the sheets drawn by the builders of tce/_lib.js (AI / THC / RTD diagnostics TCA310 ~ 365, TCA440 ~ 443) print no "(TCA930-1)": the PI/O box
   ai<n> carries the name of the signal. Its row: the input row (AI / THC / RTD) of the same controller's tables with that name (spaces of the
   drawing's line breaks left out; else the one row with word overlap >= 0.6, the drawing's own spelling "SEPARETOR"); the box RTD is the cold
   junction RTD of the THC card, the RTD row of the table of the other boxes of the sheet. The pulse input card TCE140: the pickup boxes pkA / pkB
   / pkC are SE-STn001-1 / -2 / -3, the first TCE980 row of each (the pickup row that prints the instrument). */
const nz = x =>
  String(x)
    .toUpperCase()
    .replace(/\bGEN\b\.?/g, 'GENERATOR')
    .replace(/[^A-Z0-9]/g, '');
const wd = x =>
  new Set(
    String(x)
      .toUpperCase()
      .replace(/\bGEN\b\.?/g, 'GENERATOR')
      .split(/[^A-Z0-9]+/)
      .filter(Boolean)
  );
const jac = (a, b) => {
  const A = wd(a),
    B = wd(b);
  let n = 0;
  for (const w of A) if (B.has(w)) n++;
  return n / (A.size + B.size - n || 1);
};
const spareBox = [];
const named = s => {
  const i = {};
  for (const [id, ps] of Object.entries(pins)) for (const p of ps) if (p.sheet === s.id && p.box) i[p.box] = id;
  return i;
};
for (const s of sheets) {
  if (TAB.test(s.id)) continue;
  const have = named(s),
    pre = s.id.slice(0, 3);
  const inRows = rows.filter(r => r.tab.slice(0, 3) === pre && /^(AI|THC|RTD)$/.test(r.kind) && !r.spare);
  const add = (id, box) =>
    (pins[id] = pins[id] || []).some(q => q.sheet === s.id && q.box === box) || pins[id].push({ sheet: s.id, box });
  const late = [];
  for (const b of [
    ...(s.r || []),
    ...(s.id === 'TCE140' ? (s.s || []).map(q => [q[0], q[1], q[2], q[3] - q[1], q[4] - q[2]]) : [])
  ]) {
    const box = b[0];
    if (!box || have[box]) continue;
    if (s.id === 'TCE140' && /^pk[ABC]$/.test(box)) {
      const k = 'ABC'.indexOf(box[2]) + 1,
        r = rows.find(r => r.tab === 'TCE980' && r.ins === 'SE-STn001-' + k);
      if (r) add(r.id, box);
      continue;
    }
    if (!/^ai\d+$/.test(box)) continue;
    const tx = (s.t || [])
      .filter(
        w =>
          typeof w[2] === 'string' &&
          w[0] >= b[1] - 6 &&
          w[0] <= b[1] + b[3] + 6 &&
          w[1] >= b[2] - 6 &&
          w[1] <= b[2] + b[4] + 6
      )
      .sort((p, q) => p[1] - q[1] || p[0] - q[0])
      .map(w => w[2].trim());
    const lab = tx
      .filter(w => !/^-?[\d.]+$|^-[\d.]+\s*\S*$|mA$|degc$|kg\/cm2|^%$/i.test(w) && !/^-?[\d.]+\s*-[\d.]+/.test(w))
      .join(' ')
      .trim();
    if (!lab || /^SPARE$/.test(lab)) {
      spareBox.push({ sheet: s.id, box });
      continue;
    }
    if (lab === 'RTD') {
      late.push(box);
      continue;
    }
    let h = inRows.filter(r => nz(r.name) === nz(lab));
    if (h.length !== 1) {
      const sc = inRows
        .map(r => [jac(r.name, lab), r])
        .filter(x => x[0] >= 0.6)
        .sort((p, q) => q[0] - p[0]);
      h = sc.length && (sc.length === 1 || sc[0][0] > sc[1][0]) ? [sc[0][1]] : [];
    }
    if (h.length === 1) (add(h[0].id, box), (have[box] = h[0].id));
  }
  for (const box of late) {
    /* the sheet prints the reference of the RTD row away from its box (TCA353: "(TCA960-16)") */
    const near = Object.entries(pins).find(
      ([id, ps]) => rows.some(r => r.id === id && r.name === 'RTD') && ps.some(p => p.sheet === s.id && !p.box)
    );
    if (near) {
      const ps = pins[near[0]];
      ps.splice(
        ps.findIndex(p => p.sheet === s.id && !p.box),
        1,
        { sheet: s.id, box }
      );
      continue;
    }
    const tabs = [...new Set(Object.values(have).map(id => id.split('-')[0]))];
    if (tabs.length !== 1) continue;
    const no = Math.max(...Object.values(have).map(id => +id.split('-')[1]));
    const r = rows.find(r => r.tab === tabs[0] && r.kind === 'THC' && r.name === 'RTD' && +r.id.split('-')[1] > no);
    if (r) add(r.id, box);
  }
}
for (const r of rows) if (pins[r.id]) r.pin = pins[r.id];
/* PI/O error references "(TCE901-1)" on the card error box are pins of the card, not of channel 1: kept only where a box was named */
for (const r of rows) if (r.pin && !r.pin.length) delete r.pin;
/* the XSMM list rows (made on the PC by tools/data/tcs_io_xsmm.py) */
const xf = arg('--xsmm');
let xsmm = null;
if (xf) xsmm = JSON.parse(fs.readFileSync(xf, 'utf8'));
else if (fs.existsSync(out)) xsmm = JSON.parse(fs.readFileSync(out, 'utf8')).xsmm || null;
const norm = s =>
  String(s || '')
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '');
const unitTag = s => String(s || '').replace(/^([A-Z]{1,5}-[A-Z]{2})n/, '$11');
/* words of a signal name, the drawing's short forms written out (ABV = ABOVE, SEC = SECONDARY ...), so the two lists compare word by word */
const SHORT = {
  ABV: 'ABOVE',
  BEL: 'BELOW',
  BELLOW: 'BELOW',
  SEC: 'SECONDARY',
  SECONDRY: 'SECONDARY',
  ELE: 'ELECTRICAL',
  ELEC: 'ELECTRICAL',
  PRESS: 'PRESSURE',
  TEMP: 'TEMPERATURE',
  VLV: 'VALVE',
  CONTRL: 'CONTROL',
  FEAD: 'FEED',
  METALL: 'METAL',
  SEPARETOR: 'SEPARATOR',
  VAPUR: 'VAPOUR',
  PLRIFIER: 'PURIFIER',
  TTURNING: 'TURNING',
  TURNINNG: 'TURNING',
  CORDINATION: 'COORDINATION',
  LIMITTER: 'LIMITER',
  EXCUTING: 'EXECUTING',
  GEN: 'GENERATOR',
  SW: 'SWITCH',
  FB: 'FEEDBACK',
  NO: 'NO'
};
const words = s =>
  new Set(
    String(s || '')
      .toUpperCase()
      .replace(/FEED ?BACK/g, 'FEEDBACK')
      .split(/[^A-Z0-9]+/)
      .filter(Boolean)
      .map(w => SHORT[w] || w)
  );
const sim = (A, B) => {
  let n = 0;
  for (const w of A) if (B.has(w)) n++;
  return n / (A.size + B.size - n || 1);
};
/* words that name WHICH item (valve, side, train, turbine section, contact kind): a pair is refused when one name has such a word the other lacks */
const KEY = new Set([
  'MSV',
  'CV',
  'CRV',
  'RSV',
  'ICV',
  'HP',
  'LP',
  'IP',
  'A',
  'B',
  'C',
  'D',
  '1',
  '2',
  '3',
  'TORQUE',
  'MAX',
  'MIN',
  'OVER',
  'UNDER',
  'OPEN',
  'CLOSE',
  'ON',
  'OFF',
  'START',
  'STOP'
]);
const keyOk = (A, B) => {
  for (const w of A) if (KEY.has(w) && !B.has(w)) return false;
  for (const w of B) if (KEY.has(w) && !A.has(w)) return false;
  return true;
};
const ctlOk = (r, x) => {
  const c = (x.ctl || '').toUpperCase();
  return r.ctl === 'COM' ? /COM/.test(c) : c.includes(r.ctl);
};
const kindOk = (r, x) => {
  const k = r.kind.replace(/^SERVO-.*/, 'SERVO'),
    q = x.k || '';
  return q === k || (k === 'SERVO' && /SERVO|LVDT/.test(q)) || (k === 'AI' && q === 'LVDT');
};
if (xsmm) {
  /* every pair of a used table row and an XSMM row of the same controller and kind, best first; a pair is taken when both are still free.
     The instrument number decides first (score 2), then the words (Jaccard >= 0.6, the KEY words equal) */
  const pairs = [];
  rows.forEach((r, ri) => {
    if (r.spare) return;
    const A = words(r.name);
    xsmm.rows.forEach((x, xi) => {
      if (!ctlOk(r, x) || !kindOk(r, x)) return;
      const B = words(x.d);
      const sc = r.ins && x.tag && norm(unitTag(x.tag)) === norm(unitTag(r.ins)) ? 2 : keyOk(A, B) ? sim(A, B) : 0;
      if (sc >= 0.6) pairs.push([sc, ri, xi]);
    });
  });
  pairs.sort((a, b) => b[0] - a[0] || a[1] - b[1] || a[2] - b[2]);
  const ur = new Set(),
    ux = new Set();
  for (const [sc, ri, xi] of pairs) {
    if (ur.has(ri) || ux.has(xi)) continue;
    ur.add(ri);
    ux.add(xi);
    const r = rows[ri],
      x = xsmm.rows[xi];
    r.x = xi;
    if (sc < 2) r.xs = Math.round(sc * 100) / 100;
    if (x.tag && x.tag !== '-') r.tag = unitTag(x.tag);
    if (x.fr) r.from = x.fr;
    if (x.dcs) r.dcsSh = x.dcs;
    if (x.ibd) r.ibd = x.ibd;
  }
}
const doc = {
  about:
    'TCS I/O list of LMYP Unit 1 (lane 2 TCS IO). rows = the PI/O tables TCE9xx / TCA9xx of the soft logic set (331DM09784 / 09788, typed from the drawing), one per card channel; pin = the logic sheet(s) printing the reference of the row (or, on the builder sheets, the box with its name); spareBox = PI/O boxes the sheets draw as SPARE; tag / from / dcsSh / ibd = the matched row of XSMM_IO_List_R1.xlsx "IO LIST R.1 (3)" (iolist-tcs.zip). Made by tools/data/tcs_io.mjs. The model or HMI end of each row is in src/digital/tce-io.js.',
  rows,
  spareBox,
  xsmm
};
const txt =
  JSON.stringify(doc, null, 0)
    .replace(/\},\{"id"/g, '},\n{"id"')
    .replace(/\},\{"tag"/g, '},\n{"tag"') + '\n';
if (process.argv.includes('--check')) {
  const old = fs.existsSync(out) ? fs.readFileSync(out, 'utf8') : '';
  if (old !== txt) {
    console.error('src/data/tcs-io.json is not the list of the table sheets: run node tools/data/tcs_io.mjs');
    process.exit(1);
  }
} else fs.writeFileSync(out, txt);
const live = rows.filter(r => !r.spare);
console.log(
  'tables',
  new Set(rows.map(r => r.tab)).size,
  'rows',
  rows.length,
  'used',
  live.length,
  'with sheet pin',
  live.filter(r => r.pin).length,
  'with XSMM row',
  live.filter(r => r.x != null).length
);
