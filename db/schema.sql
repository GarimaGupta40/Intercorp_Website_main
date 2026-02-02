-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(50) PRIMARY KEY,
    customerName VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    pincode VARCHAR(20),
    items JSON,
    total DECIMAL(10, 2),
    discount DECIMAL(10, 2),
    paymentMethod VARCHAR(50),
    status VARCHAR(50),
    date DATETIME
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255),
    category VARCHAR(100),
    price DECIMAL(10, 2),
    stock INT DEFAULT 0,
    expiryDate DATE,
    image VARCHAR(255),
    description TEXT,
    rating DECIMAL(3, 2) DEFAULT 5.0,
    addedBy VARCHAR(100),
    addedAt DATETIME,
    status VARCHAR(50) DEFAULT 'active'
);

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    role VARCHAR(20) DEFAULT 'user',
    createdAt DATETIME
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
    reviewId VARCHAR(50) PRIMARY KEY,
    productId VARCHAR(50),
    userId VARCHAR(255),
    userName VARCHAR(255),
    rating INT,
    comment TEXT,
    date DATETIME,
    FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE
);

-- Customers table (profiles/summaries)
CREATE TABLE IF NOT EXISTS customers (
    email VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255),
    phone VARCHAR(20),
    joinedAt DATETIME,
    lastOrder DATETIME,
    totalOrders INT DEFAULT 0,
    orderHistory JSON
);

-- Admin Activity table
CREATE TABLE IF NOT EXISTS admin_activity (
    id VARCHAR(50) PRIMARY KEY,
    type VARCHAR(50),
    message TEXT,
    timestamp DATETIME,
    icon VARCHAR(50)
);

-- Admin Notifications table
CREATE TABLE IF NOT EXISTS admin_notifications (
    id VARCHAR(50) PRIMARY KEY,
    type VARCHAR(50),
    message TEXT,
    timestamp DATETIME,
    `read` BOOLEAN DEFAULT FALSE
);

-- Wishlist table
CREATE TABLE IF NOT EXISTS wishlist (
    userId VARCHAR(255),
    productId VARCHAR(50),
    addedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (userId, productId),
    FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE
);

-- Cart table (for persistent carts)
CREATE TABLE IF NOT EXISTS cart (
    userId VARCHAR(255),
    productId VARCHAR(50),
    quantity INT DEFAULT 1,
    PRIMARY KEY (userId, productId),
    FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE
);

--Added Products table
CREATE TABLE added_products (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255),
  category VARCHAR(100),
  price DECIMAL(10,2),
  stock INT DEFAULT 0,
  expiryDate DATE,
  image VARCHAR(255),
  description TEXT,
  addedBy VARCHAR(50) DEFAULT 'admin',
  addedAt DATETIME,
  status VARCHAR(20) DEFAULT 'active'
);



