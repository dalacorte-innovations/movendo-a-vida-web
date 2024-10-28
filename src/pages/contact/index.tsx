import React, { useContext, useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { ThemeContext } from '../../utils/ThemeContext';
import BackgroundImage from '../../assets/gifs/gif-plano-de-vida1.gif';
import { configBackendConnection, endpoints } from '../../utils/backendConnection';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner.jsx';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const ContactPage = () => {
  const { darkMode } = useContext(ThemeContext);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${configBackendConnection.baseURL}/${endpoints.emailMessageAPI}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success(t("Mensagem enviada com sucesso!"));
        setFormData({
          name: '',
          email: '',
          message: ''
        });
      } else {
        toast.error(t("Erro ao enviar a mensagem. Tente novamente."));
      }
    } catch (error) {
      toast.error(t("Erro ao conectar com o servidor. Tente novamente mais tarde."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-primaryGray' : 'bg-white'}`}>
      <div className="container mx-auto flex flex-col md:flex-row items-center p-8">
        
        <div className="relative w-full md:w-1/2 mb-8 md:mb-0 flex flex-col justify-center items-center h-full">
          <img
            src={BackgroundImage}
            alt="Background Contact"
            className="w-full h-full object-cover rounded-lg"
          />
          <div className="absolute inset-0 flex flex-col justify-center items-center p-8 bg-black bg-opacity-50 rounded-lg">
            <h1 className="text-4xl font-bold mb-4 text-white">
              {t("Contato Plano de Vida")}
            </h1>
            <p className="text-lg text-gray-300 mb-6 text-center">
              {t("Entre em contato conosco para esclarecer dúvidas. Estamos aqui para ajudar!")}
            </p>
          </div>
        </div>

        <div className="w-full md:w-1/2 flex flex-col justify-center">
          {loading && <LoadingSpinner />}

          {!loading && (
            <form onSubmit={handleSubmit} className="bg-primaryGray shadow-lg rounded-lg p-8 space-y-4">
              <div>
                <label htmlFor="name" className="block mb-2 text-thirdGray">
                  {t("Seu nome completo")}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-primaryGray text-white"
                  placeholder={t("Digite seu nome aqui")}
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block mb-2 text-thirdGray">
                  {t("Seu e-mail*")}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-primaryGray text-white"
                  placeholder={t("Digite seu e-mail aqui")}
                  required
                />
              </div>
              <div>
                <label htmlFor="message" className="block mb-2 text-thirdGray">
                  {t("Sua mensagem*")}
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full p-3 h-32 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-primaryGray text-white"
                  placeholder={t("Escreva sua mensagem aqui")}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primaryBlack text-white p-3 rounded-lg hover:bg-secontGray transition duration-200"
              >
                {t("Enviar mensagem")}
              </button>

              <a
                href="https://wa.me/19998742217"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center text-green-500 hover:text-green-600 transition duration-200"
              >
                <FaWhatsapp size={24} className="mr-2" />
                <span className="text-lg text-thirdGray">{t("Entre em contato via WhatsApp")}</span>
              </a>

              <hr className="my-4 border-gray-500" />

              <button
                onClick={() => navigate('/')}
                className="flex items-center justify-center text-blue-500 hover:text-blue-600 transition duration-200 w-full mt-4"
              >
                <span className="text-lg text-thirdGray">{t("Voltar para o site")}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
