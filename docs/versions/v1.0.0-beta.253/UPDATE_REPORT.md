# v1.0.0-beta.253 Update report

## Changed
- Audit 3 #6, old HMI files: the 19 system files `src/ui/plant/hmi-mock-*.js` and the push button file `hmi-mock-pb.js` are gone. Their data moved to `src/ui/plant/hx/sys/hx-sys-*.js`, one file per system.
- What moved: the machines and valves (mach), the plant model keys (unit), the dosing inputs (udi) and the tag list of each system (tags, used by the Engineer to find the page of a tag).
- What is gone: the old drawings (art, about 480 KB). No page showed them; every old page already opened its HX page instead.
- The 30 sootblower faceplates were made by reading the old drawing. They now come from a written list of the same 30 blowers (sheet and row each).
- `hmi-mock.js` stays: it is the resolver that both faceplates use on the HX pages.
- `tools/hmi-mock` no longer writes these files; the hx/sys files are kept by hand.
- The note in station.js on the two starting points now names docs/archive/rules-2026-11-22/SPEC.md, where SPEC.md moved.

## Tested
- Same data check (node): for all 19 systems plus the push buttons, the machines, plant keys and dosing inputs are exactly the same before and after.
- Build, build --check, version-check, operator-text-check.
- Real-click test waits for the PC.

## Findings
- None new.
