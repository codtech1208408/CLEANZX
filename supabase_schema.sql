-- =====================================================================
-- CLEANZX SUPABASE DATABASE SCHEMA & SEED DATA
-- Project: CLEANZX Doorstep Car Care (Hyderabad)
-- =====================================================================

-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ---------------------------------------------------------------------
-- 1. WEBSITE CONTENT TABLE
-- Stores dynamic home banners, promo announcement, about us, contact info
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS website_content (
  key VARCHAR(50) PRIMARY KEY,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---------------------------------------------------------------------
-- 2. SUBSCRIPTION PLANS TABLE
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS plans (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  display_name VARCHAR(100),
  category VARCHAR(50) NOT NULL CHECK (category IN ('Normal', 'Premium')),
  duration VARCHAR(50) NOT NULL,
  price NUMERIC(10, 2) NOT NULL DEFAULT 0,
  price_display VARCHAR(50),
  billing_period VARCHAR(50) NOT NULL,
  cleaning_frequency TEXT,
  included_services JSONB NOT NULL DEFAULT '[]'::jsonb,
  popular BOOLEAN DEFAULT FALSE,
  highlight TEXT,
  button_label VARCHAR(100),
  status VARCHAR(20) DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
  published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---------------------------------------------------------------------
-- 3. OPTIONAL ADD-ONS TABLE
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS addons (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL DEFAULT 0,
  price_display VARCHAR(50),
  badge VARCHAR(50),
  icon VARCHAR(50),
  image TEXT,
  published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---------------------------------------------------------------------
-- 4. CUSTOMERS TABLE
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS customers (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(150),
  apartment VARCHAR(150) NOT NULL,
  block VARCHAR(50),
  flat_number VARCHAR(50) NOT NULL,
  car_model VARCHAR(150) NOT NULL,
  vehicle_registration_number VARCHAR(50) NOT NULL,
  car_type VARCHAR(50) DEFAULT 'Sedan',
  active_plan VARCHAR(150),
  plan_id VARCHAR(50),
  subscription_status VARCHAR(50) DEFAULT 'Active' CHECK (subscription_status IN ('Active', 'Pending', 'Expired', 'Cancelled')),
  payment_status VARCHAR(50) DEFAULT 'Paid' CHECK (payment_status IN ('Paid', 'Pending', 'Partially Paid')),
  total_spent NUMERIC(10, 2) DEFAULT 0,
  balance_due NUMERIC(10, 2) DEFAULT 0,
  join_date DATE DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---------------------------------------------------------------------
-- 5. SUBSCRIPTIONS TABLE
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS subscriptions (
  id VARCHAR(50) PRIMARY KEY,
  customer_id VARCHAR(50) REFERENCES customers(id) ON DELETE SET NULL,
  customer_name VARCHAR(150) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  apartment VARCHAR(150) NOT NULL,
  flat VARCHAR(100) NOT NULL,
  car VARCHAR(150) NOT NULL,
  plan_id VARCHAR(50) REFERENCES plans(id) ON DELETE SET NULL,
  plan_name VARCHAR(150) NOT NULL,
  category VARCHAR(50) DEFAULT 'Normal',
  start_date DATE NOT NULL,
  expiry_date DATE NOT NULL,
  days_remaining INT DEFAULT 30,
  amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
  status VARCHAR(50) DEFAULT 'Active' CHECK (status IN ('Active', 'Renewed', 'Pending', 'Expired', 'Cancelled')),
  time_slot VARCHAR(50) DEFAULT '07:00 AM - 08:00 AM',
  assigned_employee VARCHAR(150),
  auto_renew BOOLEAN DEFAULT TRUE,
  renewal_count INT DEFAULT 0,
  authorized_changes JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---------------------------------------------------------------------
-- 6. BOOKINGS & WEBSITE ENQUIRIES TABLE
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS bookings (
  id VARCHAR(50) PRIMARY KEY,
  customer_name VARCHAR(150) NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  apartment VARCHAR(150) NOT NULL,
  block VARCHAR(50),
  flat_number VARCHAR(50) NOT NULL,
  car_model VARCHAR(150) NOT NULL,
  vehicle_registration_number VARCHAR(50) NOT NULL,
  preferred_plan VARCHAR(150) NOT NULL,
  preferred_start_date DATE,
  preferred_time VARCHAR(50),
  selected_addons JSONB DEFAULT '[]'::jsonb,
  status VARCHAR(50) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled', 'Missed')),
  assigned_employee VARCHAR(150) DEFAULT 'Unassigned',
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---------------------------------------------------------------------
-- 7. EMPLOYEES & SPECIALISTS TABLE
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS employees (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(150),
  role VARCHAR(100) DEFAULT 'Doorstep Cleaning Specialist',
  zone VARCHAR(150),
  assigned_apartments JSONB DEFAULT '[]'::jsonb,
  status VARCHAR(50) DEFAULT 'Active' CHECK (status IN ('Active', 'On Leave', 'Inactive')),
  rating NUMERIC(3, 1) DEFAULT 5.0,
  jobs_completed INT DEFAULT 0,
  active_schedule_count INT DEFAULT 0,
  join_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---------------------------------------------------------------------
-- 8. DAILY SERVICE SCHEDULE (6:00 AM - 11:30 AM)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS daily_schedules (
  id VARCHAR(50) PRIMARY KEY,
  time_slot VARCHAR(50) NOT NULL,
  customer_name VARCHAR(150) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  apartment VARCHAR(150) NOT NULL,
  block VARCHAR(50),
  flat VARCHAR(50) NOT NULL,
  car_model VARCHAR(150) NOT NULL,
  reg_number VARCHAR(50) NOT NULL,
  plan_name VARCHAR(150) NOT NULL,
  employee_id VARCHAR(50) REFERENCES employees(id) ON DELETE SET NULL,
  employee_name VARCHAR(150) NOT NULL,
  date DATE DEFAULT CURRENT_DATE,
  status VARCHAR(50) DEFAULT 'Assigned' CHECK (status IN ('Assigned', 'In Progress', 'Completed', 'Missed', 'Rescheduled', 'Cancelled')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---------------------------------------------------------------------
-- 9. INVOICES & PAYMENTS TABLE
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS invoices (
  id VARCHAR(50) PRIMARY KEY,
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  customer_id VARCHAR(50) REFERENCES customers(id) ON DELETE SET NULL,
  customer_name VARCHAR(150) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  apartment VARCHAR(150) NOT NULL,
  flat VARCHAR(100),
  car_details VARCHAR(150),
  plan_name VARCHAR(150) NOT NULL,
  date DATE DEFAULT CURRENT_DATE,
  due_date DATE,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0,
  discount NUMERIC(10, 2) DEFAULT 0,
  total NUMERIC(10, 2) NOT NULL DEFAULT 0,
  amount_paid NUMERIC(10, 2) DEFAULT 0,
  balance NUMERIC(10, 2) DEFAULT 0,
  status VARCHAR(50) DEFAULT 'Pending' CHECK (status IN ('Paid', 'Pending', 'Partially Paid', 'Overdue', 'Cancelled')),
  payment_date DATE,
  payment_method VARCHAR(50),
  transaction_ref VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---------------------------------------------------------------------
-- 10. SUBSCRIPTION DATE CHANGES AUDIT LOG
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS subscription_changes (
  id VARCHAR(50) PRIMARY KEY,
  customer_id VARCHAR(50),
  customer_name VARCHAR(150) NOT NULL,
  plan VARCHAR(150),
  change_type VARCHAR(100) NOT NULL,
  old_value TEXT,
  new_value TEXT,
  reason TEXT NOT NULL,
  authorized_by VARCHAR(100) DEFAULT 'Admin',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================================
ALTER TABLE website_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_changes ENABLE ROW LEVEL SECURITY;

-- Allow public read access to website content, plans, addons
CREATE POLICY "Public Read Website Content" ON website_content FOR SELECT USING (true);
CREATE POLICY "Public Read Plans" ON plans FOR SELECT USING (true);
CREATE POLICY "Public Read Addons" ON addons FOR SELECT USING (true);

-- Allow public visitors to submit booking enquiries
CREATE POLICY "Public Insert Bookings" ON bookings FOR INSERT WITH CHECK (true);

-- Allow full access for anon/authenticated (CLEANZX Admin Operations)
CREATE POLICY "Admin All Website Content" ON website_content FOR ALL USING (true);
CREATE POLICY "Admin All Plans" ON plans FOR ALL USING (true);
CREATE POLICY "Admin All Addons" ON addons FOR ALL USING (true);
CREATE POLICY "Admin All Customers" ON customers FOR ALL USING (true);
CREATE POLICY "Admin All Subscriptions" ON subscriptions FOR ALL USING (true);
CREATE POLICY "Admin All Bookings" ON bookings FOR ALL USING (true);
CREATE POLICY "Admin All Employees" ON employees FOR ALL USING (true);
CREATE POLICY "Admin All Schedules" ON daily_schedules FOR ALL USING (true);
CREATE POLICY "Admin All Invoices" ON invoices FOR ALL USING (true);
CREATE POLICY "Admin All Subscription Changes" ON subscription_changes FOR ALL USING (true);

-- =====================================================================
-- INITIAL SEED DATA
-- =====================================================================

-- 1. Seed Plans
INSERT INTO plans (id, name, display_name, category, duration, price, price_display, billing_period, cleaning_frequency, included_services, popular, highlight, button_label, status)
VALUES
  ('normal-15-day', '15-Day Normal Plan', '15-Day Plan', 'Normal', '15 days', 549, '₹549', '15 days', 'Scheduled morning service cycles across 15 days', '["Dust Removal", "Exterior Cleaning", "Glass Cleaning", "Tyre Cleaning"]'::jsonb, false, 'Essential 15-day trial upkeep for apartment car owners', 'Select 15-Day Normal Plan', 'Active'),
  ('normal-monthly', 'Monthly Normal Plan', 'Monthly Plan', 'Normal', '1 month', 899, '₹899', 'Monthly', 'Regular morning cycle throughout 30 days', '["Dust Removal", "Exterior Cleaning", "Glass Cleaning", "Tyre Cleaning"]'::jsonb, true, 'Steady month-long car care before your daily drive', 'Select Monthly Normal Plan', 'Active'),
  ('normal-quarterly', 'Quarterly Normal Plan', 'Quarterly Plan', 'Normal', '3 months', 2499, '₹2499', 'Quarterly', 'Continuous routine cleaning for 90 days', '["Dust Removal", "Exterior Cleaning", "Glass Cleaning", "Tyre Cleaning"]'::jsonb, false, 'Convenient 3-month uninterrupted routine maintenance', 'Select Quarterly Normal Plan', 'Active'),
  ('normal-half-yearly', 'Half-Yearly Normal Plan', 'Half-Yearly Plan', 'Normal', '6 months', 4699, '₹4699', 'Half-yearly', 'Long-term doorstep vehicle maintenance for 180 days', '["Dust Removal", "Exterior Cleaning", "Glass Cleaning", "Tyre Cleaning"]'::jsonb, false, 'Hassle-free 6-month consistent routine for apartment cars', 'Select Half-Yearly Normal Plan', 'Active'),
  ('premium-15-day', '15-Day Premium Plan', '15-Day Plan', 'Premium', '15 days', 849, '₹849', '15 days', 'Priority morning service cycles across 15 days', '["Dust Removal", "Exterior Cleaning", "Glass Cleaning", "Tyre Cleaning", "Priority Morning Slot Allocation", "Dedicated Spot Inspection"]'::jsonb, false, 'Intensive 15-day detailing trial with priority morning care', 'Select 15-Day Premium Plan', 'Active'),
  ('premium-monthly', 'Monthly Premium Plan', 'Monthly Plan', 'Premium', '1 month', 1499, '₹1499', 'Monthly', 'Enhanced morning cycle with priority slot care for 30 days', '["Dust Removal", "Exterior Cleaning", "Glass Cleaning", "Tyre Cleaning", "Priority Morning Slot Allocation", "Dedicated Spot Inspection"]'::jsonb, true, 'Our most popular comprehensive monthly doorstep car care', 'Select Monthly Premium Plan', 'Active'),
  ('premium-quarterly', 'Quarterly Premium Plan', 'Quarterly Plan', 'Premium', '3 months', 4199, '₹4199', 'Quarterly', 'Continuous priority cleaning & detailing assessment for 90 days', '["Dust Removal", "Exterior Cleaning", "Glass Cleaning", "Tyre Cleaning", "Priority Slot Scheduling", "Quarterly Detailing Assessment"]'::jsonb, false, 'Quarterly comprehensive care with dedicated spot checks', 'Select Quarterly Premium Plan', 'Active'),
  ('premium-half-yearly', 'Half-Yearly Premium Plan', 'Half-Yearly Plan', 'Premium', '6 months', 7999, '₹7999', 'Half-yearly', 'Maximum priority long-term doorstep care for 180 days', '["Dust Removal", "Exterior Cleaning", "Glass Cleaning", "Tyre Cleaning", "Priority Slot Scheduling", "Extended Service Support"]'::jsonb, false, 'Complete 6-month peace of mind with premium priority service', 'Select Half-Yearly Premium Plan', 'Active')
ON CONFLICT (id) DO UPDATE SET
  price = EXCLUDED.price,
  status = EXCLUDED.status;

-- 2. Seed Detailing Add-ons
INSERT INTO addons (id, name, description, price, price_display, badge, icon, image, published)
VALUES
  ('interior-vacuuming', 'Interior Vacuuming', 'Vacuum accessible seats, floor mats, and interior floor areas.', 399, '₹399', 'Most Requested', 'Fan', '/images/addon-vacuum.jpg', true),
  ('dashboard-detailing', 'Dashboard Cleaning', 'Clean accessible dashboard and interior trim surfaces with lint-free microfiber.', 249, '₹249', 'Interior Care', 'Gauge', '/images/addon-dashboard.jpg', true),
  ('deep-interior-cleaning', 'Deep Interior Cleaning', 'A more detailed interior cleaning service subject to vehicle condition and service availability.', 799, '₹799', 'Detailed Care', 'Layers', '/images/addon-deep-interior.jpg', true),
  ('premium-tyre-polish', 'Tyre Polish', 'Apply a suitable tyre dressing for an enhanced finished appearance.', 199, '₹199', 'Gloss Finish', 'Sparkle', '/images/addon-tyre.jpg', true),
  ('seat-cleaning', 'Seat Cleaning', 'Additional cleaning of suitable vehicle seat surfaces.', 349, '₹349', 'Comfort', 'Armchair', '/images/addon-seat-cleaning.jpg', true)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price;

-- 3. Seed Employees
INSERT INTO employees (id, name, phone, email, role, zone, assigned_apartments, status, rating, jobs_completed, active_schedule_count, join_date)
VALUES
  ('EMP-01', 'Ramesh Varma', '9848012345', 'ramesh.v@cleanzx.com', 'Senior Detailing Lead', 'Mehdipatnam & Tolichowki', '["Prestige High Fields", "Skyline Towers"]'::jsonb, 'Active', 4.9, 342, 4, '2025-08-10'),
  ('EMP-02', 'Kalyan Kumar', '9848023456', 'kalyan.k@cleanzx.com', 'Doorstep Cleaning Specialist', 'Gachibowli & Kondapur', '["Aparna Sarovar", "My Home Bhooja"]'::jsonb, 'Active', 4.8, 289, 5, '2025-09-15'),
  ('EMP-03', 'Mohammad Irfan', '9848034567', 'irfan.m@cleanzx.com', 'Doorstep Cleaning Specialist', 'Madhapur & Hitec City', '["Rainbow Vistas", "Cyber City Towers"]'::jsonb, 'Active', 4.9, 310, 4, '2025-10-01'),
  ('EMP-04', 'Suresh Babu', '9848045678', 'suresh.b@cleanzx.com', 'Mobile Care Technician', 'Banjara Hills & Jubilee Hills', '["Lodha Bellezza", "Fortune Enclave"]'::jsonb, 'Active', 4.7, 195, 3, '2025-11-20'),
  ('EMP-05', 'Naresh Reddy', '9848056789', 'naresh.r@cleanzx.com', 'Relief & Quality Inspector', 'Overall Hyderabad West', '["Backup Support across zones"]'::jsonb, 'On Leave', 4.8, 215, 0, '2025-12-05')
ON CONFLICT (id) DO NOTHING;

-- 4. Seed Customers
INSERT INTO customers (id, name, phone, email, apartment, block, flat_number, car_model, vehicle_registration_number, car_type, active_plan, plan_id, subscription_status, payment_status, total_spent, balance_due, join_date, notes)
VALUES
  ('CUST-101', 'Vikram Malhotra', '9849123890', 'vikram.malhotra@gmail.com', 'Prestige High Fields', 'Tower 3', '804', 'Hyundai Creta SX (White)', 'TS 09 EZ 4412', 'SUV', 'Monthly Premium Plan', 'premium-monthly', 'Active', 'Paid', 4497, 0, '2026-01-10', 'Preferred slot 07:00 AM before office commute. Parked at B2-114.'),
  ('CUST-102', 'Ananya Rao', '9703456781', 'ananya.rao@outlook.com', 'Skyline Towers', 'Block B', '402', 'Honda City ZX (Silver)', 'TS 10 FA 7819', 'Sedan', 'Quarterly Normal Plan', 'normal-quarterly', 'Active', 'Paid', 4998, 0, '2026-01-22', 'Keyless exterior wash only. Basement 1 Bay 42.'),
  ('CUST-103', 'Syed Abdul Rahman', '9642734252', 'abdul.rahman@gmail.com', 'Aparna Sarovar', 'Block E', '1203', 'Kia Seltos HTX (Gravity Grey)', 'TS 07 HK 9031', 'SUV', 'Monthly Normal Plan', 'normal-monthly', 'Active', 'Paid', 2697, 0, '2026-02-01', 'Add-on interior vacuuming once every 2 weeks.'),
  ('CUST-104', 'Sneha Reddy', '9885112233', 'sneha.reddy@gmail.com', 'Rainbow Vistas', 'Sapphire Block', '605', 'Maruti Swift ZXi (Red)', 'TS 08 EN 1944', 'Hatchback', 'Monthly Normal Plan', 'normal-monthly', 'Active', 'Pending', 1798, 899, '2026-02-14', 'Requested monthly invoice via WhatsApp.'),
  ('CUST-105', 'Rajesh Kannan', '9940123456', 'rajesh.kannan@yahoo.co.in', 'Lodha Bellezza', 'Tower 1', '1802', 'BMW 3 Series (Portimao Blue)', 'TS 09 GJ 0007', 'Luxury Sedan', 'Half-Yearly Premium Plan', 'premium-half-yearly', 'Active', 'Paid', 15998, 0, '2025-11-01', 'VIP Customer. Extra care for matte alloy rims.')
ON CONFLICT (id) DO NOTHING;

-- 5. Seed Subscriptions
INSERT INTO subscriptions (id, customer_id, customer_name, phone, apartment, flat, car, plan_id, plan_name, category, start_date, expiry_date, days_remaining, amount, status, time_slot, assigned_employee, auto_renew, renewal_count)
VALUES
  ('SUB-2026-01', 'CUST-101', 'Vikram Malhotra', '9849123890', 'Prestige High Fields', 'Tower 3 - 804', 'Hyundai Creta SX (TS 09 EZ 4412)', 'premium-monthly', 'Monthly Premium Plan', 'Premium', '2026-03-01', '2026-03-31', 15, 1499, 'Active', '07:00 AM - 08:00 AM', 'Ramesh Varma', true, 2),
  ('SUB-2026-02', 'CUST-102', 'Ananya Rao', '9703456781', 'Skyline Towers', 'Block B - 402', 'Honda City ZX (TS 10 FA 7819)', 'normal-quarterly', 'Quarterly Normal Plan', 'Normal', '2026-01-22', '2026-04-22', 7, 2499, 'Active', '08:00 AM - 09:00 AM', 'Ramesh Varma', true, 1),
  ('SUB-2026-03', 'CUST-103', 'Syed Abdul Rahman', '9642734252', 'Aparna Sarovar', 'Block E - 1203', 'Kia Seltos HTX (TS 07 HK 9031)', 'normal-monthly', 'Monthly Normal Plan', 'Normal', '2026-03-10', '2026-04-09', 24, 899, 'Active', '06:00 AM - 07:00 AM', 'Kalyan Kumar', false, 0)
ON CONFLICT (id) DO NOTHING;

-- 6. Seed Invoices
INSERT INTO invoices (id, invoice_number, customer_id, customer_name, phone, apartment, flat, car_details, plan_name, date, due_date, items, subtotal, discount, total, amount_paid, balance, status, payment_date, payment_method, transaction_ref, notes)
VALUES
  ('INV-2026-001', 'INV-2026-001', 'CUST-101', 'Vikram Malhotra', '9849123890', 'Prestige High Fields', 'Tower 3 - 804', 'Hyundai Creta SX (TS 09 EZ 4412)', 'Monthly Premium Plan', '2026-03-01', '2026-03-05', '[{"description": "Monthly Premium Doorstep Car Cleaning Subscription", "amount": 1499}, {"description": "Add-on: Interior Vacuuming Service", "amount": 399}]'::jsonb, 1898, 100, 1798, 1798, 0, 'Paid', '2026-03-02', 'UPI', 'UPI/306124589921/HDFC', 'Received via Google Pay QR'),
  ('INV-2026-002', 'INV-2026-002', 'CUST-102', 'Ananya Rao', '9703456781', 'Skyline Towers', 'Block B - 402', 'Honda City ZX (TS 10 FA 7819)', 'Quarterly Normal Plan', '2026-01-22', '2026-01-27', '[{"description": "Quarterly Normal Plan (90-Day Morning Care)", "amount": 2499}]'::jsonb, 2499, 0, 2499, 2499, 0, 'Paid', '2026-01-22', 'Bank Transfer', 'NEFT/ICIC293849102', 'Direct bank transfer credited'),
  ('INV-2026-003', 'INV-2026-003', 'CUST-104', 'Sneha Reddy', '9885112233', 'Rainbow Vistas', 'Sapphire Block - 605', 'Maruti Swift ZXi (TS 08 EN 1944)', 'Monthly Normal Plan', '2026-03-14', '2026-03-19', '[{"description": "Monthly Normal Plan (30-Day Doorstep Cleaning)", "amount": 899}]'::jsonb, 899, 0, 899, 0, 899, 'Pending', null, null, null, 'Payment link sent via WhatsApp')
ON CONFLICT (id) DO NOTHING;

-- 7. Seed Daily Schedule (06:00 AM - 11:30 AM)
INSERT INTO daily_schedules (id, time_slot, customer_name, phone, apartment, block, flat, car_model, reg_number, plan_name, employee_id, employee_name, date, status, notes)
VALUES
  ('SCH-01', '06:00 AM - 07:00 AM', 'Syed Abdul Rahman', '9642734252', 'Aparna Sarovar', 'Block E', '1203', 'Kia Seltos HTX', 'TS 07 HK 9031', 'Monthly Normal Plan', 'EMP-02', 'Kalyan Kumar', CURRENT_DATE, 'Completed', 'Exterior and windshield dust cleared.'),
  ('SCH-02', '07:00 AM - 08:00 AM', 'Vikram Malhotra', '9849123890', 'Prestige High Fields', 'Tower 3', '804', 'Hyundai Creta SX', 'TS 09 EZ 4412', 'Monthly Premium Plan', 'EMP-01', 'Ramesh Varma', CURRENT_DATE, 'Completed', 'Exterior wash + tyre dressing applied.'),
  ('SCH-03', '08:00 AM - 09:00 AM', 'Ananya Rao', '9703456781', 'Skyline Towers', 'Block B', '402', 'Honda City ZX', 'TS 10 FA 7819', 'Quarterly Normal Plan', 'EMP-01', 'Ramesh Varma', CURRENT_DATE, 'In Progress', 'Executive currently working at basement level.'),
  ('SCH-04', '09:00 AM - 10:00 AM', 'Sneha Reddy', '9885112233', 'Rainbow Vistas', 'Sapphire Block', '605', 'Maruti Swift ZXi', 'TS 08 EN 1944', 'Monthly Normal Plan', 'EMP-03', 'Mohammad Irfan', CURRENT_DATE, 'Assigned', 'Scheduled for morning round.')
ON CONFLICT (id) DO NOTHING;
