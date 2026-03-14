import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../components/Navbar';

// Generate mock data
const generateItems = (category: string, count: number, priceRange: [number, number]) => {
  return Array.from({ length: count }).map((_, i) => ({
    id: `${category}-${i + 1}`,
    title: `${category} Design ${i + 1}`,
    price: (Math.random() * (priceRange[1] - priceRange[0]) + priceRange[0]).toFixed(2),
    image: `https://picsum.photos/seed/${category}${i}/400/400`,
    category,
    sizes: category === 'T-Shirt' ? ['S', 'M', 'L', 'XL', 'XXL'] : null,
  }));
};

const portfolioData = {
  'T-Shirt': generateItems('T-Shirt', 30, [15, 35]),
  'Mug': generateItems('Mug', 12, [10, 20]),
  'Cap': generateItems('Cap', 12, [12, 25]),
  'Flyer': generateItems('Flyer', 12, [50, 150]), // Price per 100
};

const categories = Object.keys(portfolioData);

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState(categories[0]);

  return (
    <div className="min-h-screen bg-zinc-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-zinc-900 mb-4">Design Gallery</h1>
          <p className="text-lg text-zinc-600 max-w-2xl mx-auto">
            Browse our extensive collection of pre-designed templates or get inspired for your custom order.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={cn(
                'px-6 py-3 rounded-full font-medium transition-all',
                activeCategory === category
                  ? 'bg-zinc-900 text-white shadow-md'
                  : 'bg-white text-zinc-600 hover:bg-zinc-100 border border-zinc-200'
              )}
            >
              {category}s
            </button>
          ))}
        </div>

        {/* Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {portfolioData[activeCategory as keyof typeof portfolioData].map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-2xl overflow-hidden border border-zinc-200 shadow-sm hover:shadow-xl transition-shadow group"
              >
                <div className="relative aspect-square overflow-hidden bg-zinc-100">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Link
                      to={`/order?product=${activeCategory.toLowerCase()}&design=${item.id}`}
                      className="bg-white text-zinc-900 px-6 py-3 rounded-full font-semibold flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all"
                    >
                      <ShoppingCart className="w-4 h-4" /> Order Now
                    </Link>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-zinc-900">{item.title}</h3>
                    <span className="font-semibold text-indigo-600">${item.price}</span>
                  </div>
                  {item.sizes && (
                    <div className="mt-3">
                      <p className="text-xs text-zinc-500 mb-2 uppercase tracking-wider font-semibold">Available Sizes</p>
                      <div className="flex gap-1">
                        {item.sizes.map((size) => (
                          <span
                            key={size}
                            className="text-xs font-medium px-2 py-1 bg-zinc-100 text-zinc-600 rounded"
                          >
                            {size}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {activeCategory === 'Flyer' && (
                    <p className="text-xs text-zinc-500 mt-2">Price per 100 units</p>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
