import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Lock,
  User,
  Phone,
  Mail,
  Building,
  Car,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  Hash,
  Home,
  Clock,
  ArrowLeft
} from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';

export default function CustomerAuth({ defaultTab = 'login', onAuthSuccess }) {
  const { customerLogin, customerSignup, resetCustomerPassword, customers = [] } = useAdminData();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState(defaultTab); // 'login' | 'signup'
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Forgot Password state
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1: identify, 2: OTP & new password
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [foundCustomer, setFoundCustomer] = useState(null);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [emailOtp, setEmailOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showForgotPass, setShowForgotPass] = useState(false);

  const handleForgotStep1 = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setError('');
    setSuccessMsg('');
    const trimmed = (forgotIdentifier || loginIdentifier || '').trim().toLowerCase();
    if (!trimmed) {
      setError('Please enter your registered mobile number or email.');
      return;
    }

    const cleanDigits = trimmed.replace(/\D/g, '');
    const matched = customers.find(c => {
      const cid = (c.id || '').toLowerCase();
      const em = (c.email || '').toLowerCase();
      const ph = (c.phone || '').replace(/\D/g, '');
      return (cid && cid === trimmed) || (em && em === trimmed) || (ph && cleanDigits && ph === cleanDigits);
    });

    if (!matched) {
      setError('No customer account found with this mobile number or email. Please check your credentials or register.');
      return;
    }

    setFoundCustomer(matched);
    setForgotIdentifier(trimmed);
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/send-recovery-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: trimmed,
          email: matched.email || '',
          name: matched.name || 'Customer'
        })
      });
      const data = await res.json();
      if (data.success) {
        setGeneratedOtp(data.otp);
        setIsEmailSent(Boolean(data.emailSent));
        if (data.emailSent) {
          setSuccessMsg(`A 6-digit OTP has been sent to your registered email (${data.targetEmail}).`);
        } else {
          setSuccessMsg(`Account verified for ${matched.name}! Use the 6-digit OTP generated below.`);
        }
      } else {
        const fallbackCode = Math.floor(100000 + Math.random() * 900000).toString();
        setGeneratedOtp(fallbackCode);
        setSuccessMsg(`Account found for ${matched.name}! Enter the 6-digit OTP below to proceed.`);
      }
    } catch (err) {
      const fallbackCode = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(fallbackCode);
      setSuccessMsg(`Account found for ${matched.name}! Enter the 6-digit OTP below to proceed.`);
    } finally {
      setIsLoading(false);
      setForgotStep(2);
    }
  };

  const handleForgotStep2 = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const cleanOtp = emailOtp.trim();
    if (!cleanOtp || cleanOtp.length !== 6) {
      setError('Please enter the complete 6-digit verification code (OTP).');
      return;
    }

    setIsLoading(true);

    // Verify OTP with backend or generated OTP
    let isOtpValid = cleanOtp === generatedOtp;
    if (!isOtpValid) {
      try {
        const verifyRes = await fetch('/api/auth/verify-recovery-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            identifier: forgotIdentifier,
            email: foundCustomer?.email || '',
            otp: cleanOtp
          })
        });
        const verifyData = await verifyRes.json();
        if (verifyData.success) {
          isOtpValid = true;
        } else {
          setIsLoading(false);
          setError(verifyData.message || 'Invalid verification code. Please enter the correct 6-digit OTP.');
          return;
        }
      } catch (err) {
        // Fallback check
        if (cleanOtp !== generatedOtp) {
          setIsLoading(false);
          setError('Invalid 6-digit OTP. Please enter the code displayed.');
          return;
        }
        isOtpValid = true;
      }
    }

    if (!newPassword || newPassword.length < 4) {
      setError('Password must be at least 4 characters long.');
      setIsLoading(false);
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setError('Passwords do not match. Please re-enter.');
      setIsLoading(false);
      return;
    }

    const res = resetCustomerPassword(forgotIdentifier, newPassword);
    setIsLoading(false);

    if (res.success) {
      setIsForgotPassword(false);
      setForgotStep(1);
      setLoginIdentifier(forgotIdentifier);
      setLoginPassword('');
      setEmailOtp('');
      setGeneratedOtp('');
      setNewPassword('');
      setConfirmNewPassword('');
      setSuccessMsg('Password reset successfully! You can now sign in with your new password.');
    } else {
      setError(res.message);
    }
  };

  // Signup form state (Per Section 4.1 requirements)
  const [signupData, setSignupData] = useState({
    name: '',
    phone: '',
    email: '',
    apartment: '',
    block: '',
    flat_number: '',
    car_model: '',
    vehicle_registration_number: '',
    carType: 'SUV / Sedan',
    password: '',
    confirmPassword: '',
    planName: 'Monthly Premium Plan'
  });

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!loginIdentifier.trim()) {
      setError('Please enter your registered mobile number or email.');
      return;
    }
    if (!loginPassword) {
      setError('Please enter your password.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const res = customerLogin(loginIdentifier, loginPassword);
      setIsLoading(false);
      if (res.success) {
        if (onAuthSuccess) onAuthSuccess(res.user);
        navigate('/dashboard');
      } else {
        setError(res.message);
      }
    }, 200);
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validations
    if (!signupData.name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    const cleanPhone = signupData.phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!signupData.apartment.trim()) {
      setError('Please enter your Apartment or Community name.');
      return;
    }
    if (!signupData.flat_number.trim()) {
      setError('Please enter your Flat / Unit number.');
      return;
    }
    if (!signupData.car_model.trim()) {
      setError('Please specify your car model (e.g. Creta SX, Honda City).');
      return;
    }
    if (!signupData.vehicle_registration_number.trim()) {
      setError('Please enter your vehicle registration number (e.g. TS 09 EZ 4412).');
      return;
    }
    if (!signupData.password || signupData.password.length < 4) {
      setError('Please choose a password with at least 4 characters.');
      return;
    }
    if (signupData.password !== signupData.confirmPassword) {
      setError('Passwords do not match. Please verify.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const res = customerSignup(signupData);
      setIsLoading(false);
      if (res.success) {
        setSuccessMsg('Account created successfully! Redirecting to your dashboard...');
        setTimeout(() => {
          if (onAuthSuccess) onAuthSuccess(res.user);
          navigate('/dashboard');
        }, 600);
      } else {
        setError(res.message);
      }
    }, 250);
  };


  return (
    <div className={`min-h-screen w-full bg-white text-slate-800 flex flex-col ${isForgotPassword ? 'justify-center py-3' : 'justify-start pt-2 sm:pt-4 pb-12'} px-4 sm:px-6 overflow-y-auto antialiased`}>
      {/* Top Navigation */}
      <div className="w-full max-w-xl mx-auto flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors bg-slate-100 hover:bg-slate-200 px-3 py-1 rounded-full border border-slate-200"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
        <span className="text-[11px] font-medium text-cyan-700 flex items-center gap-1.5 bg-cyan-50/80 px-2.5 py-1 rounded-full border border-cyan-100">
          <Clock className="w-3 h-3 text-cyan-600" />
          <span>Daily Service: 6:00 AM – 11:30 AM</span>
        </span>
      </div>

      {/* Brand Header */}
      <div className={`w-full max-w-xl mx-auto ${isForgotPassword ? 'pt-1 pb-1' : 'pt-1 sm:pt-2'} text-center`}>
        <div className="flex justify-center mb-1.5">
          <img
            src="/images/admin-brand-logo.png"
            alt="CLEANZX"
            className={`${isForgotPassword ? 'h-10 sm:h-12' : 'h-16 sm:h-20'} max-w-[260px] w-auto object-contain drop-shadow-md transition-all`}
          />
        </div>

        {!isForgotPassword ? (
          <>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200 text-[10px] font-semibold uppercase tracking-wider mb-1.5">
              <Sparkles className="w-3 h-3 text-cyan-600" />
              <span>Customer Self-Service Portal</span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {activeTab === 'login' ? 'Customer Account Login' : 'Create Customer Account'}
            </h1>
            <p className="text-xs text-slate-600 mt-0.5 max-w-md mx-auto leading-normal">
              {activeTab === 'login'
                ? 'Access your vehicle care schedule, subscription status, invoice downloads, and request add-on detailing.'
                : 'Register your apartment, vehicle details, and preferred plan to activate daily morning doorstep car care.'}
            </p>

            {/* Tab Switcher */}
            <div className="flex items-center justify-center mt-2.5">
              <div className="bg-slate-100 border border-slate-200 p-1 rounded-2xl flex items-center gap-1 max-w-xs w-full shadow-inner">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('login');
                    setIsForgotPassword(false);
                    setError('');
                    setSuccessMsg('');
                  }}
                  className={`flex-1 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                    activeTab === 'login'
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md shadow-cyan-500/20'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('signup');
                    setIsForgotPassword(false);
                    setError('');
                    setSuccessMsg('');
                  }}
                  className={`flex-1 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                    activeTab === 'signup'
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md shadow-cyan-500/20'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  New Sign Up
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="mb-0.5">
            <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              Reset Customer Password
            </h1>
          </div>
        )}
      </div>

      {/* Main Card */}
      <div className={`w-full max-w-xl mx-auto ${isForgotPassword ? 'mt-1 mb-4 p-4 sm:p-5' : 'mt-2.5 mb-5 p-4 sm:p-5'} bg-white border border-slate-200 rounded-3xl shadow-xl`}>
        {error && (
          <div className="mb-3.5 p-3 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2.5 text-xs text-rose-700 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-3.5 p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-2.5 text-xs text-emerald-700 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* ---------------- FORGOT PASSWORD VIEW ---------------- */}
        {isForgotPassword ? (
          <div>
            <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-cyan-100 text-cyan-700 border border-cyan-200 flex items-center justify-center">
                  <Lock className="w-3.5 h-3.5 text-cyan-600" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900">Reset Customer Password</h3>
                  <p className="text-[10px] text-slate-500">Step {forgotStep} of 2 • 6-Digit OTP Verification</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsForgotPassword(false);
                  setError('');
                  setSuccessMsg('');
                }}
                className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Sign In</span>
              </button>
            </div>

            {forgotStep === 1 ? (
              <form onSubmit={handleForgotStep1} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Registered Mobile Number or Email
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={forgotIdentifier}
                      onChange={(e) => setForgotIdentifier(e.target.value)}
                      placeholder="e.g. 8519021491 or your email"
                      autoComplete="off"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white font-mono"
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Enter the phone number or email registered with your CleanZX account.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 via-cyan-500 to-sky-400 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-1"
                >
                  {isLoading ? 'Searching account & generating OTP...' : 'Find Account & Send OTP →'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleForgotStep2} className="space-y-3" autoComplete="off">
                {/* Dummy inputs to prevent Chrome/Edge autofill */}
                <input type="text" style={{ display: 'none' }} tabIndex="-1" />
                <input type="password" style={{ display: 'none' }} tabIndex="-1" />

                {/* Account Found Header Card */}
                {foundCustomer && (
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-900 text-xs">{foundCustomer.name}</p>
                      <p className="text-[10px] text-slate-500">
                        {foundCustomer.apartment} • {foundCustomer.vehicle_registration_number || 'Vehicle'}
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                      Verified Account
                    </span>
                  </div>
                )}

                {/* OTP Input Box */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-semibold text-slate-700">
                      Enter 6-Digit OTP {foundCustomer?.email ? `(Sent to ${foundCustomer.email})` : ''}:
                    </label>
                    <button
                      type="button"
                      onClick={handleForgotStep1}
                      className="text-[10px] text-cyan-600 hover:text-cyan-700 font-semibold cursor-pointer underline"
                    >
                      Resend OTP
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={emailOtp}
                    onChange={(e) => setEmailOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="• • • • • •"
                    name="cleanzx_customer_otp"
                    id="cleanzx_customer_otp"
                    autoComplete="one-time-code"
                    inputMode="numeric"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-base font-mono tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white shadow-inner"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">
                    Please check your email inbox and enter the 6-digit code.
                  </p>
                </div>

                {/* New Password Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-0.5">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      New Password
                    </label>
                    <div className="relative">
                      <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type={showForgotPass ? 'text' : 'password'}
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Min. 4 chars"
                        autoComplete="new-password"
                        className="w-full pl-8 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowForgotPass(!showForgotPass)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showForgotPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type={showForgotPass ? 'text' : 'password'}
                        required
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        placeholder="Re-enter password"
                        autoComplete="new-password"
                        className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 py-2.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isLoading ? 'Updating Password...' : 'Save & Set New Password'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setForgotStep(1)}
                    className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer border border-slate-200"
                  >
                    Back
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : activeTab === 'login' ? (
          <div>
            <form onSubmit={handleLoginSubmit} noValidate className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Registered Mobile Number or Email
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="Enter registered mobile number or email"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:bg-white transition-all font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-11 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:bg-white transition-all font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                    aria-label="Toggle password view"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Forgot Password Link Below Password Box */}
                <div className="flex justify-end mt-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotPassword(true);
                      setForgotIdentifier(loginIdentifier);
                      setError('');
                      setSuccessMsg('');
                    }}
                    className="text-xs text-cyan-600 hover:text-cyan-700 font-semibold cursor-pointer transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 via-cyan-500 to-sky-400 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-sm rounded-2xl shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-1"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Enter Customer Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-3.5 text-center">
              <p className="text-xs text-slate-500">
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => setActiveTab('signup')}
                  className="font-semibold text-cyan-600 hover:underline"
                >
                  Register here
                </button>
              </p>
            </div>
          </div>
        ) : (
          /* ---------------- SIGNUP TAB ---------------- */
          <div>
            <form onSubmit={handleSignupSubmit} noValidate className="space-y-3">
              {/* Row 1: Full Name & Mobile Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={signupData.name}
                      onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                      placeholder="Enter your full name"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:ring-2 focus:ring-cyan-500 focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    10-Digit Mobile Number *
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      value={signupData.phone}
                      onChange={(e) => setSignupData({ ...signupData, phone: e.target.value })}
                      placeholder="Enter 10-digit mobile number"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:ring-2 focus:ring-cyan-500 focus:bg-white focus:outline-none font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Row 2: Apartment / Community, Block & Flat */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-1">
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Apartment / Community *
                  </label>
                  <div className="relative">
                    <Building className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={signupData.apartment}
                      onChange={(e) => setSignupData({ ...signupData, apartment: e.target.value })}
                      placeholder="Enter apartment or community name"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:ring-2 focus:ring-cyan-500 focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Block / Tower
                  </label>
                  <div className="relative">
                    <Hash className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={signupData.block}
                      onChange={(e) => setSignupData({ ...signupData, block: e.target.value })}
                      placeholder="e.g. Tower 3 / Block B (Optional)"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:ring-2 focus:ring-cyan-500 focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Flat / Unit Number *
                  </label>
                  <div className="relative">
                    <Home className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={signupData.flat_number}
                      onChange={(e) => setSignupData({ ...signupData, flat_number: e.target.value })}
                      placeholder="e.g. Flat 804 / Unit 12"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:ring-2 focus:ring-cyan-500 focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Row 3: Car Model & Vehicle Registration Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Car Model *
                  </label>
                  <div className="relative">
                    <Car className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={signupData.car_model}
                      onChange={(e) => setSignupData({ ...signupData, car_model: e.target.value })}
                      placeholder="e.g. Creta SX / Honda City / Baleno"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:ring-2 focus:ring-cyan-500 focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Vehicle Registration Number *
                  </label>
                  <div className="relative">
                    <Hash className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={signupData.vehicle_registration_number}
                      onChange={(e) => setSignupData({ ...signupData, vehicle_registration_number: e.target.value })}
                      placeholder="e.g. TS 09 AB 1234"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:ring-2 focus:ring-cyan-500 focus:bg-white focus:outline-none font-mono uppercase"
                    />
                  </div>
                </div>
              </div>

              {/* Row 4: Email (Optional) & Preferred Subscription Plan */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Email Address (Optional)
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={signupData.email}
                      onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                      placeholder="Enter email address (Optional)"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:ring-2 focus:ring-cyan-500 focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Preferred Subscription Plan
                  </label>
                  <select
                    value={signupData.planName}
                    onChange={(e) => setSignupData({ ...signupData, planName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:ring-2 focus:ring-cyan-500 focus:bg-white focus:outline-none"
                  >
                    <option value="Monthly Premium Plan">Monthly Premium Plan (₹1,499)</option>
                    <option value="Quarterly Premium Plan">Quarterly Premium Plan (₹4,199)</option>
                    <option value="Monthly Normal Plan">Monthly Normal Plan (₹899)</option>
                    <option value="Quarterly Normal Plan">Quarterly Normal Plan (₹2,499)</option>
                    <option value="15-Day Normal Plan">15-Day Normal Trial (₹549)</option>
                    <option value="None Selected">Decide Later from Dashboard</option>
                  </select>
                </div>
              </div>

              {/* Row 5: Create Password & Confirm Password (AT THE END) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200 mt-1">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                      <Lock className="w-3 h-3 text-cyan-600" />
                      <span>Create Password *</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-[10px] text-cyan-600 hover:text-cyan-700 font-semibold"
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={signupData.password}
                      onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                      placeholder="Min 4 characters"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs focus:ring-2 focus:ring-cyan-500 focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={signupData.confirmPassword}
                      onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                      placeholder="Re-enter password"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs focus:ring-2 focus:ring-cyan-500 focus:outline-none font-mono"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 via-cyan-500 to-sky-400 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-sm rounded-2xl shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-1.5"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Create Account & Go to Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-4 text-center">
              <p className="text-xs text-slate-500">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => setActiveTab('login')}
                  className="font-semibold text-cyan-600 hover:underline"
                >
                  Sign in to your account
                </button>
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="w-full max-w-xl mx-auto text-center pb-2">
        <p className="text-[11px] text-slate-400">
          CleanZX Eco-Friendly Doorstep Car Care • Dedicated Hyderabad Apartment Service
        </p>
      </div>
    </div>
  );
}
