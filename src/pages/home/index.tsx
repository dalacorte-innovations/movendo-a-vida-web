"use client"

import { useState, useContext, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { FaPlane } from "react-icons/fa"
import { FaBagShopping } from "react-icons/fa6"
import { IoRocketSharp, IoCompassOutline, IoSparkles, IoLeafOutline } from "react-icons/io5"
import Sidebar from "../../components/sidebar"
import { ThemeContext } from "../../utils/ThemeContext.jsx"
import { useTranslation } from "react-i18next"

function HomePage() {
  const [hoveredCard, setHoveredCard] = useState(null)
  const { darkMode } = useContext(ThemeContext)
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const waveCanvasRef = useRef<HTMLCanvasElement>(null)
  const waveAnimationRef = useRef<number>()
  const [animateIn, setAnimateIn] = useState(false)

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

  const cards = [
    {
      id: 1,
      icon: FaPlane,
      name: t("Plano de Viagem"),
      description: t("Planeje suas próximas aventuras e organize suas viagens com facilidade."),
      url: "#",
      color: darkMode ? "from-emerald-500 to-teal-600" : "from-emerald-500 to-teal-600",
      bgColor: darkMode ? "bg-emerald-900/30" : "bg-emerald-100",
      textColor: darkMode ? "text-emerald-400" : "text-emerald-600",
      borderColor: darkMode ? "border-emerald-800/30" : "border-emerald-200",
      hoverBg: darkMode ? "hover:bg-emerald-900/50" : "hover:bg-emerald-200/70",
    },
    {
      id: 2,
      icon: FaBagShopping,
      name: t("Plano de Vida"),
      description: t("Trace o caminho para seu futuro ideal e acompanhe seu progresso financeiro."),
      url: "/life-plan/dashboard",
      color: darkMode ? "from-pink-500 to-purple-600" : "from-blue-500 to-indigo-600",
      bgColor: darkMode ? "bg-pink-900/30" : "bg-blue-100",
      textColor: darkMode ? "text-pink-400" : "text-blue-600",
      borderColor: darkMode ? "border-pink-800/30" : "border-blue-200",
      hoverBg: darkMode ? "hover:bg-pink-900/50" : "hover:bg-blue-200/70",
    },
  ]

  const features = [
    {
      icon: IoLeafOutline,
      title: t("Crescimento"),
      description: t("Acompanhe seu progresso e veja seu crescimento ao longo do tempo."),
      color: darkMode ? "text-emerald-400" : "text-emerald-600",
      bgColor: darkMode ? "bg-emerald-900/30" : "bg-emerald-100",
      borderColor: darkMode ? "border-emerald-800/30" : "border-emerald-200",
    },
    {
      icon: IoRocketSharp,
      title: t("Progresso"),
      description: t("Defina metas claras e acompanhe seu progresso em direção a elas."),
      color: darkMode ? "text-blue-400" : "text-blue-600",
      bgColor: darkMode ? "bg-blue-900/30" : "bg-blue-100",
      borderColor: darkMode ? "border-blue-800/30" : "border-blue-200",
    },
    {
      icon: IoSparkles,
      title: t("Conquistas"),
      description: t("Celebre suas conquistas e visualize o caminho percorrido."),
      color: darkMode ? "text-amber-400" : "text-amber-600",
      bgColor: darkMode ? "bg-amber-900/30" : "bg-amber-100",
      borderColor: darkMode ? "border-amber-800/30" : "border-amber-200",
    },
  ]

  const handleCardClick = (url) => {
    if (url === "#") {
      toast.info(t("Funcionalidade em desenvolvimento"))
    } else {
      navigate(url)
    }
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
        <div className={`max-w-7xl mx-auto`}>
          <div
            className={`relative overflow-hidden rounded-2xl shadow-xl backdrop-blur-md mb-10 ${
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

            <div className="relative p-6 md:p-10">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="max-w-2xl">
                  <div className="flex items-center mb-4">
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
                    <h1 className={`text-3xl font-bold ${darkMode ? "text-white" : "text-slate-800"}`}>
                      {t("Bem-vindo ao seu Futuro")}
                    </h1>
                  </div>
                  <p className={`text-lg mt-2 ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                    {t(
                      "Transforme seus sonhos em planos concretos e acompanhe seu progresso rumo ao futuro que você deseja construir.",
                    )}
                  </p>
                </div>

                <div className="hidden md:block">
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
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {cards.map((card) => (
              <div
                key={card.id}
                className={`transform transition-all duration-500 ease-out ${animateIn ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
                style={{ transitionDelay: `${card.id * 100}ms` }}
              >
                <div
                  className={`relative overflow-hidden rounded-xl shadow-md backdrop-blur-md border transition-all duration-300 ${card.borderColor} ${card.hoverBg} ${
                    darkMode ? "bg-slate-800/70" : "bg-white/80"
                  } h-full cursor-pointer`}
                  onMouseEnter={() => setHoveredCard(card.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  onClick={() => handleCardClick(card.url)}
                >
                  <div className="absolute inset-0 overflow-hidden">
                    <div
                      className={`absolute -inset-[10px] rounded-full opacity-20 blur-3xl bg-gradient-to-r ${card.color}`}
                      style={{
                        top: hoveredCard === card.id ? mousePosition.y * 0.1 : 0,
                        left: hoveredCard === card.id ? mousePosition.x * 0.1 : 0,
                        transition: "all 0.5s ease-out",
                        width: "50%",
                        height: "50%",
                      }}
                    />
                  </div>

                  <div className="relative p-6">
                    <div className="flex items-center mb-4">
                      <div className={`flex items-center justify-center w-12 h-12 rounded-xl ${card.bgColor} mr-4`}>
                        <card.icon className={`text-xl ${card.textColor}`} />
                      </div>
                      <h2 className={`text-xl font-bold ${darkMode ? "text-white" : "text-slate-800"}`}>{card.name}</h2>
                    </div>

                    <p className={`mb-6 ${darkMode ? "text-slate-300" : "text-slate-600"}`}>{card.description}</p>

                    <div
                      className={`inline-flex items-center justify-center py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
                        darkMode
                          ? `bg-gradient-to-r ${card.color} text-white`
                          : `bg-gradient-to-r ${card.color} text-white`
                      }`}
                    >
                      {card.id === 1 ? t("Em breve") : t("Acessar agora")}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div
            className={`relative overflow-hidden rounded-xl shadow-md backdrop-blur-md mb-10 ${
              darkMode ? "bg-slate-800/70 border border-slate-700/50" : "bg-white/80 border border-blue-100"
            }`}
          >
            <div className="relative p-6">
              <h2 className={`text-xl font-bold mb-6 ${darkMode ? "text-white" : "text-slate-800"}`}>
                {t("Por que usar nosso planejador?")}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className={`transform transition-all duration-500 ease-out ${animateIn ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
                    style={{ transitionDelay: `${(index + 3) * 100}ms` }}
                  >
                    <div className={`p-5 rounded-xl border ${feature.borderColor} ${feature.bgColor}`}>
                      <div className="flex items-center mb-3">
                        <feature.icon className={`text-xl mr-2 ${feature.color}`} />
                        <h3 className={`font-semibold ${feature.color}`}>{feature.title}</h3>
                      </div>
                      <p className={`text-sm ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div
            className={`relative overflow-hidden rounded-xl shadow-md backdrop-blur-md mb-6 ${
              darkMode ? "bg-slate-800/70 border border-slate-700/50" : "bg-white/80 border border-blue-100"
            } transform transition-all duration-500 ease-out ${animateIn ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
            style={{ transitionDelay: "600ms" }}
          >
            <div className="relative p-6 text-center">
              <p className={`text-lg italic ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                {t('"O futuro pertence àqueles que acreditam na beleza de seus sonhos."')}
              </p>
              <p className={`mt-2 font-medium ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Eleanor Roosevelt</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default HomePage