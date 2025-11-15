# GitHub Setup Guide

This guide will help you upload the R-Oracle project to GitHub.

## Prerequisites

- Git installed on your system
- GitHub account
- GitHub CLI (optional, but recommended)

## Step 1: Initialize Git Repository

If you haven't already initialized a git repository:

```bash
# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: R-Oracle resilient multi-source oracle chain"
```

## Step 2: Create GitHub Repository

### Option A: Using GitHub CLI

```bash
# Install GitHub CLI if not already installed
# https://cli.github.com/

# Login to GitHub
gh auth login

# Create repository
gh repo create r-oracle --public --source=. --remote=origin --push
```

### Option B: Using GitHub Web Interface

1. Go to [GitHub](https://github.com) and sign in
2. Click the "+" icon in the top right corner
3. Select "New repository"
4. Repository name: `r-oracle`
5. Description: "Resilient Multi-Source Oracle Chain built on Polkadot"
6. Choose visibility (Public or Private)
7. **DO NOT** initialize with README, .gitignore, or license (we already have these)
8. Click "Create repository"

## Step 3: Connect Local Repository to GitHub

```bash
# Add remote
git remote add origin https://github.com/LightLLM/R_Oracle.git

# Or using SSH (if you have SSH keys set up)
git remote add origin git@github.com:LightLLM/R_Oracle.git

# Verify remote
git remote -v
```

## Step 4: Push to GitHub

```bash
# Push to main branch
git branch -M main
git push -u origin main

# Or if you prefer master branch
git branch -M master
git push -u origin master
```

## Step 5: Set Up GitHub Actions Secrets (Optional)

If you want to use Docker builds with GitHub Actions:

1. Go to your repository on GitHub
2. Click "Settings" → "Secrets and variables" → "Actions"
3. Add the following secrets:
   - `DOCKER_USERNAME`: Your Docker Hub username
   - `DOCKER_PASSWORD`: Your Docker Hub password or access token

## Step 6: Configure Repository Settings

### Enable GitHub Actions

1. Go to repository Settings
2. Click "Actions" → "General"
3. Enable "Allow all actions and reusable workflows"
4. Save changes

### Set Up Branch Protection (Recommended)

1. Go to repository Settings
2. Click "Branches"
3. Add rule for `main` or `master` branch:
   - Require pull request reviews
   - Require status checks to pass
   - Require branches to be up to date

### Add Repository Topics

1. Go to repository main page
2. Click the gear icon next to "About"
3. Add topics:
   - `polkadot`
   - `substrate`
   - `parachain`
   - `oracle`
   - `blockchain`
   - `rust`
   - `nextjs`
   - `hackathon`

## Step 7: Create Releases

To create a release:

```bash
# Tag the release
git tag -a v1.0.0 -m "Release version 1.0.0"

# Push tags
git push origin v1.0.0
```

Or use GitHub web interface:
1. Go to "Releases" → "Create a new release"
2. Choose tag version (e.g., v1.0.0)
3. Add release notes
4. Publish release

## Step 8: Verify Everything Works

1. Check that all files are uploaded:
   ```bash
   git ls-files
   ```

2. Verify GitHub Actions are running:
   - Go to "Actions" tab
   - Check that CI workflow runs successfully

3. Test cloning the repository:
   ```bash
   cd /tmp
   git clone https://github.com/LightLLM/R_Oracle.git
   cd R_Oracle
   ```

## Troubleshooting

### Authentication Issues

If you get authentication errors:

```bash
# Use personal access token instead of password
# Generate token at: https://github.com/settings/tokens
git remote set-url origin https://YOUR_TOKEN@github.com/LightLLM/R_Oracle.git
```

### Large File Issues

If you have large files that shouldn't be committed:

```bash
# Check file sizes
find . -type f -size +10M

# Add to .gitignore if needed
echo "large-file.bin" >> .gitignore
git rm --cached large-file.bin
git commit -m "Remove large file"
```

### Push Rejected

If push is rejected:

```bash
# Pull and merge remote changes first
git pull origin main --rebase

# Then push again
git push origin main
```

## Next Steps

After uploading to GitHub:

1. **Add collaborators** (if working in a team)
2. **Set up project board** for issue tracking
3. **Enable Discussions** for community engagement
4. **Add repository description and website** (if applicable)
5. **Share the repository** with the hackathon organizers

## Repository Badges

Add these badges to your README.md (update URLs with your username):

```markdown
![CI](https://github.com/LightLLM/R_Oracle/workflows/CI/badge.svg)
![License](https://img.shields.io/badge/license-Unlicense-blue.svg)
![Rust](https://img.shields.io/badge/rust-1.75+-orange.svg)
![Node](https://img.shields.io/badge/node-18+-green.svg)
```

## Useful Git Commands

```bash
# Check status
git status

# View commit history
git log --oneline

# Create new branch
git checkout -b feature/new-feature

# Push branch
git push -u origin feature/new-feature

# Update from remote
git pull origin main

# View remotes
git remote -v
```

## Support

If you encounter issues:
1. Check GitHub documentation: https://docs.github.com
2. Review Git documentation: https://git-scm.com/doc
3. Open an issue in the repository

