import React, { useState } from 'react';
import {
  X,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Copy,
  Check,
  Smartphone,
  ExternalLink,
  Download
} from 'lucide-react';

export default function PaymentModal({
  isOpen,
  onClose,
  onPaymentSuccess,
  paymentData = {}
}) {
  if (!isOpen) return null;

  const {
    amount = 1499,
    planName = 'Monthly Doorstep Car Care',
    invoiceId = null,
    customerName = 'Customer',
    phone = '',
    apartment = 'Prestige High Fields',
    vehicle = 'HYUNDAI TS09EZ7895'
  } = paymentData;

  const [utrNumber, setUtrNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(null);
  const [copiedUpi, setCopiedUpi] = useState(false);

  const officialUpiId = '9912234252-4@ybl';
  const displayAmount = Number(amount) || 1499;
  const basePrice = Math.round(displayAmount / 1.18);
  const gstAmount = displayAmount - basePrice;

  const handleCopyUpi = () => {
    navigator.clipboard?.writeText(officialUpiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const handleProcessPayment = (e) => {
    if (e) e.preventDefault();
    setIsProcessing(true);

    // Simulate verification handshake
    setTimeout(() => {
      const generatedRef = utrNumber.trim() || ('TXN-' + Math.random().toString(36).substring(2, 8).toUpperCase() + '-' + Date.now().toString().slice(-4));
      const successData = {
        amount: displayAmount,
        transactionRef: generatedRef,
        paymentMethod: 'UPI QR Code (PhonePe / SBI)',
        invoiceId,
        planName,
        customerName,
        phone,
        apartment,
        date: new Date().toISOString().slice(0, 10),
        time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
      };

      setIsProcessing(false);
      setPaymentSuccess(successData);

      if (onPaymentSuccess) {
        onPaymentSuccess(successData);
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden text-slate-900 my-auto">
        {/* Top Header */}
        <div className="bg-slate-50 px-5 sm:px-6 py-4 flex items-center justify-between border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-50 text-cyan-700 border border-cyan-200 flex items-center justify-center">
              <QrCode className="w-5 h-5 text-cyan-600" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
                <span>Scan QR Code to Pay</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Instant Verification
                </span>
              </h3>
              <p className="text-[11px] text-slate-500">
                Official CleanZX PhonePe UPI Payment Gateway
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {!paymentSuccess ? (
          <div>
            {/* Order / Bill Summary Banner */}
            <div className="bg-slate-50/80 p-4 sm:p-5 border-b border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-cyan-700 tracking-wider block">
                    Paying For
                  </span>
                  <h4 className="text-base sm:text-lg font-black text-slate-900">
                    {planName}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                    <span className="font-semibold text-slate-800">{customerName}</span>
                    <span>•</span>
                    <span className="text-cyan-700 font-mono font-bold">{vehicle}</span>
                    <span>•</span>
                    <span>{apartment}</span>
                  </div>
                </div>

                <div className="text-left sm:text-right bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-xs shrink-0">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Total Payable</span>
                  <span className="text-2xl font-black text-emerald-600 font-mono">
                    ₹{displayAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            {/* Main QR Code Presentation */}
            <div className="p-5 space-y-4">
              <div className="flex flex-col items-center justify-center text-center">
                {/* Official User QR Code Image Card */}
                <div className="p-4 bg-white rounded-3xl shadow-lg border border-slate-200 relative inline-flex flex-col items-center max-w-[280px]">
                  {/* Decorative Scanner Target Corners */}
                  <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-cyan-500 rounded-tl-lg" />
                  <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-cyan-500 rounded-tr-lg" />
                  <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-cyan-500 rounded-bl-lg" />
                  <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-cyan-500 rounded-br-lg" />

                  <img
                    src="/images/cleanzx-phonepe-qr.png"
                    alt="CleanZX Official PhonePe UPI QR Code"
                    className="w-56 h-auto object-contain rounded-xl"
                    onError={(e) => {
                      e.target.src = '/images/cleanzx-qr-cropped.png';
                    }}
                  />
                  <div className="mt-2 text-[11px] font-bold text-slate-600 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Verified Merchant: CleanZX Car Care</span>
                  </div>
                </div>

                {/* Supported Apps Badges */}
                <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3 text-[11px] font-semibold">
                  <span className="px-2 py-0.5 rounded-lg bg-purple-50 text-[#5f259f] border border-purple-200 font-bold">PhonePe</span>
                  <span className="px-2 py-0.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 font-bold">GPay</span>
                  <span className="px-2 py-0.5 rounded-lg bg-sky-50 text-sky-700 border border-sky-200 font-bold">Paytm</span>
                  <span className="px-2 py-0.5 rounded-lg bg-orange-50 text-orange-700 border border-orange-200 font-bold">BHIM</span>
                  <span className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">Any UPI</span>
                </div>

                {/* Official UPI ID Copy Field */}
                <div className="mt-3 flex items-center justify-between gap-2 w-full max-w-sm bg-slate-50 px-3.5 py-2 rounded-2xl border border-slate-200 text-xs font-mono">
                  <div className="text-left">
                    <span className="text-[10px] text-slate-400 block uppercase font-sans font-semibold">UPI ID / VPA</span>
                    <span className="text-cyan-800 font-bold">{officialUpiId}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-sans">
                    <button
                      type="button"
                      onClick={handleCopyUpi}
                      className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-[11px] font-semibold flex items-center gap-1.5 border border-slate-200 cursor-pointer transition-colors shadow-2xs"
                    >
                      {copiedUpi ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700 font-bold">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-cyan-600" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                    <a
                      href="/images/cleanzx-phonepe-qr.png"
                      download="CleanZX-PhonePe-QR.png"
                      className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-[11px] font-semibold flex items-center gap-1 border border-slate-200 cursor-pointer transition-colors shadow-2xs"
                      title="Download QR"
                    >
                      <Download className="w-3.5 h-3.5 text-slate-600" />
                      <span>Save</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Mobile direct UPI payment link */}
              <a
                href={`upi://pay?pa=${officialUpiId}&pn=CleanZX%20Car%20Care&am=${displayAmount}&cu=INR`}
                className="sm:hidden w-full py-2.5 rounded-2xl bg-[#5f259f] hover:bg-[#4d1d82] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <Smartphone className="w-4 h-4" />
                <span>Open in Installed UPI App</span>
              </a>

              {/* Optional UTR / Reference Input */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2">
                <label className="block text-xs font-semibold text-slate-700">
                  12-Digit UPI Transaction ID / UTR (Optional)
                </label>
                <input
                  type="text"
                  maxLength={16}
                  value={utrNumber}
                  onChange={(e) => setUtrNumber(e.target.value.replace(/[^a-zA-Z0-9]/g, ''))}
                  placeholder="e.g. 428912345678 (from PhonePe / GPay receipt)"
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs font-mono placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                />
                <p className="text-[10px] text-slate-500">
                  Scan and pay from your phone, then click below to immediately verify and activate your service.
                </p>
              </div>

              {/* Price Breakdown Summary */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Base Service Charge:</span>
                  <span className="font-mono text-slate-800">₹{basePrice.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Integrated GST (18%):</span>
                  <span className="font-mono text-slate-800">₹{gstAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-900 font-bold pt-1 border-t border-slate-200 text-sm">
                  <span>Net Amount Payable:</span>
                  <span className="font-mono text-emerald-600 font-black">₹{displayAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Confirm & Complete Payment Button */}
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleProcessPayment}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 hover:from-emerald-500 hover:to-cyan-400 text-white font-black text-sm shadow-xl shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Confirming Payment of ₹{displayAmount}...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>I Have Paid ₹{displayAmount.toLocaleString('en-IN')} — Confirm</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-3 text-[10px] text-slate-500 pt-0.5">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-600" />
                  Direct UPI Settlement
                </span>
                <span>•</span>
                <span>Instant Account Activation</span>
                <span>•</span>
                <span>Official Tax Invoice</span>
              </div>
            </div>
          </div>
        ) : (
          /* ========================================================= */
          /* SUCCESS STATE */
          /* ========================================================= */
          <div className="p-6 sm:p-8 text-center space-y-5 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
              <CheckCircle2 className="w-10 h-10 text-emerald-600" />
            </div>

            <div>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold uppercase tracking-wider inline-block mb-2">
                Payment Received
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                ₹{paymentSuccess.amount.toLocaleString('en-IN')} Confirmed!
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Your payment for <strong className="text-slate-900">{paymentSuccess.planName}</strong> has been recorded and your service is active.
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left text-xs space-y-2">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Transaction Ref / UTR:</span>
                <span className="font-mono text-cyan-700 font-bold">{paymentSuccess.transactionRef}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Payment Mode:</span>
                <span className="text-slate-900 font-semibold">{paymentSuccess.paymentMethod}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Customer & Vehicle:</span>
                <span className="text-slate-900 font-semibold">{paymentSuccess.customerName} ({vehicle})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Date & Time:</span>
                <span className="text-slate-700 font-mono">{paymentSuccess.date} • {paymentSuccess.time}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:flex-1 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
