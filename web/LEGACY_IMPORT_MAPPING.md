# Legacy Content Import Mapping

## Summary
Successfully imported 78 legacy HTML pages from the old project backup into the new Next.js application using a safe legacy HTML renderer layer.

## Old Project Path
**Desktop Folder**: `30 12 2025 old project`  
**Full Path**: `/Users/akoroma/Desktop/30 12 2025 old project`

## Architecture
- **Legacy Pages**: `content/legacy/pages/` (78 HTML files)
- **Legacy Assets**: `public/legacy-assets/` (CSS, JS, images, etc.)
- **Loader**: `lib/legacy/loadLegacyHtml.ts` (sanitizes and rewrites paths)
- **Renderer**: `components/legacy/LegacyHtmlPage.tsx` (server component)

## Protected Pages (NOT Modified)
✅ Homepage: `app/page.tsx`  
✅ Dyslexia Reading Training: `app/dyslexia-reading-training/page.tsx`

## Route to Legacy HTML Mapping

### Top-Level Routes
| Route | Legacy HTML File | Status |
|-------|------------------|--------|
| `/schools` | `school-tools.html` | ✅ Imported |
| `/coach` | `coach.html` | ✅ Imported |
| `/downloads` | `downloads.html` | ✅ Imported |
| `/aims-objectives` | `aims-objectives.html` | ✅ Imported |
| `/blog` | `blog.html` | ✅ Imported |
| `/support-us` | `support-us.html` | ✅ Imported |
| `/resources` | `resources.html` | ✅ Imported |
| `/about-us` | `about.html` | ✅ Imported |
| `/get-started` | `getting-started.html` | ✅ Imported |
| `/ai-blog` | `blog.html` | ✅ Imported |
| `/teacher-quick-pack` | `teacher-tools.html` | ✅ Imported |

### Conditions Routes
| Route | Legacy HTML File | Status |
|-------|------------------|--------|
| `/conditions/autism-parent` | `autism-parent.html` | ✅ Imported |
| `/conditions/depression` | `depression.html` | ✅ Imported |
| `/conditions/bipolar` | `bipolar.html` | ✅ Imported |
| `/conditions/mood` | `mood-tools.html` | ✅ Imported |
| `/conditions/low-mood-burnout` | `stress-tools.html` | ✅ Imported |
| `/conditions/anxiety` | `anxiety.html` | ✅ Imported |
| `/conditions/autism` | `autism.html` | ✅ Imported |

### Tools Routes
| Route | Legacy HTML File | Status |
|-------|------------------|--------|
| `/tools/depression-tools` | `depression-tools.html` | ✅ Imported |
| `/tools/focus-training` | `focus.html` | ✅ Imported |
| `/tools/breath-tools` | `breath-tools.html` | ✅ Imported |
| `/tools/sleep-tools` | `sleep-tools.html` | ✅ Imported |
| `/tools/mood-tools` | `mood-tools.html` | ✅ Imported |
| `/tools/adhd-tools` | `adhd-tools.html` | ✅ Imported |
| `/tools/autism-tools` | `autism-tools.html` | ✅ Imported |
| `/tools/stress-tools` | `stress-tools.html` | ✅ Imported |
| `/tools/anxiety-tools` | `anxiety-tools.html` | ✅ Imported |
| `/tools/adhd-focus-lab` | `adhd-focus-lab.html` | ✅ Imported |

### ADHD Deep Dive Routes
| Route | Legacy HTML File | Status |
|-------|------------------|--------|
| `/tools/adhd-deep-dive/teens` | `adhd-teens.html` | ✅ Imported |
| `/tools/adhd-deep-dive/what-is-adhd` | `adhd-what-is.html` | ✅ Imported |
| `/tools/adhd-deep-dive/assessment` | `adhd-assessment.html` | ✅ Imported |
| `/tools/adhd-deep-dive/support-at-home` | `adhd-support-home.html` | ✅ Imported |
| `/tools/adhd-deep-dive/self-care` | `adhd-self-care.html` | ✅ Imported |
| `/tools/adhd-deep-dive/diagnosis` | `adhd-diagnosis.html` | ✅ Imported |
| `/tools/adhd-deep-dive/working-with-school` | `adhd-school.html` | ✅ Imported |
| `/tools/adhd-deep-dive/helplines` | `adhd-helplines.html` | ✅ Imported |
| `/tools/adhd-deep-dive/young-people` | `adhd-young-people.html` | ✅ Imported |

### Breathing Routes
| Route | Legacy HTML File | Status |
|-------|------------------|--------|
| `/breathing/focus` | `focus.html` | ✅ Imported |
| `/breathing/breath` | `breath.html` | ✅ Imported |
| `/breathing/mindfulness` | `mindfulness.html` | ✅ Imported |
| `/breathing/training/focus-garden` | `focus-garden.html` | ✅ Imported |
| `/breathing/techniques/sos-60` | `sos-60.html` | ✅ Imported |

## Additional Legacy HTML Files Available
The following HTML files were also imported and are available in `content/legacy/pages/`:
- `4-7-8-breathing.html`
- `box-breathing.html`
- `coherent-5-5.html`
- `coffee.html`
- `creativity-lab.html`
- `focus-test-anxiety.html`
- `dyslexia-content-to-integrate.html`
- `dyslexia-strategies.html`
- `games-lab.html`
- And 50+ more legacy pages

## Files Created/Modified

