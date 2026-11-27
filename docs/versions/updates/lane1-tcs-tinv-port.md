# TCS: the TINV operating quantity is a PLANT port (lane 1, MARIA, 2026-11-27)

`src/digital/tce-run.js` res(): an input net of a block that no drawn element drives, but that the sheet names as a port, is that port.
The 24 V/Hz 2nd step d24b of G-5A / G-6A (TINV) takes its operating quantity on the net `d24b.M`; the compile already named it
`PLANT:G-5A.d24b.M operating quantity (V/Hz %)` (res.ports), but the base name `d24b` hit the TINV block itself, so the net stayed a plain
slot nobody could write. Now `PLANT:G-5A.d24b.M` and `PLANT:G-6A.d24b.M` are in the port list (PLANT ports 123 -> 125), so the generator
model can feed them through the normal TCS_SH_IN map (YUI PR 682) with no net-name path. Logic unchanged; tests/tce/sheets.cjs (TINV
d24b TD 2 / PU 107) and tce-complete 419 / 419 pass.
