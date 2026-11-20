/* TCA816 ALARM (331DM09788 page 225, controller COMM+MD, cycle 100 ms). Typed from the drawing;
   units = the pixels of the page rendered 2296 wide. As drawn:
   - SIGNAL ERROR(1) ... SIGNAL ERROR(6) (A from TCA810 ... TCA815) into OR 003; its output = COM SIGNAL ERROR, A (to TCA822).
   live: none; the engine holds no state of these signals, so the sheet is shown without states. */
(function () {
  if (typeof window === 'undefined') return;
  const w = [],
    c = [],
    t = [];
  const W = (key, ...pts) => w.push([key, pts]);
  const Y = [208, 272, 336, 400, 464, 528],
    I = [208, 229, 250, 271, 292, 314],
    B = [668, 689, 710, 731, 752];
  Y.forEach((y, i) => {
    const key = 'i' + (i + 1);
    c.push([key, 'in', 'A', 335, y, '', ['TCA81' + i], 0, 1]);
    t.push([368, y - 8, 'SIGNAL ERROR(' + (i + 1) + ')']);
    if (i === 0) W(key, [362, y], [862, y]);
    else W(key, [362, y], [B[i - 1], y], [B[i - 1], I[i]], [862, I[i]]);
  });
  W('or003', [921, 208], [2128 - 27, 208]);
  c.push(['oA', 'out', 'A', 2128, 208, '', ['TCA822'], 0, 1]);
  t.push(
    [1780, 200, 'COM SIGNAL ERROR'],
    [234, 1524, 'CONTROLLER:'],
    [394, 1524, 'COMM+MD'],
    [617, 1502, 'TRIGGER  :'],
    [617, 1529, 'CYCLE(ms):100']
  );
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA816',
    title: 'ALARM',
    page: 225,
    ctl: 'COMM+MD',
    cycle: 100,
    f: [165, 77, 2224, 1542],
    c,
    b: [['or003', 'OR', '003', 891.5, 261, [], {}, [59, 128]]],
    w,
    t
  });
})();
