# Phase 10: trend ayon sa DCS ng planta (HIKARU, 2026-11-27 10:10 AM PHT)
- Ang trend ng DCS (textbook INC-TN5A2098 / 2099: trend panel hanggang 8 pen, kinokolekta sa sariling cycle kahit anong screen ang nakikita): ang trend recorder ng HMI pages ay tuloy-tuloy na kahit walang bukas na page. Dati ay nagre-record lang habang bukas ang page, at ang value ng page na hindi bukas ay walang laman.
- Iisang source: ang value ng page na hindi bukas ay binabasa sa parehong link na ipinapakita ng page (`plant.js`: ang reader ng bawat live number ay iisang function na, `readLink`; `lsPlantRead` para sa recorder). Sinubok sa app sa 150 MW: 12 pen ng Reheat page nag-record bago buksan ang page; pagbukas, may history na at pareho ang huling sample sa ipinapakitang value.
- Nakita at inayos: kapag bumalik ang oras (LOAD ng save, o ang oras ng PC bago mag-start ang simulator) humihinto ang recorder. Ngayon, ang samples pagkatapos ng bagong oras ay inaalis at tuloy ang record.
- 8 kulay ng pen (dati 6), hanggang 8 pen bawat grupo. Bantay: `tests/lanes/qa/phase10-trend.cjs`.
- Kulang: trend group nasa Reheat page lang (1 / 33): #9 pagkatapos ng equipment symbols.
