import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, MapPin, Phone, Shield, CreditCard, ChevronRight, Camera, Ticket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { hasActiveCoupon } from '../data/products';

export default function Account() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState({ name: 'Customer', email: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', email: '' });
  const [showToast, setShowToast] = useState(false);
  const [hasCoupon, setHasCoupon] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('isLoggedIn') !== 'true') {
      navigate('/login');
    } else {
      setIsLoggedIn(true);
      const email = localStorage.getItem('userEmail') || '';
      const name = localStorage.getItem('userName') || (email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1));
      setUserData({ name, email });
      setEditForm({ name, email });
      setHasCoupon(hasActiveCoupon(email));
    }
  }, [navigate]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('userName', editForm.name);
    localStorage.setItem('userEmail', editForm.email);
    setUserData({ name: editForm.name, email: editForm.email });
    setIsEditing(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
    // Notify other components (like Navbar)
    window.dispatchEvent(new Event('storage'));
  };

  if (!isLoggedIn) return null;

  const sections = [
    { icon: MapPin, title: "My Addresses", desc: "Manage shipping addresses" },
    { icon: CreditCard, title: "Payment Methods", desc: "Cards and UPI details" },
    { icon: Shield, title: "Login & Security", desc: "Password and 2FA settings" },
    { icon: Phone, title: "Communication Preferences", desc: "Emails and notifications" },
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Account Settings</h1>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700 relative">
            <button className="absolute bottom-[-40px] left-8 w-24 h-24 rounded-full border-4 border-white bg-white shadow-lg overflow-hidden group">
              <div className="w-full h-full bg-blue-100 flex items-center justify-center text-blue-600">
                <User className="w-10 h-10" />
              </div>
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera className="w-6 h-6 text-white" />
              </div>
            </button>
          </div>
          
          <div className="pt-14 pb-8 px-8">
            <div className="flex flex-wrap justify-between items-start gap-4">
              {isEditing ? (
                <form onSubmit={handleSaveProfile} className="flex-1 max-w-md space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
                    <input 
                      type="text" 
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
                    <input 
                      type="email" 
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                      required
                    />
                  </div>
                  <div className="flex gap-2">
                    <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors">
                      Save Changes
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-2 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{userData.name}</h2>
                    <div className="flex items-center gap-2 text-gray-500 mt-1">
                      <Mail className="w-4 h-4" />
                      <span>{userData.email}</span>
                    </div>
                    {hasCoupon && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-xl border border-green-100"
                      >
                        <Ticket className="w-4 h-4" />
                        <span className="text-sm font-bold">15% Loyalty Coupon Available!</span>
                      </motion.div>
                    )}
                  </div>
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-2.5 bg-blue-50 text-blue-600 rounded-xl font-bold hover:bg-blue-100 transition-colors"
                  >
                    Edit Profile
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Toast Notification */}
        <AnimatePresence>
          {showToast && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-2xl shadow-xl z-50 flex items-center gap-2"
            >
              <Shield className="w-5 h-5 text-green-400" />
              <span className="font-bold">Profile updated successfully!</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sections.map((section, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm cursor-pointer group hover:border-blue-200 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-50 rounded-xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <section.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{section.title}</h3>
                    <p className="text-xs text-gray-500 mt-1">{section.desc}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-600 transition-colors" />
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 bg-red-50 p-8 rounded-3xl border border-red-100 text-center">
          <h3 className="text-xl font-bold text-red-900 mb-2">Danger Zone</h3>
          <p className="text-red-600 text-sm mb-6">Once you delete your account, there is no going back. Please be certain.</p>
          <button className="px-8 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-100">
            Delete My Account
          </button>
        </div>
      </div>
    </div>
  );
}
