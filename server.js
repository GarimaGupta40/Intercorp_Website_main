import express from 'express';
import cors from 'cors';
import pool from './db/db.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());

import fs from 'fs/promises';

// Helper to read local JSON data as a fallback when DB is unavailable
async function loadLocalData(file) {
  const candidates = [
    path.join(__dirname, 'src', 'data', `${file}.json`),
    path.join(__dirname, 'data', `${file}.json`),
    path.join(__dirname, 'src', 'data', `${file}.json`) // duplicate to be safe in different build layouts
  ];
  for (const p of candidates) {
    try {
      const txt = await fs.readFile(p, 'utf8');
      return JSON.parse(txt);
    } catch (e) {
      // ignore read/parse errors and try next candidate
    }
  }
  return null;
}


app.get('/api/:file', async (req, res) => {
  try {
    const fileName = req.params.file;

    // Database-backed routes
    if (fileName === 'orders') {
      const [rows] = await pool.execute('SELECT * FROM orders');
      const formattedRows = rows.map(order => ({
        ...order,
        items: typeof order.items === 'string' ? JSON.parse(order.items) : order.items
      }));
      return res.json(formattedRows);
    }

    if (fileName === 'products') {
      const [rows] = await pool.execute('SELECT * FROM products');
      return res.json(rows);
    }

    if (fileName === 'users') {
      const [rows] = await pool.execute('SELECT * FROM users');
      return res.json(rows);
    }

    if (fileName === 'reviews') {
      const [rows] = await pool.execute('SELECT * FROM reviews');
      return res.json(rows);
    }

    if (fileName === 'customer') {
      const [rows] = await pool.execute('SELECT * FROM customers');
      const formattedRows = rows.map(customer => ({
        ...customer,
        orderHistory: typeof customer.orderHistory === 'string' ? JSON.parse(customer.orderHistory) : (customer.orderHistory || [])
      }));
      return res.json(formattedRows);
    }

    if (fileName === 'admin_activity') {
      const [rows] = await pool.execute('SELECT * FROM admin_activity ORDER BY timestamp DESC');
      return res.json(rows);
    }

    if (fileName === 'admin_notifications') {
      const [rows] = await pool.execute('SELECT * FROM admin_notifications ORDER BY timestamp DESC');
      return res.json(rows);
    }

    if (fileName === 'cart') {
      // Return cart items joined with product details; using a single global cart (userId = 'global') to preserve current behavior
      const [rows] = await pool.execute(
        `SELECT c.productId as id, c.quantity, p.name, p.category, p.price, p.image, p.description, p.rating, p.stock
         FROM cart c JOIN products p ON p.id = c.productId WHERE c.userId = ?`, ['global']
      );
      return res.json(rows.map(r => ({ id: r.id, name: r.name, category: r.category, price: Number(r.price), image: r.image, description: r.description, rating: Number(r.rating), stock: r.stock, quantity: r.quantity })));
    }

    if (fileName === 'wishlist') {
      // Return array of product IDs in wishlist for the global user
      const [rows] = await pool.execute('SELECT productId FROM wishlist WHERE userId = ?', ['global']);
      return res.json(rows.map(r => r.productId));
    }

    return res.status(404).json({ error: 'Data not found' });
  } catch (error) {
    console.error(`Error fetching ${req.params.file}:`, error);

    // If DB is unreachable (e.g., on Render without a managed DB), fall back to local JSON files
    if (error && (error.code === 'ECONNREFUSED' || (error.message && error.message.includes('ECONNREFUSED')))) {
      try {
        const local = await loadLocalData(fileName);
        if (local !== null) {
          console.warn(`Falling back to local data for ${fileName}`);

          // Special-case some endpoints to match previous API shape
          if (fileName === 'cart') {
            // local cart contains items already joined with product details in `src/data/cart.json`
            return res.json(local);
          }

          if (fileName === 'wishlist') {
            return res.json(local);
          }

          return res.json(local);
        }
      } catch (fsErr) {
        console.error('Error reading local fallback data:', fsErr);
      }
    }

    res.status(404).json({ error: 'Data not found' });
  }
});

