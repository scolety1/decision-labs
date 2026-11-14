# Deterministic Outputs

## Dashboard Table

| Output | Source | Expected |
| --- | --- | --- |
| Available minutes | `fixtures/day-fixture.json` | 248 |
| Task load minutes | `planDay` | 195 |
| Switch cost minutes | `planDay` | 24 |
| Feasibility score | `planDay` | 1 |
| Overload risk | `planDay` | low |

## Dashboard Rule

Show one next move first, then the computed capacity table. Keep detailed adjustment controls and long task details behind secondary disclosure.

## Scenario Tools

| Output | Source | Expected |
| --- | --- | --- |
| Shrink option risk | `fixtures/day-scenario-expected-output.json` | less tight |
| Defer option risk | `fixtures/day-scenario-expected-output.json` | clearer |
| Drop option risk | `fixtures/day-scenario-expected-output.json` | more open |

Scenario comparisons are preview-only. They may change resulting load, feasibility, and risk labels, but they must not mutate source task estimates, busy windows, or fixture dates.

The deterministic proof for these rows lives in `docs/codex/ANALYSIS_PROOF.md` and is backed by `fixtures/day-scenario-expected-output.json`.
