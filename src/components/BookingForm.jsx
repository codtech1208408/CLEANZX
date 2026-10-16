import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle, Loader2, Send, MessageSquare, Car, Building, User, Calendar, Clock, ShieldCheck, Sparkles } from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { OPTIONAL_ADDONS, SERVICE_TIME_SLOTS, BUSINESS_INFO } from '../data/websiteData';

export default function BookingForm({ initialPlan = null, title, subtitle }) {
  const { plans, selectedPlan, setSelectedPlan, selectedAddons, toggleAddon, submitEnquiry, backendAvailable } = useBooking();

  const activePlans = (plans && plans.length > 0) ? plans.filter(p => p.status !== 'Inactive') : [];
  const normalPlans = activePlans.filter(p => p.category === 'Normal');
  const premiumPlans = activePlans.filter(p => p.category === 'Premium');

  const [formData, setFormData] = useState({
    customer_name: '',
    phone_number: '',
    apartment: '',
    block: '',
    flat_number: '',
    car_model: '',
    vehicle_registration_number: '',
    preferred_plan: initialPlan || selectedPlan || 'Monthly Normal Plan',
    preferred_start_date: '',
    preferred_time: '',
    additional_message: ''
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [submittedData, setSubmittedData] = useState(null);

  // Sync when selectedPlan from context changes
  useEffect(() => {
    if (selectedPlan) {
      let normalized = selectedPlan;
      if (selectedPlan === 'Normal Plan' || selectedPlan === 'Monthly Plan') normalized = 'Monthly Normal Plan';
      else if (selectedPlan === 'Premium Plan') normalized = 'Monthly Premium Plan';
      else if (selectedPlan === '15-Day Plan') normalized = '15-Day Normal Plan';
      else if (selectedPlan === 'Quarterly Plan') normalized = 'Quarterly Premium Plan';
      else if (selectedPlan === 'Half-Yearly Plan') normalized = 'Half-Yearly Premium Plan';
      setFormData(prev => ({ ...prev, preferred_plan: normalized }));
    }
  }, [selectedPlan]);

  const validate = () => {
    const newErrors = {};

    if (!formData.customer_name.trim() || formData.customer_name.trim().length < 2) {
      newErrors.customer_name = 'Please enter your full name (minimum 2 characters)';
    }

    const cleanPhone = formData.phone_number.replace(/[\s\-()]/g, '');
    const phoneRegex = /^(\+91|91|0)?[6-9]\d{9}$/;
    if (!formData.phone_number.trim() || !phoneRegex.test(cleanPhone)) {
      newErrors.phone_number = 'Please enter a valid 10-digit Indian mobile number';
    }

    if (!formData.apartment.trim()) {
      newErrors.apartment = 'Apartment or society name is required';
    }

    if (!formData.block.trim()) {
      newErrors.block = 'Block or tower is required';
    }

    if (!formData.flat_number.trim()) {
      newErrors.flat_number = 'Flat number is required';
    }

    if (!formData.car_model.trim()) {
      newErrors.car_model = 'Car make and model is required (e.g., Hyundai i20)';
    }

    if (!formData.vehicle_registration_number.trim()) {
      newErrors.vehicle_registration_number = 'Vehicle registration number is required (e.g., TS09AB1234)';
    }

    if (!formData.preferred_plan) {
      newErrors.preferred_plan = 'Please select a preferred subscription plan';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'preferred_plan') {
      setSelectedPlan(value);
    }
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      const firstError = document.querySelector('.form-input-error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setSubmitting(true);
    setSubmissionResult(null);

    const payload = {
      ...formData,
      vehicle_registration_number: formData.vehicle_registration_number.toUpperCase().trim(),
      selected_addons: selectedAddons
    };

    try {
      const result = await submitEnquiry(payload);
      setSubmissionResult(result);
      if (result.success) {
        setSubmittedData(result.data || payload);
      }
    } catch (err) {
      setSubmissionResult({
        success: false,
        message: 'A network error occurred while submitting. You can also send your enquiry directly via WhatsApp.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getWhatsAppEnquiryUrl = () => {
    const data = submittedData || formData;
    const addonsList = selectedAddons.length > 0
      ? selectedAddons.map(id => {
          const item = OPTIONAL_ADDONS.find(a => a.id === id);
          return item ? item.name : id;
        }).join(', ')
      : 'None';

    const message = `Hello CLEANZX, I would like to submit a Doorstep Car Cleaning Booking Enquiry:
- Name: ${data.customer_name}
- Phone: ${data.phone_number}
- Apartment/Society: ${data.apartment}
- Block: ${data.block}, Flat: ${data.flat_number}
- Vehicle: ${data.car_model} (${data.vehicle_registration_number})
- Plan: ${data.preferred_plan}
- Start Date: ${data.preferred_start_date || 'Flexible'}
- Preferred Slot: ${data.preferred_time || 'Morning (06:00 AM - 11:30 AM)'}
- Add-ons: ${addonsList}
- Note: ${data.additional_message || 'None'}`;

    return `https://wa.me/91${BUSINESS_INFO.whatsapp}?text=${encodeURIComponent(message)}`;
  };

  const resetForm = () => {
    setSubmissionResult(null);
    setSubmittedData(null);
    setFormData({
      customer_name: '',
      phone_number: '',
      apartment: '',
      block: '',
      flat_number: '',
      car_model: '',
      vehicle_registration_number: '',
      preferred_plan: 'Normal Plan',
      preferred_start_date: '',
      preferred_time: '',
      additional_message: ''
    });
  };

  const minDate = new Date().toISOString().split('T')[0];

  return (
    <div
      id="booking-enquiry-form"
      className="bg-slate-50 rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl relative overflow-hidden"
    >
      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-[#1677FF] text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Fast & Convenient Doorstep Booking</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 font-heading">
            {title || "Book Your Doorstep Car Cleaning"}
          </h2>
          <p className="text-slate-600 mt-2 max-w-2xl mx-auto text-sm sm:text-base">
            {subtitle || "Tell us about your car and location. Our team will contact you to confirm the service details."}
          </p>
        </div>

        {/* Success Modal / State */}
        {submissionResult && submissionResult.success ? (
          <div className="bg-white border border-emerald-300 rounded-2xl p-6 sm:p-8 text-center space-y-6 shadow-xl animate-in fade-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-emerald-50 border border-emerald-200 rounded-full flex items-center justify-center mx-auto text-emerald-600">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2 max-w-xl mx-auto">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading">
                Enquiry Successfully Received!
              </h3>
              <p className="text-emerald-700 text-sm font-semibold">
                {submissionResult.message}
              </p>
              <p className="text-xs text-slate-500 leading-relaxed pt-1">
                Submitting this enquiry does not charge you. CLEANZX will review your apartment location, car model, and slot availability to finalize your subscription.
              </p>
            </div>

            {/* Summary card */}
            {submittedData && (
              <div className="bg-slate-50 rounded-xl p-4 sm:p-5 border border-slate-200 text-left text-xs sm:text-sm space-y-2 max-w-xl mx-auto">
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Enquiry Reference:</span>
                  <span className="font-mono text-[#1677FF] font-semibold">{submittedData.id || 'Recorded'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Customer:</span>
                  <span className="text-slate-900 font-medium">{submittedData.customer_name} ({submittedData.phone_number})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Apartment:</span>
                  <span className="text-slate-900">{submittedData.apartment}, {submittedData.block}-{submittedData.flat_number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Vehicle:</span>
                  <span className="text-slate-900 font-medium">{submittedData.car_model} ({submittedData.vehicle_registration_number})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Selected Plan:</span>
                  <span className="text-[#1677FF] font-semibold">{submittedData.preferred_plan}</span>
                </div>
                {submittedData.preferred_time && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Service Slot:</span>
                    <span className="text-slate-900">{submittedData.preferred_time}</span>
                  </div>
                )}
                {submittedData.selected_addons && submittedData.selected_addons.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Add-ons:</span>
                    <span className="text-slate-900">{submittedData.selected_addons.join(', ')}</span>
                  </div>
                )}
              </div>
            )}

            {/* Direct WhatsApp Confirmation Trigger */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center items-center">
              <a
                href={getWhatsAppEnquiryUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/20 transition-all hover:scale-105"
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                <span>Send Enquiry Details via WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={resetForm}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-medium text-sm transition-colors cursor-pointer"
              >
                Submit Another Enquiry
              </button>
            </div>
          </div>
        ) : (
          /* Form Content */
          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            {submissionResult && !submissionResult.success && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3 animate-in fade-in">
                <AlertCircle className="w-5 h-5 shrink-0 text-red-500 mt-0.5" />
                <div>
                  <p className="font-semibold">{submissionResult.message}</p>
                  <p className="text-xs text-red-600 mt-1">
                    Please correct any highlighted fields below, or reach out to us at {BUSINESS_INFO.phoneFormatted}.
                  </p>
                </div>
              </div>
            )}

            {/* Step 1: Customer Details */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#1677FF] flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>1. Customer & Contact Details</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="customer_name" className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="customer_name"
                    name="customer_name"
                    type="text"
                    required
                    value={formData.customer_name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className={`w-full px-4 py-3 rounded-xl bg-slate-50 border text-slate-900 text-sm placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1677FF] transition-all ${
                      errors.customer_name ? 'border-red-500 form-input-error' : 'border-slate-200 focus:border-[#1677FF]'
                    }`}
                  />
                  {errors.customer_name && (
                    <p className="text-red-500 text-xs mt-1">{errors.customer_name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="phone_number" className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Mobile Number (India) <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="phone_number"
                    name="phone_number"
                    type="tel"
                    required
                    value={formData.phone_number}
                    onChange={handleChange}
                    placeholder="e.g. 9642734252"
                    className={`w-full px-4 py-3 rounded-xl bg-slate-50 border text-slate-900 text-sm placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1677FF] transition-all ${
                      errors.phone_number ? 'border-red-500 form-input-error' : 'border-slate-200 focus:border-[#1677FF]'
                    }`}
                  />
                  {errors.phone_number && (
                    <p className="text-red-500 text-xs mt-1">{errors.phone_number}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Step 2: Apartment Location */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#1677FF] flex items-center gap-2">
                <Building className="w-4 h-4" />
                <span>2. Residential Apartment Location (Hyderabad)</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                  <label htmlFor="apartment" className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Apartment / Society Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="apartment"
                    name="apartment"
                    type="text"
                    required
                    value={formData.apartment}
                    onChange={handleChange}
                    placeholder="e.g. Skyline Towers, Mehdipatnam"
                    className={`w-full px-4 py-3 rounded-xl bg-slate-50 border text-slate-900 text-sm placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1677FF] transition-all ${
                      errors.apartment ? 'border-red-500 form-input-error' : 'border-slate-200 focus:border-[#1677FF]'
                    }`}
                  />
                  {errors.apartment && (
                    <p className="text-red-500 text-xs mt-1">{errors.apartment}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="block" className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Block / Tower <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="block"
                    name="block"
                    type="text"
                    required
                    value={formData.block}
                    onChange={handleChange}
                    placeholder="e.g. Block B / Tower 2"
                    className={`w-full px-4 py-3 rounded-xl bg-slate-50 border text-slate-900 text-sm placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1677FF] transition-all ${
                      errors.block ? 'border-red-500 form-input-error' : 'border-slate-200 focus:border-[#1677FF]'
                    }`}
                  />
                  {errors.block && (
                    <p className="text-red-500 text-xs mt-1">{errors.block}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="flat_number" className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Flat Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="flat_number"
                    name="flat_number"
                    type="text"
                    required
                    value={formData.flat_number}
                    onChange={handleChange}
                    placeholder="e.g. 402"
                    className={`w-full px-4 py-3 rounded-xl bg-slate-50 border text-slate-900 text-sm placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1677FF] transition-all ${
                      errors.flat_number ? 'border-red-500 form-input-error' : 'border-slate-200 focus:border-[#1677FF]'
                    }`}
                  />
                  {errors.flat_number && (
                    <p className="text-red-500 text-xs mt-1">{errors.flat_number}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Step 3: Vehicle Details & Plan Selection */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#1677FF] flex items-center gap-2">
                <Car className="w-4 h-4" />
                <span>3. Vehicle Information & Plan Choice</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="car_model" className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Car Make and Model <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="car_model"
                    name="car_model"
                    type="text"
                    required
                    value={formData.car_model}
                    onChange={handleChange}
                    placeholder="Example: Hyundai i20"
                    className={`w-full px-4 py-3 rounded-xl bg-slate-50 border text-slate-900 text-sm placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1677FF] transition-all ${
                      errors.car_model ? 'border-red-500 form-input-error' : 'border-slate-200 focus:border-[#1677FF]'
                    }`}
                  />
                  {errors.car_model && (
                    <p className="text-red-500 text-xs mt-1">{errors.car_model}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="vehicle_registration_number" className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Vehicle Registration Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="vehicle_registration_number"
                    name="vehicle_registration_number"
                    type="text"
                    required
                    value={formData.vehicle_registration_number}
                    onChange={handleChange}
                    placeholder="Example: TS09AB1234"
                    className={`w-full px-4 py-3 rounded-xl bg-slate-50 border text-slate-900 text-sm placeholder-slate-400 uppercase focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1677FF] transition-all ${
                      errors.vehicle_registration_number ? 'border-red-500 form-input-error' : 'border-slate-200 focus:border-[#1677FF]'
                    }`}
                  />
                  {errors.vehicle_registration_number && (
                    <p className="text-red-500 text-xs mt-1">{errors.vehicle_registration_number}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="preferred_plan" className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Preferred Subscription Plan <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="preferred_plan"
                    name="preferred_plan"
                    required
                    value={formData.preferred_plan}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1677FF] transition-all cursor-pointer font-medium"
                  >
                    {normalPlans.length > 0 ? (
                      <optgroup label="Normal Category">
                        {normalPlans.map(p => (
                          <option key={p.id} value={p.name}>
                            {p.displayName || p.name} ({p.duration || p.billingPeriod || 'Standard'}) {p.price ? `- ₹${p.price}` : ''}
                          </option>
                        ))}
                      </optgroup>
                    ) : (
                      <optgroup label="Normal Category">
                        <option value="15-Day Normal Plan">15-Day Normal Plan (15 Days)</option>
                        <option value="Monthly Normal Plan">Monthly Normal Plan (1 Month)</option>
                        <option value="Quarterly Normal Plan">Quarterly Normal Plan (3 Months)</option>
                        <option value="Half-Yearly Normal Plan">Half-Yearly Normal Plan (6 Months)</option>
                      </optgroup>
                    )}
                    {premiumPlans.length > 0 ? (
                      <optgroup label="Premium Category">
                        {premiumPlans.map(p => (
                          <option key={p.id} value={p.name}>
                            {p.displayName || p.name} ({p.duration || p.billingPeriod || 'Standard'}) {p.price ? `- ₹${p.price}` : ''}
                          </option>
                        ))}
                      </optgroup>
                    ) : (
                      <optgroup label="Premium Category">
                        <option value="15-Day Premium Plan">15-Day Premium Plan (15 Days)</option>
                        <option value="Monthly Premium Plan">Monthly Premium Plan (1 Month)</option>
                        <option value="Quarterly Premium Plan">Quarterly Premium Plan (3 Months)</option>
                        <option value="Half-Yearly Premium Plan">Half-Yearly Premium Plan (6 Months)</option>
                      </optgroup>
                    )}
                  </select>
                  {errors.preferred_plan && (
                    <p className="text-red-500 text-xs mt-1">{errors.preferred_plan}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Step 4: Schedule & Optional Add-ons */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#1677FF] flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>4. Schedule & Optional Paid Add-on Services</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="preferred_start_date" className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Preferred Start Date (Optional)
                  </label>
                  <input
                    id="preferred_start_date"
                    name="preferred_start_date"
                    type="date"
                    min={minDate}
                    value={formData.preferred_start_date}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1677FF] transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="preferred_time" className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Preferred Morning Slot (06:00 AM - 11:30 AM)
                  </label>
                  <select
                    id="preferred_time"
                    name="preferred_time"
                    value={formData.preferred_time}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1677FF] transition-all cursor-pointer"
                  >
                    <option value="">Any slot between 06:00 AM - 11:30 AM</option>
                    {SERVICE_TIME_SLOTS.map((slot) => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Add-on Checkbox Group */}
              <div className="pt-2">
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Select Optional Paid Add-on Services (Prices confirmed on booking review):
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {OPTIONAL_ADDONS.map((addon) => {
                    const isSelected = selectedAddons.includes(addon.id);
                    return (
                      <label
                        key={addon.id}
                        className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-blue-50/80 border-[#1677FF] text-slate-900 shadow-sm'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleAddon(addon.id)}
                          className="mt-0.5 rounded text-[#1677FF] focus:ring-0 bg-white border-slate-300"
                        />
                        <div className="text-xs">
                          <p className="font-semibold text-slate-900">{addon.name}</p>
                          <p className="text-[11px] text-slate-500">{addon.priceStatus}</p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Additional Requirements */}
              <div>
                <label htmlFor="additional_message" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Additional Requirements (Optional)
                </label>
                <textarea
                  id="additional_message"
                  name="additional_message"
                  rows="3"
                  value={formData.additional_message}
                  onChange={handleChange}
                  placeholder="Share any additional information about your car or cleaning requirements."
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1677FF] transition-all"
                ></textarea>
              </div>
            </div>

            {/* Privacy Notice & Rules */}
            <div className="text-xs text-slate-500 space-y-1 px-1">
              <p className="flex items-center gap-1.5 text-slate-700">
                <ShieldCheck className="w-3.5 h-3.5 text-[#1677FF]" />
                <span>Your contact and vehicle details will be used to respond to your enquiry and coordinate the requested service.</span>
              </p>
              <p className="text-slate-500">
                * Note: Submitting this form does not charge your account or activate a paid subscription until CLEANZX verifies availability and schedule with you.
              </p>
            </div>

            {/* Form Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#1677FF] to-[#00A3FF] hover:from-[#00A3FF] hover:to-[#1677FF] text-white font-bold text-base tracking-wide flex items-center justify-center gap-2 shadow-xl shadow-[#1677FF]/30 hover:shadow-[#00A3FF]/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-white" />
                    <span>Processing Booking Enquiry...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 text-white" />
                    <span>Submit Booking Enquiry</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
