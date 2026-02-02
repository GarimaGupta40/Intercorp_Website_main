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

Create a .env file in the root directory and add the following:

DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=intercorp1
PORT=5002

Note:
Do not commit the .env file to GitHub.

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
