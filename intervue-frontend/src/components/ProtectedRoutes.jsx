import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const name = sessionStorage.getItem('studentName');

  if (!name) {
    return <Navigate to="/student" replace />;
  }

  return children;
};

export default ProtectedRoute;
