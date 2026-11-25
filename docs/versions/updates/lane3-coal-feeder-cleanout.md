# Clean-out conveyor ng coal feeder A ~ C (lane 3, DCS LINKS BOILER : KIRARA)

## Ano ang bago
- **MIA-CL1061-A8 / B8 / C8** (STN104 I.012E / I.044E / I.048E), ang AUTO / MAN selector (K3) ng clean-out conveyor:
  - Field state ito; normal = AUTO.
  - Kapag inilagay sa MAN sa Plant menu ("Coal feeder x clean-out conveyor selector in MAN"), nagiging 0 ang signal.
- **MIR-CL1061-A1 / B1 / C1** (I.0133 / I.0453 / I.0493), "clean-out conveyor running":
  - Galing ito sa ladder ng Yamato: 60GM4130690005 sheet E5 rev 5, PDF p 21 (KM1 / R4).
  - AUTO: tumatakbo ito kapag tumatakbo ang feeder.
  - MAN: hawak nito ang dating takbo (seal ng KM1), dahil wala sa trainer ang local START / STOP button ng panel.
  - Kapag tripped ang conveyor (thermal 49-1, field state na mayroon na), humihinto ito.

## Sinuri (headless, 150 MW)
- Sa 150 MW, 1 ang AUTO at 1 ang conveyor ng A, B at C.
- Clean-out trip ng A: 0 ang conveyor A. Kapag inalis ang trip: 1 ulit.
- A sa MAN, pagkatapos field trip ng feeder A: humihinto ang feeder, pero tumatakbo pa rin ang conveyor (seal).
- Ibinalik sa AUTO na nakahinto ang feeder: 0 ang conveyor, at nananatiling 0 kahit ilagay ulit sa MAN.
- QA trace, 150 MW 3 min, main d4606ef laban sa bago:
  - may live value 2,125 -> 2,131
  - LINKED 1,779 -> 1,782
  - UNLINKED 152 -> 147
  - B2 86 -> 81
- Lane tests: 2 of 2 pass.
- Walang DITL row na may ganitong mga tag, kaya walang nagbabago sa planta.

KIRARA
