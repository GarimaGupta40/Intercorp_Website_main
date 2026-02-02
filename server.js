import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from './db/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());

const DATA_DIR = path.join(__dirname, 'src/data');

const getFilePath = (filename) => {
  if (!filename.endsWith('.json')) filename += '.json';
  return path.join(DATA_DIR, filename);
};

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

    const filePath = getFilePath(fileName);
    const data = await fs.readFile(filePath, 'utf-8');
    res.set('Cache-Control', 'no-cache');
    res.json(JSON.parse(data));
  } catch (error) {
    console.error(`Error fetching ${req.params.file}:`, error);
    res.status(404).json({ error: 'Data not found' });
  }
});

app.post('/api/:file', async (req, res) => {
  try {
    const fileName = req.params.file;
    const data = req.body;

    if (fileName === 'orders') {
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
      await pool.execute(
        `INSERT INTO reviews (reviewId, productId, userId, userName, rating, comment, date)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [data.reviewId, data.productId, data.userId, data.userName, data.rating, data.comment, data.date]
      );
      return res.json({ success: true });
    }

    if (fileName === 'customer') {
      // Bulk update customers from JSON file sync or single update
      if (Array.isArray(data)) {
        for (const cust of data) {
          await pool.execute(
            `INSERT INTO customers (email, name, phone, joinedAt, lastOrder, totalOrders, orderHistory)
             VALUES (?, ?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE 
             name = VALUES(name), phone = VALUES(phone), lastOrder = VALUES(lastOrder), 
             totalOrders = VALUES(totalOrders), orderHistory = VALUES(orderHistory)`,
            [cust.email, cust.name, cust.phone || '', cust.joinedAt || null, cust.lastOrder || null, cust.totalOrders || 0, JSON.stringify(cust.orderHistory || [])]
          );
        }
      }
      return res.json({ success: true });
    }

    const filePath = getFilePath(fileName);
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    res.set('Cache-Control', 'no-cache');
    res.json({ success: true });
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
      // Fallback to JSON if DB fails during migration period
    }

    const addedProductsPath = getFilePath('added_products');
    const productsPath = getFilePath('products');

    let addedProducts = [];
    try {
      const data = await fs.readFile(addedProductsPath, 'utf-8');
      addedProducts = JSON.parse(data);
    } catch (e) {
      addedProducts = [];
    }
    addedProducts.push(extendedProduct);
    await fs.writeFile(addedProductsPath, JSON.stringify(addedProducts, null, 2));

    let products = [];
    try {
      const data = await fs.readFile(productsPath, 'utf-8');
      products = JSON.parse(data);
    } catch (e) {
      products = [];
    }
    
    const existingIndex = products.findIndex(p => p.id === product.id);
    const productForMain = {
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      image: product.image,
      description: product.description,
      rating: product.rating || 5.0,
      stock: product.stock || 0,
      expiryDate: product.expiryDate || null
    };
    
    if (existingIndex !== -1) {
      products[existingIndex] = productForMain;
    } else {
      products.push(productForMain);
    }
    await fs.writeFile(productsPath, JSON.stringify(products, null, 2));

    res.set('Cache-Control', 'no-cache');
    res.json({ success: true, product: extendedProduct });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ error: 'Failed to add product' });
  }
});

const PORT = 5002;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend running on http://0.0.0.0:${PORT}`);
});
