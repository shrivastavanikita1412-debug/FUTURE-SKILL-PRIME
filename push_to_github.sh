#!/bin/bash
# FoodVerse AI - GitHub Push Helper Script
# Usage: ./push_to_github.sh <your-github-username> [optional-repo-name]

set -e

USERNAME=$1
REPO_NAME=${2:-"FUTURE-SKILLS-PRIME"}

if [ -z "$USERNAME" ]; then
  echo "=========================================================="
  echo " FoodVerse AI - GitHub Deployment Helper"
  echo "=========================================================="
  echo "Usage: ./push_to_github.sh <YOUR_GITHUB_USERNAME> [REPO_NAME]"
  echo ""
  echo "Example:"
  echo "  ./push_to_github.sh nikitashrivastava"
  echo ""
  echo "Step 1: Create a repository named '$REPO_NAME' on GitHub:"
  echo "        https://github.com/new?name=$REPO_NAME"
  echo ""
  echo "Step 2: Run this script with your GitHub username."
  echo "=========================================================="
  exit 1
fi

REMOTE_URL="https://github.com/${USERNAME}/${REPO_NAME}.git"

echo "Configuring remote origin to: $REMOTE_URL"
if git remote | grep -q "origin"; then
  git remote set-url origin "$REMOTE_URL"
else
  git remote add origin "$REMOTE_URL"
fi

echo "Renaming default branch to main..."
git branch -M main

echo "Pushing commits to $REMOTE_URL..."
git push -u origin main

echo ""
echo " Successfully pushed FoodVerse AI to GitHub!"
echo " Repository URL: https://github.com/${USERNAME}/${REPO_NAME}"
