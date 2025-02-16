import React, { useState } from 'react';
import { MdEmail } from 'react-icons/md';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { RiLock2Fill } from 'react-icons/ri';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { configBackendConnection, endpoints } from '../../utils/backendConnection';
import Background from '../../assets/images/backgorund-register.png';
import RegisterWithGoogle from '../../components/Google/registerGoogle.tsx';
import RegisterWithFacebook from '../../components/Facebook/registerFacebook.tsx';
import { useTranslation } from 'react-i18next';

const RegisterPage = () => {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isRepeatPasswordVisible, setIsRepeatPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [usernameError, setUsernameError] = useState('');
  const [nameError, setNameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [repeatPasswordError, setRepeatPasswordError] = useState('');
  const { referral_code } = useParams();
  const navigate = useNavigate();

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
    setUsernameError('');
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
    setNameError('');
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setPasswordError('');
  };

  const handleRepeatPasswordChange = (event) => {
    setRepeatPassword(event.target.value);
    setRepeatPasswordError('');
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const toggleRepeatPasswordVisibility = () => {
    setIsRepeatPasswordVisible(!isRepeatPasswordVisible);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setUsernameError('');
    setNameError('');
    setPasswordError('');
    setRepeatPasswordError('');

    let canSubmit = true;

    if (username === '') {
      setUsernameError(t('Campo obrigatório*'));
      canSubmit = false;
    }

    if (name === '') {
      setNameError(t('Campo obrigatório*'));
      canSubmit = false;
    }

    if (password === '') {
      setPasswordError(t('Campo obrigatório*'));
      canSubmit = false;
    }

    if (repeatPassword === '' || repeatPassword !== password) {
      setRepeatPasswordError(t('Senhas não coincidem*'));
      canSubmit = false;
    }

    if (canSubmit) {
      setIsLoading(true);

      try {
        const response = await fetch(`${configBackendConnection.baseURL}/${endpoints.registerUser}`, {
          method: 'POST',
          headers: configBackendConnection.headersDefault,
          body: JSON.stringify({
            email: username,
            first_name: name,
            password: password,
            referral_code: referral_code || null,
          }),
        });

        if (response.status === 201) {
          toast.success(t('Cadastro bem-sucedido!'));
          navigate('/login');
        } else {
          toast.error(t('Erro ao realizar o cadastro.'));
        }
      } catch (error) {
        toast.error(t('Ocorreu um erro ao processar sua solicitação. Tente novamente mais tarde.'));
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-primaryBlack font-metropolis relative">
      <div className="flex w-full flex-col md:flex-row">
        <div className="hidden md:block md:w-1/2 min-h-screen">
          <img 
            src={Background} 
            alt="Background" 
            className="w-full h-full object-cover max-h-screen"
            style={{ objectFit: 'cover', maxHeight: '100vh' }} 
          />
        </div>

        <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-8 min-h-screen">
          <div className="bg-primaryGray rounded-3xl shadow-lg p-8 max-w-lg w-full">
            <h2 className="text-white text-3xl font-bold mb-4 text-center font-metropolis">{t('Seja bem-vindo!')}</h2>
            <p className="text-thirdGray text-sm text-center mb-8">{t('Cadastre seus dados.')}</p>
            <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
              <div className="mb-6">
                <div className="flex items-center mb-2">
                  <MdEmail className="text-blue-500 mr-2" size={20} />
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

              <div className="mb-6">
                <div className="flex items-center mb-2">
                  <MdEmail className="text-blue-500 mr-2" size={20} />
                  <label htmlFor="name" className="block text-white">{t('Nome')}</label>
                </div>
                <input
                  type="text"
                  id="name"
                  className={`w-full pl-4 pr-4 py-2 bg-primaryGray text-sm text-white rounded-xl border-2 focus:outline-none ${nameError ? 'border-red-500' : 'border-gray-600'}`}
                  placeholder={t('Insira seu nome')}
                  value={name}
                  onChange={handleNameChange}
                />
                {nameError && <p className="text-red-500 text-sm mt-1">{nameError}</p>}
              </div>

              <div className="mb-6 relative">
                <div className="flex items-center mb-2">
                  <RiLock2Fill className="text-blue-500 mr-2" size={20} />
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

              <div className="mb-6 relative">
                <div className="flex items-center mb-2">
                  <RiLock2Fill className="text-blue-500 mr-2" size={20} />
                  <label htmlFor="repeatPassword" className="block text-white">{t('Repita sua senha')}</label>
                </div>
                <input
                  type={isRepeatPasswordVisible ? 'text' : 'password'}
                  id="repeatPassword"
                  className={`w-full pl-4 pr-10 py-2 bg-primaryGray text-sm text-white rounded-xl border-2 focus:outline-none ${repeatPasswordError ? 'border-red-500' : 'border-gray-600'}`}
                  placeholder={t('Confirme sua senha')}
                  value={repeatPassword}
                  onChange={handleRepeatPasswordChange}
                />
                <span className="absolute right-3 top-10 text-gray-500 cursor-pointer" onClick={toggleRepeatPasswordVisibility}>
                  {isRepeatPasswordVisible ? <FaEyeSlash size={24} /> : <FaEye size={24} />}
                </span>
                {repeatPasswordError && <p className="text-red-500 text-sm mt-1">{repeatPasswordError}</p>}
              </div>

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
                    {t('Efetuando cadastro...')}
                  </div>
                ) : (
                  t('Efetuar cadastro')
                )}
              </button>
            </form>

            <div className="flex justify-between items-center space-x-4 mt-4 mb-6">
              <RegisterWithFacebook />
              <RegisterWithGoogle />
            </div>

            <p className="text-thirdGray mt-6 text-center text-sm">
              {t('Já possui uma conta?')} <a href="/login" className="text-white text-sm">{t('Siga para o login')}</a>
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

export default RegisterPage;
