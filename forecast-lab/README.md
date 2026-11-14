# ForecastLab

Brier scores, calibration buckets and stale-evidence review cues. Fixed three-forecast UI; not an editable notebook.

Start with [the functions](src/index.js), [tests](test/index.test.js), and [fixtures](fixtures/).

From this folder, with Node.js 22+:

```sh
npm test
npm run build
```

No dependencies need installation. The build command checks JavaScript and runs tests; it does not bundle the site. To view the demo, run `python -m http.server 8000 --bind 127.0.0.1` and open `http://127.0.0.1:8000/`.

Verified November 14, 2026: 7 tests passed. Some tests check documentation/fixture contracts; the total is not a count of independent numerical properties. This is an AI-assisted Spencer Colety project. See [collection provenance](../PROVENANCE.md).
