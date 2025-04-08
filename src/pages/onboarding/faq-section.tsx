"use client"

import React from "react"
import { useContext } from "react"
import { useTranslation } from "react-i18next"
import { ThemeContext } from "../../utils/ThemeContext.jsx"
import FAQSearch from "./faq-search.tsx"

export default function FAQSection() {
  const { darkMode } = useContext(ThemeContext)
  const { t } = useTranslation()
  const { searchQuery, setSearchQuery, filteredFAQs } = FAQSearch()

  return (
    <div
      className={`relative overflow-hidden rounded-xl shadow-md backdrop-blur-md mb-6 ${
        darkMode ? "bg-slate-800/70 border border-slate-700/50" : "bg-white/80 border border-blue-100"
      }`}
    >
      <div className="p-6">
        <h2 className={`text-xl font-semibold mb-4 ${darkMode ? "text-white" : "text-slate-800"}`}>
          {t("Perguntas Frequentes")}
        </h2>

        <div className="relative mb-6">
          <input
            type="text"
            placeholder={t("Buscar perguntas frequentes...")}
            className={`w-full pl-10 pr-4 py-3 rounded-lg transition-colors ${
              darkMode
                ? "bg-slate-700/50 text-white border border-slate-600/50 focus:border-pink-500/50"
                : "bg-white text-slate-800 border border-slate-200 focus:border-blue-300"
            } focus:outline-none`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div
            className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${darkMode ? "text-slate-400" : "text-slate-500"}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {filteredFAQs.length === 0 ? (
          <div
            className={`p-4 text-center rounded-lg ${
              darkMode ? "bg-slate-700/30 border border-slate-600/30" : "bg-blue-50/50 border border-blue-100"
            }`}
          >
            <p className={`${darkMode ? "text-slate-300" : "text-slate-600"}`}>
              {t("Nenhuma pergunta encontrada para")} "{searchQuery}". {t("Tente outra busca.")}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredFAQs.map((faq, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg ${
                  darkMode ? "bg-slate-700/30 border border-slate-600/30" : "bg-blue-50/50 border border-blue-100"
                }`}
              >
                <h3 className={`font-medium mb-2 ${darkMode ? "text-white" : "text-slate-800"}`}>{faq.question}</h3>
                <p className={`text-sm ${darkMode ? "text-slate-300" : "text-slate-600"}`}>{faq.answer}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}