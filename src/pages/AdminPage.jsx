import React, { useState } from 'react';
import {
  ShieldCheck,
  LayoutDashboard,
  Globe,
  Tag,
  Users,
  CalendarCheck,
  Calendar,
  UserCheck,
  Clock,
  CreditCard,
  MessageSquare,
  LogOut,
  ExternalLink,
  Sparkles,
  RotateCcw,
  RefreshCw,
  Menu,
  X,
  ChevronRight,
  Database
} from 'lucide-react';
import { useAdminData } from '../context/AdminDataContext';
import AdminLogin from '../components/admin/AdminLogin';
import WhatsAppModal from '../components/admin/WhatsAppModal';

// Tabs
import OverviewTab from '../components/admin/tabs/OverviewTab';
import ContentManagementTab from '../components/admin/tabs/ContentManagementTab';
import PlansAddonsTab from '../components/admin/tabs/PlansAddonsTab';
import CustomersTab from '../components/admin/tabs/CustomersTab';
import SubscriptionsTab from '../components/admin/tabs/SubscriptionsTab';
import BookingsTab from '../components/admin/tabs/BookingsTab';
import EmployeesTab from '../components/admin/tabs/EmployeesTab';
import DailyScheduleTab from '../components/admin/tabs/DailyScheduleTab';
import InvoicesTab from '../components/admin/tabs/InvoicesTab';
import WhatsAppHubTab from '../components/admin/tabs/WhatsAppHubTab';
import CoreRecordsScopeTab from '../components/admin/tabs/CoreRecordsScopeTab';

