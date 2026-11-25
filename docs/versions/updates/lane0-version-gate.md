# Walang version number sa PR (lane 0, integrator)

## Ano ang bago
- Ang Beta number ng app ay bilang ng commit sa `main` (`tools/app-version.js`). Kusa itong tumataas sa bawat merge (lampas 1250 na ang simula; ang huling nakasulat na number ay beta.587). Hindi na ito isinusulat sa `delivery/app/app.json` ("1.0.0-beta" na lang).
- Wala na sa git ang built html (`dist/`). Binubuo ito ng Checks, ng site, ng simulation tests at ng release mula sa sources. Dalawang beses itong binubuo ng Checks at dapat parehong-pareho ang labas (SAME).
- Ang report ng PR ay `docs/versions/updates/<lane>-<paksa>.md`.
- Hindi na kailangang mag-renumber o mag-rebuild ang isang PR kapag may ibang naunang na-merge. Ang tunay na conflict sa source na lang ang kailangang ayusin.

## Bakit
- Sampung lane ang sabay na nagme-merge. Bawat merge ay conflict sa `app.json` at sa 24 MB na html ng lahat ng ibang PR (ang PR 530 ay limang beses na-renumber).

YUA
