import React, { createContext, useContext, useState, useEffect } from 'react';
import { SUBSCRIPTION_PLANS } from '../data/websiteData';
import { useAdminData } from './AdminDataContext';

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const { plans: adminPlans, addBooking } = useAdminData();
  const [selectedPlan, setSelectedPlan] = useState('Monthly Normal Plan');
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [plans, setPlans] = useState(adminPlans || SUBSCRIPTION_PLANS);

  useEffect(() => {
    if (adminPlans && adminPlans.length > 0) {
      setPlans(adminPlans);
    }
  }, [adminPlans]);
  const [backendAvailable, setBackendAvailable] = useState(null); // null = checking, true/false
  const [enquiries, setEnquiries] = useState(() => {
    try {
      const saved = localStorage.getItem('cleanzx_local_enquiries');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Check backend health & fetch current plans configuration
  useEffect(() => {
    let isMounted = true;
    const checkBackend = async () => {
      try {
        const res = await fetch('/api/health');
        const isJson = res.ok && res.headers.get('content-type')?.includes('application/json');
        if (isJson) {
          if (isMounted) setBackendAvailable(true);
          // Fetch live plans if available
          const plansRes = await fetch('/api/plans');
          if (plansRes.ok && plansRes.headers.get('content-type')?.includes('application/json')) {
            const data = await plansRes.json();
            if (data.success && Array.isArray(data.data) && data.data.length > 0) {
              if (isMounted) {
                setPlans(data.data);
              }
            }
          }
          // Fetch live enquiries
          const enqRes = await fetch('/api/enquiries');
          if (enqRes.ok && enqRes.headers.get('content-type')?.includes('application/json')) {
            const enqData = await enqRes.json();
            if (enqData.success && Array.isArray(enqData.data)) {
              if (isMounted) setEnquiries(enqData.data);
            }
          }
        } else {
          if (isMounted) setBackendAvailable(false);
        }
      } catch (err) {
        if (isMounted) setBackendAvailable(false);
      }
    };
    checkBackend();
    return () => { isMounted = false; };
  }, []);

  // Sync enquiries to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('cleanzx_local_enquiries', JSON.stringify(enquiries));
    } catch (e) {
      console.error('LocalStorage sync error:', e);
    }
  }, [enquiries]);

  const selectPlanAndScroll = (planName) => {
    setSelectedPlan(planName);
    const formElement = document.getElementById('booking-enquiry-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const toggleAddon = (addonId) => {
    setSelectedAddons(prev =>
      prev.includes(addonId)
        ? prev.filter(id => id !== addonId)
        : [...prev, addonId]
    );
  };

  const submitEnquiry = async (formData) => {
    let result = { success: false, message: '', data: null, savedToBackend: false };

    // Try backend API first
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        const json = await res.json();
        setBackendAvailable(true);
        if (json.data) {
          setEnquiries(prev => [json.data, ...prev.filter(e => e.id !== json.data.id)]);
        }
        return {
          success: true,
          message: json.message || 'Thank you for choosing CLEANZX! Your enquiry has been received.',
          data: json.data,
          savedToBackend: true
        };
      } else {
        const errJson = await res.json().catch(() => ({}));
        if (res.status === 400 && errJson.errors) {
          return {
            success: false,
            message: errJson.message || 'Validation failed',
            errors: errJson.errors,
            savedToBackend: false
          };
        }
      }
    } catch (e) {
      // Backend not running, proceed to client fallback
      setBackendAvailable(false);
    }

    // Client fallback persistence (LocalStorage & Admin Store)
    const localEnquiry = {
      id: 'ENQ-LOC-' + Date.now().toString(36).toUpperCase() + '-' + Math.floor(1000 + Math.random() * 9000),
      ...formData,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      offlineSaved: true
    };

    setEnquiries(prev => [localEnquiry, ...prev]);

    // Also register in Admin Data bookings
    if (addBooking) {
      addBooking({
        ...formData,
        id: localEnquiry.id
      });
    }

    return {
      success: true,
      message: 'Thank you for choosing CLEANZX! Your enquiry has been recorded locally (backend server is offline). Our team will contact you to confirm availability.',
      data: localEnquiry,
      savedToBackend: false
    };
  };

  const updateEnquiryStatus = async (id, status, notes = '') => {
    try {
      const res = await fetch(`/api/enquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, adminNotes: notes })
      });
      if (res.ok) {
        const json = await res.json();
        setEnquiries(prev => prev.map(e => e.id === id ? json.data : e));
        return true;
      }
    } catch {
      // fallback local update
    }
    setEnquiries(prev => prev.map(e => e.id === id ? { ...e, status, adminNotes: notes } : e));
    return true;
  };

  return (
    <BookingContext.Provider
      value={{
        selectedPlan,
        setSelectedPlan,
        selectedAddons,
        setSelectedAddons,
        toggleAddon,
        plans,
        setPlans,
        enquiries,
        setEnquiries,
        backendAvailable,
        selectPlanAndScroll,
        submitEnquiry,
        updateEnquiryStatus
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};
