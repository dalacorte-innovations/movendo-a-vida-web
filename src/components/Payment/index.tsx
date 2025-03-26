"use client"

import { useContext } from "react"
import { toast } from "react-toastify"
import { getToken } from "../../utils/storage"
import { ThemeContext } from "../../utils/ThemeContext.jsx"
import { useTranslation } from "react-i18next"
import { IoCheckmarkCircle, IoCloseCircle, IoCardOutline, IoShieldCheckmarkOutline } from "react-icons/io5"

const PaymentModal = ({ selectedPlan, onClose }) => {
  const { darkMode } = useContext(ThemeContext)
  const { t } = useTranslation()

  const handlePayment = () => {
    const token = getToken()

    if (!token) {
      toast.error(t("Você precisa se logar primeiro para realizar o pagamento."))
      return
    }

    let paymentLink = ""

    switch (selectedPlan.title) {
      case "Profissional":
        paymentLink = "https://buy.stripe.com/test_5kAg2P6YF4bOd4k002"
        break
      case "Avançado":
        paymentLink = "https://buy.stripe.com/test_8wM4k72Ip5fS8O4eUV"
        break
      case "Iniciante":
        paymentLink = "https://buy.stripe.com/test_14k3g382JgYA1lC6oo"
        break
      default:
        console.error(t("Plano desconhecido"))
        return
    }

    window.location.href = paymentLink
  }

  // Get color classes based on plan type
  const getPlanColorClasses = () => {
    const colorMap = {
      Iniciante: {
        gradient: darkMode ? "from-emerald-600 to-teal-600" : "from-emerald-500 to-teal-500",
        bg: darkMode ? "bg-emerald-900/30" : "bg-emerald-100",
        text: darkMode ? "text-emerald-400" : "text-emerald-600",
        border: darkMode ? "border-emerald-800/30" : "border-emerald-200",
      },
      Avançado: {
        gradient: darkMode ? "from-blue-600 to-indigo-600" : "from-blue-500 to-indigo-500",
        bg: darkMode ? "bg-blue-900/30" : "bg-blue-100",
        text: darkMode ? "text-blue-400" : "text-blue-600",
        border: darkMode ? "border-blue-800/30" : "border-blue-200",
      },
      Profissional: {
        gradient: darkMode ? "from-amber-600 to-orange-600" : "from-amber-500 to-orange-500",
        bg: darkMode ? "bg-amber-900/30" : "bg-amber-100",
        text: darkMode ? "text-amber-400" : "text-amber-600",
        border: darkMode ? "border-amber-800/30" : "border-amber-200",
      },
    }

    return (
      colorMap[selectedPlan.title] ||
      (darkMode
        ? {
            gradient: "from-pink-600 to-purple-600",
            bg: "bg-pink-900/30",
            text: "text-pink-400",
            border: "border-pink-800/30",
          }
        : {
            gradient: "from-blue-600 to-indigo-600",
            bg: "bg-blue-100",
            text: "text-blue-600",
            border: "border-blue-200",
          })
    )
  }

  const colorClasses = getPlanColorClasses()

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="absolute inset-0 bg-black/60" onClick={onClose}></div>

      <div
        className={`relative w-full max-w-4xl mx-auto overflow-hidden rounded-2xl shadow-2xl ${
          darkMode ? "bg-slate-800/95 border border-slate-700/50" : "bg-white/95 border border-blue-100"
        } backdrop-blur-md flex flex-col md:flex-row max-h-[90vh] z-10`}
      >
        {/* Left side - Plan details */}
        <div
          className={`w-full md:w-1/2 p-6 md:p-8 flex flex-col ${
            darkMode
              ? "border-b md:border-b-0 md:border-r border-slate-700/50"
              : "border-b md:border-b-0 md:border-r border-blue-100"
          }`}
        >
          <button
            className={`self-start mb-6 flex items-center ${
              darkMode ? "text-slate-300 hover:text-white" : "text-slate-600 hover:text-slate-800"
            } transition-colors`}
            onClick={onClose}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            {t("Voltar")}
          </button>

          <div className="flex flex-col items-center text-center mb-6">
            <h3 className={`text-2xl font-bold mb-2 ${darkMode ? "text-white" : "text-slate-800"}`}>
              {t("Plano selecionado")}
            </h3>
            <p className={`text-sm mb-6 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
              {t(selectedPlan.description)}
            </p>
          </div>

          <div
            className={`relative overflow-hidden rounded-xl ${colorClasses.bg} ${colorClasses.border} border p-6 mb-6 flex-grow`}
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${colorClasses.bg} mr-3`}>
                  {selectedPlan.icon && <selectedPlan.icon className={`text-xl ${colorClasses.text}`} />}
                </div>
                <h4 className={`text-xl font-bold ${darkMode ? "text-white" : "text-slate-800"}`}>
                  {t(selectedPlan.title)}
                </h4>
              </div>

              {selectedPlan.popular && (
                <span
                  className={`text-xs py-1 px-3 rounded-full ${
                    darkMode
                      ? "bg-pink-900/50 text-pink-300 border border-pink-800/30"
                      : "bg-blue-100 text-blue-700 border border-blue-200"
                  }`}
                >
                  {t("Mais popular")}
                </span>
              )}
            </div>

            <div className={`text-3xl font-bold mb-4 ${colorClasses.text}`}>
              {selectedPlan.price}
              <span className={`text-sm font-normal ml-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                /{t("mês")}
              </span>
            </div>

            <div className={`space-y-3 mb-6 ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
              {selectedPlan.features.map((feature, index) => (
                <div key={index} className="flex items-center">
                  {selectedPlan.availableFeatures[index] ? (
                    <IoCheckmarkCircle
                      className={`flex-shrink-0 mr-2 ${darkMode ? "text-emerald-400" : "text-emerald-600"}`}
                    />
                  ) : (
                    <IoCloseCircle className={`flex-shrink-0 mr-2 ${darkMode ? "text-slate-500" : "text-slate-400"}`} />
                  )}
                  <span className={`text-sm ${!selectedPlan.availableFeatures[index] && "opacity-60"}`}>
                    {t(feature)}
                  </span>
                </div>
              ))}
            </div>

            <div className={`pt-4 border-t ${darkMode ? "border-slate-700/50" : "border-slate-200"}`}>
              <div className="flex justify-between text-sm mb-2">
                <span className={darkMode ? "text-slate-400" : "text-slate-500"}>{t("Subtotal")}</span>
                <span className={darkMode ? "text-white font-medium" : "text-slate-800 font-medium"}>
                  {selectedPlan.price}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className={darkMode ? "text-slate-400" : "text-slate-500"}>{t("Taxas")}</span>
                <span className={darkMode ? "text-white font-medium" : "text-slate-800 font-medium"}>
                  {t("Incluídas")}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Payment options */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col">
          <div className="text-center mb-6">
            <h3 className={`text-2xl font-bold mb-2 ${darkMode ? "text-white" : "text-slate-800"}`}>
              {t("Realizar pagamento")}
            </h3>
            <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
              {t("Escolha seu método de pagamento preferido")}
            </p>
          </div>

          <div
            className={`mb-6 p-4 rounded-lg ${
              darkMode ? "bg-slate-700/50 border border-slate-600/50" : "bg-slate-50 border border-slate-200"
            }`}
          >
            <div className="flex items-center mb-4">
              <IoCardOutline className={`text-xl mr-2 ${colorClasses.text}`} />
              <span className={`font-medium ${darkMode ? "text-white" : "text-slate-800"}`}>
                {t("Pagamento seguro")}
              </span>
            </div>
            <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
              {t(
                "Seus dados de pagamento são processados com segurança pela Stripe, uma plataforma líder em pagamentos online.",
              )}
            </p>
          </div>

          <div className="flex-grow flex flex-col justify-between">
            <div className="space-y-4">
              <div
                className={`p-4 rounded-lg border ${
                  darkMode ? "bg-slate-700/30 border-slate-600/50" : "bg-white border-slate-200"
                } cursor-pointer`}
              >
                <div className="flex items-center">
                  <div
                    className={`w-5 h-5 rounded-full border-2 ${
                      darkMode ? "border-pink-500" : "border-blue-500"
                    } flex items-center justify-center mr-3`}
                  >
                    <div className={`w-2.5 h-2.5 rounded-full ${darkMode ? "bg-pink-500" : "bg-blue-500"}`}></div>
                  </div>
                  <span className={`${darkMode ? "text-white" : "text-slate-800"}`}>{t("Cartão de crédito")}</span>
                </div>
              </div>

              <div
                className={`p-4 rounded-lg border ${
                  darkMode ? "bg-slate-700/30 border-slate-600/50" : "bg-white border-slate-200"
                } cursor-pointer opacity-60`}
              >
                <div className="flex items-center">
                  <div
                    className={`w-5 h-5 rounded-full border-2 ${
                      darkMode ? "border-slate-500" : "border-slate-300"
                    } mr-3`}
                  ></div>
                  <span className={`${darkMode ? "text-white" : "text-slate-800"}`}>{t("Boleto bancário")}</span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center mb-4">
                <IoShieldCheckmarkOutline
                  className={`text-lg mr-2 ${darkMode ? "text-emerald-400" : "text-emerald-600"}`}
                />
                <span className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                  {t("Garantia de 7 dias ou seu dinheiro de volta")}
                </span>
              </div>

              <button
                onClick={handlePayment}
                className={`w-full py-3.5 px-4 rounded-xl font-medium text-white group relative overflow-hidden transition-all duration-300`}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${colorClasses.gradient} transition-transform duration-300 group-hover:scale-105`}
                ></div>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-white transition-opacity duration-300"></div>
                <span className="relative z-10">{t("Finalizar pagamento")}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentModal