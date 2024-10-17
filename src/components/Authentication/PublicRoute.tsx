import React from 'react';
import { Navigate } from 'react-router-dom';
import { getToken } from '../../utils/storage.jsx';

const PublicRoute = ({ element }) => {
  const token = getToken();
  return !token ? element : <Navigate to="/index" replace />;
};

export default PublicRoute;