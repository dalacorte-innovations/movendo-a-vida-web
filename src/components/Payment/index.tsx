import React from 'react';
import { MdEmail } from 'react-icons/md';
import { FaCreditCard, FaCalendarAlt, FaLock } from 'react-icons/fa';
import { IoPersonCircle, IoLocationSharp } from 'react-icons/io5';

const PaymentModal = ({ selectedPlan, onClose }) => {

  const handleBackgroundClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70" 
      onClick={handleBackgroundClick}
    >
      <div className="relative w-full max-w-4xl mx-auto p-8 bg-primaryGray rounded-3xl shadow-xl flex flex-col items-center md:flex-row">
        <div className="w-full md:w-1/2 p-6">
          <h3 className="text-2xl font-semibold text-white mb-4">Plano selecionado</h3>
          <div className="bg-gray-800 rounded-xl p-6 mb-6">
            <h4 className="text-white text-xl font-semibold">{selectedPlan.title}</h4>
            <p className="text-lg font-bold text-white">{selectedPlan.price}/mês</p>
            <p className="text-sm text-gray-300 mt-4">
              Com este plano, você desbloqueia uma série de benefícios exclusivos.
            </p>
            <hr className="my-4 border-gray-600" />
            <div className="text-sm text-gray-300">
              Subtotal: {selectedPlan.price}
              <br />
              Taxas: Incluídas
            </div>
          </div>
          <button
            className="text-white font-semibold text-lg hover:underline"
            onClick={onClose}
          >
            Voltar para o site
          </button>
        </div>
        <div className="w-full md:w-1/2 p-6 bg-gray-700 rounded-xl">
          <h3 className="text-2xl font-semibold text-white mb-6">Preencher detalhes de pagamento</h3>
          <form className="space-y-4">
            <div>
              <label className="text-sm text-gray-300">E-mail</label>
              <input
                type="email"
                className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Insira seu e-mail"
              />
            </div>
            <div>
              <label className="text-sm text-gray-300">Número do cartão</label>
              <input
                type="text"
                className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Insira o número do seu cartão"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-300">Data de vencimento</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="MM/AA"
                />
              </div>
              <div>
                <label className="text-sm text-gray-300">Código de segurança</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="CVV"
                />
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-300">Nome do proprietário do cartão</label>
              <input
                type="text"
                className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nome completo"
              />
            </div>
            <div>
              <label className="text-sm text-gray-300">Endereço da fatura</label>
              <input
                type="text"
                className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Insira o endereço"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-blue-600 text-white rounded-xl font-semibold mt-4"
            >
              Finalizar compra
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
