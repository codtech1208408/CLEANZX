import React from 'react';
import { useAdminData } from '../context/AdminDataContext';
import CustomerAuth from '../components/customer/CustomerAuth';
import CustomerDashboard from '../components/customer/CustomerDashboard';

export default function CustomerPage({ defaultTab = 'login' }) {
  const { isCustomerAuthenticated } = useAdminData();

  if (!isCustomerAuthenticated) {
    return <CustomerAuth defaultTab={defaultTab} />;
  }

  return <CustomerDashboard />;
}
