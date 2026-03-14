import { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar as CalendarIcon, Clock, CheckCircle2, Video, MapPin } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { format, addDays, startOfToday } from 'date-fns';

export default function BookMeeting() {
  const today = startOfToday();
  const availableDates = Array.from({ length: 14 }).map((_, i) => addDays(today, i + 1));
  const availableTimes = ['09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'];

  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    phone: '',
    meetingType: 'online',
    date: format(availableDates[0], 'yyyy-MM-dd'),
    time: availableTimes[0],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await addDoc(collection(db, 'meetings'), {
        ...formData,
        status: 'scheduled',
        createdAt: new Date().toISOString(),
      });

      setIsSuccess(true);
    } catch (err) {
      console.error('Error booking meeting:', err);
      setError('Failed to book meeting. Please try again.');
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
          <h2 className="text-3xl font-bold text-zinc-900 mb-4">Meeting Confirmed!</h2>
          <p className="text-zinc-600 mb-6">
            Your consultation has been scheduled for <strong>{format(new Date(formData.date), 'MMMM d, yyyy')}</strong> at <strong>{formData.time}</strong>.
          </p>
          <p className="text-sm text-zinc-500 mb-8">
            We've sent a calendar invitation to {formData.email} with the {formData.meetingType === 'online' ? 'meeting link' : 'location details'}.
          </p>
          <button
            onClick={() => {
              setIsSuccess(false);
              setFormData({ ...formData, customerName: '', email: '', phone: '' });
            }}
            className="w-full bg-indigo-600 text-white rounded-xl py-3 font-semibold hover:bg-indigo-700 transition-colors"
          >
            Book Another Meeting
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-zinc-900 mb-4">Book a Consultation</h1>
          <p className="text-lg text-zinc-600">
            Schedule a meeting with our design and printing experts to discuss your project.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-zinc-100 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-5">
            {/* Sidebar */}
            <div className="bg-zinc-900 text-white p-8 md:col-span-2 flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-6">Meeting Details</h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-zinc-800 p-3 rounded-lg">
                      <CalendarIcon className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-zinc-200">Date</h4>
                      <p className="text-zinc-400">{format(new Date(formData.date), 'EEEE, MMMM d, yyyy')}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-zinc-800 p-3 rounded-lg">
                      <Clock className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-zinc-200">Time</h4>
                      <p className="text-zinc-400">{formData.time} (30 minutes)</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-zinc-800 p-3 rounded-lg">
                      {formData.meetingType === 'online' ? (
                        <Video className="w-6 h-6 text-indigo-400" />
                      ) : (
                        <MapPin className="w-6 h-6 text-indigo-400" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-zinc-200">Location</h4>
                      <p className="text-zinc-400">
                        {formData.meetingType === 'online' ? 'Google Meet link will be provided' : 'Åsaink Office, 123 Print Ave'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="p-8 md:col-span-3">
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">Meeting Type *</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, meetingType: 'online' })}
                      className={`py-3 px-4 rounded-xl border-2 flex items-center justify-center gap-2 font-medium transition-all ${
                        formData.meetingType === 'online'
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                          : 'border-zinc-200 text-zinc-600 hover:border-zinc-300'
                      }`}
                    >
                      <Video className="w-5 h-5" /> Online Meeting
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, meetingType: 'physical' })}
                      className={`py-3 px-4 rounded-xl border-2 flex items-center justify-center gap-2 font-medium transition-all ${
                        formData.meetingType === 'physical'
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                          : 'border-zinc-200 text-zinc-600 hover:border-zinc-300'
                      }`}
                    >
                      <MapPin className="w-5 h-5" /> Physical Meeting
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-2">Select Date *</label>
                    <select
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white"
                    >
                      {availableDates.map((date) => (
                        <option key={date.toISOString()} value={format(date, 'yyyy-MM-dd')}>
                          {format(date, 'EEE, MMM d')}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-2">Select Time *</label>
                    <select
                      name="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white"
                    >
                      {availableTimes.map((time) => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-100">
                  <h4 className="font-semibold text-zinc-900 mb-4">Your Details</h4>
                  <div className="space-y-4">
                    <div>
                      <input
                        type="text"
                        name="customerName"
                        required
                        value={formData.customerName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        placeholder="Full Name *"
                      />
                    </div>
                    <div>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        placeholder="Email Address *"
                      />
                    </div>
                    <div>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        placeholder="Phone Number"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-indigo-600 text-white rounded-xl py-4 font-bold text-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/30 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Confirming...' : 'Confirm Booking'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
