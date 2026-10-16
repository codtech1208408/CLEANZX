import React, { useState } from 'react';
import {
  Lock,
  User,
  ArrowRight,
  AlertCircle,
  Clock,
  ShieldCheck,
  Eye,
  EyeOff,
  CheckCircle2,
  ArrowLeft,
  Phone
} from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';

export default function EmployeeLogin() {
  const { employeeLogin, resetEmployeePassword, employees = [] } = useAdminData();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Forgot Password state
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1: identify, 2: OTP & new password
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [foundEmp, setFoundEmp] = useState(null);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [staffOtp, setStaffOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showForgotPass, setShowForgotPass] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      const res = employeeLogin(identifier, password);
      setIsLoading(false);
      if (!res.success) {
        setError(res.message);
      }
    }, 200);
  };

  const handleForgotStep1 = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setError('');
    setSuccessMsg('');
    const trimmed = (forgotIdentifier || identifier || '').trim().toLowerCase();
    if (!trimmed) {
      setError('Please enter your specialist username, name, or registered mobile number.');
      return;
    }

    const cleanDigits = trimmed.replace(/\D/g, '');
    const matched = employees.find(emp => {
      const u = (emp.username || '').toLowerCase();
      const n = (emp.name || '').toLowerCase();
      const id = (emp.id || '').toLowerCase();
      const em = (emp.email || '').toLowerCase();
      const ph = (emp.phone || '').replace(/\D/g, '');

      return (
        (u && u === trimmed) ||
        (n && n === trimmed) ||
        (id && id === trimmed) ||
        (em && em === trimmed) ||
        (ph && cleanDigits && cleanDigits.length >= 6 && (ph === cleanDigits || ph.endsWith(cleanDigits) || cleanDigits.endsWith(ph)))
      );
    });

    if (!matched) {
      setError('No specialist staff record found with this username or mobile number. Please contact your Operations Admin.');
      return;
    }

    setFoundEmp(matched);
    setForgotIdentifier(trimmed);
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/send-recovery-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: trimmed,
          email: matched.email || '',
          name: matched.name || 'Specialist'
        })
      });
      const data = await res.json();
      if (data.success) {
        setGeneratedOtp(data.otp);
        setIsEmailSent(Boolean(data.emailSent));
        if (data.emailSent) {
          setSuccessMsg(`A 6-digit OTP has been sent to your staff email (${data.targetEmail}).`);
        } else {
          setSuccessMsg(`Specialist verified for ${matched.name}! Use the 6-digit OTP generated below.`);
        }
      } else {
        const fallback = Math.floor(100000 + Math.random() * 900000).toString();
        setGeneratedOtp(fallback);
        setSuccessMsg(`Specialist profile found for ${matched.name}! Enter the 6-digit OTP below to reset password.`);
      }
    } catch (err) {
      const fallback = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(fallback);
      setSuccessMsg(`Specialist profile found for ${matched.name}! Enter the 6-digit OTP below to reset password.`);
    } finally {
      setIsLoading(false);
      setForgotStep(2);
    }
  };

  const handleForgotStep2 = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const cleanOtp = staffOtp.trim();
    if (!cleanOtp || cleanOtp.length !== 6) {
      setError('Please enter the complete 6-digit verification code (OTP).');
      return;
    }

    setIsLoading(true);

    // Verify OTP
    let isOtpValid = cleanOtp === generatedOtp;
    if (!isOtpValid) {
      try {
        const verifyRes = await fetch('/api/auth/verify-recovery-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            identifier: forgotIdentifier,
            email: foundEmp?.email || '',
            otp: cleanOtp
          })
        });
        const verifyData = await verifyRes.json();
        if (verifyData.success) {
          isOtpValid = true;
        } else {
          setIsLoading(false);
          setError(verifyData.message || 'Invalid 6-digit verification code. Please check and try again.');
          return;
        }
      } catch (err) {
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
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      setIsLoading(false);
      return;
    }

    const res = resetEmployeePassword(forgotIdentifier, newPassword);
    setIsLoading(false);
    if (res.success) {
      setIsForgotPassword(false);
      setForgotStep(1);
      setIdentifier(foundEmp?.username || forgotIdentifier);
      setPassword('');
      setStaffOtp('');
      setGeneratedOtp('');
      setNewPassword('');
      setConfirmPassword('');
      setSuccessMsg('Specialist password updated successfully! Please sign in with your new password.');
    } else {
      setError(res.message);
    }
  };

  return (
    <div className={`min-h-screen bg-white text-slate-800 flex flex-col ${isForgotPassword ? 'justify-center py-3' : 'justify-start pt-3 sm:pt-6 pb-12'} p-3 sm:p-5 antialiased overflow-y-auto`}>
      {/* Brand Header */}
      <div className={`w-full max-w-md mx-auto ${isForgotPassword ? 'pt-1 pb-1' : 'pt-3 sm:pt-6'} text-center transition-all`}>
        <div className="flex justify-center mb-1.5">
          <img
            src="/images/admin-brand-logo.png"
            alt="CLEANZX"
            className={`${isForgotPassword ? 'h-10 sm:h-12' : 'h-14 sm:h-18'} max-w-[220px] w-auto object-contain drop-shadow-md transition-all`}
          />
        </div>

        {!isForgotPassword ? (
          <>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-cyan-50 text-cyan-800 border border-cyan-200 text-[11px] font-semibold uppercase tracking-wider mb-1.5">
              <Clock className="w-3 h-3 text-cyan-600" />
              <span>Morning Service Portal (6:00 AM - 11:30 AM)</span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Specialist Staff Login
            </h1>
            <p className="text-xs text-slate-600 mt-0.5 max-w-xs mx-auto">
              Sign in to access your assigned doorstep car cleaning visits across residential apartments.
            </p>
          </>
        ) : (
          <div className="mb-0.5">
            <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              Reset Specialist Password
            </h1>
          </div>
        )}
      </div>

      {/* Main Card */}
      <div className={`w-full max-w-md mx-auto ${isForgotPassword ? 'my-1 p-4 sm:p-5' : 'my-4 p-5 sm:p-7'} bg-white border border-slate-200 rounded-3xl shadow-xl`}>
        {error && (
          <div className="mb-3.5 p-3 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2 text-xs text-rose-700 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-3.5 p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-2 text-xs text-emerald-700 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* FORGOT PASSWORD VIEW */}
        {isForgotPassword ? (
          <div>
            <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-cyan-50 text-cyan-600 border border-cyan-200 flex items-center justify-center">
                  <Lock className="w-3.5 h-3.5 text-cyan-600" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900">Reset Specialist Password</h3>
                  <p className="text-[10px] text-slate-500">Step {forgotStep} of 2 • 6-Digit OTP</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsForgotPassword(false);
                  setError('');
                  setSuccessMsg('');
                }}
                className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer font-medium"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Login</span>
              </button>
            </div>

            {forgotStep === 1 ? (
              <form onSubmit={handleForgotStep1} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Username, Specialist Name, or Mobile Number
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={forgotIdentifier}
                      onChange={(e) => setForgotIdentifier(e.target.value)}
                      placeholder="e.g. akhil, specialist1, or 9121992399"
                      autoComplete="off"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white font-mono"
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Enter the staff credentials assigned by the CleanZX Operations Admin.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-cyan-600 via-cyan-500 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-cyan-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-1"
                >
                  {isLoading ? 'Verifying specialist...' : 'Find Specialist Profile & Send OTP →'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleForgotStep2} className="space-y-3" autoComplete="off">
                {/* Dummy inputs to prevent Chrome/Edge autofill */}
                <input type="text" style={{ display: 'none' }} tabIndex="-1" />
                <input type="password" style={{ display: 'none' }} tabIndex="-1" />

                {/* Staff Found Header */}
                {foundEmp && (
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-900 text-xs">{foundEmp.name} ({foundEmp.role || 'Specialist'})</p>
                      <p className="text-[10px] text-slate-500">Zone: {foundEmp.zone || 'Hyderabad'}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      Active Staff
                    </span>
                  </div>
                )}

                {/* OTP Input Box */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-semibold text-slate-700">
                      Enter 6-Digit OTP {foundEmp?.email ? `(Sent to ${foundEmp.email})` : ''}:
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
                    value={staffOtp}
                    onChange={(e) => setStaffOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="• • • • • •"
                    name="cleanzx_staff_otp"
                    id="cleanzx_staff_otp"
                    autoComplete="one-time-code"
                    inputMode="numeric"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-base font-mono tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">
                    Please check your staff email and enter the 6-digit code.
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
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
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
                    className="flex-1 py-2.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isLoading ? 'Updating Password...' : 'Save & Set New Password'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setForgotStep(1)}
                    className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    Back
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : (
          /* STANDARD LOGIN VIEW */
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Username or Mobile Number
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Enter username or mobile number"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white transition-all font-mono"
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full pl-10 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
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
                    setError('');
                    setSuccessMsg('');
                    const trimmed = identifier.trim();
                    if (trimmed) {
                      setForgotIdentifier(trimmed);
                      handleForgotStep1();
                    } else {
                      setForgotStep(1);
                    }
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
              className="w-full py-3.5 px-4 bg-gradient-to-r from-cyan-600 via-cyan-500 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs sm:text-sm rounded-2xl transition-all shadow-md shadow-cyan-600/20 flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:opacity-60"
            >
              {isLoading ? (
                <span>Verifying credentials...</span>
              ) : (
                <>
                  <span>Access Daily Job Schedule</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}
      </div>

      {/* Footer Info */}
      <div className="w-full max-w-md mx-auto text-center pb-4 text-xs text-slate-500 space-y-1">
        <p>Doorstep Car Cleaning Operations • Hyderabad</p>
        <p className="text-[11px] text-slate-500">
          Need login credentials or admin assistance? Contact <a href="tel:+919121992399" className="text-cyan-600 hover:underline font-semibold">+91 91219 92399</a>
        </p>
      </div>
    </div>
  );
}
