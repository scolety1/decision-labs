const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function round(value, digits = 4) {
  const factor = 10 ** digits;
  return Math.round((Number(value) + Number.EPSILON) * factor) / factor;
}

export function clamp(value, min = 0, max = 1) {
  if (!Number.isFinite(value)) {
    throw new TypeError("Expected a finite number.");
  }
  return Math.min(max, Math.max(min, value));
}

export function normalizeProbability(value) {
  if (!Number.isFinite(value)) {
    throw new TypeError("Expected a finite probability.");
  }
  return value > 1 ? clamp(value / 100) : clamp(value);
}

export function brierScore(probability, outcome) {
  const p = normalizeProbability(probability);
  const actual = outcome ? 1 : 0;
  return round((p - actual) ** 2);
}

export function calibrationBucket(probability) {
  const p = normalizeProbability(probability);
  const lower = Math.min(90, Math.floor(p * 10) * 10);
  const upper = lower + 9;
  return { lower, upper, label: `${lower}-${upper}%` };
}

export function summarizeCalibration(forecasts) {
  const buckets = new Map();

  for (const forecast of forecasts) {
    const probability = normalizeProbability(forecast.probability);
    const bucket = calibrationBucket(probability);
    const existing = buckets.get(bucket.label) ?? {
      bucket,
      count: 0,
      confidenceTotal: 0,
      outcomeTotal: 0,
      brierTotal: 0
    };

    existing.count += 1;
    existing.confidenceTotal += probability;
    existing.outcomeTotal += forecast.outcome ? 1 : 0;
    existing.brierTotal += brierScore(probability, forecast.outcome);
    buckets.set(bucket.label, existing);
  }

  return Array.from(buckets.values()).map((entry) => ({
    bucket: entry.bucket.label,
    count: entry.count,
    averageConfidence: round(entry.confidenceTotal / entry.count),
    hitRate: round(entry.outcomeTotal / entry.count),
    averageBrier: round(entry.brierTotal / entry.count)
  }));
}

export function daysBetween(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (Number.isNaN(start.valueOf()) || Number.isNaN(end.valueOf())) {
    throw new TypeError("Expected valid date inputs.");
  }
  return Math.ceil((end.valueOf() - start.valueOf()) / MS_PER_DAY);
}

export function stalenessScore({ lastUpdatedAt, resolutionDate, today = new Date() }) {
  const daysSinceUpdate = Math.max(0, daysBetween(lastUpdatedAt, today));
  const daysUntilResolution = Math.max(0, daysBetween(today, resolutionDate));
  return round(daysSinceUpdate / Math.max(1, daysUntilResolution + 7));
}

export function reviewCueScore({ staleness, evidenceDeltaCount = 0, nearResolution = false }) {
  const raw = staleness + evidenceDeltaCount * 0.15 + (nearResolution ? 0.25 : 0);
  return round(clamp(raw, 0, 2), 3);
}

export function updatePressure(inputs) {
  return reviewCueScore(inputs);
}

export function forecastBoardReviewCue(inputs) {
  const score = reviewCueScore(inputs);
  const cueCount = Math.ceil(score);
  const hasReviewFlag = cueCount > 0;

  return {
    label: hasReviewFlag ? "Review flag" : "Current",
    ...(hasReviewFlag
      ? {
          detailAction: "Inspect",
          detail: {
            cueCount
          }
        }
      : {})
  };
}
