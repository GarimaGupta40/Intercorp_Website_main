import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  Search,
  Bell,
  LogOut,
  X,
  Upload,
  CheckCircle,
  Trash2,
  Edit2,
  Eye,
  Clock,
  FileText,
  Download,
  Printer,
  History,
  Building2,
  Star,
  HeartPulse,
  AlertTriangle,
  TrendingDown,
  CreditCard,
  Menu,
  Ticket
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Product, getProducts, saveProduct, Order, getOrders, updateOrderStatus } from '../data/products';
import { api } from '../utils/api';
import { playNotificationSound } from '../utils/audio';
import { 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  BarChart,
  Bar,
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface Notification {
  id: string;
  type: 'new_order' | 'status_change';
  message: string;
  timestamp: string;
  read: boolean;
}

export default function AdminDashboard() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('intercorp_admin_notifications');
    return saved ? JSON.parse(saved) : [];
  });
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Order | null>(null);
  const [activityLog, setActivityLog] = useState<any[]>(() => {
    const saved = localStorage.getItem('intercorp_admin_activity');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    // Persist notifications and activity logs to backend
    const saveMetadata = async () => {
      await api.post('admin_notifications', notifications);
      await api.post('admin_activity', activityLog);
    };
    saveMetadata();
  }, [notifications, activityLog]);

  useEffect(() => {
    // Load notifications and activity logs from backend
    api.get('admin_notifications').then(data => setNotifications(data || []));
    api.get('admin_activity').then(data => setActivityLog(data || []));
  }, []);

  const addActivity = (type: string, message: string, icon: any) => {
    const newActivity = {
      id: `act-${Date.now()}`,
      type,
      message,
      timestamp: new Date().toISOString(),
      icon
    };
    setActivityLog(prev => [newActivity, ...prev]);

    // Also add to notifications
    const newNotif: Notification = {
      id: `notif-${Date.now()}`,
      type: 'status_change',
      message: `${type}: ${message}`,
      timestamp: new Date().toISOString(),
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  useEffect(() => {
    // Check for near expiry items and show login alert
    const checkExpiry = () => {
      const allProducts = getProducts();
      const now = new Date();
      const thirtyDaysFromNow = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000));
      const nearExpiryItems = allProducts.filter(p => {
        if (!p.expiryDate) return false;
        const expiry = new Date(p.expiryDate);
        return expiry <= thirtyDaysFromNow && expiry > now;
      });

      if (nearExpiryItems.length > 0) {
        const names = nearExpiryItems.map(p => p.name).join(', ');
        alert(`⚠️ Attention: ${nearExpiryItems.length} products are expiring soon: ${names}. Please check Inventory Health for discount recommendations.`);
      }
    };
    
    // Simulate login alert - only show if just logged in
    const hasShownLoginAlert = sessionStorage.getItem('hasShownLoginAlert');
    if (!hasShownLoginAlert) {
      checkExpiry();
      sessionStorage.setItem('hasShownLoginAlert', 'true');
    }
  }, []);
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const navigate = useNavigate();
  const adminEmail = localStorage.getItem('userEmail') || 'admin@intercorp.in';

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'human-nutrition',
    price: '',
    description: '',
    stock: '',
    expiryDate: '',
    image: '/src/assets/product-1.jpg'
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    // Check for low stock items
    const lowStockItems = products.filter(p => (p.stock ?? 0) < 10);
    
    // Check for near expiry items (within 30 days)
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000));
    const nearExpiryItems = products.filter(p => {
      if (!p.expiryDate) return false;
      const expiry = new Date(p.expiryDate);
      return expiry <= thirtyDaysFromNow;
    });

    const newNotifs: Notification[] = [];

    if (lowStockItems.length > 0) {
      lowStockItems.forEach(p => {
        newNotifs.push({
          id: `low-stock-${p.id}-${new Date(p.expiryDate || '').getTime() || Date.now()}`,
          type: 'status_change',
          message: `Low Stock Alert: ${p.name} (${p.stock} left)`,
          timestamp: new Date().toISOString(),
          read: false
        });
      });
    }

    if (nearExpiryItems.length > 0) {
      nearExpiryItems.forEach(p => {
        const expiryDate = new Date(p.expiryDate!).toLocaleDateString('en-IN');
        const isExpired = new Date(p.expiryDate!) < now;
        newNotifs.push({
          id: `expiry-${p.id}-${new Date(p.expiryDate!).getTime()}`,
          type: 'status_change',
          message: isExpired ? `Expired Product: ${p.name} (Expired on ${expiryDate})` : `Expiry Warning: ${p.name} (Expires on ${expiryDate})`,
          timestamp: new Date().toISOString(),
          read: false
        });
      });
    }

    if (newNotifs.length > 0) {
      setNotifications(prev => {
        if (!Array.isArray(prev)) return newNotifs;
        const existingIds = new Set(prev.map(n => n.id));
        const uniqueNewNotifs = newNotifs.filter(n => !existingIds.has(n.id));
        if (uniqueNewNotifs.length === 0) return prev;
        return [...uniqueNewNotifs, ...prev];
      });
    }
  }, [products]);

  useEffect(() => {
    const initDashboard = async () => {
      try {
        const [loadedProducts, loadedOrders, notifs, activity] = await Promise.all([
          api.get('products'),
          api.get('orders'),
          api.get('admin_notifications'),
          api.get('admin_activity')
        ]);
        
        if (loadedProducts) setProducts([...loadedProducts]);
        if (loadedOrders) setOrders([...loadedOrders]);
        if (notifs) setNotifications(notifs);
        if (activity) setActivityLog(activity);
      } catch (error) {
        console.error('Error initializing dashboard data:', error);
      }
    };
    initDashboard();
  }, []);

  useEffect(() => {
    const handleUpdate = async () => {
      const [newOrders, newProducts] = await Promise.all([
        getOrders(),
        getProducts()
      ]);
      setOrders([...newOrders]);
      setProducts([...newProducts]);
    };

    window.addEventListener('products_updated', handleUpdate);
    window.addEventListener('orders_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('products_updated', handleUpdate);
      window.removeEventListener('orders_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const handleStatusChange = (orderId: string, status: Order['status']) => {
    updateOrderStatus(orderId, status);
    
    const newNotif: Notification = {
      id: `notif-status-${Date.now()}`,
      type: 'status_change',
      message: `Order ${orderId} status changed to ${status}`,
      timestamp: new Date().toISOString(),
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
    addActivity('status', `Order ${orderId} status updated to ${status}`, 'Clock');
    playNotificationSound();

    setToastMessage(`Order ${orderId} updated to ${status}`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const filteredData = useMemo(() => {
    const query = searchQuery.toLowerCase();
    if (!query) return { orders, products };

    const filteredOrders = orders.filter(o => 
      (o.id && o.id.toLowerCase().includes(query)) ||
      (o.customerName && o.customerName.toLowerCase().includes(query)) ||
      (o.status && o.status.toLowerCase().includes(query)) ||
      (o.items && o.items.some(item => item.name && item.name.toLowerCase().includes(query)))
    );

    const filteredProducts = products.filter(p => 
      (p.id && p.id.toLowerCase().includes(query)) ||
      (p.name && p.name.toLowerCase().includes(query)) ||
      (p.category && p.category.toLowerCase().includes(query))
    );

    return { orders: filteredOrders, products: filteredProducts };
  }, [searchQuery, orders, products]);

  useEffect(() => {
    // Initialize activity log
    const savedLog = JSON.parse(localStorage.getItem('admin_activity_log') || '[]');
    setActivityLog(savedLog);
  }, []);

  useEffect(() => {
    localStorage.setItem('admin_activity_log', JSON.stringify(activityLog));
  }, [activityLog]);

  const addActivityLog = (type: string, message: string, icon: any) => {
    const newActivity = {
      id: `act-${Date.now()}`,
      type,
      message,
      timestamp: new Date().toISOString(),
      icon
    };
    setActivityLog(prev => [newActivity, ...prev]);

    // Also add to notifications
    const newNotif: Notification = {
      id: `notif-${Date.now()}`,
      type: 'status_change',
      message: `${type}: ${message}`,
      timestamp: new Date().toISOString(),
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const loyaltyStats = useMemo(() => {
    const customerOrders: { [key: string]: number } = {};
    if (orders && orders.length > 0) {
      orders.forEach(order => {
        if (!order?.customerName) return;
        const name = order.customerName.trim();
        customerOrders[name] = (customerOrders[name] || 0) + 1;
      });
    }

    const totalCustomers = Object.keys(customerOrders).length;
    const repeatBuyers = Object.entries(customerOrders).filter(([_, count]) => count > 1);
    const repeatRate = totalCustomers > 0 ? (repeatBuyers.length / totalCustomers) * 100 : 0;

    // Sort top repeat buyers
    const topBuyers = repeatBuyers
      .sort((a: any, b: any) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    return { repeatRate, topBuyers, totalCustomers };
  }, [orders]);

  useEffect(() => {
    const customerOrders: { [key: string]: number } = {};
    if (orders && Array.isArray(orders)) {
      orders.forEach(order => {
        if (!order?.email) return;
        const email = String(order.email).trim();
        customerOrders[email] = (customerOrders[email] || 0) + 1;
      });
    }

    Object.entries(customerOrders).forEach(([email, count]) => {
      // Check for multiples of 2 to catch repeat loyalty events
      if (count > 0 && count % 2 === 0) {
        import('../data/products').then(module => {
          // Verify if this specific milestone triggered a coupon
          const milestoneKey = `loyalty_milestone_${email.replace(/[@.]/g, '_')}_${count}`;
          if (localStorage.getItem(milestoneKey)) {
            const customerName = orders.find(o => o.email === email)?.customerName || email;
            const activityId = `loyalty-act-${email}-${count}`;
            
            // Avoid duplicate log entries for the same milestone
            setActivityLog(prev => {
              if (prev.find(a => a.id === activityId)) return prev;
              const newActivity = {
                id: activityId,
                type: 'Loyalty Coupon',
                message: `Customer ${customerName} received a 15% loyalty coupon for completing ${count} purchases.`,
                timestamp: new Date().toISOString(),
                icon: 'Star'
              };
              return [newActivity, ...prev];
            });
          }
        });
      }
    });
  }, [orders]);

  const chartData = useMemo(() => {
    if (!orders || !Array.isArray(orders)) return [];
    // Orders per day (last 7 days)
    const dailyData: { [key: string]: { date: string; orders: number } } = {};
    const now = new Date();
    
    // Initialize last 7 days with 0 orders
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
      dailyData[dateStr] = { date: dateStr, orders: 0 };
    }
    
    orders.forEach(order => {
      if (!order || !order.date) return;
      try {
        const date = new Date(order.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
        if (dailyData[date]) {
          dailyData[date].orders += 1;
        }
      } catch (e) {
        console.error('Error parsing order date:', e);
      }
    });

    return Object.values(dailyData);
  }, [orders]);

  const statusData = useMemo(() => {
    if (!orders || !Array.isArray(orders)) return [];
    const counts: { [key: string]: number } = {};
    orders.forEach(order => {
      if (!order || !order.status) return;
      counts[order.status] = (counts[order.status] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [orders]);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const openOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsOrderModalOpen(true);
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category: 'human-nutrition',
      price: '',
      description: '',
      stock: '',
      expiryDate: '',
      image: '/src/assets/product-1.jpg'
    });
    setImagePreview(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      description: product.description,
      stock: (product.stock || 0).toString(),
      expiryDate: product.expiryDate || '',
      image: product.image
    });
    setImagePreview(product.image);
    setIsModalOpen(true);
  };

  const handleDelete = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (window.confirm('Are you sure you want to delete this product?')) {
      import('../data/products').then(module => {
        module.deleteProduct(productId);
        addActivity('Product Deleted', `Deleted product: ${product?.name || productId}`, 'Trash2');
        setToastMessage('Product deleted successfully!');
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setFormData(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const productData: Product = {
      id: editingProduct ? editingProduct.id : `prod-${Date.now()}`,
      name: formData.name,
      category: formData.category as any,
      price: parseFloat(formData.price),
      description: formData.description,
      stock: parseInt(formData.stock),
      expiryDate: formData.expiryDate,
      image: formData.image,
      rating: editingProduct ? editingProduct.rating : 5.0
    };

    saveProduct(productData);
    setIsModalOpen(false);
    const msg = editingProduct ? `Product "${formData.name}" updated` : `New product "${formData.name}" added`;
    addActivity('Product Update', msg, 'Package');
    setToastMessage(editingProduct ? 'Product updated successfully!' : 'Product added successfully!');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
    setEditingProduct(null);
  };

  const totalRevenue = useMemo(() => {
    if (!orders || !Array.isArray(orders)) return 0;
    return orders.reduce((sum, order) => sum + (order?.total || 0), 0);
  }, [orders]);
  const totalOrders = Array.isArray(orders) ? orders.length : 0;
  const activeCustomers = useMemo(() => {
    if (!orders || !Array.isArray(orders)) return 0;
    try {
      const names = new Set(
        orders
          .filter(o => o && o.customerName)
          .map(order => order.customerName.toLowerCase().trim())
      );
      return names.size;
    } catch (e) {
      console.error('Error calculating active customers:', e);
      return 0;
    }
  }, [orders]);
  const totalProducts = products.length;

  const attentionNeededItems = useMemo(() => {
    const alerts: { id: string; type: 'stock' | 'expiry' | 'order'; title: string; message: string; count: number; tab: string }[] = [];
    
    // Low Stock
    const lowStockCount = products.filter(p => (p.stock ?? 0) < 10).length;
    if (lowStockCount > 0) {
      alerts.push({
        id: 'alert-stock',
        type: 'stock',
        title: 'Low Stock Alert',
        message: `${lowStockCount} items are running below threshold`,
        count: lowStockCount,
        tab: 'inventory'
      });
    }

    // Near Expiry
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000));
    const nearExpiryCount = products.filter(p => {
      if (!p.expiryDate) return false;
      const expiry = new Date(p.expiryDate);
      return expiry <= thirtyDaysFromNow;
    }).length;
    
    if (nearExpiryCount > 0) {
      alerts.push({
        id: 'alert-expiry',
        type: 'expiry',
        title: 'Expiring Soon',
        message: `${nearExpiryCount} items near expiry - Recommend clearance discount`,
        count: nearExpiryCount,
        tab: 'inventory'
      });
    }

    // Pending Orders
    const pendingOrdersCount = orders.filter(o => o.status === 'Pending').length;
    if (pendingOrdersCount > 0) {
      alerts.push({
        id: 'alert-orders',
        type: 'order',
        title: 'Pending Orders',
        message: `${pendingOrdersCount} new orders awaiting processing`,
        count: pendingOrdersCount,
        tab: 'orders'
      });
    }

    return alerts;
  }, [products, orders]);

  const stats = useMemo(() => [
    { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString('en-IN')}`, change: '+12.5%', isPositive: true, icon: TrendingUp, tab: 'orders' },
    { label: 'Total Orders', value: totalOrders.toLocaleString('en-IN'), change: '+8.2%', isPositive: true, icon: ShoppingCart, tab: 'orders' },
    { label: 'Active Customers', value: activeCustomers.toLocaleString('en-IN'), change: '+2.4%', isPositive: true, icon: Users, tab: 'loyalty' },
    { label: 'Total Products', value: totalProducts.toLocaleString('en-IN'), change: '+4.1%', isPositive: true, icon: Package, tab: 'products' },
  ], [totalRevenue, totalOrders, activeCustomers, totalProducts]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new Event('auth_state_changed'));
    navigate('/login');
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const inventoryInsights = useMemo(() => {
    if (!products || !Array.isArray(products) || !orders || !Array.isArray(orders)) return [];
    const LOW_STOCK_THRESHOLD = 10;
    const SLOW_MOVING_THRESHOLD = 3; // sales in last 30 days
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));

    const salesStats: { [key: string]: number } = {};
    orders.forEach(order => {
      if (!order || !order.date || !order.items) return;
      const orderDate = new Date(order.date);
      if (orderDate >= thirtyDaysAgo) {
        order.items.forEach((item: any) => {
          if (!item) return;
          const id = item.productId || item.id;
          if (id) {
            salesStats[id] = (salesStats[id] || 0) + (item.quantity || 0);
          }
        });
      }
    });

    return products.map(product => {
      if (!product) return null;
      const stock = product.stock ?? 0;
      const salesLast30Days = salesStats[product.id] || 0;
      const dailyRate = salesLast30Days / 30;
      const daysLeft = dailyRate > 0 ? Math.floor(stock / dailyRate) : Infinity;
      
      const now = new Date();
      const thirtyDaysFromNow = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000));
      const isExpiringSoon = product.expiryDate ? new Date(product.expiryDate) <= thirtyDaysFromNow && new Date(product.expiryDate) > now : false;

      return {
        ...product,
        salesLast30Days,
        daysLeft,
        expiryDate: product.expiryDate,
        isLowStock: stock < LOW_STOCK_THRESHOLD,
        isSlowMoving: salesLast30Days < SLOW_MOVING_THRESHOLD,
        isExpiringSoon
      };
    }).filter((p): p is any => !!p && (p.isLowStock || p.isSlowMoving || p.isExpiringSoon));
  }, [products, orders]);

  const funnelData = useMemo(() => {
    const stats = JSON.parse(localStorage.getItem('intercorp_funnel_stats') || '{"views": 0, "carts": 0, "checkouts": 0}');
    const totalOrders = orders.length;
    
    // Ensure logical funnel sequence (though localStorage will track real events)
    const views = Math.max(stats.views, stats.carts, stats.checkouts, totalOrders, 100);
    const carts = Math.max(stats.carts, stats.checkouts, totalOrders, 45);
    const checkouts = Math.max(stats.checkouts, totalOrders, 28);
    
    return [
      { name: 'Product Viewed', value: views, icon: Eye, color: '#3b82f6', desc: 'Customers exploring products' },
      { name: 'Added to Cart', value: carts, icon: ShoppingCart, color: '#8b5cf6', desc: 'High intent buyers' },
      { name: 'Checkout Started', value: checkouts, icon: CreditCard, color: '#f59e0b', desc: 'Ready to purchase' },
      { name: 'Order Placed', value: totalOrders, icon: CheckCircle, color: '#10b981', desc: 'Successful conversions' },
    ];
  }, [orders]);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarCollapsed ? 80 : 256 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="bg-white border-r border-gray-200 hidden lg:flex flex-col overflow-hidden"
      >
        <div className="p-6 flex-1 overflow-y-auto overflow-x-hidden">
          <div className={`flex items-center text-blue-600 font-bold text-2xl mb-8 ${isSidebarCollapsed ? 'justify-center' : 'gap-2'}`}>
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-2 rounded-lg shadow-blue-200 shadow-lg shrink-0">
              <Building2 className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
            <AnimatePresence mode="wait">
              {!isSidebarCollapsed && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="flex flex-col leading-tight whitespace-nowrap"
                >
                  <span className="text-xl font-black bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent tracking-tighter">
                    INTERCORP
                  </span>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                    Precision
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <nav className="space-y-1 mb-8">
            {[
              { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'products', label: 'Products', icon: Package },
              { id: 'orders', label: 'Orders', icon: ShoppingCart },
              { id: 'loyalty', label: 'Loyalty', icon: Star },
              { id: 'invoices', label: 'Invoices', icon: FileText },
              { id: 'inventory', label: 'Inventory Health', icon: HeartPulse },
              { id: 'activity', label: 'Activity', icon: History },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center transition-all relative group h-12 rounded-xl text-sm font-semibold ${
                  isSidebarCollapsed ? 'justify-center' : 'px-4 gap-3'
                } ${
                  activeTab === item.id 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon className={`w-5 h-5 shrink-0 ${isSidebarCollapsed ? '' : ''}`} />
                <AnimatePresence mode="wait">
                  {!isSidebarCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {isSidebarCollapsed && (
                  <div className="absolute left-full ml-4 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                    {item.label}
                  </div>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6 border-t border-gray-100 overflow-hidden">
          <button 
            onClick={handleLogout}
            className={`w-full flex items-center transition-all relative group h-12 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 ${
              isSidebarCollapsed ? 'justify-center' : 'px-4 gap-3'
            }`}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            <AnimatePresence mode="wait">
              {!isSidebarCollapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="whitespace-nowrap"
                >
                  Logout
                </motion.span>
              )}
            </AnimatePresence>
            {isSidebarCollapsed && (
              <div className="absolute left-full ml-4 px-2 py-1 bg-red-600 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                Logout
              </div>
            )}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10 px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hidden lg:block"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold text-gray-900 capitalize">{activeTab}</h1>
          </div>
          
          <div className="flex-1 px-8 flex justify-end items-center gap-6">
            {activeTab === 'overview' && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="hidden md:flex flex-col items-end mr-2"
              >
                <h2 className="text-sm font-bold text-gray-900">Welcome back, Admin</h2>
                <p className="text-[10px] text-gray-400 font-medium">Here's what's happening today</p>
              </motion.div>
            )}
            
            {(activeTab === 'products' || activeTab === 'orders' || activeTab === 'invoices' || activeTab === 'inventory' || activeTab === 'activity') && (
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search orders, products, customers..." 
                  className="pl-10 pr-4 py-2 bg-gray-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500 w-64"
                />
              </div>
            )}

            {activeTab === 'products' && (
              <button
                onClick={openAddModal}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
              >
                <Package className="w-4 h-4" />
                Add Product
              </button>
            )}
            
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative text-gray-400 hover:text-gray-600"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full font-bold">
                    {unreadCount}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <>
                    <div 
                      className="fixed inset-0 z-20" 
                      onClick={() => setShowNotifications(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-30 overflow-hidden"
                    >
                      <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0">
                        <h3 className="font-bold text-gray-900">Notifications</h3>
                        <button 
                          onClick={() => {
                            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                            setShowNotifications(false);
                          }}
                          className="text-xs text-blue-600 font-bold hover:underline"
                        >
                          Mark all as read
                        </button>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-8 text-center text-gray-400">
                            <Bell className="w-8 h-8 mx-auto mb-2 opacity-20" />
                            <p className="text-sm">No new notifications</p>
                          </div>
                        ) : (
                          notifications.map((notif) => (
                            <div 
                              key={notif.id} 
                              className={`p-4 border-b border-gray-50 flex gap-3 hover:bg-gray-50 transition-colors ${!notif.read ? 'bg-blue-50/30' : ''}`}
                            >
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                notif.type === 'new_order' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                              }`}>
                                {notif.type === 'new_order' ? <ShoppingCart className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                              </div>
                              <div className="flex-1">
                                <p className="text-sm text-gray-900 leading-tight">{notif.message}</p>
                                <p className="text-[10px] text-gray-500 mt-1">
                                  {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                              </div>
                              {!notif.read && <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5" />}
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
            
            <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900">Admin User</p>
                <p className="text-xs text-gray-500">{adminEmail}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                AD
              </div>
            </div>
          </div>
        </header>

        <div className="p-8">
          {activeTab === 'inventory' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Inventory Health & Insights</h2>
                  <p className="text-gray-500 mt-1">Real-time stock analysis and reorder predictions.</p>
                </div>
                <div className="flex gap-4">
                  <div className="bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Critical Items</p>
                    <p className="text-xl font-black text-red-600">{inventoryInsights.filter(p => p.isLowStock).length}</p>
                  </div>
                  <div className="bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Slow Moving</p>
                    <p className="text-xl font-black text-amber-600">{inventoryInsights.filter(p => p.isSlowMoving).length}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden w-full max-w-6xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse table-fixed">
                      <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100">
                          <th className="px-8 py-4 text-[13px] font-black text-gray-400 uppercase tracking-widest w-[30%]">Product Details</th>
                          <th className="px-6 py-4 text-[13px] font-black text-gray-400 uppercase tracking-widest text-center w-32">Stock</th>
                          <th className="px-6 py-4 text-[13px] font-black text-gray-400 uppercase tracking-widest text-center w-44">Expiry</th>
                          <th className="px-6 py-4 text-[13px] font-black text-gray-400 uppercase tracking-widest text-center w-40">30D Sales</th>
                          <th className="px-8 py-4 text-[13px] font-black text-gray-400 uppercase tracking-widest text-left">Status & Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {inventoryInsights.length > 0 ? (
                          inventoryInsights.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                              <td className="px-8 py-4">
                                <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 rounded-lg bg-gray-50 overflow-hidden flex-shrink-0 border border-gray-100">
                                    <img src={item.image} alt="" className="w-full h-full object-cover" />
                                  </div>
                                  <div className="min-w-0">
                                    <p className="font-bold text-gray-900 text-base truncate">{item.name}</p>
                                    <p className="text-[11px] text-gray-400 uppercase font-bold tracking-wider">{item.category.replace('-', ' ')}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-center">
                                <p className={`font-black text-base ${item.isLowStock ? 'text-red-600' : 'text-gray-900'}`}>
                                  {item.stock}
                                </p>
                              </td>
                              <td className="px-6 py-4 text-center">
                                <div className="flex flex-col items-center">
                                  <p className={`text-base font-bold ${
                                    item.expiryDate && (new Date(item.expiryDate) < new Date() || item.isExpiringSoon)
                                      ? 'text-red-600' 
                                      : 'text-gray-600'
                                  }`}>
                                    {item.expiryDate ? new Date(item.expiryDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
                                  </p>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-center font-bold text-gray-500 text-base">
                                {item.salesLast30Days}
                              </td>
                              <td className="px-8 py-4">
                                <div className="flex flex-wrap gap-2 items-center justify-start">
                                  {item.isLowStock && (
                                    <span className="flex items-center gap-1 px-2.5 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-black uppercase border border-red-100">
                                      Low Stock
                                    </span>
                                  )}
                                  {item.isExpiringSoon && (
                                    <div className="flex items-center gap-2">
                                      <span className="flex items-center gap-1 px-2.5 py-1.5 bg-orange-50 text-orange-600 rounded-lg text-xs font-black uppercase border border-orange-100">
                                        Soon
                                      </span>
                                      <div className="flex gap-1.5 border-l border-gray-200 pl-3">
                                        {[15, 30].map(pct => (
                                          <button
                                            key={pct}
                                            onClick={() => {
                                              if (confirm(`Apply ${pct}% discount to ${item.name}?`)) {
                                                const newPrice = Math.round(item.price * (1 - pct / 100));
                                                const updatedProducts = products.map(p => 
                                                  p.id === item.id ? { ...p, price: newPrice } : p
                                                );
                                                localStorage.setItem('intercorp_products', JSON.stringify(updatedProducts));
                                                addActivity('Discount Applied', `Applied ${pct}% discount to ${item.name}.`, 'TrendingDown');
                                                window.dispatchEvent(new CustomEvent('products_updated'));
                                              }
                                            }}
                                            className="px-3 py-1.5 bg-white border border-blue-200 text-blue-600 text-[11px] font-black rounded-lg hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                          >
                                            -{pct}%
                                          </button>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                  {!item.isLowStock && !item.isExpiringSoon && !item.isSlowMoving && (
                                    <span className="flex items-center gap-1 px-2.5 py-1.5 bg-green-50 text-green-600 rounded-lg text-xs font-black uppercase border border-green-100">
                                      Healthy
                                    </span>
                                  )}
                                  {item.isSlowMoving && !item.isLowStock && !item.isExpiringSoon && (
                                     <span className="flex items-center gap-1 px-2.5 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-black uppercase border border-blue-100">
                                      Slow Moving
                                    </span>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                              <Package className="w-10 h-10 mx-auto mb-2 opacity-20" />
                              <p className="text-xs font-medium">All systems normal. No products require immediate attention.</p>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'overview' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Attention Needed Section */}
              {attentionNeededItems.length > 0 && (
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-red-100 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-red-500" />
                  <div className="flex items-center gap-2 mb-6">
                    <div className="p-1.5 bg-red-100 rounded-lg">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                    </div>
                    <h2 className="text-lg font-bold text-gray-900">Attention Needed</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {attentionNeededItems.map((item) => (
                      <motion.button
                        key={item.id}
                        whileHover={{ y: -4, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setActiveTab(item.tab)}
                        className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-red-200 hover:bg-white hover:shadow-md transition-all text-left group"
                      >
                        <div className={`p-3 rounded-xl shrink-0 ${
                          item.type === 'stock' ? 'bg-orange-100 text-orange-600' :
                          item.type === 'expiry' ? 'bg-red-100 text-red-600' :
                          'bg-blue-100 text-blue-600'
                        }`}>
                          {item.type === 'stock' ? <Package className="w-5 h-5" /> :
                           item.type === 'expiry' ? <Clock className="w-5 h-5" /> :
                           <ShoppingCart className="w-5 h-5" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-0.5">
                            <p className="text-sm font-bold text-gray-900">{item.title}</p>
                            <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                              item.type === 'stock' ? 'bg-orange-600 text-white' :
                              item.type === 'expiry' ? 'bg-red-600 text-white' :
                              'bg-blue-600 text-white'
                            }`}>
                              {item.count}
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-500 line-clamp-1">{item.message}</p>
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-gray-600 transition-colors shrink-0" />
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (stat && (
                  <div 
                    key={i} 
                    onClick={() => setActiveTab(stat.tab)}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md hover:border-blue-200 transition-all"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <stat.icon className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className={`flex items-center gap-1 text-xs font-bold ${stat.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                        {stat.change}
                        {stat.isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  </div>
                )))}
              </div>

              {/* Charts Section - Row 1 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-3 text-sm">Orders Trend</h3>
                  <div className="h-48 w-full flex flex-col items-center justify-center">
                    {chartData.some(d => d.orders > 0) ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                          <XAxis 
                            dataKey="date" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 10, fill: '#9ca3af' }} 
                          />
                          <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 10, fill: '#9ca3af' }}
                            width={30}
                          />
                          <Tooltip 
                            contentStyle={{ 
                              borderRadius: '8px', 
                              border: 'none', 
                              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                              fontSize: '12px'
                            }}
                          />
                          <Bar 
                            dataKey="orders" 
                            name="Orders" 
                            fill="#3b82f6" 
                            radius={[4, 4, 0, 0]} 
                            barSize={24}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="text-center py-10">
                        <History className="w-10 h-10 mx-auto mb-2 text-gray-200" />
                        <p className="text-xs text-gray-400 max-w-[200px] mx-auto">No orders yet. Trends will appear once orders are placed.</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-3 text-sm">Order Status Breakdown</h3>
                  <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={statusData}
                          cx="50%"
                          cy="45%"
                          innerRadius={40}
                          outerRadius={65}
                          paddingAngle={4}
                          dataKey="value"
                        >
                          {statusData.map((_entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }} />
                        <Legend verticalAlign="bottom" height={24} wrapperStyle={{ fontSize: '11px' }}/>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Sales Funnel Section - Row 2 */}
              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">Sales Conversion Funnel</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Customer journey from discovery to purchase</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">Overall Conversion</p>
                    <p className="text-lg font-black text-green-600">{funnelData.length > 0 ? Math.round((funnelData[funnelData.length - 1].value / funnelData[0].value) * 100) : 0}%</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {funnelData.some(step => step.value > 0) ? (
                    funnelData.map((step, idx) => {
                      const prevValue = idx > 0 ? funnelData[idx - 1].value : step.value;
                      const dropoff = idx > 0 ? Math.round((1 - step.value / prevValue) * 100) : 0;
                      const convRate = Math.round((step.value / (funnelData[0]?.value || 1)) * 100);
                      
                      return (
                        <div key={step.name} className="relative group">
                          <div 
                            className="p-3 rounded-xl border border-gray-100 relative overflow-hidden"
                            style={{ backgroundColor: `${step.color}08` }}
                          >
                            {idx > 0 && (
                              <div className="absolute top-2 right-2 z-20">
                                <span className="bg-red-50 text-red-500 text-[9px] font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap border border-red-100 shadow-sm">
                                  -{dropoff}%
                                </span>
                              </div>
                            )}
                            <div 
                              className="absolute bottom-0 left-0 right-0 opacity-20 rounded-b-xl"
                              style={{ 
                                height: `${convRate}%`,
                                backgroundColor: step.color
                              }}
                            />
                            <div className="relative z-10">
                              <div 
                                className="w-8 h-8 rounded-lg flex items-center justify-center mb-2"
                                style={{ backgroundColor: `${step.color}15` }}
                              >
                                <step.icon className="w-4 h-4" style={{ color: step.color }} />
                              </div>
                              <p className="text-xs font-medium text-gray-600 truncate pr-8">{step.name}</p>
                              <div className="flex items-baseline gap-2 mt-1">
                                <span className="text-xl font-black text-gray-900">{step.value}</span>
                                <span className="text-[10px] font-bold text-gray-400">{convRate}%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="col-span-4 py-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                      <TrendingUp className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                      <p className="text-xs text-gray-500">No visitor data yet. Funnel insights will appear as users interact with the store.</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'products' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <div className="p-6 overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-gray-400 text-sm font-medium border-b border-gray-50">
                      <th className="pb-4 pl-4">Product</th>
                      <th className="pb-4">Category</th>
                      <th className="pb-4">Price</th>
                      <th className="pb-4">Stock</th>
                      <th className="pb-4">Status</th>
                      <th className="pb-4 text-right pr-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {filteredData.products.map((product) => (
                      <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="py-4 pl-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <p className="font-bold text-gray-900">{product.name}</p>
                              <p className="text-xs text-gray-500 line-clamp-1 w-48">{product.description}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 capitalize text-gray-600">{product.category.replace('-', ' ')}</td>
                        <td className="py-4 font-bold text-gray-900">₹{product.price.toLocaleString('en-IN')}</td>
                        <td className="py-4 text-gray-600">{product.stock || 0} units</td>
                        <td className="py-4">
                          <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${(product.stock || 0) > 10 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {(product.stock || 0) > 10 ? 'In Stock' : 'Low Stock'}
                          </span>
                        </td>
                        <td className="py-4 text-right pr-4">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => openEditModal(product)}
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDelete(product.id)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'loyalty' && (
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Loyalty Program</h2>
                  <p className="text-gray-500">Manage customer rewards and active coupons</p>
                </div>
                <div className="flex gap-4">
                  <div className="bg-blue-50 px-4 py-2 rounded-xl border border-blue-100 flex items-center gap-2">
                    <Star className="w-5 h-5 text-blue-600" />
                    <span className="text-blue-700 font-bold">{orders.length} Total Orders</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                      <Ticket className="w-5 h-5 text-blue-600" /> Customers with Active Coupons
                    </h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                          <th className="px-6 py-4 font-bold">Customer</th>
                          <th className="px-6 py-4 font-bold">Email</th>
                          <th className="px-6 py-4 font-bold">Total Orders</th>
                          <th className="px-6 py-4 font-bold">Coupon Code</th>
                          <th className="px-6 py-4 font-bold">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {(() => {
                          const customerData: { [key: string]: { name: string; email: string; orderCount: number; couponStatus: 'Active' | 'Used' | 'None' } } = {};
                          orders.forEach(order => {
                            if (!order?.email) return;
                            const email = order.email.trim();
                            if (!customerData[email]) {
                              const hasActive = !!localStorage.getItem(`loyalty_coupon_${email.replace(/[@.]/g, '_')}`);
                              const hasUsed = !!localStorage.getItem(`loyalty_milestone_${email.replace(/[@.]/g, '_')}_2`); // Simple check for used milestone 2
                              
                              customerData[email] = {
                                name: order.customerName,
                                email: email,
                                orderCount: 0,
                                couponStatus: hasActive ? 'Active' : (hasUsed ? 'Used' : 'None')
                              };
                            }
                            customerData[email].orderCount += 1;
                            
                            // More accurate check for 'Used' status - if order has a discount, then coupon was used
                            if ((order as any).discount > 0) {
                              customerData[email].couponStatus = 'Used';
                            }
                          });

                          const relevantCustomers = Object.values(customerData).filter(c => c.couponStatus !== 'None');

                          return relevantCustomers.length > 0 ? (
                            relevantCustomers.map((customer, idx) => (
                              <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-900">{customer.name}</td>
                                <td className="px-6 py-4 text-gray-500">{customer.email}</td>
                                <td className="px-6 py-4">
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {customer.orderCount} Orders
                                  </span>
                                </td>
                                <td className="px-6 py-4">
                                  <code className="bg-gray-100 px-2 py-1 rounded text-blue-600 font-bold">LOYALTY15</code>
                                </td>
                                <td className="px-6 py-4">
                                  {customer.couponStatus === 'Active' ? (
                                    <span className="flex items-center gap-1.5 text-green-600 font-bold text-sm">
                                      <div className="w-2 h-2 rounded-full bg-green-600 animate-pulse" />
                                      Active
                                    </span>
                                  ) : (
                                    <span className="flex items-center gap-1.5 text-gray-400 font-bold text-sm">
                                      <CheckCircle className="w-4 h-4 text-gray-400" />
                                      Used
                                    </span>
                                  )}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={5} className="px-6 py-12 text-center text-gray-500 italic">
                                No active loyalty coupons found at the moment.
                              </td>
                            </tr>
                          );
                        })()}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <div className="p-6 overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-gray-400 text-sm font-medium border-b border-gray-50">
                      <th className="pb-4 pl-4">Order ID</th>
                      <th className="pb-4">Customer</th>
                      <th className="pb-4">Amount</th>
                      <th className="pb-4">Payment</th>
                      <th className="pb-4">Date</th>
                      <th className="pb-4">Status</th>
                      <th className="pb-4 text-right pr-4">Action</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {filteredData.orders.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-20 text-center text-gray-500">
                          {searchQuery ? 'No matching orders found.' : 'No orders found. Real orders will appear here after checkout.'}
                        </td>
                      </tr>
                    ) : (
                      filteredData.orders.filter(order => order?.id).map((order) => (
                        <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                          <td className="py-4 pl-4 font-bold text-gray-900">{order.id}</td>
                          <td className="py-4">
                            <div>
                              <p className="font-bold text-gray-900">{order.customerName || 'N/A'}</p>
                              <p className="text-xs text-gray-500">{order.phone || ''}</p>
                            </div>
                          </td>
                          <td className="py-4 font-bold text-gray-900">₹{(order?.total ?? 0).toLocaleString('en-IN')}</td>
                          <td className="py-4 text-gray-600">{order.paymentMethod || 'N/A'}</td>
                          <td className="py-4 text-gray-600">
                            {order.date ? new Date(order.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
                          </td>
                          <td className="py-4">
                            <select 
                              value={order.status || 'Pending'}
                              onChange={(e) => handleStatusChange(order.id, e.target.value as any)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold border-none ring-1 ring-inset transition-all ${
                                order.status === 'Delivered' ? 'bg-green-100 text-green-700 ring-green-600/30 shadow-sm' : 
                                order.status === 'Cancelled' ? 'bg-red-600 text-white ring-red-700 shadow-md' : 
                                order.status === 'Pending' ? 'bg-red-100 text-red-700 ring-red-600/30 font-black animate-pulse shadow-sm' : 
                                order.status === 'Processing' ? 'bg-yellow-50 text-yellow-700 ring-yellow-600/20' :
                                'bg-blue-50 text-blue-700 ring-blue-600/20'
                              }`}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="py-4 text-right pr-4">
                            <button 
                              onClick={() => openOrderDetails(order)}
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Eye className="w-5 h-5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
          {activeTab === 'invoices' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <div className="p-6 overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-gray-400 text-sm font-medium border-b border-gray-50">
                      <th className="pb-4 pl-4">Invoice #</th>
                      <th className="pb-4">Order ID</th>
                      <th className="pb-4">Customer</th>
                      <th className="pb-4">Date</th>
                      <th className="pb-4">Amount</th>
                      <th className="pb-4 text-right pr-4">Action</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {filteredData.orders.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-20 text-center text-gray-500">
                          No invoices found. Place an order to generate one.
                        </td>
                      </tr>
                    ) : (
                      filteredData.orders.filter(order => order?.id).map((order) => (
                        <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                          <td className="py-4 pl-4 font-bold text-gray-900">
                            INV-{order.id?.split('-').pop() || 'N/A'}
                          </td>
                          <td className="py-4 text-gray-600">{order.id}</td>
                          <td className="py-4 font-medium text-gray-900">{order.customerName}</td>
                          <td className="py-4 text-gray-600">
                            {new Date(order.date).toLocaleDateString('en-IN')}
                          </td>
                          <td className="py-4 font-bold text-gray-900">₹{(order?.total ?? 0).toLocaleString('en-IN')}</td>
                          <td className="py-4 text-right pr-4">
                            <button 
                              onClick={() => setSelectedInvoice(order)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="View Invoice"
                            >
                              <Eye className="w-5 h-5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
          {activeTab === 'activity' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-bold text-gray-900">Activity Log</h3>
                  <button 
                    onClick={() => {
                      setActivityLog([]);
                      localStorage.removeItem('admin_activity_log');
                    }}
                    className="text-sm text-red-600 font-bold hover:underline"
                  >
                    Clear All
                  </button>
                </div>
                <div className="space-y-6">
                  {activityLog.length === 0 ? (
                    <div className="py-20 text-center text-gray-500">
                      <History className="w-12 h-12 mx-auto mb-4 opacity-10" />
                      <p>No recent activity recorded.</p>
                    </div>
                  ) : (
                    activityLog.map((activity, idx) => (
                      <div key={activity.id} className="flex gap-4 relative">
                        {idx !== activityLog.length - 1 && (
                          <div className="absolute left-5 top-10 bottom-0 w-px bg-gray-100" />
                        )}
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                          activity.type === 'order' ? 'bg-blue-100 text-blue-600' :
                          activity.type === 'status' ? 'bg-green-100 text-green-600' :
                          'bg-purple-100 text-purple-600'
                        }`}>
                          {activity.icon === 'ShoppingCart' && <ShoppingCart className="w-5 h-5" />}
                          {activity.icon === 'Clock' && <Clock className="w-5 h-5" />}
                          {activity.icon === 'FileText' && <FileText className="w-5 h-5" />}
                        </div>
                        <div className="flex-1 pt-2">
                          <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(activity.timestamp).toLocaleString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      {/* Invoice Modal */}
      <AnimatePresence>
        {selectedInvoice && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
              onClick={() => setSelectedInvoice(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
                <h2 className="text-xl font-bold text-gray-900">Invoice: INV-{selectedInvoice.id?.split('-').pop() || 'N/A'}</h2>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => window.print()}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg border border-gray-200 text-sm font-bold"
                  >
                    <Printer className="w-4 h-4" /> Print
                  </button>
                  <button 
                    onClick={async () => {
                      if (invoiceRef.current) {
                        try {
                          addActivity('invoice', `Invoice PDF generated for Order ${selectedInvoice.id}`, 'FileText');
                          
                          const canvas = await html2canvas(invoiceRef.current, {
                            scale: 2,
                            useCORS: true,
                            logging: false,
                            backgroundColor: '#ffffff'
                          });
                          
                          const imgData = canvas.toDataURL('image/png');
                          const pdf = new jsPDF({
                            orientation: 'portrait',
                            unit: 'px',
                            format: [canvas.width / 2, canvas.height / 2]
                          });
                          
                          pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 2, canvas.height / 2);
                          pdf.save(`Invoice-${selectedInvoice.id.split('-').pop()}.pdf`);
                        } catch (error) {
                          console.error('Error generating PDF:', error);
                          // Fallback to print if library fails
                          window.print();
                        }
                      }
                    }}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700"
                  >
                    <Download className="w-4 h-4" /> Download PDF
                  </button>
                  <button onClick={() => setSelectedInvoice(null)} className="text-gray-400 hover:text-gray-600 pl-4 border-l border-gray-100">
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div ref={invoiceRef} className="p-12 overflow-y-auto bg-white invoice-print-area">
                <div className="flex justify-between mb-12">
                  <div>
                    <h1 className="text-3xl font-bold text-blue-600 mb-2">INTERCORP</h1>
                    <p className="text-gray-500 text-sm">Industrial Nutrition Solutions</p>
                    <p className="text-gray-500 text-sm">Gurugram, Haryana, India</p>
                  </div>
                  <div className="text-right">
                    <h2 className="text-2xl font-bold text-gray-900 mb-1 uppercase tracking-wider">Invoice</h2>
                    <p className="text-gray-600 font-bold">#INV-{selectedInvoice.id.split('-').pop()}</p>
                    <p className="text-gray-500 text-sm mt-4">Date: {new Date(selectedInvoice.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                    <p className="text-gray-500 text-sm">Order ID: {selectedInvoice.id}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-12 mb-12 border-t border-b border-gray-100 py-8">
                  <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase mb-4 tracking-widest">Bill To</h3>
                    <p className="text-lg font-bold text-gray-900">{selectedInvoice.customerName}</p>
                    <p className="text-gray-600 mt-1">{selectedInvoice.phone}</p>
                    <p className="text-gray-600">{selectedInvoice.email}</p>
                    <p className="text-gray-600 mt-2 whitespace-pre-wrap">{selectedInvoice.address}</p>
                    <p className="text-gray-600">Pincode: {selectedInvoice.pincode}</p>
                  </div>
                  <div className="text-right">
                    <h3 className="text-xs font-bold text-gray-400 uppercase mb-4 tracking-widest">Payment Info</h3>
                    <p className="text-gray-600">Method: <span className="font-bold text-gray-900">{selectedInvoice.paymentMethod}</span></p>
                    <p className="text-gray-600">Status: <span className="font-bold text-green-600 uppercase text-xs">{selectedInvoice.status}</span></p>
                  </div>
                </div>

                <table className="w-full mb-12">
                  <thead>
                    <tr className="border-b-2 border-gray-900">
                      <th className="text-left py-4 text-xs font-bold uppercase tracking-wider">Product</th>
                      <th className="text-right py-4 text-xs font-bold uppercase tracking-wider">Price</th>
                      <th className="text-right py-4 text-xs font-bold uppercase tracking-wider">Qty</th>
                      <th className="text-right py-4 text-xs font-bold uppercase tracking-wider">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedInvoice.items.map((item, idx) => (
                      <tr key={idx} className="border-b border-gray-100">
                        <td className="py-6">
                          <p className="font-bold text-gray-900">{item.name}</p>
                        </td>
                        <td className="text-right py-6 text-gray-600">₹{(item?.price ?? 0).toLocaleString('en-IN')}</td>
                        <td className="text-right py-6 text-gray-600">{item?.quantity ?? 0}</td>
                        <td className="text-right py-6 font-bold text-gray-900">₹{((item?.price ?? 0) * (item?.quantity ?? 0)).toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="flex justify-end mb-12">
                  <div className="w-64 space-y-3">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span>₹{(selectedInvoice?.items?.reduce((sum: number, item: any) => sum + ((item?.price ?? 0) * (item?.quantity ?? 0)), 0) ?? 0).toLocaleString('en-IN')}</span>
                    </div>
                    {((selectedInvoice as any)?.discount ?? 0) > 0 && (
                      <div className="flex justify-between text-green-600 font-bold">
                        <span>Loyalty Discount (15%)</span>
                        <span>-₹{((selectedInvoice as any)?.discount ?? 0).toLocaleString('en-IN')}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-gray-600">
                      <span>Tax (0%)</span>
                      <span>₹0</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold text-gray-900 pt-3 border-t-2 border-gray-900">
                      <span>Total</span>
                      <span>₹{(selectedInvoice?.total ?? 0).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-12 border-t border-gray-100 mt-12 text-center">
                  <p className="text-lg font-bold text-gray-900 mb-2">Thank you for your business!</p>
                  <p className="text-gray-500 text-sm">If you have any questions about this invoice, please contact support@intercorp.in</p>
                  <p className="text-[10px] text-gray-400 mt-8 italic">“This is a system-generated invoice”</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0">
              <h2 className="text-xl font-bold text-gray-900">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Product Name</label>
                  <input 
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    placeholder="Enter product name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                  <select 
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="human-nutrition">Human Nutrition</option>
                    <option value="animal-nutrition">Animal Nutrition</option>
                    <option value="consumer-products">Consumer Products</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Price (₹)</label>
                  <input 
                    name="price"
                    type="number"
                    required
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Stock Quantity</label>
                  <input 
                    name="stock"
                    type="number"
                    required
                    value={formData.stock}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Expiry Date</label>
                  <input 
                    name="expiryDate"
                    type="date"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Product Image</label>
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="h-full w-full object-contain p-2" />
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <p className="text-xs text-gray-500">Click to upload</p>
                      </div>
                    )}
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                  </label>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                  <textarea 
                    name="description"
                    required
                    rows={4}
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    placeholder="Enter product description..."
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 pt-6 border-t border-gray-100">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-6 py-3 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                >
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Success Toast */}
      {showToast && (
        <motion.div 
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          className="fixed bottom-8 right-8 z-[200] bg-green-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3"
        >
          <CheckCircle className="w-6 h-6" />
          <div className="font-bold">{toastMessage}</div>
        </motion.div>
      )}
      {/* Order Detail Modal */}
      {isOrderModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
            onClick={() => setIsOrderModalOpen(false)}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
                <p className="text-sm text-gray-500 font-medium mt-1">{selectedOrder.id}</p>
              </div>
              <button onClick={() => setIsOrderModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-50 rounded-lg">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-8 overflow-y-auto space-y-8">
              {/* Customer & Shipping */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Customer Details</h3>
                  <div className="space-y-3">
                    <p className="font-bold text-gray-900">{selectedOrder.customerName}</p>
                    <p className="text-sm text-gray-600 flex items-center gap-2">{selectedOrder.email}</p>
                    <p className="text-sm text-gray-600">{selectedOrder.phone}</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Shipping Address</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {selectedOrder.address}<br />
                    <span className="font-bold mt-1 inline-block">Pincode: {selectedOrder.pincode}</span>
                  </p>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Ordered Products</h3>
                <div className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-[10px] font-bold text-gray-400 uppercase border-b border-gray-200">
                        <th className="py-3 px-4">Item</th>
                        <th className="py-3 px-4">Qty</th>
                        <th className="py-3 px-4 text-right">Price</th>
                        <th className="py-3 px-4 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {selectedOrder.items.map((item, i) => (
                        <tr key={i} className="border-b border-gray-100 last:border-0">
                          <td className="py-4 px-4 font-bold text-gray-900">{item.name}</td>
                          <td className="py-4 px-4 text-gray-600">{item.quantity}</td>
                          <td className="py-4 px-4 text-gray-600 text-right">₹{item.price.toLocaleString('en-IN')}</td>
                          <td className="py-4 px-4 font-bold text-gray-900 text-right">₹{(item.price * item.quantity).toLocaleString('en-IN')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Summary */}
              <div className="flex flex-col items-end pt-6 border-t border-gray-100">
                <div className="w-full max-w-[240px] space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Subtotal</span>
                      <span className="font-bold text-gray-900">₹{(selectedOrder?.items?.reduce((sum: number, item: any) => sum + ((item?.price ?? 0) * (item?.quantity ?? 0)), 0) ?? 0).toLocaleString('en-IN')}</span>
                    </div>
                    {((selectedOrder as any)?.discount ?? 0) > 0 && (
                      <div className="flex justify-between text-sm text-green-600 font-bold">
                        <span>Loyalty Discount (15%)</span>
                        <span>-₹{((selectedOrder as any)?.discount ?? 0).toLocaleString('en-IN')}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Payment Method</span>
                      <span className="font-bold text-gray-900">{selectedOrder?.paymentMethod || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between text-lg pt-3 border-t border-gray-100 font-bold">
                      <span className="text-gray-900">Grand Total</span>
                      <span className="text-blue-600">₹{(selectedOrder?.total ?? 0).toLocaleString('en-IN')}</span>
                    </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-gray-400 uppercase">Current Status:</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  selectedOrder.status === 'Delivered' ? 'bg-green-100 text-green-700' : 
                  selectedOrder.status === 'Cancelled' ? 'bg-red-100 text-red-700' : 
                  'bg-blue-100 text-blue-700'
                }`}>
                  {selectedOrder.status}
                </span>
              </div>
              <button 
                onClick={() => setIsOrderModalOpen(false)}
                className="px-6 py-2.5 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-all"
              >
                Done
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
