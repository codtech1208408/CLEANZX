import React, { useState } from 'react';
import {
  Sparkles,
  Plus,
  Edit3,
  Trash2,
  CheckCircle2,
  Users,
  Calendar,
  Clock,
  ShieldCheck,
  AlertCircle,
  X,
  Save,
  Check,
  History,
  ArrowRight
} from 'lucide-react';
import { useAdminData } from '../../../context/AdminDataContext';

export default function PlansAddonsTab({ onOpenWhatsApp }) {
  const {
    plans,
    createPlan,
    updatePlan,
    deletePlan,
    togglePlanStatus,
    customers,
    subscriptions,
    authorizeSubscriptionDateChange,
    subscriptionChanges,
    websiteContent,
    updateAddon
  } = useAdminData();

  const [activeView, setActiveView] = useState('plans'); // 'plans' | 'addons' | 'date_changes'
  const [selectedPlanForCustomers, setSelectedPlanForCustomers] = useState(null);
  const [editingPlan, setEditingPlan] = useState(null);
  const [isNewPlan, setIsNewPlan] = useState(false);

  // Authorize Date Change Form State
  const [dateChangeForm, setDateChangeForm] = useState({
    subscriptionId: '',
    newStartDate: '',
    newExpiryDate: '',
    reason: '',
    authorizedBy: 'Admin'
  });
  const [dateChangeSuccess, setDateChangeSuccess] = useState('');

  // Handle plan modal submit
  const handleSavePlan = (e) => {
    e.preventDefault();
    if (!editingPlan.name || !editingPlan.category) {
      alert('Please provide plan name and category.');
      return;
    }

    if (isNewPlan) {
      createPlan(editingPlan);
    } else {
      updatePlan(editingPlan.id, editingPlan);
    }
    setEditingPlan(null);
  };

  const handleAuthorizeDateSubmit = (e) => {
    e.preventDefault();
    if (!dateChangeForm.subscriptionId || !dateChangeForm.reason) {
      alert('Please select a subscription and enter a valid authorization reason.');
      return;
    }
    authorizeSubscriptionDateChange(dateChangeForm);
    setDateChangeSuccess('Subscription dates authorized and updated successfully!');
    setDateChangeForm({
      subscriptionId: '',
      newStartDate: '',
      newExpiryDate: '',
      reason: '',
      authorizedBy: 'Admin'
    });
    setTimeout(() => setDateChangeSuccess(''), 4000);
  };

  // Customers enrolled in selected plan
  const enrolledCustomers = selectedPlanForCustomers
    ? subscriptions.filter(s =>
        s.planId === selectedPlanForCustomers.id ||
        (s.planName && s.planName.toLowerCase() === selectedPlanForCustomers.name.toLowerCase())
      )
    : [];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Subscription Plans & Add-ons
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Configure pricing, durations, features, view subscribed customers, and authorize subscription schedule changes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setIsNewPlan(true);
              setEditingPlan({
                name: '',
                displayName: '',
                category: 'Normal',
                duration: '1 month',
                price: 899,
                billingPeriod: 'Monthly',
                cleaningFrequency: 'Daily morning cycle (6:00 AM - 11:30 AM)',
                includedServices: [
                  'Dust Removal',
                  'Exterior Cleaning',
                  'Glass Cleaning',
                  'Tyre Cleaning'
                ],
                popular: false,
                highlight: 'Convenient morning upkeep for apartment cars',
                buttonLabel: 'Select Plan',
                status: 'Active'
              });
            }}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm shadow-cyan-600/30"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Plan</span>
          </button>
        </div>
      </div>

      {/* Navigation Pills */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveView('plans')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeView === 'plans'
              ? 'bg-cyan-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          All Subscription Plans ({plans.length})
        </button>
        <button
          onClick={() => setActiveView('addons')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeView === 'addons'
              ? 'bg-cyan-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Add-on Pricing ({websiteContent.addons.length})
        </button>
        <button
          onClick={() => setActiveView('date_changes')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeView === 'date_changes'
              ? 'bg-cyan-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>Authorised Date Changes</span>
        </button>
      </div>

      {/* 1. PLANS LIST */}
      {activeView === 'plans' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {plans.map(plan => {
            const customerCount = subscriptions.filter(s =>
              s.planId === plan.id ||
              (s.planName && s.planName.toLowerCase() === plan.name.toLowerCase())
            ).length;

            return (
              <div
                key={plan.id}
                className={`bg-white rounded-3xl border p-5 flex flex-col justify-between shadow-xs transition-all relative ${
                  plan.status === 'Active'
                    ? 'border-slate-200 hover:border-cyan-400'
                    : 'border-slate-300 opacity-60 bg-slate-50'
                }`}
              >
                {/* Badges */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      plan.category === 'Premium'
                        ? 'bg-purple-100 text-purple-800 border border-purple-200'
                        : 'bg-blue-100 text-blue-800 border border-blue-200'
                    }`}
                  >
                    {plan.category}
                  </span>

                  <div className="flex items-center gap-1.5">
                    {plan.popular && (
                      <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Popular
                      </span>
                    )}
                    <button
                      onClick={() => togglePlanStatus(plan.id)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md cursor-pointer ${
                        plan.status === 'Active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {plan.status}
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-base leading-snug">{plan.name}</h3>
                  <p className="text-xs text-slate-500 mt-1">{plan.duration} • {plan.billingPeriod}</p>

                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-2xl font-black text-slate-900">₹{plan.price}</span>
                    <span className="text-xs text-slate-500">/ {plan.duration}</span>
                  </div>

                  <p className="text-xs text-slate-600 italic mt-2 line-clamp-2">"{plan.highlight}"</p>

                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      Included Services ({plan.includedServices?.length || 0})
                    </p>
                    <ul className="space-y-1 text-xs text-slate-600">
                      {(plan.includedServices || []).slice(0, 4).map((srv, idx) => (
                        <li key={idx} className="flex items-center gap-1.5 truncate">
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                          <span className="truncate">{srv}</span>
                        </li>
                      ))}
                      {(plan.includedServices || []).length > 4 && (
                        <li className="text-[11px] text-cyan-600 font-medium">
                          + {plan.includedServices.length - 4} more inclusions
                        </li>
                      )}
                    </ul>
                  </div>
                </div>

                {/* Subscribed Customers Action & Controls */}
                <div className="mt-5 pt-3 border-t border-slate-100 space-y-2">
                  <button
                    onClick={() => setSelectedPlanForCustomers(plan)}
                    className="w-full py-2 px-3 bg-cyan-50 hover:bg-cyan-100 text-cyan-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>View {customerCount} Subscribed Customers</span>
                  </button>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      onClick={() => {
                        setIsNewPlan(false);
                        setEditingPlan({ ...plan });
                      }}
                      className="px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-cyan-600 hover:bg-slate-100 rounded-lg flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                    {plans.length > 1 && (
                      <button
                        onClick={() => {
                          if (confirm(`Delete ${plan.name}?`)) {
                            deletePlan(plan.id);
                          }
                        }}
                        className="px-2.5 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 2. ADDON PRICING */}
      {activeView === 'addons' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs max-w-4xl space-y-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Add-on Pricing & Configuration</h3>
            <p className="text-xs text-slate-500">Live prices reflected in Booking Form and Invoices</p>
          </div>

          <div className="divide-y divide-slate-100">
            {websiteContent.addons.map(addon => (
              <div key={addon.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900 text-sm">{addon.name}</h4>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-100 text-cyan-800">
                      {addon.badge || 'Detaling'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{addon.description}</p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-slate-500">₹</span>
                    <input
                      type="number"
                      defaultValue={addon.price}
                      onBlur={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        updateAddon(addon.id, { price: val, priceDisplay: `₹${val}` });
                      }}
                      className="w-24 p-2 text-xs font-bold border border-slate-300 rounded-xl text-slate-800 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. AUTHORISED SUBSCRIPTION DATE CHANGES */}
      {activeView === 'date_changes' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Authorization Form */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs lg:col-span-1 space-y-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Authorize Date Change</h3>
              <p className="text-xs text-slate-500">Postpone, extend, or pause customer subscription dates</p>
            </div>

            {dateChangeSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{dateChangeSuccess}</span>
              </div>
            )}

            <form onSubmit={handleAuthorizeDateSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Customer Subscription</label>
                <select
                  value={dateChangeForm.subscriptionId}
                  onChange={(e) => {
                    const subId = e.target.value;
                    const found = subscriptions.find(s => s.id === subId);
                    setDateChangeForm({
                      ...dateChangeForm,
                      subscriptionId: subId,
                      newStartDate: found?.startDate || '',
                      newExpiryDate: found?.expiryDate || ''
                    });
                  }}
                  className="w-full p-2.5 border border-slate-300 rounded-xl bg-white"
                  required
                >
                  <option value="">-- Choose Active Subscription --</option>
                  {subscriptions.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.customerName} - {s.planName} ({s.expiryDate})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">New Start Date</label>
                  <input
                    type="date"
                    value={dateChangeForm.newStartDate}
                    onChange={(e) => setDateChangeForm({ ...dateChangeForm, newStartDate: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">New Expiry Date</label>
                  <input
                    type="date"
                    value={dateChangeForm.newExpiryDate}
                    onChange={(e) => setDateChangeForm({ ...dateChangeForm, newExpiryDate: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Authorization Reason / Notes</label>
                <textarea
                  rows={3}
                  value={dateChangeForm.reason}
                  onChange={(e) => setDateChangeForm({ ...dateChangeForm, reason: e.target.value })}
                  placeholder="e.g. Customer requested 10 days out-of-station pause, approved by Operations Admin"
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-semibold shadow-md shadow-cyan-600/30 flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Authorize & Update Dates</span>
              </button>
            </form>
          </div>

          {/* Audit Log Table */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs lg:col-span-2 space-y-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Authorized Date Modifications Audit Log</h3>
              <p className="text-xs text-slate-500">Official log of all approved subscription adjustments</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-y border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Customer & Plan</th>
                    <th className="py-2.5 px-3">Changes</th>
                    <th className="py-2.5 px-3">Reason</th>
                    <th className="py-2.5 px-3">By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {subscriptionChanges.map(log => (
                    <tr key={log.id} className="hover:bg-slate-50/70">
                      <td className="py-3 px-3 font-mono text-[11px] text-slate-500">{log.date}</td>
                      <td className="py-3 px-3">
                        <p className="font-bold text-slate-900">{log.customerName}</p>
                        <p className="text-[10px] text-slate-400">{log.plan}</p>
                      </td>
                      <td className="py-3 px-3">
                        <span className="block text-[11px] text-slate-500">{log.oldValue}</span>
                        <span className="block text-[11px] font-bold text-emerald-600">→ {log.newValue}</span>
                      </td>
                      <td className="py-3 px-3 text-slate-600 max-w-[200px] truncate" title={log.reason}>
                        {log.reason}
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-700">{log.authorizedBy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* DRAWER: SUBSCRIBED CUSTOMERS FOR A PLAN */}
      {selectedPlanForCustomers && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">{selectedPlanForCustomers.name}</h3>
                <p className="text-xs text-slate-400">
                  {enrolledCustomers.length} Active Enrolled Customer(s)
                </p>
              </div>
              <button
                onClick={() => setSelectedPlanForCustomers(null)}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 max-h-[60vh] overflow-y-auto space-y-3">
              {enrolledCustomers.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-xs">
                  No active customers currently enrolled in this plan.
                </div>
              ) : (
                enrolledCustomers.map(sub => (
                  <div
                    key={sub.id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{sub.customerName}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {sub.status}
                        </span>
                      </div>
                      <p className="text-slate-600 mt-1">{sub.apartment} ({sub.flat})</p>
                      <p className="text-slate-500 text-[11px] font-mono">{sub.car} • Slot: {sub.timeSlot}</p>
                      <p className="text-[11px] text-cyan-700 mt-1">
                        Expiry: <span className="font-bold">{sub.expiryDate}</span> ({sub.daysRemaining} days left)
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedPlanForCustomers(null);
                        onOpenWhatsApp({
                          phone: sub.phone,
                          name: sub.customerName,
                          car: sub.car,
                          planName: sub.planName,
                          date: sub.expiryDate,
                          templateType: 'renewal'
                        });
                      }}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer shrink-0"
                    >
                      <span>WhatsApp</span>
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 text-right">
              <button
                onClick={() => setSelectedPlanForCustomers(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PLAN CREATE / EDIT MODAL */}
      {editingPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-base">{isNewPlan ? 'Create New Subscription Plan' : 'Edit Plan'}</h3>
              <button
                onClick={() => setEditingPlan(null)}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePlan} className="p-6 space-y-3 text-xs max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Plan Name</label>
                  <input
                    type="text"
                    required
                    value={editingPlan.name}
                    onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl"
                    placeholder="e.g. Monthly Normal Plan"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={editingPlan.category}
                    onChange={(e) => setEditingPlan({ ...editingPlan, category: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl bg-white"
                  >
                    <option value="Normal">Normal</option>
                    <option value="Premium">Premium</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Duration</label>
                  <input
                    type="text"
                    value={editingPlan.duration}
                    onChange={(e) => setEditingPlan({ ...editingPlan, duration: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl"
                    placeholder="e.g. 15 days, 1 month"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Base Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={editingPlan.price}
                    onChange={(e) => setEditingPlan({ ...editingPlan, price: parseFloat(e.target.value) || 0 })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Highlight / Promotional Text</label>
                <input
                  type="text"
                  value={editingPlan.highlight}
                  onChange={(e) => setEditingPlan({ ...editingPlan, highlight: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                  placeholder="e.g. Steady month-long car care before your daily drive"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Cleaning Frequency Note</label>
                <input
                  type="text"
                  value={editingPlan.cleaningFrequency}
                  onChange={(e) => setEditingPlan({ ...editingPlan, cleaningFrequency: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                  placeholder="e.g. Scheduled morning service cycles across 15 days"
                />
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingPlan.popular}
                    onChange={(e) => setEditingPlan({ ...editingPlan, popular: e.target.checked })}
                    className="rounded text-cyan-600 cursor-pointer"
                  />
                  <span className="font-semibold text-slate-700">Mark as Popular Badge</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingPlan.status === 'Active'}
                    onChange={(e) => setEditingPlan({
                      ...editingPlan,
                      status: e.target.checked ? 'Active' : 'Inactive'
                    })}
                    className="rounded text-cyan-600 cursor-pointer"
                  />
                  <span className="font-semibold text-slate-700">Active Status</span>
                </label>
              </div>

              <div className="bg-slate-50 px-6 py-3 -mx-6 -mb-6 mt-4 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingPlan(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-semibold shadow-md cursor-pointer"
                >
                  Save Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
