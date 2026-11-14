# Deterministic Outputs

## Dashboard Table

| Output | Source | Expected |
| --- | --- | --- |
| Monthly surplus | `fixtures/finance-fixture.json` | 1450 |
| Emergency runway | `emergencyRunwayMonths` | 3 |
| Debt interest | `monthlyDebtInterest` | 76.97 |
| Next debt balance | `nextDebtBalance` | 3776.97 |
| Rent-vs-buy delta | `rentVsBuyDelta` | 1300 |

## Scenario Proof

| Output | Source | Expected |
| --- | --- | --- |
| Baseline surplus | `fixtures/finance-scenario-expected-output.json` | 850 |
| Proposed surplus | `fixtures/finance-scenario-expected-output.json` | 1025 |
| Monthly delta | `fixtures/finance-scenario-expected-output.json` | 175 |
| Runway change months | `fixtures/finance-scenario-expected-output.json` | 0.4 |
| Debt interest change | `fixtures/finance-scenario-expected-output.json` | -12 |

Fixed outputs from `fixtures/finance-scenario-expected-output.json`: `sourceSnapshotId`, `baselineSnapshotValues`, and `sourceFixture`.

## Output Rule

Show baseline, scenario, assumption, and change from committed fixtures. These rows are arithmetic from shown assumptions, not financial advice, and they have no account-data dependency.
