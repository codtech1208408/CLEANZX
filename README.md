# CLEANZX — Doorstep Car Cleaning & Subscription Platform

**Premium car care, delivered to your doorstep.**

Operating out of **Mehdipatnam, Hyderabad, Telangana, India**, CLEANZX is a modern web application and management platform for apartment car owners and working professionals.

---

## 🚀 Key Features

1. **5 Complete Pages & Routing**:
   - **Home (`/`)**: Hero section with automotive imagery, trust points, 4 core services, 4-step process, subscription preview, add-on preview, why choose us, interactive FAQs, and booking form.
   - **Services (`/services`)**: In-depth breakdown of standard cleaning services (Dust Removal, Exterior Cleaning, Glass Cleaning, Tyre Cleaning), 5 optional paid add-ons, on-site execution protocol, and booking CTA.
   - **Subscription Plans (`/plans`)**: All 6 required subscription plans (Normal Plan, Premium Plan, 15-Day Plan, Monthly Plan, Quarterly Plan, Half-Yearly Plan), category filters (All / Normal / Premium), detailed side-by-side comparison table, and automatic form preselection.
   - **About Us (`/about`)**: Company background in Mehdipatnam, mission, vision, core principles (Convenience, Consistency, Transparency, Customer Focus), and residential apartment service commitments.
   - **Contact Us (`/contact`)**: Clickable phone (`tel:9642734252`), direct WhatsApp action, verified Mehdipatnam location embed, morning operating hours (`06:00 AM - 11:30 AM`), and contact enquiry form.
   - **Admin Operations Portal (`/admin`)**: Operations panel to search, filter, and track all booking enquiries, change status (Pending, Contacted, Confirmed, Completed), export data to CSV & JSON, and configure plan pricing and frequency.

2. **Booking Enquiry Form**:
   - Customer name validation (minimum 2 characters).
   - Indian mobile number validation (10 digits with optional +91).
   - Apartment, block, flat, car make/model, and vehicle registration number.
   - Dynamic plan selection automatically synchronized across all pages.
   - Preferred morning service time slots strictly within operating hours (`06:00 AM - 11:30 AM`).
   - Multi-select optional paid add-ons (Interior Vacuuming, Dashboard Cleaning, Deep Interior Cleaning, Tyre Polish, Seat Cleaning).
   - Full persistence to backend API (`/api/enquiries`) with automatic LocalStorage fallback when running standalone.
   - One-click instant **"Send Enquiry via WhatsApp"** pre-filled action.

3. **WhatsApp Integration**:
   - Floating action button with pulsing indicator and tooltip fixed at bottom-right.
   - Direct link to `https://wa.me/919642734252`.
   - Context-aware dynamic messaging based on user selections.

4. **Design System & Aesthetics**:
   - Deep Black (`#05070B`), Dark Charcoal (`#10151F`), Card (`#151C28`), and Border (`#263244`).
   - Accent Electric Blue (`#1677FF` and `#00A3FF`).
   - Typography: Manrope (headings) & Inter (body).
   - AOS (Animate On Scroll) entrance animations with respect for `prefers-reduced-motion`.

---

## 💻 Tech Stack

- **Frontend**: React 19, Vite 6, React Router DOM, Tailwind CSS v4, Lucide React, AOS.
- **Backend API**: Node.js with Express & CORS.
- **Storage**: Persistent JSON database (`server/data/enquiries.json` and `server/data/plans.json`) + client offline LocalStorage sync.

---

## 🛠️ How to Run Locally

### 1. Start the Backend Server (Port 5050)
```bash
npm run server
```
*API health endpoint: `http://localhost:5050/api/health`*

### 2. Start the Frontend Development Server (Port 5173 / 5174)
In a separate terminal window:
```bash
npm run dev
```
Open `http://localhost:5173/` (or `http://localhost:5174/`) in your browser.

### 3. Production Build
```bash
npm run build
npm run preview
```

---

## 📋 Business Details
- **Business Name**: CLEANZX
- **Location**: Mehdipatnam, Hyderabad, Telangana, India
- **Operating Hours**: 06:00 AM – 11:30 AM (IST)
- **Phone / WhatsApp**: 9642734252 (+91 96427 34252)
