# Phase 7 Validator TAPOS, 2026-11-27 ~12:40 AM PHT

Tapos kapag: kusang bilang at check sa bawat takbo ng tatlong bagay: pin na walang kabit, tag na hindi kilala, at NaN.

Binago:
- `tools/trace/trace.cjs` ay may bagong bahagi na `valid`. Bilang ito ng:
  - `pins`: lahat ng input pin ng ABC block at ng DITL gate;
  - `pinsNoWire`: ang pin na walang net, o ang pin na hindi nakabitan ng netlist;
  - `tags`: lahat ng tag na nakasulat sa ABC wire (S.tagN) at sa DITL row;
  - `tagsUnknown`: ang tag na wala sa alinman sa I/O list, memory list (`src/data/ades.txt`), loop list at user-tag list (`src/ui/plant/dcslists.js`).
- Ang equipment tag ay kilala kapag may I/O point ang device nito. Halimbawa, ang MV-CD1001 ay kilala dahil may ZSO / ZSC / MOR / MOS-CD1001 sa STN102.
- Ang address na may S1 ~ S5 sa unahan at ang TR / AB address ay binabasa bilang address.
- `docs/phase7/tags-known.json` (bago): ang tag na may dahilan at source. Ngayon ay isa lang: PT-PA1706, typo ng drawing ng PT-PA1705.
- `tools/trace/baseline.json`:
  - zero: `valid.pinsNoWire`, `valid.tagsUnknown` (kasama ang dati: `io.nanSource`, `fx.fxUnresolved`, `tcs.ibdMissing`, `run.trip`);
  - up: `valid.pins` 11,863 at `valid.tags` 642. Hindi puwedeng bumaba ang mga ito, kaya hindi puwedeng tahimik na lumiit ang sinusuri.
- PHASES row 7: TAPOS.

Mga bilang (150 MW, 2 min):
- pin na walang wire: 0 / 11,863;
- tag na hindi kilala: 0 / 642 (bago ang ayos: 4, na 3 equipment tag at 1 typo);
- NaN source: 0;
- I/O na walang kabit: 0.

Sinubok: trace-gate PASS (26 bilang), scope-doc PASS.
Hindi sinubok: TCS pins sa trace na ito. Ang TCS ay binabantayan ng tce-complete (419 / 419) at ng sheets.cjs.
Susunod: Phase 8 (Komunikasyon).
