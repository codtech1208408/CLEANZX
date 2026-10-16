import React, { useState } from 'react';
import {
  Calendar,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  UserCheck,
  Clock,
  MessageSquare,
  Sparkles,
  AlertCircle,
  RefreshCw,
  X,
  Check,
  Car,
  Building,
  Trash2
} from 'lucide-react';
import { useAdminData } from '../../../context/AdminDataContext';
import { SERVICE_TIME_SLOTS } from '../../../data/websiteData';

export default function BookingsTab({ onOpenWhatsApp }) {
  const {
    bookings,
    updateBookingStatus,
    assignBookingEmployee,
    rescheduleBooking,
    deleteBooking,
    employees,
    customers
  } = useAdminData();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // All active bookings and enquiries
  const activeBookings = Array.isArray(bookings) ? bookings : [];

  // Reschedule Modal State
  const [reschedulingBooking, setReschedulingBooking] = useState(null);
  const [newDate, setNewDate] = useState('');
  const [newSlot, setNewSlot] = useState(SERVICE_TIME_SLOTS[0]);

  // Reject Modal State
  const [rejectingBooking, setRejectingBooking] = useState(null);
  const [rejectReason, setRejectReason] = useState('No slot availability in requested apartment');

  const filteredBookings = activeBookings.filter(b => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      (b.customer_name || '').toLowerCase().includes(q) ||
      (b.phone_number || '').includes(q) ||
      (b.apartment || '').toLowerCase().includes(q) ||
      (b.car_model || '').toLowerCase().includes(q) ||
      (b.vehicle_registration_number || '').toLowerCase().includes(q) ||
      (b.preferred_plan || '').toLowerCase().includes(q);

    const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = activeBookings.filter(b => b.status === 'Pending').length;
  const confirmedCount = activeBookings.filter(b => b.status === 'Confirmed').length;
  const completedCount = activeBookings.filter(b => b.status === 'Completed').length;
  const missedCount = activeBookings.filter(b => b.status === 'Missed').length;

  const handleRescheduleSubmit = (e) => {
    e.preventDefault();
    if (!reschedulingBooking) return;
    rescheduleBooking(reschedulingBooking.id, newDate, newSlot);
    setReschedulingBooking(null);
  };

  const handleRejectSubmit = (e) => {
    e.preventDefault();
    if (!rejectingBooking) return;
    updateBookingStatus(rejectingBooking.id, 'Cancelled', `Rejected: ${rejectReason}`);
    setRejectingBooking(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Booking & Enquiry Management
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Review incoming requests from the public website, confirm, assign morning cleaning specialists, reschedule, and message customers.
          </p>
        </div>

        {pendingCount > 0 && (
          <div className="px-4 py-2 bg-amber-500/15 border border-amber-500/30 rounded-2xl flex items-center gap-2 text-amber-900 text-xs font-bold">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <span>{pendingCount} Pending Enquiries Requiring Review</span>
          </div>
        )}
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {[
            { id: 'ALL', label: `All (${bookings.length})` },
            { id: 'Pending', label: `Pending (${pendingCount})` },
            { id: 'Confirmed', label: `Confirmed (${confirmedCount})` },
            { id: 'Completed', label: `Completed (${completedCount})` },
            { id: 'Missed', label: `Missed (${missedCount})` },
            { id: 'Cancelled', label: 'Cancelled' }
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
            placeholder="Search bookings..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Booking ID</th>
                <th className="py-3 px-4">Customer Details</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Vehicle & Add-ons</th>
                <th className="py-3 px-4">Date & Slot</th>
                <th className="py-3 px-4">Specialist Assigned</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-slate-400">
                    No bookings found matching current filters.
                  </td>
                </tr>
              ) : (
                filteredBookings.map(b => (
                  <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-800">{b.id}</td>

                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-900">{b.customer_name}</p>
                      <p className="text-[11px] font-mono text-slate-500">{b.phone_number}</p>
                    </td>

                    <td className="py-3 px-4">
                      <p className="font-semibold text-slate-800">{b.apartment}</p>
                      <p className="text-[11px] text-slate-500">{b.block} - Flat {b.flat_number}</p>
                    </td>

                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-800">{b.car_model}</p>
                      <span className="font-mono text-[10px] text-slate-500">{b.vehicle_registration_number}</span>
                      {b.selected_addons?.length > 0 && (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {b.selected_addons.map((add, idx) => (
                            <span key={idx} className="bg-cyan-50 text-cyan-800 text-[10px] px-1.5 py-0.5 rounded border border-cyan-200">
                              +{add}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <span className="block font-bold text-slate-900">{b.preferred_start_date}</span>
                      <span className="block text-[11px] text-cyan-700 font-medium">{b.preferred_time}</span>
                    </td>

                    <td className="py-3 px-4">
                      {(() => {
                        const matchedEmp = employees.find(e =>
                          (e.name || '').trim().toLowerCase() === (b.assigned_employee || '').trim().toLowerCase()
                        );
                        const selectedVal = matchedEmp ? matchedEmp.name : (b.assigned_employee || 'Unassigned');

                        return (
                          <select
                            value={selectedVal}
                            onChange={(e) => assignBookingEmployee(b.id, e.target.value)}
                            className="p-1.5 text-xs border border-slate-300 rounded-lg bg-white capitalize font-medium"
                          >
                            <option value="Unassigned">Unassigned</option>
                            {employees.map(emp => (
                              <option key={emp.id} value={emp.name}>
                                {emp.name ? emp.name.charAt(0).toUpperCase() + emp.name.slice(1) : emp.id}
                              </option>
                            ))}
                          </select>
                        );
                      })()}
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          b.status === 'Confirmed'
                            ? 'bg-blue-100 text-blue-800'
                            : b.status === 'Completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : b.status === 'Pending'
                            ? 'bg-amber-100 text-amber-800'
                            : b.status === 'Missed'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* WhatsApp Confirmation */}
                        <button
                          onClick={() => onOpenWhatsApp({
                            phone: b.phone_number,
                            name: b.customer_name,
                            car: b.car_model,
                            regNumber: b.vehicle_registration_number,
                            apartment: b.apartment,
                            planName: b.preferred_plan,
                            date: b.preferred_start_date,
                            timeSlot: b.preferred_time,
                            templateType: 'booking'
                          })}
                          className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                          title="WhatsApp Confirmation"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>

                        {/* Quick Confirm */}
                        {b.status === 'Pending' && (
                          <button
                            onClick={() => {
                              updateBookingStatus(b.id, 'Confirmed', 'Confirmed by Admin');
                              if (b.assigned_employee === 'Unassigned') {
                                assignBookingEmployee(b.id, employees[0].name);
                              }
                            }}
                            className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold text-[11px] flex items-center gap-1 cursor-pointer"
                            title="Confirm Booking"
                          >
                            <Check className="w-3 h-3" />
                            <span>Confirm</span>
                          </button>
                        )}

                        {/* Reschedule */}
                        <button
                          onClick={() => {
                            setReschedulingBooking(b);
                            setNewDate(b.preferred_start_date);
                            setNewSlot(b.preferred_time || SERVICE_TIME_SLOTS[0]);
                          }}
                          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold text-[11px] cursor-pointer"
                          title="Reschedule Slot"
                        >
                          <span>Reschedule</span>
                        </button>

                        {/* Reject */}
                        {b.status === 'Pending' && (
                          <button
                            onClick={() => setRejectingBooking(b)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                            title="Reject Request"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}

                        {/* Delete Booking */}
                        <button
                          onClick={() => {
                            if (window.confirm(`Permanently delete booking ${b.id} for ${b.customer_name || 'customer'}?`)) {
                              deleteBooking(b.id);
                            }
                          }}
                          className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Permanently Delete Booking"
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

      {/* RESCHEDULE MODAL */}
      {reschedulingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm">Reschedule Booking</h3>
              <button
                onClick={() => setReschedulingBooking(null)}
                className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Rescheduling for <span className="font-bold text-slate-900">{reschedulingBooking.customer_name}</span> ({reschedulingBooking.car_model}).
            </p>

            <form onSubmit={handleRescheduleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">New Date</label>
                <input
                  type="date"
                  required
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Morning Time Slot (06:00 AM - 11:30 AM)</label>
                <select
                  value={newSlot}
                  onChange={(e) => setNewSlot(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl bg-white"
                >
                  {SERVICE_TIME_SLOTS.map(slot => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReschedulingBooking(null)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Confirm Reschedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REJECT MODAL */}
      {rejectingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm">Reject Booking Enquiry</h3>
              <button
                onClick={() => setRejectingBooking(null)}
                className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleRejectSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Reason for Rejection</label>
                <textarea
                  rows={3}
                  required
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                  placeholder="e.g. Society parking bylaws restrictions, or out of morning capacity"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRejectingBooking(null)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Reject Enquiry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
