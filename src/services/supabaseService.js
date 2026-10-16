// Supabase Cloud Synchronization Service for CLEANZX
// Keeps data 100% in sync between localhost:5173 and Vercel production deployment

export const SUPABASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) ||
  'https://fpgrfbsfltcffuwdjxbi.supabase.co';

export const SUPABASE_ANON_KEY =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZwZ3JmYnNmbHRjZmZ1d2RqeGJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIwNTgwNjEsImV4cCI6MjEwNzYzNDA2MX0.eipXuRRDmtopa9QjXM1rnjnMupTde_s1We1eKT-Xxnc';

const getHeaders = (returnRep = false) => {
  const headers = {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json'
  };
  if (returnRep) {
    headers['Prefer'] = 'return=representation';
  }
  return headers;
};

// ==========================================
// EMPLOYEES
// ==========================================
export const fetchCloudEmployees = async () => {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/employees?select=*&order=created_at.asc`, {
      headers: getHeaders()
    });
    if (!res.ok) return null;
    const rows = await res.json();
    if (!Array.isArray(rows)) return null;

    return rows.map(r => ({
      id: r.id,
      name: r.name,
      phone: r.phone,
      email: r.email,
      role: r.role || 'Doorstep Cleaning Specialist',
      zone: r.zone || 'Mehdipatnam & Tolichowki',
      assignedApartments: r.assigned_apartments || ['Prestige High Fields'],
      status: r.status || 'Active',
      rating: parseFloat(r.rating) || 5.0,
      jobsCompleted: parseInt(r.jobs_completed, 10) || 0,
      activeScheduleCount: parseInt(r.active_schedule_count, 10) || 0,
      joinDate: r.join_date || new Date().toISOString().slice(0, 10),
      username: (r.name || r.email || r.phone || '').trim().toLowerCase(),
      password: 'cleanzx@2026',
      canLogin: true
    }));
  } catch (err) {
    console.warn('[Supabase] Failed to fetch employees:', err);
    return null;
  }
};

export const createCloudEmployee = async (emp) => {
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/employees`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify({
        id: emp.id,
        name: emp.name,
        phone: emp.phone,
        email: emp.email,
        role: emp.role || 'Doorstep Cleaning Specialist',
        zone: emp.zone || 'Mehdipatnam & Tolichowki',
        assigned_apartments: emp.assignedApartments || ['Prestige High Fields'],
        status: emp.status || 'Active',
        rating: emp.rating || 5.0,
        jobs_completed: emp.jobsCompleted || 0,
        active_schedule_count: emp.activeScheduleCount || 0,
        join_date: emp.joinDate || new Date().toISOString().slice(0, 10)
      })
    });
  } catch (err) {
    console.warn('[Supabase] Failed to create employee:', err);
  }
};

export const updateCloudEmployee = async (id, updatedFields) => {
  try {
    const payload = {};
    if (updatedFields.name !== undefined) payload.name = updatedFields.name;
    if (updatedFields.phone !== undefined) payload.phone = updatedFields.phone;
    if (updatedFields.email !== undefined) payload.email = updatedFields.email;
    if (updatedFields.role !== undefined) payload.role = updatedFields.role;
    if (updatedFields.zone !== undefined) payload.zone = updatedFields.zone;
    if (updatedFields.assignedApartments !== undefined) payload.assigned_apartments = updatedFields.assignedApartments;
    if (updatedFields.status !== undefined) payload.status = updatedFields.status;
    if (updatedFields.rating !== undefined) payload.rating = updatedFields.rating;
    if (updatedFields.jobsCompleted !== undefined) payload.jobs_completed = updatedFields.jobsCompleted;
    if (updatedFields.activeScheduleCount !== undefined) payload.active_schedule_count = updatedFields.activeScheduleCount;

    await fetch(`${SUPABASE_URL}/rest/v1/employees?id=eq.${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
  } catch (err) {
    console.warn('[Supabase] Failed to update employee:', err);
  }
};

export const deleteCloudEmployee = async (id) => {
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/employees?id=eq.${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
  } catch (err) {
    console.warn('[Supabase] Failed to delete employee:', err);
  }
};

// ==========================================
// CUSTOMERS
// ==========================================
export const fetchCloudCustomers = async () => {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/customers?select=*&order=created_at.asc`, {
      headers: getHeaders()
    });
    if (!res.ok) return null;
    const rows = await res.json();
    if (!Array.isArray(rows)) return null;

    return rows.map(r => ({
      id: r.id,
      name: r.name,
      phone: r.phone,
      email: r.email,
      apartment: r.apartment,
      block: r.block,
      flat_number: r.flat_number,
      car_model: r.car_model,
      vehicle_registration_number: r.vehicle_registration_number,
      carType: r.car_type || 'Sedan',
      activePlan: r.active_plan,
      planId: r.plan_id,
      subscriptionStatus: r.subscription_status,
      paymentStatus: r.payment_status,
      totalSpent: parseFloat(r.total_spent) || 0,
      balanceDue: parseFloat(r.balance_due) || 0,
      joinDate: r.join_date,
      notes: r.notes || '',
      password: 'clean@2026'
    }));
  } catch (err) {
    console.warn('[Supabase] Failed to fetch customers:', err);
    return null;
  }
};

