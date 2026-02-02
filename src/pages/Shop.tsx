import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Filter, Star, X } from 'lucide-react';
import { api } from '../utils/api';
import { getOrders } from '../data/products';
import ProductCard from '../components/ProductCard';

export default function Shop() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showLoyaltyReward, setShowLoyaltyReward] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    const loadProducts = async () => {
      try {
        if (isMounted) setLoading(true);
        const data = await api.get('products');
        if (isMounted && data) {
          setProducts(data);
        }
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadProducts();

    const handleAuth = () => {
      loadProducts();
    };
    window.addEventListener('auth_state_changed', handleAuth);

    const handleUpdate = () => {
      api.get('products').then(data => {
        if (isMounted && data) setProducts(data);
      });
    };
    window.addEventListener('products_updated', handleUpdate);
    
    // Check for loyalty reward
    const checkLoyalty = () => {
      const userEmail = localStorage.getItem('userEmail');
      const userName = localStorage.getItem('userName');
      if (userEmail) {
        const orders = getOrders();
        const customerName = userName || userEmail.split('@')[0];
        const count = orders.filter(o => o.customerName?.trim().toLowerCase() === customerName.trim().toLowerCase()).length;
        
        if (count >= 2) {
          const dismissedKey = `loyalty_reward_dismissed_${customerName.replace(/\s+/g, '_')}`;
          if (!localStorage.getItem(dismissedKey)) {
            setShowLoyaltyReward(true);
          }
        }
      }
    };
    checkLoyalty();

    return () => {
      isMounted = false;
      window.removeEventListener('products_updated', handleUpdate);
      window.removeEventListener('auth_state_changed', handleAuth);
    };
  }, []);

  const displayedProducts = selectedCategory
    ? products.filter((p) => p.category === selectedCategory)
    : products;

  const categories = [
    { id: 'human-nutrition', label: 'Human Nutrition', count: products.filter((p) => p.category === 'human-nutrition').length },
    { id: 'animal-nutrition', label: 'Animal Nutrition', count: products.filter((p) => p.category === 'animal-nutrition').length },
    { id: 'consumer-products', label: 'Consumer Products', count: products.filter((p) => p.category === 'consumer-products').length },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div>
      <section className="py-12 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence>
            {showLoyaltyReward && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                className="mb-8 p-6 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl shadow-xl text-white relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Star className="w-32 h-32" />
                </div>
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                      <Star className="w-8 h-8 text-yellow-300" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">Exclusive Loyalty Reward!</h3>
                      <p className="text-purple-100">Since you've completed 2 purchases, you're eligible for a 15% discount on your next order.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="px-6 py-3 bg-white text-purple-600 rounded-xl font-bold text-lg shadow-lg">
                      LOYALTY15
                    </div>
                    <button 
                      onClick={() => {
                        const userEmail = localStorage.getItem('userEmail');
                        const userName = localStorage.getItem('userName');
                        const customerName = userName || (userEmail ? userEmail.split('@')[0] : 'user');
                        localStorage.setItem(`loyalty_reward_dismissed_${customerName.replace(/\s+/g, '_')}`, 'true');
                        setShowLoyaltyReward(false);
                      }}
                      className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">Our Products</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Browse our complete range of nutrition solutions across all categories
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filters */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Filter className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">Filter by Category</h2>
            </div>

            <div className="flex flex-wrap gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(null)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  selectedCategory === null
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-600'
                }`}
              >
                All Products ({products.length})
              </motion.button>

              {categories.map((category) => (
                <motion.button
                  key={category.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                    selectedCategory === category.id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-600'
                  }`}
                >
                  {category.label} ({category.count})
                </motion.button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {displayedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </motion.div>

          {displayedProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-2xl text-gray-500 mb-4">No products found in this category</p>
              <button
                onClick={() => setSelectedCategory(null)}
                className="text-blue-600 hover:text-blue-700 font-semibold underline"
              >
                View all products
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
