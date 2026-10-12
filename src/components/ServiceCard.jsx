import React from 'react';
import { Wind, Car, Sparkles, CircleDot, CheckCircle2, ArrowRight } from 'lucide-react';
import { useBooking } from '../context/BookingContext';

const iconMap = {
  Wind: Wind,
  Car: Car,
  Sparkles: Sparkles,
  CircleDot: CircleDot
};

export default function ServiceCard({ service, onSelect }) {
  const { selectPlanAndScroll } = useBooking();
  const IconComponent = iconMap[service.icon] || Sparkles;

  const handleAction = () => {
    if (onSelect) {
      onSelect(service);
    } else {
      selectPlanAndScroll('Normal Plan');
    }
  };

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-md hover:shadow-xl hover:border-[#00A3FF]/60 flex flex-col group transition-all duration-300"
    >
      {/* Visual Image Header */}
      <div className="relative h-48 sm:h-52 overflow-hidden bg-slate-100">
        <img
          src={service.image}
          alt={service.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent"></div>

        {/* Floating Badge */}
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full border border-slate-200 flex items-center gap-2 shadow-sm">
          <IconComponent className="w-3.5 h-3.5 text-[#1677FF]" />
          <span className="text-[11px] font-semibold text-slate-800 tracking-wide">Included in Plans</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#1677FF] transition-colors font-heading">
            {service.name}
          </h3>
          <p className="text-xs text-[#1677FF] font-semibold mt-0.5">
            {service.tagline}
          </p>
          <p className="text-sm text-slate-600 mt-2.5 leading-relaxed">
            {service.description}
          </p>

          {/* Details list */}
          {service.details && (
            <ul className="mt-4 space-y-1.5 text-xs text-slate-600">
              {service.details.map((detail, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Action */}
        <div className="pt-3 border-t border-slate-100">
          <button
            onClick={handleAction}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-50 hover:bg-[#1677FF] border border-slate-200 hover:border-[#1677FF] text-slate-800 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer group/btn"
          >
            <span>Book This Service</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
