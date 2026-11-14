export function round(value, digits = 4) {
  const factor = 10 ** digits;
  return Math.round((Number(value) + Number.EPSILON) * factor) / factor;
}

export function availableCapacityMinutes({
  wakingMinutes,
  fixedCommitmentsMinutes = 0,
  recoveryBufferMinutes = 90,
  energyMultiplier = 1
}) {
  const openMinutes = Math.max(0, wakingMinutes - fixedCommitmentsMinutes - recoveryBufferMinutes);
  return Math.round(openMinutes * Math.max(0, energyMultiplier));
}

export function taskLoadMinutes(tasks) {
  return tasks.reduce((total, task) => total + Math.max(0, task.minutes ?? 0), 0);
}

export function contextSwitchCost(tasks, switchPenaltyMinutes = 12) {
  let switches = 0;
  for (let index = 1; index < tasks.length; index += 1) {
    if ((tasks[index - 1].context ?? "general") !== (tasks[index].context ?? "general")) {
      switches += 1;
    }
  }
  return switches * switchPenaltyMinutes;
}

export function deadlinePressure({ daysUntilDue, priority = 3 }) {
  const urgency = 1 / Math.max(1, daysUntilDue + 1);
  return round(urgency * Math.max(1, priority));
}

export function feasibilityScore({ availableMinutes, loadMinutes, switchCostMinutes = 0 }) {
  if (availableMinutes <= 0) {
    return 0;
  }
  return round(Math.max(0, Math.min(1, availableMinutes / Math.max(1, loadMinutes + switchCostMinutes))));
}

export function overloadRisk(score) {
  if (score >= 0.9) return "low";
  if (score >= 0.7) return "watch";
  if (score >= 0.5) return "high";
  return "over capacity";
}

export function planDay({ wakingMinutes, fixedCommitmentsMinutes, recoveryBufferMinutes, energyMultiplier, tasks }) {
  const availableMinutes = availableCapacityMinutes({
    wakingMinutes,
    fixedCommitmentsMinutes,
    recoveryBufferMinutes,
    energyMultiplier
  });
  const loadMinutes = taskLoadMinutes(tasks);
  const switchCostMinutes = contextSwitchCost(tasks);
  const score = feasibilityScore({ availableMinutes, loadMinutes, switchCostMinutes });

  return {
    availableMinutes,
    loadMinutes,
    switchCostMinutes,
    score,
    risk: overloadRisk(score),
    overByMinutes: Math.max(0, loadMinutes + switchCostMinutes - availableMinutes)
  };
}

function scenarioRiskLabel(option, score) {
  if (option === "drop") return "more open";
  if (option === "defer") return "clearer";
  if (option === "shrink") return score >= 0.9 ? "less tight" : "still tight";
  return overloadRisk(score);
}

export function adjustmentComparison({ day, tasks, options }) {
  const basePlan = planDay({ ...day, tasks });

  return options.map((option) => {
    const minutesRecovered = Math.max(0, option.minutesRecovered ?? 0);
    const resultingLoad = Math.max(0, basePlan.loadMinutes - minutesRecovered);
    const feasibility = feasibilityScore({
      availableMinutes: basePlan.availableMinutes,
      loadMinutes: resultingLoad,
      switchCostMinutes: basePlan.switchCostMinutes
    });

    return {
      option: option.option,
      optionLabel: option.optionLabel,
      minutesRecovered,
      resultingLoad,
      feasibility,
      riskLabel: scenarioRiskLabel(option.option, feasibility),
      sourceFixtureLabel: option.sourceFixtureLabel ?? "fixtures/day-scenario-expected-output.json",
      supportiveCaveat: option.supportiveCaveat ?? "Preview only; choose before anything changes."
    };
  });
}
