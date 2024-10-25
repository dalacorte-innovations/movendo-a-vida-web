import React, { useContext } from 'react';
import { toast } from 'react-toastify';
import backgroundImage from '../../assets/images/background-beneficios.png';
import { getToken } from '../../utils/storage';
import { ThemeContext } from '../../utils/ThemeContext.jsx';

const PaymentModal = ({ selectedPlan, onClose }) => {
  const { darkMode } = useContext(ThemeContext);

  const handlePayment = () => {
    const token = getToken();

    if (!token) {
      toast.error("Você precisa se logar primeiro para realizar o pagamento.");
      return;
    }

    let paymentLink = '';

    switch (selectedPlan.title) {
      case 'Profissional':
        paymentLink = 'https://buy.stripe.com/test_5kAg2P6YF4bOd4k002';
        break;
      case 'Avançado':
        paymentLink = 'https://buy.stripe.com/test_8wM4k72Ip5fS8O4eUV';
        break;
      case 'Iniciante':
        paymentLink = 'https://buy.stripe.com/test_14k3g382JgYA1lC6oo';
        break;
      default:
        console.error('Plano desconhecido');
        return;
    }

    window.location.href = paymentLink;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4 sm:p-0"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className={`relative w-full max-w-6xl mx-auto p-6 shadow-xl flex flex-col md:flex-row ${darkMode ? 'bg-primaryBlack' : 'bg-primaryBlack'} rounded-lg max-h-screen overflow-y-auto`}
      >
        <div
          className={`w-full md:w-1/2 p-6 flex flex-col justify-center ${darkMode ? 'bg-primaryBlack text-white' : 'bg-gray-100 text-gray-900'} bg-cover bg-center relative`}
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          <button className="text-gray-600 font-semibold mb-4 relative z-10" onClick={onClose}>
            ← Voltar para o site
          </button>
          <div className="flex flex-col items-center justify-center text-center mt-4">
            <h3 className="text-2xl font-semibold mb-2 text-black">Plano selecionado</h3>
            <p className="text-sm text-gray-400 mb-4">
              Melhor opção para quem possui um perfil de investidor conservador e busca uma experiência segura.
            </p>

            <div className={`rounded-xl p-6 mb-6 ${darkMode ? 'bg-primaryGray text-white' : 'bg-gray-200 text-gray-900'} w-full`}>
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-semibold">{selectedPlan.title}</h4>
                {selectedPlan.popular && (
                  <span className="text-sm bg-primaryPurple text-primaryPink py-1 px-3 rounded-full">
                    Mais popular
                  </span>
                )}
              </div>
              <p className="text-3xl font-bold">{selectedPlan.price}/mês</p>
              <p className="text-sm mt-2 mb-4">
                Com este plano, você desbloqueia uma série de benefícios exclusivos, incluindo acesso a ferramentas
                avançadas de planejamento.
              </p>
              <hr className="border-gray-600 mb-4" />
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>{selectedPlan.price}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-400">
                <span>Taxas</span>
              </div>
            </div>
          </div>
        </div>

        <div className={`w-full md:w-1/2 p-6 ${darkMode ? 'bg-primaryBlack text-white' : 'bg-gray-100 text-gray-900'} flex flex-col justify-center items-center`}>
          <div className="text-center mb-6">
            <h3 className="text-2xl font-semibold mb-4">Realizar pagamento</h3>
            <p className="text-sm mb-4 text-gray-400">Clique no botão abaixo para prosseguir com o pagamento.</p>
          </div>

          <button
            onClick={handlePayment}
            className="w-full py-2 bg-blue-600 rounded-lg text-white font-semibold hover:bg-blue-700 transition duration-300"
          >
            Realizar pagamento
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
