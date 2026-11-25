# ctrl-n-sync

**LMYP OTS** (operator training simulator), the operator training app for LMYP Unit 1 (460 t/h CFB boiler, 150 MW): one screen to run the plant, read the logic and train on faults.

The app is the station frame (`src/station`) over the DCS logic simulator (analog and digital logic, turbine control, plant model, HMI pages) that was built in the repository `Ronanski/icms-master-tool`. This repository carries everything the app needs: the simulator sources, the frame, the build tools, the tests, the delivery files and the documents of the project. It started on 2026-11-19 as a copy of `icms-master-tool` at 3.2.4-beta.70 plus the HMI overview and the station frame.

## Start here

1. `RULES.md`: the standing rules of the user (`CLAUDE.md` points to it).
2. `HANDOFF.md`: the state of the work; `docs/DCS_KNOWLEDGE.md`: facts about the DCS of the plant.
3. `src/station/` and `tools/station/`: the frame of this app and its build.

## Build

```bash
node tools/build/build.js
```

writes `dist/logic-sim-v<version>.html`, the simulator page (not in git: the sources in `src/` are the truth, and the Checks, the site and the release build it).

```bash
node tools/station/build.js dist/logic-sim-v<version>.html out
```

writes `out/LMYP-OTS-<version>.html`, the page of this app: the same html plus the frame. Name, version, app id and site address are in `delivery/app/app.json`.

## Versions

The app has its own version (`tools/app-version.js`): `delivery/app/app.json` says `1.0.0-beta`, and the Beta number is the commit count of `main`, so every merge raises it by itself and a PR carries no number. `1.0.0` is the Final (Stable), written in `app.json` only on GO STABLE. Every PR that changes the app adds `docs/versions/updates/<lane>-<topic>.md`. The simulator inside keeps its own version in `src/version.txt` (a save point is checked against that one); it changes only when the simulator sources change.

## Map

| Folder | What |
|---|---|
| `src/station` | the frame of this app: page list, top bar, alarm line, popups, Engineer and Instructor views |
| `src/analog`, `src/digital`, `src/world`, `src/data` | the simulator: logic reader, engine, plant model, built-in drawings |
| `src/ui` | the HMI pages (`ui/plant/hx`), faceplates and the old shell the frame hides |
| `tools/station` | build of the app page (`build.js`) and of its icon files (`icons.js`) |
| `tools/build`, `tools/engine`, `tools/version.js` | build of the simulator html, the engine in Node, the version |
| `tests/` | headless checks |
| `delivery/app` | everything that names the app: `app.json` (name, version, id, site), `icon.svg` and the icon files made from it, `pwa/` (web manifest, icons, service worker) |
| `delivery/android`, `delivery/desktop`, `delivery/signing` | the shells of the apk and of the portable exe, the apk shells; the apk key is a GitHub secret (ANDROID_KEYSTORE_B64 / ANDROID_KS_PASS), never in the repo |
| `docs/` | `DCS_KNOWLEDGE.md`, `OPERATOR_GUIDE.md`, `SCOPE.md` (saklaw, docs, revision, equipment), `PHASES.md`, `archive/` (old rules, handoff and spec), `hmi/`, `tcs/`, audits. The reports of the old versions, the turnovers and the Plant Tools stayed in `Ronanski/icms-master-tool` |
| `document-references/` | plant documents: on the PC only, never committed (`INDEX.md` lists them) |

## Release

- Beta (EA): a merge to `main` when the Checks pass; the site shows it at `/beta/`. An EA apk / exe: `release.yml` by hand with `GO v<version>` while the version is `X.Y.Z-beta.N` (a pre-release).
- Stable (Final): only on "GO STABLE" from the user; the version is set to `X.Y.Z`, then `release.yml` by hand with `GO v<version>`; the site shows that tag at `/`.
- Files of a release: `LMYP-OTS-<version>.apk`, `LMYP-OTS-<version>-Windows.exe`, `LMYP-OTS-<version>.html`.
- The site (`site.yml`) runs only while the repository is public: GitHub Pages of a private repository needs a paid plan.
