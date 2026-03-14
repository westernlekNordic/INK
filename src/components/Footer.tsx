import { Link } from 'react-router-dom';
import { Printer, MapPin, Phone, Mail, Instagram, Facebook, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-zinc-900 text-zinc-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 text-white">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <Printer className="h-6 w-6" />
              </div>
              <span className="font-bold text-2xl tracking-tight">Åsaink</span>
            </Link>
            <p className="text-sm text-zinc-400">
              Professional printing and customization service for T-shirts, mugs, caps, and flyers.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-zinc-400 hover:text-white transition-colors"><Instagram className="h-5 w-5" /></a>
              <a href="#" className="text-zinc-400 hover:text-white transition-colors"><Facebook className="h-5 w-5" /></a>
              <a href="#" className="text-zinc-400 hover:text-white transition-colors"><Twitter className="h-5 w-5" /></a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/portfolio" className="hover:text-indigo-400 transition-colors">T-Shirt Customization</Link></li>
              <li><Link to="/portfolio" className="hover:text-indigo-400 transition-colors">Mug Printing</Link></li>
              <li><Link to="/portfolio" className="hover:text-indigo-400 transition-colors">Cap Branding</Link></li>
              <li><Link to="/portfolio" className="hover:text-indigo-400 transition-colors">Flyer Printing</Link></li>
              <li><Link to="/upload-design" className="hover:text-indigo-400 transition-colors">Custom Design Printing</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/order" className="hover:text-indigo-400 transition-colors">Order Now</Link></li>
              <li><Link to="/request-quote" className="hover:text-indigo-400 transition-colors">Request a Quote</Link></li>
              <li><Link to="/book-meeting" className="hover:text-indigo-400 transition-colors">Book a Meeting</Link></li>
              <li><Link to="/contact" className="hover:text-indigo-400 transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-indigo-500 shrink-0" />
                <span>123 Print Avenue, Design District, City 10001</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-indigo-500 shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-indigo-500 shrink-0" />
                <span>hello@asaink.com</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-zinc-800 text-sm text-center text-zinc-500">
          <p>&copy; {new Date().getFullYear()} Åsaink Printing Services. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
