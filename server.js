import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());

const DATA_DIR = path.join(__dirname, 'server', 'data');
const ENQUIRIES_FILE = path.join(DATA_DIR, 'enquiries.json');
const PLANS_FILE = path.join(DATA_DIR, 'plans.json');
const ADMIN_AUTH_FILE = path.join(DATA_DIR, 'admin_auth.json');

// Ensure data directory and files exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Nodemailer Transporter Configuration using .env
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: String(process.env.SMTP_PORT) === '465',
  auth: {
    user: process.env.SMTP_USER || 'cleanzxcare@gmail.com',
    pass: (process.env.SMTP_PASSWORD || '').replace(/\s+/g, '')
  }
});

// Verify SMTP connection on server startup
transporter.verify((err) => {
  if (err) {
    console.error('❌ [SMTP] Connection verification failed:', err.message);
  } else {
    console.log('✅ [SMTP] Connected and verified via ' + (process.env.SMTP_USER || 'cleanzxcare@gmail.com'));
  }
});

// Initial default plans data conforming to CLEANZX specification
const defaultPlans = [
  // --- NORMAL CATEGORY ---
  {
    id: "normal-15-day",
    name: "15-Day Normal Plan",
    displayName: "15-Day Plan",
    category: "Normal",
    duration: "15 days",
    price: null,
    price_display: "Price to be confirmed",
    priceDisplay: "Price to be confirmed",
    billing_period: "15 days",
    billingPeriod: "15 days",
    cleaning_frequency: "Scheduled morning service cycles across 15 days",
    cleaningFrequency: "Scheduled morning service cycles across 15 days",
    included_services: [
      "Dust Removal",
      "Exterior Cleaning",
      "Glass Cleaning",
      "Tyre Cleaning"
    ],
    includedServices: [
      "Dust Removal",
      "Exterior Cleaning",
      "Glass Cleaning",
      "Tyre Cleaning"
    ],
    popular: false,
    status: "Active",
    highlight: "Essential 15-day trial upkeep for apartment car owners",
    button_label: "Select 15-Day Normal Plan",
    buttonLabel: "Select 15-Day Normal Plan"
  },
  {
    id: "normal-monthly",
    name: "Monthly Normal Plan",
    displayName: "Monthly Plan",
    category: "Normal",
    duration: "1 month",
    price: null,
    price_display: "Price to be confirmed",
    priceDisplay: "Price to be confirmed",
    billing_period: "Monthly",
    billingPeriod: "Monthly",
    cleaning_frequency: "Regular morning cycle throughout 30 days",
    cleaningFrequency: "Regular morning cycle throughout 30 days",
    included_services: [
      "Dust Removal",
      "Exterior Cleaning",
      "Glass Cleaning",
      "Tyre Cleaning"
    ],
    includedServices: [
      "Dust Removal",
      "Exterior Cleaning",
      "Glass Cleaning",
      "Tyre Cleaning"
    ],
    popular: true,
    status: "Active",
    highlight: "Steady month-long car care before your daily drive",
    button_label: "Select Monthly Normal Plan",
    buttonLabel: "Select Monthly Normal Plan"
  },
  {
    id: "normal-quarterly",
    name: "Quarterly Normal Plan",
    displayName: "Quarterly Plan",
    category: "Normal",
    duration: "3 months",
    price: null,
    price_display: "Price to be confirmed",
    priceDisplay: "Price to be confirmed",
    billing_period: "Quarterly",
    billingPeriod: "Quarterly",
    cleaning_frequency: "Continuous routine cleaning for 90 days",
    cleaningFrequency: "Continuous routine cleaning for 90 days",
    included_services: [
      "Dust Removal",
      "Exterior Cleaning",
      "Glass Cleaning",
      "Tyre Cleaning"
    ],
    includedServices: [
      "Dust Removal",
      "Exterior Cleaning",
      "Glass Cleaning",
      "Tyre Cleaning"
    ],
    popular: false,
    status: "Active",
    highlight: "Convenient 3-month uninterrupted routine maintenance",
    button_label: "Select Quarterly Normal Plan",
    buttonLabel: "Select Quarterly Normal Plan"
  },
  {
    id: "normal-half-yearly",
    name: "Half-Yearly Normal Plan",
    displayName: "Half-Yearly Plan",
    category: "Normal",
    duration: "6 months",
    price: null,
    price_display: "Price to be confirmed",
    priceDisplay: "Price to be confirmed",
    billing_period: "Half-yearly",
    billingPeriod: "Half-yearly",
    cleaning_frequency: "Long-term doorstep vehicle maintenance for 180 days",
    cleaningFrequency: "Long-term doorstep vehicle maintenance for 180 days",
    included_services: [
      "Dust Removal",
      "Exterior Cleaning",
      "Glass Cleaning",
      "Tyre Cleaning"
    ],
    includedServices: [
      "Dust Removal",
      "Exterior Cleaning",
      "Glass Cleaning",
      "Tyre Cleaning"
    ],
    popular: false,
    status: "Active",
    highlight: "Hassle-free 6-month consistent routine for apartment cars",
    button_label: "Select Half-Yearly Normal Plan",
    buttonLabel: "Select Half-Yearly Normal Plan"
  },

  // --- PREMIUM CATEGORY ---
  {
    id: "premium-15-day",
    name: "15-Day Premium Plan",
    displayName: "15-Day Plan",
    category: "Premium",
    duration: "15 days",
    price: null,
    price_display: "Price to be confirmed",
    priceDisplay: "Price to be confirmed",
    billing_period: "15 days",
    billingPeriod: "15 days",
    cleaning_frequency: "Priority morning service cycles across 15 days",
    cleaningFrequency: "Priority morning service cycles across 15 days",
    included_services: [
      "Dust Removal",
      "Exterior Cleaning",
      "Glass Cleaning",
      "Tyre Cleaning",
      "Priority Morning Slot Allocation",
      "Dedicated Spot Inspection"
    ],
    includedServices: [
      "Dust Removal",
      "Exterior Cleaning",
      "Glass Cleaning",
      "Tyre Cleaning",
      "Priority Morning Slot Allocation",
      "Dedicated Spot Inspection"
    ],
    popular: false,
    status: "Active",
    highlight: "Intensive 15-day detailing trial with priority morning care",
    button_label: "Select 15-Day Premium Plan",
    buttonLabel: "Select 15-Day Premium Plan"
  },
  {
    id: "premium-monthly",
    name: "Monthly Premium Plan",
    displayName: "Monthly Plan",
    category: "Premium",
    duration: "1 month",
    price: null,
    price_display: "Price to be confirmed",
    priceDisplay: "Price to be confirmed",
    billing_period: "Monthly",
    billingPeriod: "Monthly",
    cleaning_frequency: "Enhanced morning cycle with priority slot care for 30 days",
    cleaningFrequency: "Enhanced morning cycle with priority slot care for 30 days",
    included_services: [
      "Dust Removal",
      "Exterior Cleaning",
      "Glass Cleaning",
      "Tyre Cleaning",
      "Priority Morning Slot Allocation",
      "Dedicated Spot Inspection"
    ],
    includedServices: [
      "Dust Removal",
      "Exterior Cleaning",
      "Glass Cleaning",
      "Tyre Cleaning",
      "Priority Morning Slot Allocation",
      "Dedicated Spot Inspection"
    ],
    popular: true,
    status: "Active",
    highlight: "Our most popular comprehensive monthly doorstep car care",
    button_label: "Select Monthly Premium Plan",
    buttonLabel: "Select Monthly Premium Plan"
  },
  {
    id: "premium-quarterly",
    name: "Quarterly Premium Plan",
    displayName: "Quarterly Plan",
    category: "Premium",
    duration: "3 months",
    price: null,
    price_display: "Price to be confirmed",
    priceDisplay: "Price to be confirmed",
    billing_period: "Quarterly",
    billingPeriod: "Quarterly",
    cleaning_frequency: "Continuous priority cleaning & detailing assessment for 90 days",
    cleaningFrequency: "Continuous priority cleaning & detailing assessment for 90 days",
    included_services: [
      "Dust Removal",
      "Exterior Cleaning",
      "Glass Cleaning",
      "Tyre Cleaning",
      "Priority Slot Scheduling",
      "Quarterly Detailing Assessment"
    ],
    includedServices: [
      "Dust Removal",
      "Exterior Cleaning",
      "Glass Cleaning",
      "Tyre Cleaning",
      "Priority Slot Scheduling",
      "Quarterly Detailing Assessment"
    ],
    popular: false,
    status: "Active",
    highlight: "Quarterly comprehensive care with dedicated spot checks",
    button_label: "Select Quarterly Premium Plan",
    buttonLabel: "Select Quarterly Premium Plan"
  },
  {
    id: "premium-half-yearly",
    name: "Half-Yearly Premium Plan",
    displayName: "Half-Yearly Plan",
    category: "Premium",
    duration: "6 months",
    price: null,
    price_display: "Price to be confirmed",
    priceDisplay: "Price to be confirmed",
    billing_period: "Half-yearly",
    billingPeriod: "Half-yearly",
    cleaning_frequency: "Maximum priority long-term doorstep care for 180 days",
    cleaningFrequency: "Maximum priority long-term doorstep care for 180 days",
    included_services: [
      "Dust Removal",
      "Exterior Cleaning",
      "Glass Cleaning",
      "Tyre Cleaning",
      "Priority Slot Scheduling",
      "Extended Service Support"
    ],
    includedServices: [
      "Dust Removal",
      "Exterior Cleaning",
      "Glass Cleaning",
      "Tyre Cleaning",
      "Priority Slot Scheduling",
      "Extended Service Support"
    ],
    popular: false,
    status: "Active",
    highlight: "Complete 6-month peace of mind with premium priority service",
    button_label: "Select Half-Yearly Premium Plan",
    buttonLabel: "Select Half-Yearly Premium Plan"
  }
];

