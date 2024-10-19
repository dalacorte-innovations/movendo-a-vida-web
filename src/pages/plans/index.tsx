import React, { useState } from 'react';
import { FaCircleCheck, FaRegCircleCheck } from 'react-icons/fa6';
import PaymentModal from '../../components/Payment/index.tsx'; 
import { useNavigate } from 'react-router-dom';

const plans = [
    {
      title: 'Iniciante',
      price: 'R$59,00',
      description: 'Melhor opção para quem possui um perfil de investidor conservador e busca uma experiência segura',
      features: ['Benefício 01', 'Benefício 02', 'Benefício 03', 'Benefício 04', 'Benefício 05', 'Benefício 06'],
      buttonColor: 'bg-gray-800',
      popular: false
    },
    {
      title: 'Avançado',
      price: 'R$100,00',
      description: 'Melhor opção para quem possui um perfil de investidor conservador e busca uma experiência segura',
      features: ['Benefício 01', 'Benefício 02', 'Benefício 03', 'Benefício 04', 'Benefício 05', 'Benefício 06'],
      buttonColor: 'bg-blue-600',
      popular: true
    },
    {
      title: 'Profissional',
      price: 'R$200,00',
      description: 'Melhor opção para quem possui um perfil de investidor conservador e busca uma experiência segura',
      features: ['Benefício 01', 'Benefício 02', 'Benefício 03', 'Benefício 04', 'Benefício 05', 'Benefício 06'],
      buttonColor: 'bg-gray-800',
      popular: false
    }
  ];
  
  const PlansPage = () => {
    const [hoveredPlan, setHoveredPlan] = useState(null);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const navigate = useNavigate();

    const handleMouseEnter = (index) => {
      setHoveredPlan(index);
    };
  
    const handleMouseLeave = () => {
      setHoveredPlan(null);
    };
  
    const handleSelectPlan = (plan) => {
      setSelectedPlan(plan);
    };
  
    return (
      <section className="min-h-screen w-full bg-primaryBlack py-16 px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white">Nossos planos</h2>
          <p className="text-lg text-gray-400 mt-4 max-w-2xl mx-auto">
            Seja qual for seu objetivo, nossos recursos foram projetados para guiá-lo ao longo dos próximos 20 anos, ajudando você a alcançar cada marco com confiança.
          </p>
        </div>
  
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
              className={`relative bg-primaryGray p-8 rounded-lg shadow-lg flex flex-col items-center transition-all duration-300 
                ${plan.popular ? 'border-2 border-purple-600' : ''} 
                ${hoveredPlan === index && !plan.popular ? 'border-2 border-purple-600' : !plan.popular ? 'border-2 border-transparent' : ''}
              `}
            >
              {plan.popular && (
                <div className="absolute top-4 right-4 bg-purple-700 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  Mais popular
                </div>
              )}
              <h3 className="text-lg font-semibold mb-2 text-white">{plan.title}</h3>
              <div className="text-4xl font-bold text-white mb-2">
                {plan.price} <span className="text-lg font-normal">/mês</span>
              </div>
              <p className="text-sm text-center text-gray-400 mb-6">
                {plan.description}
              </p>
              <button
                className={`w-full py-2 px-4 rounded-full font-semibold ${plan.buttonColor} text-white mb-6`}
                onClick={() => handleSelectPlan(plan)}
              >
                Ver plano
              </button>
              <hr className="border-gray-500 mb-6 w-full" />
              <ul className="text-sm text-gray-300 space-y-2 w-full">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    {hoveredPlan === index || plan.popular ? (
                      <FaCircleCheck className="text-green-500 w-5 h-5 mr-2" />
                    ) : (
                      <FaRegCircleCheck className="text-gray-500 w-5 h-5 mr-2" />
                    )}
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
  
        {selectedPlan && (
          <PaymentModal
            selectedPlan={selectedPlan}
            onClose={() => setSelectedPlan(null)}
          />
        )}
  
        <hr className="border-gray-500 my-12 w-full" />
  
        <div className="text-center">
          <button
            className="text-white font-semibold text-lg hover:underline"
            onClick={() => navigate('/')}
          >
            Voltar para o site
          </button>
        </div>
      </section>
    );
  };
  
  export default PlansPage;