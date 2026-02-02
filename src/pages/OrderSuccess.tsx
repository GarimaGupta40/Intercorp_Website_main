import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight, Package } from 'lucide-react';

export default function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const orderId = location.state?.orderId || 'ORD-UNKNOWN';

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center max-w-md"
      >
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 p-6 rounded-full">
            <CheckCircle2 className="w-20 h-20 text-green-500" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Order Success!</h1>
        <p className="text-gray-600 mb-8">
          Thank you for your purchase. Your order has been placed and is being processed.
        </p>

        <div className="bg-gray-50 rounded-2xl p-6 mb-8 text-left">
          <div className="flex justify-between mb-4">
            <span className="text-gray-500 font-medium">Order ID:</span>
            <span className="text-gray-900 font-bold">#{orderId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 font-medium">Status:</span>
            <span className="text-green-600 font-bold uppercase tracking-wide">Confirmed</span>
          </div>
        </div>

        <div className="space-y-3">
          <button 
            onClick={() => navigate('/shop')}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg"
          >
            Continue Shopping <ArrowRight className="w-5 h-5" />
          </button>
          <button 
            onClick={() => navigate('/orders')}
            className="w-full flex items-center justify-center gap-2 bg-white text-blue-600 border-2 border-blue-50 py-4 rounded-xl font-bold hover:bg-blue-50 transition-all"
          >
            <Package className="w-5 h-5" /> View Orders
          </button>
        </div>
      </motion.div>
    </div>
  );
}
