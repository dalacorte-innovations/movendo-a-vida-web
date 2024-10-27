import React, { useContext, useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
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
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { ThemeContext } from '../../utils/ThemeContext.jsx';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const plansData = [
    {
        id: 1,
        title: "Plano de Vida 01",
        meta: 1000000,
        date: "14 de Maio",
    },
    {
        id: 2,
        title: "Plano de Vida 02",
        meta: 1000000,
        date: "14 de Maio",
    },
];

const chartData = {
    labels: ["1", "5", "10", "15", "20", "25", "30"],
    datasets: [
        {
            label: 'Valor 1',
            data: [2000, 4000, 5000, 6000, 7500, 9000, 9500],
            borderColor: '#6A5ACD',
            borderWidth: 2,
            fill: false,
            pointBackgroundColor: "#FFFFFF",
            pointBorderColor: "#6A5ACD",
            pointRadius: 6,
        },
        {
            label: 'Valor 2',
            data: [3000, 3500, 4200, 5000, 6200, 7200, 7800],
            borderColor: '#4CAF50',
            borderWidth: 2,
            fill: false,
            pointBackgroundColor: "#FFFFFF",
            pointBorderColor: "#4CAF50",
            pointRadius: 6,
        },
    ],
};

const options = {
    responsive: true,
    plugins: {
        tooltip: {
            callbacks: {
                title: (context) => `Meta: ${plansData[0].meta.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`,
                label: (context) => `${context.dataset.label}: ${context.raw.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`,
            }
        },
        legend: {
            display: false,
        },
    },
    scales: {
        x: {
            grid: {
                display: false,
            },
            ticks: {
                color: "#888",
            },
        },
        y: {
            grid: {
                color: "#333",
            },
            ticks: {
                color: "#888",
                callback: (value) => `R$ ${value / 1000}K`,
            },
        },
    },
};

const LifePlanDashboard = () => {
    const navigate = useNavigate();
    const { darkMode } = useContext(ThemeContext);
    const [isSmallScreen, setIsSmallScreen] = useState(false);

    useEffect(() => {
        const checkScreenSize = () => {
            setIsSmallScreen(window.innerWidth < 768);
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);

        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    const handleAddPlan = () => {
        navigate('/life-plan/create');
    };

    return (
        <div className={`flex flex-col md:flex-row ${darkMode ? 'bg-primaryGray' : 'bg-gray-100'} ${isSmallScreen ? 'h-auto' : 'h-screen'} ml-0`}>
            <div className={`fixed md:relative ${darkMode ? 'bg-darkGray' : 'bg-gray-200'} h-full`}>
                <Sidebar />
            </div>

            <main
                className="flex flex-col w-full items-center h-full sm:ml-4 md:ml-0"
            >
                <div className={`w-full py-4 px-6 md:px-12 ${darkMode ? 'bg-primaryBlack' : 'bg-white'}`}>
                    <div className="flex items-center justify-center text-sm space-x-4">
                        {!isSmallScreen &&
                            plansData.map((plan) => (
                                <button
                                    key={plan.id}
                                    className={`flex items-center font-semibold text-xs md:text-sm py-2 px-4 rounded-xl transition-colors ${
                                        darkMode ? 'bg-[#0b1e2e] text-white hover:bg-[#122939]' : 'bg-gray-300 text-black hover:bg-gray-400'
                                    }`}
                                >
                                    <FaPlane className="mr-2" />
                                    {plan.title}
                                </button>
                            ))}
                        <button
                            className={`flex items-center font-semibold text-xs md:text-sm py-2 px-4 rounded-xl transition-colors ${
                                darkMode ? 'bg-[#1a1a1a] text-white hover:bg-[#333333]' : 'bg-gray-300 text-black hover:bg-gray-400'
                            }`}
                            onClick={handleAddPlan}
                        >
                            <RiAddBoxFill className="mr-2" size={20} />
                            Adicionar Plano
                        </button>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row justify-between gap-8 p-6 md:p-12 w-[90%] mx-auto h-[calc(100%-4rem)]">
                    {plansData.map((plan) => (
                        <div key={plan.id} className={`rounded-3xl p-6 shadow-md border w-full lg:w-[49%] h-[auto] mt-4 lg:mt-20 lg:mb-36 ${darkMode ? 'border-secontGray' : 'border-gray-300 bg-white'}`}>
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center">
                                    {!isSmallScreen && (
                                        <FaPlane className="mr-2" size={22} />
                                    )}
                                    <h2 className={`text-lg md:text-sm font-semibold ${darkMode ? 'text-white' : 'text-black'}`}>{plan.title}</h2>
                                </div>
                                <button className={`font-semibold text-xs md:text-sm py-2 px-4 rounded-full transition-colors ${darkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}>
                                    Ver plano completo
                                </button>
                            </div>
                            <div className={`rounded-lg h-[250px] lg:h-[90%] ${darkMode ? 'bg-darkGray' : 'bg-white'}`}>
                                <Line data={chartData} options={options} />
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    className={`flex items-center justify-center font-semibold text-sm md:text-base py-4 mb-8 px-8 rounded-xl transition-colors w-[85%] mx-auto ${
                        darkMode ? 'bg-primaryBlack text-white hover:bg-[#1a1a1a]' : 'bg-gray-300 text-black hover:bg-gray-400'
                    } ${isSmallScreen ? 'mt-2' : 'mt-0'}`}
                    onClick={handleAddPlan}
                >
                    <RiAddBoxFill className="mr-2" size={20} />
                    Adicionar Plano
                </button>
            </main>
        </div>
    );
};

export default LifePlanDashboard;
