import { useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, FileText } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function RequestQuote() {
  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    phone: '',
    serviceType: 'custom_apparel',
    quantity: 50,
    description: '',
  });

  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const fileMetadata = file ? `${file.name} (${(file.size / 1024).toFixed(2)} KB)` : 'No file uploaded';

      await addDoc(collection(db, 'quotes'), {
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
        serviceType: 'custom_apparel',
        quantity: 50,
        description: '',
      });
      setFile(null);
    } catch (err) {
      console.error('Error submitting quote request:', err);
      setError('Failed to submit request. Please try again.');
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
          <h2 className="text-3xl font-bold text-zinc-900 mb-4">Quote Requested!</h2>
          <p className="text-zinc-600 mb-8">
            Thank you for reaching out. Our team will review your requirements and send a detailed quotation to your email within 24 hours.
          </p>
          <button
            onClick={() => setIsSuccess(false)}
            className="w-full bg-indigo-600 text-white rounded-xl py-3 font-semibold hover:bg-indigo-700 transition-colors"
          >
            Request Another Quote
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-full mb-4">
            <FileText className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-4xl font-bold text-zinc-900 mb-4">Request a Quotation</h1>
          <p className="text-lg text-zinc-600">
            Need a bulk order or a custom printing job? Fill out the form below and we'll provide a competitive quote.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-zinc-100 p-8">
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
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">Type of Printing Service *</label>
                <select
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white"
                >
                  <option value="custom_apparel">Custom Apparel (T-Shirts, Hoodies)</option>
                  <option value="promotional">Promotional Items (Mugs, Pens)</option>
                  <option value="headwear">Headwear (Caps, Beanies)</option>
                  <option value="marketing">Marketing Materials (Flyers, Banners)</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">Estimated Quantity *</label>
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
              <label className="block text-sm font-medium text-zinc-700 mb-2">Description of Request *</label>
              <textarea
                name="description"
                required
                rows={5}
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder="Please describe your project in detail. Include information about materials, colors, deadlines, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">Reference File (Optional)</label>
              <input
                type="file"
                onChange={handleFileChange}
                className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-indigo-600 text-white rounded-xl py-4 font-bold text-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/30 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Sending Request...' : 'Get My Quote'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
