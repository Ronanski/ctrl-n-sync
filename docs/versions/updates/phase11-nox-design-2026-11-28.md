# Phase 11 (AOI): stack NOx from the FHI guarantee and correction curves; screen values tagged (2026-11-28)

## Changed
- AT-FG1057-2 stack NOx (`boiler.js` AN_NOX / anNox). It was 4.2 % of the fuel N, a conversion fitted to a plant screen value.
  - It is now the FHI guarantee 180 ppm dry at 6 % O2 times Ft(bed temperature) times Fea(excess air).
  - Source: FHI Performance Test Procedure K1AU3-R3-0-001 Rev 2, section 3.6, p15-16, read by YUA on 2026-11-28 (`/mnt/project-files/aoi-fa-valve-nox-flyash-reads-2026-11-28.md`).
  - The result is converted to the stack O2 by the reference formula of the same section, and scaled by the coal share of the fuel.
- AT-FG1057-6 opacity and FT-FG1057-7 stack velocity still use plant screen values. Their code lines are tagged RULE 0 VIOLATION, so Checks shows them as KNOWN FAIL. The missing sources are the fly-ash particle size (NOT IN DOCS) and the stack inner diameter.
- FA flow vs damper and the FA header pressure (26.3 T/H at 42.8 %, 3257 / 3315 mmH2O) are tagged RULE 0 VIOLATION as well, on the AN_FN.fa line. A physics version (blower curve + textbook butterfly zeta + header system) was built and run, but it is held back. The docs give two duty points at the same 5230 mmH2O header (FHI MB-054: 22.8 t/h normal; Continental curve: 27.4 t/h design), so no header system curve can be derived from them. The square law through 22.8 t/h tops out at 24.5 t/h on one blower, under the 150 MW SV of 27.04 t/h, and the damper winds up. Work file: /mnt/project-files/phase11/aoi-fa-header-physics-wip-2026-11-28.diff.
- Check-only screen mentions were removed from the gas path comments (AT-FG1131, the economizer gas, the ID fan rise). no-snapshot baseline: 715 -> 709.

## Tested (headless, 150 MW start, 6 min)
- NOx 243-244 ppm at stack O2 4.3 % and bed 855 C.
- Hand check: EA = 4.32 / (20.9 - 4.32) = 26.1 %, Fea 1.194; Ft(855) 1.015; 180 x 1.015 x 1.194 = 218 ppm at 6 % O2; x 16.6 / 14.9 = 243 ppm.
- Guards: no-snapshot PASS (4 KNOWN FAIL: kKL, opacity, stack velocity, FA flow/header), no-fit, one-path and u-const PASS.

## Not tested
- The 45-150 MW sweep. That runs on main.
