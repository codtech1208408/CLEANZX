import React from 'react';
import { Check, Sparkles, Clock, Calendar, ArrowRight, ShieldCheck } from 'lucide-react';
import { useBooking } from '../context/BookingContext';

export default function SubscriptionCard({ plan, onSelect, featured = false }) {
  const { selectedPlan, selectPlanAndScroll } = useBooking();

  const isSelected = selectedPlan === plan.name;
  const isHighlighted = featured || plan.popular;

  const handleSelect = () => {
    if (onSelect) {
      onSelect(plan);
    } else {
      selectPlanAndScroll(plan.name);
    }
  };

  return (
    <div
      data-aos="fade-up"
      className={`rounded-2xl relative flex flex-col justify-between transition-all duration-300 p-6 sm:p-7 ${
        isHighlighted
          ? 'bg-gradient-to-b from-blue-50/60 to-white border-2 border-[#1677FF] shadow-xl shadow-blue-100'
          : 'bg-white border border-slate-200 shadow-md hover:shadow-xl hover:border-[#1677FF]/40'
      } ${isSelected ? 'ring-2 ring-[#1677FF]' : ''}`}
    >
      {/* Top badges */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <span
          className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
            plan.category === 'Premium'
              ? 'bg-blue-50 text-[#1677FF] border border-blue-200 font-semibold'
              : 'bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          {plan.category} Category
        </span>

        {plan.popular && (
          <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-gradient-to-r from-[#1677FF] to-[#00A3FF] text-white flex items-center gap-1 shadow-sm shadow-[#1677FF]/30">
            <Sparkles className="w-3 h-3" /> Popular
          </span>
        )}
      </div>

      {/* Plan Header */}
      <div>
        <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading">
          {plan.name}
        </h3>
        {plan.highlight && (
          <p className="text-xs text-slate-600 mt-1 line-clamp-2">
            {plan.highlight}
          </p>
        )}

        {/* Pricing Area */}
        <div className="mt-5 pb-5 border-b border-slate-100">
          <div className="flex items-baseline gap-2">
            {plan.price ? (
              <>
                <span className="text-3xl font-black text-slate-900 font-heading">
                  ₹{Number(plan.price).toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-slate-500">
                  / {plan.billingPeriod || plan.duration}
                </span>
              </>
            ) : (
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-bold text-slate-900 font-heading">
                  Price to be confirmed
                </span>
                <span className="text-[11px] text-[#1677FF] font-semibold mt-0.5">
                  Tailored by car segment & society
                </span>
              </div>
            )}
          </div>

          {/* Key Specs */}
          <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-slate-600">
            <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200">
              <Calendar className="w-3.5 h-3.5 text-[#1677FF] shrink-0" />
              <span className="truncate">Duration: <strong className="text-slate-900">{plan.duration}</strong></span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200">
              <Clock className="w-3.5 h-3.5 text-[#1677FF] shrink-0" />
              <span className="truncate">Morning Slots</span>
            </div>
          </div>
        </div>

        {/* Cleaning Frequency Note */}
        <div className="py-3 text-xs text-slate-600">
          <p className="text-[11px] uppercase font-bold tracking-wider text-[#1677FF] mb-1">
            Cleaning Frequency:
          </p>
          <p className="text-slate-900 font-medium text-xs">
            {plan.cleaningFrequency || 'Configured upon vehicle confirmation'}
          </p>
        </div>

        {/* Inclusions */}
        <div className="py-2">
          <p className="text-xs font-semibold text-slate-900 mb-2.5">
            Included in this plan:
          </p>
          <ul className="space-y-2 text-xs text-slate-600">
            {plan.includedServices && plan.includedServices.map((service, index) => (
              <li key={index} className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-slate-800">{service}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Select Plan Button */}
      <div className="mt-6 pt-4 border-t border-slate-100">
        <button
          onClick={handleSelect}
          className={`w-full py-3 px-4 rounded-xl font-semibold text-xs tracking-wide flex items-center justify-center gap-2 transition-all cursor-pointer ${
            isSelected
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-700/30'
              : isHighlighted
              ? 'bg-gradient-to-r from-[#1677FF] to-[#00A3FF] hover:from-[#00A3FF] hover:to-[#1677FF] text-white shadow-lg shadow-[#1677FF]/30 hover:scale-[1.02]'
              : 'bg-slate-100 hover:bg-[#1677FF] border border-slate-200 hover:border-[#1677FF] text-slate-800 hover:text-white'
          }`}
        >
          <span>{isSelected ? `Selected: ${plan.name}` : (plan.buttonLabel || `Select ${plan.name}`)}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
