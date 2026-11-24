# RULES — LMYP OTS (ctrl-n-sync)

Ang iisang listahan ng rules ng user para sa buong team. Binabasa sa simula ng bawat session, pagkatapos ng resume at pagkatapos ng bawat compact. Kapag may lumang dokumento na salungat, ito ang nananaig. Kapag may bagong utos ang user, papalitan ang lumang linya dito sa parehong araw; walang dalawang bersyon.

Pinagmulan: ang project instructions ng user, ang Full Audit 3 rules draft (2026-11-21) at ang mga sagot ng user sa Q1 ~ Q15 (2026-11-21), RULES.md ayon sa Q11. Ang mga lumang rule file ay nasa `docs/archive/rules-2026-11-22/` (reference lang). Ang kaalaman tungkol sa DCS ng planta ay nasa `docs/DCS_KNOWLEDGE.md`; ang estado ng trabaho ay nasa `HANDOFF.md`.

## 1. Usapan

1. Maikli, simpleng Taglish, walang jargon. Oras sa PHT, binabasa sa orasan (hindi hula).
2. Sagot muna sa tanong. Buong listahan sa unang bigay. Ang tanong ng user ay sinasagot ng sagot, hindi ng aksyon.
3. Isang ulat bawat gawain: binago, sinubok, hindi sinubok, natitira, susunod. Ang hindi nasubok ay sinasabing hindi nasubok.
4. Walang filler at walang emoji.
5. Ang hinihinging pahintulot ay isang salita.
6. Tanong sa user: isang card na may 2 ~ 4 na pili, may buong background at kung ano ang mangyayari sa bawat pili. Hindi kailanman ipinapalagay ang sagot.
7. Ang user ang nagpapasya sa lahat ng nakikita sa screen; ang team ang nagpapasya sa lahat ng iba, maliban sa goal at release (Q9). Teknikal na pili: mula sa design docs, at isinusulat ang pinagmulan. Huwag itanong ang sagot na nasa docs (Q4, Q5).
8. Maliit na pagbabago: gawin nang diretso; malaki lang ang itinatanong (Q8).

## 2. Team at threads

1. Ang user ang pumipili kung sino ang gagawa. Walang dagdag na trabaho sa thread na hindi pinili ng user.
2. Pangalan ng thread: `ROLE : NAME`.
3. STOP o "tigil" = tigil sa trabaho. Walang sinasarang session at walang thread na kusang nire-resolve; ang user ang nagre-resolve.
4. Kapag malinaw ang susunod na hakbang: gawin, saka mag-ulat nang isang beses.
5. Kilala ng team ang planta at kaya itong patakbuhin gaya ng operator ng LMYP, mula sa plant docs, logic, P&ID at I/O list.
6. Isang thread lang ang gumagamit ng PC hanggang maayos ang isang item; walang salitan. Matutong maghintay (user 2026-11-21).
7. Mabigat na test: isa-isa, gamit ang `team-files/TEST_LOCK`; huwag burahin ang lock ng iba. Huwag pumatay ng proseso ayon sa pangalan.

## 3. Ang app

0A. **Ayos ng trabaho: content muna (user 2026-11-25, "Kumpletuhin muna lahat yan", permanente).** Una, kumpletuhin ang lahat ng logic. Ikalawa, ikonek ang bawat address sa bawat signal. Ikatlo, kumpletuhin ang HMI: bawat sistema at equipment na nasa docs, may controls kung saan dapat, at naka-link sa permissive, logic at interlock sa parehong address para iisang galaw ang logic at HMI. Hindi kasama ang WTP, coal handling at air compressors, dahil walang hanggan ang supply ng demin, coal, compressed air, sand at limestone. Pagkatapos lang nito ang plant model. Lahat ay 100 % tama ayon sa plant documents. Walang tuning ng model habang may kulang pang content. Ang hati ng trabaho ay nasa `docs/audit/lane-plan-content-first-2026-11-25.md`.
1. Iisang planta, logic, HMI, control system, physics model, operator at disenyo. Walang dobleng daan, walang script na pumapalit sa kontrol, walang patch o pansamantalang code, walang daya.
2. Walang training, walang guided start-up, walang Instructor, walang scoring. Planta at operator lang.
3. Gumagana sa physics at thermodynamics. Ang SOP ay gabay lang ng team; wala ito sa app at hindi ito panukat.
4. Bawat value ay galing sa design data (heat balance PPE-14-0725 / 0728, FHI manual, vendor manuals, fan curves, I/O list, logic). Kapag wala: kuwentahin mula sa mass at energy balance, at isulat ang kuwenta bilang comment sa tabi ng value sa code (Q10). Walang curve fit.
5. Bawal ang NO-SOURCE. Ang HMI snapshot ay pang-check lang, hindi pinagmumulan ng value.
6. 150 MW: ang physics at ang tunay na DCS data ay hindi dapat malayo; ang model ay inaayos ayon sa disenyo ng planta, may maliit na tolerance (Q4). Kumpleto na ang plant docs at trends; walang hihingin pa sa user (Q5).
7. Simula: Cold, Warm, Hot at 150 MW. Ang Warm at Hot ay galing sa trip sa 150 MW na pinalamig ng physics (Q3), sinusukat sa ATS criteria.
8. TCS (Hitachi HIACS) at DCS: magkahiwalay na sistema at HMI, Modbus lang ang kabit, iisang planta. TCE / TCA ang nananaig sa IBD; ang trip logic ay mula sa IBD; hindi ginagamit ang Feb 2017.
9. Bawal mag-alis ng link para lang gumana; hanapin ang tamang source (`docs/DCS_KNOWLEDGE.md` 9).
10. Design ang masusunod (user 2026-11-24 "GO DESIGN"): ang design documents lang ang target ng plant model; ang snapshot at trend ng planta ay pang-check lang. Bawat response ng process ay nasa plant model, at sinusunod ang lahat ng kaugnay na logic.
12. **Walang per-load na ayos (user 2026-11-24, ilang araw nang paalala; permanente).** Walang per-load na table, interpolation o constant na ikinabit sa trend o snapshot ng planta sa physics. Ang physics ay galing sa first principles at sa design geometry (FHI, vendor data). Ang set point ay galing lang sa logic curve ng planta (FX ng ABC / DITL / TCS sheet). Ang design curve (FHI Fig, HB case) ay target at panukat sa buong kurba, hindi sa tatlong load lang. Bantay: `tools/check/no-fit.cjs` sa Checks; bagsak ang Checks kapag may bagong linya sa physics na naka-key sa load, MW o snapshot / trend na walang design source. Ang mga lumang fit na nasa `tools/check/no-fit-baseline.json` ay tinatanggal isa-isa (findings D27 ~ D36); bawal magdagdag.
11. Ang "tapos" ay ang `docs/ACCEPTANCE.md` lang (user 2026-11-24 "GO LIST"): tapos ang app kapag pasado ang lahat ng item nito; ang wala roon ay hindi hinahabol; ang user lang ang nagdadagdag o nagbabawas ng item.

