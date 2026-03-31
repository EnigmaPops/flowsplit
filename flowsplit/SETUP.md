# FlowSplit — Setup Guide

Follow these steps to get your app live. Takes about 15–20 minutes total.

---

## STEP 1 — Create a GitHub account (skip if you have one)

1. Go to https://github.com
2. Click "Sign up" — use any email
3. Verify your email

---

## STEP 2 — Create a new GitHub repository

1. Once logged in, click the **+** icon top right → "New repository"
2. Name it: `flowsplit`
3. Set it to **Public**
4. Click **"Create repository"**

---

## STEP 3 — Upload the code files

GitHub has a simple drag-and-drop uploader.

1. On your new repo page, click **"uploading an existing file"** (the link in the middle of the page)
2. Open the `flowsplit` folder I gave you
3. You need to upload files **maintaining the folder structure**. Do it in this order:

**First upload** — drag in these files from the root of the folder:
- `package.json`

Click **"Commit changes"**

**Second upload** — click "Add file" → "Upload files" again, then:
- Go into the `public` folder and drag `index.html`
- GitHub will ask where to put it — type `public/index.html`

**Easier method** — use GitHub Desktop app:
1. Download https://desktop.github.com
2. Sign in with your GitHub account
3. Clone your new `flowsplit` repo to your computer
4. Copy all the files from the folder I gave you into the cloned folder (keeping the same structure)
5. In GitHub Desktop, click "Commit to main" then "Push origin"

**The folder structure should look like this on GitHub:**
```
flowsplit/
├── package.json
├── public/
│   └── index.html
└── src/
    ├── index.js
    ├── index.css
    ├── App.jsx
    ├── hooks/
    │   └── useStore.js
    ├── utils/
    │   ├── calc.js
    │   └── format.js
    └── components/
        ├── UI.jsx
        ├── Header.jsx
        ├── IncomeCard.jsx
        ├── GoalRow.jsx
        ├── PriorityGroup.jsx
        ├── ResultsGrid.jsx
        ├── BudgetTab.jsx
        ├── DashboardTab.jsx
        ├── HistoryTab.jsx
        └── QuickSplitTab.jsx
```

---

## STEP 4 — Deploy on Vercel (free hosting)

1. Go to https://vercel.com
2. Click **"Sign up"** → choose **"Continue with GitHub"**
3. Authorize Vercel to access your GitHub
4. On the Vercel dashboard, click **"Add New Project"**
5. Find your `flowsplit` repo and click **"Import"**
6. Vercel will auto-detect it as a React app — don't change any settings
7. Click **"Deploy"**

Wait about 2 minutes. Vercel will build and deploy your app.

---

## STEP 5 — Get your link

Once deployed, Vercel gives you a link like:
```
https://flowsplit-yourname.vercel.app
```

That's your app! Share it with friends — they open it in any browser on any device.

---

## STEP 6 — Custom domain (optional, still free)

If you want a cleaner link like `flowsplit.vercel.app`:
1. In Vercel, go to your project → Settings → Domains
2. Type your preferred domain and Vercel will try to assign it

---

## Future updates

Whenever you want to update the app:
1. Make changes to the files
2. Push to GitHub (via GitHub Desktop or drag-drop upload)
3. Vercel automatically redeploys — usually takes under a minute

---

## Need help?

If you get stuck on any step, take a screenshot and send it — I'll walk you through it.
