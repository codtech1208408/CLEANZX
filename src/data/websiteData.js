export const BUSINESS_INFO = {
  name: "CLEANZX",
  tagline: "Premium car care, delivered to your doorstep.",
  headline: "Premium Car Cleaning. Right at Your Doorstep.",
  subheadline: "Keep your car spotless without leaving home. Discover convenient doorstep car cleaning and flexible subscription plans from CLEANZX in Hyderabad.",
  phone: "9642734252",
  phoneFormatted: "+91 96427 34252",
  whatsapp: "9642734252",
  whatsappFormatted: "+91 9642734252",
  whatsappUrl: "https://wa.me/919642734252",
  email: "cleanzxcare@gmail.com",
  instagramUrl: "https://instagram.com/cleanzxcare?utm_source=qr&xtok=MWh4eG5oM2h5cGplMg==",
  facebookUrl: "https://www.facebook.com/share/1YRdvBjEjh/",
  location: {
    area: "Mehdipatnam",
    city: "Hyderabad",
    state: "Telangana",
    country: "India",
    displayText: "Mehdipatnam, Hyderabad, Telangana, India",
    landmark: "Serving Mehdipatnam & residential apartments across Hyderabad"
  },
  operatingHours: {
    start: "06:00 AM",
    end: "11:30 AM",
    displayText: "06:00 AM - 11:30 AM",
    timezone: "Asia/Kolkata",
    daysNote: "Daily morning service slots suited for apartment residents & working professionals"
  }
};

export const STANDARD_SERVICES = [
  {
    id: "dust-removal",
    name: "Dust Removal",
    tagline: "Comprehensive daily surface clearing",
    description: "Remove everyday dust from accessible exterior surfaces and other surfaces explicitly included in the selected plan.",
    details: [
      "Gentle microfiber dust extraction",
      "Protection against paint swirls and scratches",
      "Accessible hood, roof, side panels & boot wipe",
      "Special attention to crevices and window seals"
    ],
    image: "/images/hero-car.jpg",
    icon: "Wind"
  },
  {
    id: "exterior-cleaning",
    name: "Exterior Cleaning",
    tagline: "Spotless doorstep exterior wash",
    description: "Clean the vehicle exterior using an appropriate cleaning process for the selected service.",
    details: [
      "Apartment-friendly, eco-conscious cleaning process",
      "Microfiber contact wash for maximum shine",
      "Exterior bodywork and side mirrors cleaned",
      "Streak-free dry finish without water accumulation in parking lots"
    ],
    image: "/images/exterior-wash.jpg",
    icon: "Car"
  },
  {
    id: "glass-cleaning",
    name: "Glass Cleaning",
    tagline: "Crystal-clear visibility & streak-free shine",
    description: "Clean accessible vehicle glass surfaces to improve clarity and appearance.",
    details: [
      "Front windshield and rear glass cleaning",
      "All side windows and quarter glass surfaces",
      "Exterior rearview mirrors cleaned and buffed",
      "Non-smear automotive glass finishing solution"
    ],
    image: "/images/glass-cleaning.jpg",
    icon: "Sparkles"
  },
  {
    id: "tyre-cleaning",
    name: "Tyre Cleaning",
    tagline: "Tough grime removal for neat wheels",
    description: "Clean accessible tyre surfaces to give the vehicle a neat, maintained appearance.",
    details: [
      "Tyre tread and visible sidewall cleaning",
      "Brake dust and loose road mud removal",
      "Wheel rim and cap wipe-down",
      "Crisp, finished presentation ready for the road"
    ],
    image: "/images/tyre-detailing.jpg",
    icon: "CircleDot"
  }
];

export const OPTIONAL_ADDONS = [
  {
    id: "interior-vacuuming",
    name: "Interior Vacuuming",
    description: "Vacuum accessible seats, floor mats, and interior floor areas.",
    price: null,
    priceStatus: "Price to be confirmed",
    badge: "Most Requested",
    icon: "Fan",
    image: "/images/addon-vacuum.jpg"
  },
  {
    id: "dashboard-detailing",
    name: "Dashboard Cleaning",
    description: "Clean accessible dashboard and interior trim surfaces with lint-free microfiber.",
    price: null,
    priceStatus: "Price to be confirmed",
    badge: "Interior Care",
    icon: "Gauge",
    image: "/images/addon-dashboard.jpg"
  },
  {
    id: "deep-interior-cleaning",
    name: "Deep Interior Cleaning",
    description: "A more detailed interior cleaning service subject to vehicle condition and service availability.",
    price: null,
    priceStatus: "Price to be confirmed",
    badge: "Detailed Care",
    icon: "Layers",
    image: "/images/addon-deep-interior.jpg"
  },
  {
    id: "premium-tyre-polish",
    name: "Tyre Polish",
    description: "Apply a suitable tyre dressing for an enhanced finished appearance.",
    price: null,
    priceStatus: "Price to be confirmed",
    badge: "Gloss Finish",
    icon: "Sparkle",
    image: "/images/addon-tyre.jpg"
  },
  {
    id: "seat-cleaning",
    name: "Seat Cleaning",
    description: "Additional cleaning of suitable vehicle seat surfaces.",
    price: null,
    priceStatus: "Price to be confirmed",
    badge: "Comfort",
    icon: "Armchair",
    image: "/images/addon-seat-cleaning.jpg"
  }
];

