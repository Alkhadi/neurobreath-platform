# NeuroBreath GitHub Setup - Complete Guide

## 🎯 Current Status

Your repository is **SECURE** and **READY TO PUSH** to GitHub!

### ✅ Security Verification Complete
- **No credentials in Git history** (after history cleanup)
- **No .env files tracked** by Git
- **Comprehensive .gitignore** protecting all secrets
- **Local .env exists** for development (ignored by Git)
- **45 commits** ready to push
- **Remote configured**: github.com/Alkhadi/neurobreath-platform

---

## 🚀 STEP A: Push to GitHub (DO THIS FIRST)

### 1. Create GitHub Personal Access Token (PAT)

**Visit:** https://github.com/settings/tokens

**Settings:**
```
Token name: NeuroBreath Platform Deploy
Expiration: 90 days
Description: Deploy access for neurobreath-platform repository

Repository access:
  ✓ Only select repositories
  → Select: Alkhadi/neurobreath-platform

Permissions:
  Repository permissions:
    ✓ Contents: Read and write
    ✓ Metadata: Read-only (automatically selected)
```

**Copy the token** (starts with `github_pat_...`, ~82 characters)

### 2. Push Repository

```bash
cd /home/ubuntu/neurobreath

# Verify everything is ready
git remote -v
git status
git log --oneline -n 3

# Push with --force (required due to history rewrite)
git push -u origin main --force
```

**When prompted:**
```
Username for 'https://github.com': Alkhadi
Password for 'https://Alkhadi@github.com': <paste your PAT>
```

**⚠️ IMPORTANT:** Use your **PAT**, not your GitHub password!

### 3. Expected Success Output

```
Enumerating objects: XXX, done.
Counting objects: 100% (XXX/XXX), done.
Delta compression using up to X threads
Compressing objects: 100% (XXX/XXX), done.
Writing objects: 100% (XXX/XXX), X.XX MiB | X.XX MiB/s, done.
Total XXX (delta XXX), reused XXX (delta XXX)
remote: Resolving deltas: 100% (XXX/XXX), done.
To https://github.com/Alkhadi/neurobreath-platform.git
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

---

## ✅ STEP B: Verify Push Success

### Automated Verification

```bash
cd /home/ubuntu/neurobreath
./verify-push.sh
```

### Manual Verification

```bash
# Check branch tracking
git branch -vv
# Should show: * main dacb778 [origin/main] security: remove web/.env...

# Check remote connection
git remote show origin

# Verify no unpushed commits
git log origin/main..main
# Should be empty
```

### Verify on GitHub.com

Visit: **https://github.com/Alkhadi/neurobreath-platform**

**Check:**
- ✅ README.md renders correctly
- ✅ "45 commits" shown
- ✅ No `.env` files visible anywhere
- ✅ Last commit: "security: remove web/.env and restore comprehensive .gitignore"
- ✅ Directory structure: web/, docs/, shared/, serverless/, flutter_app/

**Test history is clean:**
1. Go to: Commits → Pick an old commit → Browse files
2. Check that `.env` files don't exist in old commits
3. Search repo for "DATABASE_URL" → Should only find `.env.example`

---

## 🔒 STEP C: Security Best Practices

### 1. Verify Repository is Private

```
Go to: https://github.com/Alkhadi/neurobreath-platform/settings

Under "Danger Zone" → "Change visibility"
  ✓ Ensure it shows: Private
```

**Why:** Even though credentials are cleaned from history, private is safer.

### 2. Enable Secret Scanning (If Available)

```
Go to: https://github.com/Alkhadi/neurobreath-platform/settings/security_analysis

Enable:
  ✓ Secret scanning
  ✓ Push protection
```

**Benefits:**
- Automatically detects credentials in commits
- Blocks pushes containing secrets
- Alerts you immediately if secrets detected

### 3. Set Up Credential Helper

**Automated setup:**
```bash
cd /home/ubuntu/neurobreath
./setup-git-credentials.sh
```

**Manual setup (Linux):**
```bash
# Cache credentials in memory for 8 hours
git config --global credential.helper 'cache --timeout=28800'
```

**Manual setup (macOS):**
```bash
# Store credentials in macOS Keychain
git config --global credential.helper osxkeychain
```

**Alternative (store PAT in remote URL):**
```bash
git remote set-url origin https://Alkhadi:YOUR_PAT@github.com/Alkhadi/neurobreath-platform.git
```

⚠️ **Note:** This stores PAT in `.git/config` (visible to anyone with file access)

### 4. Rotate Database Credentials (Recommended)

Even though credentials are removed from history, best practice is to rotate:

**Steps:**
1. Access Abacus AI database dashboard
2. Generate new password for `role_94a5ec0a7`
3. Update `web/.env` locally:
   ```
   DATABASE_URL="postgresql://role_94a5ec0a7:NEW_PASSWORD@db-94a5ec0a7.db003.hosteddb.reai.io:5432/94a5ec0a7?connect_timeout=15"
   ```
4. Test: `cd web && yarn dev`
5. Keep old password active 24 hours (safety buffer)
6. Delete old password after migration

---

## 🔄 STEP D: Normal Development Workflow

### Recommended: Feature Branch Workflow

```bash
# Create feature branch
git checkout -b feat/new-breathing-technique

# Make your changes...
# ... edit files ...

# Commit changes
git add .
git commit -m "feat: add new breathing technique"

# Push to GitHub
git push -u origin feat/new-breathing-technique

# Create Pull Request on GitHub (optional but recommended)
# Merge via GitHub UI when ready
# Delete branch after merge
```

**Why feature branches?**
- Keep main branch stable
- Easy to review changes
- Safe to experiment
- Easy to revert if needed

### Alternative: Simple Workflow (Main Branch)

```bash
# Make your changes...
# ... edit files ...

