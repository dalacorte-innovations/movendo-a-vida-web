import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { removeFromStorage } from '../../utils/storage';

const LogoutPage = ({ onLogout }) => {
  const navigate = useNavigate();

  useEffect(() => {
    removeFromStorage();
    toast.success("Logout realizado com sucesso.", { toastId: 'logoutSuccess' });
    onLogout(false);

    setTimeout(() => {
      navigate('/login');
    }, 200);
  }, [navigate, onLogout]);

  return null;
};

export default LogoutPage;
