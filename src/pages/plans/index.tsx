"use client"

import { useState, useEffect, useContext, useRef } from "react"
import { FaCircleCheck, FaRegCircleXmark } from "react-icons/fa6"
import {
  IoRocketSharp,
  IoLeafOutline,
  IoSparkles,
  IoArrowBack,
  IoCheckmarkCircle,
  IoStarOutline,
} from "react-icons/io5"
import PaymentModal from "../../components/Payment/index.tsx"
import { useNavigate } from "react-router-dom"
import { getToken, getPlan, getPlanMade } from "../../utils/storage.jsx"
import Sidebar from "../../components/sidebar/index.tsx"
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner.jsx"
import { ThemeContext } from "../../utils/ThemeContext.jsx"
import { useTranslation } from "react-i18next"

const plans = [
  {
    title: "Iniciante",
    price: "R$59,00",
    description: "Melhor opção para quem possui um perfil de investidor conservador e busca uma experiência segura",
    features: ["Plano de Vida", "Plano de Viagem", "Exportar PDV", "Exportar Excel", "Gráficos", "Agenda"],
    availableFeatures: [true, true, true, true, false, false],
    buttonColor: "bg-gray-800",
    popular: false,
    plan_name: "Plano Iniciante",
    icon: IoLeafOutline,
    color: "emerald",
  },
  {
    title: "Avançado",
    price: "R$100,00",
    description:
      "Melhor opção para quem possui um perfil de investidor moderado e busca mais ferramentas para planejar seu futuro",
    features: ["Plano de Vida", "Plano de Viagem", "Exportar PDV", "Exportar Excel", "Gráficos", "Agenda"],
    availableFeatures: [true, true, true, true, true, false],
    buttonColor: "bg-blue-600",
    popular: true,
    plan_name: "Plano Avançado",
    icon: IoRocketSharp,
    color: "blue",
  },
  {
    title: "Profissional",
    price: "R$200,00",
    description:
      "A escolha ideal para quem quer aproveitar todos os benefícios com um planejamento completo e detalhado",
    features: ["Plano de Vida", "Plano de Viagem", "Exportar PDV", "Exportar Excel", "Gráficos", "Agenda"],
    availableFeatures: [true, true, true, true, true, true],
    buttonColor: "bg-gray-800",
    popular: false,
    plan_name: "Plano Profissional",
    icon: IoSparkles,
    color: "amber",
  },
]

