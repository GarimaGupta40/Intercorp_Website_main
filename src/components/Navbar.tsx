import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ChevronDown, Menu, X, ShoppingCart, Building2, Heart, User, LogOut, Package, Settings, LayoutDashboard } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const { getTotalItems, wishlist } = useCart();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileAnimalOpen, setIsMobileAnimalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('Customer');
  const totalItems = getTotalItems();
  const navigate = useNavigate();

  useEffect(() => {
    const checkLogin = () => {
      const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
      const role = localStorage.getItem('userRole');
      setIsLoggedIn(loggedIn);
      
      if (loggedIn) {
        if (role === 'admin') {
          setUserName('Admin');
          return;
        }
        const savedEmail = localStorage.getItem('userEmail');
        const savedName = localStorage.getItem('userName');
        
        if (savedName) {
          setUserName(savedName);
        } else if (savedEmail) {
          const namePart = savedEmail.split('@')[0];
          const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
          setUserName(formattedName);
        } else {
          setUserName('Customer');
        }
      } else {
        setUserName('Sign In');
      }
    };
    checkLogin();

    // Listen for storage changes AND a custom event for immediate updates
    const handleUpdate = () => checkLogin();
    window.addEventListener('storage', handleUpdate);
    window.addEventListener('auth_state_changed', handleUpdate);

    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('auth_state_changed', handleUpdate);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    setIsLoggedIn(false);
    setIsProfileOpen(false);
    // Dispatch events to notify the component itself and others
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new Event('auth_state_changed'));
    navigate('/');
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">

          {/* LOGO - Shifted left */}
          <Link to="/" className="flex items-center gap-2 group flex-shrink-0 transition-transform hover:scale-[1.02]">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-2 rounded-lg shadow-blue-200 shadow-lg">
              <Building2 className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-xl font-black bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent tracking-tighter">
                INTERCORP
              </span>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                Precision
              </span>
            </div>
          </Link>

          {/* Navigation Links - Centered */}
          <div className="hidden lg:flex items-center justify-center flex-1 px-8">
            <div className="flex items-center space-x-1 bg-gray-50/50 p-1 rounded-full border border-gray-100">
              <Link to="/" className="text-gray-600 hover:text-blue-600 hover:bg-white hover:shadow-sm px-4 py-2 rounded-full text-sm font-semibold transition-all">
                Home
              </Link>
              <Link to="/about" className="text-gray-600 hover:text-blue-600 hover:bg-white hover:shadow-sm px-4 py-2 rounded-full text-sm font-semibold transition-all">
                About
              </Link>
              <Link to="/human-nutrition" className="text-gray-600 hover:text-blue-600 hover:bg-white hover:shadow-sm px-4 py-2 rounded-full text-sm font-semibold transition-all">
                Human Nutrition
              </Link>

              {/* Animal Nutrition Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setIsDropdownOpen(true)}
                onMouseLeave={() => setIsDropdownOpen(false)}
              >
                <div className="flex items-center px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-white hover:shadow-sm rounded-full text-sm font-semibold transition-all cursor-pointer">
                  <span>Animal Nutrition</span>
                  <ChevronDown className={`w-3.5 h-3.5 ml-1 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </div>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-52 bg-white rounded-2xl shadow-xl py-2 border border-gray-100 z-50 overflow-hidden"
                    >
                      <Link to="/animal-nutrition/poultry" className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors font-medium">
                        Poultry Nutrition
                      </Link>
                      <Link to="/animal-nutrition/livestock" className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors font-medium">
                        Livestock Solutions
                      </Link>
                      <Link to="/animal-nutrition/aquaculture" className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors font-medium">
                        Aquaculture Care
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link to="/consumer-products" className="text-gray-600 hover:text-blue-600 hover:bg-white hover:shadow-sm px-4 py-2 rounded-full text-sm font-semibold transition-all">
                Consumer Products
              </Link>
              <Link to="/shop" className="text-gray-600 hover:text-blue-600 hover:bg-white hover:shadow-sm px-4 py-2 rounded-full text-sm font-semibold transition-all">
                Shop
              </Link>
            </div>
          </div>

          {/* Action Buttons - Right Aligned */}
          <div className="flex items-center gap-1.5 sm:gap-3 ml-auto">
            {/* Wishlist */}
            <Link to="/wishlist" className="relative p-2 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-full transition-all group">
              <Heart className={`w-5 h-5 sm:w-6 sm:h-6 ${wishlist.length > 0 ? 'fill-red-50 text-red-500' : ''}`} />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-[9px] font-black rounded-full min-w-[16px] h-4 flex items-center justify-center border-2 border-white">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link to="/cart" className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
              {totalItems > 0 && (
                <span className="absolute top-1 right-1 bg-blue-600 text-white text-[9px] font-black rounded-full min-w-[16px] h-4 flex items-center justify-center border-2 border-white pointer-events-none">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Profile / Login */}
            <div className="h-8 w-[1px] bg-gray-200 mx-1 hidden sm:block"></div>

            {isLoggedIn ? (
              <div className="relative" onMouseEnter={() => setIsProfileOpen(true)} onMouseLeave={() => setIsProfileOpen(false)}>
                <button 
                  onClick={() => navigate(localStorage.getItem('userRole') === 'admin' ? '/admin/dashboard' : '/account')}
                  className="flex items-center gap-2 p-1 pl-1 pr-3 rounded-full border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all shadow-sm"
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white shadow-sm ${localStorage.getItem('userRole') === 'admin' ? 'bg-indigo-600' : 'bg-blue-600'}`}>
                    <User className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-gray-700 hidden sm:block">{userName}</span>
                  <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-2xl py-2 border border-gray-100 z-50 overflow-hidden"
                    >
                      <div className="px-5 py-4 border-b border-gray-50 bg-gray-50/50">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white shadow-inner ${localStorage.getItem('userRole') === 'admin' ? 'bg-indigo-600' : 'bg-blue-600'}`}>
                            <User className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-sm font-black text-gray-900 leading-none mb-1">{userName}</p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                              {localStorage.getItem('userRole') === 'admin' ? 'Administrator' : 'Verified Customer'}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-1.5 space-y-1">
                        {localStorage.getItem('userRole') === 'admin' ? (
                          <Link to="/admin/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-colors font-semibold">
                            <LayoutDashboard className="w-4 h-4" /> Admin Dashboard
                          </Link>
                        ) : (
                          <>
                            <Link to="/orders" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors font-semibold">
                              <Package className="w-4 h-4" /> My Orders
                            </Link>
                            <Link to="/account" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors font-semibold">
                              <Settings className="w-4 h-4" /> Profile Settings
                            </Link>
                          </>
                        )}
                        
                        <div className="h-px bg-gray-100 my-1 mx-2"></div>
                        
                        <button 
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-colors font-semibold"
                        >
                          <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-blue-600 text-white px-5 sm:px-7 py-2 sm:py-2.5 rounded-full font-bold hover:bg-blue-700 transition-all text-xs sm:text-sm shadow-md shadow-blue-100 active:scale-95 flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                <span>{userName}</span>
              </Link>
            )}

            {/* Mobile Toggle */}
            <button className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-full" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden overflow-hidden bg-white border-t border-gray-100"
            >
              <div className="space-y-1 py-6 px-4">
                <Link to="/" className="block px-4 py-3 text-gray-700 font-bold hover:bg-blue-50 rounded-xl" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
                <Link to="/about" className="block px-4 py-3 text-gray-700 font-bold hover:bg-blue-50 rounded-xl" onClick={() => setIsMobileMenuOpen(false)}>About</Link>
                <Link to="/human-nutrition" className="block px-4 py-3 text-gray-700 font-bold hover:bg-blue-50 rounded-xl" onClick={() => setIsMobileMenuOpen(false)}>Human Nutrition</Link>
                
                <div className="py-2">
                  <div className="flex justify-between items-center px-4 py-2 rounded-xl hover:bg-blue-50 cursor-pointer" onClick={() => setIsMobileAnimalOpen(!isMobileAnimalOpen)}>
                    <span className="text-gray-700 font-bold">Animal Nutrition</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isMobileAnimalOpen ? 'rotate-180' : ''}`} />
                  </div>
                  <AnimatePresence>
                    {isMobileAnimalOpen && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="pl-8 mt-1 space-y-1 border-l-2 border-blue-100 ml-6 overflow-hidden"
                      >
                        <Link to="/animal-nutrition/poultry" className="block py-2 text-gray-600 text-sm font-medium" onClick={() => setIsMobileMenuOpen(false)}>Poultry Nutrition</Link>
                        <Link to="/animal-nutrition/livestock" className="block py-2 text-gray-600 text-sm font-medium" onClick={() => setIsMobileMenuOpen(false)}>Livestock Solutions</Link>
                        <Link to="/animal-nutrition/aquaculture" className="block py-2 text-gray-600 text-sm font-medium" onClick={() => setIsMobileMenuOpen(false)}>Aquaculture Care</Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <Link to="/consumer-products" className="block px-4 py-3 text-gray-700 font-bold hover:bg-blue-50 rounded-xl" onClick={() => setIsMobileMenuOpen(false)}>Consumer Products</Link>
                <Link to="/shop" className="block px-4 py-3 text-gray-700 font-bold hover:bg-blue-50 rounded-xl" onClick={() => setIsMobileMenuOpen(false)}>Shop</Link>
              </div>

              <div className="px-4 pb-8 space-y-4">
                {isLoggedIn ? (
                  <div className="grid grid-cols-2 gap-3">
                    <Link to="/orders" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center gap-2 bg-gray-50 py-3 rounded-xl font-bold text-gray-700 text-sm">
                      <Package className="w-4 h-4" /> Orders
                    </Link>
                    <button onClick={handleLogout} className="flex items-center justify-center gap-2 bg-red-50 py-3 rounded-xl font-bold text-red-600 text-sm">
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                ) : (
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="block w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-center shadow-lg shadow-blue-100">
                    Sign In / Create Account
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
