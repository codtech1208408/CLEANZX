import {
  BUSINESS_INFO,
  STANDARD_SERVICES,
  OPTIONAL_ADDONS,
  SUBSCRIPTION_PLANS,
  HOW_IT_WORKS,
  TRUST_POINTS,
  FAQS,
  SERVICE_TIME_SLOTS
} from './websiteData';

export const ADMIN_CREDENTIALS = {
  username: "admin@cleanzx.com",
  aliasUsername: "admin",
  password: "cleanzx@admin2026",
  role: "Super Administrator",
  name: "CLEANZX Operations Admin"
};

export const INITIAL_WEBSITE_CONTENT = {
  businessInfo: { ...BUSINESS_INFO },
  banners: [
    {
      id: "banner-1",
      image: "/images/banner-1.png",
      badge: "Serving Overall Hyderabad",
      titleLine1: "Premium Car Cleaning.",
      titleLine2: "Right at Your Doorstep.",
      subtitle: "Keep your car spotless without leaving home. Discover convenient doorstep car cleaning and flexible subscription plans from CLEANZX in Hyderabad.",
      primaryCtaText: "Explore Subscription Plans",
      primaryCtaLink: "/plans",
      secondaryCtaText: "Book Your Cleaning",
      published: true
    },
    {
      id: "banner-2",
      image: "/images/banner-2.jpg",
      badge: "Apartment-Safe Microfiber Detailing",
      titleLine1: "Scratch-Free Exterior Wash.",
      titleLine2: "Pure Showroom Shine.",
      subtitle: "Gentle microfiber wash engineered specifically for residential apartment parking bays with zero water puddle mess.",
      primaryCtaText: "View Exterior Services",
      primaryCtaLink: "/services",
      secondaryCtaText: "Book Your Cleaning",
      published: true
    },
    {
      id: "banner-3",
      image: "/images/banner-3.png",
      badge: "High-Clarity Glass & Windscreen Polish",
      titleLine1: "Crystal-Clear Windscreen.",
      titleLine2: "Streak-Free Glass Polish.",
      subtitle: "Streak-free automotive glass polishing and high-clarity mirror treatment ensuring a pristine view before every drive.",
      primaryCtaText: "Explore Detailing Services",
      primaryCtaLink: "/services",
      secondaryCtaText: "Book Your Cleaning",
      published: true
    },
    {
      id: "banner-4",
      image: "/images/banner-4.jpg",
      badge: "Deep Tyre & Alloy Wheel Cleaning",
      titleLine1: "Impeccable Tyre Gloss.",
      titleLine2: "Deep Wheel Care.",
      subtitle: "Thorough visible wheel cleaning and deep tyre dressing to keep your vehicle looking sharp before your daily commute.",
      primaryCtaText: "Compare All 8 Subscription Plans",
      primaryCtaLink: "/plans",
      secondaryCtaText: "Book Your Cleaning",
      published: true
    }
  ],
  announcement: {
    enabled: true,
    text: "🎉 Early Morning Doorstep Care: Book your monthly subscription today and get free first-week Interior Vacuuming!",
    badge: "Special Offer",
    discountCode: "CLEANZX2026",
    linkText: "View Plans",
    linkUrl: "/plans"
  },
  about: {
    headline: "Redefining Apartment Car Care in Hyderabad",
    subheadline: "CLEANZX delivers eco-friendly, morning doorstep car care designed specifically for busy professionals and apartment residents.",
    story1: "Founded in Mehdipatnam, CLEANZX emerged from a simple observation: car owners in Hyderabad apartments spend their weekends waiting in queues at busy wash stations or endure careless, scratch-inducing daily wipe-downs by untrained hands.",
    story2: "We built a specialized mobile cleaning system utilizing ultra-plush microfiber materials, water-efficient automotive formulas, and professionally trained specialists who arrive right at your allotted basement parking between 6:00 AM and 11:30 AM.",
    missionTitle: "Our Core Mission",
    missionDescription: "To keep every car in Hyderabad pristine, scratch-free, and road-ready every single morning without disturbing apartment peace or wasting water.",
    values: [
      { title: "Zero Puddle Mess", desc: "Eco-safe methods strictly conforming to apartment community bylaws." },
      { title: "Punctual Morning Slots", desc: "Reliable schedules between 6:00 AM and 11:30 AM before you leave." },
      { title: "Trained Specialists", desc: "Background-verified, uniform-clad cleaning executives with detailing gear." }
    ]
  },
  services: [...STANDARD_SERVICES.map(s => ({ ...s, published: true }))],
  addons: [
    ...OPTIONAL_ADDONS.map(a => ({
      ...a,
      price: a.price || (a.id === 'interior-vacuuming' ? 399 : a.id === 'dashboard-detailing' ? 249 : a.id === 'deep-interior-cleaning' ? 799 : a.id === 'premium-tyre-polish' ? 199 : 349),
      priceDisplay: a.price ? `₹${a.price}` : (a.id === 'interior-vacuuming' ? "₹399" : a.id === 'dashboard-detailing' ? "₹249" : a.id === 'deep-interior-cleaning' ? "₹799" : a.id === 'premium-tyre-polish' ? "₹199" : "₹349"),
      published: true
    }))
  ],
  faqs: [...FAQS.map((f, i) => ({ id: `faq-${i + 1}`, ...f, published: true }))],
  trustPoints: [...TRUST_POINTS]
};

