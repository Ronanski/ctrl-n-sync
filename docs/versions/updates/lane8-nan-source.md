# Lane 8 QA: trace checks the source chain for NaN

- tools/trace/trace.cjs: each ABC net counts the samples where it read NaN; an I/O point is LINKED only when its ABC source chain (same sheet, upstream through the block in pins) has no NaN. New status "SOURCE CHAIN HAS NaN" and a nan column in trace-abc-inputs.csv.
- Main 22f6da9, 150 MW, 5 min: 0 of 5,129 ABC nets read NaN; LINKED 1,787 -> 1,787.
- Tool only: no app code, no dist, no version.
