# Phase 6 slice 5: sootblower 01 forward contact at posisyon ng PCV-SB1053 (2026-11-26 PHT)

Ano ang nakikita ng operator:
- MIF-N1011 (sootblower 01 "forward running", ibig sabihin umaandar ang motor habang lumalabas ang lance): 1 habang lumalabas ang lance, 0 kapag
  nakaurong o pabalik. Sa 150 MW nakaurong lahat (18.PNG), 0. Source: IO list STN102 I.0562; DITL-80G EXTEND / RETRACT; takbo ng lance
  world.js sbLance (Diamond Power N11639-SC1, 50.8 mm/s).
- ZT-SB1053 (posisyon ng steam supply pressure control valve ng sootblower, 0 ~ 100 %): ang bukas ng valve na umaabot sa proseso mula sa
  MV ng PICSB1052 (ABC-017), kasama ang airlock (valve package item 9). Source: IO list STN102 AI0388; loop list STN104 row 73.
- Bilang: hindi nakakabit na I/O 117 -> 115; may value 2169 -> 2171; B2 55 -> 53.
- HINDI ginawa (c, walang source): MOF / MOR-N1040 at N1042 (forward / reverse ng air heater sootblower). Ang L20 OMM ay nagsasabi lang ng
  19 min 40 s bawat lance; kung kailan pasulong o paurong sa loob nito ay wala sa docs (plantsw.js sbZs). Kailangan ng basa ng local panel
  drawing ng air heater sootblower sa PC.
- Hindi sinubok: sa browser (live app).
