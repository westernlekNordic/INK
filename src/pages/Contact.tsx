import { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await addDoc(collection(db, 'messages'), {
        ...formData,
        createdAt: new Date().toISOString(),
      });

      setIsSuccess(true);
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-zinc-900 mb-4">Get in Touch</h1>
          <p className="text-lg text-zinc-600 max-w-2xl mx-auto">
            Have a question or need help with an order? We're here to help. Reach out to us using the form below or our contact details.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info & Map */}
          <div className="space-y-8">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-zinc-100">
              <h3 className="text-2xl font-bold text-zinc-900 mb-6">Contact Information</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-indigo-50 p-3 rounded-full">
                    <MapPin className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-zinc-900">Our Location</h4>
                    <p className="text-zinc-600 mt-1">123 Print Avenue, Design District<br />City 10001, Country</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-indigo-50 p-3 rounded-full">
                    <Phone className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-zinc-900">Phone Number</h4>
                    <p className="text-zinc-600 mt-1">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-indigo-50 p-3 rounded-full">
                    <Mail className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-zinc-900">Email Address</h4>
                    <p className="text-zinc-600 mt-1">hello@asaink.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-indigo-50 p-3 rounded-full">
                    <Clock className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-zinc-900">Business Hours</h4>
                    <p className="text-zinc-600 mt-1">Monday - Friday: 9:00 AM - 6:00 PM<br />Saturday: 10:00 AM - 2:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="bg-zinc-200 rounded-3xl h-64 w-full overflow-hidden relative border border-zinc-200">
              <img
                src="https://picsum.photos/seed/map/800/400?blur=2"
                alt="Map Location"
                className="w-full h-full object-cover opacity-80"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full font-semibold text-zinc-800 shadow-lg flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-indigo-600" /> View on Google Maps
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-xl border border-zinc-100">
            <h3 className="text-2xl font-bold text-zinc-900 mb-6">Send us a Message</h3>
            
            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100 mb-6">
                  <CheckCircle2 className="h-10 w-10 text-emerald-600" />
                </div>
                <h4 className="text-2xl font-bold text-zinc-900 mb-2">Message Sent!</h4>
                <p className="text-zinc-600 mb-8">We'll get back to you as soon as possible.</p>
                <button
                  onClick={() => setIsSuccess(false)}
                  className="bg-zinc-100 text-zinc-900 px-6 py-3 rounded-xl font-medium hover:bg-zinc-200 transition-colors"
                >
                  Send Another Message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium">
                    {error}
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">Your Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
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
                
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">Message *</label>
                  <textarea
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="How can we help you?"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-indigo-600 text-white rounded-xl py-4 font-bold text-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/30 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? 'Sending...' : (
                    <>Send Message <Send className="w-5 h-5" /></>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
