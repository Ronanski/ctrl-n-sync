# MOC: Configuration management at daan ng pagbabago (Phase 15)

MOC = Management of Change: walang pagbabago sa logic, tag, alarm o kabit na hindi nakatala kung ano, kailan, sino, at mula saang dokumento. Pinahintulutan ng user ang Phase 15 kasabay ng #9 (user 2026-11-27 7:00 AM PHT "Go 10 13 15"). Bantay sa Checks (ang awtomatikong pagsusuri bago pumasok ang ayos sa app): `tests/lanes/qa/phase15-gate.cjs`.

## 1. Ano ang kontrolado

Bawat isa ay may sariling version (rev), at tumataas ito ng 1 sa bawat nakatalang pagbabago nito. Ang tool ay `tools/moc/moc.cjs`.

- `abc:<sheet>`: bawat ABC sheet (analog logic) sa `src/data/apre.txt`, 54
- `ditl:<sheet>`: bawat DITL sheet (digital logic) sa `src/data/pre.txt`, 249 (ang 141 unit sheet ay ginagawa mula sa mga ito habang tumatakbo, kaya kasama na)
- `tcs:<sheet>`: bawat TCS sheet `src/digital/tce/<sheet>.js`, 501 (kasama ang `_lib` = block library ng TCS at `_desc` = text ng block)
- `tag:<table>`: ang tag database: station 1 ~ 5 ng `src/data/ades.txt`, `tcs-io`, `tcs-dcs`, `io-excluded`, `io-spare`, `aln` (linear curves), 10
- `alarm:<group>`: bawat alarm group `src/data/alarms/<group>.json`, 23
- `link:<file>`: ang mga file ng kabit ng address `src/world/bind/*.json`, `src/world/inst/*.json`, 5

Kabuuan sa unang baseline: 842 item. Ang baseline (ang nakatalang estado na sinusundan) ay `docs/moc/baseline.json`: bawat item, ang rev, ang hash ng laman (parang fingerprint, nagbabago kapag nagbago kahit isang titik) at ang pagbabagong gumawa nito. Ang unang baseline ay `docs/moc/changes/20261127-0700-baseline.json` (main 3b208f5, Phases 1 ~ 8 TAPOS).

Hindi kasama: ang plant model (Phase 11) at ang save points (estado ng planta, hindi configuration).

## 2. Daan ng pagbabago

1. Gawin ang ayos sa sheet, tag table, alarm group o link file.
2. Itala: `node tools/moc/moc.cjs --record --what "<ano ang binago>" --source "<dokumento, pahina / sheet / row>" --by "<thread>" --slug <salita>`. Isinusulat nito ang isang change file `docs/moc/changes/<YYYYMMDD-HHMM>-<salita>.json` (oras sa PHT) para sa lahat ng item na iba sa baseline, at itinataas ang rev ng bawat isa.
3. Ang source ay dapat may pangalan ng dokumento (numero gaya ng PR-OPE-5002, K1AU3-A1-0-001, ABC-010, TCE143, Alarm List _20160912), isang file sa repo, o ang salita ng user na may petsa ("user 2026-11-26 ..."). Bawal ang "assumed", "hula", "guess", "NO-SOURCE": hanapin muna sa docs.
4. Kasama ang change file at ang `docs/moc/baseline.json` sa parehong PR. Bagsak ang Checks kapag may item na nagbago pero walang tala.
5. Ang change file na na-merge ay hindi na ginagalaw o binubura. Ang mali ay itinatama ng bagong change.

`node tools/moc/moc.cjs --diff` = listahan ng item na iba sa baseline. `node tools/moc/moc.cjs` = check lang.

## 3. Version

- App: `delivery/app/app.json` = `"X.Y.Z-beta"`; ang beta number ay ang bilang ng commit sa `main` (`tools/app-version.js`, `git rev-list --count HEAD`), kaya kusa itong tumataas sa bawat merge at walang PR na nagdadala ng version number (`tools/version-check.js`).
- Simulator: `src/version.txt`.
- Final `"X.Y.Z"` (Stable) sa `app.json` lang kapag may change na `kind: "release"` na may salita ng user na "GO STABLE" at ang version.
- Ang buong history ay kailangan para tama ang bilang: `fetch-depth: 0` sa checks, release at site workflow.
- Bawat sheet, tag table at alarm group: ang rev sa `docs/moc/baseline.json`.

## 4. Release

- Beta: kusa. Merge sa `main` kapag pasado ang Checks, at ang Beta site ay kusang nade-deploy.
- EA (pre-release) at Stable (Final) lang sa salita ng user sa mismong mensahe: `GO EA`, `GO STABLE` (`RULES.md` 5.8). Saka lang pinapatakbo ng team ang `release.yml` sa kamay, na may input na eksaktong `GO v<version>`.
- Ang `release.yml` lang ang puwedeng gumawa ng GitHub Release o tag, at sa kamay lang (workflow_dispatch). Bagsak ang Checks kapag may ibang workflow na gumagawa nito.

## 5. Malinis na repo

- Walang built html (`dist/`) sa git; ginagawa ito ng build.
- Walang junk file (`.log`, `.tmp`, `.orig`, `.rej`, `.bak`, `node_modules`) at walang key o secret file (`.jks`, `.pem`, `.env`); ang susi ng apk ay nasa GitHub secrets.
- Walang file na higit 6 MB.
- Walang IP address ng network ng planta (private range o bahaging higit 99) at walang password, token o private key sa anumang file: PUBLIC ang repo.
- Ang nasa itaas na antas ng repo ay ang mga kilalang folder at file lang.
- Hanggang 3 branch maliban sa `main`; binubura ang branch pagka-merge (GitHub auto-delete).