app.post('/api/:file', async (req, res) => {
  try {
    const fileName = req.params.file;
    const data = req.body;

    if (fileName === 'orders') {
      if (Array.isArray(data)) {
        // Upsert each order
        for (const o of data) {
          await pool.execute(
            `INSERT INTO orders (id, customerName, email, phone, address, pincode, items, total, discount, paymentMethod, status, date)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE customerName=VALUES(customerName), phone=VALUES(phone), address=VALUES(address), pincode=VALUES(pincode), items=VALUES(items), total=VALUES(total), discount=VALUES(discount), paymentMethod=VALUES(paymentMethod), status=VALUES(status), date=VALUES(date)`,
            [
              o.id || o.orderId,
              o.customerName || '',
              o.email || '',
              o.phone || '',
              o.address || '',
              o.pincode || '',
              JSON.stringify(o.items || o.products || []),
              o.total || 0,
              o.discount || 0,
              o.paymentMethod || '',
              o.status || 'Pending',
              o.date || new Date().toISOString()
            ]
          );
        }
        return res.json({ success: true });
      }

      const [result] = await pool.execute(
        `INSERT INTO orders (id, customerName, email, phone, address, pincode, items, total, discount, paymentMethod, status, date) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          data.id || data.orderId,
          data.customerName || '',
          data.email || '',
          data.phone || '',
          data.address || '',
          data.pincode || '',
          JSON.stringify(data.items || data.products || []),
          data.total || 0,
          data.discount || 0,
          data.paymentMethod || '',
          data.status || 'Pending',
          data.date || new Date().toISOString()
        ]
      );
      return res.json({ success: true, insertId: result.insertId });
    }

    if (fileName === 'reviews') {
      if (Array.isArray(data)) {
        for (const r of data) {
          await pool.execute(
            `INSERT INTO reviews (reviewId, productId, userId, userName, rating, comment, date)
             VALUES (?, ?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE rating = VALUES(rating), comment = VALUES(comment), date = VALUES(date)`,
            [r.reviewId, r.productId, r.userId, r.userName, r.rating, r.comment, r.date]
          );
        }
      } else {
        await pool.execute(
          `INSERT INTO reviews (reviewId, productId, userId, userName, rating, comment, date)
           VALUES (?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE rating = VALUES(rating), comment = VALUES(comment), date = VALUES(date)`,
          [data.reviewId, data.productId, data.userId, data.userName, data.rating, data.comment, data.date]
        );
      }
      return res.json({ success: true });
    }

    if (fileName === 'customer') {
      // Bulk update customers from array or single update
      const arr = Array.isArray(data) ? data : [data];
      for (const cust of arr) {
        await pool.execute(
          `INSERT INTO customers (email, name, phone, joinedAt, lastOrder, totalOrders, orderHistory)
           VALUES (?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE 
           name = VALUES(name), phone = VALUES(phone), lastOrder = VALUES(lastOrder), 
           totalOrders = VALUES(totalOrders), orderHistory = VALUES(orderHistory)`,
          [cust.email, cust.name, cust.phone || '', cust.joinedAt || null, cust.lastOrder || null, cust.totalOrders || 0, JSON.stringify(cust.orderHistory || [])]
        );
      }
      return res.json({ success: true });
    }

    if (fileName === 'users') {
      const arr = Array.isArray(data) ? data : [data];
      for (const u of arr) {
        await pool.execute(
          `INSERT INTO users (id, name, email, password, role, createdAt)
           VALUES (?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE name = VALUES(name), password = VALUES(password), role = VALUES(role), createdAt = VALUES(createdAt)`,
          [u.id || null, u.name || null, u.email, u.password || null, u.role || 'user', u.createdAt || new Date().toISOString()]
        );
      }
      return res.json({ success: true });
    }

    if (fileName === 'products') {
      const arr = Array.isArray(data) ? data : [data];
      for (const p of arr) {
        await pool.execute(
          `INSERT INTO products (id, name, category, price, stock, expiryDate, image, description, rating, addedBy, addedAt, status)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE name = VALUES(name), category = VALUES(category), price = VALUES(price), stock = VALUES(stock), expiryDate = VALUES(expiryDate), image = VALUES(image), description = VALUES(description), rating = VALUES(rating), status = VALUES(status)`,
          [p.id, p.name, p.category, p.price || 0, p.stock || 0, p.expiryDate || null, p.image || null, p.description || null, p.rating || 5.0, p.addedBy || null, p.addedAt || null, p.status || 'active']
        );
      }
      return res.json({ success: true });
    }

    if (fileName === 'cart') {
      if (!Array.isArray(data)) return res.status(400).json({ error: 'Expected array' });
      // Using a single "global" cart to preserve current behavior
      await pool.execute('DELETE FROM cart WHERE userId = ?', ['global']);
      for (const item of data) {
        await pool.execute(
          `INSERT INTO cart (userId, productId, quantity) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE quantity = VALUES(quantity)`,
          ['global', item.id, item.quantity || 1]
        );
      }
      return res.json({ success: true });
    }

    if (fileName === 'wishlist') {
      if (!Array.isArray(data)) return res.status(400).json({ error: 'Expected array' });
      await pool.execute('DELETE FROM wishlist WHERE userId = ?', ['global']);
      for (const pid of data) {
        await pool.execute(`INSERT INTO wishlist (userId, productId) VALUES (?, ?) ON DUPLICATE KEY UPDATE addedAt = NOW()`, ['global', pid]);
      }
      return res.json({ success: true });
    }

    if (fileName === 'admin_notifications') {
      const arr = Array.isArray(data) ? data : [data];
      for (const n of arr) {
        await pool.execute(
          `INSERT INTO admin_notifications (id, type, message, timestamp, ` + "`read`" + `) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE message = VALUES(message), timestamp = VALUES(timestamp), ` + "`read`" + ` = VALUES(` + "`read`" + `)`,
          [n.id, n.type, n.message, n.timestamp || new Date().toISOString(), n.read ? 1 : 0]
        );
      }
      return res.json({ success: true });
    }

    if (fileName === 'admin_activity') {
      const arr = Array.isArray(data) ? data : [data];
      for (const a of arr) {
        await pool.execute(
          `INSERT INTO admin_activity (id, type, message, timestamp, icon) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE message = VALUES(message), timestamp = VALUES(timestamp), icon = VALUES(icon)`,
          [a.id, a.type, a.message, a.timestamp || new Date().toISOString(), a.icon || null]
        );
      }
      return res.json({ success: true });
    }

    if (fileName === 'buy') {
      // buy-now metadata is handled client-side (localStorage); accept requests for compatibility
      return res.json({ success: true });
    }
    return res.status(400).json({ error: 'Unknown data target' });
  } catch (error) {
    console.error(`Error saving ${req.params.file}:`, error);
    res.status(500).json({ error: 'Failed to save data' });
  }
});

app.post('/api/admin/add-product', async (req, res) => {
  try {
    const product = req.body;
    
    const extendedProduct = {
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock || 0,
      expiryDate: product.expiryDate || null,
      image: product.image,
      description: product.description,
      addedBy: product.addedBy || 'admin',
      addedAt: new Date().toISOString(),
      status: product.status || 'active'
    };

    // Store in MySQL products table
    try {
      await pool.execute(
        `INSERT INTO products (id, name, category, price, stock, expiryDate, image, description, addedBy, addedAt, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE 
         name = VALUES(name), category = VALUES(category), price = VALUES(price), stock = VALUES(stock), 
         expiryDate = VALUES(expiryDate), image = VALUES(image), description = VALUES(description), 
         status = VALUES(status)`,
        [
          extendedProduct.id,
          extendedProduct.name,
          extendedProduct.category,
          extendedProduct.price,
          extendedProduct.stock,
          extendedProduct.expiryDate,
          extendedProduct.image,
          extendedProduct.description,
          extendedProduct.addedBy,
          extendedProduct.addedAt,
          extendedProduct.status
        ]
      );
    } catch (dbError) {
      console.error('MySQL Product Insert Error:', dbError);
      // DB failed — do not fallback to file writes anymore
      return res.status(500).json({ error: 'Failed to add product to database' });
    }

    // No file-based persistence — product is stored in MySQL
    res.set('Cache-Control', 'no-cache');
    res.json({ success: true, product: extendedProduct });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ error: 'Failed to add product' });
  }
});


// Serve static frontend build (if present)
const staticPath = path.join(__dirname, 'dist');
console.log(`Static path: ${staticPath}`);
app.use(express.static(staticPath));

// SPA fallback to index.html for client-side routing (exclude API requests)
app.get(/.*/, (req, res) => {
  if (req.originalUrl.startsWith('/api')) return res.status(404).json({ error: 'Data not found' });
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Startup validation: fail early in production if required DB env vars are missing
const requiredEnv = ['DB_HOST', 'DB_PORT', 'DB_USER', 'DB_NAME'];
const missing = requiredEnv.filter(k => !process.env[k]);
if (missing.length && process.env.NODE_ENV === 'production') {
  console.error(`Missing required environment variables: ${missing.join(', ')}. Aborting startup.`);
  process.exit(1);
}

// Use Render's assigned port when present
const PORT = process.env.PORT || 5002;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});

