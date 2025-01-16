import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { Cart } from './pages/Cart';
import { Profile } from './pages/Profile';
import { VendorDashboard } from './pages/vendor/Dashboard';
import { ProductManagement } from './pages/vendor/ProductManagement';
import { OrderManagement } from './pages/vendor/OrderManagement';
import { Analytics } from './pages/vendor/Analytics';
import { AuthChoice } from './pages/auth/AuthChoice';
import { UserAuth } from './pages/auth/UserAuth';
import { VendorAuth } from './pages/auth/VendorAuth';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Only show header on non-home routes */}
        <Routes>
          <Route path="/" element={null} />
          <Route path="*" element={<Header />} />
        </Routes>
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop/:id" element={<Shop />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/auth" element={<AuthChoice />} />
            <Route path="/auth/user" element={<UserAuth />} />
            <Route path="/auth/vendor" element={<VendorAuth />} />
            <Route path="/vendor/dashboard" element={<VendorDashboard />} />
            <Route path="/vendor/products" element={<ProductManagement />} />
            <Route path="/vendor/orders" element={<OrderManagement />} />
            <Route path="/vendor/analytics" element={<Analytics />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;