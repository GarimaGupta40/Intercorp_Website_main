import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Truck, Calendar, ChevronRight, ShoppingBag, FileText, Download, X, Building2, Printer } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import { api } from '../utils/api';

interface Order {
  id: string;
  date: string;
  total: number;
  status: string;
  items: any[];
  customerName: string;
  email: string;
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Order | null>(null);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const invoiceRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const userEmail = localStorage.getItem('userEmail');
        const allOrders = await api.get('orders') || [];
        
        // Filter orders for the current user
        const customerOrders = allOrders.filter((order: any) => 
          order.email === userEmail
        );
        setOrders(customerOrders.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const downloadPDF = async (order: Order) => {
    if (invoiceRef.current) {
      try {
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
        pdf.save(`Invoice-${order.id.split('-').pop()}.pdf`);
      } catch (error) {
        console.error('Error generating PDF:', error);
        window.print();
      }
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
            <p className="text-gray-500 mt-1">Check the status of your recent orders</p>
          </div>
          <button 
            onClick={() => navigate('/shop')}
            className="flex items-center gap-2 text-blue-600 font-bold hover:underline"
          >
            <ShoppingBag className="w-5 h-5" /> Continue Shopping
          </button>
        </div>

        {loading ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"
            />
            <p className="text-gray-500">Loading your orders...</p>
          </div>
        ) : orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map((order) => (
              <motion.div 
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex flex-wrap justify-between items-start gap-4 mb-6 pb-6 border-b border-gray-50">
                    <div className="flex gap-4">
                      <div className="bg-blue-50 p-3 rounded-xl">
                        <Package className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Order ID</p>
                        <p className="font-bold text-gray-900">#{order.id}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Date Placed</p>
                      <div className="flex items-center gap-1 text-gray-900 font-semibold">
                        <Calendar className="w-4 h-4" />
                        {new Date(order.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Amount</p>
                      <p className="text-blue-600 font-extrabold text-lg">₹{order.total.toLocaleString('en-IN')}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Status</p>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 mt-1">
                        <Truck className="w-3 h-3 mr-1" /> Shipped
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-lg bg-gray-50 overflow-hidden flex-shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-grow">
                          <h4 className="font-bold text-gray-900 text-sm">{item.name}</h4>
                          <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-bold text-gray-900">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 flex justify-end gap-3">
                    <button 
                      onClick={() => setSelectedInvoice(order)}
                      className="flex items-center gap-2 text-sm font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <FileText className="w-4 h-4" /> View Invoice
                    </button>
                    <button 
                      onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                      className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      {expandedOrder === order.id ? 'Hide Details' : 'View Details'} 
                      <motion.div
                        animate={{ rotate: expandedOrder === order.id ? 90 : 0 }}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </motion.div>
                    </button>
                  </div>

                  <AnimatePresence>
                    {expandedOrder === order.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-8 mt-8 border-t border-gray-50 grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div>
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Shipping Details</h4>
                            <div className="bg-gray-50 p-4 rounded-xl space-y-2">
                              <p className="text-sm text-gray-900 font-bold">{order.customerName}</p>
                              <p className="text-sm text-gray-600">{(order as any).address || 'Address provided at checkout'}</p>
                              <p className="text-sm text-gray-600 font-medium">Pincode: {(order as any).pincode || 'N/A'}</p>
                            </div>
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Payment Summary</h4>
                            <div className="bg-gray-50 p-4 rounded-xl space-y-3">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Subtotal</span>
                                <span className="font-bold text-gray-900">₹{(order.items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0)).toLocaleString('en-IN')}</span>
                              </div>
                              {(order as any).discount > 0 && (
                                <div className="flex justify-between text-sm text-green-600 font-bold">
                                  <span>Loyalty Discount (15%)</span>
                                  <span>-₹{(order as any).discount.toLocaleString('en-IN')}</span>
                                </div>
                              )}
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Payment Method</span>
                                <span className="font-bold text-gray-900">{(order as any).paymentMethod || 'Credit/Debit Card'}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Shipping</span>
                                <span className="font-bold text-green-600">FREE</span>
                              </div>
                              <div className="flex justify-between text-sm pt-2 border-t border-gray-200">
                                <span className="text-gray-900 font-bold">Total Paid</span>
                                <span className="font-black text-blue-600 text-base">₹{order.total.toLocaleString('en-IN')}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-10 h-10 text-gray-300" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No orders yet</h2>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto">Looks like you haven't placed any orders yet. Explore our products and start shopping!</p>
            <button 
              onClick={() => navigate('/shop')}
              className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
            >
              Start Shopping
            </button>
          </div>
        )}
      </div>

      {/* Invoice Modal */}
      <AnimatePresence>
        {selectedInvoice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0">
                <div className="flex items-center gap-4">
                  <h3 className="text-xl font-bold text-gray-900">Invoice Details</h3>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                    #{selectedInvoice.id.split('-').pop()}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => window.print()}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg border border-gray-200 text-sm font-bold"
                  >
                    <Printer className="w-4 h-4" /> Print
                  </button>
                  <button 
                    onClick={() => downloadPDF(selectedInvoice)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700"
                  >
                    <Download className="w-4 h-4" /> Download PDF
                  </button>
                  <button onClick={() => setSelectedInvoice(null)} className="text-gray-400 hover:text-gray-600 pl-4 border-l border-gray-100">
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-8 bg-gray-50/50">
                <div ref={invoiceRef} className="bg-white p-12 shadow-sm max-w-[210mm] mx-auto min-h-[297mm]">
                  {/* Invoice Branding */}
                  <div className="flex justify-between items-start mb-12">
                    <div>
                      <div className="flex items-center gap-2 text-blue-600 font-bold text-2xl mb-4">
                        <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-2 rounded-lg">
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
                      </div>
                      <div className="text-sm text-gray-500">
                        <p>123 Nutrition Lane, Industrial Area</p>
                        <p>Phase II, Mumbai, Maharashtra 400001</p>
                        <p>GSTIN: 27AAAAA0000A1Z5</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <h2 className="text-4xl font-black text-gray-900 mb-2 uppercase tracking-tighter">INVOICE</h2>
                      <p className="text-gray-600 font-bold">#INV-{selectedInvoice.id.split('-').pop()}</p>
                      <div className="mt-4 text-sm text-gray-500">
                        <p>Date: {new Date(selectedInvoice.date).toLocaleDateString('en-IN')}</p>
                        <p>Due Date: Upon Receipt</p>
                      </div>
                    </div>
                  </div>

                  {/* Bill To */}
                  <div className="grid grid-cols-2 gap-12 mb-12">
                    <div>
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Bill To</h4>
                      <div className="text-gray-900">
                        <p className="font-bold text-lg">{selectedInvoice.customerName}</p>
                        <p className="text-gray-600">Customer ID: {selectedInvoice.id.split('-')[0]}</p>
                        {/* Use dummy address as we don't store it in basic order data yet */}
                        <p className="text-gray-500 mt-2 italic text-sm">Delivery Address provided at checkout</p>
                      </div>
                    </div>
                    <div className="bg-blue-50/50 p-6 rounded-2xl">
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Payment Info</h4>
                      <div className="text-sm">
                        <p className="text-gray-900 font-bold mb-1">Status: {selectedInvoice.status.toUpperCase()}</p>
                        <p className="text-gray-600">Method: {selectedInvoice.paymentMethod}</p>
                      </div>
                    </div>
                  </div>

                  {/* Items Table */}
                  <table className="w-full mb-12">
                    <thead>
                      <tr className="border-b-2 border-gray-900">
                        <th className="py-4 text-left text-sm font-black text-gray-900 uppercase tracking-wider">Description</th>
                        <th className="py-4 text-center text-sm font-black text-gray-900 uppercase tracking-wider">Qty</th>
                        <th className="py-4 text-right text-sm font-black text-gray-900 uppercase tracking-wider">Price</th>
                        <th className="py-4 text-right text-sm font-black text-gray-900 uppercase tracking-wider">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {selectedInvoice.items.map((item: any, idx: number) => (
                        <tr key={idx}>
                          <td className="py-6">
                            <p className="font-bold text-gray-900">{item.name}</p>
                            <p className="text-xs text-gray-500 mt-1">Product ID: {item.id || 'N/A'}</p>
                          </td>
                          <td className="py-6 text-center text-gray-900 font-bold">{item.quantity}</td>
                          <td className="py-6 text-right text-gray-900">₹{item.price.toLocaleString('en-IN')}</td>
                          <td className="py-6 text-right text-gray-900 font-bold">₹{(item.price * item.quantity).toLocaleString('en-IN')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Summary */}
                  <div className="flex justify-end">
                    <div className="w-80 space-y-3">
                      <div className="flex justify-between text-gray-600">
                        <span>Subtotal</span>
                        <span>₹{(selectedInvoice.items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0)).toLocaleString('en-IN')}</span>
                      </div>
                      {(selectedInvoice as any).discount > 0 && (
                        <div className="flex justify-between text-green-600 font-bold">
                          <span className="flex items-center gap-1">Loyalty Discount (15%)</span>
                          <span>-₹{(selectedInvoice as any).discount.toLocaleString('en-IN')}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-gray-600">
                        <span>GST (Included)</span>
                        <span>₹0.00</span>
                      </div>
                      <div className="flex justify-between pt-3 border-t-2 border-gray-900 text-xl font-black text-gray-900">
                        <span>TOTAL</span>
                        <span>₹{selectedInvoice.total.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="mt-24 pt-12 border-t border-gray-100 text-center">
                    <p className="text-gray-900 font-bold mb-1">Thank you for choosing INTERCORP Precision Nutrition</p>
                    <p className="text-gray-400 text-xs">For any queries regarding this invoice, please contact support@intercorp.in</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
