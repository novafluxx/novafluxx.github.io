# Task Completion Checklist

## When a Code Task is Completed

### 1. Build Verification
```bash
pnpm build
```
- Ensure the build completes without errors
- Check for TypeScript type errors
- Verify no Astro compilation errors

### 2. Local Testing
```bash
pnpm dev
# or for Cloudflare Workers preview
pnpm preview:worker
```
- Test the changes in development mode
- Verify functionality works as expected
- Check responsive design (if UI changes)
- Test navigation if routes were added/modified

### 3. Code Quality Checks
- **TypeScript**: Strict mode is enabled - ensure no type errors
- **Styling**: Verify Tailwind classes are correct and consistent with design system
- **Components**: Ensure props are properly typed
- **Accessibility**: Check focus states and semantic HTML

### 4. File Organization
- **New pages**: Added to `src/pages/`
- **New components**: Added to `src/components/`
- **Navigation**: Updated in `Nav.astro` if new routes added
- **Images**: Placed in `public/images/`

### 5. Documentation
- **CLAUDE.md**: Update if significant patterns or conventions change
- **Comments**: Add only where logic isn't self-evident (avoid over-commenting)

### 6. Deployment (if ready)
```bash
pnpm deploy:cf
```
- Deploy to Cloudflare Workers
- Verify at novafluxx.org and www.novafluxx.org

## Notes
- **No linting**: Project doesn't have ESLint/Prettier configured
- **No testing**: Project doesn't have automated tests
- **No formatting**: No automated formatter configured
- Focus on TypeScript type checking and manual testing
