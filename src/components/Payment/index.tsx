import React, { useState } from 'react';
import { MdEmail } from 'react-icons/md';
import { IoPersonCircle, IoLocationSharp } from 'react-icons/io5';
import backgroundImage from '../../assets/images/background-beneficios.png';

const PaymentModal = ({ selectedPlan, onClose }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');

  const [emailError, setEmailError] = useState('');
  const [nameError, setNameError] = useState('');
  const [addressError, setAddressError] = useState('');

  const handleBackgroundClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let isValid = true;

    if (!email) {
      setEmailError('Campo obrigatório*');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (!name) {
      setNameError('Campo obrigatório*');
      isValid = false;
    } else {
      setNameError('');
    }

    if (!address) {
      setAddressError('Campo obrigatório*');
      isValid = false;
    } else {
      setAddressError('');
    }

    if (isValid) {
      // Redirecionar para o link correto do Stripe com base no plano selecionado
      switch (selectedPlan.title) {
        case 'Profissional':
          window.location.href = 'https://buy.stripe.com/test_5kAg2P6YF4bOd4k002';
          break;
        case 'Avançado':
          window.location.href = 'https://buy.stripe.com/test_8wM4k72Ip5fS8O4eUV';
          break;
        case 'Iniciante':
          window.location.href = 'https://buy.stripe.com/test_14k3g382JgYA1lC6oo';
          break;
        default:
          console.error('Plano desconhecido');
      }
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4 sm:p-0" 
      onClick={handleBackgroundClick}
    >
      <div className="relative w-full max-w-6xl mx-auto p-6 shadow-xl flex flex-col md:flex-row bg-primaryBlack rounded-lg max-h-screen overflow-y-auto">
        
        <div 
          className="w-full md:w-1/2 p-6 flex flex-col justify-center bg-primaryBlack bg-cover bg-center relative"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          <button className="text-gray-600 font-semibold mb-4 relative z-10" onClick={onClose}>
            ← Voltar para o site
          </button>
          <div className="flex flex-col items-center justify-center text-center mt-10 sm:mt-4">
            <h3 className="text-2xl font-semibold text-black mb-2">Plano selecionado</h3>
            <p className="text-sm text-gray-500 mb-6">
              Melhor opção para quem possui um perfil de investidor conservador e busca uma experiência segura.
            </p>

            <div className="bg-primaryGray rounded-xl p-6 mb-6 text-white w-full">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-semibold">{selectedPlan.title}</h4>
                {selectedPlan.popular && <span className="text-sm bg-primaryPurple text-primaryPink py-1 px-3 rounded-full">Mais popular</span>}
              </div>
              <p className="text-3xl font-bold">{selectedPlan.price}/mês</p>
              <p className="text-sm mt-2 mb-4">
                Com este plano, você desbloqueia uma série de benefícios exclusivos, incluindo acesso a ferramentas avançadas de planejamento.
              </p>
              <hr className="border-gray-600 mb-4" />
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>{selectedPlan.price}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-400">
                <span>Taxas</span>
                <span>Coloque seu endereço para calcular</span>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2 p-6 bg-primaryBlack text-white">
          <h3 className="text-xl font-semibold mb-2">Preencher detalhes de pagamento</h3>
          <p className="text-sm text-gray-400 mb-4">Complete suas informações para prosseguir com o pagamento.</p>
          <hr className="border-gray-600 mb-6" />
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="mb-6">
              <div className="flex items-center mb-2">
                <MdEmail className="text-blue-500 mr-2" size={18} />
                <label htmlFor="email" className="block text-white">E-mail</label>
              </div>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full pl-4 pr-4 py-2 bg-primaryGray text-sm text-white border-gray-600 rounded-xl border-2 focus:outline-none ${emailError ? 'border-red-500' : ''}`}
                placeholder="Insira seu e-mail"
              />
              {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
            </div>

            <div className="mb-6">
              <div className="flex items-center mb-2">
                <IoPersonCircle className="text-blue-500 mr-2" size={20} />
                <label htmlFor="name" className="block text-white">Nome completo</label>
              </div>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full pl-4 pr-4 py-2 bg-primaryGray text-sm text-white border-gray-600 rounded-xl border-2 focus:outline-none ${nameError ? 'border-red-500' : ''}`}
                placeholder="Nome completo"
              />
              {nameError && <p className="text-red-500 text-sm mt-1">{nameError}</p>}
            </div>

            <div className="mb-6">
              <div className="flex items-center mb-2">
                <IoLocationSharp className="text-blue-500 mr-2" size={20} />
                <label htmlFor="address" className="block text-white">Endereço da fatura</label>
              </div>
              <input
                type="text"
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className={`w-full pl-4 pr-4 py-2 bg-primaryGray text-sm text-white border-gray-600 rounded-xl border-2 focus:outline-none ${addressError ? 'border-red-500' : ''}`}
                placeholder="Insira o endereço"
              />
              {addressError && <p className="text-red-500 text-sm mt-1">{addressError}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-blue-600 rounded-lg text-white font-semibold mt-6 hover:bg-blue-700 transition duration-300"
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