if (!fs.existsSync(PLANS_FILE)) {
  fs.writeFileSync(PLANS_FILE, JSON.stringify(defaultPlans, null, 2), 'utf-8');
}

if (!fs.existsSync(ENQUIRIES_FILE)) {
  fs.writeFileSync(ENQUIRIES_FILE, JSON.stringify([], null, 2), 'utf-8');
}

// Helpers
const readJSON = (filePath, fallback = []) => {
  try {
    if (!fs.existsSync(filePath)) {
      return fallback;
    }
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
    return fallback;
  }
};

const writeJSON = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
};

// API Routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'CLEANZX Backend API',
    location: 'Mehdipatnam, Hyderabad, Telangana, India',
    operatingHours: '06:00 AM - 11:30 AM',
    contact: '9642734252',
    timestamp: new Date().toISOString()
  });
});

// Plans endpoints
app.get('/api/plans', (req, res) => {
  const plans = readJSON(PLANS_FILE, defaultPlans);
  res.json({ success: true, data: plans });
});

app.put('/api/plans', (req, res) => {
  const updatedPlans = req.body;
  if (!Array.isArray(updatedPlans)) {
    return res.status(400).json({ success: false, message: 'Invalid plans payload. Must be an array.' });
  }
  writeJSON(PLANS_FILE, updatedPlans);
  res.json({ success: true, message: 'Plans configuration updated successfully', data: updatedPlans });
});

