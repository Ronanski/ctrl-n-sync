# Phase 6 slice 7: open / close command ng 2 motor valve (2026-11-26 PHT)

Ano ang nakikita ng operator: walang bagong ilaw o numero sa screen. Ang naayos ay ang bilang: ang 4 na utos na OPEN / CLOSE ng 2 motor valve
ay kinikilala na bilang nakakabit sa kanilang controller.

- MV-BR1391 (S/H No.1 outlet header to reheater): MOR-BR1391 AO0704 = open, MOS-BR1391 AO0705 = close; controller HICBR1391 (ABC-055).
- MV-HR1391 (hot reheat steam blow-off): MOR-HR1391 AO0708 = open, MOS-HR1391 AO0709 = close; controller PICHR1391 (ABC-054).
- Paano gumagana sa app: ang MV ng controller ay pumapasok sa PO block (pulse output, ang nagbibigay ng maiikling pindot na OPEN o CLOSE sa
  motor hanggang maabot ang hinihinging posisyon: plant.js case 'PO', s.up / s.dn). Ang PO point ng I/O list ay ang mga pulse na iyon.
- Ang QA trace (ang awtomatikong bilang ng pagkakabit) ay tumatanggap na ng PO point bilang output ng controller, pero lamang kapag ang sheet
  ng controller ay may PO block (tools/trace/trace.cjs poOf). Eksaktong 4 point ang nagbago, wala nang iba.
- Bilang: nakakabit 1793 -> 1797; may value 2175 -> 2179; hindi nakakabit 111 -> 107.
- Hindi sinubok: sa browser (live app).
