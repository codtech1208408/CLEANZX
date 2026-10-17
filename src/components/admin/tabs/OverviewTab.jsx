import React from 'react';
import {
  Users,
  CalendarCheck,
  CreditCard,
  TrendingUp,
  Clock,
  UserCheck,
  AlertTriangle,
  FileText,
  Download,
  ArrowUpRight,
  Sparkles,
  CheckCircle,
  Car
} from 'lucide-react';
import { useAdminData } from '../../../context/AdminDataContext';

export default function OverviewTab({ setActiveTab, onOpenWhatsApp }) {
  const {
    customers,
    subscriptions,
    bookings,
    employees,
    dailySchedules,
    invoices,
    plans
  } = useAdminData();

  // Filter only records belonging to existing active customers
  const validCustIds = new Set(customers.map(c => c.id).filter(Boolean));
  const validCustNames = new Set(customers.map(c => (c.name || '').trim().toLowerCase()).filter(Boolean));
  const validCustPhones = new Set(customers.map(c => (c.phone || '').replace(/\D/g, '').slice(-10)).filter(Boolean));

  const isCustActive = (customerId, customerName, phone) => {
    if (customers.length === 0) return true;
    if (customerId && validCustIds.has(customerId)) return true;
    if (customerName && validCustNames.has((customerName || '').trim().toLowerCase())) return true;
    const cleanPh = (phone || '').replace(/\D/g, '').slice(-10);
    if (cleanPh && validCustPhones.has(cleanPh)) return true;
    return true;
  };

  const activeCustomerSubs = Array.isArray(subscriptions) ? subscriptions : [];
  const activeCustomerSchedules = Array.isArray(dailySchedules) ? dailySchedules : [];
  const activeCustomerInvoices = Array.isArray(invoices) ? invoices : [];

  // Metrics calculations
  const totalCustomers = customers.length;
  const activeSubs = activeCustomerSubs.filter(s => s.status === 'Active' || s.status === 'Renewed');
  const expiredSubs = activeCustomerSubs.filter(s => s.status === 'Expired');
  const pendingSubs = activeCustomerSubs.filter(s => s.status === 'Pending');

  // Next 7 days upcoming expirations
  const upcomingExpirations = activeCustomerSubs.filter(s => {
    if (s.status !== 'Active') return false;
    const expiry = new Date(s.expiryDate);
    const today = new Date();
    const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 7;
  });

  // Services today
  const todaySchedules = activeCustomerSchedules;
  const completedServices = todaySchedules.filter(s => s.status === 'Completed').length;
  const missedServices = todaySchedules.filter(s => s.status === 'Missed').length;
  const inProgressServices = todaySchedules.filter(s => s.status === 'In Progress').length;
  const assignedServices = todaySchedules.filter(s => s.status === 'Assigned').length;

  // Revenue & Invoices
  const totalInvoiced = activeCustomerInvoices.reduce((acc, inv) => acc + (inv.total || 0), 0);
  const totalRecordedRevenue = activeCustomerInvoices.reduce((acc, inv) => acc + (inv.amountPaid || 0), 0);
  const outstandingBalance = activeCustomerInvoices.reduce((acc, inv) => acc + (inv.balance || 0), 0);
  const paidInvoicesCount = activeCustomerInvoices.filter(i => i.status === 'Paid').length;
  const pendingInvoicesCount = activeCustomerInvoices.filter(i => i.status === 'Pending' || i.status === 'Partially Paid').length;

  // Active workforce
  const activeEmployees = employees.filter(e => e.status === 'Active').length;

  // Export full reports
  const exportAllDataCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'CLEANZX SYSTEM REPORT\n' +
      `Generated Date,${new Date().toLocaleString()}\n\n` +
      'METRICS SUMMARY\n' +
      `Total Customers,${totalCustomers}\n` +
      `Active Subscriptions,${activeSubs.length}\n` +
      `Expired Subscriptions,${expiredSubs.length}\n` +
      `Total Invoiced Amount,₹${totalInvoiced}\n` +
      `Recorded Revenue Collected,₹${totalRecordedRevenue}\n` +
      `Pending Outstanding Balance,₹${outstandingBalance}\n\n` +
      'CUSTOMER ROSTER\n' +
      'ID,Name,Phone,Apartment,Flat,Car,Plan,Status,Balance\n' +
      customers.map(c => `"${c.id}","${c.name}","${c.phone}","${c.apartment}","${c.flat_number}","${c.car_model}","${c.activePlan}","${c.subscriptionStatus}","₹${c.balanceDue}"`).join('\n');

    const encoded = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encoded);
    link.setAttribute('download', `cleanzx_operations_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportAllDataJSON = () => {
    const reportData = {
      generatedAt: new Date().toISOString(),
      metrics: {
        totalCustomers,
        activeSubscriptions: activeSubs.length,
        expiredSubscriptions: expiredSubs.length,
        totalInvoiced,
        totalRecordedRevenue,
        outstandingBalance,
        activeEmployees,
        completedServices,
        missedServices
      },
      customers,
      subscriptions,
      bookings,
      dailySchedules,
      invoices,
      employees
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(reportData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `cleanzx_full_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner & Export Actions */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 text-slate-800 shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-700 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
            <span>Hyderabad Doorstep Morning Operations (06:00 AM - 11:30 AM)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            CLEANZX Operations & Reports Hub
          </h2>
          <p className="text-slate-600 text-sm mt-1 max-w-2xl">
            Live overview of subscription renewals, daily morning cleans, technician assignments, invoices, and website performance.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={exportAllDataCSV}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold border border-slate-200 flex items-center gap-2 shadow-xs transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 text-cyan-600" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={exportAllDataJSON}
            className="px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-cyan-600/20 flex items-center gap-2 transition-all cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>Export Full JSON</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Customers */}
        <div
          onClick={() => setActiveTab('customers')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Customers</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">{totalCustomers}</div>
          <div className="flex items-center justify-between mt-2 text-xs">
            <span className="text-emerald-600 font-medium">8 Apartment Complexes</span>
            <span className="text-slate-400 group-hover:text-blue-600 flex items-center gap-0.5 font-medium">
              Manage <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* Active Subscriptions */}
        <div
          onClick={() => setActiveTab('subscriptions')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Subscriptions</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-600">{activeSubs.length}</div>
          <div className="flex items-center justify-between mt-2 text-xs">
            <span className="text-slate-500">{expiredSubs.length} Expired • {pendingSubs.length} Pending</span>
            <span className="text-slate-400 group-hover:text-emerald-600 flex items-center gap-0.5 font-medium">
              View <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* Recorded Revenue */}
        <div
          onClick={() => setActiveTab('invoices')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Recorded Revenue</span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">₹{totalRecordedRevenue.toLocaleString()}</div>
          <div className="flex items-center justify-between mt-2 text-xs">
            <span className="text-purple-600 font-medium">Invoiced: ₹{totalInvoiced.toLocaleString()}</span>
            <span className="text-slate-400 group-hover:text-purple-600 flex items-center gap-0.5 font-medium">
              Invoices <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* Pending Balance */}
        <div
          onClick={() => setActiveTab('invoices')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Balance</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-amber-600">₹{outstandingBalance.toLocaleString()}</div>
          <div className="flex items-center justify-between mt-2 text-xs">
            <span className="text-amber-700 font-medium">{pendingInvoicesCount} Invoices Due</span>
            <span className="text-slate-400 group-hover:text-amber-600 flex items-center gap-0.5 font-medium">
              Collect <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </div>

      {/* Secondary Operational Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Morning Cleanings Today */}
        <div
          onClick={() => setActiveTab('schedule')}
          className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 cursor-pointer hover:bg-slate-100/80 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Morning Services Today</p>
              <p className="text-lg font-bold text-slate-900">
                {completedServices} / {todaySchedules.length} <span className="text-xs text-emerald-600 font-normal">({todaySchedules.length > 0 ? Math.round((completedServices / todaySchedules.length) * 100) : 0}% done)</span>
              </p>
            </div>
          </div>
        </div>

        {/* Missed Services Alert */}
        <div
          onClick={() => setActiveTab('schedule')}
          className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 cursor-pointer hover:bg-slate-100/80 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${missedServices > 0 ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Missed Services</p>
              <p className="text-lg font-bold text-slate-900">
                {missedServices} <span className="text-xs text-slate-500 font-normal">requiring reschedule</span>
              </p>
            </div>
          </div>
        </div>

        {/* Active Detailing Employees */}
        <div
          onClick={() => setActiveTab('employees')}
          className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 cursor-pointer hover:bg-slate-100/80 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Active Specialists</p>
              <p className="text-lg font-bold text-slate-900">
                {activeEmployees} <span className="text-xs text-slate-500 font-normal">on morning duty</span>
              </p>
            </div>
          </div>
        </div>

        {/* Upcoming Expirations */}
        <div
          onClick={() => setActiveTab('subscriptions')}
          className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 cursor-pointer hover:bg-slate-100/80 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <CalendarCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Upcoming Expirations</p>
              <p className="text-lg font-bold text-slate-900">
                {upcomingExpirations.length} <span className="text-xs text-amber-600 font-normal">due in 7 days</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Plan-Wise Distribution & Morning Schedule Board */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Plan-Wise Customer Distribution */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Plan-Wise Customer Distribution</h3>
              <p className="text-xs text-slate-500">Breakdown of customer subscriptions by plan</p>
            </div>
            <button
              onClick={() => setActiveTab('plans')}
              className="text-xs font-semibold text-cyan-600 hover:text-cyan-700 flex items-center gap-1 cursor-pointer"
            >
              <span>Manage Plans</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {plans.slice(0, 5).map(plan => {
              const subsCount = activeCustomerSubs.filter(s => s.planId === plan.id).length;
              const percentage = activeCustomerSubs.length > 0 ? Math.round((subsCount / activeCustomerSubs.length) * 100) : 0;

              return (
                <div key={plan.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-800 mb-1.5">
                    <span className="truncate max-w-[200px]">{plan.name}</span>
                    <span className="text-slate-600 font-mono">{subsCount} customers ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-blue-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${subsCount > 0 ? Math.max(percentage, 5) : 0}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Today's Morning Operations Snapshot */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Today's Morning Service Roster</h3>
              <p className="text-xs text-slate-500">6:00 AM - 11:30 AM Doorstep Executions</p>
            </div>
            <button
              onClick={() => setActiveTab('schedule')}
              className="text-xs font-semibold text-cyan-600 hover:text-cyan-700 flex items-center gap-1 cursor-pointer"
            >
              <span>Full Schedule</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
            {todaySchedules.length === 0 ? (
              <div className="py-10 text-center text-slate-400 text-xs">
                No services scheduled for today yet.
              </div>
            ) : (
              todaySchedules.slice(0, 5).map(item => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-1 bg-white border border-slate-200 rounded-lg font-mono text-[11px] font-semibold text-slate-700 shrink-0">
                      {item.timeSlot.split(' - ')[0]}
                    </span>
                    <div>
                      <p className="font-bold text-slate-900">{item.customerName}</p>
                      <p className="text-slate-500 text-[11px]">{item.apartment} • {item.carModel}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                        item.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.status === 'In Progress'
                          ? 'bg-blue-100 text-blue-800'
                          : item.status === 'Missed'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {item.status}
                    </span>
                    <button
                      onClick={() => onOpenWhatsApp({
                        phone: item.phone,
                        name: item.customerName,
                        car: item.carModel,
                        regNumber: item.regNumber,
                        employeeName: item.employeeName,
                        templateType: item.status === 'Completed' ? 'service_done' : 'booking'
                      })}
                      className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                      title="Send WhatsApp update"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Date-wise Revenue & Payment Status Table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Date-Wise Invoices & Revenue Summary</h3>
            <p className="text-xs text-slate-500">Recent subscription billing and customer payment receipts</p>
          </div>
          <button
            onClick={() => setActiveTab('invoices')}
            className="text-xs font-semibold text-cyan-600 hover:text-cyan-700 flex items-center gap-1 cursor-pointer"
          >
            <span>View All Invoices</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-y border-slate-200">
              <tr>
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Plan / Service</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Paid</th>
                <th className="py-3 px-4">Method & Ref</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {invoices.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-10 text-center text-slate-400 text-xs">
                    No invoices generated yet.
                  </td>
                </tr>
              ) : (
                invoices.map(inv => (
                <tr key={inv.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-800">{inv.invoiceNumber}</td>
                  <td className="py-3 px-4 text-slate-600">{inv.date}</td>
                  <td className="py-3 px-4">
                    <p className="font-bold text-slate-900">{inv.customerName}</p>
                    <p className="text-[11px] text-slate-400">{inv.apartment}</p>
                  </td>
                  <td className="py-3 px-4 text-slate-700">{inv.planName}</td>
                  <td className="py-3 px-4 font-bold text-slate-900">₹{inv.total}</td>
                  <td className="py-3 px-4 font-bold text-emerald-600">₹{inv.amountPaid}</td>
                  <td className="py-3 px-4 text-slate-600">
                    {inv.paymentMethod ? (
                      <div>
                        <span className="font-semibold text-slate-800">{inv.paymentMethod}</span>
                        {inv.transactionRef && (
                          <span className="block text-[10px] font-mono text-slate-400 truncate max-w-[120px]">
                            {inv.transactionRef}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">Unpaid</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        inv.status === 'Paid'
                          ? 'bg-emerald-100 text-emerald-800'
                          : inv.status === 'Partially Paid'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {inv.status}
                    </span>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
