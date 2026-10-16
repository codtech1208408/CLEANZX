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
  Check
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
    employees,
    customers,
    plans
  } = useAdminData();

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [slotFilter, setSlotFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [employeeFilter, setEmployeeFilter] = useState('ALL');

  // New Schedule Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newScheduleForm, setNewScheduleForm] = useState({
    customerId: customers[0]?.id || '',
    timeSlot: '07:00 AM - 08:00 AM',
    employeeName: employees[0]?.name || 'Ramesh Varma',
    date: new Date().toISOString().slice(0, 10),
    notes: 'Standard morning exterior wipe & glass cleaning'
  });

  const filteredSchedules = dailySchedules.filter(s => {
    const matchesSlot = slotFilter === 'ALL' || s.timeSlot === slotFilter;
    const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter;
    const matchesEmployee = employeeFilter === 'ALL' || s.employeeName === employeeFilter;
    return matchesSlot && matchesStatus && matchesEmployee;
  });

  const completedCount = dailySchedules.filter(s => s.status === 'Completed').length;
  const inProgressCount = dailySchedules.filter(s => s.status === 'In Progress').length;
  const missedCount = dailySchedules.filter(s => s.status === 'Missed').length;
  const assignedCount = dailySchedules.filter(s => s.status === 'Assigned').length;

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

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm shadow-cyan-600/30"
        >
          <Plus className="w-4 h-4" />
          <span>Add Morning Service</span>
        </button>
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

                    {/* Status Chip */}
                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          item.status === 'Completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.status === 'In Progress'
                            ? 'bg-blue-100 text-blue-800'
                            : item.status === 'Assigned'
                            ? 'bg-amber-100 text-amber-800'
                            : item.status === 'Missed'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {item.status}
                      </span>
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
    </div>
  );
}
