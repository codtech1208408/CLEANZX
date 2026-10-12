import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Phone, Menu, X, Calendar, Sparkles } from 'lucide-react';
import { BUSINESS_INFO } from '../data/websiteData';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Services', path: '/services' },
    { label: 'Subscription Plans', path: '/plans' },
    { label: 'About Us', path: '/about' },
    { label: 'Contact Us', path: '/contact' },
  ];

  const handleBookNow = () => {
    setMobileMenuOpen(false);
    if (location.pathname === '/' || location.pathname === '/plans') {
      const el = document.getElementById('booking-enquiry-form');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }
    navigate('/plans#booking');
  };

  return (
    <>
      {/* Fixed Header: stays pinned at top when scrolling down on desktop & mobile */}
      <header className="fixed top-0 left-0 right-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 py-3.5 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#1677FF] to-[#00A3FF] flex items-center justify-center font-black text-white shadow-md shadow-[#00A3FF]/30 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-extrabold tracking-wider text-slate-950 font-heading">
              CLEAN<span className="text-[#00A3FF]">ZX</span>
            </span>
            <span className="text-[9px] tracking-widest uppercase text-slate-500 font-semibold -mt-1">
              Doorstep Car Care
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-100/90 px-3 py-1.5 rounded-full border border-slate-200">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-[#1677FF] text-white shadow-sm shadow-[#1677FF]/40'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-white'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Header Action Buttons (Click to Call & Book Cleaning) */}
        <div className="hidden sm:flex items-center gap-3">
          <a
            href={`tel:${BUSINESS_INFO.phone}`}
            className="text-xs font-semibold text-slate-700 hover:text-[#1677FF] flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-slate-200 hover:border-slate-300 transition-colors bg-slate-50 hover:bg-white"
            title="Call CLEANZX"
          >
            <Phone className="w-3.5 h-3.5 text-[#1677FF]" />
            <span>{BUSINESS_INFO.phoneFormatted}</span>
          </a>

          <button
            onClick={handleBookNow}
            className="relative group overflow-hidden px-5 py-2.5 rounded-full bg-[#1677FF] hover:bg-[#00A3FF] text-white text-sm font-semibold tracking-wide transition-all duration-300 shadow-md shadow-[#1677FF]/30 hover:shadow-[#00A3FF]/50 hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-white" />
            <span>Book a Cleaning</span>
          </button>
        </div>

        {/* Mobile Menu Hamburger */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-800 hover:text-[#1677FF] transition-colors focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-4 duration-200 shadow-xl">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-3 rounded-lg text-base font-medium flex items-center justify-between ${
                    isActive
                      ? 'bg-[#1677FF] text-white'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                </Link>
              );
            })}
            <Link
              to="/admin"
              className="px-4 py-3 rounded-lg text-sm text-slate-700 hover:bg-slate-50 flex items-center justify-between"
            >
              <span>Admin & Enquiries</span>
              <span className="text-xs bg-slate-200 px-2 py-0.5 rounded text-slate-800 font-semibold">Portal</span>
            </Link>
          </div>

          <div className="pt-4 border-t border-slate-200 flex flex-col gap-3">
            <button
              onClick={handleBookNow}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#1677FF] to-[#00A3FF] text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-[#1677FF]/30 cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Book a Cleaning</span>
            </button>
            <a
              href={`tel:${BUSINESS_INFO.phone}`}
              className="w-full py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 font-medium text-sm flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4 text-[#1677FF]" />
              <span>Call {BUSINESS_INFO.phoneFormatted}</span>
            </a>
          </div>
        </div>
      )}
      </header>
      {/* Spacer to preserve document layout under fixed header */}
      <div className="h-[69px] w-full shrink-0 pointer-events-none" aria-hidden="true" />
    </>
  );
}
