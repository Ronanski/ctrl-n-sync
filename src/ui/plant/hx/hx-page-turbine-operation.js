/* HX page: the operator push buttons and lamps of the turbine control system (TCS) for start-up, speed, load and tests (lane 7, user 2026-11-25 "Gawan ng
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
      t: 'Turbine master trip and reset',
      b: [
        ['Enable', 'CRT:TCE114.TCE114_1_IYS'],
        ['Reset', 'CRT:TCE114.TCE114_1_RSET'],
        ['Trip', 'CRT:TCE114.TCE114_1_TRIP']
      ],
      l: [
        ['Operation permitted', 'TCE114', 'TCE114_1_IYP'],
        ['Reset', 'TCE114', 'TCE114_1_RSTD'],
        ['Tripped', 'TCE114', 'TCE114_1_TRPD']
      ]
    },
    {
      t: 'Turbine alarm reset',
      b: [
        ['Reset', 'CRT:TCE050.TCE050_1_IKR'],
        ['Enable', 'CRT:TCE050.TCE050_1_IYS']
      ],
      l: [
        ['Reset', 'TCE050', 'TCE050_1_IIR'],
        ['Operation permitted', 'TCE050', 'TCE050_1_IYP']
      ]
    },
    {
      t: 'Automatic turbine start-up',
      b: [
        ['Auto', 'CRT:TCA501.TCA501_1_IKA'],
        ['Enable', 'CRT:TCA501.TCA501_1_IYS'],
        ['Off', 'CRT:TCA501.TCA501_1_JYP']
      ],
      l: [
        ['Auto', 'TCA501', 'TCA501_1_IIA'],
        ['Operation permitted', 'TCA501', 'TCA501_1_IYP'],
        ['Off', 'TCA501', 'TCA501_1_YIP']
      ]
    },
    {
      t: 'Start-up mode: start from',
      b: [
        ['High pressure', 'CRT:TCE057.TCE057_1_IMH'],
        ['Intermediate pressure', 'CRT:TCE057.TCE057_1_IMI'],
        ['Enable', 'CRT:TCE057.TCE057_1_IYS']
      ],
      l: [
        ['Operation permitted', 'TCE057', 'TCE057_1_IYP'],
        ['High pressure', 'TCE057', 'TCE057_1_YMH'],
        ['Intermediate pressure', 'TCE057', 'TCE057_1_YMI']
      ]
    },
    {
      t: 'High pressure turbine warming, auto',
      b: [
        ['Auto', 'CRT:TCA630.TCA630_1_IKA'],
        ['Reset', 'CRT:TCA630.TCA630_1_IKR'],
        ['Enable', 'CRT:TCA630.TCA630_1_IYS']
      ],
      l: [
        ['In progress', 'TCA630', 'TCA630_1_IXP'],
        ['Operation permitted', 'TCA630', 'TCA630_1_IYP']
      ]
    },
    {
      t: 'High pressure turbine warming, group',
      b: [
        ['Enable', 'CRT:TCA631.TCA631_1_IYS'],
        ['Start', 'CRT:TCA631.TCA631_1_JYS'],
        ['Stop', 'CRT:TCA633.TCA631_1_JYP']
      ],
      l: [
        ['Start trouble', 'TCA631', 'TCA631_1_ABN'],
        ['Operation permitted', 'TCA631', 'TCA631_1_IYP'],
        ['Started', 'TCA631', 'TCA631_1_YIR'],
        ['Stopped', 'TCA633', 'TCA631_1_YIP'],
        ['Stop trouble', 'TCA633', 'TCA631_1_PABN'],
        ['Stop complete', 'TCA633', 'TCA631_1_PIPC'],
        ['Start complete', 'TCA632', 'TCA631_1_SPIC']
      ]
    },
    {
      t: 'Control valve chest warming',
      b: [
        ['Warming reset', 'CRT:TCE150.TCE150_1_IKR'],
        ['Warming set', 'CRT:TCE150.TCE150_1_IKS'],
        ['Enable', 'CRT:TCE150.TCE150_1_IYS'],
        ['Warming stop', 'CRT:TCE150.TCE150_1_JYP'],
        ['Warming start', 'CRT:TCE150.TCE150_1_JYS'],
        ['Auto', 'CRT:TCE151.TCE150_1_IKA'],
        ['Warming complete', 'CRT:TCE151.TCE150_1_IKC'],
        ['Manual', 'CRT:TCE151.TCE150_1_IKH'],
        ['Full close', 'CRT:TCE151.TCE150_1_JYC'],
        ['Full open', 'CRT:TCE151.TCE150_1_JYO']
      ],
      l: [
        ['Warming mode reset', 'TCE150', 'TCE150_1_IIR'],
        ['Warming mode set', 'TCE150', 'TCE150_1_IIS'],
        ['Operation permitted', 'TCE150', 'TCE150_1_IYP'],
        ['Warming stopped', 'TCE150', 'TCE150_1_YIP'],
        ['Warming started', 'TCE150', 'TCE150_1_YIR'],
        ['Auto', 'TCE151', 'TCE150_1_IIA'],
        ['Manual', 'TCE151', 'TCE150_1_IIH'],
        ['Full closed (manual)', 'TCE151', 'TCE150_1_ZSC'],
        ['Full open (manual)', 'TCE151', 'TCE150_1_ZSO'],
        ['Warming complete', 'TCE152', 'TCE150_1_IIC']
      ]
    },
    {
      t: 'Control valve B crack open sequence',
      b: [
        ['Start', 'CRT:TCE155.TCE155_1_ICS'],
        ['Enable', 'CRT:TCE155.TCE155_1_IYS']
      ],
      l: [
        ['Sequence complete', 'TCE155', 'TCE155_1_IPC'],
        ['Sequence detect', 'TCE155', 'TCE155_1_IYK'],
        ['Sequence started', 'TCE155', 'TCE155_1_IYL'],
        ['Operation permitted', 'TCE155', 'TCE155_1_IYP']
      ]
    },
    {
      t: 'Acceleration rate',
      b: [
        ['Fast', 'CRT:TCE160.TCE160_1_IMF'],
        ['Medium', 'CRT:TCE160.TCE160_1_IMM'],
        ['Slow', 'CRT:TCE160.TCE160_1_IMS'],
        ['Enable', 'CRT:TCE160.TCE160_1_IYS']
      ],
      l: [
        ['Operation permitted', 'TCE160', 'TCE160_1_IYP'],
        ['Fast', 'TCE160', 'TCE160_1_YMF'],
        ['Medium', 'TCE160', 'TCE160_1_YMM'],
        ['Slow', 'TCE160', 'TCE160_1_YMS']
      ]
    },
    {
      t: 'Target speed',
      b: [
        ['Close valves', 'CRT:TCE161.TCE161_1_IMC'],
        ['Low', 'CRT:TCE161.TCE161_1_IML'],
        ['Medium', 'CRT:TCE161.TCE161_1_IMM'],
        ['Rub check', 'CRT:TCE161.TCE161_1_IMN'],
        ['Rated', 'CRT:TCE161.TCE161_1_IMR'],
        ['Enable', 'CRT:TCE161.TCE161_1_IYS']
      ],
      l: [
        ['Operation permitted', 'TCE162', 'TCE161_1_IYP'],
        ['Close valves', 'TCE162', 'TCE161_1_YMC'],
        ['Low', 'TCE162', 'TCE161_1_YML'],
        ['Medium', 'TCE162', 'TCE161_1_YMM'],
        ['Rub check', 'TCE162', 'TCE161_1_YMN'],
        ['Rated', 'TCE162', 'TCE161_1_YMR']
      ]
    },
    {
      t: 'Heat soak',
      b: [
        ['Reset', 'CRT:TCE163.TCE163_1_IKR'],
        ['Set', 'CRT:TCE163.TCE163_1_IKS'],
        ['Enable', 'CRT:TCE163.TCE163_1_IYS']
      ],
      l: [
        ['Heat soak reset', 'TCE163', 'TCE163_1_IIR'],
        ['Heat soak set', 'TCE163', 'TCE163_1_IIS'],
        ['Operation permitted', 'TCE163', 'TCE163_1_IYP']
      ]
    },
    {
      t: 'Speed and load hold',
      b: [
        ['Set', 'CRT:TCE164.TCE164_1_IKH'],
        ['Reset', 'CRT:TCE164.TCE164_1_IKR'],
        ['Enable', 'CRT:TCE164.TCE164_1_IYS']
      ],
      l: [
        ['Hold', 'TCE164', 'TCE164_1_IIH'],
        ['Hold reset', 'TCE164', 'TCE164_1_IIR'],
        ['Critical speed zone', 'TCE164', 'TCE164_1_IXC'],
        ['Operation permitted', 'TCE164', 'TCE164_1_IYP']
      ]
    },
    {
      t: 'Rub check',
      b: [
        ['Required', 'CRT:TCA547.TCA754_1_IKR'],
        ['Bypass', 'CRT:TCA547.TCA754_1_IKS'],
        ['Enable', 'CRT:TCA547.TCA754_1_IYS']
      ],
      l: [
        ['Required', 'TCA547', 'TCA754_1_IIR'],
        ['Bypass', 'TCA547', 'TCA754_1_IIS']
      ]
    },
    {
      t: 'Start-up criteria bypass',
      b: [
        ['Reset', 'CRT:TCA549.TCA549_1_IKR'],
        ['Enable', 'CRT:TCA549.TCA549_1_IYS']
      ],
      l: [
        ['Reset', 'TCA549', 'TCA549_1_IIR'],
        ['Operation permitted', 'TCA549', 'TCA549_1_IYP']
      ]
    },
    {
      t: 'Overspeed test, main',
      b: [
        ['Off', 'CRT:TCE176.TCE176_1_IKC'],
        ['Enable', 'CRT:TCE176.TCE176_1_IYS'],
        ['On', 'CRT:TCE176.TCE176_1_JYS']
      ],
      l: [
        ['Test off', 'TCE176', 'TCE176_1_IIC'],
        ['Operation permitted', 'TCE176', 'TCE176_1_IYP'],
        ['Test on', 'TCE176', 'TCE176_1_YIR']
      ]
    },
    {
      t: 'Overspeed test, back-up',
      b: [
        ['Off', 'CRT:TCE177.TCE177_1_IKC'],
        ['Enable', 'CRT:TCE177.TCE177_1_IYS'],
        ['On', 'CRT:TCE177.TCE177_1_JYS']
      ],
      l: [
        ['Test off', 'TCE177', 'TCE177_1_IIC'],
        ['Operation permitted', 'TCE177', 'TCE177_1_IYP'],
        ['Test on', 'TCE177', 'TCE177_1_YIR']
      ]
    },
    {
      t: 'DCS load control mode',
      b: [
        ['On', 'CRT:TCE180.TCE180_1_IYD'],
        ['Off', 'CRT:TCE180.TCE180_1_IYL'],
        ['Enable', 'CRT:TCE180.TCE180_1_IYS']
      ],
      l: [
        ['Operation permitted', 'TCE180', 'TCE180_1_IYP'],
        ['On', 'TCE180', 'TCE180_1_YID'],
        ['Off', 'TCE180', 'TCE180_1_YIL']
      ]
    },
    {
      t: 'Load up',
      b: [
        ['Enable', 'CRT:TCE184.TCE184_1_IYS'],
        ['Load up start', 'CRT:TCE184.TCE184_1_JYS']
      ],
      l: [
        ['Initial', 'TCE184', 'TCE184_1_IYP'],
        ['Load up started', 'TCE184', 'TCE184_1_YIR']
      ]
    },
    {
      t: 'Intermediate pressure limit',
      b: [
        ['Reset', 'CRT:TCE201.TCE201_1_IKR'],
        ['Select', 'CRT:TCE201.TCE201_1_IKS'],
        ['Enable', 'CRT:TCE201.TCE201_1_IYS']
      ],
      l: [
        ['Limit reset', 'TCE201', 'TCE201_1_IIR'],
        ['Limit selected', 'TCE201', 'TCE201_1_IIS'],
        ['Limiting', 'TCE201', 'TCE201_1_IXM'],
        ['Operation permitted', 'TCE201', 'TCE201_1_IYP']
      ]
    },
    {
      t: 'AFR mode',
      b: [
        ['Reset', 'CRT:TCE170.TCE170_1_IKR'],
        ['Select', 'CRT:TCE170.TCE170_1_IKS'],
        ['Enable', 'CRT:TCE170.TCE170_1_IYS']
      ],
      l: [
        ['Reset', 'TCE170', 'TCE170_1_IIR'],
        ['Set', 'TCE170', 'TCE170_1_IIS'],
        ['Operation permitted', 'TCE170', 'TCE170_1_IYP']
      ]
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
    id: 'turbine-operation',
    group: 'Turbine and generator',
    title: 'Turbine operation',
    about:
      'The operator push buttons and lamps of the turbine control system for start-up, speed, load and tests: master trip and reset, automatic start-up, warming, target speed and acceleration, holds, overspeed tests, load control mode. Source: TCS CRT ports (HMI_DO / HMI_DI of the TCS I/O list) and the TCE / TCA sheets.',
    plan: { look: 'real', w: 1760, h: 1000, items, pipes: [], texts }
  });
})();
