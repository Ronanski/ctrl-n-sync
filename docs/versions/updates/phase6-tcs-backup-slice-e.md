# Phase 6 TCS slice E: TCP / TCT programs of the HIACS backup, headless check (2026-11-26 PHT)

Source: `docs/tcs/backup/tcs-tcp-tct.json` (copy of lane 0's read of the backup, team-files/tcs-decoded; user 2026-11-26 "Gamitin",
values allowed in this repository; checked: no network address or access code). No TCE / TCA drawing exists for these sheets.

Rule (coordinator 2026-11-26 10:01 AM): ONE logic in the app. The TCP / TCT netlist is a headless test only; nothing of it runs in the
app, and the IBD stays the trip source.

## What was added
- `tests/lanes/qa/tcp-tct-backup.cjs` (runs in Checks): reads 157 sheets (TCP 41 x 3 channels, TCT 34) and counts:
  - blocks 2,684; plain 2,099 (kind in the block library and every input readable). Not plain, by reason: nets with no name (?YY, 35
    sheets), MACRO blocks whose inside is not exported (33), SYSREF with no name exported (30), inputs from blocks with no number in the
    export (30), ATD (TCT070 / 071, not in the block library).
  - inputs of the app's TCE / TCA sheets that read a TCP / TCT sheet: 637 (ports CON:TCP... / CON:TCT..., they read 0 in the app today);
    the source block of all 637 is in the backup.
  Both counts may not fall (floor 2,099 / 637).

## Not done (blocker)
The comparison with the IBD trips needs the meaning of the TCP card points (TCP1900 inputs, TCP1930 / TCP1931 outputs: which trip or
which relay each point is). That PI/O table is not in the documents in the cloud; asked of lane 0.

## Finding for the team (no change made)
The 637 TCE / TCA inputs that come from TCP / TCT read 0 in the app (for example the trip condition inputs B1 .. B16 of TCE075 ~ TCE078
from TCP1050 ~ TCP1055). Their sources are now known from the backup; wiring them would put TCP logic into the running app, which the
one-logic rule does not allow today.

## Part 2: TCP trips against the IBD (2026-11-26 10:50 AM PHT)
Source: `docs/tcs/backup/tcs-tcp-pio.json` (lane 0: the TCP card points of all 3 channels, from the backup PIO card lists).
`tests/lanes/qa/tcp-tct-backup.cjs` now also checks, headless:
- 34 TCP trip points (11 live trip inputs of TCP1900, 23 trip indications / commands of TCP1930) paired by hand with the IBD trip of the
  same name: 31 have it (IBD TA-1, TA-2, TA-3, TA-9, TA-10, TA-12, TA-13, TA-14, TA-15, TA-17, TA-20, TA-21, TA-22).
- No IBD counterpart (finding, no change): 86G-A GEN LOCK OUT RELAY (TCP1900/8; the app has it only on TCE076 / TCE084, read from TCP),
  ST TRIP FOR GEN GROUP A / B (TCP1930/29 / 30).
- In all 3 channels every live trip input drives TURBINE TRIP (TCP1930/27) and the four master trip solenoid commands (1930/7, 8, 31,
  32), as the IBD TA-9 OR goes to TA-1 / TA-2 / TA-3. Naming difference only: TCP "ENERGIZE COMMAND", IBD "DE-ENERGIZE".
- Noted, not judged: the backup trace also gives TCP1930/4 MAIN STEAM TEMP. VERY LOW from every live trip input.
