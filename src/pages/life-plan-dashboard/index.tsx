import React, { useContext, useState, useEffect } from 'react';
import { Line, Pie } from 'react-chartjs-2';
import Sidebar from '../../components/sidebar';
import { useNavigate } from 'react-router-dom';
import { FaPlane } from 'react-icons/fa';
import { RiAddBoxFill } from "react-icons/ri";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { ThemeContext } from '../../utils/ThemeContext.jsx';
import { configBackendConnection, endpoints, getAuthHeaders } from '../../utils/backendConnection';
import { format, parseISO } from 'date-fns';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import 'react-toastify/dist/ReactToastify.css';
import { Box } from '@mui/material';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

const LifePlanDashboard = () => {
    const navigate = useNavigate();
    const { darkMode } = useContext(ThemeContext);
    const [isSmallScreen, setIsSmallScreen] = useState(false);
    const [plansData, setPlansData] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("receitas");
    const { t } = useTranslation();

    useEffect(() => {
        const checkScreenSize = () => {
            setIsSmallScreen(window.innerWidth < 768);
        };
        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const response = await fetch(`${configBackendConnection.baseURL}/${endpoints.lifePlanAPI}`, {
                    method: 'GET',
                    headers: getAuthHeaders(),
                });
                if (!response.ok) {
                    toast.error(t('Erro ao carregar os planos de vida'));
                    return;
                }
                const data = await response.json();
                setPlansData(data);
            } catch (error) {
                toast.error(t('Erro ao carregar os planos de vida'));
            }
        };
        fetchPlans();
    }, []);

    const getAvailableCategories = (items) => {
        return [...new Set(items.map(item => item.category))];
    };

    const isPieChartCategory = ["estudos", "custos", "investimentos", "realizações", "intercâmbio", "empresas"].includes(selectedCategory.toLowerCase());

    const getChartData = (items, profitLossByDate) => {
        if (selectedCategory === "lucro_prejuizo") {
            const labels = profitLossByDate.map(item => format(parseISO(item.date), 'MMM yyyy'));
            const data = profitLossByDate.map(item => item.profit_loss);
            return {
                labels,
                datasets: [{
                    label: t("Lucro/Prejuízo"),
                    data: data,
                    backgroundColor: 'rgba(0, 0, 0, 0)',
                    borderColor: data.map(value => value > 0 ? '#4CAF50' : '#F44336'),
                    borderWidth: 2,
                    tension: 0.3,
                    pointBackgroundColor: data.map(value => value > 0 ? '#4CAF50' : '#F44336'),
                    pointBorderColor: '#FFFFFF',
                    pointRadius: 4,
                }]
            };
        } else if (isPieChartCategory) {
            const filteredItems = items
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, 3)
                .reduce((acc, item) => {
                    if (!acc[item.name]) {
                        acc[item.name] = parseFloat(item.value);
                    } else {
                        acc[item.name] += parseFloat(item.value);
                    }
                    return acc;
                }, {});

            const labels = Object.keys(filteredItems);
            const data = Object.values(filteredItems);
            const backgroundColor = ['#6A5ACD', '#4CAF50', '#FF9800', '#F44336', '#1E90FF', '#FFD700'];

            return {
                labels,
                datasets: [{
                    data,
                    backgroundColor: backgroundColor.slice(0, labels.length),
                    borderColor: '#FFFFFF',
                    borderWidth: 1,
                }]
            };
        } else {
            const labels = Array.from(new Set(items.map(item => format(parseISO(item.date), 'MMM yyyy'))));
            const incomeSources = Array.from(new Set(items.map(item => item.name)));
            const colors = ['#6A5ACD', '#4CAF50', '#FF9800', '#F44336'];
            
            const datasets = incomeSources.map((source, index) => {
                const sourceData = items
                    .filter(item => item.name === source)
                    .reduce((acc, item) => {
                        const label = format(parseISO(item.date), 'MMM yyyy');
                        acc[label] = acc[label] ? acc[label] + parseFloat(item.value) : parseFloat(item.value);
                        return acc;
                    }, {});

                return {
                    label: source,
                    data: labels.map(label => sourceData[label] || null),
                    backgroundColor: 'rgba(0, 0, 0, 0)',
                    borderColor: colors[index % colors.length],
                    borderWidth: 2,
                    tension: 0.5,
                    fill: false,
                    pointBackgroundColor: colors[index % colors.length],
                    pointBorderColor: '#FFFFFF',
                    pointRadius: 4,
                };
            });

            return { labels, datasets };
        }
    };

    const handleAddPlan = () => {
        navigate('/life-plan/create');
    };

    const handleViewDetailPlan = (plan) => {
        navigate(`/life-plan/${plan.id}/table`, { state: { plan } });
    };

    const handleViewPlan = (id) => {
        navigate(`/life-plan/${id}`);
    };

    return (
        <div className={`flex flex-col md:flex-row ${darkMode ? 'bg-primaryGray' : 'bg-gray-100'} ${isSmallScreen ? 'h-auto' : 'h-screen'} ml-0`}>
            <div className={`fixed md:relative ${darkMode ? 'bg-darkGray' : 'bg-gray-200'} h-full`}>
                <Sidebar />
            </div>
            <main className="flex flex-col w-full items-center h-full sm:ml-4 md:ml-0">
                <div className={`w-full py-4 px-6 md:px-12 ${darkMode ? 'bg-primaryBlack' : 'bg-white'}`}>
                    <div className="flex items-center justify-center text-sm space-x-4">
                        {!isSmallScreen &&
                            plansData.map((plan) => (
                                <button
                                    key={plan.id}
                                    className={`flex items-center font-semibold text-xs md:text-sm py-2 px-4 rounded-xl transition-colors ${
                                        darkMode ? 'bg-[#0b1e2e] text-white hover:bg-[#122939]' : 'bg-gray-300 text-black hover:bg-gray-400'
                                    }`}
                                    onClick={() => handleViewPlan(plan.id)}
                                >
                                    <FaPlane className="mr-2" />
                                    {t('Editar Plano')} - {plan.name}
                                </button>
                            ))}
                        <button
                            className={`flex items-center font-semibold text-xs md:text-sm py-2 px-4 rounded-xl transition-colors ${
                                darkMode ? 'bg-[#1a1a1a] text-white hover:bg-[#333333]' : 'bg-gray-300 text-black hover:bg-gray-400'
                            }`}
                            onClick={handleAddPlan}
                        >
                            <RiAddBoxFill className="mr-2" size={20} />
                            {t('Adicionar Plano')}
                        </button>
                    </div>
                </div>
                <div
                    style={{
                        flexWrap: 'wrap',
                        overflowY: 'auto',
                    }}
                    className="flex flex-col lg:flex-row justify-between gap-8 p-6 md:p-12 w-[90%] mx-auto h-[calc(100%-4rem)]"
                >
                    {plansData.map((plan) => {
                        const availableCategories = [...getAvailableCategories(plan.items), "lucro_prejuizo"];
                        const chartData = getChartData(
                            plan.items.filter(item => item.category === selectedCategory),
                            plan.profit_loss_by_date
                        );
                        const ChartComponent = isPieChartCategory ? Pie : Line;
                        const chartContainerStyle = isPieChartCategory
                            ? { width: '300px', height: '300px', margin: '0 auto' }
                            : { width: '100%', height: '80%'};
                        return (
                            <Box
                                key={plan.id}
                                sx={{
                                    height: '560px',
                                    maxWidth: '48%',
                                    "@media (max-width: 1885px)": {
                                        maxHeight: '490px'
                                    },
                                    "@media (max-width: 1722px)": {
                                        maxHeight: '400px',
                                    },
                                    "@media (max-width: 1291px)": {
                                        minWidth: '100%',
                                        maxHeight: '500px',
                                        minHeight: '500px',
                                    },
                                    "@media (max-width: 1048px)": {
                                        maxHeight: '400px',
                                        minHeight: '400px',
                                    },
                                    "@media (max-width: 592px)": {
                                        maxHeight: '350px',
                                        minHeight: '350px',
                                    },
                                    "@media (max-width: 516px)": {
                                        overflowX: 'auto',
                                        overflowY: 'hidden'
                                    }
                                }}
                                className={`relative rounded-3xl p-6 shadow-md border w-full ${darkMode ? 'border-secontGray' : 'border-gray-300 bg-white'}`}
                            >
                                <Box
                                    className="flex justify-between items-center mb-4"
                                    sx={{
                                        height: '40px',
                                        "@media (max-width: 516px)": {
                                            minWidth: '380px',
                                        }
                                    }}
                                >
                                    <div className="flex items-center">
                                        {!isSmallScreen && (
                                            <FaPlane className="mr-2" size={22} />
                                        )}
                                        <h2 className={`text-lg md:text-sm font-semibold ${darkMode ? 'text-white' : 'text-black'}`}>{plan.name}</h2>
                                    </div>
                                    <button className={`font-semibold text-xs md:text-sm py-2 px-4 rounded-full transition-colors ${darkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
                                        onClick={() => handleViewDetailPlan(plan)}
                                    >
                                        {t('Ver detalhe do plano')}
                                    </button>
                                </Box>
                                <Box
                                    sx={{
                                        ...chartContainerStyle,
                                        width: '100%',
                                        height: 'calc(100% - 40px - 60px)',
                                        "@media (max-width: 765px)": {
                                            height: 'calc(100% - 40px - 80px)',
                                        },
                                        "@media (max-width: 592px)": {
                                            height: '200px',
                                        },
                                        "@media (max-width: 516px)": {
                                            minHeight: '200px',
                                            minWidth: '380px',
                                        }
                                    }}
                                    className={`rounded-lg ${darkMode ? 'bg-darkGray' : 'bg-white'}`}
                                >
                                    <ChartComponent data={{ labels: chartData.labels, datasets: chartData.datasets }} options={chartData.options} />
                                </Box>
                                <Box
                                    sx={{
                                        flexWrap: 'wrap',
                                        justifyContent: 'center',
                                        margin: 'auto',
                                        gap: '10px',
                                        height: 'auto',
                                        "@media (max-width: 516px)": {
                                            minWidth: '380px',
                                        }
                                    }}
                                    className="left-0 right-0 flex justify-center"
                                >
                                    {availableCategories.map(category => (
                                        <button
                                            key={category}
                                            className={`text-xs px-2 py-1 rounded ${
                                                selectedCategory === category
                                                    ? "bg-blue-600 text-white"
                                                    : "bg-gray-300 text-black"
                                            }`}
                                            onClick={() => setSelectedCategory(category)}
                                        >
                                            {t(category === "lucro_prejuizo" ? "Lucro/Prejuízo" : category)}
                                        </button>
                                    ))}
                                </Box>
                            </Box>
                        );
                    })}
                </div>
                <button
                    className={`flex items-center justify-center font-semibold text-sm md:text-base py-4 mb-8 px-8 rounded-xl transition-colors w-[85%] mx-auto ${
                        darkMode ? 'bg-primaryBlack text-white hover:bg-[#1a1a1a]' : 'bg-gray-300 text-black hover:bg-gray-400'
                    } ${isSmallScreen ? 'mt-2' : 'mt-0'}`}
                    onClick={handleAddPlan}
                >
                    <RiAddBoxFill className="mr-2" size={20} />
                    {t('Adicionar Plano')}
                </button>
            </main>
        </div>
    );
};

export default LifePlanDashboard;
 