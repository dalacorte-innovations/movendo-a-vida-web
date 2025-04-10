import React from "react"
"use client"

import { useContext } from "react"
import { ThemeContext } from "../../utils/ThemeContext.jsx"
import { useTranslation } from "react-i18next"
import { IoCheckmarkCircle, IoCloseCircle } from "react-icons/io5"

const ComparisonTableModal = ({ selectedPlan, allPlans, onClose, onSelectPlan }) => {
  const { darkMode } = useContext(ThemeContext)
  const { t } = useTranslation()

  const getPlansToCompare = () => {
    const selectedIndex = allPlans.findIndex((plan) => plan.title === selectedPlan.title)
    return [selectedPlan, ...allPlans.slice(selectedIndex + 1)]
  }

  const plansToCompare = getPlansToCompare()

  const allFeatures = [
    "Plano de Vida",
    "Exportar PDF",
    "Gráficos",
    "Guia prático de uso da plataforma",
    "Acesso à indicação de Coaches de Planejamento de Vida",
    "Plano de Viagem com integração via Trello",
    "Agenda inteligente",
    "Acesso antecipado a novos recursos",
    "Benefício por indicação (R$ 20)",
    "Dashboard para gerenciamento de contas",
    "Plataforma personalizada (logo/nome)",
    "Destaque como parceiro oficial",
    "Suporte prioritário",
    "Acesso à Inteligência Artificial (opcional)",
    "Possibilidade de integração com programas internos de saúde e bem-estar",
    "Acompanhamento mensal por especialista (opcional)",
  ]

  const hasPlanFeature = (plan, feature) => {
    const planTitle = plan.title

    const commonFeatures = [
      "Plano de Vida",
      "Exportar PDF",
      "Gráficos",
      "Guia prático de uso da plataforma",
      "Acesso à indicação de Coaches de Planejamento de Vida",
    ]

    const advancedFeatures = [
      "Plano de Viagem com integração via Trello",
      "Agenda inteligente",
      "Acesso antecipado a novos recursos",
      "Benefício por indicação (R$ 20)",
    ]

    const professionalFeatures = [
      "Dashboard para gerenciamento de contas",
      "Plataforma personalizada (logo/nome)",
      "Suporte prioritário",
    ]

    const enterpriseOnlyFeatures = [
      "Destaque como parceiro oficial",
      "Possibilidade de integração com programas internos de saúde e bem-estar",
      "Acompanhamento mensal por especialista (opcional)",
    ]

    if (commonFeatures.includes(feature)) {
      return true
    }

    if (
      advancedFeatures.includes(feature) &&
      (planTitle === "Avançado" || planTitle === "Profissional (Coach)" || planTitle === "Empresarial")
    ) {
      return true
    }

    if (
      professionalFeatures.includes(feature) &&
      (planTitle === "Profissional (Coach)" || planTitle === "Empresarial")
    ) {
      return true
    }

    if (enterpriseOnlyFeatures.includes(feature) && planTitle === "Empresarial") {
      return true
    }

    if (feature === "Acesso à Inteligência Artificial (opcional)") {
      return planTitle === "Avançado" || planTitle === "Profissional (Coach)" || planTitle === "Empresarial"
    }

    return false
  }

  const getPlanColorClasses = (plan) => {
    const colorMap = {
      Iniciante: {
        bg: darkMode ? "bg-emerald-900/30" : "bg-emerald-100",
        text: darkMode ? "text-emerald-400" : "text-emerald-600",
        border: darkMode ? "border-emerald-800/30" : "border-emerald-200",
        headerBg: darkMode ? "bg-emerald-900/50" : "bg-emerald-200",
      },
      Avançado: {
        bg: darkMode ? "bg-blue-900/30" : "bg-blue-100",
        text: darkMode ? "text-blue-400" : "text-blue-600",
        border: darkMode ? "border-blue-800/30" : "border-blue-200",
        headerBg: darkMode ? "bg-blue-900/50" : "bg-blue-200",
      },
      "Profissional (Coach)": {
        bg: darkMode ? "bg-purple-900/30" : "bg-purple-100",
        text: darkMode ? "text-purple-400" : "text-purple-600",
        border: darkMode ? "border-purple-800/30" : "border-purple-200",
        headerBg: darkMode ? "bg-purple-900/50" : "bg-purple-200",
      },
      Empresarial: {
        bg: darkMode ? "bg-violet-900/30" : "bg-violet-100",
        text: darkMode ? "text-violet-400" : "text-violet-600",
        border: darkMode ? "border-violet-800/30" : "border-violet-200",
        headerBg: darkMode ? "bg-violet-900/50" : "bg-violet-200",
      },
    }

    return (
      colorMap[plan.title] || {
        bg: darkMode ? "bg-slate-700/30" : "bg-slate-100",
        text: darkMode ? "text-slate-400" : "text-slate-600",
        border: darkMode ? "border-slate-700/30" : "border-slate-200",
        headerBg: darkMode ? "bg-slate-700/50" : "bg-slate-200",
      }
    )
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="absolute inset-0 bg-black/70" onClick={onClose}></div>

      <div
        className={`relative w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl ${
          darkMode ? "bg-slate-800/95 border border-slate-700/50" : "bg-white/95 border border-blue-100"
        } backdrop-blur-md flex flex-col z-10`}
      >
        <div className="p-6 border-b border-slate-700/50 flex justify-between items-center">
          <h3 className={`text-xl font-bold ${darkMode ? "text-white" : "text-slate-800"}`}>
            {t("Tabela Comparativa dos Planos")}
          </h3>
          <button
            onClick={onClose}
            className={`p-2 rounded-full ${darkMode ? "hover:bg-slate-700/50" : "hover:bg-slate-100"}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 ${darkMode ? "text-slate-400" : "text-slate-500"}`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-auto p-4">
          <div className="overflow-x-auto">
            <table className={`w-full border-collapse ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
              <thead>
                <tr>
                  <th className={`p-3 text-left ${darkMode ? "bg-slate-700/50" : "bg-slate-100"} rounded-tl-lg`}>
                    {t("Recursos")}
                  </th>
                  {plansToCompare.map((plan, index) => {
                    const colorClasses = getPlanColorClasses(plan)
                    return (
                      <th
                        key={index}
                        className={`p-3 text-center ${colorClasses.headerBg} ${
                          index === plansToCompare.length - 1 ? "rounded-tr-lg" : ""
                        }`}
                      >
                        <div className={`font-bold ${colorClasses.text}`}>{t(plan.title)}</div>
                        <div className="text-sm mt-1">{plan.price}</div>
                        <div className="text-xs mt-1">
                          {plan.paymentType} — {plan.accessPeriod}
                        </div>
                        {plan.accountsIncluded && <div className="text-xs mt-1">{plan.accountsIncluded}</div>}
                        {plan !== selectedPlan && (
                          <button
                            onClick={() => onSelectPlan(allPlans.findIndex((p) => p.title === plan.title))}
                            className={`mt-2 px-3 py-1 text-xs rounded-full text-white ${
                              darkMode ? "bg-pink-600 hover:bg-pink-700" : "bg-blue-600 hover:bg-blue-700"
                            }`}
                          >
                            {t("Escolher Este")}
                          </button>
                        )}
                      </th>
                    )
                  })}
                </tr>
              </thead>
              <tbody>
                {allFeatures.map((feature, index) => (
                  <tr
                    key={index}
                    className={`${
                      index % 2 === 0
                        ? darkMode
                          ? "bg-slate-800/50"
                          : "bg-white"
                        : darkMode
                          ? "bg-slate-700/30"
                          : "bg-slate-50"
                    } border-b ${darkMode ? "border-slate-700/30" : "border-slate-200/70"}`}
                  >
                    <td className="p-3">{t(feature)}</td>
                    {plansToCompare.map((plan, planIndex) => {
                      const hasFeature = hasPlanFeature(plan, feature)
                      const colorClasses = getPlanColorClasses(plan)

                      const isOptionalAI = feature.includes("Inteligência Artificial")

                      return (
                        <td key={planIndex} className="p-3 text-center">
                          {isOptionalAI ? (
                            <div className={`text-xs ${colorClasses.text}`}>{t("R$ 20/mês por conta")}</div>
                          ) : hasFeature ? (
                            <IoCheckmarkCircle
                              className={`inline-block ${darkMode ? "text-emerald-400" : "text-emerald-600"}`}
                              size={20}
                            />
                          ) : (
                            <IoCloseCircle
                              className={`inline-block ${darkMode ? "text-slate-500" : "text-slate-400"}`}
                              size={20}
                            />
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="p-6 border-t border-slate-700/50 flex justify-end">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-lg ${
              darkMode
                ? "bg-slate-700 text-slate-200 hover:bg-slate-600"
                : "bg-slate-200 text-slate-800 hover:bg-slate-300"
            }`}
          >
            {t("Fechar")}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ComparisonTableModal
