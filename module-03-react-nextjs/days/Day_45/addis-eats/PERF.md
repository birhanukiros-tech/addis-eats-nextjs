
# Addis Eats — Day 45 Performance Report

## Lighthouse Results

Tested the deployed menu page using Microsoft Edge, Mobile mode.

| Metric | Before | After |
|---|---:|---:|
| Performance score | 91 | 98 |
| First Contentful Paint | 1.3 s | 1.2 s |
| Largest Contentful Paint | 2.8 s | 2.4 s |
| Total Blocking Time | 260 ms | 70 ms |
| Cumulative Layout Shift | 0 | 0 |
| Speed Index | 1.7 s | 1.5 s |

## Optimization made

Updated responsive image sizing in `components/DishList.jsx` and added a size hint for the logo in `app/menu/page.js`.

The deployed Lighthouse score increased from 91 to 98 in the recorded tests. LCP decreased from 2.8 seconds to 2.4 seconds.

## Remaining measurements

- First Load JavaScript for `/menu`: Not measured yet.
- Largest image file size: Not measured yet.

## Evidence

Keep screenshots of the before-and-after Lighthouse reports as evidence.


## Lighthouse Evidence

### After optimization — Deployed website

Performance score: 98

![Lighthouse after optimization](./evidence/day45-lighthouse-after.png)


## Additional Measurements

- Largest listed image: 99.6 KiB (`hero-dish.jpg`), below the 150 KiB target.
- Next.js 16.3.5 bundle analyzer, `/menu` client bundle: 120.78 KB compressed (estimated), 291.22 KB uncompressed, 102 modules.

Note: The bundle analyzer's compressed client-bundle estimate is not the same as the traditional First Load JS metric. The under-120-kB First Load JS target has not been directly verified using this measurement.
