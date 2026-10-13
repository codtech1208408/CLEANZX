import React, { useState } from 'react';
import { Sparkles, Check, X, Shield, Clock, Calendar, ArrowRight, HelpCircle, Layers, Filter } from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { OPTIONAL_ADDONS, BUSINESS_INFO, SUBSCRIPTION_PLANS } from '../data/websiteData';
import SubscriptionCard from '../components/SubscriptionCard';
import BookingForm from '../components/BookingForm';

export default function PlansPage() {
  const { plans, selectPlanAndScroll, selectedPlan } = useBooking();
  const [categoryFilter, setCategoryFilter] = useState('ALL'); // 'ALL' | 'Normal' | 'Premium'

  const activePlans = (plans && plans.length > 0) ? plans : SUBSCRIPTION_PLANS;
  const filteredPlans = activePlans.filter((plan) => {
    if (categoryFilter === 'ALL') return true;
    return plan.category === categoryFilter;
  });

  const planComparisonFeatures = [
    { name: "Dust Removal (Microfiber sweep)", normal: true, premium: true },
    { name: "Exterior Bodywork Wash", normal: true, premium: true },
    { name: "Glass & Windscreen Clarity Polish", normal: true, premium: true },
    { name: "Tyre & Visible Wheel Wipe", normal: true, premium: true },
    { name: "Early Morning Slot Allocation (06:00 - 11:30 AM)", normal: true, premium: true },
    { name: "Priority Morning Slot Choice", normal: false, premium: true },
    { name: "Dedicated Vehicle Inspection", normal: false, premium: true },
    { name: "Optional Interior Detailing Compatibility", normal: true, premium: true },
  ];

  return (
    <div className="bg-white text-slate-900 space-y-24 sm:space-y-32 py-10">
      {/* 1. PLANS HERO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200 text-[#1677FF] text-xs sm:text-sm font-semibold mb-6">
          <Sparkles className="w-4 h-4" />
          <span>Doorstep Subscription Packages</span>
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 font-heading max-w-4xl mx-auto leading-tight">
          Choose the Right <span className="text-[#1677FF]">CLEANZX Plan</span>
        </h1>
        <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Flexible doorstep car cleaning plans designed for your routine and budget. Select a package below to carry your choice directly into the booking enquiry form.
        </p>

        {/* Category Filter Tabs */}
        <div className="mt-10 inline-flex items-center p-1.5 rounded-full bg-slate-100 border border-slate-200 shadow-sm">
          <button
            onClick={() => setCategoryFilter('ALL')}
            className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              categoryFilter === 'ALL'
                ? 'bg-[#1677FF] text-white shadow-md shadow-[#1677FF]/30'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Plans (8)
          </button>
          <button
            onClick={() => setCategoryFilter('Normal')}
            className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              categoryFilter === 'Normal'
                ? 'bg-[#1677FF] text-white shadow-md shadow-[#1677FF]/30'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Normal Category (4)
          </button>
          <button
            onClick={() => setCategoryFilter('Premium')}
            className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              categoryFilter === 'Premium'
                ? 'bg-[#1677FF] text-white shadow-md shadow-[#1677FF]/30'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Premium Category (4)
          </button>
        </div>
      </section>

      {/* 2. PLANS CARD GRID (ALL 8 PLANS ACROSS NORMAL & PREMIUM) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredPlans.map((plan) => (
            <SubscriptionCard
              key={plan.id}
              plan={plan}
              onSelect={() => selectPlanAndScroll(plan.name)}
            />
          ))}
        </div>

        <div className="mt-8 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 text-center max-w-3xl mx-auto">
          <p>
            * Pricing Policy: All subscription prices are confirmed upon review of your vehicle model and apartment location in Mehdipatnam/Hyderabad to ensure accurate pricing with no surprises.
          </p>
        </div>
      </section>

      {/* 3. PLAN COMPARISON TABLE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-md overflow-hidden">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1677FF] bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-200">
              Side-by-Side Evaluation
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3 font-heading">
              Plan Comparison Table
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              Compare inclusions between the Normal service tiers and comprehensive Premium packages across all 4 duration options (15 Days, Monthly, Quarterly, and Half-Yearly).
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-900">
                  <th className="py-4 px-4 font-bold">Service Features & Inclusions</th>
                  <th className="py-4 px-4 font-bold text-slate-700 text-center">Normal Plans</th>
                  <th className="py-4 px-4 font-bold text-[#1677FF] text-center bg-blue-50/60 rounded-t-xl">Premium Plans</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {planComparisonFeatures.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 text-slate-800 font-medium">
                      {item.name}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {item.normal ? (
                        <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                      ) : (
                        <X className="w-4 h-4 text-slate-300 mx-auto" />
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center bg-blue-50/30">
                      {item.premium ? (
                        <Check className="w-4 h-4 text-[#1677FF] mx-auto font-bold" />
                      ) : (
                        <X className="w-4 h-4 text-slate-300 mx-auto" />
                      )}
                    </td>
                  </tr>
                ))}
                <tr>
                  <td className="py-4 px-4 text-slate-600">Available Durations</td>
                  <td className="py-4 px-4 text-center text-slate-900 font-semibold">
                    15 Days, Monthly, Quarterly (3 Mo), Half-Yearly (6 Mo)
                  </td>
                  <td className="py-4 px-4 text-center text-[#1677FF] font-semibold bg-blue-50/30">
                    15 Days, Monthly, Quarterly (3 Mo), Half-Yearly (6 Mo)
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-4 text-slate-600">Pricing Status</td>
                  <td className="py-4 px-4 text-center text-slate-700">
                    Confirmed upon vehicle enquiry
                  </td>
                  <td className="py-4 px-4 text-center text-slate-700 bg-blue-50/30">
                    Confirmed upon vehicle enquiry
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 4. OPTIONAL ADD-ON PRICING INFO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading">
                Pair with Optional Detailing Add-ons
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                You can attach any of these services to your chosen subscription plan during enquiry submission.
              </p>
            </div>
            <button
              onClick={() => selectPlanAndScroll(selectedPlan || 'Monthly Normal Plan')}
              className="px-5 py-2.5 rounded-full bg-[#1677FF] hover:bg-[#00A3FF] text-white text-xs font-semibold self-start md:self-auto transition-colors cursor-pointer shadow-md"
            >
              Configure in Booking Form
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {OPTIONAL_ADDONS.map((addon) => (
              <div
                key={addon.id}
                className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-xs space-y-1.5"
              >
                <p className="font-semibold text-slate-900">{addon.name}</p>
                <p className="text-[11px] text-[#1677FF] font-medium">{addon.priceStatus}</p>
                <p className="text-[10px] text-slate-500 line-clamp-2">{addon.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. PLAN BOOKING ENQUIRY FORM */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BookingForm
          title="Complete Your Plan Enquiry"
          subtitle={`Submit your vehicle details below. Selected plan: ${selectedPlan || 'Monthly Normal Plan'}`}
        />
      </section>
    </div>
  );
}
