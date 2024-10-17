import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from 'react';
import LoginPage from './pages/login/index.jsx';
import HomePage from './pages/home/index.tsx';
import LogoutPage from './pages/logout/index.jsx';
import RegisterPage from './pages/register/index.tsx';
import ResetPasswordPage from './pages/reset-password/index.tsx';
import ResetPasswordConfirm from './pages/reset-password-confirm/index.tsx';
import ProtectedRoute from './components/Authentication/ProtectedRoute.tsx'
import PublicRoute from './components/Authentication/PublicRoute.tsx'

import { getToken } from './utils/storage';
import { GoogleOAuthProvider } from '@react-oauth/google';

const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

function App() {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const token = getToken();
    setAuthenticated(!!token);
  }, []);

  const handleLogin = (isLoggedIn) => {
    setAuthenticated(isLoggedIn);
  };

  const handleLogout = () => {
    setAuthenticated(false);
  };

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <BrowserRouter>
        <div>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
          <Routes>
            <Route path="/" element={<Navigate to={authenticated ? "/index" : "/login"} replace />} />
            <Route path="*" element={<Navigate to={authenticated ? "/index" : "/login"} replace />} />
            <Route path="/login" element={<PublicRoute element={<LoginPage onLogin={setAuthenticated} />} />} />
            <Route path="/register" element={<PublicRoute element={<RegisterPage />} />} />
            <Route path="/logout" element={<ProtectedRoute element={<LogoutPage onLogout={handleLogout} />} />} />
            <Route path="/reset-password" element={<PublicRoute element={<ResetPasswordPage />} />} />
            <Route path="/password_reset/confirm/:uidb64/:token" element={<PublicRoute element={<ResetPasswordConfirm />} />} />

          </Routes>
        </div>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
