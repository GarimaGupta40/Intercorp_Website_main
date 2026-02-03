Intercorp Website 🌐
A Web Application using Node.js, Express, MySQL, and Vite

------------------------------------------------------------

PROJECT OVERVIEW

The Intercorp Website is a web application built using Node.js and Express
for the backend, MySQL for database management, and a Vite-based frontend.

The project was initially implemented using JSON file-based storage and was later
fully migrated to MySQL to improve scalability, data consistency, and reliability.

------------------------------------------------------------

TECH STACK

Frontend
- HTML
- CSS
- JavaScript
- Vite

Backend
- Node.js
- Express.js
- MySQL
- mysql2 (promise-based)

Database
- MySQL
- phpMyAdmin

Tools
- Git
- GitHub
- XAMPP (Local MySQL)

------------------------------------------------------------

FEATURES

- Product management
- User management
- Cart functionality
- Wishlist functionality
- Order management
- Admin activity and notifications
- RESTful APIs
- Persistent MySQL-based storage
- JSON file storage completely removed

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

ENVIRONMENT VARIABLES

DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=intercorp1
PORT=5002

Note:
Do not commit the .env file to GitHub.

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
- In production the server will abort startup if any required DB environment variables are missing: `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_NAME`.
- This prevents the app from returning HTML error responses that the frontend would otherwise try to parse as JSON (causing "Unexpected token '<'" errors).

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

- Database credentials are handled using environment variables
- No sensitive data is hardcoded
- MySQL is the single source of truth

------------------------------------------------------------

AUTHOR

Garima Gupta
GitHub: https://github.com/GarimaGupta40

------------------------------------------------------------

LICENSE

This project is intended for learning and development purposes only.
