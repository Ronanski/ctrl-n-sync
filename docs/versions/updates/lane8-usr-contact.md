# Lane 8 QA: trace counts the field contact (usr) as the writer of a DITL input

- tools/trace/trace.cjs: a DITL input row on the same net as a user contact (simIn ELECTRICAL TROUBLE contact) is "field contact (usr)".
- Old -> new (main 111ca23): B1 DITL rows with no source 131 -> 127 (DITL-22 #A ~ #D).
- 12 motor TRIP rows (DITL-24, 30, 31, 111, 112 and copies) have no usr contact on the same net: still no source, writer to be named.
- Tool only: no app code, no dist, no version.
