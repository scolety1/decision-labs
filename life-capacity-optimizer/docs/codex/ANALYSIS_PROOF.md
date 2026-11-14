# Analysis Proof

## Scenario Fixture Provenance

| Proof item | Fixture reference | Evidence |
| --- | --- | --- |
| Base day inputs | `fixtures/day-fixture.json` | Uses local waking minutes, fixed commitments, recovery buffer, energy multiplier, and three task estimates. |
| Dashboard expected output | `fixtures/day-expected-output.json` | Lists the expected available minutes, task load, switch cost, feasibility score, and low risk label. |
| Adjustment expected output | `fixtures/day-scenario-expected-output.json` | Names the `adjustment-comparison` scenario and the shrink, defer, and drop option rows. |

## Expected Outputs

| Option | Expected recovered minutes | Expected risk label | Source fixture |
| --- | ---: | --- | --- |
| shrink | 30 | less tight | `fixtures/day-scenario-expected-output.json` |
| defer | 60 | clearer | `fixtures/day-scenario-expected-output.json` |
| drop | 90 | more open | `fixtures/day-scenario-expected-output.json` |

## Fixed Outputs

`fixtures/day-scenario-expected-output.json` keeps these outputs fixed for the proof run:

| Fixed output | Why it stays fixed |
| --- | --- |
| `taskIds` | Adjustment rows are preview-only and do not rewrite task identity or estimates. |
| `busyWindows` | The demo uses fixture commitments only; it does not read or write a calendar. |
| `fixtureDate` | The proof is local and repeatable, with no live date source. |

## No-Live-Data Evidence

The scenario proof has no live calendar dependency. It reads local JSON fixtures only: `fixtures/day-fixture.json`, `fixtures/day-expected-output.json`, and `fixtures/day-scenario-expected-output.json`.

The adjustment rows are supportive previews. They do not provide medical advice, observe workers, shame overload, call calendar APIs, fetch live data, or automatically reschedule anything.

## Acceptance Command

Use `npm.cmd run build` for the external acceptance pass.
