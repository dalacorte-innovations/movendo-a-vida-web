"use client"

import type React from "react"
import { useState, useEffect, useRef, useContext } from "react"
import {
  IoSendSharp,
  IoRefreshOutline,
  IoWalletOutline,
  IoTrendingUpOutline,
  IoStatsChartOutline,
  IoCalculatorOutline,
  IoCheckmarkOutline,
} from "react-icons/io5"
import { FaRobot } from "react-icons/fa"
import { ThemeContext } from "../../utils/ThemeContext.jsx"
import Sidebar from "../../components/sidebar"
import { useTranslation } from "react-i18next"
import ReactMarkdown from "react-markdown"

// Tipos para as mensagens
type MessageType = {
  id: string
  content: string
  sender: "user" | "agent"
  timestamp: Date
  isLoading?: boolean
}

// Sugestões de perguntas pré-definidas
const suggestedQuestions = [
  "Como devo começar a investir com pouco dinheiro?",
  "Qual a diferença entre renda fixa e variável?",
  "Como montar uma carteira diversificada?",
  "O que são ETFs e como investir neles?",
  "Quais investimentos são mais seguros para iniciantes?",
  "Como funciona o Tesouro Direto?",
  "Qual a melhor estratégia para investir a longo prazo?",
  "Como investir para a aposentadoria?",
]

