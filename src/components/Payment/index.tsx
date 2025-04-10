import React from "react"
"use client"

import { useContext, useState, useEffect } from "react"
import { toast } from "react-toastify"
import { getToken } from "../../utils/storage"
import { ThemeContext } from "../../utils/ThemeContext.jsx"
import { useTranslation } from "react-i18next"
import {
  IoCheckmarkCircle,
  IoCloseCircle,
  IoCardOutline,
  IoShieldCheckmarkOutline,
  IoInformationCircleOutline,
  IoChevronBack,
  IoChevronForward,
} from "react-icons/io5"
import { configBackendConnection, endpoints, getAuthHeaders } from "../../utils/backendConnection"
import ComparisonTableModal from "../../components/Comparative/index.tsx"

const PaymentModal = ({ selectedPlan, allPlans, onClose, onSelectPlan }) => {
  const { darkMode } = useContext(ThemeContext)
  const { t } = useTranslation()

  const [acceptTermsAndPrivacy, setAcceptTermsAndPrivacy] = useState(false)
  const [showTermsModal, setShowTermsModal] = useState(false)
  const [showComparisonTable, setShowComparisonTable] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [activeTab, setActiveTab] = useState("details")

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)

    return () => {
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [])

  const submitTermsAcceptance = async () => {
    try {
      setIsLoading(true)

      const url = `${configBackendConnection.baseURL}/${endpoints.acceptTermsAndPrivacy}`

      const response = await fetch(url, {
        method: "POST",
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accept_terms: true,
          accept_privacy: true,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        toast.error(errorData.error || t("Falha ao enviar aceitação dos termos"))
        return false
      }

      toast.success(t("Termos aceitos com sucesso!"))
      return true
    } catch (error) {
      console.error(error)
      toast.error(t("Erro ao aceitar os termos. Tente novamente."))

      setAcceptTermsAndPrivacy(false)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const handleTermsAndPrivacyChange = async (checked) => {
    if (checked) {
      setAcceptTermsAndPrivacy(true)
      await submitTermsAcceptance()
    } else {
      setAcceptTermsAndPrivacy(false)
    }
  }

  const handleAcceptTerms = async () => {
    const success = await submitTermsAcceptance()
    if (success) {
      setAcceptTermsAndPrivacy(true)
      setShowTermsModal(false)
    }
  }

  const handlePayment = () => {
    const token = getToken()

    if (!token) {
      toast.error(t("Você precisa se logar primeiro para realizar o pagamento."))
      return
    }

    if (!acceptTermsAndPrivacy) {
      toast.error(t("Você precisa aceitar os termos e a política de privacidade para continuar."))
      setShowTermsModal(true)
      return
    }

    let paymentLink = ""

    switch (selectedPlan.title) {
      case "Profissional (Coach)":
        paymentLink = "https://buy.stripe.com/test_5kAg2P6YF4bOd4k002"
        break
      case "Avançado":
        paymentLink = "https://buy.stripe.com/test_8wM4k72Ip5fS8O4eUV"
        break
      case "Iniciante":
        paymentLink = "https://buy.stripe.com/test_14k3g382JgYA1lC6oo"
        break
      case "Empresarial":
        paymentLink = "https://buy.stripe.com/test_28o7wj6YF8s4fcs9AB"
        break
      default:
        console.error(t("Plano desconhecido"))
        return
    }

    window.location.href = paymentLink
  }

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
      "Profissional (Coach)": {
        gradient: darkMode ? "from-amber-600 to-orange-600" : "from-amber-500 to-orange-500",
        bg: darkMode ? "bg-amber-900/30" : "bg-amber-100",
        text: darkMode ? "text-amber-400" : "text-amber-600",
        border: darkMode ? "border-amber-800/30" : "border-amber-200",
      },
      Empresarial: {
        gradient: darkMode ? "from-violet-600 to-purple-600" : "from-violet-500 to-purple-500",
        bg: darkMode ? "bg-violet-900/30" : "bg-violet-100",
        text: darkMode ? "text-violet-400" : "text-violet-600",
        border: darkMode ? "border-violet-800/30" : "border-violet-200",
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

  const hasMoreExpensivePlans = () => {
    const currentIndex = allPlans.findIndex((plan) => plan.title === selectedPlan.title)
    return currentIndex < allPlans.length - 1
  }

  const renderPlanDetails = () => (
    <div className={`w-full h-full flex flex-col ${isMobile && activeTab !== "details" ? "hidden" : ""}`}>
      <button
        className={`self-start mb-4 flex items-center ${
          darkMode ? "text-slate-300 hover:text-white" : "text-slate-600 hover:text-slate-800"
        } transition-colors`}
        onClick={onClose}
      >
        <IoChevronBack className="h-5 w-5 mr-1" />
        {t("Voltar")}
      </button>

      <div className="flex flex-col items-center text-center mb-4">
        <h3 className={`text-xl font-bold mb-2 ${darkMode ? "text-white" : "text-slate-800"}`}>
          {t("Plano selecionado")}
        </h3>
        <p className={`text-sm mb-4 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
          {t(selectedPlan.description)}
        </p>
      </div>

      <div
        className={`relative overflow-hidden rounded-xl ${colorClasses.bg} ${colorClasses.border} border p-4 mb-4 flex-grow flex flex-col`}
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
            {selectedPlan.paymentType}
          </span>
        </div>

        <div className="flex-grow overflow-y-auto mb-4 pr-2 custom-scrollbar">
          <div className={`space-y-3 ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
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
        </div>

        {hasMoreExpensivePlans() && (
          <button
            onClick={() => setShowComparisonTable(true)}
            className={`w-full py-2 px-4 mb-4 rounded-lg text-sm font-medium flex items-center justify-center ${
              darkMode
                ? "bg-slate-700 text-slate-300 hover:bg-slate-600"
                : "bg-slate-200 text-slate-700 hover:bg-slate-300"
            }`}
          >
            <IoInformationCircleOutline className="mr-2" />
            {t("Ver comparação com outros planos")}
          </button>
        )}

        <div className={`pt-4 border-t ${darkMode ? "border-slate-700/50" : "border-slate-200"}`}>
          <div className="flex justify-between text-sm mb-2">
            <span className={darkMode ? "text-slate-400" : "text-slate-500"}>{t("Subtotal")}</span>
            <span className={darkMode ? "text-white font-medium" : "text-slate-800 font-medium"}>
              {selectedPlan.price}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className={darkMode ? "text-slate-400" : "text-slate-500"}>{t("Taxas")}</span>
            <span className={darkMode ? "text-white font-medium" : "text-slate-800 font-medium"}>{t("Incluídas")}</span>
          </div>
        </div>

        {isMobile && (
          <button
            onClick={() => setActiveTab("payment")}
            className={`w-full mt-6 py-3.5 px-4 rounded-xl font-medium text-white group relative overflow-hidden transition-all duration-300`}
          >
            <div
              className={`absolute inset-0 bg-gradient-to-r ${colorClasses.gradient} transition-transform duration-300 group-hover:scale-105`}
            ></div>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-white transition-opacity duration-300"></div>
            <span className="relative z-10 flex items-center justify-center">
              {t("Continuar para pagamento")}
              <IoChevronForward className="ml-1" />
            </span>
          </button>
        )}
      </div>
    </div>
  )

  const renderPaymentOptions = () => (
    <div className={`w-full h-full flex flex-col ${isMobile && activeTab !== "payment" ? "hidden" : ""}`}>
      {isMobile && (
        <button
          className={`self-start mb-4 flex items-center ${
            darkMode ? "text-slate-300 hover:text-white" : "text-slate-600 hover:text-slate-800"
          } transition-colors`}
          onClick={() => setActiveTab("details")}
        >
          <IoChevronBack className="h-5 w-5 mr-1" />
          {t("Voltar para detalhes")}
        </button>
      )}

      <div className="text-center mb-4">
        <h3 className={`text-xl font-bold mb-2 ${darkMode ? "text-white" : "text-slate-800"}`}>
          {t("Realizar pagamento")}
        </h3>
        <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
          {t("Escolha seu método de pagamento preferido")}
        </p>
      </div>

      <div
        className={`mb-4 p-4 rounded-lg ${
          darkMode ? "bg-slate-700/50 border border-slate-600/50" : "bg-slate-50 border border-slate-200"
        }`}
      >
        <div className="flex items-center mb-4">
          <IoCardOutline className={`text-xl mr-2 ${colorClasses.text}`} />
          <span className={`font-medium ${darkMode ? "text-white" : "text-slate-800"}`}>{t("Pagamento seguro")}</span>
        </div>
        <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
          {t(
            "Seus dados de pagamento são processados com segurança pela Stripe, uma plataforma líder em pagamentos online.",
          )}
        </p>
      </div>

      <div className="flex-grow flex flex-col">
        <div className="space-y-4 mb-6">
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
                className={`w-5 h-5 rounded-full border-2 ${darkMode ? "border-slate-500" : "border-slate-300"} mr-3`}
              ></div>
              <span className={`${darkMode ? "text-white" : "text-slate-800"}`}>{t("Boleto bancário")}</span>
            </div>
          </div>
        </div>

        <div className="mt-auto">
          <div className="flex items-center mb-4">
            <IoShieldCheckmarkOutline
              className={`text-lg mr-2 ${darkMode ? "text-emerald-400" : "text-emerald-600"}`}
            />
            <span className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
              {t("Garantia de 7 dias ou seu dinheiro de volta")}
            </span>
          </div>

          <div
            className={`mb-4 p-4 rounded-lg ${darkMode ? "bg-slate-700/30" : "bg-slate-50"} border ${darkMode ? "border-slate-600/50" : "border-slate-200"}`}
          >
            <div className="flex items-start">
              <input
                type="checkbox"
                id="termsAndPrivacy"
                checked={acceptTermsAndPrivacy}
                onChange={(e) => handleTermsAndPrivacyChange(e.target.checked)}
                className={`mr-2 mt-1 h-4 w-4 rounded ${darkMode ? "bg-slate-700 border-slate-500" : "bg-white border-slate-300"}`}
                disabled={isLoading}
              />
              <label htmlFor="termsAndPrivacy" className={`text-sm ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                {t("Aceito os ")}
                <button
                  type="button"
                  onClick={() => setShowTermsModal(true)}
                  className={`${darkMode ? "text-pink-400" : "text-blue-600"} underline hover:opacity-80`}
                >
                  {t("Termos e Condições de Uso")}
                </button>
                {" & "}
                <button
                  type="button"
                  onClick={() => setShowTermsModal(true)}
                  className={`${darkMode ? "text-pink-400" : "text-blue-600"} underline hover:opacity-80`}
                >
                  {t("Política de Privacidade")}
                </button>
              </label>
            </div>
          </div>

          <button
            onClick={handlePayment}
            disabled={!acceptTermsAndPrivacy || isLoading}
            className={`w-full py-3.5 px-4 rounded-xl font-medium text-white group relative overflow-hidden transition-all duration-300 ${!acceptTermsAndPrivacy || isLoading ? "opacity-70" : ""}`}
          >
            <div
              className={`absolute inset-0 bg-gradient-to-r ${colorClasses.gradient} transition-transform duration-300 group-hover:scale-105`}
            ></div>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-white transition-opacity duration-300"></div>
            <span className="relative z-10">{isLoading ? t("Processando...") : t("Finalizar pagamento")}</span>
          </button>
        </div>
      </div>
    </div>
  )

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
        <div
          className={`w-full md:w-1/2 p-4 md:p-6 flex flex-col overflow-auto ${
            darkMode
              ? "border-b md:border-b-0 md:border-r border-slate-700/50"
              : "border-b md:border-b-0 md:border-r border-blue-100"
          }`}
        >
          {renderPlanDetails()}
        </div>

        <div className="w-full md:w-1/2 p-4 md:p-6 flex flex-col overflow-auto">{renderPaymentOptions()}</div>
      </div>

      {showTermsModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="absolute inset-0 bg-black/70" onClick={() => setShowTermsModal(false)}></div>

          <div
            className={`relative w-full max-w-4xl max-h-[90vh] overflow-auto rounded-2xl shadow-2xl ${
              darkMode ? "bg-slate-800/95 border border-slate-700/50" : "bg-white/95 border border-blue-100"
            } backdrop-blur-md flex flex-col z-10`}
          >
            <div className="p-4 md:p-6 border-b border-slate-700/50 flex justify-between items-center">
              <h3 className={`text-xl font-bold ${darkMode ? "text-white" : "text-slate-800"}`}>
                {t("Termos e Política de Privacidade")}
              </h3>
              <button
                onClick={() => setShowTermsModal(false)}
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

            <div className="flex-1 overflow-auto p-4 md:p-6">
              <div className="mb-8">
                <h4 className={`text-lg font-bold mb-4 ${darkMode ? "text-white" : "text-slate-800"}`}>
                  {t("Termos e Condições de Uso")}
                </h4>
                <div
                  className={`text-sm ${darkMode ? "text-slate-300" : "text-slate-600"} space-y-4 max-h-[30vh] overflow-y-auto p-4 border ${darkMode ? "border-slate-700/50" : "border-slate-200"} rounded-lg custom-scrollbar`}
                >
                  <p className="font-semibold text-center">Movendo a Vida para Mudar o Futuro</p>
                  <p className="text-xs text-slate-400 text-center">Última atualização: 09/04/2025</p>

                  <div className="space-y-4">
                    <div>
                      <p className="font-medium">1. Definições</p>
                      <ul className="list-disc pl-5 space-y-1 mt-2">
                        <li>
                          Plataforma: site, cursos, serviços digitais, programas e qualquer outro produto
                          disponibilizado pela Movendo a Vida para Mudar o Futuro.
                        </li>
                        <li>Usuário: qualquer pessoa física ou jurídica que acesse ou utilize a plataforma.</li>
                        <li>
                          Conteúdo: materiais digitais, recursos visuais, textos, áudios, vídeos e ferramentas
                          disponibilizadas.
                        </li>
                      </ul>
                    </div>

                    <div>
                      <p className="font-medium">2. Aceitação dos Termos</p>
                      <p className="mt-2">
                        O uso da plataforma implica aceitação integral e irrestrita destes Termos. Caso não concorde com
                        alguma das cláusulas, recomendamos que não utilize nossos serviços.
                      </p>
                    </div>

                    <div>
                      <p className="font-medium">3. Serviços Oferecidos</p>
                      <p className="mt-1">Oferecemos:</p>
                      <ul className="list-disc pl-5 space-y-1 mt-1">
                        <li>Planos educacionais e programas de desenvolvimento pessoal e profissional.</li>
                        <li>Acesso a conteúdos digitais, com validade conforme o plano contratado.</li>
                        <li>
                          Produtos e soluções voltadas para coaches, incluindo personalizações e licenças múltiplas.
                        </li>
                      </ul>
                    </div>

                    <div>
                      <p className="font-medium">4. Cadastro e Acesso</p>
                      <p className="mt-2">
                        Para acessar áreas restritas ou adquirir produtos, o Usuário deverá fornecer informações
                        verídicas em seu cadastro. O uso de dados falsos ou de terceiros poderá resultar em bloqueio de
                        acesso.
                      </p>
                      <p className="mt-1">
                        O Usuário é responsável por manter a confidencialidade de seu login e senha.
                      </p>
                    </div>

                    <div>
                      <p className="font-medium">5. Propriedade Intelectual</p>
                      <p className="mt-2">
                        Todo o conteúdo da plataforma pertence exclusivamente à Movendo a Vida para Mudar o Futuro e
                        está protegido por direitos autorais, propriedade intelectual e demais legislações aplicáveis. É
                        vedada a reprodução, distribuição, modificação, engenharia reversa, revenda ou qualquer uso
                        indevido, sem autorização expressa e formal.
                      </p>
                    </div>

                    <div>
                      <p className="font-medium">6. Pagamento e Planos</p>
                      <ul className="list-disc pl-5 space-y-1 mt-2">
                        <li>O acesso aos conteúdos está vinculado à confirmação do pagamento.</li>
                        <li>
                          Os preços, prazos de acesso e benefícios estão especificados nas páginas de venda de cada
                          produto ou plano.
                        </li>
                        <li>
                          Planos voltados a profissionais incluem múltiplas licenças, personalizações e posicionamento
                          na plataforma.
                        </li>
                      </ul>
                    </div>

                    <div>
                      <p className="font-medium">7. Política de Cancelamento e Reembolso</p>
                      <p className="mt-2">
                        O Usuário poderá solicitar o cancelamento e reembolso dentro de 7 (sete) dias corridos a partir
                        da data da compra. Após esse prazo, não haverá reembolso, salvo em casos de falha comprovada da
                        plataforma.
                      </p>
                    </div>

                    <div>
                      <p className="font-medium">8. Limitação de Responsabilidade</p>
                      <p className="mt-1">A Movendo a Vida para Mudar o Futuro não se responsabiliza por:</p>
                      <ul className="list-disc pl-5 space-y-1 mt-1">
                        <li>Interrupções temporárias no serviço;</li>
                        <li>Resultados específicos que o Usuário venha a esperar com o uso dos conteúdos;</li>
                        <li>
                          Danos indiretos, lucros cessantes ou perdas decorrentes da utilização dos conteúdos ou da
                          plataforma.
                        </li>
                      </ul>
                      <p className="mt-2">
                        Ao utilizar a plataforma, o Usuário reconhece que todo o conteúdo é disponibilizado com fins
                        educativos e de desenvolvimento, e renuncia a qualquer direito de ajuizamento de ação judicial
                        contra a empresa, por quaisquer expectativas não atendidas, interpretações ou resultados
                        pessoais advindos do uso dos produtos ou serviços.
                      </p>
                    </div>

                    <div>
                      <p className="font-medium">9. Conduta do Usuário</p>
                      <p className="mt-1">O Usuário compromete-se a:</p>
                      <ul className="list-disc pl-5 space-y-1 mt-1">
                        <li>Utilizar a plataforma de maneira ética e legal;</li>
                        <li>Não reproduzir, copiar ou redistribuir os conteúdos;</li>
                        <li>
                          Não praticar qualquer ação que comprometa a segurança, funcionamento ou reputação da
                          plataforma.
                        </li>
                      </ul>
                    </div>

                    <div>
                      <p className="font-medium">10. Alterações nos Termos e na Plataforma</p>
                      <p className="mt-2">
                        A Movendo a Vida para Mudar o Futuro poderá, a qualquer momento, alterar estes Termos e
                        Condições, bem como seus produtos, serviços ou funcionalidades.
                      </p>
                    </div>

                    <div>
                      <p className="font-medium">11. Foro</p>
                      <p className="mt-2">
                        Estes Termos são regidos pelas leis brasileiras. Fica eleito o foro da comarca de São Paulo-SP.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className={`text-lg font-bold mb-4 ${darkMode ? "text-white" : "text-slate-800"}`}>
                  {t("Política de Privacidade")}
                </h4>
                <div
                  className={`text-sm ${darkMode ? "text-slate-300" : "text-slate-600"} space-y-4 max-h-[30vh] overflow-y-auto p-4 border ${darkMode ? "border-slate-700/50" : "border-slate-200"} rounded-lg custom-scrollbar`}
                >
                  <p className="font-semibold text-center">Movendo a Vida para Mudar o Futuro</p>
                  <p className="text-xs text-slate-400 text-center">Última atualização: 09/04/2025</p>

                  <div className="space-y-4">
                    <div>
                      <p className="font-medium">1. Quais dados coletamos</p>
                      <ul className="list-disc pl-5 space-y-1 mt-2">
                        <li>Nome completo, e-mail, telefone, CPF (quando necessário);</li>
                        <li>Informações de acesso e uso da plataforma;</li>
                        <li>Dados de pagamento (processados por empresas terceiras e seguras).</li>
                      </ul>
                    </div>

                    <div>
                      <p className="font-medium">2. Para que usamos os dados</p>
                      <ul className="list-disc pl-5 space-y-1 mt-2">
                        <li>Gerar acesso aos produtos;</li>
                        <li>Comunicar novidades e atualizações;</li>
                        <li>Cumprir obrigações legais e contratuais;</li>
                        <li>Melhorar a experiência do usuário.</li>
                      </ul>
                    </div>

                    <div>
                      <p className="font-medium">3. Compartilhamento</p>
                      <p className="mt-2">
                        Apenas com parceiros operacionais essenciais (ex: sistemas de pagamento e hospedagem). Nunca
                        vendemos ou compartilhamos seus dados com terceiros para fins comerciais.
                      </p>
                    </div>

                    <div>
                      <p className="font-medium">4. Segurança</p>
                      <p className="mt-2">
                        Utilizamos medidas de segurança para proteger seus dados contra acesso não autorizado.
                      </p>
                    </div>

                    <div>
                      <p className="font-medium">5. Seus direitos</p>
                      <p className="mt-1">Você pode solicitar:</p>
                      <ul className="list-disc pl-5 space-y-1 mt-1">
                        <li>Acesso, correção ou exclusão dos seus dados;</li>
                        <li>Revogação de consentimentos;</li>
                        <li>Portabilidade dos dados;</li>
                        <li>
                          Mais informações sobre o tratamento de dados, por meio do contato: [inserir e-mail do DPO].
                        </li>
                      </ul>
                    </div>

                    <div>
                      <p className="font-medium">6. Cookies</p>
                      <p className="mt-2">
                        Utilizamos cookies para funcionalidades essenciais e melhoria da experiência de navegação. Você
                        pode configurar suas preferências no navegador.
                      </p>
                    </div>

                    <div>
                      <p className="font-medium">7. Atualizações</p>
                      <p className="mt-2">
                        Esta política poderá ser modificada a qualquer momento. A nova versão entrará em vigor após sua
                        publicação.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 md:p-6 border-t border-slate-700/50 flex justify-end gap-3">
              <button
                onClick={() => setShowTermsModal(false)}
                className={`px-4 py-2 rounded-lg ${
                  darkMode
                    ? "bg-slate-700 text-slate-200 hover:bg-slate-600"
                    : "bg-slate-200 text-slate-800 hover:bg-slate-300"
                }`}
              >
                {t("Fechar")}
              </button>
              <button
                onClick={handleAcceptTerms}
                disabled={isLoading}
                className={`px-4 py-2 rounded-lg text-white relative overflow-hidden group ${isLoading ? "opacity-70" : ""}`}
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${colorClasses.gradient}`}></div>
                <span className="relative z-10">{isLoading ? t("Processando...") : t("Aceitar Todos")}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {showComparisonTable && (
        <ComparisonTableModal
          selectedPlan={selectedPlan}
          allPlans={allPlans}
          onClose={() => setShowComparisonTable(false)}
          onSelectPlan={onSelectPlan}
        />
      )}
    </div>
  )
}

export default PaymentModal
