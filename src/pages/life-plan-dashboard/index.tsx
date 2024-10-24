import React from 'react';
import Sidebar from '../../components/sidebar';
import { useNavigate } from 'react-router-dom';
import { FaPlane } from 'react-icons/fa'; // Importando ícones
import { RiAddBoxFill } from "react-icons/ri";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const plansData = [
    {
        id: 1,
        title: "Plano de Vida 01",
        meta: "1.000.000,00",
        date: "14 de Maio",
    },
    {
        id: 2,
        title: "Plano de Vida 02",
        meta: "1.000.000,00",
        date: "14 de Maio",
    },
];

// Dados do gráfico
const chartData = [
    { name: "1", value1: 2000, value2: 3000 },
    { name: "5", value1: 4000, value2: 3500 },
    { name: "10", value1: 5000, value2: 4200 },
    { name: "15", value1: 6000, value2: 5000 },
    { name: "20", value1: 7500, value2: 6200 },
    { name: "25", value1: 9000, value2: 7200 },
    { name: "30", value1: 9500, value2: 7800 },
];

const LifePlanDashboard = () => {
    const navigate = useNavigate();

    const handleAddPlan = () => {
        navigate('/life-plan/create'); // Redireciona para a rota de criação de plano
    };

    return (
        <div className="flex bg-primaryGray">
            <div className="fixed md:relative bg-darkGray">
                <Sidebar />
            </div>

            <main className="ml-64 md:ml-0 flex flex-col w-full items-center">
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

                <div className="flex-1 p-6 md:p-12 space-y-8 w-[90%] mx-auto">
                    {plansData.map((plan) => (
                        <div key={plan.id} className="rounded-3xl p-6 shadow-md border border-secontGray h-[31rem]">
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center">
                                    <FaPlane className="mr-2 text-white" size={22} />
                                    <h2 className="text-white text-lg font-semibold">{plan.title}</h2>
                                </div>
                                <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-full">
                                    Ver plano completo
                                </button>
                            </div>

                            {/* Componente de Gráfico */}
                            <div className="bg-darkGray rounded-lg h-[24rem]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                        <XAxis dataKey="name" tick={{ fill: "#888" }} />
                                        <YAxis tick={{ fill: "#888" }} />
                                        <Tooltip />
                                        <Line type="monotone" dataKey="value1" stroke="#8884d8" strokeWidth={2} dot={{ r: 6 }} activeDot={{ r: 8 }} />
                                        <Line type="monotone" dataKey="value2" stroke="#82ca9d" strokeWidth={2} dot={{ r: 6 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Botão Adicionar Plano centralizado */}
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
