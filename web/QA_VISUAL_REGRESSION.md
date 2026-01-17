# Visual Regression Testing Guide

## Overview

Automated visual regression testing system that captures screenshots of key routes and detects layout regressions, console errors, and accessibility issues.

## System Components

- **Playwright** - Test framework with screenshot comparison
- **Two device profiles** - Mobile (iPhone 13) and Desktop (1280x720)
- **Automated CI workflow** - Runs on every PR
- **Console error detection** - Fails on any console.error or pageerror
- **Layout assertions** - Checks for overflow, CTA visibility, dialog clipping

## Running Tests Locally

### Full test suite
```bash
cd web
npm run test:visual
```

### Run specific device
```bash
npm run test:visual -- --project=mobile
npm run test:visual -- --project=desktop
```

### Run with UI (interactive)
```bash
npx playwright test tests/visual --ui --config=playwright.config.visual.ts
```

### Show last report
```bash
npm run test:visual:report
```

## Updating Snapshots

When you intentionally change UI:

```bash
# Update all snapshots
npm run test:visual:update

# Update specific test
npx playwright test tests/visual/visual.spec.ts -u --grep="uk-homepage"
```

**Important:** Review diff images carefully before committing updated snapshots!

## Route Coverage

### Current routes tested (both UK and US):
- Homepage (`/uk`, `/us`)
- Conditions hub (`/uk/conditions`, `/us/conditions`)
- Tools hub (`/uk/tools`, `/us/tools`)
- Guides hub (`/uk/guides`, `/us/guides`)
- Search (`/uk/search`, `/us/search`)
- Trust Centre (`/uk/trust`, `/us/trust`)
- Glossary (`/uk/glossary`, `/us/glossary`)
- Help me choose (`/uk/help-me-choose`)
- Breathing timer tool (with dialog test)

### Adding new routes

Edit `tests/visual/visual.spec.ts`:

```typescript
const ROUTES: RouteConfig[] = [
  // ... existing routes
  { 
    url: '/uk/new-page', 
    name: 'new-page', 
    region: 'uk', 
    waitFor: 'h1', 
    fullPage: true 
  },
];
```

## Interpreting Diffs

### Acceptable differences:
- Anti-aliasing variations (< 100 pixels)
- Minor font rendering differences
- Timestamp/date changes

### Unacceptable differences:
- Layout shifts
- Missing content
- Broken images
- Clipped buttons/CTAs
- Overflow

## Flake Control

### Strategies implemented:
1. **Animations disabled** - CSS transitions/animations set to 0s in test context
2. **Reduced motion** - Browser emulates prefers-reduced-motion
3. **Consistent locale/timezone** - en-GB, Europe/London
4. **Font loading wait** - Tests wait for document.fonts.ready
5. **Network idle** - Tests wait for stable network state
6. **Single worker** - Tests run sequentially for consistency

### If tests are flaky:
1. Check `waitFor` selector is correct
2. Increase settling time in `waitForStability()`
3. Check for dynamic content (ads, time-based elements)
4. Review test-results/ folder for failure screenshots

## Console Errors

Tests automatically collect and fail on:
- `console.error` messages
- `pageerror` events
- Unhandled rejections

Error report saved to: `reports/visual/console-errors.json`

## Accessibility Smoke Checks

Basic checks included:
- Single H1 per page
- (Future: focus visible, color contrast)

For comprehensive accessibility testing, use Lighthouse or axe.

## CI Integration

GitHub Actions workflow runs on:
- Every PR to main/develop
- Every push to main
- Manual trigger

### Artifacts uploaded:
- `visual-regression-results/` - All screenshots and diffs
- `playwright-report/` - HTML test report
- `console-errors.json` - Any console errors found

## File Structure

```
web/
├── playwright.config.visual.ts     # Playwright config
├── tests/
│   └── visual/
│       ├── visual.spec.ts          # Test suite
│       └── __screenshots__/        # Baseline snapshots (committed)
├── reports/
│   └── visual/
│       ├── playwright-report/      # HTML report
│       ├── console-errors.json     # Error log
│       └── diff-*.png              # Diff images (on failure)
└── test-results/                   # Playwright output (not committed)
```

## Troubleshooting

### Tests fail locally but pass in CI
- Check Node/npm versions match
- Ensure production build is used (CI uses `npm run build && npm run start`)
- Check for environment-specific code

### Snapshot mismatches
- Review diff images in test-results/
- If intentional, update with `npm run test:visual:update`
- If not intentional, investigate the cause

### Console errors in CI but not locally
- Check CI logs in Actions tab
- Look at console-errors.json artifact
- Reproduce by running production build locally

### Tests timeout
- Increase timeout in playwright.config.visual.ts
- Check for stuck network requests
- Verify selectors exist

## Best Practices

1. **Commit snapshots** - Always commit __screenshots__/ directory
2. **Review diffs visually** - Don't blindly update snapshots
3. **Test in both devices** - Don't skip mobile or desktop
4. **Keep tests fast** - Use viewport screenshots for interactive pages
5. **Test critical paths first** - Homepage, hubs, key tools
6. **Document intentional changes** - In PR description, explain UI changes

## Related Documentation

- [PERFORMANCE_BUDGETS.md](./PERFORMANCE_BUDGETS.md) - Performance testing
- [PERF_AUTOPLAN.md](./PERF_AUTOPLAN.md) - Optimization recommendations
- [Playwright Docs](https://playwright.dev/docs/test-snapshots)
