# Phase 11 NANA: deaerator steam back to the turbine on a load rejection, 2026-11-28 PHT

**Binago:**
- Ang No.3 extraction (deaerator) ay dumadaloy na sa dalawang direksyon.
- Kapag bumagsak ang stage pressure ng turbine sa ibaba ng deaerator (load rejection), ang steam at ang flash ng saturated na tubig ng deaerator ay bumabalik sa turbine hanggang sumara ang NRV (XV-TS1710 / 1740, posisyon mula sa tcs-dev.js).
- Ang daloy ay sa compressible na line law, at ang k ay mula sa design point (26.79 t/h, 6.369 → 6.083 ata).
- Hiling ito ni RIN, para sa 106 % overspeed ng TG manual. Ang source ay ang basa ni YUA, /mnt/project-files/rin-extraction-2026-11-28.md.

**Sinubok:**
- tests/lanes/fw/deaerator.cjs:
  - pasado pa rin ang design point at ang sweep;
  - sa stage na 2.0 ata, -78 T/H ang bumabalik sa turbine;
  - kapag sarado ang NRV, walang daloy.
- Ang 150 MW start ay tumakbo nang 20 min: walang MFT, at ang extraction ay 28 hanggang 30 T/H.

**Hindi sinubok:**
- Ang load rejection sa buong planta. Susubukan ito ni RIN kasama ng PR 703.
- Ang live app.

**Hindi ginawa:**
- Ang HP2, dahil hinaharangan ito ng CRH NRV.
- Ang HP1, dahil NO-SOURCE ang dami ng tubig sa shell. Ayon kay RIN, hindi pa ito kailangan.
