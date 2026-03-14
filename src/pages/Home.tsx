import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Star, Upload, FileText, Calendar } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-zinc-900 text-white overflow-hidden py-24 lg:py-32">
        <div className="absolute inset-0 z-0">
          <img
            src="https://picsum.photos/seed/printing/1920/1080?blur=2"
            alt="Printing Services"
            className="w-full h-full object-cover opacity-20"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-900 via-zinc-900/80 to-transparent" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
              Bring Your Ideas to Life with <span className="text-indigo-400">Åsaink</span>
            </h1>
            <p className="text-lg md:text-xl text-zinc-300 mb-10 leading-relaxed">
              Premium printing and customization services for T-shirts, mugs, caps, and flyers. High-quality materials, vibrant colors, and fast turnaround.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/order"
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-full font-semibold transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/30"
              >
                Order Now <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/upload-design"
                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-full font-semibold transition-all flex items-center gap-2 border border-white/20"
              >
                Upload Your Design <Upload className="w-5 h-5" />
              </Link>
              <Link
                to="/request-quote"
                className="text-zinc-300 hover:text-white px-6 py-4 font-medium transition-colors flex items-center gap-2"
              >
                Request a Quote
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-zinc-900 sm:text-4xl mb-4">Our Services</h2>
            <p className="text-lg text-zinc-600">We offer a wide range of premium printing services to help your brand stand out.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: 'T-Shirt Customization', desc: 'High-quality DTG and screen printing on premium cotton tees.', img: 'tshirt' },
              { title: 'Mug Printing', desc: 'Vibrant, dishwasher-safe custom mugs for gifts or branding.', img: 'mug' },
              { title: 'Cap Branding', desc: 'Embroidered and printed caps that make a statement.', img: 'cap' },
              { title: 'Flyer Printing', desc: 'Crisp, full-color flyers and promotional materials.', img: 'flyer' }
            ].map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group rounded-2xl overflow-hidden bg-zinc-50 border border-zinc-100 hover:shadow-xl transition-all"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={`https://picsum.photos/seed/${service.img}/600/400`}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-zinc-900 mb-2">{service.title}</h3>
                  <p className="text-zinc-600 mb-4">{service.desc}</p>
                  <Link to="/portfolio" className="text-indigo-600 font-medium flex items-center gap-1 hover:gap-2 transition-all">
                    View Gallery <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-24 bg-zinc-50 border-y border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-zinc-900 sm:text-4xl mb-6">Why Choose Åsaink?</h2>
              <p className="text-lg text-zinc-600 mb-8">
                We combine state-of-the-art printing technology with exceptional customer service to deliver products you'll love.
              </p>
              <ul className="space-y-4">
                {[
                  'Premium quality materials and inks',
                  'Fast turnaround times and reliable delivery',
                  'No minimum order quantities on most items',
                  'Expert design assistance available',
                  '100% satisfaction guarantee'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-zinc-700 font-medium">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-10 flex gap-4">
                <Link to="/book-meeting" className="bg-zinc-900 hover:bg-zinc-800 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2">
                  <Calendar className="w-5 h-5" /> Book a Consultation
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-100 rounded-3xl transform rotate-3 scale-105 -z-10" />
              <img
                src="https://picsum.photos/seed/workspace/800/600"
                alt="Our Workspace"
                className="rounded-3xl shadow-2xl object-cover w-full h-[400px]"
                referrerPolicy="no-referrer"
              />
              
              {/* Floating Badge */}
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-zinc-100">
                <div className="flex items-center gap-2 mb-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star key={star} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="font-bold text-zinc-900">4.9/5 Average Rating</p>
                <p className="text-sm text-zinc-500">Based on 500+ reviews</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
