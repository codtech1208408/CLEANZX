import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Calendar, ArrowRight, ShieldCheck, Clock, MessageSquare, CheckCircle2, ChevronDown, ChevronUp, MapPin, Phone, Car } from 'lucide-react';
import { BUSINESS_INFO, STANDARD_SERVICES, OPTIONAL_ADDONS, HOW_IT_WORKS, TRUST_POINTS, FAQS, SUBSCRIPTION_PLANS } from '../data/websiteData';
import { useBooking } from '../context/BookingContext';
import ServiceCard from '../components/ServiceCard';
import SubscriptionCard from '../components/SubscriptionCard';
import BookingForm from '../components/BookingForm';

export default function HomePage() {
  const navigate = useNavigate();
  const { plans, selectPlanAndScroll } = useBooking();
  const [openFaq, setOpenFaq] = useState(0);

  // 4 Banners with distinct automotive focus & imagery
  const banners = [
    {
      id: 1,
      image: "/images/hero-car.jpg",
      badge: "Serving Mehdipatnam & Hyderabad Residential Apartments",
      titleLine1: "Premium Car Cleaning.",
      titleLine2: "Right at Your Doorstep.",
      subtitle: "Keep your car spotless without leaving home. Discover convenient doorstep car cleaning and flexible subscription plans from CLEANZX in Hyderabad.",
      primaryCtaText: "Explore Subscription Plans",
      primaryCtaLink: "/plans",
      secondaryCtaText: "Book Your Cleaning",
    },
    {
      id: 2,
      image: "/images/exterior-wash.jpg",
      badge: "Apartment-Safe Microfiber Detailing",
      titleLine1: "Scratch-Free Exterior Wash.",
      titleLine2: "Pure Showroom Shine.",
      subtitle: "Gentle microfiber wash engineered specifically for residential apartment parking bays with zero water puddle mess.",
      primaryCtaText: "View Exterior Services",
      primaryCtaLink: "/services",
      secondaryCtaText: "Book Your Cleaning",
    },
    {
      id: 3,
      image: "/images/interior-vacuum.jpg",
      badge: "Cabin Detailing & Deep Care",
      titleLine1: "Spotless Interior Vacuuming.",
      titleLine2: "Fresh Morning Cabin.",
      subtitle: "Thorough seat cleaning, floor mat extraction, and dashboard conditioning before you head out for your daily commute.",
      primaryCtaText: "Explore Add-on Detailing",
      primaryCtaLink: "/services#addons",
      secondaryCtaText: "Book Your Cleaning",
    },
    {
      id: 4,
      image: "/images/glass-cleaning.jpg",
      badge: "High-Clarity Glass & Tyre Dressing",
      titleLine1: "Crystal-Clear Windscreen.",
      titleLine2: "Impeccable Tyre Gloss.",
      subtitle: "Streak-free automotive glass polishing and rich tyre dressing for an immaculate, road-ready presentation every morning.",
      primaryCtaText: "Compare All 8 Subscription Plans",
      primaryCtaLink: "/plans",
      secondaryCtaText: "Book Your Cleaning",
    }
  ];

  const [currentBanner, setCurrentBanner] = useState(0);

  // Auto-scroll automatically every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [banners.length]);

  const scrollToBooking = () => {
    const el = document.getElementById('booking-enquiry-form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="bg-white text-slate-900 space-y-16 sm:space-y-24 lg:space-y-32 w-full max-w-full overflow-x-hidden">
      {/* 1. HERO SECTION WITH 4 AUTO-ROTATING BANNERS */}
      <section className="relative min-h-[92vh] sm:min-h-[85vh] lg:min-h-[90vh] flex items-center justify-center overflow-hidden pt-8 sm:pt-14 pb-12 sm:pb-20 bg-slate-950">
        {/* Carousel Background Images (Smooth Crossfade) */}
        {banners.map((banner, index) => {
          const isActive = index === currentBanner;
          return (
            <div
              key={banner.id}
              className={`absolute inset-0 z-0 transition-opacity duration-500 ease-in-out ${
                isActive ? 'opacity-80' : 'opacity-0 pointer-events-none'
              }`}
            >
              <img
                src={banner.image}
                alt={`${banner.titleLine1} ${banner.titleLine2}`}
                className="w-full h-full object-cover object-center scale-100 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/60 to-slate-950/50 pointer-events-none"></div>
            </div>
          );
        })}

        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[260px] sm:w-[500px] h-[160px] sm:h-[300px] bg-[#1677FF]/20 rounded-full blur-[90px] sm:blur-[140px] pointer-events-none z-0"></div>

        {/* Active Banner Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-10 lg:px-16 relative z-10 text-center w-full">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-slate-900/90 border border-[#00A3FF]/40 text-[#00A3FF] text-[11px] sm:text-sm font-semibold mb-4 sm:mb-6 shadow-xl shadow-black/40 backdrop-blur-md animate-in fade-in duration-300 max-w-[95%] sm:max-w-none mx-auto">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#00A3FF] shrink-0" />
            <span className="truncate">{banners[currentBanner].badge}</span>
          </div>

          {/* Headline */}
          <h1 className="text-2xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight font-heading max-w-5xl mx-auto leading-snug sm:leading-[1.15] animate-in fade-in duration-500">
            <span className="block text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.95)]">
              {banners[currentBanner].titleLine1}
            </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#00A3FF] to-[#00A3FF] drop-shadow-[0_4px_20px_rgba(0,0,0,0.95)]">
              {banners[currentBanner].titleLine2}
            </span>
          </h1>

          {/* Subheadline */}
          <p className="mt-3.5 sm:mt-6 text-xs sm:text-lg lg:text-xl text-white/85 max-w-md sm:max-w-3xl mx-auto leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] font-medium animate-in fade-in duration-500 px-2 sm:px-0">
            {banners[currentBanner].subtitle}
          </p>

          {/* Call to Actions */}
          <div className="mt-6 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5 max-w-[300px] sm:max-w-none mx-auto">
            <Link
              to={banners[currentBanner].primaryCtaLink}
              className="w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-4 rounded-full bg-gradient-to-r from-[#1677FF] to-[#00A3FF] hover:from-[#00A3FF] hover:to-[#1677FF] text-white font-bold text-xs sm:text-base shadow-lg sm:shadow-xl shadow-[#1677FF]/40 hover:shadow-[#00A3FF]/60 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>{banners[currentBanner].primaryCtaText}</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <button
              onClick={scrollToBooking}
              className="w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-4 rounded-full bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-[#00A3FF]/60 text-white font-semibold text-xs sm:text-base transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer shadow-md sm:shadow-lg backdrop-blur-sm"
            >
              <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#00A3FF]" />
              <span>{banners[currentBanner].secondaryCtaText}</span>
            </button>
          </div>

          {/* Slide Progress Indicators */}
          <div className="mt-6 sm:mt-8 flex items-center justify-center gap-2 sm:gap-2.5">
            {banners.map((banner, idx) => {
              const isActive = idx === currentBanner;
              return (
                <button
                  key={banner.id}
                  onClick={() => setCurrentBanner(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'w-6 sm:w-8 bg-[#00A3FF] shadow-md shadow-[#00A3FF]/50'
                      : 'w-2 sm:w-2.5 bg-white/40 hover:bg-white/70'
                  }`}
                />
              );
            })}
          </div>

          {/* Hero Quick Proof Points */}
          <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 max-w-4xl mx-auto text-left">
            <div className="bg-slate-900/90 p-3 sm:p-4 rounded-xl border border-slate-800 backdrop-blur-md shadow-md sm:shadow-lg shadow-black/50">
              <p className="text-[10px] sm:text-xs text-slate-400">Operating Hours</p>
              <p className="text-xs sm:text-sm font-bold text-white mt-1">{BUSINESS_INFO.operatingHours.displayText}</p>
            </div>
            <div className="bg-slate-900/90 p-3 sm:p-4 rounded-xl border border-slate-800 backdrop-blur-md shadow-md sm:shadow-lg shadow-black/50">
              <p className="text-[10px] sm:text-xs text-slate-400">Location</p>
              <p className="text-xs sm:text-sm font-bold text-white mt-1">Mehdipatnam, HYD</p>
              <p className="text-[10px] sm:text-xs text-[#00A3FF] font-medium mt-1">Serving All Across Hyderabad</p>
            </div>
            <div className="bg-slate-900/90 p-3 sm:p-4 rounded-xl border border-slate-800 backdrop-blur-md shadow-md sm:shadow-lg shadow-black/50">
              <p className="text-[10px] sm:text-xs text-slate-400">Direct WhatsApp</p>
              <p className="text-xs sm:text-sm font-bold text-emerald-400 mt-1">{BUSINESS_INFO.whatsapp}</p>
            </div>
            <div className="bg-slate-900/90 p-3 sm:p-4 rounded-xl border border-slate-800 backdrop-blur-md shadow-md sm:shadow-lg shadow-black/50">
              <p className="text-[10px] sm:text-xs text-slate-400">Apartment Service</p>
              <p className="text-xs sm:text-sm font-bold text-[#00A3FF] mt-1">Doorstep Bays</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRUST & CONVENIENCE HIGHLIGHTS (ON WHITE BACKGROUND) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6">
          {TRUST_POINTS.map((item, index) => (
            <div
              key={index}
              data-aos="fade-up"
              data-aos-delay={index * 100}
              className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-md shadow-slate-100 hover:border-[#00A3FF]/50 hover:shadow-xl hover:shadow-slate-200 transition-all space-y-2 sm:space-y-3"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#1677FF]">
                <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 font-heading">{item.title}</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. STANDARD SERVICES OVERVIEW (ON WHITE BACKGROUND) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-[#1677FF] bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-200">
            Professional Doorstep Services
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 font-heading">
            Essential Care for Every Drive
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-3">
            Our core packages cover essential exterior surfaces with precision microfiber care, ensuring vehicle paint protection and pristine curb appeal.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {STANDARD_SERVICES.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onSelect={() => selectPlanAndScroll('Normal Plan')}
            />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#1677FF] hover:text-[#00A3FF] transition-colors"
          >
            <span>View Full Service Breakdown & Process</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 4. HOW IT WORKS (SLATE-50 LIGHT SECTION) */}
      <section className="bg-slate-50 border-y border-slate-200 py-10 sm:py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1677FF] bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-200">
              Simple 4-Step Journey
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 font-heading">
              How Doorstep Car Cleaning Works
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-3">
              Effortless car care scheduled without interrupting your busy daily routine.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {HOW_IT_WORKS.map((step, idx) => (
              <div
                key={step.step}
                data-aos="fade-up"
                data-aos-delay={idx * 100}
                className="relative bg-white p-6 rounded-2xl border border-slate-200 shadow-md shadow-slate-100 flex flex-col justify-between group hover:border-[#00A3FF]/60 hover:shadow-xl transition-all"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1677FF] to-[#00A3FF] text-white font-extrabold text-lg flex items-center justify-center mb-4 shadow-md shadow-[#1677FF]/30">
                    0{step.step}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 font-heading mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. SUBSCRIPTION PLAN HIGHLIGHTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-[#1677FF] bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-200">
            Tailored Subscriptions
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 font-heading">
            Popular Recurring Plans
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-3">
            Choose from flexible 15-day trials, monthly routines, or multi-month packages. All prices and slot frequencies are confirmed directly with our team.
          </p>
        </div>

        {/* Featured Plans Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {(() => {
            const list = plans && plans.length > 0 ? plans : SUBSCRIPTION_PLANS;
            const featuredList = [
              list.find(p => p.id === 'normal-15-day'),
              list.find(p => p.id === 'normal-monthly'),
              list.find(p => p.id === 'premium-monthly')
            ].filter(Boolean);
            const displayList = featuredList.length >= 3 ? featuredList : list.slice(0, 3);
            return displayList.map((plan) => (
              <SubscriptionCard
                key={plan.id}
                plan={plan}
                onSelect={() => selectPlanAndScroll(plan.name)}
              />
            ));
          })()}
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/plans"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-900 font-semibold text-sm transition-all shadow-sm"
          >
            <span>Compare All 8 Subscription Plans & Inclusions</span>
            <ArrowRight className="w-4 h-4 text-[#1677FF]" />
          </Link>
        </div>
      </section>

      {/* 6. OPTIONAL ADD-ON SERVICES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50 rounded-3xl p-5 sm:p-12 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="max-w-3xl mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1677FF] bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-200">
              Optional Detailing
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3 font-heading">
              Customizable Paid Add-on Services
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              Upgrade your routine with deep interior vacuuming, dashboard conditioning, and tyre dressing. Prices are confirmed upon vehicle assessment.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {OPTIONAL_ADDONS.map((addon) => (
              <div
                key={addon.id}
                className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-[#00A3FF]/50 hover:shadow-md transition-all"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold text-slate-900">{addon.name}</span>
                    <span className="text-[10px] bg-blue-50 text-[#1677FF] px-2 py-0.5 rounded-full border border-blue-200 font-medium">
                      {addon.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {addon.description}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 font-medium">{addon.priceStatus}</span>
                  <button
                    onClick={scrollToBooking}
                    className="text-[#1677FF] hover:underline font-semibold cursor-pointer"
                  >
                    Add to Enquiry →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. WHY CHOOSE CLEANZX */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div data-aos="fade-up" className="space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1677FF] bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-200">
              Why Hyderabad Chooses Us
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading">
              Car Detailing Built Around Your Daily Routine
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Living in an apartment or managing a tight work schedule leaves little time to visit wash stations. CLEANZX brings systematic, doorstep vehicle upkeep straight to your designated parking stall in Mehdipatnam.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Zero Commute or Waiting Time</h4>
                  <p className="text-xs text-slate-600 mt-0.5">We service your vehicle while you sleep or prepare for your day.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Apartment Parking Friendly</h4>
                  <p className="text-xs text-slate-600 mt-0.5">Eco-conscious techniques designed to keep parking bays clean and dry.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Transparent & Direct Communication</h4>
                  <p className="text-xs text-slate-600 mt-0.5">Instant coordination and scheduling via WhatsApp with zero automated delays.</p>
                </div>
              </div>
            </div>
          </div>

          <div data-aos="fade-up" className="relative">
            <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-xl relative">
              <img
                src="/images/exterior-wash.jpg"
                alt="Professional car cleaning technician washing vehicle exterior"
                className="w-full h-[400px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-lg">
                <p className="text-xs text-[#1677FF] font-bold">CLEANZX Service Promise</p>
                <p className="text-sm font-bold text-slate-900 mt-1">
                  "Reliable doorstep car care before you start your morning commute."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FAQS */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#1677FF] bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-200">
            Got Questions?
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-3 font-heading">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Clear, transparent answers about our doorstep car cleaning services.
          </p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? -1 : index)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-slate-900 text-sm sm:text-base hover:text-[#1677FF] transition-colors cursor-pointer"
                >
                  <span>{faq.question}</span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-[#1677FF] shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 animate-in fade-in duration-200">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 9. BOOKING ENQUIRY SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BookingForm />
      </section>

      {/* 10. FINAL CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 sm:p-14 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#00A3FF]/20 blur-[120px] pointer-events-none"></div>

          <div className="max-w-2xl mx-auto space-y-6 relative z-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-heading">
              Ready for a Spotless Car Every Morning?
            </h2>
            <p className="text-sm sm:text-base text-slate-300">
              Reach out directly on WhatsApp or submit your booking enquiry today. We look forward to caring for your vehicle at your doorstep.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <a
                href={BUSINESS_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition-all hover:scale-105"
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                <span>Chat on WhatsApp ({BUSINESS_INFO.whatsapp})</span>
              </a>

              <a
                href={`tel:${BUSINESS_INFO.phone}`}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all"
              >
                <Phone className="w-4 h-4 text-[#00A3FF]" />
                <span>Call {BUSINESS_INFO.phoneFormatted}</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
