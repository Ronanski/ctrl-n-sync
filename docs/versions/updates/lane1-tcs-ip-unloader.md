# Lane 1 (TCS LOGIC, MARIA): TCE202 IP unloader runs, 367 -> 368

Source: TCE202 (331DM09784 page 138) and ML 39 LINEAR CHANGE, macro list TCE016: Y = X*K + B.

- PA2 004 prints no names at its two inputs. The upper input, (held flow demand - 25.3 %) x 0.01, is K. The lower input, 0.0, is B.
- Derivation: only this order gives a working unloader. The output is the held demand at 100 % and 25.3 % at 0 %. The other order
  would make the output a constant whatever the steam pressure.
- Tests: new check in tests/tce/sheets.cjs; the four TCS tests pass.
