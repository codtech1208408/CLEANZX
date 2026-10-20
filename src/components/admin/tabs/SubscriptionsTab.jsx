import React, { useState, useMemo } from 'react';
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
  ArrowRight,
  Trash2,
  Camera,
  UserCheck,
  Eye,
  Check,
  Phone,
  Building,
  Car
} from 'lucide-react';
import { useAdminData } from '../../../context/AdminDataContext';

export default function SubscriptionsTab({ onOpenWhatsApp }) {
  const {
    subscriptions,
    assignSubscription,
    assignSubscriptionEmployee,
    renewSubscription,
    extendSubscription,
    cancelSubscription,
    deleteSubscription,
    customers,
    plans,
    employees,
    carAssignments,
    dailySchedules,
    fetchCarAssignments,
    updateCarAssignmentStatus
  } = useAdminData();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Filter only records belonging to existing active customers
  const validCustIds = new Set(customers.map(c => c.id).filter(Boolean));
  const validCustNames = new Set(customers.map(c => (c.name || '').trim().toLowerCase()).filter(Boolean));
  const validCustPhones = new Set(customers.map(c => (c.phone || '').replace(/\D/g, '').slice(-10)).filter(Boolean));

  const isCustActive = (customerId, customerName, phone) => {
    if (!customers || customers.length === 0) return true;
    if (customerId && validCustIds.has(customerId)) return true;
    if (customerName && validCustNames.has((customerName || '').trim().toLowerCase())) return true;
    const cleanPh = (phone || '').replace(/\D/g, '').slice(-10);
    if (cleanPh && validCustPhones.has(cleanPh)) return true;
    // Always preserve recorded subscriptions that have customer information
    return Boolean(customerName || customerId || phone);
  };

  const activeSubscriptions = subscriptions.filter(s => isCustActive(s.customerId, s.customerName, s.phone));

  // Modals
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedSubForHistory, setSelectedSubForHistory] = useState(null);
  const [extendingSub, setExtendingSub] = useState(null);
  const [extendDays, setExtendDays] = useState(7);
  const [extendReason, setExtendReason] = useState('Customer vacation compensation');

  // Assign Employee to Subscribed Car Modal State
  const [assigningEmpSub, setAssigningEmpSub] = useState(null);
  const [selectedEmpId, setSelectedEmpId] = useState('');

  // Daily Updates & Photos Modal State (Per Subscription)
  const [selectedSubForUpdates, setSelectedSubForUpdates] = useState(null);
  const [dailyStatusFilter, setDailyStatusFilter] = useState('ALL');
  const [dailySearch, setDailySearch] = useState('');
  const [inspectedPhoto, setInspectedPhoto] = useState(null);

  // All Daily Updates & Photos Modal State (Across All Subscriptions)
  const [isAllUpdatesModalOpen, setIsAllUpdatesModalOpen] = useState(false);
  const [allUpdatesDateFilter, setAllUpdatesDateFilter] = useState('ALL');
  const [allUpdatesStatusFilter, setAllUpdatesStatusFilter] = useState('ALL');
  const [allUpdatesEmpFilter, setAllUpdatesEmpFilter] = useState('ALL');
  const [allUpdatesSearch, setAllUpdatesSearch] = useState('');

  // New Subscription Form State
  const [assignForm, setAssignForm] = useState({
    customerId: '',
    planId: plans[0]?.id || 'normal-monthly',
    startDate: new Date().toISOString().slice(0, 10),
    durationDays: 30,
    timeSlot: '07:00 AM - 08:00 AM',
    assignedEmployee: employees[0]?.name || 'Ramesh Varma'
  });

  const parseToNoon = (dStr) => {
    if (!dStr) return new Date();
    const parts = String(dStr).slice(0, 10).split('-');
    if (parts.length === 3) {
      return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10), 12, 0, 0);
    }
    return new Date(dStr);
  };

  const toYMD = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const getPhotoUrl = (photo) => {
    if (!photo) return null;
    if (typeof photo === 'string') return photo;
    if (typeof photo === 'object' && photo.url) return photo.url;
    return null;
  };

  // Helper to get all daily records for a subscription across its entire period
  const getSubscriptionDays = (sub) => {
    if (!sub) return [];
    const cleanStr = (s) => (s || '').replace(/[\s\-\_]/g, '').toUpperCase();
    const subReg = cleanStr(sub.regNumber || (sub.car ? (sub.car.match(/\(([^)]+)\)/)?.[1] || '') : ''));

    const start = parseToNoon(sub.startDate || new Date().toISOString().slice(0, 10));
    const defaultEnd = new Date(start.getTime() + 30 * 24 * 60 * 60 * 1000);
    const end = parseToNoon(sub.expiryDate || toYMD(defaultEnd));

    const days = [];
    const cur = new Date(start);
    let dayCount = 1;

    while (cur <= end) {
      const dStr = toYMD(cur);
      const dailyId = `DAILY-${sub.id}-${dStr}`;

      // 1. Look in carAssignments
      let matched = (carAssignments || []).find(ca =>
        ca.id === dailyId ||
        (ca.subscriptionId === sub.id && ca.date === dStr) ||
        (subReg && cleanStr(ca.regNumber) === subReg && ca.date === dStr)
      );

      // 2. Also check dailySchedules (synced in real-time)
      const schedMatched = (dailySchedules || []).find(s =>
        s.id === dailyId ||
        (s.subscriptionId === sub.id && s.date === dStr) ||
        (subReg && cleanStr(s.regNumber) === subReg && s.date === dStr)
      );

      if (schedMatched) {
        if (!matched) {
          matched = schedMatched;
        } else {
          matched = {
            ...matched,
            beforePhoto: matched.beforePhoto || schedMatched.beforePhoto,
            afterPhoto: matched.afterPhoto || schedMatched.afterPhoto,
            status: matched.status === 'Completed' ? 'Completed' : (schedMatched.status === 'Completed' ? 'Completed' : (matched.status || schedMatched.status)),
            completedAt: matched.completedAt || schedMatched.completedAt,
            notes: matched.notes || schedMatched.notes
          };
        }
      }

      days.push(matched ? {
        ...matched,
        id: matched.id || dailyId,
        subscriptionId: sub.id,
        date: dStr,
        dayNumber: matched.dayNumber || dayCount,
        carModel: matched.carModel || sub.carModel || (sub.car ? sub.car.split('(')[0]?.trim() : 'Car'),
        regNumber: matched.regNumber || sub.regNumber || (sub.car ? (sub.car.match(/\(([^)]+)\)/)?.[1] || 'TS-REG') : 'TS-REG'),
        employeeName: matched.employeeName || sub.assignedEmployee || 'Unassigned',
        customerName: matched.customerName || sub.customerName
      } : {
        id: dailyId,
        subscriptionId: sub.id,
        dayNumber: dayCount,
        date: dStr,
        timeSlot: sub.timeSlot || '07:00 AM - 08:00 AM',
        customerName: sub.customerName,
        phone: sub.phone,
        apartment: sub.apartment,
        block: sub.block || '',
        flat: sub.flat,
        car: sub.car,
        carModel: sub.carModel || (sub.car ? sub.car.split('(')[0]?.trim() : 'Car'),
        regNumber: sub.regNumber || (sub.car ? (sub.car.match(/\(([^)]+)\)/)?.[1] || 'TS-REG') : 'TS-REG'),
        planName: sub.planName,
        employeeId: sub.assignedEmployeeId || 'EMP-01',
        employeeName: sub.assignedEmployee || 'Unassigned',
        status: 'Pending',
        beforePhoto: null,
        afterPhoto: null,
        notes: ''
      });

      cur.setDate(cur.getDate() + 1);
      dayCount++;
    }

    return days;
  };

  // Aggregated list of all daily records across all active subscriptions
  const allSubscriptionDailyRecords = useMemo(() => {
    const list = [];
    activeSubscriptions.forEach(sub => {
      const days = getSubscriptionDays(sub);
      days.forEach(d => {
        list.push({
          ...d,
          subscription: sub
        });
      });
    });
    return list.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  }, [activeSubscriptions, carAssignments, dailySchedules]);

  const todayStr = new Date().toISOString().slice(0, 10);
  const tomorrowObj = new Date();
  tomorrowObj.setDate(tomorrowObj.getDate() + 1);
  const tomorrowStr = tomorrowObj.toISOString().slice(0, 10);

  const filteredAllDailyRecords = useMemo(() => {
    return allSubscriptionDailyRecords.filter(item => {
      if (allUpdatesDateFilter === 'today' && item.date !== todayStr) return false;
      if (allUpdatesDateFilter === 'tomorrow' && item.date !== tomorrowStr) return false;
      if (allUpdatesDateFilter.match(/^\d{4}-\d{2}-\d{2}$/) && item.date !== allUpdatesDateFilter) return false;

      if (allUpdatesStatusFilter === 'Completed' && item.status !== 'Completed') return false;
      if (allUpdatesStatusFilter === 'Pending' && item.status === 'Completed') return false;

      if (allUpdatesEmpFilter !== 'ALL') {
        const cleanTarget = allUpdatesEmpFilter.toLowerCase().trim();
        const matchEmp = (item.employeeName || '').toLowerCase().trim() === cleanTarget ||
                         (item.employeeId || '').toLowerCase().trim() === cleanTarget;
        if (!matchEmp) return false;
      }

      if (allUpdatesSearch.trim()) {
        const q = allUpdatesSearch.toLowerCase().trim();
        const matchSearch =
          (item.customerName || '').toLowerCase().includes(q) ||
          (item.car || '').toLowerCase().includes(q) ||
          (item.carModel || '').toLowerCase().includes(q) ||
          (item.regNumber || '').toLowerCase().includes(q) ||
          (item.apartment || '').toLowerCase().includes(q) ||
          (item.employeeName || '').toLowerCase().includes(q) ||
          (item.date || '').includes(q);
        if (!matchSearch) return false;
      }

      return true;
    });
  }, [allSubscriptionDailyRecords, allUpdatesDateFilter, allUpdatesStatusFilter, allUpdatesEmpFilter, allUpdatesSearch, todayStr, tomorrowStr]);

  // Filter subscriptions
  const filteredSubs = activeSubscriptions.filter(s => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      (s.customerName || '').toLowerCase().includes(q) ||
      (s.phone || '').includes(q) ||
      (s.apartment || '').toLowerCase().includes(q) ||
      (s.car || '').toLowerCase().includes(q) ||
      (s.planName || '').toLowerCase().includes(q) ||
      (s.assignedEmployee || '').toLowerCase().includes(q);

    const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate upcoming expirations in 7 days
  const upcomingExpirations = activeSubscriptions.filter(s => {
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

    const emp = employees.find(e => e.name === assignForm.assignedEmployee);

    assignSubscription({
      customerId: customer.id,
      customerName: customer.name,
      phone: customer.phone,
      apartment: customer.apartment,
      flat: `${customer.block || ''} ${customer.flat_number || ''}`.trim(),
      car: `${customer.car_model} (${customer.vehicle_registration_number})`,
      carModel: customer.car_model,
      regNumber: customer.vehicle_registration_number,
      planId: plan.id,
      planName: plan.name,
      category: plan.category,
      startDate: assignForm.startDate,
      expiryDate: end.toISOString().slice(0, 10),
      amount: plan.price || 899,
      timeSlot: assignForm.timeSlot,
      assignedEmployee: assignForm.assignedEmployee,
      assignedEmployeeId: emp?.id || 'EMP-01'
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
            Assign customer subscribed cars to specialists for full subscription periods, track daily cleaning before/after photos, and manage renewals.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => {
              setIsAllUpdatesModalOpen(true);
              setAllUpdatesDateFilter('ALL');
              setAllUpdatesStatusFilter('ALL');
              setAllUpdatesEmpFilter('ALL');
              setAllUpdatesSearch('');
            }}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-slate-900/20"
          >
            <Camera className="w-4 h-4 text-cyan-400" />
            <span>All Daily Updates & Photos</span>
          </button>

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
            placeholder="Search subscriptions or staff..."
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
                <th className="py-3 px-4">Assigned Specialist</th>
                <th className="py-3 px-4">Daily Updates</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredSubs.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-slate-400">
                    No subscriptions match current filter criteria.
                  </td>
                </tr>
              ) : (
                filteredSubs.map(sub => {
                  const subDays = getSubscriptionDays(sub);
                  const doneDays = subDays.filter(d => d.status === 'Completed').length;
                  const totalDaysCount = subDays.length;
                  const withPhotos = subDays.filter(d => d.beforePhoto?.url || d.afterPhoto?.url).length;

                  return (
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

                      {/* Assigned Specialist (Full Period) */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-slate-800">
                            {sub.assignedEmployee || 'Unassigned'}
                          </span>
                          <button
                            onClick={() => {
                              setAssigningEmpSub(sub);
                              const foundEmp = employees.find(e => e.name === sub.assignedEmployee);
                              setSelectedEmpId(foundEmp?.id || employees[0]?.id || 'EMP-01');
                            }}
                            className="p-1 text-cyan-700 hover:bg-cyan-50 rounded-md transition-colors cursor-pointer"
                            title="Assign or Change Specialist for Full Subscription Period"
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <span className="text-[10px] text-slate-400 block">Full Subscription Period</span>
                      </td>

                      {/* Daily Updates & Photos */}
                      <td className="py-3 px-4">
                        <button
                          onClick={() => {
                            setSelectedSubForUpdates(sub);
                            setDailyStatusFilter('ALL');
                            setDailySearch('');
                          }}
                          className="px-2.5 py-1.5 bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border border-cyan-200 rounded-xl font-bold text-[11px] flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                          title="View Daily Updates and Photos for Full Subscription Period"
                        >
                          <Camera className="w-3.5 h-3.5 text-cyan-600" />
                          <span>{doneDays}/{totalDaysCount} Done</span>
                          {withPhotos > 0 && (
                            <span className="px-1.5 py-0.2 rounded-full bg-emerald-600 text-white text-[9px] font-black">
                              {withPhotos}📷
                            </span>
                          )}
                        </button>
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
                          {/* View Daily Photos */}
                          <button
                            onClick={() => {
                              setSelectedSubForUpdates(sub);
                              setDailyStatusFilter('ALL');
                              setDailySearch('');
                            }}
                            className="p-1.5 text-cyan-600 hover:bg-cyan-50 rounded-lg cursor-pointer"
                            title="View Daily Photos & Service Logs"
                          >
                            <Camera className="w-4 h-4" />
                          </button>

                          {/* Assign Employee for Full Period */}
                          <button
                            onClick={() => {
                              setAssigningEmpSub(sub);
                              const foundEmp = employees.find(e => e.name === sub.assignedEmployee);
                              setSelectedEmpId(foundEmp?.id || employees[0]?.id || 'EMP-01');
                            }}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer"
                            title="Assign Specialist for Full Period"
                          >
                            <UserCheck className="w-4 h-4" />
                          </button>

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

                          {/* Delete Subscription */}
                          <button
                            onClick={() => {
                              if (window.confirm(`Permanently delete subscription ${sub.id} for ${sub.customerName || 'customer'}?`)) {
                                deleteSubscription(sub.id);
                              }
                            }}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Permanently Delete Subscription"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ASSIGN NEW SUBSCRIPTION MODAL */}
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
                  <label className="block font-semibold text-slate-700 mb-1">Assigned Specialist (Full Period)</label>
                  <select
                    value={assignForm.assignedEmployee}
                    onChange={(e) => setAssignForm({ ...assignForm, assignedEmployee: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl bg-white font-semibold"
                  >
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.name}>{emp.name} ({emp.id})</option>
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

      {/* ASSIGN SUBSCRIBED CAR TO EMPLOYEE (FULL SUBSCRIPTION PERIOD) MODAL */}
      {assigningEmpSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-sm">Assign Subscribed Car to Specialist</h3>
              </div>
              <button
                onClick={() => setAssigningEmpSub(null)}
                className="w-7 h-7 rounded-lg hover:bg-white/20 flex items-center justify-center cursor-pointer text-slate-300 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Customer:</span>
                  <span className="font-bold text-slate-900">{assigningEmpSub.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Subscribed Car:</span>
                  <span className="font-bold text-cyan-800">{assigningEmpSub.car}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Apartment & Flat:</span>
                  <span className="font-medium text-slate-700">{assigningEmpSub.apartment} • {assigningEmpSub.flat}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Subscription Period:</span>
                  <span className="font-bold text-slate-900">{assigningEmpSub.startDate} to {assigningEmpSub.expiryDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Time Slot:</span>
                  <span className="font-medium text-cyan-700">{assigningEmpSub.timeSlot}</span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Employee (Doorstep Detailing Specialist)</label>
                <select
                  value={selectedEmpId}
                  onChange={(e) => setSelectedEmpId(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl bg-white font-medium"
                >
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} ({emp.id}) - {emp.role || 'Specialist'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 bg-cyan-50 border border-cyan-200 rounded-xl text-cyan-900 text-[11px] space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
                  Full Subscription Period Assignment
                </p>
                <p className="text-cyan-800 leading-relaxed">
                  This employee will be assigned to clean this customer's car every morning from {assigningEmpSub.startDate} to {assigningEmpSub.expiryDate}. All daily cleaning records are allocated for photo uploads and status tracking.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAssigningEmpSub(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const targetEmp = employees.find(e => e.id === selectedEmpId) || employees[0];
                    if (targetEmp && assignSubscriptionEmployee) {
                      assignSubscriptionEmployee(assigningEmpSub.id, targetEmp.id, targetEmp.name);
                    }
                    setAssigningEmpSub(null);
                  }}
                  className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
                >
                  Assign for Full Period
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DAILY CLEANING UPDATES & PHOTOS TRACKER (FULL SUBSCRIPTION PERIOD) MODAL */}
      {selectedSubForUpdates && (() => {
        const allSubDays = getSubscriptionDays(selectedSubForUpdates);
        const completedCount = allSubDays.filter(d => d.status === 'Completed').length;
        const pendingCount = allSubDays.filter(d => d.status !== 'Completed').length;
        const photosCount = allSubDays.filter(d => d.beforePhoto?.url || d.afterPhoto?.url).length;

        const filteredDays = allSubDays.filter(day => {
          const matchesStatus =
            dailyStatusFilter === 'ALL'
              ? true
              : dailyStatusFilter === 'Completed'
              ? day.status === 'Completed'
              : day.status !== 'Completed';
          const matchesSearch =
            !dailySearch ||
            day.date.includes(dailySearch) ||
            (day.employeeName || '').toLowerCase().includes(dailySearch.toLowerCase()) ||
            (day.notes || '').toLowerCase().includes(dailySearch.toLowerCase());
          return matchesStatus && matchesSearch;
        });

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
              {/* Header */}
              <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shrink-0">
                <div>
                  <div className="flex items-center gap-2">
                    <Camera className="w-5 h-5 text-cyan-400" />
                    <h3 className="font-bold text-base">Daily Car-Cleaning Updates & Photos</h3>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    {selectedSubForUpdates.customerName} • <strong className="text-white">{selectedSubForUpdates.car}</strong> • Period: {selectedSubForUpdates.startDate} to {selectedSubForUpdates.expiryDate}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedSubForUpdates(null)}
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer text-slate-300 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Stats & Filters Bar */}
              <div className="p-4 sm:p-6 bg-slate-50 border-b border-slate-200 shrink-0 space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Total Days</span>
                    <span className="text-xl font-black text-slate-900">{allSubDays.length} Days</span>
                  </div>
                  <div className="bg-white p-3 rounded-2xl border border-emerald-200 shadow-xs">
                    <span className="text-[10px] text-emerald-700 uppercase font-bold block">Completed</span>
                    <span className="text-xl font-black text-emerald-600">{completedCount}</span>
                  </div>
                  <div className="bg-white p-3 rounded-2xl border border-amber-200 shadow-xs">
                    <span className="text-[10px] text-amber-700 uppercase font-bold block">Pending</span>
                    <span className="text-xl font-black text-amber-600">{pendingCount}</span>
                  </div>
                  <div className="bg-white p-3 rounded-2xl border border-cyan-200 shadow-xs">
                    <span className="text-[10px] text-cyan-700 uppercase font-bold block">Days with Photos</span>
                    <span className="text-xl font-black text-cyan-700">{photosCount}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-1">
                  <div className="flex items-center gap-1.5 w-full sm:w-auto">
                    {['ALL', 'Completed', 'Pending'].map(statusKey => (
                      <button
                        key={statusKey}
                        onClick={() => setDailyStatusFilter(statusKey)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          dailyStatusFilter === statusKey
                            ? 'bg-cyan-600 text-white shadow-xs'
                            : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                        }`}
                      >
                        {statusKey === 'ALL' ? `All Days (${allSubDays.length})` : statusKey === 'Completed' ? `Completed (${completedCount})` : `Pending (${pendingCount})`}
                      </button>
                    ))}
                  </div>

                  <div className="relative w-full sm:w-56">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search date (e.g. 2026-10)..."
                      value={dailySearch}
                      onChange={(e) => setDailySearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-1 text-xs border border-slate-300 rounded-xl bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Daily List */}
              <div className="p-4 sm:p-6 overflow-y-auto space-y-3 flex-1">
                {filteredDays.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 text-xs">
                    No daily records found matching your filter.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {filteredDays.map((dayItem) => {
                      const isDayDone = dayItem.status === 'Completed';
                      return (
                        <div
                          key={dayItem.id}
                          className={`p-4 rounded-2xl border transition-all ${
                            isDayDone
                              ? 'bg-emerald-50/20 border-emerald-200'
                              : 'bg-white border-slate-200'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2.5">
                            <div className="flex items-center gap-2">
                              <span className="font-black text-xs text-slate-900">
                                Day {dayItem.dayNumber}
                              </span>
                              <span className="font-mono text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                                {dayItem.date}
                              </span>
                            </div>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                isDayDone
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {dayItem.status}
                            </span>
                          </div>

                          <div className="text-[11px] text-slate-600 mb-2.5">
                            Specialist: <strong className="text-slate-900">{dayItem.employeeName || selectedSubForUpdates.assignedEmployee || 'Unassigned'}</strong>
                          </div>

                          {/* Photos Grid */}
                          <div className="grid grid-cols-2 gap-2">
                            {/* Before Photo */}
                            <div className="bg-slate-50 p-2 rounded-xl border border-slate-200 text-center">
                              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                                Before Clean
                              </span>
                              {getPhotoUrl(dayItem.beforePhoto) ? (
                                <div
                                  onClick={() => setInspectedPhoto({
                                    url: getPhotoUrl(dayItem.beforePhoto),
                                    title: `Before Cleaning • ${selectedSubForUpdates.car}`,
                                    time: dayItem.beforePhoto?.uploadedAt || new Date().toISOString(),
                                    type: `Day ${dayItem.dayNumber} (${dayItem.date}) - Before Cleaning Photo`
                                  })}
                                  className="aspect-video rounded-lg overflow-hidden border border-slate-200 bg-slate-100 cursor-pointer group relative"
                                >
                                  <img
                                    src={getPhotoUrl(dayItem.beforePhoto)}
                                    alt="Before"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                  />
                                  <div className="absolute inset-0 bg-slate-950/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                                    <Eye className="w-4 h-4" />
                                  </div>
                                </div>
                              ) : (
                                <div className="aspect-video rounded-lg border border-dashed border-slate-300 flex items-center justify-center text-[10px] text-slate-400">
                                  No before photo
                                </div>
                              )}
                              {dayItem.beforePhoto?.uploadedAt && (
                                <span className="text-[8px] text-slate-400 block mt-1 truncate">
                                  {new Date(dayItem.beforePhoto.uploadedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              )}
                            </div>

                            {/* After Photo */}
                            <div className="bg-slate-50 p-2 rounded-xl border border-slate-200 text-center">
                              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                                After Clean
                              </span>
                              {getPhotoUrl(dayItem.afterPhoto) ? (
                                <div
                                  onClick={() => setInspectedPhoto({
                                    url: getPhotoUrl(dayItem.afterPhoto),
                                    title: `After Cleaning • ${selectedSubForUpdates.car}`,
                                    time: dayItem.afterPhoto?.uploadedAt || new Date().toISOString(),
                                    type: `Day ${dayItem.dayNumber} (${dayItem.date}) - After Cleaning Photo`
                                  })}
                                  className="aspect-video rounded-lg overflow-hidden border border-slate-200 bg-slate-100 cursor-pointer group relative"
                                >
                                  <img
                                    src={getPhotoUrl(dayItem.afterPhoto)}
                                    alt="After"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                  />
                                  <div className="absolute inset-0 bg-slate-950/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                                    <Eye className="w-4 h-4" />
                                  </div>
                                </div>
                              ) : (
                                <div className="aspect-video rounded-lg border border-dashed border-slate-300 flex items-center justify-center text-[10px] text-slate-400">
                                  No after photo
                                </div>
                              )}
                              {dayItem.afterPhoto?.uploadedAt && (
                                <span className="text-[8px] text-slate-400 block mt-1 truncate">
                                  {new Date(dayItem.afterPhoto.uploadedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              )}
                            </div>
                          </div>

                          {dayItem.notes && (
                            <p className="mt-2 text-[10px] text-slate-500 italic bg-white p-1.5 rounded-lg border border-slate-100">
                              "{dayItem.notes}"
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end shrink-0">
                <button
                  onClick={() => setSelectedSubForUpdates(null)}
                  className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Close Daily Tracker
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ALL DAILY CAR-CLEANING UPDATES & PHOTOS (ACROSS ALL CUSTOMERS) MODAL */}
      {isAllUpdatesModalOpen && (() => {
        const totalCompleted = allSubscriptionDailyRecords.filter(r => r.status === 'Completed').length;
        const totalPending = allSubscriptionDailyRecords.filter(r => r.status !== 'Completed').length;
        const totalWithPhotos = allSubscriptionDailyRecords.filter(r => r.beforePhoto?.url || r.afterPhoto?.url).length;

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-3xl w-full max-w-6xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[94vh]">
              {/* Header */}
              <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center shrink-0">
                    <Camera className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-black text-base tracking-tight text-white">
                        All Daily Car-Cleaning Updates & Photos
                      </h3>
                      <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-extrabold uppercase">
                        Admin Central Feed
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Monitor daily before/after photos, detailing specialists, and service status across all customer subscriptions.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsAllUpdatesModalOpen(false)}
                  className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer text-slate-300 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Stats & Controls Bar */}
              <div className="p-4 sm:p-6 bg-slate-50 border-b border-slate-200 shrink-0 space-y-3">
                {/* 4 Summary Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Total Daily Visits</span>
                    <span className="text-xl font-black text-slate-900">{allSubscriptionDailyRecords.length} Days</span>
                  </div>
                  <div className="bg-white p-3 rounded-2xl border border-emerald-200 shadow-xs">
                    <span className="text-[10px] text-emerald-700 uppercase font-bold block">Completed Services</span>
                    <span className="text-xl font-black text-emerald-600">{totalCompleted}</span>
                  </div>
                  <div className="bg-white p-3 rounded-2xl border border-amber-200 shadow-xs">
                    <span className="text-[10px] text-amber-700 uppercase font-bold block">Pending Services</span>
                    <span className="text-xl font-black text-amber-600">{totalPending}</span>
                  </div>
                  <div className="bg-white p-3 rounded-2xl border border-cyan-200 shadow-xs">
                    <span className="text-[10px] text-cyan-700 uppercase font-bold block">Days with Photos</span>
                    <span className="text-xl font-black text-cyan-700">{totalWithPhotos}</span>
                  </div>
                </div>

                {/* Filters Row */}
                <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 pt-1">
                  {/* Date Filters & Calendar */}
                  <div className="flex flex-wrap items-center gap-1.5 text-xs">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mr-1">Date:</span>
                    {[
                      { id: 'ALL', label: `All (${allSubscriptionDailyRecords.length})` },
                      { id: 'today', label: `Today (${allSubscriptionDailyRecords.filter(r => r.date === todayStr).length})` },
                      { id: 'tomorrow', label: `Tomorrow (${allSubscriptionDailyRecords.filter(r => r.date === tomorrowStr).length})` }
                    ].map(dt => (
                      <button
                        key={dt.id}
                        onClick={() => setAllUpdatesDateFilter(dt.id)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          allUpdatesDateFilter === dt.id
                            ? 'bg-slate-900 text-white shadow-xs'
                            : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                        }`}
                      >
                        {dt.label}
                      </button>
                    ))}

                    <input
                      type="date"
                      value={allUpdatesDateFilter.match(/^\d{4}-\d{2}-\d{2}$/) ? allUpdatesDateFilter : ''}
                      onChange={(e) => setAllUpdatesDateFilter(e.target.value || 'ALL')}
                      className="px-2 py-1 text-xs font-mono font-bold border border-slate-300 rounded-xl bg-white text-slate-800 cursor-pointer"
                      title="Pick specific date"
                    />
                  </div>

                  {/* Status, Specialist & Search */}
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Status Filters */}
                    <div className="flex items-center gap-1">
                      {['ALL', 'Completed', 'Pending'].map(st => (
                        <button
                          key={st}
                          onClick={() => setAllUpdatesStatusFilter(st)}
                          className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            allUpdatesStatusFilter === st
                              ? 'bg-cyan-600 text-white shadow-xs'
                              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                          }`}
                        >
                          {st === 'ALL' ? 'All Status' : st}
                        </button>
                      ))}
                    </div>

                    {/* Specialist Filter */}
                    <select
                      value={allUpdatesEmpFilter}
                      onChange={(e) => setAllUpdatesEmpFilter(e.target.value)}
                      className="px-2.5 py-1 text-xs border border-slate-300 rounded-xl bg-white text-slate-700 font-semibold cursor-pointer"
                    >
                      <option value="ALL">All Specialists</option>
                      {employees.map(e => (
                        <option key={e.id} value={e.name}>{e.name}</option>
                      ))}
                    </select>

                    {/* Search */}
                    <div className="relative w-full sm:w-52">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search car, customer, apartment..."
                        value={allUpdatesSearch}
                        onChange={(e) => setAllUpdatesSearch(e.target.value)}
                        className="w-full pl-8 pr-3 py-1 text-xs border border-slate-300 rounded-xl bg-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Daily Records Grid */}
              <div className="p-4 sm:p-6 overflow-y-auto space-y-3 flex-1">
                {filteredAllDailyRecords.length === 0 ? (
                  <div className="text-center py-16 text-slate-400 text-xs space-y-2">
                    <Camera className="w-10 h-10 mx-auto text-slate-300 opacity-80" />
                    <p className="font-bold text-slate-600 text-sm">No daily cleaning updates match your filters</p>
                    <p className="text-slate-400 max-w-sm mx-auto">
                      Try selecting "All Dates" or clearing your search term to see recorded car visits.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredAllDailyRecords.map((item) => {
                      const isDone = item.status === 'Completed';

                      return (
                        <div
                          key={item.id}
                          className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                            isDone
                              ? 'bg-emerald-50/20 border-emerald-200 shadow-xs'
                              : 'bg-white border-slate-200 shadow-xs'
                          }`}
                        >
                          <div>
                            {/* Header: Date, Day & Status */}
                            <div className="flex items-center justify-between gap-2 mb-2.5">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-black text-xs text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
                                  Day {item.dayNumber}
                                </span>
                                <span className="font-mono text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                                  {item.date}
                                </span>
                              </div>
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                  isDone
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}
                              >
                                ● {item.status}
                              </span>
                            </div>

                            {/* Customer & Car Info */}
                            <div className="space-y-1 mb-3">
                              <div className="flex items-center justify-between">
                                <h4 className="font-extrabold text-sm text-slate-900 truncate">
                                  {item.customerName}
                                </h4>
                                <span className="font-mono text-[10px] font-black text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
                                  {item.regNumber}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 truncate">
                                {item.carModel} • {item.apartment} {item.flat ? `(Flat ${item.flat})` : ''}
                              </p>
                              <p className="text-[11px] text-slate-600 flex items-center gap-1 pt-0.5">
                                <User className="w-3 h-3 text-cyan-600 shrink-0" />
                                <span>Specialist: <strong className="text-slate-900">{item.employeeName || 'Assigned Specialist'}</strong></span>
                              </p>
                            </div>

                            {/* Before & After Photos Side-by-Side */}
                            <div className="grid grid-cols-2 gap-2 text-center text-xs">
                              {/* Before Photo */}
                              <div className="bg-slate-50 p-2 rounded-xl border border-slate-200 flex flex-col justify-between">
                                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                                  Before Clean
                                </span>
                                {getPhotoUrl(item.beforePhoto) ? (
                                  <div
                                    onClick={() => setInspectedPhoto({
                                      url: getPhotoUrl(item.beforePhoto),
                                      title: `Before Cleaning • ${item.carModel} (${item.regNumber})`,
                                      time: item.beforePhoto?.uploadedAt || new Date().toISOString(),
                                      type: `${item.customerName} - ${item.date} (Before Cleaning)`
                                    })}
                                    className="aspect-video rounded-lg overflow-hidden border border-slate-200 bg-slate-100 cursor-pointer group relative"
                                  >
                                    <img
                                      src={getPhotoUrl(item.beforePhoto)}
                                      alt="Before"
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                    />
                                    <div className="absolute inset-0 bg-slate-950/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                                      <Eye className="w-4 h-4 drop-shadow" />
                                    </div>
                                  </div>
                                ) : (
                                  <div className="aspect-video rounded-lg border border-dashed border-slate-300 flex items-center justify-center text-[10px] text-slate-400">
                                    No before photo
                                  </div>
                                )}
                                {item.beforePhoto?.uploadedAt && (
                                  <span className="text-[8px] text-slate-400 block mt-1 truncate">
                                    {new Date(item.beforePhoto.uploadedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                )}
                              </div>

                              {/* After Photo */}
                              <div className="bg-slate-50 p-2 rounded-xl border border-slate-200 flex flex-col justify-between">
                                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                                  After Clean
                                </span>
                                {getPhotoUrl(item.afterPhoto) ? (
                                  <div
                                    onClick={() => setInspectedPhoto({
                                      url: getPhotoUrl(item.afterPhoto),
                                      title: `After Cleaning • ${item.carModel} (${item.regNumber})`,
                                      time: item.afterPhoto?.uploadedAt || new Date().toISOString(),
                                      type: `${item.customerName} - ${item.date} (After Cleaning)`
                                    })}
                                    className="aspect-video rounded-lg overflow-hidden border border-slate-200 bg-slate-100 cursor-pointer group relative"
                                  >
                                    <img
                                      src={getPhotoUrl(item.afterPhoto)}
                                      alt="After"
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                    />
                                    <div className="absolute inset-0 bg-slate-950/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                                      <Eye className="w-4 h-4 drop-shadow" />
                                    </div>
                                  </div>
                                ) : (
                                  <div className="aspect-video rounded-lg border border-dashed border-slate-300 flex items-center justify-center text-[10px] text-slate-400">
                                    No after photo
                                  </div>
                                )}
                                {item.afterPhoto?.uploadedAt && (
                                  <span className="text-[8px] text-slate-400 block mt-1 truncate">
                                    {new Date(item.afterPhoto.uploadedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                )}
                              </div>
                            </div>

                            {item.notes && (
                              <p className="mt-2 text-[10px] text-slate-500 italic bg-white p-1.5 rounded-lg border border-slate-100">
                                "{item.notes}"
                              </p>
                            )}
                          </div>

                          {/* Quick Status Changers for Admin */}
                          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                if (updateCarAssignmentStatus) {
                                  updateCarAssignmentStatus(item.id, 'Completed', item.notes, null, item.date, item);
                                }
                              }}
                              className={`flex-1 py-1.5 px-2 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                                isDone
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200'
                              }`}
                            >
                              <Check className="w-3 h-3" />
                              <span>{isDone ? 'Completed ✓' : 'Mark Completed'}</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                if (updateCarAssignmentStatus) {
                                  updateCarAssignmentStatus(item.id, 'Pending', item.notes, null, item.date, item);
                                }
                              }}
                              className={`flex-1 py-1.5 px-2 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                                !isDone
                                  ? 'bg-amber-500 text-white'
                                  : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200'
                              }`}
                            >
                              <Clock className="w-3 h-3" />
                              <span>{!isDone ? 'Pending ●' : 'Mark Pending'}</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between shrink-0">
                <span className="text-xs text-slate-500">
                  Showing <strong className="text-slate-800">{filteredAllDailyRecords.length}</strong> of {allSubscriptionDailyRecords.length} total subscription records
                </span>
                <button
                  onClick={() => setIsAllUpdatesModalOpen(false)}
                  className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Close All Updates Feed
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* PHOTO INSPECTION MODAL */}
      {inspectedPhoto && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 rounded-3xl max-w-2xl w-full border border-slate-800 overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between text-white">
              <div>
                <h4 className="font-bold text-sm text-cyan-300">{inspectedPhoto.title}</h4>
                <span className="text-[10px] text-slate-400">{inspectedPhoto.type} • {inspectedPhoto.time ? new Date(inspectedPhoto.time).toLocaleString() : 'Uploaded'}</span>
              </div>
              <button
                onClick={() => setInspectedPhoto(null)}
                className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 bg-black flex items-center justify-center">
              <img
                src={inspectedPhoto.url}
                alt="Inspection"
                className="max-h-[70vh] w-auto max-w-full rounded-xl object-contain shadow-2xl"
              />
            </div>
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