const InvestmentAgentChat = () => {
  const { darkMode } = useContext(ThemeContext)
  const { t } = useTranslation()
  const [messages, setMessages] = useState<MessageType[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isAgentTyping, setIsAgentTyping] = useState(false)
  const [showWelcome, setShowWelcome] = useState(true)
  const [showIntro, setShowIntro] = useState(true)
  const [animateIn, setAnimateIn] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const waveCanvasRef = useRef<HTMLCanvasElement>(null)
  const waveAnimationRef = useRef<number>()
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Efeito para animação de entrada
  useEffect(() => {
    setAnimateIn(true)

    // Não adiciona a mensagem de boas-vindas automaticamente
    // Será adicionada apenas quando o usuário clicar em "Começar conversa"
  }, [])

  // Efeito para rolagem automática
  useEffect(() => {
    scrollToBottom()
  }, [messages, isAgentTyping])

  // Efeito para animação de partículas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    const particles: Array<{
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      connections: Array<number>
      opacity: number
    }> = []

    const particleCount = 50
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        connections: [],
        opacity: Math.random() * 0.5 + 0.2,
      })
    }

    const connectParticles = () => {
      const maxDistance = 150

      particles.forEach((p) => (p.connections = []))

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < maxDistance) {
            particles[i].connections.push(j)
          }
        }
      }
    }

    connectParticles()

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle, index) => {
        particle.x += particle.speedX
        particle.y += particle.speedY

        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1

        particle.x = Math.max(0, Math.min(canvas.width, particle.x))
        particle.y = Math.max(0, Math.min(canvas.height, particle.y))

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = darkMode
          ? `rgba(219, 39, 119, ${particle.opacity})`
          : `rgba(59, 130, 246, ${particle.opacity * 0.7})`
        ctx.fill()

        particle.connections.forEach((connectedIndex) => {
          const connectedParticle = particles[connectedIndex]
          const dx = particle.x - connectedParticle.x
          const dy = particle.y - connectedParticle.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          const opacity = 1 - distance / 150

          ctx.beginPath()
          ctx.moveTo(particle.x, particle.y)
          ctx.lineTo(connectedParticle.x, connectedParticle.y)
          ctx.strokeStyle = darkMode ? `rgba(236, 72, 153, ${opacity * 0.3})` : `rgba(37, 99, 235, ${opacity * 0.15})`
          ctx.lineWidth = 1
          ctx.stroke()
        })
      })

      if (Math.random() < 0.05) {
        connectParticles()
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [darkMode])

  // Efeito para animação de ondas
  useEffect(() => {
    const canvas = waveCanvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    const waves = [
      {
        amplitude: 50,
        period: 0.02,
        speed: 0.01,
        phase: 0,
        color: darkMode ? "rgba(219, 39, 119, 0.3)" : "rgba(59, 130, 246, 0.15)",
        lineWidth: 3,
      },
      {
        amplitude: 30,
        period: 0.03,
        speed: 0.015,
        phase: 2,
        color: darkMode ? "rgba(139, 92, 246, 0.3)" : "rgba(37, 99, 235, 0.15)",
        lineWidth: 2,
      },
      {
        amplitude: 70,
        period: 0.01,
        speed: 0.005,
        phase: 4,
        color: darkMode ? "rgba(236, 72, 153, 0.2)" : "rgba(96, 165, 250, 0.1)",
        lineWidth: 4,
      },
    ]

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      waves.forEach((wave) => {
        wave.phase += wave.speed

        ctx.beginPath()
        ctx.lineWidth = wave.lineWidth
        ctx.strokeStyle = wave.color

        ctx.moveTo(0, canvas.height / 2 + Math.sin(wave.phase) * wave.amplitude)

        for (let x = 0; x < canvas.width; x++) {
          const y = canvas.height / 2 + Math.sin(wave.period * x + wave.phase) * wave.amplitude
          ctx.lineTo(x, y)
        }

        ctx.stroke()
      })

      waveAnimationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      if (waveAnimationRef.current) {
        cancelAnimationFrame(waveAnimationRef.current)
      }
    }
  }, [darkMode])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputMessage(e.target.value)

    // Ajusta a altura do textarea conforme o conteúdo
    if (inputRef.current) {
      inputRef.current.style.height = "auto"
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleSendMessage = () => {
    if (inputMessage.trim() === "") return

    // Adiciona a mensagem do usuário
    const userMessage: MessageType = {
      id: `user-${Date.now()}`,
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prevMessages) => [...prevMessages, userMessage])
    setInputMessage("")
    setShowWelcome(false)

    // Reseta a altura do textarea
    if (inputRef.current) {
      inputRef.current.style.height = "auto"
    }

    // Simula o agente digitando
    setIsAgentTyping(true)

    // Simula a resposta do agente após um tempo
    setTimeout(
      () => {
        const agentResponse = generateAgentResponse(inputMessage)

        setIsAgentTyping(false)

        const agentMessage: MessageType = {
          id: `agent-${Date.now()}`,
          content: agentResponse,
          sender: "agent",
          timestamp: new Date(),
        }

        setMessages((prevMessages) => [...prevMessages, agentMessage])
      },
      1500 + Math.random() * 1500,
    ) // Tempo aleatório entre 1.5 e 3 segundos
  }

  const handleSuggestedQuestion = (question: string) => {
    setInputMessage(question)
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  const handleClearChat = () => {
    setMessages([])
    setShowWelcome(true)
    setShowIntro(true) // Volta para a tela de introdução

    // Não adiciona a mensagem de boas-vindas automaticamente
    // Será adicionada apenas quando o usuário clicar em "Começar conversa"
  }

  // Função para gerar respostas do agente (simulada)
  const generateAgentResponse = (userMessage: string): string => {
    const lowerCaseMessage = userMessage.toLowerCase()

    if (
      lowerCaseMessage.includes("começar") ||
      lowerCaseMessage.includes("iniciar") ||
      lowerCaseMessage.includes("pouco dinheiro")
    ) {
      return `Para começar a investir com pouco dinheiro, recomendo seguir estes passos:

1. **Organize suas finanças**: Antes de investir, certifique-se de ter uma reserva de emergência equivalente a 3-6 meses de despesas.

2. **Comece com investimentos de baixo valor mínimo**:
   - Tesouro Direto: a partir de R$30
   - Fundos de investimento: alguns aceitam aplicações a partir de R$1
   - CDBs: muitos bancos digitais oferecem CDBs a partir de R$100

3. **Considere investimentos automáticos**: Configure aportes mensais automáticos, mesmo que pequenos.

4. **Diversifique gradualmente**: À medida que seu capital cresce, diversifique entre diferentes classes de ativos.

5. **Educação financeira**: Continue aprendendo sobre investimentos para tomar decisões mais informadas.

Lembre-se que consistência é mais importante que o valor inicial. Investir regularmente, mesmo que pouco, pode trazer bons resultados a longo prazo.`
    }

    if (lowerCaseMessage.includes("renda fixa") || lowerCaseMessage.includes("renda variável")) {
      return `**Renda Fixa vs. Renda Variável: Principais Diferenças**

**Renda Fixa:**
- **Previsibilidade**: Rendimento conhecido no momento da aplicação ou atrelado a um indexador (como CDI, IPCA)
- **Risco**: Geralmente menor, principalmente em títulos públicos e CDBs com FGC
- **Exemplos**: Tesouro Direto, CDBs, LCIs, LCAs, Debêntures
- **Perfil**: Mais adequado para investidores conservadores ou para a reserva de segurança

**Renda Variável:**
- **Previsibilidade**: Rendimento não é conhecido previamente, depende do desempenho do ativo
- **Risco**: Geralmente maior, com possibilidade de perda do capital investido
- **Exemplos**: Ações, FIIs (Fundos Imobiliários), ETFs, Criptomoedas
- **Perfil**: Mais adequado para investidores moderados a arrojados, com horizonte de longo prazo

**Dica importante**: Uma estratégia equilibrada geralmente inclui ambos os tipos de investimento, com proporções que variam conforme seu perfil de risco e objetivos financeiros.`
    }

    if (lowerCaseMessage.includes("carteira") || lowerCaseMessage.includes("diversificada")) {
      return `**Como montar uma carteira diversificada:**

Uma carteira bem diversificada deve distribuir investimentos entre diferentes classes de ativos, setores e regiões. Aqui está um guia passo a passo:

1. **Defina seus objetivos e horizonte de tempo**
   - Curto prazo (até 2 anos)
   - Médio prazo (2-5 anos)
   - Longo prazo (mais de 5 anos)

2. **Determine seu perfil de risco** (conservador, moderado ou arrojado)

3. **Estruture sua carteira com base no seu perfil:**

   **Conservador (exemplo):**
   - 70-80% em Renda Fixa (Tesouro Direto, CDBs)
   - 10-20% em Fundos Imobiliários
   - 5-10% em Ações de empresas consolidadas
   - 0-5% em investimentos alternativos

   **Moderado (exemplo):**
   - 50-60% em Renda Fixa
   - 20-30% em Ações diversificadas
   - 10-15% em Fundos Imobiliários
   - 5-10% em investimentos internacionais
   - 0-5% em investimentos alternativos

   **Arrojado (exemplo):**
   - 20-30% em Renda Fixa
   - 40-50% em Ações (nacionais e internacionais)
   - 10-20% em Fundos Imobiliários
   - 10-15% em investimentos internacionais
   - 5-10% em investimentos alternativos

4. **Diversifique dentro de cada classe**
   - Em ações: diferentes setores e empresas
   - Em renda fixa: diferentes emissores e vencimentos
   - Em FIIs: diferentes segmentos (logística, shoppings, lajes corporativas)

5. **Rebalanceie periodicamente** (a cada 6 meses ou 1 ano)

Lembre-se que esta é apenas uma sugestão. O ideal é adaptar conforme seus objetivos específicos e, se possível, consultar um assessor de investimentos.`
    }

    if (lowerCaseMessage.includes("etf")) {
      return `**ETFs: O que são e como investir**

**O que são ETFs:**
ETFs (Exchange Traded Funds) são fundos negociados em bolsa que replicam índices de mercado, setores ou estratégias específicas. Eles combinam características de ações (negociação em tempo real) e fundos de investimento (diversificação).

**Vantagens dos ETFs:**
- **Diversificação**: Com uma única compra, você adquire exposição a vários ativos
- **Baixo custo**: Geralmente têm taxas de administração menores que fundos tradicionais
- **Liquidez**: Podem ser comprados e vendidos durante o horário de pregão
- **Transparência**: Composição da carteira é conhecida e acompanha um índice

**Como investir em ETFs:**

1. **Abra uma conta em uma corretora** que ofereça acesso à B3

2. **Pesquise os ETFs disponíveis no Brasil:**
   - BOVA11: Replica o Ibovespa
   - IVVB11: Replica o S&P 500 (mercado americano)
   - SMAL11: Replica o índice Small Cap (empresas menores)
   - PIBB11: Replica o IBrX-50
   - GOLD11: Replica a variação do ouro
   - E muitos outros

3. **Compre como uma ação normal**, usando o código do ETF

4. **Estratégias de investimento:**
   - Aporte único: Investimento de valor maior de uma só vez
   - Aportes regulares: Investimentos menores em intervalos regulares (estratégia de preço médio)

5. **Considere os custos:**
   - Taxa de administração do ETF
   - Custos de corretagem (se houver)
   - Emolumentos da B3

**Dica importante:** ETFs são excelentes para investidores que desejam exposição a um mercado ou setor sem precisar selecionar ativos individuais. São especialmente úteis para diversificação internacional.`
    }

    // Resposta padrão
    return `Obrigado pela sua pergunta sobre "${userMessage}". 

Como seu Agente de Investimentos, posso ajudar com informações sobre diversos temas financeiros, incluindo:

- Estratégias de investimento para diferentes perfis
- Análise de produtos financeiros (renda fixa, variável, fundos)
- Planejamento financeiro de curto, médio e longo prazo
- Diversificação de carteira e gestão de riscos
- Investimentos para objetivos específicos (aposentadoria, compra de imóvel, etc.)

Para informações mais personalizadas, considere compartilhar detalhes sobre seu perfil de investidor, objetivos financeiros e horizonte de tempo. Isso me ajudará a fornecer orientações mais adequadas ao seu caso.

Lembre-se que minhas respostas são informativas e educacionais, não constituindo recomendação de investimento.`
  }

  // Formata a data da mensagem
  const formatMessageTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const startConversation = () => {
    setShowIntro(false)

    // Adiciona a mensagem de boas-vindas do agente
    const welcomeMessage: MessageType = {
      id: "welcome",
      content:
        "Olá! Sou seu Agente de Investimentos. Como posso ajudar você hoje com suas dúvidas sobre investimentos, planejamento financeiro ou estratégias para alcançar seus objetivos?",
      sender: "agent",
      timestamp: new Date(),
    }

    setMessages([welcomeMessage])
  }

  return (
    <div className={`flex h-screen overflow-hidden ${darkMode ? "bg-[#0F172A]" : "bg-[#f0f7ff]"}`}>
      <div
        className={`fixed md:relative ${
          darkMode ? "bg-slate-800/70 border-r border-slate-700/50" : "bg-white/80 border-r border-blue-100"
        } h-full z-10`}
      >
        <Sidebar />
      </div>

      <canvas ref={waveCanvasRef} className="fixed inset-0 pointer-events-none z-0" />
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />

      <main className="flex-grow mt-[60px] flex flex-col p-1 sm:p-3 md:p-5 lg:p-6 md:ml-16 relative z-10 mt-2 sm:mt-4">
        <div className="max-w-5xl w-full mx-auto flex flex-col h-full">
          {/* Botão de reiniciar no canto superior direito */}
          <div className="fixed top-2 right-2 sm:top-4 sm:right-4 z-30">
            <button
              onClick={handleClearChat}
              className={`p-1.5 sm:p-2 rounded-lg transition-colors shadow-md ${
                darkMode
                  ? "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-600/50"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
              }`}
              title={t("Reiniciar conversa")}
            >
              <IoRefreshOutline className="text-base sm:text-lg" />
            </button>
          </div>

          {/* Área de chat */}
          <div
            className={`flex-grow relative overflow-hidden rounded-lg sm:rounded-xl shadow-md backdrop-blur-md mb-2 sm:mb-4 ${
              darkMode ? "bg-slate-800/70 border border-slate-700/50" : "bg-white/80 border border-blue-100"
            } transform transition-all duration-500 ease-out ${animateIn ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
            style={{ transitionDelay: "100ms" }}
          >
            <div className="absolute inset-0 overflow-hidden">
              <div
                className={`absolute -inset-[10px] rounded-full opacity-20 blur-3xl ${
                  darkMode ? "bg-pink-500" : "bg-blue-400"
                }`}
                style={{
                  top: "50%",
                  left: "25%",
                  width: "50%",
                  height: "50%",
                }}
              />
            </div>

            <div className="relative h-full flex flex-col">
              {/* Mensagens */}
              <div className="flex-grow overflow-y-auto p-2 sm:p-3 md:p-4 lg:p-6">
                {showIntro ? (
                  <div className="flex flex-col items-center justify-center h-full text-center p-2 sm:p-4">
                    <div
                      className={`w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mb-2 sm:mb-3 md:mb-4 ${
                        darkMode ? "bg-pink-900/30" : "bg-blue-100"
                      }`}
                    >
                      <FaRobot
                        className={`text-2xl sm:text-3xl md:text-4xl ${darkMode ? "text-pink-400" : "text-blue-600"}`}
                      />
                    </div>
                    <h2
                      className={`text-lg md:text-xl font-bold mb-1 md:mb-2 ${darkMode ? "text-white" : "text-slate-800"}`}
                    >
                      {t("Bem-vindo ao Agente de Investimentos")}
                    </h2>
                    <p
                      className={`max-w-md mb-4 md:mb-6 text-sm md:text-base ${darkMode ? "text-slate-300" : "text-slate-600"}`}
                    >
                      {t("Seu assistente virtual especializado em investimentos e planejamento financeiro.")}
                    </p>

                    <div
                      className={`w-full max-w-2xl mb-6 p-4 rounded-xl ${
                        darkMode ? "bg-slate-700/50 border border-slate-600/30" : "bg-blue-50/70 border border-blue-100"
                      }`}
                    >
                      <h3
                        className={`text-base md:text-lg font-semibold mb-3 ${darkMode ? "text-white" : "text-slate-800"}`}
                      >
                        {t("Como posso ajudar você?")}
                      </h3>

                      <div className="space-y-2 text-left">
                        <div className="flex items-start">
                          <div
                            className={`flex-shrink-0 mt-1 w-5 h-5 rounded-full flex items-center justify-center ${
                              darkMode ? "bg-pink-900/30" : "bg-blue-100"
                            } mr-2`}
                          >
                            <IoCheckmarkOutline className={`text-xs ${darkMode ? "text-pink-400" : "text-blue-600"}`} />
                          </div>
                          <span className={`text-sm ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                            {t("Tire dúvidas sobre diferentes tipos de investimentos (ações, fundos, renda fixa)")}
                          </span>
                        </div>
                        <div className="flex items-start">
                          <div
                            className={`flex-shrink-0 mt-1 w-5 h-5 rounded-full flex items-center justify-center ${
                              darkMode ? "bg-pink-900/30" : "bg-blue-100"
                            } mr-2`}
                          >
                            <IoCheckmarkOutline className={`text-xs ${darkMode ? "text-pink-400" : "text-blue-600"}`} />
                          </div>
                          <span className={`text-sm ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                            {t("Pergunte sobre estratégias de investimento para diferentes objetivos")}
                          </span>
                        </div>
                        <div className="flex items-start">
                          <div
                            className={`flex-shrink-0 mt-1 w-5 h-5 rounded-full flex items-center justify-center ${
                              darkMode ? "bg-pink-900/30" : "bg-blue-100"
                            } mr-2`}
                          >
                            <IoCheckmarkOutline className={`text-xs ${darkMode ? "text-pink-400" : "text-blue-600"}`} />
                          </div>
                          <span className={`text-sm ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                            {t("Obtenha explicações sobre termos financeiros e conceitos de investimento")}
                          </span>
                        </div>
                        <div className="flex items-start">
                          <div
                            className={`flex-shrink-0 mt-1 w-5 h-5 rounded-full flex items-center justify-center ${
                              darkMode ? "bg-pink-900/30" : "bg-blue-100"
                            } mr-2`}
                          >
                            <IoCheckmarkOutline className={`text-xs ${darkMode ? "text-pink-400" : "text-blue-600"}`} />
                          </div>
                          <span className={`text-sm ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                            {t("Receba orientações sobre como montar uma carteira diversificada")}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2 md:gap-3 w-full max-w-md md:max-w-2xl">
                      {[
                        {
                          icon: IoWalletOutline,
                          title: "Planejamento Financeiro",
                          desc: "Organize suas finanças e crie metas",
                        },
                        {
                          icon: IoTrendingUpOutline,
                          title: "Análise de Investimentos",
                          desc: "Entenda diferentes produtos financeiros",
                        },
                        {
                          icon: IoStatsChartOutline,
                          title: "Estratégias de Mercado",
                          desc: "Aprenda táticas para diferentes cenários",
                        },
                        {
                          icon: IoCalculatorOutline,
                          title: "Simulações Financeiras",
                          desc: "Projete resultados de investimentos",
                        },
                      ].map((item, index) => (
                        <div
                          key={index}
                          className={`p-3 md:p-4 rounded-lg ${
                            darkMode
                              ? "bg-slate-700/30 border border-slate-600/30"
                              : "bg-blue-50/50 border border-blue-100"
                          }`}
                        >
                          <div className="flex items-center mb-1">
                            <div
                              className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center ${
                                darkMode ? "bg-pink-900/30" : "bg-blue-100"
                              } mr-2 md:mr-3 flex-shrink-0`}
                            >
                              <item.icon
                                className={`text-base md:text-lg ${darkMode ? "text-pink-400" : "text-blue-600"}`}
                              />
                            </div>
                            <span
                              className={`font-medium text-sm md:text-base ${darkMode ? "text-white" : "text-slate-800"}`}
                            >
                              {t(item.title)}
                            </span>
                          </div>
                          <p className={`text-xs pl-10 md:pl-12 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                            {t(item.desc)}
                          </p>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={startConversation}
                      className={`mt-4 sm:mt-6 px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-colors text-sm sm:text-base ${
                        darkMode
                          ? "bg-pink-600 hover:bg-pink-700 text-white"
                          : "bg-blue-600 hover:bg-blue-700 text-white"
                      }`}
                    >
                      {t("Começar conversa")}
                    </button>
                  </div>
                ) : (
                  <>
                    {showWelcome && messages.length === 0 && (
                      <div className="flex flex-col items-center justify-center h-full text-center p-2 sm:p-4">
                        <div
                          className={`w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mb-2 sm:mb-3 md:mb-4 ${
                            darkMode ? "bg-pink-900/30" : "bg-blue-100"
                          }`}
                        >
                          <FaRobot
                            className={`text-2xl sm:text-3xl md:text-4xl ${darkMode ? "text-pink-400" : "text-blue-600"}`}
                          />
                        </div>
                        <h2
                          className={`text-lg md:text-xl font-bold mb-1 md:mb-2 ${darkMode ? "text-white" : "text-slate-800"}`}
                        >
                          {t("Agente de Investimentos")}
                        </h2>
                        <p
                          className={`max-w-md mb-4 md:mb-6 text-sm md:text-base ${darkMode ? "text-slate-300" : "text-slate-600"}`}
                        >
                          {t(
                            "Olá! Sou seu assistente virtual especializado em investimentos. Faça perguntas sobre planejamento financeiro, tipos de investimentos, estratégias e muito mais.",
                          )}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2 md:gap-3 w-full max-w-md md:max-w-2xl">
                          {[
                            { icon: IoWalletOutline, title: "Planejamento Financeiro" },
                            { icon: IoTrendingUpOutline, title: "Análise de Investimentos" },
                            { icon: IoStatsChartOutline, title: "Estratégias de Mercado" },
                            { icon: IoCalculatorOutline, title: "Simulações Financeiras" },
                          ].map((item, index) => (
                            <div
                              key={index}
                              className={`p-3 md:p-4 rounded-lg ${
                                darkMode
                                  ? "bg-slate-700/30 border border-slate-600/30"
                                  : "bg-blue-50/50 border border-blue-100"
                              }`}
                            >
                              <div className="flex items-center">
                                <div
                                  className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center ${
                                    darkMode ? "bg-pink-900/30" : "bg-blue-100"
                                  } mr-2 md:mr-3 flex-shrink-0`}
                                >
                                  <item.icon
                                    className={`text-base md:text-lg ${darkMode ? "text-pink-400" : "text-blue-600"}`}
                                  />
                                </div>
                                <span
                                  className={`font-medium text-sm md:text-base ${darkMode ? "text-white" : "text-slate-800"}`}
                                >
                                  {t(item.title)}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`mb-2 sm:mb-3 md:mb-4 flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[92%] sm:max-w-[85%] md:max-w-[75%] rounded-lg sm:rounded-xl md:rounded-2xl p-2 sm:p-3 md:p-4 ${
                            message.sender === "user"
                              ? darkMode
                                ? "bg-pink-900/30 border border-pink-800/30"
                                : "bg-blue-100 border border-blue-200"
                              : darkMode
                                ? "bg-slate-700/30 border border-slate-600/30"
                                : "bg-white border border-slate-200"
                          }`}
                        >
                          {message.sender === "agent" && (
                            <div className="flex items-center mb-1 md:mb-2">
                              <div
                                className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center ${
                                  darkMode ? "bg-pink-900/30" : "bg-blue-100"
                                } mr-2`}
                              >
                                <FaRobot
                                  className={`text-xs md:text-sm ${darkMode ? "text-pink-400" : "text-blue-600"}`}
                                />
                              </div>
                              <span
                                className={`font-medium text-xs md:text-sm ${darkMode ? "text-white" : "text-slate-800"}`}
                              >
                                {t("Agente de Investimentos")}
                              </span>
                              <span className={`ml-auto text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                                {formatMessageTime(message.timestamp)}
                              </span>
                            </div>
                          )}

                          {message.sender === "user" && (
                            <div className="flex items-center justify-between mb-1 md:mb-2">
                              <span className={`ml-auto text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                                {formatMessageTime(message.timestamp)}
                              </span>
                              <span
                                className={`font-medium text-xs md:text-sm ${darkMode ? "text-white" : "text-slate-800"} ml-2`}
                              >
                                {t("Você")}
                              </span>
                            </div>
                          )}

                          <div className={`text-sm md:text-base ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                            {message.sender === "agent" ? (
                              <ReactMarkdown
                                components={{
                                  p: ({ children }) => <p className="mb-2 md:mb-3 last:mb-0">{children}</p>,
                                  ul: ({ children }) => (
                                    <ul className="list-disc pl-4 md:pl-5 mb-2 md:mb-3 space-y-1">{children}</ul>
                                  ),
                                  ol: ({ children }) => (
                                    <ol className="list-decimal pl-4 md:pl-5 mb-2 md:mb-3 space-y-1">{children}</ol>
                                  ),
                                  li: ({ children }) => <li>{children}</li>,
                                  h3: ({ children }) => (
                                    <h3 className="text-base md:text-lg font-semibold mb-1 md:mb-2">{children}</h3>
                                  ),
                                  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                                }}
                              >
                                {message.content}
                              </ReactMarkdown>
                            ) : (
                              message.content
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                )}

                {isAgentTyping && (
                  <div className="mb-2 sm:mb-3 md:mb-4 flex justify-start">
                    <div
                      className={`max-w-[92%] sm:max-w-[85%] md:max-w-[75%] rounded-lg sm:rounded-xl md:rounded-2xl p-2 sm:p-3 md:p-4 ${
                        darkMode ? "bg-slate-700/30 border border-slate-600/30" : "bg-white border border-slate-200"
                      }`}
                    >
                      <div className="flex items-center mb-1 md:mb-2">
                        <div
                          className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center ${
                            darkMode ? "bg-pink-900/30" : "bg-blue-100"
                          } mr-2`}
                        >
                          <FaRobot className={`text-xs md:text-sm ${darkMode ? "text-pink-400" : "text-blue-600"}`} />
                        </div>
                        <span
                          className={`font-medium text-xs md:text-sm ${darkMode ? "text-white" : "text-slate-800"}`}
                        >
                          {t("Agente de Investimentos")}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className={`${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                          <span className="inline-block w-1.5 md:w-2 h-1.5 md:h-2 bg-current rounded-full animate-bounce mr-1"></span>
                          <span className="inline-block w-1.5 md:w-2 h-1.5 md:h-2 bg-current rounded-full animate-bounce animation-delay-200 mr-1"></span>
                          <span className="inline-block w-1.5 md:w-2 h-1.5 md:h-2 bg-current rounded-full animate-bounce animation-delay-400"></span>
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Sugestões de perguntas */}
              {messages.length > 0 && messages.length < 3 && (
                <div
                  className={`p-2 sm:p-3 md:p-4 border-t ${darkMode ? "border-slate-700/50" : "border-slate-200/50"}`}
                >
                  <p className={`text-xs md:text-sm mb-2 md:mb-3 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                    {t("Sugestões de perguntas:")}
                  </p>
                  <div className="flex flex-wrap gap-1 sm:gap-1.5 md:gap-2">
                    {suggestedQuestions.slice(0, 4).map((question, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestedQuestion(question)}
                        className={`text-[10px] sm:text-xs md:text-sm px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 md:py-1.5 rounded-full transition-colors ${
                          darkMode
                            ? "bg-slate-700/50 text-slate-300 hover:bg-slate-700 border border-slate-600/50"
                            : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                        }`}
                      >
                        {question.length > (window.innerWidth < 640 ? 20 : 30)
                          ? question.substring(0, window.innerWidth < 640 ? 20 : 30) + "..."
                          : question}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Área de entrada de mensagem */}
              <div className={`p-2 sm:p-3 md:p-4 border-t ${darkMode ? "border-slate-700/50" : "border-slate-200/50"}`}>
                <div className="relative">
                  <textarea
                    ref={inputRef}
                    value={inputMessage}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder={t("Digite sua pergunta sobre investimentos...")}
                    className={`w-full pl-2 sm:pl-3 md:pl-4 pr-9 sm:pr-10 md:pr-12 py-2 md:py-3 rounded-lg transition-colors resize-none overflow-hidden text-sm md:text-base ${
                      darkMode
                        ? "bg-slate-700/30 text-white border border-slate-600/50 placeholder-slate-400"
                        : "bg-white text-slate-800 border border-slate-200 placeholder-slate-400"
                    } focus:outline-none`}
                    style={{ minHeight: "40px", maxHeight: "120px" }}
                    rows={1}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={inputMessage.trim() === ""}
                    className={`absolute right-1 sm:right-2 md:right-3 top-1/2 -translate-y-1/2 p-1 sm:p-1.5 md:p-2 rounded-full transition-colors ${
                      inputMessage.trim() === ""
                        ? darkMode
                          ? "text-slate-500 bg-slate-700/30"
                          : "text-slate-300 bg-slate-100"
                        : darkMode
                          ? "text-white bg-pink-600 hover:bg-pink-700"
                          : "text-white bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    <IoSendSharp className="text-sm sm:text-base md:text-lg" />
                  </button>
                </div>
                <p className={`mt-1 text-[10px] sm:text-xs ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
                  {t("Pressione Enter para enviar, Shift+Enter para nova linha")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default InvestmentAgentChat
