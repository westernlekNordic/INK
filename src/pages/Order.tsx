import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { Upload, ShoppingBag, CheckCircle2 } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

const productTypes = [
  { id: 'tshirt', name: 'T-Shirt', basePrice: 20, hasSize: true },
  { id: 'mug', name: 'Mug', basePrice: 15, hasSize: false },
  { id: 'cap', name: 'Cap', basePrice: 18, hasSize: false },
  { id: 'flyer', name: 'Flyers (100 units)', basePrice: 50, hasSize: false },
];

const sizes = ['S', 'M', 'L', 'XL', 'XXL'];

export default function Order() {
  const [searchParams] = useSearchParams();
  const initialProduct = searchParams.get('product') || 'tshirt';

  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    phone: '',
    productType: initialProduct,
    size: 'M',
    quantity: 1,
    specialInstructions: '',
  });

  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const selectedProduct = productTypes.find((p) => p.id === formData.productType) || productTypes[0];
  const totalPrice = selectedProduct.basePrice * formData.quantity;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const validTypes = ['image/png', 'image/jpeg', 'application/pdf', 'image/svg+xml', 'application/postscript'];
      if (!validTypes.includes(selectedFile.type)) {
        setError('Invalid file format. Please upload PNG, JPG, PDF, AI, or SVG.');
        return;
      }
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB.');
        return;
      }
      setFile(selectedFile);
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // In a real app, we would upload the file to Firebase Storage here
      // and get the download URL. For this prototype, we'll store metadata.
      const fileMetadata = file ? `${file.name} (${(file.size / 1024).toFixed(2)} KB)` : 'No file uploaded';

      await addDoc(collection(db, 'orders'), {
        ...formData,
        quantity: Number(formData.quantity),
        fileMetadata,
        status: 'pending',
        createdAt: new Date().toISOString(),
      });

      setIsSuccess(true);
      setFormData({
        customerName: '',
        email: '',
        phone: '',
        productType: 'tshirt',
        size: 'M',
        quantity: 1,
        specialInstructions: '',
      });
      setFile(null);
    } catch (err) {
      console.error('Error submitting order:', err);
      setError('Failed to submit order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl text-center"
        >
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100 mb-6">
            <CheckCircle2 className="h-10 w-10 text-emerald-600" />
          </div>
          <h2 className="text-3xl font-bold text-zinc-900 mb-4">Order Received!</h2>
          <p className="text-zinc-600 mb-8">
            Thank you for your order. We've received your details and will begin processing shortly. We'll contact you if we need any more information.
          </p>
          <button
            onClick={() => setIsSuccess(false)}
            className="w-full bg-indigo-600 text-white rounded-xl py-3 font-semibold hover:bg-indigo-700 transition-colors"
          >
            Place Another Order
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-zinc-900 mb-4">Place Your Order</h1>
          <p className="text-lg text-zinc-600">
            Customize your order details below. Upload your design and we'll handle the rest.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-zinc-100 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3">
            {/* Order Summary Sidebar */}
            <div className="bg-zinc-900 text-white p-8 md:col-span-1 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5" /> Order Summary
                </h3>
                <div className="space-y-4 text-sm text-zinc-300">
                  <div className="flex justify-between border-b border-zinc-700 pb-2">
                    <span>Product</span>
                    <span className="font-medium text-white">{selectedProduct.name}</span>
                  </div>
                  {selectedProduct.hasSize && (
                    <div className="flex justify-between border-b border-zinc-700 pb-2">
                      <span>Size</span>
                      <span className="font-medium text-white">{formData.size}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-b border-zinc-700 pb-2">
                    <span>Quantity</span>
                    <span className="font-medium text-white">{formData.quantity}</span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-700 pb-2">
                    <span>Base Price</span>
                    <span className="font-medium text-white">${selectedProduct.basePrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-zinc-700">
                <div className="flex justify-between items-end">
                  <span className="text-zinc-400">Total Estimated</span>
                  <span className="text-3xl font-bold text-white">${totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="p-8 md:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-2">Full Name *</label>
                    <input
                      type="text"
                      name="customerName"
                      required
                      value={formData.customerName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-2">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-2">Product Type *</label>
                    <select
                      name="productType"
                      value={formData.productType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white"
                    >
                      {productTypes.map((p) => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  {selectedProduct.hasSize && (
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-2">Size *</label>
                      <select
                        name="size"
                        value={formData.size}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white"
                      >
                        {sizes.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">Quantity *</label>
                  <input
                    type="number"
                    name="quantity"
                    min="1"
                    required
                    value={formData.quantity}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">Upload Design (Optional)</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-zinc-300 border-dashed rounded-xl hover:bg-zinc-50 transition-colors cursor-pointer relative">
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-12 w-12 text-zinc-400" />
                      <div className="flex text-sm text-zinc-600 justify-center">
                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                          <span>Upload a file</span>
                          <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".png,.jpg,.jpeg,.pdf,.ai,.svg" />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-zinc-500">PNG, JPG, PDF, AI, SVG up to 5MB</p>
                      {file && <p className="text-sm font-medium text-emerald-600 mt-2">Selected: {file.name}</p>}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">Special Instructions</label>
                  <textarea
                    name="specialInstructions"
                    rows={3}
                    value={formData.specialInstructions}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="Any specific details about placement, colors, etc."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-indigo-600 text-white rounded-xl py-4 font-bold text-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/30 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Processing...' : 'Complete Order'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
