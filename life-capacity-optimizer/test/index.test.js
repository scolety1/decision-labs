import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import {
  availableCapacityMinutes,
  adjustmentComparison,
  contextSwitchCost,
  deadlinePressure,
  feasibilityScore,
  overloadRisk,
  planDay,
  taskLoadMinutes
} from "../src/index.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const fixture = JSON.parse(readFileSync(resolve(__dirname, "../fixtures/day-fixture.json"), "utf8"));
const scenarioExpected = JSON.parse(
  readFileSync(resolve(__dirname, "../fixtures/day-scenario-expected-output.json"), "utf8")
);

const tasks = [
  { title: "Deep work", minutes: 120, context: "focus" },
  { title: "Errands", minutes: 45, context: "outside" },
  { title: "Admin", minutes: 30, context: "desk" }
];

test("computes realistic available capacity", () => {
  assert.equal(availableCapacityMinutes({
    wakingMinutes: 960,
    fixedCommitmentsMinutes: 420,
    recoveryBufferMinutes: 120,
    energyMultiplier: 0.8
  }), 336);
});

test("sums task load and switching tax", () => {
  assert.equal(taskLoadMinutes(tasks), 195);
  assert.equal(contextSwitchCost(tasks), 24);
});

test("scores deadline pressure", () => {
  assert.equal(deadlinePressure({ daysUntilDue: 1, priority: 5 }), 2.5);
});

test("maps feasibility into overload language", () => {
  assert.equal(feasibilityScore({ availableMinutes: 240, loadMinutes: 195, switchCostMinutes: 24 }), 1);
  assert.equal(overloadRisk(0.62), "high");
});

test("builds a compact daily plan", () => {
  assert.deepEqual(planDay({ ...fixture.day, tasks: fixture.tasks }), fixture.expected);
});

test("compares adjustment options without changing source tasks", () => {
  const rows = adjustmentComparison({
    day: fixture.day,
    tasks: fixture.tasks,
    options: [
      { option: "shrink", optionLabel: "Shrink one task", minutesRecovered: 30 },
      { option: "defer", optionLabel: "Defer one task", minutesRecovered: 60 },
      { option: "drop", optionLabel: "Drop one task", minutesRecovered: 90 }
    ]
  });

  assert.deepEqual(rows.map(({ option, minutesRecovered, riskLabel }) => ({
    option,
    minutesRecovered,
    riskLabel
  })), [
    { option: "shrink", minutesRecovered: 30, riskLabel: "less tight" },
    { option: "defer", minutesRecovered: 60, riskLabel: "clearer" },
    { option: "drop", minutesRecovered: 90, riskLabel: "more open" }
  ]);
  assert.equal(fixture.tasks[0].minutes, 120);
  assert.match(rows[0].supportiveCaveat, /Preview only/i);
});

test("documents deterministic scenario proof without live calendar dependency", () => {
  const rows = adjustmentComparison({
    day: fixture.day,
    tasks: fixture.tasks,
    options: scenarioExpected.options
  });
  const proof = readFileSync(resolve(__dirname, "../docs/codex/ANALYSIS_PROOF.md"), "utf8");

  assert.deepEqual(rows.map(({ option, minutesRecovered, riskLabel, sourceFixtureLabel }) => ({
    option,
    minutesRecovered,
    riskLabel,
    sourceFixtureLabel
  })), scenarioExpected.options.map(({ option, minutesRecovered, riskLabel }) => ({
    option,
    minutesRecovered,
    riskLabel,
    sourceFixtureLabel: "fixtures/day-scenario-expected-output.json"
  })));
  assert.deepEqual(scenarioExpected.fixedOutputs, ["taskIds", "busyWindows", "fixtureDate"]);
  assert.equal(rows[0].supportiveCaveat, scenarioExpected.caveat);
  assert.match(proof, /fixtures\/day-scenario-expected-output\.json/);
  assert.match(proof, /no live calendar dependency/i);
  assert.match(proof, /npm\.cmd run build/);
});

test("documents phase five launch smoke proof", () => {
  const launchCheck = readFileSync(resolve(__dirname, "../docs/codex/PHASE_FIVE_LAUNCH_CHECK.md"), "utf8");

  assert.match(launchCheck, /Launch-Smoke Report/);
  assert.match(launchCheck, /docs\/codex\/ANALYSIS_PROOF\.md/);
  assert.match(launchCheck, /fixtures\/day-scenario-expected-output\.json/);
  assert.match(launchCheck, /npm\.cmd run build/);
  assert.match(launchCheck, /no live calendar dependency/i);
  assert.doesNotMatch(launchCheck, /repair|quarantine/i);
});
