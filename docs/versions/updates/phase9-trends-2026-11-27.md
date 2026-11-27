# Phase 9: a trend group set for every HX page with analog values (2026-11-27)

What the operator sees: the Trends view of 25 more pages now lists its trend groups (before: "No trend group is set for this
page yet."). 25 pages, 63 groups, 338 pens in all, 3 to 8 pens a group (the 8-pen limit of the Phase 10 trend recorder).

Source of every pen: a value box or a controller that is already on the same page (its tag and its document are in that page's
comments); no new tag, no new value. Checked in headless at 150 MW (main 8ce52b4 + this change): every pen of the 25 pages shows a
value, none shows "-----".

Pages: drum-steam, feedwater, furnace-gas, combustion-air, coal, overview, turbine, condensate, ash, aux-steam, compressed-air,
extraction, generator, heater-drains, limestone-sand, makeup-cooling, oil-burners, purge-trip, sampling, sea-water, sootblowers,
turbine-interface, turbine-oil, turbine-readings, wall-dampers. reheat-steam had its groups already.

No group (no analog value on the page): ash-recycle and control-system (on / off states only), industrial-water (its 6 values
are NO-SOURCE, no model), turbine-motors, turbine-operation, turbine-states, turbine-valves (state and command pages).

NOT working yet, and not in this change: the lines. On main the recorder (hx-core.js REC.sample) takes no sample: REC.last is set
from the wall-clock fallback of HX.data.time() (about 1.8e9 s) before the simulation time exists (about 72,600 s at 150 MW), so
"t - last < step" stays true. Every trend, reheat too, shows its live value but no line. Sent to the Phase 10 thread (HIKARU),
whose trend recorder change owns hx-core.js.
