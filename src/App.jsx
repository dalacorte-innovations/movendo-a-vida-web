import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ThemeProvider } from './utils/ThemeContext.jsx';
import { getToken } from './utils/storage';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n.js';
import FeedbackPage from './pages/feedback/index.tsx';
import LoginPage from './pages/login/index.jsx';
import BenefitsPage from './pages/benefits/index.tsx';
import ContactPage from './pages/contact/index.tsx';
import LifePlanDashboard from './pages/life-plan-dashboard/index.tsx';
import LifePlanTable from './pages/plan-table/index.tsx';
import HomePage from './pages/home/index.tsx';
import TutorialPage  from './pages/onboarding/index.tsx';
import LogoutPage from './pages/logout/index.jsx';
import RegisterPage from './pages/register/index.tsx';
import ResetPasswordPage from './pages/reset-password/index.tsx';
import LandingPage from './pages/ladding-page/index.tsx';
import ResetPasswordConfirm from './pages/reset-password-confirm/index.tsx';
import PlansPage from './pages/plans/index.tsx';
import ConfigPage from './pages/config/index.tsx';
import ProtectedRoute from './components/Authentication/ProtectedRoute.tsx';
import PublicRoute from './components/Authentication/PublicRoute.tsx';
import LifePlanPage from './pages/plano-de-vida/index.tsx';

const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    setAuthenticated(!!token);
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <I18nextProvider i18n={i18n}>
        <ThemeProvider>
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
                <Route path="/landing-page" element={<LandingPage />} />
                <Route
                  path="/"
                  element={
                    authenticated ? (
                      <Navigate to="/home" replace />
                    ) : (
                      <Navigate to="/landing-page" replace />
                    )
                  }
                />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/benefits" element={<BenefitsPage />} />
                <Route
                  path="*"
                  element={
                    authenticated ? (
                      <Navigate to="/home" replace />
                    ) : (
                      <Navigate to="/landing-page" replace />
                    )
                  }
                />
                <Route
                  path="/home"
                  element={<ProtectedRoute element={<HomePage />} />}
                />
                <Route
                  path="/config"
                  element={<ProtectedRoute element={<ConfigPage />} />}
                />
                <Route path="/plans" element={<PlansPage />} />
                <Route 
                  path="/onboarding"
                  element={<ProtectedRoute element={<TutorialPage />} />}
                />
                <Route
                  path="/feedback"
                  element={<ProtectedRoute element={<FeedbackPage />} />}
                />
                <Route
                  path="/life-plan/:id"
                  element={<ProtectedRoute element={<LifePlanPage/>} />}
                />
                <Route
                  path="/life-plan/create"
                  element={<ProtectedRoute element={<LifePlanPage/>} />}
                />
                <Route
                  path="/life-plan/dashboard"
                  element={<ProtectedRoute element={<LifePlanDashboard />} />}
                />
                <Route path="/life-plan/:id/table" element={<LifePlanTable />} />

                <Route
                  path="/login"
                  element={<PublicRoute element={<LoginPage onLogin={setAuthenticated} />} />}
                />
                <Route path="/register/:referral_code" element={<PublicRoute element={<RegisterPage />} />} />
                <Route path="/register" element={<PublicRoute element={<RegisterPage />} />} />
                <Route
                  path="/logout"
                  element={<ProtectedRoute element={<LogoutPage onLogout={() => setAuthenticated(false)} />} />}
                />
                <Route path="/reset-password" element={<PublicRoute element={<ResetPasswordPage />} />} />
                <Route
                  path="/password_reset/confirm/:uidb64/:token"
                  element={<PublicRoute element={<ResetPasswordConfirm />} />}
                />
              </Routes>
            </div>
          </BrowserRouter>
        </ThemeProvider>
      </I18nextProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
