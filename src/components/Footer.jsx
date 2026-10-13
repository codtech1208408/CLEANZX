import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, MapPin, Clock, ArrowUp, MessageSquare, Sparkles, Shield, ChevronRight } from 'lucide-react';
import { BUSINESS_INFO } from '../data/websiteData';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#05070B] border-t border-[#263244] text-[#AAB4C3] pt-16 pb-8 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-[#1677FF]/10 blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand Col */}
          <div className="space-y-4">
            <Link to="/" className="inline-block group" aria-label="CLEANZX Home">
              <img
                src="/images/logo-dark.png"
                alt="CLEANZX Doorstep Car Care"
                className="h-16 sm:h-20 w-auto object-contain group-hover:opacity-90 transition-opacity"
              />
            </Link>
            <p className="text-sm text-[#AAB4C3] leading-relaxed">
              {BUSINESS_INFO.tagline} Professional morning vehicle care specifically designed for apartment car owners and working professionals in Hyderabad.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <a
                href={BUSINESS_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-950/40 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-900/50 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp: {BUSINESS_INFO.whatsapp}</span>
              </a>
            </div>
          </div>

          {/* Quick Links Col */}
          <div>
            <h3 className="text-white text-base font-semibold mb-4 font-heading flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00A3FF]"></span>
              Quick Navigation
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-[#00A3FF] transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-[#00A3FF]" /> Home
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-[#00A3FF] transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-[#00A3FF]" /> Services
                </Link>
              </li>
              <li>
                <Link to="/plans" className="hover:text-[#00A3FF] transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-[#00A3FF]" /> Subscription Plans
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#00A3FF] transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-[#00A3FF]" /> About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#00A3FF] transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-[#00A3FF]" /> Contact Us
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-[#00A3FF] transition-colors flex items-center gap-1.5 text-xs text-[#AAB4C3]/70">
                  <ChevronRight className="w-3.5 h-3.5 text-[#00A3FF]" /> Admin Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Services Col */}
          <div>
            <h3 className="text-white text-base font-semibold mb-4 font-heading flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00A3FF]"></span>
              Standard Services
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/services#dust-removal" className="hover:text-[#00A3FF] transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-[#00A3FF]" /> Dust Removal
                </Link>
              </li>
              <li>
                <Link to="/services#exterior-cleaning" className="hover:text-[#00A3FF] transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-[#00A3FF]" /> Exterior Cleaning
                </Link>
              </li>
              <li>
                <Link to="/services#glass-cleaning" className="hover:text-[#00A3FF] transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-[#00A3FF]" /> Glass Cleaning
                </Link>
              </li>
              <li>
                <Link to="/services#tyre-cleaning" className="hover:text-[#00A3FF] transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-[#00A3FF]" /> Tyre Cleaning
                </Link>
              </li>
              <li>
                <Link to="/services#addons" className="hover:text-[#00A3FF] transition-colors flex items-center gap-1.5 text-xs text-[#00A3FF]">
                  <ChevronRight className="w-3.5 h-3.5 text-[#00A3FF]" /> Optional Paid Add-ons
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Col */}
          <div>
            <h3 className="text-white text-base font-semibold mb-4 font-heading flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00A3FF]"></span>
              Operating & Location
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#00A3FF] shrink-0 mt-0.5" />
                <span>{BUSINESS_INFO.location.displayText}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#00A3FF] shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-medium">{BUSINESS_INFO.operatingHours.displayText}</p>
                  <p className="text-xs text-[#AAB4C3]/80">Morning doorstep service slots</p>
                </div>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#00A3FF] shrink-0" />
                <a href={`tel:${BUSINESS_INFO.phone}`} className="hover:text-[#00A3FF] font-semibold text-white transition-colors">
                  {BUSINESS_INFO.phoneFormatted}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#263244] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {currentYear} CLEANZX. All rights reserved. Serving all across Hyderabad, Telangana, India.</p>

          <div className="flex items-center gap-4">
            <span className="text-xs text-[#AAB4C3]/70">Doorstep Car Detailing & Subscription Care</span>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-[#151C28] border border-[#263244] text-[#AAB4C3] hover:text-[#00A3FF] hover:border-[#00A3FF]/40 transition-all flex items-center gap-1.5 cursor-pointer"
              title="Back to Top"
            >
              <ArrowUp className="w-4 h-4" />
              <span className="text-xs">Top</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
