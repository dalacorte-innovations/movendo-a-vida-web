import React from 'react';
import { Navigate } from 'react-router-dom';
import { getToken } from '../../utils/storage.jsx';

const ProtectedRoute = ({ element }) => {
  const token = getToken();
  return token ? element : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
