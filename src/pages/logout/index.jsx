import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { removeFromStorage } from '../../utils/storage';
import { useTranslation } from 'react-i18next';

const LogoutPage = ({ onLogout }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    removeFromStorage();
    toast.success(t("Logout realizado com sucesso."), { toastId: 'logoutSuccess' });
    onLogout(false);

    setTimeout(() => {
      navigate('/login');
    }, 200);
  }, [navigate, onLogout, t]);

  return null;
};

export default LogoutPage;
