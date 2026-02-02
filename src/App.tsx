import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import HumanNutrition from './pages/HumanNutrition';
import AnimalNutrition from './pages/AnimalNutrition';
import Poultry from './pages/Poultry';
import Livestock from './pages/Livestock';
import Aquaculture from './pages/Aquaculture';
import ConsumerProducts from './pages/ConsumerProducts';
import Contact from './pages/Contact';
import Shop from './pages/Shop';
import Cart from './pages/Cart';
import ProductDetails from './pages/ProductDetails';
import Login from './pages/Login';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Wishlist from './pages/Wishlist';
import Orders from './pages/Orders';
import Account from './pages/Account';
import AdminDashboard from './pages/AdminDashboard';

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const [authState, setAuthState] = React.useState({
    isReady: false,
    isAuthorized: false
  });

  React.useLayoutEffect(() => {
    const checkAuth = () => {
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      const userRole = localStorage.getItem('userRole');
      const userEmail = localStorage.getItem('userEmail');
      
      const isAdmin = (isLoggedIn && userRole === 'admin') || (isLoggedIn && userEmail === 'admin@intercorp.in');
      
      setAuthState(prev => {
        if (prev.isReady && prev.isAuthorized === isAdmin) return prev;
        return {
          isReady: true,
          isAuthorized: isAdmin
        };
      });
    };

    checkAuth();
    
    // Aggressive polling to catch storage persistence
    const timers = [0, 5, 10, 25, 50, 100, 200, 500].map(ms => setTimeout(checkAuth, ms));

    window.addEventListener('auth_state_changed', checkAuth);
    window.addEventListener('storage', checkAuth);
    window.addEventListener('focus', checkAuth);
    
    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener('auth_state_changed', checkAuth);
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('focus', checkAuth);
    };
  }, []);

  if (!authState.isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  
  if (!authState.isAuthorized) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <CartProvider>
      <Router>
        <AppContent />
      </Router>
    </CartProvider>
  );
}

function AppContent() {
  const [authState, setAuthState] = React.useState({
    isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
    userRole: localStorage.getItem('userRole')
  });

  React.useEffect(() => {
    const handleAuthChange = () => {
      setAuthState({
        isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
        userRole: localStorage.getItem('userRole')
      });
    };

    window.addEventListener('auth_state_changed', handleAuthChange);
    return () => window.removeEventListener('auth_state_changed', handleAuthChange);
  }, []);

  console.log('App auth state:', authState);

  return (
    <div className="flex flex-col min-h-screen">
      <Routes>
        {/* Admin Routes - No Navbar/Footer */}
        <Route path="/admin/dashboard" element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        } />

        {/* Public Routes with Navbar/Footer */}
        <Route path="*" element={
          <>
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/human-nutrition" element={<HumanNutrition />} />
                <Route path="/animal-nutrition" element={<AnimalNutrition />} />
                <Route path="/animal-nutrition/poultry" element={<Poultry />} />
                <Route path="/animal-nutrition/livestock" element={<Livestock />} />
                <Route path="/animal-nutrition/aquaculture" element={<Aquaculture />} />
                <Route path="/consumer-products" element={<ConsumerProducts />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/login" element={<Login />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-success" element={<OrderSuccess />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/account" element={<Account />} />
              </Routes>
            </main>
            <Footer />
          </>
        } />
      </Routes>
    </div>
  );
}

export default App;