// Enquiries endpoints
app.get('/api/enquiries', (req, res) => {
  const enquiries = readJSON(ENQUIRIES_FILE, []);
  res.json({ success: true, count: enquiries.length, data: enquiries });
});

app.post('/api/enquiries', (req, res) => {
  const {
    customer_name,
    phone_number,
    apartment,
    block,
    flat_number,
    car_model,
    vehicle_registration_number,
    preferred_plan,
    preferred_start_date,
    preferred_time,
    selected_addons = [],
    additional_message = ''
  } = req.body;

  // Validation
  const errors = {};
  if (!customer_name || customer_name.trim().length < 2) {
    errors.customer_name = 'Full name is required (minimum 2 characters)';
  }

  // Validate Indian phone number (10 digits with optional +91 or 0 prefix)
  const phoneClean = (phone_number || '').replace(/[\s\-()]/g, '');
  const phoneRegex = /^(\+91|91|0)?[6-9]\d{9}$/;
  if (!phone_number || !phoneRegex.test(phoneClean)) {
    errors.phone_number = 'Please enter a valid 10-digit Indian mobile number';
  }

  if (!apartment || !apartment.trim()) {
    errors.apartment = 'Apartment / Society name is required';
  }
  if (!block || !block.trim()) {
    errors.block = 'Block / Tower is required';
  }
  if (!flat_number || !flat_number.trim()) {
    errors.flat_number = 'Flat number is required';
  }
  if (!car_model || !car_model.trim()) {
    errors.car_model = 'Car make and model is required';
  }
  if (!vehicle_registration_number || !vehicle_registration_number.trim()) {
    errors.vehicle_registration_number = 'Vehicle registration number is required';
  }
  if (!preferred_plan || !preferred_plan.trim()) {
    errors.preferred_plan = 'Preferred subscription plan is required';
  }

  // Validate service time if provided
  const allowedTimes = [
    '06:00 AM - 07:00 AM',
    '07:00 AM - 08:00 AM',
    '08:00 AM - 09:00 AM',
    '09:00 AM - 10:00 AM',
    '10:00 AM - 11:00 AM',
    '11:00 AM - 11:30 AM'
  ];
  if (preferred_time && !allowedTimes.includes(preferred_time)) {
    errors.preferred_time = 'Service time must be within operating hours (06:00 AM - 11:30 AM)';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed. Please verify the required fields.',
      errors
    });
  }

  const newEnquiry = {
    id: 'ENQ-' + Date.now().toString(36).toUpperCase() + '-' + Math.floor(1000 + Math.random() * 9000),
    customer_name: customer_name.trim(),
    phone_number: phone_number.trim(),
    apartment: apartment.trim(),
    block: block.trim(),
    flat_number: flat_number.trim(),
    car_model: car_model.trim(),
    vehicle_registration_number: vehicle_registration_number.trim().toUpperCase(),
    preferred_plan: preferred_plan.trim(),
    preferred_start_date: preferred_start_date || null,
    preferred_time: preferred_time || null,
    selected_addons: Array.isArray(selected_addons) ? selected_addons : [],
    additional_message: (additional_message || '').trim(),
    status: 'Pending',
    createdAt: new Date().toISOString()
  };

  const enquiries = readJSON(ENQUIRIES_FILE, []);
  enquiries.unshift(newEnquiry);
  writeJSON(ENQUIRIES_FILE, enquiries);

  return res.status(201).json({
    success: true,
    message: 'Thank you for choosing CLEANZX! Your enquiry has been received. Our team will contact you to confirm availability and your selected plan.',
    data: newEnquiry
  });
});

