# Intercorp Precision

## Overview
An e-commerce nutrition products website built with React (Vite) frontend and Express.js backend. The application provides nutrition solutions across human health, animal feed, and consumer products.

## Project Structure
```
├── src/                    # React frontend source
│   ├── data/              # JSON data files (fallback for DB)
│   └── utils/             # Utility functions
├── db/                     # Database configuration
│   └── db.js              # MySQL pool setup
├── public/                 # Static assets
├── server.js              # Express backend server
├── vite.config.ts         # Vite configuration
└── package.json           # Dependencies and scripts
```

## Tech Stack
- **Frontend**: React 18, TypeScript, Vite, TailwindCSS
- **Backend**: Express.js 5
- **Database**: MySQL (with JSON fallback when unavailable)
- **Styling**: TailwindCSS, Framer Motion

## Development
- Frontend runs on port 5000 (Vite dev server)
- Backend runs on port 5002 (Express)
- Vite proxies `/api` requests to the backend

## Running Locally
```bash
npm run start          # Start both frontend and backend
npm run dev            # Frontend only
npm run server         # Backend only
npm run build          # Build for production
```

## Notes
- The application gracefully falls back to local JSON files when MySQL database is unavailable
- Products, orders, cart, and wishlist data are served from `src/data/` when DB connection fails
