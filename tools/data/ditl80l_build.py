"""DITL-80L (sootblower control logic diagram (13), S2 FM0006 P602): the sheet read from its DXF into the sh.sd netlist form of
src/digital/parts/02b-sand.js (a drawing with no row table). Writes one line of src/data/pre.txt, name "(S15)DITL-80L".

What the drawing has (sand-sootblower-logic.zip "(15)Ditl80L.dwg", DXF of other-dxf-not-imported-yet.zip):
  - left: the field limit switches of the lances, each through a relay of the SB PANEL to the DCS: ZSR / ZSE of N-1011, N-1012, N-1013
    and N-1038 drawn, the lances between them shown as the dots; the air heater blowers N-1040 / N-1042 ZSR / ZSE "NOT ON" with their DCS
    addresses I.0736 / I.0735 / I.073A / I.0739 and a NOT each (N-1040 / 1042 S/B RESET, FORWARD);
  - AND -> M.4008 "N-1011~38, AIR PREHEATER S/B ALL ON RETRACT POSITION" (TO 80-14, 80A-14, 80G-5, 80S-17, 80K-5);
  - OR  -> M.4232 "N-1011~38, AIR PREHEATER S/B ANY ON EXTEND POSITION" (TO 80G-10);
  - the group memories written as text only (no gate drawn): M.4246 / M.4247 N-1011~22,25,26 ALL ON RETRACT / ANY ON EXTEND,
    M.4240 / M.4241 N-1023,24,27~34, M.4242 / M.4243 N-1035~38.
The dots and the text-only memories are logic the drawing states without drawing it. They are built from the drawing's own words:
  - each lance the dots stand for is an input row with no text (hidden), its switch address from the I/O list STN102 (ZSR-N10xx /
    ZSE-N10xx, e.g. I.0571 ZSR-N1014 "#1 Sootblower 04 on retracted position"), listed in sd.hrow;
  - the two short input stubs the drawing puts between N-1013 and N-1038 on the AND (y -43.13 / -46.13) and on the OR (-98.60 / -101.60)
    carry the dotted lances: N-1014 ~ N-1025 on the first stub, N-1026 ~ N-1037 on the second (AND / OR of AND / OR: the same function);
  - each text-only memory is a hidden gate (the "hid" gate of the sand form) on its drawn output arrow: AND of the ZSR rows of its group
    (ALL ON RETRACT), OR of the ZSE rows (ANY ON EXTEND).
Usage: python3 tools/data/ditl80l_build.py <(15)Ditl80L.dxf> [src/data/pre.txt]
  reads the I/O list from src/data/ades.txt; with pre.txt: writes the sheet there (a sheet of the same name is replaced), else prints it.
Needs ezdxf (pip install ezdxf); a tool, not part of the app."""
import base64, gzip, json, math, os, re, sys
import ezdxf

EPS = 0.12
dxf = sys.argv[1]
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..')
unb = lambda p: gzip.decompress(base64.b64decode(open(p).read().strip())).decode()
ms = ezdxf.readfile(dxf).modelspace()
ADES = json.loads(unb(os.path.join(ROOT, 'src', 'data', 'ades.txt')))['2']  # STN102 I/O list (the lance limit switches)
adr = {v['tag']: a for a, v in ADES.items() if isinstance(v, dict) and v.get('tag')}

raw = {'ln': [], 'pl': [], 'ci': [], 'ar': [], 'so': [], 'lamp': []}
tx = []
for e in ms:
    t, l = e.dxftype(), e.dxf.layer
    if l.lower() == 'chinese':
        continue
    if t == 'LINE':
        raw['ln'].append([e.dxf.start.x, e.dxf.start.y, e.dxf.end.x, e.dxf.end.y, l])
    elif t == 'LWPOLYLINE':
        raw['pl'].append([[[p[0], p[1]] for p in e.get_points()], 1 if e.closed else 0, l, float(e.dxf.const_width or 0)])
    elif t == 'CIRCLE':
        raw['ci'].append([e.dxf.center.x, e.dxf.center.y, e.dxf.radius, l])
    elif t == 'SOLID':
        v = [e.dxf.vtx0, e.dxf.vtx1, e.dxf.vtx2, e.dxf.vtx3]
        raw['so'].append([[[p.x, p.y] for p in v], l])
    elif t == 'TEXT':
        s = e.dxf.text.strip()
        if not s or re.search('[　-鿿]', s):
            continue
        ins = e.dxf.insert
        tx.append({'t': s, 'ix': ins.x, 'iy': ins.y, 'x': ins.x, 'y': ins.y, 'h': e.dxf.height, 'r': e.dxf.rotation, 'a': 0, 'b': 0, 'l': l})

