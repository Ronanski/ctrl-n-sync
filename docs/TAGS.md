# TAGS: ang iisang tag database (Phase 4)

Ginawa 2026-11-25 ~8:40 PM PHT (user "sunod sunod"). Bantay sa Checks: `tests/lanes/qa/tag-db.cjs`.

## 1. Ang table

`src/data/ades.txt` (gzip + base64 JSON) ang **iisang table ng bawat DCS address**, station por station: `ADES[stn][addr] = { k, tag, d, t, lo, hi, u, ... }`.

- `k: "io"`: DCS I/O list (`dcs-io-list.xls`, K1AU3-E2-0-118): 3,816 point (I. 1,792, O. 928, AI 872, AO 224), 2,702 na may tag.
- `k: "mem"`: memory list 101 ~ 105 (M., B., SI, TR, PTN, DI, FP, DB).
- Ginawa ng mga data tool (`tools/data/`) mula sa mga listahan ng planta; binabasa ng app (`AN.ades()`), ng QA trace at ng mga test.
- **Isang tag = isang address sa buong DCS** (CLAUDE.md, hindi nagbabagong kaalaman 1). Binabantayan ng test.

TCS: ang sarili nitong I/O table ay `src/data/tcs-io.json` (TCS I/O list 310SC90-793 R2; test `tests/lanes/tcs-io/io.cjs`). Ang DCS points na papunta sa TCS ay nasa `src/data/tcs-dcs.json`, at bawat isa ay tugma sa table sa itaas.

## 2. Sino ang gumagamit (at sinusuri laban sa table)

| File | Ano ang sinusuri |
|---|---|
| `src/data/alarms/*.json` | station + address ay nasa table; tag ay pareho (ang alarm list ay sumusulat ng TE- para sa TT- at ng numero ng sensor, hal. TE-FA1053-U2 = TT-FA1053-U) |
| `src/world/bind/*.json` (row na may address) | station + address + tag |
| `src/data/tcs-dcs.json` | station + address + tag |
| `src/world/field/*.js` (field rows at states, gaya ng load ng app) | AI row: address + tag; DI row: tag ay nasa table at nasa tamang station |
| `src/ui/plant/dcslists.js` (loop list) | PV / remote SV / MV address ay nasa table |

## 3. Kilalang pagkakaiba

Nakalista sa `tests/lanes/qa/tag-db-known.json`, bawat isa ay may dahilan at may-ari (lane). Ang lane na nag-ayos ang nag-aalis nito. Kapag may bagong pagkakaiba, bagsak ang Checks.

Kapag ang `tag` ng isang row ay ang baybay ng drawing o ng alarm list (kailangan ito para mahanap ang row sa sheet), may `io` ang row = ang pangalan sa I/O list, at ang `io` ang sinusuri. Halimbawa: field MIR-L-1090 (drawing DITL-BA59) `io` MIR-L1090 (STN103 I.0163); ARP / IRP (DITL-42 row 6 / 7) `io` ARP1-SYSERR / IRP1-POWALM; alarm PSL-DO1043-A1 / C1 / D1 `io` PSH-DO1043-x1 (ang alarm list 20160912 ay sumulat ng PSL pero "PRESSURE HIGH SWITCH", set H 5.9: mali ng baybay sa alarm list, nasa listahan para sa user).

Natitira (1, 2026-11-25 8:40 PM): loop STN102 FIQCD1121 SI9990. Ang memory list ng STN102 ay hanggang SI2099 lang; ang STN105 memory list ay nagsasabing ang SI9990 ay broadcast mula sa ibang station ("FROM #2 STN104"). Kailangan ang loop list at STN104 memory list sa PC.

## 4. Bukas na item (hindi pa tapos ang Phase 4)

1. Ang 1 natitirang pagkakaiba, SI9990 (seksyon 3, kailangan ang PC).
2. Ang DITL / ABC sheets mismo ay may sariling text ng tag at address (pre.txt, apre.txt); ang pagtutugma nila ay binibilang ng QA trace (Phase 7: walang kabit 145, nasa drawing pero wala sa row 130), hindi pa 0.
3. Ang HMI pages ay tumatawag ng tag sa code (`src/ui/plant/hx/`); hindi pa sinusuri ng test na ito (QA trace: I/O tags sa pages 824).
