# Phase 6 TCS: TCA740 PIF 009 parameters from PA4 009

- PA4 009 prints no names at its four inputs. From top to bottom they are 1.0, 20.0, the inlet valve ramp (105 % or -5 %) and -5.0.
- The twin loop TCA741 prints the same PIF as G 1.0, TI 20.0, HL 105 %, LL -5 %, in the same order with the same values. So the
  inputs give G, TI, HL and LL.
- TCA740 still waits on the PIF SW pin, which the drawing leaves unwired. The backup record has been asked from the PC.
- Count: no change (404 of 419). sheets.cjs, run.cjs and tce-complete.cjs pass.
