# Analysis Proof

## Scenario Fixture Provenance

- Proof fixture: `fixtures/finance-scenario-expected-output.json`
- Source fixture named by proof fixture: `fixtures/finance-expected-output.json`
- Scenario id: `financial-comparison`
- The proof uses committed fixture JSON only. It does not read bank, brokerage, lending, tax, live market, API, or account data.

## Expected Outputs

| Output | Expected value | Fixture reference |
| --- | ---: | --- |
| baselineSurplus | 850 | `fixtures/finance-scenario-expected-output.json` |
| proposedSurplus | 1025 | `fixtures/finance-scenario-expected-output.json` |
| monthlyDelta | 175 | `fixtures/finance-scenario-expected-output.json` |
| runwayChangeMonths | 0.4 | `fixtures/finance-scenario-expected-output.json` |
| debtInterestChange | -12 | `fixtures/finance-scenario-expected-output.json` |

## Fixed Outputs

| Fixed output | Reason |
| --- | --- |
| sourceSnapshotId | Keeps row identity tied to a fixture snapshot rather than live data. |
| baselineSnapshotValues | Keeps baseline rows reproducible from fixture values. |
| sourceFixture | Keeps provenance visible in the proof and UI-facing audit copy. |

## No-Live-Data Evidence

- The scenario proof references `fixtures/finance-scenario-expected-output.json` and the source fixture named inside it.
- There is no account-data dependency: the fixture contains scenario labels, expected arithmetic outputs, fixed output names, and a non-advice caveat only.
- The proof does not require banking, brokerage, lending, tax filing, network APIs, credentials, secrets, or external account access.
- Results are assumption-labeled fixture checks, not financial, tax, investment, legal, lending, or brokerage advice.

## Acceptance Command

- Harness acceptance command: `npm.cmd run build`
- Focused proof check: `npm.cmd run test`
