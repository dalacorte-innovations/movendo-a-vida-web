import React, { useState } from 'react';
import Sidebar from '../../components/sidebar';
import Background from '../../assets/images/background-plano-de-vida.png';
import { useNavigate } from 'react-router-dom';

const PlanoDeVidaPage = () => {
    const [inputError, setInputError] = useState(false);
    const navigate = useNavigate();

    return (
        <div className="flex h-screen bg-primaryGray">
            <div className="fixed md:relative h-screen bg-darkGray">
                <Sidebar />
            </div>

            <main className="ml-20 flex flex-col md:flex-row h-full w-full">
                <div className="flex flex-col justify-center w-full md:w-3/5 p-4 md:p-10">
                    <h1 className="text-white text-xl md:text-2xl font-metropolis mb-2">Criar formulário do plano de vida</h1>
                    <hr className="border-gray-600 my-6" />
                    <section className="rounded-lg p-4 md:p-6">
                        <h2 className="text-forthyGray text-md md:text-lg font-metropolis mb-4">Informações Pessoais</h2>
                        <form className="space-y-4 md:space-y-6">
                            {['Nome completo', 'Idade', 'Profissão'].map((label, index) => (
                                <div key={index}>
                                    <label
                                        className="block text-sm md:text-base text-white font-metropolis mb-1 md:mb-2 pl-3"
                                        htmlFor={label.toLowerCase().replace(" ", "-")}
                                    >
                                        {label}
                                    </label>
                                    <input
                                        type={label === 'Idade' ? 'number' : 'text'}
                                        id={label.toLowerCase().replace(" ", "-")}
                                        className={`w-full pl-4 pr-4 py-2 bg-primaryGray text-sm text-white rounded-xl border-2 focus:outline-none ${inputError ? 'border-red-500' : 'border-gray-600'}`}
                                        placeholder={`Insira seu ${label.toLowerCase()}`}
                                    />
                                </div>
                            ))}
                            <div>
                                <label className="block text-sm md:text-base text-white font-metropolis mb-1 md:mb-2 pl-3" htmlFor="data-planejamento">
                                    Data de início do planejamento
                                </label>
                                <input
                                    type="date"
                                    id="data-planejamento"
                                    className={`w-full pl-4 pr-4 py-2 bg-primaryGray text-sm text-white rounded-xl border-2 focus:outline-none ${inputError ? 'border-red-500' : 'border-gray-600'}`}
                                />
                            </div>
                        </form>
                        <div className="flex flex-col md:flex-row justify-between mt-6 gap-4">
                            <button
                                className="bg-gray-600 text-white rounded-xl hover:bg-gray-700 px-4 py-2 w-full md:w-1/2 text-sm md:text-base"
                                onClick={() => navigate('/life-plan/dashboard')}
                            >
                                Voltar
                            </button>
                            <button
                                className="bg-blue-600 text-white hover:bg-blue-700 rounded-xl px-4 py-2 w-full md:w-1/2 text-sm md:text-base"
                                onClick={() => navigate('/life-plan/dashboard')}
                            >
                                Avançar
                            </button>
                        </div>
                    </section>
                </div>

                <div
                    className="hidden lg:block w-2/5 bg-cover bg-center rounded-r-lg"
                    style={{ backgroundImage: `url(${Background})` }}
                />
            </main>
        </div>
    );
};

export default PlanoDeVidaPage;
