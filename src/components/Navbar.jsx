import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Phone, Menu, X, Calendar, Sparkles, User, LogIn } from 'lucide-react';
import { BUSINESS_INFO } from '../data/websiteData';
import { useAdminData } from '../context/AdminDataContext';

export default function Navbar() {
  const { websiteContent, isCustomerAuthenticated, customerUser } = useAdminData();
  const businessInfo = websiteContent?.businessInfo || BUSINESS_INFO;
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
      <header className="fixed top-0 left-0 right-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 py-2.5 sm:py-3 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="inline-flex items-center group" aria-label="CLEANZX Home">
          <img
            src="/images/logo-light.png"
            alt="CLEANZX - Car Cleaning, Made Simple"
            className="h-10 sm:h-12 md:h-14 w-auto max-w-[155px] sm:max-w-[200px] md:max-w-[240px] object-contain group-hover:opacity-90 transition-all duration-200"
          />
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

        {/* Header Action Buttons on Right Side: Customer Login/Signup, Call & Book Cleaning */}
        <div className="hidden sm:flex items-center gap-2.5">
          <a
            href={`tel:${businessInfo.phone}`}
            className="hidden xl:flex text-xs font-semibold text-slate-700 hover:text-[#1677FF] items-center gap-1.5 px-3.5 py-2 rounded-full border border-slate-200 hover:border-slate-300 transition-colors bg-slate-50 hover:bg-white whitespace-nowrap shrink-0"
            title="Call CLEANZX"
          >
            <Phone className="w-3.5 h-3.5 text-[#1677FF] shrink-0" />
            <span className="whitespace-nowrap">{businessInfo.phoneFormatted || businessInfo.phone}</span>
          </a>

          <button
            onClick={handleBookNow}
            className="relative group overflow-hidden px-4 sm:px-5 py-2.5 rounded-full bg-[#1677FF] hover:bg-[#00A3FF] text-white text-xs sm:text-sm font-semibold tracking-wide transition-all duration-300 shadow-md shadow-[#1677FF]/30 hover:shadow-[#00A3FF]/50 hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 cursor-pointer shrink-0"
          >
            <Calendar className="w-4 h-4 text-white" />
            <span>Book a Cleaning</span>
          </button>

          {/* Customer Login Button at the end of header right side */}
          {isCustomerAuthenticated && customerUser ? (
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-cyan-50 hover:bg-cyan-100 border border-cyan-300 text-[#1677FF] hover:text-[#00A3FF] text-xs font-bold transition-all shadow-sm shrink-0"
              title="Open Customer Dashboard"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <User className="w-3.5 h-3.5 text-[#1677FF]" />
              <span className="max-w-[100px] truncate">{customerUser.name?.split(' ')[0]}</span>
            </Link>
          ) : (
            <Link
              to="/login"
              className="text-xs font-semibold text-slate-700 hover:text-[#1677FF] flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-slate-200 hover:border-slate-300 transition-colors bg-slate-50 hover:bg-white whitespace-nowrap shadow-sm shrink-0"
              title="Customer Login"
            >
              <LogIn className="w-3.5 h-3.5 text-[#1677FF]" />
              <span>Login</span>
            </Link>
          )}
        </div>

        {/* Mobile Header Right: Customer Login Button + Hamburger */}
        <div className="flex items-center gap-2 lg:hidden">
          {isCustomerAuthenticated && customerUser ? (
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-cyan-50 border border-cyan-200 text-[#1677FF] text-xs font-bold"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Dashboard</span>
            </Link>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 hover:text-[#1677FF] text-xs font-semibold"
            >
              <LogIn className="w-3 h-3 text-[#1677FF]" />
              <span>Login</span>
            </Link>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-slate-100 border border-slate-200 text-slate-800 hover:text-[#1677FF] transition-colors focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-4 duration-200 shadow-xl">
          {/* Customer Portal Mobile Access Card */}
          <div className="mb-3 p-3 rounded-2xl bg-gradient-to-r from-blue-50 to-cyan-50 border border-cyan-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#1677FF] text-white flex items-center justify-center font-bold text-xs">
                <User className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">
                  {isCustomerAuthenticated && customerUser ? customerUser.name : 'Customer Account'}
                </p>
                <p className="text-[10px] text-slate-500">
                  {isCustomerAuthenticated ? 'Active Doorstep Care' : 'Manage subscriptions & invoices'}
                </p>
              </div>
            </div>

            {isCustomerAuthenticated ? (
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3.5 py-1.5 rounded-xl bg-[#1677FF] text-white text-xs font-bold"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3.5 py-1.5 rounded-xl bg-[#1677FF] text-white text-xs font-bold"
              >
                Login
              </Link>
            )}
          </div>

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
      <div className="h-[68px] sm:h-[80px] md:h-[88px] w-full shrink-0 pointer-events-none" aria-hidden="true" />
    </>
  );
}
