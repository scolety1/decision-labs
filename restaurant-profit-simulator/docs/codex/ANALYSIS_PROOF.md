# Analysis Proof

## Scenario Fixture Provenance

| Proof item | Fixture reference |
| --- | --- |
| Scenario expected output | `fixtures/service-scenario-expected-output.json` |
| Dashboard expected output | `fixtures/service-expected-output.json` |
| Input fixture | `fixtures/service-fixture.json` |

The scenario proof is fixture-backed: `fixtures/service-scenario-expected-output.json` names the `service-comparison` scenario and points to `fixtures/service-expected-output.json` as its source fixture.

## Expected Outputs

| Output | Expected value | Fixture reference |
| --- | ---: | --- |
| Baseline contribution | 4200 | `fixtures/service-scenario-expected-output.json` |
| Proposed contribution | 4680 | `fixtures/service-scenario-expected-output.json` |
| Scenario delta | 480 | `fixtures/service-scenario-expected-output.json` |
| Prime cost change | 0.018 | `fixtures/service-scenario-expected-output.json` |
| Labor percent change | 0.012 | `fixtures/service-scenario-expected-output.json` |
| Risk label | labor review | `fixtures/service-scenario-expected-output.json` |

## Fixed Outputs

The fixed outputs are `menuItemIds`, `baselineServiceFacts`, and `sourceFixture`. These are stored in `fixtures/service-scenario-expected-output.json` so the proof can identify which scenario facts are held constant.

## No Live Data Evidence

This proof confirms no POS/payroll/accounting dependency. Scenario checks read local JSON fixtures and deterministic functions only. They do not use POS imports, payroll systems, accounting ledgers, tax logic, network APIs, secrets, or live data.

## Acceptance Command

Run `npm.cmd run build` for the selected fleet task acceptance command.
