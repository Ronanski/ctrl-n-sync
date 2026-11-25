# v1.0.0-beta.580 (LEADER : YUA, lane 0): tag ng sariling makina sa kopya kapag numero ang pagkakaiba

## Ano ang nagbago
- **DITL-61A #B (condensate pump B)**: ang row 25 ay ang strainer ng pump B mismo, DPT-CD1002 (AI0802). Dati ay DPT-CD1001 ng pump A ang nakasulat at walang address ang row. Ang row 28 ay ang strainer ng kabilang pump, DPT-CD1001 (AI0450).
- **DITL-23A #B (BFWP B)**: ang row 11 ay ZSO-FW1032, ang sariling suction valve switch. Dati ay ZSO-FW1031 ng BFWP A ang nakasulat.
- **Paano**: ang I/O list ang nagsasabi. Ang dalawang tag ay magkapares lang kung ang description ng isa, kapag pinalitan ng letra ng makina, ay description ng isa pa. Tatlong tag lang sa buong drawing ang tinamaan.
- Dagdag sa test: tests/lanes/integrator/copy-address.cjs.

## Sinuri
- Luma laban sa bago, 5 minuto sa 150 MW (Node): isang row lang ang nagbago, ang DITL-23A #B row 11, na ngayon ay ZSO-FW1032 at bukas.
- build at check: SAME; no-fit: 0 bago; tests/lanes/run-all.cjs: pasado

YUA
