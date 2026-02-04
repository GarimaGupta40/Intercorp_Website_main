Intercorp Website 🌐
A web application built using Node.js, Express, MySQL and Vite with cloud deployment on Render + Railway.

🔗 Live Website:
https://intercorp-website-main.onrender.com/
------------------------------------------------------------

PROJECT OVERVIEW

The Intercorp Website is a web application built using Node.js and Express
for the backend, MySQL for database management, and a Vite-based frontend.

The project was initially implemented using JSON file-based storage and was later
fully migrated to MySQL to improve scalability, data consistency, and reliability.

------------------------------------------------------------

🧰 Tech Stack
Frontend
HTML
CSS
JavaScript
Vite

Backend
Node.js
Express.js
mysql2 (Promise based)
Database
MySQL (Railway Cloud)

Tools
Git & GitHub
Render (Deployment)
Railway (Database Hosting)

------------------------------------------------------------

✨ Features

Product listing & category filtering
User accounts
Cart system (persistent)
Wishlist system
Order placement
Admin activity logs
Admin notifications
REST APIs
Cloud database storage
Fully deployed full-stack app JSON file storage completely removed

------------------------------------------------------------

PROJECT STRUCTURE

Intercorp_Website_main/
│
├── db/
│   └── schema.sql        Database schema
│
├── public/               Static assets
├── server.js             Express backend server
├── index.html            Frontend entry file
├── package.json
├── README.md

------------------------------------------------------------

DEPLOYING ON RENDER (Quick setup) 🚀

1. Create a new Web Service in Render and connect your GitHub repository.
2. Set the **Build Command** to:

   npm run build

3. Set the **Start Command** to:

   npm run server

4. In Render's **Environment** section, add these environment variables (replace values):

   - **DB_HOST**: your-render-db-host
   - **DB_PORT**: 3306
   - **DB_USER**: your_db_user
   - **DB_PASSWORD**: your_db_password
   - **DB_NAME**: intercorp1
   - **PORT**: 5002

5. (Optional) If using Render's managed MySQL, use its provided host/port/user/password.

6. Deploy. The backend will connect to the MySQL instance and the server will serve the built frontend (`dist`) on the same domain.

Notes:
- We intentionally use environment variables at runtime (no .env in production). This is standard and secure on Render.
- If the DB is unreachable, the server will attempt to serve local `src/data/*.json` as a read-only fallback.

IMPORTANT: Startup validation
- The server will not abort startup when DB environment variables are missing. Local MySQL credentials (host: `127.0.0.1`, port: `3306`, user: `root`, password: ``, database: `intercorp1`) are used by default for local development.
- For production or custom deployments, set `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, and `DB_NAME` as needed; the server will still start even if they are not provided.

------------------------------------------------------------

------------------------------------------------------------

DATABASE SETUP (LOCAL)

1. Open XAMPP Control Panel
2. Start MySQL
3. Open phpMyAdmin
4. Create a database named "intercorp1"
5. Import the schema from db/schema.sql

------------------------------------------------------------

RUN THE PROJECT LOCALLY

1. Install dependencies:
   npm install

2. Ensure MySQL is running via XAMPP

3. Start the backend server:
   node server.js

Backend will run on:
http://localhost:5002

------------------------------------------------------------

SAMPLE API ENDPOINTS

GET  /api/products
GET  /api/users
GET  /api/cart
POST /api/cart
GET  /api/orders
GET  /api/wishlist

------------------------------------------------------------

SECURITY NOTES

- By default this project uses local MySQL credentials for development (host: `127.0.0.1`, user: `root`, password: ``, database: `intercorp1`).
- You can override these by setting DB_* environment variables in production; the server will still start without them.
- MySQL is the single source of truth

------------------------------------------------------------

AUTHOR

Garima Gupta
GitHub: https://github.com/GarimaGupta40

------------------------------------------------------------

LICENSE

This project is intended for learning and development purposes only.
