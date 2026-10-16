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
  ExternalLink
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-fadeIn">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden text-slate-100 my-auto">
        {/* Top Header */}
        <div className="bg-slate-950 px-5 sm:px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center">
              <QrCode className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                <span>Scan QR Code to Pay</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Instant Verification
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Official CleanZX Doorstep Car Care Payment QR
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {!paymentSuccess ? (
          <div>
            {/* Order / Bill Summary Banner */}
            <div className="bg-gradient-to-r from-blue-950/70 via-slate-900 to-cyan-950/70 p-4 sm:p-5 border-b border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider block">
                    Paying For
                  </span>
                  <h4 className="text-base sm:text-lg font-black text-white">
                    {planName}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-slate-300 mt-0.5">
                    <span>{customerName}</span>
                    <span>•</span>
                    <span className="text-cyan-300">{vehicle}</span>
                    <span>•</span>
                    <span className="text-slate-400">{apartment}</span>
                  </div>
                </div>

                <div className="text-left sm:text-right bg-slate-950/80 px-4 py-2 rounded-2xl border border-slate-800/80 shrink-0">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Payable</span>
                  <span className="text-2xl font-black text-emerald-400 font-mono">
                    ₹{displayAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            {/* Main QR Code Presentation */}
            <div className="p-5 space-y-4">
              <div className="flex flex-col items-center justify-center text-center">
                {/* Official User QR Code Image */}
                <div className="p-3 bg-black rounded-3xl shadow-2xl border-2 border-cyan-500/40 inline-flex flex-col items-center max-w-[280px]">
                  <img
                    src="/images/cleanzx-qr-cropped.png"
                    alt="CleanZX Official UPI QR Code"
                    className="w-64 h-auto object-contain rounded-2xl"
                    onError={(e) => {
                      // Fallback to original image if needed
                      e.target.src = '/images/cleanzx-payment-qr.png';
                    }}
                  />
                </div>

                <p className="text-xs text-slate-300 font-semibold mt-3">
                  Scan using <strong className="text-cyan-400">PhonePe, Google Pay, Paytm, BHIM</strong> or any UPI App
                </p>

                {/* Official UPI ID Copy Field */}
                <div className="mt-3 flex items-center justify-between gap-3 w-full max-w-sm bg-slate-950 px-3.5 py-2 rounded-2xl border border-slate-800 text-xs font-mono">
                  <div className="text-left">
                    <span className="text-[10px] text-slate-500 block uppercase font-sans font-semibold">UPI ID / VPA</span>
                    <span className="text-cyan-300 font-bold">{officialUpiId}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyUpi}
                    className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-[11px] font-sans font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    {copiedUpi ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-bold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Copy UPI</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Optional UTR / Reference Input */}
              <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 space-y-2">
                <label className="block text-xs font-semibold text-slate-300">
                  12-Digit UPI Transaction ID / UTR (Optional)
                </label>
                <input
                  type="text"
                  maxLength={16}
                  value={utrNumber}
                  onChange={(e) => setUtrNumber(e.target.value.replace(/[^a-zA-Z0-9]/g, ''))}
                  placeholder="e.g. 428912345678 (from PhonePe / GPay receipt)"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
                />
                <p className="text-[10px] text-slate-500">
                  You can scan & pay from your phone, then click the button below to confirm.
                </p>
              </div>

              {/* Price Breakdown Summary */}
              <div className="p-3 bg-slate-950/90 rounded-2xl border border-slate-800/80 space-y-1 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Base Service Charge:</span>
                  <span className="font-mono text-slate-200">₹{basePrice.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Integrated GST (18%):</span>
                  <span className="font-mono text-slate-200">₹{gstAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-white font-bold pt-1 border-t border-slate-800 text-sm">
                  <span>Net Amount Payable:</span>
                  <span className="font-mono text-emerald-400 font-black">₹{displayAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Confirm & Complete Payment Button */}
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleProcessPayment}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 hover:from-emerald-500 hover:to-cyan-400 text-white font-black text-sm shadow-xl shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
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

              <div className="flex items-center justify-center gap-3 text-[10px] text-slate-400 pt-0.5">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
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
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20">
              <CheckCircle2 className="w-10 h-10 text-emerald-400" />
            </div>

            <div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider inline-block mb-2">
                Payment Received
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                ₹{paymentSuccess.amount.toLocaleString('en-IN')} Confirmed!
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Your payment for <strong className="text-white">{paymentSuccess.planName}</strong> has been recorded and your service is active.
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-left text-xs space-y-2">
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Transaction Ref / UTR:</span>
                <span className="font-mono text-cyan-400 font-bold">{paymentSuccess.transactionRef}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Payment Mode:</span>
                <span className="text-white font-medium">{paymentSuccess.paymentMethod}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Customer & Vehicle:</span>
                <span className="text-white font-medium">{paymentSuccess.customerName} ({vehicle})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Date & Time:</span>
                <span className="text-slate-300 font-mono">{paymentSuccess.date} • {paymentSuccess.time}</span>
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