# Commit changes
git add .
git commit -m "feat: add new page"

# Push to GitHub
git push
# No --force needed for future pushes!
```

### Using the Workflow Helper

```bash
cd /home/ubuntu/neurobreath

# Interactive helpers
./dev-workflow.sh feature   # Create feature branch
./dev-workflow.sh commit    # Commit changes
./dev-workflow.sh push      # Push to GitHub
./dev-workflow.sh status    # Check status
./dev-workflow.sh sync      # Sync with main
```

---

## ⚠️ Critical Rules (NEVER BREAK THESE)

### 1. Never Commit Real Secrets

**Always commit:**
- ✅ `.env.example` (safe template)
- ✅ Documentation with placeholder values
- ✅ Code that reads from environment variables

**Never commit:**
- ❌ `.env` (real credentials)
- ❌ `.env.local` (real credentials)
- ❌ `.dev.vars` (Cloudflare secrets)
- ❌ API keys, passwords, tokens in code
- ❌ Database URLs with real credentials

**Your .gitignore already protects these!**

### 2. Never Use --force After First Push

**Only use --force:**
- ✅ First push after history rewrite (what you're doing now)
- ✅ After intentional history rewrite (rare, coordinated)

**Never use --force:**
- ❌ To fix merge conflicts (use proper merge/rebase)
- ❌ To overwrite someone else's work
- ❌ When collaborating with others (breaks their repos)
- ❌ On production branches with active development

**After your first push, you should NEVER need --force again!**

### 3. Always Pull Before Push

```bash
# Before starting work
git pull origin main

# Make changes...

# Before pushing
git pull origin main
git push
```

**Why:** Prevents merge conflicts and overwriting others' work.

---

## 📚 Quick Reference

### Helper Scripts Created

| Script | Purpose | Usage |
|--------|---------|-------|
| `verify-push.sh` | Verify push success | `./verify-push.sh` |
| `setup-git-credentials.sh` | Set up credential storage | `./setup-git-credentials.sh` |
| `dev-workflow.sh` | Development workflow helper | `./dev-workflow.sh [command]` |

### Common Git Commands

```bash
# Check status
git status
git branch -vv

# View history
git log --oneline -n 10
git log --graph --oneline --all

# Discard local changes
git restore <file>
git restore .

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Update from remote
git fetch origin
git pull origin main

# Switch branches
git checkout main
git checkout -b feat/new-feature

# Merge branch
git checkout main
git merge feat/new-feature
git push
```

### File Locations

- **Repository root:** `/home/ubuntu/neurobreath/`
- **Web app:** `/home/ubuntu/neurobreath/web/`
- **Local secrets:** `/home/ubuntu/neurobreath/web/.env` (ignored by Git)
- **Secret template:** `/home/ubuntu/neurobreath/.env.example` (tracked by Git)
- **Documentation:** `/home/ubuntu/neurobreath/docs/`
- **Git config:** `/home/ubuntu/neurobreath/.git/config`

---

## 🆘 Troubleshooting

### Push fails with "Authentication failed"

**Cause:** Wrong PAT or insufficient permissions

**Solution:**
1. Verify PAT format: `github_pat_11AAAA...`
2. Check PAT hasn't expired
3. Verify permissions: Contents = Read and write
4. Try regenerating PAT

### Push fails with "Repository not found"

**Cause:** Wrong repository URL or no access

**Solution:**
```bash
git remote -v
# Should show: https://github.com/Alkhadi/neurobreath-platform.git

# If different:
git remote set-url origin https://github.com/Alkhadi/neurobreath-platform.git
```

### Accidentally committed .env file

**Solution:**
```bash
# Remove from staging (before commit)
git reset HEAD .env

# Remove from Git (after commit)
git rm --cached .env
git commit -m "security: remove .env from tracking"
git push
```

**Then rotate the credentials immediately!**

### Want to see what changed

```bash
# Before committing
git diff

# After committing
git show HEAD

# Between branches
git diff main feat/new-feature
```

---

## 🎉 Success Checklist

After completing all steps:

- [ ] PAT created and saved securely
- [ ] Repository pushed to GitHub with `--force`
- [ ] Verified push success (ran `./verify-push.sh`)
- [ ] Checked GitHub.com (README renders, no .env files)
- [ ] Repository set to Private
- [ ] Secret scanning enabled (if available)
- [ ] Credential helper configured
- [ ] Tested git push without being prompted for password
- [ ] Read and understood development workflow
- [ ] Bookmarked this guide for reference

---

## 📞 Resources

- **Your Repository:** https://github.com/Alkhadi/neurobreath-platform
- **GitHub PAT Docs:** https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token
- **Git Credential Helper:** https://docs.github.com/en/get-started/getting-started-with-git/caching-your-github-credentials-in-git
- **Secret Removal:** https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository

---

## 🚀 Next Steps

After GitHub setup is complete:

1. **Configure Cloudflare Pages:**
   - Link GitHub repository
   - Set build command: `cd web && yarn install && yarn build`
   - Add environment variables (DATABASE_URL, etc.)
   - Set custom domain: www.neurobreath.co.uk

2. **Set up CI/CD:**
   - Add Cloudflare API token to GitHub Secrets
   - `.github/workflows/ci.yml` is already configured
   - Every push to main will trigger automatic deployment

3. **Rotate credentials:**
   - Generate new database password
   - Update `.env` locally and in Cloudflare Pages
   - Delete old credentials

4. **Continue development:**
   - Use feature branches for new work
   - Create pull requests for review
   - Merge to main when ready

---

**You're all set! Happy coding! 🎉**
