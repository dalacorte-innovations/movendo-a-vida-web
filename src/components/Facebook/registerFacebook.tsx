import React from 'react';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import { toast } from 'react-toastify';
import { configBackendConnection, endpoints } from '../../utils/backendConnection';
import { useNavigate } from 'react-router-dom';
import { FaMeta } from 'react-icons/fa6';

const RegisterWithFacebook = () => {
  const navigate = useNavigate();

  const handleFacebookResponse = async (response) => {
    if (response.accessToken) {
      try {
        const facebookResponse = await fetch(`${configBackendConnection.baseURL}/${endpoints.registerUser}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: response.email,
            first_name: response.name.split(' ')[0],
            last_name: response.name.split(' ').slice(1).join(' '),
            facebook_token: response.accessToken,
          }),
        });

        if (facebookResponse.status === 201) {
          const data = await facebookResponse.json();
          toast.success('Registro via Facebook realizado com sucesso, faça o login!');
          navigate('/login');
        } else {
          toast.error('Erro ao realizar o registro via Facebook.');
        }
      } catch (error) {
        console.error(error);
        toast.error('Ocorreu um erro ao processar sua solicitação. Tente novamente mais tarde.');
      }
    } else {
      toast.error('Falha ao autenticar com Facebook.');
    }
  };

  return (
    <FacebookLogin
      appId={process.env.FACEBOOK_OAUTH2_CLIENT_ID}
      autoLoad={false}
      fields="name,email,picture"
      callback={handleFacebookResponse}
      render={(renderProps) => (
        <button
          className="flex items-center justify-center w-36 h-10 rounded-lg border border-gray-500"
          onClick={renderProps.onClick}
        >
          <FaMeta size={20} className="text-blue-500" />
        </button>
      )}
    />
  );
};

export default RegisterWithFacebook;
