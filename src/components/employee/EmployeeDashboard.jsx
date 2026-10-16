import React, { useState } from 'react';
import {
  Clock,
  Car,
  Phone,
  MessageSquare,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Play,
  RotateCcw,
  LogOut,
  Calendar,
  Sparkles,
  Check,
  X,
  FileText,
  Building,
  User,
  Star,
  Layers,
  ChevronDown,
  Filter,
  Menu,
  ChevronRight,
  ShieldCheck,
  CalendarCheck,
  TrendingUp,
  Award,
  Zap,
  Info
} from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';

export default function EmployeeDashboard() {
  const {
    employeeUser,
    employeeLogout,
    dailySchedules,
    bookings,
    updateScheduleStatus,
    reassignScheduleEmployee
  } = useAdminData();

  const [activeTab, setActiveTab] = useState('runs');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [showAllCityVisits, setShowAllCityVisits] = useState(false);
  const [updatingJob, setUpdatingJob] = useState(null);
  const [updateForm, setUpdateForm] = useState({
    status: 'Completed',
    notes: '',
    reason: 'Vehicle not parked in bay'
  });
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const todayStr = new Date().toISOString().slice(0, 10);
  const tomorrowObj = new Date();
  tomorrowObj.setDate(tomorrowObj.getDate() + 1);
  const tomorrowStr = tomorrowObj.toISOString().slice(0, 10);

  // Filter jobs strictly assigned to this logged-in employee (from dailySchedules AND bookings)
  const myAssignedJobs = React.useMemo(() => {
    if (!employeeUser) return [];
    const empName = (employeeUser.name || '').toLowerCase().trim();
    const empUser = (employeeUser.username || '').toLowerCase().trim();
    const empId = employeeUser.id;

    const matchesEmp = (name, id) => {
      const n = (name || '').toLowerCase().trim();
      return (id && id === empId) || (n && (n === empName || n === empUser));
    };

    // 1. From dailySchedules
    const scheduleJobs = (dailySchedules || []).filter(s => matchesEmp(s.employeeName, s.employeeId));

    // 2. From bookings (ensure no duplicate if already present in dailySchedules)
    const bookingJobs = (bookings || [])
      .filter(b => b.assigned_employee && b.assigned_employee !== 'Unassigned' && matchesEmp(b.assigned_employee, null))
      .filter(b => !scheduleJobs.some(s => s.bookingId === b.id || s.id === 'SCH-' + b.id))
      .map(b => ({
        id: 'SCH-' + b.id,
        bookingId: b.id,
        timeSlot: b.preferred_time || '07:00 AM - 08:00 AM',
        customerName: b.customer_name || 'Customer',
        phone: b.phone_number || '',
        apartment: b.apartment || 'Prestige High Fields',
        block: b.block || (b.address?.includes('Tower') ? b.address.split('-')[0].trim() : 'Tower 1'),
        flat: b.flat_number || b.flat || (b.address?.includes('Flat') ? b.address.split('Flat')[1].trim() : '89'),
        carModel: b.car_model || 'Sedan',
        regNumber: b.vehicle_registration_number || 'TS-REG',
        planName: b.preferred_plan || 'Confirmed Booking',
        employeeId: employeeUser.id,
        employeeName: b.assigned_employee,
        date: b.preferred_start_date || todayStr,
        status: b.status === 'Completed' ? 'Completed' : (b.status === 'In Progress' ? 'In Progress' : 'Assigned'),
        notes: b.adminNotes || (b.selected_addons?.length ? `Add-ons: ${b.selected_addons.join(', ')}` : 'Assigned Customer Booking'),
        source: 'booking'
      }));

    return [...scheduleJobs, ...bookingJobs];
  }, [dailySchedules, bookings, employeeUser, todayStr]);

  // Specialist jobs display source
  const displaySource = showAllCityVisits ? dailySchedules : myAssignedJobs;

  // Upcoming jobs (scheduled for tomorrow or later)
  const tomorrowJobs = myAssignedJobs.filter(j => j.date === tomorrowStr);
  const upcomingJobs = myAssignedJobs.filter(j => j.date && j.date > todayStr);

  // Date filtered source
  const dateFilteredJobs = displaySource.filter(j => {
    if (dateFilter === 'all') return true;
    if (dateFilter === 'today') return j.date === todayStr;
    if (dateFilter === 'tomorrow') return j.date === tomorrowStr;
    if (dateFilter === 'upcoming') return j.date && j.date >= todayStr;
    return j.date === dateFilter;
  });

  // Calculate shift stats
  const totalJobs = myAssignedJobs.length;
  const completedJobs = myAssignedJobs.filter(j => j.status === 'Completed').length;
  const inProgressJobs = myAssignedJobs.filter(j => j.status === 'In Progress').length;
  const missedJobs = myAssignedJobs.filter(j => j.status === 'Missed').length;
  const pendingJobs = myAssignedJobs.filter(j => j.status === 'Assigned' || j.status === 'Confirmed' || j.status === 'Rescheduled').length;
  const progressPercent = totalJobs > 0 ? Math.round((completedJobs / totalJobs) * 100) : 0;

  // Filtered list
  const filteredJobs = dateFilteredJobs.filter(j => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'in_progress') return j.status === 'In Progress';
    if (activeFilter === 'assigned') return j.status === 'Assigned' || j.status === 'Confirmed';
    if (activeFilter === 'completed') return j.status === 'Completed';
    if (activeFilter === 'missed') return j.status === 'Missed' || j.status === 'Rescheduled';
    return true;
  });

  const handleOpenUpdateModal = (job, presetStatus) => {
    setUpdatingJob(job);
    setUpdateForm({
      status: presetStatus || job.status || 'Completed',
      notes: job.notes || '',
      reason: job.missedReason || 'Vehicle not parked in bay'
    });
  };

  const handleSaveStatus = (e) => {
    e.preventDefault();
    if (!updatingJob) return;

    const notesToSave = updateForm.status === 'Missed'
      ? `Missed: ${updateForm.reason}${updateForm.notes ? ` - ${updateForm.notes}` : ''}`
      : updateForm.notes;

    updateScheduleStatus(
      updatingJob.id,
      updateForm.status,
      notesToSave,
      updateForm.status === 'Missed' ? updateForm.reason : null
    );

    showToast(`Visit marked as ${updateForm.status}`);
    setUpdatingJob(null);
  };

  const handleQuickStatusChange = (jobId, newStatus) => {
    updateScheduleStatus(jobId, newStatus);
    showToast(`Status updated to ${newStatus}`);
  };

  const todayDate = new Date().toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  // Navigation Items for Employee Sidebar
  const navItems = [
    {
      id: 'runs',
      label: "Morning Run & Visits",
      icon: Clock,
      badge: myAssignedJobs.length > 0 ? myAssignedJobs.length : undefined,
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
    },
    {
      id: 'history',
      label: 'Visit History & Logs',
      icon: CalendarCheck,
      badge: completedJobs > 0 ? completedJobs : undefined,
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
    },
    {
      id: 'communities',
      label: 'Assigned Communities',
      icon: Building,
      badge: myAssignedJobs.length > 0 ? myAssignedJobs.length : undefined,
      badgeColor: 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
    },
    {
      id: 'performance',
      label: 'My Rating & Profile',
      icon: Star
    },
    {
      id: 'support',
      label: 'Supervisor WhatsApp',
      icon: MessageSquare
    }
  ];

  return (
    <div className="h-screen w-full bg-white text-slate-800 flex font-sans antialiased overflow-hidden">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-cyan-600 text-white font-bold text-xs px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-white" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-slate-950/80 z-40 lg:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      {/* ======================================================== */}
      {/* VERTICAL SIDEBAR (RESTORED TO ORIGINAL DARK THEME) */}
      {/* ======================================================== */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-slate-900 border-r border-slate-800 text-slate-200 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Logo Container */}
          <div className="py-4 px-4 border-b border-slate-800 flex items-center justify-center bg-slate-950 relative">
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden absolute right-3 top-3 p-1.5 text-slate-400 hover:text-white rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <img
              src="/images/admin-brand-logo.png"
              alt="CLEANZX Logo"
              className="w-full max-w-[230px] h-18 sm:h-20 object-contain drop-shadow-md transition-all hover:scale-105"
            />
          </div>

          {/* Specialist Portal Pill Badge (Below Line) */}
          <div className="pt-3 pb-1.5 px-4 flex items-center justify-center">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 text-[11px] font-extrabold tracking-wider uppercase shadow-xs">
              <Clock className="w-3.5 h-3.5 text-cyan-400 stroke-[2.5]" />
              <span>SPECIALIST PORTAL</span>
            </div>
          </div>

          {/* Specialist Profile Snippet Card */}
          <div className="mx-3.5 my-3 p-3 bg-slate-950/70 border border-slate-800/80 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-white font-black text-sm flex items-center justify-center shadow-md shadow-cyan-600/30 shrink-0">
                {employeeUser?.name?.charAt(0) || 'S'}
              </div>
              <div className="overflow-hidden">
                <span className="font-bold text-xs text-white block truncate leading-tight">
                  {employeeUser?.name || 'Staff Member'}
                </span>
                <span className="text-[10px] text-cyan-400 font-medium block truncate">
                  {employeeUser?.role || 'Doorstep Cleaning Specialist'}
                </span>
                <div className="flex items-center gap-1 mt-0.5 text-[10px] text-amber-400 font-bold">
                  <Star className="w-3 h-3 fill-amber-400" />
                  <span>{employeeUser?.rating || '5.0'} Rating</span>
                </div>
              </div>
            </div>

            <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
              <span className="truncate max-w-[150px]">{employeeUser?.zone || 'Hyderabad West'}</span>
              <span className="text-emerald-400 font-bold">On Duty</span>
            </div>
          </div>

          {/* Sidebar Navigation Menu */}
          <nav className="p-3.5 space-y-1 max-h-[calc(100vh-360px)] overflow-y-auto">
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
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all cursor-pointer group ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-600/30 font-bold'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive ? 'text-white' : 'text-cyan-400 group-hover:text-cyan-300'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                        isActive
                          ? 'bg-white/20 text-white'
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
        </div>

        {/* Sidebar Footer Logout */}
        <div className="p-3.5 border-t border-slate-800 bg-slate-950/80">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2 px-1">
            <span className="text-[10px] uppercase font-bold text-slate-500">Service Hours</span>
            <span className="font-mono text-cyan-400 font-bold text-[10px]">6:00 AM - 11:30 AM</span>
          </div>

          <button
            onClick={employeeLogout}
            className="w-full px-3 py-2 bg-slate-800/80 hover:bg-rose-950/40 text-slate-300 hover:text-rose-300 border border-slate-700/60 hover:border-rose-500/40 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>End Shift / Logout</span>
          </button>
        </div>
      </aside>

      {/* ======================================================== */}
      {/* MAIN CONTENT AREA (WHITE BACKGROUND) */}
      {/* ======================================================== */}
      <div className="flex-1 lg:pl-72 flex flex-col h-screen w-full overflow-hidden bg-white">
        {/* Pinned Top Header */}
        <header className="sticky top-0 z-30 bg-white/95 border-b border-slate-200 backdrop-blur-md px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-xl bg-slate-100 border border-slate-200 cursor-pointer"
              aria-label="Open Sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500 font-medium hidden sm:inline">Specialist Staff</span>
                <span className="text-slate-300 hidden sm:inline">/</span>
                <span className="text-cyan-700 font-bold">
                  {navItems.find(t => t.id === activeTab)?.label || 'Dashboard'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600 mt-0.5">
                <Clock className="w-3 h-3 text-cyan-600 shrink-0" />
                <span className="font-bold text-slate-900 font-mono">6:00 AM - 11:30 AM Shift</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-500">{todayDate}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="px-3 py-1 bg-cyan-50 border border-cyan-200 rounded-xl text-xs font-bold text-cyan-700 flex items-center gap-1.5 shadow-xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600" />
              <span>{completedJobs}/{totalJobs} Completed</span>
            </div>

            <button
              onClick={employeeLogout}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 rounded-xl text-xs font-semibold transition-colors cursor-pointer border border-slate-200"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* Scrollable Viewport */}
        <main className="p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto flex-1 overflow-y-auto space-y-5 bg-white">
          {/* TAB 1: TODAY'S MORNING RUN & VISITS */}
          {activeTab === 'runs' && (
            <div className="space-y-4 animate-fadeIn">
              {/* Shift Banner with KPI Progress */}
              <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200 text-[11px] font-bold uppercase tracking-wider mb-1.5">
                      <Clock className="w-3 h-3 text-cyan-600" />
                      <span>CleanZX Doorstep Service Cycle</span>
                    </div>
                    <h2 className="text-lg sm:text-xl font-black text-slate-900">
                      Today's Morning Run
                    </h2>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Zone: <strong className="text-slate-900">{employeeUser?.zone || 'Hyderabad West'}</strong> • Assigned Specialist: <strong className="text-cyan-700">{employeeUser?.name || 'Staff'}</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-2xl sm:text-3xl font-black text-cyan-700">
                        {completedJobs}/{totalJobs}
                      </span>
                      <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider">
                        Visits Done
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200">
                    <div
                      className="bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-400 h-2.5 rounded-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-slate-500 mt-1.5">
                    <span>{progressPercent}% shift completed</span>
                    <span>{pendingJobs + inProgressJobs} morning visits remaining</span>
                  </div>
                </div>
              </div>

              {/* Quick Stat Chips */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white border border-slate-200 p-3.5 rounded-2xl text-center shadow-xs">
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">Total Assigned</span>
                  <span className="text-xl font-black text-slate-900 mt-0.5 block">{totalJobs}</span>
                </div>
                <div className="bg-white border border-cyan-200 p-3.5 rounded-2xl text-center shadow-xs">
                  <span className="text-[10px] text-cyan-700 block uppercase font-bold">In Progress</span>
                  <span className="text-xl font-black text-cyan-700 mt-0.5 block">{inProgressJobs}</span>
                </div>
                <div className="bg-white border border-emerald-200 p-3.5 rounded-2xl text-center shadow-xs">
                  <span className="text-[10px] text-emerald-700 block uppercase font-bold">Completed</span>
                  <span className="text-xl font-black text-emerald-700 mt-0.5 block">{completedJobs}</span>
                </div>
                <div className="bg-white border border-amber-200 p-3.5 rounded-2xl text-center shadow-xs">
                  <span className="text-[10px] text-amber-700 block uppercase font-bold">Pending</span>
                  <span className="text-xl font-black text-amber-700 mt-0.5 block">{pendingJobs}</span>
                </div>
              </div>

              {/* Upcoming Visits Alert Banner */}
              {upcomingJobs.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center shrink-0">
                      <Calendar className="w-5 h-5 text-amber-700" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-amber-900">
                        {upcomingJobs.length} Assigned Service Visit(s) Scheduled for Tomorrow ({tomorrowStr})
                      </p>
                      <p className="text-[11px] text-amber-800 mt-0.5">
                        Customer: <strong className="text-slate-900">{upcomingJobs.map(j => `${j.customerName} (${j.apartment})`).join(', ')}</strong>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      onClick={() => setDateFilter('tomorrow')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        dateFilter === 'tomorrow'
                          ? 'bg-amber-500 text-white shadow-xs'
                          : 'bg-white hover:bg-amber-100 text-amber-800 border border-amber-300'
                      }`}
                    >
                      View Tomorrow's Run
                    </button>
                    {dateFilter !== 'all' && (
                      <button
                        onClick={() => setDateFilter('all')}
                        className="px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs rounded-xl cursor-pointer"
                      >
                        Show All
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Date & Status Filter Bars */}
              <div className="space-y-2.5 pt-1">
                {/* Date Selection Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mr-1 shrink-0">
                    Filter Date:
                  </span>
                  {[
                    { id: 'all', label: `All Assigned (${myAssignedJobs.length})` },
                    { id: 'today', label: `Today • ${todayStr.slice(5)} (${myAssignedJobs.filter(j => j.date === todayStr).length})` },
                    { id: 'tomorrow', label: `Tomorrow • ${tomorrowStr.slice(5)} (${myAssignedJobs.filter(j => j.date === tomorrowStr).length})` },
                    ...(upcomingJobs.length > 0 && !tomorrowJobs.length
                      ? [{ id: 'upcoming', label: `Upcoming (${upcomingJobs.length})` }]
                      : [])
                  ].map(dt => (
                    <button
                      key={dt.id}
                      onClick={() => setDateFilter(dt.id)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                        dateFilter === dt.id
                          ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-600/30 border border-cyan-500'
                          : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                      }`}
                    >
                      {dt.label}
                    </button>
                  ))}
                </div>

                {/* Status Chips Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                    {[
                      { id: 'all', label: `All Status (${dateFilteredJobs.length})` },
                      { id: 'in_progress', label: `In Progress (${dateFilteredJobs.filter(j => j.status === 'In Progress').length})` },
                      { id: 'assigned', label: `Assigned (${dateFilteredJobs.filter(j => j.status === 'Assigned' || j.status === 'Confirmed').length})` },
                      { id: 'completed', label: `Completed (${dateFilteredJobs.filter(j => j.status === 'Completed').length})` },
                      { id: 'missed', label: `Missed (${dateFilteredJobs.filter(j => j.status === 'Missed' || j.status === 'Rescheduled').length})` }
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveFilter(tab.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-colors cursor-pointer ${
                          activeFilter === tab.id
                            ? 'bg-cyan-600 text-white font-bold shadow-md shadow-cyan-600/30'
                            : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {myAssignedJobs.length === 0 && (
                    <button
                      onClick={() => setShowAllCityVisits(!showAllCityVisits)}
                      className="text-xs text-cyan-600 hover:text-cyan-700 font-semibold cursor-pointer underline flex items-center gap-1 self-start sm:self-auto"
                    >
                      <span>{showAllCityVisits ? 'Showing All City Visits' : 'View All City Morning Visits'}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* If no jobs are currently assigned */}
              {myAssignedJobs.length === 0 && (
                <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center space-y-2 shadow-xs">
                  <Clock className="w-10 h-10 text-cyan-600 mx-auto mb-1 opacity-70" />
                  <h3 className="font-bold text-base text-slate-900">
                    No Morning Visits Assigned
                  </h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    No doorstep cleaning visits are assigned to your shift for today. CleanZX Operations Admin will assign your apartment run during dispatch.
                  </p>
                </div>
              )}

              {/* Job Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredJobs.length === 0 ? (
                  <div className="col-span-full bg-white border border-slate-200 rounded-3xl p-8 text-center shadow-xs">
                    <CheckCircle2 className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm font-bold text-slate-900">No visits in this category</p>
                    <p className="text-xs text-slate-500 mt-1">
                      Switch filter to "All Assigned" or "All Status" to see your full schedule.
                    </p>
                  </div>
                ) : (
                  filteredJobs.map((job) => {
                    const isDone = job.status === 'Completed';
                    const isInProgress = job.status === 'In Progress';
                    const isMissed = job.status === 'Missed';
                    const isRescheduled = job.status === 'Rescheduled';

                    return (
                      <div
                        key={job.id}
                        className={`bg-white border rounded-3xl p-5 transition-all shadow-xs flex flex-col justify-between ${
                          isInProgress
                            ? 'border-cyan-500 ring-2 ring-cyan-500/20 bg-cyan-50/20'
                            : isDone
                            ? 'border-emerald-300 bg-white opacity-95'
                            : isMissed
                            ? 'border-rose-300 bg-rose-50/30'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div>
                          {/* Top Slot & Status Header */}
                          <div className="flex items-center justify-between gap-2 mb-3">
                            <div className="flex items-center gap-2 flex-wrap">
                              <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                                <Clock className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                                <span className="font-mono">{job.timeSlot}</span>
                              </div>
                              {job.date && (
                                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold font-mono ${
                                  job.date === todayStr
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : job.date === tomorrowStr
                                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                    : 'bg-slate-100 text-slate-700 border border-slate-200'
                                }`}>
                                  {job.date === todayStr ? 'Today' : (job.date === tomorrowStr ? `Tomorrow (${job.date})` : job.date)}
                                </span>
                              )}
                              {job.source === 'booking' && (
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                                  Booking
                                </span>
                              )}
                            </div>

                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                                isDone
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : isInProgress
                                  ? 'bg-cyan-50 text-cyan-700 border border-cyan-200 animate-pulse'
                                  : isMissed
                                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                  : isRescheduled
                                  ? 'bg-purple-50 text-purple-700 border border-purple-200'
                                  : 'bg-amber-50 text-amber-700 border border-amber-200'
                              }`}
                            >
                              {job.status}
                            </span>
                          </div>

                          {/* Customer Name & Location */}
                          <div className="space-y-1 mb-3">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="text-base font-black text-slate-900">
                                  {job.customerName}
                                </h3>
                                <div className="flex items-center gap-1 text-xs text-slate-600 mt-0.5">
                                  <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                  <span className="font-semibold text-slate-900">{job.apartment}</span>
                                  <span className="text-slate-400">•</span>
                                  <span>{job.block ? `${job.block}, ` : ''}Flat {job.flat}</span>
                                </div>
                              </div>

                              {/* 1-Click Call & WhatsApp Buttons */}
                              <div className="flex items-center gap-1.5 shrink-0">
                                <a
                                  href={`tel:${job.phone}`}
                                  className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-cyan-700 border border-slate-200 flex items-center justify-center transition-colors cursor-pointer"
                                  title="Call Customer"
                                >
                                  <Phone className="w-3.5 h-3.5" />
                                </a>
                                <a
                                  href={`https://wa.me/91${job.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                                    `Hello ${job.customerName},\nThis is ${employeeUser?.name || 'your CleanZX specialist'}. I am at ${job.apartment} for your scheduled doorstep car care (${job.timeSlot}).`
                                  )}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="w-8 h-8 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center justify-center transition-colors"
                                  title="WhatsApp Customer"
                                >
                                  <MessageSquare className="w-3.5 h-3.5" />
                                </a>
                              </div>
                            </div>
                          </div>

                          {/* Vehicle Details Card */}
                          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1 text-xs">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5 text-slate-900 font-bold">
                                <Car className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                                <span>{job.carModel}</span>
                              </div>
                              <span className="font-mono text-[11px] font-bold text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded-md border border-cyan-200">
                                {job.regNumber}
                              </span>
                            </div>

                            <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500 border-t border-slate-200">
                              <span>Plan: <strong className="text-slate-700">{job.planName}</strong></span>
                              <span className="text-[10px] text-slate-400 font-mono">ID: {job.id}</span>
                            </div>

                            {job.notes && (
                              <div className="pt-1.5 text-[11px] text-amber-700 flex items-start gap-1">
                                <FileText className="w-3 h-3 text-amber-500 shrink-0 mt-0.5" />
                                <span>{job.notes}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Interactive Status Update Actions */}
                        <div className="mt-4 pt-3 border-t border-slate-200 flex items-center gap-2">
                          {!isDone && (
                            <>
                              {!isInProgress && (
                                <button
                                  type="button"
                                  onClick={() => handleQuickStatusChange(job.id, 'In Progress')}
                                  className="flex-1 py-2 px-3 bg-cyan-50 hover:bg-cyan-100 text-cyan-700 border border-cyan-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                                >
                                  <Play className="w-3.5 h-3.5 fill-cyan-600 text-cyan-600" />
                                  <span>Start Job</span>
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={() => handleOpenUpdateModal(job, 'Completed')}
                                className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-emerald-600/25 cursor-pointer"
                              >
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                                <span>Mark Done</span>
                              </button>
                            </>
                          )}

                          <button
                            type="button"
                            onClick={() => handleOpenUpdateModal(job, job.status)}
                            className={`py-2 px-3 text-xs font-semibold rounded-xl border border-slate-200 transition-colors cursor-pointer flex items-center justify-center gap-1 ${
                              isDone ? 'w-full bg-slate-100 text-slate-700 hover:bg-slate-200' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            <span>Update Status</span>
                            <ChevronDown className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* TAB 2: VISIT HISTORY & LOGS */}
          {activeTab === 'history' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
                <h3 className="font-bold text-base text-slate-900">Completed Visit Records</h3>
                <p className="text-xs text-slate-500 mt-1">
                  History of car cleaning jobs completed during your morning shift cycles.
                </p>
              </div>

              <div className="space-y-3">
                {completedJobs === 0 ? (
                  <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center text-slate-500 text-xs shadow-sm">
                    No visits marked completed yet today.
                  </div>
                ) : (
                  myAssignedJobs.filter(j => j.status === 'Completed').map(job => (
                    <div key={job.id} className="p-4 bg-white border border-emerald-200 rounded-2xl flex items-center justify-between gap-3 shadow-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 text-xs block">{job.customerName} • {job.carModel}</span>
                          <span className="text-[11px] text-slate-500 block">{job.apartment} (Flat {job.flat}) • {job.regNumber}</span>
                          {job.notes && <p className="text-[10px] text-emerald-700 mt-0.5">Notes: {job.notes}</p>}
                        </div>
                      </div>
                      <span className="font-mono text-xs text-slate-700 shrink-0 font-bold bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                        {job.timeSlot}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 3: ASSIGNED COMMUNITIES */}
          {activeTab === 'communities' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-white border border-slate-200 rounded-3xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
                <div>
                  <h3 className="font-bold text-base text-slate-900">Assigned Apartment Communities</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Gated residential communities where CleanZX doorstep service is scheduled.
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-50 border border-cyan-200 rounded-xl text-xs font-bold text-cyan-800 self-start sm:self-auto">
                  <Building className="w-3.5 h-3.5 text-cyan-600" />
                  <span>{myAssignedJobs.length} Assigned Customer(s)</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { name: 'Prestige High Fields', zone: 'Mehdipatnam & Tolichowki', flats: '14 Active Subscribers', window: '6:30 AM - 8:30 AM' },
                  { name: 'Skyline Towers', zone: 'Mehdipatnam & Tolichowki', flats: '9 Active Subscribers', window: '8:00 AM - 10:00 AM' },
                  { name: 'Aparna Sarovar', zone: 'Gachibowli & Kondapur', flats: '18 Active Subscribers', window: '6:00 AM - 8:00 AM' },
                  { name: 'Rainbow Vistas', zone: 'Madhapur & Hitec City', flats: '12 Active Subscribers', window: '8:30 AM - 10:30 AM' }
                ].map((com, idx) => {
                  const communityJobs = myAssignedJobs.filter(j =>
                    (j.apartment || '').toLowerCase().trim().includes(com.name.toLowerCase().trim()) ||
                    com.name.toLowerCase().trim().includes((j.apartment || '').toLowerCase().trim())
                  );

                  return (
                    <div key={idx} className="p-4 bg-white border border-slate-200 rounded-2xl space-y-3 transition-all hover:border-slate-300 shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 text-sm">{com.name}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          communityJobs.length > 0
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-cyan-50 text-cyan-700 border-cyan-200'
                        }`}>
                          {communityJobs.length > 0 ? `${communityJobs.length} Assigned to You` : 'Active Zone'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{com.zone}</span>
                      </p>
                      <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-600 flex justify-between">
                        <span>{communityJobs.length > 0 ? `${communityJobs.length} Assigned Customer(s)` : com.flats}</span>
                        <span className="text-cyan-700 font-mono font-bold">{com.window}</span>
                      </div>

                      {/* Display assigned customer cards in this community */}
                      {communityJobs.length > 0 && (
                        <div className="pt-2.5 border-t border-slate-100 space-y-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-700 block">
                            Your Assigned Customers:
                          </span>
                          {communityJobs.map(custJob => (
                            <div
                              key={custJob.id}
                              className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col gap-2"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <span className="font-bold text-xs text-slate-900 block">{custJob.customerName}</span>
                                  <span className="text-[10px] text-slate-500 block">
                                    {custJob.block ? `${custJob.block}, ` : ''}{custJob.flat ? `Flat ${custJob.flat}` : ''}
                                  </span>
                                </div>
                                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-cyan-50 text-cyan-800 border border-cyan-200">
                                  {custJob.status}
                                </span>
                              </div>

                              <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1 border-t border-slate-200">
                                <span className="flex items-center gap-1 font-semibold text-slate-900">
                                  <Car className="w-3 h-3 text-cyan-600" />
                                  <span>{custJob.carModel}</span>
                                  <span className="font-mono text-[10px] text-cyan-700">({custJob.regNumber})</span>
                                </span>
                                <span className="font-mono text-[10px] text-amber-700 font-bold">
                                  {custJob.date} • {custJob.timeSlot}
                                </span>
                              </div>

                              <div className="flex items-center justify-between gap-2 pt-1">
                                <div className="flex items-center gap-1.5">
                                  {custJob.phone && (
                                    <>
                                      <a
                                        href={`tel:${custJob.phone}`}
                                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-cyan-700 text-xs flex items-center justify-center transition-colors border border-slate-200"
                                        title="Call Customer"
                                      >
                                        <Phone className="w-3 h-3" />
                                      </a>
                                      <a
                                        href={`https://wa.me/91${custJob.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                                          `Hello ${custJob.customerName},\nThis is ${employeeUser?.name || 'your CleanZX specialist'}. I am at ${custJob.apartment} for your scheduled doorstep car care (${custJob.timeSlot}).`
                                        )}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs flex items-center justify-center transition-colors border border-emerald-200"
                                        title="WhatsApp Customer"
                                      >
                                        <MessageSquare className="w-3 h-3" />
                                      </a>
                                    </>
                                  )}
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setActiveTab('runs')}
                                  className="px-2.5 py-1 bg-cyan-50 hover:bg-cyan-100 text-cyan-700 text-[10px] font-bold rounded-lg border border-cyan-200 transition-colors cursor-pointer"
                                >
                                  Open in Run Schedule
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: MY RATING & PERFORMANCE */}
          {activeTab === 'performance' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-cyan-100 text-cyan-800 border border-cyan-200 font-black text-2xl flex items-center justify-center">
                    {employeeUser?.name?.charAt(0) || 'S'}
                  </div>
                  <div>
                    <h3 className="font-black text-xl text-slate-900">{employeeUser?.name || 'Staff Member'}</h3>
                    <p className="text-xs text-cyan-700 font-medium">{employeeUser?.role || 'Doorstep Cleaning Specialist'}</p>
                    <div className="flex items-center gap-1 text-sm text-amber-500 font-bold mt-1">
                      <Star className="w-4 h-4 fill-amber-400" />
                      <span>{employeeUser?.rating || '5.0'} / 5.0 Overall Customer Rating</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-3 text-center pt-4 border-t border-slate-100">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Jobs Completed</span>
                    <span className="text-lg font-black text-slate-900">{employeeUser?.jobsCompleted || 0 + completedJobs}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">On-Time Score</span>
                    <span className="text-lg font-black text-emerald-600">99.4%</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Shift Status</span>
                    <span className="text-lg font-black text-cyan-700">Active</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SUPERVISOR WHATSAPP & SUPPORT */}
          {activeTab === 'support' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-white border border-slate-200 rounded-3xl p-6 text-center space-y-3 shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900">Operations Support & Supervisor Help</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                    Encountered gated security issue, customer absence, or need equipment refill? Contact CleanZX Admin directly.
                  </p>
                </div>
                <div className="pt-2">
                  <a
                    href={`https://wa.me/919949666993?text=${encodeURIComponent(
                      `Hello Operations Lead, this is ${employeeUser?.name} (${employeeUser?.zone || 'Specialist'}). I need assistance regarding morning doorstep services.`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Open WhatsApp with Operations Supervisor</span>
                  </a>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* UPDATE STATUS MODAL / SHEET */}
      {updatingJob && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white border border-slate-200 w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Update Service Visit
                </h3>
                <p className="text-[11px] text-slate-500">
                  {updatingJob.customerName} • {updatingJob.carModel} ({updatingJob.regNumber})
                </p>
              </div>
              <button
                onClick={() => setUpdatingJob(null)}
                className="w-8 h-8 rounded-lg bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveStatus} className="p-4 space-y-4 overflow-y-auto text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-2">
                  Select Service Status
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'Completed', label: 'Completed', color: 'border-emerald-500 bg-emerald-50 text-emerald-700' },
                    { id: 'In Progress', label: 'In Progress', color: 'border-cyan-500 bg-cyan-50 text-cyan-700' },
                    { id: 'Assigned', label: 'Assigned', color: 'border-amber-500 bg-amber-50 text-amber-700' },
                    { id: 'Missed', label: 'Missed Visit', color: 'border-rose-500 bg-rose-50 text-rose-700' },
                    { id: 'Rescheduled', label: 'Rescheduled', color: 'border-purple-500 bg-purple-50 text-purple-700' }
                  ].map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setUpdateForm({ ...updateForm, status: item.id })}
                      className={`p-3 rounded-2xl border text-xs font-bold transition-all text-left flex items-center justify-between cursor-pointer ${
                        updateForm.status === item.id
                          ? `${item.color} ring-2 ring-cyan-500/40`
                          : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <span>{item.label}</span>
                      {updateForm.status === item.id && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* If Missed: Prompt for Specific Reason */}
              {updateForm.status === 'Missed' && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl space-y-2 animate-fadeIn">
                  <label className="block font-bold text-rose-700 text-xs">
                    Reason for Missed Visit (Required)
                  </label>
                  <select
                    value={updateForm.reason}
                    onChange={(e) => setUpdateForm({ ...updateForm, reason: e.target.value })}
                    className="w-full p-2.5 bg-white border border-rose-300 rounded-xl text-slate-900 text-xs focus:outline-none"
                  >
                    <option value="Vehicle not parked in designated bay">Vehicle not parked in designated bay</option>
                    <option value="Gate security denied apartment entry">Gate security denied apartment entry</option>
                    <option value="Customer requested to skip today">Customer requested to skip today</option>
                    <option value="Owner traveling / Car out of station">Owner traveling / Car out of station</option>
                    <option value="Heavy rain / Parking floor flooded">Heavy rain / Parking floor flooded</option>
                    <option value="Other special circumstance">Other reason (explain below)</option>
                  </select>
                </div>
              )}

              {/* Remarks / Service Notes */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Service Notes / Remarks
                </label>
                <textarea
                  rows={3}
                  value={updateForm.notes}
                  onChange={(e) => setUpdateForm({ ...updateForm, notes: e.target.value })}
                  placeholder={
                    updateForm.status === 'Completed'
                      ? 'e.g. Exterior wash done, windshield cleaned, tyre polish applied.'
                      : updateForm.status === 'Missed'
                      ? 'e.g. Checked bay B2-114 twice between 7:15 and 7:45 AM, car absent.'
                      : 'Add any notes for operations admin...'
                  }
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-xs focus:ring-2 focus:ring-cyan-500 focus:bg-white focus:outline-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setUpdatingJob(null)}
                  className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl transition-colors border border-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-2xl transition-colors shadow-lg shadow-cyan-600/30 cursor-pointer"
                >
                  Save Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