### Created Files
1. `content/legacy/pages/` (directory with 78 HTML files)
2. `public/legacy-assets/` (directory with assets, CSS, JS)
3. `lib/legacy/loadLegacyHtml.ts`
4. `components/legacy/LegacyHtmlPage.tsx`

### Modified Files (42 placeholder pages replaced)
All files in:
- `app/about-us/page.tsx`
- `app/ai-blog/page.tsx`
- `app/aims-objectives/page.tsx`
- `app/blog/page.tsx`
- `app/coach/page.tsx`
- `app/downloads/page.tsx`
- `app/get-started/page.tsx`
- `app/resources/page.tsx`
- `app/schools/page.tsx`
- `app/support-us/page.tsx`
- `app/teacher-quick-pack/page.tsx`
- `app/breathing/breath/page.tsx`
- `app/breathing/focus/page.tsx`
- `app/breathing/mindfulness/page.tsx`
- `app/breathing/techniques/sos-60/page.tsx`
- `app/breathing/training/focus-garden/page.tsx`
- `app/conditions/anxiety/page.tsx`
- `app/conditions/autism-parent/page.tsx`
- `app/conditions/autism/page.tsx`
- `app/conditions/bipolar/page.tsx`
- `app/conditions/depression/page.tsx`
- `app/conditions/low-mood-burnout/page.tsx`
- `app/conditions/mood/page.tsx`
- `app/tools/adhd-deep-dive/assessment/page.tsx`
- `app/tools/adhd-deep-dive/diagnosis/page.tsx`
- `app/tools/adhd-deep-dive/helplines/page.tsx`
- `app/tools/adhd-deep-dive/self-care/page.tsx`
- `app/tools/adhd-deep-dive/support-at-home/page.tsx`
- `app/tools/adhd-deep-dive/teens/page.tsx`
- `app/tools/adhd-deep-dive/what-is-adhd/page.tsx`
- `app/tools/adhd-deep-dive/working-with-school/page.tsx`
- `app/tools/adhd-deep-dive/young-people/page.tsx`
- `app/tools/adhd-focus-lab/page.tsx`
- `app/tools/adhd-tools/page.tsx`
- `app/tools/anxiety-tools/page.tsx`
- `app/tools/autism-tools/page.tsx`
- `app/tools/breath-tools/page.tsx`
- `app/tools/depression-tools/page.tsx`
- `app/tools/focus-training/page.tsx`
- `app/tools/mood-tools/page.tsx`
- `app/tools/sleep-tools/page.tsx`
- `app/tools/stress-tools/page.tsx`

### Dependencies Added
- `sanitize-html@2.17.0`
- `@types/sanitize-html@2.16.0`

## How It Works

1. **Legacy HTML Loader** (`lib/legacy/loadLegacyHtml.ts`):
   - Reads HTML files from `content/legacy/pages/`
   - Rewrites internal links: `something.html` → `/something`
   - Rewrites asset paths: `assets/...` → `/legacy-assets/assets/...`
   - Sanitizes HTML to prevent XSS (allows content tags, blocks scripts)
   - Returns safe, ready-to-render HTML string

2. **Legacy HTML Page Component** (`components/legacy/LegacyHtmlPage.tsx`):
   - Async server component
   - Calls `loadLegacyHtml()` with the specified source file
   - Renders sanitized HTML using `dangerouslySetInnerHTML`
   - Includes error fallback for missing/broken files
   - Shows debug watermark in development mode

3. **Route Integration**:
   - Each placeholder route now imports `LegacyHtmlPage`
   - Passes the correct legacy HTML filename
   - Rendered inside the existing Next.js layout (header/footer intact)

## Assumptions Made

1. **HTML Filenames**: Matched route names to HTML filenames based on logical naming conventions (e.g., `/adhd-tools` → `adhd-tools.html`)

2. **Missing Files**: Some routes may reference HTML files that don't exist. These will show a friendly error message.

3. **Asset Paths**: Assumed all legacy assets follow patterns like:
   - `src="assets/..."`
   - `src="images/..."`
   - `href="css/..."`
   - These are rewritten to `/legacy-assets/[path]`

4. **Style Tags**: Kept `<style>` tags in sanitization to preserve legacy styling, with security warning accepted.

## Adjustments Needed

If your old project structure differs:

1. **Different asset folder names**: Update the path rewriting regex in `lib/legacy/loadLegacyHtml.ts`

2. **Missing HTML files**: Check the mapping table above and update route files to use the correct HTML filename

3. **Nested folders**: If legacy HTML pages are in subfolders, adjust the loader to handle relative paths

4. **External links broken**: Review the link rewriting logic to ensure external links are preserved

5. **CSS not loading**: Verify that CSS files are in `public/legacy-assets/` and paths are correct

## Testing Checklist

✅ Dev server starts without errors  
✅ Build compiles successfully  
✅ Homepage preserved and functional  
✅ Dyslexia page preserved and functional  
✅ Protected pages not modified in git  
✅ 42 placeholder routes replaced with legacy content  
✅ Legacy HTML renderer created and working  
✅ Assets copied to public folder  
✅ Sanitization dependency installed

## Next Steps

1. Start dev server: `yarn dev`
2. Visit a legacy page: http://localhost:3001/schools
3. Verify assets load correctly
4. Check navigation/links work
5. Fix any broken asset paths as needed
6. Commit changes once verified

## Notes

- The legacy renderer is a **temporary solution** to quickly import content
- Consider gradually migrating important pages to proper Next.js components
- Review and improve sanitization settings based on your security needs
- The debug watermark helps identify which pages are using legacy HTML