export const SUBSCRIPTION_PLANS = [
  // --- NORMAL CATEGORY ---
  {
    id: "normal-15-day",
    name: "15-Day Normal Plan",
    displayName: "15-Day Plan",
    category: "Normal",
    duration: "15 days",
    price: null,
    priceDisplay: "Price to be confirmed",
    billingPeriod: "15 days",
    cleaningFrequency: "Scheduled morning service cycles across 15 days",
    includedServices: [
      "Dust Removal",
      "Exterior Cleaning",
      "Glass Cleaning",
      "Tyre Cleaning"
    ],
    popular: false,
    highlight: "Essential 15-day trial upkeep for apartment car owners",
    statusBadge: "Enquiry-Only State",
    buttonLabel: "Select 15-Day Normal Plan"
  },
  {
    id: "normal-monthly",
    name: "Monthly Normal Plan",
    displayName: "Monthly Plan",
    category: "Normal",
    duration: "1 month",
    price: null,
    priceDisplay: "Price to be confirmed",
    billingPeriod: "Monthly",
    cleaningFrequency: "Regular morning cycle throughout 30 days",
    includedServices: [
      "Dust Removal",
      "Exterior Cleaning",
      "Glass Cleaning",
      "Tyre Cleaning"
    ],
    popular: true,
    highlight: "Steady month-long car care before your daily drive",
    statusBadge: "Enquiry-Only State",
    buttonLabel: "Select Monthly Normal Plan"
  },
  {
    id: "normal-quarterly",
    name: "Quarterly Normal Plan",
    displayName: "Quarterly Plan",
    category: "Normal",
    duration: "3 months",
    price: null,
    priceDisplay: "Price to be confirmed",
    billingPeriod: "Quarterly",
    cleaningFrequency: "Continuous routine cleaning for 90 days",
    includedServices: [
      "Dust Removal",
      "Exterior Cleaning",
      "Glass Cleaning",
      "Tyre Cleaning"
    ],
    popular: false,
    highlight: "Convenient 3-month uninterrupted routine maintenance",
    statusBadge: "Enquiry-Only State",
    buttonLabel: "Select Quarterly Normal Plan"
  },
  {
    id: "normal-half-yearly",
    name: "Half-Yearly Normal Plan",
    displayName: "Half-Yearly Plan",
    category: "Normal",
    duration: "6 months",
    price: null,
    priceDisplay: "Price to be confirmed",
    billingPeriod: "Half-yearly",
    cleaningFrequency: "Long-term doorstep vehicle maintenance for 180 days",
    includedServices: [
      "Dust Removal",
      "Exterior Cleaning",
      "Glass Cleaning",
      "Tyre Cleaning"
    ],
    popular: false,
    highlight: "Hassle-free 6-month consistent routine for apartment cars",
    statusBadge: "Enquiry-Only State",
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
    priceDisplay: "Price to be confirmed",
    billingPeriod: "15 days",
    cleaningFrequency: "Priority morning service cycles across 15 days",
    includedServices: [
      "Dust Removal",
      "Exterior Cleaning",
      "Glass Cleaning",
      "Tyre Cleaning",
      "Priority Morning Slot Allocation",
      "Dedicated Spot Inspection"
    ],
    popular: false,
    highlight: "Intensive 15-day detailing trial with priority morning care",
    statusBadge: "Enquiry-Only State",
    buttonLabel: "Select 15-Day Premium Plan"
  },
  {
    id: "premium-monthly",
    name: "Monthly Premium Plan",
    displayName: "Monthly Plan",
    category: "Premium",
    duration: "1 month",
    price: null,
    priceDisplay: "Price to be confirmed",
    billingPeriod: "Monthly",
    cleaningFrequency: "Enhanced morning cycle with priority slot care for 30 days",
    includedServices: [
      "Dust Removal",
      "Exterior Cleaning",
      "Glass Cleaning",
      "Tyre Cleaning",
      "Priority Morning Slot Allocation",
      "Dedicated Spot Inspection"
    ],
    popular: true,
    highlight: "Our most popular comprehensive monthly doorstep car care",
    statusBadge: "Enquiry-Only State",
    buttonLabel: "Select Monthly Premium Plan"
  },
  {
    id: "premium-quarterly",
    name: "Quarterly Premium Plan",
    displayName: "Quarterly Plan",
    category: "Premium",
    duration: "3 months",
    price: null,
    priceDisplay: "Price to be confirmed",
    billingPeriod: "Quarterly",
    cleaningFrequency: "Continuous priority cleaning & detailing assessment for 90 days",
    includedServices: [
      "Dust Removal",
      "Exterior Cleaning",
      "Glass Cleaning",
      "Tyre Cleaning",
      "Priority Slot Scheduling",
      "Quarterly Detailing Assessment"
    ],
    popular: false,
    highlight: "Quarterly comprehensive care with dedicated spot checks",
    statusBadge: "Enquiry-Only State",
    buttonLabel: "Select Quarterly Premium Plan"
  },
  {
    id: "premium-half-yearly",
    name: "Half-Yearly Premium Plan",
    displayName: "Half-Yearly Plan",
    category: "Premium",
    duration: "6 months",
    price: null,
    priceDisplay: "Price to be confirmed",
    billingPeriod: "Half-yearly",
    cleaningFrequency: "Maximum priority long-term doorstep care for 180 days",
    includedServices: [
      "Dust Removal",
      "Exterior Cleaning",
      "Glass Cleaning",
      "Tyre Cleaning",
      "Priority Slot Scheduling",
      "Extended Service Support"
    ],
    popular: false,
    highlight: "Complete 6-month peace of mind with premium priority service",
    statusBadge: "Enquiry-Only State",
    buttonLabel: "Select Half-Yearly Premium Plan"
  }
];

