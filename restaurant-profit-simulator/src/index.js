export function round(value, digits = 4) {
  const factor = 10 ** digits;
  return Math.round((Number(value) + Number.EPSILON) * factor) / factor;
}

export function itemMargin({ price, ingredientCost, packagingCost = 0 }) {
  requirePositiveDenominator(price, "price");
  const grossProfit = price - ingredientCost - packagingCost;
  return {
    grossProfit: round(grossProfit, 2),
    marginPercent: round(grossProfit / price)
  };
}

export function weightedMenuContribution(items) {
  const unitTotal = items.reduce((total, item) => total + item.unitsSold, 0);
  const weightedProfit = items.reduce((total, item) => {
    // Contribution remains defined for complimentary items; no price ratio is needed.
    const margin = round(item.price - item.ingredientCost - (item.packagingCost ?? 0), 2);
    return total + margin * item.unitsSold;
  }, 0);

  return {
    unitsSold: unitTotal,
    averageContribution: round(weightedProfit / Math.max(1, unitTotal), 2)
  };
}

export function primeCostPercent({ foodCost, beverageCost = 0, laborCost, sales }) {
  requirePositiveDenominator(sales, "sales");
  return round((foodCost + beverageCost + laborCost) / sales);
}

export function laborPercent({ laborCost, sales }) {
  requirePositiveDenominator(sales, "sales");
  return round(laborCost / sales);
}

function requirePositiveDenominator(value, label) {
  if (!Number.isFinite(value) || value <= 0) {
    throw new RangeError(`${label} must be a positive finite number for a ratio.`);
  }
}

export function wasteCost({ prepCost, wasteRate }) {
  return round(prepCost * wasteRate, 2);
}

export function eventContribution({ revenue, foodCost, beverageCost = 0, laborCost, rentalCost = 0 }) {
  return round(revenue - foodCost - beverageCost - laborCost - rentalCost, 2);
}

export function scenarioDelta(baseScenario, proposedScenario) {
  return {
    salesDelta: round(proposedScenario.sales - baseScenario.sales, 2),
    primeCostDelta: round(
      primeCostPercent(proposedScenario) - primeCostPercent(baseScenario),
      4
    ),
    contributionDelta: round(
      eventContribution(proposedScenario) - eventContribution(baseScenario),
      2
    )
  };
}
