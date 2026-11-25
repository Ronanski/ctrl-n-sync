# Modbus point lists between the DCS and the package PLCs of LMYP-1 #1 -> src/ui/plant/modbus.js (Library ALL SIGNALS, signal tracer).
# Sources (user's drive D:\LPDSI Documents\LMYP-1 DCS TCS\LMYP-1 #1-DOCUMENT\Subsystem PLC, <system>\IO List):
#   LMYP-1 #1-MODBUS Communication list between DCS and turbine system.xls   (tcs, GCS10F connection 1 / 2, STN102)
#   LMYP-1 _1,2-MODBUS Communication list between DCS and SCADA.xls         (sca, GCS10E connection 7 / 8, STN105)
#   LMYP-1 #1-MODBUS Communication list between DCS and fly ash.xls         (fa, GCS10F connection 3 / 4, STN104)
#   LMYP-1 #1-MODBUS Communication list between DCS and ESP.xls             (esp, GCS10F connection 5 / 6, STN104)
#   LMYP-1 #1-MODBUS Communication list between DCS and CTCS.xls            (ctcs, GCS10F connection 7, STN104)
#   (connections: LMYP-1 #1-Communication list between DCS and package.xls). Coal handling, water treatment, air compressors and air
#   dryers are left out (user 2026-11-25 00:52 PHT).
# Usage: python3 tools/data/modbus.py <folder with the .xls files>
# Kept per row: system, Modbus address, tag, description, type, the SI / WM address written on the row (the lists write it on the first
# row of a block only), from, to, the DCS user tag of the block (104-WB128) and the operator picture (PICT26) written on the row.
# Columns are found by the header row (row 3 of each sheet): the lists of the packages do not all have the same columns.
import xlrd, json, os, sys, glob, re
D = sys.argv[1]
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
def v(c):
    x = c.value
    if isinstance(x, float):
        x = int(x) if x == int(x) else round(x, 6)
    return ' '.join(str(x).split())
SYS = (('*turbine system.xls', 'tcs'), ('*SCADA.xls', 'sca'), ('*fly ash.xls', 'fa'), ('*ESP.xls', 'esp'), ('*CTCS.xls', 'ctcs'))
mb = []
for pat, sysk in SYS:
    fs = glob.glob(os.path.join(D, pat))
    if len(fs) != 1:
        sys.exit('expected one file for ' + pat + ', found ' + str(len(fs)))
    wb = xlrd.open_workbook(fs[0])
    for s in wb.sheets():
        out = s.name.upper().startswith('DCS')
        h1 = [v(c).upper() for c in s.row(1)]
        h2 = [v(c).upper() for c in s.row(2)]
        fr = h1.index('FROM', 7) if 'FROM' in h1[7:] else None
        # address columns: the STN (DCS) side; DCS to PLC: both STN104 / STN102 columns (from, to)
        if out:
            si_cols = [i for i in range(6, fr) if 'STN' in h2[i]]
        else:
            si_cols = [i for i in range(6, fr) if 'STN' in h2[i] or 'INDICATION' in h2[i]]
        for r in range(3, s.nrows):
            a = [v(c) for c in s.row(r)]
            if not a[0] or not (a[1] or a[2]):
                continue
            si = ' '.join(a[i] for i in si_cols if a[i])
            ut = next((x for x in a[fr + 2:] if re.match(r'^\d{3}-[A-Z]+\d+$', x)), '')
            pict = next((x for x in a[fr + 2:] if re.match(r'^PICT\d+$', x)), '')
            mb.append([sysk, a[0], a[1], a[2], a[5], si, a[fr], a[fr + 1], ut, pict])
js = ('/* Modbus point lists between the DCS and the package PLCs of LMYP-1 #1 (turbine system, SCADA, fly ash, ESP, CTCS), made by\n'
      '   tools/data/modbus.py. Read only; shown in the Library ALL SIGNALS tab and the signal tracer. */\n'
      'window.DCS_MODBUS_F=["sys","maddr","tag","d","type","si","from","to","ut","pict"];\n'
      'window.DCS_MODBUS=' + json.dumps(mb, ensure_ascii=False, separators=(',', ':')) + ';\n')
open(os.path.join(ROOT, 'src', 'ui', 'plant', 'modbus.js'), 'w').write(js)
from collections import Counter
print('modbus', len(mb), dict(Counter(m[0] + ' ' + m[6] + '>' + m[7] for m in mb)), 'bytes', len(js))
