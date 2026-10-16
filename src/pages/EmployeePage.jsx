import React from 'react';
import { useAdminData } from '../context/AdminDataContext';
import EmployeeLogin from '../components/employee/EmployeeLogin';
import EmployeeDashboard from '../components/employee/EmployeeDashboard';

export default function EmployeePage() {
  const { isEmployeeAuthenticated } = useAdminData();

  if (!isEmployeeAuthenticated) {
    return <EmployeeLogin />;
  }

  return <EmployeeDashboard />;
}
