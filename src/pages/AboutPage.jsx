import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShieldCheck, HeartHandshake, Eye, Target, MapPin, Clock, Phone, MessageSquare, ArrowRight, CheckCircle2 } from 'lucide-react';
import { BUSINESS_INFO } from '../data/websiteData';

export default function AboutPage() {
  const values = [
    {
      title: "Convenience",
      description: "Make car cleaning effortless by serving customers directly at their residential apartment parking stalls.",
      icon: "ShieldCheck"
    },
    {
      title: "Consistency",
      description: "Offer clearly defined recurring service plans that support disciplined, regular vehicle maintenance.",
      icon: "Clock"
    },
    {
      title: "Transparency",
      description: "Communicate service inclusions, pricing, and booking details openly with no ambiguous commitments.",
      icon: "Eye"
    },
    {
      title: "Customer Focus",
      description: "Make enquiries, plan selection, and doorstep coordination straightforward and responsive.",
      icon: "HeartHandshake"
    }
  ];

  const serviceCommitments = [
    "Residential apartment-friendly procedures that respect society parking cleanliness.",
    "Morning service slots between 06:00 AM and 11:30 AM, preparing your vehicle before daily commutes.",
    "Gentle microfiber cleaning methods that protect paint finish against swirl marks and abrasive damage.",
    "Direct phone and WhatsApp assistance without call center runarounds.",
    "Clear distinction between standard plan inclusions and optional detailing add-ons."
  ];

  return (
    <div className="bg-white text-slate-900 space-y-24 sm:space-y-32 py-10">
      {/* 1. ABOUT HERO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200 text-[#1677FF] text-xs sm:text-sm font-semibold mb-6">
          <Sparkles className="w-4 h-4" />
          <span>About CLEANZX</span>
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 font-heading max-w-4xl mx-auto leading-tight">
          A Cleaner Car, <br />
          <span className="text-[#1677FF]">Without Leaving Home</span>
        </h1>
        <p className="mt-5 text-base sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
          CLEANZX provides convenient doorstep car cleaning services for car owners in Hyderabad. Our goal is to make routine vehicle care simpler through accessible cleaning services and flexible subscription options.
        </p>
      </section>

      {/* 2. WHO WE ARE & MISSION / VISION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1677FF] bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-200">
              Who We Are
            </span>
            <h2 className="text-3xl font-bold text-slate-900 font-heading">
              Dedicated Doorstep Vehicle Care in Mehdipatnam
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Operating out of Mehdipatnam, Hyderabad, CLEANZX was built to eliminate the hassle of routine car washing for apartment residents, busy working professionals, and families.
            </p>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Instead of navigating congested roads to find a washing center or relying on inconsistent roadside cleaning, our customers enjoy systematic morning car maintenance performed right in their allotted parking spaces.
            </p>

            <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1677FF] flex items-center justify-center">
                  <Target className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 font-heading">Our Mission</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  To make regular car cleaning convenient, accessible, and easy to schedule for residential customers.
                </p>
              </div>

              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1677FF] flex items-center justify-center">
                  <Eye className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 font-heading">Our Vision</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  To become a trusted doorstep car cleaning service provider in Hyderabad.
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-xl">
              <img
                src="/images/interior-vacuum.jpg"
                alt="Automotive care and cleaning detailing"
                className="w-full h-[450px] object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white p-5 rounded-2xl border border-slate-200 shadow-xl max-w-xs hidden sm:block">
              <p className="text-xs font-bold text-[#1677FF]">Operational Location</p>
              <p className="text-sm font-bold text-slate-900 mt-1">{BUSINESS_INFO.location.displayText}</p>
              <p className="text-xs text-slate-500 mt-0.5">{BUSINESS_INFO.operatingHours.displayText}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CORE VALUES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-[#1677FF] bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-200">
            Our Core Principles
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-3 font-heading">
            Values That Guide Our Service
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Every appointment is handled according to our commitment to customer satisfaction and vehicle paint protection.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((val, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-[#1677FF]/40 transition-all space-y-3"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#1677FF]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-heading">{val.title}</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {val.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. SERVICE COMMITMENTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50 rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1677FF] bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-200">
              Reliability Standards
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-3 font-heading">
              Our Service Commitments
            </h2>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              We hold our doorstep operations to defined operational standards so you can count on consistent results every single week:
            </p>

            <ul className="mt-6 space-y-3.5">
              {serviceCommitments.map((commitment, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-sm text-slate-800 leading-relaxed">{commitment}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 5. CONTACT CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 sm:p-14 text-center text-white space-y-6 shadow-xl">
          <h2 className="text-3xl font-extrabold text-white font-heading">
            Connect With Our Mehdipatnam Team
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
            Have questions about apartment parking permissions or want to schedule a trial plan? Reach out directly via phone or WhatsApp.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              to="/contact"
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#1677FF] to-[#00A3FF] text-white font-bold text-sm shadow-lg shadow-[#1677FF]/30 hover:scale-105 transition-all"
            >
              Contact Information
            </Link>
            <a
              href={BUSINESS_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-sm flex items-center gap-2 transition-colors"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp: {BUSINESS_INFO.whatsappFormatted}</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
