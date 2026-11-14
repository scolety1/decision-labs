import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import {
  avalanchePriority,
  buyMonthlyCost,
  emergencyRunwayMonths,
  monthlyDebtInterest,
  monthlySurplus,
  nextDebtBalance,
  rentMonthlyCost,
  rentVsBuyDelta,
  scenarioNetImpact,
  financialSnapshotScreen,
  snowballPriority
} from "../src/index.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const fixture = JSON.parse(readFileSync(resolve(__dirname, "../fixtures/finance-fixture.json"), "utf8"));
const scenarioExpected = JSON.parse(readFileSync(resolve(__dirname, "../fixtures/finance-scenario-expected-output.json"), "utf8"));

test("computes monthly surplus and emergency runway", () => {
  assert.equal(monthlySurplus(fixture.snapshot), fixture.expected.monthlySurplus);
  assert.equal(emergencyRunwayMonths(fixture.snapshot), fixture.expected.emergencyRunwayMonths);
});

test("computes debt interest and next balance", () => {
  assert.equal(monthlyDebtInterest(fixture.debt), fixture.expected.monthlyDebtInterest);
  assert.equal(nextDebtBalance(fixture.debt), fixture.expected.nextDebtBalance);
});

test("ranks payoff methods", () => {
  const creditCard = { balance: 4200, annualRate: 0.2199 };
  const medical = { balance: 900, annualRate: 0 };

  assert.ok(avalanchePriority(creditCard) > avalanchePriority(medical));
  assert.ok(snowballPriority(medical) < snowballPriority(creditCard));
});

test("compares rent and buy monthly costs", () => {
  assert.equal(rentMonthlyCost(fixture.housing.rent), 2195);
  assert.equal(buyMonthlyCost(fixture.housing.buy), 3495);
  assert.equal(rentVsBuyDelta(fixture.housing.rent, fixture.housing.buy), fixture.expected.rentVsBuyDelta);
});

test("compares full monthly scenarios", () => {
  assert.deepEqual(scenarioNetImpact(
    {
      incomeAfterTax: 6200,
      fixedExpenses: 3100,
      variableExpenses: 1200,
      minimumDebtPayments: 450,
      liquidSavings: 9000,
      essentialMonthlyExpenses: 3000
    },
    {
      incomeAfterTax: 6600,
      fixedExpenses: 3200,
      variableExpenses: 1100,
      minimumDebtPayments: 450,
      liquidSavings: 9800,
      essentialMonthlyExpenses: 3050
    }
  ), {
    surplusDelta: 400,
    runwayDelta: 0.21
  });
});

test("builds a non-advice financial snapshot screen", () => {
  const screen = financialSnapshotScreen(fixture.snapshot, {
    incomeAfterTax: 6600,
    fixedExpenses: 3200,
    variableExpenses: 1100,
    minimumDebtPayments: 450,
    liquidSavings: 9800,
    essentialMonthlyExpenses: 3050
  });

  assert.equal(screen.title, "Financial Snapshot");
  assert.equal("helper" in screen, false);
  assert.match(screen.detailHelper, /does not recommend/i);
  assert.equal(screen.detailAction, "View assumptions used");
  assert.equal(screen.primaryRows[0].value, fixture.expected.monthlySurplus);
  assert.equal(screen.primaryRows[1].value, fixture.expected.emergencyRunwayMonths);
  assert.equal(screen.primaryRows[3].value, 400);
});

test("documents deterministic scenario proof from fixtures only", () => {
  const proof = readFileSync(resolve(__dirname, "../docs/codex/ANALYSIS_PROOF.md"), "utf8");

  assert.match(proof, /fixtures\/finance-scenario-expected-output\.json/);
  assert.match(proof, /no account-data dependency/i);
  assert.match(proof, /No-live-data evidence/i);
  assert.match(proof, /npm\.cmd run build/);
  assert.match(proof, /npm\.cmd run test/);

  assert.match(proof, new RegExp(`Scenario Fixture Provenance[\\s\\S]*${scenarioExpected.sourceFixture.replaceAll("/", "\\/")}`));
  assert.match(proof, new RegExp(`Expected Outputs[\\s\\S]*baselineSurplus[\\s\\S]*${scenarioExpected.baselineSurplus}`));
  assert.match(proof, new RegExp(`Expected Outputs[\\s\\S]*proposedSurplus[\\s\\S]*${scenarioExpected.proposedSurplus}`));
  assert.match(proof, new RegExp(`Expected Outputs[\\s\\S]*monthlyDelta[\\s\\S]*${scenarioExpected.monthlyDelta}`));
  assert.match(proof, new RegExp(`Expected Outputs[\\s\\S]*runwayChangeMonths[\\s\\S]*${scenarioExpected.runwayChangeMonths}`));
  assert.match(proof, new RegExp(`Expected Outputs[\\s\\S]*debtInterestChange[\\s\\S]*${scenarioExpected.debtInterestChange}`));

  for (const fixedOutput of scenarioExpected.fixedOutputs) {
    assert.match(proof, new RegExp(`Fixed Outputs[\\s\\S]*${fixedOutput}`));
  }
});

test("documents phase five launch smoke proof", () => {
  const launchCheck = readFileSync(resolve(__dirname, "../docs/codex/PHASE_FIVE_LAUNCH_CHECK.md"), "utf8");

  assert.match(launchCheck, /docs\/codex\/ANALYSIS_PROOF\.md/);
  assert.match(launchCheck, /fixtures\/finance-scenario-expected-output\.json/);
  assert.match(launchCheck, /npm\.cmd run build/);
  assert.match(launchCheck, /no account-data dependency/i);
});
