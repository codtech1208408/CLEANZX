import React from 'react';
import { Sparkles, Shield, CheckCircle2, ArrowRight, Layers, Car, Wind, CircleDot, Fan, Gauge, Armchair } from 'lucide-react';
import { STANDARD_SERVICES, OPTIONAL_ADDONS, BUSINESS_INFO } from '../data/websiteData';
import { useBooking } from '../context/BookingContext';
import { useAdminData } from '../context/AdminDataContext';
import ServiceCard from '../components/ServiceCard';
import BookingForm from '../components/BookingForm';

export default function ServicesPage() {
  const { selectPlanAndScroll, selectedAddons, toggleAddon } = useBooking();
  const { websiteContent } = useAdminData();
  const dynamicServices = websiteContent?.services?.filter(s => s.published) || STANDARD_SERVICES;
  const dynamicAddons = websiteContent?.addons?.filter(a => a.published) || OPTIONAL_ADDONS;

  const scrollToBooking = () => {
    const el = document.getElementById('booking-enquiry-form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="bg-white text-slate-900 space-y-24 sm:space-y-28 py-10">
      {/* 1. SERVICES HERO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200 text-[#1677FF] text-xs sm:text-sm font-semibold mb-6">
          <Sparkles className="w-4 h-4" />
          <span>Professional Automotive Doorstep Care</span>
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 font-heading max-w-4xl mx-auto leading-tight">
          Complete Car Cleaning Solutions, <br />
          <span className="text-[#1677FF]">Directly at Your Residence</span>
        </h1>
        <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          From everyday dust clearing to thorough exterior washes and optional interior detailing, CLEANZX ensures your vehicle remains presentable and protected throughout the week.
        </p>
      </section>

      {/* 2. STANDARD CLEANING SERVICES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#1677FF] bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-200">
            Included in Plans
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3 font-heading">
            Our 4 Core Standard Cleaning Services
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-2xl">
            Every CLEANZX subscription package includes these fundamental services to preserve your car's finish without causing paint scratches or parking mess.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {dynamicServices.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onSelect={() => selectPlanAndScroll('Normal Plan')}
            />
          ))}
        </div>
      </section>

      {/* 3. DETAILED SERVICE DESCRIPTIONS & BENEFITS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50 rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-12">
          <div className="max-w-3xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading">
              Why Our Cleaning Method Matters
            </h2>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Traditional local car cleaners often use harsh dirty rags and bucket water that trap grit and cause permanent swirl marks. At CLEANZX, we use color-coded microfiber towels and automotive-grade solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1677FF] flex items-center justify-center font-bold">
                01
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-heading">Scratch-Free Microfiber Tech</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                High-density microfiber fibers trap fine dust particles without grinding them against your clear coat, keeping vehicle paint glossy.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1677FF] flex items-center justify-center font-bold">
                02
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-heading">Apartment Safe & Water Conscious</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Designed to comply with apartment society rules in Mehdipatnam. No excessive water pooling or splashing onto neighbouring vehicles.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1677FF] flex items-center justify-center font-bold">
                03
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-heading">Early Morning Efficiency</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Operating strictly between 06:00 AM and 11:30 AM so you leave for office or chores with a pristine, mirror-like vehicle every time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. OPTIONAL PAID ADD-ON SERVICES */}
      <section id="addons" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#1677FF] bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-200">
            A La Carte Enhancements
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3 font-heading">
            Optional Paid Add-on Services
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-2xl">
            Upgrade your regular subscription with targeted deep cleaning treatments. Note: All add-on prices are confirmed individually based on your car model and interior condition.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dynamicAddons.map((addon) => {
            const isSelected = selectedAddons.includes(addon.id);
            return (
              <div
                key={addon.id}
                className={`bg-white rounded-2xl border shadow-sm transition-all flex flex-col justify-between overflow-hidden group ${
                  isSelected ? 'border-[#1677FF] ring-2 ring-[#1677FF]/20 shadow-md' : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
                }`}
              >
                <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                  <img
                    src={addon.image}
                    alt={addon.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <span className="absolute top-3 right-3 text-[11px] bg-white/95 backdrop-blur-md text-[#1677FF] px-2.5 py-1 rounded-full border border-blue-100 font-semibold shadow-sm">
                    {addon.badge}
                  </span>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <h3 className="text-xl font-bold text-slate-900 font-heading">
                        {addon.name}
                      </h3>
                      <span className="text-xs text-slate-500 font-medium">
                        {addon.priceStatus}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                      {addon.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-600 font-medium">
                      {isSelected ? '✓ Added to selection' : 'Not yet selected'}
                    </span>
                    <button
                      onClick={() => {
                        toggleAddon(addon.id);
                        scrollToBooking();
                      }}
                      className={`text-xs px-3.5 py-2 rounded-xl font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-slate-100 hover:bg-[#1677FF] border border-slate-200 hover:border-[#1677FF] text-slate-800 hover:text-white'
                      }`}
                    >
                      {isSelected ? 'Remove' : 'Select Add-on'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. SERVICE PROCESS */}
      <section className="bg-slate-50 border-y border-slate-200 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1677FF] bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-200">
              Execution Protocol
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-3 font-heading">
              How Technicians Service Your Vehicle
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Our structured 4-step on-site execution protocol ensures meticulous quality at every appointment.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <span className="text-2xl font-black text-[#1677FF] font-heading">01</span>
              <h3 className="text-base font-bold text-slate-900">Visual Inspection</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Technician locates vehicle in designated apartment bay and checks surface condition and glass clarity.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <span className="text-2xl font-black text-[#1677FF] font-heading">02</span>
              <h3 className="text-base font-bold text-slate-900">Dry Dust Extraction</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Specialized microfiber sweep clears loose surface sand and fine soot from hood, roof, and boot panels.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <span className="text-2xl font-black text-[#1677FF] font-heading">03</span>
              <h3 className="text-base font-bold text-slate-900">Body & Glass Clean</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Application of automotive cleaning solution, thorough body wipe, and non-smear windscreen glass polishing.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <span className="text-2xl font-black text-[#1677FF] font-heading">04</span>
              <h3 className="text-base font-bold text-slate-900">Wheel & Tyre Detailing</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Removal of rim brake dust and tyre grime wipe-down, leaving wheels neat and presentable for your drive.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. BOOKING FORM SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BookingForm
          title="Ready to Schedule Your Cleaning?"
          subtitle="Choose your preferred service, apartment location, and slot. Our team will verify and confirm promptly."
        />
      </section>
    </div>
  );
}
