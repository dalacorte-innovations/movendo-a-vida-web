import React, { useState } from 'react';
import { MdEmail } from 'react-icons/md';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { RiLock2Fill } from 'react-icons/ri';
import LoginWithGoogle from '../../components/Google/loginGoogle.tsx';
import LoginWithFacebook from '../../components/Facebook/loginFacebook.tsx';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { saveToStorage } from '../../utils/storage';
import { configBackendConnection, endpoints } from '../../utils/backendConnection';
import Background from '../../assets/images/background-login.png';
import { useTranslation } from 'react-i18next';

const LoginPage = ({ onLogin }) => {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
    setUsernameError('');
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setPasswordError('');
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleRememberMeChange = (event) => {
    setRememberMe(event.target.checked);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log('Submit triggered');

    setUsernameError('');
    setPasswordError('');

    let canSubmit = true;

    if (username === '') {
      setUsernameError(t('Campo obrigatório*'));
      canSubmit = false;
    }

    if (password === '') {
      setPasswordError(t('Campo obrigatório*'));
      canSubmit = false;
    }

    if (!canSubmit) {
      return;
    }

    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 400));

      const response = await fetch(`${configBackendConnection.baseURL}/${endpoints.loginToken}`, {
        method: 'POST',
        headers: configBackendConnection.headersDefault,
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      if (response.status === 200) {
        const data = await response.json();
        const { token, name, user_type, plan_name, last_payment, payment_made, phone, email, image_url, referral_code, referral_count } = data;

        const storageData = {
          token,
          name,
          user_type,
          plan_name,
          last_payment,
          payment_made,
          phone,
          email,
          image_url,
          referral_code,
          referral_count
        };

        if (rememberMe) {
          localStorage.setItem('token', token);
        } else {
          sessionStorage.setItem('token', token);
        }

        saveToStorage(storageData);

        toast.success(t('Login bem-sucedido!'));
        onLogin(true);
        navigate('/');
      } else {
        toast.error(t('Credenciais inválidas'));
      }
    } catch (error) {
      toast.error(t('Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente mais tarde.'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-primaryBlack font-metropolis relative">
      <div className="flex w-full">
        <div className="hidden md:block w-1/2 h-screen">
          <img src={Background} alt="Background" className="w-full h-full object-cover" />
        </div>

        <div className="w-full md:w-[56rem] flex flex-col items-center justify-center p-8 min-h-screen">
          <div className="bg-primaryGray rounded-3xl shadow-lg p-8 max-w-lg w-full">
            <h2 className="text-white text-3xl font-bold mb-4 text-center font-metropolis">{t('Bem-vindo de volta!')}</h2>
            <p className="text-thirdGray text-sm text-center mb-8">{t('Por favor insira seus dados.')}</p>
            <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
              <div className="mb-6">
                <div className="flex items-center mb-2">
                  <MdEmail className="text-blue-500 mr-2" size={20} tabIndex="-1" />
                  <label htmlFor="username" className="block text-white">{t('E-mail')}</label>
                </div>
                <input
                  type="email"
                  id="username"
                  className={`w-full pl-4 pr-4 py-2 bg-primaryGray text-sm text-white rounded-xl border-2 focus:outline-none ${usernameError ? 'border-red-500' : 'border-gray-600'}`}
                  placeholder={t('Insira seu e-mail')}
                  value={username}
                  onChange={handleUsernameChange}
                />
                {usernameError && <p className="text-red-500 text-sm mt-1">{usernameError}</p>}
              </div>

              <div className="mb-6 relative">
                <div className="flex items-center mb-2">
                  <RiLock2Fill className="text-blue-500 mr-2" size={20} tabIndex="-1" />
                  <label htmlFor="password" className="block text-white">{t('Senha')}</label>
                </div>
                <input
                  type={isPasswordVisible ? 'text' : 'password'}
                  id="password"
                  className={`w-full pl-4 pr-10 py-2 bg-primaryGray text-sm text-white rounded-xl border-2 focus:outline-none ${passwordError ? 'border-red-500' : 'border-gray-600'}`}
                  placeholder={t('Insira sua senha')}
                  value={password}
                  onChange={handlePasswordChange}
                />
                <span className="absolute right-3 top-10 text-gray-500 cursor-pointer" onClick={togglePasswordVisibility}>
                  {isPasswordVisible ? <FaEyeSlash size={24} /> : <FaEye size={24} />}
                </span>
                {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
              </div>

              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <input type="checkbox" id="rememberMe" className="mr-2 text-thirdGray form-checkbox" onChange={handleRememberMeChange} />
                  <label htmlFor="rememberMe" className="text-thirdGray text-sm">{t('Lembrar de mim')}</label>
                </div>
                <a href="/reset-password" className="text-sm text-thirdGray text-right">{t('Esqueceu sua senha?')}</a>
              </div>

              <hr className="border-gray-600 my-6" />

              <button
                type="submit"
                className={`w-full py-2 bg-blue-600 text-white rounded-xl font-semibold ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin h-5 w-5 mr-3 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.373A8.008 8.008 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.565z"
                      ></path>
                    </svg>
                    {t('Entrando...')}
                  </div>
                ) : (
                  t('Fazer login')
                )}
              </button>
            </form>
              
            <div className="flex justify-between items-center space-x-4 mt-4 mb-6">
              <LoginWithFacebook onLogin={onLogin} type="button" onClick={(e) => e.preventDefault()} />
              <LoginWithGoogle onLogin={onLogin} type="button" onClick={(e) => e.preventDefault()} />
            </div>
            <p className="text-thirdGray mt-6 text-center text-sm">
              {t('Não possui uma conta ainda?')} <a href="/register" className="text-white text-sm">{t('Faça o cadastro')}</a>
            </p>

            <hr className="border-gray-600 my-4" />
            <p className="text-center text-sm text-white cursor-pointer" onClick={() => navigate('/landing-page')}>
              {t('Voltar para o site')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
