import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import {
  brierScore,
  calibrationBucket,
  normalizeProbability,
  stalenessScore,
  summarizeCalibration,
  updatePressure
} from "../src/index.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const fixture = JSON.parse(readFileSync(resolve(__dirname, "../fixtures/forecast-fixture.json"), "utf8"));
const scenarioExpected = JSON.parse(
  readFileSync(resolve(__dirname, "../fixtures/forecast-scenario-expected-output.json"), "utf8")
);

test("normalizes percent and decimal probabilities", () => {
  assert.equal(normalizeProbability(72), 0.72);
  assert.equal(normalizeProbability(0.72), 0.72);
});

test("scores forecast accuracy with Brier score", () => {
  assert.equal(brierScore(0.7, true), 0.09);
  assert.equal(brierScore(30, false), 0.09);
});

test("buckets forecasts for calibration views", () => {
  assert.deepEqual(calibrationBucket(0.87), { lower: 80, upper: 89, label: "80-89%" });
});

test("summarizes calibration fixtures by bucket", () => {
  const summary = summarizeCalibration(fixture.forecasts);

  assert.deepEqual(summary[0], fixture.expected);
});

test("turns stale forecasts into update pressure", () => {
  const staleness = stalenessScore({
    lastUpdatedAt: "2026-05-01",
    today: "2026-05-04",
    resolutionDate: "2026-05-10"
  });

  assert.equal(staleness, 0.2308);
  assert.equal(updatePressure({ staleness, evidenceDeltaCount: 2, nearResolution: true }), 0.781);
});

test("documents scenario analysis proof from fixed fixtures", () => {
  const proof = readFileSync(resolve(__dirname, "../docs/codex/ANALYSIS_PROOF.md"), "utf8");
  const deterministicOutputs = readFileSync(
    resolve(__dirname, "../docs/codex/DETERMINISTIC_OUTPUTS.md"),
    "utf8"
  );

  assert.equal(scenarioExpected.scenario, "probability-review");
  assert.equal(scenarioExpected.sourceFixture, "fixtures/forecast-expected-output.json");
  assert.deepEqual(scenarioExpected.outcomeAssumptions, [
    { outcome: true, currentBrier: 0.1444, proposedBrier: 0.09, delta: -0.0544 },
    { outcome: false, currentBrier: 0.3844, proposedBrier: 0.49, delta: 0.1056 }
  ]);
  assert.deepEqual(scenarioExpected.fixedOutputs, ["forecastId", "sourceFixture", "savedProbability"]);

  assert.match(proof, /fixtures\/forecast-scenario-expected-output\.json/);
  assert.match(proof, /fixtures\/forecast-expected-output\.json/);
  assert.match(proof, /No Live-Data Dependency/);
  assert.match(proof, /npm\.cmd run build/);
  assert.match(deterministicOutputs, /fixtures\/forecast-scenario-expected-output\.json/);
});

test("documents phase five launch smoke proof", () => {
  const launchCheck = readFileSync(resolve(__dirname, "../docs/codex/PHASE_FIVE_LAUNCH_CHECK.md"), "utf8");
  const requiredProofReferences = [
    "docs/codex/ANALYSIS_PROOF.md",
    "fixtures/forecast-scenario-expected-output.json",
    "npm.cmd run build"
  ];

  for (const reference of requiredProofReferences) {
    assert.match(launchCheck, new RegExp(reference.replaceAll(".", "\\.")));
  }

  assert.match(launchCheck, /Fixture-Backed Proof/);
  assert.match(launchCheck, /No Live-Data Dependency/);
  assert.doesNotMatch(launchCheck, /repair|quarantine/i);
});
