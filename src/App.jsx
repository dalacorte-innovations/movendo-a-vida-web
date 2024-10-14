import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from 'react';
import LoginPage from './pages/login/index.jsx';
import HomePage from './pages/home/index.tsx';
import LogoutPage from './pages/logout/index.jsx';
import RegisterPage from './pages/register/index.tsx';  // Adicione o import do RegisterPage
import { getToken } from './utils/storage';

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
          <Route path="/login" element={authenticated ? <Navigate to="/" /> : <LoginPage onLogin={handleLogin} />} />
          <Route path="/logout" element={<LogoutPage onLogout={handleLogout} />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={authenticated ? <HomePage /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
