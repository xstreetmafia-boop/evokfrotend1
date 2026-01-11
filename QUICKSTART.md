# Quick Start: Testing Locally

Before deploying, let's test the full-stack app locally.

## Step 1: Start MongoDB

**Option A: MongoDB Atlas (Recommended - No local install needed)**
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create free account
3. Create FREE M0 cluster
4. Get connection string
5. Update `server/.env`:
   ```
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/evok-leads
   ```

**Option B: Local MongoDB**
- If you have MongoDB installed locally, the default connection string in `server/.env` will work

## Step 2: Start Backend

```bash
cd server
npm run dev
```

You should see: `Server running in development mode on port 5000`

## Step 3: Start Frontend

Open a NEW terminal:

```bash
cd "c:\Users\xstre\Desktop\lead tracker"
npm run dev
```

## Step 4: Test the App

1. Open browser to `http://localhost:5173`
2. Try adding a new lead
3. Change a lead's status
4. Refresh the page - data should persist!

## Troubleshooting

**"Failed to load leads"**
- Make sure backend is running on port 5000
- Check `server/.env` has correct MONGODB_URI
- Check MongoDB Atlas Network Access allows your IP

**Backend won't start**
- Run `cd server && npm install` again
- Check if port 5000 is already in use

## Ready to Deploy?

See `DEPLOYMENT.md` for full deployment guide to Render.com!
