/* 3.2.0-beta.74 OPERATOR POP-OUT FACEPLATE (user 2026-10-30: "mini pop out sya sa bawat equipment. Halimbawa SWP-A, meron syang popout for
   controls and permissive based sa SOP at sa logic"; mockups https://claude.ai/artifact/Xjzj9XgmtT62qqiRF8zRQa v7 and
   https://claude.ai/artifact/9bXtfVRUnDvvMAY8K2LKuv v3). A click on a motor of an HMI page opens its faceplate beside the motor, over the
   graphic (the graphic stays whole): status lamps (RUN red, STOP green, TRIP red blinking), the FIELD selector REMOTE / LOCAL (the field
   operator, logged as such), MODE AUTO / MAN (AUTO closed while LOCAL), DCS START / STOP with EXECUTE / CANCEL, VCB, the current with
   its SOP band and a 10 minute trend, and
   "Logic permissive" (the rows of the motor drawing, live 0 / 1, read from the netlist: LS_OP.interlock), one line on why a button is
   closed, and links (I/O wiring, logic sheet, events). Same pattern for the controllers (plant.js fpOpen: A / M, SV, MV, PV).
   UI only: every action goes through the same calls as the operator API (LS_OP.fieldRow / dsel / dmotor), the plant and the logic are the
   engine's. Nothing is pressed for the operator, nothing is forced. */