## 4. HMI at itsura

1. Dark lang; hindi purong itim, mababa ang contrast, malinaw.
2. Iisang itsura sa buong app: operator, engineer, popups. Iisang faceplate, mini popup.
3. Pinakamaliit na text sa plant drawing: 11 px (ISA-101, Full Audit 3). Ang user ang may huling salita sa nakikita (1.7).
4. Text ng app sa English; paglalarawan ang label, maliit ang tag. RUN = pula, STOP = berde.
5. HMI pages: orihinal, mula sa P&ID, I/O list, ABC at DITL; magkakabit at gumagalaw; kalidad ng Reheat page. Ang user ang nagsasabi kung final na ang bawat page.
6. Logic sheets: live na drawing, kapareho ng PDF sa ayos at gamit, tuwid na linya lang. Hindi kailanman ang PDF mismo.
7. Makitid at naitatagong sidebar; tanging ang mga gamit na feature; Target MW na may rate.
8. Magaan: ≥ 60 FPS sa bawat device at sa buong app, walang exception (Q6).
9. Disenyo para aprubahan: ipakita ang tunay na screen bilang Artifact, hindi palette (Q7).

## 5. Code, test, release

1. Iisang repo: `Ronanski/ctrl-n-sync`. Ang `Ronanski/icms-master-tool` ay reference lang, hindi binubura.
2. Isang PR bawat buong gawain. Kusang merge kapag pasado ang checks (auto-merge); burahin ang branch pagkatapos. Walang force push. Walang conflict marker sa commit.
3. Ang checks ay may behaviour tests mula sa save points at fixed step, at humaharang ang mga ito sa merge.
4. Bawat merge: taas ng version ng app (`delivery/app/app.json`) at isang maikling `docs/versions/v<ver>/UPDATE_REPORT.md`. Jennie = even na beta, Rosé = odd na beta. Iisang file ng estado: `HANDOFF.md`.
5. Ang gumawa ay puwedeng sumubok ng sariling gawa, dahil ang checks ang humaharang sa sira.
6. Automated test: headless, may TEST_LOCK, walang popup, save dialog o nakikitang browser sa PC.
7. Live test: ang tunay na app, nakikitang pindot na parang tao (totoong pindot, hindi code), napapanood ng user nang live, hinuhusgahan ng physics. Ang JS ay pambasa lang. Mula sa save points; buong Cold run kapag ang user lang ang nagsabi.
8. Release (EA o Stable) sa salita lang ng user sa mismong mensahe (`GO EA`, `GO STABLE`). Ang linis ng lumang release ay kusa (Q2).
9. Walang key, password o plant document sa public repo; ang plant docs at trend data ay sa PC lang.

## 6. Rules mismo

1. Iisang listahan ng rules: ang file na ito. Ang `CLAUDE.md` ay isang linya lang na tumuturo dito (Q11).
2. Bagong utos ng user: papalitan ang lumang linya dito sa parehong araw; walang dalawang bersyon.
3. Ang kaalaman sa DCS (iisang signal ang tag, .MAN / .LOC / .REM, BU-CMD, bawal mag-alis ng link) ay nasa `docs/DCS_KNOWLEDGE.md`, hiwalay sa rules.
