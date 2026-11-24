/* QA TRACE (lane 8, content-first push 2026-11-25): for every address of the DCS I/O list and memory list, station by station, the chain
   field signal -> I/O point -> logic sheet (ABC / DITL, every machine copy) -> plant model / HMI, read from the RUNNING app (the one
   world, headless, tools/trace/world.cjs), and every break in it:
     B1 an input on a logic sheet that nothing writes (no link, no DITL, no plant model, no operator) during the run;
     B2 an I/O input point (DI / AI / PI) on no sheet and not given by the plant model;
     B3 an HMI faceplate tag with no controller on any sheet;
     B4 an ALM block with no set point (no limit on the block and none in the defaults of its source).
   The same rows as the content inventory of the scoreboard, so every lane's "before / after" comes from one tool.
   Usage:
     node tools/trace/trace.cjs [--start 150|cold] [--mins 10] [--out <dir>]      the full trace (rows + summary)
     node tools/trace/trace.cjs --tag LT-BR1001-1 [--tag M.0129 --stn 1]            the chain of one tag / address (after the same run)
   Output (--out, default <os tmp>/qa-trace): trace-io.csv, trace-mem.csv, trace-abc-inputs.csv, trace-ditl-inputs.csv, trace.json,
   summary.md. The summary also prints to the console. Exit 0 always (it is a count, not a gate; tests/lanes/qa holds the gates). */
const fs = require('fs'),
  path = require('path'),
  os = require('os');
const { load, gz, root } = require('./world.cjs');
const arg = (k, d) => {
  const i = process.argv.indexOf('--' + k);
  return i > 0 ? process.argv[i + 1] : d;
};
const args = k => process.argv.flatMap((a, i) => (a === '--' + k ? [process.argv[i + 1]] : []));
const START = arg('start', '150'),
  MINS = +arg('mins', 10),
  OUT = arg('out', path.join(os.tmpdir(), 'qa-trace')),
  TAGS = args('tag'),
  STN = arg('stn', null);
/* excluded by the user 2026-11-25 00:52 PHT: WTP, coal handling, air compressors (and their dryers); unlimited supply at the boundary */
const EXCL = /compressor|air dryer|\bdryer\b|water treatment|\bWTP\b|coal handling|coal yard|stacker|reclaimer/i;
const OPER = /^COS manual|\.(MAN|LOC|REM|AUT|CAS)$|manual SV|\bSV\b|setup|SET ?UP/i;
const strip = t =>
  String(t || '')
    .replace(/^S\d\s*/, '')
    .trim();
