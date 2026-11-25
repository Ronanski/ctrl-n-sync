/* HX page: the operator push buttons and lamps of the turbine control system (TCS) for its valves and the generator excitation (lane 7, user 2026-11-25 "Gawan ng
   controls ... ilink ang permissives, logic, interlock, may addresses din ang HMI kung saan mag iisang galaw ang logic at HMI").
   THE SOURCE: /mnt/project-files/lanes/tcs-crt-ports.json (lane 2 TCS IO): the CRT ports of the TCE / TCA sheet program with their
   HMI_DO.xls command rows (HOLD 3000 ms) and the HMI_DI.xls answer-back lamps of the same faceplate (iolist-tcs.zip, PC); the lamp key is
   the CRT lamp of the sheet that draws it (src/digital/tce/<sheet>.js). Generated once from that table; plain English labels.
   A button presses its port in the running TCS program (window.TCE, lane 9); a lamp reads the sheet's lamp. While the program is not
   running both show '-----' (hx-app.js 'crt:' / 'crtl:' hooks). "Enable" = the CRT AVAILABLE port of the faceplate. */
(function () {
  const { L, page } = HX;
  const B = HX.B;
  const at = (it, x, y, o) => Object.assign(it, { x, y }, o || {});
  /* one card a faceplate of the TCS operator station: t = title, b = [label, CRT port] push buttons (a press holds the port 3000 ms,
     HMI_DO.xls), l = [label, sheet, key] lamps (HMI_DI.xls answer-back points that a TCE / TCA sheet draws as a CRT lamp), miss = the
     HMI_DI lamps of the faceplate that no sheet of the TCE / TCA set draws (finding c: not on the typed sheets, not bound) */
  const CARDS = [
    {
      t: 'Field breaker (41)',
      b: [
        ['Close', 'CRT:TCA587.TCA587_1_IKA'],
        ['Enable', 'CRT:TCA587.TCA587_1_IYS'],
        ['Open', 'CRT:TCA587.TCA587_1_JYP']
      ],
      l: [
        ['Close', 'TCA587', 'TCA587_1_IIA'],
        ['Operation permitted', 'TCA587', 'TCA587_1_IYP'],
        ['Open', 'TCA587', 'TCA587_1_YIP']
      ]
    },
    {
      t: 'Excitation',
      b: [
        ['Auto', 'CRT:TCA587.TCA587_2_IKA'],
        ['Enable', 'CRT:TCA587.TCA587_2_IYS'],
        ['Manual', 'CRT:TCA587.TCA587_2_JYP']
      ],
      l: [
        ['Auto', 'TCA587', 'TCA587_2_IIA'],
        ['Operation permitted', 'TCA587', 'TCA587_2_IYP'],
        ['Manual', 'TCA587', 'TCA587_2_YIP']
      ]
    },
    {
      t: 'Power system stabilizer',
      b: [
        ['On', 'CRT:TCA745.TCA745_1_IKA'],
        ['Enable', 'CRT:TCA745.TCA745_1_IYS'],
        ['Off', 'CRT:TCA745.TCA745_1_JYP']
      ],
      l: [
        ['On', 'TCA745', 'TCA745_1_IIA'],
        ['Operation permitted', 'TCA745', 'TCA745_1_IYP'],
        ['Off', 'TCA745', 'TCA745_1_YIP']
      ]
    },
    {
      t: 'Power factor control',
      b: [
        ['On', 'CRT:TCA745.TCA745_2_IKA'],
        ['Enable', 'CRT:TCA745.TCA745_2_IYS'],
        ['Off', 'CRT:TCA745.TCA745_2_JYP']
      ],
      l: [
        ['On', 'TCA745', 'TCA745_2_IIA'],
        ['Off', 'TCA745', 'TCA745_2_YIP'],
        ['Operation permitted', 'TCA745', 'TCA745_2_IYP']
      ]
    },
    {
      t: 'Reactive power control',
      b: [
        ['On', 'CRT:TCA745.TCA745_3_IKA'],
        ['Enable', 'CRT:TCA745.TCA745_3_IYS'],
        ['Off', 'CRT:TCA745.TCA745_3_JYP']
      ],
      l: [
        ['On', 'TCA745', 'TCA745_3_IIA'],
        ['Operation permitted', 'TCA745', 'TCA745_3_IYP'],
        ['Off', 'TCA745', 'TCA745_3_YIP']
      ]
    },
    {
      t: 'Gland seal group',
      b: [
        ['Enable', 'CRT:TCA636.TCA636_1_IYS'],
        ['Start', 'CRT:TCA636.TCA636_1_JYS'],
        ['Start reset', 'CRT:TCA636.TCA636_1_SIKR'],
        ['Stop', 'CRT:TCA638.TCA636_1_JYP'],
        ['Stop reset', 'CRT:TCA638.TCA636_1_PIKR']
      ],
      l: [
        ['Start complete', 'TCA637', 'TCA636_1_IPC'],
        ['Start trouble', 'TCA637', 'TCA636_1_SABN'],
        ['Operation permitted', 'TCA636', 'TCA636_1_IYP'],
        ['Start in progress', 'TCA636', 'TCA636_1_YIRS'],
        ['Permissive', 'TCA636', 'TCA636_1_ABN'],
        ['Stop complete', 'TCA638', 'TCA636_1_PIPC'],
        ['Stop in progress', 'TCA638', 'TCA636_1_YIRP']
      ]
    },
    {
      t: 'Steam seal diverting valve',
      b: [
        ['Auto', 'CRT:TCA605.nFV-GSn036_IKA'],
        ['Reset', 'CRT:TCA605.nFV-GSn036_IKR'],
        ['Enable', 'CRT:TCA605.nFV-GSn036_IYS'],
        ['Condenser side', 'CRT:TCA605.nFV-GSn036_JYC']
      ],
      l: [['Auto', 'TCA605', 'nFV-GSn036_IIA']],
      miss: ['1FVGS1036_IEC', '1FVGS1036_IEO', '1FVGS1036_IYP', '1FVGS1036_ZSC', '1FVGS1036_ZSO']
    },
    {
      t: 'Gland steam blowdown valve',
      b: [
        ['Enable', 'CRT:TCE365.nFV-GSn039_IIR'],
        ['Reset', 'CRT:TCE365.nFV-GSn039_KTR']
      ],
      l: [],
      miss: ['1FVGS1039_IEC', '1FVGS1039_IEO', '1FVGS1039_IYP', '1FVGS1039_ZSC', '1FVGS1039_ZSO']
    },
    {
      t: 'Ventilator valve',
      b: [
        ['Reset', 'CRT:TCE360.nFV-CRn902_IKR'],
        ['Enable', 'CRT:TCE360.nFV-CRn902_IYS']
      ],
      l: [
        ['Trouble', 'TCE360', 'nFV-CRn902_ABN'],
        ['Close fault', 'TCE360', 'nFV-CRn902_IEC'],
        ['Open fault', 'TCE360', 'nFV-CRn902_IEO'],
        ['Operation permitted', 'TCE360', 'nFV-CRn902_IYP'],
        ['Closed', 'TCE360', 'nFV-CRn902_ZSC'],
        ['Open', 'TCE360', 'nFV-CRn902_ZSO']
      ]
    },
    {
      t: 'Exhaust hood spray valve',
      b: [
        ['Auto', 'CRT:TCA738.nFV-CDn904_IKA'],
        ['Manual', 'CRT:TCA738.nFV-CDn904_IKH'],
        ['Reset', 'CRT:TCA738.nFV-CDn904_IKR'],
        ['Enable', 'CRT:TCA738.nFV-CDn904_IYS'],
        ['Open', 'CRT:TCA738.nFV-CDn904_JYO']
      ],
      l: [
        ['Auto', 'TCA738', 'nFV-CDn904_IIA'],
        ['Manual', 'TCA738', 'nFV-CDn904_IIH'],
        ['Trouble', 'TCA738', 'nFV-CDn904_ABN']
      ],
      miss: ['1FVCD1904_IEC', '1FVCD1904_IEO', '1FVCD1904_IYP', '1FVCD1904_ZSC', '1FVCD1904_ZSO']
    },
    {
      t: 'Cold reheat non-return valve',
      b: [
        ['Enable', 'CRT:TCA690.nXV-CRn901AF_IIR'],
        ['Test', 'CRT:TCA690.nXV-CRn901AF_KTA'],
        ['Test cancel', 'CRT:TCA690.nXV-CRn901AF_KTAC'],
        ['Reset', 'CRT:TCA690.nXV-CRn901AF_KTR']
      ],
      l: [
        ['Test feedback', 'TCA690', 'nXV-CRn901AF_ITA'],
        ['Trouble', 'TCA690', 'nXV-CRn901AF_ABN']
      ],
      miss: ['1XVCR1901AF_IEC', '1XVCR1901AF_IEO', '1XVCR1901AF_IYP', '1XVCR1901AF_ZSC', '1XVCR1901AF_ZSO']
    },
    {
      t: 'Extraction 2 non-return valve',
      b: [
        ['Reset', 'CRT:TCA711.nXV-TSn700_IKR'],
        ['Enable', 'CRT:TCA711.nXV-TSn700_IYS'],
        ['Test', 'CRT:TCA711.nXV-TSn700_KTA'],
        ['Test cancel', 'CRT:TCA711.nXV-TSn700_TSC']
      ],
      l: [
        ['Test feedback', 'TCA711', 'nXV-TSn700_ITA'],
        ['Trouble', 'TCA711', 'nXV-TSn700_ABN']
      ],
      miss: ['1XVTS1700_IEC', '1XVTS1700_IEO', '1XVTS1700_IYP', '1XVTS1700_ZSC', '1XVTS1700_ZSO']
    },
    {
      t: 'Extraction 3 primary non-return valve',
      b: [
        ['Reset', 'CRT:TCA712.nXV-TSn710_IKR'],
        ['Enable', 'CRT:TCA712.nXV-TSn710_IYS'],
        ['Test', 'CRT:TCA712.nXV-TSn710_KTA'],
        ['Test cancel', 'CRT:TCA712.nXV-TSn710_KTAC']
      ],
      l: [
        ['Test feedback', 'TCA712', 'nXV-TSn710_ITA'],
        ['Trouble', 'TCA712', 'nXV-TSn710_ABN']
      ],
      miss: ['1XVTS1710_IEC', '1XVTS1710_IEO', '1XVTS1710_IYP', '1XVTS1710_ZSC', '1XVTS1710_ZSO']
    },
    {
      t: 'Extraction 3 secondary non-return valve',
      b: [
        ['Reset', 'CRT:TCA714.nXV-TSn740_IKR'],
        ['Enable', 'CRT:TCA714.nXV-TSn740_IYS'],
        ['Test', 'CRT:TCA714.nXV-TSn740_KTA'],
        ['Test cancel', 'CRT:TCA714.nXV-TSn740_KTAC']
      ],
      l: [
        ['Test feedback', 'TCA714', 'nXV-TSn740_ITA'],
        ['Trouble', 'TCA714', 'nXV-TSn740_ABN']
      ],
      miss: ['1XVTS1740_IEC', '1XVTS1740_IEO', '1XVTS1740_IYP', '1XVTS1740_ZSC', '1XVTS1740_ZSO']
    },
    {
      t: 'Extraction 4 non-return valve',
      b: [
        ['Enable', 'CRT:TCA713.nXV-TSn720_IYS'],
        ['Test', 'CRT:TCA713.nXV-TSn720_KTA'],
        ['Test cancel', 'CRT:TCA713.nXV-TSn720_KTAC'],
        ['Reset', 'CRT:TCA713.nXV-TSn720_KTR']
      ],
      l: [
        ['Test feedback', 'TCA713', 'nXV-TSn720_ITA'],
        ['Trouble', 'TCA713', 'nXV-TSn720_ABN']
      ],
      miss: ['1XVTS1720_IEC', '1XVTS1720_IEO', '1XVTS1720_IYP', '1XVTS1720_ZSC', '1XVTS1720_ZSO']
    },
    {
      t: 'Extraction 5 non-return valve',
      b: [
        ['Reset', 'CRT:TCA715.nXV-TSn730_IKR'],
        ['Enable', 'CRT:TCA715.nXV-TSn730_IYS'],
        ['Test', 'CRT:TCA715.nXV-TSn730_KTA'],
        ['Test cancel', 'CRT:TCA715.nXV-TSn730_KTAC']
      ],
      l: [
        ['Test feedback', 'TCA715', 'nXV-TSn730_ITA'],
        ['Trouble', 'TCA715', 'nXV-TSn730_ABN']
      ],
      miss: ['1XVTS1730_IEC', '1XVTS1730_IEO', '1XVTS1730_IYP', '1XVTS1730_ZSC', '1XVTS1730_ZSO']
    }
  ];
  /* layout: four columns, each card to the shortest column; three boxes a row */
  const COLS = 4,
    CW = 415,
    X0 = 22,
    Y0 = 70,
    BW = 132,
    RH = 40,
    GAP = 18;
  const colY = Array(COLS).fill(Y0),
    items = [],
    texts = [];
  CARDS.forEach((c, n) => {
    const k = colY.indexOf(Math.min(...colY)),
      left = X0 + k * (CW + 20);
    let y = colY[k];
    texts.push({ x: left + 2, y, s: c.t, anchor: 'start' });
    y += 26;
    const row = (list, f) =>
      list.forEach((e, i) => {
        items.push(
          at(f(e), left + BW / 2 + (i % 3) * (BW + 9), y + Math.floor(i / 3) * RH, {
            id: 'k' + n + (f === btn ? 'b' : 'l') + i
          })
        );
        if (i === list.length - 1) y += (Math.floor(i / 3) + 1) * RH;
      });
    const btn = e => B(e[0], 'crt:' + e[1], { press: true, w: BW });
    const lamp = e => B(e[0], 'crtl:' + e[1] + '|' + e[2], { w: BW });
    row(c.b, btn);
    row(c.l, lamp);
    colY[k] = y + GAP;
  });
  page({
    id: 'turbine-valves',
    group: 'Turbine and generator',
    title: 'Turbine valves and excitation',
    about:
      'The operator push buttons and lamps of the turbine control system for its valves and the generator excitation: field breaker, excitation, stabilizer, power factor and reactive power control, gland seal group, steam seal, blowdown and ventilator valves, exhaust hood spray, the non-return valve tests. Source: TCS CRT ports (HMI_DO / HMI_DI of the TCS I/O list) and the TCE / TCA sheets.',
    plan: { look: 'real', w: 1760, h: 1000, items, pipes: [], texts }
  });
})();
