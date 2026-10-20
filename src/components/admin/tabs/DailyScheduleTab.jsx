import React, { useState } from 'react';
import {
  Clock,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  XCircle,
  Plus,
  Search,
  Filter,
  UserCheck,
  MessageSquare,
  Sparkles,
  Car,
  Building,
  X,
  Check,
  Trash2,
  Camera,
  Eye,
  UploadCloud
} from 'lucide-react';
import { useAdminData } from '../../../context/AdminDataContext';
import { SERVICE_TIME_SLOTS } from '../../../data/websiteData';

export default function DailyScheduleTab({ onOpenWhatsApp }) {
  const {
    dailySchedules,
    updateScheduleStatus,
    reassignScheduleEmployee,
    rescheduleSlot,
    addScheduleItem,
    deleteScheduleItem,
    employees,
    customers,
    plans,
    assignCarsToEmployee,
    assignTenCarsToEmployee,
    carAssignments
  } = useAdminData();

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [slotFilter, setSlotFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [employeeFilter, setEmployeeFilter] = useState('ALL');
  const [inspectedPhoto, setInspectedPhoto] = useState(null);
  const [isAssignTenCarsModalOpen, setIsAssignTenCarsModalOpen] = useState(false);
  const [assignFormEmpId, setAssignFormEmpId] = useState('');
  const [assignCarCount, setAssignCarCount] = useState(5);
  const [assignSubmitting, setAssignSubmitting] = useState(false);

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
    return true; // Keep all schedules visible to Admin
  };

  const activeDailySchedules = Array.isArray(dailySchedules) ? dailySchedules : [];

  // New Schedule Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newScheduleForm, setNewScheduleForm] = useState({
    customerId: customers[0]?.id || '',
    timeSlot: '07:00 AM - 08:00 AM',
    employeeName: employees[0]?.name || 'Ramesh Varma',
    date: new Date().toISOString().slice(0, 10),
    notes: 'Standard morning exterior wipe & glass cleaning'
  });

  // Merge dailySchedules with carAssignments so all daily subscription updates are visible
  const allDateSchedules = React.useMemo(() => {
    const combined = [...activeDailySchedules];
    (carAssignments || []).forEach(ca => {
      const idx = combined.findIndex(s => s.id === ca.id || (s.regNumber === ca.regNumber && s.date === ca.date));
      if (idx >= 0) {
        combined[idx] = {
          ...combined[idx],
          status: ca.status || combined[idx].status,
          beforePhoto: ca.beforePhoto || combined[idx].beforePhoto,
          afterPhoto: ca.afterPhoto || combined[idx].afterPhoto,
          employeeName: ca.employeeName || combined[idx].employeeName,
          notes: ca.notes || combined[idx].notes
        };
      } else {
        combined.push({
          id: ca.id,
          subscriptionId: ca.subscriptionId || null,
          timeSlot: ca.timeSlot || '07:00 AM - 08:00 AM',
          customerName: ca.customerName,
          phone: ca.phone,
          apartment: ca.apartment,
          block: ca.block,
          flat: ca.flat,
          carModel: ca.carModel,
          regNumber: ca.regNumber,
          planName: ca.planName,
          employeeId: ca.employeeId,
          employeeName: ca.employeeName,
          date: ca.date,
          status: ca.status,
          beforePhoto: ca.beforePhoto,
          afterPhoto: ca.afterPhoto,
          notes: ca.notes,
          source: ca.subscriptionId ? 'subscription_daily' : 'car_assignment'
        });
      }
    });
    return combined;
  }, [activeDailySchedules, carAssignments]);

  const filteredSchedules = allDateSchedules.filter(s => {
    const matchesDate = !selectedDate || s.date === selectedDate;
    const matchesSlot = slotFilter === 'ALL' || s.timeSlot === slotFilter;
    const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter;
    const matchesEmployee = employeeFilter === 'ALL' || s.employeeName === employeeFilter;
    return matchesDate && matchesSlot && matchesStatus && matchesEmployee;
  });

  const dateSchedules = allDateSchedules.filter(s => !selectedDate || s.date === selectedDate);
  const completedCount = dateSchedules.filter(s => s.status === 'Completed').length;
  const inProgressCount = dateSchedules.filter(s => s.status === 'In Progress').length;
  const missedCount = dateSchedules.filter(s => s.status === 'Missed').length;
  const assignedCount = dateSchedules.filter(s => s.status === 'Assigned' || s.status === 'Pending').length;

  const handleAddScheduleSubmit = (e) => {
    e.preventDefault();
    const cust = customers.find(c => c.id === newScheduleForm.customerId);
    if (!cust) return;

    const emp = employees.find(emp => emp.name === newScheduleForm.employeeName);

    addScheduleItem({
      timeSlot: newScheduleForm.timeSlot,
      customerName: cust.name,
      phone: cust.phone,
      apartment: cust.apartment,
      block: cust.block || 'Tower 1',
      flat: cust.flat_number,
      carModel: cust.car_model,
      regNumber: cust.vehicle_registration_number,
      planName: cust.activePlan || 'Monthly Normal Plan',
      employeeId: emp?.id || 'EMP-01',
      employeeName: newScheduleForm.employeeName,
      date: newScheduleForm.date,
      notes: newScheduleForm.notes
    });

    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-semibold mb-2">
            <Clock className="w-3.5 h-3.5 text-cyan-600" />
            <span>Operational Morning Service Slots: 06:00 AM - 11:30 AM</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Daily Service Schedule
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time morning tracking of customer cars, apartment bays, assigned detailing technicians, and execution status.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => {
              setAssignFormEmpId(employees[0]?.id || 'EMP-01');
              setIsAssignTenCarsModalOpen(true);
            }}
            className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-cyan-600/25"
          >
            <Car className="w-4 h-4" />
            <span>Assign Cars to Specialist</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-200"
          >
            <Plus className="w-4 h-4" />
            <span>Add Single Service</span>
          </button>
        </div>
      </div>

      {/* Progress Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block">Assigned Slots</span>
          <span className="text-2xl font-black text-slate-900">{assignedCount}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block">In Progress</span>
          <span className="text-2xl font-black text-blue-600">{inProgressCount}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block">Completed</span>
          <span className="text-2xl font-black text-emerald-600">{completedCount}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block">Missed / Attention</span>
          <span className="text-2xl font-black text-rose-600">{missedCount}</span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Time Slot Filter */}
          <select
            value={slotFilter}
            onChange={(e) => setSlotFilter(e.target.value)}
            className="p-2 border border-slate-300 rounded-xl bg-white"
          >
            <option value="ALL">All Morning Slots (6:00 - 11:30 AM)</option>
            {SERVICE_TIME_SLOTS.map(slot => (
              <option key={slot} value={slot}>{slot}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 border border-slate-300 rounded-xl bg-white"
          >
            <option value="ALL">All Service Statuses</option>
            <option value="Assigned">Assigned</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Missed">Missed</option>
            <option value="Rescheduled">Rescheduled</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          {/* Employee Filter */}
          <select
            value={employeeFilter}
            onChange={(e) => setEmployeeFilter(e.target.value)}
            className="p-2 border border-slate-300 rounded-xl bg-white"
          >
            <option value="ALL">All Specialists</option>
            {employees.map(emp => (
              <option key={emp.id} value={emp.name}>{emp.name}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-semibold">Service Date:</span>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="p-1.5 border border-slate-300 rounded-xl font-medium bg-slate-50"
          />
        </div>
      </div>

      {/* Schedules Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Time Window</th>
                <th className="py-3 px-4">Customer Details</th>
                <th className="py-3 px-4">Apartment & Flat</th>
                <th className="py-3 px-4">Vehicle Model & Reg</th>
                <th className="py-3 px-4">Plan Name</th>
                <th className="py-3 px-4">Specialist</th>
                <th className="py-3 px-4">Photos (Before / After)</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Update Status & WhatsApp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredSchedules.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-slate-400">
                    No morning service appointments match the filter.
                  </td>
                </tr>
              ) : (
                filteredSchedules.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Time Slot */}
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-cyan-800 bg-cyan-50 px-2.5 py-1 rounded-lg border border-cyan-200 block text-center truncate">
                        {item.timeSlot}
                      </span>
                    </td>

                    {/* Customer */}
                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-900">{item.customerName}</p>
                      <p className="text-[11px] font-mono text-slate-500">{item.phone}</p>
                    </td>

                    {/* Apartment */}
                    <td className="py-3 px-4">
                      <p className="font-semibold text-slate-800">{item.apartment}</p>
                      <p className="text-[11px] text-slate-500">{item.block} - Flat {item.flat}</p>
                    </td>

                    {/* Vehicle */}
                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-800">{item.carModel}</p>
                      <span className="font-mono text-[10px] font-bold text-slate-600 px-1.5 py-0.5 bg-slate-100 rounded">
                        {item.regNumber}
                      </span>
                    </td>

                    {/* Plan */}
                    <td className="py-3 px-4 text-slate-700">{item.planName}</td>

                    {/* Employee */}
                    <td className="py-3 px-4">
                      <select
                        value={item.employeeName}
                        onChange={(e) => {
                          const chosen = employees.find(emp => emp.name === e.target.value);
                          reassignScheduleEmployee(item.id, chosen?.id || '', e.target.value);
                        }}
                        className="p-1 text-xs border border-slate-300 rounded-lg bg-white"
                      >
                        {employees.map(emp => (
                          <option key={emp.id} value={emp.name}>{emp.name}</option>
                        ))}
                      </select>
                    </td>

                    {/* Cleaning Photos (Before / After) */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {item.beforePhoto?.url ? (
                          <div
                            onClick={() => setInspectedPhoto({
                              url: item.beforePhoto.url,
                              title: `Before Clean: ${item.carModel} (${item.regNumber})`,
                              time: item.beforePhoto.uploadedAt,
                              type: 'Before Cleaning Photo'
                            })}
                            className="relative group w-9 h-9 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 cursor-pointer shrink-0"
                            title="Click to view Before Cleaning photo"
                          >
                            <img
                              src={item.beforePhoto.url}
                              alt="Before"
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                            />
                            <span className="absolute bottom-0 inset-x-0 bg-slate-900/80 text-[7px] font-black text-cyan-300 text-center leading-none py-0.5 uppercase">
                              Before
                            </span>
                          </div>
                        ) : null}

                        {item.afterPhoto?.url ? (
                          <div
                            onClick={() => setInspectedPhoto({
                              url: item.afterPhoto.url,
                              title: `After Clean: ${item.carModel} (${item.regNumber})`,
                              time: item.afterPhoto.uploadedAt,
                              type: 'After Cleaning Photo'
                            })}
                            className="relative group w-9 h-9 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 cursor-pointer shrink-0"
                            title="Click to view After Cleaning photo"
                          >
                            <img
                              src={item.afterPhoto.url}
                              alt="After"
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                            />
                            <span className="absolute bottom-0 inset-x-0 bg-emerald-950/85 text-[7px] font-black text-emerald-300 text-center leading-none py-0.5 uppercase">
                              After
                            </span>
                          </div>
                        ) : null}

                        {!item.beforePhoto?.url && !item.afterPhoto?.url && (
                          <span className="text-[10px] text-slate-400 italic">No photos</span>
                        )}
                      </div>
                    </td>

                    {/* Status Chip & Work Notes */}
                    <td className="py-3 px-4">
                      <div>
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            item.status === 'Completed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : item.status === 'In Progress'
                              ? 'bg-blue-100 text-blue-800 animate-pulse'
                              : item.status === 'Assigned'
                              ? 'bg-amber-100 text-amber-800'
                              : item.status === 'Missed'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          ● {item.status}
                        </span>
                        {item.notes && (
                          <p className="text-[11px] text-slate-600 mt-1 max-w-[200px] leading-tight" title={item.notes}>
                            <span className="font-semibold text-slate-500">Note: </span>
                            {item.notes}
                          </p>
                        )}
                        {item.updatedAt && (
                          <span className="text-[9px] text-slate-400 block font-mono mt-0.5">
                            Updated {new Date(item.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Quick Status Changers & WhatsApp */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* WhatsApp Update */}
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
                          title="WhatsApp Service Update"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>

                        {/* Quick In Progress */}
                        {item.status === 'Assigned' && (
                          <button
                            onClick={() => updateScheduleStatus(item.id, 'In Progress')}
                            className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg font-semibold text-[10px] cursor-pointer"
                          >
                            Start
                          </button>
                        )}

                        {/* Quick Completed */}
                        {item.status !== 'Completed' && (
                          <button
                            onClick={() => updateScheduleStatus(item.id, 'Completed', 'Finished spotless morning clean')}
                            className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold text-[10px] flex items-center gap-1 cursor-pointer"
                          >
                            <Check className="w-3 h-3" />
                            <span>Done</span>
                          </button>
                        )}

                        {/* Quick Missed */}
                        {item.status !== 'Completed' && item.status !== 'Missed' && (
                          <button
                            onClick={() => {
                              const reason = prompt('Reason for missed service:', 'Vehicle not in bay');
                              if (reason) updateScheduleStatus(item.id, 'Missed', reason);
                            }}
                            className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg font-semibold text-[10px] cursor-pointer"
                          >
                            Missed
                          </button>
                        )}

                        {/* Delete Schedule Item */}
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete morning service schedule for ${item.customerName || 'customer'}?`)) {
                              deleteScheduleItem(item.id);
                            }
                          }}
                          className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete Schedule Entry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD MORNING SERVICE MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-base">Schedule Morning Cleaning</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddScheduleSubmit} className="p-6 space-y-3 text-xs max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Customer</label>
                <select
                  required
                  value={newScheduleForm.customerId}
                  onChange={(e) => setNewScheduleForm({ ...newScheduleForm, customerId: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl bg-white"
                >
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} - {c.apartment} ({c.car_model})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={newScheduleForm.date}
                    onChange={(e) => setNewScheduleForm({ ...newScheduleForm, date: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Time Slot (6:00 AM - 11:30 AM)</label>
                  <select
                    value={newScheduleForm.timeSlot}
                    onChange={(e) => setNewScheduleForm({ ...newScheduleForm, timeSlot: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl bg-white"
                  >
                    {SERVICE_TIME_SLOTS.map(slot => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assigned Cleaning Specialist</label>
                <select
                  value={newScheduleForm.employeeName}
                  onChange={(e) => setNewScheduleForm({ ...newScheduleForm, employeeName: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl bg-white"
                >
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.name}>{emp.name} ({emp.zone})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Special Execution Notes</label>
                <textarea
                  rows={2}
                  value={newScheduleForm.notes}
                  onChange={(e) => setNewScheduleForm({ ...newScheduleForm, notes: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                  placeholder="e.g. Focus on windshield and front grill"
                />
              </div>

              <div className="bg-slate-50 px-6 py-3 -mx-6 -mb-6 mt-4 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-semibold shadow-md cursor-pointer"
                >
                  Add to Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* PHOTO LIGHTBOX MODAL */}
      {inspectedPhoto && (
        <div
          onClick={() => setInspectedPhoto(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl text-white cursor-default"
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
                alt="Car Cleaning Inspection"
                className="max-h-[65vh] w-auto max-w-full object-contain rounded-xl"
              />
            </div>
          </div>
        </div>
      )}

      {/* ASSIGN CARS MODAL */}
      {isAssignTenCarsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
              <div className="flex items-center gap-2.5">
                <Car className="w-5 h-5 text-cyan-400" />
                <h3 className="font-black text-base">Assign Cars to Specialist</h3>
              </div>
              <button
                onClick={() => setIsAssignTenCarsModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setAssignSubmitting(true);
                const targetEmp = employees.find(emp => emp.id === assignFormEmpId);
                const empName = targetEmp?.name || 'Specialist Staff';

                const pool = [
                  { carModel: "Hyundai Creta SX(O)", regNumber: "TS09FA4821", customerName: "Vikram Reddy", phone: "9848022331", apartment: "Prestige High Fields", block: "Tower 2", flat: "405", parkingBay: "B1-405", timeSlot: "06:00 AM - 06:30 AM", planName: "Monthly Premium Plan" },
                  { carModel: "Kia Seltos GTX+", regNumber: "TS07HX9912", customerName: "Pooja Sharma", phone: "9876543210", apartment: "Prestige High Fields", block: "Tower 3", flat: "712", parkingBay: "B1-712", timeSlot: "06:30 AM - 07:00 AM", planName: "Monthly Premium Plan" },
                  { carModel: "Hyundai i20 Asta", regNumber: "TS09AB1234", customerName: "Santhosh Kumar", phone: "9642734252", apartment: "Skyline Heights", block: "Tower A", flat: "402", parkingBay: "B2-108", timeSlot: "07:00 AM - 07:30 AM", planName: "Monthly Premium Plan" },
                  { carModel: "Tata Nexon Fearless", regNumber: "TS08EJ3344", customerName: "Rajesh Varma", phone: "9123456780", apartment: "Skyline Heights", block: "Tower B", flat: "201", parkingBay: "B2-201", timeSlot: "07:30 AM - 08:00 AM", planName: "Monthly Normal Plan" },
                  { carModel: "Honda City ZX", regNumber: "TS09GL5566", customerName: "Ananya Iyer", phone: "9988776655", apartment: "My Home Bhooja", block: "Tower 5", flat: "1104", parkingBay: "B1-504", timeSlot: "08:00 AM - 08:30 AM", planName: "Quarterly Premium Plan" },
                  { carModel: "Toyota Fortuner Legender", regNumber: "TS07KP7788", customerName: "Kiran Goud", phone: "9849011223", apartment: "My Home Bhooja", block: "Tower 6", flat: "809", parkingBay: "B1-609", timeSlot: "08:30 AM - 09:00 AM", planName: "Monthly Premium Plan" },
                  { carModel: "Mahindra XUV700 AX7L", regNumber: "TS08MN2211", customerName: "Deepak Rao", phone: "9700112233", apartment: "Aparna Sarovar", block: "Block C", flat: "302", parkingBay: "B1-302", timeSlot: "09:00 AM - 09:30 AM", planName: "Monthly Normal Plan" },
                  { carModel: "Maruti Swift ZXi+", regNumber: "TS09RQ4455", customerName: "Sneha Patel", phone: "9655443322", apartment: "Rainbow Vistas", block: "Tower 4", flat: "601", parkingBay: "B2-401", timeSlot: "09:30 AM - 10:00 AM", planName: "15-Day Normal Plan" },
                  { carModel: "Volkswagen Virtus GT", regNumber: "TS07WT8899", customerName: "Arun Nair", phone: "9822334455", apartment: "Jayabheri Silicon County", block: "Tower 1", flat: "904", parkingBay: "B1-904", timeSlot: "10:00 AM - 10:45 AM", planName: "Monthly Premium Plan" },
                  { carModel: "BMW 3 Series Gran Limousine", regNumber: "TS09ZZ1001", customerName: "Dr. Suresh Chandra", phone: "9848099887", apartment: "Lodha Bellezza", block: "Tower Eden", flat: "502", parkingBay: "B2-502", timeSlot: "10:45 AM - 11:30 AM", planName: "Half-Yearly Premium Plan" }
                ];

                const carsToAssign = pool.slice(0, assignCarCount).map((c, i) => ({
                  ...c,
                  carNumber: i + 1,
                  status: 'Pending',
                  beforePhoto: null,
                  afterPhoto: null
                }));

                const assignFn = assignCarsToEmployee || assignTenCarsToEmployee;
                const res = await assignFn(
                  assignFormEmpId,
                  empName,
                  carsToAssign,
                  selectedDate
                );
                setAssignSubmitting(false);
                if (res?.success) {
                  setIsAssignTenCarsModalOpen(false);
                  alert(`✅ ${carsToAssign.length} Cars successfully assigned to ${targetEmp?.name || assignFormEmpId} for ${selectedDate}!`);
                } else {
                  alert(res?.message || 'Failed to assign cars.');
                }
              }}
              className="p-5 space-y-4 text-xs"
            >
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Specialist by Employee ID</label>
                <select
                  value={assignFormEmpId}
                  onChange={(e) => setAssignFormEmpId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
                >
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>
                      {emp.id} — {emp.name} ({emp.zone || 'Specialist'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Service Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
                />
              </div>

              {/* Number of cars to assign */}
              <div className="p-3 bg-cyan-50/70 border border-cyan-200/90 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-black text-slate-900 text-xs">
                    Select How Many Cars to Assign
                  </label>
                  <span className="font-mono text-cyan-800 font-bold bg-white px-2 py-0.5 rounded-full border border-cyan-200 text-[11px]">
                    {assignCarCount} Cars
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setAssignCarCount(prev => Math.max(1, prev - 1))}
                    className="w-8 h-8 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-black text-base flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
                  >
                    -
                  </button>

                  <div className="flex items-center bg-white border-2 border-cyan-500 rounded-xl px-2.5 py-1 shadow-xs">
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={assignCarCount}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        if (!isNaN(val) && val >= 1) {
                          setAssignCarCount(Math.min(50, val));
                        }
                      }}
                      className="w-12 text-center font-mono font-black text-slate-900 text-sm focus:outline-none"
                    />
                    <span className="text-[11px] font-black text-cyan-800 uppercase ml-1 tracking-wider">
                      CARS
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setAssignCarCount(prev => Math.min(50, prev + 1))}
                    className="w-8 h-8 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-black text-base flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="p-3 bg-cyan-50 border border-cyan-200 rounded-xl text-cyan-900 text-xs">
                Allocates {assignCarCount} doorstep apartment cars across Hyderabad for this specialist's morning shift. Status will start as Pending until the employee uploads photos and marks completed.
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAssignTenCarsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={assignSubmitting}
                  className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl shadow-md cursor-pointer disabled:opacity-50"
                >
                  {assignSubmitting ? 'Assigning...' : `Confirm & Assign ${assignCarCount} Cars`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