# ---- symbols (by their geometry on the CON layer) ----
L = [q for q in raw['ln'] if q[4] == 'CON']
hz = lambda q: abs(q[1] - q[3]) < EPS
vt = lambda q: abs(q[0] - q[2]) < EPS
ln_ = lambda q: math.hypot(q[2] - q[0], q[3] - q[1])
# NOT box: a 3 x 3 square with both diagonals (x 212.59 ~ 215.59)
nots = sorted({(round(min(q[0], q[2]), 2), round(min(q[1], q[3]), 2)) for q in L if not hz(q) and not vt(q) and abs(ln_(q) - 4.24) < 0.05})
NOTB = [{'x1': x, 'x2': x + 3, 'y1': y, 'y2': y + 3} for x, y in nots]
# lamp (DCS graphic indication): a 3.6 x 1.8 box with four short diagonals, on a 5.0 stub from its wire
lamps = []
for q in L:
    if hz(q) and abs(ln_(q) - 3.6) < 0.05:
        x1, y = min(q[0], q[2]), q[1]
        if any(hz(r) and abs(ln_(r) - 3.6) < 0.05 and abs(min(r[0], r[2]) - x1) < EPS and abs(r[1] - (y - 1.8)) < 0.05 for r in L):
            lamps.append({'x1': x1, 'x2': x1 + 3.6, 'y1': y - 1.8, 'y2': y})
def inbox(q, b, m=0.95):
    return all(b['x1'] - m <= x <= b['x2'] + m and b['y1'] - m <= y <= b['y2'] + m for x, y in ((q[0], q[1]), (q[2], q[3])))
# AND body: the box right of the input bus (x 301.26 ~ 307.61, y -52.15 ~ -45.85); OR body: the circle
andb = {'x1': 301.26, 'x2': 307.61, 'y1': -52.15, 'y2': -45.85}
assert any(hz(q) and abs(q[1] + 45.85) < 0.05 and abs(min(q[0], q[2]) - 301.26) < 0.05 for q in L), 'AND box not where the drawing has it'
oc = [c for c in raw['ci'] if c[3] == 'CON'][0]
orb = {'x1': oc[0] - oc[2], 'x2': oc[0] + oc[2], 'y1': oc[1] - oc[2], 'y2': oc[1] + oc[2]}
buses = [p for p in raw['pl'] if p[2] == 'CON' and not p[1] and len(p[0]) == 2 and abs(p[0][0][0] - p[0][1][0]) < EPS and abs(p[0][0][1] - p[0][1][1]) > 30]
assert len(buses) == 2, buses
ANDBUS = [b for b in buses if min(b[0][0][1], b[0][1][1]) > -75][0]
ORBUS = [b for b in buses if b is not ANDBUS][0]

# ---- wires: orthogonal CON lines that are not part of a symbol ----
sym = NOTB + lamps + [andb]
wires = []
for k, q in enumerate(raw['ln']):
    if q[4] != 'CON' or not (hz(q) or vt(q)) or ln_(q) < 0.3:
        continue
    if any(inbox(q, b, 0.05) for b in sym):
        continue
    if min(q[1], q[3]) < -265:  # the SB PANEL bracket under the panel title
        continue
    wires.append(k)
# lamp stubs (5.0 long, from the wire down to the lamp box) stay wires: the lamp is a terminal of that net
par = {k: k for k in wires}
def f(a):
    while par[a] != a:
        par[a] = par[par[a]]
        a = par[a]
    return a
