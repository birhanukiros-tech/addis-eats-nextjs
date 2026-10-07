# Addis Eats Performance

## Day 43 Optimization

Performance was measured using the production build with Lighthouse.

### Production Metrics

| Metric | Result | Target |
|---|---:|---:|
| LCP | 0.34 s | < 2.5 s |
| CLS | 0 | < 0.1 |
| INP | 8 ms | < 200 ms |

## Optimizations Completed

- Replaced image rendering with `next/image`.
- Added correct image dimensions.
- Added responsive `sizes` values to image components.
- Added `priority` to the main hero image only.
- Added `next/font` with the Inter font and `display: "swap"`.
- Confirmed that the application has no third-party scripts requiring optimization.
- Added `.env.example` with safe environment-variable placeholders.
- Confirmed `.env.local` remains ignored by Git.

## Environment

Real credentials remain in `.env.local` and are not committed.

`.env.example` documents the environment variables required to run the application.

## Result

The production build completed successfully, and the measured Core Web Vitals are within the recommended targets.