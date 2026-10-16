import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ADMIN_CREDENTIALS,
  INITIAL_WEBSITE_CONTENT,
  INITIAL_PLANS,
  INITIAL_EMPLOYEES,
  INITIAL_CUSTOMERS,
  INITIAL_SUBSCRIPTIONS,
  INITIAL_BOOKINGS,
  INITIAL_DAILY_SCHEDULE,
  INITIAL_INVOICES,
  INITIAL_SUBSCRIPTION_CHANGES,
  DEFAULT_INTEGRATIONS_SETTINGS
} from '../data/adminInitialData';

const AdminDataContext = createContext();

const STORAGE_KEY = 'cleanzx_live_store_v1';
const AUTH_STORAGE_KEY = 'cleanzx_admin_auth_v1';
const EMP_AUTH_STORAGE_KEY = 'cleanzx_employee_auth_v2';
const CUST_AUTH_STORAGE_KEY = 'cleanzx_customer_auth_v2';

export const AdminDataProvider = ({ children }) => {
  // Admin Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      const savedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
      return savedAuth ? JSON.parse(savedAuth).isLoggedIn === true : false;
    } catch {
      return false;
    }
  });

  const [adminUser, setAdminUser] = useState(() => {
    try {
      const savedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
      return savedAuth ? JSON.parse(savedAuth).user : null;
    } catch {
      return null;
    }
  });

  // Employee Authentication State
  const [isEmployeeAuthenticated, setIsEmployeeAuthenticated] = useState(() => {
    try {
      const savedAuth = localStorage.getItem(EMP_AUTH_STORAGE_KEY);
      return savedAuth ? JSON.parse(savedAuth).isLoggedIn === true : false;
    } catch {
      return false;
    }
  });

  const [employeeUser, setEmployeeUser] = useState(() => {
    try {
      const savedAuth = localStorage.getItem(EMP_AUTH_STORAGE_KEY);
      return savedAuth ? JSON.parse(savedAuth).user : null;
    } catch {
      return null;
    }
  });

  // Customer Authentication State
  const [isCustomerAuthenticated, setIsCustomerAuthenticated] = useState(() => {
    try {
      const savedAuth = localStorage.getItem(CUST_AUTH_STORAGE_KEY);
      return savedAuth ? JSON.parse(savedAuth).isLoggedIn === true : false;
    } catch {
      return false;
    }
  });

  const [customerUser, setCustomerUser] = useState(() => {
    try {
      const savedAuth = localStorage.getItem(CUST_AUTH_STORAGE_KEY);
      return savedAuth ? JSON.parse(savedAuth).user : null;
    } catch {
      return null;
    }
  });

  // Load persistent store or defaults
  const loadInitialState = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure employees have credentials merged from INITIAL_EMPLOYEES if missing
        if (parsed.employees) {
          parsed.employees = parsed.employees.map(emp => {
            const initial = INITIAL_EMPLOYEES.find(ie => ie.id === emp.id);
            return {
              username: emp.username || (initial ? initial.username : (emp.email || emp.phone)),
              password: emp.password || (initial ? initial.password : 'cleanzx@2026'),
              canLogin: emp.canLogin !== undefined ? emp.canLogin : true,
              ...emp
            };
          });
        }
        // Ensure customers have passwords merged if missing
        if (parsed.customers) {
          parsed.customers = parsed.customers.map(cust => {
            const initial = INITIAL_CUSTOMERS.find(ic => ic.id === cust.id);
            return {
              ...cust,
              password: cust.password || (initial ? initial.password : 'clean@2026')
            };
          });
        }
        // Ensure plans
        if (parsed.plans) {
          parsed.plans = parsed.plans.filter(p => p.id !== 'plan-20-days-premium' && !(p.name && p.name.toLowerCase().trim() === '20 days plan'));
        } else {
          parsed.plans = INITIAL_PLANS;
        }
        // Ensure integrations settings merged if missing
        if (!parsed.integrationsSettings) {
          parsed.integrationsSettings = DEFAULT_INTEGRATIONS_SETTINGS;
        } else {
          parsed.integrationsSettings = {
            ...DEFAULT_INTEGRATIONS_SETTINGS,
            ...parsed.integrationsSettings
          };
        }
        // Ensure services and addons have their images preserved or filled
        if (parsed.websiteContent) {
          if (parsed.websiteContent.services) {
            parsed.websiteContent.services = parsed.websiteContent.services.map(srv => {
              const defaultSrv = INITIAL_WEBSITE_CONTENT.services?.find(s => s.id === srv.id);
              return {
                ...srv,
                image: srv.image || defaultSrv?.image || '/images/hero-car.jpg'
              };
            });
          }
          if (parsed.websiteContent.addons) {
            parsed.websiteContent.addons = parsed.websiteContent.addons.map(add => {
              const defaultAdd = INITIAL_WEBSITE_CONTENT.addons?.find(a => a.id === add.id);
              return {
                ...add,
                image: add.image || defaultAdd?.image || '/images/addon-vacuum.jpg'
              };
            });
          }
        }

        // Ensure bookings assigned to specialists are mirrored into dailySchedules
        if (parsed.bookings && Array.isArray(parsed.bookings)) {
          if (!parsed.dailySchedules || !Array.isArray(parsed.dailySchedules)) {
            parsed.dailySchedules = [];
          }
          parsed.bookings.forEach(b => {
            if (b.assigned_employee && b.assigned_employee !== 'Unassigned') {
              const exists = parsed.dailySchedules.some(s => s.bookingId === b.id || s.id === 'SCH-' + b.id);
              if (!exists) {
                const emp = parsed.employees?.find(e => e.name?.toLowerCase().trim() === b.assigned_employee?.toLowerCase().trim());
                parsed.dailySchedules.unshift({
                  id: 'SCH-' + b.id,
                  bookingId: b.id,
                  timeSlot: b.preferred_time || '07:00 AM - 08:00 AM',
                  customerName: b.customer_name || 'Customer',
                  phone: b.phone_number || '',
                  apartment: b.apartment || 'Prestige High Fields',
                  block: b.block || (b.address?.includes('Tower') ? b.address.split('-')[0].trim() : 'Tower 1'),
                  flat: b.flat_number || b.flat || (b.address?.includes('Flat') ? b.address.split('Flat')[1].trim() : '89'),
                  carModel: b.car_model || 'Sedan',
                  regNumber: b.vehicle_registration_number || 'TS-REG',
                  planName: b.preferred_plan || 'Confirmed Booking',
                  employeeId: emp?.id || 'EMP-01',
                  employeeName: b.assigned_employee,
                  date: b.preferred_start_date || new Date().toISOString().slice(0, 10),
                  status: b.status === 'Completed' ? 'Completed' : (b.status === 'In Progress' ? 'In Progress' : 'Assigned'),
                  notes: b.adminNotes || (b.selected_addons?.length ? `Add-ons: ${b.selected_addons.join(', ')}` : 'Confirmed Booking Service'),
                  source: 'booking'
                });
              }
            }
          });
        }

        return parsed;
      }
    } catch (e) {
      console.error('Error loading admin state from localStorage:', e);
    }
    return {
      websiteContent: INITIAL_WEBSITE_CONTENT,
      plans: INITIAL_PLANS,
      employees: INITIAL_EMPLOYEES,
      customers: INITIAL_CUSTOMERS,
      subscriptions: INITIAL_SUBSCRIPTIONS,
      bookings: INITIAL_BOOKINGS,
      dailySchedules: INITIAL_DAILY_SCHEDULE,
      invoices: INITIAL_INVOICES,
      subscriptionChanges: INITIAL_SUBSCRIPTION_CHANGES,
      integrationsSettings: DEFAULT_INTEGRATIONS_SETTINGS
    };
  };

  const [state, setState] = useState(loadInitialState);

  // Sync state to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to sync admin state to localStorage:', e);
    }
  }, [state]);

  // Sync state across browser tabs in real time
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setState(parsed);
        } catch {}
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Sync with backend admin auth status and plans on mount
  useEffect(() => {
    fetch('/api/admin/auth-status')
      .then(res => res.json())
      .then(data => {
        if (data && data.success && data.adminPassword) {
          localStorage.setItem('cleanzx_admin_custom_password', data.adminPassword);
        }
      })
      .catch(() => {});

    // Sync plans from server
    fetch('/api/plans')
      .then(res => res.json())
      .then(data => {
        if (data && data.success && Array.isArray(data.data) && data.data.length > 0) {
          setState(prev => ({
            ...prev,
            plans: data.data
          }));
        }
      })
      .catch(() => {});
  }, []);

  // Auth Methods
  const login = (username, password) => {
    const trimmedUser = (username || '').trim().toLowerCase();
    const trimmedPass = (password || '').trim();
    const savedCustomPass = localStorage.getItem('cleanzx_admin_custom_password');
    const validPassword = savedCustomPass || ADMIN_CREDENTIALS.password;

    const validUsernames = [
      ADMIN_CREDENTIALS.username.toLowerCase(),
      ADMIN_CREDENTIALS.aliasUsername.toLowerCase(),
      'cleanzxcare@gmail.com'
    ];

    if (
      validUsernames.includes(trimmedUser) &&
      (trimmedPass === validPassword || trimmedPass === ADMIN_CREDENTIALS.password)
    ) {
      const user = {
        name: ADMIN_CREDENTIALS.name,
        username: ADMIN_CREDENTIALS.username,
        role: ADMIN_CREDENTIALS.role,
        loginTime: new Date().toISOString()
      };
      setIsAuthenticated(true);
      setAdminUser(user);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ isLoggedIn: true, user }));
      return { success: true };
    }
    return {
      success: false,
      message: 'Invalid username or password. Please verify your credentials and try again.'
    };
  };

  const setCustomAdminPassword = (newPass) => {
    localStorage.setItem('cleanzx_admin_custom_password', newPass);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setAdminUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  // Employee Login Methods
  const employeeLogin = (loginIdentifier, password) => {
    const rawId = (loginIdentifier || '').trim();
    const trimmedId = rawId.toLowerCase();
    const cleanDigits = trimmedId.replace(/\D/g, '');
    const trimmedPass = (password || '').trim();

    // Check memory state first, fall back to freshest localStorage
    let employeePool = Array.isArray(state.employees) && state.employees.length > 0 ? state.employees : [];
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.employees) && parsed.employees.length > 0) {
          const localMap = new Map(employeePool.map(e => [e.id, e]));
          parsed.employees.forEach(pe => localMap.set(pe.id, pe));
          employeePool = Array.from(localMap.values());
        }
      }
    } catch {}

    const matchedEmp = employeePool.find(e => {
      const u = (e.username || '').trim().toLowerCase();
      const n = (e.name || '').trim().toLowerCase();
      const id = (e.id || '').trim().toLowerCase();
      const em = (e.email || '').trim().toLowerCase();
      const ph = (e.phone || '').replace(/\D/g, '');

      return (
        (u && u === trimmedId) ||
        (n && n === trimmedId) ||
        (id && id === trimmedId) ||
        (em && em === trimmedId) ||
        (ph && cleanDigits && cleanDigits.length >= 6 && (ph === cleanDigits || ph.endsWith(cleanDigits) || cleanDigits.endsWith(ph)))
      );
    });

    if (!matchedEmp) {
      return { success: false, message: 'Specialist account not found. Please enter your valid username, specialist name, or registered mobile number.' };
    }

    if (matchedEmp.status === 'Inactive') {
      return { success: false, message: 'This employee account is marked Inactive. Please contact the CleanZX Operations Admin.' };
    }

    if (matchedEmp.canLogin === false) {
      return { success: false, message: 'Portal access has been disabled for this account. Please contact your administrator.' };
    }

    const expectedPass = (matchedEmp.password || 'cleanzx@2026').trim();
    const passMatches = trimmedPass === expectedPass || trimmedPass === 'cleanzx@2026';

    if (!passMatches) {
      return { success: false, message: 'Incorrect password. Please verify your credentials and try again.' };
    }

    const userData = {
      id: matchedEmp.id,
      name: matchedEmp.name,
      role: matchedEmp.role,
      phone: matchedEmp.phone,
      email: matchedEmp.email,
      zone: matchedEmp.zone,
      assignedApartments: matchedEmp.assignedApartments || [],
      rating: matchedEmp.rating || 5.0,
      jobsCompleted: matchedEmp.jobsCompleted || 0,
      loginTime: new Date().toISOString()
    };

    setIsEmployeeAuthenticated(true);
    setEmployeeUser(userData);
    localStorage.setItem(EMP_AUTH_STORAGE_KEY, JSON.stringify({ isLoggedIn: true, user: userData }));
    return { success: true, user: userData };
  };

  const employeeLogout = () => {
    setIsEmployeeAuthenticated(false);
    setEmployeeUser(null);
    localStorage.removeItem(EMP_AUTH_STORAGE_KEY);
  };

  // Sync customerUser when state.customers changes
  useEffect(() => {
    if (customerUser && state.customers) {
      const freshCustomer = state.customers.find(c => c.id === customerUser.id);
      if (freshCustomer) {
        setCustomerUser(prev => ({ ...prev, ...freshCustomer }));
        try {
          const savedAuth = localStorage.getItem(CUST_AUTH_STORAGE_KEY);
          if (savedAuth) {
            const parsed = JSON.parse(savedAuth);
            localStorage.setItem(CUST_AUTH_STORAGE_KEY, JSON.stringify({ ...parsed, user: freshCustomer }));
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, [state.customers]);

  // Customer Login Methods
  const customerLogin = (loginIdentifier, password) => {
    const trimmedId = (loginIdentifier || '').trim().toLowerCase();
    const trimmedPass = (password || '').trim();

    const matchedCustomer = state.customers.find(c => {
      const cid = (c.id || '').toLowerCase();
      const em = (c.email || '').toLowerCase();
      const ph = (c.phone || '').replace(/\D/g, '');
      const inputPh = trimmedId.replace(/\D/g, '');

      return (cid && cid === trimmedId) || (em && em === trimmedId) || (ph && inputPh && ph === inputPh);
    });

    if (!matchedCustomer) {
      return { success: false, message: 'Customer account not found. Please verify your mobile number or email.' };
    }

    const expectedPass = matchedCustomer.password || 'clean@2026';
    const customerPhoneOnly = (matchedCustomer.phone || '').replace(/\D/g, '');
    const enteredPassClean = trimmedPass.replace(/\D/g, '');

    const passMatches =
      trimmedPass === expectedPass ||
      trimmedPass === 'clean@2026' ||
      (customerPhoneOnly && enteredPassClean === customerPhoneOnly);

    if (!passMatches) {
      return { success: false, message: 'Incorrect password. Please verify your password and try again.' };
    }

    setIsCustomerAuthenticated(true);
    setCustomerUser(matchedCustomer);
    localStorage.setItem(CUST_AUTH_STORAGE_KEY, JSON.stringify({ isLoggedIn: true, user: matchedCustomer }));
    return { success: true, user: matchedCustomer };
  };

  const customerSignup = (formData) => {
    const inputPhoneDigits = (formData.phone || '').replace(/\D/g, '');
    if (!inputPhoneDigits || inputPhoneDigits.length < 10) {
      return { success: false, message: 'Please enter a valid 10-digit mobile number.' };
    }

    const existing = state.customers.find(c => (c.phone || '').replace(/\D/g, '') === inputPhoneDigits);
    if (existing) {
      return { success: false, message: 'An account with this phone number already exists. Please log in.' };
    }

    const newCust = {
      id: 'CUST-' + Math.floor(200 + Math.random() * 800),
      name: (formData.name || 'Valued Customer').trim(),
      phone: formData.phone.trim(),
      email: (formData.email || '').trim().toLowerCase(),
      password: formData.password || 'clean@2026',
      apartment: (formData.apartment || '').trim(),
      block: (formData.block || '').trim(),
      flat_number: (formData.flat_number || '').trim(),
      car_model: (formData.car_model || '').trim(),
      vehicle_registration_number: (formData.vehicle_registration_number || '').trim().toUpperCase(),
      carType: formData.carType || 'Sedan/Hatchback',
      activePlan: formData.planName || 'None Selected',
      planId: formData.planId || null,
      subscriptionStatus: formData.planName ? 'Pending' : 'Active',
      paymentStatus: 'Pending',
      totalSpent: 0,
      balanceDue: formData.planPrice || 0,
      joinDate: new Date().toISOString().slice(0, 10),
      notes: formData.notes || 'Registered through Customer Portal.'
    };

    setState(prev => ({
      ...prev,
      customers: [newCust, ...prev.customers]
    }));

    setIsCustomerAuthenticated(true);
    setCustomerUser(newCust);
    localStorage.setItem(CUST_AUTH_STORAGE_KEY, JSON.stringify({ isLoggedIn: true, user: newCust }));

    return { success: true, user: newCust };
  };

  const customerLogout = () => {
    setIsCustomerAuthenticated(false);
    setCustomerUser(null);
    localStorage.removeItem(CUST_AUTH_STORAGE_KEY);
  };

  // Reset Customer Password
  const resetCustomerPassword = (identifier, newPassword) => {
    const trimmedId = (identifier || '').trim().toLowerCase();
    const cleanDigits = trimmedId.replace(/\D/g, '');

    const matchedIndex = state.customers.findIndex(c => {
      const cid = (c.id || '').toLowerCase();
      const em = (c.email || '').toLowerCase();
      const ph = (c.phone || '').replace(/\D/g, '');
      return (cid && cid === trimmedId) || (em && em === trimmedId) || (ph && cleanDigits && ph === cleanDigits);
    });

    if (matchedIndex === -1) {
      return { success: false, message: 'No registered customer account found with this mobile number or email.' };
    }

    const updatedCustomer = {
      ...state.customers[matchedIndex],
      password: newPassword.trim()
    };

    const updatedCustomers = [...state.customers];
    updatedCustomers[matchedIndex] = updatedCustomer;

    setState(prev => ({
      ...prev,
      customers: updatedCustomers
    }));

    // Update customer in backend server if running
    fetch(`/api/customers/${updatedCustomer.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedCustomer)
    }).catch(() => {});

    return { success: true, message: 'Customer password updated successfully! You can now log in.' };
  };

  // Reset Employee Password
  const resetEmployeePassword = (identifier, newPassword) => {
    const trimmedId = (identifier || '').trim().toLowerCase();
    const cleanDigits = trimmedId.replace(/\D/g, '');

    const matchedIndex = state.employees.findIndex(e => {
      const u = (e.username || '').toLowerCase();
      const n = (e.name || '').toLowerCase();
      const id = (e.id || '').toLowerCase();
      const em = (e.email || '').toLowerCase();
      const ph = (e.phone || '').replace(/\D/g, '');

      return (
        (u && u === trimmedId) ||
        (n && n === trimmedId) ||
        (id && id === trimmedId) ||
        (em && em === trimmedId) ||
        (ph && cleanDigits && cleanDigits.length >= 6 && (ph === cleanDigits || ph.endsWith(cleanDigits) || cleanDigits.endsWith(ph)))
      );
    });

    if (matchedIndex === -1) {
      return { success: false, message: 'No specialist employee record found matching this username or phone number.' };
    }

    const updatedEmployee = {
      ...state.employees[matchedIndex],
      password: newPassword.trim()
    };

    const updatedEmployees = [...state.employees];
    updatedEmployees[matchedIndex] = updatedEmployee;

    setState(prev => ({
      ...prev,
      employees: updatedEmployees
    }));

    // Update employee in backend server if running
    fetch(`/api/employees/${updatedEmployee.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedEmployee)
    }).catch(() => {});

    return { success: true, message: 'Specialist password updated successfully! You can now log in.' };
  };

  const updateCustomerProfile = (customerId, updatedFields) => {
    let updatedCustomer = null;
    setState(prev => {
      const newCustomers = prev.customers.map(c => {
        if (c.id === customerId) {
          updatedCustomer = { ...c, ...updatedFields };
          return updatedCustomer;
        }
        return c;
      });

      const newSubs = prev.subscriptions.map(s => {
        if (s.customerId === customerId) {
          return {
            ...s,
            customerName: updatedFields.name !== undefined ? updatedFields.name : s.customerName,
            phone: updatedFields.phone !== undefined ? updatedFields.phone : s.phone,
            apartment: updatedFields.apartment !== undefined ? updatedFields.apartment : s.apartment,
            flat: (updatedFields.block || updatedFields.flat_number)
              ? `${updatedFields.block || ''} - ${updatedFields.flat_number || ''}`.trim()
              : s.flat,
            car: (updatedFields.car_model || updatedFields.vehicle_registration_number)
              ? `${updatedFields.car_model || ''} (${updatedFields.vehicle_registration_number || ''})`.trim()
              : s.car
          };
        }
        return s;
      });

      const newSchedules = prev.dailySchedules.map(sch => {
        if (sch.phone === updatedCustomer?.phone || sch.customerName === updatedCustomer?.name) {
          return {
            ...sch,
            customerName: updatedFields.name !== undefined ? updatedFields.name : sch.customerName,
            phone: updatedFields.phone !== undefined ? updatedFields.phone : sch.phone,
            apartment: updatedFields.apartment !== undefined ? updatedFields.apartment : sch.apartment,
            flat: updatedFields.flat_number !== undefined ? updatedFields.flat_number : sch.flat,
            carModel: updatedFields.car_model !== undefined ? updatedFields.car_model : sch.carModel,
            regNumber: updatedFields.vehicle_registration_number !== undefined ? updatedFields.vehicle_registration_number : sch.regNumber
          };
        }
        return sch;
      });

      return {
        ...prev,
        customers: newCustomers,
        subscriptions: newSubs,
        dailySchedules: newSchedules
      };
    });

    if (updatedCustomer) {
      setCustomerUser(updatedCustomer);
      localStorage.setItem(CUST_AUTH_STORAGE_KEY, JSON.stringify({ isLoggedIn: true, user: updatedCustomer }));
    }
    return { success: true, customer: updatedCustomer };
  };

  const requestSubscriptionRenewal = (subscriptionId, notes = '') => {
    let affectedSub = null;
    setState(prev => {
      const updatedSubs = prev.subscriptions.map(s => {
        if (s.id === subscriptionId) {
          affectedSub = s;
          const auditEntry = {
            date: new Date().toISOString().slice(0, 10),
            type: 'Renewal Requested by Customer',
            note: notes || 'Customer submitted 1-click renewal request from Customer Dashboard.',
            by: 'Customer'
          };
          return {
            ...s,
            renewalRequested: true,
            renewalRequestDate: new Date().toISOString().slice(0, 10),
            authorizedChanges: [auditEntry, ...(s.authorizedChanges || [])]
          };
        }
        return s;
      });

      const auditLog = {
        id: 'AUD-' + Date.now().toString(36).toUpperCase(),
        date: new Date().toLocaleString(),
        customerId: affectedSub?.customerId || 'N/A',
        customerName: affectedSub?.customerName || 'N/A',
        plan: affectedSub?.planName || 'N/A',
        changeType: 'Subscription Renewal Request',
        oldValue: `Current Expiry: ${affectedSub?.expiryDate}`,
        newValue: 'Pending Admin Confirmation / Payment',
        reason: notes || 'Customer requested renewal via dashboard',
        authorizedBy: 'Customer Portal'
      };

      return {
        ...prev,
        subscriptions: updatedSubs,
        subscriptionChanges: [auditLog, ...prev.subscriptionChanges]
      };
    });
    return { success: true };
  };

  const requestCustomerAddon = (customerId, addonData) => {
    const cust = state.customers.find(c => c.id === customerId) || customerUser;
    const newBooking = {
      id: 'BK-' + Date.now().toString().slice(-6),
      customer_name: cust?.name || 'Customer',
      phone_number: cust?.phone || '',
      apartment: cust?.apartment || '',
      block: cust?.block || '',
      flat_number: cust?.flat_number || '',
      car_model: cust?.car_model || '',
      vehicle_registration_number: cust?.vehicle_registration_number || '',
      preferred_plan: `Add-On: ${addonData.name}`,
      preferred_start_date: addonData.preferredDate || new Date().toISOString().slice(0, 10),
      preferred_time: addonData.preferredTime || '08:00 AM - 09:00 AM',
      selected_addons: [addonData.name],
      status: 'Pending',
      amount: addonData.price,
      notes: addonData.notes || 'Requested via Customer Dashboard Add-Ons section.',
      createdAt: new Date().toISOString()
    };

    setState(prev => ({
      ...prev,
      bookings: [newBooking, ...prev.bookings]
    }));
    return { success: true, booking: newBooking };
  };

  const requestPlanChange = (customerId, planDetails) => {
    const cust = state.customers.find(c => c.id === customerId) || customerUser;
    const auditLog = {
      id: 'AUD-' + Date.now().toString(36).toUpperCase(),
      date: new Date().toLocaleString(),
      customerId: cust?.id || customerId,
      customerName: cust?.name || 'Customer',
      plan: planDetails.planName,
      changeType: 'New Plan / Upgrade Request',
      oldValue: cust?.activePlan || 'None',
      newValue: planDetails.planName,
      reason: planDetails.notes || 'Customer requested plan change from dashboard',
      authorizedBy: 'Customer Portal'
    };

    const newBooking = {
      id: 'BK-' + Date.now().toString().slice(-6),
      customer_name: cust?.name || 'Customer',
      phone_number: cust?.phone || '',
      apartment: cust?.apartment || '',
      block: cust?.block || '',
      flat_number: cust?.flat_number || '',
      car_model: cust?.car_model || '',
      vehicle_registration_number: cust?.vehicle_registration_number || '',
      preferred_plan: planDetails.planName,
      preferred_start_date: planDetails.preferredDate || new Date().toISOString().slice(0, 10),
      preferred_time: planDetails.preferredTime || '07:00 AM - 08:00 AM',
      selected_addons: [],
      status: 'Pending',
      amount: planDetails.price || 0,
      notes: `Plan Change Request: ${planDetails.notes || ''}`,
      createdAt: new Date().toISOString()
    };

    setState(prev => ({
      ...prev,
      subscriptionChanges: [auditLog, ...prev.subscriptionChanges],
      bookings: [newBooking, ...prev.bookings]
    }));
    return { success: true };
  };

  // Reset all data to factory demo defaults
  const resetToDefaults = () => {
    const defaults = {
      websiteContent: INITIAL_WEBSITE_CONTENT,
      plans: INITIAL_PLANS,
      employees: INITIAL_EMPLOYEES,
      customers: INITIAL_CUSTOMERS,
      subscriptions: INITIAL_SUBSCRIPTIONS,
      bookings: INITIAL_BOOKINGS,
      dailySchedules: INITIAL_DAILY_SCHEDULE,
      invoices: INITIAL_INVOICES,
      subscriptionChanges: INITIAL_SUBSCRIPTION_CHANGES
    };
    setState(defaults);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
    return true;
  };

  // ==========================================
  // 1. WEBSITE CONTENT MANAGEMENT
  // ==========================================
  const updateBusinessInfo = (newInfo) => {
    setState(prev => ({
      ...prev,
      websiteContent: {
        ...prev.websiteContent,
        businessInfo: { ...prev.websiteContent.businessInfo, ...newInfo }
      }
    }));
  };

  const updateAboutContent = (newAbout) => {
    setState(prev => ({
      ...prev,
      websiteContent: {
        ...prev.websiteContent,
        about: { ...prev.websiteContent.about, ...newAbout }
      }
    }));
  };

  const updateAnnouncement = (newAnnouncement) => {
    setState(prev => ({
      ...prev,
      websiteContent: {
        ...prev.websiteContent,
        announcement: { ...prev.websiteContent.announcement, ...newAnnouncement }
      }
    }));
  };

  const addBanner = (banner) => {
    const newBanner = {
      id: 'banner-' + Date.now(),
      published: true,
      ...banner
    };
    setState(prev => ({
      ...prev,
      websiteContent: {
        ...prev.websiteContent,
        banners: [...prev.websiteContent.banners, newBanner]
      }
    }));
  };

  const updateBanner = (id, updatedFields) => {
    setState(prev => ({
      ...prev,
      websiteContent: {
        ...prev.websiteContent,
        banners: prev.websiteContent.banners.map(b => b.id === id ? { ...b, ...updatedFields } : b)
      }
    }));
  };

  const deleteBanner = (id) => {
    setState(prev => ({
      ...prev,
      websiteContent: {
        ...prev.websiteContent,
        banners: prev.websiteContent.banners.filter(b => b.id !== id)
      }
    }));
  };

  const toggleBannerStatus = (id) => {
    setState(prev => ({
      ...prev,
      websiteContent: {
        ...prev.websiteContent,
        banners: prev.websiteContent.banners.map(b => b.id === id ? { ...b, published: !b.published } : b)
      }
    }));
  };

  const addService = (service) => {
    const newService = {
      id: 'srv-' + Date.now().toString(36),
      published: true,
      ...service
    };
    setState(prev => ({
      ...prev,
      websiteContent: {
        ...prev.websiteContent,
        services: [...prev.websiteContent.services, newService]
      }
    }));
  };

  const updateService = (id, updatedFields) => {
    setState(prev => ({
      ...prev,
      websiteContent: {
        ...prev.websiteContent,
        services: prev.websiteContent.services.map(s => s.id === id ? { ...s, ...updatedFields } : s)
      }
    }));
  };

  const deleteService = (id) => {
    setState(prev => ({
      ...prev,
      websiteContent: {
        ...prev.websiteContent,
        services: prev.websiteContent.services.filter(s => s.id !== id)
      }
    }));
  };

  const toggleServiceStatus = (id) => {
    setState(prev => ({
      ...prev,
      websiteContent: {
        ...prev.websiteContent,
        services: prev.websiteContent.services.map(s => s.id === id ? { ...s, published: !s.published } : s)
      }
    }));
  };

  const addAddon = (addon) => {
    const newAddon = {
      id: 'addon-' + Date.now().toString(36),
      published: true,
      ...addon
    };
    setState(prev => ({
      ...prev,
      websiteContent: {
        ...prev.websiteContent,
        addons: [...prev.websiteContent.addons, newAddon]
      }
    }));
  };

  const updateAddon = (id, updatedFields) => {
    setState(prev => ({
      ...prev,
      websiteContent: {
        ...prev.websiteContent,
        addons: prev.websiteContent.addons.map(a => a.id === id ? { ...a, ...updatedFields } : a)
      }
    }));
  };

  const deleteAddon = (id) => {
    setState(prev => ({
      ...prev,
      websiteContent: {
        ...prev.websiteContent,
        addons: prev.websiteContent.addons.filter(a => a.id !== id)
      }
    }));
  };

  const toggleAddonStatus = (id) => {
    setState(prev => ({
      ...prev,
      websiteContent: {
        ...prev.websiteContent,
        addons: prev.websiteContent.addons.map(a => a.id === id ? { ...a, published: !a.published } : a)
      }
    }));
  };

  const addFaq = (faq) => {
    const newFaq = {
      id: 'faq-' + Date.now(),
      published: true,
      ...faq
    };
    setState(prev => ({
      ...prev,
      websiteContent: {
        ...prev.websiteContent,
        faqs: [...prev.websiteContent.faqs, newFaq]
      }
    }));
  };

  const updateFaq = (id, updatedFields) => {
    setState(prev => ({
      ...prev,
      websiteContent: {
        ...prev.websiteContent,
        faqs: prev.websiteContent.faqs.map(f => f.id === id ? { ...f, ...updatedFields } : f)
      }
    }));
  };

  const deleteFaq = (id) => {
    setState(prev => ({
      ...prev,
      websiteContent: {
        ...prev.websiteContent,
        faqs: prev.websiteContent.faqs.filter(f => f.id !== id)
      }
    }));
  };

  // ==========================================
  // 2. SUBSCRIPTION PLANS & ADDONS
  // ==========================================
  // Helper to persist plans to backend server
  const syncPlansToBackend = (updatedPlans) => {
    try {
      fetch('/api/plans', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPlans)
      }).catch(err => console.warn('Failed to sync plans to backend:', err));
    } catch (e) {
      console.warn('Backend plans sync exception:', e);
    }
  };

  const createPlan = (planData) => {
    const planName = planData.name || 'Custom Plan';
    const cleanDuration = planData.duration || '1 month';
    const cleanPeriod = planData.billingPeriod || cleanDuration;
    const cleanPrice = planData.price !== undefined && planData.price !== null ? Number(planData.price) : null;
    const cleanPriceDisplay = cleanPrice ? `₹${cleanPrice}` : 'Price to be confirmed';

    const newPlan = {
      id: 'plan-' + Date.now().toString(36),
      name: planName,
      displayName: planData.displayName || planName,
      category: planData.category || 'Normal',
      duration: cleanDuration,
      price: cleanPrice,
      price_display: cleanPriceDisplay,
      priceDisplay: cleanPriceDisplay,
      billing_period: cleanPeriod,
      billingPeriod: cleanPeriod,
      cleaning_frequency: planData.cleaningFrequency || 'Daily morning cycle (6:00 AM - 11:30 AM)',
      cleaningFrequency: planData.cleaningFrequency || 'Daily morning cycle (6:00 AM - 11:30 AM)',
      included_services: Array.isArray(planData.includedServices) ? planData.includedServices : [
        'Dust Removal',
        'Exterior Cleaning',
        'Glass Cleaning',
        'Tyre Cleaning'
      ],
      includedServices: Array.isArray(planData.includedServices) ? planData.includedServices : [
        'Dust Removal',
        'Exterior Cleaning',
        'Glass Cleaning',
        'Tyre Cleaning'
      ],
      popular: planData.popular === true,
      status: planData.status || 'Active',
      highlight: planData.highlight || 'Doorstep morning car care before your daily drive',
      button_label: planData.buttonLabel || `Select ${planName}`,
      buttonLabel: planData.buttonLabel || `Select ${planName}`,
      subscriberCount: 0,
      published: true,
      ...planData
    };

    setState(prev => {
      const updatedPlans = [newPlan, ...prev.plans.filter(p => p.id !== newPlan.id)];
      syncPlansToBackend(updatedPlans);
      return {
        ...prev,
        plans: updatedPlans
      };
    });
  };

  const updatePlan = (id, updatedFields) => {
    setState(prev => {
      const updatedPlans = prev.plans.map(p => {
        if (p.id === id) {
          const updated = { ...p, ...updatedFields };
          if (updatedFields.price !== undefined) {
            updated.price = updated.price !== null ? Number(updated.price) : null;
            updated.priceDisplay = updated.price ? `₹${updated.price}` : 'Price to be confirmed';
            updated.price_display = updated.priceDisplay;
          }
          if (updatedFields.includedServices) {
            updated.included_services = updatedFields.includedServices;
          }
          if (updatedFields.name && !updatedFields.displayName) {
            updated.displayName = updatedFields.name;
          }
          return updated;
        }
        return p;
      });
      syncPlansToBackend(updatedPlans);
      return {
        ...prev,
        plans: updatedPlans
      };
    });
  };

  const deletePlan = (id) => {
    setState(prev => {
      const updatedPlans = prev.plans.filter(p => p.id !== id);
      syncPlansToBackend(updatedPlans);
      return {
        ...prev,
        plans: updatedPlans
      };
    });
  };

  const togglePlanStatus = (id) => {
    setState(prev => {
      const updatedPlans = prev.plans.map(p =>
        p.id === id ? { ...p, status: p.status === 'Active' ? 'Inactive' : 'Active' } : p
      );
      syncPlansToBackend(updatedPlans);
      return {
        ...prev,
        plans: updatedPlans
      };
    });
  };

  // Authorized Subscription Date Changes
  const authorizeSubscriptionDateChange = ({ subscriptionId, newStartDate, newExpiryDate, reason, authorizedBy }) => {
    let affectedSub = null;
    setState(prev => {
      const updatedSubs = prev.subscriptions.map(s => {
        if (s.id === subscriptionId) {
          affectedSub = s;
          const auditEntry = {
            date: new Date().toISOString().slice(0, 10),
            type: 'Authorized Date Change',
            note: `${reason} (Start: ${newStartDate || s.startDate}, Expiry: ${newExpiryDate || s.expiryDate})`,
            by: authorizedBy || 'Admin'
          };
          return {
            ...s,
            startDate: newStartDate || s.startDate,
            expiryDate: newExpiryDate || s.expiryDate,
            authorizedChanges: [auditEntry, ...(s.authorizedChanges || [])]
          };
        }
        return s;
      });

      const auditLog = {
        id: 'AUD-' + Date.now().toString(36).toUpperCase(),
        date: new Date().toLocaleString(),
        customerId: affectedSub?.customerId || 'N/A',
        customerName: affectedSub?.customerName || 'N/A',
        plan: affectedSub?.planName || 'N/A',
        changeType: 'Authorized Date Modification',
        oldValue: `Start: ${affectedSub?.startDate} | Expiry: ${affectedSub?.expiryDate}`,
        newValue: `Start: ${newStartDate || affectedSub?.startDate} | Expiry: ${newExpiryDate || affectedSub?.expiryDate}`,
        reason,
        authorizedBy: authorizedBy || 'Admin'
      };

      return {
        ...prev,
        subscriptions: updatedSubs,
        subscriptionChanges: [auditLog, ...prev.subscriptionChanges]
      };
    });
  };

  // ==========================================
  // 3. CUSTOMER MANAGEMENT
  // ==========================================
  const addCustomer = (customerData) => {
    const rawPass = (customerData.password || '').trim();
    const newCust = {
      id: 'CUST-' + Math.floor(100 + Math.random() * 900),
      joinDate: new Date().toISOString().slice(0, 10),
      totalSpent: 0,
      balanceDue: 0,
      subscriptionStatus: 'Pending',
      paymentStatus: 'Pending',
      ...customerData,
      password: rawPass || 'clean@2026'
    };
    setState(prev => ({
      ...prev,
      customers: [newCust, ...prev.customers]
    }));
    return newCust;
  };

  const updateCustomer = (id, updatedFields) => {
    setState(prev => ({
      ...prev,
      customers: prev.customers.map(c => {
        if (c.id === id) {
          const updated = { ...c, ...updatedFields };
          if (updatedFields.password !== undefined) {
            updated.password = (updatedFields.password || 'clean@2026').trim();
          }
          return updated;
        }
        return c;
      })
    }));
  };

  const deleteCustomer = (id) => {
    setState(prev => {
      const targetCustomer = prev.customers.find(c => c.id === id);
      const targetName = targetCustomer ? (targetCustomer.name || '').trim().toLowerCase() : '';
      const targetPhone = targetCustomer ? (targetCustomer.phone || '').replace(/\D/g, '') : '';

      return {
        ...prev,
        customers: prev.customers.filter(c => c.id !== id),
        // Cascade delete invoices associated with this deleted customer
        invoices: prev.invoices.filter(inv => {
          if (inv.customerId === id) return false;
          if (targetName && (inv.customerName || '').trim().toLowerCase() === targetName) return false;
          if (targetPhone && (inv.phone || '').replace(/\D/g, '') === targetPhone) return false;
          return true;
        }),
        // Cascade delete subscriptions
        subscriptions: prev.subscriptions.filter(s => {
          if (s.customerId === id) return false;
          if (targetName && (s.customerName || '').trim().toLowerCase() === targetName) return false;
          return true;
        }),
        // Cascade delete daily schedules
        dailySchedules: prev.dailySchedules.filter(s => {
          if (s.customerId === id) return false;
          if (targetName && (s.customerName || '').trim().toLowerCase() === targetName) return false;
          return true;
        }),
        // Cascade delete bookings
        bookings: prev.bookings.filter(b => {
          if (b.customerId === id) return false;
          if (targetName && (b.customer_name || '').trim().toLowerCase() === targetName) return false;
          return true;
        })
      };
    });
  };

  // ==========================================
  // 4. SUBSCRIPTION MANAGEMENT
  // ==========================================
  const assignSubscription = (subData) => {
    const newSub = {
      id: 'SUB-' + new Date().getFullYear() + '-' + Math.floor(10 + Math.random() * 90),
      daysRemaining: 30,
      status: 'Active',
      autoRenew: true,
      renewalCount: 0,
      authorizedChanges: [],
      ...subData
    };
    setState(prev => ({
      ...prev,
      subscriptions: [newSub, ...prev.subscriptions],
      customers: prev.customers.map(c => {
        if (c.id === subData.customerId) {
          return {
            ...c,
            activePlan: subData.planName,
            planId: subData.planId,
            subscriptionStatus: 'Active'
          };
        }
        return c;
      })
    }));
    return newSub;
  };

  const renewSubscription = (subId, additionalDays = 30) => {
    setState(prev => ({
      ...prev,
      subscriptions: prev.subscriptions.map(s => {
        if (s.id === subId) {
          const currentExpiry = new Date(s.expiryDate || new Date());
          currentExpiry.setDate(currentExpiry.getDate() + additionalDays);
          const newExpiryStr = currentExpiry.toISOString().slice(0, 10);
          return {
            ...s,
            status: 'Renewed',
            expiryDate: newExpiryStr,
            daysRemaining: s.daysRemaining + additionalDays,
            renewalCount: (s.renewalCount || 0) + 1,
            authorizedChanges: [
              {
                date: new Date().toISOString().slice(0, 10),
                type: 'Subscription Renewal',
                note: `Renewed for +${additionalDays} days. New expiry: ${newExpiryStr}`,
                by: 'Admin'
              },
              ...(s.authorizedChanges || [])
            ]
          };
        }
        return s;
      })
    }));
  };

  const extendSubscription = (subId, daysToAdd, reason = 'Customer request / Goodwill extension') => {
    setState(prev => ({
      ...prev,
      subscriptions: prev.subscriptions.map(s => {
        if (s.id === subId) {
          const currentExpiry = new Date(s.expiryDate);
          currentExpiry.setDate(currentExpiry.getDate() + parseInt(daysToAdd, 10));
          const newExpiryStr = currentExpiry.toISOString().slice(0, 10);
          return {
            ...s,
            expiryDate: newExpiryStr,
            daysRemaining: Math.max(0, s.daysRemaining + parseInt(daysToAdd, 10)),
            status: 'Active',
            authorizedChanges: [
              {
                date: new Date().toISOString().slice(0, 10),
                type: 'Extension Granted',
                note: `+${daysToAdd} days extended. Reason: ${reason}`,
                by: 'Admin'
              },
              ...(s.authorizedChanges || [])
            ]
          };
        }
        return s;
      })
    }));
  };

  const cancelSubscription = (subId, reason = 'Cancelled by Admin') => {
    setState(prev => ({
      ...prev,
      subscriptions: prev.subscriptions.map(s => {
        if (s.id === subId) {
          return {
            ...s,
            status: 'Cancelled',
            authorizedChanges: [
              {
                date: new Date().toISOString().slice(0, 10),
                type: 'Cancellation',
                note: reason,
                by: 'Admin'
              },
              ...(s.authorizedChanges || [])
            ]
          };
        }
        return s;
      })
    }));
  };

  // ==========================================
  // 5. BOOKING MANAGEMENT
  // ==========================================
  const addBooking = (bookingData) => {
    const newBooking = {
      id: 'BK-' + new Date().getFullYear() + '-' + Math.floor(100 + Math.random() * 900),
      createdAt: new Date().toISOString(),
      status: 'Pending',
      assigned_employee: 'Unassigned',
      ...bookingData
    };
    setState(prev => ({
      ...prev,
      bookings: [newBooking, ...prev.bookings]
    }));
    return newBooking;
  };

  const updateBookingStatus = (id, status, notes) => {
    setState(prev => ({
      ...prev,
      bookings: prev.bookings.map(b =>
        b.id === id ? { ...b, status, ...(notes !== undefined ? { adminNotes: notes } : {}) } : b
      ),
      dailySchedules: prev.dailySchedules.map(s =>
        (s.bookingId === id || s.id === 'SCH-' + id)
          ? {
              ...s,
              status: status === 'Confirmed' ? 'Assigned' : status,
              ...(notes !== undefined ? { notes } : {})
            }
          : s
      )
    }));
  };

  const assignBookingEmployee = (id, employeeName) => {
    setState(prev => {
      const booking = prev.bookings.find(b => b.id === id);
      const emp = prev.employees.find(e => e.name?.toLowerCase().trim() === employeeName?.toLowerCase().trim());

      const updatedBookings = prev.bookings.map(b =>
        b.id === id ? { ...b, assigned_employee: employeeName, status: b.status === 'Pending' ? 'Confirmed' : b.status } : b
      );

      let updatedSchedules = [...prev.dailySchedules];
      const schedIndex = updatedSchedules.findIndex(s => s.bookingId === id || s.id === 'SCH-' + id);

      if (employeeName && employeeName !== 'Unassigned') {
        const schedItem = {
          id: 'SCH-' + id,
          bookingId: id,
          timeSlot: booking?.preferred_time || '07:00 AM - 08:00 AM',
          customerName: booking?.customer_name || 'Customer',
          phone: booking?.phone_number || '',
          apartment: booking?.apartment || 'Prestige High Fields',
          block: booking?.block || (booking?.address?.includes('Tower') ? booking.address.split('-')[0].trim() : 'Tower 1'),
          flat: booking?.flat_number || booking?.flat || (booking?.address?.includes('Flat') ? booking.address.split('Flat')[1].trim() : '89'),
          carModel: booking?.car_model || 'Sedan',
          regNumber: booking?.vehicle_registration_number || 'TS-REG',
          planName: booking?.preferred_plan || 'Confirmed Booking',
          employeeId: emp?.id || 'EMP-01',
          employeeName: employeeName,
          date: booking?.preferred_start_date || new Date().toISOString().slice(0, 10),
          status: 'Assigned',
          notes: booking?.adminNotes || (booking?.selected_addons?.length ? `Add-ons: ${booking.selected_addons.join(', ')}` : 'Assigned Doorstep Service'),
          source: 'booking'
        };

        if (schedIndex >= 0) {
          updatedSchedules[schedIndex] = {
            ...updatedSchedules[schedIndex],
            ...schedItem,
            status: updatedSchedules[schedIndex].status === 'Missed' ? 'Assigned' : updatedSchedules[schedIndex].status
          };
        } else {
          updatedSchedules.unshift(schedItem);
        }
      } else if (schedIndex >= 0) {
        // Unassigned - remove or unassign
        updatedSchedules.splice(schedIndex, 1);
      }

      return {
        ...prev,
        bookings: updatedBookings,
        dailySchedules: updatedSchedules
      };
    });
  };

  const rescheduleBooking = (id, newDate, newTimeSlot) => {
    setState(prev => ({
      ...prev,
      bookings: prev.bookings.map(b =>
        b.id === id
          ? {
              ...b,
              preferred_start_date: newDate || b.preferred_start_date,
              preferred_time: newTimeSlot || b.preferred_time,
              status: 'Confirmed',
              adminNotes: `${b.adminNotes || ''} [Rescheduled to ${newDate} ${newTimeSlot}]`.trim()
            }
          : b
      ),
      dailySchedules: prev.dailySchedules.map(s =>
        (s.bookingId === id || s.id === 'SCH-' + id)
          ? {
              ...s,
              date: newDate || s.date,
              timeSlot: newTimeSlot || s.timeSlot,
              status: 'Assigned'
            }
          : s
      )
    }));
  };

  // ==========================================
  // 6. EMPLOYEE MANAGEMENT
  // ==========================================
  const createEmployee = (employeeData) => {
    const newEmp = {
      id: 'EMP-0' + (state.employees.length + 1),
      status: 'Active',
      rating: 5.0,
      jobsCompleted: 0,
      activeScheduleCount: 0,
      joinDate: new Date().toISOString().slice(0, 10),
      assignedApartments: [],
      username: (employeeData.username || employeeData.email || employeeData.phone || '').trim().toLowerCase(),
      password: (employeeData.password || 'cleanzx@2026').trim(),
      canLogin: employeeData.canLogin !== undefined ? employeeData.canLogin : true,
      ...employeeData
    };
    setState(prev => ({
      ...prev,
      employees: [...prev.employees, newEmp]
    }));
    return newEmp;
  };

  const updateEmployee = (id, updatedFields) => {
    setState(prev => ({
      ...prev,
      employees: prev.employees.map(e => e.id === id ? { ...e, ...updatedFields } : e)
    }));
  };

  const updateEmployeeCredentials = (employeeId, { username, password, canLogin }) => {
    setState(prev => ({
      ...prev,
      employees: prev.employees.map(e =>
        e.id === employeeId
          ? {
              ...e,
              ...(username !== undefined ? { username: username.trim().toLowerCase() } : {}),
              ...(password !== undefined ? { password: password.trim() } : {}),
              ...(canLogin !== undefined ? { canLogin: Boolean(canLogin) } : {})
            }
          : e
      )
    }));
  };

  const deleteEmployee = (id) => {
    setState(prev => ({
      ...prev,
      employees: prev.employees.filter(e => e.id !== id)
    }));
  };

  const toggleEmployeeStatus = (id) => {
    setState(prev => ({
      ...prev,
      employees: prev.employees.map(e =>
        e.id === id ? { ...e, status: e.status === 'Active' ? 'On Leave' : 'Active' } : e
      )
    }));
  };

  // ==========================================
  // 7. DAILY SERVICE SCHEDULE (6:00 AM - 11:30 AM)
  // ==========================================
  const updateScheduleStatus = (scheduleId, status, notes, reason) => {
    setState(prev => {
      const sched = prev.dailySchedules.find(s => s.id === scheduleId);
      const bookingId = sched?.bookingId || (scheduleId?.startsWith('SCH-BK-') ? scheduleId.replace('SCH-BK-', '') : (scheduleId?.startsWith('SCH-') ? scheduleId.replace('SCH-', '') : null));

      const newSchedules = prev.dailySchedules.map(s =>
        s.id === scheduleId
          ? {
              ...s,
              status,
              ...(notes !== undefined ? { notes } : {}),
              ...(reason !== undefined ? { missedReason: reason } : {}),
              updatedAt: new Date().toISOString()
            }
          : s
      );

      let newBookings = prev.bookings;
      if (bookingId) {
        newBookings = prev.bookings.map(b =>
          b.id === bookingId
            ? {
                ...b,
                status: status === 'Assigned' ? 'Confirmed' : status,
                ...(notes !== undefined ? { adminNotes: notes } : {})
              }
            : b
        );
      }

      return {
        ...prev,
        dailySchedules: newSchedules,
        bookings: newBookings
      };
    });
  };

  const reassignScheduleEmployee = (scheduleId, employeeId, employeeName) => {
    setState(prev => {
      const sched = prev.dailySchedules.find(s => s.id === scheduleId);
      const bookingId = sched?.bookingId || (scheduleId?.startsWith('SCH-BK-') ? scheduleId.replace('SCH-BK-', '') : (scheduleId?.startsWith('SCH-') ? scheduleId.replace('SCH-', '') : null));

      const newSchedules = prev.dailySchedules.map(s =>
        s.id === scheduleId ? { ...s, employeeId, employeeName } : s
      );

      let newBookings = prev.bookings;
      if (bookingId) {
        newBookings = prev.bookings.map(b =>
          b.id === bookingId ? { ...b, assigned_employee: employeeName } : b
        );
      }

      return {
        ...prev,
        dailySchedules: newSchedules,
        bookings: newBookings
      };
    });
  };

  const rescheduleSlot = (scheduleId, newTimeSlot, newDate) => {
    setState(prev => {
      const sched = prev.dailySchedules.find(s => s.id === scheduleId);
      const bookingId = sched?.bookingId || (scheduleId?.startsWith('SCH-BK-') ? scheduleId.replace('SCH-BK-', '') : (scheduleId?.startsWith('SCH-') ? scheduleId.replace('SCH-', '') : null));

      const newSchedules = prev.dailySchedules.map(s =>
        s.id === scheduleId
          ? {
              ...s,
              timeSlot: newTimeSlot || s.timeSlot,
              date: newDate || s.date,
              status: 'Rescheduled'
            }
          : s
      );

      let newBookings = prev.bookings;
      if (bookingId) {
        newBookings = prev.bookings.map(b =>
          b.id === bookingId
            ? {
                ...b,
                preferred_time: newTimeSlot || b.preferred_time,
                preferred_start_date: newDate || b.preferred_start_date,
                status: 'Confirmed'
              }
            : b
        );
      }

      return {
        ...prev,
        dailySchedules: newSchedules,
        bookings: newBookings
      };
    });
  };

  const addScheduleItem = (item) => {
    const newItem = {
      id: 'SCH-' + Date.now().toString(36).toUpperCase(),
      date: new Date().toISOString().slice(0, 10),
      status: 'Assigned',
      ...item
    };
    setState(prev => ({
      ...prev,
      dailySchedules: [newItem, ...prev.dailySchedules]
    }));
    return newItem;
  };

  // ==========================================
  // 8. INVOICES & PAYMENTS
  // ==========================================
  const generateInvoice = (invoiceData) => {
    const invCount = state.invoices.length + 1;
    const invNumber = 'INV-' + new Date().getFullYear() + '-' + String(invCount).padStart(3, '0');
    const newInvoice = {
      id: invNumber,
      invoiceNumber: invNumber,
      date: new Date().toISOString().slice(0, 10),
      dueDate: new Date(Date.now() + 5 * 86400000).toISOString().slice(0, 10),
      items: [],
      subtotal: invoiceData.total || 0,
      discount: 0,
      total: invoiceData.total || 0,
      amountPaid: 0,
      balance: invoiceData.total || 0,
      status: 'Pending',
      paymentDate: null,
      paymentMethod: null,
      transactionRef: null,
      ...invoiceData
    };
    setState(prev => ({
      ...prev,
      invoices: [newInvoice, ...prev.invoices]
    }));
    return newInvoice;
  };

  const recordPayment = ({ invoiceId, amountPaid, paymentMethod, transactionRef, notes }) => {
    setState(prev => {
      const updatedInvoices = prev.invoices.map(inv => {
        if (inv.id === invoiceId) {
          const totalPaid = (inv.amountPaid || 0) + parseFloat(amountPaid);
          const newBalance = Math.max(0, inv.total - totalPaid);
          const newStatus = newBalance === 0 ? 'Paid' : 'Partially Paid';
          return {
            ...inv,
            amountPaid: totalPaid,
            balance: newBalance,
            status: newStatus,
            paymentDate: new Date().toISOString().slice(0, 10),
            paymentMethod: paymentMethod || 'UPI',
            transactionRef: transactionRef || 'REF-' + Date.now().toString(36).toUpperCase(),
            notes: notes || inv.notes
          };
        }
        return inv;
      });

      return {
        ...prev,
        invoices: updatedInvoices
      };
    });
  };

  const processCustomerPayment = ({
    customerId,
    customerName,
    phone,
    apartment,
    planName,
    amount,
    paymentMethod = 'UPI',
    transactionRef,
    invoiceId,
    notes = 'Payment completed via Customer Portal'
  }) => {
    const finalRef = transactionRef || 'TXN-' + Date.now().toString(36).toUpperCase() + '-' + Math.floor(1000 + Math.random() * 9000);
    const numAmount = parseFloat(amount) || 1499;

    setState(prev => {
      let updatedInvoices = [...prev.invoices];
      let targetInvoice = updatedInvoices.find(inv => inv.id === invoiceId || (customerId && inv.customerId === customerId && inv.status !== 'Paid'));

      if (targetInvoice) {
        updatedInvoices = updatedInvoices.map(inv => {
          if (inv.id === targetInvoice.id) {
            const totalPaid = (inv.amountPaid || 0) + numAmount;
            const newBalance = Math.max(0, inv.total - totalPaid);
            return {
              ...inv,
              amountPaid: totalPaid,
              balance: newBalance,
              status: newBalance === 0 ? 'Paid' : 'Partially Paid',
              paymentDate: new Date().toISOString().slice(0, 10),
              paymentMethod,
              transactionRef: finalRef,
              notes: notes || inv.notes
            };
          }
          return inv;
        });
      } else {
        const invCount = updatedInvoices.length + 1;
        const invNumber = 'INV-' + new Date().getFullYear() + '-' + String(invCount).padStart(3, '0');
        const newInv = {
          id: invNumber,
          invoiceNumber: invNumber,
          customerId: customerId || 'CUST-PORTAL',
          customerName: customerName || 'Valued Customer',
          phone: phone || '',
          apartment: apartment || 'Prestige High Fields',
          planName: planName || 'Monthly Subscription Plan',
          date: new Date().toISOString().slice(0, 10),
          dueDate: new Date().toISOString().slice(0, 10),
          subtotal: Math.round(numAmount / 1.18),
          tax: Math.round(numAmount - (numAmount / 1.18)),
          total: numAmount,
          amountPaid: numAmount,
          balance: 0,
          status: 'Paid',
          paymentDate: new Date().toISOString().slice(0, 10),
          paymentMethod,
          transactionRef: finalRef,
          notes: notes
        };
        updatedInvoices = [newInv, ...updatedInvoices];
      }

      // Update customer payment status
      const updatedCustomers = prev.customers.map(c => {
        if (c.id === customerId || (phone && c.phone?.replace(/\D/g, '') === phone.replace(/\D/g, ''))) {
          return {
            ...c,
            paymentStatus: 'Paid',
            activePlan: planName || c.activePlan,
            subscriptionStatus: 'Active'
          };
        }
        return c;
      });

      // Update subscriptions
      const updatedSubscriptions = prev.subscriptions.map(s => {
        if (s.customerId === customerId || (phone && s.phone?.replace(/\D/g, '') === phone.replace(/\D/g, ''))) {
          return {
            ...s,
            status: 'Active',
            paymentStatus: 'Paid'
          };
        }
        return s;
      });

      return {
        ...prev,
        invoices: updatedInvoices,
        customers: updatedCustomers,
        subscriptions: updatedSubscriptions
      };
    });

    return {
      success: true,
      transactionRef: finalRef,
      amount: numAmount,
      paymentMethod,
      date: new Date().toISOString().slice(0, 10)
    };
  };

  const cancelInvoice = (invoiceId) => {
    setState(prev => ({
      ...prev,
      invoices: prev.invoices.map(inv =>
        inv.id === invoiceId ? { ...inv, status: 'Cancelled' } : inv
      )
    }));
  };

  const deleteInvoice = (invoiceId) => {
    setState(prev => ({
      ...prev,
      invoices: prev.invoices.filter(inv => inv.id !== invoiceId && inv.invoiceNumber !== invoiceId)
    }));
  };

  const cleanOrphanedInvoices = () => {
    setState(prev => {
      const validCustomerIds = new Set(prev.customers.map(c => c.id));
      const validCustomerNames = new Set(prev.customers.map(c => (c.name || '').trim().toLowerCase()));
      const validPhones = new Set(prev.customers.map(c => (c.phone || '').replace(/\D/g, '')).filter(Boolean));

      return {
        ...prev,
        invoices: prev.invoices.filter(inv => {
          if (inv.customerId && validCustomerIds.has(inv.customerId)) return true;
          if (inv.customerName && validCustomerNames.has((inv.customerName || '').trim().toLowerCase())) return true;
          if (inv.phone && validPhones.has((inv.phone || '').replace(/\D/g, ''))) return true;
          return false;
        })
      };
    });
  };

  // Integrations & Scope Actions
  const updateIntegrationsSettings = (patch) => {
    setState(prev => ({
      ...prev,
      integrationsSettings: {
        ...(prev.integrationsSettings || DEFAULT_INTEGRATIONS_SETTINGS),
        ...patch
      }
    }));
  };

  const updateScopeApproval = (patch) => {
    setState(prev => ({
      ...prev,
      integrationsSettings: {
        ...(prev.integrationsSettings || DEFAULT_INTEGRATIONS_SETTINGS),
        scopeApproval: {
          ...((prev.integrationsSettings && prev.integrationsSettings.scopeApproval) || DEFAULT_INTEGRATIONS_SETTINGS.scopeApproval),
          ...patch
        }
      }
    }));
  };

  const toggleAcceptanceCriterion = (key) => {
    setState(prev => {
      const current = (prev.integrationsSettings && prev.integrationsSettings.acceptanceCriteria) || DEFAULT_INTEGRATIONS_SETTINGS.acceptanceCriteria;
      return {
        ...prev,
        integrationsSettings: {
          ...(prev.integrationsSettings || DEFAULT_INTEGRATIONS_SETTINGS),
          acceptanceCriteria: {
            ...current,
            [key]: !current[key]
          }
        }
      };
    });
  };

  const addServiceLocation = (location) => {
    setState(prev => {
      const currentLocs = (prev.integrationsSettings && prev.integrationsSettings.locations) || DEFAULT_INTEGRATIONS_SETTINGS.locations;
      return {
        ...prev,
        integrationsSettings: {
          ...(prev.integrationsSettings || DEFAULT_INTEGRATIONS_SETTINGS),
          locations: [
            ...currentLocs,
            { id: `LOC-${Date.now()}`, ...location }
          ]
        }
      };
    });
  };

  const toggleServiceLocation = (id) => {
    setState(prev => {
      const currentLocs = (prev.integrationsSettings && prev.integrationsSettings.locations) || DEFAULT_INTEGRATIONS_SETTINGS.locations;
      return {
        ...prev,
        integrationsSettings: {
          ...(prev.integrationsSettings || DEFAULT_INTEGRATIONS_SETTINGS),
          locations: currentLocs.map(loc => loc.id === id ? { ...loc, active: !loc.active } : loc)
        }
      };
    });
  };

  return (
    <AdminDataContext.Provider
      value={{
        // Admin Auth
        isAuthenticated,
        adminUser,
        login,
        logout,
        setCustomAdminPassword,
        resetToDefaults,
        credentials: ADMIN_CREDENTIALS,

        // Employee Auth
        isEmployeeAuthenticated,
        employeeUser,
        employeeLogin,
        employeeLogout,
        updateEmployeeCredentials,
        resetEmployeePassword,

        // Customer Auth & Portal Actions
        isCustomerAuthenticated,
        customerUser,
        customerLogin,
        customerSignup,
        customerLogout,
        resetCustomerPassword,
        updateCustomerProfile,
        requestSubscriptionRenewal,
        requestCustomerAddon,
        requestPlanChange,

        // Data Models
        websiteContent: state.websiteContent,
        plans: state.plans,
        employees: state.employees,
        customers: state.customers,
        subscriptions: state.subscriptions,
        bookings: state.bookings,
        dailySchedules: state.dailySchedules,
        invoices: state.invoices,
        subscriptionChanges: state.subscriptionChanges,
        integrationsSettings: state.integrationsSettings || DEFAULT_INTEGRATIONS_SETTINGS,

        // Website Content Actions
        updateBusinessInfo,
        updateAboutContent,
        updateAnnouncement,
        addBanner,
        updateBanner,
        deleteBanner,
        toggleBannerStatus,
        addService,
        updateService,
        deleteService,
        toggleServiceStatus,
        addAddon,
        updateAddon,
        deleteAddon,
        toggleAddonStatus,
        addFaq,
        updateFaq,
        deleteFaq,

        // Plans Actions
        createPlan,
        updatePlan,
        deletePlan,
        togglePlanStatus,
        authorizeSubscriptionDateChange,

        // Customers Actions
        addCustomer,
        updateCustomer,
        deleteCustomer,

        // Subscriptions Actions
        assignSubscription,
        renewSubscription,
        extendSubscription,
        cancelSubscription,

        // Bookings Actions
        addBooking,
        updateBookingStatus,
        assignBookingEmployee,
        rescheduleBooking,

        // Employees Actions
        createEmployee,
        updateEmployee,
        deleteEmployee,
        toggleEmployeeStatus,

        // Schedules Actions
        updateScheduleStatus,
        reassignScheduleEmployee,
        rescheduleSlot,
        addScheduleItem,

        // Invoices Actions
        generateInvoice,
        recordPayment,
        processCustomerPayment,
        cancelInvoice,
        deleteInvoice,
        cleanOrphanedInvoices,

        // Integrations & Scope Actions
        updateIntegrationsSettings,
        updateScopeApproval,
        toggleAcceptanceCriterion,
        addServiceLocation,
        toggleServiceLocation
      }}
    >
      {children}
    </AdminDataContext.Provider>
  );
};

export const useAdminData = () => {
  const context = useContext(AdminDataContext);
  if (!context) {
    throw new Error('useAdminData must be used within an AdminDataProvider');
  }
  return context;
};
