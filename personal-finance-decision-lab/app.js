import {
  emergencyRunwayMonths,
  monthlyDebtInterest,
  monthlySurplus,
  nextDebtBalance,
  rentVsBuyDelta
} from "./src/index.js";

const snapshot = {
  incomeAfterTax: 6200,
  fixedExpenses: 3100,
  variableExpenses: 1200,
  minimumDebtPayments: 450,
  liquidSavings: 9000,
  essentialMonthlyExpenses: 3000
};

const debt = { balance: 4200, annualRate: 0.2199, payment: 500 };
const housing = {
  rent: { rent: 2100, renterInsurance: 20, parking: 75 },
  buy: {
    principalInterest: 2450,
    propertyTax: 480,
    insurance: 140,
    hoa: 250,
    maintenanceReserve: 350,
    expectedTaxBenefit: 175
  }
};

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const preciseMoney = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

const surplus = monthlySurplus(snapshot);
const runway = emergencyRunwayMonths(snapshot);
const interest = monthlyDebtInterest(debt);
const nextBalance = nextDebtBalance(debt);
const housingDelta = rentVsBuyDelta(housing.rent, housing.buy);

document.querySelector("#primary-readout").textContent = money.format(surplus);
document.querySelector("#debt-interest").textContent = preciseMoney.format(interest);
document.querySelector("#debt-balance").textContent = preciseMoney.format(nextBalance);
document.querySelector("#housing-delta").textContent = money.format(housingDelta);

const metrics = [
  ["Emergency runway", `${runway} months`],
  ["Minimum debt payments", money.format(snapshot.minimumDebtPayments)],
  ["Liquid savings", money.format(snapshot.liquidSavings)],
  ["Buy pressure", `${money.format(housingDelta)} / mo`]
];

document.querySelector("#metrics").innerHTML = metrics
  .map(([label, value]) => `<article class="metric"><span>${label}</span><strong>${value}</strong></article>`)
  .join("");

const assumptions = [
  ["Income after tax", money.format(snapshot.incomeAfterTax)],
  ["Fixed expenses", money.format(snapshot.fixedExpenses)],
  ["Variable spend", money.format(snapshot.variableExpenses)],
  ["Essential expenses", money.format(snapshot.essentialMonthlyExpenses)]
];

document.querySelector("#assumptions").innerHTML = assumptions
  .map(([label, value]) => `<div><span>${label}</span><strong>${value}</strong></div>`)
  .join("");
