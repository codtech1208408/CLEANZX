import React, { useState, useMemo } from 'react';
import {
  User,
  Car,
  Calendar,
  FileText,
  Sparkles,
  Phone,
  MessageCircle,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  LogOut,
  Menu,
  X,
  CreditCard,
  Building,
  Hash,
  Home,
  RefreshCw,
  ExternalLink,
  Download,
  Printer,
  PlusCircle,
  ArrowRight,
  Filter,
  Check,
  CalendarDays,
  Award,
  Layers,
  Zap,
  Info,
  QrCode,
  Copy
} from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import InvoiceModal from './InvoiceModal';
import PaymentModal from './PaymentModal';

export default function CustomerDashboard() {
  const {
    customerUser,
    customerLogout,
    updateCustomerProfile,
    requestSubscriptionRenewal,
    requestCustomerAddon,
    requestPlanChange,
    processCustomerPayment,
    subscriptions,
    dailySchedules,
    invoices,
    plans,
    websiteContent,
    bookings
  } = useAdminData();

  // Active Tab
  // 'profile' | 'subscriptions' | 'plans' | 'history' | 'invoices' | 'addons' | 'support' | 'payments'
  const [activeTab, setActiveTab] = useState('subscriptions');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Selected Invoice for Modal
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // Feedback notifications
  const [bannerNotice, setBannerNotice] = useState(null);

  // --------------------------------------------------------------------------
  // SECTION 4.1: Customer Profile Form State
  // --------------------------------------------------------------------------
  const [profileForm, setProfileForm] = useState({
    name: customerUser?.name || '',
    phone: customerUser?.phone || '',
    apartment: customerUser?.apartment || '',
    block: customerUser?.block || '',
    flat_number: customerUser?.flat_number || '',
    car_model: customerUser?.car_model || '',
    vehicle_registration_number: customerUser?.vehicle_registration_number || '',
    notes: customerUser?.notes || ''
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    if (!profileForm.name.trim() || !profileForm.phone.trim() || !profileForm.apartment.trim()) {
      alert('Please fill out all required profile details.');
      return;
    }

    const res = updateCustomerProfile(customerUser.id, profileForm);
    if (res.success) {
      setIsEditingProfile(false);
      showNotice('Customer profile and vehicle details updated successfully! Your assigned specialist will see these changes.');
    }
  };

  // Helper notice
  const showNotice = (msg, type = 'success') => {
    setBannerNotice({ text: msg, type });
    setTimeout(() => {
      setBannerNotice(null);
    }, 5000);
  };

  // --------------------------------------------------------------------------
  // Customer's Linked Data
  // --------------------------------------------------------------------------
  // Match customer's subscriptions
  const customerSubs = useMemo(() => {
    if (!customerUser) return [];
    return subscriptions.filter(
      (s) =>
        s.customerId === customerUser.id ||
        (s.phone && customerUser.phone && s.phone.replace(/\D/g, '') === customerUser.phone.replace(/\D/g, ''))
    );
  }, [subscriptions, customerUser]);

  // Primary active subscription
  const activeSub = useMemo(() => {
    return customerSubs.find((s) => s.status === 'Active' || s.status === 'Renewed') || customerSubs[0];
  }, [customerSubs]);

  // Match customer's daily schedules / visits
  const customerVisits = useMemo(() => {
    if (!customerUser) return [];
    const userPhoneDigits = (customerUser.phone || '').replace(/\D/g, '');
    return dailySchedules.filter((sch) => {
      const schPhoneDigits = (sch.phone || '').replace(/\D/g, '');
      return (
        (userPhoneDigits && schPhoneDigits && userPhoneDigits === schPhoneDigits) ||
        (sch.customerName && sch.customerName.toLowerCase() === customerUser.name?.toLowerCase())
      );
    });
  }, [dailySchedules, customerUser]);

  // Match customer's invoices
  const customerInvoices = useMemo(() => {
    if (!customerUser) return [];
    const userPhoneDigits = (customerUser.phone || '').replace(/\D/g, '');
    return invoices.filter((inv) => {
      const invPhoneDigits = (inv.phone || '').replace(/\D/g, '');
      return (
        inv.customerId === customerUser.id ||
        (userPhoneDigits && invPhoneDigits && userPhoneDigits === invPhoneDigits) ||
        (inv.customerName && inv.customerName.toLowerCase() === customerUser.name?.toLowerCase())
      );
    });
  }, [invoices, customerUser]);

  // Match customer's addon requests / bookings
  const customerAddons = useMemo(() => {
    if (!customerUser) return [];
    const userPhoneDigits = (customerUser.phone || '').replace(/\D/g, '');
    return bookings.filter((b) => {
      const bPhoneDigits = (b.phone_number || '').replace(/\D/g, '');
      return (
        (userPhoneDigits && bPhoneDigits && userPhoneDigits === bPhoneDigits) ||
        (b.customer_name && b.customer_name.toLowerCase() === customerUser.name?.toLowerCase())
      );
    });
  }, [bookings, customerUser]);

  // --------------------------------------------------------------------------
  // SECTION 4.2 & 4.3: Renewal and Plan Change Handlers
  // --------------------------------------------------------------------------
  const handleRenewalRequest = (subId) => {
    if (!subId && !activeSub) {
      alert('No active subscription found to renew.');
      return;
    }
    const targetId = subId || activeSub.id;
    requestSubscriptionRenewal(targetId, '1-Click customer renewal request via Customer Dashboard');
    showNotice('Subscription renewal request submitted to CleanZX Operations! Your dedicated morning spot is reserved.');
  };

  const handleRequestPlan = (plan) => {
    requestPlanChange(customerUser.id, {
      planId: plan.id,
      planName: plan.name,
      price: plan.price,
      notes: `Requested upgrade to ${plan.name} from Customer Dashboard.`
    });
    showNotice(`Subscription request for "${plan.name}" submitted! Our operations coordinator will confirm your morning slot.`);
  };

  // --------------------------------------------------------------------------
  // SECTION 4.4: Payment Management State & Handlers
  // --------------------------------------------------------------------------
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [checkoutData, setCheckoutData] = useState(null);

  const pendingInvoices = useMemo(() => {
    return customerInvoices.filter(i => i.status !== 'Paid');
  }, [customerInvoices]);

  const totalBalanceDue = useMemo(() => {
    return pendingInvoices.reduce((acc, i) => acc + (i.balance !== undefined ? i.balance : (i.total || 0)), 0);
  }, [pendingInvoices]);

  const activePlanPrice = useMemo(() => {
    if (activeSub?.amount) return activeSub.amount;
    const matchedPlan = plans.find(p => p.name === customerUser?.activePlan);
    return matchedPlan ? matchedPlan.price : 1499;
  }, [activeSub, plans, customerUser]);

  const isPaymentPending = customerUser?.paymentStatus === 'Pending' || pendingInvoices.length > 0 || (activeSub && activeSub.paymentStatus === 'Pending');

  const openPaymentCheckout = (customData = {}) => {
    const amountToPay = customData.amount !== undefined ? customData.amount : (totalBalanceDue > 0 ? totalBalanceDue : activePlanPrice);
    const plan = customData.planName || activeSub?.planName || customerUser?.activePlan || 'Monthly Doorstep Car Care';

    setCheckoutData({
      amount: amountToPay,
      planName: plan,
      invoiceId: customData.invoiceId || (pendingInvoices[0]?.id),
      customerName: customerUser?.name || 'Customer',
      phone: customerUser?.phone || '',
      apartment: customerUser?.apartment || 'Prestige High Fields',
      vehicle: `${customerUser?.car_model || 'Car'} ${customerUser?.vehicle_registration_number || ''}`.trim(),
      ...customData
    });
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = (result) => {
    if (processCustomerPayment) {
      processCustomerPayment({
        customerId: customerUser?.id,
        customerName: customerUser?.name,
        phone: customerUser?.phone,
        apartment: customerUser?.apartment,
        planName: checkoutData?.planName || activeSub?.planName || customerUser?.activePlan,
        amount: result.amount,
        paymentMethod: result.paymentMethod,
        transactionRef: result.transactionRef,
        invoiceId: checkoutData?.invoiceId
      });
    }
    showNotice(`Payment of ₹${result.amount.toLocaleString('en-IN')} completed successfully! Transaction ID: ${result.transactionRef}`);
  };

  // --------------------------------------------------------------------------
  // SECTION 4.6: Add-On Service Handlers
  // --------------------------------------------------------------------------
  const [selectedAddon, setSelectedAddon] = useState(null);
  const [addonDate, setAddonDate] = useState(new Date().toISOString().slice(0, 10));
  const [addonTime, setAddonTime] = useState('08:00 AM - 09:00 AM');
  const [addonNotes, setAddonNotes] = useState('');

  const handleBookAddon = (e) => {
    e.preventDefault();
    if (!selectedAddon) return;

    requestCustomerAddon(customerUser.id, {
      name: selectedAddon.title || selectedAddon.name,
      price: selectedAddon.price,
      preferredDate: addonDate,
      preferredTime: addonTime,
      notes: addonNotes
    });

    setSelectedAddon(null);
    setAddonNotes('');
    showNotice(`Add-on service request for "${selectedAddon.title || selectedAddon.name}" has been placed! Our specialist will arrive during your chosen slot.`);
  };

  // Add-on services list from website content
  const addonsList = websiteContent?.addons || [
    { id: 'interior-vacuuming', title: 'Interior Vacuuming', price: 399, desc: 'High-power cabin, seats, and footwell vacuuming with dust extraction.' },
    { id: 'dashboard-detailing', title: 'Dashboard Polishing & UV Coat', price: 249, desc: 'Deep cleaning and non-greasy matte protective dressing for dashboard & trims.' },
    { id: 'deep-interior-cleaning', title: 'Deep Interior Sanitization', price: 799, desc: 'Complete shampoo treatment of fabric/leather seats and door panels.' },
    { id: 'premium-tyre-polish', title: 'High-Gloss Tyre & Rim Polish', price: 199, desc: 'Deep scrub of alloy rims and silicone tyre dressing for mirror shine.' },
    { id: 'rain-repellent-windscreen', title: 'Rain-Repellent Windscreen Coat', price: 349, desc: 'Hydrophobic glass treatment for streak-free rain visibility.' }
  ];

  // --------------------------------------------------------------------------
  // SECTION 4.7: WhatsApp Support Links
  // --------------------------------------------------------------------------
  const getWhatsAppLink = (type) => {
    const carInfo = `${customerUser?.car_model || 'Car'} (${customerUser?.vehicle_registration_number || ''})`;
    const custInfo = `${customerUser?.name || 'Customer'} - ${customerUser?.apartment || ''} (${customerUser?.flat_number || ''})`;

    let message = '';
    switch (type) {
      case 'booking':
        message = `Hi CleanZX Team, I have a booking enquiry for my vehicle ${carInfo}. Customer: ${custInfo}.`;
        break;
      case 'issue':
        message = `Hi CleanZX Operations, I want to report a service issue with my morning car cleaning visit for ${carInfo}. Customer: ${custInfo}.`;
        break;
      case 'subscription':
        message = `Hi CleanZX, I have questions regarding my current subscription plan (${activeSub?.planName || customerUser?.activePlan || 'Standard'}). Vehicle: ${carInfo}.`;
        break;
      case 'renewal':
        message = `Hi CleanZX Team, I would like to request subscription renewal for ${carInfo}. Flat: ${customerUser?.flat_number || ''}, ${customerUser?.apartment || ''}.`;
        break;
      default:
        message = `Hi CleanZX Team, I need assistance with my car care account (${carInfo}).`;
    }
    return `https://wa.me/919121992399?text=${encodeURIComponent(message)}`;
  };

  // Service history filter
  const [historyFilter, setHistoryFilter] = useState('All');

  const filteredVisits = useMemo(() => {
    if (historyFilter === 'All') return customerVisits;
    return customerVisits.filter((v) => v.status === historyFilter);
  }, [customerVisits, historyFilter]);

  return (
    <div className="flex h-screen w-full bg-white text-slate-800 overflow-hidden font-sans antialiased">
      {/* =========================================================================
          LEFT VERTICAL SIDEBAR (RESTORED TO ORIGINAL DARK THEME)
      ========================================================================= */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 border-r border-slate-800 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-0 max-lg:-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Logo & Portal Badge */}
          <div className="p-5 pb-4 border-b border-slate-800 bg-slate-950">
            <div className="flex items-center justify-between">
              <img
                src="/images/admin-brand-logo.png"
                alt="CLEANZX"
                className="h-20 sm:h-24 max-w-[240px] w-auto object-contain drop-shadow-xl"
              />
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Dividing Line */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent my-3" />

            {/* Cyan Pill Badge */}
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-[11px] font-bold tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>CUSTOMER PORTAL</span>
              </div>
            </div>
          </div>

          {/* Customer Profile Snippet */}
          <div className="p-4 mx-3 my-3 rounded-2xl bg-slate-950/70 border border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center font-bold text-white shadow-md shadow-cyan-500/20 text-sm shrink-0">
                {customerUser?.name?.slice(0, 2).toUpperCase() || 'CU'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-white truncate">{customerUser?.name || 'Customer'}</p>
                <p className="text-[11px] text-slate-400 truncate flex items-center gap-1">
                  <Building className="w-3 h-3 text-cyan-400 shrink-0" />
                  <span>{customerUser?.apartment || 'Hyderabad'}</span>
                </p>
                <div className="text-[10px] text-cyan-400 font-mono font-semibold truncate mt-0.5">
                  {customerUser?.vehicle_registration_number || 'TS Vehicle'}
                </div>
              </div>
            </div>

            {/* Subscription Status Tag */}
            <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Current Plan:</span>
              <span
                className={`px-2 py-0.5 rounded-full font-semibold text-[10px] ${
                  activeSub?.status === 'Active' || activeSub?.status === 'Renewed'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}
              >
                {activeSub?.status || customerUser?.subscriptionStatus || 'Pending'}
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 space-y-1 mt-1 flex-1">
            <button
              onClick={() => {
                setActiveTab('subscriptions');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'subscriptions'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Award className="w-4 h-4 text-cyan-400" />
              <span>My Subscriptions</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('payments');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'payments'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/20 font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <QrCode className="w-4 h-4 text-emerald-400" />
                <span>Make Payment & QR</span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                isPaymentPending
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              }`}>
                {isPaymentPending ? 'Due' : 'Active'}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab('profile');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <User className="w-4 h-4 text-cyan-400" />
              <span>Customer Profile & Car</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('plans');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'plans'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Plan Selection & Renewal</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('history');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'history'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span>Booking & Service History</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('invoices');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'invoices'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>Invoices & Receipts</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('addons');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'addons'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>Add-On Detailing Services</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('support');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'support'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp Support Desk</span>
            </button>
          </nav>

          {/* Quick Help Box */}
          <div className="p-3 m-3 rounded-2xl bg-gradient-to-br from-slate-900 to-blue-950 border border-slate-800 text-[11px]">
            <p className="font-semibold text-white flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Morning Shift Window</span>
            </p>
            <p className="text-slate-400 mt-1">
              Cleaning executed daily between <strong className="text-slate-200">6:00 AM – 11:30 AM</strong> at your allotted parking bay.
            </p>
            <a
              href="tel:+919121992399"
              className="mt-2 text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
            >
              <Phone className="w-3 h-3" />
              <span>+91 91219 92399</span>
            </a>
          </div>

          {/* Bottom Logout */}
          <div className="p-3 border-t border-slate-800">
            <button
              onClick={customerLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-rose-950/40 text-slate-400 hover:text-rose-300 border border-slate-800 hover:border-rose-800/50 text-xs font-semibold transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out of Account</span>
            </button>
          </div>
        </div>
      </aside>

      {/* =========================================================================
          MAIN CONTENT AREA (WHITE BACKGROUND)
      ========================================================================= */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-white">
        {/* Top Header Bar */}
        <header className="h-16 border-b border-slate-200 bg-white/95 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900"
              aria-label="Open navigation"
            >
              <Menu className="w-5 h-5" />
            </button>

            <span className="sm:hidden text-base font-black text-slate-900 tracking-tight">
              Customer Portal
            </span>

            <div className="hidden sm:block">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-400">Customer Dashboard /</span>
                <span className="text-xs font-bold text-cyan-700 capitalize">
                  {activeTab === 'subscriptions' && 'My Subscriptions'}
                  {activeTab === 'profile' && 'Customer Profile & Vehicle'}
                  {activeTab === 'plans' && 'Plan Selection & Renewal'}
                  {activeTab === 'history' && 'Booking & Service History'}
                  {activeTab === 'invoices' && 'Invoice Management'}
                  {activeTab === 'addons' && 'Add-On Services'}
                  {activeTab === 'support' && 'WhatsApp Support'}
                  {activeTab === 'payments' && 'Online Payment & UPI Gateway'}
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
                Welcome back, {customerUser?.name || 'Customer'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Vehicle TS Pill */}
            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-mono font-bold text-cyan-800">
              <Car className="w-3.5 h-3.5 text-cyan-600" />
              <span>{customerUser?.vehicle_registration_number || 'TS VEHICLE'}</span>
            </div>
          </div>
        </header>

        {/* Global Notification Banner */}
        {bannerNotice && (
          <div className="bg-emerald-500/20 border-b border-emerald-500/40 px-4 py-2.5 flex items-center justify-between text-xs text-emerald-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{bannerNotice.text}</span>
            </div>
            <button
              onClick={() => setBannerNotice(null)}
              className="text-emerald-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Scrollable Main Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* =========================================================================
              TAB: 4.2 MY SUBSCRIPTIONS
          ========================================================================= */}
          {activeTab === 'subscriptions' && (
            <div className="space-y-6 max-w-5xl">
              {/* Payment Alert Banner if Payment Pending */}
              {isPaymentPending && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 border border-amber-200 flex items-center justify-center shrink-0">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-amber-900">Payment Pending for Current Service Cycle</p>
                      <p className="text-amber-800 text-[11px] mt-0.5">
                        Amount Due: <strong className="text-slate-900 font-mono">₹{(totalBalanceDue > 0 ? totalBalanceDue : activePlanPrice).toLocaleString('en-IN')}</strong> • Settle online via UPI, Cards, or Net Banking for uninterrupted service.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => openPaymentCheckout()}
                    className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-black rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/30 cursor-pointer shrink-0"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Pay ₹{(totalBalanceDue > 0 ? totalBalanceDue : activePlanPrice).toLocaleString('en-IN')} Now</span>
                  </button>
                </div>
              )}

              {/* Header Card */}
              {activeSub ? (
                <div className="p-6 rounded-3xl bg-white border border-slate-200 relative overflow-hidden shadow-sm">
                  <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200 text-xs font-semibold mb-2">
                        <Award className="w-3.5 h-3.5 text-cyan-600" />
                        <span>Active Doorstep Subscription</span>
                      </div>
                      <h3 className="text-2xl font-black text-slate-900">
                        {activeSub.planName}
                      </h3>
                      <p className="text-xs text-slate-600 mt-1 max-w-lg">
                        Dedicated doorstep exterior waterless cleaning & windshield care at{' '}
                        <strong className="text-slate-900">{customerUser?.apartment || 'Apartment'}</strong>, Flat{' '}
                        <strong className="text-slate-900">{customerUser?.flat_number || ''}</strong>.
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <div className="text-left md:text-right">
                        <div className="text-xs text-slate-500">Subscription Price</div>
                        <div className="text-3xl font-black text-slate-900 font-mono">
                          ₹{activeSub.amount ? activeSub.amount.toLocaleString('en-IN') : '0'}
                        </div>
                        <div className="text-[11px] text-cyan-700 font-semibold">Daily morning doorstep care</div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                        <button
                          onClick={() => openPaymentCheckout({ amount: activeSub.amount || activePlanPrice, planName: activeSub.planName })}
                          className="px-4 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-black text-xs sm:text-sm shadow-lg shadow-emerald-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <CreditCard className="w-4 h-4" />
                          <span>Pay Now</span>
                        </button>

                        <button
                          onClick={() => handleRenewalRequest(activeSub.id)}
                          className="px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 font-bold text-xs sm:text-sm border border-slate-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <RefreshCw className="w-4 h-4" />
                          <span>Request Renewal</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Status & Details Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-100 text-xs">
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                      <span className="text-slate-500 block text-[11px]">Subscription Status</span>
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-xs mt-1 ${
                          activeSub.status === 'Active' || activeSub.status === 'Renewed'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : activeSub.status === 'Expired'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        ● {activeSub.status}
                      </span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                      <span className="text-slate-500 block text-[11px]">Plan Duration</span>
                      <span className="font-bold text-slate-900 text-sm mt-1 block">
                        {activeSub.planName?.includes('Quarterly')
                          ? '90 Days (Quarterly)'
                          : activeSub.planName?.includes('15-Day')
                          ? '15 Days (Trial)'
                          : activeSub.planName?.includes('Half-Yearly')
                          ? '180 Days (Half-Yearly)'
                          : '30 Days (Monthly)'}
                      </span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                      <span className="text-slate-500 block text-[11px]">Start Date</span>
                      <span className="font-mono font-bold text-slate-900 text-sm mt-1 block">
                        {activeSub.startDate || 'Pending'}
                      </span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                      <span className="text-slate-500 block text-[11px]">Expiry Date</span>
                      <span className="font-mono font-bold text-amber-700 text-sm mt-1 block">
                        {activeSub.expiryDate || 'Pending'}
                      </span>
                    </div>
                  </div>

                  {/* Days Remaining & Renewal Eligibility */}
                  <div className="mt-4 p-4 rounded-2xl bg-cyan-50 border border-cyan-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-cyan-100 border border-cyan-200 flex items-center justify-center font-mono font-bold text-cyan-800 text-base">
                        {activeSub.daysRemaining !== undefined ? activeSub.daysRemaining : 0}d
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">
                          {activeSub.daysRemaining !== undefined ? activeSub.daysRemaining : 0} Days Remaining in Current Cycle
                        </p>
                        <p className="text-slate-600 text-[11px]">
                          Renewal Eligibility: <strong className="text-emerald-700">Guaranteed Early Renewal Slot</strong>
                        </p>
                      </div>
                    </div>

                    <a
                      href={getWhatsAppLink('renewal')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-cyan-700 hover:text-cyan-900 flex items-center gap-1 font-semibold"
                    >
                      <span>Discuss Slot Timing with Operations</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ) : (
                <div className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200 text-center shadow-sm space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-3xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-600 shadow-xs">
                    <Award className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-slate-900">No Active Subscription</h3>
                    <p className="text-xs text-slate-500 max-w-md mx-auto">
                      You do not have an active doorstep cleaning subscription. Select a monthly, quarterly, or trial plan to activate daily morning doorstep car care for your vehicle.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('plans')}
                    className="px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-sky-400 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs shadow-lg shadow-cyan-500/25 transition-all inline-flex items-center gap-2 cursor-pointer"
                  >
                    <span>Browse Subscription Plans</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Included Services Checklist */}
              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-cyan-600" />
                  <span>Services Included in Your Current Plan</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-slate-900">Daily Exterior Waterless Body Wash</p>
                      <p className="text-slate-600 text-[11px]">Scratch-resistant microfiber cleaning using specialized automotive lubricants.</p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-slate-900">Streak-Free Windscreen & Mirror Polish</p>
                      <p className="text-slate-600 text-[11px]">High-clarity glass cleaning ensuring optimal visibility before morning commute.</p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-slate-900">Deep Tyre Dressing & Alloy Buffing</p>
                      <p className="text-slate-600 text-[11px]">Silicone-based tyre shine with dust-repellent finish for clean alloy rims.</p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-slate-900">Guaranteed 6:00 AM – 11:30 AM Morning Window</p>
                      <p className="text-slate-600 text-[11px]">Service executed right at your basement parking spot without disturbing you.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Past Subscription Audit Records */}
              {activeSub?.authorizedChanges && activeSub.authorizedChanges.length > 0 && (
                <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-cyan-600" />
                    <span>Previous Subscription Records & Audit Trail</span>
                  </h4>

                  <div className="space-y-2 text-xs">
                    {activeSub.authorizedChanges.map((change, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2.5">
                          <Check className="w-4 h-4 text-cyan-600" />
                          <div>
                            <p className="font-bold text-slate-900">{change.type}</p>
                            <p className="text-slate-600 text-[11px]">{change.note}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-mono text-slate-600">{change.date}</span>
                          <span className="text-[10px] text-cyan-700 block font-semibold">By {change.by || 'Admin'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* =========================================================================
              TAB: 4.1 CUSTOMER PROFILE
          ========================================================================= */}
          {activeTab === 'profile' && (
            <div className="space-y-6 max-w-4xl">
              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                      <User className="w-5 h-5 text-cyan-600" />
                      <span>Customer Profile & Vehicle Details</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      View and update permitted profile information, apartment location, and vehicle details.
                    </p>
                  </div>

                  {!isEditingProfile && (
                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(true)}
                      className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-colors cursor-pointer"
                    >
                      Edit Profile
                    </button>
                  )}
                </div>

                <form onSubmit={handleProfileSubmit} className="space-y-4 text-xs">
                  {/* Name and Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        disabled={!isEditingProfile}
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 disabled:bg-slate-100 disabled:opacity-80 disabled:cursor-not-allowed focus:ring-2 focus:ring-cyan-500 focus:bg-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Mobile Phone Number *
                      </label>
                      <input
                        type="tel"
                        disabled={!isEditingProfile}
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 disabled:bg-slate-100 disabled:opacity-80 disabled:cursor-not-allowed focus:ring-2 focus:ring-cyan-500 focus:bg-white focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  {/* Apartment, Block, Flat Number */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Apartment or Community *
                      </label>
                      <input
                        type="text"
                        disabled={!isEditingProfile}
                        value={profileForm.apartment}
                        onChange={(e) => setProfileForm({ ...profileForm, apartment: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 disabled:bg-slate-100 disabled:opacity-80 disabled:cursor-not-allowed focus:ring-2 focus:ring-cyan-500 focus:bg-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Block Number / Tower
                      </label>
                      <input
                        type="text"
                        disabled={!isEditingProfile}
                        value={profileForm.block}
                        onChange={(e) => setProfileForm({ ...profileForm, block: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 disabled:bg-slate-100 disabled:opacity-80 disabled:cursor-not-allowed focus:ring-2 focus:ring-cyan-500 focus:bg-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Flat Number *
                      </label>
                      <input
                        type="text"
                        disabled={!isEditingProfile}
                        value={profileForm.flat_number}
                        onChange={(e) => setProfileForm({ ...profileForm, flat_number: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 disabled:bg-slate-100 disabled:opacity-80 disabled:cursor-not-allowed focus:ring-2 focus:ring-cyan-500 focus:bg-white focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Car Model & Vehicle Registration Number */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Car Model *
                      </label>
                      <input
                        type="text"
                        disabled={!isEditingProfile}
                        value={profileForm.car_model}
                        onChange={(e) => setProfileForm({ ...profileForm, car_model: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 disabled:bg-slate-100 disabled:opacity-80 disabled:cursor-not-allowed focus:ring-2 focus:ring-cyan-500 focus:bg-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Vehicle Registration Number *
                      </label>
                      <input
                        type="text"
                        disabled={!isEditingProfile}
                        value={profileForm.vehicle_registration_number}
                        onChange={(e) => setProfileForm({ ...profileForm, vehicle_registration_number: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 disabled:bg-slate-100 disabled:opacity-80 disabled:cursor-not-allowed focus:ring-2 focus:ring-cyan-500 focus:bg-white focus:outline-none font-mono uppercase"
                      />
                    </div>
                  </div>

                  {/* Notes & Parking Bay */}
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Parking Bay & Special Instructions
                    </label>
                    <textarea
                      rows={2}
                      disabled={!isEditingProfile}
                      value={profileForm.notes}
                      onChange={(e) => setProfileForm({ ...profileForm, notes: e.target.value })}
                      placeholder="e.g. Parked at Basement 2 Bay 114. Preferred timing before 8:00 AM."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 disabled:bg-slate-100 disabled:opacity-80 disabled:cursor-not-allowed focus:ring-2 focus:ring-cyan-500 focus:bg-white focus:outline-none"
                    />
                  </div>

                  {isEditingProfile && (
                    <div className="flex items-center gap-3 pt-3">
                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs shadow-md shadow-cyan-500/20 transition-all cursor-pointer"
                      >
                        Save Profile Changes
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditingProfile(false);
                          setProfileForm({
                            name: customerUser?.name || '',
                            phone: customerUser?.phone || '',
                            apartment: customerUser?.apartment || '',
                            block: customerUser?.block || '',
                            flat_number: customerUser?.flat_number || '',
                            car_model: customerUser?.car_model || '',
                            vehicle_registration_number: customerUser?.vehicle_registration_number || '',
                            notes: customerUser?.notes || ''
                          });
                        }}
                        className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer border border-slate-200"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </form>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB: 4.3 PLAN SELECTION AND RENEWAL
          ========================================================================= */}
          {activeTab === 'plans' && (
            <div className="space-y-6 max-w-5xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">
                    Explore Plans & Renewal Options
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Compare features, request a new plan, or submit a subscription renewal request.
                  </p>
                </div>

                <a
                  href={getWhatsAppLink('subscription')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-2 self-start transition-all cursor-pointer shadow-md shadow-emerald-600/20"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Contact Regarding Plan Changes</span>
                </a>
              </div>

              {/* Plans Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {plans.map((plan) => {
                  const isCurrent =
                    activeSub?.planId === plan.id ||
                    customerUser?.planId === plan.id ||
                    (customerUser?.activePlan && customerUser.activePlan.toLowerCase().includes(plan.name.toLowerCase()));

                  return (
                    <div
                      key={plan.id}
                      className={`p-5 rounded-3xl border flex flex-col justify-between transition-all relative ${
                        isCurrent
                          ? 'bg-white border-2 border-cyan-500 shadow-xl shadow-cyan-500/10'
                          : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                      }`}
                    >
                      {isCurrent && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-cyan-600 text-white font-black text-[10px] uppercase tracking-wider shadow">
                          Current Plan
                        </div>
                      )}

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              plan.category === 'Premium'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-blue-50 text-blue-700 border border-blue-200'
                            }`}
                          >
                            {plan.category} Tier
                          </span>
                          <span className="text-xs text-slate-500 font-mono font-medium">
                            {plan.duration || 'Monthly'}
                          </span>
                        </div>

                        <h4 className="text-base font-bold text-slate-900 mb-1">{plan.name}</h4>
                        <div className="flex items-baseline gap-1 my-3">
                          <span className="text-2xl font-black text-slate-900 font-mono">₹{plan.price}</span>
                          <span className="text-xs text-slate-500 font-medium">/ duration</span>
                        </div>

                        {/* Plan Features */}
                        <ul className="space-y-1.5 text-[11px] text-slate-600 my-4 border-t border-slate-100 pt-3">
                          {(plan.features || [
                            'Daily Exterior Doorstep Wash',
                            'Glass & Mirror Microfiber Polish',
                            '6:00 AM – 11:30 AM Morning Window',
                            'Dedicated Trained Specialist'
                          ]).slice(0, 4).map((f, i) => (
                            <li key={i} className="flex items-center gap-1.5">
                              <Check className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                              <span className="truncate">{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="pt-2 space-y-2">
                        <button
                          type="button"
                          onClick={() => openPaymentCheckout({ amount: plan.price, planName: plan.name })}
                          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>{isCurrent ? `Pay Plan Fee (₹${plan.price})` : `Subscribe & Pay (₹${plan.price})`}</span>
                        </button>

                        {isCurrent ? (
                          <button
                            type="button"
                            onClick={() => handleRenewalRequest(activeSub?.id)}
                            className="w-full py-2 rounded-xl bg-cyan-50 hover:bg-cyan-100 text-cyan-700 border border-cyan-200 text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                            <span>Request Next Cycle Renewal</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleRequestPlan(plan)}
                            className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-slate-200"
                          >
                            <span>Request Info</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB: 4.4 BOOKING AND SERVICE HISTORY
          ========================================================================= */}
          {activeTab === 'history' && (
            <div className="space-y-6 max-w-5xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">
                    Booking & Service History
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Morning service visits executed between 6:00 AM – 11:30 AM with status updates and specialist notes.
                  </p>
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  {['All', 'Completed', 'In Progress', 'Assigned', 'Missed', 'Rescheduled'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setHistoryFilter(status)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                        historyFilter === status
                          ? 'bg-cyan-600 text-white font-bold shadow'
                          : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {/* Visits List */}
              {filteredVisits.length > 0 ? (
                <div className="space-y-3">
                  {filteredVisits.map((visit) => (
                    <div
                      key={visit.id}
                      className="p-5 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-300 transition-all shadow-sm"
                    >
                      <div className="flex items-start gap-3.5">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                            visit.status === 'Completed'
                              ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                              : visit.status === 'In Progress'
                              ? 'bg-blue-50 text-blue-600 border border-blue-200'
                              : visit.status === 'Missed'
                              ? 'bg-rose-50 text-rose-600 border border-rose-200'
                              : 'bg-amber-50 text-amber-600 border border-amber-200'
                          }`}
                        >
                          {visit.status === 'Completed' ? (
                            <CheckCircle2 className="w-5 h-5" />
                          ) : visit.status === 'Missed' ? (
                            <AlertCircle className="w-5 h-5" />
                          ) : (
                            <Clock className="w-5 h-5" />
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-slate-900 text-sm">{visit.carModel || customerUser?.car_model}</span>
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-[10px] font-mono font-bold text-cyan-800">
                              {visit.regNumber || customerUser?.vehicle_registration_number}
                            </span>
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                visit.status === 'Completed'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : visit.status === 'In Progress'
                                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                  : visit.status === 'Missed'
                                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                  : 'bg-amber-50 text-amber-700 border border-amber-200'
                              }`}
                            >
                              ● {visit.status}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 text-xs text-slate-500 mt-1.5 flex-wrap">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-cyan-600" />
                              <span>{visit.date || 'Today'}</span>
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-cyan-600" />
                              <span>{visit.timeSlot || '07:00 AM - 08:00 AM'}</span>
                            </span>
                            {visit.employeeName && (
                              <span className="flex items-center gap-1 text-slate-700">
                                <User className="w-3.5 h-3.5 text-cyan-600" />
                                <span>Specialist: <strong>{visit.employeeName}</strong></span>
                              </span>
                            )}
                          </div>

                          {/* Notes / Reason for missed or completed */}
                          {visit.notes && (
                            <div className="mt-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-700">
                              <span className="text-slate-500 font-semibold">Specialist Note: </span>
                              <span>{visit.notes}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="sm:text-right shrink-0">
                        <span className="text-[11px] text-slate-400 block">CleanZX Doorstep Care</span>
                        <a
                          href={getWhatsAppLink('issue')}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 inline-flex items-center gap-1 text-xs text-cyan-600 hover:underline font-semibold"
                        >
                          <HelpCircle className="w-3 h-3" />
                          <span>Report Issue</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center rounded-3xl bg-white border border-slate-200 text-slate-500 text-xs shadow-sm">
                  <Clock className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="font-semibold text-slate-700">No visits matching this filter.</p>
                  <p className="mt-1">All morning services scheduled between 6:00 AM – 11:30 AM will automatically reflect here.</p>
                </div>
              )}
            </div>
          )}

          {/* =========================================================================
              TAB: 4.5 INVOICE MANAGEMENT
          ========================================================================= */}
          {activeTab === 'invoices' && (
            <div className="space-y-6 max-w-5xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">
                    Invoice Management & Receipts
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Access, view, pay online, and print/download official invoice documents and payment receipts.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => openPaymentCheckout()}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer self-start sm:self-auto"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Make Payment / Pay Dues</span>
                </button>
              </div>

              {/* Billing Summary Banner */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Total Invoiced</span>
                  <span className="text-xl font-black text-slate-900 font-mono mt-0.5 block">
                    ₹{customerInvoices.reduce((acc, i) => acc + (i.total || 0), 0).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-emerald-200 shadow-sm">
                  <span className="text-[10px] uppercase font-bold text-emerald-600 block">Total Paid</span>
                  <span className="text-xl font-black text-emerald-600 font-mono mt-0.5 block">
                    ₹{customerInvoices.reduce((acc, i) => acc + (i.amountPaid || 0), 0).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-amber-200 shadow-sm">
                  <span className="text-[10px] uppercase font-bold text-amber-600 block">Balance Due</span>
                  <span className="text-xl font-black text-amber-600 font-mono mt-0.5 block">
                    ₹{(totalBalanceDue > 0 ? totalBalanceDue : 0).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {customerInvoices.length > 0 ? (
                <div className="space-y-3">
                  {customerInvoices.map((inv) => (
                    <div
                      key={inv.id}
                      className="p-5 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-300 transition-all shadow-sm"
                    >
                      <div className="flex items-start gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-700 border border-cyan-200 flex items-center justify-center shrink-0 mt-0.5">
                          <FileText className="w-5 h-5" />
                        </div>

                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono font-bold text-slate-900 text-sm">
                              {inv.invoiceNumber}
                            </span>
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                inv.status === 'Paid'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-amber-50 text-amber-700 border border-amber-200'
                              }`}
                            >
                              ● {inv.status}
                            </span>
                            <span className="text-xs text-slate-500">
                              Date: <strong className="text-slate-700">{inv.date}</strong>
                            </span>
                          </div>

                          <p className="text-xs font-semibold text-slate-700 mt-1">
                            {inv.planName}
                          </p>

                          <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-3 flex-wrap">
                            {inv.transactionRef && (
                              <span>
                                Ref: <code className="text-cyan-700 font-mono font-semibold">{inv.transactionRef}</code>
                              </span>
                            )}
                            {inv.paymentMethod && (
                              <span>Method: {inv.paymentMethod}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                        <div className="text-left sm:text-right mr-1">
                          <div className="text-[10px] text-slate-500 uppercase">Total Amount</div>
                          <div className="text-lg font-black text-slate-900 font-mono">
                            ₹{inv.total ? inv.total.toLocaleString('en-IN') : '1,499'}
                          </div>
                        </div>

                        {inv.status !== 'Paid' && (
                          <button
                            type="button"
                            onClick={() => openPaymentCheckout({
                              amount: inv.balance !== undefined ? inv.balance : inv.total,
                              invoiceId: inv.id,
                              planName: inv.planName
                            })}
                            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-black text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/30 transition-all cursor-pointer"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                            <span>Pay Now</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => setSelectedInvoice(inv)}
                          className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 border border-slate-200 transition-all cursor-pointer"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Receipt</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 rounded-3xl bg-white border border-slate-200 text-center space-y-4 shadow-sm">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 border border-cyan-200 flex items-center justify-center mx-auto">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900">No Invoices Generated Yet</h4>
                    <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                      Official invoices for your daily doorstep car care will appear here. You can also pay directly online for your current plan.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => openPaymentCheckout({ amount: activePlanPrice, planName: customerUser?.activePlan || 'Monthly Plan' })}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-black text-xs inline-flex items-center gap-2 shadow-lg shadow-emerald-500/30 cursor-pointer"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Make Plan Payment (₹{activePlanPrice.toLocaleString('en-IN')})</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* =========================================================================
              TAB: 4.6 ADD-ON SERVICES
          ========================================================================= */}
          {activeTab === 'addons' && (
            <div className="space-y-6 max-w-5xl">
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">
                  Add-On Detailing Services
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Book specialized interior vacuuming, leather conditioning, and windshield treatments outside standard subscriptions.
                </p>
              </div>

              {/* Addons Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {addonsList.map((addon) => (
                  <div
                    key={addon.id}
                    className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-cyan-500 transition-all flex flex-col justify-between shadow-sm group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200 text-[10px] font-bold uppercase tracking-wider">
                          Detailing Add-On
                        </span>
                        <span className="text-lg font-black text-slate-900 font-mono">
                          {addon.priceDisplay || `₹${addon.price}`}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-cyan-600 transition-colors">
                        {addon.title || addon.name}
                      </h4>
                      <p className="text-xs text-slate-600 mt-2 line-clamp-3">
                        {addon.desc || addon.description || 'Specialized automotive service performed right at your parking bay.'}
                      </p>
                    </div>

                    <div className="mt-5 space-y-2">
                      <button
                        type="button"
                        onClick={() => openPaymentCheckout({ amount: addon.price, planName: `Add-On: ${addon.title || addon.name}` })}
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Book & Pay Online ({addon.priceDisplay || `₹${addon.price}`})</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedAddon(addon)}
                        className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all flex items-center justify-center gap-1.5 border border-slate-200 cursor-pointer"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>Schedule Date & Time</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Customer Requested Addons History */}
              {customerAddons.length > 0 && (
                <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm mt-6">
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-cyan-600" />
                    <span>Your Submitted Add-On Requests</span>
                  </h4>

                  <div className="space-y-2 text-xs">
                    {customerAddons.map((req) => (
                      <div
                        key={req.id}
                        className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3"
                      >
                        <div>
                          <p className="font-bold text-slate-900">{req.preferred_plan}</p>
                          <p className="text-slate-600 text-[11px]">
                            Preferred Slot: {req.preferred_start_date} ({req.preferred_time || 'Morning Window'})
                          </p>
                          {req.notes && (
                            <p className="text-[10px] text-slate-500 italic mt-0.5">{req.notes}</p>
                          )}
                        </div>

                        <div className="text-right">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              req.status === 'Confirmed' || req.status === 'Completed'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            ● {req.status || 'Pending'}
                          </span>
                          <span className="text-xs font-mono font-bold text-slate-900 block mt-1">
                            ₹{req.amount || 399}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* =========================================================================
              TAB: 4.7 WHATSAPP SUPPORT
          ========================================================================= */}
          {activeTab === 'support' && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">
                  WhatsApp Support & Helpline
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Connect instantly with CleanZX customer operations for booking enquiries, service issues, and subscription questions.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 1. Booking Enquiries */}
                <div className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-emerald-500/50 transition-all flex flex-col justify-between shadow-sm">
                  <div>
                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mb-4">
                      <CalendarDays className="w-5 h-5" />
                    </div>
                    <h4 className="text-base font-bold text-slate-900">Booking Enquiries</h4>
                    <p className="text-xs text-slate-600 mt-1">
                      Ask questions about time slot availability, rescheduling an upcoming morning visit, or parking spot changes.
                    </p>
                  </div>
                  <a
                    href={getWhatsAppLink('booking')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Chat About Booking</span>
                  </a>
                </div>

                {/* 2. Service Issues */}
                <div className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-emerald-500/50 transition-all flex flex-col justify-between shadow-sm">
                  <div>
                    <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mb-4">
                      <AlertCircle className="w-5 h-5" />
                    </div>
                    <h4 className="text-base font-bold text-slate-900">Service Issues & Quality</h4>
                    <p className="text-xs text-slate-600 mt-1">
                      Report missed visits, request a re-clean, or share feedback directly with operations managers.
                    </p>
                  </div>
                  <a
                    href={getWhatsAppLink('issue')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Report Service Issue</span>
                  </a>
                </div>

                {/* 3. Subscription Questions */}
                <div className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-emerald-500/50 transition-all flex flex-col justify-between shadow-sm">
                  <div>
                    <div className="w-10 h-10 rounded-2xl bg-cyan-50 border border-cyan-200 text-cyan-600 flex items-center justify-center mb-4">
                      <Award className="w-5 h-5" />
                    </div>
                    <h4 className="text-base font-bold text-slate-900">Subscription Questions</h4>
                    <p className="text-xs text-slate-600 mt-1">
                      Discuss plan upgrades, pause subscription during vacation, or inquire about community discounts.
                    </p>
                  </div>
                  <a
                    href={getWhatsAppLink('subscription')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Ask Subscription Team</span>
                  </a>
                </div>

                {/* 4. Renewal Requests */}
                <div className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-emerald-500/50 transition-all flex flex-col justify-between shadow-sm">
                  <div>
                    <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mb-4">
                      <RefreshCw className="w-5 h-5" />
                    </div>
                    <h4 className="text-base font-bold text-slate-900">Renewal Requests</h4>
                    <p className="text-xs text-slate-600 mt-1">
                      Fast-track your next month or quarterly renewal and lock in your preferred early morning slot.
                    </p>
                  </div>
                  <a
                    href={getWhatsAppLink('renewal')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Request Renewal on WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* Direct Helpline Call */}
              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Prefer to speak directly with an executive?</h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Our operations hotline is available Monday through Sunday, 6:00 AM – 8:00 PM.
                  </p>
                </div>
                <a
                  href="tel:+919121992399"
                  className="px-5 py-3 rounded-2xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs flex items-center gap-2 border border-slate-200 transition-all shrink-0 cursor-pointer shadow-xs"
                >
                  <Phone className="w-4 h-4 text-cyan-600" />
                  <span>Call +91 91219 92399</span>
                </a>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB: DEDICATED ONLINE PAYMENT & UPI GATEWAY HUB
          ========================================================================= */}
          {activeTab === 'payments' && (
            <div className="space-y-6 max-w-5xl">
              {/* Top Banner Status */}
              <div className="p-6 rounded-3xl bg-white border border-slate-200 relative overflow-hidden shadow-sm">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-2 bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>CleanZX Secure Online Billing Portal</span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
                      Make Payment & Manage Dues
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
                      Instant settlement via UPI QR, Google Pay, PhonePe, Cards, or Net Banking with automated official GST tax receipt.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="text-left md:text-right">
                      <div className="text-xs text-slate-500">Total Outstanding Due</div>
                      <div className={`text-3xl sm:text-4xl font-black font-mono ${totalBalanceDue > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                        ₹{totalBalanceDue > 0 ? totalBalanceDue.toLocaleString('en-IN') : '0'}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {totalBalanceDue > 0 ? 'Action required for active cycle' : 'All subscriptions & invoices settled'}
                      </div>
                    </div>

                    <button
                      onClick={() => openPaymentCheckout({ amount: totalBalanceDue > 0 ? totalBalanceDue : activePlanPrice })}
                      className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600 hover:from-emerald-500 hover:to-teal-400 text-white font-black text-sm shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <CreditCard className="w-5 h-5" />
                      <span>{totalBalanceDue > 0 ? `Pay Outstanding ₹${totalBalanceDue.toLocaleString('en-IN')}` : `Pay / Renew Plan (₹${activePlanPrice.toLocaleString('en-IN')})`}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Grid: 2 Columns */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column (5 Cols): Fast UPI QR Scanner Card */}
                <div className="lg:col-span-5 space-y-6">
                  <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col items-center text-center">
                    <div className="w-full flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
                      <div className="flex items-center gap-2">
                        <QrCode className="w-5 h-5 text-cyan-600" />
                        <span className="text-sm font-bold text-slate-900">Official Merchant UPI QR</span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        Verified Business
                      </span>
                    </div>

                    {/* Merchant Details Pill */}
                    <div className="w-full mb-3 px-3.5 py-2 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                      <div className="text-left">
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Payee Name</span>
                        <span className="font-bold text-slate-900">CleanZX Car Care</span>
                      </div>
                      <span className="text-[11px] font-bold text-[#5f259f] bg-purple-50 px-2 py-0.5 rounded-lg border border-purple-200">
                        PhonePe Merchant
                      </span>
                    </div>

                    {/* Professional QR Code Container with Frame */}
                    <div className="p-4 bg-white rounded-3xl shadow-lg border border-slate-200 relative group flex flex-col items-center max-w-[290px] w-full">
                      {/* Scanner decorative corner accents */}
                      <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-cyan-500 rounded-tl-lg" />
                      <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-cyan-500 rounded-tr-lg" />
                      <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-cyan-500 rounded-bl-lg" />
                      <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-cyan-500 rounded-br-lg" />

                      <img
                        src="/images/cleanzx-phonepe-qr.png"
                        alt="CleanZX Official PhonePe UPI QR Code"
                        className="w-56 h-auto object-contain rounded-xl"
                        onError={(e) => {
                          e.target.src = '/images/cleanzx-qr-cropped.png';
                        }}
                      />

                      <div className="mt-2 text-[11px] font-bold text-slate-500 flex items-center gap-1.5">
                        <span>Scan & Pay from any UPI App</span>
                      </div>
                    </div>

                    {/* Supported Apps Row */}
                    <div className="flex flex-wrap items-center justify-center gap-1.5 mt-4 text-[11px] font-semibold">
                      <span className="px-2.5 py-1 rounded-xl bg-purple-50 text-[#5f259f] border border-purple-200 font-bold">PhonePe</span>
                      <span className="px-2.5 py-1 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 font-bold">GPay</span>
                      <span className="px-2.5 py-1 rounded-xl bg-sky-50 text-sky-700 border border-sky-200 font-bold">Paytm</span>
                      <span className="px-2.5 py-1 rounded-xl bg-orange-50 text-orange-700 border border-orange-200 font-bold">BHIM</span>
                      <span className="px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700 border border-slate-200">Any UPI</span>
                    </div>

                    {/* Official UPI ID & Actions */}
                    <div className="mt-4 w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <div className="text-left">
                        <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">UPI ID / VPA</div>
                        <div className="text-xs font-mono font-bold text-cyan-800">9912234252-4@ybl</div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            navigator.clipboard?.writeText('9912234252-4@ybl');
                            showNotice('UPI ID (9912234252-4@ybl) copied to clipboard!');
                          }}
                          className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-[11px] font-semibold flex items-center gap-1 border border-slate-200 cursor-pointer transition-colors shadow-2xs"
                          title="Copy UPI ID"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </button>
                        <a
                          href="/images/cleanzx-phonepe-qr.png"
                          download="CleanZX-PhonePe-QR.png"
                          className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-[11px] font-semibold flex items-center gap-1 border border-slate-200 cursor-pointer transition-colors shadow-2xs"
                          title="Download QR Image"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Save</span>
                        </a>
                      </div>
                    </div>

                    {/* Mobile Direct Pay or Confirm Button */}
                    <div className="mt-4 w-full space-y-2">
                      <a
                        href="upi://pay?pa=9912234252-4@ybl&pn=CleanZX%20Car%20Care&cu=INR"
                        className="sm:hidden w-full py-2.5 rounded-2xl bg-[#5f259f] hover:bg-[#4d1d82] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Pay via Installed UPI App</span>
                      </a>

                      <button
                        onClick={() => openPaymentCheckout({ amount: totalBalanceDue > 0 ? totalBalanceDue : activePlanPrice })}
                        className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 hover:from-emerald-500 hover:to-cyan-400 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 cursor-pointer transition-all"
                      >
                        <QrCode className="w-4 h-4" />
                        <span>Confirm Payment with UTR</span>
                      </button>
                    </div>
                  </div>

                  {/* Safety & Trust Box */}
                  <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200 text-xs space-y-3">
                    <div className="flex items-center gap-2 text-emerald-700 font-bold">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>RBI Compliant & 256-Bit Encrypted</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      All online payments are securely processed through end-to-end tokenized gateways. CleanZX never stores your card PIN or CVV. GST tax invoices are automatically generated and stamped upon transaction verification.
                    </p>
                  </div>
                </div>

                {/* Right Column (7 Cols): Subscription Invoices & History */}
                <div className="lg:col-span-7 space-y-6">
                  {/* Current Active Plan Card */}
                  <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-cyan-600" />
                        <span className="text-sm font-bold text-slate-900">Linked Plan & Vehicle</span>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        activeSub?.status === 'Active' || activeSub?.status === 'Renewed'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {activeSub?.status || customerUser?.subscriptionStatus || 'Pending'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4 text-xs">
                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                        <span className="text-[10px] text-slate-500 block font-semibold">Current Plan</span>
                        <span className="text-xs font-bold text-slate-900 mt-0.5 block truncate">
                          {activeSub?.planName || customerUser?.activePlan || 'Standard Plan'}
                        </span>
                      </div>
                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                        <span className="text-[10px] text-slate-500 block font-semibold">Service Vehicle</span>
                        <span className="text-xs font-mono font-bold text-cyan-800 mt-0.5 block truncate">
                          {customerUser?.vehicle_registration_number || 'TS Registered'}
                        </span>
                      </div>
                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 col-span-2 sm:col-span-1">
                        <span className="text-[10px] text-slate-500 block font-semibold">Billing Amount</span>
                        <span className="text-xs font-mono font-black text-slate-900 mt-0.5 block">
                          ₹{activePlanPrice.toLocaleString('en-IN')} / mo
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Customer Invoices & Bill Records */}
                  <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-cyan-600" />
                        <span className="text-sm font-bold text-slate-900">Tax Invoices & Receipts</span>
                      </div>
                      <button
                        onClick={() => setActiveTab('invoices')}
                        className="text-xs text-cyan-700 hover:text-cyan-900 font-semibold cursor-pointer"
                      >
                        View Full Records →
                      </button>
                    </div>

                    {customerInvoices.length === 0 ? (
                      <div className="text-center py-8">
                        <FileText className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                        <p className="text-xs text-slate-500">No invoices generated yet for this account.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {customerInvoices.slice(0, 5).map((inv) => (
                          <div
                            key={inv.id}
                            className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-slate-900">{inv.invoiceNumber}</span>
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                    inv.status === 'Paid'
                                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                                  }`}
                                >
                                  {inv.status}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500">
                                {inv.planName} • Date: {inv.date}
                              </p>
                            </div>

                            <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200">
                              <div className="text-left sm:text-right">
                                <div className="text-xs font-black font-mono text-slate-900">
                                  ₹{inv.total?.toLocaleString('en-IN')}
                                </div>
                                <div className="text-[10px] text-slate-500">
                                  {inv.paymentMethod || 'Online'}
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                {inv.status !== 'Paid' ? (
                                  <button
                                    onClick={() =>
                                      openPaymentCheckout({
                                        amount: inv.balance !== undefined ? inv.balance : inv.total,
                                        planName: inv.planName,
                                        invoiceId: inv.id
                                      })
                                    }
                                    className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs shadow-md shadow-emerald-500/20 cursor-pointer"
                                  >
                                    Pay Now
                                  </button>
                                ) : null}

                                <button
                                  onClick={() => setSelectedInvoice(inv)}
                                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs border border-slate-200 cursor-pointer"
                                >
                                  Receipt
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* =========================================================================
          MODAL: BOOK ADD-ON MODAL
      ========================================================================= */}
      {selectedAddon && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 w-full max-w-md shadow-2xl animate-fadeIn text-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-cyan-600" />
                <h4 className="text-sm font-bold text-slate-900">Book Add-On Detailing</h4>
              </div>
              <button
                onClick={() => setSelectedAddon(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleBookAddon} className="space-y-4 my-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                <div>
                  <p className="font-bold text-slate-900">{selectedAddon.title || selectedAddon.name}</p>
                  <p className="text-[11px] text-slate-500">Doorstep specialist execution</p>
                </div>
                <span className="text-base font-black text-cyan-800 font-mono">
                  {selectedAddon.priceDisplay || `₹${selectedAddon.price}`}
                </span>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Preferred Date
                </label>
                <input
                  type="date"
                  required
                  value={addonDate}
                  onChange={(e) => setAddonDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Preferred Morning Time Slot
                </label>
                <select
                  value={addonTime}
                  onChange={(e) => setAddonTime(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="06:00 AM - 07:00 AM">06:00 AM - 07:00 AM</option>
                  <option value="07:00 AM - 08:00 AM">07:00 AM - 08:00 AM</option>
                  <option value="08:00 AM - 09:00 AM">08:00 AM - 09:00 AM</option>
                  <option value="09:00 AM - 10:00 AM">09:00 AM - 10:00 AM</option>
                  <option value="10:00 AM - 11:30 AM">10:00 AM - 11:30 AM</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Special Notes for Specialist (Optional)
                </label>
                <textarea
                  rows={2}
                  value={addonNotes}
                  onChange={(e) => setAddonNotes(e.target.value)}
                  placeholder="e.g. Car will be unlocked at 8 AM, key with security."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs shadow-md shadow-cyan-500/20 cursor-pointer"
                >
                  Confirm & Submit Request
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedAddon(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: INVOICE MODAL (SECTION 4.5)
      ========================================================================= */}
      {selectedInvoice && (
        <InvoiceModal
          invoice={selectedInvoice}
          customer={customerUser}
          onClose={() => setSelectedInvoice(null)}
          onPayNow={(inv) => {
            setSelectedInvoice(null);
            openPaymentCheckout({
              amount: inv.balance !== undefined ? inv.balance : inv.total,
              planName: inv.planName,
              invoiceId: inv.id
            });
          }}
        />
      )}

      {/* =========================================================================
          MODAL: PAYMENT GATEWAY (UPI, CARDS, NETBANKING)
      ========================================================================= */}
      {isPaymentModalOpen && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          onPaymentSuccess={handlePaymentSuccess}
          paymentData={checkoutData || {
            amount: totalBalanceDue > 0 ? totalBalanceDue : activePlanPrice,
            planName: activeSub?.planName || customerUser?.activePlan || 'Monthly Doorstep Car Care',
            customerName: customerUser?.name || 'Customer',
            phone: customerUser?.phone || '',
            apartment: customerUser?.apartment || '',
            vehicle: `${customerUser?.car_model || ''} ${customerUser?.vehicle_registration_number || ''}`.trim()
          }}
        />
      )}
    </div>
  );
}
