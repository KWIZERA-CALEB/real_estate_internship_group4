# GitHub Commands Quick Reference

## Fast Setup (Copy & Paste)

### ONE TIME: Initial Repository Setup
```powershell
# Navigate to your project
cd c:\Users\Miguel\Documents\real_estate_internship_group4

# Initialize git (ONE TIME ONLY)
git init

# Configure your git info
git config user.name "Your Name"
git config user.email "your.email@example.com"

# Add remote repository (replace URL with your GitHub repo URL)
git remote add origin https://github.com/YOURUSERNAME/real_estate_internship_group4.git

# Set main branch
git branch -M main
```

### FIRST PUSH: Add All Files & Push to GitHub
```powershell
# From root directory: c:\Users\Miguel\Documents\real_estate_internship_group4

# Stage all files
git add .

# Create first commit
git commit -m "Initial commit: Session-based authentication system

- Implemented express-session with bcryptjs password hashing
- Created Login/Signup components with blue/white styling
- Protected Dashboard component with session verification
- Added logout functionality
- All original functionality preserved
- Ready for group collaboration"

# Push to GitHub
git push -u origin main
```

---

## Daily Workflow Commands

### MORNING: Get Latest Code
```powershell
git pull origin main
```

### EVENING: Save Your Changes
```powershell
# See what changed
git status

# Stage everything
git add .

# Commit with message
git commit -m "Describe what you changed"

# Push to GitHub
git push origin main
```

---

## Common Scenarios

### Scenario 1: Only Some Files Changed
```powershell
git add path/to/specific/file.jsx
git commit -m "Updated specific file"
git push origin main
```

### Scenario 2: Check Before Committing
```powershell
# See what's different
git diff

# See only staged changes
git diff --staged

# See what you'll commit
git status
```

### Scenario 3: Undo Last Commit (Haven't Pushed Yet)
```powershell
git reset --soft HEAD~1
# Now make changes and commit again
```

### Scenario 4: See Commit History
```powershell
git log

# Short version
git log --oneline

# Show last 5 commits
git log -5

# Show changes in last commit
git show HEAD
```

### Scenario 5: Create Feature Branch
```powershell
# Create new branch
git checkout -b feature/new-feature

# Make changes
git add .
git commit -m "Work on new feature"

# Push branch
git push -u origin feature/new-feature

# When done, switch back to main
git checkout main
git pull origin main
```

### Scenario 6: Merge Conflict Resolution
```powershell
# You got a conflict when pulling
git pull origin main

# Edit the conflicted file in VS Code
# Look for: <<<<<<< HEAD ... ======= ... >>>>>>> main
# Keep what you want, delete conflict markers

# After fixing
git add .
git commit -m "Resolve merge conflict"
git push origin main
```

### Scenario 7: See Differences Between Versions
```powershell
# Changes since last push
git diff origin/main

# Changes in specific file
git diff origin/main -- path/to/file.js

# Between two commits
git diff commit1 commit2

# What's in current branch vs another
git diff main feature/new-feature
```

---

## File-Specific Commands

### Check Who Changed a File
```powershell
git blame path/to/file.jsx
```

### See File Change History
```powershell
git log path/to/file.jsx
```

### View Old Version of File
```powershell
git show HEAD~1:path/to/file.jsx
```

### Restore Deleted File
```powershell
git restore path/to/file.jsx
```

---

## Branch Management

### See All Branches
```powershell
# Local only
git branch

# With remote
git branch -a

# Recently used
git branch -v
```

### Switch Branches
```powershell
git checkout branch-name
git switch branch-name  # Newer syntax
```

### Create and Switch to New Branch
```powershell
git checkout -b feature/name
git switch -c feature/name  # Newer syntax
```

### Delete Local Branch
```powershell
git branch -d branch-name
git branch -D branch-name  # Force delete
```

### Delete Remote Branch
```powershell
git push origin --delete branch-name
```

### Rename Branch
```powershell
# Rename current branch
git branch -m new-name

# Rename different branch
git branch -m old-name new-name
```

---

