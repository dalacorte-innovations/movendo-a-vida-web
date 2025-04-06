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
  // Add these new state variables at the top of the component
  const [currentImageIndex, setCurrentImageIndex] = useState({})
  const [securityModalOpen, setSecurityModalOpen] = useState(false)
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
      icon: FaBagShopping,
      name: t("Upgrade"),
      description: t("Trace o caminho para seu futuro ideal e acompanhe seu progresso financeiro."),
      url: "/life-plan/dashboard",
      color: darkMode ? "from-pink-500 to-purple-600" : "from-blue-500 to-indigo-600",
      bgColor: darkMode ? "bg-pink-900/30" : "bg-blue-100",
      textColor: darkMode ? "text-pink-400" : "text-blue-600",
      borderColor: darkMode ? "border-pink-800/30" : "border-blue-200",
      hoverBg: darkMode ? "hover:bg-pink-900/50" : "hover:bg-blue-200/70",
      hasUserPlan: true, // Flag to indicate if user has a plan
      images: [
        "/placeholder.svg?height=300&width=400",
        "/placeholder.svg?height=300&width=400",
        "/placeholder.svg?height=300&width=400",
      ],
    },
    {
      id: 2,
      icon: FaPlane,
      name: t("Plano de Viagem"),
      description: t("Planeje suas próximas aventuras e organize suas viagens com facilidade."),
      url: "#",
      color: darkMode ? "from-emerald-500 to-teal-600" : "from-emerald-500 to-teal-600",
      bgColor: darkMode ? "bg-emerald-900/30" : "bg-emerald-100",
      textColor: darkMode ? "text-emerald-400" : "text-emerald-600",
      borderColor: darkMode ? "border-emerald-800/30" : "border-emerald-200",
      hoverBg: darkMode ? "hover:bg-emerald-900/50" : "hover:bg-emerald-200/70",
      hasUserPlan: false, // Flag to indicate if user has a plan
      images: [
        "/placeholder.svg?height=300&width=400",
        "/placeholder.svg?height=300&width=400",
        "/placeholder.svg?height=300&width=400",
      ],
    },
    {
      id: 3,
      icon: IoSparkles,
      name: t("Inteligência Artificial"),
      description: t("Acesse nossa IA personalizada para ajudar a mover sua vida e mudar o futuro."),
      url: "/upgrade-ai",
      color: darkMode ? "from-violet-500 to-indigo-600" : "from-violet-500 to-indigo-600",
      bgColor: darkMode ? "bg-violet-900/30" : "bg-violet-100",
      textColor: darkMode ? "text-violet-400" : "text-violet-600",
      borderColor: darkMode ? "border-violet-800/30" : "border-violet-200",
      hoverBg: darkMode ? "hover:bg-violet-900/50" : "hover:bg-violet-200/70",
      premium: true,
      premiumPrice: "R$ 20,00",
      basePrice: "R$ 125,10",
    },
    {
      id: 4,
      icon: IoCompassOutline,
      name: t("Indicação de um Coach"),
      description: t("Encontre o coach ideal para ajudar em sua jornada de desenvolvimento pessoal."),
      url: "/coach-recommendation",
      color: darkMode ? "from-amber-500 to-orange-600" : "from-amber-500 to-orange-600",
      bgColor: darkMode ? "bg-amber-900/30" : "bg-amber-100",
      textColor: darkMode ? "text-amber-400" : "text-amber-600",
      borderColor: darkMode ? "border-amber-800/30" : "border-amber-200",
      hoverBg: darkMode ? "hover:bg-amber-900/50" : "hover:bg-amber-200/70",
    },
    {
      id: 5,
      icon: FaBagShopping,
      name: t("Renda Extra"),
      description: t(
        "Descubra oportunidades para aumentar sua renda e alcançar seus objetivos financeiros mais rapidamente.",
      ),
      url: "/extra-income",
      color: darkMode ? "from-green-500 to-emerald-600" : "from-green-500 to-emerald-600",
      bgColor: darkMode ? "bg-green-900/30" : "bg-green-100",
      textColor: darkMode ? "text-green-400" : "text-green-600",
      borderColor: darkMode ? "border-green-800/30" : "border-green-200",
      hoverBg: darkMode ? "hover:bg-green-900/50" : "hover:bg-green-200/70",
    },
    {
      id: 6,
      icon: IoRocketSharp,
      name: t("Agenda Inteligente"),
      description: t("Sincronize seu calendário e organize seus compromissos de forma inteligente."),
      url: "/smart-calendar",
      color: darkMode ? "from-cyan-500 to-blue-600" : "from-cyan-500 to-blue-600",
      bgColor: darkMode ? "bg-cyan-900/30" : "bg-cyan-100",
      textColor: darkMode ? "text-cyan-400" : "text-cyan-600",
      borderColor: darkMode ? "border-cyan-800/30" : "border-cyan-200",
      hoverBg: darkMode ? "hover:bg-cyan-900/50" : "hover:bg-cyan-200/70",
    },
    {
      id: 7,
      icon: IoLeafOutline,
      name: t("Tutorial/Guia"),
      description: t("Aprenda a utilizar todas as funcionalidades da plataforma com nossos tutoriais interativos."),
      url: "/tutorials",
      color: darkMode ? "from-purple-500 to-indigo-600" : "from-purple-500 to-indigo-600",
      bgColor: darkMode ? "bg-purple-900/30" : "bg-purple-100",
      textColor: darkMode ? "text-purple-400" : "text-purple-600",
      borderColor: darkMode ? "border-purple-800/30" : "border-purple-200",
      hoverBg: darkMode ? "hover:bg-purple-900/50" : "hover:bg-purple-200/70",
    },
    {
      id: 8,
      icon: IoSparkles,
      name: t("Princípios e Valores"),
      description: t("Conheça os princípios e valores que norteiam nossa plataforma e metodologia."),
      url: "/principles",
      color: darkMode ? "from-rose-500 to-pink-600" : "from-rose-500 to-pink-600",
      bgColor: darkMode ? "bg-rose-900/30" : "bg-rose-100",
      textColor: darkMode ? "text-rose-400" : "text-rose-600",
      borderColor: darkMode ? "border-rose-800/30" : "border-rose-200",
      hoverBg: darkMode ? "hover:bg-rose-900/50" : "hover:bg-rose-200/70",
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
    {
      icon: IoRocketSharp,
      title: t("Metas de Vendas"),
      description: t("Defina metas de vendas mensais e acompanhe a aplicação automática da receita no seu plano."),
      color: darkMode ? "text-purple-400" : "text-purple-600",
      bgColor: darkMode ? "bg-purple-900/30" : "bg-purple-100",
      borderColor: darkMode ? "border-purple-800/30" : "border-purple-200",
    },
  ]

  // Add this useEffect for image rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => {
        const newIndices = { ...prev }
        cards.forEach((card) => {
          if (card.images) {
            const currentIndex = prev[card.id] || 0
            newIndices[card.id] = (currentIndex + 1) % card.images.length
          }
        })
        return newIndices
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  // Update the handleCardClick function
  const handleCardClick = (url, card) => {
    if (url === "#") {
      toast.info(t("Funcionalidade em desenvolvimento"))
    } else if (card.premium) {
      toast.info(t(`Esta funcionalidade requer um upgrade. Preço: ${card.basePrice} + ${card.premiumPrice}/mês`))
      navigate("/upgrade-plans")
    } else {
      navigate(url)
    }
  }

  // Update the return statement to modify the background and add more vibrant colors
  return (
    <div
      className={`flex h-screen overflow-hidden ${darkMode ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"}`}
    >
      <div
        className={`fixed md:relative ${
          darkMode ? "bg-slate-800/90 border-r border-slate-700/50" : "bg-white/90 border-r border-blue-100"
        } h-full z-10`}
      >
        <Sidebar />
      </div>

      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute w-full h-full">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className={`absolute rounded-full ${
                darkMode
                  ? `bg-gradient-to-br from-${["pink", "purple", "blue", "indigo", "violet"][i % 5]}-500/20 to-${["indigo", "violet", "pink", "purple", "blue"][i % 5]}-600/10`
                  : `bg-gradient-to-br from-${["blue", "indigo", "violet", "purple", "pink"][i % 5]}-500/10 to-${["violet", "purple", "blue", "indigo", "pink"][i % 5]}-600/5`
              }`}
              style={{
                width: `${Math.random() * 300 + 50}px`,
                height: `${Math.random() * 300 + 50}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: 0.4,
                transform: "translate(-50%, -50%)",
                animation: `float ${Math.random() * 10 + 15}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>
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
                  darkMode
                    ? "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500"
                    : "bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400"
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
                        darkMode
                          ? "bg-gradient-to-br from-pink-600 to-purple-700"
                          : "bg-gradient-to-br from-blue-500 to-indigo-600"
                      } mr-4 overflow-hidden group shadow-lg`}
                    >
                      <IoCompassOutline
                        className={`text-2xl relative z-10 text-white transition-colors duration-500`}
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
                          darkMode ? "border-pink-500/50" : "border-blue-500/50"
                        } animate-[spin_20s_linear_infinite]`}
                      />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div
                        className={`w-24 h-24 rounded-full border-4 border-dashed ${
                          darkMode ? "border-purple-500/50" : "border-indigo-500/50"
                        } animate-[spin_15s_linear_infinite_reverse]`}
                      />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div
                        className={`w-16 h-16 rounded-full border-4 border-dashed ${
                          darkMode ? "border-violet-500/50" : "border-sky-500/50"
                        } animate-[spin_10s_linear_infinite]`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {cards.slice(0, 2).map((card) => (
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
                  onClick={() => handleCardClick(card.url, card)}
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

                  {card.images && (
                    <div className="relative h-48 overflow-hidden rounded-t-xl">
                      {card.images.map((img, idx) => (
                        <img
                          key={idx}
                          src={img || "/placeholder.svg"}
                          alt={card.name}
                          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                            (currentImageIndex[card.id] || 0) === idx ? "opacity-100" : "opacity-0"
                          }`}
                        />
                      ))}
                      <div
                        className={`absolute inset-0 bg-gradient-to-t from-${darkMode ? "slate-800" : "white"}/80 to-transparent`}
                      ></div>
                    </div>
                  )}

                  <div className="relative p-6">
                    <div className="flex items-center mb-4">
                      <div
                        className={`flex items-center justify-center w-12 h-12 rounded-xl ${card.bgColor} mr-4 shadow-md`}
                      >
                        <card.icon className={`text-xl ${card.textColor}`} />
                      </div>
                      <h2 className={`text-xl font-bold ${darkMode ? "text-white" : "text-slate-800"}`}>{card.name}</h2>
                    </div>

                    <p className={`mb-6 ${darkMode ? "text-slate-300" : "text-slate-600"}`}>{card.description}</p>

                    <div className="flex flex-col space-y-3">
                      <div
                        className={`inline-flex items-center justify-center py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
                          darkMode
                            ? `bg-gradient-to-r ${card.color} text-white`
                            : `bg-gradient-to-r ${card.color} text-white`
                        }`}
                      >
                        {card.id === 2 ? t("Em breve") : t("Acessar agora")}
                      </div>

                      {card.hasUserPlan !== undefined && (
                        <div className={`text-sm text-center ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                          {card.hasUserPlan
                            ? t("Você já possui um plano. Clique para acessar.")
                            : t("Você ainda não possui um plano. Clique para criar.")}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {cards.slice(2).map((card) => (
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
                  onClick={() => handleCardClick(card.url, card)}
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
                      <div
                        className={`flex items-center justify-center w-12 h-12 rounded-xl ${card.bgColor} mr-4 shadow-md`}
                      >
                        <card.icon className={`text-xl ${card.textColor}`} />
                      </div>
                      <h2 className={`text-xl font-bold ${darkMode ? "text-white" : "text-slate-800"}`}>{card.name}</h2>
                      {card.premium && (
                        <span className="ml-2 px-2 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-amber-400 to-amber-600 text-white">
                          PREMIUM
                        </span>
                      )}
                    </div>

                    <p className={`mb-6 ${darkMode ? "text-slate-300" : "text-slate-600"}`}>{card.description}</p>

                    <div
                      className={`inline-flex items-center justify-center py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
                        darkMode
                          ? `bg-gradient-to-r ${card.color} text-white`
                          : `bg-gradient-to-r ${card.color} text-white`
                      }`}
                    >
                      {card.premium ? t("Fazer Upgrade") : t("Acessar agora")}
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
                    <div className={`p-5 rounded-xl border ${feature.borderColor} ${feature.bgColor} shadow-sm`}>
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

          <div className="flex justify-center mb-8">
            <button
              onClick={() => setSecurityModalOpen(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm ${
                darkMode
                  ? "bg-slate-700 hover:bg-slate-600 text-slate-300"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              } transition-colors`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              {t("Informações sobre Segurança e Privacidade")}
            </button>
          </div>

          {securityModalOpen && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div
                className={`relative rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-auto ${
                  darkMode ? "bg-slate-800 text-white" : "bg-white text-slate-800"
                }`}
              >
                <div className="sticky top-0 p-4 border-b flex justify-between items-center backdrop-blur-md bg-opacity-90">
                  <h2 className="text-xl font-bold">Segurança e Privacidade</h2>
                  <button
                    onClick={() => setSecurityModalOpen(false)}
                    className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Como protegemos seus dados</h3>
                      <p>
                        Utilizamos as mais avançadas tecnologias de criptografia e segurança para garantir que suas
                        informações pessoais e financeiras estejam sempre protegidas.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-2">Medidas de Segurança</h3>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Criptografia de ponta a ponta para todas as informações sensíveis</li>
                        <li>Autenticação de dois fatores para acesso à conta</li>
                        <li>Monitoramento contínuo contra atividades suspeitas</li>
                        <li>Backups regulares e redundância de dados</li>
                        <li>Conformidade com regulamentações de proteção de dados (LGPD/GDPR)</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-2">Confidencialidade</h3>
                      <p>
                        Seus dados são estritamente confidenciais e nunca são compartilhados com terceiros sem seu
                        consentimento explícito. Nossos funcionários têm acesso limitado às informações dos usuários,
                        apenas quando necessário para fornecer suporte.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-2">Controle de Acesso</h3>
                      <p>
                        Implementamos controles de acesso rigorosos para garantir que apenas você possa acessar suas
                        informações pessoais e financeiras. Cada usuário tem seu próprio ambiente isolado e seguro.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-2">Auditorias de Segurança</h3>
                      <p>
                        Realizamos auditorias de segurança regulares e testes de penetração para identificar e corrigir
                        possíveis vulnerabilidades antes que possam ser exploradas.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="sticky bottom-0 p-4 border-t flex justify-end backdrop-blur-md bg-opacity-90">
                  <button
                    onClick={() => setSecurityModalOpen(false)}
                    className={`px-4 py-2 rounded-lg ${
                      darkMode
                        ? "bg-gradient-to-r from-blue-600 to-indigo-700 text-white"
                        : "bg-gradient-to-r from-blue-500 to-indigo-600 text-white"
                    }`}
                  >
                    Entendi
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default HomePage