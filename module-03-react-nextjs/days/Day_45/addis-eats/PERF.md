# Addis Eats — Performance Verification

## Lighthouse Results

**Environment:** Local development (`http://localhost:3000/`)  
**Device profile:** Mobile  
**Tool:** Chrome Lighthouse

| Metric | Measured result | Target | Status |
|---|---:|---:|---|
| Performance score | 91/100 | ≥ 90 | Pass |
| Largest Contentful Paint (LCP) | 2.4 s | < 2.5 s | Pass |
| Cumulative Layout Shift (CLS) | 0 | < 0.1 | Pass |
| Interaction to Next Paint (INP) | Not verified | < 200 ms | Pending |

## Interpretation

- **Performance:** The local Lighthouse score meets the target.
- **LCP:** The measured result meets the target but is close to the limit.
- **CLS:** No layout shift was recorded in the measured run.
- **INP:** A qualifying user interaction has not yet been measured, so no result is claimed.

These results represent one local Lighthouse run. They may vary between runs and do not establish deployed-site performance.

## Additional Targets

The following targets still require separate verification:

- First Load JavaScript for `/menu`: less than 120 kB.
- Largest image: less than 150 kB.
- Deployed-site Lighthouse performance.
- Real-device behavior on a mobile phone.

## Next Verification

After deployment:

1. Run Lighthouse against the deployed URL using the mobile profile.
2. Record the new Performance, LCP, and CLS results.
3. Test a qualifying interaction to measure INP.
4. Inspect the `/menu` JavaScript bundle and largest image size.
5. Test the application on a real mobile device.

## Conclusion

The local Lighthouse run achieved a score of **91/100**, an LCP of **2.4 seconds**, and a CLS of **0**. Further testing is needed to verify INP, bundle and image-size targets, and performance on the deployed application.