# ctrl-n-sync

**LMYP OTS** (operator training simulator), the operator training app for LMYP Unit 1 (460 t/h CFB boiler, 150 MW): one screen to run the plant, read the logic and train on faults.

The app is the station frame (`src/station`) over the DCS logic simulator (analog and digital logic, turbine control, plant model, HMI pages) that was built in the repository `Ronanski/icms-master-tool`. This repository carries everything the app needs: the simulator sources, the frame, the build tools, the tests, the delivery files and the documents of the project. It started on 2026-11-19 as a copy of `icms-master-tool` at 3.2.4-beta.70 plus the HMI overview and the station frame.

## Start here

1. `CLAUDE.md`: the standing rules of the user.
2. `HANDOFF.md`, `PROJECT_RULES.md`, `docs/SPEC.md`: the state, the rules and the spec of the simulator the frame stands on.
3. `src/station/` and `tools/station/`: the frame of this app and its build.

## Build

```bash
node tools/build/build.js
```

writes `dist/logic-sim-v<version>.html`, the simulator page (the sources in `src/` are the truth; the Checks compare).

```bash
node tools/station/build.js dist/logic-sim-v<version>.html out
```

writes `out/operator-station-v<version>.html`, the page of this app: the same html plus the frame. Name, app id and site address are in `delivery/station/app.json`.

## Map

| Folder | What |
|---|---|
| `src/station` | the frame of this app: page list, top bar, alarm line, popups, Engineer and Instructor views |
| `src/analog`, `src/digital`, `src/world`, `src/data` | the simulator: logic reader, engine, plant model, built-in drawings |
| `src/ui` | the HMI pages (`ui/plant/hx`), faceplates and the old shell the frame hides |
| `tools/station` | build of the app page (`build.js`) and of its icon files (`icons.js`) |
| `tools/build`, `tools/engine`, `tools/version.js` | build of the simulator html, the engine in Node, the version |
| `tests/` | headless checks |
| `delivery/station` | name and id (`app.json`), icon, web manifest |
| `delivery/android`, `delivery/desktop`, `delivery/pwa`, `delivery/signing` | apk, portable exe, service worker, apk key (never regenerate it) |
| `docs/` | spec, handoff, versions, audits |
| `document-references/` | plant documents: on the PC only, never committed (`INDEX.md` lists them) |

## Release

- Beta: a merge to `main` when the Checks pass; the site shows it at `/beta/`.
- Stable: only on "GO STABLE" from the user; `release.yml` by hand with `GO v<version>`.
- The site (`site.yml`) runs only while the repository is public: GitHub Pages of a private repository needs a paid plan.
