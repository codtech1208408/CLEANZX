import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  MessageSquare,
  Car,
  Building,
  Phone,
  Mail,
  Calendar,
  CreditCard,
  X,
  Save,
  CheckCircle2,
  AlertCircle,
  Clock,
  FileText,
  Key,
  Eye,
  EyeOff,
  Copy,
  Check,
  Lock
} from 'lucide-react';
import { useAdminData } from '../../../context/AdminDataContext';

export default function CustomersTab({ onOpenWhatsApp }) {
  const {
    customers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    subscriptions,
    bookings,
    invoices,
    plans
  } = useAdminData();

  const [searchTerm, setSearchTerm] = useState('');
  const [apartmentFilter, setApartmentFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Customer Profile Detail Modal
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [profileTab, setProfileTab] = useState('overview'); // 'overview' | 'subscriptions' | 'bookings' | 'invoices'

  // New / Edit Customer Modal
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [isNewCustomer, setIsNewCustomer] = useState(false);
  const [showModalPassword, setShowModalPassword] = useState(false);
  const [revealedCustPasswords, setRevealedCustPasswords] = useState({});
  const [copiedCustId, setCopiedCustId] = useState(null);

  const toggleCustPasswordReveal = (id) => {
    setRevealedCustPasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const copyCustomerCredentials = (cust) => {
    const credText = `CleanZX Customer Portal\nURL: ${window.location.origin}/login\nRegistered Mobile: ${cust.phone}\nEmail: ${cust.email || 'N/A'}\nPassword: ${cust.password || 'clean@2026'}`;
    navigator.clipboard?.writeText(credText);
    setCopiedCustId(cust.id);
    setTimeout(() => setCopiedCustId(null), 2500);
  };

  // Distinct apartments for filter
  const apartments = Array.from(new Set(customers.map(c => c.apartment).filter(Boolean)));

  // Filtered customers
  const filteredCustomers = customers.filter(c => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      (c.name || '').toLowerCase().includes(q) ||
      (c.phone || '').includes(q) ||
      (c.vehicle_registration_number || '').toLowerCase().includes(q) ||
      (c.apartment || '').toLowerCase().includes(q) ||
      (c.car_model || '').toLowerCase().includes(q) ||
      (c.flat_number || '').toLowerCase().includes(q);

    const matchesApartment = apartmentFilter === 'ALL' || c.apartment === apartmentFilter;
    const matchesStatus = statusFilter === 'ALL' || c.subscriptionStatus === statusFilter;

    return matchesSearch && matchesApartment && matchesStatus;
  });

  const handleSaveCustomer = (e) => {
    e.preventDefault();
    if (!editingCustomer.name || !editingCustomer.phone) {
      alert('Name and Phone Number are required.');
      return;
    }

    if (isNewCustomer) {
      addCustomer(editingCustomer);
    } else {
      updateCustomer(editingCustomer.id, editingCustomer);
    }
    setEditingCustomer(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Customer Management
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Search, filter, update details, view subscriptions, booking history, invoices, and launch WhatsApp communication.
          </p>
        </div>

        <button
          onClick={() => {
            setIsNewCustomer(true);
            setEditingCustomer({
              name: '',
              phone: '',
              email: '',
              password: 'clean@2026',
              apartment: 'Prestige High Fields',
              block: 'Tower 1',
              flat_number: '',
              car_model: '',
              vehicle_registration_number: '',
              carType: 'Sedan',
              activePlan: 'Monthly Normal Plan',
              subscriptionStatus: 'Active',
              paymentStatus: 'Paid',
              notes: ''
            });
          }}
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm shadow-cyan-600/30"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Customer</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by customer name, phone, apartment, flat, or vehicle reg..."
            className="w-full pl-10 pr-4 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={apartmentFilter}
            onChange={(e) => setApartmentFilter(e.target.value)}
            className="p-2 text-xs border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-cyan-500"
          >
            <option value="ALL">All Apartments ({apartments.length})</option>
            {apartments.map(apt => (
              <option key={apt} value={apt}>{apt}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 text-xs border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-cyan-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Expired">Expired</option>
          </select>
        </div>
      </div>

      {/* Customer Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Customer Details</th>
                <th className="py-3.5 px-4">Apartment & Flat</th>
                <th className="py-3.5 px-4">Vehicle Details</th>
                <th className="py-3.5 px-4">Active Plan</th>
                <th className="py-3.5 px-4">Payment Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400">
                    No customers found matching search and filter criteria.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map(cust => (
                  <tr key={cust.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Customer Details */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                          {cust.name?.charAt(0) || 'C'}
                        </div>
                        <div>
                          <button
                            onClick={() => {
                              setSelectedCustomer(cust);
                              setProfileTab('overview');
                            }}
                            className="font-bold text-slate-900 hover:text-cyan-600 text-left transition-colors cursor-pointer"
                          >
                            {cust.name}
                          </button>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                            <span className="font-mono">{cust.phone}</span>
                            {cust.email && <span className="truncate max-w-[120px]"> • {cust.email}</span>}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Apartment & Flat */}
                    <td className="py-3 px-4">
                      <p className="font-semibold text-slate-800">{cust.apartment}</p>
                      <p className="text-[11px] text-slate-500">
                        {cust.block ? `${cust.block}, ` : ''}Flat {cust.flat_number}
                      </p>
                    </td>

                    {/* Vehicle */}
                    <td className="py-3 px-4">
                      <p className="font-semibold text-slate-800">{cust.car_model}</p>
                      <span className="inline-block mt-0.5 font-mono text-[10px] font-bold px-2 py-0.5 bg-slate-100 border border-slate-300 rounded text-slate-700">
                        {cust.vehicle_registration_number}
                      </span>
                    </td>

                    {/* Plan */}
                    <td className="py-3 px-4">
                      <p className="font-semibold text-slate-800">{cust.activePlan || 'No Active Plan'}</p>
                      <span
                        className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          cust.subscriptionStatus === 'Active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : cust.subscriptionStatus === 'Pending'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {cust.subscriptionStatus || 'Inactive'}
                      </span>
                    </td>

                    {/* Payment Status */}
                    <td className="py-3 px-4">
                      {cust.balanceDue > 0 ? (
                        <div>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                            Due ₹{cust.balanceDue}
                          </span>
                        </div>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          Paid
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onOpenWhatsApp({
                            phone: cust.phone,
                            name: cust.name,
                            car: cust.car_model,
                            regNumber: cust.vehicle_registration_number,
                            apartment: cust.apartment,
                            templateType: 'support'
                          })}
                          className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                          title="Open WhatsApp Chat"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedCustomer(cust);
                            setProfileTab('overview');
                          }}
                          className="p-1.5 text-slate-600 hover:text-cyan-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          title="View Full Profile"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setIsNewCustomer(false);
                            setEditingCustomer({ ...cust });
                          }}
                          className="p-1.5 text-slate-600 hover:text-cyan-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          title="Edit Customer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete customer ${cust.name}?`)) {
                              deleteCustomer(cust.id);
                            }
                          }}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete Customer"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* CUSTOMER PROFILE DRAWER / MODAL */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl border border-slate-200 overflow-hidden">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-cyan-600 flex items-center justify-center font-bold text-base">
                  {selectedCustomer.name?.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-base leading-tight">{selectedCustomer.name}</h3>
                  <p className="text-xs text-slate-400">
                    {selectedCustomer.apartment} • Flat {selectedCustomer.flat_number} • ID: {selectedCustomer.id}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Profile Navigation Tabs */}
            <div className="flex items-center gap-2 px-6 pt-4 border-b border-slate-200 bg-slate-50">
              {[
                { id: 'overview', label: 'Overview & Details' },
                { id: 'subscriptions', label: 'Subscriptions' },
                { id: 'bookings', label: 'Booking History' },
                { id: 'invoices', label: 'Invoices & Payments' }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setProfileTab(t.id)}
                  className={`px-4 py-2 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
                    profileTab === t.id
                      ? 'border-cyan-600 text-cyan-700 bg-white rounded-t-xl'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Content Body */}
            <div className="p-6 max-h-[60vh] overflow-y-auto text-xs space-y-4">
              {profileTab === 'overview' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
                      <span className="text-[11px] text-slate-500 block">Phone & WhatsApp</span>
                      <span className="font-bold text-slate-900 font-mono text-sm">{selectedCustomer.phone}</span>
                    </div>
                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
                      <span className="text-[11px] text-slate-500 block">Email Address</span>
                      <span className="font-bold text-slate-900">{selectedCustomer.email || 'N/A'}</span>
                    </div>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
                    <span className="text-[11px] text-slate-500 block">Registered Vehicle</span>
                    <p className="font-bold text-slate-900 text-sm mt-0.5">{selectedCustomer.car_model}</p>
                    <p className="font-mono text-cyan-700 font-bold mt-0.5">{selectedCustomer.vehicle_registration_number}</p>
                  </div>

                  {selectedCustomer.notes && (
                    <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900">
                      <span className="font-bold block mb-1">Customer Notes:</span>
                      <p className="leading-relaxed">{selectedCustomer.notes}</p>
                    </div>
                  )}

                  {/* Customer Portal Login Credentials Box */}
                  <div className="p-4 bg-slate-900 rounded-2xl text-slate-200 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 font-bold text-cyan-400 text-xs uppercase tracking-wider">
                        <Key className="w-4 h-4 text-cyan-400" />
                        Customer Portal Login Credentials
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Self-Service Enabled
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                      <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60 truncate">
                        <span className="text-[10px] text-slate-400 block uppercase font-sans">Login Identifier (Mobile)</span>
                        <span className="text-white font-semibold truncate block">{selectedCustomer.phone}</span>
                      </div>

                      <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60 flex items-center justify-between">
                        <div className="truncate">
                          <span className="text-[10px] text-slate-400 block uppercase font-sans">Password</span>
                          <span className="text-white font-semibold block">
                            {revealedCustPasswords[selectedCustomer.id] ? (selectedCustomer.password || 'clean@2026') : '••••••••'}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleCustPasswordReveal(selectedCustomer.id)}
                          className="text-slate-400 hover:text-white p-1 ml-1 cursor-pointer"
                          title={revealedCustPasswords[selectedCustomer.id] ? "Hide Password" : "Show Password"}
                        >
                          {revealedCustPasswords[selectedCustomer.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => copyCustomerCredentials(selectedCustomer)}
                        className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        {copiedCustId === selectedCustomer.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedCustId === selectedCustomer.id ? 'Copied Login Details!' : 'Copy Credentials'}</span>
                      </button>

                      <a
                        href={`https://wa.me/91${(selectedCustomer.phone || '').replace(/\D/g, '')}?text=${encodeURIComponent(
                          `Hello ${selectedCustomer.name},\nHere are your CleanZX Customer Portal login credentials:\n\n📱 Login URL: ${window.location.origin}/login\n👤 Username / Mobile: ${selectedCustomer.phone}\n🔑 Password: ${selectedCustomer.password || 'clean@2026'}\n\nPlease log in to view your doorstep car cleaning schedule, track morning service updates, and manage your subscription.`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        title="Send login credentials to customer via WhatsApp"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Send via WhatsApp</span>
                      </a>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center gap-3">
                    <button
                      onClick={() => onOpenWhatsApp({
                        phone: selectedCustomer.phone,
                        name: selectedCustomer.name,
                        car: selectedCustomer.car_model,
                        templateType: 'support'
                      })}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold flex items-center gap-2 cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Chat on WhatsApp</span>
                    </button>
                  </div>
                </div>
              )}

              {profileTab === 'subscriptions' && (
                <div className="space-y-3">
                  {subscriptions.filter(s => s.customerId === selectedCustomer.id || s.customerName === selectedCustomer.name).map(sub => (
                    <div key={sub.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{sub.planName}</span>
                          <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded-full">
                            {sub.status}
                          </span>
                        </div>
                        <p className="text-slate-500 mt-1">Period: {sub.startDate} to {sub.expiryDate}</p>
                        <p className="text-cyan-700 font-bold mt-0.5">₹{sub.amount} • Slot: {sub.timeSlot}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {profileTab === 'bookings' && (
                <div className="space-y-3">
                  {bookings.filter(b => b.customer_name === selectedCustomer.name || b.phone_number === selectedCustomer.phone).map(b => (
                    <div key={b.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{b.preferred_plan}</span>
                          <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-100 text-blue-800 rounded-full">
                            {b.status}
                          </span>
                        </div>
                        <p className="text-slate-500 mt-1">Scheduled: {b.preferred_start_date} ({b.preferred_time})</p>
                        <p className="text-slate-600 text-[11px]">Specialist: {b.assigned_employee || 'Unassigned'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {profileTab === 'invoices' && (
                <div className="space-y-3">
                  {invoices.filter(i => i.customerId === selectedCustomer.id || i.customerName === selectedCustomer.name).map(inv => (
                    <div key={inv.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{inv.invoiceNumber}</span>
                          <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded-full">
                            {inv.status}
                          </span>
                        </div>
                        <p className="text-slate-500 mt-1">Date: {inv.date} • Total: ₹{inv.total}</p>
                        <p className="text-emerald-700 font-bold mt-0.5">Paid: ₹{inv.amountPaid} via {inv.paymentMethod || 'Pending'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE / EDIT CUSTOMER MODAL */}
      {editingCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-base">{isNewCustomer ? 'Add New Customer' : 'Edit Customer'}</h3>
              <button
                onClick={() => setEditingCustomer(null)}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCustomer} className="p-6 space-y-3 text-xs max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Customer Full Name *</label>
                  <input
                    type="text"
                    required
                    value={editingCustomer.name}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, name: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mobile Number *</label>
                  <input
                    type="text"
                    required
                    value={editingCustomer.phone}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, phone: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={editingCustomer.email}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, email: e.target.value })}
                    placeholder="e.g. customer@gmail.com"
                    className="w-full p-2.5 border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-semibold text-slate-700 flex items-center gap-1">
                      <Key className="w-3.5 h-3.5 text-cyan-600" />
                      <span>Customer Portal Password *</span>
                    </label>
                    <span className="text-[10px] text-cyan-700 bg-cyan-50 px-1.5 py-0.5 rounded font-medium">
                      For /login
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type={showModalPassword ? 'text' : 'password'}
                      value={editingCustomer.password || ''}
                      onChange={(e) => setEditingCustomer({ ...editingCustomer, password: e.target.value })}
                      placeholder="e.g. clean@2026 or set custom password"
                      className="w-full p-2.5 pr-9 border border-slate-300 rounded-xl bg-white font-mono text-xs focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowModalPassword(!showModalPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      title={showModalPassword ? "Hide Password" : "Show Password"}
                    >
                      {showModalPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-cyan-50/70 border border-cyan-200/80 rounded-2xl flex items-start gap-2.5 text-slate-700">
                <Key className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
                <div className="text-[11px] leading-relaxed">
                  <p className="font-semibold text-cyan-900">Customer Self-Service Login Access</p>
                  <p className="text-slate-600 mt-0.5">
                    Give this password to the customer. They can sign in directly at <strong>/login</strong> using their registered mobile number <strong>{editingCustomer.phone || '(Mobile)'}</strong> or email.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Apartment / Society</label>
                  <input
                    type="text"
                    value={editingCustomer.apartment}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, apartment: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Block / Tower</label>
                  <input
                    type="text"
                    value={editingCustomer.block}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, block: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Flat Number</label>
                  <input
                    type="text"
                    value={editingCustomer.flat_number}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, flat_number: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Car Model & Color</label>
                  <input
                    type="text"
                    value={editingCustomer.car_model}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, car_model: e.target.value })}
                    placeholder="e.g. Hyundai Creta (White)"
                    className="w-full p-2.5 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Vehicle Registration #</label>
                  <input
                    type="text"
                    value={editingCustomer.vehicle_registration_number}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, vehicle_registration_number: e.target.value })}
                    placeholder="e.g. TS 09 EZ 4412"
                    className="w-full p-2.5 border border-slate-300 rounded-xl font-mono uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assigned Plan</label>
                <select
                  value={editingCustomer.activePlan}
                  onChange={(e) => setEditingCustomer({ ...editingCustomer, activePlan: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl bg-white"
                >
                  {plans.map(p => (
                    <option key={p.id} value={p.name}>{p.name} (₹{p.price})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Parking Bay / Service Notes</label>
                <textarea
                  rows={2}
                  value={editingCustomer.notes}
                  onChange={(e) => setEditingCustomer({ ...editingCustomer, notes: e.target.value })}
                  placeholder="e.g. Basement 2 Bay 114, morning slot preferred"
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="bg-slate-50 px-6 py-3 -mx-6 -mb-6 mt-4 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingCustomer(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-semibold shadow-md cursor-pointer"
                >
                  Save Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
