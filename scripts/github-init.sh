#!/bin/bash

# GitHub initialization script for R-Oracle
# This script helps set up the repository for GitHub

set -e

echo "🚀 R-Oracle GitHub Setup"
echo "========================"
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "Initializing git repository..."
    git init
    echo "✅ Git repository initialized"
else
    echo "✅ Git repository already initialized"
fi

# Check if remote exists
if git remote | grep -q "origin"; then
    echo "⚠️  Remote 'origin' already exists"
    echo "Current remotes:"
    git remote -v
    read -p "Do you want to update the remote? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        read -p "Enter GitHub repository URL: " repo_url
        git remote set-url origin "$repo_url"
        echo "✅ Remote updated"
    fi
else
    read -p "Enter GitHub repository URL (or press Enter to skip): " repo_url
    if [ ! -z "$repo_url" ]; then
        git remote add origin "$repo_url"
        echo "✅ Remote added"
    fi
fi

# Check for uncommitted changes
if ! git diff-index --quiet HEAD --; then
    echo ""
    echo "⚠️  You have uncommitted changes"
    git status --short
    read -p "Do you want to commit all changes? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        read -p "Enter commit message (or press Enter for default): " commit_msg
        if [ -z "$commit_msg" ]; then
            commit_msg="Initial commit: R-Oracle resilient multi-source oracle chain"
        fi
        git add .
        git commit -m "$commit_msg"
        echo "✅ Changes committed"
    fi
else
    echo "✅ No uncommitted changes"
fi

# Check current branch
current_branch=$(git branch --show-current 2>/dev/null || echo "main")
echo ""
echo "Current branch: $current_branch"

# Ask about pushing
if git remote | grep -q "origin"; then
    echo ""
    read -p "Do you want to push to GitHub? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        # Rename branch to main if needed
        if [ "$current_branch" != "main" ] && [ "$current_branch" != "master" ]; then
            read -p "Rename branch to 'main'? (y/n) " -n 1 -r
            echo
            if [[ $REPLY =~ ^[Yy]$ ]]; then
                git branch -M main
                current_branch="main"
            fi
        fi
        
        echo "Pushing to GitHub..."
        git push -u origin "$current_branch"
        echo "✅ Pushed to GitHub"
    fi
fi

echo ""
echo "✨ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Visit your repository on GitHub"
echo "2. Check that all files are uploaded"
echo "3. Verify GitHub Actions are running"
echo "4. Update README.md with your GitHub username"
echo ""
echo "For more information, see GITHUB_SETUP.md"

