import React, { useState } from 'react';
import {
  CalendarCheck,
  Search,
  Filter,
  Plus,
  RefreshCw,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  X,
  History,
  MessageSquare,
  Sparkles,
  Calendar,
  User,
  ArrowRight
} from 'lucide-react';
import { useAdminData } from '../../../context/AdminDataContext';

export default function SubscriptionsTab({ onOpenWhatsApp }) {
  const {
    subscriptions,
    assignSubscription,
    renewSubscription,
    extendSubscription,
    cancelSubscription,
    customers,
    plans,
    employees
  } = useAdminData();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedSubForHistory, setSelectedSubForHistory] = useState(null);
  const [extendingSub, setExtendingSub] = useState(null);
  const [extendDays, setExtendDays] = useState(7);
  const [extendReason, setExtendReason] = useState('Customer vacation compensation');

  // New Subscription Form State
  const [assignForm, setAssignForm] = useState({
    customerId: '',
    planId: plans[0]?.id || 'normal-monthly',
    startDate: new Date().toISOString().slice(0, 10),
    durationDays: 30,
    timeSlot: '07:00 AM - 08:00 AM',
    assignedEmployee: employees[0]?.name || 'Ramesh Varma'
  });

  // Filter subscriptions
  const filteredSubs = subscriptions.filter(s => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      (s.customerName || '').toLowerCase().includes(q) ||
      (s.phone || '').includes(q) ||
      (s.apartment || '').toLowerCase().includes(q) ||
      (s.car || '').toLowerCase().includes(q) ||
      (s.planName || '').toLowerCase().includes(q);

    const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate upcoming expirations in 7 days
  const upcomingExpirations = subscriptions.filter(s => {
    if (s.status !== 'Active') return false;
    const expiry = new Date(s.expiryDate);
    const today = new Date();
    const diff = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    return diff >= 0 && diff <= 7;
  });

  const handleAssignSubmit = (e) => {
    e.preventDefault();
    const customer = customers.find(c => c.id === assignForm.customerId);
    const plan = plans.find(p => p.id === assignForm.planId);

    if (!customer || !plan) {
      alert('Please select both a valid customer and subscription plan.');
      return;
    }

    const start = new Date(assignForm.startDate);
    const end = new Date(start);
    end.setDate(end.getDate() + parseInt(assignForm.durationDays, 10));

    assignSubscription({
      customerId: customer.id,
      customerName: customer.name,
      phone: customer.phone,
      apartment: customer.apartment,
      flat: `${customer.block || ''} ${customer.flat_number || ''}`.trim(),
      car: `${customer.car_model} (${customer.vehicle_registration_number})`,
      planId: plan.id,
      planName: plan.name,
      category: plan.category,
      startDate: assignForm.startDate,
      expiryDate: end.toISOString().slice(0, 10),
      amount: plan.price || 899,
      timeSlot: assignForm.timeSlot,
      assignedEmployee: assignForm.assignedEmployee
    });

    setIsAssignModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Subscription Management
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Assign subscriptions, track active/pending/expired statuses, process renewals, grant extensions, and monitor upcoming expirations.
          </p>
        </div>

        <button
          onClick={() => {
            if (customers.length > 0) {
              setAssignForm(prev => ({ ...prev, customerId: customers[0].id }));
            }
            setIsAssignModalOpen(true);
          }}
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm shadow-cyan-600/30"
        >
          <Plus className="w-4 h-4" />
          <span>Assign New Subscription</span>
        </button>
      </div>

      {/* Expirations Alert Banner */}
      {upcomingExpirations.length > 0 && (
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 rounded-2xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-700 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-amber-900 text-xs sm:text-sm">
                {upcomingExpirations.length} Subscription(s) Expiring Within Next 7 Days
              </h4>
              <p className="text-[11px] text-amber-700 mt-0.5">
                Send 1-click renewal alerts via WhatsApp to ensure continuous morning car care.
              </p>
            </div>
          </div>
          <button
            onClick={() => setStatusFilter('Active')}
            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-semibold shrink-0 cursor-pointer"
          >
            Review Expiring
          </button>
        </div>
      )}

      {/* Filter Tabs & Search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {[
            { id: 'ALL', label: `All (${subscriptions.length})` },
            { id: 'Active', label: `Active (${subscriptions.filter(s => s.status === 'Active').length})` },
            { id: 'Renewed', label: `Renewed (${subscriptions.filter(s => s.status === 'Renewed').length})` },
            { id: 'Pending', label: `Pending (${subscriptions.filter(s => s.status === 'Pending').length})` },
            { id: 'Expired', label: `Expired (${subscriptions.filter(s => s.status === 'Expired').length})` },
            { id: 'Cancelled', label: `Cancelled (${subscriptions.filter(s => s.status === 'Cancelled').length})` }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setStatusFilter(t.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === t.id
                  ? 'bg-cyan-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search subscriptions..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Subscriptions Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Sub ID</th>
                <th className="py-3 px-4">Customer & Location</th>
                <th className="py-3 px-4">Car & Schedule</th>
                <th className="py-3 px-4">Plan & Category</th>
                <th className="py-3 px-4">Start / Expiry Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredSubs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    No subscriptions match current filter criteria.
                  </td>
                </tr>
              ) : (
                filteredSubs.map(sub => (
                  <tr key={sub.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-800">{sub.id}</td>
                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-900">{sub.customerName}</p>
                      <p className="text-[11px] text-slate-500">{sub.apartment} • {sub.flat}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-slate-800">{sub.car}</p>
                      <p className="text-[11px] text-cyan-700 font-medium">{sub.timeSlot}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-800">{sub.planName}</p>
                      <p className="text-[11px] text-slate-500 font-bold text-emerald-600">₹{sub.amount}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span className="block text-slate-600">{sub.startDate} to</span>
                      <span className="block font-bold text-slate-900">{sub.expiryDate}</span>
                      {sub.status === 'Active' && (
                        <span className="text-[10px] text-amber-700 font-bold">
                          {sub.daysRemaining} days remaining
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          sub.status === 'Active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : sub.status === 'Renewed'
                            ? 'bg-blue-100 text-blue-800'
                            : sub.status === 'Pending'
                            ? 'bg-amber-100 text-amber-800'
                            : sub.status === 'Expired'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {sub.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onOpenWhatsApp({
                            phone: sub.phone,
                            name: sub.customerName,
                            car: sub.car,
                            planName: sub.planName,
                            date: sub.expiryDate,
                            templateType: 'renewal'
                          })}
                          className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                          title="WhatsApp Renewal Reminder"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => {
                            if (confirm(`Renew subscription for ${sub.customerName} for +30 days?`)) {
                              renewSubscription(sub.id, 30);
                            }
                          }}
                          className="px-2 py-1 bg-cyan-50 hover:bg-cyan-100 text-cyan-700 rounded-lg font-semibold text-[11px] flex items-center gap-1 cursor-pointer"
                          title="Renew +30 Days"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>Renew</span>
                        </button>

                        <button
                          onClick={() => setExtendingSub(sub)}
                          className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg font-semibold text-[11px] cursor-pointer"
                          title="Extend Days"
                        >
                          <span>+Extend</span>
                        </button>

                        <button
                          onClick={() => setSelectedSubForHistory(sub)}
                          className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg cursor-pointer"
                          title="View History Log"
                        >
                          <History className="w-4 h-4" />
                        </button>

                        {sub.status !== 'Cancelled' && (
                          <button
                            onClick={() => {
                              const reason = prompt('Cancellation reason:', 'Requested by customer');
                              if (reason) cancelSubscription(sub.id, reason);
                            }}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                            title="Cancel Subscription"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ASSIGN SUBSCRIPTION MODAL */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-base">Assign New Subscription</h3>
              <button
                onClick={() => setIsAssignModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAssignSubmit} className="p-6 space-y-3 text-xs max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Customer</label>
                <select
                  required
                  value={assignForm.customerId}
                  onChange={(e) => setAssignForm({ ...assignForm, customerId: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl bg-white"
                >
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} - {c.apartment} ({c.car_model})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Plan</label>
                <select
                  required
                  value={assignForm.planId}
                  onChange={(e) => setAssignForm({ ...assignForm, planId: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl bg-white"
                >
                  {plans.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} - ₹{p.price} ({p.duration})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={assignForm.startDate}
                    onChange={(e) => setAssignForm({ ...assignForm, startDate: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Duration (Days)</label>
                  <input
                    type="number"
                    value={assignForm.durationDays}
                    onChange={(e) => setAssignForm({ ...assignForm, durationDays: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Morning Slot</label>
                  <select
                    value={assignForm.timeSlot}
                    onChange={(e) => setAssignForm({ ...assignForm, timeSlot: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl bg-white"
                  >
                    <option value="06:00 AM - 07:00 AM">06:00 AM - 07:00 AM</option>
                    <option value="07:00 AM - 08:00 AM">07:00 AM - 08:00 AM</option>
                    <option value="08:00 AM - 09:00 AM">08:00 AM - 09:00 AM</option>
                    <option value="09:00 AM - 10:00 AM">09:00 AM - 10:00 AM</option>
                    <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</option>
                    <option value="11:00 AM - 11:30 AM">11:00 AM - 11:30 AM</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Assigned Specialist</label>
                  <select
                    value={assignForm.assignedEmployee}
                    onChange={(e) => setAssignForm({ ...assignForm, assignedEmployee: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl bg-white"
                  >
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.name}>{emp.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="bg-slate-50 px-6 py-3 -mx-6 -mb-6 mt-4 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAssignModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-semibold shadow-md cursor-pointer"
                >
                  Assign Subscription
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EXTEND SUBSCRIPTION MODAL */}
      {extendingSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm">Extend Subscription Days</h3>
              <button
                onClick={() => setExtendingSub(null)}
                className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Granting extension for <span className="font-bold text-slate-900">{extendingSub.customerName}</span> (Current Expiry: {extendingSub.expiryDate}).
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Days to Add</label>
                <select
                  value={extendDays}
                  onChange={(e) => setExtendDays(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl bg-white"
                >
                  <option value={7}>+7 Days (1 Week)</option>
                  <option value={15}>+15 Days (Half Month)</option>
                  <option value={30}>+30 Days (1 Full Month)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Reason / Notes</label>
                <input
                  type="text"
                  value={extendReason}
                  onChange={(e) => setExtendReason(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                  placeholder="e.g. Vacation pause compensation"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setExtendingSub(null)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  extendSubscription(extendingSub.id, extendDays, extendReason);
                  setExtendingSub(null);
                }}
                className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                Apply Extension
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RENEWAL & HISTORY MODAL */}
      {selectedSubForHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm">Renewal & Modification History</h3>
                <p className="text-xs text-slate-400">{selectedSubForHistory.customerName} - {selectedSubForHistory.id}</p>
              </div>
              <button
                onClick={() => setSelectedSubForHistory(null)}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 max-h-[60vh] overflow-y-auto space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 block">Total Renewals Recorded:</span>
                <span className="font-bold text-slate-900 text-sm">{selectedSubForHistory.renewalCount || 0} time(s)</span>
              </div>

              <div className="space-y-2">
                <span className="font-bold text-slate-700 block">Audit Log Entries:</span>
                {(selectedSubForHistory.authorizedChanges || []).length === 0 ? (
                  <p className="text-slate-400 italic">No previous modifications logged for this subscription.</p>
                ) : (
                  selectedSubForHistory.authorizedChanges.map((entry, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-cyan-700">{entry.type}</span>
                        <span className="text-[10px] text-slate-400">{entry.date}</span>
                      </div>
                      <p className="text-slate-600">{entry.note}</p>
                      <span className="text-[10px] text-slate-400 block">By: {entry.by}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 text-right">
              <button
                onClick={() => setSelectedSubForHistory(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
