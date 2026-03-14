import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Portfolio from './pages/Portfolio';
import Order from './pages/Order';
import UploadDesign from './pages/UploadDesign';
import RequestQuote from './pages/RequestQuote';
import BookMeeting from './pages/BookMeeting';
import Contact from './pages/Contact';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="portfolio" element={<Portfolio />} />
          <Route path="order" element={<Order />} />
          <Route path="upload-design" element={<UploadDesign />} />
          <Route path="request-quote" element={<RequestQuote />} />
          <Route path="book-meeting" element={<BookMeeting />} />
          <Route path="contact" element={<Contact />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
