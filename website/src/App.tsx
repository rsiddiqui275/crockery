import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import EnquiryDrawer from './components/EnquiryDrawer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Wholesale from './pages/Wholesale';
import Contact from './pages/Contact';
import './App.css';

function App() {
  const [enquiryOpen, setEnquiryOpen] = useState(false);

  return (
    <div className="app-shell">
      <Navbar onOpenEnquiry={() => setEnquiryOpen(true)} />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/wholesale" element={<Wholesale />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>

      <Footer />

      <EnquiryDrawer open={enquiryOpen} onClose={() => setEnquiryOpen(false)} />
    </div>
  );
}

export default App
