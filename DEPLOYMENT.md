# EVOK Lead Tracker - Deployment Guide

## Quick Deployment Steps

### 1. MongoDB Atlas Setup (5 minutes)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Create free account
3. Create a **FREE** M0 cluster
4. Click "Connect" → "Connect your application"
5. Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)
6. Replace `<password>` with your actual password
7. Add `/evok-leads` at the end: `mongodb+srv://username:password@cluster.mongodb.net/evok-leads`

### 2. Deploy Backend to Render (10 minutes)

1. Go to [Render.com](https://render.com/) and sign up
2. Click "New +" → "Web Service"
3. Connect your GitHub repository (or use "Public Git repository")
4. Configure:
   - **Name**: `evok-lead-tracker-api`
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add Environment Variables:
   - `MONGODB_URI`: (paste your MongoDB Atlas connection string)
   - `NODE_ENV`: `production`
   - `CLIENT_URL`: (we'll update this after frontend deployment)
6. Click "Create Web Service"
7. **Copy the deployed URL** (e.g., `https://evok-lead-tracker-api.onrender.com`)

### 3. Deploy Frontend to Render (5 minutes)

1. In Render dashboard, click "New +" → "Static Site"
2. Connect same repository
3. Configure:
   - **Name**: `evok-lead-tracker`
   - **Root Directory**: (leave empty)
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. Add Environment Variable:
   - `VITE_API_URL`: `https://your-backend-url.onrender.com/api`
5. Click "Create Static Site"

### 4. Update Backend CORS

1. Go back to your backend service in Render
2. Update `CLIENT_URL` environment variable with your frontend URL
3. Save and redeploy

## Alternative: Deploy Frontend to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd "c:\Users\xstre\Desktop\lead tracker"
vercel

# Follow prompts, set VITE_API_URL when asked
```

## Testing Deployment

1. Visit your frontend URL
2. Try adding a new lead
3. Check if data persists after refresh
4. Test status changes and activity logs

## Troubleshooting

**Backend not connecting to MongoDB:**
- Check MongoDB Atlas → Network Access → Add IP Address → Allow from Anywhere (0.0.0.0/0)
- Verify connection string has correct password and database name

**Frontend can't reach backend:**
- Check CORS settings in backend
- Verify VITE_API_URL is correct
- Check browser console for errors

**Free tier limitations:**
- Render free tier: Services sleep after 15 min of inactivity (first request may be slow)
- MongoDB Atlas free tier: 512MB storage

## Environment Variables Summary

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/evok-leads
NODE_ENV=production
CLIENT_URL=https://your-frontend-url.onrender.com
```

### Frontend (.env)
```
VITE_API_URL=https://your-backend-url.onrender.com/api
```
