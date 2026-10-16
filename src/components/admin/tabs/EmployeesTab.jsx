import React, { useState } from 'react';
import {
  UserCheck,
  Plus,
  Search,
  Edit2,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Star,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  X,
  MessageSquare,
  Key,
  Eye,
  EyeOff,
  Copy,
  Check,
  Shield,
  Smartphone
} from 'lucide-react';
import { useAdminData } from '../../../context/AdminDataContext';

export default function EmployeesTab() {
  const {
    employees,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    updateEmployeeCredentials,
    toggleEmployeeStatus,
    dailySchedules
  } = useAdminData();

  const [searchTerm, setSearchTerm] = useState('');
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [isNewEmployee, setIsNewEmployee] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [revealedPasswords, setRevealedPasswords] = useState({});
  const [copiedId, setCopiedId] = useState(null);
  const [managingCredsEmp, setManagingCredsEmp] = useState(null);
  const [credsForm, setCredsForm] = useState({ username: '', password: '', canLogin: true });

  const togglePasswordReveal = (id) => {
    setRevealedPasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const copyCredentials = (emp) => {
    const credText = `CleanZX Employee Portal\nURL: ${window.location.origin}/employee\nUsername: ${emp.username || emp.email}\nPassword: ${emp.password || 'cleanzx@2026'}`;
    navigator.clipboard?.writeText(credText);
    setCopiedId(emp.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleOpenCredsModal = (emp) => {
    setManagingCredsEmp(emp);
    setCredsForm({
      username: emp.username || emp.email || emp.phone,
      password: emp.password || 'cleanzx@2026',
      canLogin: emp.canLogin !== false
    });
  };

  const handleSaveCreds = (e) => {
    e.preventDefault();
    if (!managingCredsEmp) return;
    updateEmployeeCredentials(managingCredsEmp.id, credsForm);
    setManagingCredsEmp(null);
  };

  const filteredEmployees = employees.filter(e => {
    const q = searchTerm.toLowerCase();
    return (
      (e.name || '').toLowerCase().includes(q) ||
      (e.phone || '').includes(q) ||
      (e.role || '').toLowerCase().includes(q) ||
      (e.zone || '').toLowerCase().includes(q)
    );
  });

  const handleSaveEmployee = (e) => {
    e.preventDefault();
    if (!editingEmployee.name || !editingEmployee.phone) {
      alert('Please fill employee name and phone number.');
      return;
    }

    if (isNewEmployee) {
      createEmployee(editingEmployee);
    } else {
      updateEmployee(editingEmployee.id, editingEmployee);
    }
    setEditingEmployee(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Employee & Technician Management
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Create accounts, activate/deactivate, assign residential apartment zones, and monitor morning cleaning workloads.
          </p>
        </div>

        <button
          onClick={() => {
            setIsNewEmployee(true);
            setEditingEmployee({
              name: '',
              phone: '',
              email: '',
              role: 'Doorstep Cleaning Specialist',
              zone: 'Mehdipatnam & Tolichowki',
              assignedApartments: ['Prestige High Fields'],
              status: 'Active',
              rating: 5.0
            });
          }}
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm shadow-cyan-600/30"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Specialist</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search employees by name, role, phone, or assigned apartment zone..."
            className="w-full pl-10 pr-4 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Employee Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredEmployees.map(emp => {
          // Schedules currently assigned to this employee
          const activeJobs = dailySchedules.filter(s => s.employeeName === emp.name && s.status !== 'Completed').length;
          const completedJobs = dailySchedules.filter(s => s.employeeName === emp.name && s.status === 'Completed').length;

          return (
            <div
              key={emp.id}
              className={`bg-white rounded-3xl border p-5 shadow-xs transition-all flex flex-col justify-between ${
                emp.status === 'Active'
                  ? 'border-slate-200 hover:border-cyan-400'
                  : 'border-slate-300 bg-slate-50 opacity-60'
              }`}
            >
              <div>
                {/* Status & ID */}
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-[10px] font-bold text-slate-400">{emp.id}</span>
                  <button
                    onClick={() => toggleEmployeeStatus(emp.id)}
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold cursor-pointer ${
                      emp.status === 'Active'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {emp.status}
                  </button>
                </div>

                {/* Profile Header */}
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-600 to-indigo-600 text-white font-black text-base flex items-center justify-center shrink-0">
                    {emp.name?.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{emp.name}</h3>
                    <p className="text-xs text-cyan-600 font-medium">{emp.role}</p>
                    <div className="flex items-center gap-1 text-[11px] text-amber-600 font-bold mt-0.5">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{emp.rating} Rating</span>
                    </div>
                  </div>
                </div>

                {/* Contact & Zone Info */}
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-mono">{emp.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{emp.email || `${emp.name.toLowerCase().replace(/\s+/g, '.')}@cleanzx.com`}</span>
                  </div>
                  <div className="flex items-start gap-2 pt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-800">{emp.zone}</span>
                      <p className="text-[11px] text-slate-500">
                        {(emp.assignedApartments || []).join(', ')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Activity & Workload Metrics */}
                <div className="mt-4 grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 block uppercase">Active Morning Jobs</span>
                    <span className="font-bold text-cyan-700 text-sm">{activeJobs} assigned</span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 block uppercase">Total Completed</span>
                    <span className="font-bold text-emerald-700 text-sm">{(emp.jobsCompleted || 0) + completedJobs}</span>
                  </div>
                </div>

                {/* Employee Login Credentials Box (Managed by Admin) */}
                <div className="mt-4 p-3.5 bg-slate-900 rounded-2xl text-slate-200 text-xs border border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 font-bold text-cyan-400 text-[11px] uppercase tracking-wider">
                      <Key className="w-3.5 h-3.5 text-cyan-400" />
                      Portal Login Access
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      emp.canLogin !== false ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}>
                      {emp.canLogin !== false ? 'Access Active' : 'Access Disabled'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                    <div className="bg-slate-800/80 p-2 rounded-xl border border-slate-700/60 truncate">
                      <span className="text-[9px] text-slate-400 block uppercase font-sans">Username</span>
                      <span className="text-white font-semibold truncate block">{emp.username || emp.email || emp.phone}</span>
                    </div>

                    <div className="bg-slate-800/80 p-2 rounded-xl border border-slate-700/60 flex items-center justify-between">
                      <div className="truncate">
                        <span className="text-[9px] text-slate-400 block uppercase font-sans">Password</span>
                        <span className="text-white font-semibold block">
                          {revealedPasswords[emp.id] ? (emp.password || 'cleanzx@2026') : '••••••••'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => togglePasswordReveal(emp.id)}
                        className="text-slate-400 hover:text-white p-1 ml-1"
                        title={revealedPasswords[emp.id] ? "Hide Password" : "Show Password"}
                      >
                        {revealedPasswords[emp.id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 pt-1">
                    <button
                      type="button"
                      onClick={() => copyCredentials(emp)}
                      className="flex-1 py-1.5 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    >
                      {copiedId === emp.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedId === emp.id ? 'Copied!' : 'Copy Login'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenCredsModal(emp)}
                      className="flex-1 py-1.5 px-2 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 hover:text-cyan-200 border border-cyan-800/50 text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    >
                      <Key className="w-3 h-3" />
                      <span>Set Password</span>
                    </button>

                    <a
                      href={`https://wa.me/91${emp.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                        `Hello ${emp.name},\nHere are your CleanZX Employee Portal login details:\n\n📱 Login URL: ${window.location.origin}/employee\n👤 Username: ${emp.username || emp.email || emp.phone}\n🔑 Password: ${emp.password || 'cleanzx@2026'}\n⏰ Morning Service Window: 6:00 AM - 11:30 AM\n\nPlease login to view your assigned daily morning car visits.`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="py-1.5 px-2.5 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors"
                      title="Send credentials to employee via WhatsApp"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <a
                  href={`https://wa.me/91${emp.phone.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(emp.name)},%20CLEANZX%20Operations%20update.`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">WhatsApp Chat</span>
                </a>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      setIsNewEmployee(false);
                      setEditingEmployee({ ...emp });
                    }}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-cyan-600 hover:bg-slate-100 rounded-xl flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => setEmployeeToDelete(emp)}
                    className="px-3 py-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl flex items-center gap-1 transition-colors cursor-pointer"
                    title={`Delete ${emp.name}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ADMIN MANAGE CREDENTIALS MODAL */}
      {managingCredsEmp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-cyan-400" />
                <h3 className="font-bold text-base">Manage Specialist Login</h3>
              </div>
              <button
                onClick={() => setManagingCredsEmp(null)}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCreds} className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-cyan-50 border border-cyan-200 rounded-2xl flex items-start gap-2.5">
                <Smartphone className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-cyan-900 block">{managingCredsEmp.name}</span>
                  <p className="text-[11px] text-cyan-700">
                    Provides mobile access to the CleanZX Employee Dashboard (/employee) for morning doorstep visits.
                  </p>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Username / Mobile ID</label>
                <input
                  type="text"
                  required
                  value={credsForm.username}
                  onChange={(e) => setCredsForm({ ...credsForm, username: e.target.value })}
                  placeholder="e.g. ramesh@cleanzx.com or 9848012345"
                  className="w-full p-2.5 border border-slate-300 rounded-xl font-mono text-xs focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={credsForm.password}
                    onChange={(e) => setCredsForm({ ...credsForm, password: e.target.value })}
                    placeholder="Enter password"
                    className="w-full p-2.5 border border-slate-300 rounded-xl font-mono text-xs focus:ring-2 focus:ring-cyan-500 focus:outline-none pr-24"
                  />
                  <button
                    type="button"
                    onClick={() => setCredsForm({ ...credsForm, password: `clean@${Math.floor(1000 + Math.random() * 9000)}` })}
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 text-[10px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg cursor-pointer"
                  >
                    Generate
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="canLoginToggle"
                  checked={credsForm.canLogin}
                  onChange={(e) => setCredsForm({ ...credsForm, canLogin: e.target.checked })}
                  className="rounded text-cyan-600 cursor-pointer"
                />
                <label htmlFor="canLoginToggle" className="font-semibold text-slate-700 cursor-pointer">
                  Authorize Portal Login for this Specialist
                </label>
              </div>

              <div className="bg-slate-50 px-6 py-3 -mx-6 -mb-6 mt-5 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setManagingCredsEmp(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-semibold shadow-md cursor-pointer"
                >
                  Save Credentials
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE / EDIT EMPLOYEE MODAL */}
      {editingEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-base">{isNewEmployee ? 'Create Specialist Account' : 'Edit Employee Details'}</h3>
              <button
                onClick={() => setEditingEmployee(null)}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEmployee} className="p-6 space-y-3 text-xs max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={editingEmployee.name}
                    onChange={(e) => setEditingEmployee({ ...editingEmployee, name: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mobile Phone Number</label>
                  <input
                    type="text"
                    required
                    value={editingEmployee.phone}
                    onChange={(e) => setEditingEmployee({ ...editingEmployee, phone: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={editingEmployee.email}
                    onChange={(e) => setEditingEmployee({ ...editingEmployee, email: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Role / Designation</label>
                  <input
                    type="text"
                    value={editingEmployee.role}
                    onChange={(e) => setEditingEmployee({ ...editingEmployee, role: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              {/* Portal Login Credentials Section */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2.5">
                <div className="flex items-center gap-1.5 text-slate-800 font-bold">
                  <Key className="w-3.5 h-3.5 text-cyan-600" />
                  <span>Portal Login Credentials</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Login Username</label>
                    <input
                      type="text"
                      value={editingEmployee.username || ''}
                      onChange={(e) => setEditingEmployee({ ...editingEmployee, username: e.target.value })}
                      placeholder="e.g. employee@cleanzx.com"
                      className="w-full p-2 bg-white border border-slate-300 rounded-xl font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Login Password</label>
                    <input
                      type="text"
                      value={editingEmployee.password || ''}
                      onChange={(e) => setEditingEmployee({ ...editingEmployee, password: e.target.value })}
                      placeholder="e.g. cleanzx@2026"
                      className="w-full p-2 bg-white border border-slate-300 rounded-xl font-mono text-xs"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="editEmpCanLogin"
                    checked={editingEmployee.canLogin !== false}
                    onChange={(e) => setEditingEmployee({ ...editingEmployee, canLogin: e.target.checked })}
                    className="rounded text-cyan-600 cursor-pointer"
                  />
                  <label htmlFor="editEmpCanLogin" className="text-[11px] font-semibold text-slate-700 cursor-pointer">
                    Enable Mobile Dashboard Login Access
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Service Zone</label>
                <input
                  type="text"
                  value={editingEmployee.zone}
                  onChange={(e) => setEditingEmployee({ ...editingEmployee, zone: e.target.value })}
                  placeholder="e.g. Mehdipatnam & Tolichowki"
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assigned Apartments (Comma separated)</label>
                <input
                  type="text"
                  value={(editingEmployee.assignedApartments || []).join(', ')}
                  onChange={(e) => setEditingEmployee({
                    ...editingEmployee,
                    assignedApartments: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                  })}
                  placeholder="e.g. Prestige High Fields, Skyline Towers"
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="empStatus"
                  checked={editingEmployee.status === 'Active'}
                  onChange={(e) => setEditingEmployee({
                    ...editingEmployee,
                    status: e.target.checked ? 'Active' : 'On Leave'
                  })}
                  className="rounded text-cyan-600 cursor-pointer"
                />
                <label htmlFor="empStatus" className="font-semibold text-slate-700 cursor-pointer">
                  Active for Morning Shift Duty
                </label>
              </div>

              <div className="bg-slate-50 px-6 py-3 -mx-6 -mb-6 mt-4 border-t border-slate-200 flex items-center justify-between">
                {!isNewEmployee ? (
                  <button
                    type="button"
                    onClick={() => {
                      const emp = editingEmployee;
                      setEditingEmployee(null);
                      setEmployeeToDelete(emp);
                    }}
                    className="px-3 py-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-100/70 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Specialist</span>
                  </button>
                ) : <div />}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingEmployee(null)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-semibold shadow-md cursor-pointer"
                  >
                    Save Specialist
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE EMPLOYEE CONFIRMATION MODAL */}
      {employeeToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-rose-600 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trash2 className="w-5 h-5" />
                <h3 className="font-bold text-base">Delete Specialist</h3>
              </div>
              <button
                onClick={() => setEmployeeToDelete(null)}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-3">
              <p className="text-sm text-slate-700">
                Are you sure you want to permanently delete specialist{' '}
                <strong className="text-slate-900">{employeeToDelete.name}</strong>?
              </p>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-600 space-y-1">
                <p><strong>Role:</strong> {employeeToDelete.role || 'Cleaning Specialist'}</p>
                <p><strong>Mobile:</strong> {employeeToDelete.phone}</p>
                <p><strong>Username:</strong> {employeeToDelete.username || employeeToDelete.email || employeeToDelete.phone}</p>
                <p><strong>Service Zone:</strong> {employeeToDelete.zone || 'Not assigned'}</p>
              </div>
              <p className="text-xs text-rose-600 font-medium">
                This will immediately remove their employee profile and disable their portal login access.
              </p>
            </div>

            <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEmployeeToDelete(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteEmployee(employeeToDelete.id);
                  setEmployeeToDelete(null);
                }}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-rose-600/30 flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Yes, Delete Specialist</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
