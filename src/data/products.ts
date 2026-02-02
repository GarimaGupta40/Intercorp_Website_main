import productsData from './products.json';
import { api } from '../utils/api';

export interface Product {
  id: string;
  name: string;
  category: 'human-nutrition' | 'animal-nutrition' | 'consumer-products';
  price: number;
  image: string;
  description: string;
  rating: number;
  stock?: number;
  expiryDate?: string;
}

export interface Order {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  pincode: string;
  items: {
    productId: string;
    name: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  discount?: number;
  paymentMethod: string;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  date: string;
}

let internalProducts: Product[] = [];
let orders: Order[] = [];

// Initialize data from API
const initData = async () => {
  internalProducts = await api.get('products') || [];
  orders = await api.get('orders') || [];
};

initData();

export const products = productsData as Product[];

export const getProducts = () => internalProducts.length > 0 ? internalProducts : products;

export const saveProduct = async (product: Product, addedBy?: string) => {
  const index = internalProducts.findIndex((p) => p.id === product.id);
  const isNewProduct = index === -1;
  
  if (index !== -1) {
    internalProducts[index] = product;
  } else {
    internalProducts.push(product);
  }
  
  if (isNewProduct) {
    await api.post('admin/add-product', {
      ...product,
      addedBy: addedBy || localStorage.getItem('userEmail') || 'admin',
      status: 'active'
    });
  } else {
    await api.post('products', internalProducts);
  }
  
  window.dispatchEvent(new Event('products_updated'));
};

export const deleteProduct = async (productId: string) => {
  internalProducts = internalProducts.filter((p) => p.id !== productId);
  await api.post('products', internalProducts);
  window.dispatchEvent(new Event('products_updated'));
};

export const productsByCategory = {
  'human-nutrition': (internalProducts.length > 0 ? internalProducts : products).filter((p) => p.category === 'human-nutrition'),
  'animal-nutrition': (internalProducts.length > 0 ? internalProducts : products).filter((p) => p.category === 'animal-nutrition'),
  'consumer-products': (internalProducts.length > 0 ? internalProducts : products).filter((p) => p.category === 'consumer-products'),
};

export const getOrders = () => orders;

export const saveOrder = async (order: Order) => {
  const existingIndex = orders.findIndex(o => o.id === order.id);
  if (existingIndex > -1) return;
  orders = [order, ...orders];
  await api.post('orders', orders);

  // Update Inventory
  const currentProducts = await api.get('products') || [];
  let productsUpdated = false;
  order.items.forEach(item => {
    const product = currentProducts.find((p: any) => p.id === item.productId);
    if (product && product.stock !== undefined) {
      product.stock = Math.max(0, product.stock - item.quantity);
      productsUpdated = true;
    }
  });
  if (productsUpdated) {
    await api.post('products', currentProducts);
    internalProducts = currentProducts;
    window.dispatchEvent(new Event('products_updated'));
  }

  // Update Customer Activity
  const customers = await api.get('customer') || [];
  const customerIndex = customers.findIndex((c: any) => c.email === order.email);
  const orderSummary = {
    id: order.id,
    date: order.date,
    total: order.total,
    status: order.status
  };

  if (customerIndex > -1) {
    customers[customerIndex].lastOrder = order.date;
    customers[customerIndex].totalOrders = (customers[customerIndex].totalOrders || 0) + 1;
    customers[customerIndex].orderHistory = [orderSummary, ...(customers[customerIndex].orderHistory || [])];
  } else {
    customers.push({
      email: order.email,
      name: order.customerName,
      phone: order.phone,
      lastOrder: order.date,
      totalOrders: 1,
      orderHistory: [orderSummary]
    });
  }
  await api.post('customer', customers);

  window.dispatchEvent(new Event('orders_updated'));
};

export const updateOrderStatus = async (orderId: string, status: Order['status']) => {
  orders = orders.map(o => o.id === orderId ? { ...o, status } : o);
  await api.post('orders', orders);
  window.dispatchEvent(new Event('orders_updated'));
};

export const checkLoyaltyStatus = async (email: string) => {
  const userOrders = orders.filter(o => o.email === email && o.status !== 'Cancelled');
  const count = userOrders.length;
  if (count > 0 && count % 2 === 0) {
    const milestoneKey = `loyalty_milestone_${email.replace(/[@.]/g, '_')}_${count}`;
    if (!localStorage.getItem(milestoneKey)) {
      localStorage.setItem(`loyalty_coupon_${email.replace(/[@.]/g, '_')}`, 'LOYALTY15');
      localStorage.setItem(milestoneKey, 'true');
      return true;
    }
  }
  return false;
};

export const hasActiveCoupon = (email: string) => {
  return !!localStorage.getItem(`loyalty_coupon_${email.replace(/[@.]/g, '_')}`);
};

export const useLoyaltyCoupon = (email: string) => {
  localStorage.removeItem(`loyalty_coupon_${email.replace(/[@.]/g, '_')}`);
};
