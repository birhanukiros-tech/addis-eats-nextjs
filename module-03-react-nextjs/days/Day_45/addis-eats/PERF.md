## Lighthouse Performance Verification

**Environment:** Local development (`http://localhost:3000/`)  
**Device profile:** Mobile  
**Tool:** Chrome Lighthouse

| Metric | Measured result | Target | Result |
|---|---:|---:|---|
| Performance score | 91/100 | ≥ 90 | Pass |
| Largest Contentful Paint (LCP) | 2.4 s | < 2.5 s | Pass |
| Cumulative Layout Shift (CLS) | 0 | < 0.1 | Pass |

**Notes:** These results were measured locally and may vary between runs. The LCP result is close to the target, so performance should be measured again on the deployed site. Interaction to Next Paint (INP) has not yet been verified with a qualifying interaction.