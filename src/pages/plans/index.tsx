import React, { useState, useEffect, useContext } from 'react';
import { FaCircleCheck, FaRegCircleXmark } from 'react-icons/fa6';
import PaymentModal from '../../components/Payment/index.tsx'; 
import { useNavigate } from 'react-router-dom';
import { getToken, getPlan, getPlanMade } from '../../utils/storage.jsx';
import Sidebar from '../../components/sidebar/index.tsx';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner.jsx';
import { ThemeContext } from '../../utils/ThemeContext.jsx';
import { useTranslation } from 'react-i18next';

const plans = [
  {
    title: 'Iniciante',
    price: 'R$59,00',
    description: 'Melhor opção para quem possui um perfil de investidor conservador e busca uma experiência segura',
    features: ['Plano de Vida', 'Plano de Viagem', 'Exportar PDV', 'Exportar Excel', 'Gráficos', 'Agenda'],
    availableFeatures: [true, true, true, true, false, false],
    buttonColor: 'bg-gray-800',
    popular: false,
    plan_name: "Plano Iniciante"
  },
  {
    title: 'Avançado',
    price: 'R$100,00',
    description: 'Melhor opção para quem possui um perfil de investidor moderado e busca mais ferramentas para planejar seu futuro',
    features: ['Plano de Vida', 'Plano de Viagem', 'Exportar PDV', 'Exportar Excel', 'Gráficos', 'Agenda'],
    availableFeatures: [true, true, true, true, true, false],
    buttonColor: 'bg-blue-600',
    popular: true,
    plan_name: "Plano Avançado"
  },
  {
    title: 'Profissional',
    price: 'R$200,00',
    description: 'A escolha ideal para quem quer aproveitar todos os benefícios com um planejamento completo e detalhado',
    features: ['Plano de Vida', 'Plano de Viagem', 'Exportar PDV', 'Exportar Excel', 'Gráficos', 'Agenda'],
    availableFeatures: [true, true, true, true, true, true],
    buttonColor: 'bg-gray-800',
    popular: false,
    plan_name: "Plano Profissional"
  }
];

const PlansPage = () => {
  const { t } = useTranslation();
  const [hoveredPlan, setHoveredPlan] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPlan, setCurrentPlan] = useState('');
  const [paymentMade, setPaymentMade] = useState(false);
  const navigate = useNavigate();
  const { darkMode } = useContext(ThemeContext);

  useEffect(() => {
    const token = getToken();
    setAuthenticated(!!token);

    const storedPlan = getPlan();
    const storedPaymentMade = getPlanMade();

    setCurrentPlan(storedPlan);
    setPaymentMade(!!storedPaymentMade);
    setLoading(false);
  }, []);

  const handleMouseEnter = (index) => {
    setHoveredPlan(index);
  };

  const handleMouseLeave = () => {
    setHoveredPlan(null);
  };

  const handleSelectPlan = (plan, index) => {
    setSelectedPlan(index);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className={`flex h-[100%] ${darkMode ? 'bg-primaryBlack' : 'bg-white'}`}>
      {isAuthenticated && (
        <div className="flex-shrink-0">
          <Sidebar />
        </div>
      )}
      <section className={`flex-1 min-h-screen ${darkMode ? 'bg-primaryBlack' : 'bg-gray-100'} py-16 px-4 flex flex-col`}>
        <div className="text-center mb-12">
          <h2 className={`text-3xl md:text-4xl font-bold ${darkMode ? 'text-white' : 'text-black'}`}>{t('Nossos planos')}</h2>
          <p className={`text-sm md:text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-4 max-w-2xl mx-auto`}>
            {t('Seja qual for seu objetivo, nossos recursos foram projetados para guiá-lo ao longo dos próximos 20 anos, ajudando você a alcançar cada marco com confiança.')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto flex-grow">
          {plans.map((plan, index) => {
            const isDisabled = paymentMade && currentPlan === plan.plan_name;
            return (
              <div
                key={index}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
                onClick={() => !isDisabled && handleSelectPlan(plan, index)}
                className={`relative ${darkMode ? 'bg-primaryGray' : 'bg-white'} p-6 sm:p-8 rounded-lg shadow-lg flex flex-col items-center transition-all duration-300 
                  ${(hoveredPlan === index || selectedPlan === index) ? 'border-2 border-primaryPink' : 'border-2 border-transparent'}
                  ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute top-4 right-4 bg-primaryPurple text-primaryPink px-3 py-1 rounded-full text-xs font-semibold">
                    {t('Mais popular')}
                  </div>
                )}
                <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-black'}`}>{t(plan.title)}</h3>
                <div className={`text-3xl md:text-4xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-black'}`}>
                  {plan.price} <span className="text-lg font-normal">{t("/mês")}</span>
                </div>
                <p className={`text-sm text-center mb-4 md:mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {t(plan.description)}
                </p>
                <button
                  className={`w-full py-2 px-4 rounded-full font-semibold ${plan.buttonColor} text-white mb-4 md:mb-6`}
                  disabled={isDisabled}
                >
                  {isDisabled ? t('Plano Atual') : t('Ver plano')}
                </button>
                <hr className={`border-${darkMode ? 'gray-500' : 'gray-300'} mb-4 md:mb-6 w-full`} />
                <ul className="text-sm space-y-2 w-full">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      {plan.availableFeatures[featureIndex] ? (
                        <FaCircleCheck className="text-green-500 w-5 h-5 mr-2" />
                      ) : (
                        <FaRegCircleXmark className="text-red-500 w-5 h-5 mr-2" />
                      )}
                      <span className={`${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>{t(feature)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {selectedPlan !== null && (
          <PaymentModal
            selectedPlan={plans[selectedPlan]}
            onClose={() => setSelectedPlan(null)}
          />
        )}

        <hr className="border-gray-500 my-12 w-full" />

        <div className="text-center">
          <button
            className={`font-semibold text-lg hover:underline ${darkMode ? 'text-white' : 'text-black'}`}
            onClick={() => navigate('/')}
          >
            {t('Voltar para o site')}
          </button>
        </div>
      </section>
    </div>
  );
};

export default PlansPage;