export const createCloudCustomer = async (cust) => {
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/customers`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify({
        id: cust.id,
        name: cust.name,
        phone: cust.phone,
        email: cust.email || '',
        apartment: cust.apartment,
        block: cust.block || 'Tower 1',
        flat_number: cust.flat_number || cust.flat || '',
        car_model: cust.car_model || 'Sedan',
        vehicle_registration_number: cust.vehicle_registration_number || '',
        car_type: cust.carType || 'Sedan',
        active_plan: cust.activePlan || 'Pending Approval',
        plan_id: cust.planId || '',
        subscription_status: cust.subscriptionStatus || 'Pending',
        payment_status: cust.paymentStatus || 'Pending',
        total_spent: cust.totalSpent || 0,
        balance_due: cust.balanceDue || 0,
        join_date: cust.joinDate || new Date().toISOString().slice(0, 10),
        notes: cust.notes || ''
      })
    });
  } catch (err) {
    console.warn('[Supabase] Failed to create customer:', err);
  }
};

export const deleteCloudCustomer = async (id) => {
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/customers?id=eq.${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
  } catch (err) {
    console.warn('[Supabase] Failed to delete customer:', err);
  }
};

// ==========================================
// BOOKINGS
// ==========================================
export const fetchCloudBookings = async () => {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/bookings?select=*&order=created_at.desc`, {
      headers: getHeaders()
    });
    if (!res.ok) return null;
    const rows = await res.json();
    return Array.isArray(rows) ? rows : null;
  } catch (err) {
    console.warn('[Supabase] Failed to fetch bookings:', err);
    return null;
  }
};

export const createCloudBooking = async (b) => {
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/bookings`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify({
        id: b.id,
        customer_name: b.customer_name || b.name,
        phone_number: b.phone_number || b.phone,
        apartment: b.apartment,
        block: b.block || '',
        flat_number: b.flat_number || b.flat || '',
        car_model: b.car_model || '',
        vehicle_registration_number: b.vehicle_registration_number || '',
        preferred_plan: b.preferred_plan || '',
        preferred_start_date: b.preferred_start_date || new Date().toISOString().slice(0, 10),
        preferred_time: b.preferred_time || '07:00 AM - 08:00 AM',
        selected_addons: b.selected_addons || [],
        status: b.status || 'Pending',
        assigned_employee: b.assigned_employee || 'Unassigned',
        admin_notes: b.adminNotes || null
      })
    });
  } catch (err) {
    console.warn('[Supabase] Failed to create booking:', err);
  }
};

export const deleteCloudBooking = async (id) => {
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/bookings?id=eq.${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
  } catch (err) {
    console.warn('[Supabase] Failed to delete booking:', err);
  }
};

// ==========================================
// UNIVERSAL KEY-VALUE CLOUD STORE (website_content, plans, subscriptions, daily_schedules, invoices, integrations_settings)
// ==========================================
export const saveCloudKV = async (key, data, versionTimestamp = Date.now()) => {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/website_content?on_conflict=key`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates,return=minimal'
      },
      body: JSON.stringify({
        key,
        data: {
          payload: data,
          _updatedAt: versionTimestamp
        },
        updated_at: new Date().toISOString()
      })
    });
    return res.ok;
  } catch (err) {
    console.warn(`[Supabase] Failed to save KV for key ${key}:`, err);
    return false;
  }
};

export const fetchAllCloudKV = async () => {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/website_content?select=*`, {
      headers: getHeaders()
    });
    if (!res.ok) return null;
    const rows = await res.json();
    if (!Array.isArray(rows)) return null;

    const kvMap = {};
    rows.forEach(r => {
      if (r && r.key) {
        // Handle payload wrapper or raw data
        const payload = r.data && typeof r.data === 'object' && 'payload' in r.data ? r.data.payload : r.data;
        const updatedAt = (r.data && typeof r.data === 'object' && r.data._updatedAt) || new Date(r.updated_at).getTime() || 0;
        kvMap[r.key] = {
          data: payload,
          updatedAt
        };
      }
    });
    return kvMap;
  } catch (err) {
    console.warn('[Supabase] Failed to fetch all KV:', err);
    return null;
  }
};

export const fetchCloudKV = async (key) => {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/website_content?key=eq.${key}&select=*`, {
      headers: getHeaders()
    });
    if (!res.ok) return null;
    const rows = await res.json();
    if (!Array.isArray(rows) || rows.length === 0) return null;
    const r = rows[0];
    const payload = r.data && typeof r.data === 'object' && 'payload' in r.data ? r.data.payload : r.data;
    const updatedAt = (r.data && typeof r.data === 'object' && r.data._updatedAt) || new Date(r.updated_at).getTime() || 0;
    return { data: payload, updatedAt };
  } catch (err) {
    console.warn(`[Supabase] Failed to fetch KV for key ${key}:`, err);
    return null;
  }
};