app.patch('/api/enquiries/:id', (req, res) => {
  const { id } = req.params;
  const { status, adminNotes } = req.body;
  const enquiries = readJSON(ENQUIRIES_FILE, []);
  const index = enquiries.findIndex(e => e.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Enquiry not found' });
  }

  if (status) enquiries[index].status = status;
  if (adminNotes !== undefined) enquiries[index].adminNotes = adminNotes;
  enquiries[index].updatedAt = new Date().toISOString();

  writeJSON(ENQUIRIES_FILE, enquiries);
  res.json({ success: true, message: 'Enquiry updated successfully', data: enquiries[index] });
});

// ==========================================
// ADMIN AUTH & PASSWORD RECOVERY (NODEMAILER SMTP)
// ==========================================

// In-memory admin authentication store (prevents file watcher reload triggers on OTP generation)
let currentAdminAuth = readJSON(ADMIN_AUTH_FILE, {
  adminPassword: 'cleanzx@admin2026',
  adminEmail: process.env.ADMIN_EMAIL || 'cleanzxcare@gmail.com',
  activeOtp: null,
  otpExpiresAt: null
});

const getAdminAuth = () => {
  return currentAdminAuth;
};

const saveAdminAuth = (data, persistToDisk = false) => {
  currentAdminAuth = { ...currentAdminAuth, ...data };
  // Only persist to disk when explicitly instructed (e.g. password change)
  if (persistToDisk) {
    try {
      const toPersist = {
        adminPassword: currentAdminAuth.adminPassword,
        adminEmail: currentAdminAuth.adminEmail
      };
      writeJSON(ADMIN_AUTH_FILE, toPersist);
    } catch (err) {
      console.error('Error persisting admin auth:', err);
    }
  }
};

