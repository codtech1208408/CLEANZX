import React, { useState } from 'react';
import {
  CreditCard,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Printer,
  X,
  MessageSquare,
  DollarSign,
  Calendar,
  Building,
  Car,
  ShieldCheck,
  Trash2
} from 'lucide-react';
import { useAdminData } from '../../../context/AdminDataContext';

export default function InvoicesTab({ onOpenWhatsApp }) {
  const {
    invoices,
    generateInvoice,
    recordPayment,
    cancelInvoice,
    deleteInvoice,
    cleanOrphanedInvoices,
    customers,
    plans,
    websiteContent
  } = useAdminData();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [recordingPaymentFor, setRecordingPaymentFor] = useState(null);
  const [viewingReceipt, setViewingReceipt] = useState(null);

  // New Invoice Form
  const [invoiceForm, setInvoiceForm] = useState({
    customerId: customers[0]?.id || '',
    planName: 'Monthly Normal Plan',
    baseAmount: 899,
    addonName: '',
    addonAmount: 0,
    discount: 0,
    dueDate: new Date(Date.now() + 5 * 86400000).toISOString().slice(0, 10),
    notes: 'Regular monthly doorstep subscription'
  });

  // Record Payment Form
  const [paymentForm, setPaymentForm] = useState({
    amountPaid: 0,
    paymentMethod: 'UPI',
    transactionRef: '',
    notes: 'Payment confirmed by operations admin'
  });

  // Metrics
  const totalInvoiced = invoices.reduce((acc, i) => acc + (i.total || 0), 0);
  const totalCollected = invoices.reduce((acc, i) => acc + (i.amountPaid || 0), 0);
  const totalOutstanding = invoices.reduce((acc, i) => acc + (i.balance || 0), 0);
  const pendingCount = invoices.filter(i => i.status === 'Pending' || i.status === 'Partially Paid').length;

  // Detect invoices belonging to deleted customers
  const validCustomerIds = new Set(customers.map(c => c.id));
  const validCustomerNames = new Set(customers.map(c => (c.name || '').trim().toLowerCase()));
  const validPhones = new Set(customers.map(c => (c.phone || '').replace(/\D/g, '')).filter(Boolean));

  const orphanedInvoices = invoices.filter(inv => {
    const hasId = inv.customerId && validCustomerIds.has(inv.customerId);
    const hasName = inv.customerName && validCustomerNames.has((inv.customerName || '').trim().toLowerCase());
    const hasPhone = inv.phone && validPhones.has((inv.phone || '').replace(/\D/g, ''));
    return !hasId && !hasName && !hasPhone;
  });

  const filteredInvoices = invoices.filter(inv => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      (inv.invoiceNumber || '').toLowerCase().includes(q) ||
      (inv.customerName || '').toLowerCase().includes(q) ||
      (inv.phone || '').includes(q) ||
      (inv.apartment || '').toLowerCase().includes(q) ||
      (inv.transactionRef || '').toLowerCase().includes(q) ||
      (inv.planName || '').toLowerCase().includes(q);

    const matchesStatus = statusFilter === 'ALL' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleGenerateInvoiceSubmit = (e) => {
    e.preventDefault();
    const customer = customers.find(c => c.id === invoiceForm.customerId);
    if (!customer) return;

    const items = [
      { description: invoiceForm.planName, amount: parseFloat(invoiceForm.baseAmount) || 0 }
    ];

    if (invoiceForm.addonName && invoiceForm.addonAmount > 0) {
      items.push({
        description: `Add-on: ${invoiceForm.addonName}`,
        amount: parseFloat(invoiceForm.addonAmount)
      });
    }

    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const discount = parseFloat(invoiceForm.discount) || 0;
    const total = Math.max(0, subtotal - discount);

    generateInvoice({
      customerId: customer.id,
      customerName: customer.name,
      phone: customer.phone,
      apartment: customer.apartment,
      flat: `${customer.block || ''} - Flat ${customer.flat_number || ''}`.trim(),
      carDetails: `${customer.car_model} (${customer.vehicle_registration_number})`,
      planName: invoiceForm.planName,
      dueDate: invoiceForm.dueDate,
      items,
      subtotal,
      discount,
      total,
      notes: invoiceForm.notes
    });

    setIsGenerateModalOpen(false);
  };

  const handleRecordPaymentSubmit = (e) => {
    e.preventDefault();
    if (!recordingPaymentFor) return;

    recordPayment({
      invoiceId: recordingPaymentFor.id,
      amountPaid: paymentForm.amountPaid,
      paymentMethod: paymentForm.paymentMethod,
      transactionRef: paymentForm.transactionRef || `REF-${Date.now().toString(36).toUpperCase()}`,
      notes: paymentForm.notes
    });

    setRecordingPaymentFor(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Invoices & Payment Records
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Generate invoices, log UPI / Cash receipts, track pending customer balances, and print official statements.
          </p>
        </div>

        <button
          onClick={() => {
            if (customers.length > 0) {
              setInvoiceForm(prev => ({ ...prev, customerId: customers[0].id }));
            }
            setIsGenerateModalOpen(true);
          }}
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm shadow-cyan-600/30"
        >
          <Plus className="w-4 h-4" />
          <span>Generate New Invoice</span>
        </button>
      </div>

      {/* Financial KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Total Invoiced Amount</span>
          <span className="text-3xl font-black text-slate-900 mt-1 block">₹{totalInvoiced.toLocaleString()}</span>
          <span className="text-xs text-slate-400 mt-1 block">{invoices.length} invoices generated</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Recorded Revenue Collected</span>
          <span className="text-3xl font-black text-emerald-600 mt-1 block">₹{totalCollected.toLocaleString()}</span>
          <span className="text-xs text-emerald-700 mt-1 block">{invoices.filter(i => i.status === 'Paid').length} invoices fully paid</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Outstanding Pending Balance</span>
          <span className="text-3xl font-black text-amber-600 mt-1 block">₹{totalOutstanding.toLocaleString()}</span>
          <span className="text-xs text-amber-700 mt-1 block">{pendingCount} invoices pending payment</span>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {[
            { id: 'ALL', label: `All (${invoices.length})` },
            { id: 'Paid', label: 'Paid' },
            { id: 'Pending', label: `Pending (${pendingCount})` },
            { id: 'Partially Paid', label: 'Partially Paid' }
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
            placeholder="Search invoice #, customer..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Orphaned Invoices Notice */}
      {orphanedInvoices.length > 0 && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs text-amber-900 shadow-xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              Found <strong>{orphanedInvoices.length}</strong> invoice(s) for deleted customer accounts (e.g. <strong>{orphanedInvoices[0]?.customerName}</strong>).
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              if (window.confirm(`Delete ${orphanedInvoices.length} invoice(s) for deleted customer(s)?`)) {
                cleanOrphanedInvoices();
              }
            }}
            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs cursor-pointer shadow-xs transition-colors shrink-0 flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Invoices of Deleted Users</span>
          </button>
        </div>
      )}

      {/* Invoices Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Customer Details</th>
                <th className="py-3 px-4">Plan / Items</th>
                <th className="py-3 px-4">Invoice Date</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Paid / Balance</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-slate-400">
                    No invoices found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map(inv => (
                  <tr key={inv.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-800">{inv.invoiceNumber}</td>

                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-900">{inv.customerName}</p>
                      <p className="text-[11px] text-slate-500">{inv.apartment}</p>
                    </td>

                    <td className="py-3 px-4">
                      <p className="font-semibold text-slate-800">{inv.planName}</p>
                      {inv.items?.length > 1 && (
                        <p className="text-[10px] text-cyan-700">+{inv.items.length - 1} extra item(s)</p>
                      )}
                    </td>

                    <td className="py-3 px-4 text-slate-600">{inv.date}</td>

                    <td className="py-3 px-4 font-bold text-slate-900">₹{inv.total}</td>

                    <td className="py-3 px-4">
                      <span className="font-bold text-emerald-600 block">Paid: ₹{inv.amountPaid || 0}</span>
                      {inv.balance > 0 ? (
                        <span className="font-bold text-amber-600 block text-[11px]">Due: ₹{inv.balance}</span>
                      ) : (
                        <span className="text-[10px] text-slate-400">Nil</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-slate-600">
                      {inv.paymentMethod ? (
                        <div>
                          <span className="font-bold text-slate-800">{inv.paymentMethod}</span>
                          {inv.transactionRef && (
                            <span className="block text-[10px] font-mono text-slate-400 truncate max-w-[110px]">
                              {inv.transactionRef}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Unpaid</span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          inv.status === 'Paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : inv.status === 'Partially Paid'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* WhatsApp Reminder / Receipt */}
                        <button
                          onClick={() => onOpenWhatsApp({
                            phone: inv.phone,
                            name: inv.customerName,
                            invoiceNumber: inv.invoiceNumber,
                            amount: inv.balance > 0 ? inv.balance : inv.total,
                            planName: inv.planName,
                            templateType: inv.status === 'Paid' ? 'support' : 'payment'
                          })}
                          className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                          title="WhatsApp Invoice / Reminder"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>

                        {/* View Printable Receipt */}
                        <button
                          onClick={() => setViewingReceipt(inv)}
                          className="p-1.5 text-slate-600 hover:text-cyan-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          title="View & Print Official Receipt"
                        >
                          <FileText className="w-4 h-4" />
                        </button>

                        {/* Record Payment */}
                        {inv.status !== 'Paid' && (
                          <button
                            type="button"
                            onClick={() => {
                              setRecordingPaymentFor(inv);
                              setPaymentForm({
                                amountPaid: inv.balance || inv.total,
                                paymentMethod: 'UPI',
                                transactionRef: '',
                                notes: 'Received via UPI QR'
                              });
                            }}
                            className="px-2.5 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-semibold text-[11px] cursor-pointer"
                          >
                            Pay
                          </button>
                        )}

                        {/* Delete Invoice */}
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Delete invoice ${inv.invoiceNumber} (${inv.customerName}) permanently?`)) {
                              deleteInvoice(inv.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title={`Delete invoice ${inv.invoiceNumber}`}
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

      {/* RECORD PAYMENT MODAL */}
      {recordingPaymentFor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Record Payment</h3>
                <p className="text-xs text-slate-500">{recordingPaymentFor.invoiceNumber} • {recordingPaymentFor.customerName}</p>
              </div>
              <button
                onClick={() => setRecordingPaymentFor(null)}
                className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleRecordPaymentSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Amount to Record (₹)</label>
                <input
                  type="number"
                  required
                  value={paymentForm.amountPaid}
                  onChange={(e) => setPaymentForm({ ...paymentForm, amountPaid: parseFloat(e.target.value) || 0 })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Payment Method</label>
                <select
                  value={paymentForm.paymentMethod}
                  onChange={(e) => setPaymentForm({ ...paymentForm, paymentMethod: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl bg-white"
                >
                  <option value="UPI">UPI (Google Pay / PhonePe / Paytm)</option>
                  <option value="Cash">Cash on Delivery / Direct Cash</option>
                  <option value="Bank Transfer">Bank Transfer (NEFT/IMPS)</option>
                  <option value="Credit/Debit Card">Credit/Debit Card</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Transaction Reference / UTR Number</label>
                <input
                  type="text"
                  value={paymentForm.transactionRef}
                  onChange={(e) => setPaymentForm({ ...paymentForm, transactionRef: e.target.value })}
                  placeholder="e.g. UPI/306124589921 or Cash-Admin"
                  className="w-full p-2.5 border border-slate-300 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Payment Notes</label>
                <input
                  type="text"
                  value={paymentForm.notes}
                  onChange={(e) => setPaymentForm({ ...paymentForm, notes: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRecordingPaymentFor(null)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Save Payment Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GENERATE INVOICE MODAL */}
      {isGenerateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-base">Generate New Invoice</h3>
              <button
                onClick={() => setIsGenerateModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleGenerateInvoiceSubmit} className="p-6 space-y-3 text-xs max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Customer</label>
                <select
                  required
                  value={invoiceForm.customerId}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, customerId: e.target.value })}
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
                  <label className="block font-semibold text-slate-700 mb-1">Plan / Service Item</label>
                  <select
                    value={invoiceForm.planName}
                    onChange={(e) => {
                      const p = plans.find(plan => plan.name === e.target.value);
                      setInvoiceForm({
                        ...invoiceForm,
                        planName: e.target.value,
                        baseAmount: p?.price || 899
                      });
                    }}
                    className="w-full p-2.5 border border-slate-300 rounded-xl bg-white"
                  >
                    {plans.map(p => (
                      <option key={p.id} value={p.name}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Base Price (₹)</label>
                  <input
                    type="number"
                    value={invoiceForm.baseAmount}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, baseAmount: parseFloat(e.target.value) || 0 })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Optional Add-on Item</label>
                  <select
                    value={invoiceForm.addonName}
                    onChange={(e) => {
                      const add = websiteContent.addons.find(a => a.name === e.target.value);
                      setInvoiceForm({
                        ...invoiceForm,
                        addonName: e.target.value,
                        addonAmount: add?.price || 0
                      });
                    }}
                    className="w-full p-2.5 border border-slate-300 rounded-xl bg-white"
                  >
                    <option value="">None</option>
                    {websiteContent.addons.map(a => (
                      <option key={a.id} value={a.name}>{a.name} (₹{a.price})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Add-on Price (₹)</label>
                  <input
                    type="number"
                    value={invoiceForm.addonAmount}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, addonAmount: parseFloat(e.target.value) || 0 })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Discount (₹)</label>
                  <input
                    type="number"
                    value={invoiceForm.discount}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, discount: parseFloat(e.target.value) || 0 })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={invoiceForm.dueDate}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, dueDate: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between font-bold text-slate-900">
                <span>Calculated Total:</span>
                <span className="text-cyan-700 text-sm">
                  ₹{Math.max(0, (parseFloat(invoiceForm.baseAmount) || 0) + (parseFloat(invoiceForm.addonAmount) || 0) - (parseFloat(invoiceForm.discount) || 0))}
                </span>
              </div>

              <div className="bg-slate-50 px-6 py-3 -mx-6 -mb-6 mt-4 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsGenerateModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-semibold shadow-md cursor-pointer"
                >
                  Generate Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRINTABLE RECEIPT MODAL */}
      {viewingReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <span className="font-mono text-xs">Official CLEANZX Invoice Statement</span>
              <button
                onClick={() => setViewingReceipt(null)}
                className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div id="printable-receipt" className="p-8 space-y-6 text-xs text-slate-800 bg-white">
              {/* Receipt Header */}
              <div className="flex items-start justify-between border-b border-slate-200 pb-5">
                <div>
                  <h1 className="text-2xl font-black text-cyan-600 tracking-tight">CLEANZX</h1>
                  <p className="text-[11px] text-slate-500">Premium Doorstep Car Care Services</p>
                  <p className="text-[11px] text-slate-500">Mehdipatnam, Hyderabad, Telangana</p>
                  <p className="text-[11px] text-slate-500">Phone: +91 96427 34252 • cleanzxcare@gmail.com</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-slate-800">{viewingReceipt.invoiceNumber}</span>
                  <p className="text-[11px] text-slate-500 mt-1">Date: {viewingReceipt.date}</p>
                  <span
                    className={`inline-block mt-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      viewingReceipt.status === 'Paid'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-rose-100 text-rose-800 border border-rose-300'
                    }`}
                  >
                    {viewingReceipt.status}
                  </span>
                </div>
              </div>

              {/* Customer Details */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Billed To:</span>
                  <p className="font-bold text-slate-900 text-sm mt-0.5">{viewingReceipt.customerName}</p>
                  <p className="text-slate-600 mt-0.5">{viewingReceipt.apartment}</p>
                  <p className="text-slate-500 font-mono mt-0.5">{viewingReceipt.phone}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Vehicle Serviced:</span>
                  <p className="font-bold text-slate-900 mt-0.5">{viewingReceipt.carDetails}</p>
                  <p className="text-slate-500 mt-0.5">Operating Hours: 06:00 AM - 11:30 AM</p>
                </div>
              </div>

              {/* Line Items */}
              <div>
                <table className="w-full text-left">
                  <thead className="border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                    <tr>
                      <th className="py-2">Item Description</th>
                      <th className="py-2 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {(viewingReceipt.items || [{ description: viewingReceipt.planName, amount: viewingReceipt.total }]).map((item, idx) => (
                      <tr key={idx}>
                        <td className="py-2 text-slate-800">{item.description}</td>
                        <td className="py-2 text-right font-bold text-slate-900">₹{item.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="border-t border-slate-200 pt-3 space-y-1 text-right">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span>₹{viewingReceipt.subtotal || viewingReceipt.total}</span>
                </div>
                {viewingReceipt.discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount:</span>
                    <span>-₹{viewingReceipt.discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total Due:</span>
                  <span className="text-cyan-700">₹{viewingReceipt.total}</span>
                </div>
                <div className="flex justify-between text-slate-700 font-semibold pt-1">
                  <span>Amount Paid:</span>
                  <span className="text-emerald-600">₹{viewingReceipt.amountPaid || 0}</span>
                </div>
              </div>

              {viewingReceipt.transactionRef && (
                <div className="p-3 bg-emerald-50 rounded-xl text-emerald-800 text-[11px] font-mono">
                  Payment Reference: {viewingReceipt.transactionRef} ({viewingReceipt.paymentMethod})
                </div>
              )}
            </div>

            <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex justify-between items-center">
              <span className="text-[11px] text-slate-500">Official receipt from CLEANZX Doorstep Services</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Receipt</span>
                </button>
                <button
                  onClick={() => setViewingReceipt(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-xl cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
