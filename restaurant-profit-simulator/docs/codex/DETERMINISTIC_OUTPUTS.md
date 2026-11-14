# Deterministic Outputs

## Dashboard Table

| Output | Source | Expected |
| --- | --- | --- |
| Weighted average contribution | `fixtures/service-fixture.json` | 11.33 |
| Prime cost percent | `primeCostPercent` | 0.5588 |
| Labor percent | `laborPercent` | 0.3088 |
| Event contribution | `eventContribution` | 2550 |
| Scenario contribution delta | `scenarioDelta` | 490 |

## Scenario Proof

| Output | Source | Expected |
| --- | --- | --- |
| Baseline contribution | `fixtures/service-scenario-expected-output.json` | 4200 |
| Proposed contribution | `fixtures/service-scenario-expected-output.json` | 4680 |
| Scenario delta | `fixtures/service-scenario-expected-output.json` | 480 |
| Prime cost change | `fixtures/service-scenario-expected-output.json` | 0.018 |
| Labor percent change | `fixtures/service-scenario-expected-output.json` | 0.012 |
| Risk label | `fixtures/service-scenario-expected-output.json` | labor review |

## Dashboard Rule

Show scenario math, service-risk label, and assumptions first. Keep all proof claims tied to fixture references, with no POS, payroll, accounting, tax, live data, or operational advice claims.