def on(p, q, e=0.15):
    x, y = p
    if hz(q):
        return abs(y - q[1]) <= e and min(q[0], q[2]) - e <= x <= max(q[0], q[2]) + e
    return abs(x - q[0]) <= e and min(q[1], q[3]) - e <= y <= max(q[1], q[3]) + e
for i in wires:
    qi = raw['ln'][i]
    for j in wires:
        if j <= i:
            continue
        qj = raw['ln'][j]
        if any(on(p, qj) for p in ((qi[0], qi[1]), (qi[2], qi[3]))) or any(on(p, qi) for p in ((qj[0], qj[1]), (qj[2], qj[3]))):
            par[f(i)] = f(j)
roots = sorted({f(k) for k in wires})
nid = {r: n for n, r in enumerate(roots)}
seg = [None] * len(raw['ln'])
for k in wires:
    seg[k] = nid[f(k)]
N = len(roots)
def net_at(x, y, e=0.6):
    best = None
    for k in wires:
        q = raw['ln'][k]
        if on((x, y), q, e):
            d = min(math.hypot(x - q[0], y - q[1]), math.hypot(x - q[2], y - q[3]))
            if best is None or d < best[0]:
                best = (d, seg[k])
    return None if best is None else best[1]
def ends_at_x(x, ylo, yhi, e=2.5):
    """nets with a wire end at x (the input side of a bus), sorted top to bottom"""
    out = {}
    for k in wires:
        q = raw['ln'][k]
        if not hz(q):
            continue
        xr = max(q[0], q[2])
        if abs(xr - x) <= e and ylo - 0.5 <= q[1] <= yhi + 0.5:
            out[seg[k]] = q[1]
    return [n for n, _ in sorted(out.items(), key=lambda z: -z[1])]

def new_net():
    global N
    N += 1
    return N - 1

# ---- input rows (drawn): the switch texts on the left; their net is the wire through the relay ----
rows, cells, rb, src, outs, term, hrow = [], {}, [], [], [], [], []
def txt_near(x1, x2, y1, y2):
    return [t for t in tx if x1 <= t['ix'] <= x2 and y1 <= t['iy'] <= y2]
def add_row(y, vx, cell, texts, hidden=False):
    i = len(rows)
    r = {'n': i + 1, 'y': y, 'vx': vx}
    if hidden:
        r['hid'] = 1
    rows.append(r)
    rb.append([y - 3.2, y + 3.2] if not hidden else [y, y])
    if texts:
        cells['%d:%s' % (i, cell)] = texts
    return i
SW = [t for t in tx if re.match(r'^N-10\d\d S/B (RETRACT|EXTEND|RESET|FORWARD) POSITION$', t['t'])]
SW.sort(key=lambda t: -t['iy'])
inp = {}  # tag -> (row, net)
for t in SW:
    m = re.match(r'^N-(10\d\d) S/B (\w+) POSITION$', t['t'])
    lab = [u for u in tx if abs(u['ix'] - t['ix']) < 1 and -5 < u['iy'] - t['iy'] < 0 and 'LIMIT SW' in u['t']][0]
    tag = re.search(r'\((Z\w+-N\d+)\)', lab['t']).group(1)
    # the wire of the row: it leaves the LBX box at the row (between the two text lines) toward the relay
    yw = t['iy']
    cand = [k for k in wires if hz(raw['ln'][k]) and abs(raw['ln'][k][1] - yw) < 2.0 and min(raw['ln'][k][0], raw['ln'][k][2]) < 150]
    assert cand, ('no wire for', tag)
    n = seg[cand[0]]
    ad = [u for u in tx if u['l'] == 'DCS' and abs(u['iy'] - raw['ln'][cand[0]][1]) < 1.5 and 190 < u['ix'] < 200]
    i = add_row(raw['ln'][cand[0]][1], {'S': [38.5, 140]}, 'S', [t, lab] + ad)
    src.append({'n': n, 'row': i})
    inp[tag] = (i, n)
    hrow.append({'row': i, 'tag': tag, 'adr': adr.get(tag), 'drawn': 1})

