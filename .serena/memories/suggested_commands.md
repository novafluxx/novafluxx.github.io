# Suggested Commands

## Package Management
```bash
pnpm install              # Install dependencies
```

## Development
```bash
pnpm dev                  # Start dev server at localhost:4321
pnpm build                # Build for production to ./dist/
pnpm preview              # Preview production build locally
pnpm preview:worker       # Build and preview with Wrangler
```

## Deployment
```bash
pnpm deploy:cf            # Build and deploy to Cloudflare Workers (current)
pnpm deploy:pages         # Build and deploy to Cloudflare Pages (legacy)
```

## Astro Commands
```bash
pnpm astro                # Run Astro CLI commands
```

## Windows System Utilities
Since this project is on Windows, use these PowerShell/CMD commands:
```powershell
dir                       # List directory contents (or ls in PowerShell)
cd                        # Change directory
type <file>              # Display file contents (or cat in PowerShell)
findstr                   # Search text in files (or grep in PowerShell)
where                     # Find file locations (or which in PowerShell)
```

## Git Commands
```bash
git status                # Check repository status
git add .                 # Stage all changes
git commit -m "message"   # Commit changes
git push                  # Push to remote
git pull                  # Pull from remote
git branch                # List branches
```

## Common Development Workflow
1. `pnpm install` - Install dependencies
2. `pnpm dev` - Start development server
3. Make changes to `.astro` files in `src/`
4. `pnpm build` - Build for production
5. `pnpm preview:worker` - Test with Wrangler locally
6. `pnpm deploy:cf` - Deploy to Cloudflare Workers
