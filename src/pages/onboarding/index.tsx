"use client"

import { useState, useContext, useRef, useEffect } from "react"
import {
  IoChevronDown,
  IoChevronUp,
  IoBookOutline,
  IoStatsChartOutline,
  IoPersonAddOutline,
  IoCardOutline,
  IoPersonCircleOutline,
  IoShareSocialOutline,
  IoPencil,
  IoSave,
  IoClose,
  IoCloudUploadOutline,
  IoMailOutline,
  IoPhonePortraitOutline,
  IoCheckmarkCircle,
  IoArrowForward,
  IoCopyOutline,
  IoWalletOutline,
  IoCheckmarkOutline,
  IoBarChartOutline,
  IoTrendingUpOutline,
  IoCalendarOutline,
} from "react-icons/io5"
import Sidebar from "../../components/sidebar"
import { ThemeContext } from "../../utils/ThemeContext.jsx"
import { useTranslation } from "react-i18next"

const TutorialPage = () => {
  const { darkMode } = useContext(ThemeContext)
  const { t } = useTranslation()
  const [openSection, setOpenSection] = useState(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [animateIn, setAnimateIn] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const waveCanvasRef = useRef<HTMLCanvasElement>(null)
  const waveAnimationRef = useRef<number>()

  useEffect(() => {
    setAnimateIn(true)
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

  // Example components for tutorials
  const LifePlanExample = () => {
    return (
      <div className="space-y-6">
        <div
          className={`relative overflow-hidden rounded-xl shadow-md ${
            darkMode ? "bg-slate-800/50 border border-slate-700/50" : "bg-white/90 border border-blue-100"
          } p-5`}
        >
          <div className="flex items-center mb-4">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-lg ${
                darkMode ? "bg-pink-900/30" : "bg-blue-100"
              } mr-3`}
            >
              <IoBookOutline className={`text-xl ${darkMode ? "text-pink-400" : "text-blue-600"}`} />
            </div>
            <h3 className={`text-lg font-semibold ${darkMode ? "text-white" : "text-slate-800"}`}>
              {t("Plano de Vida")}
            </h3>
          </div>

          <div className="space-y-4">
            <div
              className={`p-4 rounded-lg ${
                darkMode ? "bg-slate-700/30 border border-slate-600/30" : "bg-blue-50/50 border border-blue-100"
              }`}
            >
              <div className="flex items-center mb-2">
                <IoCalendarOutline className={`mr-2 ${darkMode ? "text-pink-400" : "text-blue-600"}`} />
                <span className={`font-medium ${darkMode ? "text-white" : "text-slate-800"}`}>
                  {t("Horizonte de planejamento")}
                </span>
                <div
                  className={`ml-auto text-sm font-bold px-3 py-1 rounded-full ${
                    darkMode ? "bg-pink-900/30 text-pink-400" : "bg-blue-100 text-blue-600"
                  }`}
                >
                  5 {t("anos")}
                </div>
              </div>

              <div className="relative h-2 bg-slate-200 dark:bg-slate-700 rounded-full mt-2">
                <div
                  className={`absolute left-0 top-0 h-full rounded-full ${
                    darkMode
                      ? "bg-gradient-to-r from-pink-500 to-purple-600"
                      : "bg-gradient-to-r from-blue-500 to-indigo-600"
                  }`}
                  style={{ width: "25%" }}
                ></div>
                <div
                  className="absolute left-0 top-0 h-4 w-4 -mt-1 rounded-full bg-white border-2 border-blue-500 dark:border-pink-500"
                  style={{ left: "25%" }}
                ></div>
              </div>

              <div className="flex justify-between mt-1 text-xs text-slate-500 dark:text-slate-400">
                <span>2023</span>
                <span>2028</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { icon: IoTrendingUpOutline, label: t("Receitas"), value: "R$ 12.500,00", color: "emerald" },
                { icon: IoWalletOutline, label: t("Custos"), value: "R$ 7.800,00", color: "red" },
                { icon: IoBarChartOutline, label: t("Lucro"), value: "R$ 4.700,00", color: "blue" },
              ].map((item, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg ${
                    darkMode
                      ? index === 0
                        ? "bg-emerald-900/20 border border-emerald-800/30"
                        : index === 1
                          ? "bg-red-900/20 border border-red-800/30"
                          : "bg-blue-900/20 border border-blue-800/30"
                      : index === 0
                        ? "bg-emerald-50 border border-emerald-100"
                        : index === 1
                          ? "bg-red-50 border border-red-100"
                          : "bg-blue-50 border border-blue-100"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <item.icon
                        className={`text-xl mr-2 ${
                          darkMode
                            ? index === 0
                              ? "text-emerald-400"
                              : index === 1
                                ? "text-red-400"
                                : "text-blue-400"
                            : index === 0
                              ? "text-emerald-600"
                              : index === 1
                                ? "text-red-600"
                                : "text-blue-600"
                        }`}
                      />
                      <span
                        className={`text-sm font-medium ${
                          darkMode
                            ? index === 0
                              ? "text-emerald-300"
                              : index === 1
                                ? "text-red-300"
                                : "text-blue-300"
                            : index === 0
                              ? "text-emerald-700"
                              : index === 1
                                ? "text-red-700"
                                : "text-blue-700"
                        }`}
                      >
                        {item.label}
                      </span>
                    </div>
                    <span
                      className={`font-bold ${
                        darkMode
                          ? index === 0
                            ? "text-emerald-300"
                            : index === 1
                              ? "text-red-300"
                              : "text-blue-300"
                          : index === 0
                            ? "text-emerald-700"
                            : index === 1
                              ? "text-red-700"
                              : "text-blue-700"
                      }`}
                    >
                      {item.value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className={`text-sm ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
          {t("Na página do Plano de Vida, você pode:")}
        </p>

        <ul className="space-y-2">
          {[
            t("Definir o horizonte de planejamento (1 a 20 anos)"),
            t("Visualizar e editar suas receitas, custos e investimentos"),
            t("Acompanhar seu lucro/prejuízo mensal"),
            t("Adicionar metas financeiras e pessoais"),
            t("Exportar seus dados em PDF ou CSV"),
          ].map((item, index) => (
            <li key={index} className="flex items-start">
              <div
                className={`flex-shrink-0 mt-1 w-5 h-5 rounded-full flex items-center justify-center ${
                  darkMode ? "bg-pink-900/30" : "bg-blue-100"
                } mr-2`}
              >
                <IoCheckmarkOutline className={`text-xs ${darkMode ? "text-pink-400" : "text-blue-600"}`} />
              </div>
              <span className={`text-sm ${darkMode ? "text-slate-300" : "text-slate-600"}`}>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  const PlansExample = () => {
    const [selectedPlan, setSelectedPlan] = useState(1)
    const [step, setStep] = useState(1)

    const plans = [
      {
        id: 1,
        name: t("Plano Básico"),
        price: "R$ 9,90",
        features: [t("Plano de vida básico"), t("1 usuário"), t("Exportação em PDF")],
      },
      {
        id: 2,
        name: t("Plano Premium"),
        price: "R$ 19,90",
        features: [t("Plano de vida completo"), t("3 usuários"), t("Exportação em PDF e CSV"), t("Gráficos avançados")],
      },
      {
        id: 3,
        name: t("Plano Empresarial"),
        price: "R$ 49,90",
        features: [
          t("Plano de vida completo"),
          t("10 usuários"),
          t("Exportação em todos formatos"),
          t("Gráficos avançados"),
          t("Suporte prioritário"),
        ],
      },
    ]

    return (
      <div className="space-y-6">
        {step === 1 && (
          <>
            <p className={`text-sm ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
              {t("Para contratar um plano ou alterar o seu atual, primeiro selecione o plano desejado:")}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={`relative overflow-hidden rounded-xl p-5 cursor-pointer transition-all duration-300 ${
                    selectedPlan === plan.id
                      ? darkMode
                        ? "bg-pink-900/30 border-2 border-pink-500/50"
                        : "bg-blue-100/80 border-2 border-blue-500/50"
                      : darkMode
                        ? "bg-slate-800/50 border border-slate-700/50 hover:bg-slate-700/50"
                        : "bg-white/90 border border-blue-100 hover:bg-blue-50/50"
                  }`}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  {selectedPlan === plan.id && (
                    <div
                      className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center ${
                        darkMode ? "bg-pink-500" : "bg-blue-500"
                      }`}
                    >
                      <IoCheckmarkOutline className="text-white text-sm" />
                    </div>
                  )}

                  <h3 className={`text-lg font-semibold mb-2 ${darkMode ? "text-white" : "text-slate-800"}`}>
                    {plan.name}
                  </h3>

                  <div
                    className={`text-2xl font-bold mb-4 ${
                      darkMode
                        ? selectedPlan === plan.id
                          ? "text-pink-400"
                          : "text-slate-300"
                        : selectedPlan === plan.id
                          ? "text-blue-600"
                          : "text-slate-700"
                    }`}
                  >
                    {plan.price}
                    <span className={`text-sm font-normal ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                      /mês
                    </span>
                  </div>

                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <div
                          className={`flex-shrink-0 mt-0.5 w-4 h-4 rounded-full flex items-center justify-center ${
                            darkMode ? "bg-pink-900/50" : "bg-blue-100"
                          } mr-2`}
                        >
                          <IoCheckmarkOutline className={`text-xs ${darkMode ? "text-pink-400" : "text-blue-600"}`} />
                        </div>
                        <span className={`text-sm ${darkMode ? "text-slate-300" : "text-slate-600"}`}>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="flex justify-end mt-4">
              <button
                className={`group relative flex items-center justify-center py-2.5 px-5 rounded-lg font-medium text-sm text-white overflow-hidden transition-all duration-300`}
                onClick={() => setStep(2)}
              >
                <div
                  className={`absolute inset-0 ${
                    darkMode
                      ? "bg-gradient-to-r from-pink-600 to-purple-600"
                      : "bg-gradient-to-r from-blue-600 to-indigo-600"
                  } transition-transform duration-300 group-hover:scale-105`}
                ></div>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-white transition-opacity duration-300"></div>
                <span className="relative z-10 flex items-center">
                  {t("Realizar pagamento")}
                  <IoArrowForward className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div
              className={`relative overflow-hidden rounded-xl shadow-md ${
                darkMode ? "bg-slate-800/50 border border-slate-700/50" : "bg-white/90 border border-blue-100"
              } p-5`}
            >
              <h3 className={`text-lg font-semibold mb-4 ${darkMode ? "text-white" : "text-slate-800"}`}>
                {t("Página de Pagamento")}
              </h3>

              <div className="space-y-4">
                <div
                  className={`p-4 rounded-lg ${
                    darkMode ? "bg-slate-700/30 border border-slate-600/30" : "bg-blue-50/50 border border-blue-100"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`font-medium ${darkMode ? "text-white" : "text-slate-800"}`}>
                      {plans.find((p) => p.id === selectedPlan)?.name}
                    </span>
                    <span className={`font-bold ${darkMode ? "text-pink-400" : "text-blue-600"}`}>
                      {plans.find((p) => p.id === selectedPlan)?.price}/mês
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div
                    className={`p-4 rounded-lg ${
                      darkMode ? "bg-slate-700/30 border border-slate-600/30" : "bg-slate-50 border border-slate-200"
                    }`}
                  >
                    <h4 className={`text-sm font-medium mb-3 ${darkMode ? "text-white" : "text-slate-800"}`}>
                      {t("Cartão de Crédito")}
                    </h4>

                    <div className="space-y-3">
                      <div className={`h-10 rounded-lg ${darkMode ? "bg-slate-600/50" : "bg-white"}`}></div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className={`h-10 rounded-lg ${darkMode ? "bg-slate-600/50" : "bg-white"}`}></div>
                        <div className={`h-10 rounded-lg ${darkMode ? "bg-slate-600/50" : "bg-white"}`}></div>
                      </div>
                      <div className={`h-10 rounded-lg ${darkMode ? "bg-slate-600/50" : "bg-white"}`}></div>
                    </div>
                  </div>

                  <div
                    className={`p-4 rounded-lg ${
                      darkMode ? "bg-slate-700/30 border border-slate-600/30" : "bg-slate-50 border border-slate-200"
                    }`}
                  >
                    <h4 className={`text-sm font-medium mb-3 ${darkMode ? "text-white" : "text-slate-800"}`}>
                      {t("Boleto Bancário")}
                    </h4>

                    <div
                      className={`h-32 rounded-lg flex items-center justify-center ${
                        darkMode ? "bg-slate-600/50" : "bg-white"
                      }`}
                    >
                      <div className={`text-center ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                        <IoWalletOutline className="text-3xl mx-auto mb-2" />
                        <span className="text-sm">{t("Gerar boleto")}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <button
                  className={`flex items-center justify-center py-2.5 px-5 rounded-lg font-medium text-sm transition-colors ${
                    darkMode
                      ? "bg-slate-700/50 text-slate-300 hover:bg-slate-700 border border-slate-600/50"
                      : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                  }`}
                  onClick={() => setStep(1)}
                >
                  {t("Voltar")}
                </button>

                <button
                  className={`group relative flex items-center justify-center py-2.5 px-5 rounded-lg font-medium text-sm text-white overflow-hidden transition-all duration-300`}
                  onClick={() => setStep(3)}
                >
                  <div
                    className={`absolute inset-0 ${
                      darkMode
                        ? "bg-gradient-to-r from-pink-600 to-purple-600"
                        : "bg-gradient-to-r from-blue-600 to-indigo-600"
                    } transition-transform duration-300 group-hover:scale-105`}
                  ></div>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-white transition-opacity duration-300"></div>
                  <span className="relative z-10 flex items-center">{t("Finalizar Pagamento")}</span>
                </button>
              </div>
            </div>
          </>
        )}

        {step === 3 && (
          <div
            className={`relative overflow-hidden rounded-xl shadow-md ${
              darkMode ? "bg-slate-800/50 border border-slate-700/50" : "bg-white/90 border border-blue-100"
            } p-6 text-center`}
          >
            <div
              className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
                darkMode ? "bg-emerald-900/30" : "bg-emerald-100"
              } mb-4`}
            >
              <IoCheckmarkCircle className={`text-3xl ${darkMode ? "text-emerald-400" : "text-emerald-600"}`} />
            </div>

            <h3 className={`text-xl font-semibold mb-2 ${darkMode ? "text-white" : "text-slate-800"}`}>
              {t("Pagamento Bem-Sucedido!")}
            </h3>

            <p className={`text-sm mb-6 ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
              {t("Seu plano")} <strong>{plans.find((p) => p.id === selectedPlan)?.name}</strong>{" "}
              {t("foi ativado com sucesso. Aproveite todos os recursos disponíveis!")}
            </p>

            <button
              className={`group relative flex items-center justify-center py-2.5 px-5 rounded-lg font-medium text-sm text-white overflow-hidden transition-all duration-300 mx-auto`}
              onClick={() => setStep(1)}
            >
              <div
                className={`absolute inset-0 ${
                  darkMode
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600"
                    : "bg-gradient-to-r from-emerald-600 to-teal-600"
                } transition-transform duration-300 group-hover:scale-105`}
              ></div>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-white transition-opacity duration-300"></div>
              <span className="relative z-10 flex items-center">{t("Voltar para Planos")}</span>
            </button>
          </div>
        )}
      </div>
    )
  }

  const GraphicsExample = () => {
    return (
      <div className="space-y-6">
        <div
          className={`relative overflow-hidden rounded-xl shadow-md ${
            darkMode ? "bg-slate-800/50 border border-slate-700/50" : "bg-white/90 border border-blue-100"
          } p-5`}
        >
          <div className="flex items-center mb-4">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-lg ${
                darkMode ? "bg-pink-900/30" : "bg-blue-100"
              } mr-3`}
            >
              <IoStatsChartOutline className={`text-xl ${darkMode ? "text-pink-400" : "text-blue-600"}`} />
            </div>
            <h3 className={`text-lg font-semibold ${darkMode ? "text-white" : "text-slate-800"}`}>
              {t("Gráficos e Relatórios")}
            </h3>
          </div>

          <div className="space-y-4">
            <div
              className={`p-4 rounded-lg ${
                darkMode ? "bg-slate-700/30 border border-slate-600/30" : "bg-blue-50/50 border border-blue-100"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className={`font-medium ${darkMode ? "text-white" : "text-slate-800"}`}>
                  {t("Evolução Financeira")}
                </h4>
                <div className="flex space-x-2">
                  <div className={`flex items-center ${darkMode ? "text-emerald-400" : "text-emerald-600"}`}>
                    <div
                      className={`w-3 h-3 rounded-full ${darkMode ? "bg-emerald-400" : "bg-emerald-600"} mr-1`}
                    ></div>
                    <span className="text-xs">{t("Receitas")}</span>
                  </div>
                  <div className={`flex items-center ${darkMode ? "text-red-400" : "text-red-600"}`}>
                    <div className={`w-3 h-3 rounded-full ${darkMode ? "bg-red-400" : "bg-red-600"} mr-1`}></div>
                    <span className="text-xs">{t("Custos")}</span>
                  </div>
                </div>
              </div>

              <div className="h-40 relative">
                {/* Simulated chart */}
                <div className="absolute inset-0">
                  <div className="absolute bottom-0 left-0 w-full h-px bg-slate-300 dark:bg-slate-600"></div>
                  <div className="absolute left-0 top-0 h-full w-px bg-slate-300 dark:bg-slate-600"></div>

                  {/* Chart bars */}
                  <div className="absolute bottom-0 left-[10%] flex space-x-1">
                    <div
                      className={`w-4 ${darkMode ? "bg-emerald-400" : "bg-emerald-500"} rounded-t-sm`}
                      style={{ height: "60%" }}
                    ></div>
                    <div
                      className={`w-4 ${darkMode ? "bg-red-400" : "bg-red-500"} rounded-t-sm`}
                      style={{ height: "40%" }}
                    ></div>
                  </div>

                  <div className="absolute bottom-0 left-[30%] flex space-x-1">
                    <div
                      className={`w-4 ${darkMode ? "bg-emerald-400" : "bg-emerald-500"} rounded-t-sm`}
                      style={{ height: "70%" }}
                    ></div>
                    <div
                      className={`w-4 ${darkMode ? "bg-red-400" : "bg-red-500"} rounded-t-sm`}
                      style={{ height: "45%" }}
                    ></div>
                  </div>

                  <div className="absolute bottom-0 left-[50%] flex space-x-1">
                    <div
                      className={`w-4 ${darkMode ? "bg-emerald-400" : "bg-emerald-500"} rounded-t-sm`}
                      style={{ height: "80%" }}
                    ></div>
                    <div
                      className={`w-4 ${darkMode ? "bg-red-400" : "bg-red-500"} rounded-t-sm`}
                      style={{ height: "50%" }}
                    ></div>
                  </div>

                  <div className="absolute bottom-0 left-[70%] flex space-x-1">
                    <div
                      className={`w-4 ${darkMode ? "bg-emerald-400" : "bg-emerald-500"} rounded-t-sm`}
                      style={{ height: "90%" }}
                    ></div>
                    <div
                      className={`w-4 ${darkMode ? "bg-red-400" : "bg-red-500"} rounded-t-sm`}
                      style={{ height: "55%" }}
                    ></div>
                  </div>

                  <div className="absolute bottom-0 left-[90%] flex space-x-1">
                    <div
                      className={`w-4 ${darkMode ? "bg-emerald-400" : "bg-emerald-500"} rounded-t-sm`}
                      style={{ height: "95%" }}
                    ></div>
                    <div
                      className={`w-4 ${darkMode ? "bg-red-400" : "bg-red-500"} rounded-t-sm`}
                      style={{ height: "60%" }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-2 text-xs text-slate-500 dark:text-slate-400">
                <span>Jan</span>
                <span>Mar</span>
                <span>Jun</span>
                <span>Set</span>
                <span>Dez</span>
              </div>
            </div>

            <div
              className={`p-4 rounded-lg ${
                darkMode ? "bg-slate-700/30 border border-slate-600/30" : "bg-blue-50/50 border border-blue-100"
              }`}
            >
              <h4 className={`font-medium mb-3 ${darkMode ? "text-white" : "text-slate-800"}`}>
                {t("Distribuição de Investimentos")}
              </h4>

              <div className="flex items-center">
                <div className="w-24 h-24 relative mr-4">
                  {/* Simulated pie chart */}
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <circle cx="50" cy="50" r="45" fill={darkMode ? "#1e293b" : "#f1f5f9"} />
                    <path d="M50,50 L50,5 A45,45 0 0,1 95,50 Z" fill={darkMode ? "#ec4899" : "#3b82f6"} />
                    <path d="M50,50 L95,50 A45,45 0 0,1 50,95 Z" fill={darkMode ? "#8b5cf6" : "#6366f1"} />
                    <path d="M50,50 L50,95 A45,45 0 0,1 5,50 Z" fill={darkMode ? "#f43f5e" : "#ef4444"} />
                    <path d="M50,50 L5,50 A45,45 0 0,1 50,5 Z" fill={darkMode ? "#10b981" : "#10b981"} />
                    <circle cx="50" cy="50" r="25" fill={darkMode ? "#1e293b" : "#f1f5f9"} />
                  </svg>
                </div>

                <div className="flex-grow grid grid-cols-2 gap-2">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full ${darkMode ? "bg-pink-500" : "bg-blue-500"} mr-2`}></div>
                    <span className={`text-xs ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                      {t("Reserva")}: 30%
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full ${darkMode ? "bg-purple-500" : "bg-indigo-500"} mr-2`}></div>
                    <span className={`text-xs ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                      {t("Ações")}: 25%
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full ${darkMode ? "bg-red-500" : "bg-red-500"} mr-2`}></div>
                    <span className={`text-xs ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                      {t("Imóveis")}: 25%
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div
                      className={`w-3 h-3 rounded-full ${darkMode ? "bg-emerald-500" : "bg-emerald-500"} mr-2`}
                    ></div>
                    <span className={`text-xs ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                      {t("Outros")}: 20%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className={`text-sm ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
          {t("Na seção de Gráficos, você pode:")}
        </p>

        <ul className="space-y-2">
          {[
            t("Visualizar a evolução das suas receitas e despesas"),
            t("Analisar a distribuição dos seus investimentos"),
            t("Comparar seu desempenho com períodos anteriores"),
            t("Exportar relatórios detalhados"),
            t("Configurar alertas para metas financeiras"),
          ].map((item, index) => (
            <li key={index} className="flex items-start">
              <div
                className={`flex-shrink-0 mt-1 w-5 h-5 rounded-full flex items-center justify-center ${
                  darkMode ? "bg-pink-900/30" : "bg-blue-100"
                } mr-2`}
              >
                <IoCheckmarkOutline className={`text-xs ${darkMode ? "text-pink-400" : "text-blue-600"}`} />
              </div>
              <span className={`text-sm ${darkMode ? "text-slate-300" : "text-slate-600"}`}>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  const InviteExample = () => {
    const [copied, setCopied] = useState(false)

    const handleCopy = () => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }

    return (
      <div className="space-y-6">
        <div
          className={`relative overflow-hidden rounded-xl shadow-md ${
            darkMode ? "bg-slate-800/50 border border-slate-700/50" : "bg-white/90 border border-blue-100"
          } p-5`}
        >
          <div className="flex items-center mb-4">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-lg ${
                darkMode ? "bg-pink-900/30" : "bg-blue-100"
              } mr-3`}
            >
              <IoShareSocialOutline className={`text-xl ${darkMode ? "text-pink-400" : "text-blue-600"}`} />
            </div>
            <h3 className={`text-lg font-semibold ${darkMode ? "text-white" : "text-slate-800"}`}>
              {t("Programa de Indicação")}
            </h3>
          </div>

          <p className={`mb-4 text-sm ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
            {t("Convide seus amigos para criarem um plano de vida e ganhe bônus.")}
          </p>

          <div
            className={`p-4 rounded-lg mb-4 ${
              darkMode ? "bg-slate-700/30 border border-slate-600/30" : "bg-blue-50/50 border border-blue-100"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm font-medium ${darkMode ? "text-white" : "text-slate-800"}`}>
                {t("Seu link de indicação")}
              </span>
              <span className={`text-xs ${darkMode ? "text-pink-400" : "text-blue-600"}`}>3 {t("pessoas usaram")}</span>
            </div>

            <div className="relative">
              <input
                type="text"
                className={`w-full pl-4 pr-12 py-3 rounded-lg transition-colors ${
                  darkMode
                    ? "bg-slate-800/70 text-white border border-slate-600/50"
                    : "bg-white text-slate-800 border border-slate-200"
                } focus:outline-none cursor-not-allowed`}
                value="https://planodevida.com/register/ABC123"
                readOnly
              />
              <button
                type="button"
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-md transition-colors ${
                  darkMode
                    ? "bg-slate-700 hover:bg-slate-600 text-slate-300"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                }`}
                onClick={handleCopy}
                title={t("Copiar link")}
              >
                {copied ? <IoCheckmarkOutline /> : <IoCopyOutline />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            <div
              className={`p-4 rounded-lg ${
                darkMode ? "bg-slate-700/30 border border-slate-600/30" : "bg-blue-50/50 border border-blue-100"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                  darkMode ? "bg-pink-900/30" : "bg-blue-100"
                }`}
              >
                <span className={`text-lg font-bold ${darkMode ? "text-pink-400" : "text-blue-600"}`}>1</span>
              </div>
              <h4 className={`text-sm font-medium mb-1 ${darkMode ? "text-white" : "text-slate-800"}`}>
                {t("Copie seu link")}
              </h4>
              <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                {t("Acesse a página de configurações e copie seu link único")}
              </p>
            </div>

            <div
              className={`p-4 rounded-lg ${
                darkMode ? "bg-slate-700/30 border border-slate-600/30" : "bg-blue-50/50 border border-blue-100"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                  darkMode ? "bg-pink-900/30" : "bg-blue-100"
                }`}
              >
                <span className={`text-lg font-bold ${darkMode ? "text-pink-400" : "text-blue-600"}`}>2</span>
              </div>
              <h4 className={`text-sm font-medium mb-1 ${darkMode ? "text-white" : "text-slate-800"}`}>
                {t("Compartilhe")}
              </h4>
              <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                {t("Envie para amigos por e-mail, WhatsApp ou redes sociais")}
              </p>
            </div>

            <div
              className={`p-4 rounded-lg ${
                darkMode ? "bg-slate-700/30 border border-slate-600/30" : "bg-blue-50/50 border border-blue-100"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                  darkMode ? "bg-pink-900/30" : "bg-blue-100"
                }`}
              >
                <span className={`text-lg font-bold ${darkMode ? "text-pink-400" : "text-blue-600"}`}>3</span>
              </div>
              <h4 className={`text-sm font-medium mb-1 ${darkMode ? "text-white" : "text-slate-800"}`}>
                {t("Ganhe bônus")}
              </h4>
              <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                {t("Receba pontos para cada amigo que se cadastrar")}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              className={`group relative flex items-center justify-center py-3 px-4 rounded-lg font-medium text-sm text-white overflow-hidden transition-all duration-300 flex-1`}
            >
              <div
                className={`absolute inset-0 ${
                  darkMode
                    ? "bg-gradient-to-r from-pink-600 to-purple-600"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600"
                } transition-transform duration-300 group-hover:scale-105`}
              ></div>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-white transition-opacity duration-300"></div>
              <span className="relative z-10 flex items-center">{t("Retirar bônus")}</span>
            </button>
          </div>
        </div>

        <p className={`text-sm ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
          {t("Como funciona o programa de indicação:")}
        </p>

        <ul className="space-y-2">
          {[
            t("Para cada amigo que se cadastrar usando seu link, você ganha 10 pontos"),
            t("Quando seu amigo assinar um plano pago, você ganha 50 pontos adicionais"),
            t("Acumule 100 pontos para ganhar 1 mês grátis do seu plano atual"),
            t("Acumule 300 pontos para ganhar 3 meses grátis do seu plano atual"),
            t("Você pode acompanhar seus pontos na página de configurações"),
          ].map((item, index) => (
            <li key={index} className="flex items-start">
              <div
                className={`flex-shrink-0 mt-1 w-5 h-5 rounded-full flex items-center justify-center ${
                  darkMode ? "bg-pink-900/30" : "bg-blue-100"
                } mr-2`}
              >
                <IoCheckmarkOutline className={`text-xs ${darkMode ? "text-pink-400" : "text-blue-600"}`} />
              </div>
              <span className={`text-sm ${darkMode ? "text-slate-300" : "text-slate-600"}`}>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  const EditInfoExample = () => {
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState({
      nomeCompleto: "João Silva",
      telefone: "(51) 99999-9999",
      email: "joao.silva@email.com",
    })

    return (
      <div className="space-y-6">
        <div
          className={`relative overflow-hidden rounded-xl shadow-md ${
            darkMode ? "bg-slate-800/50 border border-slate-700/50" : "bg-white/90 border border-blue-100"
          } p-5`}
        >
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/3">
              <div
                className={`relative overflow-hidden rounded-xl shadow-md backdrop-blur-md ${
                  darkMode ? "bg-slate-800/50 border border-slate-700/50" : "bg-white/90 border border-blue-100"
                }`}
              >
                <div className="p-6 flex flex-col items-center">
                  <div className="relative group">
                    <div
                      className={`w-32 h-32 rounded-full overflow-hidden border-4 ${
                        darkMode ? "border-pink-500/30" : "border-blue-500/30"
                      } transition-all duration-300 group-hover:border-opacity-100`}
                    >
                      <div className="w-full h-full bg-slate-300 dark:bg-slate-600 flex items-center justify-center">
                        <IoPersonCircleOutline className="text-5xl text-slate-400 dark:text-slate-500" />
                      </div>
                    </div>
                    <div
                      className={`absolute inset-0 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                        darkMode ? "bg-slate-900/70" : "bg-slate-700/50"
                      }`}
                    >
                      <div className="cursor-pointer flex items-center justify-center w-full h-full">
                        <IoCloudUploadOutline className="text-3xl text-white" />
                      </div>
                    </div>
                  </div>
                  <h2 className={`mt-4 text-lg font-semibold ${darkMode ? "text-white" : "text-slate-800"}`}>
                    {formData.nomeCompleto}
                  </h2>
                  <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>{formData.email}</p>
                  <button
                    className={`mt-4 flex items-center justify-center py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer ${
                      darkMode
                        ? "bg-pink-900/30 text-pink-400 hover:bg-pink-900/50 border border-pink-800/30"
                        : "bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200"
                    }`}
                  >
                    <IoCloudUploadOutline className="mr-2" />
                    {t("Alterar foto")}
                  </button>
                  <p className={`mt-3 text-xs text-center ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
                    {t("A foto deve ter pelo menos 800x800px. JPG ou PNG são permitidos.")}
                  </p>
                </div>
              </div>
            </div>

            <div className="w-full md:w-2/3 space-y-6">
              <div
                className={`relative overflow-hidden rounded-xl shadow-md backdrop-blur-md ${
                  darkMode ? "bg-slate-800/50 border border-slate-700/50" : "bg-white/90 border border-blue-100"
                }`}
              >
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3
                      className={`text-lg font-semibold flex items-center ${darkMode ? "text-white" : "text-slate-800"}`}
                    >
                      <IoPersonCircleOutline className={`mr-2 ${darkMode ? "text-pink-400" : "text-blue-600"}`} />
                      {t("Informações pessoais")}
                    </h3>

                    <button
                      type="button"
                      className={`group flex items-center justify-center py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
                        isEditing
                          ? darkMode
                            ? "bg-emerald-900/30 text-emerald-400 hover:bg-emerald-900/50 border border-emerald-800/30"
                            : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                          : darkMode
                            ? "bg-pink-900/30 text-pink-400 hover:bg-pink-900/50 border border-pink-800/30"
                            : "bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200"
                      }`}
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      {isEditing ? <IoSave className="mr-2" /> : <IoPencil className="mr-2" />}
                      <span>{isEditing ? t("Salvar") : t("Editar")}</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label
                        className={`block mb-2 text-sm font-medium ${darkMode ? "text-slate-300" : "text-slate-700"}`}
                      >
                        {t("Nome completo")}
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          className={`w-full px-4 py-3 rounded-lg transition-colors ${
                            darkMode
                              ? "bg-slate-700/50 text-white border border-slate-600/50 focus:border-pink-500/50"
                              : "bg-white text-slate-800 border border-slate-200 focus:border-blue-300"
                          } focus:outline-none`}
                          value={formData.nomeCompleto}
                          onChange={(e) => setFormData({ ...formData, nomeCompleto: e.target.value })}
                        />
                      ) : (
                        <div
                          className={`px-4 py-3 rounded-lg ${
                            darkMode ? "bg-slate-700/30 text-white" : "bg-slate-50 text-slate-800"
                          }`}
                        >
                          {formData.nomeCompleto}
                        </div>
                      )}
                    </div>

                    <div>
                      <label
                        className={`block mb-2 text-sm font-medium ${darkMode ? "text-slate-300" : "text-slate-700"}`}
                      >
                        {t("Telefone")}
                      </label>
                      {isEditing ? (
                        <div className="relative">
                          <div
                            className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${
                              darkMode ? "text-slate-400" : "text-slate-500"
                            }`}
                          >
                            <IoPhonePortraitOutline />
                          </div>
                          <input
                            type="text"
                            className={`w-full pl-10 pr-4 py-3 rounded-lg transition-colors ${
                              darkMode
                                ? "bg-slate-700/50 text-white border border-slate-600/50 focus:border-pink-500/50"
                                : "bg-white text-slate-800 border border-slate-200 focus:border-blue-300"
                            } focus:outline-none`}
                            value={formData.telefone}
                            onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                          />
                        </div>
                      ) : (
                        <div
                          className={`px-4 py-3 rounded-lg flex items-center ${
                            darkMode ? "bg-slate-700/30 text-white" : "bg-slate-50 text-slate-800"
                          }`}
                        >
                          <IoPhonePortraitOutline
                            className={`mr-2 ${darkMode ? "text-slate-400" : "text-slate-500"}`}
                          />
                          {formData.telefone}
                        </div>
                      )}
                    </div>

                    <div>
                      <label
                        className={`block mb-2 text-sm font-medium ${darkMode ? "text-slate-300" : "text-slate-700"}`}
                      >
                        {t("E-mail")}
                      </label>
                      {isEditing ? (
                        <div className="relative">
                          <div
                            className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${
                              darkMode ? "text-slate-400" : "text-slate-500"
                            }`}
                          >
                            <IoMailOutline />
                          </div>
                          <input
                            type="email"
                            className={`w-full pl-10 pr-4 py-3 rounded-lg transition-colors ${
                              darkMode
                                ? "bg-slate-700/50 text-white border border-slate-600/50 focus:border-pink-500/50"
                                : "bg-white text-slate-800 border border-slate-200 focus:border-blue-300"
                            } focus:outline-none`}
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          />
                        </div>
                      ) : (
                        <div
                          className={`px-4 py-3 rounded-lg flex items-center ${
                            darkMode ? "bg-slate-700/30 text-white" : "bg-slate-50 text-slate-800"
                          }`}
                        >
                          <IoMailOutline className={`mr-2 ${darkMode ? "text-slate-400" : "text-slate-500"}`} />
                          {formData.email}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    className={`flex items-center justify-center py-2.5 px-5 rounded-lg font-medium text-sm transition-colors ${
                      darkMode
                        ? "bg-slate-700/50 text-slate-300 hover:bg-slate-700 border border-slate-600/50"
                        : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                    }`}
                    onClick={() => setIsEditing(false)}
                  >
                    <IoClose className="mr-2" />
                    {t("Cancelar")}
                  </button>

                  <button
                    type="button"
                    className={`group relative flex items-center justify-center py-2.5 px-5 rounded-lg font-medium text-sm text-white overflow-hidden transition-all duration-300`}
                    onClick={() => setIsEditing(false)}
                  >
                    <div
                      className={`absolute inset-0 ${
                        darkMode
                          ? "bg-gradient-to-r from-emerald-600 to-teal-600"
                          : "bg-gradient-to-r from-emerald-600 to-teal-600"
                      } transition-transform duration-300 group-hover:scale-105`}
                    ></div>
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-white transition-opacity duration-300"></div>
                    <span className="relative z-10 flex items-center">
                      <IoSave className="mr-2" />
                      {t("Salvar Alterações")}
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <p className={`text-sm ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
          {t("Como alterar suas informações pessoais:")}
        </p>

        <ul className="space-y-2">
          {[
            t("Clique no botão 'Editar' no canto superior direito da seção de informações pessoais"),
            t("Modifique os campos que deseja alterar (nome, telefone, e-mail)"),
            t("Clique em 'Salvar' para confirmar as alterações ou 'Cancelar' para descartar"),
            t("Para alterar sua foto de perfil, clique no botão 'Alterar foto' abaixo da imagem"),
            t("Selecione uma nova imagem do seu computador (formatos JPG ou PNG recomendados)"),
          ].map((item, index) => (
            <li key={index} className="flex items-start">
              <div
                className={`flex-shrink-0 mt-1 w-5 h-5 rounded-full flex items-center justify-center ${
                  darkMode ? "bg-pink-900/30" : "bg-blue-100"
                } mr-2`}
              >
                <IoCheckmarkOutline className={`text-xs ${darkMode ? "text-pink-400" : "text-blue-600"}`} />
              </div>
              <span className={`text-sm ${darkMode ? "text-slate-300" : "text-slate-600"}`}>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  const tutorials = [
    {
      id: 1,
      title: t("Plano de Vida"),
      description: t(
        "Aprenda como gerenciar seu Plano de Vida, organizar suas metas e seguir um planejamento eficiente.",
      ),
      icon: IoBookOutline,
      content: <LifePlanExample />,
    },
    {
      id: 2,
      title: t("Planos"),
      description: t("Saiba como contratar um plano ou alterar o seu atual."),
      icon: IoCardOutline,
      content: <PlansExample />,
    },
    {
      id: 3,
      title: t("Gráficos"),
      description: t("Veja como acessar gráficos e relatórios detalhados para acompanhar seu progresso."),
      icon: IoStatsChartOutline,
      content: <GraphicsExample />,
    },
    {
      id: 4,
      title: t("Invite de Usuários"),
      description: t("Convide outros usuários para participar e compartilhar seus planos de vida com eles."),
      icon: IoPersonAddOutline,
      content: <InviteExample />,
    },
    {
      id: 5,
      title: t("Alterar Informações Pessoais"),
      description: t("Veja como alterar suas informações pessoais, como foto, nome, telefone e email."),
      icon: IoPersonCircleOutline,
      content: <EditInfoExample />,
    },
  ]

  const toggleSection = (id) => {
    setOpenSection(openSection === id ? null : id)
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
        <div className="max-w-4xl mx-auto">
          <div
            className={`relative overflow-hidden rounded-2xl shadow-xl backdrop-blur-md mb-6 ${
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
              <h1
                className={`text-2xl md:text-3xl font-bold mb-2 text-center ${darkMode ? "text-white" : "text-slate-800"}`}
              >
                {t("Como usar o Sistema Plano de Vida")}
              </h1>
              <p className={`text-center mb-6 ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                {t("Guias e tutoriais para aproveitar ao máximo todas as funcionalidades")}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {tutorials.map((tutorial, index) => (
              <div
                key={tutorial.id}
                className={`transform transition-all duration-500 ease-out ${animateIn ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div
                  className={`relative overflow-hidden rounded-xl shadow-md backdrop-blur-md ${
                    darkMode ? "bg-slate-800/70 border border-slate-700/50" : "bg-white/80 border border-blue-100"
                  }`}
                >
                  <button
                    className="w-full text-left p-5 focus:outline-none"
                    onClick={() => toggleSection(tutorial.id)}
                    aria-expanded={openSection === tutorial.id}
                    aria-controls={`content-${tutorial.id}`}
                  >
                    <div className="flex items-start">
                      <div
                        className={`flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-lg ${
                          darkMode ? "bg-pink-900/30" : "bg-blue-100"
                        } mr-4`}
                      >
                        <tutorial.icon className={`text-xl ${darkMode ? "text-pink-400" : "text-blue-600"}`} />
                      </div>
                      <div className="flex-grow">
                        <h2 className={`text-lg font-semibold ${darkMode ? "text-white" : "text-slate-800"}`}>
                          {tutorial.title}
                        </h2>
                        <p className={`text-sm mt-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                          {tutorial.description}
                        </p>
                      </div>
                      <div className="flex-shrink-0 ml-4 flex items-center">
                        <div
                          className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
                            darkMode ? "bg-slate-700/50 text-slate-300" : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {openSection === tutorial.id ? <IoChevronUp /> : <IoChevronDown />}
                        </div>
                      </div>
                    </div>
                  </button>

                  <div
                    id={`content-${tutorial.id}`}
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${
                      openSection === tutorial.id ? "max-h-[5000px] opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className={`p-5 border-t ${darkMode ? "border-slate-700/50" : "border-slate-200/50"}`}>
                      {tutorial.content}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

export default TutorialPage

