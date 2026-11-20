/* The short description of every TCS sheet (IBD, TCE and TCA), shown in the panel of the sheet. Written from the words and blocks of each drawing
   (IBD 310SC90-794, TCE 331DM09784, TCA 331DM09788). Key = the sheet id, IBD sheets as IBD-<sheet>. Every typed sheet needs one (tools/data/tce_check.mjs). */
const TCS_DESC = {
  'IBD-15':
    'Typical motor logic: START / STOP push buttons with AUTO / MANUAL selection, auto start and auto stop conditions, a stop absolute condition, and the electrical trouble, start fault, stop fault and tripped alarms.',
  'IBD-16':
    'Typical logic of a motor operated valve that seats on torque (seal-in type): OPEN / CLOSE with AUTO / MANUAL, auto open and close conditions, torque and limit switches of both ends, open / close faults and the motor trouble alarm.',
  'IBD-17':
    'Simplified form of the torque seating, seal-in motor operated valve: OPEN / CLOSE, AUTO / MANUAL, torque switches, opening and closing times, open / close faults.',
  'IBD-18':
    'Typical logic of a motor operated valve that seats on position (seal-in type): OPEN / CLOSE with AUTO / MANUAL, auto open and close conditions, torque and limit switches, faults and alarms.',
  'IBD-19':
    'Simplified form of the position seating, seal-in motor operated valve: OPEN / CLOSE, AUTO / MANUAL, opening and closing times, open / close faults.',
  'IBD-20':
    'Typical logic of a motor operated valve that seats on torque and moves only while the push button is held (inching type).',
  'IBD-21':
    'Simplified form of the torque seating, inching motor operated valve: OPEN / CLOSE, AUTO / MANUAL, torque switches and the motor trouble alarm.',
  'IBD-22':
    'Typical logic of an air operated valve: OPEN / CLOSE with AUTO / MANUAL drives its solenoid valve (energize / de-energize), with the open and close fault alarms.',
  'IBD-23':
    'Simplified form of the air operated valve: solenoid energize / de-energize from OPEN / CLOSE, opening and closing times, open / close faults.',
  'IBD-GD-1':
    'Generator space heater: START / STOP, started when the generator breaker 52G is open, with its electrical trouble, start / stop fault and tripped alarms.',
  'IBD-GD-2':
    'AC exciter space heater: START / STOP, started when the generator breaker 52G is open, with its electrical trouble, start / stop fault and tripped alarms.',
  'IBD-GD-5':
    'Generator alarms: stator coil temperature, cooling air cooler outlet temperatures (A to D) and AC exciter outlet air temperature compared to their high limits.',
  'IBD-TA-1':
    'Turbine master trip and master reset: the trip command (from the trip logic and the manual trip push buttons of the CCR and the TCS HMI) and the turbine reset.',
  'IBD-TA-9':
    'Total trip logic: every turbine trip (vacuum, steam temperature, thrust bearing, oil pressures, overspeed, vibration, exhaust conditions), boiler MFT, generator protection and the shutdown command OR-ed into the master trip.',
  'IBD-TA-10':
    'Condenser vacuum very low trip: three LP exhaust hood pressures, middle value selected, compared to the very low and low limits.',
  'IBD-TA-11':
    'Main steam temperature low trip: three MSV inlet steam temperatures, middle value, compared to a limit that varies with the first stage pressure and generator load.',
  'IBD-TA-12':
    'Thrust bearing failure trip: the turbine rotor position (middle of three) compared to the high and very high limits on the front and rear side.',
  'IBD-TA-13':
    'Control oil and bearing oil pressure very low trips: three transmitters each, middle value, compared to the low and very low limits.',
  'IBD-TA-14':
    'LP exhaust hood steam temperature very high trip and turbine trip oil pressure very low trip: three signals each, middle value, compared to their limits.',
  'IBD-TA-15':
    'Overspeed trip and back-up overspeed trip: two sets of three turbine speed signals, middle value, compared to the trip speeds; also the zero speed signal.',
  'IBD-TA-17':
    'Bearing vibration very high trip (1): shaft vibrations X and Y of bearings 1 to 4 against the very high limit, with the 2-condition rule written in the note of the sheet.',
  'IBD-TA-18':
    'Bearing vibration high alarms (2): shaft vibrations X and Y of bearings 1 to 4 compared to the high limits.',
  'IBD-TA-2':
    'Test of the master trip solenoids A1 and A2: each test push button de-energizes one solenoid; turbine reset ends the test.',
  'IBD-TA-3':
    'Test of the master trip solenoids B1 and B2: each test push button de-energizes one solenoid; turbine reset ends the test.',
  'IBD-TA-20':
    'HP turbine exhaust steam temperature very high trip: three temperatures, middle value, compared to the high and very high limits.',
  'IBD-TA-21':
    'HP turbine inlet / exhaust steam differential pressure very high trip: middle of three exhaust pressures against a variable limit.',
  'IBD-TA-22':
    'HP turbine exhaust steam pressure very high trip: three pressures, middle value, compared to the high and very high limits.',
  'IBD-TA-31':
    'Partial close test of main stop valve A: test permissive (MSV B fully open), the fast acting solenoid and the valve position, with test cancel.',
  'IBD-TA-32':
    'Partial close test of main stop valve B: test permissive (MSV A fully open), the fast acting solenoid and the valve position, with test cancel.',
  'IBD-TA-33':
    'Partial close test of control valve A: test permissive, power load unbalance relay, the fast acting solenoid and the valve position.',
  'IBD-TA-34':
    'Partial close test of control valve B: test permissive, power load unbalance relay, the fast acting solenoid and the valve position.',
  'IBD-TA-37':
    'Test of combined reheat valve A: full close test permissive (RSV B fully open), reheat stop valve A position and test position.',
  'IBD-TA-38':
    'Test of combined reheat valve B: full close test permissive (RSV A fully open), reheat stop valve B position and test position.',
  'IBD-TA-41':
    'Sequential full close test of MSV / CV A: permissives, then the servo close and fast close commands of CV A and MSV A in order.',
  'IBD-TA-42':
    'Sequential full close test of MSV / CV B: permissives, then the servo close and fast close commands of CV B and MSV B in order.',
  'IBD-TA-43': 'Permissives of the valve tests: only one MSV, CV or MSV / CV test may run at a time.',
  'IBD-TA-6':
    'Main stop valves full close: all MSV, RSV, CV and ICV closed, sent for boiler reheater protection, house load operation and the electrical trip.',
  'IBD-TA-7':
    'Mechanical trip logic: the four master trip solenoids and the master trip handle dump the trip oil, which closes the main stop, control and reheat valves.',
  'IBD-TB-1':
    'Main oil pump A: START / STOP with AUTO / MANUAL, auto start when pump B stops or on TCS major trouble, with its motor alarms.',
  'IBD-TB-2': 'Main oil pump B: START / STOP with AUTO / MANUAL, auto start when pump A stops, with its motor alarms.',
  'IBD-TB-5':
    'DC emergency oil pump: starts on low bearing oil pressure or when both main oil pumps stop; motor overload and starter alarms.',
  'IBD-TB-9':
    'Turning gear motor: START / STOP and JOG, start permissives (both MSV and ICV closed, bearing oil pressure normal, hand turning interlock), engaged and running signals.',
  'IBD-TB-10':
    'Turning gear engage solenoid: engages the turning gear at zero speed with the main valves closed and the turning motor running.',
  'IBD-TB-12':
    'Main oil tank vapour extractor: START / STOP, alarm when it is stopped while an oil pump runs, with its motor alarms.',
  'IBD-TB-15': 'Oil purifier pump: START / STOP with the electrical trouble, start / stop fault and tripped alarms.',
  'IBD-TB-21': 'Control oil pump A: START / STOP with AUTO / MANUAL, standby start from pump B, with its motor alarms.',
  'IBD-TB-22':
    'Control oil pump B: START / STOP with AUTO / MANUAL, auto start on low discharge pressure of pump A, with its motor alarms.',
  'IBD-TC-1':
    'Torque seating, seal-in drain valve above the seat of MSV A (secondary): OPEN / CLOSE with AUTO / MANUAL, auto open and close from the turbine state (52G, transfer), open / close faults and motor trouble.',
  'IBD-TC-2':
    'Torque seating, seal-in drain valve above the seat of MSV B (secondary): OPEN / CLOSE with AUTO / MANUAL, auto open and close from the turbine state (52G, transfer), open / close faults and motor trouble.',
  'IBD-TC-7':
    'Torque seating, seal-in drain valve above the seat of CV A (secondary): OPEN / CLOSE with AUTO / MANUAL, auto open and close from the turbine state (52G, transfer), open / close faults and motor trouble.',
  'IBD-TC-8':
    'Torque seating, seal-in drain valve above the seat of CV B (secondary): OPEN / CLOSE with AUTO / MANUAL, auto open and close from the turbine state (52G, transfer), open / close faults and motor trouble.',
  'IBD-TC-12':
    'Torque seating, seal-in drain valve below the seat of CRV A (secondary): OPEN / CLOSE with AUTO / MANUAL, auto open and close from the turbine state (52G, transfer), open / close faults and motor trouble.',
  'IBD-TC-13':
    'Torque seating, seal-in drain valve below the seat of CRV B (secondary): OPEN / CLOSE with AUTO / MANUAL, auto open and close from the turbine state (52G, transfer), open / close faults and motor trouble.',
  'IBD-TC-5':
    'Torque seating, inching warming drain valve below the seat of CV B (secondary): opened and closed by the HP turbine warming group control, AUTO / MANUAL.',
  'IBD-TC-17':
    'Ventilator valve: open command from turbine trip, HP turbine heat soak, the warming valve and both CV closed; full open / full close and open / close faults.',
  'IBD-TC-18':
    'Blowdown valve: solenoid open / close from the intercept valve open demand (above 0.1 %); open / close faults.',
  'IBD-TC-19':
    'Cold reheat non return valve: solenoid open / close from the ventilator valve command and both CV closed; fail to open / close alarms.',
  'IBD-TC-20':
    'HP turbine warming valve (inching, torque seating): opened in program control by the warming start group control, closed on trip oil pressure very low or low condenser vacuum.',
  'IBD-TC-28':
    'Gland steam exhauster: START / STOP with the electrical trouble, start / stop fault and tripped alarms.',
  'IBD-TC-31':
    'Steam seal feed inlet valve (position seating, seal-in): OPEN / CLOSE with the motor trouble and open / close fault alarms.',
  'IBD-TC-35':
    'LP exhaust hood water spray valve: AUTO from generator load below 15 % and the gland steam exhauster start, or MANUAL; open / close faults.',
  'IBD-TC-36':
    'Steam seal diverting valve: diverts the steam seal leak-off to the LP heater or the condenser side in AUTO; open / close faults.',
  'IBD-TC-41':
    'No.2 extraction steam non return valve: solenoid open / close, closed on No.1 HP heater level very high or the relay dump valve; with its test and open / close faults.',
  'IBD-TC-42':
    'No.3 extraction steam primary non return valve: solenoid open / close, closed on deaerator storage tank level very high or the relay dump valve; with its test and faults.',
  'IBD-TC-43':
    'No.3 extraction steam secondary non return valve: solenoid open / close, closed on deaerator storage tank level very high or the relay dump valve; with its test and faults.',
  'IBD-TC-44':
    'No.4 extraction steam non return valve: solenoid open / close, closed on No.3 LP heater level very high or the relay dump valve; with its test and open / close faults.',
  'IBD-TC-45':
    'No.5 extraction steam non return valve: solenoid open / close, closed on No.2 LP heater level very high or the relay dump valve; with its test and open / close faults.',
  'IBD-TD-1':
    'Turbine alarms (1): turning gear engaged at speed, turbine speed high / low, bearing oil temperature, control oil filter differential pressure, lube oil cooler outlet temperature, TCS minor trouble.',
  'IBD-TD-2': 'Turbine alarms (2): journal and thrust bearing metal temperatures compared to their high limits.',
  'IBD-TD-3':
    'Turbine alarms (3): HP first stage and reheat bowl temperature differences, gland steam seal header pressure low, main oil tank level high / low.',
  'IBD-TD-4':
    'Turbine alarms (4): low speed eccentricity high, turbine supervisory instrument trouble, LP differential expansion high.',
  'IBD-TD-10':
    'House load operation alarm: 52L open with 52G closed; alarm after 2 hours, and the LP exhaust hood spray valve state.',
  'IBD-TE-1':
    'HP turbine warming start group control: AUTO start from ATS while turning, the steps of the warming valve and drains, progress and complete.',
  'IBD-TE-2':
    'HP turbine warming stop group control: closes the warming valve and the CV B warming drain, progress and complete.',
  'IBD-TE-3':
    'HP turbine warming related auxiliaries in AUTO: the warming line drain, the warming valve and the CV B warming drain all selected AUTO.',
  'IBD-TE-6':
    'Turbine gland seal start group control: starts the gland seal system while turning, with the feed and unloading valves in AUTO.',
  'IBD-TE-7':
    'Turbine gland seal stop group control: stops the gland seal after condenser vacuum break and both MSV closed.',
  'IBD-TE-8':
    'Turbine gland seal related auxiliaries in AUTO: gland steam exhauster and steam seal feed inlet valve in AUTO; first stage and reheat bowl metal temperature checks.',
  TCA040:
    'Digital input (1): MSV, CV and CRV secondary drain valve open / closed / trouble and torque switches to their valve sheets; AC exciter earth fault, auto start ready and control local to the operator station; DI power supply normal.',
  TCA041:
    'Digital input (2): steam seal diverting valve positions, No.4 extraction non-return valve positions, LP heater levels, generator field earth fault, AVR in use / troubles to the operator station, secondary drain valve torque switches; DI power supply normal.',
  TCA042:
    'Digital input (3): MSV(B), CV(B) and CRV(B) secondary drain valve opened / closed / trouble and torque switches, gland steam line drain valve closed, primary and back-up AVR trouble and PSS on; DI power supply normal.',
  TCA043:
    'Digital input (4): No.2 and No.5 extraction non-return valve positions, No.1 HP and No.2 LP heater levels, HP/LP bypass control in auto, oil purifier pump, MSV(B), CV(B) and CRV(B) drain valve torque switches; DI power supply normal.',
  TCA044:
    'Digital input (5): CV(B) secondary warming drain valve positions, trouble and torque switches, HP turbine warming valve positions and torque switches, cold reheat drain valve feedback to the operator station; DI power supply normal.',
  TCA045:
    'Digital input (6): No.3 extraction primary non-return valve positions, deaerator level very high, duplex oil filter dP, generator panel and transformer protection, generator voltage OK, 52L close / open, ASD1 and AVR mode and channel to the operator station; DI power supply normal.',
  TCA046:
    'Digital input (7): AVR set point max / min, over and under excitation limit, PF and reactive power control, AVR VT fuse normal to the operator station; DI power supply normal.',
  TCA047:
    'Digital input (8): No.3 extraction non-return valve positions, HP turbine warming line drain valve auto / open / close (to the operator station), warming valve trouble, main oil tank vapour extractor running and trouble; DI power supply normal.',
  TCA048:
    'Digital input (9): No.1 / No.3 shaft vibration high, LP exhaust hood spray and cold reheat non-return valve positions, generator leakage level, coalescer filter dP, supervisory instrument trouble, condenser vacuum break, gland steam exhauster; DI power supply normal.',
  TCA049:
    'Digital input (10): No.1 / No.3 shaft vibration high, RSR diode fault, steam seal feed and inlet valve positions, trouble and torque switches, generator protection relay and 30DF/64F relay troubles; DI power supply normal.',
  TCA050:
    'Digital input (11): No.2 / No.4 shaft vibration high, 86G-A relay coil open and protection relay (A) trouble to the operator station, main oil tank level low, control oil filter (A) dP, generator and exciter space heaters; DI power supply normal.',
  TCA051:
    'Digital input (12): No.2 / No.4 shaft vibration high, 86G-B relay coil open and protection relay (B) trouble, main oil tank level high, control oil filter (B) dP, gland steam line drain valve, unit transformer protection, all to the operator station; DI power supply normal.',
  TCA052:
    'Digital input (13): trip PCM A / B / C normal, TCS-8 temperature high, Modbus CPU A / B normal and power supply abnormal; DI power supply normal.',
  TCA053:
    'Digital input (14): AC / DC control, lighting and protection power supplies abnormal, TCS-4 / TCS-5 temperature high, EOS operated A / B / C, PLU operated A / B / C; DI power supply normal.',
  TCA310:
    'Analog input diagnostics (1): gland steam seal header pressure (A), generator voltage (A-B) and current (A), each through an AI DIAG.MD block (range, deviation and simulation value) to its logic sheets and the other controller; abnormal to the alarm sheets.',
  TCA311:
    'Analog input diagnostics (2): reheat bowl steam pressure (A), (B) and (C), each through an AI DIAG.MD block to the reheat bowl pressure sheet and the other controller; abnormal to the alarm sheets.',
  TCA312:
    'Analog input diagnostics (3): gland steam seal header pressure (B), generator voltage (B-C), current (B) and field voltage, each through an AI DIAG.MD block to its logic sheets and the other controller; abnormal to the alarm sheets.',
  TCA313:
    'Analog input diagnostics (4): generator field current through an AI DIAG.MD block to the other controller; abnormal to the alarm sheets.',
  TCA314:
    'Analog input diagnostics (5): generator voltage (C-A) and current (C), each through an AI DIAG.MD block to its logic sheets and the other controller; two spare inputs.',
  TCA316:
    'Analog input diagnostics (7): auxiliary steam header pressure (lower) and gland steam drain separator turbine side temperature, each through an AI DIAG.MD block to its logic sheets; one spare input.',
  TCA318:
    'Analog input diagnostics (9): LP turbine differential expansion, turbine shell expansion (HP side) and low speed eccentricity, each through an AI DIAG.MD block to the supervisory sheets and the other controller; abnormal to the alarm sheets.',
  TCA320:
    'Analog input diagnostics (11): generator MVAR and power factor; the power factor goes through a lock, a signal change and a switch to the generator sheets and the other controller; two spare inputs.',
  TCA321:
    'Analog input diagnostics (12): generator frequency through an AI DIAG.MD block to the generator sheets and the other controller; abnormal to the alarm sheets.',
  TCA322:
    'Analog input diagnostics (13): steam seal feed valve, steam packing unloading valve, CV (B) below seat warming drain valve and HP turbine warming valve positions; each simulation value comes from its valve sheet.',
  TCA353:
    'Analog input diagnostics (15), card TCA960: one spare RTD input through an AI DIAG.MD block; abnormal to the alarm sheet.',
  TCA354:
    'Analog input diagnostics (15), card TCA960: No.1 and No.2 turbine journal bearing and No.3 and No.4 bearing metal temperatures, each through an AI DIAG.MD block to the supervisory sheet and the other controller.',
  TCA355:
    'Analog input diagnostics (15), card TCA960: gland steam seal header and LP inlet temperatures, each through an AI DIAG.MD block to the other controller; abnormal to the alarm sheet.',
  TCA356:
    'Analog input diagnostics (15), card TCA960: hot reheat steam, MSV inlet (D), reheat bowl outer metal and LP extraction steam temperatures, each through an AI DIAG.MD block to its logic sheets and the other controller.',
  TCA357:
    'Analog input diagnostics (15), card TCA960: MSV inlet, HP exhaust and LP exhaust hood steam temperatures (A), each through an AI DIAG.MD block to the TCE controller; one spare RTD input.',
  TCA358:
    'Analog input diagnostics (15), card TCA961: reheat bowl inner wall (A), IP turbine 15th and 18th stage inner wall (upper) and thrust bearing front-end (A) metal temperatures through AI DIAG.MD blocks.',
  TCA359:
    'Analog input diagnostics (15), card TCA961: thrust bearing rear-end (A), MSV (B) and CV (B) inner wall and HP exhaust inner wall (upper) metal temperatures; the CV (B) simulation value comes from the TCE controller.',
  TCA360:
    'Analog input diagnostics (15), card TCA961: HP turbine first stage inner wall metal temperature (simulation value from TCA777) and IP turbine 21st stage inner wall (upper, lower) metal temperatures.',
  TCA361:
    'Analog input diagnostics (15), card TCA961: MSV inlet, HP exhaust and LP exhaust hood steam temperatures (B), each through an AI DIAG.MD block to the TCE controller; one spare RTD input.',
  TCA362:
    'Analog input diagnostics (15), card TCA961: reheat bowl inner wall (B), IP turbine 15th and 18th stage inner wall (lower) and thrust bearing front-end (B) metal temperatures through AI DIAG.MD blocks.',
  TCA363:
    'Analog input diagnostics (15), card TCA961: thrust bearing rear-end (B), MSV (B) and CV (B) outer wall and HP exhaust inner wall (lower) metal temperatures; the CV (B) simulation value comes from the TCE controller.',
  TCA364:
    'Analog input diagnostics (15), card TCA961: HP turbine first stage outer wall metal temperature and No.3 and No.4 bearing outlet oil temperatures through AI DIAG.MD blocks.',
  TCA365:
    'Analog input diagnostics (15), card TCA961: MSV inlet, HP exhaust and LP exhaust hood steam temperatures (C), each through an AI DIAG.MD block to the TCE controller; one spare RTD input.',
  TCA370:
    'Input signal diagnostics (1): reheat bowl inner wall metal temperature (A) and (B) into one DUAL INPUT DIAGNOSTICS block; value, abnormal, input error, deviation high and I/O error out.',
  TCA371:
    'Input signal diagnostics (2): gland steam seal header pressure (A) and (B) into one DUAL INPUT DIAGNOSTICS block; value, abnormal, input error, deviation high and I/O error out.',
  TCA372:
    'Input signal diagnostics (3): reheat bowl steam pressure (A), (B) and (C) into one TMR AI DIAGNOSTICS block; the value and the abnormal word out.',
  TCA440:
    'Analog input diagnostics (15), card TCA970: lube oil cooler inlet and outlet (A), (B) oil temperatures and generator stator coil temperature (A), each through an AI DIAG.MD block to the TCE controller.',
  TCA441:
    'Analog input diagnostics (15), card TCA970: generator stator coil temperatures (B) to (E), each through an AI DIAG.MD block to the TCE controller.',
  TCA442:
    'Analog input diagnostics (15), card TCA970: generator cooling gas air cooler outlet temperatures (A) to (D), each through an AI DIAG.MD block to the TCE controller.',
  TCA443:
    'Analog input diagnostics (15), card TCA970: AC exciter outlet air temperature and generator stator coil temperature (F), each through an AI DIAG.MD block to the TCE controller.',
  'G-1A':
    'Generator breaker 52G (1/2): the close order through the closing interlock, the open orders through two OR gates to trip coils TC1 and TC2, and the breaker state out to the panels, lamps and other sheets.',
  'G-1B':
    'Generator breaker 52G (2/2): the permissives for synchronizing, the auto synchronizer start and ASD1 with its close, voltage and speed pulses, and the 52G close order to G-1A.',
  'G-2A':
    '230 kV breaker 52L (1/2): the close order with the close permit through the closing interlock, the open orders through two OR gates to trip coils TC1 and TC2, and the breaker state out to the panels, lamps, DCS and other sheets.',
  'G-2B':
    '230 kV breaker 52L (2/2): the permissives for synchronizing, the auto synchronizer start and ASD2 with its pulses, the initial manual close for the first power receive, and the 52L close order to G-2A.',
  'G-3':
    'AVR, governor and other operation: voltage / speed raise-lower to the AVR and governor (manual or ASD1/ASD2), the manual close of 52G / 52L with the selector, 43-25 and the operation location, the open orders and the auto synchronizer start',
  'G-4':
    'Field switch (41) logic: 41 close with ES and 52G open, rated speed, no trip demand and the excitation start; 41 open on the protection trip demands and AVR major trouble; AVR on / off; 41 and AVR states to the other sheets, ATS, DCS, annunciator and SOE',
  'G-5A':
    'GENERATOR PROTECTION LOGIC A (1/2): the relays of generator protection panel A, with 52G closed and 60FLA not on, to the lockout relay 86G-A and its trips',
  'G-5B':
    'GENERATOR PROTECTION LOGIC A (2/2): pole slip, VT fuse failure, under and over frequency to generator protection A operated, and the ST trip to the generator trip and breaker trip coils',
  'G-6A':
    'GENERATOR PROTECTION LOGIC B (1/2): the relays of generator protection panel B, with 52G closed and 60FLB not on, to the lockout relay 86G-B and its trips',
  'G-6B':
    'GENERATOR PROTECTION LOGIC B (2/2): pole slip, VT fuse failure, under and over frequency to generator protection B operated, and protection A or B to the line breaker trip coils',
  'G-7':
    '230kV SWITCHYARD AND TRANSFORMER PROTECTION LOGIC: switchyard, 86T, 50BF and unit transformer relays to the 52L / 52G trips, 6.6kV incomers, switchyard BF, the generator protection panels and the TCS',
  'G-8A':
    'Alarm for generator protection 1/2: each A/B relay pair to the annunciator and the SOE, the volts/hertz to the ATS',
  'G-8B':
    'Alarm for generator protection 2/2: diode and field earth fault, exciter earth fault, control panel trouble, relay A/B trouble; trip and ready to synchronize to the DCS',
  'G-9':
    'Turbine operation: the signals between the turbine control and the generator sheets',
  TCA100: 'ATS controller condition (1): HMI2 no-receive (communication watch).',
  TCA101: 'ATS controller condition (2): EHG CPU A / B no-receive, network abnormal and the ATS battery error.',
  TCA102:
    'ATS controller condition (3): simulation modes in use, simulation mode reset, ATS communication lost and self loopback.',
  TCA103: 'ATS controller condition (4): turbine reset and the start-up mode select condition (THSC trigger).',
  TCA104: 'ATS controller condition (5): MNT and GW CPU A / B no-receive.',
  TCA106: 'IP / HP start mode as the ATS uses it.',
  TCA500:
    'Start-up mode selection: IP or HP start from the HP first stage inner wall metal temperature and the ambient cold mode, and the memorized temperature for the heat soak timers.',
  TCA501:
    'ATS AUTO / OFF: the automatic turbine start-up program is switched ON or OFF, with its permissives (CRT available, no TCS major trouble, turbine reset).',
  TCA510: 'Step control condition: which steps are completed and which are executing (steps 0 to 8).',
  TCA511:
    'Step control condition: the in and out conditions of each step (rub check speed, rated speed, CV chest temperature, IP to HP transfer).',
  TCA512:
    'Step control condition: step bypass and step select permissives (rub check bypass, field switch closed, halfway start-up, LLM upper, warming complete).',
  TCA514: 'Step control condition: a push button select of one step cancels the select of every other step.',
  TCA515: 'Step control condition: the step up order of each step from its select.',
  TCA516: 'Step control condition: step in order, executing and criteria fault of each step.',
  TCA517: 'Step control condition: step in criteria OK / not OK.',
  TCA518: 'Step control condition: step execution criteria OK / not OK and the unfulfilled criteria alarm.',
  TCA519: 'Step control condition: criteria bypass in progress.',
  TCA520:
    'Step control, step 0 (HP turbine warming): the step control block with its in / out conditions, bypass, permissive and the steps around it; gives step select, in order, executing, completed and start.',
  TCA521:
    'Step control, step 1 (preparation): the step control block with its in / out conditions, bypass, permissive and the steps around it; gives step select, in order, executing, completed and start.',
  TCA522:
    'Step control, step 2 (turbine rub check): the step control block with its in / out conditions, bypass, permissive and the steps around it; gives step select, in order, executing, completed and start.',
  TCA523:
    'Step control, step 3 (acceleration): the step control block with its in / out conditions, bypass, permissive and the steps around it; gives step select, in order, executing, completed and start.',
  TCA524:
    'Step control, step 4 (excitation): the step control block with its in / out conditions, bypass, permissive and the steps around it; gives step select, in order, executing, completed and start.',
  TCA525:
    'Step control, step 5 (sync and initial load): the step control block with its in / out conditions, bypass, permissive and the steps around it; gives step select, in order, executing, completed and start.',
  TCA526:
    'Step control, step 6 (load up): the step control block with its in / out conditions, bypass, permissive and the steps around it; gives step select, in order, executing, completed and start. Also gives start-up sequence completed and the compensation after T/R control.',
  TCA527:
    'Step control, step 7 (normal operation): the step control block with its in / out conditions, bypass, permissive and the steps around it; gives step select, in order, executing, completed and start.',
  TCA528:
    'Step control, step 8 (turbine shut-down): the step control block with its in / out conditions, bypass, permissive and the steps around it; gives step select, in order, executing, completed and start.',
  TCA529:
    'Scope of monitor: which steps are executing (step n and steps n to 7), used to choose the criteria to watch.',
  TCA530:
    'Criteria condition: MSV and CV chest inner / outer wall temperature differences against their limits (CRI 1.32, 1.33).',
  TCA530A:
    'Criteria condition: generator stator coil temperatures and cooling air cooler outlet temperatures (generator temperature criterion).',
  TCA531:
    'Criteria condition: HP first stage and reheat bowl inner / outer wall temperature differences (CRI 1.34, 1.35).',
  TCA532:
    'Criteria condition: TCS normal, reheat steam pressure and temperature not low, HP / LP bypass in AUTO, HP bypass valve closed, hydraulic fluid tank level.',
  TCA533:
    'Criteria condition: turbine reset, MSV and RSV open, load limiter upper, eccentricity, no electrical trip demand, AVR in AUTO, ASD in use, generator disconnector closed.',
  TCA534: 'Criteria condition: thrust and journal bearing metal temperatures high.',
  TCA535:
    'Criteria condition: 41 opened, turbine tripped, shell expansion, load above initial load, IP to HP transfer complete, shutdown load, CV chest warming states.',
  TCA536:
    'Criteria condition: main steam pressure and temperature, condenser vacuum, control and bearing oil pressures.',
  TCA537: 'Criteria condition: shaft vibration high (X / Y above 0.125 mm) of bearings 1 to 4 (CRI 1.24).',
  TCA538: 'Criteria condition: shaft vibration high of bearings 1 to 4 for the alarm.',
  TCA539:
    'Criteria condition: turning gear engaged, lube oil cooler outlet temperature (bearing oil temperature OK), turbine turning, CV A and B completely closed.',
  TCA540: 'Criteria condition: LP exhaust hood steam temperature not high (CRI 1.12).',
  TCA541: 'Criteria condition: thrust bearing failure rotor position and the CV chest warming time remaining.',
  TCA542:
    'Criteria condition: main oil tank level, thrust bearing failure, gland steam seal header pressure low and turbine supervisory instrument trouble.',
  TCA543:
    'Criteria condition: secondary drain valves fully open (CRI 1.25), field switch closed (CRI 1.44) and generator voltage OK (CRI 1.45).',
  TCA544: 'Criteria condition: LP turbine differential expansion OK (CRI 1.28), house load operation and V/F start-up.',
  TCA547:
    'Criteria condition: rub check required or bypassed (ambient cold, cold 1 mode), rub check complete speed and rated speed.',
  TCA548:
    'Criteria condition: HP first stage and reheat bowl metal temperature against the MSV and CRV inlet steam temperatures (steam temperature mismatch).',
  TCA549: 'Bypass reset: one RESET from the operator station clears the criteria bypasses.',
  TCA550:
    'Criteria monitor of criteria 1.1 to 1.4 (TSI OK, TCS normal, main steam pressure and temperature): each one checked while its step is in or executing, with bypass, and the step in / execution criteria not OK.',
  TCA551:
    'Criteria monitor of criteria 1.5 to 1.72 (reheat steam pressure and temperature, steam temperature mismatch): each one checked while its step is in or executing, with bypass, and the step in / execution criteria not OK.',
  TCA552:
    'Criteria monitor of criteria 1.8 to 1.11 (HP / LP bypass in AUTO, gland seal pressure, condenser vacuum): each one checked while its step is in or executing, with bypass, and the step in / execution criteria not OK.',
  TCA553:
    'Criteria monitor of criteria 1.12 to 1.15 (LP exhaust hood temperature, control and bearing oil pressures): each one checked while its step is in or executing, with bypass, and the step in / execution criteria not OK.',
  TCA554:
    'Criteria monitor of criteria 1.16 to 1.19 (bearing oil temperature, main oil tank level, vapour extractor, turning): each one checked while its step is in or executing, with bypass, and the step in / execution criteria not OK.',
  TCA555:
    'Criteria monitor of criteria 1.20 to 1.23 (turbine reset, MSV and RSV open, load limiter upper): each one checked while its step is in or executing, with bypass, and the step in / execution criteria not OK.',
  TCA556:
    'Criteria monitor of criteria 1.24 to 1.27 (vibration, drain valves open, eccentricity): each one checked while its step is in or executing, with bypass, and the step in / execution criteria not OK.',
  TCA557:
    'Criteria monitor of criteria 1.28 to 1.31 (differential expansion, rotor position, bearing and thrust metal temperatures): each one checked while its step is in or executing, with bypass, and the step in / execution criteria not OK.',
  TCA558:
    'Criteria monitor of criteria 1.32 to 1.35 (MSV chest, CV chest, HP first stage and reheat bowl temperature differences): each one checked while its step is in or executing, with bypass, and the step in / execution criteria not OK.',
  TCA559:
    'Criteria monitor of criteria 1.37 and 1.40 (CV A and B closed, generator temperature): each one checked while its step is in or executing, with bypass, and the step in / execution criteria not OK.',
  TCA560:
    'Criteria monitor of criteria 1.41 to 1.44 (no electrical trip demand, AVR OK and in AUTO, 41 closed): each one checked while its step is in or executing, with bypass, and the step in / execution criteria not OK.',
  TCA561:
    'Criteria monitor of criteria 1.45 to 1.48 (generator voltage, ASD in use, disconnector closed, 52G closed): each one checked while its step is in or executing, with bypass, and the step in / execution criteria not OK.',
  TCA562:
    'Criteria monitor of criteria 1.49 to 1.52 (52G opened, 41 opened, turbine tripped, 52L closed): each one checked while its step is in or executing, with bypass, and the step in / execution criteria not OK.',
  TCA563:
    'Criteria monitor of criteria 2.1 to 2.4 (shell expansion, rub check complete speed, rated speed): each one checked while its step is in or executing, with bypass, and the step in / execution criteria not OK.',
  TCA564:
    'Criteria monitor of criteria 2.5 to 2.11 (load above initial load, IP to HP transfer, V/F, shutdown load): each one checked while its step is in or executing, with bypass, and the step in / execution criteria not OK.',
  TCA565:
    'Criteria monitor of criteria 2.81 to 2.84 (CV chest warming mode, AUTO, start and stop): each one checked while its step is in or executing, with bypass, and the step in / execution criteria not OK.',
  TCA566:
    'Criteria monitor of criteria 2.85 to 2.94 (CV chest warming reset, CV B crack open, HP turbine warming complete): each one checked while its step is in or executing, with bypass, and the step in / execution criteria not OK.',
  TCA567:
    'Criteria monitor of criteria 3.1 (house load operation judgement): each one checked while its step is in or executing, with bypass, and the step in / execution criteria not OK.',
  TCA580:
    'Turbine preparation control (1): CV chest warming required, turbine auto reset command and the CV B crack open sequence start.',
  TCA581: 'Turbine preparation control (2): from the HP inner casing first stage temperature.',
  TCA582:
    'Rub check and acceleration control: rub check speed and completion, then acceleration with the heat soak holds.',
  TCA583:
    'Excitation, synchronizing and load up control: excitation start, ASD start, set initial load, initial load hold timer and load up start.',
  TCA583A: 'Load up control: initial load set by ATS and the load up target.',
  TCA584: 'Load and acceleration rate selection: 0, 120, 180 or 360 rpm/min, speed hold, load hold and reset.',
  TCA585: 'Heat soak time (IP start): elapsed and remaining hold times at 1800, 2700 and 3600 rpm and at initial load.',
  TCA586:
    'Heat soak time: elapsed and remaining hold times at 1800, 2700 and 3600 rpm and at initial load, from the memorized temperature.',
  TCA587:
    'Shut down: at shutdown load, open 41, generator breaker and field switch, then the turbine shut-down command.',
  TCA605:
    'Steam seal diverting valve (TC-36) in ATS: AUTO to the condenser or LP heater side from the extraction steam temperature and LP heater level.',
  TCA610:
    'MSV A above seat secondary drain valve (TC-1) in ATS: open and close commands from 52G open, the IP to HP transfer and the drain positions.',
  TCA611:
    'MSV B above seat secondary drain valve (TC-2) in ATS: open and close commands from 52G open and the ICV to CV transfer.',
  TCA615:
    'CV A above seat secondary drain valve (TC-7) in ATS: open and close commands from CV chest warming, MSV open, 52G open and the ICV to CV transfer.',
  TCA616:
    'CV B above seat secondary drain valve (TC-8) in ATS: open and close commands from CV chest warming, turbine reset, 52G open and the ICV to CV transfer.',
  TCA618:
    'CV B below seat secondary warming drain valve (TC-5) in ATS: open and close commands and the valve position.',
  TCA625:
    'CRV A below seat secondary drain valve (TC-12) in ATS: open and close commands from 52G open and the ICV to CV transfer start.',
  TCA626:
    'CRV B below seat secondary drain valve (TC-13) in ATS: open and close commands from 52G and the ICV to CV transfer.',
  TCA630: 'HP turbine warming group control (TE-1, 2), sheet 1: start command, AUTO, reset conditions and stop.',
  TCA631:
    'HP turbine warming group control (TE-1, 2), sheet 2: auto control progress and the warming permissive (turning, condenser vacuum normal, drains in AUTO).',
  TCA632:
    'HP turbine warming group control (TE-1, 2), sheet 3: start progress, the warming line drain and the warming valve in program control.',
  TCA633:
    'HP turbine warming group control (TE-1, 2), sheet 4: auto stop, the CV B drain open and the warming valve full close.',
  TCA768:
    'Speed / load hold: held when a criterion is lost (expansion, exhaust hood temperature, vacuum, bearing oil, vibration) or on thermal stress.',
  TCA769:
    'THSC limit: HP and IP surface and bore thermal stress against their limits set the load up rate (T/R compensation, DCS).',
  TCA825:
    'ATS alarms: HP first stage steam temperature, HP exhaust steam pressure, main steam temperature low and HP inlet / exhaust differential pressure high.',
  TCA831:
    'Communication digital output (2): start-up mode (ambient cold, cold 1, cold 2, warm, hot), load hold, 41 open, PSS and PF control on / off, rated speed.',
  TCA832: 'Communication digital output (3): open and close commands of the secondary drain valves of MSV, CV and CRV.',
  TCA833:
    'Communication digital output (4): start commands of the oil purifier, space heaters, vapour extractor and gland steam exhauster, reactive power on / off, 41 close.',
  TCA850:
    'COM analog output: the sixteen analog outputs of the COMM controller to the PI/O table TCA990 (lube oil cooler temperatures, steam seal feed valve and SPUV demands, HP warming valve, generator current, voltage, MVAR, power factor, frequency).',
  TCA900:
    'COMM DI TABLE(1): digital input card unit 0 slot 5 LYD050A3 of the COMM controller (MSV(A), CV(A), CRV(A) secondary drains, exciter and field earth faults, AVR status, steam seal diverting valve, No.4 extraction NRV).',
  TCA901:
    'COMM DI TABLE(2): digital input card unit 0 slot 6 LYD050A3 of the COMM controller (MSV(B), CV(B), CRV(B) secondary drains, AVR trouble, No.2 and No.5 extraction NRV, heater levels, oil purifier).',
  TCA902:
    'COMM DI TABLE(3): digital input card unit 0 slot 7 LYD050A3 of the COMM controller (CV(B) warming drain, HP warming valve, No.3 extraction primary NRV, generator, 52L and AVR status).',
  TCA903:
    'COMM DI TABLE(4): digital input card unit 0 slot 8 LYD050A3 of the COMM controller (AVR setpoint limits, excitation limiters, PF and reactive power control, VT fuse, No.3 extraction secondary NRV, HP turbine warming line drain valve, main oil tank vapour extractor).',
  TCA904:
    'COMM DI TABLE(5): digital input card unit 0 slot 9 LYD050A3 of the COMM controller (shaft vibration high, spray and cold reheat NRV positions, leakage, filters, vacuum break, gland steam exhauster, steam seal feed valves, 30DF / 64F and protection relay trouble).',
  TCA905:
    'COMM DI TABLE(6): digital input card unit 0 slot A LYD050A3 of the COMM controller (shaft vibration high, 86G relay coils, generator protection relay trouble, main oil tank level, control oil filter, space heaters, gland drain valve, unit transformer protection).',
  TCA906:
    'COMM DI TABLE(7): digital input card unit 0 slot B LYD050A3 of the COMM controller (trip PCM normal, TCS panel temperatures, Modbus power supply and CPU, panel power supplies, EOS and PLU operated).',
  TCA930:
    'COMM AI TABLE(1): analog inputs of the COMM controller, cards unit 1 slot 6, 7 and 8 LYA000A (gland steam seal header and reheat bowl steam pressures, generator voltages, currents and field voltage / current).',
  TCA931:
    'COMM AI TABLE(2): analog inputs of the COMM controller, cards unit 1 slot 9, A and B LYA000A (aux steam header pressure, gland drain separator temperature, turbine expansions and eccentricity, generator MVAR, power factor and frequency).',
  TCA932:
    'COMM AI TABLE(3): analog inputs of the COMM controller, card unit 1 slot C LYA000A (steam seal feed, steam packing unloading, CV(B) warming drain and HP turbine warming valve positions) and two empty cards.',
  TCA960:
    'COMM THC TABLE(1): thermocouple inputs of the COMM controller, cards unit 1 slot 0 (spare) and slot 1 LYA210A (bearing metal, gland steam, reheat, main, extraction and exhaust steam temperatures).',
  TCA961:
    'COMM THC TABLE(2): thermocouple inputs of the COMM controller, cards unit 1 slot 2 and slot 3 LYA210A (turbine metal, thrust bearing, main and exhaust steam and No.3 / No.4 bearing oil temperatures).',
  TCA970:
    'COMM RTD TABLE(1): RTD inputs of the COMM controller, card unit 1 slot 4 LYA220A (lube oil cooler, generator stator coil, cooling gas and AC exciter air temperatures) and an empty second card.',
  TCA980:
    'Communication digital output table (1): CRV, CV and MSV secondary drain valves, steam seal feed inlet valve, gland steam line drain, start-up mode, load hold, 41 open, PSS / PF control, rated speed, ST trip.',
  TCA981:
    'Communication digital output table (2): CRV, MSV and CV secondary drain valves, HP warming valve and line drain, excitation start and mode, auxiliaries start, reactive power regulator, PLU / EOS tests.',
  TCA982:
    'Communication digital output table (3): solenoid valve commands of the cold reheat and extraction non return valves, steam seal diverting valve and LP exhaust hood spray.',
  TCA990:
    'Communication analog output table (1): lube oil cooler outlet temperature, gland steam and SPUV valve demand, HP warming valve, generator current, voltage, MVar, power factor and frequency.',
  TCE022: 'Explanation of the symbols used on the logic sheets.',
  TCE023: 'Explanation of the PI/O tables on the logic sheets (slot, type, unit, address).',
  TCE040:
    'Digital input (1): control, main and DC emergency oil pump running and trouble, bearing oil pressure, hand turning.',
  TCE041:
    'Digital input (2): DCS control mode, disconnector, 52G, speed raise / lower, 41, 52L, HP bypass valve full close.',
  TCE042: 'Digital input (3): control and main oil pump B, turning gear motor, auto sync start and remote select.',
  TCE043: 'Digital input (4): communication CPU run and power supply states, PLU operated.',
  TCE050:
    'Controller condition (1): CRT available, reset and operation permit, annunciator reset, monitor and HMI major trouble, GW no-receive.',
  TCE051: 'Controller condition (2): ATS, GW and MNT CPU A / B no-receive and the EHG battery error.',
  TCE052:
    'Controller condition (3): simulation modes, actual valve mode, CCS interface mode, communication lost and self loopback of EHG A / B.',
  TCE053:
    'Controller condition (4): turbine trip oil, CV B crack open, PLU operation, ICV fast close and CV / ICV forced close.',
  TCE057: 'IP / HP start mode selected from the operator station.',
  TCE060:
    'Analog input diagnostics: the three HP turbine exhaust steam pressure signals checked for deviation; the good value goes out with an abnormal flag.',
  TCE061:
    'Analog input diagnostics: the three bearing oil pressure signals checked for deviation; the good value goes out with an abnormal flag.',
  TCE062:
    'Analog input diagnostics: the three control oil pressure signals checked for deviation; the good value goes out with an abnormal flag.',
  TCE063:
    'Analog input diagnostics: the three turbine trip oil pressure signals checked for deviation; the good value goes out with an abnormal flag.',
  TCE064:
    'Analog input diagnostics: the three HP turbine first stage steam pressure signals checked for deviation; the good value goes out with an abnormal flag.',
  TCE065:
    'Analog input diagnostics: the three LP turbine exhaust hood steam pressure signals checked for deviation; the good value goes out with an abnormal flag.',
  TCE066:
    'Analog input diagnostics: the three turbine rotor position signals checked for deviation; the good value goes out with an abnormal flag.',
  TCE067:
    'Analog input diagnostics: the three MSV inlet steam temperature signals checked for deviation; the good value goes out with an abnormal flag.',
  TCE068:
    'Analog input diagnostics: the three HP turbine exhaust steam temperature signals checked for deviation; the good value goes out with an abnormal flag.',
  TCE069:
    'Analog input diagnostics: the three LP turbine exhaust hood steam temperature signals checked for deviation; the good value goes out with an abnormal flag.',
  TCE070:
    'Analog input diagnostics: the two generator MW signals checked; the good value goes out with an abnormal flag.',
  TCE071: 'Analog input diagnostics: shaft vibration X / Y of turbine bearings 1 and 2.',
  TCE072: 'Analog input diagnostics: shaft vibration of turbine bearing 2 and generator bearing 3.',
  TCE073: 'Analog input diagnostics: shaft vibration X / Y of generator bearing 4.',
  TCE075:
    'Digital input diagnostics: bearing shaft vibration very high (A) of bearings 1 to 4; each signal read three times, input error and discrepancy alarms.',
  TCE076:
    'Digital input diagnostics: generator / transformer protection and boiler MFT; each signal read three times, input error and discrepancy alarms.',
  TCE077: 'Digital input diagnostics: triple inputs; each signal read three times, input error and discrepancy alarms.',
  TCE078:
    'Digital input diagnostics: triple inputs and power supply normal; each signal read three times, input error and discrepancy alarms.',
  TCE079:
    'Digital input diagnostics: ventilator valve full close / full open position; each signal read three times, input error and discrepancy alarms.',
  TCE080: 'Digital input diagnostics: triple inputs; each signal read three times, input error and discrepancy alarms.',
  TCE081: 'Digital input diagnostics: triple inputs; each signal read three times, input error and discrepancy alarms.',
  TCE082:
    'Digital input diagnostics: master trip solenoids A1 and B1 trip position; each signal read three times, input error and discrepancy alarms.',
  TCE083:
    'Digital input diagnostics: bearing shaft vibration very high (B) of bearings 1 to 4; each signal read three times, input error and discrepancy alarms.',
  TCE084:
    'Digital input diagnostics: generator and unit transformer protection, boiler MFT 2, generator lock-out relay; each signal read three times, input error and discrepancy alarms.',
  TCE085: 'Digital input diagnostics: triple inputs; each signal read three times, input error and discrepancy alarms.',
  TCE086:
    'Digital input diagnostics: triple inputs and power supply normal; each signal read three times, input error and discrepancy alarms.',
  TCE087:
    'Digital input diagnostics: blowdown valve full close / full open position; each signal read three times, input error and discrepancy alarms.',
  TCE088: 'Digital input diagnostics: triple inputs; each signal read three times, input error and discrepancy alarms.',
  TCE089: 'Digital input diagnostics: triple inputs; each signal read three times, input error and discrepancy alarms.',
  TCE090:
    'Digital input diagnostics: master trip solenoids A2 and B2 trip position; each signal read three times, input error and discrepancy alarms.',
  TCE091:
    'Digital input diagnostics: bearing shaft vibration very high (C) of bearings 1 to 4; each signal read three times, input error and discrepancy alarms.',
  TCE092:
    'Digital input diagnostics: generator protection A / B; each signal read three times, input error and discrepancy alarms.',
  TCE093: 'Digital input diagnostics: triple inputs; each signal read three times, input error and discrepancy alarms.',
  TCE094:
    'Digital input diagnostics: triple inputs and power supply normal; each signal read three times, input error and discrepancy alarms.',
  TCE095:
    'Digital input diagnostics: acceleration relay, PLU operated and the turbine manual trip push buttons (CCR); each signal read three times, input error and discrepancy alarms.',
  TCE096: 'Digital input diagnostics: triple inputs; each signal read three times, input error and discrepancy alarms.',
  TCE097: 'Digital input diagnostics: triple inputs; each signal read three times, input error and discrepancy alarms.',
  TCE098:
    'Digital input diagnostics: triple inputs and power supply normal; each signal read three times, input error and discrepancy alarms.',
  TCE099:
    'Digital input diagnostics: MSV and CV fast acting solenoid energize commands; each signal read three times, input error and discrepancy alarms.',
  TCE099A:
    'Digital input diagnostics: ICV A / B fast acting solenoid energize commands; each signal read three times, input error and discrepancy alarms.',
  TCE100: 'Input signal diagnostics: PLU, EOS, overspeed trip and zero speed triple inputs.',
  TCE101:
    'Input signal diagnostics (1): the two MSV inlet steam pressure signals (dual input, deviation and I/O error).',
  TCE102: 'Input signal diagnostics (2): main and control oil pump A discharge pressure and hot reheat steam pressure.',
  TCE103: 'Input signal diagnostics (3): target MW demand.',
  TCE104: 'Input signal diagnostics (4): main and control oil pump B and emergency oil pump discharge pressures.',
  TCE110:
    'TPC signal diagnostics: condenser vacuum, main steam temperature and thrust bearing failure trips compared between the controllers (discrepancy alarms).',
  TCE111:
    'TPC signal diagnostics: control and bearing oil pressure, LP exhaust hood temperature and trip oil pressure trips compared between the controllers (discrepancy alarms).',
  TCE112:
    'TPC signal diagnostics: HP exhaust steam temperature, inlet / exhaust differential pressure and exhaust pressure trips compared between the controllers (discrepancy alarms).',
  TCE113:
    'TPC signal diagnostics: generator / transformer protection, shut-down command and manual trips compared between the controllers (discrepancy alarms).',
  TCE113A: 'TPC signal diagnostics: the turbine trip command compared between the controllers (discrepancy alarms).',
  TCE114: 'TPC signal diagnostics: CRT trip and reset compared between the controllers (discrepancy alarms).',
  TCE115:
    'TPC signal diagnostics: master trip solenoid test push buttons A1, A2, B1, B2 compared between the controllers (discrepancy alarms).',
  TCE116:
    'TPC signal diagnostics: ICV A / B fast acting during the valve test compared between the controllers (discrepancy alarms).',
  TCE117:
    'TPC signal diagnostics: master trip solenoids A1 and A2 compared between the controllers (discrepancy alarms).',
  TCE118:
    'TPC signal diagnostics: master trip solenoids B1, B2 and CRT operation permit compared between the controllers (discrepancy alarms).',
  TCE119:
    'TPC signal diagnostics: master trip solenoid B2 test, boiler MFT 1 and 2 not synchronous, manual trip push button (CCR) compared between the controllers (discrepancy alarms).',
  TCE119A:
    'TPC signal diagnostics: shaft vibration very high trips of bearings 1 to 4 compared between the controllers (discrepancy alarms).',
  TCE120: 'Valve control diagnostics of MSV A: position transmitters (LVDT) and servo amplifiers A and B checked.',
  TCE121:
    'Valve control diagnostics of MSV A: position C, test, full open / full close positions and the abnormal alarm.',
  TCE122: 'Valve control diagnostics of MSV B: position transmitters (LVDT) and servo amplifiers A and B checked.',
  TCE123:
    'Valve control diagnostics of MSV B: position C, test, full open / full close positions and the abnormal alarm.',
  TCE124: 'Valve control diagnostics of CV A: position transmitters (LVDT) and servo amplifiers A and B checked.',
  TCE125:
    'Valve control diagnostics of CV A: position C, test, full open / full close positions and the abnormal alarm.',
  TCE126: 'Valve control diagnostics of CV B: position transmitters (LVDT) and servo amplifiers A and B checked.',
  TCE127:
    'Valve control diagnostics of CV B: position C, test, full open / full close positions and the abnormal alarm.',
  TCE128: 'Valve control diagnostics of ICV A: position transmitters (LVDT) and servo amplifiers A and B checked.',
  TCE129:
    'Valve control diagnostics of ICV A: position C, test, full open / full close positions and the abnormal alarm.',
  TCE130: 'Valve control diagnostics of ICV B: position transmitters (LVDT) and servo amplifiers A and B checked.',
  TCE131:
    'Valve control diagnostics of ICV B: position C, test, full open / full close positions and the abnormal alarm.',
  TCE132: 'Position diagnostics of RSV A: position transmitters A and B checked.',
  TCE133: 'Position diagnostics of RSV A: position C, full open and the abnormal alarm.',
  TCE134: 'Position diagnostics of RSV B: position transmitters A and B checked.',
  TCE135: 'Position diagnostics of RSV B: position C, full open and the abnormal alarm.',
  TCE140: 'Turbine speed diagnostics (1): speed pickups 1A, 1B, 1C, their counters and abnormal flags.',
  TCE141: 'Turbine speed diagnostics (2): speed pickups 2A, 2B, 2C, their counters and abnormal flags.',
  TCE142: 'Turbine speed diagnostics (3): speed pickups 3A, 3B, 3C, their counters and abnormal flags.',
  TCE143:
    'Turbine speed diagnostics (4): selection of the turbine speed from A, B, C, deviation high, count mode below 2400 and 100 rpm.',
  TCE144: 'Turbine speed diagnostics (5).',
  TCE145: 'Back-up governor: BUG operated A, B, C give the back-up overspeed trip; overspeed test mode.',
  TCE150: 'CV warming control (1): CV chest warming set / reset, start and stop from the operator station.',
  TCE151: 'CV warming control (2): AUTO / MANUAL, full open / full close and warming complete.',
  TCE152:
    'CV warming control (3): during CV warming, turbine start permissive, warming complete and the CV B crack open sequence.',
  TCE153: 'CV warming control (4): upper CV inner / outer temperature decides warming complete.',
  TCE154: 'CV warming control (4A): lower CV inner / outer temperature decides warming complete.',
  TCE155: 'CV warming control (5): opening / closing speed and position of CV warming upper and lower.',
  TCE160: 'Target acceleration: SLOW, MED or FAST selected from the operator station.',
  TCE161: 'Target speed (1): close valves, rub check, low, medium or rated speed selected.',
  TCE162: 'Target speed (2): the target speed value for each selection.',
  TCE163: 'Target speed for heat soak: heat soak set / reset and the CV hold speed.',
  TCE164: 'Target speed hold: hold set / reset, refused in the critical speed zone.',
  TCE166: 'Acceleration relay: acceleration rate set, operated speed, back-up and rated speed.',
  TCE167: 'Speed control mode: speed up or rated speed control.',
  TCE168: 'Speed up control: target speed and acceleration rate against the actual acceleration.',
  TCE169: 'Speed control: the speed controller output and the ICV forced full open.',
  TCE170: 'AFR mode (1): AFR select / reset from the operator station.',
  TCE171: 'AFR mode (2): LLM control or governor control.',
  TCE172: 'Change over between the control modes.',
  TCE176: 'Overspeed test (main governor): test on / off, maximum target speed and the rate.',
  TCE177: 'Overspeed test (back-up): test on / off, maximum target speed and the rate.',
  TCE178: 'Overspeed / speed swing: ASD in use and the governor up / down set at auto synchronizing start.',
  TCE179: 'Rated speed adjust: lower and upper limits.',
  TCE180: 'DCS control mode: on / off from the operator station, coordinated control in AUTO and its feedback.',
  TCE182: 'Droop control.',
  TCE183: 'Load control mode (1): MW control or back-up electrical load.',
  TCE184: 'Load control mode (2): load up start, HP / IP back-up, HP bypass closed, transfer region and complete.',
  TCE185: 'Load up rate.',
  TCE190: 'Load control (1): initial load demand and load up target for IP or HP start.',
  TCE191: 'Load control (2): initial load and transfer region targets give the flow demand (0 to 100 % = 0 to 150 MW).',
  TCE194: 'Target load: governor and LLM manual operation (increase / decrease).',
  TCE195: 'Governor control (1): CCS set point and actual set.',
  TCE196: 'Governor control (2): governor up / down, manual operation, runback position.',
  TCE201: 'IP unloader select: IP limit select / reset from the main steam pressure.',
  TCE202: 'IP unloader: the IP limiting action from the main steam pressure.',
  TCE205: 'Load limiter (LLM) control: upper demand from ATS and increase / decrease.',
  TCE206:
    'Flow control (1): the flow demand from speed, droop and load, limited by LLM and governor, with the test patterns.',
  TCE207: 'Flow control (2): CV opening with bias and the ICV minimum opening at the CV hold speed.',
  TCE210: 'MSV A control: open / close positions and the opening and closing speeds for the full and partial tests.',
  TCE211: 'MSV B control: open / close positions and the opening and closing speeds for the tests.',
  TCE212:
    'CV A and B control: CV demand to the valves, test states, trip oil pressure and the CV B crack open sequence.',
  TCE214: 'ICV A and B control: ICV demand, fast acting solenoids and the test opening / closing speeds.',
  TCE218: 'Servo on (1): servo amplifiers of MSV A and B on, with their abnormal alarms.',
  TCE219: 'Servo on (2): servo amplifiers of ICV A and B on, with their abnormal alarms.',
  TCE220: 'MSV test: partial test permissives of MSV A / B and the test states.',
  TCE222: 'CV test: partial test permissives of CV A / B and the close test ready.',
  TCE224: 'MSV / CV test state (TA-43): one turbine valve test at a time.',
  TCE226: 'CRV test (1): CRV A / B test available.',
  TCE227: 'CRV test (2): ICV A full open / full close during the test.',
  TCE228: 'CRV test (3): ICV B full open / full close during the test.',
  TCE250: 'Main stop valve full close (TA-6): turbine trip, HP control valves closed, house load operation.',
  TCE300: 'Main oil pump (TB-1, 2): the standby pump starts on low discharge pressure of the running pump.',
  TCE305: 'Control oil pump (TB-21, 22): the standby pump starts on low discharge pressure of the running pump.',
  TCE310: 'Emergency oil pump (TB-5): starts on AC trouble of both main oil pumps or low bearing oil pressure.',
  TCA634:
    'HP turbine warming group control (TE-1, 2), sheet 5: warming complete when the HP first stage inner wall metal temperature stays over 150 degC for 230 min, or after the holding time.',
  TCA636:
    'Turbine gland seal group control (TE-6, 7): start in progress from the group start command or the operator station, with the seal feed and unloading valves in AUTO, vacuum break complete and aux. steam temperature OK; reset and complete.',
  TCA637:
    'Turbine gland seal group control (TE-6, 7), start steps: drain valve full open and full close commands, open command of the steam seal feed inlet valve, start complete, and start trouble after 480 s.',
  TCA638:
    'Turbine gland seal group control (TE-6, 7), stop: stop in progress from the group stop command or the operator station with vacuum broken and the valves in AUTO, the stop permissive, the stop command to the exhauster, stop complete and stop trouble after 400 s.',
  TCA639:
    'Turbine gland seal group control (TE-6, 7), conditions: the start and stop related auxiliaries in AUTO, and aux. steam temperature OK (over 275 degC in ambient cold mode, else over 200 degC).',
  TCA650:
    'Steam seal feed inlet valve (TC-31) motor valve: auto open by the gland seal start group, auto close by the stop group; open / close commands, opened, closed and AUTO out.',
  TCA655:
    'Main oil tank vapour extractor (TB-12) motor: start command held by a set / reset memory, running out, and the extractor stopped alarm when it is not running while an oil pump runs for 5 s.',
  TCA680:
    'Gland steam exhauster (TC-28) motor: auto start and stop by the gland seal start and stop groups; start command, running and AUTO out.',
  TCA685:
    'HP turbine warming valve (TC-20) motor valve: opened by the HP turbine warming start group while the aux steam header pressure permits; open / close signals, AUTO, positions and permissive out.',
  TCA686:
    'HP turbine warming valve (TC-20) open / close: open and close signals, or in AUTO with program control by exhaust steam pressure and valve position through flickers; each blocks the other.',
  TCA690:
    'Cold reheat steam non-return valve (TC-19) air operated valve: test set / reset with feedback, solenoid open / close by the ventilator valve, full open / close positions out; trouble alarm when it is not closed with both CVs closed.',
  TCA700:
    'Oil purifier pump (TB-15) motor: held at OFF(0) for auto start, auto stop and trip; electrical trouble and running in; the start command out through an FFR set by STS and reset by OUT.',
  TCA711:
    'No.2 extraction steam non-return valve (TC-41) air operated valve: test set / reset with feedback, open / close by the No.1 HP heater level high, opened / closed positions in; energize command, positions and abnormal lamp out.',
  TCA712:
    'No.3 extraction steam primary non-return valve (TC-42) air operated valve: test set / reset with feedback, open / close by the deaerator storage tank level very high, opened / closed positions in; positions and abnormal lamp out.',
  TCA713:
    'No.4 extraction steam non-return valve (TC-41) air operated valve: test set / reset with feedback, open / close by the No.3 LP heater level very high, opened / closed positions in; positions and abnormal lamp out.',
  TCA714:
    'No.3 extraction steam secondary non-return valve (TC-43) air operated valve: test set / reset with feedback, open / close by the deaerator storage tank level very high, opened / closed positions in; positions and trouble lamp out.',
  TCA715:
    'No.5 extraction steam non-return valve (TC-45) air operated valve: test set / reset with feedback, open / close by the No.2 LP heater level very high, opened / closed positions in; positions and abnormal lamp out.',
  TCA729:
    'Space heater: 52G open sets, its inverse or the electrical trouble resets the generator and the AC exciter space heater commands; trouble and on lamps.',
  TCA738:
    'LP exhaust hood water spray valve (TC-35) air operated valve: auto / manual by push buttons with lamps, opened in auto by gland steam exhauster running and gen load, open push button, reset; opened / closed positions in, outputs and abnormal lamp out.',
  TCA740:
    'Gland seal steam header pressure (aux steam) control: set station and PIF loop on gland seal steam pressure, valve station nZT-GSn031 with MV, position open / close lamps, SSAFV abnormal latch and lamp, inlet valve initial ramp.',
  TCA741:
    'Gland seal steam header pressure (unloading) control: set station and PIF loop on gland seal steam pressure, valve station nZT-GSn034 with MV, position open / close lamps, SPUV abnormal latch and lamp.',
  TCA745:
    'AVR interface: PSS, PF control and reactive power ON / OFF commands from the CRT through TW 1.0 s to the AVR, with their lamps',
  TCA750:
    'THSC interlock (1): THSC INPUT ABNORMAL = INITIAL or one of the four HP-T casing and reheat bowl metal temperature input errors',
  TCA751:
    'Thermal stress (HP): THSC trigger and timer, INIT1 loading / INIT2 half speed / INIT3 others, LAG_ON, and the THSC INITIAL block with the stage and casing metal temperatures (real or simulated)',
  TCA752:
    'Thermal stress (HP): three DISTRIBUTION blocks turn the stage temperatures TH(2)-TH(5) into TH(3)N-TH(5)N and QH(3)N',
  TCA753:
    'THERMAL STRESS(HP): two DISTRIBUTION blocks A004 / A007 (LMA627) for TH(2) and TH(1), as drawn.',
  TCA754:
    'THERMAL STRESS(HP): speed ratio, the THERMAL STRESS block A001 (LMA628) and the HP bore stress, as drawn.',
  TCA755:
    'THERMAL STRESS(IP): the THSC INITIAL block A015 (LMA626 / LMA626A) for the IP stage temperatures, as drawn.',
  TCA756:
    'THERMAL STRESS(IP): three DISTRIBUTION blocks A001 / A004 / A007 (LMA627) for TI(5) to TI(3), as drawn.',
  TCA757:
    'THERMAL STRESS(IP): two DISTRIBUTION blocks A004 / A007 (LMA627) for TI(2) and TI(1), as drawn.',
  TCA758:
    'THERMAL STRESS(IP): IP surface and bore stress from the 5 stage temperatures, bore plus speed ratio term, TB-I',
  TCA760:
    'IP/HP THSC CHANGE(4): HP / IP surface and bore stress and the bore limits (FG of TB-H / TB-I) to the CRT and TCA769',
  TCA762:
    'HP LCFI: HP surface stress above the threshold through the HSG and the FG-1(LCFI) curve, summing timing by CMP, TD and PDF',
  TCA763:
    'IP LCFI: IP surface stress above the threshold through the HSG and the FG-1(LCFI) curve, summing timing by CMP, TD and PDF',
  TCA765:
    'HP LIFE TIME COUNTER: HP LCFI summed at each summing timing into the HP life expenditure value, to the CRT',
  TCA766:
    'IP LIFE TIME COUNTER: IP LCFI summed at each summing timing into the IP life expenditure value, to the CRT',
  TCA767:
    'THSC SPEED/LOAD HOLD: HP / IP surface stress against the mode limits; speed/load hold, stress high, the THSC surface limits and the present stress',
  TCA768A:
    'SPEED LOAD HOLD: the load rate of the start-up mode (MODE blocks on generator load) or the normal/stop rate, to TCA769',
  TCA770:
    'THSC SIMULATION: a ramp integrator through four curves gives the simulated HP / IP inner and outer wall metal temperatures',
  TCA775:
    'GEN MONITOR: three pulse counters total the generator watt-hours, var-hours and excitation transformer watt-hours',
  TCA777:
    'SIMULATOR: simulated CV inner and outer wall metal temperatures, HP-T inner casing temperature and MSV inlet steam temperature',
  TCA780:
    'PLU TEST: the PLU / BUG test sequence on generator load and the PLU detector abnormal diagnosis',
  TCA781:
    'EOS TEST: the EOS test sequence on turbine speed, the EOS detector abnormal diagnosis and two-of-three EOS operated',
  TCA782:
    'EOS turbine speed: the three EOS speed channels into MJL A002, its Y to the CRT and the other sheets.',
  TCA800:
    'Comm alarm (hardware) 1: DI error of unit 0 slots 5 to A, each from two channels through an OR, to the CRT and TCA806.',
  TCA800A:
    'Comm alarm (hardware) 2: DI error of unit 0 slot B from two channels through an OR, to the CRT and TCA806; five spare groups.',
  TCA801:
    'Comm alarm (hardware) 3: the PI/O errors of unit 1 slots 6 and 7, eight each through an OR, as AI error to the CRT and TCA806.',
  TCA801A:
    'Comm alarm (hardware) 4: the PI/O errors of unit 1 slot 8 through an OR (eight spare OFF inputs on a second OR), as AI error to the CRT and TCA806.',
  TCA801B:
    'Comm alarm (hardware) 5: the PI/O errors of unit 1 slots 9 and A, eight each through an OR, as AI error to the CRT and TCA806.',
  TCA801C:
    'Comm alarm (hardware) 6: the PI/O errors of unit 1 slot B through an OR (eight spare OFF inputs on a second OR), as AI error to the CRT and TCA806.',
  TCA801D:
    'Comm alarm (hardware) 7: the PI/O errors of unit 1 slot C through an OR (eight spare OFF inputs on a second OR), as AI error to the CRT and TCA806.',
  TCA802:
    'Comm alarm (hardware) 8: the PI/O errors of unit 1 slot 0 (THC) through two ORs into a third OR, as AI error to the CRT and TCA806.',
  TCA802A:
    'Comm alarm (hardware) 9: the PI/O errors of unit 1 slot 1 (THC) through two ORs into a third OR, as AI error to the CRT and TCA806.',
  TCA802B:
    'Comm alarm (hardware) 10: the PI/O errors of unit 1 slot 2 (THC) through two ORs into a third OR, as AI error to the CRT and TCA806.',
  TCA802C:
    'Comm alarm (hardware) 11: the PI/O errors of unit 1 slot 3 (THC) through two ORs into a third OR, as AI error to the CRT and TCA806.',
  TCA803:
    'Comm alarm (hardware) 12: the PI/O errors of unit 1 slot 4 (RTD) through two ORs into a third OR, as AI error to the CRT and TCA806.',
  TCA804:
    'Comm alarm (hardware) 13: the PI/O errors of unit 0 slots C, D and E, each pair through an OR, as DO error to the CRT and TCA806 (three spare groups on OFF).',
  TCA805:
    'Comm alarm (hardware) 14: the PI/O errors of unit 1 slots D and E (other OR inputs on OFF), each through an OR, as AO error to the CRT and TCA806.',
  TCA806:
    'Comm alarm (hardware) 15: the DI, AI, DO and AO card errors, each group through an OR, into one OR that sets a flip-flop (ANN RESET resets it), as COM I/O HARD ERROR to the CRT and TCA822.',
  TCA810:
    'Alarm: gland steam seal, generator voltage and field, and reheat bowl pressure abnormals through three chained ORs (spare inputs on OFF), as SIGNAL ERROR(1) to TCA816.',
  TCA811:
    'Alarm: generator field, voltage, VAR, power factor and frequency, aux system header and aux steam, and HP turbine expansion and eccentricity abnormals through three chained ORs (spare inputs on OFF), as SIGNAL ERROR(2) to TCA816.',
  TCA812:
    'Alarm: steam seal feed, steam packing unloading, CV(B) secondary warming drain and HP turbine warming valve positions, and RTD abnormal, through three chained ORs (spare inputs on OFF), as SIGNAL ERROR(3) to TCA816.',
  TCA813:
    'Alarm: turbine bearing metal, gland steam seal, steam and turbine casing metal temperature abnormals and RTD abnormal, through three chained ORs (spare inputs on OFF), as SIGNAL ERROR(4) to TCA816.',
  TCA814:
    'Alarm: HP and IP turbine casing metal, thrust bearing, MSV and CV metal and bearing outlet oil temperature abnormals and RTD abnormals, through three chained ORs (spare inputs on OFF), as SIGNAL ERROR(5) to TCA816.',
  TCA815:
    'Alarm: lube oil cooler oil, generator stator coil, cooling gas air cooler outlet and AC exciter outlet air temperature abnormals, through three chained ORs (spare inputs on OFF), as SIGNAL ERROR(2) (as printed) to TCA816.',
  TCA816:
    'Alarm: SIGNAL ERROR(1) to (6) from TCA810 to TCA815 through one OR, as COM SIGNAL ERROR to TCA822.',
  TCA817:
    'Com alarm (DI PS abnormal): each of the 15 DI power supply NORMAL signals through a NOT sets its own flip-flop (ANN RESET resets them); the flip-flops through one OR as COM DI P.S. ABNORMAL to TCA822.',
  TCA818:
    'Alarm: the TCS cubicle fan trouble and temperature high signals, each latched in its own flip-flop (ANN RESET resets them), each to its own CRT, and all through one OR to TCA822.',
  TCA819:
    'Alarm: TPC power supply, EHG CPU (through a NOT) and EHG power supply faults, each latched in its own flip-flop (ANN RESET resets them), each to its own CRT; grouped through three ORs as A, B and C to TCA822.',
  TCA820:
    'Alarm: trip PCM and Modbus CPU faults (each through a NOT) and Modbus power supply faults, each latched in its own flip-flop (ANN RESET resets them), each to its own CRT; grouped through two ORs as A and B to TCA822.',
  TCA821:
    'Alarm: the AC / DC control, lighting and space heater, and AC / DC protection power supply faults, each latched in its own flip-flop (ANN RESET resets them), each to its own CRT and all through one OR to TCA822; both DC protection power supplies abnormal (AND) = PROTECTION P.S. LOST to TCE472.',
  TCA822:
    'Alarm: the COM error, simulation, network, power supply and HMI signals and the alarm groups of TCA818 to TCA821 into one OR as COM MINOR TROUBLE (to CRT); with the EHG, TPC and Modbus faults through a second OR as TCS MINOR TROUBLE to CRT and TCA532.',
  TCA826:
    'Alarm: house load operation with the LP exhaust hood water spray valve open for 7200 s sets HOUSE LOAD OPERATION OVER 2HOURS (reset by the end of house load, the hood steam valve closed or a turbine trip); with generator voltage OK for 5 s, the RSR diode fault, the generator field earth fault, or a 30DF/64F relay trouble or loss of control power give the two relay alarms. Each to A1 / A2 / A3 and CRT.',
  TCA830:
    'COMM digital output (1): sixteen points of the PI/O table TCA980 (1 to 16): the CRV, CV and MSV secondary drain valve commands, the steam seal feed inlet valve commands and closed signal, the turbine gland steam line drain valve commands, AMB. COLD MODE TEMP. and MODE JUDGEMENT INSTRUMENT NORMAL (no first stage or reheat bowl inner wall metal temperature abnormal); one point spare.',
  TCA834:
    'COMM digital output (5): sixteen points of the PI/O table TCA982 (1 to 16): the cold reheat non return valve SV, the No.3 and No.2 extraction steam non return valve and the steam seal diverting valve solenoid valve energize commands; the other twelve points spare.'
};
