# The TCS I/O list XSMM_IO_List_R1.xlsx (iolist-tcs.zip on the PC, never in this repo) -> a rows file for tools/data/tcs_io.mjs --xsmm.
# usage: python3 tools/data/tcs_io_xsmm.py <XSMM_IO_List_R1.xlsx> <out.json>
# Sheet "IO LIST R.1 (3)" (the latest revision of the list, 563 rows). Columns as the header rows 1 ~ 3 of the sheet give them:
#   0 No., 1 TAG NO. ('n' = the unit number), 2 DESCRIPTION, 3 KIND (DI / DO / AI / AO / THC / RTD / LVDT / PTI / SERVO), 4 USE (by I/O list
#   for DCS: TRIP / CONT / MON / INT), 5 FUNCTION (measuring point list), 6 redundancy (信号多重化), 7 / 8 digital signal type / voltage,
#   9 / 10 / 11 analog lower / upper / unit, 15 CONTROLLER (EHG / TPC / COM / PLU/COM / TRD/TPC / RY ...), 22 FROM (FIELD, DCS, MCC, TSI,
#   SV, AOV, MOV, AVR, GPP, GCP ...), 24 remark (備考), 27 mismatch note (不一致内容), 28 DCS I/O LIST Rev.A sheet, 29 / 30 IBD Rev.A
#   volume and sheet (TA 21 = IBD TA-21). Only what tools/data/tcs_io.mjs uses is kept.
import openpyxl, json, sys
wb = openpyxl.load_workbook(sys.argv[1], read_only=True, data_only=True)
rows = []
def t(x):
    return ' '.join(str(x).split()) if x is not None else ''
for r in list(wb['IO LIST R.1 (3)'].iter_rows(values_only=True))[3:]:
    r = list(r) + [None] * 50
    if not (r[1] or r[2]):
        continue
    o = {'n': r[0], 'tag': t(r[1]), 'd': t(r[2]), 'k': t(r[3]).upper(), 'use': t(r[4]), 'red': r[6], 'ctl': t(r[15]).replace('ＴＰＣ', 'TPC'), 'fr': t(r[22]).replace('Ｆ', 'F').upper()}
    if r[9] is not None and r[10] is not None and t(r[9]) != '-':
        o['range'] = [r[9], r[10], t(r[11])]
    if r[28] is not None:
        o['dcs'] = t(r[28])
    if r[29]:
        o['ibd'] = t(r[29]) + '-' + t(r[30])
    if r[24]:
        o['note'] = t(r[24])
    rows.append({k: v for k, v in o.items() if v not in ('', None)})
json.dump({'src': 'XSMM_IO_List_R1.xlsx sheet IO LIST R.1 (3) (iolist-tcs.zip)', 'rows': rows}, open(sys.argv[2], 'w'), ensure_ascii=False)
print('rows', len(rows))
