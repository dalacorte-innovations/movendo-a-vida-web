"use client"

import { useState, useEffect, useContext, useRef } from "react"
import Sidebar from "../../components/sidebar"
import { ThemeContext } from "../../utils/ThemeContext.jsx"
import { configBackendConnection, endpoints, getAuthHeaders } from "../../utils/backendConnection"
import { toast } from "react-toastify"
import { useNavigate, useParams } from "react-router-dom"
import {
  IoCaretBack,
  IoCaretForward,
  IoRocketSharp,
  IoTimeOutline,
  IoSparkles,
  IoLeafOutline,
  IoCompassOutline,
  IoStarOutline,
} from "react-icons/io5"
import { useTranslation } from "react-i18next"
import Slider from "@mui/material/Slider"
import { Typography } from "@mui/material"
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinnerNotTimer.jsx"

interface Plan {
  name: string
  term: number
}

const LifePlanPage = () => {
  const { darkMode } = useContext(ThemeContext)
  const navigate = useNavigate()
  const { id } = useParams()
  const { t } = useTranslation()
  const [plan, setPlan] = useState<Plan>({ name: "", term: 1 })
  const [isLoading, setIsLoading] = useState(false)
  const [animateIn, setAnimateIn] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const waveCanvasRef = useRef<HTMLCanvasElement>(null)
  const waveAnimationRef = useRef<number>()

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

  useEffect(() => {
    setAnimateIn(true)

    if (id) {
      const fetchPlanDetails = async () => {
        try {
          const response = await fetch(`${configBackendConnection.baseURL}/${endpoints.lifePlanAPI}${id}/`, {
            method: "GET",
            headers: getAuthHeaders(),
          })
          if (!response.ok) throw new Error(t("Erro ao carregar o plano de vida"))
          const data = await response.json()
          setPlan(data)
        } catch (error) {
          console.error(error)
        }
      }
      fetchPlanDetails()
    }
  }, [id])

  const handleSubmitPlan = async () => {
    if (!plan.name) {
      toast.error(t("O nome do plano é obrigatório"))
      return
    }

    try {
      setIsLoading(true)
      const method = id ? "PATCH" : "POST"
      const url = id
        ? `${configBackendConnection.baseURL}/${endpoints.lifePlanAPI}${id}/`
        : `${configBackendConnection.baseURL}/${endpoints.lifePlanAPI}`

      const currentYear = new Date().getFullYear()
      const years = Array.from({ length: plan.term }, (_, i) => currentYear + i)

      const payload = id ? { name: plan.name } : { name: plan.name, years }

      const response = await fetch(url, {
        method,
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error(id ? t("Erro ao atualizar o plano de vida") : t("Erro ao criar o plano de vida"))
      }

      const data = await response.json()
      toast.success(id ? t("Plano de vida atualizado com sucesso!") : t("Plano de vida criado com sucesso!"))
      navigate(`/life-plan/${data.id}/table`, { state: { plan: data } })
    } catch (error) {
      console.error(error)
      toast.error(id ? t("Erro ao atualizar o plano de vida.") : t("Erro ao criar o plano de vida."))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={`flex h-screen overflow-hidden ${darkMode ? "bg-[#0F172A]" : "bg-[#f0f7ff]"}`}>
      <Sidebar />
      <LoadingSpinner isLoading={isLoading} />

      <canvas ref={waveCanvasRef} className="fixed inset-0 pointer-events-none z-0" />

      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />
      <div className="flex-grow flex items-center justify-center p-4 sm:p-8 relative z-10">
        <div
          className={`w-full max-w-md transform transition-all duration-700 ease-out ${animateIn ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
        >
          <div
            className={`relative overflow-hidden rounded-2xl shadow-xl backdrop-blur-md ${
              darkMode ? "bg-slate-800/70 border border-slate-700/50" : "bg-white/80 border border-blue-100"
            }`}
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

            <div className="relative p-6 sm:p-8">
              <div className="absolute right-6 top-6 opacity-10 pointer-events-none">
                <div className="relative w-40 h-40">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      className={`w-32 h-32 rounded-full border-4 border-dashed ${
                        darkMode ? "border-pink-500/30" : "border-blue-500/30"
                      } animate-[spin_20s_linear_infinite]`}
                    />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      className={`w-24 h-24 rounded-full border-4 border-dashed ${
                        darkMode ? "border-purple-500/30" : "border-indigo-500/30"
                      } animate-[spin_15s_linear_infinite_reverse]`}
                    />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      className={`w-16 h-16 rounded-full border-4 border-dashed ${
                        darkMode ? "border-violet-500/30" : "border-sky-500/30"
                      } animate-[spin_10s_linear_infinite]`}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center mb-8">
                <div
                  className={`relative flex items-center justify-center w-14 h-14 rounded-2xl ${
                    darkMode ? "bg-pink-900/30" : "bg-blue-100"
                  } mr-4 overflow-hidden group`}
                >
                  <div
                    className={`absolute inset-0 ${
                      darkMode
                        ? "bg-gradient-to-br from-pink-500 to-purple-600"
                        : "bg-gradient-to-br from-blue-500 to-indigo-600"
                    } opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  />
                  <IoCompassOutline
                    className={`text-2xl relative z-10 ${
                      darkMode ? "text-pink-400 group-hover:text-white" : "text-blue-600 group-hover:text-white"
                    } transition-colors duration-500`}
                  />
                  <div
                    className={`absolute -inset-1 ${
                      darkMode
                        ? "bg-gradient-to-r from-pink-500 to-purple-600"
                        : "bg-gradient-to-r from-blue-500 to-indigo-600"
                    } blur opacity-30 group-hover:opacity-70 transition-opacity duration-500`}
                  />
                </div>
                <div>
                  <h1 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-slate-800"}`}>
                    {id ? t("Editar Plano de Vida") : t("Sua Jornada Começa Aqui")}
                  </h1>
                  <p className={`text-sm mt-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                    {t("Trace o caminho para seu futuro ideal")}
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="group">
                  <label
                    htmlFor="name"
                    className={`block text-sm font-medium mb-2 ${
                      darkMode ? "text-slate-300 group-hover:text-pink-500" : "text-slate-700 group-hover:text-blue-500"
                    } transition-colors duration-300`}
                  >
                    {t("Dê um nome à sua jornada")}
                  </label>
                  <div
                    className={`relative rounded-xl overflow-hidden transition-all duration-300 ${
                      darkMode
                        ? "bg-slate-700/50 border border-slate-600/50 group-hover:border-pink-500/50"
                        : "bg-white border border-blue-200 group-hover:border-blue-400"
                    }`}
                  >
                    <input
                      type="text"
                      id="name"
                      placeholder={t("Ex: Minha jornada de crescimento")}
                      className={`w-full p-3.5 pl-4 outline-none transition-colors duration-300 ${
                        darkMode
                          ? "bg-transparent text-white placeholder-slate-400"
                          : "bg-transparent text-slate-800 placeholder-slate-400"
                      }`}
                      value={plan.name}
                      onChange={(e) => setPlan({ ...plan, name: e.target.value })}
                    />
                    <div
                      className={`absolute bottom-0 left-0 h-0.5 ${
                        darkMode
                          ? "bg-gradient-to-r from-pink-500 to-purple-600"
                          : "bg-gradient-to-r from-blue-500 to-indigo-600"
                      } transition-all duration-300 ${plan.name ? "w-full" : "w-0"} group-hover:w-full`}
                    />
                  </div>
                </div>

                <div className="pt-4 group">
                  <div className="flex items-center mb-4">
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-lg ${
                        darkMode ? "bg-pink-900/30" : "bg-blue-100"
                      } mr-3`}
                    >
                      <IoTimeOutline className={`${darkMode ? "text-pink-400" : "text-blue-600"}`} />
                    </div>
                    <Typography
                      className={`font-medium ${
                        darkMode
                          ? "text-slate-300 group-hover:text-pink-500"
                          : "text-slate-700 group-hover:text-blue-500"
                      } transition-colors duration-300`}
                    >
                      {t("Horizonte de planejamento")}
                    </Typography>
                    <div
                      className={`ml-auto text-lg font-bold px-3 py-1 rounded-full ${
                        darkMode ? "bg-pink-900/30 text-pink-400" : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      {plan.term}
                    </div>
                  </div>

                  <div className="relative px-2 mb-6 mt-4">
                    <div
                      className={`absolute left-0 right-0 h-1 ${
                        darkMode
                          ? "bg-gradient-to-r from-pink-900/30 to-purple-900/30"
                          : "bg-gradient-to-r from-blue-200 to-indigo-200"
                      } rounded-full top-1/2 transform -translate-y-1/2`}
                    ></div>
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full ${darkMode ? "bg-pink-400" : "bg-blue-600"} z-10`}></div>
                      <span className={`text-xs mt-3 font-medium ${darkMode ? "text-pink-400" : "text-blue-600"}`}>
                        {new Date().getFullYear()}
                      </span>
                    </div>

                    <div
                      className="absolute top-1/2 transform -translate-y-1/2 flex flex-col items-center transition-all duration-300"
                      style={{ left: `${(plan.term / 20) * 100}%` }}
                    >
                      <div
                        className={`w-4 h-4 rounded-full ${
                          darkMode ? "bg-purple-400" : "bg-indigo-600"
                        } z-10 animate-pulse`}
                      ></div>
                      <span className={`text-xs mt-3 font-medium ${darkMode ? "text-purple-400" : "text-indigo-600"}`}>
                        {new Date().getFullYear() + plan.term}
                      </span>
                    </div>

                    {[5, 10, 15].map(
                      (year) =>
                        year <= plan.term && (
                          <div
                            key={year}
                            className="absolute top-1/2 transform -translate-y-1/2 flex flex-col items-center opacity-70"
                            style={{ left: `${(year / 20) * 100}%` }}
                          >
                            <div
                              className={`w-2 h-2 rounded-full ${darkMode ? "bg-pink-500/50" : "bg-blue-500/50"} z-10`}
                            ></div>
                            <span className={`text-[10px] mt-3 ${darkMode ? "text-pink-400/70" : "text-blue-500/70"}`}>
                              {new Date().getFullYear() + year}
                            </span>
                          </div>
                        ),
                    )}
                  </div>

                  <div className="px-2 mb-2">
                    <Slider
                      aria-label="Prazo"
                      value={plan.term}
                      onChange={(e, value) => setPlan({ ...plan, term: value as number })}
                      valueLabelDisplay="auto"
                      step={1}
                      min={1}
                      max={20}
                      sx={{
                        height: 8,
                        "& .MuiSlider-thumb": {
                          height: 24,
                          width: 24,
                          backgroundColor: darkMode ? "#ec4899" : "#3b82f6",
                          "&:hover, &.Mui-focusVisible": {
                            boxShadow: darkMode
                              ? "0 0 0 8px rgba(236, 72, 153, 0.16)"
                              : "0 0 0 8px rgba(59, 130, 246, 0.16)",
                          },
                        },
                        "& .MuiSlider-track": {
                          height: 8,
                          borderRadius: 4,
                          background: darkMode
                            ? "linear-gradient(90deg, #db2777, #a855f7)"
                            : "linear-gradient(90deg, #3b82f6, #6366f1)",
                        },
                        "& .MuiSlider-rail": {
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(59, 130, 246, 0.2)",
                        },
                        "& .MuiSlider-markLabel": {
                          display: "none",
                        },
                        "& .MuiSlider-mark": {
                          backgroundColor: darkMode ? "rgba(255, 255, 255, 0.3)" : "rgba(59, 130, 246, 0.3)",
                          height: 8,
                          width: 1,
                          marginTop: 0,
                        },
                      }}
                    />
                  </div>

                  <div className="flex justify-between px-2 mt-1">
                    <span className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>1 {t("ano")}</span>
                    <span className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>20 {t("anos")}</span>
                  </div>
                </div>

                <div
                  className={`flex items-center mt-2 text-sm p-4 rounded-xl ${
                    darkMode ? "bg-slate-700/30 border border-slate-600/50" : "bg-blue-50/50 border border-blue-100"
                  }`}
                >
                  <div className="flex-shrink-0 mr-3">
                    <IoStarOutline className={`text-lg ${darkMode ? "text-pink-400" : "text-blue-600"}`} />
                  </div>
                  <div className="w-full">
                    <p className={`italic ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                      {t('"Nunca planeje os seus sonhos com as limitações do presente."')}
                    </p>
                    <p className={`text-xs mt-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                      Eleanor Roosevelt
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mt-4">
                  {[
                    { icon: IoLeafOutline, label: t("Crescimento"), color: "emerald" },
                    { icon: IoRocketSharp, label: t("Progresso"), color: "blue" },
                    { icon: IoSparkles, label: t("Conquistas"), color: "amber" },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl ${
                        darkMode
                          ? index === 0
                            ? "bg-emerald-900/20 border border-emerald-800/30"
                            : index === 1
                              ? "bg-blue-900/20 border border-blue-800/30"
                              : "bg-amber-900/20 border border-amber-800/30"
                          : index === 0
                            ? "bg-emerald-50 border border-emerald-100"
                            : index === 1
                              ? "bg-blue-50 border border-blue-100"
                              : "bg-amber-50 border border-amber-100"
                      }`}
                    >
                      <item.icon
                        className={`text-xl mb-1 ${
                          darkMode
                            ? index === 0
                              ? "text-emerald-400"
                              : index === 1
                                ? "text-blue-400"
                                : "text-amber-400"
                            : index === 0
                              ? "text-emerald-600"
                              : index === 1
                                ? "text-blue-600"
                                : "text-amber-600"
                        }`}
                      />
                      <span
                        className={`text-xs font-medium ${
                          darkMode
                            ? index === 0
                              ? "text-emerald-300"
                              : index === 1
                                ? "text-blue-300"
                                : "text-amber-300"
                            : index === 0
                              ? "text-emerald-700"
                              : index === 1
                                ? "text-blue-700"
                                : "text-amber-700"
                        }`}
                      >
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4">
                <button
                  className={`group flex items-center justify-center py-3.5 px-4 rounded-xl font-medium text-sm transition-all duration-300 ${
                    darkMode
                      ? "bg-slate-700/50 text-slate-300 hover:bg-slate-700 border border-slate-600/50"
                      : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                  }`}
                  onClick={() => navigate("/life-plan/dashboard")}
                >
                  <IoCaretBack className={`mr-2 transition-transform duration-300 group-hover:-translate-x-1`} />
                  {t("Voltar")}
                </button>
                <button
                  className={`group relative flex items-center justify-center py-3.5 px-4 rounded-xl font-medium text-sm text-white overflow-hidden`}
                  onClick={handleSubmitPlan}
                >
                  <div
                    className={`absolute inset-0 ${
                      darkMode
                        ? "bg-gradient-to-r from-pink-600 to-purple-600"
                        : "bg-gradient-to-r from-blue-600 to-indigo-600"
                    } transition-transform duration-300 group-hover:scale-105`}
                  />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-white transition-opacity duration-300" />
                  <span className="relative z-10 flex items-center">
                    {t("Iniciar Jornada")}
                    <IoCaretForward className={`ml-2 transition-transform duration-300 group-hover:translate-x-1`} />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LifePlanPage

