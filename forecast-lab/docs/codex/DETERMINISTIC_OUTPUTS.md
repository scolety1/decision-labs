# Deterministic Outputs

## Dashboard Table

| Output | Source | Expected |
| --- | --- | --- |
| 70-79 bucket count | `fixtures/forecast-fixture.json` | 2 |
| Average confidence | `summarizeCalibration` | 0.75 |
| Hit rate | `summarizeCalibration` | 0.5 |
| Average Brier | `summarizeCalibration` | 0.3434 |

## Dashboard Rule

Show the table first. Put audit math, evidence notes, and stale-update details behind row expansion or Model Audit.

## Scenario Proof

`fixtures/forecast-scenario-expected-output.json` fixes the probability-review scenario outputs used by `docs/codex/ANALYSIS_PROOF.md`. It names `fixtures/forecast-expected-output.json` as the source fixture and keeps the preview caveat visible so the scenario cannot be read as certainty, gambling advice, or a live-data feed.