// Send OTP Email using cleanzxcare@gmail.com
const sendOtpEmail = async (toEmail, otpCode) => {
  const mailOptions = {
    from: process.env.SMTP_FROM || `"CLEANZX Care" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: `🔐 ${otpCode} is your CLEANZX Admin Password Reset Code`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0f172a; margin: 0; padding: 24px; color: #334155; }
          .container { max-width: 540px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2); }
          .header { background: linear-gradient(135deg, #090e1a 0%, #082f49 100%); padding: 32px 24px; text-align: center; }
          .logo-text { color: #38bdf8; font-size: 26px; font-weight: 900; letter-spacing: 2px; margin: 0; }
          .subtitle { color: #94a3b8; font-size: 13px; margin-top: 4px; }
          .content { padding: 32px 28px; }
          .title { font-size: 20px; font-weight: 800; color: #0f172a; margin-top: 0; margin-bottom: 12px; }
          .desc { font-size: 14px; line-height: 1.6; color: #475569; margin-bottom: 24px; }
          .otp-box { background: #f0fdf4; border: 2px dashed #22c55e; border-radius: 16px; padding: 20px; text-align: center; margin-bottom: 24px; }
          .otp-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #15803d; margin-bottom: 8px; }
          .otp-code { font-family: 'Courier New', Courier, monospace; font-size: 38px; font-weight: 900; letter-spacing: 10px; color: #0f172a; margin: 0; }
          .badge { display: inline-block; background: #e0f2fe; color: #0369a1; font-size: 12px; font-weight: 700; padding: 4px 12px; border-radius: 9999px; margin-top: 8px; }
          .warning { background: #fff7ed; border-left: 4px solid #f97316; padding: 12px 16px; border-radius: 8px; font-size: 12px; color: #9a3412; line-height: 1.5; margin-bottom: 24px; }
          .footer { background: #f8fafc; padding: 20px 28px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 11px; color: #64748b; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="logo-text">CLEANZX</h1>
            <p class="subtitle">Operations & Security Authentication Service</p>
          </div>
          <div class="content">
            <h2 class="title">Admin Password Reset Request</h2>
            <p class="desc">A password reset was requested for the CLEANZX Administrator account. Enter the verification code below on the reset page:</p>
            <div class="otp-box">
              <div class="otp-label">6-Digit Verification Code</div>
              <div class="otp-code">${otpCode}</div>
              <div class="badge">Valid for 15 minutes</div>
            </div>
            <div class="warning">
              <strong>Security Alert:</strong> If you did not make this request, you can safely ignore this email. Your current password remains active and secure.
            </div>
            <p class="desc" style="font-size: 12px; color: #94a3b8; margin-bottom: 0;">
              CLEANZX Automated Care Systems • Mehdipatnam, Hyderabad<br/>
              Support: 9642734252 | cleanzxcare@gmail.com
            </p>
          </div>
          <div class="footer">
            © ${new Date().getFullYear()} CLEANZX. Confidential security transmission.
          </div>
        </div>
      </body>
      </html>
    `
  };
  return transporter.sendMail(mailOptions);
};