export const HOW_IT_WORKS = [
  {
    step: 1,
    title: "Choose Your Plan",
    description: "Explore the available services and subscription options tailored for your vehicle routine."
  },
  {
    step: 2,
    title: "Share Your Details",
    description: "Enter your apartment, vehicle details, contact information, and preferred plan."
  },
  {
    step: 3,
    title: "Confirm Your Booking",
    description: "CLEANZX reviews your enquiry and confirms slot availability and service details."
  },
  {
    step: 4,
    title: "Enjoy Doorstep Cleaning",
    description: "Receive your scheduled morning car cleaning service right at your residential parking."
  }
];

export const TRUST_POINTS = [
  {
    title: "Doorstep Convenience",
    description: "No need to visit a service station or wait in queues. We come right to your apartment parking.",
    icon: "ShieldCheck"
  },
  {
    title: "Morning Routine Slots",
    description: "Operating from 06:00 AM to 11:30 AM so your car is clean and ready before your morning commute.",
    icon: "Clock"
  },
  {
    title: "Transparent Plans",
    description: "All inclusions and frequencies clearly communicated with zero hidden costs.",
    icon: "FileCheck"
  },
  {
    title: "Direct WhatsApp Support",
    description: "Instant enquiry coordination and schedule updates directly through WhatsApp.",
    icon: "MessageSquare"
  }
];

export const FAQS = [
  {
    question: "How does the doorstep car cleaning service work in apartments?",
    answer: "Our technicians arrive directly at your residential apartment parking in Mehdipatnam or Hyderabad during our morning operating hours (06:00 AM - 11:30 AM). We perform the cleaning right at your allotted parking bay using eco-friendly, apartment-safe methods that do not create puddles or disrupt neighbours."
  },
  {
    question: "What are your operating hours?",
    answer: "CLEANZX operates from 06:00 AM to 11:30 AM (IST). Morning slots are specifically structured so your car is spotless and ready before you head to work."
  },
  {
    question: "How are subscription prices determined?",
    answer: "All subscription pricing is determined based on your car segment (Hatchback, Sedan, SUV/Luxury), preferred frequency, and apartment location. When you submit an enquiry, our team provides the exact approved quote without hidden fees."
  },
  {
    question: "Can I choose optional add-on services?",
    answer: "Yes! In addition to standard services (Dust Removal, Exterior Cleaning, Glass Cleaning, Tyre Cleaning), you can request optional paid add-ons like Interior Vacuuming, Dashboard Cleaning, Deep Interior Cleaning, and Tyre Polish."
  },
  {
    question: "Does submitting the booking form immediately charge me?",
    answer: "No. Submitting a booking enquiry does not charge you or activate a subscription. It allows CLEANZX to review your apartment location, vehicle model, and slot availability, and then contact you to finalize the schedule."
  },
  {
    question: "Which areas in Hyderabad do you cover?",
    answer: "We are based in Mehdipatnam, Hyderabad, Telangana, and cater to residential apartments and societies in Mehdipatnam and neighbouring areas. Submit your apartment details to confirm coverage for your society."
  }
];

export const SERVICE_TIME_SLOTS = [
  "06:00 AM - 07:00 AM",
  "07:00 AM - 08:00 AM",
  "08:00 AM - 09:00 AM",
  "09:00 AM - 10:00 AM",
  "10:00 AM - 11:00 AM",
  "11:00 AM - 11:30 AM"
];
