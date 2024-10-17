import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { FcGoogle } from 'react-icons/fc';
import { toast } from 'react-toastify';
import { configBackendConnection, endpoints } from '../../utils/backendConnection';
import { useNavigate } from 'react-router-dom';

const RegisterWithGoogle = () => {
  const navigate = useNavigate();

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
          const userInfo = await userInfoResponse.json();

          const googleResponse = await fetch(`${configBackendConnection.baseURL}/${endpoints.registerUser}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: userInfo.email,
              first_name: userInfo.given_name,
              last_name: userInfo.family_name,
              id_token: tokenResponse.access_token,
            }),
          });

          if (googleResponse.status === 201) {
            toast.success('Registro via Google realizado com sucesso, faça o login!');
            navigate('/login');
          } else {
            toast.error('Erro ao realizar o login via Google.');
          }
        } else {
          toast.error('Erro ao obter informações do usuário.');
        }
      } catch (error) {
        console.error(error);
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

export default RegisterWithGoogle;
