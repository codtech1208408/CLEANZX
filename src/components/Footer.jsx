import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, MapPin, Clock, ArrowUp, MessageSquare, Sparkles, Shield, ChevronRight, Mail, ShieldCheck, UserCheck } from 'lucide-react';
import { BUSINESS_INFO } from '../data/websiteData';
import { useAdminData } from '../context/AdminDataContext';
import { InstagramIcon, FacebookIcon } from './SocialIcons';

export default function Footer() {
  const { websiteContent } = useAdminData();
  const businessInfo = websiteContent?.businessInfo || BUSINESS_INFO;
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
            {/* Social & Contact Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-2">
              <a
                href={BUSINESS_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-950/40 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-900/50 hover:border-emerald-400 transition-colors"
                title="Chat on WhatsApp"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
              <a
                href={BUSINESS_INFO.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-pink-950/40 text-pink-400 border border-pink-500/30 hover:bg-pink-900/50 hover:border-pink-400 transition-colors"
                title="Follow CLEANZX on Instagram"
              >
                <InstagramIcon className="w-3.5 h-3.5" />
                <span>Instagram</span>
              </a>
              <a
                href={BUSINESS_INFO.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-blue-950/40 text-blue-400 border border-blue-500/30 hover:bg-blue-900/50 hover:border-blue-400 transition-colors"
                title="Follow CLEANZX on Facebook"
              >
                <FacebookIcon className="w-3.5 h-3.5" />
                <span>Facebook</span>
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
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#00A3FF] shrink-0" />
                <a href={`mailto:${BUSINESS_INFO.email}`} className="hover:text-[#00A3FF] font-semibold text-white transition-colors break-all">
                  {BUSINESS_INFO.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#263244] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <p>© {currentYear} CLEANZX. All rights reserved. Operating in Mehdipatnam, Hyderabad, Telangana, India.</p>
            <Link to="/employee" className="px-3 py-1 rounded-full bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 hover:text-white border border-cyan-500/40 font-semibold flex items-center gap-1.5 transition-all shadow-xs">
              <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>Employee Login (/employee)</span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <a
                href={BUSINESS_INFO.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-[#151C28] border border-[#263244] text-[#AAB4C3] hover:text-pink-400 hover:border-pink-500/40 transition-all flex items-center justify-center"
                aria-label="Instagram"
                title="CLEANZX Instagram"
              >
                <InstagramIcon className="w-3.5 h-3.5" />
              </a>
              <a
                href={BUSINESS_INFO.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-[#151C28] border border-[#263244] text-[#AAB4C3] hover:text-blue-400 hover:border-blue-500/40 transition-all flex items-center justify-center"
                aria-label="Facebook"
                title="CLEANZX Facebook"
              >
                <FacebookIcon className="w-3.5 h-3.5" />
              </a>
            </div>
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