# ---- hidden input rows: the lances the dots stand for (N-1014 ~ N-1037), ZSR and ZSE, address from the I/O list ----
ydots = -155.0
for k in range(1014, 1038):
    for z in ('ZSR', 'ZSE'):
        tag = '%s-N%d' % (z, k)
        n = new_net()
        i = add_row(ydots, {}, 'S', [], hidden=True)
        src.append({'n': n, 'row': i})
        inp[tag] = (i, n)
        hrow.append({'row': i, 'tag': tag, 'adr': adr.get(tag)})
assert all(h['adr'] for h in hrow), [h for h in hrow if not h['adr']]

gates = []
# NOT of the air heater blowers: input = the wire at the left of the box, output = the wire at its right
for b in NOTB:
    yc = (b['y1'] + b['y2']) / 2
    ni, no = net_at(b['x1'] - 1.4, yc, 0.8), net_at(b['x2'] + 0.3, yc)
    assert ni is not None and no is not None and ni != no, (b, ni, no)
    gates.append({'t': 'NOT', 'ins': [ni], 'out': [no], 'box': b})
# hidden gates of the dotted lances on the two stubs of the AND and of the OR
lance = lambda z, ks: [inp['%s-N%d' % (z, k)][1] for k in ks]
def stub(y, xlo, xhi):
    k = [k for k in wires if hz(raw['ln'][k]) and abs(raw['ln'][k][1] - y) < 0.05 and xlo <= min(raw['ln'][k][0], raw['ln'][k][2]) <= xhi]
    assert k, ('stub', y)
    return seg[k[0]], min(raw['ln'][k[0]][0], raw['ln'][k[0]][2])
for (y, xr), t, z, ks in (((-43.13, (240, 252)), 'AND', 'ZSR', range(1014, 1026)), ((-46.13, (240, 252)), 'AND', 'ZSR', range(1026, 1038)),
                          ((-98.60, (270, 282)), 'OR', 'ZSE', range(1014, 1026)), ((-101.60, (270, 282)), 'OR', 'ZSE', range(1026, 1038))):
    n, x0 = stub(y, *xr)
    gates.append({'t': t, 'ins': lance(z, ks), 'out': [n], 'box': {'x1': x0 - 2.4, 'x2': x0, 'y1': y - 1, 'y2': y + 1}, 'hid': 1})
# the drawn AND (M.4008) and OR (M.4232): inputs = the wires that end on the bus
ab, ob = ANDBUS[0], ORBUS[0]
ain = ends_at_x(ab[0][0] - 2.6, min(ab[0][1], ab[1][1]), max(ab[0][1], ab[1][1]))
oin = ends_at_x(ob[0][0] - 2.6, min(ob[0][1], ob[1][1]), max(ob[0][1], ob[1][1]))
aout, oout = net_at(andb['x2'] + 0.3, -49.08), net_at(orb['x2'] + 0.3, -101.56)
assert len(ain) == 8 and len(oin) == 8 and aout is not None and oout is not None, (ain, oin, aout, oout)
gates.append({'t': 'AND', 'ins': ain, 'out': [aout], 'box': {'x1': ab[0][0], 'x2': andb['x2'], 'y1': min(ab[0][1], ab[1][1]), 'y2': max(ab[0][1], ab[1][1])}})
gates.append({'t': 'OR', 'ins': oin, 'out': [oout], 'box': {'x1': ob[0][0], 'x2': orb['x2'], 'y1': min(ob[0][1], ob[1][1]), 'y2': max(ob[0][1], ob[1][1])}})
# the text-only memories: a hidden gate on each drawn output arrow
GRP = {'M.4246': ('AND', 'ZSR', list(range(1011, 1023)) + [1025, 1026]), 'M.4247': ('OR', 'ZSE', list(range(1011, 1023)) + [1025, 1026]),
       'M.4240': ('AND', 'ZSR', [1023, 1024] + list(range(1027, 1035))), 'M.4241': ('OR', 'ZSE', [1023, 1024] + list(range(1027, 1035))),
       'M.4242': ('AND', 'ZSR', list(range(1035, 1039))), 'M.4243': ('OR', 'ZSE', list(range(1035, 1039)))}
