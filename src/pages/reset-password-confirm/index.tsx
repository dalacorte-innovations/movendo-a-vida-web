import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { MdLock } from 'react-icons/md';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import BackgroundImage from '../../assets/images/background-resetpassword.png';
import { configBackendConnection, endpoints } from '../../utils/backendConnection';

const ResetPasswordConfirm = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { uidb64, token } = useParams();
  const navigate = useNavigate();

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setPasswordError('');
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
    setConfirmPasswordError('');
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!password) {
      setPasswordError('Campo obrigatório*');
      return;
    }

    if (!confirmPassword) {
      setConfirmPasswordError('Campo obrigatório*');
      return;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError('As senhas não coincidem');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${configBackendConnection.baseURL}/${endpoints.resetPasswordConfirm}${uidb64}/${token}/`, {
        method: 'POST',
        headers: configBackendConnection.headersDefault,
        body: JSON.stringify({
          new_password1: password,
          new_password2: confirmPassword,
        }),
      });

      if (response.status === 200) {
        toast.success('Senha redefinida com sucesso!');
        navigate('/login');
      } else {
        const data = await response.json();
        toast.error(data.detail || 'Erro ao redefinir senha.');
      }
    } catch (error) {
      toast.error('Erro ao processar a solicitação.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-primaryBlack font-metropolis">
      <div className="flex w-full h-full">
        <div className="hidden md:block w-1/2 h-screen">
          <img src={BackgroundImage} alt="Background" className="w-full h-full object-cover" />
        </div>

        <div className="w-full md:w-[56rem] flex flex-col items-center justify-center p-8 min-h-screen">
          <div className="bg-primaryGray rounded-3xl shadow-lg p-8 max-w-lg w-full">
            <h2 className="text-white text-2xl font-bold mb-4 text-center">Redefina sua senha</h2>
            <p className="text-thirdGray text-sm text-center mb-8">
              Insira sua nova senha abaixo.
            </p>

            <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
              <div className="mb-6 relative">
                <div className="flex items-center mb-2">
                  <MdLock className="text-blue-500 mr-2" size={20} />
                  <label htmlFor="password" className="block text-white">Nova Senha</label>
                </div>
                <input
                  type={isPasswordVisible ? 'text' : 'password'}
                  id="password"
                  className={`w-full pl-4 pr-10 py-2 bg-primaryGray text-sm text-white rounded-xl border-2 focus:outline-none ${passwordError ? 'border-red-500' : 'border-gray-600'}`}
                  placeholder="Insira sua nova senha"
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
                  <MdLock className="text-blue-500 mr-2" size={20} />
                  <label htmlFor="confirmPassword" className="block text-white">Confirmar Senha</label>
                </div>
                <input
                  type={isConfirmPasswordVisible ? 'text' : 'password'}
                  id="confirmPassword"
                  className={`w-full pl-4 pr-10 py-2 bg-primaryGray text-sm text-white rounded-xl border-2 focus:outline-none ${confirmPasswordError ? 'border-red-500' : 'border-gray-600'}`}
                  placeholder="Confirme sua nova senha"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                />
                <span className="absolute right-3 top-10 text-gray-500 cursor-pointer" onClick={toggleConfirmPasswordVisibility}>
                  {isConfirmPasswordVisible ? <FaEyeSlash size={24} /> : <FaEye size={24} />}
                </span>
                {confirmPasswordError && <p className="text-red-500 text-sm mt-1">{confirmPasswordError}</p>}
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
                    Redefinindo...
                  </div>
                ) : (
                  'Redefinir Senha'
                )}
              </button>

              <hr className="border-gray-600 my-4" />

              <p className="text-center text-sm text-white cursor-pointer" onClick={() => navigate('/login')}>
                Voltar para o login
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordConfirm;
