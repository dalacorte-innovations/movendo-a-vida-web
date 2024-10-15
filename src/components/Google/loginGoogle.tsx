import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { FcGoogle } from 'react-icons/fc';
import { toast } from 'react-toastify';
import { configBackendConnection, endpoints } from '../../utils/backendConnection';
import { saveToStorage } from '../../utils/storage';

const LoginWithGoogle = ({ onLogin }) => {
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        });

        if (userInfoResponse.status === 200) {
          const googleResponse = await fetch(`${configBackendConnection.baseURL}/${endpoints.loginToken}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              access_token: tokenResponse.access_token,
            }),
          });

          if (googleResponse.status === 200) {
            const data = await googleResponse.json();
            const { token, name, restricted_access, user_type } = data;
            localStorage.setItem('token', token);
            saveToStorage({ token, name, restricted_access, user_type });

            toast.success('Login via Google realizado com sucesso!');
            onLogin(true);
          } else {
            toast.error('Erro ao realizar o login via Google. Conta não encontrada.');
          }
        } else {
          toast.error('Erro ao obter informações do usuário.');
        }
      } catch (error) {
        toast.error('Ocorreu um erro ao processar sua solicitação. Tente novamente mais tarde.');
      }
    },
    onError: () => {
      toast.error('Falha ao autenticar com Google.');
    },
  });

  return (
    <button
      className="flex items-center justify-center w-36 h-10 rounded-lg border border-gray-500"
      onClick={(e) => {
        e.preventDefault();
        googleLogin();
      }}
    >
      <FcGoogle size={20} />
    </button>
  );
};

export default LoginWithGoogle;
