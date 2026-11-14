export function round(value, digits = 4) {
  const factor = 10 ** digits;
  return Math.round((Number(value) + Number.EPSILON) * factor) / factor;
}

export function monthlySurplus({ incomeAfterTax, fixedExpenses, variableExpenses = 0, minimumDebtPayments = 0 }) {
  return round(incomeAfterTax - fixedExpenses - variableExpenses - minimumDebtPayments, 2);
}

export function emergencyRunwayMonths({ liquidSavings, essentialMonthlyExpenses }) {
  return round(liquidSavings / Math.max(1, essentialMonthlyExpenses), 2);
}

export function monthlyDebtInterest({ balance, annualRate }) {
  return round(balance * (annualRate / 12), 2);
}

export function nextDebtBalance({ balance, annualRate, payment }) {
  const interest = monthlyDebtInterest({ balance, annualRate });
  return round(Math.max(0, balance + interest - payment), 2);
}

export function avalanchePriority(debt) {
  return round(debt.annualRate * 1000000 + debt.balance);
}

export function snowballPriority(debt) {
  return round(debt.balance);
}

export function buyMonthlyCost({
  principalInterest,
  propertyTax,
  insurance,
  hoa = 0,
  maintenanceReserve = 0,
  expectedTaxBenefit = 0
}) {
  return round(principalInterest + propertyTax + insurance + hoa + maintenanceReserve - expectedTaxBenefit, 2);
}

export function rentMonthlyCost({ rent, renterInsurance = 0, parking = 0 }) {
  return round(rent + renterInsurance + parking, 2);
}

export function rentVsBuyDelta(rentScenario, buyScenario) {
  return round(buyMonthlyCost(buyScenario) - rentMonthlyCost(rentScenario), 2);
}

export function scenarioNetImpact(base, proposed) {
  return {
    surplusDelta: round(monthlySurplus(proposed) - monthlySurplus(base), 2),
    runwayDelta: round(
      emergencyRunwayMonths(proposed) - emergencyRunwayMonths(base),
      2
    )
  };
}

export function financialSnapshotScreen(snapshot, proposedSnapshot) {
  const scenarioDelta = proposedSnapshot ? scenarioNetImpact(snapshot, proposedSnapshot) : null;

  return {
    title: "Financial Snapshot",
    primaryRows: [
      {
        label: "Monthly surplus",
        value: monthlySurplus(snapshot),
        formula: "incomeAfterTax - fixedExpenses - variableExpenses - minimumDebtPayments"
      },
      {
        label: "Emergency runway",
        value: emergencyRunwayMonths(snapshot),
        formula: "liquidSavings / essentialMonthlyExpenses"
      },
      {
        label: "Minimum debt payments",
        value: snapshot.minimumDebtPayments,
        formula: "minimumDebtPayments"
      },
      {
        label: "Scenario change",
        value: scenarioDelta ? scenarioDelta.surplusDelta : 0,
        formula: "proposed monthly surplus - baseline monthly surplus"
      }
    ],
    detailAction: "View assumptions used",
    detailHelper: "Source: sample household fixture. Calculated for comparison only; it does not recommend a financial decision.",
    detailRows: [
      { label: "Monthly income after tax", value: snapshot.incomeAfterTax },
      { label: "Fixed monthly expenses", value: snapshot.fixedExpenses },
      { label: "Variable monthly expenses", value: snapshot.variableExpenses },
      { label: "Minimum debt payments", value: snapshot.minimumDebtPayments },
      { label: "Essential monthly expenses", value: snapshot.essentialMonthlyExpenses },
      { label: "Liquid savings", value: snapshot.liquidSavings }
    ]
  };
}