// Send Confirmation Email
const sendPasswordChangedEmail = async (toEmail) => {
  const mailOptions = {
    from: process.env.SMTP_FROM || `"CLEANZX Care" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: `✅ CLEANZX Admin - Password Successfully Changed`,
    html: `
      <!DOCTYPE html>
      <html>
      <body style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; background-color: #0f172a; padding: 24px; margin: 0;">
        <div style="max-width: 500px; margin: 0 auto; background: #ffffff; border-radius: 16px; padding: 32px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 20px;">
            <span style="font-size: 24px; font-weight: 900; color: #0284c7;">CLEANZX</span>
          </div>
          <h2 style="color: #0f172a; margin-top: 0; font-size: 18px;">Admin Password Updated</h2>
          <p style="color: #475569; font-size: 14px; line-height: 1.6;">
            Your administrator password was reset and updated successfully on <strong>${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</strong> IST.
          </p>
          <p style="color: #475569; font-size: 14px; line-height: 1.6;">
            You can now access your CLEANZX operations dashboard with your new credentials.
          </p>
          <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8;">
            CLEANZX Operations Portal • cleanzxcare@gmail.com
          </div>
        </div>
      </body>
      </html>
    `
  };
  return transporter.sendMail(mailOptions);
};

// 1. Request OTP
app.post('/api/admin/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const normalized = (email || '').trim().toLowerCase();
    const adminEmail = (process.env.ADMIN_EMAIL || 'cleanzxcare@gmail.com').toLowerCase();

    if (!normalized) {
      return res.status(400).json({
        success: false,
        message: 'Please enter your registered administrator email.'
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 15 * 60 * 1000; // 15 mins

    const authData = getAdminAuth();
    authData.activeOtp = otp;
    authData.otpExpiresAt = expiresAt;
    authData.otpEmail = adminEmail;
    saveAdminAuth(authData, false); // pure in-memory, no disk writes

    // Send email via nodemailer SMTP
    await sendOtpEmail(adminEmail, otp);
    console.log(`[SMTP] Successfully sent password reset OTP (${otp}) to ${adminEmail}`);

    return res.json({
      success: true,
      message: `A 6-digit reset code has been sent to ${adminEmail}. Please check your inbox.`,
      targetEmail: adminEmail
    });
  } catch (err) {
    console.error('[SMTP] Failed to send password reset email:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to send reset email: ' + (err.message || 'SMTP service error')
    });
  }
});

// 2. Verify OTP
app.post('/api/admin/verify-otp', (req, res) => {
  const { otp } = req.body;
  const authData = getAdminAuth();

  if (!authData.activeOtp || String(authData.activeOtp) !== String(otp || '').trim()) {
    return res.status(400).json({
      success: false,
      message: 'Invalid verification code. Please check the OTP sent to your email.'
    });
  }

  if (Date.now() > authData.otpExpiresAt) {
    return res.status(400).json({
      success: false,
      message: 'This verification code has expired (15-minute limit). Please request a new code.'
    });
  }

  return res.json({
    success: true,
    message: 'Verification code confirmed.'
  });
});

// 3. Reset Password
app.post('/api/admin/reset-password', async (req, res) => {
  try {
    const { otp, newPassword } = req.body;
    const authData = getAdminAuth();

    if (!authData.activeOtp || String(authData.activeOtp) !== String(otp || '').trim()) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or missing verification code.'
      });
    }

    if (Date.now() > authData.otpExpiresAt) {
      return res.status(400).json({
        success: false,
        message: 'Verification code has expired. Please request a new code.'
      });
    }

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters.'
      });
    }

    authData.adminPassword = newPassword;
    authData.activeOtp = null;
    authData.otpExpiresAt = null;
    saveAdminAuth(authData, true); // persist to disk only when password changes

    // Send confirmation email asynchronously
    try {
      await sendPasswordChangedEmail(authData.adminEmail || 'cleanzxcare@gmail.com');
    } catch (mailErr) {
      console.warn('[SMTP] Confirmation email error:', mailErr.message);
    }

    return res.json({
      success: true,
      message: 'Admin password updated successfully! You can now log in with your new password.',
      newPassword
    });
  } catch (err) {
    console.error('[API] Reset password error:', err);
    return res.status(500).json({
      success: false,
      message: 'Error updating password: ' + err.message
    });
  }
});

// 4. Auth Status endpoint for sync
app.get('/api/admin/auth-status', (req, res) => {
  const authData = getAdminAuth();
  res.json({
    success: true,
    adminEmail: authData.adminEmail || process.env.ADMIN_EMAIL || 'cleanzxcare@gmail.com',
    adminPassword: authData.adminPassword || 'cleanzx@admin2026'
  });
});

// ==========================================
// Customer & Employee Password Recovery OTP
// ==========================================
const passwordResetOtps = new Map();

app.post('/api/auth/send-recovery-otp', async (req, res) => {
  try {
    const { identifier, email, name } = req.body;
    const targetKey = (identifier || email || '').trim().toLowerCase();

    if (!targetKey) {
      return res.status(400).json({
        success: false,
        message: 'A valid mobile number, username, or email is required.'
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 15 * 60 * 1000;

    passwordResetOtps.set(targetKey, { otp, expiresAt });
    if (email) {
      passwordResetOtps.set(email.trim().toLowerCase(), { otp, expiresAt });
    }

    let emailSent = false;
    const targetEmail = (email || (targetKey.includes('@') ? targetKey : '')).trim().toLowerCase();

    if (targetEmail && targetEmail.includes('@')) {
      try {
        await transporter.sendMail({
          from: process.env.SMTP_FROM || 'CLEANZX Care <cleanzxcare@gmail.com>',
          to: targetEmail,
          subject: `CLEANZX Password Reset Verification Code: ${otp}`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; background-color: #0f172a; padding: 24px; color: #f8fafc;">
              <div style="max-width: 480px; margin: 0 auto; background: #1e293b; border-radius: 16px; padding: 28px; border: 1px solid #334155; text-align: center;">
                <div style="font-size: 24px; font-weight: 900; color: #38bdf8; margin-bottom: 8px;">CLEANZX</div>
                <p style="color: #94a3b8; font-size: 13px; margin: 0 0 20px 0;">Doorstep Car Care Automation</p>
                <h3 style="color: #ffffff; margin: 0 0 8px 0; font-size: 18px;">Password Recovery Code</h3>
                <p style="color: #cbd5e1; font-size: 14px; margin-bottom: 24px;">
                  Hello ${name || 'User'}, enter the 6-digit verification code below to reset your password:
                </p>
                <div style="margin: 20px 0;">
                  <span style="font-size: 32px; font-weight: 900; letter-spacing: 6px; color: #38bdf8; background: #0f172a; padding: 12px 24px; border-radius: 12px; border: 1px solid #0284c7; font-family: monospace;">
                    ${otp}
                  </span>
                </div>
                <p style="color: #94a3b8; font-size: 12px; margin-top: 24px;">
                  This code is valid for 15 minutes. If you did not request this, your account is safe and you can ignore this email.
                </p>
              </div>
            </div>
          `
        });
        emailSent = true;
        console.log(`[SMTP] Recovery OTP (${otp}) sent successfully to ${targetEmail}`);
      } catch (mailErr) {
        console.error('[SMTP] Email delivery error:', mailErr.message);
      }
    }

    return res.json({
      success: true,
      otp,
      emailSent,
      targetEmail: emailSent ? targetEmail : null,
      message: emailSent
        ? `A 6-digit verification code has been sent to your registered email (${targetEmail}).`
        : `Verification code generated.`
    });
  } catch (err) {
    console.error('[SMTP] Failed to process recovery OTP:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate verification OTP: ' + (err.message || 'Server error')
    });
  }
});

app.post('/api/auth/verify-recovery-otp', (req, res) => {
  const { identifier, email, otp } = req.body;
  const targetKey = (identifier || email || '').trim().toLowerCase();
  const record = passwordResetOtps.get(targetKey) || (email ? passwordResetOtps.get(email.trim().toLowerCase()) : null);

  if (!record || String(record.otp) !== String(otp).trim()) {
    return res.status(400).json({
      success: false,
      message: 'Invalid 6-digit verification code. Please enter the correct OTP.'
    });
  }

  if (Date.now() > record.expiresAt) {
    return res.status(400).json({
      success: false,
      message: 'Verification code has expired. Please request a new code.'
    });
  }

  return res.json({ success: true, message: 'Verification code confirmed.' });
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`CLEANZX API server running on port ${PORT}`);
  });
}

export default app;