MT = {t['t']: t for t in tx if t['l'] == 'DCS' and re.match(r'^M\.4\d\d\d$', t['t'])}
for m, (t, z, ks) in GRP.items():
    y = MT[m]['iy'] - 1.4
    k = [k for k in wires if hz(raw['ln'][k]) and abs(raw['ln'][k][1] - y) < 1.2 and min(raw['ln'][k][0], raw['ln'][k][2]) > 305]
    assert k, m
    q = raw['ln'][k[0]]
    gates.append({'t': t, 'ins': lance(z, ks), 'out': [seg[k[0]]], 'box': {'x1': 304.6, 'x2': 307.6, 'y1': q[1] - 1, 'y2': q[1] + 1}, 'hid': 1})

# ---- output rows: the memories (right side) and the two NOT branches TO 80K-24 / 80K-22 ----
ORD = sorted(MT, key=lambda s: -MT[s]['iy'])
for j, m in enumerate(ORD):
    t0 = MT[m]
    ynext = MT[ORD[j + 1]]['iy'] + 1 if j + 1 < len(ORD) else -275
    y = t0['iy'] - 1.4
    k = [k for k in wires if hz(raw['ln'][k]) and abs(raw['ln'][k][1] - y) < 1.2 and min(raw['ln'][k][0], raw['ln'][k][2]) > 305][0]
    texts = [t0] + [u for u in tx if u['l'] == 'CON' and 330 < u['ix'] < 345 and ynext < u['iy'] <= t0['iy'] + 1]
    i = add_row(raw['ln'][k][1], {'RS': [310, 400]}, 'RS', texts)
    outs.append({'n': seg[k], 'row': i})
for t0 in [t for t in tx if t['t'].startswith('TO : 80K')]:
    k = [k for k in wires if hz(raw['ln'][k]) and abs(raw['ln'][k][1] - t0['iy'] - 1.1) < 1.0 and 234 < min(raw['ln'][k][0], raw['ln'][k][2]) < 237][0]
    i = add_row(raw['ln'][k][1], {'RS': [236, 260]}, 'RS', [t0])
    outs.append({'n': seg[k], 'row': i})
# lamps: terminals of their nets (the DCS graphic indication of each switch)
for b in lamps:
    n = net_at((b['x1'] + b['x2']) / 2, b['y2'] + 0.4)
    if n is not None:
        term.append({'n': n, 'x': (b['x1'] + b['x2']) / 2, 'y': b['y2'], 'lab': '', 'lamp': {'x': (b['x1'] + b['x2']) / 2, 'y': (b['y1'] + b['y2']) / 2}})

used = set()
for c in cells.values():
    used.update(id(t) for t in c)
rest = [t for t in tx if id(t) not in used]
rng = {'F': [38.5, 38.5], 'L': [38.5, 38.5], 'T': [38.5, 38.5], 'S': [38.5, 140], 'RS': [310, 400], 'RL': [400, 400], 'RT': [310, 310]}
sh = {'name': '(S15)DITL-80L', 'title': 'SOOTBLOWER CONTROL LOGIC DIAGRAM(13)', 'raw': raw, 'tx': rest, 'rows': rows, 'rng': rng, 'vr': rng, 'rb': rb,
      'cells': cells, 'sig': {}, 'syms': [], 'lyr': '', 'bv': 28,
      'sd': {'n': N, 'seg': seg, 'gates': gates, 'src': src, 'outs': outs, 'term': term, 'dots': [], 'xcon': [], 'hrow': hrow,
             'from': 'DITL80L.dxf (S2 FM0006 P602), tools/data/ditl80l_build.py'}}
line = json.dumps(sh, separators=(',', ':'))
if len(sys.argv) > 2:
    P = sys.argv[2]
    L = [x for x in unb(P).split('\n') if x]
    names = [json.loads(x)['name'] for x in L]
    if sh['name'] in names:
        L[names.index(sh['name'])] = line
    else:
        L.append(line)
    open(P, 'w').write(base64.b64encode(gzip.compress(('\n'.join(L) + '\n').encode(), 9)).decode() + '\n')
    print('OK', sh['name'], len(L), 'sheets in', P)
else:
    print(line)
