import React, { useContext, useEffect, useState, useMemo, useCallback } from 'react';
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
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinnerNotTimer.jsx';

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
    "empresas",
    "pessoais"
];

const LifePlanTable = () => {
    const { darkMode } = useContext(ThemeContext);
    const [isLoading, setIsLoading] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const plan = location.state?.plan || { items: [] };
    const [resetData, setResetData] = useState(false);
    const [dataHasBeenAltered, setDataHasBeenAltered] = useState(false);
    const [editingCell, setEditingCell] = useState<{ id: number, date: string } | null>(null);
    const allDates: string[] = plan.items.map(item => item.date.split('-').slice(0, 2).join('-'));
    const uniqueDates: string[] = useMemo(() => Array.from(new Set(allDates)).sort(), [allDates]);

    const formatCategoryName = (category: string) => {
        const formattedCategories: { [key: string]: string } = {
            receitas: "Receitas",
            estudos: "Estudos",
            custos: "Custos",
            lucroPrejuizo: "Lucro/Prejuízo",
            investimentos: "Investimentos",
            realizacoes: "Realizações",
            intercambio: "Intercâmbio",
            empresas: "Empresas",
            pessoais: "Pessoais"
        };
        return formattedCategories[category] || category;
    };

    const generateEmptyOrganizedData = (): OrganizedData => {
        return {
            receitas: {},
            estudos: {},
            custos: {},
            lucroPrejuizo: {},
            investimentos: {},
            realizacoes: {},
            intercambio: {},
            empresas: {},
            pessoais: {}
        };
    };

    const generateEmptyValues = () => {
        const returnalValue = {};
        uniqueDates.forEach(date => {
            returnalValue[date] = 0;
        });
        return returnalValue;
    };

    const defaultCategoryRows: { [key: string]: { name: string, values: any, firstMeta: number }[] } = {
        investimentos: [
            { name: "Reserva Inicial", values: generateEmptyValues(), firstMeta: 0 },
            { name: "Investimentos Planos de 12 meses", values: generateEmptyValues(), firstMeta: 0 },
            { name: "Investimentos Planos de 10 Anos", values: generateEmptyValues(), firstMeta: 0 },
            { name: "Investimentos Planos de Aposentadoria", values: generateEmptyValues(), firstMeta: 0 },
            { name: "Poupança Intercâmbio", values: generateEmptyValues(), firstMeta: 0 }
        ],
        empresas: [
            { name: "Criar Empresas", values: generateEmptyValues(), firstMeta: 0 },
            { name: "Comprar Empresas", values: generateEmptyValues(), firstMeta: 0 }
        ],
        pessoais: [
            { name: "Reforma no Apartamento", values: generateEmptyValues(), firstMeta: 0 },
            { name: "Casamento", values: generateEmptyValues(), firstMeta: 0 },
            { name: "Novo Apartamento", values: generateEmptyValues(), firstMeta: 0 },
            { name: "Carro Novo", values: generateEmptyValues(), firstMeta: 0 },
            { name: "Filhos", values: generateEmptyValues(), firstMeta: 0 },
            { name: "Casa na Praia", values: generateEmptyValues(), firstMeta: 0 }
        ]
    };

    const [organizedData, setOrganizedData] = useState<OrganizedData>(generateEmptyOrganizedData());

    const getNewIndex = () => {
        let newIndex = 0;
        categories.forEach(category => (
            newIndex += Object.keys(organizedData[category]).length
        ));
        return newIndex;
    };

    const sumAllValuesByDate = (date: string, category: string) => {
        let sum = 0;
        Object.keys(organizedData[category]).forEach((id) => {
            if (organizedData[category][id].values[date]) {
                sum += parseFloat(organizedData[category][id].values[date]);
            }
        });
        return sum;
    };

    const getTotalMonthProfit = (date: string) => {
        const totalMonthProfitEstudos = sumAllValuesByDate(date, "estudos");
        const totalMonthProfitReceitas = sumAllValuesByDate(date, "receitas");
        const totalMonthProfitCustos = sumAllValuesByDate(date, "custos");

        return totalMonthProfitReceitas - totalMonthProfitCustos - totalMonthProfitEstudos;
    };

    const setupProfitLossCategoryData = useCallback(() => {
        const newProfitLossCategoryData = {};
        const index = getNewIndex();
        const newProfitLossValues: { [key: string]: number } = {};
        uniqueDates.forEach((date) => {
            newProfitLossValues[date] = getTotalMonthProfit(date);
        });
        let totalProfit = 0;
        Object.values(newProfitLossValues).forEach((value) => {
            totalProfit += value;
        });
        newProfitLossCategoryData[index] = { name: totalProfit > 0 ? "Lucro" : "Prejuízo", values: newProfitLossValues, firstMeta: 0 };
        setOrganizedData(prev => ({
            ...prev,
            lucroPrejuizo: {
                ...newProfitLossCategoryData
            }
        }));
    }, [uniqueDates, organizedData]);

    useEffect(() => {
        setupProfitLossCategoryData();
    }, [setupProfitLossCategoryData]);

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
        let rowIndex = 0;
    
        // Adiciona os dados do plano ao organizedData
        categories.forEach(category => {
            Object.keys(newOrganizedData[category]).forEach((name) => {
                let rowTotal = 0;
                uniqueDates.forEach(date => {
                    if (newOrganizedData[category][name].values[date]) {
                        rowTotal += parseFloat(newOrganizedData[category][name].values[date]);
                    } else {
                        newOrganizedData[category][name].values[date] = 0;
                    }
                });
    
                finalOrganizedData[category][rowIndex] = {
                    name: name,
                    values: newOrganizedData[category][name].values,
                    firstMeta: rowTotal
                };
                rowIndex++;
            });
        });
    
        const profitLossValues: { [key: string]: number } = {};
        uniqueDates.forEach((date) => {
            const totalReceitas = Object.values(newOrganizedData["receitas"] || {}).reduce((acc, item) => acc + (parseFloat(item.values[date]) || 0), 0);
            const totalCustos = Object.values(newOrganizedData["custos"] || {}).reduce((acc, item) => acc + (parseFloat(item.values[date]) || 0), 0);
            const totalEstudos = Object.values(newOrganizedData["estudos"] || {}).reduce((acc, item) => acc + (parseFloat(item.values[date]) || 0), 0);
    
            profitLossValues[date] = totalReceitas - totalCustos - totalEstudos;
        });
    
        const totalProfit = Object.values(profitLossValues).reduce((acc, value) => acc + value, 0);
        finalOrganizedData["lucroPrejuizo"][0] = {
            name: totalProfit > 0 ? "Lucro" : "Prejuízo",
            values: profitLossValues,
            firstMeta: 0
        };
    
        setOrganizedData(finalOrganizedData);
    }, [plan, resetData]);

    const formatValue = (value) => {
        return parseFloat(value).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
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
    const [isSaving, setIsSaving] = useState(false);

    const handleSaveEdit = async () => {
        try {
            if (!dataHasBeenAltered) {
                toast.info('Nenhuma alteração para salvar.');
                return;
            }
    
            setIsLoading(true);
    
            const itemsForPlan = {};
    
            categories.forEach(category => {
                itemsForPlan[category] = {
                    items: Object.keys(organizedData[category]).map(id => {
                        const item = organizedData[category][id];
                        return uniqueDates.map(date => ({
                            category: category,
                            name: item.name,
                            value: parseFloat(item.values[date] || 0),
                            date: `${date}-01`,
                            meta: item.firstMeta
                        }));
                    }).flat()
                };
            });
    
            const response = await fetch(`${configBackendConnection.baseURL}/${endpoints.lifePlanAPI}${plan.id}/`, {
                method: 'PATCH',
                headers: {
                    ...getAuthHeaders(),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: plan.name,
                    items_for_plan: itemsForPlan
                })
            });
    
            if (!response.ok) {
                throw new Error('Erro ao salvar as alterações.');
            }
    
            setDataHasBeenAltered(false);
            toast.success('Alterações salvas com sucesso!');
        } catch (error) {
            console.error('Erro ao salvar as alterações:', error);
            toast.error('Erro ao salvar as alterações.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetEdit = () => {
        setResetData(!resetData);
        setDataHasBeenAltered(false);
    };

    return (
        <div className={`flex flex-col md:flex-row ${darkMode ? 'bg-primaryGray' : 'bg-gray-100'} h-screen`}>
            <LoadingSpinner isLoading={isLoading} />
            
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
                                disabled={isSaving}
                            >
                                <IoSave size={20} />
                                <span className="ml-1">
                                    {t('Salvar Alterações')}
                                </span>
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
                    {categories.map(category => (
                        <div key={category}>
                            <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-black'}`}>
                                Categoria: {formatCategoryName(category)}
                            </h3>

                            <div className="overflow-x-auto" style={{ paddingBottom: '30px', }}>
                                <table className="table-auto w-full text-sm border-collapse shadow-lg" style={{ backgroundColor: 'transparent',  }}>
                                    <thead>
                                        <tr>
                                            <th className="" style={{ width: '30px', backgroundColor: 'transparent' }}></th>
                                            <th className={`px-4 py-2 border ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'}`}>Nome</th>
                                            {uniqueDates.map(date => {
                                                const [year, month] = date.split("-");
                                                return (
                                                    <th key={date}
                                                        className={`px-4 py-2 border text-center ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'}`}
                                                        style={{ minWidth: '180px',}}
                                                    >
                                                        {months[parseInt(month, 10) - 1].abbr} - {year}
                                                    </th>
                                                );
                                            })}
                                            <th className={`px-4 py-2 border text-center ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'}`}>Total</th>
                                        </tr>
                                    </thead>
                                    <TableBody
                                        data={organizedData}
                                        setData={setOrganizedData}
                                        category={category}
                                        formatValue={formatValue}
                                        darkMode={darkMode}
                                        uniqueDates={uniqueDates}
                                        editingCell={editingCell}
                                        setEditingCell={setEditingCell}
                                        setDataHasBeenAltered={setDataHasBeenAltered}
                                        getNewIndex={getNewIndex}
                                        setupProfitLossCategoryData={setupProfitLossCategoryData}
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