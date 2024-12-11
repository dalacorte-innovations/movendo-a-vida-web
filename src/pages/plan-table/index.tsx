import React, { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/sidebar';
import { ThemeContext } from '../../utils/ThemeContext.jsx';
import { IoCaretBack } from 'react-icons/io5';
import { FaFilePdf, FaFileCsv } from 'react-icons/fa6';
import { configBackendConnection, endpoints, getAuthHeaders } from '../../utils/backendConnection.js';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { OrganizedData } from '../../types/life-plan/lifePlan.js';

const months = [
    { full: "Janeiro", abbr: "jan" },
    { full: "Fevereiro", abbr: "fev" },
    { full: "Março", abbr: "mar" },
    { full: "Abril", abbr: "abr" },
    { full: "Maio", abbr: "mai" },
    { full: "Junho", abbr: "jun" },
    { full: "Julho", abbr: "jul" },
    { full: "Agosto", abbr: "ago" },
    { full: "Setembro", abbr: "set" },
    { full: "Outubro", abbr: "out" },
    { full: "Novembro", abbr: "nov" },
    { full: "Dezembro", abbr: "dez" }
];

const categories = [
    "receitas",
    "estudos",
    "custos",
    "lucroPrejuizo",
    "investimentos",
    "realizacoes",
    "intercambio",
    "empresas"
]

const LifePlanTable = () => {
    const { darkMode } = useContext(ThemeContext);
    const location = useLocation();
    const navigate = useNavigate();
    const { plan } = location.state || { plan: { items: [] } };

    const allDates: string[] = plan.items.map(item => item.date.split('-').slice(0, 2).join('-'));
    const uniqueDates: string[] = Array.from(new Set(allDates)).sort();
    const organizedData: OrganizedData = {
        receitas: {},
        estudos: {},
        custos: {},
        lucroPrejuizo: {},
        investimentos: {},
        realizacoes: {},
        intercambio: {},
        empresas: {}
    };
    plan.items.forEach((item) => {
        const [year, month] = item.date.split("-");
        const monthKey = `${year}-${month.padStart(2, '0')}`;
        if (!organizedData[item.category]) {
            organizedData[item.category] = {};
        }
        if (!organizedData[item.category][item.name]) {
            organizedData[item.category][item.name] = { values: {}, firstMeta: item.meta };
        }
        organizedData[item.category][item.name].values[monthKey] = item.value;
    });

    const formatValue = (value) => {
        return parseFloat(value).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    const getMetaStyle = (meta) => {
        return parseFloat(meta) > 0 ? 'text-yellow-600 font-bold' : 'text-green-600 font-bold';
    };

    const handleGeneratePDF = async () => {
        try {
            const response = await fetch(`${configBackendConnection.baseURL}/${endpoints.lifePlanAPI}${plan.id}/export-pdf/`, {
                method: 'GET',
                headers: getAuthHeaders()
            });
            if (!response.ok) {
                toast.error("Erro ao gerar PDF");
                return;
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `life_plan_${plan.id}.pdf`;
            link.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Erro ao baixar o PDF:", error);
            toast.error("Erro ao baixar o PDF");
        }
    };

    const handleGenerateCSV = async () => {
        try {
            const response = await fetch(`${configBackendConnection.baseURL}/${endpoints.lifePlanAPI}${plan.id}/export-csv/`, {
                method: 'GET',
                headers: getAuthHeaders()
            });
            if (!response.ok) {
                toast.error("Erro ao gerar CSV");
                return;
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `life_plan_${plan.id}.csv`;
            link.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Erro ao baixar o CSV:", error);
            toast.error("Erro ao baixar o CSV");
        }
    };
    console.log('org', organizedData)
    console.log('cat', organizedData['receitas'])
    return (
        <div className={`flex flex-col md:flex-row ${darkMode ? 'bg-primaryGray' : 'bg-gray-100'} h-screen`}>
            <div className={`fixed md:relative ${darkMode ? 'bg-darkGray' : 'bg-gray-200'} h-full`}>
                <Sidebar />
            </div>

            <main className="flex-grow mt-20 p-4 md:ml-16 overflow-auto">
                <div className="flex justify-between items-center mb-4 flex-wrap">
                    <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-black'}`}>
                        Histórico de Plano de Vida
                    </h2>
                    <div className="flex gap-2 mt-2 md:mt-0">
                        <button
                            className="flex items-center justify-center text-green-600 hover:text-green-700 transition-colors"
                            onClick={handleGenerateCSV}
                        >
                            <FaFileCsv size={20} />
                            <span className="ml-1">Gerar CSV</span>
                        </button>
                        <button
                            className="flex items-center justify-center text-red-600 hover:text-red-700 transition-colors"
                            onClick={handleGeneratePDF}
                        >
                            <FaFilePdf size={20} />
                            <span className="ml-1">Gerar PDF</span>
                        </button>
                    </div>
                </div>
                
                <div className="space-y-8">
                    {categories.map(category =>(
                        <div key={category}>
                            <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-black'}`}>
                                Categoria: {category}
                            </h3>
                            <div className="overflow-x-auto">
                                <table className="table-auto w-full text-sm border-collapse shadow-lg" style={{ backgroundColor: 'transparent' }}>
                                    <thead>
                                        <tr className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'}`}>
                                            <th className="px-4 py-2 border">Nome</th>
                                            {uniqueDates.map(date => {
                                                const [year, month] = date.split("-");
                                                return (
                                                    <th key={date} className="px-4 py-2 border text-center">
                                                        {months[parseInt(month, 10) - 1].abbr} - {year}
                                                    </th>
                                                );
                                            })}
                                            <th className="px-4 py-2 border text-center">Meta</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Object.keys(organizedData[category]).map((name, index) => (
                                            <tr key={index} className={`${darkMode ? 'bg-transparent text-white' : 'bg-white text-gray-900'}`}>
                                                <td className="px-4 py-2 border">{name}</td>
                                                {uniqueDates.map(date => (
                                                    <td key={date} className="px-4 py-2 border text-center">
                                                        {organizedData[category][name].values[date] ? formatValue(organizedData[category][name].values[date]) : 'N/A'}
                                                    </td>
                                                ))}
                                                <td className="px-4 py-2 border text-center">
                                                    <span className={getMetaStyle(organizedData[category][name].firstMeta)}>{formatValue(organizedData[category][name].firstMeta)}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex justify-center mt-6">
                    <button
                        className={`flex items-center justify-center font-semibold text-sm md:text-base py-2 px-4 md:py-4 md:px-6 transition-colors rounded-xl w-full md:w-auto ${
                            darkMode ? 'bg-primaryBlack text-white hover:bg-[#1a1a1a]' : 'bg-gray-300 text-black hover:bg-gray-400'
                        }`}
                        onClick={() => navigate('/life-plan/dashboard')}
                    >
                        <IoCaretBack className="mr-2" size={20} />
                        Voltar
                    </button>
                </div>
            </main>
        </div>
    );
};

export default LifePlanTable;