const PlansPage = () => {
  const { t } = useTranslation()
  const [hoveredPlan, setHoveredPlan] = useState(null)
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [isAuthenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [currentPlan, setCurrentPlan] = useState("")
  const [paymentMade, setPaymentMade] = useState(false)
  const navigate = useNavigate()
  const { darkMode } = useContext(ThemeContext)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [animateIn, setAnimateIn] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const waveCanvasRef = useRef<HTMLCanvasElement>(null)
  const waveAnimationRef = useRef<number>()

  useEffect(() => {
    setAnimateIn(true)

    const token = getToken()
    setAuthenticated(!!token)

    const storedPlan = getPlan()
    const storedPaymentMade = getPlanMade()

    setCurrentPlan(storedPlan)
    setPaymentMade(!!storedPaymentMade)
    setLoading(false)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

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
        color: darkMode
          ? "rgba(219, 39, 119, 0.3)" // Pink in dark mode
          : "rgba(59, 130, 246, 0.15)", // Blue in light mode
        lineWidth: 3,
      },
      {
        amplitude: 30,
        period: 0.03,
        speed: 0.015,
        phase: 2,
        color: darkMode
          ? "rgba(139, 92, 246, 0.3)" // Purple in dark mode
          : "rgba(37, 99, 235, 0.15)", // Darker blue in light mode
        lineWidth: 2,
      },
      {
        amplitude: 70,
        period: 0.01,
        speed: 0.005,
        phase: 4,
        color: darkMode
          ? "rgba(236, 72, 153, 0.2)" // Pink in dark mode
          : "rgba(96, 165, 250, 0.1)", // Lighter blue in light mode
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
          ? `rgba(219, 39, 119, ${particle.opacity})` // Pink in dark mode
          : `rgba(59, 130, 246, ${particle.opacity * 0.7})` // Blue in light mode
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
          ctx.strokeStyle = darkMode
            ? `rgba(236, 72, 153, ${opacity * 0.3})` // Pink in dark mode
            : `rgba(37, 99, 235, ${opacity * 0.15})` // Blue in light mode
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

  const handleMouseEnter = (index) => {
    setHoveredPlan(index)
  }

  const handleMouseLeave = () => {
    setHoveredPlan(null)
  }

  const handleSelectPlan = (plan, index) => {
    setSelectedPlan(index)
  }

  if (loading) {
    return <LoadingSpinner />
  }

  const getPlanColorClasses = (plan, index, isHovered) => {
    const colorMap = {
      emerald: {
        bg: darkMode ? "bg-emerald-900/30" : "bg-emerald-100",
        text: darkMode ? "text-emerald-400" : "text-emerald-600",
        border: darkMode ? "border-emerald-800/30" : "border-emerald-200",
        hoverBg: darkMode ? "bg-emerald-900/50" : "bg-emerald-200/70",
        gradient: darkMode ? "from-emerald-600 to-teal-600" : "from-emerald-500 to-teal-500",
      },
      blue: {
        bg: darkMode ? "bg-blue-900/30" : "bg-blue-100",
        text: darkMode ? "text-blue-400" : "text-blue-600",
        border: darkMode ? "border-blue-800/30" : "border-blue-200",
        hoverBg: darkMode ? "bg-blue-900/50" : "bg-blue-200/70",
        gradient: darkMode ? "from-blue-600 to-indigo-600" : "from-blue-500 to-indigo-500",
      },
      amber: {
        bg: darkMode ? "bg-amber-900/30" : "bg-amber-100",
        text: darkMode ? "text-amber-400" : "text-amber-600",
        border: darkMode ? "border-amber-800/30" : "border-amber-200",
        hoverBg: darkMode ? "bg-amber-900/50" : "bg-amber-200/70",
        gradient: darkMode ? "from-amber-600 to-orange-600" : "from-amber-500 to-orange-500",
      },
    }

    const color = plan.color || (index === 0 ? "emerald" : index === 1 ? "blue" : "amber")
    return colorMap[color]
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

      <main className="flex-grow p-4 md:p-6 lg:p-8 md:ml-16 overflow-auto relative z-10">
        <div className="max-w-6xl mx-auto">
          <div
            className={`relative overflow-hidden rounded-2xl shadow-xl backdrop-blur-md mb-8 ${
              darkMode ? "bg-slate-800/70 border border-slate-700/50" : "bg-white/80 border border-blue-100"
            } transform transition-all duration-500 ease-out ${animateIn ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
          >
            <div className="absolute inset-0 overflow-hidden">
              <div
                className={`absolute -inset-[10px] rounded-full opacity-30 blur-3xl ${
                  darkMode ? "bg-pink-500" : "bg-blue-400"
                }`}
                style={{
                  top: mousePosition.y * 0.05,
                  left: mousePosition.x * 0.05,
                  transition: "all 0.3s ease-out",
                  width: "50%",
                  height: "50%",
                }}
              />
            </div>

            <div className="relative p-6 md:p-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                <div className="flex items-center">
                  <button
                    onClick={() => navigate("/")}
                    className={`flex items-center justify-center w-10 h-10 rounded-lg mr-4 transition-colors ${
                      darkMode
                        ? "bg-slate-700/50 text-slate-300 hover:bg-slate-700 border border-slate-600/50"
                        : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                    }`}
                  >
                    <IoArrowBack />
                  </button>
                  <div>
                    <h1 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-slate-800"}`}>
                      {t("Nossos Planos")}
                    </h1>
                    <p className={`text-sm mt-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                      {t("Escolha o plano ideal para suas necessidades de planejamento")}
                    </p>
                  </div>
                </div>
              </div>

              <div
                className={`p-4 rounded-lg ${
                  darkMode ? "bg-slate-700/30 border border-slate-600/30" : "bg-blue-50/50 border border-blue-100"
                } mt-4`}
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0 mr-3">
                    <IoStarOutline className={`text-lg ${darkMode ? "text-pink-400" : "text-blue-600"}`} />
                  </div>
                  <div className="w-full">
                    <p className={`italic ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                      {t(
                        '"Seja qual for seu objetivo, nossos recursos foram projetados para guiá-lo ao longo dos próximos 20 anos, ajudando você a alcançar cada marco com confiança."',
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {plans.map((plan, index) => {
              const isDisabled = paymentMade && currentPlan === plan.plan_name
              const isHovered = hoveredPlan === index || selectedPlan === index
              const colorClasses = getPlanColorClasses(plan, index, isHovered)

              return (
                <div
                  key={index}
                  className={`transform transition-all duration-500 ease-out ${animateIn ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div
                    onMouseEnter={() => handleMouseEnter(index)}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => !isDisabled && handleSelectPlan(plan, index)}
                    className={`relative overflow-hidden rounded-xl shadow-md backdrop-blur-md border-2 transition-all duration-300 h-full
                      ${isHovered ? (darkMode ? "border-pink-500/50" : "border-blue-500/50") : `${colorClasses.border}`}
                      ${darkMode ? "bg-slate-800/70" : "bg-white/90"}
                      ${isDisabled ? "opacity-70 cursor-not-allowed" : "cursor-pointer hover:shadow-lg"}`}
                  >
                    <div className="absolute inset-0 overflow-hidden">
                      <div
                        className={`absolute -inset-[10px] rounded-full opacity-20 blur-3xl bg-gradient-to-r ${colorClasses.gradient}`}
                        style={{
                          top: isHovered ? mousePosition.y * 0.1 : 0,
                          left: isHovered ? mousePosition.x * 0.1 : 0,
                          transition: "all 0.5s ease-out",
                          width: "50%",
                          height: "50%",
                        }}
                      />
                    </div>

                    {plan.popular && (
                      <div
                        className={`absolute top-4 right-4 ${
                          darkMode
                            ? "bg-pink-900/50 text-pink-300 border border-pink-800/30"
                            : "bg-blue-100 text-blue-700 border border-blue-200"
                        } px-3 py-1 rounded-full text-xs font-semibold z-10`}
                      >
                        {t("Mais popular")}
                      </div>
                    )}

                    <div className="relative p-6">
                      <div className="flex items-center mb-4">
                        <div
                          className={`flex items-center justify-center w-12 h-12 rounded-xl ${colorClasses.bg} mr-4`}
                        >
                          <plan.icon className={`text-xl ${colorClasses.text}`} />
                        </div>
                        <h3 className={`text-xl font-bold ${darkMode ? "text-white" : "text-slate-800"}`}>
                          {t(plan.title)}
                        </h3>
                      </div>

                      <div
                        className={`text-3xl font-bold mb-4 ${
                          isHovered
                            ? darkMode
                              ? "text-pink-400"
                              : "text-blue-600"
                            : darkMode
                              ? "text-white"
                              : "text-slate-800"
                        } transition-colors duration-300`}
                      >
                        {plan.price}
                        <span className={`text-sm font-normal ml-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                          {t("/mês")}
                        </span>
                      </div>

                      <p className={`mb-6 text-sm ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                        {t(plan.description)}
                      </p>

                      <button
                        className={`w-full py-3 px-4 rounded-lg font-medium text-sm text-white transition-all duration-300 ${
                          isDisabled ? (darkMode ? "bg-slate-700" : "bg-slate-400") : `group relative overflow-hidden`
                        }`}
                        disabled={isDisabled}
                      >
                        {!isDisabled && (
                          <>
                            <div
                              className={`absolute inset-0 bg-gradient-to-r ${colorClasses.gradient} transition-transform duration-300 group-hover:scale-105`}
                            ></div>
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-white transition-opacity duration-300"></div>
                          </>
                        )}
                        <span className="relative z-10">{isDisabled ? t("Plano Atual") : t("Selecionar Plano")}</span>
                      </button>

                      <div className={`h-px my-6 ${darkMode ? "bg-slate-700" : "bg-slate-200"}`}></div>

                      <ul className="space-y-3">
                        {plan.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center">
                            {plan.availableFeatures[featureIndex] ? (
                              <div
                                className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                                  darkMode ? "bg-emerald-900/30" : "bg-emerald-100"
                                } mr-3`}
                              >
                                <FaCircleCheck
                                  className={`text-xs ${darkMode ? "text-emerald-400" : "text-emerald-600"}`}
                                />
                              </div>
                            ) : (
                              <div
                                className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                                  darkMode ? "bg-red-900/30" : "bg-red-100"
                                } mr-3`}
                              >
                                <FaRegCircleXmark className={`text-xs ${darkMode ? "text-red-400" : "text-red-600"}`} />
                              </div>
                            )}
                            <span className={`text-sm ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                              {t(feature)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div
            className={`relative overflow-hidden rounded-xl shadow-md backdrop-blur-md mb-6 ${
              darkMode ? "bg-slate-800/70 border border-slate-700/50" : "bg-white/80 border border-blue-100"
            } transform transition-all duration-500 ease-out ${animateIn ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
            style={{ transitionDelay: "300ms" }}
          >
            <div className="relative p-6 text-center">
              <div
                className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
                  darkMode ? "bg-pink-900/30" : "bg-blue-100"
                } mb-4`}
              >
                <IoCheckmarkCircle className={`text-3xl ${darkMode ? "text-pink-400" : "text-blue-600"}`} />
              </div>

              <h3 className={`text-xl font-semibold mb-2 ${darkMode ? "text-white" : "text-slate-800"}`}>
                {t("Satisfação Garantida")}
              </h3>

              <p className={`text-sm mb-4 max-w-2xl mx-auto ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                {t(
                  "Todos os nossos planos incluem 7 dias de garantia. Se você não estiver satisfeito, devolveremos seu dinheiro sem perguntas.",
                )}
              </p>

              <button
                className={`font-medium text-sm hover:underline ${darkMode ? "text-pink-400" : "text-blue-600"}`}
                onClick={() => navigate("/")}
              >
                {t("Voltar para o site")}
              </button>
            </div>
          </div>
        </div>
      </main>

      {selectedPlan !== null && (
        <PaymentModal selectedPlan={plans[selectedPlan]} onClose={() => setSelectedPlan(null)} />
      )}
    </div>
  )
}

export default PlansPage

