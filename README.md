# EVOK Lead Tracker

Full-stack lead management application for EV charging network expansion.

## Tech Stack
- **Frontend**: React + Vite
- **Backend**: Node.js + Express
- **Database**: MongoDB Atlas
- **Deployment**: Render.com

## Features
- Lead management with CRUD operations
- Activity log tracking for status changes
- Dashboard with visual analytics
- Real-time statistics
- Glassmorphism UI design

## Local Development

### Prerequisites
- Node.js 16+
- MongoDB Atlas account (or local MongoDB)

### Setup

1. **Install dependencies**
```bash
# Frontend
npm install

# Backend
cd server
npm install
```

2. **Configure environment variables**

Frontend `.env`:
```
VITE_API_URL=http://localhost:5000/api
```

Backend `server/.env`:
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

3. **Run the application**

Terminal 1 (Backend):
```bash
cd server
npm run dev
```

Terminal 2 (Frontend):
```bash
npm run dev
```

Visit `http://localhost:5173`

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## Project Structure

```
lead-tracker/
├── src/                    # React frontend
│   ├── services/          # API service layer
│   ├── App.jsx           # Main component
│   └── App.css           # Styles
├── server/                # Node.js backend
│   ├── config/           # Database config
│   ├── models/           # Mongoose schemas
│   ├── routes/           # API routes
│   ├── controllers/      # Business logic
│   └── middleware/       # Express middleware
└── public/               # Static assets
```

## License

MIT
