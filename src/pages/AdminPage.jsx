import React, { useState } from 'react';
import { ShieldCheck, Download, Search, Filter, RefreshCw, CheckCircle2, Clock, Phone, Car, Building, Eye, Edit3, Save, X, Server } from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { BUSINESS_INFO } from '../data/websiteData';

export default function AdminPage() {
  const { enquiries, updateEnquiryStatus, plans, setPlans, backendAvailable } = useBooking();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [editingPlan, setEditingPlan] = useState(null);
  const [planForm, setPlanForm] = useState(null);
  const [activeTab, setActiveTab] = useState('enquiries'); // 'enquiries' | 'plans'

  // Filtered Enquiries
  const filteredEnquiries = enquiries.filter((e) => {
    const matchesSearch =
      (e.customer_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.phone_number || '').includes(searchTerm) ||
      (e.vehicle_registration_number || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.apartment || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.car_model || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || e.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Export Enquiries as CSV
  const exportToCSV = () => {
    if (enquiries.length === 0) {
      alert('No enquiries to export.');
      return;
    }
    const headers = [
      'ID', 'Date', 'Customer Name', 'Phone', 'Apartment', 'Block', 'Flat',
      'Car Model', 'Registration', 'Plan', 'Preferred Date', 'Time Slot', 'Add-ons', 'Status'
    ];
    const rows = enquiries.map((e) => [
      e.id,
      new Date(e.createdAt).toLocaleString(),
      `"${e.customer_name}"`,
      `"${e.phone_number}"`,
      `"${e.apartment}"`,
      `"${e.block}"`,
      `"${e.flat_number}"`,
      `"${e.car_model}"`,
      `"${e.vehicle_registration_number}"`,
      `"${e.preferred_plan}"`,
      e.preferred_start_date || 'N/A',
      `"${e.preferred_time || 'N/A'}"`,
      `"${(e.selected_addons || []).join('; ')}"`,
      e.status
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `cleanzx_enquiries_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export Enquiries as JSON
  const exportToJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(enquiries, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `cleanzx_enquiries_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const startEditPlan = (plan) => {
    setEditingPlan(plan.id);
    setPlanForm({ ...plan });
  };

  const savePlanEdit = async () => {
    if (!planForm) return;
    const updated = plans.map(p => p.id === planForm.id ? planForm : p);
    setPlans(updated);
    setEditingPlan(null);

    // Save to backend API if available
    try {
      await fetch('/api/plans', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
    } catch (e) {
      console.log('Saved to local plan state');
    }
  };

  return (
    <div className="bg-white text-slate-900 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Banner / System Status */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50 border border-slate-200 p-6 rounded-2xl shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading">
                CLEANZX Business Operations Portal
              </h1>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-[#1677FF] border border-blue-200">
                Admin
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Manage incoming apartment booking enquiries, update customer service statuses, and configure subscription plans.
            </p>
          </div>

          {/* Backend Connectivity Status */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs shadow-sm">
              <Server className="w-3.5 h-3.5 text-[#1677FF]" />
              <span className="text-slate-600">Backend API:</span>
              <span className={`font-semibold ${backendAvailable ? 'text-emerald-600' : 'text-amber-600'}`}>
                {backendAvailable ? 'Online (Persistence Enabled)' : 'Offline (LocalStorage Fallback)'}
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 gap-4">
          <button
            onClick={() => setActiveTab('enquiries')}
            className={`pb-3 text-sm font-semibold transition-colors relative cursor-pointer ${
              activeTab === 'enquiries' ? 'text-[#1677FF]' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Booking Enquiries ({enquiries.length})</span>
            {activeTab === 'enquiries' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1677FF]"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('plans')}
            className={`pb-3 text-sm font-semibold transition-colors relative cursor-pointer ${
              activeTab === 'plans' ? 'text-[#1677FF]' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Manage Plans & Pricing ({plans.length})</span>
            {activeTab === 'plans' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1677FF]"></span>
            )}
          </button>
        </div>

        {/* TAB 1: BOOKING ENQUIRIES */}
        {activeTab === 'enquiries' && (
          <div className="space-y-6">
            {/* Controls & Export Bar */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by name, phone, car, apartment..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1677FF]"
                />
              </div>

              {/* Filters & Export */}
              <div className="flex items-center gap-2 flex-wrap">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs focus:outline-none focus:ring-1 focus:ring-[#1677FF] shadow-sm cursor-pointer"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Completed">Completed</option>
                </select>

                <button
                  onClick={exportToCSV}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                >
                  <Download className="w-3.5 h-3.5 text-[#1677FF]" />
                  <span>Export CSV</span>
                </button>

                <button
                  onClick={exportToJSON}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-600" />
                  <span>JSON</span>
                </button>
              </div>
            </div>

            {/* Enquiries Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              {filteredEnquiries.length === 0 ? (
                <div className="p-12 text-center text-slate-500 space-y-3">
                  <Car className="w-12 h-12 mx-auto text-slate-300" />
                  <p className="text-base font-semibold text-slate-800">No booking enquiries found</p>
                  <p className="text-xs">
                    {searchTerm || statusFilter !== 'ALL'
                      ? 'Try clearing your filters or search query.'
                      : 'Customer enquiries submitted on the website will appear here in real-time.'}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-700">
                      <tr>
                        <th className="py-3 px-4 font-bold">Ref ID & Date</th>
                        <th className="py-3 px-4 font-bold">Customer</th>
                        <th className="py-3 px-4 font-bold">Apartment & Flat</th>
                        <th className="py-3 px-4 font-bold">Vehicle</th>
                        <th className="py-3 px-4 font-bold">Plan & Slot</th>
                        <th className="py-3 px-4 font-bold">Status</th>
                        <th className="py-3 px-4 font-bold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredEnquiries.map((enq) => (
                        <tr key={enq.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3.5 px-4 font-mono">
                            <span className="text-[#1677FF] font-semibold">{enq.id}</span>
                            <span className="block text-[10px] text-slate-500 mt-0.5">
                              {new Date(enq.createdAt).toLocaleDateString()}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <p className="font-bold text-slate-900">{enq.customer_name}</p>
                            <a
                              href={`tel:${enq.phone_number}`}
                              className="text-[#1677FF] hover:underline flex items-center gap-1 mt-0.5 font-medium"
                            >
                              <Phone className="w-3 h-3" />
                              {enq.phone_number}
                            </a>
                          </td>
                          <td className="py-3.5 px-4">
                            <p className="text-slate-900 font-medium">{enq.apartment}</p>
                            <p className="text-[11px] text-slate-500">
                              Block {enq.block}, Flat {enq.flat_number}
                            </p>
                          </td>
                          <td className="py-3.5 px-4">
                            <p className="text-slate-900 font-medium">{enq.car_model}</p>
                            <p className="font-mono text-[11px] text-slate-600">
                              {enq.vehicle_registration_number}
                            </p>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="font-semibold text-slate-900">{enq.preferred_plan}</span>
                            <span className="block text-[11px] text-slate-500">
                              {enq.preferred_time || 'Morning Slot'}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <select
                              value={enq.status || 'Pending'}
                              onChange={(e) => updateEnquiryStatus(enq.id, e.target.value)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-semibold border cursor-pointer ${
                                enq.status === 'Confirmed'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                                  : enq.status === 'Contacted'
                                  ? 'bg-blue-50 text-blue-700 border-blue-300'
                                  : enq.status === 'Completed'
                                  ? 'bg-purple-50 text-purple-700 border-purple-300'
                                  : 'bg-amber-50 text-amber-700 border-amber-300'
                              }`}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Contacted">Contacted</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Completed">Completed</option>
                            </select>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => setSelectedEnquiry(enq)}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-[#1677FF] hover:text-white border border-slate-200 text-slate-700 transition-colors cursor-pointer"
                              title="View Full Details"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: PLANS CONFIGURATION */}
        {activeTab === 'plans' && (
          <div className="space-y-6">
            <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl flex justify-between items-center shadow-sm">
              <div>
                <h2 className="text-base font-bold text-slate-900 font-heading">
                  Subscription Plan Customizer
                </h2>
                <p className="text-xs text-slate-600">
                  Prices and cleaning frequencies configured here are displayed throughout the website.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plans.map((plan) => {
                const isEditing = editingPlan === plan.id;
                return (
                  <div
                    key={plan.id}
                    className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase text-[#1677FF]">
                        {plan.category} Category
                      </span>
                      <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-slate-600 font-medium">
                        Duration: {plan.duration}
                      </span>
                    </div>

                    {isEditing ? (
                      <div className="space-y-3 text-xs">
                        <div>
                          <label className="text-slate-700 font-semibold block mb-1">Plan Name:</label>
                          <input
                            type="text"
                            value={planForm.name}
                            onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })}
                            className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900"
                          />
                        </div>
                        <div>
                          <label className="text-slate-700 font-semibold block mb-1">Price (₹ or empty for enquiry):</label>
                          <input
                            type="number"
                            placeholder="Leave empty for 'Price to be confirmed'"
                            value={planForm.price || ''}
                            onChange={(e) => setPlanForm({ ...planForm, price: e.target.value ? Number(e.target.value) : null })}
                            className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900"
                          />
                        </div>
                        <div>
                          <label className="text-slate-700 font-semibold block mb-1">Cleaning Frequency:</label>
                          <input
                            type="text"
                            value={planForm.cleaningFrequency}
                            onChange={(e) => setPlanForm({ ...planForm, cleaningFrequency: e.target.value })}
                            className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900"
                          />
                        </div>
                        <div className="flex gap-2 pt-2">
                          <button
                            onClick={savePlanEdit}
                            className="flex-1 py-1.5 rounded-lg bg-emerald-600 text-white font-semibold flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Save className="w-3.5 h-3.5" /> Save
                          </button>
                          <button
                            onClick={() => setEditingPlan(null)}
                            className="px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h3 className="text-lg font-bold text-slate-900 font-heading">{plan.name}</h3>
                        <div className="text-xs text-slate-600 space-y-1">
                          <p>
                            <strong className="text-slate-900">Price:</strong>{' '}
                            {plan.price ? `₹${plan.price.toLocaleString('en-IN')}` : 'Price to be confirmed'}
                          </p>
                          <p>
                            <strong className="text-slate-900">Frequency:</strong> {plan.cleaningFrequency}
                          </p>
                          <p>
                            <strong className="text-slate-900">Inclusions:</strong> {(plan.includedServices || []).join(', ')}
                          </p>
                        </div>
                        <button
                          onClick={() => startEditPlan(plan)}
                          className="w-full py-2 rounded-xl bg-slate-100 hover:bg-[#1677FF] border border-slate-200 hover:border-[#1677FF] text-slate-800 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit Plan Details</span>
                        </button>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* DETAIL MODAL */}
        {selectedEnquiry && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 font-heading">
                    Enquiry Details: {selectedEnquiry.id}
                  </h3>
                  <span className="text-xs text-slate-500">
                    Submitted on {new Date(selectedEnquiry.createdAt).toLocaleString()}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedEnquiry(null)}
                  className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:text-slate-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
                  <p className="text-slate-500 font-medium">Customer:</p>
                  <p className="text-slate-900 font-semibold">{selectedEnquiry.customer_name}</p>
                  <p className="text-[#1677FF] font-semibold">{selectedEnquiry.phone_number}</p>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
                  <p className="text-slate-500 font-medium">Apartment Address:</p>
                  <p className="text-slate-900 font-semibold">{selectedEnquiry.apartment}</p>
                  <p className="text-slate-700">Block: {selectedEnquiry.block}, Flat: {selectedEnquiry.flat_number}</p>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
                  <p className="text-slate-500 font-medium">Vehicle & Plan:</p>
                  <p className="text-slate-900 font-semibold">{selectedEnquiry.car_model} ({selectedEnquiry.vehicle_registration_number})</p>
                  <p className="text-[#1677FF] font-semibold">{selectedEnquiry.preferred_plan}</p>
                  <p className="text-slate-600">Time Slot: {selectedEnquiry.preferred_time || 'Morning'}</p>
                  <p className="text-slate-600">Preferred Date: {selectedEnquiry.preferred_start_date || 'Flexible'}</p>
                </div>

                {selectedEnquiry.selected_addons && selectedEnquiry.selected_addons.length > 0 && (
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
                    <p className="text-slate-500 font-medium">Selected Add-ons:</p>
                    <p className="text-slate-800 font-medium">{selectedEnquiry.selected_addons.join(', ')}</p>
                  </div>
                )}

                {selectedEnquiry.additional_message && (
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
                    <p className="text-slate-500 font-medium">Special Requirements:</p>
                    <p className="text-slate-800 italic">{selectedEnquiry.additional_message}</p>
                  </div>
                )}
              </div>

              <div className="pt-3 flex gap-3">
                <a
                  href={`https://wa.me/91${(selectedEnquiry.phone_number || '').replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(selectedEnquiry.customer_name)}%2C%20thank%20you%20for%20your%20CLEANZX%20car%20cleaning%20enquiry.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 rounded-xl bg-[#25D366] text-white font-semibold text-xs text-center shadow-md"
                >
                  Message Customer on WhatsApp
                </a>
                <button
                  onClick={() => setSelectedEnquiry(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 text-xs cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
