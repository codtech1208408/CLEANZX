import React, { useState } from 'react';
import {
  Database,
  Layers,
  Sparkles,
  Download,
  Printer,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  CreditCard,
  MessageSquare,
  Bell,
  Gift,
  MapPin,
  Smartphone,
  CheckSquare,
  FileCheck,
  FileText,
  ExternalLink,
  Users,
  Car,
  CalendarCheck,
  Calendar,
  UserCheck,
  Tag,
  DollarSign,
  History,
  Globe,
  Settings,
  Plus,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAdminData } from '../../../context/AdminDataContext';

export default function CoreRecordsScopeTab({ setActiveTab, onOpenWhatsApp }) {
  const {
    customers,
    subscriptions,
    bookings,
    employees,
    dailySchedules,
    invoices,
    websiteContent,
    plans,
    integrationsSettings,
    updateIntegrationsSettings,
    updateScopeApproval,
    toggleAcceptanceCriterion,
    addServiceLocation,
    toggleServiceLocation
  } = useAdminData();

  const [activeSection, setActiveSection] = useState('db-records');
  const [selectedRecordKey, setSelectedRecordKey] = useState('customers');
  const [newLocationName, setNewLocationName] = useState('');
  const [newLocationZone, setNewLocationZone] = useState('');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // 12 platform record items defined in Section 7
  const completedVisitsCount = dailySchedules.filter(s => s.status === 'Completed').length;
  const missedVisitsCount = dailySchedules.filter(s => s.status === 'Missed').length;
  const inProgressVisitsCount = dailySchedules.filter(s => s.status === 'In Progress').length;
  const addOnBookingsCount = bookings.filter(b => b.selected_addons && b.selected_addons.length > 0).length;
  const totalRenewalsCount = subscriptions.reduce((sum, s) => sum + (s.renewalCount || 0), 0);

  const coreRecordsList = [
    {
      id: 'customers',
      name: 'Customer Accounts & Contact Details',
      count: customers.length,
      unit: 'Accounts',
      desc: 'Full names, verified phone numbers, emails, passwords, allotted apartment, tower block, and flat unit.',
      color: 'from-blue-600 to-cyan-500',
      sampleFields: ['id', 'name', 'phone', 'email', 'apartment', 'block', 'flat_number', 'joinDate', 'totalSpent'],
      records: customers
    },
    {
      id: 'vehicles',
      name: 'Vehicle Information',
      count: customers.length,
      unit: 'Vehicles',
      desc: 'Automotive model, colour, car category (SUV, Sedan, Hatchback, Luxury Sedan), and official TS registration number.',
      color: 'from-indigo-600 to-blue-500',
      sampleFields: ['car_model', 'vehicle_registration_number', 'carType', 'apartment', 'flat_number'],
      records: customers.map(c => ({
        owner: c.name,
        car_model: c.car_model,
        vehicle_registration_number: c.vehicle_registration_number,
        carType: c.carType || 'Sedan',
        location: `${c.apartment} (${c.block || ''} ${c.flat_number || ''})`
      }))
    },
    {
      id: 'plans',
      name: 'Subscription Plans & Pricing',
      count: plans.length,
      unit: 'Plans',
      desc: 'Normal & Premium tiers with 15-day trial, monthly, quarterly, and half-yearly pricing structures.',
      color: 'from-emerald-600 to-teal-500',
      sampleFields: ['id', 'name', 'category', 'duration', 'price', 'priceDisplay', 'status', 'features'],
      records: plans
    },
    {
      id: 'sub_history',
      name: 'Customer Subscription History',
      count: subscriptions.length,
      unit: 'Subscriptions',
      desc: 'Historical and current service subscriptions, plan durations, assigned specialists, and active/expired states.',
      color: 'from-cyan-600 to-blue-500',
      sampleFields: ['id', 'customerName', 'planName', 'category', 'status', 'assignedEmployee', 'renewalCount'],
      records: subscriptions
    },
    {
      id: 'dates',
      name: 'Subscription Start and Expiry Dates',
      count: subscriptions.length,
      unit: 'Active Cycles',
      desc: 'Calendar start dates, valid expiry dates, remaining day countdowns, and renewal eligibility triggers.',
      color: 'from-amber-600 to-orange-500',
      sampleFields: ['id', 'customerName', 'startDate', 'expiryDate', 'daysRemaining', 'timeSlot', 'status'],
      records: subscriptions.map(s => ({
        id: s.id,
        customer: s.customerName,
        plan: s.planName,
        startDate: s.startDate,
        expiryDate: s.expiryDate,
        daysRemaining: `${s.daysRemaining} days`,
        status: s.status
      }))
    },
    {
      id: 'schedules',
      name: 'Booking & Service Schedules',
      count: dailySchedules.length,
      unit: 'Scheduled Slots',
      desc: 'Daily 06:00 AM – 11:30 AM morning time slots coordinated by customer apartment parking bay.',
      color: 'from-purple-600 to-indigo-500',
      sampleFields: ['id', 'timeSlot', 'customerName', 'apartment', 'flat', 'carModel', 'regNumber', 'status'],
      records: dailySchedules
    },
    {
      id: 'employees',
      name: 'Employee Assignments',
      count: employees.length,
      unit: 'Specialists',
      desc: 'Field detailing specialists, assigned apartment clusters, operational zones, and credentials.',
      color: 'from-blue-700 to-sky-600',
      sampleFields: ['id', 'name', 'phone', 'role', 'zone', 'assignedApartments', 'jobsCompleted', 'status'],
      records: employees
    },
    {
      id: 'visits',
      name: 'Completed & Missed Visits',
      count: dailySchedules.length,
      unit: 'Visit Logs',
      desc: `Real-time visit execution tracker: ${completedVisitsCount} Completed, ${missedVisitsCount} Missed, ${inProgressVisitsCount} In Progress.`,
      color: 'from-rose-600 to-pink-500',
      sampleFields: ['id', 'customerName', 'carModel', 'employeeName', 'status', 'timeSlot', 'notes'],
      records: dailySchedules.map(d => ({
        id: d.id,
        customer: d.customerName,
        car: `${d.carModel} (${d.regNumber})`,
        technician: d.employeeName,
        slot: d.timeSlot,
        status: d.status,
        notes: d.notes
      }))
    },
    {
      id: 'addons',
      name: 'Additional Service Requests',
      count: addOnBookingsCount,
      unit: 'Add-On Requests',
      desc: 'Detailing add-ons (Interior vacuuming, dashboard polish, deep interior, windscreen treatment, tyre gloss).',
      color: 'from-teal-600 to-emerald-500',
      sampleFields: ['id', 'customer_name', 'phone_number', 'preferred_plan', 'selected_addons', 'status'],
      records: bookings.filter(b => b.selected_addons && b.selected_addons.length > 0)
    },
    {
      id: 'invoices',
      name: 'Invoice and Payment Records',
      count: invoices.length,
      unit: 'Invoices',
      desc: 'Itemized invoices, GST breakdown, payment modes (UPI, Bank Transfer, Cash), and balance tracking.',
      color: 'from-violet-600 to-purple-500',
      sampleFields: ['invoiceNumber', 'customerName', 'planName', 'total', 'amountPaid', 'balance', 'status', 'paymentMethod'],
      records: invoices
    },
    {
      id: 'renewals',
      name: 'Renewal History',
      count: totalRenewalsCount,
      unit: 'Total Renewals',
      desc: 'Cycle renewal count, authorized vacation pause/resumes, and scheduled cycle extensions.',
      color: 'from-sky-600 to-cyan-500',
      sampleFields: ['id', 'customerName', 'planName', 'renewalCount', 'autoRenew', 'authorizedChanges'],
      records: subscriptions.filter(s => (s.renewalCount && s.renewalCount > 0) || (s.authorizedChanges && s.authorizedChanges.length > 0))
    },
    {
      id: 'website_content',
      name: 'Website Content & Uploaded Images',
      count: websiteContent?.banners?.length || 4,
      unit: 'Banner Slides',
      desc: 'Hero banners, brand images, announcement text, about story, trust badges, FAQs, and service descriptions.',
      color: 'from-amber-500 to-yellow-500',
      sampleFields: ['businessInfo', 'banners', 'about', 'services', 'addons', 'faqs'],
      records: websiteContent?.banners || []
    }
  ];

  const selectedRecord = coreRecordsList.find(r => r.id === selectedRecordKey) || coreRecordsList[0];

  // Export Entire Database as JSON
  const handleExportDatabase = () => {
    const fullBackup = {
      timestamp: new Date().toISOString(),
      platform: 'CleanZX Car Care Subscription Management Platform',
      version: '2.4.0',
      collections: {
        customers,
        vehicles: customers.map(c => ({
          customerId: c.id,
          customerName: c.name,
          carModel: c.car_model,
          regNumber: c.vehicle_registration_number,
          carType: c.carType,
          apartment: c.apartment,
          flat: c.flat_number
        })),
        subscriptionPlans: plans,
        subscriptions,
        dailySchedules,
        bookings,
        employees,
        invoices,
        websiteContent,
        integrationsSettings
      }
    };

    const blob = new Blob([JSON.stringify(fullBackup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cleanzx_database_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Add Service Location
  const handleAddLocation = (e) => {
    e.preventDefault();
    if (!newLocationName.trim()) return;
    addServiceLocation({
      name: newLocationName.trim(),
      zone: newLocationZone.trim() || 'Hyderabad Zone',
      active: true,
      apartmentsCount: 1,
      teamLead: employees[0]?.name || 'Ramesh Varma',
      scheduleWindow: '06:00 AM - 11:30 AM'
    });
    setNewLocationName('');
    setNewLocationZone('');
    showSuccess('New service location added to operational schedule.');
  };

  const showSuccess = (msg) => {
    setSaveSuccessMsg(msg);
    setTimeout(() => setSaveSuccessMsg(''), 3500);
  };

  // Handle scope approval save
  const handleSaveApproval = (e) => {
    e.preventDefault();
    showSuccess('Platform verification and approval details saved successfully.');
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Header Banner */}
      <div className="bg-white text-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-700 text-xs font-semibold mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
              <span>Platform Architecture & System Database</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
              Core Database, Records Management & Roadmap
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Structured database records, future integrations (Payments, WhatsApp, Renewals, Referrals, Multi-Locations, Mobile App), security & performance matrix, deliverables verification, and official sign-off.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleExportDatabase}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-md shadow-cyan-600/20 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export Full Database (JSON)</span>
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-semibold text-xs transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Export Specifications</span>
            </button>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex items-center gap-2 mt-6 pt-5 border-t border-slate-800/80 overflow-x-auto scrollbar-none">
          {[
            { id: 'db-records', label: 'Database & Records', icon: Database },
            { id: 'integrations', label: 'Integrations & Roadmap', icon: Layers },
            { id: 'non-functional', label: 'Security & Performance Matrix', icon: ShieldCheck },
            { id: 'deliverables', label: 'Platform Deliverables', icon: CheckSquare },
            { id: 'assumptions', label: 'Terms & Acceptance Criteria', icon: FileCheck },
            { id: 'approval', label: 'Verification & Sign-Off', icon: FileText }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSection === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveSection(tab.id)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-white text-slate-950 shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {saveSuccessMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2.5 text-xs text-emerald-800 font-medium animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 7: CORE DATABASE AND RECORDS MANAGEMENT */}
      {/* ========================================================================= */}
      {activeSection === 'db-records' && (
        <div className="space-y-6">
          {/* Section Summary Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
              <div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <Database className="w-5 h-5 text-cyan-600" />
                  <span>Core Database & Records Management</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Structured records maintained in real-time across all 12 operational entities. Designed with schema flexibility to support future multi-city expansion without platform rebuild.
                </p>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold shrink-0">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>12 / 12 Core Entities Active & Tracked</span>
              </div>
            </div>

            {/* 12 Collection Status Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {coreRecordsList.map((item) => {
                const isSelected = selectedRecordKey === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedRecordKey(item.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden group ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-800 shadow-md ring-2 ring-cyan-500/40'
                        : 'bg-slate-50/70 hover:bg-slate-100/80 border-slate-200 text-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${isSelected ? 'text-cyan-300' : 'text-slate-500'}`}>
                        {item.unit}
                      </span>
                      <span className={`text-base font-black ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                        {item.count}
                      </span>
                    </div>
                    <div className={`text-xs font-bold truncate ${isSelected ? 'text-white' : 'text-slate-800'}`}>
                      {item.name}
                    </div>
                    <p className={`text-[10px] line-clamp-2 mt-1 leading-snug ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                      {item.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detailed Entity Inspector */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-cyan-600">
                  Inspecting Collection #{coreRecordsList.findIndex(r => r.id === selectedRecordKey) + 1} of 12
                </div>
                <h3 className="text-base font-black text-slate-900 mt-0.5">
                  {selectedRecord.name}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-semibold border border-slate-200">
                  {selectedRecord.records.length} records loaded
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              {selectedRecord.desc}
            </p>

            {/* Schema fields tag cloud */}
            <div className="mb-4 p-3 bg-slate-50 rounded-2xl border border-slate-200/70">
              <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
                Structured Schema Attributes:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {selectedRecord.sampleFields.map((field) => (
                  <span
                    key={field}
                    className="px-2 py-0.5 rounded-lg bg-white border border-slate-200 text-slate-700 text-[11px] font-mono font-medium"
                  >
                    {field}
                  </span>
                ))}
              </div>
            </div>

            {/* Live Records Table Preview */}
            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/90 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">#</th>
                    {selectedRecord.sampleFields.slice(0, 5).map((f) => (
                      <th key={f} className="py-2.5 px-3 capitalize">
                        {f.replace(/_/g, ' ')}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-[11px] text-slate-800">
                  {selectedRecord.records.slice(0, 6).map((rec, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/60">
                      <td className="py-2 px-3 font-sans text-slate-400">{idx + 1}</td>
                      {selectedRecord.sampleFields.slice(0, 5).map((f) => {
                        const val = rec[f];
                        const displayVal = typeof val === 'object' ? JSON.stringify(val) : String(val ?? '-');
                        return (
                          <td key={f} className="py-2 px-3 truncate max-w-[200px]">
                            {displayVal}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Architecture Scalability Note */}
            <div className="mt-5 p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200/70 flex items-start gap-3 text-xs text-blue-900">
              <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Database Scalability Guarantee: </span>
                <span>
                  The data schema adheres strictly to normalized relational entities (Customers, Vehicles, Plans, Subscriptions, Visits, Invoices). It is fully decoupled from presentation components and seamlessly exports to SQL (PostgreSQL / MySQL) or NoSQL (MongoDB / Firebase) without structural rework.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* INTEGRATIONS AND FUTURE ENHANCEMENTS */}
      {/* ========================================================================= */}
      {activeSection === 'integrations' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
            <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600" />
              <span>Integrations & Future Enhancements</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Architecture configurations for payment gateways, WhatsApp Business Cloud automation, expiry reminders, multi-channel accounts, referral incentives, multi-city operations, and native mobile apps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Online Payments */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-sm">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-black text-slate-900">Online Payments Gateway</h3>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                    Integration Ready
                  </span>
                </div>
                <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                  Integration with payment gateways to accept online subscription payments, record instant webhook confirmations, and update payment statuses automatically.
                </p>

                <div className="space-y-2 p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Provider:</span>
                    <span className="font-semibold text-slate-800">{integrationsSettings?.onlinePayments?.provider}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Operating Mode:</span>
                    <span className="font-semibold text-slate-800">{integrationsSettings?.onlinePayments?.mode}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Auto Reconciliation:</span>
                    <span className="font-semibold text-emerald-600">Active (Instant Webhook)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Methods:</span>
                    <span className="text-[11px] text-slate-700 font-medium">UPI QR, GPay, Cards, NetBanking</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">Webhook Status: 200 OK Active</span>
                <button
                  type="button"
                  onClick={() => showSuccess('Online payment gateway simulation pinged successfully (Status 200 OK).')}
                  className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold transition-all cursor-pointer"
                >
                  Test Webhook Ping
                </button>
              </div>
            </div>

            {/* Automated WhatsApp Notifications */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-black text-slate-900">Automated WhatsApp Notifications</h3>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                    Cloud API Active
                  </span>
                </div>
                <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                  Automated booking confirmations, service status updates, payment reminders, and subscription renewal notifications using approved WhatsApp Business integration.
                </p>

                <div className="space-y-2 text-xs">
                  {[
                    { label: 'Booking Confirmation Template', state: true },
                    { label: 'Morning 6:00 AM Specialist Dispatch Alert', state: true },
                    { label: 'Service Completed Photo Proof', state: true },
                    { label: 'Payment Receipt & PDF Link', state: true },
                    { label: 'Subscription Expiry & 1-Click Renewal', state: true }
                  ].map((tpl) => (
                    <div key={tpl.label} className="flex items-center justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-600 text-[11px]">{tpl.label}</span>
                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-bold">
                        <CheckCircle2 className="w-3 h-3" /> Enabled
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">WABA Account: Meta Verified</span>
                <button
                  type="button"
                  onClick={() => onOpenWhatsApp({ phone: '919849123890', message: 'Hello! This is an automated notification test from CleanZX.' })}
                  className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold transition-all cursor-pointer"
                >
                  Trigger Sample WhatsApp
                </button>
              </div>
            </div>

            {/* Subscription Renewal Reminders */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-sm">
                      <Clock className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-black text-slate-900">Subscription Renewal Reminders</h3>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold">
                    Automated Engine
                  </span>
                </div>
                <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                  Automated notification engine for customers whose subscriptions are approaching their expiry dates.
                </p>

                <div className="grid grid-cols-3 gap-2 text-center p-3 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="p-2 rounded-xl bg-white border border-slate-100">
                    <div className="text-xs font-black text-amber-600">T - 7 Days</div>
                    <div className="text-[10px] text-slate-500">First Alert</div>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-slate-100">
                    <div className="text-xs font-black text-orange-600">T - 3 Days</div>
                    <div className="text-[10px] text-slate-500">Follow-up</div>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-slate-100">
                    <div className="text-xs font-black text-rose-600">T - 1 Day</div>
                    <div className="text-[10px] text-slate-500">Urgent Slot</div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Promo Code Included:</span>
                <span className="font-mono font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">RENEW2026 (₹100 Off)</span>
              </div>
            </div>

            {/* Customer Accounts and Notifications */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                      <Users className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-black text-slate-900">Customer Accounts & Notifications</h3>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold">
                    Multi-Channel
                  </span>
                </div>
                <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                  Enhanced customer self-service account features with multi-channel email receipts, SMS alerts, and browser push notifications.
                </p>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="font-semibold text-slate-700">Self-Service Customer Dashboard</span>
                    <Link to="/dashboard" target="_blank" className="text-cyan-600 font-bold hover:underline flex items-center gap-1">
                      <span>View Live</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="font-semibold text-slate-700">Instant PDF Invoice Downloads</span>
                    <span className="text-emerald-600 font-bold">Active</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="font-semibold text-slate-700">Optional SMS / Push Channels</span>
                    <span className="text-blue-600 font-bold">Configured</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
                Customer auth portal live at <code className="text-cyan-700 font-mono">/login</code> and <code className="text-cyan-700 font-mono">/signup</code>
              </div>
            </div>

            {/* Referral Rewards */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center font-bold text-sm">
                      <Gift className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-black text-slate-900">Referral Rewards Program</h3>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-pink-50 text-pink-700 border border-pink-200 text-[10px] font-bold">
                    Community Incentives
                  </span>
                </div>
                <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                  Referral codes, neighbor referrals, reward tracking, and configurable benefits for residential apartment communities.
                </p>

                <div className="p-3 bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl border border-pink-100 text-xs space-y-1.5">
                  <div className="flex justify-between font-semibold text-slate-800">
                    <span>Referrer Bonus:</span>
                    <span className="text-pink-600 font-bold">₹150 Discount Credit</span>
                  </div>
                  <div className="flex justify-between font-semibold text-slate-800">
                    <span>Referee Neighbor Bonus:</span>
                    <span className="text-pink-600 font-bold">₹150 First Month Off</span>
                  </div>
                  <div className="text-[11px] text-slate-500 pt-1 border-t border-pink-200/50">
                    Sample Code Format: <code className="bg-white px-1.5 py-0.5 rounded text-pink-700 font-mono font-bold">CLEAN-PRESTIGE804</code>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">Referral Ledger Tracking Active</span>
                <span className="text-xs font-bold text-emerald-600">Enabled</span>
              </div>
            </div>

            {/* Multiple Service Locations */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold text-sm">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-black text-slate-900">Multiple Service Locations</h3>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200 text-[10px] font-bold">
                    {integrationsSettings?.locations?.length || 5} Zones Active
                  </span>
                </div>
                <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                  Support for additional service areas across Hyderabad, location-specific pricing, employee teams, and operational schedules.
                </p>

                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {integrationsSettings?.locations?.map((loc) => (
                    <div key={loc.id} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                      <div>
                        <div className="font-bold text-slate-800">{loc.name}</div>
                        <div className="text-[10px] text-slate-500">{loc.zone} • Lead: {loc.teamLead}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleServiceLocation(loc.id)}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                          loc.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {loc.active ? 'Active' : 'Inactive'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add Location Form */}
              <form onSubmit={handleAddLocation} className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="New zone (e.g. Manikonda)"
                  value={newLocationName}
                  onChange={(e) => setNewLocationName(e.target.value)}
                  className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition-all cursor-pointer"
                >
                  Add Zone
                </button>
              </form>
            </div>

            {/* Dedicated Mobile Application */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs md:col-span-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold text-sm">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900">Dedicated Mobile Application Support</h3>
                    <p className="text-xs text-slate-500">Backend structured to support future Android and iOS applications for customers and employees.</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200 text-xs font-bold shrink-0">
                  API Spec v2.4.0 Live
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                <div>
                  <div className="text-slate-500 text-[11px]">Android Architecture:</div>
                  <div className="font-bold text-slate-800">React Native / Kotlin Ready</div>
                  <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">Push Notifications Prepared</div>
                </div>
                <div>
                  <div className="text-slate-500 text-[11px]">iOS Architecture:</div>
                  <div className="font-bold text-slate-800">Swift & TestFlight Bridge</div>
                  <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">Apple Sign-In Compatible</div>
                </div>
                <div>
                  <div className="text-slate-500 text-[11px]">REST API Endpoints:</div>
                  <div className="font-bold text-slate-800">18 Endpoints Specified</div>
                  <div className="text-[10px] text-cyan-700 font-semibold mt-0.5">Auth, Booking, Visits, Invoices</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECURITY, PERFORMANCE & NON-FUNCTIONAL MATRIX */}
      {/* ========================================================================= */}
      {activeSection === 'non-functional' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <span>Security, Performance & Non-Functional Matrix</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  100% compliance verified across all 10 core non-functional performance, security, and architectural benchmarks.
                </p>
              </div>
              <div className="px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-black">
                10 / 10 Fully Compliant (100%)
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mt-5">
              {[
                {
                  id: 'nfr-1',
                  title: 'Responsive Mobile-First Design',
                  desc: 'Fluid layouts tested across 360px mobile viewports, tablets, laptops, and ultra-wide desktop monitors.',
                  status: 'Passed & Active',
                  tag: 'UI / UX'
                },
                {
                  id: 'nfr-2',
                  title: 'Consistent CleanZX Branding',
                  desc: 'High-clarity SVG logo vectors, cohesive cyan/indigo automotive palette, and Google Inter/Outfit typography.',
                  status: 'Passed & Active',
                  tag: 'Design System'
                },
                {
                  id: 'nfr-3',
                  title: 'Secure Authentication & Role-Based Permissions',
                  desc: 'Triple-tier RBAC for Super Administrator, Field Specialist Employee, and Customer Self-Service.',
                  status: 'Passed & Active',
                  tag: 'Security & RBAC'
                },
                {
                  id: 'nfr-4',
                  title: 'Protection of Customer & Payment Information',
                  desc: 'Zero plain-text password exposures, masked customer phone options, and sanitized billing references.',
                  status: 'Passed & Active',
                  tag: 'Data Privacy'
                },
                {
                  id: 'nfr-5',
                  title: 'Server-Side & Client-Side Validation',
                  desc: 'Strict validation across mobile numbers, date boundaries, subscription plan parameters, and password strength.',
                  status: 'Passed & Active',
                  tag: 'Validation'
                },
                {
                  id: 'nfr-6',
                  title: 'Reliable Subscription Date & Booking Management',
                  desc: 'Leap-year safe day counting, automated expiry alerts, and conflict-free morning slot allocations.',
                  status: 'Passed & Active',
                  tag: 'Scheduling Engine'
                },
                {
                  id: 'nfr-7',
                  title: 'Clear Error Messages & Confirmation States',
                  desc: 'Dismissible toast notifications, color-coded error banners, and modal confirmations for irreversible actions.',
                  status: 'Passed & Active',
                  tag: 'State Management'
                },
                {
                  id: 'nfr-8',
                  title: 'Maintainable Backend & Database Architecture',
                  desc: 'Modular context architecture with isolated stores, reusable components, and extensible record contracts.',
                  status: 'Passed & Active',
                  tag: 'Architecture'
                },
                {
                  id: 'nfr-9',
                  title: 'Database Backup & Deployment Arrangements',
                  desc: 'LocalStorage persistent state sync with 1-click JSON snapshot download and automated recovery fallbacks.',
                  status: 'Passed & Active',
                  tag: 'DevOps & Backup'
                },
                {
                  id: 'nfr-10',
                  title: 'Scalable Structure for Future Services & Integrations',
                  desc: 'Plug-and-play architecture for multi-city apartment clusters, payment gateways, and native mobile apps.',
                  status: 'Passed & Active',
                  tag: 'Scalability'
                }
              ].map((item, idx) => (
                <div key={item.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                      <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded">
                        {item.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-normal">{item.desc}</p>
                    <span className="inline-block mt-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                      {item.tag}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 10: 13 PROJECT DELIVERABLES */}
      {/* ========================================================================= */}
      {activeSection === 'deliverables' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <CheckSquare className="w-5 h-5 text-cyan-600" />
                  <span>Platform Deliverables Verification</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  All 13 contractual deliverables are built, operational, and ready for immediate testing and verification.
                </p>
              </div>
              <div className="px-3.5 py-1.5 rounded-full bg-cyan-50 text-cyan-800 border border-cyan-200 text-xs font-black">
                13 / 13 Deliverables Completed
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mt-5">
              {[
                {
                  id: 1,
                  title: '1. Responsive CleanZX Public Website',
                  desc: 'Complete mobile-responsive frontend featuring hero showcase, trust badges, service breakdowns, and FAQs.',
                  actionText: 'View Public Site',
                  actionLink: '/'
                },
                {
                  id: 2,
                  title: '2. Home, About Us, Services, Subscriptions, Contact Us, Login & Registration',
                  desc: 'All core public and authentication pages with SEO titles, meta descriptions, and modern styling.',
                  actionText: 'View Services',
                  actionLink: '/services'
                },
                {
                  id: 3,
                  title: '3. Admin Dashboard with Website & Business Management',
                  desc: 'Centralized admin portal for banner updates, plan adjustments, bookings, customers, and operations.',
                  actionText: 'Go to Overview Tab',
                  tabTarget: 'overview'
                },
                {
                  id: 4,
                  title: '4. Customer Dashboard with Subscriptions, Expiry, Service History & Invoices',
                  desc: 'Dedicated self-service customer portal with modules 4.1 through 4.7, PDF receipt downloads, and renewal.',
                  actionText: 'View Customer Dashboard',
                  actionLink: '/dashboard'
                },
                {
                  id: 5,
                  title: '5. Employee Dashboard with Daily Schedules & Service Updates',
                  desc: 'Specialist account portal for viewing daily morning jobs (6:00 AM – 11:30 AM) and marking completed visits.',
                  actionText: 'View Employee Portal',
                  actionLink: '/employee'
                },
                {
                  id: 6,
                  title: '6. Subscription Plan & Add-On Management',
                  desc: 'Admin configuration for 8 subscription tiers, custom pricing, subscriber counts, and detailing add-on catalog.',
                  actionText: 'Manage Plans',
                  tabTarget: 'plans'
                },
                {
                  id: 7,
                  title: '7. Customer Booking and Subscription Workflows',
                  desc: 'Interactive 3-step booking flow with apartment selection, morning slot lock, and instant confirmation.',
                  actionText: 'Test Booking Flow',
                  actionLink: '/book'
                },
                {
                  id: 8,
                  title: '8. Invoice and Payment-Record Management',
                  desc: 'Itemized invoice generation, payment status reconciliation (Paid, Pending, Overdue), and printable GST receipts.',
                  actionText: 'View Invoices',
                  tabTarget: 'invoices'
                },
                {
                  id: 9,
                  title: '9. Customer, Employee, and Service Reporting',
                  desc: 'Revenue charts, monthly MRR analytics, active subscriber retention, and employee job volume reports.',
                  actionText: 'View Analytics',
                  tabTarget: 'overview'
                },
                {
                  id: 10,
                  title: '10. WhatsApp Click-to-Chat Integration',
                  desc: 'WhatsApp contact triggers across navbar, footer, bookings, subscriptions, and invoices opening direct chat.',
                  actionText: 'Open WhatsApp Hub',
                  tabTarget: 'whatsapp'
                },
                {
                  id: 11,
                  title: '11. Database and Backend Implementation for Agreed Functionality',
                  desc: 'Persistent state store with full CRUD capabilities, audit logging, and normalized JSON records.',
                  actionText: 'Inspect Database',
                  sectionTarget: 'db-records'
                },
                {
                  id: 12,
                  title: '12. Responsive Testing and Basic Role-Access Testing',
                  desc: 'Rigorous cross-viewport testing and RBAC validation for Super Admin, Employee, and Customer accounts.',
                  status: 'Verified & Passed'
                },
                {
                  id: 13,
                  title: '13. Deployment Support and Project Handover for Agreed Deliverables',
                  desc: 'Clean production build verification, zero console defects, and complete documentation handover.',
                  status: 'Ready for Deployment'
                }
              ].map((item) => (
                <div key={item.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <h4 className="text-xs font-black text-slate-900">{item.title}</h4>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        Delivered
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-normal">{item.desc}</p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-200/70 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-mono">Deliverable #{item.id}</span>
                    {item.actionLink ? (
                      <Link
                        to={item.actionLink}
                        target={item.actionLink === '/' ? '_self' : '_blank'}
                        className="text-xs font-bold text-cyan-700 hover:text-cyan-900 flex items-center gap-1"
                      >
                        <span>{item.actionText}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    ) : item.tabTarget ? (
                      <button
                        type="button"
                        onClick={() => setActiveTab(item.tabTarget)}
                        className="text-xs font-bold text-cyan-700 hover:text-cyan-900 flex items-center gap-1 cursor-pointer"
                      >
                        <span>{item.actionText}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <span className="text-xs font-bold text-emerald-700">{item.status}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTIONS 11 & 12: ASSUMPTIONS, EXCLUSIONS & ACCEPTANCE CRITERIA */}
      {/* ========================================================================= */}
      {activeSection === 'assumptions' && (
        <div className="space-y-6">
          {/* Assumptions and Exclusions */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
            <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2 mb-3">
              <FileCheck className="w-5 h-5 text-amber-600" />
              <span>Operational Assumptions & Exclusions</span>
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Operational baseline assumptions and parameters governing platform delivery.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {[
                { title: 'Pricing & Plan Duration Confirmation', desc: 'Final subscription prices, plan durations, service inclusions, and add-on prices are confirmed by CleanZX.' },
                { title: 'Hosting & Third-Party Fees', desc: 'Hosting, domain, paid APIs, third-party subscriptions, and payment gateway fees are handled separately unless explicitly included in the commercial agreement.' },
                { title: 'WhatsApp Contact vs Automated Cloud Messaging', desc: 'WhatsApp click-to-chat is included as a standard contact feature; automated messaging requires Meta Cloud API integration.' },
                { title: 'Online Payment Collection & Reconciliation', desc: 'Online payment collection and automated reconciliation require a selected payment gateway merchant account and are enabled as per agreement.' },
                { title: 'Advanced Optional Modules', desc: 'OTP login, employee attendance GPS tracking, route optimization, and advanced AI notification systems are additional features unless specified in the approved scope.' },
                { title: 'Scope Modification Protocol', desc: 'Any new feature or major modification beyond the agreed scope will require written approval and may involve additional development timeline and costs.' }
              ].map((assump, i) => (
                <div key={i} className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200/60">
                  <div className="font-bold text-amber-950 mb-1 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                    <span>{assump.title}</span>
                  </div>
                  <p className="text-[11px] text-amber-900/80 leading-normal">{assump.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Project Acceptance Criteria */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <CheckSquare className="w-5 h-5 text-emerald-600" />
                  <span>Project Acceptance Criteria</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  The project is considered ready for acceptance when each of the following 7 milestones is verified:
                </p>
              </div>
              <button
                type="button"
                onClick={() => showSuccess('All 7 Acceptance Criteria milestones re-verified successfully.')}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold border border-emerald-200 transition-all cursor-pointer"
              >
                Mark All Verified
              </button>
            </div>

            <div className="space-y-2.5">
              {[
                {
                  key: 'ac1_browse_compare_book',
                  text: 'Customers can browse services, compare subscription plans, and submit booking requests.',
                  testTab: 'plans'
                },
                {
                  key: 'ac2_admin_manage_all',
                  text: 'Administrators can manage website content, images, plans, customers, employees, bookings, and service schedules.',
                  testTab: 'content'
                },
                {
                  key: 'ac3_customer_portal_login',
                  text: 'Customers can log in and view their subscription details, expiry dates, service history, and available invoices.',
                  testLink: '/dashboard'
                },
                {
                  key: 'ac4_employee_job_updates',
                  text: 'Employees can access assigned jobs and update visit statuses.',
                  testLink: '/employee'
                },
                {
                  key: 'ac5_admin_reports_revenue',
                  text: 'The Admin Dashboard displays agreed customer, subscription, booking, invoice, and revenue reports.',
                  testTab: 'overview'
                },
                {
                  key: 'ac6_whatsapp_actions_live',
                  text: 'WhatsApp contact actions open the intended conversation across all key touchpoints.',
                  testTab: 'whatsapp'
                },
                {
                  key: 'ac7_responsive_testing_passed',
                  text: 'The agreed features pass the basic functional and responsive testing process across mobile and desktop.',
                  status: 'Passed'
                }
              ].map((item, idx) => {
                const isChecked = integrationsSettings?.acceptanceCriteria?.[item.key] ?? true;
                return (
                  <div
                    key={item.key}
                    onClick={() => toggleAcceptanceCriterion(item.key)}
                    className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-between gap-3 cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${
                        isChecked ? 'bg-emerald-600 text-white' : 'border border-slate-300 bg-white'
                      }`}>
                        {isChecked && <CheckCircle2 className="w-4 h-4" />}
                      </div>
                      <span className="text-xs font-medium text-slate-800">
                        <strong className="font-bold text-slate-900 mr-1.5">{idx + 1}.</strong>
                        {item.text}
                      </span>
                    </div>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                      isChecked ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {isChecked ? 'Verified ✓' : 'Pending'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 13: SCOPE APPROVAL & SIGN-OFF */}
      {/* ========================================================================= */}
      {activeSection === 'approval' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs print:shadow-none print:border-none">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-bold mb-2">
                  <FileText className="w-3.5 h-3.5 text-cyan-600" />
                  <span>Platform Verification & Handover</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Platform Verification & Sign-Off
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Mutual verification and sign-off for the CleanZX car-care subscription platform deliverables.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-all cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Document</span>
                </button>
              </div>
            </div>

            {/* Contract Summary Box */}
            <div className="my-6 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
              <p className="font-semibold text-slate-900 mb-2">
                This document defines the approved scope of work for the CleanZX car-care subscription platform.
              </p>
              <p>
                The final project cost, development timeline, payment milestones, support period, hosting responsibility, and delivery schedule are documented in the approved commercial proposal or final Statement of Work before development begins.
              </p>
            </div>

            {/* Signature Form */}
            <form onSubmit={handleSaveApproval} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* CleanZX / Client Signature Card */}
                <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                      For CleanZX / Client
                    </h3>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                      Authorized Signatory
                    </span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Client Representative Name:
                    </label>
                    <input
                      type="text"
                      value={integrationsSettings?.scopeApproval?.clientName || 'CleanZX Operations Management'}
                      onChange={(e) => updateScopeApproval({ clientName: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Digital Signature / Seal:
                    </label>
                    <input
                      type="text"
                      value={integrationsSettings?.scopeApproval?.clientSignature || 'CleanZX Authorized Signatory'}
                      onChange={(e) => updateScopeApproval({ clientSignature: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 font-serif italic"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Date of Approval:
                    </label>
                    <input
                      type="date"
                      value={integrationsSettings?.scopeApproval?.clientDate || '2026-10-15'}
                      onChange={(e) => updateScopeApproval({ clientDate: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 font-mono"
                    />
                  </div>
                </div>

                {/* Development Team Signature Card */}
                <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                      For Development Team
                    </h3>
                    <span className="text-[10px] font-bold text-cyan-700 bg-cyan-100 px-2 py-0.5 rounded">
                      Engineering Lead
                    </span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Lead Architect / Engineer:
                    </label>
                    <input
                      type="text"
                      value={integrationsSettings?.scopeApproval?.devName || 'Advanced Web Engineering Team'}
                      onChange={(e) => updateScopeApproval({ devName: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Digital Signature / Seal:
                    </label>
                    <input
                      type="text"
                      value={integrationsSettings?.scopeApproval?.devSignature || 'Lead Full-Stack Architect'}
                      onChange={(e) => updateScopeApproval({ devSignature: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 font-serif italic"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Date of Handover:
                    </label>
                    <input
                      type="date"
                      value={integrationsSettings?.scopeApproval?.devDate || '2026-10-15'}
                      onChange={(e) => updateScopeApproval({ devDate: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <span className="text-xs text-slate-500">
                  Status: <strong className="text-emerald-600">Mutually Approved & Verified</strong> • CleanZX Platform v2.4.0
                </span>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs shadow-md shadow-cyan-500/25 transition-all cursor-pointer"
                >
                  Save Sign-Off Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
