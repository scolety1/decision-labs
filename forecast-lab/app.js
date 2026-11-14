import {
  forecastBoardReviewCue,
  reviewCueScore,
  stalenessScore,
  summarizeCalibration
} from "./src/index.js";

const forecasts = [
  { id: "forecast-1", statement: "Team A wins", probability: 0.72, outcome: true },
  { id: "forecast-2", statement: "Launch ships Friday", probability: 0.78, outcome: false },
  { id: "forecast-3", statement: "Rain before dinner", probability: 0.41, outcome: false }
];

const calibration = summarizeCalibration(forecasts).find((entry) => entry.bucket === "70-79%");
const staleness = stalenessScore({
  lastUpdatedAt: "2026-04-29",
  resolutionDate: "2026-05-06",
  today: new Date("2026-05-03")
});
const pressure = reviewCueScore({ staleness, evidenceDeltaCount: 2, nearResolution: false });
const cue = forecastBoardReviewCue({ staleness, evidenceDeltaCount: 2, nearResolution: false });

document.querySelector("#bucket").textContent = calibration.bucket;
document.querySelector("#metrics").innerHTML = [
  ["Forecasts", forecasts.length],
  ["Avg confidence", `${Math.round(calibration.averageConfidence * 100)}%`],
  ["Hit rate", `${Math.round(calibration.hitRate * 100)}%`],
  ["Avg Brier", calibration.averageBrier]
]
  .map(([label, value]) => `<article class="metric"><span>${label}</span><strong>${value}</strong></article>`)
  .join("");

document.querySelector("#forecast-table").innerHTML = forecasts
  .map(
    (forecast) => `
      <div class="row">
        <strong>${forecast.statement}</strong>
        <span>${Math.round(forecast.probability * 100)}%</span>
        <span>${forecast.outcome ? "Hit" : "Miss"}</span>
      </div>
    `
  )
  .join("");

document.querySelector("#review-label").textContent = cue.label;
document.querySelector("#review-score").textContent = pressure;
document.querySelector("#review-copy").textContent =
  cue.label === "Review flag"
    ? `${cue.detail.cueCount} cue(s): stale enough or enough new evidence to inspect.`
    : "No review needed yet.";
