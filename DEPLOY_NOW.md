# Deploy EVOK Lead Tracker to Render - Step by Step

## You're Here: Render Account Created ✅

Follow these steps exactly:

---

## Step 1: Push Code to GitHub (5 minutes)

### Option A: Using GitHub Desktop (Easiest)
1. Download GitHub Desktop:     
2. Open GitHub Desktop
3. Click "Add" → "Add Existing Repository"
4. Browse to: `C:\Users\xstre\Desktop\lead tracker`
5. Click "Publish repository"
6. Name it: `evok-lead-tracker`
7. Uncheck "Keep this code private" (or keep private, your choice)
8. Click "Publish repository"

### Option B: Using Git Command Line
```bash
cd "C:\Users\xstre\Desktop\lead tracker"
git init
git add .
git commit -m "Initial commit - EVOK Lead Tracker"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/evok-lead-tracker.git
git push -u origin main
```

---

## Step 2: Deploy Backend to Render (10 minutes)

1. Go to https://dashboard.render.com/
2. Click **"New +"** → **"Web Service"**
3. Click **"Connect a repository"** (or use Public Git Repository)
4. Select your `evok-lead-tracker` repository
5. Configure:
   - **Name**: `evok-lead-tracker-api`
   - **Region**: Choose closest to you
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

6. **Environment Variables** - Click "Add Environment Variable" for each:
   ```
   MONGODB_URI = mongodb+srv://evokcompany38_db_user:GhJcvkdGH1kktBWs@evokcompany.9tjeotg.mongodb.net/evok-leads
   NODE_ENV = production
   PORT = 5000
   CLIENT_URL = https://evok-lead-tracker.onrender.com
   ```
   (We'll update CLIENT_URL after frontend deployment)

7. Click **"Create Web Service"**
8. Wait 5-10 minutes for deployment
9. **Copy your backend URL** (e.g., `https://evok-lead-tracker-api.onrender.com`)

---

## Step 3: Update MongoDB Atlas Network Access

1. Go to MongoDB Atlas: https://cloud.mongodb.com/
2. Click "Network Access" (left sidebar)
3. Click "Add IP Address"
4. Click "Allow Access from Anywhere" (0.0.0.0/0)
5. Click "Confirm"

---

## Step 4: Deploy Frontend to Render (5 minutes)

1. In Render dashboard, click **"New +"** → **"Static Site"**
2. Select same `evok-lead-tracker` repository
3. Configure:
   - **Name**: `evok-lead-tracker`
   - **Root Directory**: (leave empty)
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

4. **Environment Variable**:
   ```
   VITE_API_URL = https://evok-lead-tracker-api.onrender.com/api
   ```
   (Use YOUR backend URL from Step 2)

5. Click **"Create Static Site"**
6. Wait 3-5 minutes for deployment
7. **Copy your frontend URL** (e.g., `https://evok-lead-tracker.onrender.com`)

---

## Step 5: Update Backend CORS

1. Go back to your **backend service** in Render
2. Click "Environment"
3. Update `CLIENT_URL` to your frontend URL
4. Click "Save Changes"
5. Service will auto-redeploy (2-3 minutes)

---

## Step 6: Test Your Live App! 🎉

1. Visit your frontend URL
2. Try adding a lead
3. Change a status
4. Refresh the page - data should persist!

---

## Troubleshooting

**Backend won't start:**
- Check MongoDB Atlas Network Access allows 0.0.0.0/0
- Verify MONGODB_URI is correct in Render environment variables

**Frontend can't connect to backend:**
- Check VITE_API_URL in frontend environment variables
- Verify backend is deployed and running
- Check browser console for CORS errors

**Free tier notes:**
- Services sleep after 15 min of inactivity
- First request after sleep takes 30-60 seconds
- 512MB MongoDB storage limit

---

## Your URLs (fill these in as you deploy):

- **Backend API**: `https://_____________________.onrender.com`
- **Frontend App**: `https://_____________________.onrender.com`
- **MongoDB**: `evokcompany.9tjeotg.mongodb.net` ✅

---

Need help? Check the logs in Render dashboard under "Logs" tab.
