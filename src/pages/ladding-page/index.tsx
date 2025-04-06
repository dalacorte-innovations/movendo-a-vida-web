"use client"

import React from "react"
import { useContext, useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import i18n from "../../../i18n"
import {
  IoArrowForward,
  IoStatsChartOutline,
  IoDocumentTextOutline,
  IoBriefcaseOutline,
  IoShieldCheckmarkOutline,
  IoMenuOutline,
  IoCloseOutline,
  IoRocketOutline,
  IoCalendarOutline,
  IoChevronDownOutline,
} from "react-icons/io5"
import { getAuthHeaders, endpoints, configBackendConnection } from "../../utils/backendConnection"
import { toast } from "react-toastify"
import { ThemeContext } from "../../utils/ThemeContext.jsx"

interface Testimonial {
  stars: number
  comment: string
  image?: string
  full_name: string
  profession: string
}

const LandingPage = () => {
  const { t } = useTranslation()
  const { darkMode } = useContext(ThemeContext)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState("pt")
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [animateIn, setAnimateIn] = useState(false)
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const waveCanvasRef = useRef<HTMLCanvasElement>(null)
  const waveAnimationRef = useRef<number>()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  useEffect(() => {
    setAnimateIn(true)
    const storedLanguage = localStorage.getItem("Language") || "pt"
    setSelectedLanguage(storedLanguage)
    i18n.changeLanguage(storedLanguage)

    // Check if user is logged in
    const token = localStorage.getItem("token")
    setIsLoggedIn(!!token)
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
        color: "rgba(219, 39, 119, 0.3)",
        lineWidth: 3,
      },
      {
        amplitude: 30,
        period: 0.03,
        speed: 0.015,
        phase: 2,
        color: "rgba(139, 92, 246, 0.3)",
        lineWidth: 2,
      },
      {
        amplitude: 70,
        period: 0.01,
        speed: 0.005,
        phase: 4,
        color: "rgba(236, 72, 153, 0.2)",
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
  }, [])

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

    const fetchTestimonials = async () => {
      setIsLoading(true)

      const url = `${configBackendConnection.baseURL}/${endpoints.feedbackAPI}`
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "application/json",
          },
        })

        if (response.ok) {
          const data = await response.json()

          console.log(data)
          setTestimonials(data)
        } else {
          toast.error(t("Erro ao carregar feedbacks."))
        }
      } catch (error) {
        toast.error(t("Erro de conexão. Tente novamente mais tarde."))
      } finally {
        setIsLoading(false)
      }
    }

    fetchTestimonials()

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
        ctx.fillStyle = `rgba(219, 39, 119, ${particle.opacity})`
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
          ctx.strokeStyle = `rgba(236, 72, 153, ${opacity * 0.3})`
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
  }, [])

  const handleLanguageChange = (language: string) => {
    console.log(`Changing language to: ${language}`)
    i18n.changeLanguage(language)
    setSelectedLanguage(language)
    localStorage.setItem("Language", language)
    setIsLanguageModalOpen(false)
  }

  const closeMenuOnOutsideClick = (event) => {
    if (event.target.id === "modal-background") {
      setIsMenuOpen(false)
    }
  }

  const benefits = [
    {
      icon: IoStatsChartOutline,
      title: t("Gráficos Personalizados"),
      description: t(
        "Transforme dados em insights visuais com nossos gráficos personalizados. Acompanhe o progresso das suas metas e veja claramente cada conquista ao longo do tempo.",
      ),
      color: "emerald",
    },
    {
      icon: IoDocumentTextOutline,
      title: t("Planos Documentados"),
      description: t(
        "Tenha seus objetivos documentados de forma organizada e acessível. Nosso portal permite que você registre cada etapa do seu planejamento de maneira clara e detalhada.",
      ),
      color: "blue",
    },
    {
      icon: IoBriefcaseOutline,
      title: t("Investimento para o Futuro"),
      description: t(
        "Construa um plano sólido para o futuro que você sempre sonhou. Nossas ferramentas de planejamento ajudam a definir metas claras e estratégias para alcançá-las.",
      ),
      color: "amber",
    },
    {
      icon: IoShieldCheckmarkOutline,
      title: t("Segurança Garantida"),
      description: t(
        "Mantenha suas informações seguras e acessíveis apenas para você. Nosso sistema utiliza as melhores práticas de segurança para proteger seus dados.",
      ),
      color: "pink",
    },
  ]

  const getColorClasses = (color) => {
    const colorMap = {
      emerald: {
        bg: "bg-emerald-900/30",
        text: "text-emerald-400",
        border: "border-emerald-800/30",
        hoverBg: "hover:bg-emerald-900/50",
        gradient: "from-emerald-500 to-teal-600",
      },
      blue: {
        bg: "bg-blue-900/30",
        text: "text-blue-400",
        border: "border-blue-800/30",
        hoverBg: "hover:bg-blue-900/50",
        gradient: "from-blue-500 to-indigo-600",
      },
      amber: {
        bg: "bg-amber-900/30",
        text: "text-amber-400",
        border: "border-amber-800/30",
        hoverBg: "hover:bg-amber-900/50",
        gradient: "from-amber-500 to-orange-600",
      },
      pink: {
        bg: "bg-pink-900/30",
        text: "text-pink-400",
        border: "border-pink-800/30",
        hoverBg: "hover:bg-pink-900/50",
        gradient: "from-pink-500 to-rose-600",
      },
      purple: {
        bg: "bg-purple-900/30",
        text: "text-purple-400",
        border: "border-purple-800/30",
        hoverBg: "hover:bg-purple-900/50",
        gradient: "from-purple-500 to-violet-600",
      },
    }

    return (
      colorMap[color] || {
        bg: "bg-pink-900/30",
        text: "text-pink-400",
        border: "border-pink-800/30",
        hoverBg: "hover:bg-pink-900/50",
        gradient: "from-pink-500 to-purple-600",
      }
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#0F172A] relative">
      <canvas ref={waveCanvasRef} className="fixed inset-0 pointer-events-none z-0" />
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />

      <header className="w-full py-6 bg-slate-800/90 backdrop-blur-md flex justify-between items-center px-4 lg:px-16 relative z-10 border-b border-slate-700/50">
        <div className="cursor-pointer flex items-center h-12 overflow-hidden" onClick={() => navigate("/")}>
          <img src="src/assets/images/logo_mov.png" alt="Logo" className="h-24 object-contain" />
        </div>

        <nav className="hidden md:flex flex-1 justify-center space-x-4 md:space-x-8">
          <ul className="flex space-x-4 md:space-x-8">
            <li
              className="cursor-pointer font-medium text-sm hover:text-white transition-colors"
              onClick={() => navigate("/benefits")}
            >
              <span className="text-emerald-400 hover:text-emerald-300 transition-colors">{t("Benefícios")}</span>
            </li>
            <li
              className="cursor-pointer font-medium text-sm hover:text-white transition-colors"
              onClick={() => navigate("/plans")}
            >
              <span className="text-blue-400 hover:text-blue-300 transition-colors">{t("Planos")}</span>
            </li>
            <li
              className="cursor-pointer font-medium text-sm hover:text-white transition-colors"
              onClick={() => navigate("/contact")}
            >
              <span className="text-amber-400 hover:text-amber-300 transition-colors">{t("Contato")}</span>
            </li>
            <li className="relative">
              <button
                className="flex items-center gap-1 font-medium text-sm cursor-pointer"
                onClick={() => setIsLanguageModalOpen(!isLanguageModalOpen)}
              >
                <span className="text-pink-400 hover:text-pink-300 transition-colors">{t("Idioma")}</span>
                <IoChevronDownOutline className="text-pink-400" />
              </button>
            </li>
          </ul>
        </nav>

        <div className="flex gap-4 items-center">
          {!isLoggedIn && (
            <>
              <button
                className="hidden md:block py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300 bg-slate-700/50 text-slate-300 hover:bg-slate-700 border border-slate-600/50"
                onClick={() => navigate("/login")}
              >
                {t("Fazer login")}
              </button>
              <button
                className="hidden md:block py-2 px-4 rounded-lg text-sm font-medium text-white overflow-hidden relative group"
                onClick={() => navigate("/register")}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 transition-transform duration-300 group-hover:scale-105"></div>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-white transition-opacity duration-300"></div>
                <span className="relative z-10">{t("Cadastre-se")}</span>
              </button>
            </>
          )}

          <button className="block md:hidden text-white text-2xl" onClick={toggleMenu}>
            {isMenuOpen ? <IoCloseOutline /> : <IoMenuOutline />}
          </button>
        </div>
      </header>

      {isMenuOpen && (
        <div
          id="modal-background"
          className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex justify-center items-center z-50"
          onClick={closeMenuOnOutsideClick}
        >
          <div className="bg-slate-800/95 p-8 rounded-xl w-4/5 max-w-lg text-center border border-slate-700/50">
            <ul className="space-y-6">
              <li
                className="cursor-pointer font-medium text-lg transition-colors"
                onClick={() => {
                  navigate("/benefits")
                  toggleMenu()
                }}
              >
                <span className="text-emerald-400 hover:text-emerald-300 transition-colors">{t("Benefícios")}</span>
              </li>
              <li
                className="cursor-pointer font-medium text-lg transition-colors"
                onClick={() => {
                  navigate("/plans")
                  toggleMenu()
                }}
              >
                <span className="text-blue-400 hover:text-blue-300 transition-colors">{t("Planos")}</span>
              </li>
              <li
                className="cursor-pointer font-medium text-lg transition-colors"
                onClick={() => {
                  navigate("/contact")
                  toggleMenu()
                }}
              >
                <span className="text-amber-400 hover:text-amber-300 transition-colors">{t("Contato")}</span>
              </li>
            </ul>
            {!isLoggedIn && (
              <div className="flex flex-col mt-8 space-y-4">
                <button
                  className="w-full py-2.5 px-4 rounded-lg bg-slate-700/50 text-slate-300 hover:bg-slate-700 border border-slate-600/50 transition-colors"
                  onClick={() => {
                    navigate("/login")
                    toggleMenu()
                  }}
                >
                  {t("Fazer login")}
                </button>
                <button
                  className="w-full py-2.5 px-4 rounded-lg text-white relative group overflow-hidden"
                  onClick={() => {
                    navigate("/register")
                    toggleMenu()
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 transition-transform duration-300 group-hover:scale-105"></div>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-white transition-opacity duration-300"></div>
                  <span className="relative z-10">{t("Cadastre-se")}</span>
                </button>
              </div>
            )}
            <hr className="my-6 w-full border-slate-700/50" />
            <div className="flex justify-center space-x-4 mt-4">
              <button
                onClick={() => handleLanguageChange("en")}
                className={`flex items-center space-x-2 p-2 rounded-lg ${selectedLanguage === "en" ? "bg-slate-700/70" : "hover:bg-slate-700/30"}`}
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/en/a/a4/Flag_of_the_United_States.svg"
                  alt="English"
                  className="w-6 h-6"
                />
              </button>
              <button
                onClick={() => handleLanguageChange("es")}
                className={`flex items-center space-x-2 p-2 rounded-lg ${selectedLanguage === "es" ? "bg-slate-700/70" : "hover:bg-slate-700/30"}`}
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/en/9/9a/Flag_of_Spain.svg"
                  alt="Español"
                  className="w-6 h-6"
                />
              </button>
              <button
                onClick={() => handleLanguageChange("pt")}
                className={`flex items-center space-x-2 p-2 rounded-lg ${selectedLanguage === "pt" ? "bg-slate-700/70" : "hover:bg-slate-700/30"}`}
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/en/0/05/Flag_of_Brazil.svg"
                  alt="Português"
                  className="w-6 h-6"
                />
              </button>
            </div>
          </div>
        </div>
      )}
      {isLanguageModalOpen && (
        <div
          id="language-modal-background"
          className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex justify-center items-center z-50"
          onClick={(e) => {
            if ((e.target as HTMLElement).id === "language-modal-background") {
              setIsLanguageModalOpen(false)
            }
          }}
        >
          <div className="bg-slate-800/95 p-8 rounded-xl w-4/5 max-w-md text-center border border-slate-700/50">
            <h3 className="text-xl font-bold text-white mb-6">{t("Selecione o idioma")}</h3>
            <div className="flex flex-col gap-4">
              <button
                className={`flex items-center p-3 rounded-lg w-full ${
                  selectedLanguage === "en" ? "bg-slate-700" : "hover:bg-slate-700/50"
                }`}
                onClick={() => handleLanguageChange("en")}
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/en/a/a4/Flag_of_the_United_States.svg"
                  alt="English"
                  className="w-6 h-6 mr-3"
                />
                <span className="text-white">English</span>
              </button>
              <button
                className={`flex items-center p-3 rounded-lg w-full ${
                  selectedLanguage === "es" ? "bg-slate-700" : "hover:bg-slate-700/50"
                }`}
                onClick={() => handleLanguageChange("es")}
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/en/9/9a/Flag_of_Spain.svg"
                  alt="Español"
                  className="w-6 h-6 mr-3"
                />
                <span className="text-white">Español</span>
              </button>
              <button
                className={`flex items-center p-3 rounded-lg w-full ${
                  selectedLanguage === "pt" ? "bg-slate-700" : "hover:bg-slate-700/50"
                }`}
                onClick={() => handleLanguageChange("pt")}
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/en/0/05/Flag_of_Brazil.svg"
                  alt="Português"
                  className="w-6 h-6 mr-3"
                />
                <span className="text-white">Português</span>
              </button>
            </div>
            <button
              className="mt-6 py-2 px-4 rounded-lg text-sm font-medium bg-slate-700/50 text-slate-300 hover:bg-slate-700 border border-slate-600/50 transition-colors"
              onClick={() => setIsLanguageModalOpen(false)}
            >
              {t("Fechar")}
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="relative flex items-center justify-center min-h-[90vh] px-4 z-10">
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute -inset-[10px] rounded-full opacity-30 blur-3xl bg-pink-500"
            style={{
              top: mousePosition.y * 0.05,
              left: mousePosition.x * 0.05,
              transition: "all 0.3s ease-out",
              width: "50%",
              height: "50%",
            }}
          />
        </div>

        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full border-4 border-dashed border-pink-500/30 animate-[spin_20s_linear_infinite]" />
          <div className="absolute top-1/3 right-1/4 w-48 h-48 rounded-full border-4 border-dashed border-purple-500/30 animate-[spin_15s_linear_infinite_reverse]" />
          <div className="absolute bottom-1/4 left-1/3 w-32 h-32 rounded-full border-4 border-dashed border-indigo-500/30 animate-[spin_10s_linear_infinite]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-pink-900/30 border border-pink-800/30">
              <IoRocketOutline className="text-3xl text-pink-400" />
            </div>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold mb-6 text-white leading-tight">
            {t("Transforme seus valores")} <br /> {t("em metas alcançáveis")}
          </h1>

          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 font-semibold">
              {t("Sonhe grande, planeje com propósito e transforme sua jornada em um legado.")}
            </span>
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              className="group relative flex items-center justify-center py-3 px-6 rounded-lg font-medium text-sm text-white overflow-hidden"
              onClick={() => navigate("/plans")}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 transition-transform duration-300 group-hover:scale-105"></div>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-white transition-opacity duration-300"></div>
              <span className="relative z-10 flex items-center">
                {t("Ver planos")}
                <IoArrowForward className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </button>

            <button
              className="py-3 px-6 rounded-lg font-medium text-sm bg-slate-700/50 text-slate-300 hover:bg-slate-700 border border-slate-600/50 transition-colors"
              onClick={() => navigate("/contact")}
            >
              {t("Entre em contato")}
            </button>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <section className="py-20 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t("Benefícios")}</h2>
            <p className="text-slate-300 max-w-2xl mx-auto">
              {t(
                "Conheça os principais benefícios de nossa plataforma e veja como cada recurso pode ajudar você a alcançar suas metas de forma eficiente e segura.",
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => {
              const colorClasses = getColorClasses(benefit.color)

              return (
                <div
                  key={index}
                  className={`relative overflow-hidden rounded-xl shadow-md backdrop-blur-md border transition-all duration-300 ${
                    colorClasses.border
                  } ${colorClasses.hoverBg} bg-slate-800/70 transform transition-all duration-500 ease-out ${
                    animateIn ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="absolute inset-0 overflow-hidden">
                    <div
                      className={`absolute -inset-[10px] rounded-full opacity-20 blur-3xl bg-gradient-to-r ${
                        colorClasses.gradient
                      }`}
                      style={{
                        transition: "all 0.5s ease-out",
                        width: "50%",
                        height: "50%",
                      }}
                    />
                  </div>

                  <div className="relative p-6">
                    <div className="flex items-center mb-4">
                      <div className={`flex items-center justify-center w-12 h-12 rounded-xl ${colorClasses.bg} mr-4`}>
                        <benefit.icon className={`text-2xl ${colorClasses.text}`} />
                      </div>
                      <h3 className="text-xl font-bold text-white">{benefit.title}</h3>
                    </div>

                    <p className="text-slate-300">{benefit.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {t("O que nossos investidores estão falando")}
            </h2>
            <p className="text-slate-300 max-w-2xl mx-auto">
              {t(
                "Confira o que nossos usuários dizem e descubra como nossa plataforma tem ajudado a transformar metas em conquistas reais.",
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="relative overflow-hidden rounded-xl shadow-md backdrop-blur-md border border-slate-700/50 bg-slate-800/70 p-6 transform transition-all duration-500 ease-out"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="absolute inset-0 overflow-hidden">
                  <div
                    className="absolute -inset-[10px] rounded-full opacity-20 blur-3xl bg-gradient-to-r from-pink-500 to-purple-600"
                    style={{
                      transition: "all 0.5s ease-out",
                      width: "50%",
                      height: "50%",
                    }}
                  />
                </div>

                <div className="flex items-center mb-4">
                  <div className="flex items-center text-pink-400 text-xl">{"★".repeat(testimonial.stars)}</div>
                  <span className="ml-2 text-slate-400 text-sm">{testimonial.stars}.0</span>
                </div>

                <p className="text-slate-300 mb-6">{testimonial.comment}</p>

                <div className="flex items-center mt-auto">
                  <img
                    src={
                      testimonial.image
                        ? `${configBackendConnection.baseURL}/${testimonial.image}`
                        : `https://robohash.org/${testimonial.full_name}.png`
                    }
                    alt={`Avatar de ${testimonial.full_name}`}
                    className="rounded-full w-10 h-10 mr-4 flex-shrink-0 border border-slate-700/50"
                  />
                  <div>
                    <p className="text-white font-semibold">{testimonial.full_name}</p>
                    <p className="text-slate-400 text-sm">{testimonial.profession}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 relative z-10">
        <div className="max-w-4xl mx-auto relative overflow-hidden rounded-2xl shadow-xl backdrop-blur-md border border-slate-700/50 bg-slate-800/70 p-10">
          <div className="absolute inset-0 overflow-hidden">
            <div
              className="absolute -inset-[10px] rounded-full opacity-30 blur-3xl bg-gradient-to-r from-pink-600 to-purple-600"
              style={{
                top: mousePosition.y * 0.05,
                left: mousePosition.x * 0.05,
                transition: "all 0.3s ease-out",
                width: "50%",
                height: "50%",
              }}
            />
          </div>

          <div className="relative z-10 text-center">
            <div className="flex justify-center mb-6">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-pink-900/30 border border-pink-800/30">
                <IoCalendarOutline className="text-3xl text-pink-400" />
              </div>
            </div>

            <h2 className="text-3xl font-bold text-white mb-6">{t("Pronto para transformar seu futuro?")}</h2>
            <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
              {t(
                "Não espere mais para começar sua jornada rumo ao sucesso. Com nossas ferramentas, você pode planejar, acompanhar e alcançar suas metas de forma eficiente. O futuro que você deseja está a um clique de distância.",
              )}
            </p>

            {!isLoggedIn && (
              <button
                className="group relative inline-flex items-center justify-center py-3 px-6 rounded-lg font-medium text-sm text-white overflow-hidden"
                onClick={() => navigate("/register")}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 transition-transform duration-300 group-hover:scale-105"></div>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-white transition-opacity duration-300"></div>
                <span className="relative z-10 flex items-center">
                  {t("Crie uma conta")}
                  <IoArrowForward className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 relative z-10 border-t border-slate-700/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-10">
            <div className="flex items-center mb-6 md:mb-0 h-10 overflow-hidden">
              <img src="src/assets/images/logo_mov.png" alt="Logo" className="h-14 object-contain" />
            </div>

            <nav className="flex flex-wrap justify-center gap-6">
              <a href="/benefits" className="text-emerald-400 hover:text-emerald-300 transition-colors">
                {t("Benefícios")}
              </a>
              <a href="/plans" className="text-blue-400 hover:text-blue-300 transition-colors">
                {t("Planos")}
              </a>
              <a href="/contact" className="text-amber-400 hover:text-amber-300 transition-colors">
                {t("Contato")}
              </a>
            </nav>
          </div>

          {!isLoggedIn && (
            <div className="relative overflow-hidden rounded-xl shadow-md backdrop-blur-md border border-slate-700/50 bg-slate-800/70 p-8 mb-10">
              <div className="absolute inset-0 overflow-hidden">
                <div
                  className="absolute -inset-[10px] rounded-full opacity-20 blur-3xl bg-gradient-to-r from-pink-600 to-purple-600"
                  style={{
                    transition: "all 0.5s ease-out",
                    width: "50%",
                    height: "50%",
                  }}
                />
              </div>

              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-center md:text-left">
                  <h3 className="text-xl font-bold text-white mb-2">{t("Pronto para transformar seu futuro?")}</h3>
                  <p className="text-slate-300">{t("Não espere mais para começar sua jornada rumo ao sucesso.")}</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    className="py-2.5 px-5 rounded-lg font-medium text-sm bg-slate-700/50 text-slate-300 hover:bg-slate-700 border border-slate-600/50 transition-colors"
                    onClick={() => navigate("/login")}
                  >
                    {t("Fazer login")}
                  </button>

                  <button
                    className="group relative flex items-center justify-center py-2.5 px-5 rounded-lg font-medium text-sm text-white overflow-hidden"
                    onClick={() => navigate("/register")}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 transition-transform duration-300 group-hover:scale-105"></div>
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-white transition-opacity duration-300"></div>
                    <span className="relative z-10">{t("Cadastre-se")}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col md:flex-row justify-between items-center pt-6 border-t border-slate-700/50">
            <p className="text-slate-400 text-sm mb-4 md:mb-0">
              © 2025 | {t("Desenvolvido por Dalacorte Innovations")}
            </p>

            <div className="flex gap-6">
              <a href="#" className="text-slate-400 text-sm hover:text-white transition-colors">
                {t("Política de privacidade")}
              </a>
              <a href="#" className="text-slate-400 text-sm hover:text-white transition-colors">
                {t("Política de cookies")}
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage