import React from 'react'
import { useState, useContext } from "react"
import { ThemeContext } from "../../utils/ThemeContext.jsx"
import { FaHeart, FaShieldAlt, FaUsers, FaLightbulb, FaBullseye, FaLeaf, FaChartBar, FaLock } from "react-icons/fa"

export default function PrinciplesPage() {
  const { darkMode } = useContext(ThemeContext)
  const [activeTab, setActiveTab] = useState("principles")

  const principles = [
    {
      id: "transparency",
      icon: <FaShieldAlt className="h-5 w-5" />,
      title: "Transparência",
      description:
        "Acreditamos na transparência total em todas as nossas operações e comunicações. Nossos usuários sempre saberão como seus dados são utilizados e como tomamos decisões.",
      color: darkMode ? "text-blue-400" : "text-blue-600",
      bgColor: darkMode ? "bg-blue-900/30" : "bg-blue-100",
    },
    {
      id: "empowerment",
      icon: <FaLightbulb className="h-5 w-5" />,
      title: "Empoderamento",
      description:
        "Nossa missão é empoderar as pessoas a tomarem controle de suas vidas financeiras e pessoais, fornecendo as ferramentas e conhecimentos necessários para decisões informadas.",
      color: darkMode ? "text-purple-400" : "text-purple-600",
      bgColor: darkMode ? "bg-purple-900/30" : "bg-purple-100",
    },
    {
      id: "integrity",
      icon: <FaHeart className="h-5 w-5" />,
      title: "Integridade",
      description:
        "Mantemos os mais altos padrões éticos em tudo o que fazemos. Nosso compromisso é sempre agir no melhor interesse de nossos usuários.",
      color: darkMode ? "text-rose-400" : "text-rose-600",
      bgColor: darkMode ? "bg-rose-900/30" : "bg-rose-100",
    },
    {
      id: "innovation",
      icon: <FaBullseye className="h-5 w-5" />,
      title: "Inovação",
      description:
        "Buscamos constantemente novas maneiras de melhorar nossa plataforma e oferecer soluções inovadoras para os desafios financeiros e de planejamento de vida.",
      color: darkMode ? "text-amber-400" : "text-amber-600",
      bgColor: darkMode ? "bg-amber-900/30" : "bg-amber-100",
    },
    {
      id: "community",
      icon: <FaUsers className="h-5 w-5" />,
      title: "Comunidade",
      description:
        "Acreditamos no poder da comunidade e do apoio mútuo. Criamos espaços para que nossos usuários possam compartilhar experiências e aprender uns com os outros.",
      color: darkMode ? "text-green-400" : "text-green-600",
      bgColor: darkMode ? "bg-green-900/30" : "bg-green-100",
    },
    {
      id: "sustainability",
      icon: <FaLeaf className="h-5 w-5" />,
      title: "Sustentabilidade",
      description:
        "Comprometemo-nos com práticas sustentáveis, tanto em nossas operações quanto em como ajudamos nossos usuários a planejar futuros financeiramente e ambientalmente responsáveis.",
      color: darkMode ? "text-emerald-400" : "text-emerald-600",
      bgColor: darkMode ? "bg-emerald-900/30" : "bg-emerald-100",
    },
  ]

  const values = [
    {
      id: "user-first",
      title: "Usuário em Primeiro Lugar",
      description: "Todas as nossas decisões são tomadas pensando primeiro no usuário. Seu sucesso é o nosso sucesso.",
      isOpen: false,
    },
    {
      id: "continuous-improvement",
      title: "Melhoria Contínua",
      description: "Estamos sempre buscando maneiras de melhorar nossa plataforma, nossos serviços e a nós mesmos.",
      isOpen: false,
    },
    {
      id: "data-driven",
      title: "Orientação por Dados",
      description:
        "Utilizamos dados para informar nossas decisões, sempre respeitando a privacidade e segurança dos usuários.",
      isOpen: false,
    },
    {
      id: "accessibility",
      title: "Acessibilidade",
      description:
        "Comprometemo-nos a tornar nossa plataforma acessível a todos, independentemente de suas habilidades ou limitações.",
      isOpen: false,
    },
    {
      id: "collaboration",
      title: "Colaboração",
      description:
        "Acreditamos que as melhores soluções surgem da colaboração entre diferentes perspectivas e experiências.",
      isOpen: false,
    },
    {
      id: "accountability",
      title: "Responsabilidade",
      description:
        "Assumimos responsabilidade por nossas ações e decisões, e estamos sempre abertos a feedback para melhorar.",
      isOpen: false,
    },
  ]

  const privacyCommitments = [
    {
      id: "data-protection",
      title: "Proteção de Dados",
      description:
        "Implementamos as mais avançadas medidas de segurança para proteger seus dados pessoais e financeiros.",
      icon: <FaLock className="h-5 w-5" />,
    },
    {
      id: "transparency",
      title: "Transparência no Uso de Dados",
      description: "Somos completamente transparentes sobre como coletamos, usamos e armazenamos seus dados.",
      icon: <FaShieldAlt className="h-5 w-5" />,
    },
    {
      id: "control",
      title: "Controle do Usuário",
      description:
        "Você tem controle total sobre seus dados e pode acessar, modificar ou excluir suas informações a qualquer momento.",
      icon: <FaUsers className="h-5 w-5" />,
    },
    {
      id: "no-selling",
      title: "Não Vendemos Seus Dados",
      description: "Nunca vendemos seus dados pessoais a terceiros. Seu relacionamento conosco é baseado em confiança.",
      icon: <FaHeart className="h-5 w-5" />,
    },
    {
      id: "compliance",
      title: "Conformidade com Regulamentações",
      description:
        "Estamos em conformidade com todas as leis e regulamentações de proteção de dados aplicáveis, incluindo LGPD e GDPR, garantindo que seus dados estejam sempre protegidos.",
      icon: <FaChartBar className="h-5 w-5" />,
    },
  ]

  const [openAccordion, setOpenAccordion] = useState(null);

  const toggleAccordion = (id) => {
    if (openAccordion === id) {
      setOpenAccordion(null);
    } else {
      setOpenAccordion(id);
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? "bg-slate-900" : "bg-slate-50"}`}>
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-8">
          <h1 className={`text-3xl font-bold ${darkMode ? "text-white" : "text-slate-800"}`}>Princípios e Valores</h1>
          <p className={`mt-2 ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
            Conheça os princípios e valores que norteiam nossa plataforma e metodologia
          </p>
        </div>

        <div className="mb-6">
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              className={`py-2 px-4 font-medium ${
                activeTab === "principles"
                  ? `${darkMode ? "text-white border-b-2 border-blue-500" : "text-slate-800 border-b-2 border-blue-500"}`
                  : `${darkMode ? "text-slate-400" : "text-slate-600"}`
              }`}
              onClick={() => setActiveTab("principles")}
            >
              Princípios
            </button>
            <button
              className={`py-2 px-4 font-medium ${
                activeTab === "values"
                  ? `${darkMode ? "text-white border-b-2 border-blue-500" : "text-slate-800 border-b-2 border-blue-500"}`
                  : `${darkMode ? "text-slate-400" : "text-slate-600"}`
              }`}
              onClick={() => setActiveTab("values")}
            >
              Valores
            </button>
            <button
              className={`py-2 px-4 font-medium ${
                activeTab === "privacy"
                  ? `${darkMode ? "text-white border-b-2 border-blue-500" : "text-slate-800 border-b-2 border-blue-500"}`
                  : `${darkMode ? "text-slate-400" : "text-slate-600"}`
              }`}
              onClick={() => setActiveTab("privacy")}
            >
              Compromisso com Privacidade
            </button>
          </div>
        </div>

        {activeTab === "principles" && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {principles.map((principle) => (
                <div key={principle.id} className={`rounded-lg shadow-md overflow-hidden ${darkMode ? "bg-slate-800" : "bg-white"} p-6`}>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className={`p-2 rounded-full ${principle.bgColor}`}>
                      <div className={principle.color}>{principle.icon}</div>
                    </div>
                    <h3 className={`text-lg font-semibold ${darkMode ? "text-white" : "text-slate-800"}`}>{principle.title}</h3>
                  </div>
                  <p className={`text-sm ${darkMode ? "text-slate-300" : "text-slate-600"}`}>{principle.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <p className={`text-lg ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                "Nossos princípios são o alicerce sobre o qual construímos nossa plataforma e relacionamento com nossos
                usuários."
              </p>
              <p className={`mt-2 font-medium ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                Equipe Movendo a Vida
              </p>
            </div>
          </div>
        )}

        {activeTab === "values" && (
          <div>
            <div className={`rounded-lg shadow-md overflow-hidden ${darkMode ? "bg-slate-800" : "bg-white"} p-6`}>
              <h2 className={`text-xl font-semibold mb-2 ${darkMode ? "text-white" : "text-slate-800"}`}>Nossos Valores Fundamentais</h2>
              <p className={`text-sm mb-6 ${darkMode ? "text-slate-400" : "text-slate-600"}`}>Os valores que guiam nossas decisões e ações diárias</p>
              
              <div className="space-y-2">
                {values.map((value) => (
                  <div key={value.id} className="border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
                    <button
                      className={`w-full text-left p-4 flex justify-between items-center ${darkMode ? "hover:bg-slate-700" : "hover:bg-slate-50"}`}
                      onClick={() => toggleAccordion(value.id)}
                    >
                      <span className={`font-medium ${darkMode ? "text-white" : "text-slate-800"}`}>{value.title}</span>
                      <svg
                        className={`w-5 h-5 transition-transform ${openAccordion === value.id ? "transform rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {openAccordion === value.id && (
                      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                        <p className={`text-sm ${darkMode ? "text-slate-300" : "text-slate-600"}`}>{value.description}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <div className={`rounded-lg shadow-md overflow-hidden ${darkMode ? "bg-slate-800" : "bg-white"} p-6`}>
                <h2 className={`text-xl font-semibold mb-2 ${darkMode ? "text-white" : "text-slate-800"}`}>Como Aplicamos Nossos Valores</h2>
                <p className={`text-sm mb-6 ${darkMode ? "text-slate-400" : "text-slate-600"}`}>Exemplos práticos de nossos valores em ação</p>
                
                <div className="space-y-6">
                  <div>
                    <h3 className={`text-lg font-medium mb-2 ${darkMode ? "text-white" : "text-slate-800"}`}>No Desenvolvimento da Plataforma</h3>
                    <p className={`text-sm ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                      Nosso processo de desenvolvimento é guiado por feedback constante dos usuários. Realizamos
                      testes regulares e iteramos rapidamente para garantir que estamos sempre melhorando a
                      experiência do usuário.
                    </p>
                  </div>
                  <div>
                    <h3 className={`text-lg font-medium mb-2 ${darkMode ? "text-white" : "text-slate-800"}`}>No Atendimento ao Cliente</h3>
                    <p className={`text-sm ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                      Nossa equipe de suporte é treinada para colocar as necessidades do usuário em primeiro lugar.
                      Estamos comprometidos em resolver problemas de forma rápida e eficiente, sempre com empatia e
                      respeito.
                    </p>
                  </div>
                  <div>
                    <h3 className={`text-lg font-medium mb-2 ${darkMode ? "text-white" : "text-slate-800"}`}>Na Comunidade</h3>
                    <p className={`text-sm ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                      Promovemos um ambiente de colaboração e apoio mútuo em nossa comunidade. Incentivamos o
                      compartilhamento de conhecimento e experiências entre os usuários, criando um espaço onde todos
                      podem aprender e crescer juntos.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "privacy" && (
          <div>
            <div className={`rounded-lg shadow-md overflow-hidden ${darkMode ? "bg-slate-800" : "bg-white"} p-6`}>
              <h2 className={`text-xl font-semibold mb-2 ${darkMode ? "text-white" : "text-slate-800"}`}>Nosso Compromisso com sua Privacidade</h2>
              <p className={`text-sm mb-6 ${darkMode ? "text-slate-400" : "text-slate-600"}`}>Como protegemos seus dados e respeitamos sua privacidade</p>
              
              <div className="space-y-6">
                {privacyCommitments.map((commitment) => (
                  <div key={commitment.id} className="flex space-x-4">
                    <div className={`p-2 rounded-full ${darkMode ? "bg-blue-900/30" : "bg-blue-100"} h-fit`}>
                      <div className={darkMode ? "text-blue-400" : "text-blue-600"}>{commitment.icon}</div>
                    </div>
                    <div>
                      <h3 className={`text-lg font-medium mb-1 ${darkMode ? "text-white" : "text-slate-800"}`}>{commitment.title}</h3>
                      <p className={`text-sm ${darkMode ? "text-slate-300" : "text-slate-600"}`}>{commitment.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-4 rounded-lg border border-dashed border-gray-200 dark:border-gray-700">
                <h3 className={`text-lg font-medium mb-2 ${darkMode ? "text-white" : "text-slate-800"}`}>Nossa Política de Privacidade</h3>
                <p className={`text-sm mb-4 ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                  Nossa política de privacidade é clara e transparente, detalhando como coletamos, usamos e protegemos
                  seus dados. Revisamos e atualizamos regularmente esta política para garantir que esteja sempre
                  alinhada com as melhores práticas e regulamentações.
                </p>
                <button className={`py-2 px-4 rounded-md border ${
                  darkMode 
                    ? "border-slate-700 bg-slate-700 hover:bg-slate-600 text-white" 
                    : "border-slate-300 bg-white hover:bg-slate-50 text-slate-800"
                }`}>
                  Ler Política de Privacidade Completa
                </button>
              </div>
            </div>

            <div className="mt-8">
              <div className={`rounded-lg shadow-md overflow-hidden ${darkMode ? "bg-slate-800" : "bg-white"} p-6`}>
                <h2 className={`text-xl font-semibold mb-2 ${darkMode ? "text-white" : "text-slate-800"}`}>Segurança de Dados</h2>
                <p className={`text-sm mb-6 ${darkMode ? "text-slate-400" : "text-slate-600"}`}>Medidas que implementamos para proteger seus dados</p>
                
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20">
                    <h3 className={`text-lg font-medium mb-2 ${darkMode ? "text-white" : "text-slate-800"}`}>Criptografia de Ponta a Ponta</h3>
                    <p className={`text-sm ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                      Utilizamos criptografia de ponta a ponta para proteger todas as suas informações sensíveis,
                      garantindo que apenas você possa acessá-las.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-gradient-to-r from-purple-500/10 to-violet-500/10 border border-purple-500/20">
                    <h3 className={`text-lg font-medium mb-2 ${darkMode ? "text-white" : "text-slate-800"}`}>Autenticação de Dois Fatores</h3>
                    <p className={`text-sm ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                      Oferecemos autenticação de dois fatores para adicionar uma camada extra de segurança à sua
                      conta, protegendo-a contra acessos não autorizados.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
                    <h3 className={`text-lg font-medium mb-2 ${darkMode ? "text-white" : "text-slate-800"}`}>Monitoramento Contínuo</h3>
                    <p className={`text-sm ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                      Nossa equipe de segurança monitora continuamente nossa plataforma para detectar e prevenir
                      atividades suspeitas, garantindo a proteção de seus dados.
                    </p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <button className={`w-full py-2 px-4 rounded-md ${
                    darkMode 
                      ? "bg-blue-600 hover:bg-blue-700 text-white" 
                      : "bg-blue-500 hover:bg-blue-600 text-white"
                  }`}>
                    Saiba Mais Sobre Nossa Segurança
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
