import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());

const DATA_DIR = path.join(__dirname, 'server', 'data');
const ENQUIRIES_FILE = path.join(DATA_DIR, 'enquiries.json');
const PLANS_FILE = path.join(DATA_DIR, 'plans.json');

// Ensure data directory and files exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

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

app.listen(PORT, () => {
  console.log(`CLEANZX API server running on port ${PORT}`);
});
