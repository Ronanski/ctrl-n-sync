# Sweep tool: sliding pressure during the ramp, cold reheat read, port design value (2026-11-27)

Tools and the port table only. No model law changed.

- `tools/accept/part1.cjs`:
  - On the way down to 45 MW, the operator now slides the PIC-COBM SV with the load on the HB sliding pressure line (PPE-14-0725:
    126 ata at 60 % load and above, 98.9 ata at 30 %). The SV moves at most 0.5 kg/cm2 a minute, during the ramp too.
  - Before, the SV went to 98.9 only after the ramp. It was also set in GAUGE against an ATA target, so it ended 1 kg/cm2 low.
- Cold reheat flow (RIN 2026-11-27): the HB "cold reheat" 446.1 T/H is the HP exhaust BEFORE the No.6 extraction, while crh.rh_in is
  the steam into the reheater. The tool now reads crh.rh_in.m plus the No.2 HP heater draw: ext.w_hp x.hp2 once NANA writes it,
  else U.hpF2.
- `src/analog/engine/ports.js`: the crh.rh_in design flow is now 400.9 T/H (HB 446.1 less the No.6 extraction). It said 446.1.

Measured on main e499d23 (before 669 / 672 / 674): 3 of 22 design curves pass (tools/accept/results/sweep-2026-11-27-pm.md); with the
old operator steps it was 4.
- Better: SH temperature within 60 / 68 samples (was 45), RH temperature 44 (was 24), main steam temperature 92 / 128 (was 68 / 132).
- Main steam pressure 19 / 128 (was 29). The pressure now lags the HB line by about 7 ata during the ramp. At 45 MW it swings
  94 to 102 ata around the 98.9 target (period about 30 min): the boiler pressure control does not settle at low load. This finding
  goes to KANA / AOI.
- Hot reheat flow fails by one sample (127 / 128).

Tested: ports PASS, phase11-gate PASS (row 11 not TAPOS), the sweep itself (above). Not tested: the cold reheat read with RIN's ports
(669 not on main yet).