export const INITIAL_PLANS = SUBSCRIPTION_PLANS.map(plan => {
  // Add base numeric pricing for admin and billing calculations
  let basePrice = 899;
  if (plan.id === 'normal-15-day') basePrice = 549;
  else if (plan.id === 'normal-monthly') basePrice = 899;
  else if (plan.id === 'normal-quarterly') basePrice = 2499;
  else if (plan.id === 'normal-half-yearly') basePrice = 4699;
  else if (plan.id === 'premium-15-day') basePrice = 849;
  else if (plan.id === 'premium-monthly') basePrice = 1499;
  else if (plan.id === 'premium-quarterly') basePrice = 4199;
  else if (plan.id === 'premium-half-yearly') basePrice = 7999;

  return {
    ...plan,
    price: basePrice,
    priceDisplay: `₹${basePrice}`,
    status: "Active",
    published: true,
    subscriberCount: 0
  };
});

// Clean initial states: Active specialist harish
export const INITIAL_EMPLOYEES = [
  {
    id: "EMP-01",
    name: "harish",
    phone: "8519821491",
    email: "harishneela060@gmail.com",
    role: "Doorstep Cleaning Specialist",
    zone: "Mehdipatnam & Tolichowki",
    assignedApartments: [
      "Prestige High Fields",
      "Skyline Towers"
    ],
    status: "Active",
    rating: 5.0,
    jobsCompleted: 0,
    activeScheduleCount: 0,
    joinDate: "2025-08-10",
    username: "harish",
    password: "cleanzx@2026",
    canLogin: true
  }
];
export const INITIAL_CUSTOMERS = [];
export const INITIAL_SUBSCRIPTIONS = [];
export const INITIAL_BOOKINGS = [];
export const INITIAL_DAILY_SCHEDULE = [];
export const INITIAL_INVOICES = [];
export const INITIAL_SUBSCRIPTION_CHANGES = [];

export const DEFAULT_INTEGRATIONS_SETTINGS = {
  onlinePayments: {
    enabled: true,
    provider: 'Razorpay & UPI Gateway',
    mode: 'Sandbox & Production Ready',
    autoReconciliation: true,
    supportedMethods: ['UPI (GPay / PhonePe / Paytm / BHIM)', 'Credit & Debit Cards (RuPay, Visa, MC)', 'Net Banking (50+ Banks)'],
    webhookActive: true,
    merchantId: 'rzp_live_cleanZX9848',
    lastPing: '2026-10-15 08:30 AM (200 OK)'
  },
  whatsAppAutomation: {
    enabled: true,
    cloudApiStatus: 'Connected & Verified (Meta Business API)',
    wabaId: 'WABA-IND-HYD-984801',
    bookingConfirmations: true,
    morningDispatch: true,
    serviceCompleted: true,
    renewalReminders: true,
    paymentReceipts: true
  },
  renewalReminders: {
    enabled: true,
    tMinus7Days: true,
    tMinus3Days: true,
    tMinus1Day: true,
    discountCode: 'RENEW2026',
    discountAmount: 100,
    autoTriggerSchedule: 'Daily at 09:30 AM'
  },
  customerAccounts: {
    selfServicePortal: true,
    instantPdfInvoices: true,
    emailReceipts: true,
    smsAlerts: true,
    pushNotifications: false
  },
  referralRewards: {
    enabled: true,
    referrerBonus: 150,
    refereeBonus: 150,
    rules: 'Both existing customer and referred neighbor receive ₹150 discount credit on active monthly subscription.'
  },
  locations: [
    { id: 'LOC-1', name: 'Mehdipatnam & Tolichowki', zone: 'Central West', active: true, apartmentsCount: 6, teamLead: 'Unassigned', scheduleWindow: '06:00 AM - 11:30 AM' },
    { id: 'LOC-2', name: 'Gachibowli & Financial District', zone: 'IT Corridor West', active: true, apartmentsCount: 8, teamLead: 'Unassigned', scheduleWindow: '06:00 AM - 11:30 AM' },
    { id: 'LOC-3', name: 'Kondapur & Hitec City', zone: 'Cyber Corridor', active: true, apartmentsCount: 9, teamLead: 'Unassigned', scheduleWindow: '06:00 AM - 11:30 AM' },
    { id: 'LOC-4', name: 'Banjara Hills & Jubilee Hills', zone: 'Prime Hills', active: true, apartmentsCount: 5, teamLead: 'Unassigned', scheduleWindow: '06:00 AM - 11:30 AM' },
    { id: 'LOC-5', name: 'Madhapur & Cyber City', zone: 'North West Corridor', active: true, apartmentsCount: 7, teamLead: 'Unassigned', scheduleWindow: '06:00 AM - 11:30 AM' }
  ],
  mobileAppReadiness: {
    androidStatus: 'Production Ready (React Native Build Spec)',
    iosStatus: 'Production Ready (Swift Bridge / TestFlight)',
    apiVersion: 'v2.4.0',
    endpointsOperational: 18,
    backendStatus: '100% Mobile Ready'
  },
  scopeApproval: {
    clientName: 'CleanZX Operations Management',
    clientSignature: 'CleanZX Authorized Signatory',
    clientDate: '2026-10-15',
    clientApproved: true,
    devName: 'Advanced Web Engineering Team',
    devSignature: 'Lead Full-Stack Architect',
    devDate: '2026-10-15',
    devApproved: true
  },
  acceptanceCriteria: {
    ac1_browse_compare_book: true,
    ac2_admin_manage_all: true,
    ac3_customer_portal_login: true,
    ac4_employee_job_updates: true,
    ac5_admin_reports_revenue: true,
    ac6_whatsapp_actions_live: true,
    ac7_responsive_testing_passed: true
  }
};