(function () {
  /* F6 2026-11-22 (Q6): a text is written only when it changed (a same-value write makes the page lay out again; the faceplates tick at 2 Hz) */
  const setTx = (e, v) => {
    const t = v == null ? '' : String(v);
    if (e && e.textContent !== t) e.textContent = t;
  };
  const E = (t, c, x) => {
    const e = document.createElement(t);
    if (c) e.className = c;
    if (x != null) setTx(e, x);
    return e;
  };
  const D = () => window.LS_OP;
  const call = (f, d) => {
    try {
      const x = f();
      return x == null ? d : x;
    } catch (e) {
      return d;
    }
  };
  const isRun = () =>
    !!(window.AN && ((AN.cat === 'an' && AN.run && !AN.view) || (AN.cat !== 'an' && typeof SIM !== 'undefined' && SIM && !(typeof DPAUSE !== 'undefined' && DPAUSE))));
  /* the motors of the HMI pages register here (their info card tag = the key the page used before for a click) */
  const REG = (window.LS_FPREG = window.LS_FPREG || {});
  /* where the last click was: the pop-out opens beside it */
  let last = null;
  document.addEventListener(
    'pointerdown',
    e => {
      /* live test beta.74 #33: the equipment's own hit area first; a big group (the whole scene of a page) is not the anchor, the
         click point is (the pop-out opened at the top left over the pump and the HAKBANG tag) */
      const c = e.target && e.target.closest ? e.target : null,
        t = c ? c.closest('[data-hit],[data-mdh],[data-fan],[data-dmp],.hx-node') || c.closest('g,rect,text,div') : null;
      let r = t && !t.closest('#fpop') ? t.getBoundingClientRect() : null;
      if (r && (r.width > 220 || r.height > 220)) r = null;
      last = { x: e.clientX, y: e.clientY, r };
    },
    true
  );
  /* live test beta.74 #34 (blank trend): the current of every motor of the HMI pages is sampled every 5 s from the load of the page,
     not only while its faceplate is open (one point drew no line) */
  const hist = (window.LS_FPHIST = window.LS_FPHIST || {});
  function sample(H, v, now) {
    if (H.length && now - H[H.length - 1][0] < 5000) return;
    H.push([now, v == null || !isFinite(+v) ? 0 : +v]);
    while (H.length && now - H[0][0] > 600e3) H.shift();
  }
  setInterval(() => {
    const now = Date.now();
    for (const k in REG) {
      const R = REG[k];
      if (!R || !R.cur || !R.n) continue;
      sample(hist[R.n] || (hist[R.n] = []), call(() => R.cur(), null), now);
    }
  }, 5000);
  const host = () => document.getElementById('plmid') || document.body;
  /* the free area of a pop-out: the Plant view */
  const area = () => {
    const R = host().getBoundingClientRect(),
      a = { left: R.left, top: R.top, right: R.right, bottom: R.bottom };
    /* F3 (real-click test 2026-11-22, 1280 x 800, page scrolled): the page frame reaches past the window, and a faceplate placed in
       the frame reached 69 px below the screen. The free area is the part of the frame the window shows */
    a.left = Math.max(a.left, 0);
    a.top = Math.max(a.top, 0);
    a.right = Math.min(a.right, innerWidth);
    a.bottom = Math.min(a.bottom, innerHeight);
    a.width = a.right - a.left;
    a.height = a.bottom - a.top;
    return a;
  };
  /* beside the clicked equipment: right of it, else left, else below; inside the HMI area */
  /* Mina F13: the faceplate of one equipment opens where it stood before, when it is opened from the same place */
  const POS = {};
  function place(el, r) {
    const key = el.getAttribute('aria-label') || '',
      was = !r && POS[key],
      ar = last && (last.r || { left: last.x, top: last.y });
    if (was && ar && Math.abs(was.ax - ar.left) < 3 && Math.abs(was.ay - ar.top) < 3) {
      el.style.left = was.x;
      el.style.top = was.y;
      el.dataset.side = was.side;
      keepIn(el);
      return;
    }
    placeNew(el, r);
    if (!r && ar) POS[key] = { ax: ar.left, ay: ar.top, x: el.style.left, y: el.style.top, side: el.dataset.side };
  }
  function placeNew(el, r) {
    /* Audit 3 (2026-11-21): a faceplate opened on a page item whose registered element is a whole group (the scene of the page, 1000 px
       and more) had no room left, right, below or above it, and opened over the item clicked (42 items: the sea water valves, the
       compressors, V-CD1026...). A big anchor that holds the point just clicked gives way to that point and its own item */
    if (r && (r.width > 220 || r.height > 220) && last && last.x != null && last.x >= r.left && last.x <= r.right && last.y >= r.top && last.y <= r.bottom) r = null;
    const H = area(),
      w = el.offsetWidth,
      ht = el.offsetHeight,
      a0 = r || (last && (last.r || { left: last.x, right: last.x, top: last.y, bottom: last.y, width: 0, height: 0 })) || { left: H.left + H.width / 2, right: H.left + H.width / 2, top: H.top + 40, bottom: H.top + 40 },
      a = { left: a0.left, right: a0.right, top: a0.top, bottom: a0.bottom };
    let x,
      side = 'l';
    if (a.right + 14 + w <= H.right - 6) x = a.right + 14 - H.left;
    else if (a.left - 14 - w >= H.left + 6) ((x = a.left - 14 - w - H.left), (side = 'r'));
    else ((x = Math.max(6, Math.min(H.width - w - 6, a.left - H.left))), (side = 'n'));
    /* the pop-out stays inside the Plant view */
    if (x > H.width - w - 6) ((x = Math.max(6, H.width - w - 6)), (side = 'n'));
    let y = Math.max(6, Math.min(H.height - ht - 6, (a.top + a.bottom) / 2 - H.top - 60));
    /* UI audit 2026-11-21 A4: no room left or right of the equipment, so the pop-out goes below it, else above it, never over it */
    if (side === 'n') {
      if (a.bottom + 14 + ht <= H.bottom - 6) y = a.bottom + 14 - H.top;
      else if (a.top - 14 - ht >= H.top + 6) y = a.top - 14 - ht - H.top;
    }
    /* x, y are counted from the shown part of the page (F3); the box sits in the page frame */
    const R0 = host().getBoundingClientRect();
    el.style.left = Math.round(x + H.left - R0.left) + 'px';
    el.style.top = Math.round(y + H.top - R0.top) + 'px';
    el.dataset.side = side;
    const ay = Math.max(14, Math.min(ht - 14, (a.top + a.bottom) / 2 - H.top - y));
    el.style.setProperty('--ay', Math.round(ay) + 'px');
  }
  /* the window got smaller (a phone turned, the browser narrowed): an open pop-out placed for the old size stays inside the page (it
     stood off the screen at the right and the whole page scrolled sideways: 867 px wide at 390 px) */
  function keepIn(el) {
    const H = area(),
      R = host().getBoundingClientRect(),
      /* a faceplate taller than the part of the page the window shows scrolls inside itself (F3) */
      mh = Math.max(120, Math.floor(H.height - 12));
    if (el.offsetHeight > mh) el.style.maxHeight = mh + 'px';
    const w = el.offsetWidth,
      ht = el.offsetHeight,
      x = parseFloat(el.style.left) || 0,
      y = parseFloat(el.style.top) || 0,
      ox = H.left - R.left,
      oy = H.top - R.top,
      nx = Math.max(ox + 6, Math.min(ox + H.width - w - 6, x)),
      ny = Math.max(oy + 6, Math.min(oy + H.height - ht - 6, y));
    if (Math.abs(nx - x) > 0.5) ((el.style.left = Math.round(nx) + 'px'), (el.dataset.side = 'n'));
    if (Math.abs(ny - y) > 0.5) el.style.top = Math.round(ny) + 'px';
  }
  addEventListener('resize', () => document.querySelectorAll('.fpo-near, .fpo-box').forEach(el => el.offsetParent && keepIn(el)));
  /* Mina beta.175: the Plant view gets narrower AFTER the pop-out was placed (a side panel opens or the page changes): the open pop-outs move back into the free area */
  try {
    let ro = null;
    const watch = () => {
      const h = document.getElementById('plmid');
      if (!h || ro) return;
      ro = new ResizeObserver(() => document.querySelectorAll('.fpo-near, .fpo-box').forEach(el => el.offsetParent && keepIn(el)));
      ro.observe(h);
    };
    watch();
    if (!ro) setTimeout(watch, 3000);
  } catch (e) {}
  /* dragged by its header */
  function drag(el, hd) {
    hd.addEventListener('pointerdown', e => {
      if (e.target.closest('button')) return;
      const x0 = e.clientX - el.offsetLeft,
        y0 = e.clientY - el.offsetTop;
      el.dataset.side = 'n';
      const mv = ev => {
          el.style.left = ev.clientX - x0 + 'px';
          el.style.top = Math.max(0, ev.clientY - y0) + 'px';
        },
        up = () => (removeEventListener('pointermove', mv), removeEventListener('pointerup', up));
      addEventListener('pointermove', mv);
      addEventListener('pointerup', up);
    });
  }
  /* #59 (user 2026-10-31): two faceplates per equipment that can be open together, the CONTROL one and the PERMISSIVE · TREND ·
     MONITOR one; BOX = the open ones by slot ('control' / 'info'), box = the one being built */
  let box = null,
    paint = null;
  const BOX = {};
  function closeEl(el) {
    if (!el) return;
    clearInterval(el._iv);
    clearInterval(el._iv2);
    el.remove();
    for (const k in BOX) if (BOX[k] === el) delete BOX[k];
    if (box === el) box = paint = null;
  }
  function close() {
    for (const k in BOX) closeEl(BOX[k]);
    box = paint = null;
  }
  const anyOpen = () => Object.keys(BOX).length > 0;
  /* the event log is the top window: an Escape it uses (or will use, if its listener comes later) is not for the faceplate */
  const escTaken = e => { const ev = document.getElementById('evbox'); return !!e.lsEscUsed || !!(ev && ev.style.display === 'block'); };
  /* on the window (capture): a listener of the app stops the key there before the document */
  addEventListener(
    'keydown',
    e => {
      if (e.key === 'Escape' && anyOpen() && !escTaken(e)) close();
    },
    true
  );
  /* another HMI page, another tab: the faceplate of the page before goes */
  document.addEventListener('change', e => e.target && e.target.classList && e.target.classList.contains('plpick') && close(), true);
  new MutationObserver(() => anyOpen() && document.body.dataset.tab !== 'operate' && close()).observe(document.body, { attributes: true, attributeFilter: ['data-tab'] });
  /* a click on the graphic outside it (not on another equipment, which opens its own) closes it. Live test #48 / #43: a click in the
     Training dock, the header or the alarm bar (a tick of the line-up, then START here) leaves it open where it is */
  document.addEventListener('pointerdown', e => {
    if (!host().contains(e.target) || (e.target.closest && e.target.closest('.fpo-box,[data-hit],[data-mdh],[data-fan],[data-dmp],[data-fl],[data-aphh],[data-eqb],#plfp'))) return;
    for (const k in BOX) {
      const el = BOX[k];
      setTimeout(() => el.isConnected && !el.contains(document.activeElement) && closeEl(el), 0);
    }
  });
  function frame(title, sub, slot = 'control') {
    closeEl(BOX[slot]);
    box = E('div', 'fpo-box');
    box.id = slot === 'info' ? 'fpop2' : 'fpop';
    BOX[slot] = box;
    const me = box;
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-label', title + ' faceplate');
    const hd = E('div', 'fpo-h'),
      lamp = E('i', 'fpo-lamp'),
      nm = E('b', '', title),
      sb = E('small', '', sub || ''),
      val = E('span', 'fpo-hv'),
      x = E('button', 'fpo-x', '✕');
    x.type = 'button';
    x.title = 'Close (Esc)';
    x.setAttribute('aria-label', 'Close');
    x.onclick = () => closeEl(me);
    const tt = E('div', 'fpo-tt');
    tt.append(nm, sb);
    hd.append(lamp, tt, val, x);
    const bd = E('div', 'fpo-b');
    box.append(hd, bd);
    host().append(box);
    drag(box, hd);
    return { hd, lamp, val, bd };
  }
  const row = (lbl, ...kids) => {
    const r = E('div', 'fpo-r');
    r.append(E('span', 'fpo-l', lbl), ...kids);
    return r;
  };
  const seg = names => {
    const s = E('div', 'fpo-seg');
    const B = names.map(n => {
      const b = E('button', '', n);
      b.type = 'button';
      s.append(b);
      return b;
    });
    return [s, B];
  };
  const lampEl = t => {
    const s = E('span', 'fpo-lp');
    s.append(E('i'), t);
    return s;
  };
  /* the "Logic DITL-xx" link (MINA, beta.8 live loop check: it only closed the faceplate): the Logic view first, then the drawing,
     the same order as the Training dock (dock.js: lsSetTab('logic') before openD) */
  const logicGo = (dk, nm) => {
    call(() => window.lsSetTab && window.lsSetTab('logic'));
    call(() => dk.openD(nm, null));
  };
  /* the service text of a field input row without its address (dock.js svcN): one key per signal */
  const fsvc = x =>
    String(x || '')
      .replace(/^\(FROM STATION WIRING\)\s*/, '')
      .replace(/^[\w./]*\d\S*\s+/, '')
      .trim();
  /* ---------- the motor faceplate ---------- */
  function motor(M) {
    const dk = D();
    if (!M || !dk || !M.ad) return false;
    const s = call(() => dk.dOf(M.ad), null);
    /* #59: M.part 'control' = the CONTROL faceplate (click on the equipment), 'info' = PERMISSIVE · TREND · MONITOR (its Y / N button);
       no part = both in one (the pages not yet on the #59 standard) */
    const part = M.part || '';
    const F = frame(M.n, (M.t || '') + (M.d ? ' · ' + M.d : ''), part === 'info' ? 'info' : 'control');
    const me = box;
    const nm = s ? call(() => dk.dName(s), M.d) : M.d;
    const chip = E('span', 'fpo-chip');
    F.hd.querySelector('.fpo-tt').append(chip);
    if (part) F.hd.querySelector('.fpo-tt').append(E('span', 'fpo-k', part === 'info' ? 'PERMISSIVE · TREND · MONITOR' : 'CONTROL'));
    /* status */
    const lR = lampEl('RUN'),
      lS = lampEl('STOP'),
      lT = lampEl('TRIP');
    const rSt = row('STATUS', lR, lS, lT);
    F.bd.append(rSt);
    /* FIELD selector */
    const [sRL, [bRem, bLoc]] = seg(['REMOTE', 'LOCAL']);
    const fTag = E('span', 'fpo-fld', 'FIELD');
    fTag.title = 'The selector switch at the switchgear: set by the field operator (logged in Events as "Field operator")';
    const rSel = row('SELECTOR', sRL, fTag);
    F.bd.append(rSel);
    /* MODE */
    const [sAM, [bAu, bMa]] = seg(['AUTO', 'MAN']);
    const amR = row('MODE', sAM);
    F.bd.append(amR);
    /* COMMAND */
    const bSt = E('button', 'fpo-cmd', 'START'),
      bSp = E('button', 'fpo-cmd', 'STOP');
    bSt.type = bSp.type = 'button';
    const rCmd = row('DCS', bSt, bSp);
    F.bd.append(rCmd);
    /* 3.2.1 FIELD · LOCAL PANEL (user 2026-11-04, mockup https://claude.ai/artifact/6gyBnteyRkiaLXvhAELyGj approved "Ok goods yn"): the
       field operator at the motor's local control panel and its protection relay, on every motor whose drawing has the inputs (no force
       on the logic page). Each button is an input of THIS motor's own drawing (the B / C copy for pump B / C):
         LCP START / STOP = the "LOCAL START P.B." / "LOCAL STOP P.B." row (DITL-29A rows 23 / 26), a pulse; the drawing takes it only
                            with the selector at LOCAL (AND NOT REMOTE), so the buttons are open only at LOCAL;
         EMERGENCY STOP   = the "EMERGENCY STOP P.B." row, only where the drawing has one (DITL-21A row 18); else grey, "not on DITL-xx";
         RELAY TRIP       = the ELECTRICAL TROUBLE symbol of the drawing (s.nl.usr, the one the logic page toggles): the motor trips in
                            any mode and stays tripped until RESET, like a relay.
       Nothing else is asked: no plant load, no running plant (user: "kht shutdown pre, pwede mg test nyan"); the drawing decides. */
    const svcRows = re => {
      const o = [];
      if (!s) return o;
      for (let r = 0; r < 64; r++) {
        const v = call(() => DUI.rowInfo(s, r).svc, '');
        if (v && re.test(v)) o.push(r);
      }
      return o;
    };
    /* live test 2026-11-05 (ASH COOLER A, DITL-21A: "LOCAL START/FORWARD P.B." row 22 I.0257, and the E-stop is a "NOT EMERGENCY STOP"
       field contact, row 18 I.0256, 0 at Cold): both are read too; esN = that contact (EMERGENCY STOP = 0, RELEASE = 1) */
    const isI = r => /^I\./.test(call(() => DUI.rowInfo(s, r).tag, '') || '');
    const lsR = svcRows(/LOCAL\s+START(?:\s*\/\s*FOR\w*)?\s+P\.?\s*B|LOCAL\s+START\s*\/\s*FOR/i).filter(r => !/\bNOT\b/i.test(call(() => DUI.rowInfo(s, r).svc, ''))).pop(),
      lpR = svcRows(/LOCAL\s+STOP\s+P\.?\s*B/i).pop(),
      esR = svcRows(/EMERGENCY\s+STOP\s+P\.?\s*B/i).pop(),
      esN = esR == null ? svcRows(/\bNOT\s+EMERGENCY\s+STOP\b/i).filter(isI).shift() : null,
      etU = s && s.nl ? (s.nl.usr || []).find(x => /ELECTRIC/i.test(x.label || '')) : null,
      /* live test 2026-11-05 (AIR PREHEATER DITL-43 row 5 I.0651 NOT TRIP = 0 at Cold, no way to reset it on the page): a drawing with no
         ELECTRICAL TROUBLE symbol but a NOT TRIP field contact: RELAY TRIP = the contact to 0, RESET = to 1 (the Training FIELD NOT TRIP) */
      ntR = etU ? null : svcRows(/\bNOT\s+TRIP\b/i).filter(r => /^I\./.test(call(() => DUI.rowInfo(s, r).tag, '') || '')).shift();
    const hasFld = lsR != null || lpR != null || esR != null || esN != null || !!etU || ntR != null;
    const fSh = E('div', 'fpo-sh fld', 'FIELD · LOCAL PANEL'),
      bLs = E('button', 'fpo-cmd', 'START'),
      bLp = E('button', 'fpo-cmd', 'STOP'),
      bEs = E('button', 'fpo-cmd es', 'EMERGENCY STOP'),
      bTr = E('button', 'fpo-cmd', 'TRIP'),
      bRs = E('button', 'fpo-cmd', 'RESET'),
      bEr = E('button', 'fpo-cmd', 'RELEASE');
    for (const b of [bLs, bLp, bEs, bTr, bRs, bEr]) b.type = 'button';
    const rLcp = row('LCP', bLs, bLp),
      rEs = row('E-STOP', bEs, ...(esN != null ? [bEr] : esR == null ? [E('span', 'fpo-nd', 'not on ' + (nm || 'its drawing'))] : [])),
      rRly = row('RELAY', bTr, bRs);
    /* beta.486 (EIMI): the rows of the FIELD block carry 'fld': the compact shell folds only them (shellc-compact.css). The fold took every
       later row (VCB, CURRENT and the monitor rows of the PERMISSIVE · TREND · MONITOR faceplate), so a pump's monitor rows never showed */
    for (const r of [rLcp, rEs, rRly]) r.classList.add('fld');
    if (hasFld) F.bd.append(fSh, rLcp, rEs, rRly);
    /* live test 2026-11-05 (ACWP-A, DITL-76 row 24 LOCAL STOP P.B. = a FALLING pulse into the reset of the run flip-flop): with the Worker
       the release written once could be overwritten by the Worker's copy of the row (still 1), the button stayed "pressed" and the pump
       ran on; the first STOP did nothing, a second press stopped it. The release is now written again until the row reads 0 */
    const pulse = (r, txt) => {
      dk.fieldRow(nm, r, 1, txt);
      let n = 0;
      const rel = () => {
        const s2 = call(() => dk.dOf(M.ad), null) || s;
        if (s2 && s2.sig) s2.sig[r + ':S'] = false;
        if (window.WORLD && WORLD.live) WORLD.busy = true;
        if (++n < 8) setTimeout(() => (s2 && s2.sig && s2.sig[r + ':S'] ? rel() : n < 3 && setTimeout(rel, 400)), 400);
      };
      setTimeout(rel, 800);
    };
    const etOn = () => (etU ? !!(s && s.usw && s.usw[etU.key]) : ntR != null && call(() => DUI.rowVal(s, ntR), 1) === 0);
    const etSet = on => {
      /* a RESET of the relay also ends a trainer fault of this drawing (WORLD.ftrip: an engine action, page and Worker; it takes off every
         ELECTRIC TROUBLE of the drawing and the field trip s._ftrip that holds the motor stopped) */
      if (!on && s && window.WORLD && WORLD.ftOf && WORLD.ftrip) {
        const id = call(() => WORLD.ftOf(s.name), null);
        if (id) call(() => window.lsEventAdd(nm, 'FIELD', 'FAULT: ' + WORLD.ftrip(id, false)));
      }
      if (ntR != null && !etU) {
        dk.fieldRow(nm, ntR, on ? 0 : 1, M.n + (on ? ' TRIP' : ' NOT TRIP (trip reset in the field)'));
        return;
      }
      if (!etU || !s) return;
      s.usw = s.usw || {};
      s.usw[etU.key] = !!on;
      if (window.WORLD && WORLD.live) WORLD.busy = true;
      call(() => window.lsEventAdd(nm, 'FIELD', 'Field operator: ' + (on ? 'TRIP ' : 'RESET ') + M.n + ' protection relay (ELECTRICAL TROUBLE)'));
    };
    const why = E('div', 'fpo-why');
    F.bd.append(why);
    /* EXECUTE / CANCEL */
    const ex = E('div', 'fpo-ex'),
      exT = E('span'),
      exGo = E('button', 'fpo-go', 'EXECUTE'),
      exNo = E('button', '', 'CANCEL');
    exGo.type = exNo.type = 'button';
    ex.append(exT, exGo, exNo);
    ex.hidden = true;
    F.bd.insertBefore(ex, why);
    let pend = null;
    /* a field action asks in an amber bar inside the FIELD block (the mockup); a DCS one in the blue bar below the reason line */
    const ask = (t, f, fld) => {
      pend = f;
      setTx(exT, t);
      ex.classList.toggle('fld', !!fld);
      /* Mina F13: above the reason line, whose length no longer moves the EXECUTE button */
      F.bd.insertBefore(ex, why);
      ex.hidden = false;
      exGo.focus();
    };
    exNo.onclick = () => ((pend = null), (ex.hidden = true));
    exGo.onclick = () => {
      const f = pend;
      pend = null;
      ex.hidden = true;
      if (f) f();
      setTimeout(tick, 150);
    };
    /* VCB and current */
    const vcb = lampEl('VCB');
    const cur = E('span', 'fpo-vb'),
      band = E('small', 'fpo-dim', M.band ? 'SOP ' + M.band[0] + ' ~ ' + M.band[1] + ' A' : '');
    const rVcb = row('VCB', vcb);
    F.bd.append(rVcb);
    const trend = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    trend.setAttribute('viewBox', '0 0 300 50');
    trend.setAttribute('preserveAspectRatio', 'none');
    trend.setAttribute('class', 'fpo-tr');
    trend.setAttribute('role', 'img');
    trend.setAttribute('aria-label', 'Current trend, 10 minutes');
    const trH = E('div', 'fpo-sh', 'TREND · 10 min'),
      rCur = row('CURRENT', cur, band);
    if (M.cur) F.bd.append(rCur);
    /* monitoring values of the info faceplate: M.mon = [[label, fn, unit, tag]] (bearing, winding, vibration, ...) */
    const mon = (part === 'info' && M.mon) || [];
    /* beta.486: the monitor rows under their own heading, apart from the permissive rows above them */
    if (mon.length) F.bd.append(E('div', 'fpo-sh', 'MONITOR'));
    const monV = mon.map(([l, f, u, tg, dp, words]) => {
      const v = E('span', 'fpo-vb');
      F.bd.append(row(l, v, E('small', 'fpo-dim', [u, tg].filter(Boolean).join(' · '))));
      return [v, f, dp, words];
    });
    if (M.cur) F.bd.append(trH, trend);
    /* the logic permissive */
    const ilH = E('div', 'fpo-sh', 'LOGIC PERMISSIVE' + (nm ? ' · ' + nm : '')),
      ilL = E('ul', 'fpo-il');
    F.bd.append(ilH, ilL);
    /* the sections of the part: CONTROL without permissive / trend, INFO without the commands (moved to the top: permissive first) */
    if (part === 'control') for (const el of [rCur, trH, trend, ilH, ilL]) el.hidden = true;
    if (part === 'info') {
      for (const el of [rSel, amR, rCmd, why, rVcb]) el.hidden = true;
      F.bd.insertBefore(ilL, rSt.nextSibling);
      F.bd.insertBefore(ilH, ilL);
    }
    /* live test 2026-11-05 (FEEDWATER: the BFWP start needs its auxiliary lube oil pump, DITL-22 / #B / #C / #D, PR-OPE-5002 19.5, and
       the page draws no symbol for it): M.aux = [[label, drawing]] = the auxiliary motors of this machine, each opens its own faceplate */
    if (M.aux && M.aux.length && part !== 'info') {
      const ab = M.aux.map(([l, ad]) => {
        const b = E('button', 'fpo-cmd', l);
        b.type = 'button';
        b.title = 'Open the faceplate of ' + l + ' (' + ad + ')';
        b.onclick = () => call(() => motor({ n: l + ' · ' + M.n, t: ad, ad, d: ad, part: 'control' }));
        return b;
      });
      F.bd.append(row('AUXILIARY', ...ab));
    }
    /* links */
    const ln = E('div', 'fpo-ln');
    const link = (t, f) => {
      const a = E('button', 'fpo-a', t);
      a.type = 'button';
      a.onclick = f;
      ln.append(a);
    };
    if (M.io) link('I/O wiring', () => call(() => window.lsInfo(M.io)));
    if (nm) link('Logic ' + nm, () => (close(), logicGo(dk, nm)));
    link('Events', () => call(() => document.getElementById('evbtn').click()));
    F.bd.append(ln);
    const H = hist[M.n] || (hist[M.n] = []);
    if (M.cur) REG['cur:' + M.n] = { cur: M.cur };
    /* a drawing whose rows are not named "... MODE SELECTED" (DITL-76 / 77 ACWP: LCP REMOTE SELECTED row 20, CRT AUTO PB row 1): the
       page gives its rows (remRows, auRow) and its reader of the mode (modeFn) */
    const mrows = () => (M.remRows ? { rem: M.remRows } : call(() => (s && (s._mrows || (dk.modeOf(M.ad), s._mrows))) || null, null));
    const amr = M.auRow != null ? { row: M.auRow } : call(() => dk.amRow(s), null);
    if (!amr) amR.hidden = true;
    /* the actions: the same calls as the dock */
    bRem.onclick = () => {
      const R = mrows();
      if (!R || !R.rem.length) return;
      ask('FIELD: ' + M.n + ' selector to REMOTE?', () => R.rem.forEach(r => dk.fieldRow(nm, r, 1, M.n + ' REMOTE MODE SELECTED (field selector)')));
    };
    bLoc.onclick = () => {
      const R = mrows();
      if (!R || !R.rem.length) return;
      ask('FIELD: ' + M.n + ' selector to LOCAL?', () => R.rem.forEach(r => dk.fieldRow(nm, r, 0, M.n + ' LOCAL (field selector)')));
    };
    bAu.onclick = () => amr && !bAu.disabled && ask(M.n + ' to AUTO (standby)?', () => dk.dsel(nm, amr.row, 1, M.n + ' AUTO MODE SELECTED'));
    bMa.onclick = () => amr && ask(M.n + ' to MAN?', () => dk.dsel(nm, amr.row, 0, M.n + ' AUTO MODE SELECTED'));
    bSt.onclick = () => !bSt.disabled && ask('START ' + M.n + '?', () => (dk.dmotor(M.ad, 1), call(() => window.lsEventAdd(nm, 'DCS', 'Operator: START ' + M.n + ' (faceplate)'))));
    /* MINA, beta.8 live loop check: STOP + EXECUTE in AUTO did nothing and the faceplate said nothing. The drawing accepts the DCS STOP
       only in MAN (DITL-29A rows 17 ~ 19 and DITL-30 row 14 / 16: STOP P.B. AND REMOTE AND NOT AUTO): a STOP the logic did not take
       (still RUNNING 3 s after the press, in AUTO) says so below */
    let spAt = 0;
    bSp.onclick = () => !bSp.disabled && ask('STOP ' + M.n + '?', () => ((spAt = Date.now()), dk.dmotor(M.ad, 0), call(() => window.lsEventAdd(nm, 'DCS', 'Operator: STOP ' + M.n + ' (faceplate)'))));
    /* Mina F18: a local panel press the drawing refused said nothing (BFWP-A at LOCAL, lube oil off: the old "Selector at LOCAL" line
       stayed). The press is remembered; still stopped (or still running) 4 s later = not taken, and the line says why */
    let lsAt = 0,
      lpAt = 0;
    bLs.onclick = () => !bLs.disabled && ask('FIELD: START ' + M.n + ' at the local panel?', () => ((lsAt = Date.now()), pulse(lsR, M.n + ' LOCAL START P.B. (local panel)')), 1);
    bLp.onclick = () => !bLp.disabled && ask('FIELD: STOP ' + M.n + ' at the local panel?', () => ((lpAt = Date.now()), pulse(lpR, M.n + ' LOCAL STOP P.B. (local panel)')), 1);
    bEs.onclick = () =>
      !bEs.disabled &&
      ask('FIELD: EMERGENCY STOP ' + M.n + '?', () => (esN != null ? dk.fieldRow(nm, esN, 0, M.n + ' EMERGENCY STOP (field)') : pulse(esR, M.n + ' EMERGENCY STOP P.B. (field)')), 1);
    bEr.onclick = () => !bEr.disabled && ask('FIELD: RELEASE the emergency stop of ' + M.n + '?', () => dk.fieldRow(nm, esN, 1, M.n + ' emergency stop released (field)'), 1);
    bTr.onclick = () => !bTr.disabled && ask('FIELD: TRIP ' + M.n + ' at its protection relay?', () => etSet(true), 1);
    bRs.onclick = () => !bRs.disabled && ask('FIELD: RESET the protection relay of ' + M.n + '?', () => etSet(false), 1);
    let k0 = '';
    function tick() {
      if (!me.isConnected) return closeEl(me);
      const st = call(() => dk.mst(M.ad), null),
        md = call(() => (M.modeFn ? M.modeFn() : dk.modeOf(M.ad)), null) || {},
        I = call(() => dk.interlock(M.ad), null),
        run = isRun(),
        loc = md.rem === false;
      F.lamp.className = 'fpo-lamp ' + (st === 'RUN' ? 'run' : st === 'TRIP' ? 'trip' : st === 'STOP' ? 'stop' : '');
      lR.className = 'fpo-lp' + (st === 'RUN' ? ' run' : '');
      lS.className = 'fpo-lp' + (st === 'STOP' ? ' stop' : '');
      lT.className = 'fpo-lp' + (st === 'TRIP' ? ' trip' : '');
      /* beta.486 (EIMI): M.vcb = the VCB ON / OFF point of the I/O list (an HX page gives it: HX.M o.vcb); without it the lamp follows
         the motor state */
      const vb = typeof M.vcb === 'function' ? call(M.vcb, null) : undefined,
        vOn = vb === undefined ? (st === 'RUN' ? true : st ? false : null) : vb == null || !isFinite(+vb) ? null : +vb >= 0.5;
      vcb.className = 'fpo-lp' + (vOn === true ? ' run' : vOn === false ? ' stop' : '');
      setTx(vcb.lastChild, vOn === true ? 'ON' : vOn === false ? 'OFF' : '---');
      vcb.title =
        vb === undefined
          ? 'VCB ON / OFF of the I/O list: shown closed while the motor runs (no logic sheet reads it)'
          : 'VCB ON / OFF of the I/O list' + (M.vcbTag ? ' · ' + M.vcbTag : '');
      bRem.classList.toggle('on', md.rem === true);
      bLoc.classList.toggle('on', md.rem === false);
      bRem.disabled = bLoc.disabled = md.rem == null;
      bAu.classList.toggle('on', md.au === true);
      bMa.classList.toggle('on', md.au === false);
      bAu.disabled = loc || md.au == null;
      /* live test beta.74 #37: a standby (REMOTE + AUTO, stopped) is ready: the logic starts it (a trip of the running one, low header);
         the DCS START of the drawing is the one accepted only in MAN (DITL-112 OUT8 = PULSE(START P.B.) AND NOT AUTO), not an interlock */
      const sby = st === 'STOP' && md.rem === true && md.au === true;
      const miss = I && !sby ? I.miss.filter(r => !/REMOTE/.test(r.svc)) : [];
      /* beta.506: a drawing with no DCS START / STOP push button (DITL-120, waste water pumps): the button is closed and the line says so,
         it looked open and a press did nothing */
      const noSt = call(() => dk.hasPb(M.ad, 1), null) === false,
        noSp = call(() => dk.hasPb(M.ad, 0), null) === false;
      bSt.disabled = noSt || loc || sby || st === 'RUN' || st === 'TRIP' || miss.length > 0;
      bSp.disabled = noSp || loc || st !== 'RUN';
      bSt.classList.toggle('lit-run', st === 'RUN');
      bSp.classList.toggle('lit-stop', st === 'STOP');
      if (hasFld) {
        const et = etOn();
        bLs.disabled = lsR == null || !loc || st === 'RUN' || st === 'TRIP';
        bLp.disabled = lpR == null || !loc || st !== 'RUN';
        bLs.classList.toggle('lit-run', st === 'RUN');
        bLp.classList.toggle('lit-stop', st === 'STOP' && loc);
        if (esN != null) {
          const esOn = call(() => DUI.rowVal(s, esN), 1) === 0;
          bEs.disabled = esOn || !run;
          bEr.disabled = !esOn || !run;
        } else bEs.disabled = esR == null || st !== 'RUN';
        bTr.disabled = (!etU && ntR == null) || et;
        bRs.disabled = (!etU && ntR == null) || !et;
        bTr.classList.toggle('lit-run', et);
        for (const el of [fSh, rLcp, rEs, rRly]) el.hidden = part === 'info';
      }
      /* one line: why a button is closed */
      if (st !== 'RUN' || md.au !== true) spAt = 0;
      const spNo = spAt && st === 'RUN' && md.au === true && Date.now() - spAt > 3000;
      const lcpRows = [lsR, lpR].filter(x => x != null).map(x => x + 1).join(' / ');
      /* live test 2026-11-05: the raw drawing note "(FROM STATION WIRING)" left out, the same line once (DITL-28A FAB A STOP COMMAND was
         listed twice, DITL-19 showed the note) */
      const missTxt = () => {
        const L = [...new Set(miss.map(r => String(r.svc || '').replace(/^[IMB].S+s+/, '').replace(/^(FROM [^)]*)s*/i, '').trim() + (r.want ? '' : ' (must be 0)')))];
        return L.length + ' permissive missing: ' + L.join('; ') + '.';
      };
      const now0 = Date.now();
      if (!loc || st === 'RUN' || now0 - lsAt > 60e3) lsAt = 0;
      if (!loc || st !== 'RUN' || now0 - lpAt > 60e3) lpAt = 0;
      const lsNo = lsAt && st === 'STOP' && now0 - lsAt > 4000,
        lpNo = lpAt && st === 'RUN' && now0 - lpAt > 4000;
      why.textContent =
        noSt && noSp && st !== 'TRIP'
          ? (nm || 'Its drawing') + ' has no DCS START or STOP button: this motor is not started or stopped from the DCS.'
          : lsNo
          ? 'LCP START not taken: ' + (miss.length ? missTxt() : 'the drawing did not start it. See ' + (nm || 'its drawing') + '.')
          : lpNo
          ? 'LCP STOP not taken: the drawing did not stop it. See ' + (nm || 'its drawing') + '.'
          : spNo
          ? 'STOP not taken: the drawing accepts the DCS STOP in MAN only (' + (nm || 'its drawing') + ': STOP P.B. AND NOT AUTO). Press MAN, then STOP.'
          : st === 'TRIP' && etOn()
          ? 'TRIP: protection relay (ELECTRICAL TROUBLE on ' + (nm || 'its drawing') + '). RESET the relay in the field, then START again.'
          : st === 'TRIP'
          ? 'TRIP: find the cause and reset it in the field before starting again.'
          : loc && lcpRows && st === 'STOP' && miss.length
            ? 'Selector at LOCAL, START blocked: ' + missTxt()
          : loc && lcpRows
            ? 'Selector at LOCAL: AUTO, START and STOP from the DCS are blocked. The local panel starts and stops it.'
          : loc
            ? 'Selector at LOCAL: AUTO, START and STOP from the DCS are blocked. Set the field selector to REMOTE first.'
            : sby
              ? 'STANDBY, ready: its drawing starts it by itself (auto cut-in' + (/^DITL-(29A|30)\b/.test(nm || '') ? ': when a running pump trips, not on a normal STOP' : '') + '). DCS START is in MAN only.'
              : miss.length && st !== 'RUN'
              ? 'START blocked: ' + missTxt()
              : !run && st !== 'RUN'
                ? 'Simulation PAUSED: press ▶ RUN before START (nothing moves while paused).'
                : md.rem === true && lcpRows && st !== 'TRIP'
                ? 'Selector at REMOTE: the local panel START and STOP are blocked (' + (nm || 'its drawing') + ' rows ' + lcpRows + ' work only in LOCAL). Use DCS START / STOP.'
                : '';
      why.hidden = part === 'info' || !why.textContent;
      /* #59: the Y / N of the info faceplate (and of the page's button: M.onYN) = every logic permissive complete (the SOP line-up check went with the guided training, 2026-11-21 GO NO SOP) */
      const yn = !loc && !miss.length;
      if (part === 'info') setTx(ilH, 'PERMISSIVE · ' + (yn ? 'Y (all complete)' : 'N (not complete)') + (nm ? ' · ' + nm : ''));
      if (M.onYN) call(() => M.onYN(yn), null);
      for (const [v, f, dp, words] of monV) {
        const x = call(f, null);
        /* an on / off point shows its word (words = [at 1, at 0]); a value its decimals (dp, 1 when not given) */
        setTx(v, x == null || !isFinite(+x) ? '-----' : words ? (+x >= 0.5 ? words[0] : words[1]) : (+x).toFixed(dp == null ? 1 : dp));
      }
      setTx(chip, st === 'TRIP' ? 'TRIP' : st === 'RUN' ? 'RUNNING' : loc && miss.length ? 'INTERLOCK' : loc ? 'NOT READY' : sby ? 'STANDBY' : miss.length ? 'INTERLOCK' : st === 'STOP' && !noSt ? 'READY' : '');
      chip.className = 'fpo-chip ' + (st === 'TRIP' ? 'trip' : miss.length && st !== 'RUN' ? 'ilk' : '');
      /* current */
      if (M.cur) {
        const v = call(() => M.cur(), null);
        const out = v != null && M.band && st === 'RUN' && (v < M.band[0] || v > M.band[1]);
        setTx(cur, v == null ? '-----' : (+v).toFixed(1) + ' A');
        cur.classList.toggle('hi', !!out);
        setTx(F.val, v == null ? '' : (+v).toFixed(1) + ' A');
        const now = Date.now();
        sample(H, v, now);
        const mx = Math.max(10, ...H.map(p => p[1]), M.band ? M.band[1] * 1.3 : 0);
        trend.innerHTML =
          (M.band ? `<rect x="0" width="300" y="${47 - (M.band[1] / mx) * 44}" height="${((M.band[1] - M.band[0]) / mx) * 44}" fill="#2b3742"/>` : '') +
          `<polyline fill="none" stroke="${st === 'RUN' ? '#e5484d' : '#7f8b97'}" stroke-width="2" points="${H.map(p => ((300 * (p[0] - (now - 600e3))) / 600e3).toFixed(1) + ',' + (47 - (p[1] / mx) * 44).toFixed(1)).join(' ')}"/>` +
          /* the newest value as a dot (a line needs two samples, 5 s apart) */
          (H.length ? `<circle cx="298" cy="${(47 - (H[H.length - 1][1] / mx) * 44).toFixed(1)}" r="2.5" fill="${st === 'RUN' ? '#e5484d' : '#93a2b2'}"/>` : '');
      }
      /* logic permissive: the rows of the drawing, live */
      /* one line per signal: the rows of one address (DITL-29A rows 5, 18, 22 = SEAWATER PUMP C REMOTE MODE SELECTED) are one row */
      const rows = [];
      for (const r of I ? I.rows : []) {
        const t = String(r.svc).replace(/^[\w./]*\d\S*\s+/, '') + (r.cmp ? ' (' + r.cmp + ')' : ''),
          o = rows.find(x => x.t === t && x.other === r.other && x.ok === r.ok);
        if (o) (o.no += ' · ' + r.no), o.src.push(r);
        else rows.push({ ...r, t, no: String(r.no), src: [r] });
      }
      const kk = JSON.stringify(rows.map(r => [r.no, r.ok, r.other]));
      if (kk !== k0) {
        k0 = kk;
        /* tracker e1 (user 2026-11-10: a cold start without Training): the FIELD contact behind a missing row (the LOCAL / REMOTE selector,
           a NOT TRIP contact, a limit switch ...) gets the same FIELD button as the Training dock interlock row (dock.js: LS_OP.fieldOf
           finds the field input rows the row needs, LS_OP.fieldSet sets them, every row of the same address). A CRT selection (AUTO MODE
           SELECTED) and a process value of the plant model get no button: no FORCE */
        const fo = rows.some(r => !r.ok) ? call(() => dk.fieldOf(M.ad), null) : null,
          used = new Set();
        const fixOf = r => {
          if (r.ok || !fo) return null;
          const out = [];
          for (const x of r.src) {
            const o = fo.by[((x.s || s) && (x.s || s).name) + ':' + x.row];
            for (const f of (o && o.field) || []) {
              const k = f.s.name + '|' + fsvc(f.svc);
              if (f.av || used.has(k) || /AUTO MODE SELECTED|\bCRT\b/.test(f.svc)) continue;
              used.add(k);
              const L = fo.field.filter(g => !g.av && g.s.name + '|' + fsvc(g.svc) === k),
                n0 = fsvc(f.svc),
                lb = f.want ? (/\bREMOTE\b/.test(n0) ? 'to REMOTE' : 'set') : 'reset';
              const b = E('button', 'fpo-fix', 'FIELD: ' + lb);
              b.type = 'button';
              b.title = 'Field operator: ' + call(() => dk.dName(f.s), '') + ' row ' + (L.length ? L : [f]).map(g => g.row + 1).join(', ') + ' (' + n0 + ') = ' + (f.want ? 1 : 0);
              b.onclick = e => {
                e.stopPropagation();
                ask(
                  'FIELD: ' + n0 + ' = ' + (f.want ? 1 : 0) + '?',
                  () => {
                    call(() => dk.fieldSet(L.length ? L : [f]));
                    call(() => window.lsEventAdd(call(() => dk.dName(f.s), nm), 'FIELD', 'Field operator: ' + n0 + ' = ' + (f.want ? 1 : 0) + ' (faceplate)'));
                    k0 = '';
                  },
                  1
                );
              };
              out.push(b);
            }
          }
          return out.length ? out : null;
        };
        ilL.replaceChildren(
          ...(rows.length
            ? rows.slice(0, 12).map(r => {
                const li = E('li', r.ok ? 'ok' : 'bad');
                li.append(E('i', '', String(r.ok ? +r.want : 1 - r.want)), E('span', '', r.t), ...(fixOf(r) || []), E('em', '', (r.other ? r.other + ' ' : '') + 'row ' + r.no));
                li.title = (r.ok ? 'OK: ' : 'Missing: ') + r.svc + ' · ' + (r.other || nm) + ' row ' + r.no + (r.want ? ' (must be 1)' : ' (must be 0)');
                return li;
              })
            : [E('li', 'ok', I ? 'No permissive on the drawing.' : 'Logic not ready yet (Plant view, RUN).')])
        );
      }
    }
    paint = tick;
    tick();
    place(me);
    me._iv = setInterval(tick, 500);
    /* Mina F20: the current follows the page during the start inrush (the same reading, 5 times a second) */
    if (M.cur)
      me._iv2 = setInterval(() => {
        const v = call(() => M.cur(), null);
        if (v == null || !me.isConnected) return;
        const t = (+v).toFixed(1) + ' A';
        if (cur.textContent !== t) (cur.textContent = t), (F.val.textContent = t);
      }, 200);
    return true;
  }
  /* ---------- the valve faceplate (live test beta.74, spec item 2: OPEN / CLOSE, AUTO / MAN, ZSO / ZSC) ----------
     V = { n, t, d (its DITL drawing), io, isOpen(), isAuto(), opRow, clRow (the OPEN / CLOSE P.B. rows, pulses in MAN), auSel(v) (the
     AUTO / MAN selection of the drawing), auto (what the logic does in AUTO), why() (a reason it cannot open: '' when none) }.
     The same calls as the operator API (LS_OP.dpress / dset / dsel); the operator presses, the faceplate never acts on its own */
  function valve(V) {
    const dk = D();
    if (!V || !dk || !V.d || !call(() => dk.dOf(V.d), null)) return false;
    const F = frame(V.n, (V.t || '') + ' · ' + V.d);
    const me = box;
    const chip = E('span', 'fpo-chip');
    F.hd.querySelector('.fpo-tt').append(chip);
    const lO = lampEl('ZSO OPEN'),
      lC = lampEl('ZSC CLOSED');
    F.bd.append(row('POSITION', lO, lC));
    const [sAM, [bAu, bMa]] = seg(['AUTO', 'MAN']);
    F.bd.append(row('MODE', sAM));
    const bOp = E('button', 'fpo-cmd', 'OPEN'),
      bCl = E('button', 'fpo-cmd', 'CLOSE');
    bOp.type = bCl.type = 'button';
    F.bd.append(row('DCS', bOp, bCl));
    const why = E('div', 'fpo-why');
    F.bd.append(why);
    const ex = E('div', 'fpo-ex'),
      exT = E('span'),
      exGo = E('button', 'fpo-go', 'EXECUTE'),
      exNo = E('button', '', 'CANCEL');
    exGo.type = exNo.type = 'button';
    ex.append(exT, exGo, exNo);
    ex.hidden = true;
    F.bd.insertBefore(ex, why);
    let pend = null;
    const ask = (t, f) => ((pend = f), (exT.textContent = t), (ex.hidden = false), exGo.focus());
    exNo.onclick = () => ((pend = null), (ex.hidden = true));
    exGo.onclick = () => {
      const f = pend;
      pend = null;
      ex.hidden = true;
      if (f) f();
      setTimeout(tick, 150);
    };
    if (V.auto) F.bd.append(E('div', 'fpo-dim', 'AUTO: ' + V.auto));
    const ln = E('div', 'fpo-ln');
    const link = (t, f) => {
      const a = E('button', 'fpo-a', t);
      a.type = 'button';
      a.onclick = f;
      ln.append(a);
    };
    if (V.io) link('I/O wiring', () => call(() => window.lsInfo(V.io)));
    link('Logic ' + V.d, () => (close(), logicGo(dk, V.d)));
    link('Events', () => call(() => document.getElementById('evbtn').click()));
    F.bd.append(ln);
    const ev = t => call(() => window.lsEventAdd(V.d, 'DCS', 'Operator: ' + V.n + ' ' + t + ' (faceplate)'));
    bAu.onclick = () => !bAu.disabled && (V.auSel(true), ev('AUTO'), setTimeout(tick, 150));
    bMa.onclick = () => !bMa.disabled && (V.auSel(false), ev('MAN'), setTimeout(tick, 150));
    bOp.onclick = () => ask(V.n + ' OPEN?', () => (dk.dpress(V.d, V.opRow), ev('OPEN')));
    bCl.onclick = () => ask(V.n + ' CLOSE?', () => (dk.dpress(V.d, V.clRow), ev('CLOSE')));
    function tick() {
      if (!me.isConnected) return closeEl(me);
      const op = !!call(() => V.isOpen(), false),
        au = !!call(() => V.isAuto(), false),
        run = isRun(),
        w = call(() => (V.why ? V.why() : ''), '');
      F.lamp.className = 'fpo-lamp ' + (op ? 'run' : 'stop');
      setTx(F.val, op ? 'OPEN' : 'CLOSED');
      lO.className = 'fpo-lp' + (op ? ' run' : '');
      lC.className = 'fpo-lp' + (!op ? ' stop' : '');
      bAu.classList.toggle('on', au);
      bMa.classList.toggle('on', !au);
      bAu.disabled = au || !run;
      bMa.disabled = !au || !run;
      bOp.disabled = au || op || !run || !!w;
      bCl.disabled = au || !op || !run;
      bOp.classList.toggle('lit-run', op);
      bCl.classList.toggle('lit-stop', !op);
      why.textContent = !run
        ? 'Simulation PAUSED: press ▶ RUN first (nothing moves while paused).'
        : au
          ? 'In AUTO the logic opens and closes it. Select MAN for OPEN / CLOSE.'
          : w || '';
      why.hidden = !why.textContent;
      setTx(chip, au ? 'AUTO' : 'MAN');
      chip.className = 'fpo-chip';
    }
    paint = tick;
    tick();
    place(me);
    me._iv = setInterval(tick, 500);
    return true;
  }
  /* the valves of the HMI pages with a DITL drawing (the same rows the Training step 8 presses, guide.js) */
  const VALVES = {
    'XV-MU1109': {
      n: 'XV-MU1109',
      t: 'Expansion tank make-up',
      d: 'DITL-78',
      io: 'XV-MU1109',
      isOpen: () => !!(window.AN && AN.unit && +AN.unit.muXv === 1),
      isAuto: () => {
        const s = D() && D().dOf('DITL-78');
        return !!(s && window.DUI && DUI.rowVal(s, 2) === 1);
      },
      opRow: 4,
      clRow: 8,
      auSel: v => (D().dset('DITL-78', 0, v), D().dsel('DITL-78', 2, v, 'EXPANSION TANK INLET VLV XV-MU1109 AUTO SELECTED (M.1252)')),
      auto: 'opens below 40 % of LT-CW1109, closes above 85 % (1.7 m) · DITL-78',
      why: () => (window.AN && AN.unit && (+AN.unit.iaP || 0) < 3.5 ? 'No instrument air (below 3.5 kg/cm²): XV-MU1109 is spring opening (vendor sheet K1AU3-E2-0-123 item 39), it is open and cannot be closed.' : '')
    }
  };  /* the trend history of the engine (hist.js AN.histReg): open (100) / closed (0) of each of these valves, each simulated second */
  for (const tg in VALVES)
    (window.LS_HISTQ = window.LS_HISTQ || []).push([[tg], 'valve', { pos: () => (VALVES[tg].isOpen() ? 100 : 0), unit: '%' }]);

  /* a manual valve the field operator turns (Training: FIELD, a digital field item of the plant model, logged as "Field operator") */
  const FIELDV = {
    'V-MU1033': { n: 'V-MU1033', t: 'Expansion tank bypass (manual)', k: 'mu1033', io: 'V-MU1033', use: 'Second fill path of T-1109 (PR-OPE-5002 section 7: XV-MU1109 or the bypass V-MU1033). Close it when LT-CW1109 reaches 1.7 m.' },
    /* Mina's retest step 8 (PR-OPE-5002 7.20 "Open Expansion tank outlet valve to prime the close cooling line (V-CW1001)", 7.22 NL 1.7 m;
       flow diagram K1AU3-PD-021 Rev D: T-1109 outlet V-CW1001 CW-1-001 8"; not in the I/O list: a field valve, plant model AN_SRC.field) */
    'V-CW1001': { n: 'V-CW1001', t: 'Expansion tank outlet (manual)', k: 'cw1001', io: 'V-CW1001', use: 'Primes the closed cooling line from T-1109 (PR-OPE-5002 7.20). Then keep T-1109 at NL 1.7 m, make up if necessary (7.22).' }
  };
  function fieldValve(V) {
    if (!V || !window.AN || !AN.field) return false;
    const st = () => !!(AN.fieldState && AN.fieldState()[V.k]);
    const F = frame(V.n, V.t);
    const me = box;
    const chip = E('span', 'fpo-chip', 'FIELD');
    F.hd.querySelector('.fpo-tt').append(chip);
    const lO = lampEl('OPEN'),
      lC = lampEl('CLOSED');
    F.bd.append(row('POSITION', lO, lC));
    const bOp = E('button', 'fpo-cmd', 'OPEN'),
      bCl = E('button', 'fpo-cmd', 'CLOSE'),
      fTag = E('span', 'fpo-fld', 'FIELD');
    bOp.type = bCl.type = 'button';
    fTag.title = 'A manual valve: turned by the field operator at the valve (logged in Events as "Field operator")';
    F.bd.append(row('LOCAL', bOp, bCl, fTag));
    const why = E('div', 'fpo-why');
    F.bd.append(why);
    if (V.use) F.bd.append(E('div', 'fpo-dim', V.use));
    const ln = E('div', 'fpo-ln'),
      a = E('button', 'fpo-a', 'Events');
    a.type = 'button';
    a.onclick = () => call(() => document.getElementById('evbtn').click());
    if (V.io) {
      const b = E('button', 'fpo-a', 'Info');
      b.type = 'button';
      b.onclick = () => call(() => window.lsInfo(V.io));
      ln.append(b);
    }
    ln.append(a);
    F.bd.append(ln);
    const set = v => {
      AN.field(V.k, v);
      call(() => window.lsEventAdd('FIELD', 'FIELD', 'Field operator: ' + (v ? 'OPEN' : 'CLOSE') + ' ' + V.n + ' (local)'));
      setTimeout(tick, 150);
    };
    bOp.onclick = () => !bOp.disabled && set(true);
    bCl.onclick = () => !bCl.disabled && set(false);
    function tick() {
      if (!me.isConnected) return closeEl(me);
      const op = st(),
        run = isRun();
      F.lamp.className = 'fpo-lamp ' + (op ? 'run' : 'stop');
      setTx(F.val, op ? 'OPEN' : 'CLOSED');
      lO.className = 'fpo-lp' + (op ? ' run' : '');
      lC.className = 'fpo-lp' + (!op ? ' stop' : '');
      bOp.disabled = op || !run;
      bCl.disabled = !op || !run;
      bOp.classList.toggle('lit-run', op);
      bCl.classList.toggle('lit-stop', !op);
      setTx(why, run ? '' : 'Simulation PAUSED: press ▶ RUN first (nothing moves while paused).');
      why.hidden = !why.textContent;
    }
    paint = tick;
    tick();
    place(me);
    me._iv = setInterval(tick, 500);
    return true;
  }
  /* live test #45: a package run by push buttons of a DITL drawing (debris filter S-1502 / S-1504, DITL-39: REMOTE AUTO START / STOP P.B.
     to the local panel, IN OPERATION back). P = { n, t, d (drawing), io, st: { row, on, off }, pbs: [[label, row, address]],
     perm: [{ row, l }] (any one = 1), vals: [[tag, fn, unit]] }. Same rows and calls as the dock (LS_OP.dout / dpress) */
  function pb(P) {
    const dk = D();
    if (!P || !dk || !P.d || !call(() => dk.dOf(P.d), null)) return false;
    const s = dk.dOf(P.d);
    const F = frame(P.n, (P.t || '') + ' · ' + P.d);
    const me = box;
    /* Rosé 2026-11-24 (click check, sea water page): st.row null = the drawing has no status input back from the panel (the condenser
       tube cleaning, DITL-119: REMOTE AUTO START / STOP pulses out, nothing back). No STATUS lamps then: the header says where the
       state is (st.off), START needs its permissive, STOP is its own press */
    const noSt = P.st.row == null;
    const lOn = lampEl(P.st.on || ''),
      lOff = lampEl(P.st.off || 'STOPPED');
    if (!noSt) F.bd.append(row('STATUS', lOn, lOff));
    /* [.., 5] = the drawing of that push button when it is not the status drawing (a sootblower: STATUS on DITL-80A, its REMOTE START /
       REVERSE P.B. on DITL-80M or its own copy of DITL-80G) */
    const B = P.pbs.map(([l, r, ad, , , pd]) => {
      const b = E('button', 'fpo-cmd', l);
      b.type = 'button';
      b.title = (pd || P.d) + ' row ' + (r + 1) + ' · ' + ad;
      return b;
    });
    /* live test 2026-11-05 (air dryers, DITL-45): P.sel = the REMOTE input row of the local panel (I.0099 / I.0085 ...): the field operator
       turns it (LS_OP.fieldRow, every row of the same address); the DCS push buttons need REMOTE */
    let bRem = null,
      bLoc = null;
    if (P.sel != null) {
      bRem = E('button', 'fpo-cmd', 'REMOTE');
      bLoc = E('button', 'fpo-cmd', 'LOCAL');
      bRem.type = bLoc.type = 'button';
      F.bd.append(row('FIELD SELECTOR', bRem, bLoc));
    }
    F.bd.append(row('DCS', ...B));
    const why = E('div', 'fpo-why');
    F.bd.append(why);
    const ex = E('div', 'fpo-ex'),
      exT = E('span'),
      exGo = E('button', 'fpo-go', 'EXECUTE'),
      exNo = E('button', '', 'CANCEL');
    exGo.type = exNo.type = 'button';
    ex.append(exT, exGo, exNo);
    ex.hidden = true;
    F.bd.insertBefore(ex, why);
    let pend = null;
    const ask = (t, f) => ((pend = f), (exT.textContent = t), (ex.hidden = false), exGo.focus());
    exNo.onclick = () => ((pend = null), (ex.hidden = true));
    exGo.onclick = () => {
      const f = pend;
      pend = null;
      ex.hidden = true;
      if (f) f();
      setTimeout(tick, 150);
    };
    const V = (P.vals || []).map(([tag, f, u]) => {
      const v = E('span', 'fpo-vb');
      F.bd.append(row(tag, v, E('small', 'fpo-dim', u || '')));
      return [v, f];
    });
    const ilH = E('div', 'fpo-sh', 'LOGIC PERMISSIVE · ' + P.d + ' (any one is enough)'),
      ilL = E('ul', 'fpo-il');
    if (P.perm && P.perm.length) F.bd.append(ilH, ilL);
    const ln = E('div', 'fpo-ln');
    const link = (t, f) => {
      const a = E('button', 'fpo-a', t);
      a.type = 'button';
      a.onclick = f;
      ln.append(a);
    };
    if (P.io) link('I/O wiring', () => call(() => window.lsInfo(P.io)));
    link('Logic ' + P.d, () => (close(), logicGo(dk, P.d)));
    link('Events', () => call(() => document.getElementById('evbtn').click()));
    F.bd.append(ln);
    const selSet = on => {
      dk.fieldRow(P.d, P.sel, on ? 1 : 0, P.n + ' selector to ' + (on ? 'REMOTE' : 'LOCAL'));
      let n = 0;
      const chk = () => {
        const s2 = call(() => dk.dOf(P.d), null);
        if (!s2 || !s2.sig) return;
        if (!!s2.sig[P.sel + ':S'] !== !!on) {
          s2.sig[P.sel + ':S'] = !!on;
          if (window.WORLD && WORLD.live) WORLD.busy = true;
        }
        if (++n < 6) setTimeout(chk, 400);
      };
      setTimeout(chk, 400);
    };
    if (bRem) {
      bRem.onclick = () => !bRem.disabled && ask('FIELD: ' + P.n + ' selector to REMOTE?', () => selSet(true));
      bLoc.onclick = () => !bLoc.disabled && ask('FIELD: ' + P.n + ' selector to LOCAL?', () => selSet(false));
    }
    B.forEach((b, i) => {
      /* [label, row, address] = a push button (a pulse); [label, row, address, 'set', 1 / 0] = a maintained HMI switch of the drawing set
         or reset (DITL-LS212 ISOLATING VALVE A~H OPEN/CLOSE SW; WORLD.dset, an engine action) */
      const [l, r, ad, k, v, pd] = P.pbs[i],
        d = pd || P.d;
      b.onclick = () =>
        !b.disabled &&
        ask(P.n + ' ' + l + '?', () => (k === 'set' && window.WORLD && WORLD.dset ? WORLD.dset(d, r, !!v) : dk.dpress(d, r), i === 0 && !P.free && !noSt && (sent = Date.now()), call(() => window.lsEventAdd(d, 'DCS', 'Operator: ' + P.n + ' ' + l + ' (' + d + ' row ' + (r + 1) + ' · ' + ad + (k === 'set' ? ' = ' + (v ? 1 : 0) : '') + ', faceplate)'))));
    });
    /* Rosé 2026-11-22 (live test finding 3): P.need = [{ d, row, l }] output rows of a drawing that the first command needs (the
       sootblower BLOWING PERMISSIVE, DITL-80A out 20). The button stays a real press to the logic; while a row is 0 the faceplate says
       "not permitted" and why, and a press that the logic did not take (no status after 3 s) says so instead of nothing */
    let sent = 0;
    const needMiss = () => (P.need || []).filter(x => call(() => dk.dout(x.d, x.row), null) === 0);
    let k0 = '';
    function tick() {
      if (!me.isConnected) return closeEl(me);
      /* P.away = { d, row }: a retract limit switch of the drawing (a sootblower: DITL-80G row 12 ZSR-N1011, or its own copy of DITL-80G):
         the machine is in operation while its lance is out of the retract position, also when it was started by hand (MANUAL mode), where
         the OPERATING lamp of the AUTO program (DITL-80A) stays off */
      const aw = P.away && call(() => dk.dOf(P.away.d) || ((window.WORLD && WORLD.inst) || []).find(x => x.name.endsWith(P.away.d)), null),
        /* beta.556: st.d = the state row stands on another drawing than the push buttons; st.inv = the row is 1 while the machine waits */
        on = !noSt && (call(() => dk.dout(P.st.d || P.d, P.st.row), null) === (P.st.inv ? 0 : 1) || (!!aw && call(() => window.DUI.rowVal(aw, P.away.row), null) === 0)),
        run = isRun(),
        pv = (P.perm || []).map(p => ({ ...p, v: call(() => window.DUI.rowVal(s, p.row), null) })),
        ok = !pv.length || pv.some(p => p.v === 1);
      F.lamp.className = 'fpo-lamp' + (noSt ? '' : on ? ' run' : ' stop');
      setTx(F.val, on ? P.st.on : P.st.off || 'STOPPED');
      lOn.className = 'fpo-lp' + (on ? ' run' : '');
      lOff.className = 'fpo-lp' + (!on ? ' stop' : '');
      const rem = P.sel == null ? true : call(() => window.DUI.rowVal(s, P.sel), null) === 1;
      if (bRem) {
        bRem.disabled = rem || !run;
        bLoc.disabled = !rem || !run;
        bRem.classList.toggle('on', rem);
        bLoc.classList.toggle('on', !rem);
      }
      /* live Cold start F10b: P.free = every button is its own press (igniter / burner ON / OFF): the status (REMOTE) does not lock or
         light the first one */
      B[0].disabled = P.free ? !run : noSt ? !run || !ok : on || !run || !ok;
      /* design review 2026-11-08 (Yuna): the second push button is the STOP of the first only when it says so (STOP / CLOSE / AUTO STOP).
         Another command (the SKIP of a sootblower, DITL-80x row r + 1) is its own press: enabled in RUN, not lit green as a "stopped" */
      if (B[1]) {
        const isStop = !P.free && !noSt && /\b(STOP|CLOSE)\b/.test(P.pbs[1][0]);
        B[1].disabled = !run || (isStop && (!on || !rem));
        B[1].classList.toggle('lit-stop', isStop && !on);
      }
      B[0].classList.toggle('lit-run', on && !P.free);
      if (on) sent = 0;
      const nm = on || P.free ? [] : needMiss(),
        late = sent && Date.now() - sent > 3000;
      if (sent && Date.now() - sent > 20000) sent = 0;
      why.textContent = !run
        ? 'Simulation PAUSED: press ▶ RUN first (nothing moves while paused).'
        : !ok && !on
          ? P.pbs[0][0] + ' blocked: no ' + (P.permWhy || 'permissive') + '.'
          : nm.length
            ? (late ? P.pbs[0][0] + ' sent, NOT PERMITTED by the logic: no ' : P.pbs[0][0] + ' not permitted: no ') + nm.map(x => x.l + ' [' + x.d + ' out row ' + (x.row + 1) + ']').join('; ') + '.'
            : late
              ? P.pbs[0][0] + ' sent, but the logic did not start it (no ' + P.st.on + ' status after 3 s). Open Logic ' + P.d + ' to see the missing input.'
              : '';
      why.hidden = !why.textContent;
      for (const [v, f] of V) {
        const x = call(f, null);
        setTx(v, x == null || !isFinite(+x) ? '-----' : (+x).toFixed(0));
      }
      const k = pv.map(p => p.v).join();
      if (k !== k0) {
        k0 = k;
        ilL.replaceChildren(...pv.map(p => {
          const li = E('li', ok ? 'ok' : 'bad');
          li.append(E('i', '', p.v == null ? '-' : String(p.v)), E('span', '', p.l), E('em', '', 'row ' + (p.row + 1))); /* the row number of the drawing (1-based, as the dock) */
          return li;
        }));
      }
    }
    paint = tick;
    tick();
    place(me);
    me._iv = setInterval(tick, 500);
    return true;
  }
  /* tracker e1 (user 2026-11-10: a cold start without Training): a field item that only the Training dock could set had no control on
     the HMI. A small FIELD pop-out: its state (two lamps) and the field operator's actions, each asked first (EXECUTE / CANCEL) and logged
     in Events as "Field operator", the same calls as the Training dock. P = { n, t, d, io, why, use, lamps: [on, off], st: () => true |
     false | null, val: () => text, acts: [[label, fn, cur: () => bool, question, 'stop' = green when current]] } */
  function fset(P) {
    if (!P || !P.acts || !P.acts.length) return false;
    const F = frame(P.n, (P.t || '') + ' · ' + (P.d || 'field'));
    const me = box;
    F.hd.querySelector('.fpo-tt').append(E('span', 'fpo-chip', 'FIELD'));
    const L = P.lamps || ['ON', 'OFF'],
      lO = lampEl(L[0]),
      lC = lampEl(L[1]);
    F.bd.append(row('STATUS', lO, lC));
    const why = E('div', 'fpo-why', P.why || '');
    if (P.why) F.bd.append(why);
    const B = P.acts.map(a => {
      const b = E('button', 'fpo-cmd', a[0]);
      b.type = 'button';
      return [a, b];
    });
    for (let i = 0; i < B.length; i += 2) F.bd.append(row(i ? '' : 'FIELD', ...B.slice(i, i + 2).map(x => x[1])));
    const ex = E('div', 'fpo-ex'),
      exT = E('span'),
      exGo = E('button', 'fpo-go', 'EXECUTE'),
      exNo = E('button', '', 'CANCEL');
    exGo.type = exNo.type = 'button';
    ex.classList.add('fld');
    ex.append(exT, exGo, exNo);
    ex.hidden = true;
    F.bd.append(ex);
    let pend = null;
    exNo.onclick = () => ((pend = null), (ex.hidden = true));
    exGo.onclick = () => {
      const f = pend;
      pend = null;
      ex.hidden = true;
      if (f) f();
      setTimeout(tick, 150);
    };
    for (const [a, b] of B)
      b.onclick = () => {
        if (b.disabled) return;
        pend = () => (a[1](), call(() => window.lsEventAdd(P.d || 'FIELD', 'FIELD', 'Field operator: ' + P.n + ' ' + a[0] + ' (faceplate)')));
        setTx(exT, a[3] || 'FIELD: ' + P.n + ' ' + a[0] + '?');
        ex.hidden = false;
        exGo.focus();
      };
    const msg = E('div', 'fpo-why');
    F.bd.append(msg);
    if (P.use) F.bd.append(E('div', 'fpo-dim', P.use));
    const ln = E('div', 'fpo-ln');
    if (P.io) {
      const a = E('button', 'fpo-a', 'Info');
      a.type = 'button';
      a.onclick = () => call(() => window.lsInfo(P.io));
      ln.append(a);
    }
    const ev = E('button', 'fpo-a', 'Events');
    ev.type = 'button';
    ev.onclick = () => call(() => document.getElementById('evbtn').click());
    ln.append(ev);
    F.bd.append(ln);
    function tick() {
      if (!me.isConnected) return closeEl(me);
      const st = call(P.st, null),
        run = isRun();
      F.lamp.className = 'fpo-lamp ' + (st === true ? 'run' : st === false ? 'stop' : '');
      setTx(F.val, call(P.val, null) || (st === true ? L[0] : st === false ? L[1] : '-----'));
      lO.className = 'fpo-lp' + (st === true ? ' run' : '');
      lC.className = 'fpo-lp' + (st === false ? ' stop' : '');
      for (const [a, b] of B) {
        const cur = !!call(a[2], false);
        b.disabled = !run || cur;
        b.classList.toggle(a[4] === 'stop' ? 'lit-stop' : 'lit-run', cur);
      }
      setTx(msg, run ? '' : 'Simulation PAUSED: press ▶ RUN first (nothing moves while paused).');
      msg.hidden = !msg.textContent;
    }
    paint = tick;
    tick();
    place(me);
    me._iv = setInterval(tick, 500);
    return true;
  }
  /* live test #44: a machine with no DCS command (hypochlorite pumps P-0761 / P-0762: STN105 running / overload DI only) = a small status
     pop-out: what it is, where it is run (local panel), its state; FIELD START / STOP only for the one the plant model runs (the field
     operator, logged as such, the same call as the dock). P = { n, t, d, io, why, st: () => 'RUN' | 'STOP' | null, fld: (on) => void } */
  function field(P) {
    if (!P) return false;
    const F = frame(P.n, (P.t || '') + ' · ' + (P.d || 'field'));
    const me = box;
    const lR = lampEl('RUN'),
      lS = lampEl('STOP'),
      lT = lampEl('TRIP');
    F.bd.append(P.trip ? row('STATUS', lR, lS, lT) : row('STATUS', lR, lS));
    F.bd.append(E('div', 'fpo-why', P.why || 'Field equipment: no DCS command. Started at the local panel.'));
    let bSt = null,
      bSp = null,
      bTr = null,
      bRs = null,
      ex = null;
    if (P.fld) {
      bSt = E('button', 'fpo-cmd', 'START');
      bSp = E('button', 'fpo-cmd', 'STOP');
      bSt.type = bSp.type = 'button';
      F.bd.append(row('FIELD', bSt, bSp));
      ex = E('div', 'fpo-ex');
      const exT = E('span'),
        exGo = E('button', 'fpo-go', 'EXECUTE'),
        exNo = E('button', '', 'CANCEL');
      exGo.type = exNo.type = 'button';
      ex.append(exT, exGo, exNo);
      ex.hidden = true;
      F.bd.append(ex);
      let pend = null;
      const ask = (t, f) => ((pend = f), (exT.textContent = t), (ex.hidden = false), exGo.focus());
      exNo.onclick = () => ((pend = null), (ex.hidden = true));
      exGo.onclick = () => {
        const f = pend;
        pend = null;
        ex.hidden = true;
        if (f) f();
        setTimeout(tick, 150);
      };
      const go = on => (P.fld(on), call(() => window.lsEventAdd('FIELD', 'FIELD', 'Field operator: ' + (on ? 'START ' : 'STOP ') + P.n + ' (local panel)')));
      bSt.onclick = () => !bSt.disabled && ask('FIELD: START ' + P.n + ' at the local panel?', () => go(true));
      bSp.onclick = () => !bSp.disabled && ask('FIELD: STOP ' + P.n + ' at the local panel?', () => go(false));
      /* live test 2026-11-05 (air compressors of INSTRUMENT AND PLANT AIR: started at the local panel, the DCS reads RUNNING / TRIP):
         P.trip(on) = the TRIP contact of the local panel (a protection trip of the test tool, RESET = back to 0) */
      if (P.trip) {
        bTr = E('button', 'fpo-cmd', 'TRIP');
        bRs = E('button', 'fpo-cmd', 'RESET');
        bTr.type = bRs.type = 'button';
        F.bd.insertBefore(row('RELAY', bTr, bRs), ex);
        const tr = on => (P.trip(on), call(() => window.lsEventAdd('FIELD', 'FIELD', 'Field operator: ' + (on ? 'TRIP ' : 'RESET the trip of ') + P.n + ' (local panel)')));
        bTr.onclick = () => !bTr.disabled && ask('FIELD: TRIP ' + P.n + ' at its protection relay?', () => tr(true));
        bRs.onclick = () => !bRs.disabled && ask('FIELD: RESET the trip of ' + P.n + '?', () => tr(false));
      }
    }
    const ln = E('div', 'fpo-ln');
    if (P.io) {
      const a = E('button', 'fpo-a', 'I/O list');
      a.type = 'button';
      a.onclick = () => call(() => window.lsInfo(P.io));
      ln.append(a);
    }
    const ev = E('button', 'fpo-a', 'Events');
    ev.type = 'button';
    ev.onclick = () => call(() => document.getElementById('evbtn').click());
    ln.append(ev);
    F.bd.append(ln);
    function tick() {
      if (!me.isConnected) return closeEl(me);
      const st = call(P.st, null),
        run = isRun();
      F.lamp.className = 'fpo-lamp ' + (st === 'RUN' ? 'run' : st === 'STOP' ? 'stop' : st === 'TRIP' ? 'trip' : '');
      setTx(F.val, st === 'RUN' ? 'RUNNING' : st === 'STOP' ? 'STOPPED' : st === 'TRIP' ? 'TRIP' : '-----');
      lR.className = 'fpo-lp' + (st === 'RUN' ? ' run' : '');
      lS.className = 'fpo-lp' + (st === 'STOP' ? ' stop' : '');
      lT.className = 'fpo-lp' + (st === 'TRIP' ? ' trip' : '');
      if (bSt) {
        bSt.disabled = st === 'RUN' || st === 'TRIP' || !run;
        bSp.disabled = st !== 'RUN' || !run;
        if (bTr) {
          bTr.disabled = st !== 'RUN' || !run;
          bRs.disabled = st !== 'TRIP' || !run;
        }
        bSt.classList.toggle('lit-run', st === 'RUN');
        bSp.classList.toggle('lit-stop', st === 'STOP');
      }
    }
    paint = tick;
    tick();
    place(me);
    me._iv = setInterval(tick, 500);
    return true;
  }
  /* 3.2.1 (mockup pages, hmi-mock.js): a pump the TCS runs (036 turbine oil: tcs.js TCS_OIL), the same commands as the TCS OPERATION
     box of the old 036 page. P = { n, t, d, why, st: () => 'RUN' | 'STOP' | null, au: () => true | false | null (no AUTO / MANUAL when
     absent), cmd: op ('start' | 'stop' | 'auto' | 'man') => '' or the reason it was refused } */
  function tcs(P) {
    if (!P) return false;
    const F = frame(P.n, (P.t || '') + ' · ' + (P.d || 'TCS'));
    const me = box;
    F.hd.querySelector('.fpo-tt').append(E('span', 'fpo-chip', 'TCS'));
    const lR = lampEl('RUN'),
      lS = lampEl('STOP');
    F.bd.append(row('STATUS', lR, lS));
    const mk = t => {
      const b = E('button', 'fpo-cmd', t);
      b.type = 'button';
      return b;
    };
    const bA = P.au ? mk('AUTO') : null,
      bM = P.au ? mk('MAN') : null,
      bSt = mk('START'),
      bSp = mk('STOP');
    if (P.au) F.bd.append(row('MODE', bA, bM));
    F.bd.append(row('TCS', bSt, bSp));
    const msg = E('div', 'fpo-why', P.why || 'Turbine control system (TCS) operation of the plant model.');
    F.bd.append(msg);
    const ex = E('div', 'fpo-ex'),
      exT = E('span'),
      exGo = E('button', 'fpo-go', 'EXECUTE'),
      exNo = E('button', '', 'CANCEL');
    exGo.type = exNo.type = 'button';
    ex.append(exT, exGo, exNo);
    ex.hidden = true;
    F.bd.insertBefore(ex, msg);
    let pend = null;
    const L = { start: 'START', stop: 'STOP', auto: 'AUTO', man: 'MANUAL' };
    const ask = op => ((pend = op), (exT.textContent = 'TCS: ' + L[op] + ' ' + P.n + '?'), (ex.hidden = false), exGo.focus());
    exNo.onclick = () => ((pend = null), (ex.hidden = true));
    exGo.onclick = () => {
      const op = pend;
      pend = null;
      ex.hidden = true;
      if (!op) return;
      const r = call(() => P.cmd(op), 'no plant model') || '';
      setTx(msg, r ? '⚠ ' + r : P.n + ' ' + L[op] + ': EXECUTED');
      if (!r) call(() => window.lsEventAdd('TCS', 'DCS', 'Operator (TCS): ' + P.n + ' ' + (P.t || '') + ' ' + L[op]));
      setTimeout(tick, 150);
    };
    bSt.onclick = () => !bSt.disabled && ask('start');
    bSp.onclick = () => !bSp.disabled && ask('stop');
    if (bA) (bA.onclick = () => !bA.disabled && ask('auto')), (bM.onclick = () => !bM.disabled && ask('man'));
    const ln = E('div', 'fpo-ln'),
      ev = E('button', 'fpo-a', 'Events');
    ev.type = 'button';
    ev.onclick = () => call(() => document.getElementById('evbtn').click());
    ln.append(ev);
    F.bd.append(ln);
    function tick() {
      if (!me.isConnected) return closeEl(me);
      const st = call(P.st, null),
        au = P.au ? call(P.au, null) : null,
        run = isRun();
      F.lamp.className = 'fpo-lamp ' + (st === 'RUN' ? 'run' : st === 'STOP' ? 'stop' : '');
      setTx(F.val, st === 'RUN' ? 'RUNNING' : st === 'STOP' ? 'STOPPED' : '-----');
      lR.className = 'fpo-lp' + (st === 'RUN' ? ' run' : '');
      lS.className = 'fpo-lp' + (st === 'STOP' ? ' stop' : '');
      bSt.disabled = st == null || st === 'RUN' || !run;
      bSp.disabled = st == null || st !== 'RUN' || !run;
      bSt.classList.toggle('lit-run', st === 'RUN');
      bSp.classList.toggle('lit-stop', st === 'STOP');
      if (bA) {
        bA.disabled = au == null || au || !run;
        bM.disabled = au == null || !au || !run;
        bA.classList.toggle('lit-run', au === true);
        bM.classList.toggle('lit-stop', au === false);
      }
    }
    paint = tick;
    tick();
    place(me);
    me._iv = setInterval(tick, 500);
    return true;
  }
  /* lane 6 (EIMI): a device of a package panel (its own PLC, on the DCS by Modbus: precipitator, fly ash, tube cleaning). STATUS lamps,
     the REMOTE / LOCAL selector at the panel (the field operator), AUTO / MAN, the buttons, the settings of the panel with their range, the
     fault with its RESET. Every press is asked (EXECUTE / CANCEL) and goes to P.cmd(op, value): '' = done, else the reason it was refused.
     P = { n: name, t: tag, d: panel, why, lamps: [on, off], st / flt / sel / au: () => 1 | 0 | null, fltWord, reset: true, free: no selector
       needed, again: a lit button may be pressed again, cmds: [[label, op, lit word 'run' | 'stop' | '', () => lit, value]],
       sets: [{ l, unit, max, dp, op, get: () => value }], cmd } */
  function pkg(P) {
    if (!P) return false;
    const F = frame(P.n, (P.t ? P.t + ' · ' : '') + (P.d || ''));
    const me = box;
    F.hd.querySelector('.fpo-tt').append(E('span', 'fpo-chip', P.chip || 'PANEL'));
    const W = P.lamps || ['RUN', 'STOP'],
      lR = lampEl(W[0]),
      lS = lampEl(W[1]),
      lF = P.flt ? lampEl(P.fltWord || 'FAULT') : null;
    if (P.st) F.bd.append(lF ? row('STATUS', lR, lS, lF) : row('STATUS', lR, lS));
    const mk = t => {
      const b = E('button', 'fpo-cmd', t);
      b.type = 'button';
      return b;
    };
    const [selS, [bRm, bLc]] = P.sel ? seg(['REMOTE', 'LOCAL']) : [null, []];
    if (P.sel) F.bd.append(row('SELECTOR', selS, E('span', 'fpo-fld', 'FIELD')));
    const bA = P.au ? mk('AUTO') : null,
      bM = P.au ? mk('MAN') : null;
    if (P.au) F.bd.append(row('MODE', bA, bM));
    const C = (P.cmds || []).map(c => [c, mk(c[0])]);
    for (let i = 0; i < C.length; i += 2) F.bd.append(row(i ? '' : 'CONTROL', ...C.slice(i, i + 2).map(x => x[1])));
    const bR = P.reset ? mk('RESET') : null;
    if (bR) F.bd.append(row('FAULT', bR));
    const sets = (P.sets || []).map(s => {
      const v = E('span', 'fpo-vb'),
        inp = E('input', 'fpo-inp'),
        b = E('button', '', 'SET');
      inp.type = 'number';
      inp.min = 0;
      inp.max = s.max;
      inp.step = 'any';
      inp.setAttribute('aria-label', s.l + ', new value, ' + s.unit);
      b.type = 'button';
      const r = row(s.l, v, E('small', 'fpo-dim', s.unit), inp, b);
      r.classList.add('set');
      F.bd.append(r);
      b.onclick = () => {
        const x = inp.value.trim() === '' ? NaN : +inp.value;
        if (!isFinite(x) || x < 0 || x > s.max) {
          msg.hidden = false;
          return setTx(msg, '⚠ ' + s.l + ': type a value from 0 to ' + s.max + ' ' + s.unit + '.');
        }
        ask(s.op, x, s.l + ' ' + x + ' ' + s.unit);
      };
      return [s, v];
    });
    const ex = E('div', 'fpo-ex'),
      exT = E('span'),
      exGo = E('button', 'fpo-go', 'EXECUTE'),
      exNo = E('button', '', 'CANCEL');
    exGo.type = exNo.type = 'button';
    ex.append(exT, exGo, exNo);
    ex.hidden = true;
    const msg = E('div', 'fpo-why', P.why || '');
    msg.hidden = !P.why;
    F.bd.append(ex, msg);
    let pend = null;
    const ask = (op, v, word, fld) => {
      pend = [op, v, word, fld];
      setTx(exT, (fld ? 'FIELD: ' : '') + P.n + ': ' + word + '?');
      ex.classList.toggle('fld', !!fld);
      ex.hidden = false;
      exGo.focus();
    };
    exNo.onclick = () => ((pend = null), (ex.hidden = true));
    exGo.onclick = () => {
      const q = pend;
      pend = null;
      ex.hidden = true;
      if (!q) return;
      const r = call(() => P.cmd(q[0], q[1]), 'no plant model') || '';
      msg.hidden = false;
      setTx(msg, r ? '⚠ Refused: ' + r + '.' : P.n + ': ' + q[2] + ' EXECUTED');
      if (!r)
        call(() =>
          window.lsEventAdd(P.d || 'PANEL', q[3] ? 'FIELD' : 'DCS', (q[3] ? 'Field operator: ' : 'Operator: ') + P.n + (P.t ? ' ' + P.t : '') + ' ' + q[2] + ' (faceplate)')
        );
      setTimeout(tick, 150);
    };
    if (P.sel) {
      bRm.onclick = () => ask('rem', 1, 'selector REMOTE', true);
      bLc.onclick = () => ask('rem', 0, 'selector LOCAL', true);
    }
    if (bA) {
      bA.onclick = () => ask('auto', 0, 'AUTO');
      bM.onclick = () => ask('man', 0, 'MANUAL');
    }
    for (const [c, b] of C) b.onclick = () => ask(c[1], c[4], c[0]);
    if (bR) bR.onclick = () => ask('reset', 0, 'RESET');
    const ln = E('div', 'fpo-ln'),
      ev = E('button', 'fpo-a', 'Events');
    ev.type = 'button';
    ev.onclick = () => call(() => document.getElementById('evbtn').click());
    ln.append(ev);
    F.bd.append(ln);
    function tick() {
      if (!me.isConnected) return closeEl(me);
      const st = P.st ? call(P.st, null) : null,
        fl = P.flt ? call(P.flt, null) : null,
        sl = P.sel ? call(P.sel, null) : 1,
        au = P.au ? call(P.au, null) : null,
        go = isRun();
      F.lamp.className = 'fpo-lamp ' + (fl ? 'trip' : st == null ? '' : st ? 'run' : 'stop');
      setTx(F.val, P.st ? (fl ? P.fltWord || 'FAULT' : st == null ? '-----' : st ? W[0] : W[1]) : '');
      lR.className = 'fpo-lp' + (st ? ' run' : '');
      lS.className = 'fpo-lp' + (st != null && !st ? ' stop' : '');
      if (lF) lF.className = 'fpo-lp' + (fl ? ' trip' : '');
      if (P.sel) {
        bRm.classList.toggle('on', !!sl);
        bLc.classList.toggle('on', sl != null && !sl);
        bRm.disabled = sl == null || !!sl || !go;
        bLc.disabled = !sl || !go;
      }
      if (bA) {
        bA.disabled = au == null || !!au || !sl || !go;
        bM.disabled = !au || !sl || !go;
        bA.classList.toggle('lit-run', !!au);
        bM.classList.toggle('lit-stop', au != null && !au);
      }
      for (const [c, b] of C) {
        const lit = c[3] ? !!call(c[3], null) : c[1] === 'start' ? !!st : c[1] === 'stop' ? st != null && !st : false;
        b.classList.toggle('lit-run', lit && c[2] !== 'stop' && c[1] !== 'stop');
        b.classList.toggle('lit-stop', lit && (c[2] === 'stop' || c[1] === 'stop'));
        b.disabled = !go || (!P.free && !sl) || !!au || (lit && !P.again);
      }
      if (bR) bR.disabled = !go || !fl;
      for (const [s, v] of sets) {
        const x = call(s.get, null);
        setTx(v, x == null || !isFinite(x) ? '-----' : (+x).toFixed(s.dp == null ? 1 : s.dp));
      }
    }
    paint = tick;
    tick();
    place(me);
    me._iv = setInterval(tick, 500);
    return true;
  }
  /* 1.0.0-beta.365 D18 (Rosé, user "Go ayos"): a machine or valve of an IBD sheet of the TCS soft logic 331DM09784 (tcs-trip.js
     TCS_IBD_PBN). Each button is a push button of the sheet (AN.turbine('ibd', { id, pb }), a 1.5 s pulse on its net), nothing else.
     STATUS / MODE are the flags the sheet writes (TCS_IBD_DEV post: U.tc, or U.tco with no ATS program), the PERMISSIVE rows are live
     nets of the sheet (AN.tcsIbd). These sheets have no REMOTE / LOCAL selector; a "(LOCAL) PB" of the sheet (TB-9 JOG) is the field
     operator's button at the machine. P = { n, t, sh, valve, why, st: flag, au: flag | null, cmds: [pb], field: [pb],
     need: { pb: [[net, label, want]] } } */
  function ibd(P) {
    if (!P) return false;
    const F = frame(P.n, (P.t && P.t !== P.sh ? P.t + ' · ' : '') + P.sh);
    const me = box;
    F.hd.querySelector('.fpo-tt').append(E('span', 'fpo-chip', 'TCS'));
    const on = P.valve ? 'OPEN' : 'RUN',
      off = P.valve ? 'CLOSED' : 'STOP';
    const lOn = lampEl(on),
      lOff = lampEl(off);
    F.bd.append(row('STATUS', lOn, lOff));
    const mk = t => {
      const b = E('button', 'fpo-cmd', t);
      b.type = 'button';
      b.title = 'IBD ' + P.sh + ' push button ' + t;
      return b;
    };
    const has = pb => (P.cmds || []).includes(pb);
    const bA = has('AUTO') ? mk('AUTO') : null,
      bM = has('MANUAL') ? mk('MANUAL') : null;
    if (bA || bM) F.bd.append(row('MODE', ...[bA, bM].filter(Boolean)));
    const C = (P.cmds || []).filter(pb => pb !== 'AUTO' && pb !== 'MANUAL').map(pb => [pb, mk(pb)]);
    F.bd.append(row('TCS', ...C.map(x => x[1])));
    const FL = (P.field || []).map(pb => [pb, mk(pb)]);
    if (FL.length) F.bd.append(row('LOCAL', ...FL.map(x => x[1])));
    const msg = E('div', 'fpo-why', P.why || '');
    msg.hidden = !P.why;
    F.bd.append(msg);
    const ex = E('div', 'fpo-ex'),
      exT = E('span'),
      exGo = E('button', 'fpo-go', 'EXECUTE'),
      exNo = E('button', '', 'CANCEL');
    exGo.type = exNo.type = 'button';
    ex.append(exT, exGo, exNo);
    ex.hidden = true;
    F.bd.insertBefore(ex, msg);
    const first = C[0] && C[0][0];
    const ilH = E('div', 'fpo-sh', 'PERMISSIVE · IBD ' + P.sh + ' ' + (first || '')),
      ilL = E('ul', 'fpo-il');
    const shown = (P.need && P.need[first]) || [];
    if (shown.length) F.bd.append(ilH, ilL);
    let pend = null;
    const ask = (pb, loc) => (
      (pend = [pb, loc]),
      (exT.textContent = (loc ? 'FIELD: ' : 'TCS: ') + pb + ' ' + P.n + '?'),
      (ex.hidden = false),
      exGo.focus()
    );
    exNo.onclick = () => ((pend = null), (ex.hidden = true));
    exGo.onclick = () => {
      const p = pend;
      pend = null;
      ex.hidden = true;
      if (!p) return;
      const r = call(() => (AN.unit && AN.unit.on ? AN.turbine('ibd', { id: P.sh, pb: p[0] }) : 'no plant model: choose Cold or 150 MW (Plant model ON)'), 'no plant model') || '';
      setTx(msg, r ? '⚠ ' + r : P.n + ' ' + p[0] + ': EXECUTED');
      msg.hidden = false;
      if (!r)
        call(() =>
          window.lsEventAdd('TCS ' + P.sh, 'DCS', (p[1] ? 'Field operator: ' : 'Operator (TCS): ') + P.n + ' ' + (P.t || '') + ' ' + p[0] + ' (IBD ' + P.sh + ' push button)')
        );
      setTimeout(tick, 150);
    };
    [...C, ...FL, ...(bA ? [['AUTO', bA]] : []), ...(bM ? [['MANUAL', bM]] : [])].forEach(([pb, b]) => {
      b.onclick = () => !b.disabled && ask(pb, FL.some(x => x[1] === b));
    });
    const ln = E('div', 'fpo-ln');
    const link = (t, f) => {
      const a = E('button', 'fpo-a', t);
      a.type = 'button';
      a.onclick = f;
      ln.append(a);
    };
    const dk = D();
    if (dk) link('Logic IBD ' + P.sh, () => (close(), logicGo(dk, 'TCS-' + P.sh)));
    link('Events', () => call(() => document.getElementById('evbtn').click()));
    F.bd.append(ln);
    const dev = () => call(() => (AN.unit && AN.unit.on ? AN.unit.tc || AN.unit.tco : null), null);
    const nets = () => call(() => (AN.tcsIbd(P.sh) || {}).v || null, null);
    const okOf = (v, n) => n.every(([k, , w]) => !!v && (v[k] > 0.5 ? 1 : 0) === (w == null ? 1 : w));
    let k0 = '';
    function tick() {
      if (!me.isConnected) return closeEl(me);
      const c = dev(),
        v = nets(),
        run = isRun(),
        st = c ? !!c[P.st] : null,
        au = c && P.au ? !!c[P.au] : null;
      F.lamp.className = 'fpo-lamp ' + (st === true ? 'run' : st === false ? 'stop' : '');
      setTx(F.val, st == null ? '-----' : P.valve ? (st ? 'OPEN' : 'CLOSED') : st ? 'RUNNING' : 'STOPPED');
      lOn.className = 'fpo-lp' + (st === true ? ' run' : '');
      lOff.className = 'fpo-lp' + (st === false ? ' stop' : '');
      const live = st != null && run;
      for (const [pb, b] of [...C, ...FL]) {
        const isOn = /^(START|OPEN|JOG)$/.test(pb);
        b.disabled = !live || (pb !== 'JOG' && (isOn ? st : !st)) || !okOf(v, (P.need && P.need[pb]) || []);
        b.classList.toggle('lit-run', isOn && pb !== 'JOG' && st === true);
        b.classList.toggle('lit-stop', !isOn && st === false);
      }
      if (bA) {
        bA.disabled = !live || au === true;
        bA.classList.toggle('lit-run', au === true);
      }
      if (bM) {
        bM.disabled = !live || au === false;
        bM.classList.toggle('lit-stop', au === false);
      }
      const k = shown.map(([n]) => (v ? v[n] : '-')).join();
      if (k !== k0) {
        k0 = k;
        ilL.replaceChildren(
          ...shown.map(([n, l, w]) => {
            /* Y = the condition of the row holds (a "No ... TROUBLE" row: its net is 0), N = it does not */
            const x = v ? (v[n] > 0.5 ? 1 : 0) : null,
              y = x == null ? null : x === (w == null ? 1 : w),
              li = E('li', y == null ? '' : y ? 'ok' : 'bad');
            li.append(E('i', '', y == null ? '-' : y ? 'Y' : 'N'), E('span', '', l), E('em', '', 'net ' + n));
            return li;
          })
        );
      }
    }
    paint = tick;
    tick();
    place(me);
    me._iv = setInterval(tick, 500);
    return true;
  }
  /* 3.2.1-beta.12: a MOV / XV of a DITL sheet (mockup pages): POSITION, OPEN / CLOSED, REMOTE / AUTO, and its CRT push buttons
     (the input rows of the sheet: OPEN, CLOSE, STOP, ISOLATE, REINSTATE ...); each press asks EXECUTE / CANCEL, then presses the row */
  function mov(P) {
    if (!P) return false;
    const F = frame(P.n, (P.t || '') + ' · ' + (P.d || 'DITL'));
    const me = box;
    F.hd.querySelector('.fpo-tt').append(E('span', 'fpo-chip', P.d || 'DITL'));
    const lO = lampEl('OPEN'),
      lC = lampEl('CLOSED'),
      pv = E('span', 'fpo-v', '-----'),
      md = E('span', 'fpo-v', '-----');
    F.bd.append(row('POSITION', pv), row('STATUS', lO, lC), row('MODE', md));
    /* live test 2026-11-05 (028 CONDENSATE at Cold: every MOV LOCAL, nothing could put one in REMOTE): P.sel(on) = the field operator
       turns the REMOTE / LOCAL selector at the valve (the REMOTE input rows of its drawing); the CRT push buttons need REMOTE */
    let bRem = null,
      bLoc = null;
    if (P.sel) {
      bRem = E('button', 'fpo-cmd', 'REMOTE');
      bLoc = E('button', 'fpo-cmd', 'LOCAL');
      bRem.type = bLoc.type = 'button';
      F.bd.append(row('FIELD SELECTOR', bRem, bLoc));
      bRem.onclick = () => !bRem.disabled && ask({ l: 'selector to REMOTE', q: 'FIELD: ' + P.n + ' selector to REMOTE?', fn: () => P.sel(true) });
      bLoc.onclick = () => !bLoc.disabled && ask({ l: 'selector to LOCAL', q: 'FIELD: ' + P.n + ' selector to LOCAL?', fn: () => P.sel(false) });
    }
    const I0 = call(P.info, null) || { pbs: [] },
      btns = I0.pbs.map(p => {
        const b = E('button', 'fpo-cmd', p.l);
        b.type = 'button';
        b.onclick = () => !b.disabled && ask(p);
        b._pb = p;
        return b;
      }),
      bMode = btns.filter(b => b._pb.sel != null),
      bCmd = btns.filter(b => b._pb.sel == null);
    if (bMode.length) F.bd.append(row('AUTO / MANUAL', ...bMode));
    if (bCmd.length) F.bd.append(row('COMMAND', ...bCmd));
    const msg = E('div', 'fpo-why', btns.length ? 'Push buttons of the DCS screen (CRT), read from the DITL sheet ' + (P.d || '') + '.' : 'No CRT push button on the DITL sheet ' + (P.d || '') + '.');
    F.bd.append(msg);
    const ex = E('div', 'fpo-ex'),
      exT = E('span'),
      exGo = E('button', 'fpo-go', 'EXECUTE'),
      exNo = E('button', '', 'CANCEL');
    exGo.type = exNo.type = 'button';
    ex.append(exT, exGo, exNo);
    ex.hidden = true;
    F.bd.insertBefore(ex, msg);
    let pend = null;
    function ask(p) {
      pend = p;
      setTx(exT, p.q || p.l + ' ' + P.n + '?');
      ex.hidden = false;
      exGo.focus();
    }
    exNo.onclick = () => ((pend = null), (ex.hidden = true));
    exGo.onclick = () => {
      const p = pend;
      pend = null;
      ex.hidden = true;
      if (!p) return;
      /* the AUTO / MANUAL selection: a maintained bit of the drawing */
      if (p.sel != null) {
        call(() => P.mode(p.row, p.sel));
        setTx(msg, P.n + ' ' + p.l + ': EXECUTED');
        setTimeout(tick, 150);
        return;
      }
      if (p.fn) {
        call(p.fn);
        setTx(msg, P.n + ' ' + p.l + ': done (field operator)');
        call(() => window.lsEventAdd('FIELD', 'FIELD', 'Field operator: ' + P.n + ' ' + p.l));
        setTimeout(tick, 150);
        return;
      }
      /* live run 2026-11-13 F7: the position before the press (an SOV moves in the same scan: read after, it had "not moved") */
      const p0 = (call(P.info, null) || {}).pos,
        r = call(() => P.press(p.row), 'no logic') || '';
      /* Mina F22, F23, F26: a press is judged by what the valve does, not by the inputs in the moment of the press (FULLY OPEN is 1 when CLOSE
         is pressed and that is no block). A travel command that moves nothing in its time gets the reason; a sequence (ISOLATE, REINSTATE)
         moves its valve only after the bypass: 14 s */
      const hard = typeof r === 'string' && r,
        wait = /^(OPEN|CLOSE)$/.test(p.l) ? 3000 : /^(ISOLATE|REINSTATE)$/.test(p.l) ? 14000 : 0;
      setTx(msg, hard ? '⚠ ' + r : wait ? P.n + ' ' + p.l + ': sent' : P.n + ' ' + p.l + ': EXECUTED');
      if (!hard && wait) {
        const mine = (mov.seq = (mov.seq || 0) + 1);
        setTimeout(() => {
          if (mine !== mov.seq || !me.isConnected) return;
          const p1 = (call(P.info, null) || {}).pos,
            auto = !!(call(P.info, null) || {}).au && bMode.length > 0,
            moved = p0 == null || p1 == null || Math.abs(p1 - p0) > 0.3,
            blk = moved || !P.block ? null : call(() => P.block(p.row), null);
          msg.textContent = moved
            ? P.n + ' ' + p.l + ': EXECUTED'
            : auto
            ? '⚠ ' + p.l + ' not taken: the valve is in AUTO, the logic moves it. Press MANUAL first.'
            : '⚠ ' + p.l + ' not taken: the valve did not move' + (blk && blk.length ? '. The logic asks for: ' + blk.map(x => String(x.svc || '').replace(/^[IMB].S+s+/, '') + (x.want ? '' : ' (must be 0)')).join(', ') : /^(ISOLATE|REINSTATE)$/.test(p.l) ? '. The drawing holds this press for 90 s after the last ISOLATE or REINSTATE; press it again after that' : '. A timer of the drawing can hold the press; try again later');
        }, wait);
      }
      if (!(typeof r === 'string' && r)) call(() => window.lsEventAdd('CRT', 'DCS', 'Operator (CRT): ' + P.n + ' ' + (P.t || '') + ' ' + p.l));
      setTimeout(tick, 150);
    };
    const ln = E('div', 'fpo-ln'),
      ev = E('button', 'fpo-a', 'Events');
    ev.type = 'button';
    ev.onclick = () => call(() => document.getElementById('evbtn').click());
    ln.append(ev);
    F.bd.append(ln);
    function tick() {
      if (!me.isConnected) return closeEl(me);
      const I = call(P.info, null) || {},
        pos = I.pos,
        run = isRun(),
        st = pos == null ? null : pos >= 99.5 ? 'OPEN' : pos <= 0.5 ? 'CLOSED' : 'TRAVEL';
      setTx(pv, pos == null ? '-----' : (+pos).toFixed(1) + ' %');
      F.lamp.className = 'fpo-lamp ' + (pos == null ? '' : pos > 0.5 ? 'run' : 'stop');
      setTx(F.val, st || '-----');
      lO.className = 'fpo-lp' + (pos != null && pos > 0.5 ? ' run' : '');
      lC.className = 'fpo-lp' + (pos != null && pos <= 0.5 ? ' stop' : '');
      setTx(md, [I.rem == null ? '' : I.rem ? 'REMOTE' : 'LOCAL', I.au == null ? '' : I.au ? 'AUTO' : 'MANUAL'].filter(Boolean).join(' · ') || '-----');
      const rem = I.rem == null ? null : !!I.rem /* the drawing gives 0 / 1 */,
        loc = rem === false;
      btns.forEach(b => (b.disabled = !run || (loc && !!P.sel) || (b._pb.sel != null && !!b._pb.sel === !!I.au)));
      bMode.forEach(b => b.classList.toggle('on', !!b._pb.sel === !!I.au));
      if (bRem) {
        bRem.disabled = !run || rem === true;
        bLoc.disabled = !run || rem === false;
        bRem.classList.toggle('on', rem === true);
        bLoc.classList.toggle('on', rem === false);
        if (loc && !pend && !/EXECUTED|done/.test(msg.textContent)) setTx(msg, 'Selector at LOCAL: the DCS push buttons work only in REMOTE. Turn the field selector to REMOTE first.');
        else if (!loc && /^Selector at LOCAL/.test(msg.textContent)) setTx(msg, 'Push buttons of the DCS screen (CRT), read from the DITL sheet ' + (P.d || '') + '.');
      }
    }
    paint = tick;
    tick();
    place(me);
    me._iv = setInterval(tick, 500);
    return true;
  }
  /* 3.2.1 (IRENE: PLANT MODEL, user 2026-11-04 "Kung ano lng ang mapapakinabangan ntn s simulation"): the useful manual valves of the
     plant model (unit.js AN_SW_V0 / AN_FV0, AN.swValve): the field operator sets the opening; red = open (any opening), green = closed */
  const FVUSE = {
    'V-SW1002': 'SWP-A discharge. SOP 1.4: 10 % at start, then open.',
    'V-SW1004': 'SWP-B discharge. SOP 1.4: 10 % at start, then open.',
    'V-SW1006': 'SWP-C discharge. SOP 1.4: 10 % at start, then open.',
    'V-SW1007': 'Condenser A inlet (SOP 1.7: open).',
    'V-SW1008': 'Condenser B inlet (SOP 1.7: open).',
    'V-SW1009': 'Condenser A outlet. SOP 1.12: 22 % while filling, then 40 % (2.31).',
    'V-SW1010': 'Condenser B outlet. SOP 1.12: 22 % while filling, then 40 % (2.31).',
    'V-SW1016': 'SWBP-A discharge.',
    'V-SW1018': 'SWBP-B discharge.',
    'V-SW1020': 'SWBP-C discharge.',
    'V-CW1002': 'ACWP-A suction. Closed = the pump has no water.',
    'V-CW1004': 'ACWP-B suction. Closed = the pump has no water.',
    'V-CW1007': 'ACWP-A discharge. SOP: 5 % at start, then open until PG-CW1108A reads 7 kg/cm².',
    'V-CW1009': 'ACWP-B discharge. SOP: 5 % at start, then open until PG-CW1108B reads 7 kg/cm².',
    'V-CW1010': 'CCWHE A inlet (closed cooling side). 2 of the 3 CCWHE in service.',
    'V-CW1011': 'CCWHE B inlet (closed cooling side).',
    'V-CW1012': 'CCWHE C inlet (closed cooling side). Standby.',
    'V-CW1013': 'CCWHE A outlet (closed cooling side).',
    'V-CW1014': 'CCWHE B outlet (closed cooling side).',
    'V-CW1015': 'CCWHE C outlet (closed cooling side). Standby.',
    'V-MU0001': 'Demi water tank T-0708A outlet.',
    'V-MU0002': 'Demi water tank T-0708B outlet.',
    'V-MU0003': 'MWP-A suction.',
    'V-MU0004': 'MWP-B suction.',
    'V-MU0005': 'MWP-C suction.',
    'V-MU0007': 'MWP-A discharge.',
    'V-MU0009': 'MWP-B discharge.',
    'V-MU0011': 'MWP-C discharge.',
    'V-MU0013': 'MWP-A minimum flow recirculation (SOP: OPEN).',
    'V-MU0015': 'MWP-B minimum flow recirculation (SOP: OPEN).',
    'V-MU0017': 'MWP-C minimum flow recirculation (SOP: OPEN).',
    'V-MU1031': 'Expansion tank inlet, before XV-MU1109 (SOP: OPEN). With no instrument air XV-MU1109 stays open: close this valve to stop the fill at 1.7 m.',
    'V-MU1032': 'Expansion tank inlet, after XV-MU1109 (SOP: OPEN).',
    'V-IA1101': 'Instrument air to unit 1 (PT-IA1706). Closed = the unit 1 header bleeds down.',
    'V-PA1087': 'Plant air to unit 1 (PT-PA1705). Closed = the unit 1 header bleeds down.',
    'V-PA0013': 'Cross-tie: plant air to the instrument air tanks. Normally closed.',
    /* 3.2.1 (IRENE, for SEULGI boiler.js AN_DO.fv0): the diesel oil line-up, PD-022 1/5 Rev D, PR-OPE-5002 section 20 */
    'V-DO0003': 'Diesel oil service tank T-0701 outlet. Closed = the oil pumps have no oil.',
    'V-DO0004': 'Diesel oil strainer inlet (DPT-DO0001). Closed = no oil to the pumps.',
    'V-DO0015': 'Diesel oil pump A suction.',
    'V-DO0007': 'Diesel oil pump A discharge.',
    'V-DO0016': 'Diesel oil pump B suction.',
    'V-DO0009': 'Diesel oil pump B discharge.',
    /* 3.2.1 (IRENE: FEEDWATER, unit.js AN_FV0) */
    'V-FW1001': 'BFWP-A suction (limit switch ZSO-FW1031). SOP 19.16: fully open. Closed = the pump has no water and cannot start.',
    'V-FW1002': 'BFWP-B suction (limit switch ZSO-FW1032). SOP 19.16: fully open. Closed = the pump has no water and cannot start.'
  };
  const fvAll = () => call(() => (AN.swValves ? AN.swValves() : null), null) || {};
  function fieldPct(tag) {
    if (!(tag in fvAll()) || !window.AN || !AN.swValve) return false;
    const pc = () => +fvAll()[tag] || 0;
    const F = frame(tag, 'Manual valve (field)');
    const me = box;
    F.hd.querySelector('.fpo-tt').append(E('span', 'fpo-chip', 'FIELD'));
    const lO = lampEl('OPEN'),
      lC = lampEl('CLOSED');
    F.bd.append(row('POSITION', lO, lC));
    /* the SOP openings: 5 % (ACWP discharge at start), 10 % (SWP discharge at start), 22 / 40 % (condenser outlets, 1.12 / 2.31) */
    const B = [0, 100, 5, 10, 22, 40, 50, 75].map(v => {
      const b = E('button', 'fpo-cmd', v === 0 ? 'CLOSE' : v === 100 ? 'OPEN' : v + ' %');
      b.type = 'button';
      b.onclick = () => !b.disabled && set(v);
      return [v, b];
    });
    /* two buttons per row (the width of the faceplate) */
    /* live test 2026-11-05: OPEN under the OPEN lamp, CLOSE under CLOSED (as XV-MU1109, V-MU1033, V-CW1001); was CLOSE · OPEN */
    F.bd.append(row('LOCAL', B[1][1], B[0][1]));
    F.bd.append(row('THROTTLE', B[2][1], B[3][1]));
    F.bd.append(row('', B[4][1], B[5][1]));
    F.bd.append(row('', B[6][1], B[7][1]));
    const why = E('div', 'fpo-why');
    F.bd.append(why);
    if (FVUSE[tag]) F.bd.append(E('div', 'fpo-dim', FVUSE[tag]));
    const ln = E('div', 'fpo-ln'),
      a = E('button', 'fpo-a', 'Events');
    a.type = 'button';
    a.onclick = () => call(() => document.getElementById('evbtn').click());
    ln.append(a);
    F.bd.append(ln);
    const set = v => {
      AN.swValve(tag, v);
      call(() => window.lsEventAdd('FIELD', 'FIELD', 'Field operator: ' + tag + ' ' + (v === 0 ? 'CLOSED' : v === 100 ? 'OPEN' : v + ' % open') + ' (local)'));
      setTimeout(tick, 150);
    };
    function tick() {
      if (!me.isConnected) return closeEl(me);
      const p = pc(),
        run = isRun(),
        op = p > 0;
      F.lamp.className = 'fpo-lamp ' + (op ? 'run' : 'stop');
      setTx(F.val, op ? Math.round(p) + ' % OPEN' : 'CLOSED');
      lO.className = 'fpo-lp' + (op ? ' run' : '');
      lC.className = 'fpo-lp' + (!op ? ' stop' : '');
      B.forEach(([v, b]) => {
        b.disabled = !run || Math.round(p) === v;
        b.classList.toggle('lit-run', v > 0 && Math.round(p) === v);
        b.classList.toggle('lit-stop', v === 0 && !op);
      });
      setTx(why, run ? '' : 'Simulation PAUSED: press ▶ RUN first (nothing moves while paused).');
      why.hidden = !why.textContent;
    }
    tick();
    place(me);
    me._iv = setInterval(tick, 500);
    return true;
  }
  /* the manual valves on the HMI pages: a <g> whose <title> starts with the tag of a field valve of the plant model (and no faceplate of
     its own) opens fieldPct; its body shows the line-up live (red = open, green = closed) */
  const fvTagOf = g => {
    const t = g && g.firstElementChild && g.firstElementChild.tagName === 'title' ? g.firstElementChild.textContent : '',
      m = /^(V-[A-Z]{2}\d{4})\b/.exec(t || '');
    return m && m[1] in fvAll() ? m[1] : null;
  };
  document.addEventListener(
    'click',
    e => {
      let g = e.target && e.target.closest && e.target.closest('svg g'),
        tag = null;
      if (!g || g.closest('[data-hit]')) return;
      for (let i = 0; i < 3 && g && !(tag = fvTagOf(g)); i++) g = g.parentNode && g.parentNode.closest && g.parentNode.closest('svg g');
      if (tag && fieldPct(tag)) e.stopPropagation();
    },
    true
  );
  setInterval(() => {
    const all = fvAll();
    if (!Object.keys(all).length) return;
    document.querySelectorAll('svg g > title').forEach(ti => {
      const g = ti.parentNode;
      if (g.closest('[data-hit]')) return;
      const tag = fvTagOf(g);
      if (!tag) return;
      const b = g.querySelector('path');
      if (!b) return;
      g.style.cursor = 'pointer';
      b.setAttribute('fill', (+all[tag] || 0) > 0 ? '#d64545' : '#3fa34d');
      /* sweep item 7: a clear box over the whole valve takes a real click (a thin or crossed symbol has little to hit) */
      if (!g.querySelector(':scope > rect[data-fvh]'))
        call(() => {
          const r = g.getBBox();
          if (!r.width && !r.height) return;
          const h = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
          for (const [k, v] of Object.entries({ x: r.x - 3, y: r.y - 3, width: r.width + 6, height: r.height + 6, fill: 'transparent', stroke: 'none', 'data-fvh': tag }))
            h.setAttribute(k, v);
          h.style.pointerEvents = 'all';
          g.append(h);
        });
    });
  }, 1000);
  /* the mockup pages (hmi-mock.js): which kind of valve a tag is, and open (1) / closed (0) / unknown (null) */
  const valveKind = tg => (VALVES[tg] ? 'dcs' : FIELDV[tg] ? 'field' : fvAll()[tg] != null ? 'field' : null);
  const valveOpen = tg =>
    call(() => (VALVES[tg] ? (VALVES[tg].isOpen() ? 1 : 0) : FIELDV[tg] ? (AN.fieldState && AN.fieldState()[FIELDV[tg].k] ? 1 : 0) : fvAll()[tg] != null ? (+fvAll()[tg] > 0 ? 1 : 0) : null), null);
  const valveTag = tg => (VALVES[tg] ? valve(VALVES[tg]) : FIELDV[tg] ? fieldValve(FIELDV[tg]) : fvAll()[tg] != null ? fieldPct(tg) : false);
  /* #59: the Y / N of a motor for the button on its page (the same test as the info faceplate): true = every logic permissive
     complete, false = not, null = no logic */
  function yn(M) {
    const dk = D();
    if (!M || !dk || !M.ad) return null;
    const I = call(() => dk.interlock(M.ad), null);
    if (!I) return null;
    const st = call(() => dk.mst(M.ad), null),
      md = call(() => (M.modeFn ? M.modeFn() : dk.modeOf(M.ad)), null) || {},
      sby = st === 'STOP' && md.rem === true && md.au === true,
      miss = sby ? [] : I.miss.filter(r => !/REMOTE/.test(r.svc));
    return md.rem !== false && !miss.length;
  }
  /* an HMI page's click on a machine: its faceplate when the motor is known to the logic, else the info card (as before) */
  function hit(M, fallback) {
    if (M && M.ad && !M.fld && !/@/.test(M.ad) && D() && call(() => D().dOf(M.ad), null) && motor(M)) return;
    if (fallback) fallback();
  }
  /* the faceplate of a motor named by its address (the dock's "Buksan ang faceplate"): the page on screen opens it beside its symbol */
  function openAd(ad) {
    const R = REG[ad],
      el = R && call(() => R.el(), null);
    if (!R || !el || !el.isConnected) return false;
    /* Audit 3: an element that is a whole group of the page (1000 px) is no anchor; the click that opened it stays the anchor */
    const q0 = el.getBoundingClientRect();
    if (q0.width <= 220 && q0.height <= 220) last = { r: q0 };
    R.open();
    /* the page may still be laying out after a step change: placed again on its symbol once drawn */
    const b = box,
      re = () => {
        const q = el.getBoundingClientRect();
        if (b && b === box && q.width) place(b, q);
      };
    requestAnimationFrame(re);
    setTimeout(re, 350);
    return !!box;
  }
  /* #59 for a controller (039 biasing dampers, ABC-020): the PERMISSIVE · TREND · MONITOR faceplate of its Y / N square.
     P = { n, t, perm: [[label, () => 1 | 0 | null]], lists: [[heading, [lines]]], mon: [[label, fn, unit, dp]], trend: { h, fn, col } };
     a permissive row: Y red = made, N green = not (the approved mockup) */
  function info(P) {
    if (!P) return false;
    const F = frame(P.n, P.t || '', 'info');
    const me = box;
    F.hd.querySelector('.fpo-tt').append(E('span', 'fpo-k', 'PERMISSIVE · TREND · MONITOR'));
    const pH = E('div', 'fpo-sh', P.permH || 'LOGIC PERMISSIVE'),
      pL = E('ul', 'fpo-il');
    if (P.perm && P.perm.length) F.bd.append(pH, pL);
    for (const [h, lines] of P.lists || []) {
      const ul = E('ul', 'fpo-il');
      ul.replaceChildren(...lines.map(t => {
        const li = E('li', '');
        li.append(E('span', '', t));
        return li;
      }));
      F.bd.append(E('div', 'fpo-sh', h), ul);
    }
    /* beta.556: words = [word at 1, word at 0] of an on / off point, as in the machine faceplate */
    const monV = (P.mon || []).map(([l, f, u, dp, words]) => {
      const v = E('span', 'fpo-vb');
      const r = row(l, v, ...((P.mon || []).some(x => x[2]) ? [E('small', 'fpo-dim', u || '')] : []));
      r.classList.add('mon');
      F.bd.append(r);
      return [v, f, dp == null ? 1 : dp, words];
    });
    const trend = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    trend.setAttribute('viewBox', '0 0 300 50');
    trend.setAttribute('preserveAspectRatio', 'none');
    trend.setAttribute('class', 'fpo-tr');
    trend.setAttribute('role', 'img');
    trend.setAttribute('aria-label', (P.trend && P.trend.h) || 'Trend');
    if (P.trend) F.bd.append(E('div', 'fpo-sh', P.trend.h), trend);
    const Hs = P.trend ? hist['trend:' + P.trend.h] || (hist['trend:' + P.trend.h] = []) : null;
    let k0 = '';
    function tick() {
      if (!me.isConnected) return closeEl(me);
      const pv = (P.perm || []).map(([l, f]) => [l, call(f, null)]),
        k = pv.map(p => p[1]).join();
      if (k !== k0) {
        k0 = k;
        pL.replaceChildren(...pv.map(([l, v]) => {
          const li = E('li', v === 1 ? 'ok' : 'bad');
          li.append(E('i', '', v == null ? '-' : v === 1 ? 'Y' : 'N'), E('span', '', l));
          return li;
        }));
      }
      for (const [v, f, dp, words] of monV) {
        const x = call(f, null);
        setTx(v, x == null || !isFinite(+x) ? '-----' : words ? (+x >= 0.5 ? words[0] : words[1]) : (+x).toFixed(dp));
      }
      if (Hs) {
        const now = Date.now(),
          v = call(P.trend.fn, null);
        if (v != null) sample(Hs, v, now);
        const ys = Hs.map(p => p[1]),
          lo = Math.min(...ys, v == null ? Infinity : v) - 5,
          hi = Math.max(...ys, v == null ? -Infinity : v) + 5,
          y = x => (47 - ((x - lo) / Math.max(1, hi - lo)) * 44).toFixed(1);
        trend.innerHTML = Hs.length
          ? `<polyline fill="none" stroke="${P.trend.col || '#a596cf'}" stroke-width="2" points="${Hs.map(p => ((300 * (p[0] - (now - 600e3))) / 600e3).toFixed(1) + ',' + y(p[1])).join(' ')}"/><circle cx="298" cy="${y(Hs[Hs.length - 1][1])}" r="2.5" fill="${P.trend.col || '#a596cf'}"/>`
          : '';
      }
    }
    tick();
    place(me);
    me._iv = setInterval(tick, 500);
    return true;
  }
  window.LS_FPOP = { motor, valve, valveTag, valveKind, valveOpen, tcs, ibd, mov, fieldPct, pb, field, fset, pkg, yn, hit, openAd, place, close, info, get open() {
    return anyOpen();
  } };
})();
