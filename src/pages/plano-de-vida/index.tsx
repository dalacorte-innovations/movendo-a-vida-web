import React, { useState, useContext, useEffect } from 'react';
import Sidebar from '../../components/sidebar';
import Background from '../../assets/gifs/gif-plano-de-vida1.gif';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../../utils/ThemeContext.jsx';

const PlanoDeVidaPage = () => {
    const [inputError, setInputError] = useState(false);
    const [formData, setFormData] = useState({
        nomeCompleto: '',
        idade: '',
        profissao: '',
        dataPlanejamento: '',
    });
    const [isAdvancedForm, setIsAdvancedForm] = useState(1);
    const [advancedData, setAdvancedData] = useState({
        duracaoPlanejamento: '5',
        objetivo: '',
        custosVida: '',
        educacaoDesenvolvimento: '',
        metasPessoais: '',
        simulacao: '',
    });

    const navigate = useNavigate();
    const { darkMode } = useContext(ThemeContext);
    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
    };

    const handleAdvancedChange = (e) => {
        setAdvancedData({
            ...advancedData,
            [e.target.id]: e.target.value,
        });
    };

    const handleInitialSubmit = (e) => {
        e.preventDefault();
        const { nomeCompleto, idade, profissao, dataPlanejamento } = formData;
        if (!nomeCompleto || !idade || !profissao || !dataPlanejamento) {
            setInputError(true);
            return;
        }
        setInputError(false);
        setIsAdvancedForm(2);
    };

    const handleBack = () => {
        setIsAdvancedForm((prevStage) => Math.max(prevStage - 1, 1));
    };

    const handleNext = () => {
        setIsAdvancedForm((prevStage) => prevStage + 1);
    };

    const handleFinalSubmit = (e) => {
        e.preventDefault();
        navigate('/life-plan/dashboard');
    };

    useEffect(() => {
        const checkScreenSize = () => {
            setIsSmallScreen(window.innerWidth < 768);
        };
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    return (
        <div className={`flex h-screen overflow-y-auto ${darkMode ? 'bg-primaryGray' : 'bg-white'}`}>
            <div className={`fixed md:relative h-screen ${darkMode ? 'bg-darkGray' : 'bg-gray-200'}`}>
                <Sidebar />
            </div>
            <main className={`ml-0 lg:ml-20 flex flex-col ${isSmallScreen ? 'items-center mt-5' : 'md:flex-row'} h-full w-full`}>
                <div className={`flex flex-col justify-center w-full md:w-3/5 p-4 md:p-10 ${isSmallScreen ? 'mt-5 text-center' : ''}`}>
                    {isAdvancedForm === 1 ? (
                        <>
                            <h1 className={`text-xl md:text-2xl font-metropolis mb-2 ${darkMode ? 'text-white' : 'text-black'}`}>
                                Criar formulário do plano de vida
                            </h1>
                            <hr className={`border-gray-600 my-6 ${!darkMode && 'border-gray-300'}`} />
                            <section className={`rounded-lg p-4 md:p-6 ${darkMode ? 'bg-primaryGray' : 'bg-gray-100'}`}>
                                <h2 className={`text-md md:text-lg font-metropolis mb-4 ${darkMode ? 'text-forthyGray' : 'text-gray-700'}`}>
                                    Informações Pessoais
                                </h2>
                                <form className="space-y-4 md:space-y-6 min-h-[300px]" onSubmit={handleInitialSubmit}>
                                    {['nomeCompleto', 'idade', 'profissao'].map((id, index) => (
                                        <div key={index}>
                                            <div className="flex items-center mb-1 md:mb-2 pl-3">
                                                <label
                                                    className={`block text-sm md:text-base font-metropolis ${darkMode ? 'text-white' : 'text-black'}`}
                                                    htmlFor={id}
                                                >
                                                    {id.charAt(0).toUpperCase() + id.slice(1).replace(/([A-Z])/g, ' $1')}
                                                </label>
                                                <span className="text-red-500 ml-1">*</span>
                                            </div>
                                            <input
                                                type={id === 'idade' ? 'number' : 'text'}
                                                id={id}
                                                className={`w-full pl-4 pr-4 py-2 text-sm rounded-xl no-arrows border-2 focus:outline-none ${
                                                    darkMode ? 'bg-primaryGray text-white border-gray-600' : 'bg-gray-100 text-black border-gray-400'
                                                } ${inputError && !formData[id] ? 'border-red-500' : ''}`}
                                                placeholder={`Insira seu ${id}`}
                                                value={formData[id]}
                                                onChange={handleChange}
                                            />
                                            {inputError && !formData[id] && (
                                                <p className="text-red-500 text-sm mt-1">Campo obrigatório*</p>
                                            )}
                                        </div>
                                    ))}
                                    <div>
                                        <div className="flex items-center mb-1 md:mb-2 pl-3">
                                            <label
                                                className={`block text-sm md:text-base font-metropolis ${darkMode ? 'text-white' : 'text-black'}`}
                                                htmlFor="dataPlanejamento"
                                            >
                                                Data de início do planejamento
                                            </label>
                                            <span className="text-red-500 ml-1">*</span>
                                        </div>
                                        <input
                                            type="date"
                                            id="dataPlanejamento"
                                            className={`w-full pl-4 pr-4 py-2 text-sm rounded-xl border-2 focus:outline-none ${
                                                darkMode ? 'bg-primaryGray text-white border-gray-600' : 'bg-gray-100 text-black border-gray-400'
                                            } ${inputError && !formData.dataPlanejamento ? 'border-red-500' : ''}`}
                                            value={formData.dataPlanejamento}
                                            onChange={handleChange}
                                        />
                                        {inputError && !formData.dataPlanejamento && (
                                            <p className="text-red-500 text-sm mt-1">Campo obrigatório*</p>
                                        )}
                                    </div>
                                    <div className="flex flex-col md:flex-row justify-between mt-6 gap-4">
                                        <button
                                            type="button"
                                            className={`rounded-xl px-4 py-2 w-full md:w-1/2 text-sm md:text-base ${darkMode ? 'bg-gray-600 text-white hover:bg-gray-700' : 'bg-gray-300 text-black hover:bg-gray-400'}`}
                                            onClick={() => navigate('/life-plan/dashboard')}
                                        >
                                            Voltar
                                        </button>
                                        <button
                                            type="submit"
                                            className={`rounded-xl px-4 py-2 w-full md:w-1/2 text-sm md:text-base ${darkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                                        >
                                            Avançar
                                        </button>
                                    </div>
                                </form>
                            </section>
                        </>
                    ) : isAdvancedForm === 2 ? (
                        <>
                            <h1 className={`text-xl md:text-2xl font-metropolis mb-2 ${darkMode ? 'text-white' : 'text-black'}`}>
                                Planejamento Financeiro
                            </h1>
                            <hr className={`border-gray-600 my-6 ${!darkMode && 'border-gray-300'}`} />
                            <section className={`rounded-lg p-4 md:p-6 ${darkMode ? 'bg-primaryGray' : 'bg-gray-100'}`}>
                                <form className="space-y-4 md:space-y-6 min-h-[300px]">
                                    <div>
                                        <div className="flex items-center mb-1 md:mb-2 pl-3">
                                            <label
                                                className={`block text-sm md:text-base font-metropolis ${darkMode ? 'text-white' : 'text-black'}`}
                                                htmlFor="duracaoPlanejamento"
                                            >
                                                Duração do Planejamento
                                            </label>
                                            <span className="text-red-500 ml-1">*</span>
                                        </div>
                                        <select
                                            id="duracaoPlanejamento"
                                            className={`w-full pl-4 pr-4 py-2 text-sm rounded-xl border-2 focus:outline-none ${
                                                darkMode ? 'bg-primaryGray text-white border-gray-600' : 'bg-gray-100 text-black border-gray-400'
                                            }`}
                                            value={advancedData.duracaoPlanejamento}
                                            onChange={handleAdvancedChange}
                                        >
                                            <option value="5">5 anos</option>
                                            <option value="10">10 anos</option>
                                            <option value="20">20 anos</option>
                                        </select>
                                    </div>
                                    <div>
                                        <div className="flex items-center mb-1 md:mb-2 pl-3">
                                            <label
                                                className={`block text-sm md:text-base font-metropolis ${darkMode ? 'text-white' : 'text-black'}`}
                                                htmlFor="objetivo"
                                            >
                                                Objetivo
                                            </label>
                                            <span className="text-red-500 ml-1">*</span>
                                        </div>
                                        <input
                                            type="text"
                                            id="objetivo"
                                            className={`w-full pl-4 pr-4 py-2 text-sm rounded-xl border-2 focus:outline-none ${
                                                darkMode ? 'bg-primaryGray text-white border-gray-600' : 'bg-gray-100 text-black border-gray-400'
                                            }`}
                                            placeholder="Ex.: Comprar apartamento"
                                            value={advancedData.objetivo}
                                            onChange={handleAdvancedChange}
                                        />
                                    </div>
                                    <div className="flex flex-col md:flex-row justify-between mt-6 gap-4">
                                        <button
                                            type="button"
                                            className={`rounded-xl px-4 py-2 w-full md:w-1/2 text-sm md:text-base ${darkMode ? 'bg-gray-600 text-white hover:bg-gray-700' : 'bg-gray-300 text-black hover:bg-gray-400'}`}
                                            onClick={handleBack}
                                        >
                                            Voltar
                                        </button>
                                        <button
                                            type="button"
                                            className={`rounded-xl px-4 py-2 w-full md:w-1/2 text-sm md:text-base ${darkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                                            onClick={handleNext}
                                        >
                                            Avançar
                                        </button>
                                    </div>
                                </form>
                            </section>
                        </>
                    ) : isAdvancedForm === 3 ? (
                        <>
                            <h1 className={`text-xl md:text-2xl font-metropolis mb-2 ${darkMode ? 'text-white' : 'text-black'}`}>
                                Planejamento de Custos e Gastos
                            </h1>
                            <section className={`rounded-lg p-4 md:p-6 ${darkMode ? 'bg-primaryGray' : 'bg-gray-100'}`}>
                                <form className="space-y-4 md:space-y-6 min-h-[300px]">
                                    <div>
                                        <label className={`block text-sm md:text-base font-metropolis ${darkMode ? 'text-white' : 'text-black'}`} htmlFor="custosVida">
                                            Custos de Vida
                                        </label>
                                        <input
                                            type="text"
                                            id="custosVida"
                                            className={`w-full pl-4 pr-4 py-2 text-sm rounded-xl border-2 focus:outline-none ${
                                                darkMode ? 'bg-primaryGray text-white border-gray-600' : 'bg-gray-100 text-black border-gray-400'
                                            }`}
                                            placeholder="Ex.: Aluguel, Luz, Internet"
                                            value={advancedData.custosVida}
                                            onChange={handleAdvancedChange}
                                        />
                                    </div>
                                    <div>
                                        <label className={`block text-sm md:text-base font-metropolis ${darkMode ? 'text-white' : 'text-black'}`} htmlFor="educacaoDesenvolvimento">
                                            Educação e Desenvolvimento
                                        </label>
                                        <input
                                            type="text"
                                            id="educacaoDesenvolvimento"
                                            className={`w-full pl-4 pr-4 py-2 text-sm rounded-xl border-2 focus:outline-none ${
                                                darkMode ? 'bg-primaryGray text-white border-gray-600' : 'bg-gray-100 text-black border-gray-400'
                                            }`}
                                            placeholder="Ex.: Curso de Especialização, Idiomas"
                                            value={advancedData.educacaoDesenvolvimento}
                                            onChange={handleAdvancedChange}
                                        />
                                    </div>
                                    <div className="flex flex-col md:flex-row justify-between mt-6 gap-4">
                                        <button
                                            type="button"
                                            className={`rounded-xl px-4 py-2 w-full md:w-1/2 text-sm md:text-base ${darkMode ? 'bg-gray-600 text-white hover:bg-gray-700' : 'bg-gray-300 text-black hover:bg-gray-400'}`}
                                            onClick={handleBack}
                                        >
                                            Voltar
                                        </button>
                                        <button
                                            type="button"
                                            className={`rounded-xl px-4 py-2 w-full md:w-1/2 text-sm md:text-base ${darkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                                            onClick={handleNext}
                                        >
                                            Avançar
                                        </button>
                                    </div>
                                </form>
                            </section>
                        </>
                    ) : (
                        <>
                            <h1 className={`text-xl md:text-2xl font-metropolis mb-2 ${darkMode ? 'text-white' : 'text-black'}`}>
                                Metas de Realização Pessoal
                            </h1>
                            <section className={`rounded-lg p-4 md:p-6 ${darkMode ? 'bg-primaryGray' : 'bg-gray-100'}`}>
                                <form className="space-y-4 md:space-y-6 min-h-[300px]">
                                    <div>
                                        <label className={`block text-sm md:text-base font-metropolis ${darkMode ? 'text-white' : 'text-black'}`} htmlFor="metasPessoais">
                                            Metas Pessoais
                                        </label>
                                        <input
                                            type="text"
                                            id="metasPessoais"
                                            className={`w-full pl-4 pr-4 py-2 text-sm rounded-xl border-2 focus:outline-none ${
                                                darkMode ? 'bg-primaryGray text-white border-gray-600' : 'bg-gray-100 text-black border-gray-400'
                                            }`}
                                            placeholder="Ex.: Comprar uma Casa, Viajar"
                                            value={advancedData.metasPessoais}
                                            onChange={handleAdvancedChange}
                                        />
                                    </div>
                                    <div className="flex flex-col md:flex-row justify-between mt-6 gap-4">
                                        <button
                                            type="button"
                                            className={`rounded-xl px-4 py-2 w-full md:w-1/2 text-sm md:text-base ${darkMode ? 'bg-gray-600 text-white hover:bg-gray-700' : 'bg-gray-300 text-black hover:bg-gray-400'}`}
                                            onClick={handleBack}
                                        >
                                            Voltar
                                        </button>
                                        <button
                                            type="submit"
                                            className={`rounded-xl px-4 py-2 w-full md:w-1/2 text-sm md:text-base ${darkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                                        >
                                            Finalizar
                                        </button>
                                    </div>
                                </form>
                            </section>
                        </>
                    )}
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