const refStn = t => {
  const m = /^S(\d)\s/.exec(String(t || '').trim());
  return m ? +m[1] : null;
};
/* the text of the code that is not data (the plant model, the world, the pages): a tag named there is used there */
function codeText(dirs, skip) {
  const out = [];
  const walk = d => {
    for (const f of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, f.name);
      if (skip.some(r => r.test(p))) continue;
      if (f.isDirectory()) walk(p);
      else if (/\.(js|cjs|mjs|html|json)$/.test(f.name)) out.push(fs.readFileSync(p, 'utf8'));
    }
  };
  for (const d of dirs) if (fs.existsSync(d)) walk(d);
  return out.join('\n');
}
const has = (txt, tag) => {
  if (!tag) return false;
  let i = txt.indexOf(tag);
  while (i >= 0) {
    const a = txt[i - 1],
      b = txt[i + tag.length];
    if (!(a && /[A-Za-z0-9_-]/.test(a)) && !(b && /[A-Za-z0-9_]/.test(b))) return true;
    i = txt.indexOf(tag, i + 1);
  }
  return false;
};
(async () => {
  const t0 = Date.now();
  const E = load();
  const { AN, DITL, WORLD, ADES } = E;
  await E.start(START);
  const tLoad = Date.now() - t0;
  /* ---- hooks: every write into an ABC input (rt.ext) during the run is counted; the object stays the same (the compiled step keeps it) */
  const W = new Map(); /* S -> Map(n -> writes) */
  for (const sh of AN.sheets) {
    const S = sh.S;
    if (!S || !S.rt) continue;
    const m = new Map();
    W.set(S, m);
    const ext = S.rt.ext;
    for (const n of S.ext) {
      let v = ext[n];
      Object.defineProperty(ext, n, {
        get: () => v,
        set: x => {
          m.set(n, (m.get(n) || 0) + 1);
          v = x;
        },
        enumerable: true,
        configurable: true
      });
    }
  }
  /* ---- the run, sampled: ABC net values and DITL input rows */
  const allD = () => DITL.S.sheets.concat(WORLD.inst || []);
  const abcMM = new Map(),
    dMM = new Map();
  const sample = () => {
    for (const sh of AN.sheets) {
      const S = sh.S;
      if (!S || !S.rt) continue;
      let a = abcMM.get(S);
      if (!a) abcMM.set(S, (a = S.nets.map(() => [Infinity, -Infinity])));
      const v = S.rt.v;
      for (let n = 0; n < a.length; n++) {
        const x = +v[n];
        if (!isFinite(x)) continue;
        if (x < a[n][0]) a[n][0] = x;
        if (x > a[n][1]) a[n][1] = x;
      }
    }
    for (const s of allD()) {
      if (!s.nl || !s.nl._v) continue;
      let a = dMM.get(s);
      if (!a) dMM.set(s, (a = new Map()));
      for (const q of s.nl.src || []) {
        const x = s.nl._v[q.n] ? 1 : 0,
          o = a.get(q.row) || [x, x];
        o[0] = Math.min(o[0], x);
        o[1] = Math.max(o[1], x);
        a.set(q.row, o);
      }
    }
  };
  const steps = Math.round((MINS * 60) / 0.5),
    every = 20;
  sample();
  for (let k = 0; k < steps; k += every) {
    E.step(Math.min(every, steps - k));
    sample();
  }
  const U = AN.unit || {};
  const tRun = Date.now() - t0 - tLoad;
  /* ---- code text: plant model + world (engine side), pages (HMI side) */
  const engTxt = codeText(
    [path.join(root, 'src', 'analog', 'engine'), path.join(root, 'src', 'world')],
    [/[\\/]data[\\/]/]
  );
  const hmiTxt = codeText(
    [path.join(root, 'src', 'ui'), path.join(root, 'src', 'station'), path.join(root, 'src', 'analog', 'ui')],
    [/wiring\.js$/, /mock/i, /[\\/]uat[\\/]/, /[\\/]training[\\/]/]
  );
  /* ---- ABC catalog: every named net of every sheet, its station, its role and its source */
  const abc = [],
    abcByKey = new Map(),
    abcTag = new Map();
  const ctrlTags = new Set();
  for (const sh of AN.sheets) {
    if (/^ABC-000/.test(sh.name)) continue;
    const S = sh.S;
    if (!S) continue;
    const stn = sh.stn,
      mm = abcMM.get(S) || [],
      wr = W.get(S) || new Map();
    for (const c of AN.hmiCtrls(S) || []) if (c.tag) ctrlTags.add(c.tag);
    for (const a of S.addr || []) {
      const k = String(a.t || '').trim();
      if (k) (abcTag.get(k) || abcTag.set(k, []).get(k)).push({ sh: sh.name, stn, n: a.n, how: a.how });
    }
    for (let n = 0; n < S.nets.length; n++) {
      const raw = AN.nm(S, n);
      if (!raw) continue;
      const name = strip(raw),
        rs = refStn(raw) || stn,
        isIn = S.ext.includes(n),
        drv = !!(S.drv[n] && S.drv[n].some(d => d.k !== 'LINK')),
        lk = S.xlk && S.xlk[n],
        w = wr.get(n) || 0,
        mv = mm[n] && isFinite(mm[n][0]) && mm[n][1] - mm[n][0] > 1e-9;
      let src = drv
        ? 'logic'
        : isIn
          ? lk
            ? lk.ditl
              ? 'DITL'
              : 'link'
            : w > 0
              ? 'engine'
              : OPER.test(name)
                ? 'operator'
                : 'NONE'
          : lk
            ? lk.ditl
              ? 'DITL'
              : 'link'
            : 'wire';
      const r = {
        sh: sh.name,
        stn: rs,
        name,
        n,
        role: drv ? 'out' : isIn ? 'in' : 'mid',
        src,
        writes: w,
        moving: !!mv,
        lo: mm[n] ? mm[n][0] : null,
        hi: mm[n] ? mm[n][1] : null
      };
      abc.push(r);
      const key = rs + ':' + name;
      (abcByKey.get(key) || abcByKey.set(key, []).get(key)).push(r);
      if (!/^[A-Z]{1,2}\.?[0-9A-F]{4,}$/.test(name))
        (
          abcByKey.get('T:' + name.replace(/\.\w+$/, '')) ||
          abcByKey.set('T:' + name.replace(/\.\w+$/, ''), []).get('T:' + name.replace(/\.\w+$/, ''))
        ).push(r);
    }
  }
  /* ---- DITL catalog: every row of every sheet and machine copy, its station (title block "STATION 10x"), address, tag, source */
  const din = (WORLD.idx && WORLD.idx.din) || new Map();
  const psw = new Map();
  for (const p of WORLD.plantSw ? WORLD.plantSw() : []) psw.set(p.sheet + '|' + p.row, p.tag);
  /* the station of a DITL drawing: its title block ("STATION 10x"), else the vote of the I/O tags written on it (a tag is one signal of
     one station, DCS_KNOWLEDGE 1); sheets with no tag of the I/O list stay unknown (their addresses count as "station unsure") */
  const tagStn = new Map();
  for (const st of Object.keys(ADES))
    for (const o of Object.values(ADES[st])) if (o.k === 'io' && o.tag) tagStn.set(String(o.tag).trim(), +st);
  const stnOfD = s => {
    const b = (s._inst && s._inst.base) || s;
    if (b._qaStn !== undefined) return b._qaStn;
    const t =
      (b.tx || []).map(x => x.t).join(' ') +
      ' ' +
      Object.values(b.cells || {})
        .flat()
        .map(x => x.t)
        .join(' ');
    const m = /STATION\s*10([1-5])/.exec(t);
    if (m) return (b._qaStn = +m[1]);
    const v = {};
    for (const w of t.match(/[A-Z0-9][A-Z0-9-]{3,}[A-Z0-9]/g) || []) {
      const k = tagStn.get(w);
      if (k) v[k] = (v[k] || 0) + 1;
    }
    const e = Object.entries(v).sort((a, c) => c[1] - a[1]);
    return (b._qaStn = e.length ? +e[0][0] : null);
  };
  /* an address list of machines A / B / C / D written short: "I.0047/367", "O.0080/400", "O.0088/408 O.0728/1048" */
  const ADL = /\b([IOMB])\.([0-9A-F]{4})((?:\s*\/\s*(?:[IOMB]\.)?[0-9A-F]{2,4}(?![0-9A-F]))*)/g;
  const adrList = (t, first) => {
    const o = [];
    for (const m of String(t || '').matchAll(ADL)) {
      o.push(m[1] + '.' + m[2]);
      if (first) continue;
      for (const q of (m[3] || '').split('/').slice(1)) {
        const z = q.trim().replace(/^[IOMB]\./, '');
        o.push(m[1] + '.' + (m[2].slice(0, 4 - z.length) + z));
      }
    }
    return o;
  };
  const cellT = (s, i, col) => {
    const b = (s._inst && s._inst.base) || s,
      r = b.rows[i];
    const t = r ? (b.cells[r.n + ':' + col] || []).map(x => x.t).join(' ') : '';
    return s._inst && WORLD.showText ? WORLD.showText(s, t) : t;
  };
  const ditl = [],
    dByKey = new Map();
  for (const s of allD()) {
    const b = (s._inst && s._inst.base) || s;
    if (!b.rows || !b.cells) continue;
    const stn = stnOfD(s),
      mm = dMM.get(s) || new Map(),
      srcRows = new Set((s.nl && s.nl.src ? s.nl.src : []).map(q => q.row)),
      outRows = new Set((s.nl && s.nl.outs ? s.nl.outs : []).map(q => q.row)),
      dm = din.get(s);
    /* the addresses written as free text on the drawing (the right column of the outputs, the short machine lists): to the row of
       the same height, else to the sheet (row 0, "on the drawing, not on a row") */
    const txA = new Map();
    /* a drawing for machines A / B / C / D has a copy per machine (W.inst): the drawing itself is machine A, its short list gives A only */
    const multi = !s._inst && ((WORLD.instOf && WORLD.instOf.get(s)) || []).length > 1;
    const rs0 = b.rng && b.rng.RS ? b.rng.RS[0] : Infinity;
    for (const x of b.tx || []) {
      const tt = s._inst && WORLD.showText ? WORLD.showText(s, x.t) : x.t;
      const la = adrList(tt, multi);
      if (!la.length) continue;
      const y = x.iy != null ? x.iy : x.y;
      let ri = -1,
        bd = 5;
      b.rows.forEach((r, i) => {
        const d = Math.abs(r.y - y);
        if (d < bd) {
          bd = d;
          ri = i;
        }
      });
      const k = ri + ':' + (x.x >= rs0 ? 'R' : 'L');
      txA.set(k, (txA.get(k) || []).concat(la));
    }
    for (const [k, la] of txA)
      if (k.startsWith('-1:')) {
        const row = {
          sh: s.name,
          stn,
          row: 0,
          io: '-',
          adr: [...new Set(la)].join(' '),
          tags: '',
          loc: '',
          from: '',
          text: '(address on the drawing, not on a row)',
          src: '-',
          moving: false
        };
        ditl.push(row);
        for (const a of new Set(la)) {
          const kk = (stn || '?') + ':' + a;
          (dByKey.get(kk) || dByKey.set(kk, []).get(kk)).push(row);
        }
      }
    b.rows.forEach((r, i) => {
      const T = cellT(s, i, 'T'),
        Sx = cellT(s, i, 'S'),
        F = cellT(s, i, 'F'),
        L = cellT(s, i, 'L'),
        RT = cellT(s, i, 'RT'),
        RS = cellT(s, i, 'RS');
      let ad = null;
      try {
        ad = WORLD.addrK ? WORLD.addrK(s, i) : null;
      } catch (e) {}
      const adrs = new Set();
      if (ad) adrs.add(ad);
      for (const t of [T, Sx, RT, RS, F]) for (const a of adrList(t, multi)) adrs.add(a);
      for (const a of (txA.get(i + ':L') || []).concat(txA.get(i + ':R') || [])) adrs.add(a);
      const tags = String(T + ' ' + RT).match(/\b[A-Z]{1,6}\d?-[A-Z]{1,3}\d{3,4}[A-Z0-9-]*\b/g) || [];
      const isIn = srcRows.has(r.n),
        isOut = outRows.has(r.n) || (txA.has(i + ':R') && !srcRows.has(r.n));
      if (!isIn && !isOut && !adrs.size && !tags.length) return;
      const mv = mm.get(r.n);
      let src = '-';
      if (isIn) {
        const ln = dm && dm.get(i);
        const an = s.nl && (s.nl.an || []).find(a => a.row === r.n || a.row === i);
        src =
          ln && ln.length
            ? 'link'
            : psw.has(s.name + '|' + r.n) || psw.has(s.name + '|' + (i + 1))
              ? 'plant switch'
              : an && s.avw && s.avw[an.key] != null
                ? 'plant value'
                : /^(CRT|OPS|OPC|HMI|CRT\s*\(.*\))$/i.test(L.trim())
                  ? 'operator'
                  : /^(LOP|LCP|LP|LCS|MCC|SWGR|VCB|LOCAL)/i.test(L.trim())
                    ? 'local panel'
                    : mv && mv[1] !== mv[0]
                      ? 'moves (own model)'
                      : F.trim()
                        ? 'NONE (FROM not linked)'
                        : 'NONE';
      }
      const row = {
        sh: s.name,
        stn,
        row: r.n,
        io: isIn ? 'in' : isOut ? 'out' : '-',
        adr: [...adrs].join(' '),
        tags: [...new Set(tags)].join(' '),
        loc: L.trim(),
        from: F.trim(),
        text: (Sx || RS).replace(/\s+/g, ' ').trim(),
        src,
        moving: !!(mv && mv[1] !== mv[0])
      };
      ditl.push(row);
      for (const a of adrs) {
        const k = (stn || '?') + ':' + a;
        (dByKey.get(k) || dByKey.set(k, []).get(k)).push(row);
      }
      for (const t of row.tags.split(' ').filter(Boolean))
        (dByKey.get('T:' + t) || dByKey.set('T:' + t, []).get('T:' + t)).push(row);
    });
  }
  /* every word written on any sheet (ABC text, DITL text and cells), and the devices of the typical-drawing copies (W.inst "#MV-BD1002") */
  const sheetTxt = new Set();
  const words = t => {
    for (const w of String(t || '').match(/[A-Z0-9][A-Z0-9.-]*[A-Z0-9]/g) || []) sheetTxt.add(w);
  };
  for (const sh of AN.sheets) for (const x of (sh.S && sh.S.tx) || []) words(x.t);
  for (const s of DITL.S.sheets) {
    for (const x of s.tx || []) words(x.t);
    for (const v of Object.values(s.cells || {})) for (const x of v) words(x.t);
  }
  const devInst = new Set();
  for (const s of WORLD.inst || []) {
    const m = / #([A-Z]{1,3}-?[A-Z]*\d[A-Z0-9-]*)$/.exec(s.name);
    if (m && m[1].length > 2) devInst.add(m[1].replace(/^[A-Z]{1,3}-(?=[A-Z])/, ''));
  }
  /* B5: a machine copy that reads another machine's address. The drawing for machines A / B / C / D writes a short list ("O.0093/413")
     and the I/O list gives machine C / D their own address (O.0733 / O.1053): when copy #C shows O.0413 (machine B's), that row is wrong.
     A signal common to every machine (one address, no machine in its I/O name: I.0560 MFT, M.3339 furnace temperature) is NOT a clash */
  const baseHasCopies = new Set((WORLD.inst || []).map(x => x.name.replace(/ #.*$/, '')));
  const machOfRow = r => {
    const m = / #([A-D])$/.exec(r.sh);
    return m ? m[1] : baseHasCopies.has(r.sh) ? 'A' : null;
  };
  const machOfIo = (tag, d) => {
    const m =
      /[- ]([A-D])\b(?![.-]?\d{3})/.exec(String(d || '')) || /-([A-D])\d?$/.exec(tag) || /\d([A-D])\d?$/.exec(tag);
    return m ? m[1] : null;
  };
  const clashList = [];
  let clashRows = 0;
  /* ---- I/O and memory points */
  const IO = [],
    MEM = [];
  for (const st of Object.keys(ADES)) {
    for (const [key, o] of Object.entries(ADES[st])) {
      const stn = +st;
      if (o.k === 'io') {
        const tag = String(o.tag || '').trim();
        if (!tag || /^spare$/i.test(tag)) continue;
        const ty = String(o.t || '').replace(/[-(].*$/, ''),
          input = /^(DI|AI|PI)$/.test(ty);
        const aOn = (abcByKey.get(stn + ':' + key) || []).concat(
          abcTag.get(tag)
            ? abcTag
                .get(tag)
                .map(x => ({ sh: x.sh, stn: x.stn, name: tag, src: 'transmitter', role: 'in', moving: true }))
            : []
        );
        const dOn = (dByKey.get(stn + ':' + key) || []).concat(dByKey.get('T:' + tag) || []);
        const dAny = dOn.length ? [] : dByKey.get('?:' + key) || [];
        const M = machOfIo(tag, o.d),
          wrongM = x => {
            const L = M && machOfRow(x);
            if (!(L && L !== M)) return false;
            /* a row that names the other machine is a real cross reference (pump B's logic reads "PUMP A RUNNING") */
            return !new RegExp('(^|[^A-Z0-9])' + M + '([^A-Z0-9]|$)|[0-9]' + M + '\\b').test(x.text + ' ' + x.tags);
          };
        const dOk = dOn.filter(x => !wrongM(x)),
          bad = dOn.filter(wrongM);
        const clashed = bad.length > 0;
        if (clashed) {
          clashRows += bad.length;
          clashList.push(
            'S' +
              stn +
              ' ' +
              key +
              ' ' +
              tag +
              ' (machine ' +
              M +
              ') also on ' +
              bad.map(x => x.sh + ' row ' + x.row).join(', ')
          );
        }
        const onLogic = aOn.length + dOk.length > 0;
        const model = has(engTxt, tag),
          hmi = has(hmiTxt, tag);
        const srcOk =
          aOn.some(x => x.src !== 'NONE') || dOk.some(x => x.row > 0 && (x.io !== 'in' || !/^NONE/.test(x.src)));
        /* on the drawing but not on a net or a row: the tag written on a sheet, or the device of a typical-drawing table copy
           (DITL-38 "#MV-BD1002": the valve runs from DITL-50 by its tag, its I/O addresses are not on any row) */
        const dev = tag.replace(/^[A-Z0-9]{1,6}-/, '').replace(/-\d$/, '');
        const txtOn =
          !onLogic && (sheetTxt.has(tag) || devInst.has(dev) || devInst.has(dev.replace(/^([A-Z]+)(\d)/, '$1-$2')));
        const live = aOn.some(x => x.moving) || dOn.some(x => x.moving);
        const ex = EXCL.test(o.d || '') || EXCL.test(tag);
        let st8 =
          onLogic && !srcOk && clashed
            ? 'COPY ADDRESS CLASH'
            : onLogic
              ? srcOk
                ? 'LINKED'
                : 'ON SHEET, NO SOURCE'
              : txtOn
                ? 'ON DRAWING, NOT ON A ROW'
                : dAny.length
                  ? 'ON SHEET, STATION UNSURE'
                  : model || hmi
                    ? 'MODEL / HMI ONLY'
                    : 'UNLINKED';
        IO.push({
          stn,
          key,
          tag,
          type: o.t,
          desc: o.d,
          status: st8,
          excluded: ex,
          abc: [...new Set(aOn.map(x => x.sh))].join(' '),
          ditl: [...new Set(dOn.concat(dAny).map(x => x.sh))].join(' '),
          model,
          hmi,
          live,
          input
        });
      } else {
        const d = String(o.d || '').trim();
        if (!d || /^(spare|-)$/i.test(d)) continue;
        const pre = key[0];
        const aOn = abcByKey.get(stn + ':' + key) || [],
          dOn = dByKey.get(stn + ':' + key) || [];
        const used = aOn.length + dOn.length > 0;
        const noSrc =
          aOn.length && aOn.every(x => x.role === 'in' && x.src === 'NONE') && !dOn.some(x => x.io === 'out');
        MEM.push({
          stn,
          key,
          pre,
          desc: d,
          rem: o.r || '',
          status: used ? (noSrc ? 'ON SHEET, NO SOURCE' : 'ON SHEET') : 'NOT ON ANY SHEET',
          abc: [...new Set(aOn.map(x => x.sh))].join(' '),
          ditl: [...new Set(dOn.map(x => x.sh))].join(' ')
        });
      }
    }
  }
  /* ---- breaks */
  const B1abc = abc.filter(x => x.role === 'in' && x.src === 'NONE');
  const B1ditl = ditl.filter(x => x.io === 'in' && /^NONE/.test(x.src));
  const B2 = IO.filter(
    x => x.input && !x.excluded && (x.status === 'UNLINKED' || x.status === 'ON SHEET, STATION UNSURE')
  );
  const faceT = AN.faceTags ? AN.faceTags() : [];
  const B3 = faceT.filter(t => !ctrlTags.has(t) && !abcByKey.has('T:' + t));
  const alm = [];
  for (const sh of AN.sheets)
    for (const b of (sh.S && sh.S.blk) || [])
      if (b.k === 'ALM')
        alm.push({ sh: sh.name, tag: (b.txt || [])[1] || '', p: b.p || {}, src: b.dflt ? 'defaults' : 'block' });
  const B4 = alm.filter(a => a.p.hh == null && a.p.h == null && a.p.l == null && a.p.ll == null);
  /* ---- F(X): named patterns of the LINEAR data and the FX blocks of the sheets that resolve to one */
  const lt = AN.lnTables ? AN.lnTables() : [];
  const fxUsed = new Set();
  let fxBlk = 0,
    fxUn = [];
  for (const sh of AN.sheets)
    for (const b of (sh.S && sh.S.blk) || [])
      if (b.k === 'FX') {
        fxBlk++;
        let r = {};
        try {
          r = AN.lnResolve(sh.name, b.p && b.p.ln, sh.stn) || {};
        } catch (e) {}
        const t = r.t || r.tab || r.table;
        if (t && t.key) fxUsed.add(t.key);
        else if (b.p && b.p.ln) {
          const m = /LN(\d+)/i.exec(b.p.ln),
            k = 'S' + sh.stn + '-LN' + (m ? +m[1] : '?');
          if (lt.some(q => q.key === k)) fxUsed.add(k);
          else fxUn.push(sh.name + ' ' + b.p.ln);
        } else fxUn.push(sh.name + ' FX #' + b.id + ' (no LN)');
      }
  const PTN = [];
  for (const st of Object.keys(ADES))
    for (const [k, o] of Object.entries(ADES[st])) if (/^PTN/.test(k) && (o.d || '').trim()) PTN.push(st + ':' + k);
  /* ---- TCS */
  const tceDir = path.join(root, 'src', 'digital', 'tce');
  const tceF = fs.existsSync(tceDir) ? fs.readdirSync(tceDir) : [];
  const nTCE = tceF.filter(f => /^TCE\d/.test(f)).length,
    nTCA = tceF.filter(f => /^TCA\d/.test(f)).length,
    nG = tceF.filter(f => /^G-/.test(f)).length;
  const tceRunning =
    typeof E.js('typeof TCE_RUN') === 'string' && E.js('typeof TCE_RUN') !== 'undefined'
      ? E.js('(TCE_RUN.sheets||[]).length')
      : 0;
  let ibd = 0,
    ibdMiss = 0;
  try {
    ibd = AN.tcsIbdSheets().length;
    ibdMiss = AN.tcsIbdMissing().length;
  } catch (e) {}
  const tcsIO = fs.existsSync(path.join(root, 'src', 'data', 'tcs-io.json'));
  const alDir = path.join(root, 'src', 'data', 'alarms');
  const alList = fs.existsSync(alDir)
    ? fs
        .readdirSync(alDir)
        .filter(f => /\.json$/.test(f))
        .flatMap(f => JSON.parse(fs.readFileSync(path.join(alDir, f), 'utf8')))
    : null;
  /* ---- counts, the scoreboard rows */
  const cnt = (a, f) => a.filter(f).length;
  const ioIn = IO.filter(x => !x.excluded);
  const byStatus = s => cnt(ioIn, x => x.status === s);
  const abcSheets = AN.sheets.filter(s => !/^ABC-000/.test(s.name)).length;
  const dBase = DITL.S.sheets.filter(s => !/DITL-0[A-D]$/.test(s.name));
  const C = {
    run: {
      start: START,
      plantMin: MINS,
      MW: +(+U.MW).toFixed(1),
      Pms: +(+U.Pms).toFixed(1),
      trip: (AN.tceRead && AN.tceRead().trip) || 0,
      loadS: Math.round(tLoad / 1000),
      runS: Math.round(tRun / 1000)
    },
    sheets: {
      abc: abcSheets,
      ditl: dBase.length,
      ditlCopies: (WORLD.inst || []).length,
      ditlRunning: cnt(dBase, s => s.nl && s.nl._v)
    },
    io: {
      total: IO.length,
      excluded: IO.length - ioIn.length,
      linked: byStatus('LINKED'),
      noSource: byStatus('ON SHEET, NO SOURCE'),
      modelHmiOnly: byStatus('MODEL / HMI ONLY'),
      stationUnsure: byStatus('ON SHEET, STATION UNSURE'),
      onDrawing: byStatus('ON DRAWING, NOT ON A ROW'),
      copyClash: byStatus('COPY ADDRESS CLASH'),
      clashRows,
      clashPoints: clashList.length,
      unlinked: byStatus('UNLINKED'),
      moving: cnt(ioIn, x => x.live)
    },
    mem: {
      named: MEM.length,
      onSheet: cnt(MEM, x => x.status !== 'NOT ON ANY SHEET'),
      noSource: cnt(MEM, x => x.status === 'ON SHEET, NO SOURCE'),
      byPre: Object.fromEntries(
        ['M', 'B', 'S', 'T', 'D', 'P'].map(p => [
          p,
          cnt(MEM, x => x.pre === p && x.status !== 'NOT ON ANY SHEET') + ' / ' + cnt(MEM, x => x.pre === p)
        ])
      )
    },
    breaks: {
      B1_abcInputNoSource: B1abc.length,
      B1_ditlInputNoSource: B1ditl.length,
      B2_ioInputNowhere: B2.length,
      B3_faceplateNoController: B3.length,
      B4_alarmNoSetPoint: B4.length
    },
    alarms: {
      almBlocks: alm.length,
      withSetPoint: alm.length - B4.length,
      plantList: alList ? alList.length : 'not in the app yet (src/data/alarms/, lane 5)'
    },
    fx: {
      patternsNamed: PTN.length,
      tablesInApp: lt.length,
      fxBlocks: fxBlk,
      tablesUsed: fxUsed.size,
      fxUnresolved: fxUn.length
    },
    tcs: {
      tce: nTCE,
      tca: nTCA,
      gSheets: nG,
      tceTcaRunning: tceRunning,
      ibd,
      ibdMissing: ibdMiss,
      tcsIoList: tcsIO ? 'in app' : 'not in the app yet (src/data/tcs-io.json, lane 2)'
    },
    hmi: { faceplateTags: faceT.length, faceplateBound: faceT.length - B3.length, ioOnPages: cnt(ioIn, x => x.hmi) }
  };
  /* ---- output */
  fs.mkdirSync(OUT, { recursive: true });
  const csv = (rows, cols) =>
    [cols.join(',')]
      .concat(rows.map(r => cols.map(c => JSON.stringify(r[c] == null ? '' : String(r[c]))).join(',')))
      .join('\n') + '\n';
  fs.writeFileSync(
    path.join(OUT, 'trace-io.csv'),
    csv(IO, ['stn', 'key', 'tag', 'type', 'status', 'excluded', 'live', 'model', 'hmi', 'abc', 'ditl', 'desc'])
  );
  fs.writeFileSync(path.join(OUT, 'trace-mem.csv'), csv(MEM, ['stn', 'key', 'status', 'abc', 'ditl', 'desc', 'rem']));
  fs.writeFileSync(
    path.join(OUT, 'trace-abc-inputs.csv'),
    csv(
      abc.filter(x => x.role === 'in'),
      ['sh', 'stn', 'name', 'src', 'writes', 'moving', 'lo', 'hi']
    )
  );
  fs.writeFileSync(
    path.join(OUT, 'trace-ditl-inputs.csv'),
    csv(
      ditl.filter(x => x.io === 'in'),
      ['sh', 'stn', 'row', 'adr', 'tags', 'loc', 'from', 'src', 'moving', 'text']
    )
  );
  fs.writeFileSync(
    path.join(OUT, 'trace.json'),
    JSON.stringify(
      {
        counts: C,
        B1abc: B1abc.map(x => x.sh + ' ' + x.name),
        B1ditl: B1ditl.map(x => x.sh + ' r' + x.row + ' ' + x.text + (x.from ? ' FROM ' + x.from : '')),
        B2: B2.map(x => 'S' + x.stn + ' ' + x.key + ' ' + x.tag),
        B3,
        B4: B4.map(a => a.sh + ' ' + a.tag),
        B5copyClash: clashList,
        fxUnresolved: fxUn
      },
      null,
      1
    )
  );
  const L = [];
  L.push(
    '# QA trace ' +
      new Date().toISOString().slice(0, 16) +
      ' UTC, start ' +
      START +
      ', ' +
      MINS +
      ' plant min (MW ' +
      C.run.MW +
      ', trip ' +
      C.run.trip +
      ')'
  );
  L.push('');
  L.push(
    '- Logic sheets: ABC ' +
      C.sheets.abc +
      ', DITL ' +
      C.sheets.ditl +
      ' (+ ' +
      C.sheets.ditlCopies +
      ' machine copies), DITL running ' +
      C.sheets.ditlRunning
  );
  L.push(
    '- DCS I/O with a tag: ' +
      C.io.total +
      ' (excluded systems ' +
      C.io.excluded +
      '). Of the rest: LINKED ' +
      C.io.linked +
      ', on a sheet but no source ' +
      C.io.noSource +
      ', model / HMI only ' +
      C.io.modelHmiOnly +
      ', on the drawing but not on a row ' +
      C.io.onDrawing +
      ", only on another machine's copy " +
      C.io.copyClash +
      ' (B5: ' +
      C.io.clashPoints +
      ' points on ' +
      C.io.clashRows +
      ' wrong copy rows)' +
      ', station unsure ' +
      C.io.stationUnsure +
      ', UNLINKED ' +
      C.io.unlinked +
      '; moving in the run ' +
      C.io.moving
  );
  L.push(
    '- Memory with a name: ' +
      C.mem.named +
      ', on a sheet ' +
      C.mem.onSheet +
      ' (no source ' +
      C.mem.noSource +
      '); by kind ' +
      JSON.stringify(C.mem.byPre)
  );
  L.push(
    '- Breaks: B1 ABC inputs nothing writes ' +
      C.breaks.B1_abcInputNoSource +
      ', B1 DITL input rows with no source ' +
      C.breaks.B1_ditlInputNoSource +
      ', B2 I/O inputs nowhere ' +
      C.breaks.B2_ioInputNowhere +
      ', B3 faceplate tags with no controller ' +
      C.breaks.B3_faceplateNoController +
      ', B4 alarms with no set point ' +
      C.breaks.B4_alarmNoSetPoint
  );
  L.push(
    '- Alarms: ALM blocks ' +
      C.alarms.almBlocks +
      ' (with set point ' +
      C.alarms.withSetPoint +
      '); plant alarm list: ' +
      C.alarms.plantList
  );
  L.push(
    '- F(X): named patterns ' +
      C.fx.patternsNamed +
      ', tables in app ' +
      C.fx.tablesInApp +
      ', FX blocks ' +
      C.fx.fxBlocks +
      ' using ' +
      C.fx.tablesUsed +
      ' tables, unresolved ' +
      C.fx.fxUnresolved
  );
  L.push(
    '- TCS: TCE ' +
      C.tcs.tce +
      ' + TCA ' +
      C.tcs.tca +
      ', G ' +
      C.tcs.gSheets +
      ', running as logic ' +
      C.tcs.tceTcaRunning +
      '; IBD ' +
      C.tcs.ibd +
      ' (missing ' +
      C.tcs.ibdMissing +
      '); TCS I/O list: ' +
      C.tcs.tcsIoList
  );
  L.push(
    '- HMI: faceplate tags ' +
      C.hmi.faceplateTags +
      ', bound to a sheet controller ' +
      C.hmi.faceplateBound +
      '; I/O tags named on pages ' +
      C.hmi.ioOnPages
  );
  L.push('- Time: load ' + C.run.loadS + ' s, run ' + C.run.runS + ' s');
  fs.writeFileSync(path.join(OUT, 'summary.md'), L.join('\n') + '\n');
  console.log(L.join('\n'));
  console.log('rows: ' + OUT);
  /* ---- one tag: its chain */
  for (const q of TAGS) {
    const io = IO.filter(x => (x.tag === q || x.key === q) && (!STN || x.stn === +STN)),
      me = MEM.filter(x => x.key === q && (!STN || x.stn === +STN));
    console.log('\n== ' + q);
    for (const x of io) {
      console.log(
        'I/O S' +
          x.stn +
          ' ' +
          x.key +
          ' ' +
          x.tag +
          ' (' +
          x.type +
          ') ' +
          x.desc +
          ' -> ' +
          x.status +
          (x.excluded ? ' [excluded system]' : '')
      );
      for (const r of (abcByKey.get(x.stn + ':' + x.key) || []).concat(abcByKey.get('T:' + x.tag) || []))
        console.log(
          '  ABC ' +
            r.sh +
            ' net ' +
            r.n +
            ' ' +
            r.name +
            ' role ' +
            r.role +
            ' source ' +
            r.src +
            ' writes ' +
            r.writes +
            ' moving ' +
            r.moving +
            ' [' +
            r.lo +
            ' .. ' +
            r.hi +
            ']'
        );
      for (const r of abcTag.get(x.tag) || []) console.log('  ABC ' + r.sh + ' ' + r.how);
      for (const r of (dByKey.get(x.stn + ':' + x.key) || []).concat(dByKey.get('T:' + x.tag) || []))
        console.log(
          '  DITL ' +
            r.sh +
            ' row ' +
            r.row +
            ' ' +
            r.io +
            ' ' +
            r.text +
            ' | from ' +
            (r.from || '-') +
            ' | ' +
            r.loc +
            ' | source ' +
            r.src +
            ' | moving ' +
            r.moving
        );
      console.log('  plant model names it: ' + x.model + ', HMI pages name it: ' + x.hmi);
    }
    for (const x of me) {
      console.log('MEM S' + x.stn + ' ' + x.key + ' ' + x.desc + ' -> ' + x.status);
      for (const r of abcByKey.get(x.stn + ':' + x.key) || [])
        console.log('  ABC ' + r.sh + ' net ' + r.n + ' role ' + r.role + ' source ' + r.src + ' moving ' + r.moving);
      for (const r of dByKey.get(x.stn + ':' + x.key) || [])
        console.log('  DITL ' + r.sh + ' row ' + r.row + ' ' + r.io + ' ' + r.text + ' source ' + r.src);
    }
    if (!io.length && !me.length) console.log('  not in the I/O or memory list' + (STN ? ' of station ' + STN : ''));
  }
  process.exit(0);
})().catch(e => {
  console.error('TRACE ERROR', e && e.stack);
  process.exit(2);
});
