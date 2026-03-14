import { useState } from 'react';
import { motion } from 'motion/react';
import { Upload, CheckCircle2 } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function UploadDesign() {
  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    phone: '',
    productType: 'tshirt',
    specialInstructions: '',
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
      const selectedFile = e.target.files[0];
      const validTypes = ['image/png', 'image/jpeg', 'application/pdf', 'image/svg+xml', 'application/postscript'];
      if (!validTypes.includes(selectedFile.type)) {
        setError('Invalid file format. Please upload PNG, JPG, PDF, AI, or SVG.');
        return;
      }
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB.');
        return;
      }
      setFile(selectedFile);
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please upload a design file.');
      return;
    }
    
    setIsSubmitting(true);
    setError('');

    try {
      const fileMetadata = `${file.name} (${(file.size / 1024).toFixed(2)} KB)`;

      await addDoc(collection(db, 'orders'), {
        ...formData,
        quantity: 1, // Default for design upload
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
        specialInstructions: '',
      });
      setFile(null);
    } catch (err) {
      console.error('Error submitting design:', err);
      setError('Failed to submit design. Please try again.');
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
          <h2 className="text-3xl font-bold text-zinc-900 mb-4">Design Uploaded!</h2>
          <p className="text-zinc-600 mb-8">
            We've received your artwork. Our design team will review it and get back to you shortly with a proof or quote.
          </p>
          <button
            onClick={() => setIsSuccess(false)}
            className="w-full bg-indigo-600 text-white rounded-xl py-3 font-semibold hover:bg-indigo-700 transition-colors"
          >
            Upload Another Design
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-zinc-900 mb-4">Upload Your Design</h1>
          <p className="text-lg text-zinc-600">
            Have your own artwork? Upload it here and we'll print it on your chosen product.
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">Product Type *</label>
                <select
                  name="productType"
                  value={formData.productType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white"
                >
                  <option value="tshirt">T-Shirt</option>
                  <option value="mug">Mug</option>
                  <option value="cap">Cap</option>
                  <option value="flyer">Flyers</option>
                  <option value="other">Other Custom Item</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">Upload Artwork *</label>
              <div className="mt-1 flex justify-center px-6 pt-10 pb-12 border-2 border-zinc-300 border-dashed rounded-xl hover:bg-zinc-50 transition-colors cursor-pointer relative group">
                <div className="space-y-2 text-center">
                  <Upload className="mx-auto h-16 w-16 text-zinc-400 group-hover:text-indigo-500 transition-colors" />
                  <div className="flex text-sm text-zinc-600 justify-center mt-4">
                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                      <span className="text-lg">Select a file</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".png,.jpg,.jpeg,.pdf,.ai,.svg" />
                    </label>
                  </div>
                  <p className="text-sm text-zinc-500">PNG, JPG, PDF, AI, SVG up to 10MB</p>
                  {file && <p className="text-md font-medium text-emerald-600 mt-4 bg-emerald-50 py-2 px-4 rounded-full inline-block">Selected: {file.name}</p>}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">Special Instructions</label>
              <textarea
                name="specialInstructions"
                rows={4}
                value={formData.specialInstructions}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder="Tell us about the print size, placement, colors, or any other details..."
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-zinc-900 text-white rounded-xl py-4 font-bold text-lg hover:bg-zinc-800 transition-colors shadow-lg shadow-zinc-900/20 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Uploading...' : 'Submit Design'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
