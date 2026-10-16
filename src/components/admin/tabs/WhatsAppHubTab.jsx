import React, { useState } from 'react';
import {
  MessageSquare,
  Send,
  Sparkles,
  Users,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  Car,
  Building,
  User,
  Phone,
  ArrowRight
} from 'lucide-react';
import { useAdminData } from '../../../context/AdminDataContext';

export default function WhatsAppHubTab({ onOpenWhatsApp }) {
  const { customers, subscriptions, dailySchedules, invoices } = useAdminData();

  const [selectedCustomerId, setSelectedCustomerId] = useState(customers[0]?.id || '');
  const [customPhone, setCustomPhone] = useState('');
  const [templateType, setTemplateType] = useState('booking');
  const [customText, setCustomText] = useState('');
  const [searchRoster, setSearchRoster] = useState('');

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId) || customers[0];

  const handleLaunchDirect = () => {
    const phoneToUse = customPhone || selectedCustomer?.phone || '9642734252';
    onOpenWhatsApp({
      phone: phoneToUse,
      name: selectedCustomer?.name || 'Customer',
      car: selectedCustomer?.car_model || 'Vehicle',
      regNumber: selectedCustomer?.vehicle_registration_number || '',
      apartment: selectedCustomer?.apartment || '',
      templateType
    });
  };

  const filteredRoster = customers.filter(c => {
    const q = searchRoster.toLowerCase();
    return (
      (c.name || '').toLowerCase().includes(q) ||
      (c.phone || '').includes(q) ||
      (c.apartment || '').toLowerCase().includes(q) ||
      (c.car_model || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-2">
            <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
            <span>Direct WhatsApp Communication Hub</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Customer WhatsApp Contact Center
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            1-click WhatsApp customer chat with smart contextual message templates for bookings, daily morning service updates, payments, and renewals.
          </p>
        </div>

        <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] text-slate-600 max-w-sm">
          <span className="font-bold text-slate-800 block">Integration Notice:</span>
          Manual messages launch via official WhatsApp click-to-chat links. Automated backend triggers require a separate WhatsApp Business API.
        </div>
      </div>

      {/* Two Column Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Message Composer (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-base">Compose & Launch WhatsApp Chat</h3>

          <div className="space-y-3 text-xs">
            {/* Customer Picker */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Select Customer</label>
              <select
                value={selectedCustomerId}
                onChange={(e) => {
                  setSelectedCustomerId(e.target.value);
                  setCustomPhone('');
                }}
                className="w-full p-2.5 border border-slate-300 rounded-xl bg-white"
              >
                {customers.length === 0 ? (
                  <option value="">No customers registered yet</option>
                ) : (
                  customers.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} - {c.apartment} ({c.phone})
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Custom Phone override */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Or Enter Custom Phone Number
              </label>
              <input
                type="text"
                value={customPhone}
                onChange={(e) => setCustomPhone(e.target.value)}
                placeholder="10-digit mobile number..."
                className="w-full p-2.5 border border-slate-300 rounded-xl font-mono"
              />
            </div>

            {/* Template Selector */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Message Category & Purpose</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'booking', label: '🚗 Booking Confirmation' },
                  { id: 'service_done', label: '✨ Service Completed' },
                  { id: 'payment', label: '💳 Payment Reminder' },
                  { id: 'renewal', label: '🔄 Renewal Alert' },
                  { id: 'support', label: '💬 General Support' }
                ].map(t => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTemplateType(t.id)}
                    className={`p-2.5 rounded-xl border text-left font-medium transition-all cursor-pointer ${
                      templateType === t.id
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-500 font-bold shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleLaunchDirect}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer text-sm"
              >
                <Send className="w-4 h-4" />
                <span>Open Chat in WhatsApp</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Quick Action Customer Roster (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Customer WhatsApp Contacts</h3>
              <p className="text-xs text-slate-500">Quick 1-click chat triggers for all active apartment customers</p>
            </div>

            <div className="relative w-48">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchRoster}
                onChange={(e) => setSearchRoster(e.target.value)}
                placeholder="Filter roster..."
                className="w-full pl-8 pr-2.5 py-1 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
            {filteredRoster.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                {customers.length === 0 ? 'No customer accounts registered yet.' : 'No customers match the current search.'}
              </div>
            ) : (
              filteredRoster.map(cust => (
              <div
                key={cust.id}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3 text-xs hover:bg-slate-100/70 transition-colors"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{cust.name}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        cust.subscriptionStatus === 'Active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {cust.subscriptionStatus}
                    </span>
                  </div>
                  <p className="text-slate-600">{cust.apartment} • Flat {cust.flat_number}</p>
                  <p className="text-[11px] font-mono text-cyan-700">{cust.car_model} ({cust.vehicle_registration_number})</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onOpenWhatsApp({
                      phone: cust.phone,
                      name: cust.name,
                      car: cust.car_model,
                      regNumber: cust.vehicle_registration_number,
                      apartment: cust.apartment,
                      templateType: 'service_done'
                    })}
                    className="px-2.5 py-1 bg-white hover:bg-slate-200 border border-slate-200 rounded-lg text-[11px] font-semibold text-slate-700 cursor-pointer"
                    title="Service Update"
                  >
                    ✨ Service Done
                  </button>

                  <button
                    onClick={() => onOpenWhatsApp({
                      phone: cust.phone,
                      name: cust.name,
                      car: cust.car_model,
                      regNumber: cust.vehicle_registration_number,
                      apartment: cust.apartment,
                      templateType: 'support'
                    })}
                    className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-xs transition-colors cursor-pointer"
                    title="Open WhatsApp"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )))}
          </div>
        </div>
      </div>
    </div>
  );
}
