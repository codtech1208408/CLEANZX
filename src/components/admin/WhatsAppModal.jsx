import React, { useState, useEffect } from 'react';
import { X, MessageSquare, Send, CheckCircle2, User, Phone, Sparkles } from 'lucide-react';

export default function WhatsAppModal({ isOpen, onClose, initialData = {} }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [templateType, setTemplateType] = useState('booking');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (initialData) {
      const cleanPhone = (initialData.phone || initialData.phone_number || '').replace(/\D/g, '');
      setPhoneNumber(cleanPhone || '9642734252');
      setCustomerName(initialData.name || initialData.customer_name || 'Valued Customer');
      if (initialData.templateType) {
        setTemplateType(initialData.templateType);
      }
    }
  }, [initialData, isOpen]);

  // Generate templates based on selected type and available metadata
  useEffect(() => {
    const name = customerName || 'Sir/Madam';
    const car = initialData.car || initialData.car_model || 'your vehicle';
    const reg = initialData.regNumber || initialData.vehicle_registration_number || '';
    const apt = initialData.apartment ? `at ${initialData.apartment}` : '';
    const plan = initialData.planName || initialData.preferred_plan || 'Subscription Plan';
    const date = initialData.date || initialData.preferred_start_date || 'scheduled date';
    const time = initialData.timeSlot || initialData.preferred_time || 'morning 6:00 AM - 11:30 AM';
    const invNum = initialData.invoiceNumber || 'INV-2026';
    const amount = initialData.total || initialData.amount || '899';
    const emp = initialData.employeeName || initialData.assigned_employee || 'our specialist';

    let t = '';
    switch (templateType) {
      case 'booking':
        t = `Hello ${name}! 👋\n\nYour doorstep car cleaning booking with CLEANZX ${apt} for ${car} (${reg}) has been *CONFIRMED*!\n\n📅 Date: ${date}\n⏰ Slot: ${time}\n🚗 Plan: ${plan}\n\nOur technician will arrive promptly at your designated parking bay. Thank you for choosing CLEANZX! ✨`;
        break;
      case 'service_done':
        t = `Good morning ${name}! 🌟\n\nYour car ${car} (${reg}) has been *successfully cleaned and detailed* this morning by ${emp}.\n\n✨ Exterior wiped & polished\n✨ Windows & windshield crystal-clear\n✨ Tyres treated\n\nHave a wonderful and smooth drive today! For any feedback, reply to this message. 🚗💨 - Team CLEANZX`;
        break;
      case 'payment':
        t = `Hello ${name}! 👋\n\nGentle reminder from CLEANZX regarding your pending invoice *${invNum}* for ${plan}.\n\n💰 Total Amount: ₹${amount}\n🚗 Vehicle: ${car} (${reg})\n\nPlease complete the payment via UPI to maintain uninterrupted morning service. Let us know if you need any assistance!\n\nThank you, CLEANZX Care.`;
        break;
      case 'renewal':
        t = `Hello ${name}! 🔄\n\nYour CLEANZX doorstep car care subscription for *${car}* is due for renewal soon!\n\n🌟 Current Plan: ${plan}\n📅 Scheduled Renewal: ${date}\n\nRenew your plan now to lock in your preferred early morning slot and enjoy uninterrupted doorstep sparkle! Reply here to confirm. - CLEANZX Team`;
        break;
      case 'support':
      default:
        t = `Hello ${name}, this is CLEANZX Customer Support regarding your doorstep car cleaning service ${apt}.\n\nHow can we help you today?`;
        break;
    }
    setMessage(t);
  }, [templateType, customerName, initialData]);

  if (!isOpen) return null;

  const handleSend = () => {
    let clean = phoneNumber.replace(/\D/g, '');
    if (clean.length === 10) {
      clean = '91' + clean;
    }
    const encoded = encodeURIComponent(message);
    const url = `https://wa.me/${clean}?text=${encoded}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">Send WhatsApp Message</h3>
              <p className="text-xs text-emerald-100">Direct click-to-chat with customer</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-slate-800">
          {/* Recipient Details */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Customer Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  placeholder="Customer Name"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Phone Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  placeholder="10-digit mobile number"
                />
              </div>
            </div>
          </div>

          {/* Quick Template Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Select Pre-Filled Template</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'booking', label: '🚗 Booking Confirm' },
                { id: 'service_done', label: '✨ Service Completed' },
                { id: 'payment', label: '💳 Payment Reminder' },
                { id: 'renewal', label: '🔄 Renewal Alert' },
                { id: 'support', label: '💬 General Support' }
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTemplateType(t.id)}
                  className={`text-xs px-2.5 py-2 rounded-xl font-medium border text-left transition-all cursor-pointer ${
                    templateType === t.id
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-500 font-semibold shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Message Textarea */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Message Preview & Customization</label>
            <textarea
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-3 text-xs sm:text-sm border border-slate-300 rounded-xl font-sans focus:ring-2 focus:ring-emerald-500 focus:outline-none leading-relaxed bg-slate-50"
            />
          </div>

          <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Opens official WhatsApp Web / App directly with this prefilled message.</span>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-xl hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSend}
            className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-md shadow-emerald-600/30 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Open in WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
}
