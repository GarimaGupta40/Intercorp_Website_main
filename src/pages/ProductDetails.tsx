import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getProducts } from '../data/products';
import { Star, ShoppingCart, Heart, Shield, Truck, RotateCcw, MessageSquare, Send } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useState, useEffect } from 'react';
import { api } from '../utils/api';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [showAdded, setShowAdded] = useState(false);
  const [products, setProducts] = useState(getProducts());
  const [reviews, setReviews] = useState<any[]>([]);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    const handleUpdate = () => setProducts(getProducts());
    window.addEventListener('products_updated', handleUpdate);
    
    // Funnel tracking: Product Viewed
    const currentProduct = products.find(p => p.id === id);
    if (currentProduct) {
      const stats = JSON.parse(localStorage.getItem('intercorp_funnel_stats') || '{"views": 0, "carts": 0, "checkouts": 0}');
      stats.views += 1;
      localStorage.setItem('intercorp_funnel_stats', JSON.stringify(stats));
    }

    // Load reviews
    const loadReviews = async () => {
      const allReviews = await api.get('reviews') || [];
      setReviews(allReviews.filter((r: any) => r.productId === id));
    };
    loadReviews();

    // Check purchase status
    const checkPurchase = async () => {
      const userEmail = localStorage.getItem('userEmail');
      if (userEmail) {
        const orders = await api.get('orders') || [];
        const purchased = orders.some((order: any) => 
          order.email === userEmail && 
          (order.items?.some((item: any) => item.productId === id) || 
           order.products?.some((p: any) => p.productId === id))
        );
        setHasPurchased(purchased);
      }
    };
    checkPurchase();

    return () => window.removeEventListener('products_updated', handleUpdate);
  }, [id, products]);

  const product = products.find(p => p.id === id);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold">Product not found</h2>
        <button onClick={() => navigate('/shop')} className="mt-4 text-blue-600 underline">Back to Shop</button>
      </div>
    );
  }

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userEmail = localStorage.getItem('userEmail');
    const userName = localStorage.getItem('userName') || userEmail?.split('@')[0] || 'Anonymous';
    
    if (!userEmail) return;

    setSubmitting(true);
    try {
      const allReviews = await api.get('reviews') || [];
      const newReviewEntry = {
        reviewId: `rev-${Date.now()}`,
        productId: id,
        userId: userEmail,
        userName,
        rating: newReview.rating,
        comment: newReview.comment,
        date: new Date().toISOString()
      };
      
      const updatedReviews = [...allReviews, newReviewEntry];
      await api.post('reviews', updatedReviews);
      
      setReviews(prev => [...prev, newReviewEntry]);
      setNewReview({ rating: 5, comment: '' });
      alert('Review submitted successfully!');
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setShowAdded(true);
    setTimeout(() => setShowAdded(false), 2000);
  };

  const handleBuyNow = async () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userEmail = localStorage.getItem('userEmail');
    if (!isLoggedIn || !userEmail) {
      navigate('/login', { state: { from: `/product/${id}`, action: 'buy_now' } });
      return;
    }

    const buyData = {
      userId: userEmail,
      productId: product.id,
      quantity: quantity,
      totalPrice: product.price * quantity,
      paymentMode: 'COD',
      status: "initiated",
      timestamp: new Date().toISOString()
    };
    
    try {
      // Since buy.json was removed, we just use local storage for the buy now flow
      localStorage.setItem('intercorp_buynow_pending', JSON.stringify(buyData));
      navigate('/checkout', { state: { buyNow: true, t: Date.now() } });
    } catch (error) {
      console.error('Error initiating buy now:', error);
      addToCart(product, quantity);
      navigate('/checkout');
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden lg:flex">
          {/* Image Section */}
          <div className="lg:w-1/2 p-8">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-square rounded-xl overflow-hidden bg-gray-100"
            >
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              <button 
                onClick={() => toggleWishlist(product.id)}
                className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md transition-all ${
                  isInWishlist(product.id) ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-600 hover:text-red-500'
                }`}
              >
                <Heart className={`w-6 h-6 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
              </button>
            </motion.div>
          </div>

          {/* Info Section */}
          <div className="lg:w-1/2 p-8 lg:border-l border-gray-100">
            <nav className="flex mb-4 text-sm text-gray-500">
              <span className="hover:text-blue-600 cursor-pointer" onClick={() => navigate('/shop')}>Shop</span>
              <span className="mx-2">/</span>
              <span className="capitalize">{product.category.replace('-', ' ')}</span>
            </nav>

            <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center bg-green-100 text-green-700 px-2 py-1 rounded font-bold">
                {product.rating} <Star className="w-4 h-4 ml-1 fill-current" />
              </div>
              <span className="text-gray-500">{reviews.length} Customer Reviews</span>
            </div>

            <div className="mb-8">
              <span className="text-4xl font-bold text-blue-600">₹{product.price.toLocaleString('en-IN')}</span>
              <span className="ml-4 text-gray-400 line-through text-xl">₹{(product.price * 1.2).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
              <span className="ml-4 text-green-600 font-semibold text-lg">20% OFF</span>
            </div>

            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              {product.description}. This high-quality product is formulated to meet the highest industry standards, ensuring safety and efficacy for all our customers.
            </p>

            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <button onClick={() => setQuantity(q => Math.max(1, q-1))} className="px-4 py-2 hover:bg-gray-100">−</button>
                <input type="number" value={quantity} readOnly className="w-12 text-center focus:outline-none" />
                <button onClick={() => setQuantity(q => q+1)} className="px-4 py-2 hover:bg-gray-100">+</button>
              </div>
              <p className="text-sm text-gray-500">In Stock</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <button 
                onClick={handleAddToCart}
                className="flex items-center justify-center gap-2 bg-blue-50 text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-100 transition-all"
              >
                <ShoppingCart className="w-6 h-6" />
                Add to Cart
              </button>
              <button 
                onClick={handleBuyNow}
                className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all"
              >
                Buy Now
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 border-t border-gray-100 pt-8">
              <div className="flex flex-col items-center text-center">
                <Truck className="w-6 h-6 text-blue-600 mb-2" />
                <span className="text-xs font-semibold">Free Shipping</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <RotateCcw className="w-6 h-6 text-blue-600 mb-2" />
                <span className="text-xs font-semibold">7 Days Return</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <Shield className="w-6 h-6 text-blue-600 mb-2" />
                <span className="text-xs font-semibold">Secure Payment</span>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12 space-y-8">
          {/* Review Form */}
          {hasPurchased && (
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-blue-50">
              <div className="flex items-center gap-3 mb-6">
                <MessageSquare className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold">Write a Review</h2>
              </div>
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="font-semibold text-gray-700">Rating:</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                        className="focus:outline-none"
                      >
                        <Star 
                          className={`w-6 h-6 ${star <= newReview.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <textarea
                    required
                    value={newReview.comment}
                    onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                    placeholder="Share your experience with this product..."
                    className="w-full h-32 p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            </div>
          )}

          {/* Reviews List */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-8">Customer Reviews</h2>
            {reviews.length > 0 ? (
              <div className="space-y-6">
                {reviews.map((rev) => (
                  <div key={rev.reviewId} className="border-b border-gray-100 pb-6 last:border-0">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex bg-green-500 text-white text-xs px-1.5 py-0.5 rounded">
                        {rev.rating} <Star className="w-3 h-3 ml-0.5 fill-current" />
                      </div>
                      <span className="font-bold text-gray-900">{rev.userName}</span>
                      <span className="text-gray-400 text-sm ml-auto">
                        {new Date(rev.date).toLocaleDateString(undefined, { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </span>
                    </div>
                    <p className="text-gray-600">{rev.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p className="text-xl">No reviews yet. {hasPurchased ? 'Be the first to review!' : ''}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showAdded && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-8 right-8 z-50 bg-green-600 text-white px-8 py-4 rounded-xl shadow-2xl flex items-center gap-3"
        >
          <ShoppingCart className="w-6 h-6" />
          <span className="font-bold">Added to cart successfully!</span>
        </motion.div>
      )}
    </div>
  );
}