## Stashing (Temporary Save)

### Save Work Without Committing
```powershell
# Save current changes
git stash

# List saved stashes
git stash list

# Apply most recent stash
git stash pop

# Apply specific stash
git stash apply stash@{0}

# Delete a stash
git stash drop stash@{0}
```

---

## Remote Repository Commands

### See Remote Info
```powershell
git remote -v
```

### Add Different Remote
```powershell
git remote add upstream https://github.com/original/repo.git
```

### Remove Remote
```powershell
git remote remove origin
```

### Change Remote URL
```powershell
git remote set-url origin https://new-url.git
```

### Fetch Without Merging
```powershell
git fetch origin
```

---

## Rewriting History (Advanced)

### Undo Last Commit (Keep Changes)
```powershell
git reset --soft HEAD~1
```

### Undo Last Commit (Discard Changes)
```powershell
git reset --hard HEAD~1
```

### Change Last Commit Message
```powershell
git commit --amend -m "New message"

# Without changing content
git commit --amend --no-edit
```

### Rebase Commits (Clean History)
```powershell
# Last 3 commits
git rebase -i HEAD~3

# Then mark what to do (edit, squash, reorder)
```

---

## Troubleshooting Commands

### Check Status
```powershell
git status
```

### See All Changes (Staged & Unstaged)
```powershell
git diff HEAD
```

### Verify Repository
```powershell
git fsck --full
```

### Check Git Configuration
```powershell
git config --list
```

### Clean Up (Remove Untracked Files)
```powershell
# See what would be deleted
git clean -n

# Actually delete
git clean -fd
```

---

## Collaboration Commands

### Update Your Branch with Main
```powershell
git fetch origin
git rebase origin/main
# or
git merge origin/main
```

### See What's On Main vs Your Branch
```powershell
git log origin/main..HEAD  # What you added
git log HEAD..origin/main  # What main has that you don't
```

### See Contributors
```powershell
git shortlog -s -n
```

---

## Configuration

### Set Global Config
```powershell
git config --global user.name "Your Name"
git config --global user.email "email@example.com"

# View all global config
git config --global --list
```

### Set Local Config (This Project Only)
```powershell
git config user.name "Different Name"
git config user.email "different@example.com"
```

### Configure Default Editor
```powershell
git config --global core.editor "code"  # VS Code
```

---

## Quick Decision Tree

**I want to...**

- **Push my changes to GitHub**: `git add .` → `git commit -m "msg"` → `git push origin main`
- **Get latest code from team**: `git pull origin main`
- **See what I changed**: `git status` or `git diff`
- **Undo my changes**: `git checkout .` or `git restore .`
- **View history**: `git log --oneline`
- **Create feature branch**: `git checkout -b feature/name`
- **Fix a merge conflict**: Edit file, `git add .`, `git commit -m "msg"`, `git push`
- **See who changed a line**: `git blame file.jsx`
- **Revert to old version**: `git reset --hard commit-hash`

---

## Emergency Commands

### "I broke everything, help!"
```powershell
# See what you had
git reflog

# Go back to a previous state
git reset --hard HEAD@{number}
```

### "I accidentally deleted a file"
```powershell
git restore path/to/file.jsx
# or
git checkout HEAD -- path/to/file.jsx
```

### "I committed to wrong branch"
```powershell
# Get the commit hash from git log
git log

# Go to correct branch
git checkout correct-branch

# Cherry-pick the commit
git cherry-pick commit-hash

# Go back to wrong branch
git checkout wrong-branch

# Undo the commit
git reset --hard HEAD~1
```

---

## Cheat Sheet Template

**Every Morning**:
```powershell
git pull origin main
```

**After Making Changes**:
```powershell
git add .
git commit -m "What I did"
git push origin main
```

**Before Bed**:
```powershell
git push origin main
```

---

## Resources

- **GitHub Docs**: https://docs.github.com
- **Git Cheatsheet**: https://git-scm.com/docs
- **Interactive Practice**: https://learngitbranching.js.org

---

**Print this file or bookmark it for quick reference! 📌**
