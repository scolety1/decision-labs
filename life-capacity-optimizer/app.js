import { adjustmentComparison, planDay } from "./src/index.js";

const day = {
  wakingMinutes: 960,
  fixedCommitmentsMinutes: 540,
  recoveryBufferMinutes: 90,
  energyMultiplier: 0.75
};

const tasks = [
  { title: "Deep work", minutes: 120, context: "focus" },
  { title: "Errands", minutes: 45, context: "outside" },
  { title: "Admin", minutes: 30, context: "desk" }
];

const options = [
  { option: "shrink", optionLabel: "Shrink admin to a 15 minute pass", minutesRecovered: 15 },
  { option: "defer", optionLabel: "Move errands to tomorrow", minutesRecovered: 45 },
  { option: "drop", optionLabel: "Drop nonessential admin", minutesRecovered: 30 }
];

const plan = planDay({ ...day, tasks });
const adjustments = adjustmentComparison({ day, tasks, options });

document.querySelector("#score").textContent = `${Math.round(plan.score * 100)}%`;
document.querySelector("#risk").textContent =
  plan.risk === "low"
    ? "Low overload risk. There is room for the plan plus context switches."
    : `${plan.risk} risk. Recover minutes before adding anything else.`;

document.querySelector("#metrics").innerHTML = [
  ["Available", `${plan.availableMinutes} min`],
  ["Task load", `${plan.loadMinutes} min`],
  ["Switching cost", `${plan.switchCostMinutes} min`],
  ["Over by", `${plan.overByMinutes} min`]
]
  .map(([label, value]) => `<article class="metric"><span>${label}</span><strong>${value}</strong></article>`)
  .join("");

document.querySelector("#tasks").innerHTML = tasks
  .map(
    (task) => `
      <div class="task">
        <strong>${task.title}</strong>
        <b>${task.minutes} min</b>
        <span>${task.context}</span>
      </div>
    `
  )
  .join("");

document.querySelector("#adjustments").innerHTML = adjustments
  .map(
    (option) => `
      <div class="adjustment">
        <span>${option.riskLabel}</span>
        <strong>${option.optionLabel}</strong>
        <p>${option.minutesRecovered} minutes recovered; feasibility becomes ${Math.round(option.feasibility * 100)}%.</p>
      </div>
    `
  )
  .join("");
