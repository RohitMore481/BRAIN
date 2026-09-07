# Git Repository Initialization & Hosting Instructions

Follow these instructions to initialize and push the **BRAIN** repository to GitHub or any remote Git server.

## Step 1: Initialize Git Repository

Open your terminal in the root directory of the project and run:

```bash
git init
```

## Step 2: Add Files to Staging

Stage all files in the project. The `.gitignore` file will automatically filter out build artifacts, virtual environments, datasets, and binary model files:

```bash
git add .
```

## Step 3: Commit the Initial Release

Create the initial commit with a descriptive message:

```bash
git commit -m "Initial release of BRAIN framework"
```

## Step 4: Rename Default Branch to Main

Ensure the default branch is named `main`:

```bash
git branch -M main
```

## Step 5: Link Remote Repository

Replace `repository_url` with your GitHub repository URL (e.g., `https://github.com/your-organization/BRAIN.git`):

```bash
git remote add origin repository_url
```

## Step 6: Push to Remote Repository

Push the repository to GitHub:

```bash
git push -u origin main
```