export default function AdminPage() {
  const {
    isAuthenticated,
    adminUser,
    logout,
    resetToDefaults,
    syncWithCloud,
    bookings,
    subscriptions,
    dailySchedules,
    invoices
  } = useAdminData();

  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleCloudSync = async () => {
    setIsSyncing(true);
    try {
      await syncWithCloud();
    } finally {
      setTimeout(() => setIsSyncing(false), 600);
    }
  };

  // Global WhatsApp Modal State
  const [whatsAppModalData, setWhatsAppModalData] = useState({
    isOpen: false,
    initialData: {}
  });

  const handleOpenWhatsApp = (data) => {
    setWhatsAppModalData({
      isOpen: true,
      initialData: data || {}
    });
  };

  const handleCloseWhatsApp = () => {
    setWhatsAppModalData(prev => ({ ...prev, isOpen: false }));
  };

  // If not logged in, show the Admin Login page
  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  // Pending counters for badges
  const pendingBookings = bookings.filter(b => b.status === 'Pending').length;
  const pendingInvoices = invoices.filter(i => i.status === 'Pending').length;
  const expiringSubs = subscriptions.filter(s => s.daysRemaining <= 7 && s.status === 'Active').length;

  const navItems = [
    { id: 'overview', label: 'Overview & Reports', icon: LayoutDashboard },
    { id: 'content', label: 'Website Content', icon: Globe },
    { id: 'plans', label: 'Plans & Add-ons', icon: Tag },
    { id: 'customers', label: 'Customers', icon: Users },
    {
      id: 'subscriptions',
      label: 'Subscriptions',
      icon: CalendarCheck,
      badge: expiringSubs > 0 ? expiringSubs : undefined,
      badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
    },
    {
      id: 'bookings',
      label: 'Bookings & Enquiries',
      icon: Calendar,
      badge: pendingBookings > 0 ? pendingBookings : undefined,
      badgeColor: 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
    },
    { id: 'employees', label: 'Employees', icon: UserCheck },
    { id: 'schedule', label: 'Daily Service Schedule', icon: Clock },
    {
      id: 'invoices',
      label: 'Invoices & Payments',
      icon: CreditCard,
      badge: pendingInvoices > 0 ? pendingInvoices : undefined,
      badgeColor: 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
    },
    { id: 'whatsapp', label: 'WhatsApp Contact Hub', icon: MessageSquare },
    {
      id: 'core-scope',
      label: 'System Records & Database',
      icon: Database
    }
  ];

  const currentNav = navItems.find(item => item.id === activeTab) || navItems[0];

  return (
    <div className="min-h-screen bg-slate-100/80 text-slate-900 flex font-sans antialiased">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-slate-950/70 z-40 lg:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      {/* ======================================================== */}
      {/* VERTICAL SIDEBAR (Desktop & Mobile Drawer) */}
      {/* ======================================================== */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 h-screen max-h-screen bg-slate-900 border-r border-slate-800 text-slate-200 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Brand Header (Pinned at top) */}
        <div className="shrink-0 border-b border-slate-800 bg-slate-950">
          {/* Logo Container */}
          <div className="py-3 px-4 flex items-center justify-center relative">
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden absolute right-3 top-3 p-1.5 text-slate-400 hover:text-white rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <img
              src="/images/admin-brand-logo.png"
              alt="CLEANZX Logo"
              className="w-full max-w-[210px] h-14 sm:h-16 object-contain drop-shadow-md transition-all hover:scale-105"
            />
          </div>

          {/* Super Admin Portal Badge */}
          <div className="pb-2.5 px-4 flex items-center justify-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 text-[10px] font-extrabold tracking-wider uppercase shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 stroke-[2.5]" />
              <span>SUPER ADMIN PORTAL</span>
            </div>
          </div>
        </div>

        {/* Navigation Links (Flex-1 with smooth vertical scrolling) */}
        <nav className="flex-1 min-h-0 overflow-y-auto p-3 space-y-1 scrollbar-thin scrollbar-thumb-slate-700">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-all cursor-pointer group ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-600/30 font-bold'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-cyan-400'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-white text-cyan-700 shadow-xs'
                        : item.badgeColor || 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer (Pinned at bottom, ALWAYS VISIBLE) */}
        <div className="shrink-0 p-3.5 border-t border-slate-800 bg-slate-950/90 space-y-2.5">
          {/* Public Website Link */}
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="w-full px-3 py-1.5 bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-semibold border border-slate-700/60 flex items-center justify-between transition-colors"
          >
            <span className="flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>View Public Website</span>
            </span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>

          {/* User Profile & Logout */}
          <div className="flex items-center justify-between pt-0.5">
            <div className="flex items-center gap-2.5 truncate">
              <div className="w-8 h-8 rounded-xl bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 font-bold text-xs flex items-center justify-center shrink-0">
                A
              </div>
              <div className="truncate">
                <span className="text-xs font-bold text-white block truncate leading-tight">
                  {adminUser?.username || 'admin@cleanzx.com'}
                </span>
                <span className="text-[10px] text-slate-400 block truncate">
                  Super Administrator
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={logout}
              className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/20 rounded-xl transition-colors cursor-pointer shrink-0"
              title="Log out of Admin Portal"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ======================================================== */}
      {/* MAIN CONTENT AREA */}
      {/* ======================================================== */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72 h-screen overflow-hidden">
        {/* Pinned Top Header Bar (Never moves on scroll) */}
        <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-40 shadow-xs shrink-0">
          <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
            {/* Left: Mobile Toggle & Page Title */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl cursor-pointer"
                aria-label="Open navigation menu"
              >
                <Menu className="w-5 h-5" />
              </button>

              <img
                src="/images/admin-brand-logo.jpeg"
                alt="CLEANZX Logo"
                className="h-9 w-auto object-contain rounded-lg p-0.5 bg-black lg:hidden"
              />

              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-xs font-medium hidden sm:inline">Admin /</span>
                <h1 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                  <span>{currentNav.label}</span>
                </h1>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Cloud Sync Button */}
              <button
                onClick={handleCloudSync}
                disabled={isSyncing}
                title="Sync database with Cloud Supabase"
                className="px-3 py-1.5 bg-slate-100 hover:bg-cyan-50 text-slate-700 hover:text-cyan-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-slate-200 transition-all cursor-pointer shadow-2xs"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-cyan-600' : 'text-slate-500'}`} />
                <span className="hidden sm:inline">{isSyncing ? 'Syncing...' : 'Sync Cloud'}</span>
              </button>

              {/* WhatsApp Quick Chat */}
              <button
                onClick={() => handleOpenWhatsApp({ templateType: 'support' })}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm shadow-emerald-600/30 transition-all cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">WhatsApp Chat</span>
              </button>

              {/* Reset Demo Data */}
              <button
                onClick={() => {
                  if (confirm('Reset all admin and website data back to factory demo defaults?')) {
                    resetToDefaults();
                  }
                }}
                title="Reset to default mock dataset"
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Tab Content Display - Independently scrollable while header stays fixed */}
        <main className="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto flex-1 overflow-y-auto">
          {activeTab === 'overview' && (
            <OverviewTab
              setActiveTab={setActiveTab}
              onOpenWhatsApp={handleOpenWhatsApp}
            />
          )}

          {activeTab === 'content' && <ContentManagementTab />}

          {activeTab === 'plans' && (
            <PlansAddonsTab onOpenWhatsApp={handleOpenWhatsApp} />
          )}

          {activeTab === 'customers' && (
            <CustomersTab onOpenWhatsApp={handleOpenWhatsApp} />
          )}

          {activeTab === 'subscriptions' && (
            <SubscriptionsTab onOpenWhatsApp={handleOpenWhatsApp} />
          )}

          {activeTab === 'bookings' && (
            <BookingsTab onOpenWhatsApp={handleOpenWhatsApp} />
          )}

          {activeTab === 'employees' && <EmployeesTab />}

          {activeTab === 'schedule' && (
            <DailyScheduleTab onOpenWhatsApp={handleOpenWhatsApp} />
          )}

          {activeTab === 'invoices' && (
            <InvoicesTab onOpenWhatsApp={handleOpenWhatsApp} />
          )}

          {activeTab === 'whatsapp' && (
            <WhatsAppHubTab onOpenWhatsApp={handleOpenWhatsApp} />
          )}

          {activeTab === 'core-scope' && (
            <CoreRecordsScopeTab
              setActiveTab={setActiveTab}
              onOpenWhatsApp={handleOpenWhatsApp}
            />
          )}
        </main>
      </div>

      {/* Global WhatsApp Contact Modal */}
      <WhatsAppModal
        isOpen={whatsAppModalData.isOpen}
        onClose={handleCloseWhatsApp}
        initialData={whatsAppModalData.initialData}
      />
    </div>
  );
}
