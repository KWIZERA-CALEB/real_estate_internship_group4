# GitHub Setup & Push Guide for Real Estate Internship Group

## Overview
This guide explains how to set up your GitHub repository and push your authenticated Real Estate Management System to GitHub for your group to collaborate.

---

## Part 1: Initial GitHub Repository Setup (One Person Only)

### Step 1: Create a New Repository on GitHub

1. **Go to GitHub**: Visit [github.com](https://github.com) and sign in to your account
2. **Create New Repo**: Click the "+" icon in the top right > "New repository"
3. **Fill in Details**:
   - **Repository name**: `real_estate_internship_group4`
   - **Description**: Real Estate Management System with Session-Based Authentication
   - **Public/Private**: Choose Private (recommended for group work)
   - **Initialize**: Check "Add a README.md"
   - **Add .gitignore**: Select "Node"
4. **Create Repository**: Click "Create repository"

### Step 2: Copy the Repository URL
After creating the repository, you'll see a green "Code" button. Copy the HTTPS URL (looks like: `https://github.com/yourusername/real_estate_internship_group4.git`)

---

## Part 2: Initialize Git in Your Local Project

### Step 3: Initialize Git Repository

Open PowerShell in your project root and run:

```powershell
cd c:\Users\Miguel\Documents\real_estate_internship_group4
git init
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

### Step 4: Create a `.gitignore` File

If not already present, create `.gitignore` in your project root with these contents:

```
# Node modules
node_modules/
backend/node_modules/
frontend/node_modules/

# Environment variables
.env
.env.local
.env.*.local

# Build files
dist/
build/
*.log

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Session and database files
sessions/
*.sqlite
*.db
```

### Step 5: Add Remote Repository

Replace `YOUR_GITHUB_URL` with your copied repository URL:

```powershell
git remote add origin https://github.com/yourusername/real_estate_internship_group4.git
```

### Step 6: Create Initial Branch

```powershell
git branch -M main
```

---

## Part 3: Make Your First Commit and Push

### Step 7: Add All Files to Staging

```powershell
cd c:\Users\Miguel\Documents\real_estate_internship_group4
git add .
```

### Step 8: Create Commit

```powershell
git commit -m "Initial commit: Real Estate Management System with Session-Based Authentication

- Implemented session-based authentication for backend (Express-session with Sequelize)
- Added login/signup components with password hashing (bcryptjs)
- Created protected dashboard with user session management
- Developed blue and white CSS theme for professional UI
- Integrated logout functionality
- Added user and property management features"
```

### Step 9: Push to GitHub

```powershell
git push -u origin main
```

**Note**: You may be prompted to authenticate. Use your GitHub token or credentials.

---

## Part 4: Group Members Adding to Remote Repository

### For Other Group Members: Clone the Repository

Each team member should run:

```powershell
# Choose where to store the project on their computer
cd c:\Users\YourName\Documents

# Clone the repository
git clone https://github.com/yourusername/real_estate_internship_group4.git

# Navigate to project
cd real_estate_internship_group4

# Configure git locally
git config user.name "Your Name"
git config user.email "your.email@example.com"

# Install dependencies
cd backend
npm install
cd ..\frontend
npm install
```

---

## Part 5: Daily Git Workflow for Team Collaboration

### Before Starting Work (ALWAYS DO THIS)

```powershell
git pull origin main
```

### Making Changes and Committing

1. **Make your changes** to your assigned files

2. **Check what changed**:
```powershell
git status
```

3. **Add specific files**:
```powershell
git add path/to/your/file.js
# Or add all changes
git add .
```

4. **Commit your work**:
```powershell
git commit -m "Brief description of changes

- Detailed point 1
- Detailed point 2
- Detailed point 3"
```

5. **Push to GitHub**:
```powershell
git push origin main
```

---

## Part 6: Handling Conflicts (When Multiple People Edit Same File)

### If you get a conflict when pulling:

1. **Open the conflicted file** in your editor
2. **Find the conflict markers**:
   ```
   <<<<<<< HEAD
   Your changes
   =======
   Their changes
   >>>>>>> main
   ```

3. **Decide which version to keep** and delete the conflict markers
4. **Save the file** and commit:
   ```powershell
   git add .
   git commit -m "Resolve merge conflict in filename"
   git push origin main
   ```

---

## Part 7: Creating Feature Branches (Optional but Recommended)

### For Larger Features, Use Branches:

```powershell
# Create and switch to new branch
git checkout -b feature/authentication-improvements

# Make your changes and commit
git add .
git commit -m "Improved authentication security"

# Push branch to GitHub
git push -u origin feature/authentication-improvements

# When done, create a Pull Request on GitHub to merge back to main
```

---

## Part 8: Useful Git Commands Reference

```powershell
# View commit history
git log
git log --oneline  # Shorter format

# See current status
git status

# See what changed in a specific file
git diff filename

# Undo changes to a file (before git add)
git checkout filename

# Remove a file from staging (before commit)
git reset filename

# View all branches
git branch -a

# Delete a local branch
git branch -d branch-name

# See who changed what (blame)
git blame filename

# Revert a commit (creates new commit)
git revert commit-hash
```

---

## Part 9: GitHub Best Practices for Your Group

### DO:
- ✅ Pull before starting work (`git pull origin main`)
- ✅ Write clear, descriptive commit messages
- ✅ Commit frequently with logical groups of changes
- ✅ Push your work at the end of each coding session
- ✅ Review code before merging into main
- ✅ Keep the main branch stable and working

### DON'T:
- ❌ Commit node_modules or .env files
- ❌ Force push to main (`git push -f origin main`)
- ❌ Make extremely large commits with unrelated changes
- ❌ Leave uncommitted changes overnight
- ❌ Work on the same file without coordination

---

## Part 10: Setting Up GitHub Collaborators

### In GitHub Repository Settings:

1. Go to your GitHub repository
2. Click **Settings** (top menu)
3. Click **Collaborators and teams** (left sidebar)
4. Click **Add people**
5. Search for each group member's GitHub username
6. Send them the invite link

Group members will receive an email to accept the invitation.

---

## Part 11: Viewing Changes on GitHub

After pushing, you can:

1. **View Commits**: Go to Code > Commits to see all history
2. **Compare Branches**: Use "Compare" to see differences
3. **View Pull Requests**: Monitor all proposed changes
4. **Check Actions**: Automated tests/builds (if configured)

---

## Example Complete Workflow

Here's what a typical day might look like:

```powershell
# Morning (START OF DAY)
git pull origin main  # Get latest changes from team

# Make changes to files...
code src/components/Login.jsx  # Edit files

# Check progress
git status

# Commit your work
git add .
git commit -m "Fix login form validation

- Added email format validation
- Improved error messages
- Added password strength indicator"

# Share with team
git push origin main

# Evening (END OF DAY)
# Make final commits
git add .
git commit -m "Final tweaks to login component"
git push origin main
```

---

## Troubleshooting Common Issues

### Issue: "Permission denied (publickey)"
**Solution**: You need to set up SSH keys with GitHub. Generate SSH key:
```powershell
ssh-keygen -t ed25519 -C "your.email@example.com"
# Then add the public key to GitHub Settings > SSH and GPG keys
```

### Issue: "Your branch is ahead of 'origin/main'"
**Solution**: Your commits aren't pushed yet:
```powershell
git push origin main
```

### Issue: "Merge conflict"
**Solution**: Follow Part 6 above to resolve conflicts manually

### Issue: "fatal: not a git repository"
**Solution**: You're not in a git initialized folder:
```powershell
cd c:\Users\Miguel\Documents\real_estate_internship_group4
git init
```

---

## Summary of Authentication Implementation

Your system now has:

✅ **Backend Features**:
- Express-session middleware for session management
- bcryptjs for password hashing
- Login endpoint (`POST /api/login`)
- Logout endpoint (`POST /api/logout`)
- Protected user endpoint (`GET /api/current-user`)
- Session credentials support (cookies)

✅ **Frontend Features**:
- Login component with email/password form
- Signup component with validation
- Dashboard showing authenticated user info
- Session persistence across page reloads
- Logout functionality
- Blue and white CSS theme

✅ **Security**:
- Passwords are hashed before storage
- Sessions are httpOnly and sameSite protected
- Session timeout after 24 hours
- CORS configured for your frontend domain

---

## Next Steps

1. **One person**: Set up GitHub repository (Part 1)
2. **Everyone**: Clone the repository and install dependencies (Part 4)
3. **Daily**: Follow the workflow in Part 5
4. **As needed**: Use feature branches for larger features (Part 7)

---

## Need Help?

- **GitHub Docs**: https://docs.github.com
- **Git Cheatsheet**: https://git-scm.com/docs
- **Resolve Conflicts**: https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/addressing-merge-conflicts/resolving-a-merge-conflict-on-github

Good luck with your real estate project! 🚀
