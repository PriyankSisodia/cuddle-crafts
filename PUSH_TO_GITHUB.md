# Push to GitHub Instructions

## Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `cuddle-crafts`
3. Select **Private**
4. **DO NOT** check any boxes (no README, .gitignore, or license)
5. Click "Create repository"

## Step 2: Push Your Code

After creating the repository, run these commands:

```bash
cd "/Users/priyank.sisodia/Mine/working/cuddle crafts"

# Add the remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/cuddle-crafts.git

# Push to GitHub
git push -u origin main
```

## Alternative: Using SSH (if you have SSH keys set up)

```bash
git remote add origin git@github.com:YOUR_USERNAME/cuddle-crafts.git
git push -u origin main
```

## If you need to authenticate:

- For HTTPS: GitHub will prompt for username and password (use a Personal Access Token as password)
- For SSH: Make sure your SSH key is added to your GitHub account

