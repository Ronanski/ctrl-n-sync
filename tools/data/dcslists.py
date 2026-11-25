# DCS loop list and user tag list of LMYP-1 #1 -> src/ui/plant/dcslists.js (Library, ALL SIGNALS). The Modbus point lists: tools/data/modbus.py.
# Sources (user's drive D:\LPDSI Documents\LMYP-1 DCS TCS, found 2026-11-12):
#   LMYP1 LOOP&USERTAG(new)\STN101~105_LOOP,USERTAG.xls  sheets LOOP_AX (loop list) and UserTag_AX (user tags)
# Usage: python3 tools/data/dcslists.py <folder with the .xls files>
# Only the columns shown in the app are kept: loop tag, name, loop type code, PV / remote SV / MV addresses, PV range and unit;
# user tag name, data name, system tag, data type, scale, unit (rows marked DATA BASE NOT USE are left out).
import xlrd, json, os, sys, glob
D = sys.argv[1]
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
def v(c):
    x = c.value
    if isinstance(x, float):
        x = int(x) if x == int(x) else round(x, 6)
    return ' '.join(str(x).split())
def un(s):
    # the unit cell of the temperature rows reads '\u8693' (one or two, an old code page of the degree Celsius sign); every row
    # that has it is a temperature tag (TI / TIC / TIF ... or a 'temp.' description), checked 2026-11-12
    return '°C' if '\u8693' in s else s
def tg(s):
    return s.replace('ns*2;s*#/', '').strip()
# PV address of the list that the as-built drawing and the I/O list correct (docs/TAGS.md section 3): (station, tag): address
PV_FIX = {('2', 'FIQCD1121'): 'AI0436'}
loops, utag = [], []
for f in sorted(glob.glob(os.path.join(D, 'STN10*_LOOP,USERTAG.xls'))):
    st = os.path.basename(f)[5]
    wb = xlrd.open_workbook(f)
    s = wb.sheet_by_name('LOOP_AX')
    for r in range(9, s.nrows):
        a = [v(c) for c in s.row(r)]
        t = tg(a[1])
        if not t:
            continue
        # 5 type, 13 PV, 14 REM-SV, 15 MV(AO), 33 PV-BS, 34 PV-FS, 35 PV-UNIT
        loops.append([st, t, a[2], a[5], PV_FIX.get((st, t), a[13]), a[14], a[15], a[33], a[34], un(a[35])])
    s = wb.sheet_by_name('UserTag_AX')
    for r in range(2, s.nrows):
        a = [v(c) for c in s.row(r)]
        if not a[2] or a[5] == 'DATA BASE NOT USE':
            continue
        # 1 DATA NAME, 2 USER TAG NAME, 3 SYS TAG NAME, 5 Data Type, 8 base, 9 full, 12 unit
        utag.append([st, tg(a[2]), a[1], a[3], a[5], a[8], a[9], un(a[12])])
js = ('/* DCS loop list and user tag list (STN101~105_LOOP,USERTAG.xls) of LMYP-1 #1,\n'
      '   made by tools/data/dcslists.py. FIQCD1121 PV: list SI9990, as-built ABC-032 AI0436 (docs/TAGS.md 3). Read only; shown in the Library ALL SIGNALS tab. */\n'
      'window.DCS_LOOPS_F=["stn","tag","name","type","pv","rsv","mv","lo","hi","unit"];\n'
      'window.DCS_LOOPS=' + json.dumps(loops, ensure_ascii=False, separators=(',', ':')) + ';\n'
      'window.DCS_UTAG_F=["stn","utag","dname","sys","type","lo","hi","unit"];\n'
      'window.DCS_UTAG=' + json.dumps(utag, ensure_ascii=False, separators=(',', ':')) + ';\n')
open(os.path.join(ROOT, 'src', 'ui', 'plant', 'dcslists.js'), 'w').write(js)
print('loops', len(loops), 'user tags', len(utag), 'bytes', len(js))
