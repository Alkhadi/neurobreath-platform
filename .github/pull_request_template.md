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

## Performance Playbook Compliance

This PR adheres to the [Performance Playbook](./web/PERFORMANCE_PLAYBOOK.md).

### Code Quality
- [ ] No inline styles (`style=` or `<style>` blocks)
- [ ] No ad-hoc JS hacks (reusable components/hooks/utils only)
- [ ] No new console errors introduced
- [ ] `npm run lint` passes
- [ ] `npm run typecheck` passes
- [ ] `npm run build` succeeds

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
npm run test:visual

# Performance gate
npm run perf:gate

# Dependency check
npm run perf:deps

# Lint and type check
npm run lint && npm run typecheck && npm run build
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

**Engineering Standards:** [ENGINEERING_STANDARDS.md](./web/ENGINEERING_STANDARDS.md)  
**Performance Playbook:** [PERFORMANCE_PLAYBOOK.md](./web/PERFORMANCE_PLAYBOOK.md)  
**Scaffolder Guide:** [SCAFFOLDER_GUIDE.md](./web/SCAFFOLDER_GUIDE.md)
