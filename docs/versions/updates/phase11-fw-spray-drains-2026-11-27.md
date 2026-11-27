# Phase 11 NANA batch: spray water from the BFWP 3rd stage, HP heater drain valves from their sheets, 2026-11-27 PHT

**Binago (2 ayos, isang commit bawat isa):**

1. **RH at HP bypass spray water (TCV-FW1150, TCV-FW1060)**
   - Dati ay 29.5 / 67 T/H x MV x sqrt((BFWP discharge - RH) / 130.5).
   - Ngayon ay galing ang tubig sa 3rd stage ng BFWP (KSB curve Q43446D tap-off, PD-017).
   - Ang daloy ay sa Cv ng valve: TCV-FW1060 Cv 10.3, modified equal % (E2-0-123); TCV-FW1150 Cv 6.2 (L21).
   - Ang line loss ay kinuha sa turbine trip case ng KSB sheet (69.4 kg/cm2 g) at ng valve sheet.
2. **HP heater drain valves (LCV-HD1106-1 / -2, LCV-HD1105-1 / -2)**
   - Dati ay capacity x opening x sqrt(ms / 458.684), at NO-SOURCE ang capacity ng LCV-HD1106.
   - Ngayon ay gamit na ang Cv at ang travel points ng valve sheets (E2-0-123 R1), kasama ang choked flow (FL 0.90). Pareho ang FL na ito sa lahat ng 9 flashing / cavitating sizing case.

**Sinubok:**
- tests/lanes/fw/bypass-spray.cjs: ang 4 vendor case at ang line.
- tests/lanes/fw/hp-drains.cjs: ang 12 sizing case, lahat ay nasa loob ng 1 %.
- Pasado rin ang fw lane tests, ports, one-path, no-fit at u-const.
- Ang start sa 150 MW ng main ay tumakbo nang 20 min:
  - walang MFT;
  - ang MW ay gumalaw nang hanggang 1.2, ang Pms nang hanggang 0.8;
  - steady ang level ng No.2 at No.1 HPH (-4 / -9 mm);
  - ang primary drains ay 47 / 72 T/H, at sarado ang alternates;
  - ang 3rd-stage tap ay 73 kg/cm2 g.

**Hindi sinubok:**
- Ang live app.
- Ang sweep, na pinapatakbo ng phase thread sa main.

**NO-SOURCE:** ang elevation ng heaters at ng deaerator. Ang head at line ng bawat valve ay kinuha sa COND 1 ng sheet, at pare-pareho ito sa lahat ng flow.
