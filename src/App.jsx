import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

import { AdminDataProvider } from './context/AdminDataContext';
import { BookingProvider } from './context/BookingContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import ScrollToTop from './components/ScrollToTop';

import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import PlansPage from './pages/PlansPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import AdminPage from './pages/AdminPage';
import EmployeePage from './pages/EmployeePage';
import CustomerPage from './pages/CustomerPage';

function AppLayout() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isEmployeeRoute = location.pathname.startsWith('/employee');
  const isCustomerDashboard = location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/customer');
  const isCustomerAuth = location.pathname === '/login' || location.pathname === '/signup';
  
  // Only dashboards with their own internal viewport scrollers need h-screen overflow-hidden
  const isDashboardPortal = isAdminRoute || isEmployeeRoute || isCustomerDashboard;
  const hidePublicNavbarAndFooter = isDashboardPortal || isCustomerAuth;

  return (
    <div className={`flex flex-col ${isDashboardPortal ? 'h-screen overflow-hidden' : 'min-h-screen overflow-y-auto overflow-x-hidden'} bg-white text-slate-900 w-full max-w-full`}>
      {!hidePublicNavbarAndFooter && <Navbar />}
      <main className={`flex-1 ${isDashboardPortal ? 'h-full overflow-hidden' : 'min-h-screen'}`}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/plans" element={<PlansPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/employee" element={<EmployeePage />} />
          <Route path="/dashboard" element={<CustomerPage defaultTab="login" />} />
          <Route path="/customer" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<CustomerPage defaultTab="login" />} />
          <Route path="/signup" element={<CustomerPage defaultTab="signup" />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!hidePublicNavbarAndFooter && <Footer />}
      {!hidePublicNavbarAndFooter && <WhatsAppButton />}
    </div>
  );
}

export default function App() {
  useEffect(() => {
    AOS.init({
      duration: 650,
      easing: 'ease-out-cubic',
      once: true,
      offset: 20,
    });
  }, []);

  return (
    <AdminDataProvider>
      <BookingProvider>
        <BrowserRouter>
          <ScrollToTop />
          <AppLayout />
        </BrowserRouter>
      </BookingProvider>
    </AdminDataProvider>
  );
}
