import React from 'react';
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

// Registre as escalas e elementos que você vai usar
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
        meta: 1000000, // Meta para o tooltip customizado
        date: "14 de Maio",
    },
    {
        id: 2,
        title: "Plano de Vida 02",
        meta: 1000000, // Meta para o tooltip customizado
        date: "14 de Maio",
    },
];

// Dados do gráfico
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

    const handleAddPlan = () => {
        navigate('/life-plan/create');
    };

    return (
        <div className="flex bg-primaryGray h-screen">
            <div className="fixed md:relative bg-darkGray h-full">
                <Sidebar />
            </div>

            <main className="ml-64 md:ml-0 flex flex-col w-full items-center h-full">
                <div className="w-full bg-primaryBlack py-4 px-6 md:px-12">
                    <div className="flex items-center justify-center text-sm space-x-4">
                        {plansData.map((plan) => (
                            <button
                                key={plan.id}
                                className="flex items-center bg-[#0b1e2e] text-white font-semibold py-2 px-6 rounded-xl hover:bg-[#122939] transition-colors"
                            >
                                <FaPlane className="mr-2 text-primaryBlue" />
                                {plan.title}
                            </button>
                        ))}
                        <button
                            className="flex items-center bg-[#1a1a1a] text-white font-semibold py-2 px-6 rounded-xl hover:bg-[#333333] transition-colors"
                            onClick={handleAddPlan}
                        >
                            <RiAddBoxFill className="mr-2 text-gray-300" size={20} />
                            Adicionar Plano 
                        </button>
                    </div>
                </div>

                <div className="flex justify-between gap-8 p-6 md:p-12 w-[90%] mx-auto h-[calc(100%-4rem)]">
                    {plansData.map((plan) => (
                        <div key={plan.id} className="rounded-3xl p-6 shadow-md border border-secontGray w-[49%] h-[70%] mt-20">
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center">
                                    <FaPlane className="mr-2 text-white" size={22} />
                                    <h2 className="text-white text-lg font-semibold">{plan.title}</h2>
                                </div>
                                <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-full">
                                    Ver plano completo
                                </button>
                            </div>

                            <div className="bg-darkGray rounded-lg h-[90%]">
                                <Line data={chartData} options={options} />
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    className="flex items-center justify-center bg-primaryBlack text-white font-semibold py-4 mb-8 px-8 rounded-xl hover:bg-[#1a1a1a] transition-colors w-[85%] mx-auto"
                    onClick={handleAddPlan}
                >
                    <RiAddBoxFill className="mr-2 text-white" size={20} />
                    Adicionar Plano
                </button>
            </main>
        </div>
    );
};

export default LifePlanDashboard;
