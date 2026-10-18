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
  Smartphone,
  Car,
  Camera,
  Sparkles,
  Clock,
  ExternalLink
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
    dailySchedules,
    assignCarsToEmployee,
    assignTenCarsToEmployee,
    carAssignments,
    fetchCarAssignments
  } = useAdminData();

  const [searchTerm, setSearchTerm] = useState('');
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [isNewEmployee, setIsNewEmployee] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [revealedPasswords, setRevealedPasswords] = useState({});
  const [copiedId, setCopiedId] = useState(null);
  const [managingCredsEmp, setManagingCredsEmp] = useState(null);
  const [credsForm, setCredsForm] = useState({ username: '', password: '', canLogin: true });

  // Flexible Car Assignment Modal State
  const [isAssignCarsModalOpen, setIsAssignCarsModalOpen] = useState(false);
  const [assignFormEmpId, setAssignFormEmpId] = useState('');
  const [assignFormDate, setAssignFormDate] = useState(new Date().toISOString().slice(0, 10));
  const [assignCarsList, setAssignCarsList] = useState([]);
  const [assignSubmitting, setAssignSubmitting] = useState(false);

  // Daily Updates & Photos Modal State
  const [viewingUpdatesEmp, setViewingUpdatesEmp] = useState(null);
  const [updatesFilter, setUpdatesFilter] = useState('all'); // 'all' | 'completed' | 'pending'
  const [inspectedPhoto, setInspectedPhoto] = useState(null); // { url, title, time, type }

  const APARTMENT_CAR_POOL = [
    { carModel: "Hyundai Creta SX(O)", regNumber: "TS09FA4821", customerName: "Vikram Reddy", phone: "9848022331", apartment: "Prestige High Fields", block: "Tower 2", flat: "405", parkingBay: "B1-405", timeSlot: "06:00 AM - 06:30 AM", planName: "Monthly Premium Plan" },
    { carModel: "Kia Seltos GTX+", regNumber: "TS07HX9912", customerName: "Pooja Sharma", phone: "9876543210", apartment: "Prestige High Fields", block: "Tower 3", flat: "712", parkingBay: "B1-712", timeSlot: "06:30 AM - 07:00 AM", planName: "Monthly Premium Plan" },
    { carModel: "Hyundai i20 Asta", regNumber: "TS09AB1234", customerName: "Santhosh Kumar", phone: "9642734252", apartment: "Skyline Heights", block: "Tower A", flat: "402", parkingBay: "B2-108", timeSlot: "07:00 AM - 07:30 AM", planName: "Monthly Premium Plan" },
    { carModel: "Tata Nexon Fearless", regNumber: "TS08EJ3344", customerName: "Rajesh Varma", phone: "9123456780", apartment: "Skyline Heights", block: "Tower B", flat: "201", parkingBay: "B2-201", timeSlot: "07:30 AM - 08:00 AM", planName: "Monthly Normal Plan" },
    { carModel: "Honda City ZX", regNumber: "TS09GL5566", customerName: "Ananya Iyer", phone: "9988776655", apartment: "My Home Bhooja", block: "Tower 5", flat: "1104", parkingBay: "B1-504", timeSlot: "08:00 AM - 08:30 AM", planName: "Quarterly Premium Plan" },
    { carModel: "Toyota Fortuner Legender", regNumber: "TS07KP7788", customerName: "Kiran Goud", phone: "9849011223", apartment: "My Home Bhooja", block: "Tower 6", flat: "809", parkingBay: "B1-609", timeSlot: "08:30 AM - 09:00 AM", planName: "Monthly Premium Plan" },
    { carModel: "Mahindra XUV700 AX7L", regNumber: "TS08MN2211", customerName: "Deepak Rao", phone: "9700112233", apartment: "Aparna Sarovar", block: "Block C", flat: "302", parkingBay: "B1-302", timeSlot: "09:00 AM - 09:30 AM", planName: "Monthly Normal Plan" },
    { carModel: "Maruti Swift ZXi+", regNumber: "TS09RQ4455", customerName: "Sneha Patel", phone: "9655443322", apartment: "Rainbow Vistas", block: "Tower 4", flat: "601", parkingBay: "B2-401", timeSlot: "09:30 AM - 10:00 AM", planName: "15-Day Normal Plan" },
    { carModel: "Volkswagen Virtus GT", regNumber: "TS07WT8899", customerName: "Arun Nair", phone: "9822334455", apartment: "Jayabheri Silicon County", block: "Tower 1", flat: "904", parkingBay: "B1-904", timeSlot: "10:00 AM - 10:45 AM", planName: "Monthly Premium Plan" },
    { carModel: "BMW 3 Series Gran Limousine", regNumber: "TS09ZZ1001", customerName: "Dr. Suresh Chandra", phone: "9848099887", apartment: "Lodha Bellezza", block: "Tower Eden", flat: "502", parkingBay: "B2-502", timeSlot: "10:45 AM - 11:30 AM", planName: "Half-Yearly Premium Plan" },
    { carModel: "Skoda Kushaq Style", regNumber: "TS07FA6622", customerName: "Ramesh Naidu", phone: "9848033445", apartment: "My Home Mangala", block: "Block A", flat: "802", parkingBay: "B1-802", timeSlot: "11:30 AM - 12:00 PM", planName: "Monthly Premium Plan" },
    { carModel: "MG Hector Plus", regNumber: "TS09PL7733", customerName: "Divya Krishna", phone: "9848044556", apartment: "Aparna Zenon", block: "Tower 1", flat: "1203", parkingBay: "B2-1203", timeSlot: "12:00 PM - 12:30 PM", planName: "Monthly Normal Plan" }
  ];

  const handleOpenAssignCarsModal = (emp = null) => {
    const targetEmp = emp || employees[0];
    const empId = targetEmp ? targetEmp.id : 'EMP-01';
    const targetDate = new Date().toISOString().slice(0, 10);
    setAssignFormEmpId(empId);
    setAssignFormDate(targetDate);

    // If this employee already has assignments for this date, load their real list
    const cleanEmpId = (empId || '').toLowerCase();
    const cleanEmpName = (targetEmp?.name || '').toLowerCase();
    const existing = (carAssignments || []).filter(ca =>
      ((ca.employeeId || '').toLowerCase() === cleanEmpId || (ca.employeeName || '').toLowerCase() === cleanEmpName) &&
      (!ca.date || ca.date === targetDate)
    );

    if (existing.length > 0) {
      setAssignCarsList(existing.map((c, i) => ({ ...c, carNumber: i + 1 })));
    } else {
      // Default to 5 cars which user can freely add/remove or customize count
      setAssignCarsList(APARTMENT_CAR_POOL.slice(0, 5).map((c, i) => ({
        ...c,
        carNumber: i + 1,
        status: 'Pending',
        beforePhoto: null,
        afterPhoto: null
      })));
    }
    setIsAssignCarsModalOpen(true);
  };

  const handleSetCarCount = (count) => {
    const targetCount = Math.max(1, Math.min(20, count));
    if (targetCount <= APARTMENT_CAR_POOL.length) {
      setAssignCarsList(APARTMENT_CAR_POOL.slice(0, targetCount).map((c, i) => ({
        ...c,
        carNumber: i + 1,
        status: 'Pending',
        beforePhoto: null,
        afterPhoto: null
      })));
    } else {
      const list = [...assignCarsList];
      while (list.length < targetCount) {
        const idx = list.length;
        list.push({
          carNumber: idx + 1,
          carModel: "Sedan / SUV",
          regNumber: `TS09NEW${idx + 1}`,
          customerName: `Customer ${idx + 1}`,
          phone: "9848011223",
          apartment: "Residential Tower",
          block: `Block ${String.fromCharCode(65 + (idx % 4))}`,
          flat: `${(idx + 1) * 101}`,
          parkingBay: `B1-${(idx + 1) * 101}`,
          timeSlot: `${String(6 + Math.floor(idx / 2)).padStart(2, '0')}:${idx % 2 === 0 ? '00' : '30'} AM`,
          planName: "Monthly Premium Plan",
          status: 'Pending',
          beforePhoto: null,
          afterPhoto: null
        });
      }
      setAssignCarsList(list.slice(0, targetCount));
    }
  };

  const handleAddSingleCar = () => {
    const nextIdx = assignCarsList.length;
    const poolCar = APARTMENT_CAR_POOL[nextIdx % APARTMENT_CAR_POOL.length];
    setAssignCarsList(prev => [
      ...prev,
      {
        ...poolCar,
        carNumber: prev.length + 1,
        regNumber: prev.some(c => c.regNumber === poolCar.regNumber) ? `TS09CAR${prev.length + 1}` : poolCar.regNumber,
        status: 'Pending',
        beforePhoto: null,
        afterPhoto: null
      }
    ]);
  };

  const handleRemoveCar = (indexToRemove) => {
    setAssignCarsList(prev =>
      prev.filter((_, i) => i !== indexToRemove).map((c, i) => ({ ...c, carNumber: i + 1 }))
    );
  };

  const handleConfirmAssignCars = async (e) => {
    e.preventDefault();
    if (!assignFormEmpId) {
      alert('Please select an Employee ID.');
      return;
    }
    if (assignCarsList.length === 0) {
      alert('Please add at least 1 car to assign.');
      return;
    }

    setAssignSubmitting(true);
    const targetEmp = employees.find(e => e.id === assignFormEmpId);
    const empName = targetEmp ? targetEmp.name : 'Specialist Staff';

    const assignFn = assignCarsToEmployee || assignTenCarsToEmployee;
    const res = await assignFn(assignFormEmpId, empName, assignCarsList, assignFormDate);
    setAssignSubmitting(false);

    if (res?.success) {
      setIsAssignCarsModalOpen(false);
      alert(`✅ Successfully assigned ${assignCarsList.length} cars to Specialist ${targetEmp?.name || assignFormEmpId} for ${assignFormDate}!`);
    } else {
      alert(`Error: ${res?.message || 'Failed to assign cars'}`);
    }
  };

  // Backward-compat aliases
  const handleOpenAssignTenCarsModal = handleOpenAssignCarsModal;
  const isAssignTenCarsModalOpen = isAssignCarsModalOpen;
  const setIsAssignTenCarsModalOpen = setIsAssignCarsModalOpen;

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
            Assign morning cars per specialist using Employee ID, track Completed/Pending daily status, and inspect before/after cleaning photos.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => handleOpenAssignCarsModal(null)}
            className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-cyan-600/25"
          >
            <Car className="w-4 h-4" />
            <span>Assign Cars (By Employee ID)</span>
          </button>

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
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-200"
          >
            <Plus className="w-4 h-4" />
            <span>Add Specialist</span>
          </button>
        </div>
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

                {/* 10-Car Daily Allocation & Photo Tracking Card */}
                {(() => {
                  const empIdClean = (emp.id || '').toLowerCase();
                  const empNameClean = (emp.name || '').toLowerCase();
                  const todayStr = new Date().toISOString().slice(0, 10);
                  const assignedCars = (carAssignments || []).filter(ca =>
                    ((ca.employeeId || '').toLowerCase() === empIdClean || (ca.employeeName || '').toLowerCase() === empNameClean) &&
                    (!ca.date || ca.date === todayStr)
                  );
                  const total = assignedCars.length || 0;
                  const completed = assignedCars.filter(c => c.status === 'Completed').length;
                  const pending = assignedCars.filter(c => c.status !== 'Completed').length;
                  const photosCount = assignedCars.filter(c => c.beforePhoto?.url || c.afterPhoto?.url).length;
                  const progressPct = total > 0 ? Math.round((completed / total) * 100) : 0;

                  return (
                    <div className="mt-3.5 p-3 bg-cyan-50/50 rounded-2xl border border-cyan-200/80 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-extrabold text-cyan-900 flex items-center gap-1.5 uppercase tracking-wider">
                          <Car className="w-3.5 h-3.5 text-cyan-600" />
                          <span>Daily Car Runs</span>
                        </span>
                        <span className="font-mono text-[10px] font-bold text-cyan-800 bg-white px-2 py-0.5 rounded-full border border-cyan-200">
                          {total > 0 ? `${total} Cars Assigned` : 'No run assigned'}
                        </span>
                      </div>

                      {total > 0 ? (
                        <>
                          <div className="flex items-center justify-between text-xs pt-0.5">
                            <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>{completed} Completed</span>
                            </span>
                            <span className="text-[11px] font-bold text-amber-700 flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-amber-600" />
                              <span>{pending} Pending</span>
                            </span>
                            <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
                              <Camera className="w-3.5 h-3.5 text-slate-500" />
                              <span>{photosCount} Photos</span>
                            </span>
                          </div>

                          <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-cyan-500 to-emerald-500 h-1.5 rounded-full transition-all"
                              style={{ width: `${progressPct}%` }}
                            />
                          </div>
                        </>
                      ) : (
                        <p className="text-[11px] text-slate-500 italic">
                          Click below to assign cars to Employee ID <strong>{emp.id}</strong>.
                        </p>
                      )}

                      <div className="pt-1 flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenAssignCarsModal(emp)}
                          className="flex-1 py-1.5 px-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 shadow-xs cursor-pointer transition-colors"
                        >
                          <Car className="w-3 h-3" />
                          <span>Assign Cars</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setViewingUpdatesEmp(emp)}
                          className="flex-1 py-1.5 px-2 bg-white hover:bg-slate-50 text-cyan-800 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 border border-cyan-200 cursor-pointer transition-colors"
                        >
                          <Camera className="w-3 h-3" />
                          <span>View Photos & Cars</span>
                        </button>
                      </div>
                    </div>
                  );
                })()}

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
      {/* ======================================================== */}
      {/* 1. ASSIGN CARS TO EMPLOYEE (USING EMPLOYEE ID) MODAL     */}
      {/* ======================================================== */}
      {isAssignCarsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col">
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-900 to-slate-800 text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-cyan-600/30 border border-cyan-500/40 text-cyan-300 flex items-center justify-center shrink-0">
                  <Car className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-base sm:text-lg">
                    Assign Cars to Specialist
                  </h3>
                  <p className="text-xs text-slate-300">
                    Allocates doorstep apartment cleaning visits to the technician by Employee ID. Choose any quantity of cars.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAssignCarsModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleConfirmAssignCars} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs">
              {/* Employee ID & Date Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Select Specialist by Employee ID *
                  </label>
                  <select
                    value={assignFormEmpId}
                    onChange={(e) => setAssignFormEmpId(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-semibold text-slate-900 focus:ring-2 focus:ring-cyan-500"
                    required
                  >
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.id}>
                        {emp.id} — {emp.name} ({emp.zone || 'Specialist'})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Morning Service Date *
                  </label>
                  <input
                    type="date"
                    value={assignFormDate}
                    onChange={(e) => setAssignFormDate(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-semibold text-slate-900 focus:ring-2 focus:ring-cyan-500"
                    required
                  />
                </div>
              </div>

              {/* Dynamic Car Quantity Selector Bar */}
              <div className="p-4 bg-cyan-50/70 border border-cyan-200/90 rounded-2xl space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <label className="block font-black text-slate-900 text-xs sm:text-sm">
                      Select How Many Cars to Assign
                    </label>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Type any quantity or use the - and + buttons to adjust
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Stepper Minus */}
                    <button
                      type="button"
                      onClick={() => handleSetCarCount(Math.max(1, assignCarsList.length - 1))}
                      className="w-9 h-9 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-black text-lg flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
                      title="Decrease by 1"
                    >
                      -
                    </button>

                    {/* Direct Number Input with CARS */}
                    <div className="flex items-center bg-white border-2 border-cyan-500 rounded-xl px-3 py-1 shadow-xs">
                      <input
                        type="number"
                        min="1"
                        max="50"
                        value={assignCarsList.length || ''}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10);
                          if (!isNaN(val) && val >= 1) {
                            handleSetCarCount(val);
                          }
                        }}
                        className="w-12 text-center font-mono font-black text-slate-900 text-base focus:outline-none"
                      />
                      <span className="text-xs font-black text-cyan-800 uppercase ml-1 tracking-wider">
                        CARS
                      </span>
                    </div>

                    {/* Stepper Plus */}
                    <button
                      type="button"
                      onClick={() => handleSetCarCount(assignCarsList.length + 1)}
                      className="w-9 h-9 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-black text-lg flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
                      title="Increase by 1"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Cars List Preview & Customizer */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Cars Assigned for this Shift ({assignCarsList.length} cars)</span>
                  </span>
                  <span className="text-[10px] text-slate-500">
                    Click trash icon to remove any unwanted car
                  </span>
                </div>

                <div className="space-y-2 max-h-[290px] overflow-y-auto pr-1">
                  {assignCarsList.map((car, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-white border border-slate-200 rounded-2xl hover:border-cyan-400 transition-colors flex items-center justify-between gap-3 shadow-2xs group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-cyan-50 text-cyan-700 font-mono font-black text-xs flex items-center justify-center shrink-0 border border-cyan-200">
                          #{idx + 1}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-slate-900 text-xs truncate">{car.carModel}</span>
                            <span className="font-mono text-[10px] font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
                              {car.regNumber}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                            {car.apartment} ({car.block || ''} Flat {car.flat}) • Bay: <strong className="text-slate-700">{car.parkingBay}</strong>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right">
                          <span className="font-mono font-bold text-[11px] text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded-md border border-cyan-200 block">
                            {car.timeSlot}
                          </span>
                          <span className="text-[10px] text-slate-400 block mt-0.5">
                            {car.customerName}
                          </span>
                        </div>

                        {assignCarsList.length > 1 && (
                          <button
                            type="button"
                            title="Remove this car"
                            onClick={() => handleRemoveCar(idx)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notice */}
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-2.5 text-xs text-emerald-800">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p>
                  Confirming this will instantly assign all <strong>{assignCarsList.length} cars</strong> to the backend database and update specialist <strong>{assignFormEmpId}</strong>'s schedule. The employee can then upload Before/After photos and mark Completed/Pending status.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAssignCarsModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={assignSubmitting || assignCarsList.length === 0}
                  className="px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl text-xs shadow-md shadow-cyan-600/30 flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Car className="w-3.5 h-3.5" />
                  <span>{assignSubmitting ? 'Assigning...' : `Confirm & Assign ${assignCarsList.length} Cars to ${assignFormEmpId}`}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. VIEW SPECIALIST DAILY UPDATES & PHOTOS MODAL (ADMIN)  */}
      {/* ======================================================== */}
      {viewingUpdatesEmp && (() => {
        const empIdClean = (viewingUpdatesEmp.id || '').toLowerCase();
        const empNameClean = (viewingUpdatesEmp.name || '').toLowerCase();
        const todayStr = new Date().toISOString().slice(0, 10);

        const assignedCars = (carAssignments || []).filter(ca =>
          ((ca.employeeId || '').toLowerCase() === empIdClean || (ca.employeeName || '').toLowerCase() === empNameClean) &&
          (!ca.date || ca.date === todayStr)
        );

        const total = assignedCars.length;
        const completed = assignedCars.filter(c => c.status === 'Completed');
        const pending = assignedCars.filter(c => c.status !== 'Completed');
        const beforeCount = assignedCars.filter(c => c.beforePhoto?.url).length;
        const afterCount = assignedCars.filter(c => c.afterPhoto?.url).length;

        const displayedCars = updatesFilter === 'completed'
          ? completed
          : updatesFilter === 'pending'
          ? pending
          : assignedCars;

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-md animate-fadeIn">
            <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col">
              {/* Header */}
              <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-cyan-600 text-white font-black text-sm flex items-center justify-center shrink-0">
                    {viewingUpdatesEmp.name?.charAt(0) || 'S'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-black text-base sm:text-lg">
                        {viewingUpdatesEmp.name}
                      </h3>
                      <span className="font-mono text-cyan-400 font-bold text-xs bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                        ID: {viewingUpdatesEmp.id}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Zone: {viewingUpdatesEmp.zone || 'Hyderabad West'} • Daily Car Inspection & Photo Verification
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setViewingUpdatesEmp(null)}
                  className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* KPI Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-4 bg-slate-50 border-b border-slate-200 text-xs">
                <div className="bg-white p-3 rounded-2xl border border-slate-200 text-center shadow-2xs">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Assigned Cars</span>
                  <span className="text-xl font-black text-slate-900 mt-0.5 block">{total} Cars</span>
                </div>
                <div className="bg-white p-3 rounded-2xl border border-emerald-200 text-center shadow-2xs">
                  <span className="text-[10px] text-emerald-700 uppercase font-bold block">Completed Cars</span>
                  <span className="text-xl font-black text-emerald-700 mt-0.5 block">{completed.length}</span>
                </div>
                <div className="bg-white p-3 rounded-2xl border border-amber-200 text-center shadow-2xs">
                  <span className="text-[10px] text-amber-700 uppercase font-bold block">Pending Cars</span>
                  <span className="text-xl font-black text-amber-700 mt-0.5 block">{pending.length}</span>
                </div>
                <div className="bg-white p-3 rounded-2xl border border-cyan-200 text-center shadow-2xs">
                  <span className="text-[10px] text-cyan-700 uppercase font-bold block">Photos Uploaded</span>
                  <span className="text-xl font-black text-cyan-700 mt-0.5 block">{beforeCount + afterCount} photos</span>
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="px-5 py-2.5 border-b border-slate-200 flex items-center justify-between text-xs bg-white">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold text-slate-500 uppercase mr-1">Filter Cars:</span>
                  {[
                    { id: 'all', label: `All Cars (${total})` },
                    { id: 'completed', label: `Completed (${completed.length})` },
                    { id: 'pending', label: `Pending (${pending.length})` }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setUpdatesFilter(tab.id)}
                      className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer ${
                        updatesFilter === tab.id
                          ? 'bg-cyan-600 text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const emp = viewingUpdatesEmp;
                    setViewingUpdatesEmp(null);
                    handleOpenAssignCarsModal(emp);
                  }}
                  className="text-xs text-cyan-600 hover:text-cyan-700 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Car className="w-3.5 h-3.5" />
                  <span>Assign / Manage Cars</span>
                </button>
              </div>

              {/* Cars Grid */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3.5">
                {displayedCars.length === 0 ? (
                  <div className="p-10 text-center text-slate-400 bg-slate-50 rounded-3xl border border-slate-200">
                    <Car className="w-10 h-10 mx-auto mb-2 opacity-50" />
                    <p className="font-bold text-sm text-slate-700">No cars found for this filter</p>
                    <p className="text-xs text-slate-500 mt-1">
                      Click "Assign Cars" to allocate today's morning doorstep schedule for this employee.
                    </p>
                  </div>
                ) : (
                  displayedCars.map((car, idx) => {
                    const isDone = car.status === 'Completed';

                    return (
                      <div
                        key={car.id || idx}
                        className={`bg-white border rounded-2xl p-4 transition-all shadow-2xs ${
                          isDone ? 'border-emerald-200 bg-emerald-50/10' : 'border-slate-200'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                          <div className="flex items-center gap-2.5">
                            <span className="w-6 h-6 rounded-lg bg-cyan-50 text-cyan-700 font-mono font-black text-xs flex items-center justify-center border border-cyan-200 shrink-0">
                              {car.carNumber || idx + 1}
                            </span>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-black text-slate-900 text-xs sm:text-sm">
                                  {car.carModel}
                                </h4>
                                <span className="font-mono text-[10px] font-bold text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
                                  {car.regNumber}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500">
                                {car.customerName} ({car.phone}) • {car.apartment} ({car.block || ''} Flat {car.flat}) • Bay: <strong className="text-slate-700">{car.parkingBay || 'Designated Bay'}</strong>
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-start sm:self-auto">
                            <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded-lg">
                              {car.timeSlot}
                            </span>
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              isDone
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : 'bg-amber-100 text-amber-800 border border-amber-300'
                            }`}>
                              ● {car.status}
                            </span>
                          </div>
                        </div>

                        {/* Before & After Photos Side-by-Side Display */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                          {/* Before Photo */}
                          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1">
                                <Camera className="w-3 h-3 text-cyan-600" />
                                <span>Before Cleaning Photo</span>
                              </span>
                              {car.beforePhoto?.uploadedAt && (
                                <span className="text-[9px] text-slate-400 font-mono">
                                  {new Date(car.beforePhoto.uploadedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              )}
                            </div>

                            {car.beforePhoto?.url ? (
                              <div
                                onClick={() => setInspectedPhoto({
                                  url: car.beforePhoto.url,
                                  title: `Before Cleaning: ${car.carModel} (${car.regNumber})`,
                                  time: car.beforePhoto.uploadedAt,
                                  type: 'Before Photo'
                                })}
                                className="relative group rounded-lg overflow-hidden border border-slate-200 aspect-video bg-slate-900 cursor-pointer"
                              >
                                <img
                                  src={car.beforePhoto.url}
                                  alt="Before Wash"
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                />
                                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1">
                                  <Eye className="w-4 h-4" />
                                  <span>Click to Enlarge</span>
                                </div>
                              </div>
                            ) : (
                              <div className="border border-dashed border-slate-300 rounded-lg p-3 text-center text-slate-400 text-[11px]">
                                No Before cleaning photo uploaded yet
                              </div>
                            )}
                          </div>

                          {/* After Photo */}
                          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1">
                                <Sparkles className="w-3 h-3 text-emerald-600" />
                                <span>After Cleaning Photo</span>
                              </span>
                              {car.afterPhoto?.uploadedAt && (
                                <span className="text-[9px] text-slate-400 font-mono">
                                  {new Date(car.afterPhoto.uploadedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              )}
                            </div>

                            {car.afterPhoto?.url ? (
                              <div
                                onClick={() => setInspectedPhoto({
                                  url: car.afterPhoto.url,
                                  title: `After Cleaning: ${car.carModel} (${car.regNumber})`,
                                  time: car.afterPhoto.uploadedAt,
                                  type: 'After Photo'
                                })}
                                className="relative group rounded-lg overflow-hidden border border-slate-200 aspect-video bg-slate-900 cursor-pointer"
                              >
                                <img
                                  src={car.afterPhoto.url}
                                  alt="After Wash"
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                />
                                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1">
                                  <Eye className="w-4 h-4" />
                                  <span>Click to Enlarge</span>
                                </div>
                              </div>
                            ) : (
                              <div className="border border-dashed border-slate-300 rounded-lg p-3 text-center text-slate-400 text-[11px]">
                                No After cleaning photo uploaded yet
                              </div>
                            )}
                          </div>
                        </div>

                        {car.notes && (
                          <div className="mt-2.5 pt-2 border-t border-slate-100 text-[11px] text-slate-600 flex items-start gap-1">
                            <span className="font-bold text-slate-700">Specialist Notes:</span>
                            <span>{car.notes}</span>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* ======================================================== */}
      {/* 3. PHOTO ZOOM & FULLSCREEN LIGHTBOX MODAL                 */}
      {/* ======================================================== */}
      {inspectedPhoto && (
        <div
          onClick={() => setInspectedPhoto(null)}
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fadeIn cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl text-white cursor-default"
          >
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-cyan-300">{inspectedPhoto.title}</h4>
                <p className="text-[11px] text-slate-400">
                  {inspectedPhoto.type} • Uploaded at {inspectedPhoto.time ? new Date(inspectedPhoto.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Today'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setInspectedPhoto(null)}
                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 flex-1 flex items-center justify-center bg-black overflow-hidden">
              <img
                src={inspectedPhoto.url}
                alt="Enlarged Car Cleaning"
                className="max-h-[70vh] w-auto max-w-full object-contain rounded-xl"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
