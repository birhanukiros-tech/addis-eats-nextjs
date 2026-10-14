# Addis Eats — Performance Report

## Overview

This report records performance measurements from Day 45 and the optimizations made to the deployed Addis Eats menu page.

The results below are historical measurements from Microsoft Edge Lighthouse in mobile mode. They should not be treated as a fresh Lighthouse audit of the current deployment.

## Lighthouse Results — Day 45

| Metric | Before | After |
|---|---:|---:|
| Performance score | 91 | 98 |
| First Contentful Paint (FCP) | 1.3 s | 1.2 s |
| Largest Contentful Paint (LCP) | 2.8 s | 2.4 s |
| Total Blocking Time (TBT) | 260 ms | 70 ms |
| Cumulative Layout Shift (CLS) | 0 | 0 |
| Speed Index | 1.7 s | 1.5 s |

The recorded performance score increased by 7 points. LCP improved by 0.4 seconds, and Total Blocking Time decreased by 190 milliseconds.

## Optimizations Made

The recorded changes included:

- Updating responsive image sizing in `components/DishList.jsx`.
- Adding a size hint for the logo in `app/menu/page.js`.

These changes were associated with the recorded improvement. The measurements alone do not establish how much each individual change contributed.

## Additional Measurements

- Largest listed image: `hero-dish.jpg`, 99.6 KiB.
- Bundle analyzer estimate for the `/menu` client bundle: 120.78 KB compressed and 291.22 KB uncompressed, with 102 modules.
- First Load JavaScript: Not directly measured by the recorded build output.
- Largest image file size for the current deployment: Requires re-verification if assets have changed.
- Current deployment Lighthouse score: Not yet re-measured in this report.

The bundle analyzer estimate is not equivalent to Next.js First Load JavaScript. Therefore, compliance with the under-120-kB First Load JavaScript target remains unverified.

## Evidence

The recorded after-optimization Lighthouse screenshot is expected at:

`./evidence/day45-lighthouse-after.png`

Keep the before-and-after Lighthouse screenshots with the project if they are available. The screenshots should match the reported metrics.

## Next Steps

1. Run Lighthouse again against the current deployed `/menu` page in mobile mode.
2. Save the current report and compare its metrics with the historical Day 45 results.
3. Measure First Load JavaScript using an appropriate Next.js build report.
4. Recheck the largest image asset if the deployed assets have changed.

Report new measurements only after running the corresponding checks.
