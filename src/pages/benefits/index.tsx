import React, { useContext } from 'react';
import { ThemeContext } from '../../utils/ThemeContext';
import { FaMedal, FaSmile, FaLeaf, FaHeart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const BenefitsPage = () => {
  const { darkMode } = useContext(ThemeContext);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const benefits = [
    {
      id: 1,
      icon: <FaMedal size={40} />,
      title: t("Qualidade de Vida"),
      description: t("Nosso plano é desenhado para melhorar sua qualidade de vida com acesso a melhores serviços e acompanhamento constante."),
    },
    {
      id: 2,
      icon: <FaSmile size={40} />,
      title: t("Bem-Estar Mental"),
      description: t("Conte com apoio psicológico e recursos que promovem o bem-estar mental e emocional."),
    },
    {
      id: 3,
      icon: <FaLeaf size={40} />,
      title: t("Sustentabilidade"),
      description: t("Benefícios pensados para promover um estilo de vida sustentável e saudável."),
    },
    {
      id: 4,
      icon: <FaHeart size={40} />,
      title: t("Apoio ao Cliente"),
      description: t("Apoio completo e constante para todas as suas necessidades e dúvidas relacionadas ao plano."),
    }
  ];

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center ${darkMode ? 'bg-primaryGray' : 'bg-white'}`}>
      <div className="container mx-auto py-16 px-8 text-center">
        <h1 className={`text-4xl font-bold mb-8 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          {t("Benefícios do Plano de Vida")}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {benefits.map((benefit) => (
            <div
              key={benefit.id}
              className={`flex flex-col items-center p-6 rounded-lg shadow-lg border-2 ${darkMode ? 'border-transparent' : 'border-transparent'}
                          transition-colors duration-300 ease-in-out hover:border-primaryPink hover:bg-primaryPinkLight`} // Borda e fundo no hover
            >
              <div className={`text-primary mb-4 ${darkMode ? 'text-green-400' : 'text-green-500'}`}>
                {benefit.icon}
              </div>
              <h2 className={`text-2xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {benefit.title}
              </h2>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

        <hr className="my-8 border-gray-500" />

        <button
          onClick={() => navigate('/')}
          className="w-full bg-primaryBlack text-white p-3 rounded-lg hover:bg-[#8B4513] transition duration-200"
        >
          {t("Voltar para o site")}
        </button>
      </div>
    </div>
  );
};

export default BenefitsPage;
