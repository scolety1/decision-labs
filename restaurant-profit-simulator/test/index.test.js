import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import {
  eventContribution,
  itemMargin,
  laborPercent,
  primeCostPercent,
  scenarioDelta,
  wasteCost,
  weightedMenuContribution
} from "../src/index.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const fixture = JSON.parse(readFileSync(resolve(__dirname, "../fixtures/service-fixture.json"), "utf8"));
const scenarioExpectedOutput = JSON.parse(
  readFileSync(resolve(__dirname, "../fixtures/service-scenario-expected-output.json"), "utf8")
);
const analysisProof = readFileSync(resolve(__dirname, "../docs/codex/ANALYSIS_PROOF.md"), "utf8");

test("uses actual positive sub-dollar denominators for margin and cost ratios", () => {
  assert.deepEqual(itemMargin({ price: 0.5, ingredientCost: 0.25 }), { grossProfit: 0.25, marginPercent: 0.5 });
  assert.equal(laborPercent({ laborCost: 0.1, sales: 0.5 }), 0.2);
  assert.equal(primeCostPercent({ foodCost: 0.1, laborCost: 0.1, sales: 0.5 }), 0.4);
});

test("rejects nonpositive or nonfinite monetary denominators instead of inventing a ratio", () => {
  for (const value of [0, -1, NaN, Infinity, -Infinity]) {
    assert.throws(() => itemMargin({ price: value, ingredientCost: 0.25 }), /positive finite/);
    assert.throws(() => laborPercent({ laborCost: 0.1, sales: value }), /positive finite/);
    assert.throws(() => primeCostPercent({ foodCost: 0.1, laborCost: 0.1, sales: value }), /positive finite/);
  }
});

test("computes item margin", () => {
  assert.deepEqual(itemMargin({ price: 18, ingredientCost: 5.4, packagingCost: 0.6 }), {
    grossProfit: 12,
    marginPercent: 0.6667
  });
});

test("computes weighted menu contribution", () => {
  assert.deepEqual(weightedMenuContribution(fixture.menu), {
    unitsSold: 60,
    averageContribution: fixture.expected.weightedAverageContribution
  });
});

test("preserves gross contribution for complimentary menu items", () => {
  assert.deepEqual(weightedMenuContribution([{ price: 0, ingredientCost: 1, unitsSold: 2 }]), {
    unitsSold: 2, averageContribution: -1
  });
});

test("computes prime and labor cost ratios", () => {
  assert.equal(primeCostPercent(fixture.dailyCosts), fixture.expected.primeCostPercent);
  assert.equal(laborPercent(fixture.dailyCosts), fixture.expected.laborPercent);
});

test("computes waste and event contribution", () => {
  assert.equal(wasteCost({ prepCost: 900, wasteRate: 0.08 }), 72);
  assert.equal(eventContribution(fixture.event), fixture.expected.eventContribution);
});

test("compares scenarios", () => {
  assert.deepEqual(scenarioDelta(
    { sales: 6800, foodCost: 1200, beverageCost: 500, laborCost: 2100, revenue: 6800 },
    { sales: 7600, foodCost: 1350, beverageCost: 560, laborCost: 2200, revenue: 7600 }
  ), {
    salesDelta: 800,
    primeCostDelta: -0.018,
    contributionDelta: 490
  });
});

test("documents deterministic analysis proof", () => {
  assert.equal(scenarioExpectedOutput.scenario, "service-comparison");
  assert.equal(scenarioExpectedOutput.sourceFixture, "fixtures/service-expected-output.json");
  assert.equal(scenarioExpectedOutput.delta, 480);
  assert.deepEqual(scenarioExpectedOutput.fixedOutputs, [
    "menuItemIds",
    "baselineServiceFacts",
    "sourceFixture"
  ]);

  assert.match(analysisProof, /fixtures\/service-scenario-expected-output\.json/);
  assert.match(analysisProof, /fixtures\/service-expected-output\.json/);
  assert.match(analysisProof, /no POS\/payroll\/accounting dependency/i);
  assert.match(analysisProof, /npm\.cmd run build/);
});

test("documents phase five launch smoke proof", () => {
  const launchCheck = readFileSync(resolve(__dirname, "../docs/codex/PHASE_FIVE_LAUNCH_CHECK.md"), "utf8");
  const deterministicProofLine =
    "Launch proof references `docs/codex/ANALYSIS_PROOF.md`, `fixtures/service-scenario-expected-output.json`, and acceptance command `npm.cmd run build`.";

  assert.match(launchCheck, new RegExp(deterministicProofLine.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(launchCheck, /docs\/codex\/ANALYSIS_PROOF\.md/);
  assert.match(launchCheck, /fixtures\/service-scenario-expected-output\.json/);
  assert.match(launchCheck, /npm\.cmd run build/);
  assert.match(launchCheck, /no POS\/payroll\/accounting dependency/i);
});
