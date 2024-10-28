import React from 'react';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import { toast } from 'react-toastify';
import { configBackendConnection, endpoints } from '../../utils/backendConnection';
import { saveToStorage } from '../../utils/storage';
import { useNavigate } from 'react-router-dom';
import { FaMeta } from 'react-icons/fa6';

const LoginWithFacebook = ({ onLogin }) => {
  const navigate = useNavigate();

  const handleFacebookResponse = async (response) => {
    if (response.accessToken) {
      try {
        const userInfoResponse = await fetch(
          `https://graph.facebook.com/me?access_token=${response.accessToken}&fields=id,name,email`,
          { method: 'GET' }
        );

        if (userInfoResponse.ok) {
          const userInfo = await userInfoResponse.json();
          const facebookResponse = await fetch(`${configBackendConnection.baseURL}/${endpoints.loginToken}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              facebook_token: response.accessToken,
            }),
          });

          if (facebookResponse.status === 200) {
            const data = await facebookResponse.json();
            const { token, name, user_type, plan_name, last_payment, payment_made, phone, email, image_url, referral_code, referral_count } = data;
            localStorage.setItem('token', token);
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
            saveToStorage(storageData);

            toast.success('Login via Facebook realizado com sucesso!');
            onLogin(true);
            navigate('/');
          } else {
            toast.error('Erro ao realizar o login via Facebook. Conta não encontrada.');
          }
        } else {
          toast.error('Erro ao obter informações do usuário no Facebook.');
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

export default LoginWithFacebook;
