"use client"

import React from "react"
import { useState, useContext } from "react"
import { ThemeContext } from "../../utils/ThemeContext.jsx"
import { useNavigate } from "react-router-dom"
import { FaCheck, FaTimes, FaBrain, FaBolt, FaCalendar, FaStar } from "react-icons/fa"

export default function UpgradeAIPage() {
  const { darkMode } = useContext(ThemeContext)
  const navigate = useNavigate()
  const [selectedPlan, setSelectedPlan] = useState("monthly")
  const [selectedTier, setSelectedTier] = useState(null)

  const plans = {
    monthly: [
      {
        id: "basic",
        name: "Plano Básico",
        price: "R$ 125,10",
        description: "Plano de vida sem acesso à IA",
        features: ["Planejamento financeiro", "Metas e objetivos", "Acompanhamento de progresso", "Relatórios mensais"],
        aiFeatures: [
          "Acesso à IA (não incluído)",
          "Assistente personalizado (não incluído)",
          "Análise de dados (não incluído)",
          "Recomendações inteligentes (não incluído)",
        ],
        popular: false,
        color: darkMode ? "from-blue-600 to-indigo-700" : "from-blue-500 to-indigo-600",
      },
      {
        id: "premium",
        name: "Plano Premium",
        price: "R$ 145,10",
        description: "Plano de vida com acesso completo à IA",
        features: [
          "Planejamento financeiro",
          "Metas e objetivos",
          "Acompanhamento de progresso",
          "Relatórios mensais",
          "Suporte prioritário",
          "Recursos avançados",
        ],
        aiFeatures: [
          "Acesso ilimitado à IA",
          "Assistente personalizado",
          "Análise de dados avançada",
          "Recomendações inteligentes",
          "Previsões financeiras",
          "Otimização de metas",
        ],
        popular: true,
        color: darkMode ? "from-violet-600 to-purple-700" : "from-violet-500 to-purple-600",
      },
    ],
    annual: [
      {
        id: "basic-annual",
        name: "Plano Básico Anual",
        price: "R$ 1.251,00",
        pricePerMonth: "R$ 104,25",
        description: "Plano de vida sem acesso à IA",
        features: ["Planejamento financeiro", "Metas e objetivos", "Acompanhamento de progresso", "Relatórios mensais"],
        aiFeatures: [
          "Acesso à IA (não incluído)",
          "Assistente personalizado (não incluído)",
          "Análise de dados (não incluído)",
          "Recomendações inteligentes (não incluído)",
        ],
        popular: false,
        color: darkMode ? "from-blue-600 to-indigo-700" : "from-blue-500 to-indigo-600",
        discount: "20%",
      },
      {
        id: "premium-annual",
        name: "Plano Premium Anual",
        price: "R$ 1.451,00",
        pricePerMonth: "R$ 120,92",
        description: "Plano de vida com acesso completo à IA",
        features: [
          "Planejamento financeiro",
          "Metas e objetivos",
          "Acompanhamento de progresso",
          "Relatórios mensais",
          "Suporte prioritário",
          "Recursos avançados",
        ],
        aiFeatures: [
          "Acesso ilimitado à IA",
          "Assistente personalizado",
          "Análise de dados avançada",
          "Recomendações inteligentes",
          "Previsões financeiras",
          "Otimização de metas",
        ],
        popular: true,
        color: darkMode ? "from-violet-600 to-purple-700" : "from-violet-500 to-purple-600",
        discount: "20%",
      },
    ],
  }

  const handleSelectPlan = (tier) => {
    setSelectedTier(tier)
    // In a real app, this would navigate to a checkout page
    setTimeout(() => {
      navigate("/ai-assistant")
    }, 1500)
  }

  return (
    <div className={`min-h-screen ${darkMode ? "bg-slate-900" : "bg-slate-50"}`}>
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-8 text-center">
          <h1 className={`text-3xl font-bold ${darkMode ? "text-white" : "text-slate-800"}`}>
            Upgrade para Inteligência Artificial
          </h1>
          <p className={`mt-2 max-w-2xl mx-auto ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
            Desbloqueie o poder da IA para transformar seu planejamento de vida e alcançar seus objetivos mais
            rapidamente
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="w-full max-w-md">
            <div className="flex rounded-md overflow-hidden border border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setSelectedPlan("monthly")}
                className={`flex-1 py-2 px-4 text-center ${
                  selectedPlan === "monthly"
                    ? darkMode
                      ? "bg-slate-700 text-white"
                      : "bg-white text-slate-800"
                    : darkMode
                      ? "bg-slate-800 text-slate-400"
                      : "bg-slate-100 text-slate-600"
                }`}
              >
                Mensal
              </button>
              <button
                onClick={() => setSelectedPlan("annual")}
                className={`flex-1 py-2 px-4 text-center ${
                  selectedPlan === "annual"
                    ? darkMode
                      ? "bg-slate-700 text-white"
                      : "bg-white text-slate-800"
                    : darkMode
                      ? "bg-slate-800 text-slate-400"
                      : "bg-slate-100 text-slate-600"
                }`}
              >
                Anual{" "}
                <span className="ml-2 px-2 py-0.5 text-xs bg-green-500/10 text-green-500 rounded-full">
                  Economize 20%
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans[selectedPlan].map((plan) => (
            <div key={plan.id} className="relative">
              {plan.popular && (
                <div className="absolute -top-4 inset-x-0 flex justify-center">
                  <span className="bg-gradient-to-r from-amber-400 to-amber-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Mais Popular
                  </span>
                </div>
              )}

              <div
                className={`rounded-lg shadow-md overflow-hidden ${plan.popular ? "border-2 border-purple-500/50" : "border border-gray-200 dark:border-gray-700"} ${darkMode ? "bg-slate-800" : "bg-white"}`}
              >
                <div className={`h-2 w-full bg-gradient-to-r ${plan.color}`}></div>
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h3 className={`text-xl font-bold ${darkMode ? "text-white" : "text-slate-800"}`}>{plan.name}</h3>
                  <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}>{plan.description}</p>
                  <div className="mt-4">
                    <div className="flex items-baseline">
                      <span className={`text-3xl font-bold ${darkMode ? "text-white" : "text-slate-800"}`}>
                        {plan.price}
                      </span>
                      {plan.pricePerMonth && (
                        <span className={`ml-2 text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                          ({plan.pricePerMonth}/mês)
                        </span>
                      )}
                    </div>
                    {plan.discount && (
                      <span className="mt-2 inline-block px-2 py-0.5 text-xs bg-green-500/10 text-green-500 rounded-full">
                        Economize {plan.discount}
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-6 space-y-6">
                  <div>
                    <h4 className={`font-medium flex items-center mb-3 ${darkMode ? "text-white" : "text-slate-800"}`}>
                      <FaCalendar className="h-4 w-4 mr-2" />
                      Recursos do Plano de Vida
                    </h4>
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <FaCheck className="h-4 w-4 text-green-500 mr-2 mt-1 shrink-0" />
                          <span className={`text-sm ${darkMode ? "text-slate-300" : "text-slate-600"}`}>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className={`font-medium flex items-center mb-3 ${darkMode ? "text-white" : "text-slate-800"}`}>
                      <FaBrain className="h-4 w-4 mr-2" />
                      Recursos de IA
                    </h4>
                    <ul className="space-y-2">
                      {plan.aiFeatures.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          {feature.includes("não incluído") ? (
                            <FaTimes className="h-4 w-4 text-red-500 mr-2 mt-1 shrink-0" />
                          ) : (
                            <FaCheck className="h-4 w-4 text-green-500 mr-2 mt-1 shrink-0" />
                          )}
                          <span className={`text-sm ${darkMode ? "text-slate-300" : "text-slate-600"}`}>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                  <button
                    className={`w-full py-2 px-4 rounded-md text-white bg-gradient-to-r ${plan.color} hover:opacity-90 transition-opacity`}
                    onClick={() => handleSelectPlan(plan.id)}
                    disabled={selectedTier === plan.id}
                  >
                    {selectedTier === plan.id ? "Processando..." : "Selecionar Plano"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className={`text-2xl font-bold text-center mb-8 ${darkMode ? "text-white" : "text-slate-800"}`}>
            Por que escolher nosso plano com IA?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={`rounded-lg shadow-md overflow-hidden ${darkMode ? "bg-slate-800" : "bg-white"} p-6`}>
              <div className="flex items-center space-x-2 mb-4">
                <div className={`p-2 rounded-full ${darkMode ? "bg-violet-900/50" : "bg-violet-100"}`}>
                  <FaStar className={`h-5 w-5 ${darkMode ? "text-violet-400" : "text-violet-600"}`} />
                </div>
                <h3 className={`text-lg font-semibold ${darkMode ? "text-white" : "text-slate-800"}`}>
                  Personalização Avançada
                </h3>
              </div>
              <p className={`text-sm ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                Nossa IA aprende com seus hábitos e preferências para oferecer recomendações cada vez mais
                personalizadas.
              </p>
            </div>

            <div className={`rounded-lg shadow-md overflow-hidden ${darkMode ? "bg-slate-800" : "bg-white"} p-6`}>
              <div className="flex items-center space-x-2 mb-4">
                <div className={`p-2 rounded-full ${darkMode ? "bg-blue-900/50" : "bg-blue-100"}`}>
                  <FaBolt className={`h-5 w-5 ${darkMode ? "text-blue-400" : "text-blue-600"}`} />
                </div>
                <h3 className={`text-lg font-semibold ${darkMode ? "text-white" : "text-slate-800"}`}>
                  Eficiência Máxima
                </h3>
              </div>
              <p className={`text-sm ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                Economize tempo com análises automáticas e insights que ajudam a otimizar seu planejamento financeiro.
              </p>
            </div>

            <div className={`rounded-lg shadow-md overflow-hidden ${darkMode ? "bg-slate-800" : "bg-white"} p-6`}>
              <div className="flex items-center space-x-2 mb-4">
                <div className={`p-2 rounded-full ${darkMode ? "bg-amber-900/50" : "bg-amber-100"}`}>
                  <FaBrain className={`h-5 w-5 ${darkMode ? "text-amber-400" : "text-amber-600"}`} />
                </div>
                <h3 className={`text-lg font-semibold ${darkMode ? "text-white" : "text-slate-800"}`}>
                  Inteligência Artificial
                </h3>
              </div>
              <p className={`text-sm ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                Aproveite o poder da IA para tomar decisões mais inteligentes e alcançar seus objetivos mais rapidamente.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}