# src/world/field: field signals of the lanes (beta.450, lane plan 2026-11-25)

There is one JS file per lane, such as `boiler.js` (lane 3) or `bop.js` (lane 4). A lane edits only its own file. The build
(`tools/build/engine-bundle.js` laneData) wraps each file as `(function (lane) { ... })("<file name>")` and puts it in the page and in the
engine worker. The file calls `FIELD.add(lane, rows)`.

    FIELD.add(lane, [
      { stn: 4, ai: 'AI0438', tag: 'PT-IA1064-A', v: U => U.iaP, rel: 'buffer tank filled from the instrument air header',
        src: 'IO list stn 4 AI0438; P&ID PD-023 sheet 6/6' },
      { tag: 'ZSO-FW1110', di: 1, sheet: 'DITL-23A', v: (U, X) => X.ditlPos('DITL-23A') >= 97, rel: 'open limit at 97 % travel',
        src: 'IO list row ...; valve data sheet ...' }
    ]);

The row shape is `{ stn, ai | di: 1, tag, v(U, X), rel, src, sheet? }`. (`get` is still read as another name of `v`.)

- `v(U, X)` reads only. `U` is the engine state (AN.unit). `X` gives the engine readers that live inside the engine closure:
  - `X.av(tag, x)`: the opening that reaches the process for command x of a control valve (air lock, stuck fault). The call does not
    move the hold memory.
  - `X.ditlPos(name, j)`: position 0 ~ 100 % of valve j of a DITL drawing ("DITL-32", "DITL-32 #B"). It is null while the world is
    not built.
  - `X.ditlRun(addr)`: 1 RUN, 0 STOP of a DITL drawing ("DITL-23A", or "DITL-39@3" for output row 3). It is null while the world is
    not built.
  - `X.ai('stn|AI0128')`: the value on the AI blocks of that address, or NaN when no running sheet has it.
- **AI row** (`ai`): the value is written once per scan, after the unit model step, on every AI block of that station and address. It is
  written the way the unit model writes its own transmitters: a forced output is left alone and the range clamps the value. A value that
  is not a number writes nothing. `AN.fieldStat` lists each AI row with the number of blocks it writes (0 means the address is on no
  running sheet).
- **DI row** (`di: 1`): the DITL input row whose text starts with `tag` is 1 while `v` is true (above 0.5). It works like a switch row
  of the plant model (src/world/plantsw.js). `sheet` is optional; it is the sheet code when the tag is on more than one sheet. A tag the
  plant model already switches keeps that one source, and the row is listed in `FIELD.dup`.
- **The HMI** reads every row on `AN.unit.fld`, by `"stn|AI0128"` and by the tag without signs (`PTIA1064A`). This works in Worker mode
  too. A page value with no logic transmitter (src/ui/plant/plant.js, `{ t: 'val', tag }`) takes the field row of the same I/O address
  or tag before any page fallback. So **one source per tag**: when a field row lands, the old fallback of that tag (a fixed number in
  hmi-op.js, a plant model key in a page map) is not shown any more and gets removed in the same or the next PR.
- Every value has a physical source: design data or first principles (Rule 0, RULES.md 3.12). There is no constant from a trend or a
  snapshot. `rel` says how the value comes from the state, and `src` gives the drawing or list row.
- If a lane needs a value the engine does not have yet, it asks lane 0 (YUA) for that value. The lane does not make one in this file.
