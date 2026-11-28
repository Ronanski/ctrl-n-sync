/* init for tools/steady150/settle.cjs (phase thread, 2026-11-28): the main steam blow-off PICMS1002 (ABC-013, PCV-MS1001) SV at the
   logic's at-load preset, ABC-013 as-built R3 SI0361 a = 130 kg/cm2 (b = 115 kg/cm2 while M.0256 turbine trip / 52G / house load,
   TOF 2 s; written with AUTO forced on M.0252 or MSP > 134 for 2 s). The start carried 128.0, a value copied from a screen. */
(() => {
  const S = AN.sheets.find(x => x.name === 'ABC-013').S,
    c = AN.hmiCtrls(S).find(z => z.tag === 'PICMS1002');
  if (!c || c.q.sv == null || !S.ext.includes(c.q.sv)) throw new Error('no PICMS1002 SV input on ABC-013');
  S.rt.ext[c.q.sv] = 130;
})();
