# Analysis Proof

## Scenario Fixture Provenance

| Item | Fixture reference |
| --- | --- |
| Scenario expected output | `fixtures/forecast-scenario-expected-output.json` |
| Source fixture named by the scenario | `fixtures/forecast-expected-output.json` |
| Scenario label | `probability-review` |

## Expected Outputs

| Output | Expected value |
| --- | --- |
| Current probability | `0.62` |
| Proposed probability | `0.7` |
| If outcome is true | current Brier `0.1444`, proposed Brier `0.09`, delta `-0.0544` |
| If outcome is false | current Brier `0.3844`, proposed Brier `0.49`, delta `0.1056` |
| Caveat | `Preview only; this does not update the forecast or claim certainty.` |

## Fixed Outputs

The scenario fixture fixes these output fields: `forecastId`, `sourceFixture`, and `savedProbability`.

## No Live-Data Dependency

The proof source is a local JSON fixture: `fixtures/forecast-scenario-expected-output.json`. The scenario fixture points only to `fixtures/forecast-expected-output.json`, and the test checks those file references directly. No network endpoint, browser fetch, external market feed, odds feed, or runtime data source is part of this proof.

## Acceptance Command

Use `npm.cmd run build` for the outer acceptance pass. The local proof check is covered by `npm.cmd run test`.
