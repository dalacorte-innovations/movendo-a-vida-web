import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { MdEmail } from 'react-icons/md';
import BackgroundImage from '../../assets/images/background-resetpassword.png';
import { configBackendConnection, endpoints } from '../../utils/backendConnection';

const ResetPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setEmailError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email) {
      setEmailError('Campo obrigatório*');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${configBackendConnection.baseURL}/${endpoints.resetPassword}`, {
        method: 'POST',
        headers: configBackendConnection.headersDefault,
        body: JSON.stringify({
          email: email,
        }),
      });

      if (response.status === 200) {
        toast.success('Código de redefinição de senha enviado para o seu e-mail!');
        navigate('/login');
      } else {
        const data = await response.json();
        toast.error(data.error || 'Erro ao solicitar redefinição de senha.');
      }
    } catch (error) {
      toast.error('Erro ao processar a solicitação. Tente novamente mais tarde.');
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
            <h2 className="text-white text-2xl font-bold mb-4 text-center">Vamos redefinir sua senha</h2>
            <p className="text-thirdGray text-sm text-center mb-8">
              Preencha seu e-mail para redefinirmos sua senha.
            </p>

            <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
              <div className="mb-6">
                <div className="flex items-center mb-2">
                  <MdEmail className="text-blue-500 mr-2" size={20} />
                  <label htmlFor="email" className="block text-white">E-mail</label>
                </div>
                <input
                  type="email"
                  id="email"
                  className={`w-full pl-4 py-2 bg-primaryGray text-sm text-white rounded-xl border-2 focus:outline-none ${emailError ? 'border-red-500' : 'border-gray-600'}`}
                  placeholder="Insira seu e-mail"
                  value={email}
                  onChange={handleEmailChange}
                />
                {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
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
                    Solicitando...
                  </div>
                ) : (
                  'Solicitar código'
                )}
              </button>

              <hr className="border-gray-600 my-4" />

              <p className="text-center text-sm text-white cursor-pointer" onClick={() => navigate('/landing-page')}>
                Voltar para o site
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
