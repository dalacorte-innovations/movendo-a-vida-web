import { useState, useContext } from "react"
import { ThemeContext } from "../../utils/ThemeContext.jsx"
import { FaCheck, FaPlay, FaBook, FaVideo, FaFileAlt, FaArrowRight, FaCheckCircle } from "react-icons/fa"

export default function TutorialsPage() {
  const { darkMode } = useContext(ThemeContext)
  const [activeTab, setActiveTab] = useState("getting-started")

  const tutorials = {
    "getting-started": [
      {
        id: 1,
        title: "Bem-vindo à Plataforma",
        description: "Conheça os recursos básicos e como navegar pela plataforma",
        duration: "3 min",
        type: "video",
        completed: true,
      },
      {
        id: 2,
        title: "Configurando seu Perfil",
        description: "Aprenda a personalizar seu perfil e definir suas preferências",
        duration: "5 min",
        type: "article",
        completed: true,
      },
      {
        id: 3,
        title: "Criando seu Primeiro Plano",
        description: "Passo a passo para criar seu plano de vida personalizado",
        duration: "8 min",
        type: "interactive",
        completed: false,
      },
      {
        id: 4,
        title: "Entendendo o Dashboard",
        description: "Guia completo sobre as métricas e visualizações do seu dashboard",
        duration: "6 min",
        type: "video",
        completed: false,
      },
    ],
    "financial-planning": [
      {
        id: 5,
        title: "Fundamentos do Planejamento Financeiro",
        description: "Conceitos básicos para organizar suas finanças pessoais",
        duration: "10 min",
        type: "video",
        completed: true,
      },
      {
        id: 6,
        title: "Definindo Metas Financeiras",
        description: "Como estabelecer metas financeiras realistas e alcançáveis",
        duration: "7 min",
        type: "article",
        completed: false,
      },
      {
        id: 7,
        title: "Estratégias de Economia",
        description: "Técnicas práticas para economizar dinheiro no dia a dia",
        duration: "12 min",
        type: "interactive",
        completed: false,
      },
      {
        id: 8,
        title: "Investimentos para Iniciantes",
        description: "Introdução ao mundo dos investimentos para quem está começando",
        duration: "15 min",
        type: "video",
        completed: false,
      },
    ],
    "ai-features": [
      {
        id: 9,
        title: "Introdução à IA da Plataforma",
        description: "Conheça os recursos de inteligência artificial disponíveis",
        duration: "5 min",
        type: "video",
        completed: false,
      },
      {
        id: 10,
        title: "Conversando com o Assistente Virtual",
        description: "Como aproveitar ao máximo o assistente de IA",
        duration: "8 min",
        type: "interactive",
        completed: false,
      },
      {
        id: 11,
        title: "Análises Preditivas",
        description: "Entenda como a IA pode prever tendências financeiras",
        duration: "10 min",
        type: "article",
        completed: false,
      },
      {
        id: 12,
        title: "Recomendações Personalizadas",
        description: "Como a IA personaliza recomendações baseadas no seu perfil",
        duration: "7 min",
        type: "video",
        completed: false,
      },
    ],
    advanced: [
      {
        id: 13,
        title: "Estratégias Avançadas de Planejamento",
        description: "Técnicas sofisticadas para otimizar seu plano de vida",
        duration: "15 min",
        type: "video",
        completed: false,
      },
      {
        id: 14,
        title: "Integração com Outras Ferramentas",
        description: "Como conectar a plataforma com outras ferramentas financeiras",
        duration: "9 min",
        type: "article",
        completed: false,
      },
      {
        id: 15,
        title: "Análise de Dados Financeiros",
        description: "Aprenda a interpretar e utilizar dados financeiros complexos",
        duration: "12 min",
        type: "interactive",
        completed: false,
      },
      {
        id: 16,
        title: "Planejamento de Aposentadoria",
        description: "Estratégias de longo prazo para uma aposentadoria tranquila",
        duration: "18 min",
        type: "video",
        completed: false,
      },
    ],
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case "video":
        return <FaVideo className="h-4 w-4" />
      case "article":
        return <FaFileAlt className="h-4 w-4" />
      case "interactive":
        return <FaPlay className="h-4 w-4" />
      default:
        return <FaBook className="h-4 w-4" />
    }
  }

  const getCompletedCount = (category) => {
    return tutorials[category].filter((tutorial) => tutorial.completed).length
  }

  const getTotalCount = (category) => {
    return tutorials[category].length
  }

  const getProgressPercentage = (category) => {
    return (getCompletedCount(category) / getTotalCount(category)) * 100
  }

  return (
    <div className={`min-h-screen ${darkMode ? "bg-slate-900" : "bg-slate-50"}`}>
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-8">
          <h1 className={`text-3xl font-bold ${darkMode ? "text-white" : "text-slate-800"}`}>Tutoriais e Guias</h1>
          <p className={`mt-2 ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
            Aprenda a utilizar todas as funcionalidades da plataforma com nossos tutoriais interativos
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <div className={`rounded-lg shadow-md overflow-hidden ${darkMode ? "bg-slate-800" : "bg-white"}`}>
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className={`text-xl font-semibold ${darkMode ? "text-white" : "text-slate-800"}`}>Seu Progresso</h2>
                <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}>Acompanhe seu aprendizado</p>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <div className="flex justify-between mb-1 text-sm">
                    <span className={darkMode ? "text-slate-300" : "text-slate-600"}>Primeiros Passos</span>
                    <span className={darkMode ? "text-slate-300" : "text-slate-600"}>
                      {getCompletedCount("getting-started")}/{getTotalCount("getting-started")}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${getProgressPercentage("getting-started")}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1 text-sm">
                    <span className={darkMode ? "text-slate-300" : "text-slate-600"}>Planejamento Financeiro</span>
                    <span className={darkMode ? "text-slate-300" : "text-slate-600"}>
                      {getCompletedCount("financial-planning")}/{getTotalCount("financial-planning")}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${getProgressPercentage("financial-planning")}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1 text-sm">
                    <span className={darkMode ? "text-slate-300" : "text-slate-600"}>Recursos de IA</span>
                    <span className={darkMode ? "text-slate-300" : "text-slate-600"}>
                      {getCompletedCount("ai-features")}/{getTotalCount("ai-features")}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${getProgressPercentage("ai-features")}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1 text-sm">
                    <span className={darkMode ? "text-slate-300" : "text-slate-600"}>Avançado</span>
                    <span className={darkMode ? "text-slate-300" : "text-slate-600"}>
                      {getCompletedCount("advanced")}/{getTotalCount("advanced")}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${getProgressPercentage("advanced")}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <button className={`w-full py-2 px-4 rounded-md ${darkMode ? "bg-slate-700 hover:bg-slate-600 text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-800"}`}>
                  Ver Certificados
                </button>
              </div>
            </div>

            <div className={`rounded-lg shadow-md overflow-hidden ${darkMode ? "bg-slate-800" : "bg-white"}`}>
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className={`text-xl font-semibold ${darkMode ? "text-white" : "text-slate-800"}`}>Recomendados para Você</h2>
                <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}>Baseado no seu perfil</p>
              </div>
              <div className="p-4 space-y-4">
                <div className="space-y-3">
                  {[
                    tutorials["getting-started"][2],
                    tutorials["financial-planning"][1],
                    tutorials["ai-features"][0],
                  ].map((tutorial) => (
                    <div key={tutorial.id} className="flex items-start space-x-3">
                      <div
                        className={`p-2 rounded-md ${
                          tutorial.type === "video"
                            ? "bg-blue-500/10 text-blue-500"
                            : tutorial.type === "article"
                              ? "bg-purple-500/10 text-purple-500"
                              : "bg-amber-500/10 text-amber-500"
                        }`}
                      >
                        {getTypeIcon(tutorial.type)}
                      </div>
                      <div>
                        <h4 className={`text-sm font-medium ${darkMode ? "text-white" : "text-slate-800"}`}>{tutorial.title}</h4>
                        <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>{tutorial.duration}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-6">
            <div>
              <div className="flex border-b border-gray-200 dark:border-gray-700">
                <button
                  className={`py-2 px-4 font-medium ${
                    activeTab === "getting-started"
                      ? `${darkMode ? "text-white border-b-2 border-blue-500" : "text-slate-800 border-b-2 border-blue-500"}`
                      : `${darkMode ? "text-slate-400" : "text-slate-600"}`
                  }`}
                  onClick={() => setActiveTab("getting-started")}
                >
                  Primeiros Passos
                </button>
                <button
                  className={`py-2 px-4 font-medium ${
                    activeTab === "financial-planning"
                      ? `${darkMode ? "text-white border-b-2 border-blue-500" : "text-slate-800 border-b-2 border-blue-500"}`
                      : `${darkMode ? "text-slate-400" : "text-slate-600"}`
                  }`}
                  onClick={() => setActiveTab("financial-planning")}
                >
                  Planejamento Financeiro
                </button>
                <button
                  className={`py-2 px-4 font-medium ${
                    activeTab === "ai-features"
                      ? `${darkMode ? "text-white border-b-2 border-blue-500" : "text-slate-800 border-b-2 border-blue-500"}`
                      : `${darkMode ? "text-slate-400" : "text-slate-600"}`
                  }`}
                  onClick={() => setActiveTab("ai-features")}
                >
                  Recursos de IA
                </button>
                <button
                  className={`py-2 px-4 font-medium ${
                    activeTab === "advanced"
                      ? `${darkMode ? "text-white border-b-2 border-blue-500" : "text-slate-800 border-b-2 border-blue-500"}`
                      : `${darkMode ? "text-slate-400" : "text-slate-600"}`
                  }`}
                  onClick={() => setActiveTab("advanced")}
                >
                  Avançado
                </button>
              </div>

              <div className="mt-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tutorials[activeTab].map((tutorial) => (
                    <div 
                      key={tutorial.id} 
                      className={`rounded-lg shadow-md overflow-hidden ${darkMode ? "bg-slate-800" : "bg-white"} ${tutorial.completed ? "border-2 border-green-500/50" : ""}`}
                    >
                      <div className="p-4 pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <span
                              className={`inline-block mb-2 px-2 py-1 text-xs font-semibold rounded-full ${
                                tutorial.type === "video"
                                  ? "bg-blue-500/10 text-blue-500"
                                  : tutorial.type === "article"
                                    ? "bg-purple-500/10 text-purple-500"
                                    : "bg-amber-500/10 text-amber-500"
                              }`}
                            >
                              <div className="flex items-center">
                                {getTypeIcon(tutorial.type)}
                                <span className="ml-1 capitalize">{tutorial.type}</span>
                              </div>
                            </span>
                            <h3 className={`text-lg font-semibold flex items-center ${darkMode ? "text-white" : "text-slate-800"}`}>
                              {tutorial.title}
                              {tutorial.completed && <FaCheckCircle className="h-4 w-4 text-green-500 ml-2" />}
                            </h3>
                          </div>
                          <div className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>{tutorial.duration}</div>
                        </div>
                        <p className={`text-sm ${darkMode ? "text-slate-300" : "text-slate-600"}`}>{tutorial.description}</p>
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-center">
                          <div className="text-sm">
                            {tutorial.completed ? (
                              <span className="flex items-center text-green-500">
                                <FaCheck className="h-4 w-4 mr-1" />
                                Concluído
                              </span>
                            ) : (
                              <span className={darkMode ? "text-slate-400" : "text-slate-500"}>Não iniciado</span>
                            )}
                          </div>
                          <button className={`px-4 py-2 rounded-md text-sm flex items-center ${darkMode ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-blue-500 hover:bg-blue-600 text-white"}`}>
                            {tutorial.completed ? "Revisar" : "Iniciar"}
                            <FaArrowRight className="h-4 w-4 ml-2" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className={`rounded-lg shadow-md overflow-hidden ${darkMode ? "bg-slate-800" : "bg-white"}`}>
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className={`text-xl font-semibold ${darkMode ? "text-white" : "text-slate-800"}`}>Precisa de Ajuda?</h2>
                <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}>Recursos adicionais para seu aprendizado</p>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className={`rounded-lg shadow-sm overflow-hidden ${darkMode ? "bg-slate-700" : "bg-white border border-slate-200"}`}>
                    <div className="p-4 flex flex-col items-center text-center">
                      <div className={`p-3 rounded-full ${darkMode ? "bg-blue-900/30" : "bg-blue-100"} mb-3`}>
                        <FaVideo className={darkMode ? "text-blue-400" : "text-blue-600"} />
                      </div>
                      <h3 className={`font-medium mb-1 ${darkMode ? "text-white" : "text-slate-800"}`}>Webinars ao Vivo</h3>
                      <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Participe de sessões ao vivo com especialistas</p>
                      <button className={`mt-2 text-sm ${darkMode ? "text-blue-400" : "text-blue-600"}`}>
                        Ver Agenda
                      </button>
                    </div>
                  </div>
                  <div className={`rounded-lg shadow-sm overflow-hidden ${darkMode ? "bg-slate-700" : "bg-white border border-slate-200"}`}>
                    <div className="p-4 flex flex-col items-center text-center">
                      <div className={`p-3 rounded-full ${darkMode ? "bg-purple-900/30" : "bg-purple-100"} mb-3`}>
                        <FaBook className={darkMode ? "text-purple-400" : "text-purple-600"} />
                      </div>
                      <h3 className={`font-medium mb-1 ${darkMode ? "text-white" : "text-slate-800"}`}>Biblioteca de Recursos</h3>
                      <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Acesse artigos, e-books e guias detalhados</p>
                      <button className={`mt-2 text-sm ${darkMode ? "text-purple-400" : "text-purple-600"}`}>
                        Explorar Biblioteca
                      </button>
                    </div>
                  </div>
                  <div className={`rounded-lg shadow-sm overflow-hidden ${darkMode ? "bg-slate-700" : "bg-white border border-slate-200"}`}>
                    <div className="p-4 flex flex-col items-center text-center">
                      <div className={`p-3 rounded-full ${darkMode ? "bg-amber-900/30" : "bg-amber-100"} mb-3`}>
                        <FaPlay className={darkMode ? "text-amber-400" : "text-amber-600"} />
                      </div>
                      <h3 className={`font-medium mb-1 ${darkMode ? "text-white" : "text-slate-800"}`}>Tutoriais em Vídeo</h3>
                      <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Assista a tutoriais passo a passo em vídeo</p>
                      <button className={`mt-2 text-sm ${darkMode ? "text-amber-400" : "text-amber-600"}`}>
                        Ver Canal
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
