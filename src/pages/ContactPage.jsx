import React, { useState } from 'react';
import { Phone, MessageSquare, MapPin, Clock, Send, CheckCircle2, Sparkles, Shield, ChevronDown, ChevronUp } from 'lucide-react';
import { BUSINESS_INFO, FAQS } from '../data/websiteData';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    setSubmitted(true);
  };

  const getDirectWhatsAppUrl = () => {
    const msg = `Hello CLEANZX, I have a query regarding your doorstep car cleaning in Hyderabad:
- Name: ${formData.name || 'Customer'}
- Phone: ${formData.phone || 'Not provided'}
- Message: ${formData.message || 'I would like more information about your plans.'}`;
    return `https://wa.me/91${BUSINESS_INFO.whatsapp}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="bg-white text-slate-900 space-y-24 sm:space-y-32 py-10">
      {/* 1. CONTACT HERO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200 text-[#1677FF] text-xs sm:text-sm font-semibold mb-6">
          <Sparkles className="w-4 h-4" />
          <span>Get in Touch with CLEANZX</span>
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 font-heading max-w-4xl mx-auto leading-tight">
          Contact Us for <span className="text-[#1677FF]">Doorstep Car Care</span>
        </h1>
        <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Reach our team directly by phone, WhatsApp, or submit an enquiry. We are ready to assist with subscription details, pricing, and society coverage in Hyderabad.
        </p>
      </section>

      {/* 2. CONTACT DETAILS & DIRECT ACTIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Phone Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md flex flex-col justify-between space-y-4 transition-all">
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#1677FF] flex items-center justify-center mb-3">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 font-heading">Call Directly</h3>
              <p className="text-xs text-slate-600 mt-1">Speak to our customer coordination team.</p>
            </div>
            <a
              href={`tel:${BUSINESS_INFO.phone}`}
              className="w-full py-2.5 rounded-xl bg-slate-50 hover:bg-[#1677FF] border border-slate-200 text-slate-800 hover:text-white text-xs font-semibold text-center transition-colors"
            >
              {BUSINESS_INFO.phoneFormatted}
            </a>
          </div>

          {/* WhatsApp Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md flex flex-col justify-between space-y-4 transition-all">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 font-heading">WhatsApp Chat</h3>
              <p className="text-xs text-slate-600 mt-1">Fast replies, booking confirmations & updates.</p>
            </div>
            <a
              href={BUSINESS_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-semibold text-center transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{BUSINESS_INFO.whatsapp}</span>
            </a>
          </div>

          {/* Location Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md flex flex-col justify-between space-y-4 transition-all">
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#1677FF] flex items-center justify-center mb-3">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 font-heading">Service Hub</h3>
              <p className="text-xs text-slate-600 mt-1">{BUSINESS_INFO.location.displayText}</p>
            </div>
            <span className="text-[11px] text-[#1677FF] font-semibold bg-blue-50 py-2 px-3 rounded-xl border border-blue-100 text-center">
              Hyderabad & Environs
            </span>
          </div>

          {/* Operating Hours Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md flex flex-col justify-between space-y-4 transition-all">
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#1677FF] flex items-center justify-center mb-3">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 font-heading">Service Hours</h3>
              <p className="text-xs text-slate-600 mt-1">{BUSINESS_INFO.operatingHours.daysNote}</p>
            </div>
            <div className="bg-slate-50 py-2 px-3 rounded-xl border border-slate-200 text-center">
              <span className="text-xs font-bold text-slate-900">{BUSINESS_INFO.operatingHours.displayText}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CONTACT FORM & MAP SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Quick Message Form */}
          <div className="bg-slate-50 p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-md relative">
            <h2 className="text-2xl font-bold text-slate-900 font-heading mb-2">
              Send a General Enquiry
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mb-6">
              Have questions about society parking access or custom vehicle packages? Send us a quick note.
            </p>

            {submitted ? (
              <div className="p-6 rounded-2xl bg-white border border-emerald-300 shadow-md text-center space-y-4">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <h3 className="text-lg font-bold text-slate-900">Message Recorded!</h3>
                <p className="text-xs text-slate-600">
                  Thank you for reaching out. We will respond promptly during our service hours (06:00 AM - 11:30 AM).
                </p>
                <div className="pt-2">
                  <a
                    href={getDirectWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#25D366] text-white text-xs font-semibold shadow-md"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Send Message via WhatsApp Instead</span>
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#1677FF]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g. 9642734252"
                      className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#1677FF]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@example.com"
                      className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#1677FF]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Subject / Topic
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g. Society coverage in Mehdipatnam"
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#1677FF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Message
                  </label>
                  <textarea
                    rows="4"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="How can we help you?"
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#1677FF]"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#1677FF] to-[#00A3FF] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#1677FF]/30 hover:scale-[1.01] transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>

          {/* Location Map View */}
          <div className="space-y-6">
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 shadow-md">
              <h2 className="text-xl font-bold text-slate-900 font-heading mb-2">
                Operational Base
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                Our primary operating base is centered in Mehdipatnam, serving residential communities and gated apartment complexes throughout central and western Hyderabad.
              </p>

              {/* Map embed / preview card for Mehdipatnam, Hyderabad */}
              <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white relative h-72 shadow-inner">
                <iframe
                  title="CLEANZX Service Location - Mehdipatnam, Hyderabad"
                  src="https://maps.google.com/maps?q=Mehdipatnam%2C%20Hyderabad%2C%20Telangana&t=&z=14&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-full border-0"
                  loading="lazy"
                ></iframe>
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 text-xs flex items-center gap-2 shadow-md">
                  <MapPin className="w-3.5 h-3.5 text-[#1677FF]" />
                  <span className="font-semibold text-slate-900">Mehdipatnam, Hyderabad</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
                <span>Operating Hours: 06:00 AM - 11:30 AM (IST)</span>
                <span className="text-[#1677FF] font-semibold">Doorstep Residential Slots</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FREQUENTLY ASKED QUESTIONS */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading">
            Booking & Contact FAQs
          </h2>
        </div>

        <div className="space-y-3">
          {FAQS.slice(0, 4).map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full p-4 text-left flex items-center justify-between gap-4 font-semibold text-slate-900 text-xs sm:text-sm hover:text-[#1677FF] transition-colors cursor-pointer"
                >
                  <span>{faq.question}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#1677FF] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
