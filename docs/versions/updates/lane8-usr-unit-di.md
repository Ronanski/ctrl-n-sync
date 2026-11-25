# Lane 8 QA: trace counts the usr contact without a usw entry and the unit model writers

- Field contact (usr): no usw entry needed (YUA PR 590 rule). B1 DITL no source 125 -> 109 (12 motor TRIP rows and copies).
- Unit model writers (AN.unit.di): an ABC input the unit model writes on a change is "engine" (ZSO-CD1115 ABC-052, TCS mode, GCB, turning gear, heater level H.H., M.0001). B1 ABC 68 -> 48.
- LINKED 1,779 -> 1,787. Tool only: no app code, no dist, no version.
