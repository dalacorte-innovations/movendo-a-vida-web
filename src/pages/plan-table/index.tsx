import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/sidebar';
import { ThemeContext } from '../../utils/ThemeContext.jsx';
import { IoAdd, IoCaretBack, IoSave, IoTrash } from 'react-icons/io5';
import { FaFilePdf, FaFileCsv } from 'react-icons/fa6';
import { configBackendConnection, endpoints, getAuthHeaders } from '../../utils/backendConnection.js';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { OrganizedData } from '../../types/life-plan/lifePlan.js';
import TableBody from './tableBody.js';
import { t } from 'i18next';
import { Box } from '@mui/material';

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
    const [resetData, setResetData] = useState(false); // THIS WILL FORCE THE RELOAD OF THE ORGANIZED DATA WHEN ALTERED
    const [dataHasBeenAltered, setDataHasBeenAltered] = useState(false);
    const [editingCell, setEditingCell] = useState<{id: number, date: string} | null>(null); // Track the cell being edited
  
    const allDates: string[] = plan.items.map(item => item.date.split('-').slice(0, 2).join('-'));
    const uniqueDates: string[] = Array.from(new Set(allDates)).sort();

    const generateEmptyOrganizedData = (): OrganizedData => {
        return {
            receitas: {},
            estudos: {},
            custos: {},
            lucroPrejuizo: {},
            investimentos: {},
            realizacoes: {},
            intercambio: {},
            empresas: {}
        }
    }
    const [organizedData, setOrganizedData] = useState<OrganizedData>(generateEmptyOrganizedData());

    const getNewIndex = () => {
        let newIndex = 0;
        categories.forEach(category => (
            newIndex += Object.keys(organizedData[category]).length
        ))
        return newIndex;
    }

    const sumAllValuesByDate = (date: string, category: string) => {
        let sum = 0;
        Object.keys(organizedData[category]).forEach((id) => {
            if (organizedData[category][id].values[date]) {
                sum += parseFloat(organizedData[category][id].values[date]);
            }
        });
        return sum
    }

    const getTotalMonthProfit = (date: string) => {
        const totalMonthProfitEstudos = sumAllValuesByDate(date, "estudos");
        const totalMonthProfitReceitas = sumAllValuesByDate(date, "receitas");
        const totalMonthProfitCustos = sumAllValuesByDate(date, "custos");
    
        return totalMonthProfitReceitas - totalMonthProfitCustos - totalMonthProfitEstudos;
    };

    const setupProfitLossCategoryData = () => {
        const newProfitLossCategoryData = {};
        const index = getNewIndex();
        const newProfitLossValues: {[key: string]: number} = {}
        uniqueDates.forEach((date) => {
            newProfitLossValues[date] = getTotalMonthProfit(date);
        });
        let totalProfit = 0
        Object.values(newProfitLossValues).forEach((value) => {
            totalProfit += value;
        })
        newProfitLossCategoryData[index] = { name: totalProfit > 0 ? "Lucro" : "Prejuízo", values: newProfitLossValues, firstMeta: 0 };
        setOrganizedData({
            ...organizedData,
            lucroPrejuizo: {
                ...newProfitLossCategoryData
            }
        })
    }
 
    useEffect(() => {
        setupProfitLossCategoryData();
    },[organizedData])

    useEffect(() => {
        const newOrganizedData = generateEmptyOrganizedData();
        plan.items.forEach((item) => {
            const [year, month] = item.date.split("-");
            const monthKey = `${year}-${month.padStart(2, '0')}`;
            if (!newOrganizedData[item.category]) {
                newOrganizedData[item.category] = {};
            }
            if (!newOrganizedData[item.category][item.name]) {
                newOrganizedData[item.category][item.name] = { values: {}, firstMeta: item.meta };
            }
            newOrganizedData[item.category][item.name].values[monthKey] = item.value;
        });
        const finalOrganizedData: OrganizedData = generateEmptyOrganizedData();
        let rowIndex = 0
        categories.forEach(category => {
            Object.keys(newOrganizedData[category]).forEach((name) => {
                finalOrganizedData[category][rowIndex] = {
                    name: name,
                    values: newOrganizedData[category][name].values,
                    firstMeta: newOrganizedData[category][name].firstMeta
                }
                rowIndex++
            })
        })
        setOrganizedData(finalOrganizedData);
    },[plan, resetData])
    
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

    const handleSaveEdit = () => {
        // ALL EDITED CELLS VALUES ARE IMPLEMENTED TO organizedData SO THE LOGIC
        // OF THIS FUNCTION SHOULD TAKE THIS VALUE AND SEND TO THE BACKEND
        toast.info('this functionality has not been implemented for now')

    }

    const handleResetEdit = () => {
        setResetData(!resetData);
        setDataHasBeenAltered(false);
    }
    

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
                    <div
                        className="flex gap-2 mt-2 md:mt-0"
                        style={{
                            flexWrap: 'wrap'
                        }}
                    >
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
                    {dataHasBeenAltered && (
                        <Box
                            className="flex items-center justify-between"
                            sx={{
                                maxWidth: '400px',
                                flexWrap: 'wrap'
                            }}
                        >
                            <button
                                className="flex items-center justify-center text-green-600 hover:text-green-700 transition-colors"
                                onClick={handleSaveEdit}
                            >
                                <IoSave size={20} />
                                <span className="ml-1">{t('Salvar Alterações')}</span>
                            </button>
                            <button
                                className="flex items-center justify-center text-red-600 hover:text-red-700 transition-colors"
                                onClick={handleResetEdit}
                            >
                                <IoTrash size={20} />
                                <span className="ml-1">{t('Descartar Alterações')}</span>
                            </button>
                        </Box>
                    )}
                    {categories.map(category =>(
                        <div key={category}>
                            <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-black'}`}>
                                Categoria: {category}
                            </h3>
                            <div className="overflow-x-auto">
                                <table className="table-auto w-full text-sm border-collapse shadow-lg" style={{ backgroundColor: 'transparent' }}>
                                    <thead>
                                        <tr>
                                            <th className="" style={{width: '30px', backgroundColor: 'transparent'}}></th> {/**This is only a component to push the header one cell to the right */}
                                            <th className={`px-4 py-2 border ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'}`}>Nome</th>
                                            {uniqueDates.map(date => {
                                                const [year, month] = date.split("-");
                                                return (
                                                    <th key={date} className={`px-4 py-2 border text-center ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'}`}>
                                                        {months[parseInt(month, 10) - 1].abbr} - {year}
                                                    </th>
                                                );
                                            })}
                                            <th className={`px-4 py-2 border text-center ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'}`}>Meta</th>
                                        </tr>
                                    </thead>
                                    <TableBody
                                        data={organizedData}
                                        setData={setOrganizedData}
                                        category={category}
                                        formatValue={formatValue}
                                        getMetaStyle={getMetaStyle}
                                        darkMode={darkMode}
                                        uniqueDates={uniqueDates}
                                        editingCell={editingCell}
                                        setEditingCell={setEditingCell}
                                        setDataHasBeenAltered={setDataHasBeenAltered}
                                        getNewIndex={getNewIndex}
                                    />
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
