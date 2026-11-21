# LMYP OTS 1.0.0-beta.248

22 Nov 2026. Full Audit 3 item #18: one list of rules in the repo (user Q11, Q12). By Jennie.

## Changed

| Area | What changed |
|---|---|
| Rules | New `RULES.md` at the root: one list, 6 groups (talk, team, the app, HMI, code / test / release, the rules themselves), from the Full Audit 3 rules draft with the open items answered by the user's Q1 ~ Q15 (2026-11-21) and the later words of the user (one thread on the PC at a time, real clicks, no patch) |
| CLAUDE.md | Now one line that points to `RULES.md` and `HANDOFF.md` |
| Old rule files | `CLAUDE.md` (old copy), `PROJECT_RULES.md`, `docs/handoff/COMMANDMENTS.md`, the old `HANDOFF.md`, `docs/SPEC.md` and the rest of `docs/handoff/` (HANDOVER 11-10, LIVE_TEST_FINDINGS, LOCAL_TAKEOVER, NEW_ACCOUNT_SETUP, PUBLISH_BETA) moved to `docs/archive/rules-2026-11-22/`, kept for reference |
| HANDOFF.md | New, short: state at beta.248, team, the open Full Audit 3 items, where things are, how to update it |
| DCS knowledge | The 10 DCS facts of the old CLAUDE.md (one tag one signal, .MAN / .LOC / .REM, BU-CMD, no unlink, the documents) are now `docs/DCS_KNOWLEDGE.md`, apart from the rules (RULES 6.3) |
| Hook text | `.claude/each-reply.txt` (read on each message) no longer says "no merge without GO"; it now points to `RULES.md` and says merge is automatic on green checks |
| README | "Start here" and the docs row point to the new files |

Nothing in the app, the logic, the plant model or the drawings changed.

## 16 conflicts of Full Audit 3, now

All 16 are settled by one line of `RULES.md`: release word (5.8), question card (1.6), dark only (4.1), Cold run only on the user's word (5.7), no training (3.2), SOP guide only (3.3), NO-SOURCE not allowed (3.5), ROLE : NAME (2.2), builder may test (5.5), auto-merge (5.2), the gate is the behaviour test in the checks (5.3), delete the branch after merge (5.2), HMI quality of the Reheat page (4.5), one repo (5.1), snapshot only for checking (3.5), headless test vs live test (5.6, 5.7).

## Tested

`npm run build`, `npm run check` (SAME). The behaviour gate runs in the Checks of this PR (not on the PC: the PC is busy with the 8 h run of item #3).

## Not done

- The SessionStart hook on the PC (`~/.claude/hooks/icms-commandments.js`) still injects the old COMMANDMENTS. It is outside the repo; it is the user's own setting.
- `src/station/station.js` line 2609 cites `docs/SPEC.md` in a comment (Rosé's file); the file is now under `docs/archive/rules-2026-11-22/`.
