## Description

<!-- Provide a clear description of the changes in this PR -->

## Type of Change

- [ ] 🐛 Bug fix (non-breaking change which fixes an issue)
- [ ] ✨ New feature (non-breaking change which adds functionality)
- [ ] 💥 Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] 📝 Documentation update
- [ ] 🎨 Style/UI update
- [ ] ♻️ Code refactor
- [ ] ⚡️ Performance improvement
- [ ] ✅ Test update
- [ ] 🔧 Configuration/tooling update

## AI Agent Rules Compliance

This PR adheres to [AI_AGENT_RULES.md](../AI_AGENT_RULES.md) and the [Performance Playbook](../web/PERFORMANCE_PLAYBOOK.md).

### ✅ Quality Gates (MANDATORY — Must Pass)
- [ ] `yarn lint` passes (zero errors)
- [ ] `yarn typecheck` passes (zero errors)
- [ ] `yarn build` passes from clean state
- [ ] Relevant tests pass (specify which: e.g., `yarn test:e2e tests/buddy.spec.ts`)

### Code Quality
- [ ] No inline styles (`style=` or `<style>` blocks)
- [ ] No ad-hoc JS hacks (reusable components/hooks/utils only)
- [ ] No new console errors introduced
- [ ] No TypeScript `any` (use `unknown`, unions, or strict types)
- [ ] No unused imports or variables

### Build Safety (Next.js App Router)
- [ ] API route handlers are build-safe (no throw on import)
- [ ] External SDK clients instantiated **inside** handlers (not at module top-level)
- [ ] Env vars validated **inside** handlers before use
- [ ] Missing env vars return controlled JSON error (500), not throw
- [ ] No server-only imports in client components
- [ ] Prisma client only used server-side

### Environment Variables
- [ ] `.env.example` updated with new env var **names** (no values)
- [ ] No secrets committed to code
- [ ] Build does not fail due to missing env vars evaluated at import time

### Artifacts & Hygiene
- [ ] No build artifacts committed (`.next/`, `*.tsbuildinfo`, `playwright-report/`, `test-results/`)
- [ ] Diffs are minimal and scoped
- [ ] Changes are focused on stated objective

### Performance
- [ ] Visual regression passes (or snapshots updated with justification)
- [ ] Performance gate passes (or justified exception documented)
- [ ] Bundle deltas reviewed (check `.next/analyze/`)
- [ ] Largest chunks within budgets
- [ ] No unnecessary dependencies added
- [ ] If adding dependency: updated allowlist with justification

### Content & Localisation
- [ ] UK/US variants correct and consistent
- [ ] External citations are copy-only (not clickable)
- [ ] Educational framing maintained (no medical claims)
- [ ] Last-reviewed dates updated where applicable

### Accessibility
- [ ] Heading hierarchy logical (single H1, nested H2/H3)
- [ ] Focus order makes sense
- [ ] Keyboard navigation works
- [ ] Reduced motion respected
- [ ] No emoji in TTS-read text

### Mobile/Responsive
- [ ] No horizontal overflow
- [ ] CTAs visible and tappable
- [ ] Touch targets ≥ 44x44px
- [ ] Text readable without zoom

### SEO & Metadata
- [ ] Title and description present and accurate
- [ ] Canonical URL correct
- [ ] Hreflang tags for UK/US where applicable
- [ ] Open Graph and Twitter metadata
- [ ] Appropriate indexing rules (noindex for printables/search)

## Testing

### Manual Testing
<!-- Describe the testing you've done -->

- [ ] Tested in Chrome
- [ ] Tested in Safari
- [ ] Tested in Firefox
- [ ] Tested on mobile device
- [ ] Tested with keyboard navigation
- [ ] Tested with screen reader (if applicable)

### Automated Testing
```bash
# Visual regression
yarn test:visual

# Performance gate
yarn perf:gate

# Dependency check
yarn perf:deps

# Lint and type check
yarn lint && yarn typecheck && yarn build
```

## Performance Impact

### Bundle Analysis
<!-- If this changes bundle size, include before/after comparison -->

**Before:**
- Client JS: X KB
- Largest chunk: Y KB

**After:**
- Client JS: X KB
- Largest chunk: Y KB

**Delta:** +/- Z KB

### Lighthouse Scores
<!-- If performance-critical route, include scores -->

- Performance: __/100
- Accessibility: __/100
- Best Practices: __/100
- SEO: __/100

## Screenshots/Videos

<!-- Include screenshots or videos demonstrating the changes -->

### Desktop

<!-- Add desktop screenshots -->

### Mobile

<!-- Add mobile screenshots -->

## Breaking Changes

<!-- List any breaking changes and migration steps if applicable -->

## Related Issues

<!-- Link related issues using #issue_number -->

Closes #
Relates to #

## Additional Notes

<!-- Any additional context, decisions, or considerations -->

## Reviewer Checklist

For reviewers:

- [ ] Code follows NeuroBreath patterns and conventions
- [ ] Performance Playbook compliance verified
- [ ] No security concerns
- [ ] Documentation updated if needed
- [ ] Tests are appropriate and passing
- [ ] Ready to merge

---

**Engineering Standards:** [ENGINEERING_STANDARDS.md](../web/ENGINEERING_STANDARDS.md)  
**Performance Playbook:** [PERFORMANCE_PLAYBOOK.md](../web/PERFORMANCE_PLAYBOOK.md)  
**Scaffolder Guide:** [SCAFFOLDER_GUIDE.md](../web/SCAFFOLDER_GUIDE.md)
