import React from 'react';
import {
  X,
  Printer,
  Download,
  Share2,
  CheckCircle2,
  Clock,
  Car,
  Building,
  CreditCard,
  FileText,
  ShieldCheck
} from 'lucide-react';

export default function InvoiceModal({ invoice, customer, onClose, onPayNow }) {
  if (!invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  const shareText = `*CLEANZX Invoice Receipt*\nInvoice: ${invoice.invoiceNumber}\nPlan: ${invoice.planName}\nAmount: ₹${invoice.total}\nStatus: ${invoice.status}\nReference: ${invoice.transactionRef || 'N/A'}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 text-slate-800 my-auto">
        {/* Modal Top Actions Bar */}
        <div className="bg-slate-900 px-5 sm:px-6 py-3.5 flex items-center justify-between text-white border-b border-slate-800">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-cyan-400" />
            <span className="text-xs sm:text-sm font-bold tracking-wide">
              Official Tax Invoice & Receipt
            </span>
          </div>

          <div className="flex items-center gap-2">
            {invoice.status !== 'Paid' && onPayNow && (
              <button
                onClick={() => onPayNow(invoice)}
                className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-xs font-black text-white flex items-center gap-1.5 shadow-md shadow-emerald-600/30 transition-all cursor-pointer"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Pay ₹{(invoice.balance !== undefined ? invoice.balance : invoice.total)?.toLocaleString('en-IN')} Online</span>
              </button>
            )}
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-cyan-300 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Print or Save as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print / Download PDF</span>
            </button>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg bg-emerald-600/80 hover:bg-emerald-600 text-white transition-colors"
              title="Share via WhatsApp"
            >
              <Share2 className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Body */}
        <div id="printable-invoice" className="p-6 sm:p-8 bg-white print:p-0">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-6">
            <div>
              <img
                src="/images/logo-light.png"
                alt="CLEANZX"
                className="h-10 sm:h-12 w-auto object-contain mb-1"
              />
              <p className="text-[11px] text-slate-500 font-medium">
                Eco-Friendly Doorstep Car Care Services
              </p>
              <p className="text-[10px] text-slate-400">
                Hyderabad, Telangana • Support: +91 91219 92399 • cleanzx.com
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-1 ${
                  invoice.status === 'Paid'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-amber-100 text-amber-800 border border-amber-300'
                }`}
              >
                ● Payment Status: {invoice.status}
              </span>
              <p className="text-base sm:text-lg font-black text-slate-900 font-mono">
                {invoice.invoiceNumber}
              </p>
              <p className="text-xs text-slate-500">
                Invoice Date: <span className="font-semibold text-slate-700">{invoice.date}</span>
              </p>
            </div>
          </div>

          {/* Billed To & Service Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-6 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Billed Customer
              </p>
              <p className="text-sm font-bold text-slate-900">{invoice.customerName || customer?.name}</p>
              <p className="text-slate-600 font-medium mt-0.5">{invoice.phone || customer?.phone}</p>
              <p className="text-slate-500 mt-1 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{invoice.apartment || customer?.apartment}, {invoice.flat || `${customer?.block || ''} - ${customer?.flat_number || ''}`}</span>
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Vehicle & Plan Details
              </p>
              <p className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Car className="w-3.5 h-3.5 text-[#1677FF]" />
                <span>{invoice.carDetails || `${customer?.car_model || ''} (${customer?.vehicle_registration_number || ''})`}</span>
              </p>
              <p className="text-slate-600 font-medium mt-1">
                Plan: <span className="text-[#1677FF] font-semibold">{invoice.planName}</span>
              </p>
              <p className="text-slate-500 mt-0.5">
                Service Slot: 6:00 AM – 11:30 AM Morning Window
              </p>
            </div>
          </div>

          {/* Itemized Line Items Table */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden mb-6">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/80 text-slate-600 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(invoice.items && invoice.items.length > 0) ? (
                  invoice.items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3 text-slate-800 font-medium">
                        {item.description}
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-slate-900">
                        ₹{item.amount?.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-4 py-3 text-slate-800 font-medium">
                      {invoice.planName} (Doorstep Morning Car Care)
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-slate-900">
                      ₹{invoice.total?.toLocaleString('en-IN')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Calculations Breakdown */}
            <div className="bg-slate-50/70 p-4 border-t border-slate-200 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-mono">₹{(invoice.subtotal || invoice.total)?.toLocaleString('en-IN')}</span>
              </div>
              {invoice.discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Special Promo / Community Discount:</span>
                  <span className="font-mono">-₹{invoice.discount?.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
                <span>Total Amount Payable:</span>
                <span className="font-mono text-[#1677FF]">₹{invoice.total?.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-600 pt-1">
                <span>Amount Paid:</span>
                <span className="font-mono text-emerald-700 font-bold">₹{(invoice.amountPaid || invoice.total)?.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Balance Due:</span>
                <span className="font-mono font-bold text-slate-900">₹{(invoice.balance || 0)?.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Payment Reference & Security Verification */}
          <div className="p-4 rounded-2xl bg-cyan-50/60 border border-cyan-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-900">Payment Verification</p>
                <p className="text-slate-600 text-[11px]">
                  Method: <span className="font-semibold">{invoice.paymentMethod || 'UPI / Online'}</span> • Reference:{' '}
                  <span className="font-mono font-semibold text-slate-800">{invoice.transactionRef || 'CLEANZX-VERIFIED'}</span>
                </p>
                {invoice.paymentDate && (
                  <p className="text-[10px] text-slate-500">Processed on {invoice.paymentDate}</p>
                )}
              </div>
            </div>

            <div className="text-left sm:text-right shrink-0">
              <span className="text-[10px] font-semibold text-slate-400 block">Digitally Certified</span>
              <span className="text-xs font-black text-slate-800 tracking-wider">CLEANZX AUTOMATION</span>
            </div>
          </div>

          {/* Footer Terms */}
          <div className="mt-6 pt-4 border-t border-slate-200 text-center text-[10px] text-slate-400">
            Thank you for trusting CLEANZX with your daily car care. For questions or service alterations, message our WhatsApp helpline at +91 91219 92399.
          </div>
        </div>
      </div>
    </div>
  );
}
