# Decision Labs

Four small JavaScript experiments, grouped because each isolates a narrow decision model rather than providing a full application. All inputs are synthetic. There are no external runtime APIs.

| Project | Implemented scope | Passing tests |
|---|---|---:|
| [ForecastLab](forecast-lab/) | Brier scores, calibration buckets and stale-evidence review cues. Fixed three-forecast UI; not an editable notebook. | 7 |
| [Life Capacity Optimizer](life-capacity-optimizer/) | Capacity, task load and switching-cost heuristics. No calendar or physiological validation. | 8 |
| [Personal Finance Decision Lab](personal-finance-decision-lab/) | Budget/runway, debt and rent-versus-buy formulas with fictional inputs. No account integration or personal recommendations. | 8 |
| [Restaurant Profit Simulator](restaurant-profit-simulator/) | Menu margin, labor/prime-cost and event contribution functions. The HTML is a static illustrative output, not an interactive calculator. | 7 |

## Run and inspect

Node.js 22+; no npm dependencies. From this repository root:

```sh
node --test forecast-lab/test/index.test.js life-capacity-optimizer/test/index.test.js personal-finance-decision-lab/test/index.test.js restaurant-profit-simulator/test/index.test.js
python -m http.server 8000 --bind 127.0.0.1
```

Open a project folder through `http://127.0.0.1:8000/`. Read each `src/index.js` beside its tests to examine units, assumptions and boundary handling. The first three pages render fixed examples; Restaurant Profit Simulator is a static example alongside tested calculation functions. None is a validated advice system.

## Contribution

Projects by Spencer Colety with AI assistance. The useful engineering work is the small pure-function boundaries, explicit assumptions and reproducible fixtures. No claim of independently hand-writing every line is made. [Source provenance](PROVENANCE.md).

Verified November 14, 2026: 30 tests passed across the four projects. Existing documentation-contract tests are included in that total.
