"use client"

import { useEffect, useRef, useState } from "react"
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
  IoCompassOutline,
  IoCalendarOutline,
} from "react-icons/io5"

const LandingPage = () => {
  const { t } = useTranslation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [selectedLanguage, setSelectedLanguage] = useState("pt")
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [animateIn, setAnimateIn] = useState(false)
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

    // Different wave colors based on theme
    const waves = [
      {
        amplitude: 50,
        period: 0.02,
        speed: 0.01,
        phase: 0,
        color: "rgba(219, 39, 119, 0.3)", // Pink
        lineWidth: 3,
      },
      {
        amplitude: 30,
        period: 0.03,
        speed: 0.015,
        phase: 2,
        color: "rgba(139, 92, 246, 0.3)", // Purple
        lineWidth: 2,
      },
      {
        amplitude: 70,
        period: 0.01,
        speed: 0.005,
        phase: 4,
        color: "rgba(236, 72, 153, 0.2)", // Pink
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
        ctx.fillStyle = `rgba(219, 39, 119, ${particle.opacity})` // Pink
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
          ctx.strokeStyle = `rgba(236, 72, 153, ${opacity * 0.3})` // Pink
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

  const handleLanguageChange = (language) => {
    i18n.changeLanguage(language)
    setSelectedLanguage(language)
    localStorage.setItem("Language", language)
    setIsDropdownOpen(false)
  }

  const closeMenuOnOutsideClick = (event) => {
    if (event.target.id === "modal-background") {
      setIsMenuOpen(false)
    }
  }

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false)
    }
  }

  useEffect(() => {
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    } else {
      document.removeEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isDropdownOpen])

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

  const testimonials = [
    {
      name: "Mariana Oliveira",
      profession: t("Empresária"),
      text: t(
        "Esta plataforma mudou a maneira como planejo meu futuro. Agora posso acompanhar o progresso das minhas metas com muito mais clareza.",
      ),
    },
    {
      name: "Paulo Ferreira",
      profession: t("Consultor Financeiro"),
      text: t(
        "Fantástico! Com esta ferramenta, consegui organizar minhas finanças e meus objetivos de uma forma prática e eficiente.",
      ),
    },
    {
      name: "Ana Clara Souza",
      profession: t("Engenheira"),
      text: t("Nunca foi tão fácil definir metas de longo prazo e trabalhar para alcançá-las. Recomendo para todos!"),
    },
    {
      name: "Rafael Menezes",
      profession: t("Advogado"),
      text: t(
        "Ferramenta excelente para quem quer ter controle sobre os objetivos de vida. Me ajudou a planejar melhor meu futuro.",
      ),
    },
    {
      name: "Júlia Albuquerque",
      profession: t("Médica"),
      text: t(
        "Recomendo esta plataforma a todos que buscam um planejamento eficiente e com foco em resultados. Excelente!",
      ),
    },
    {
      name: "Lucas Martins",
      profession: t("Desenvolvedor de Software"),
      text: t("Muito fácil de usar e extremamente útil para manter o foco nas minhas metas pessoais e profissionais."),
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
        <div
          className="text-white text-xl lg:text-2xl font-bold cursor-pointer flex items-center"
          onClick={() => navigate("/")}
        >
          <IoCompassOutline className="mr-2 text-pink-400" />
          {t("Plano de Vida")}
        </div>

        <nav className="hidden md:flex flex-1 justify-center space-x-4 md:space-x-8">
          <ul className="flex space-x-4 md:space-x-8">
            <li
              className="cursor-pointer text-slate-400 font-medium text-sm hover:text-white transition-colors"
              onClick={() => navigate("/benefits")}
            >
              {t("Benefícios")}
            </li>
            <li
              className="cursor-pointer text-slate-400 font-medium text-sm hover:text-white transition-colors"
              onClick={() => navigate("/plans")}
            >
              {t("Planos")}
            </li>
            <li
              className="cursor-pointer text-slate-400 font-medium text-sm hover:text-white transition-colors"
              onClick={() => navigate("/contact")}
            >
              {t("Contato")}
            </li>
            <li
              className="relative group cursor-pointer text-slate-400 font-medium text-sm hover:text-white transition-colors"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              onMouseEnter={() => setIsDropdownOpen(true)}
              ref={dropdownRef}
            >
              <span>{t("Idioma")}</span>
              {isDropdownOpen && (
                <ul className="absolute left-0 mt-1 bg-slate-800 text-white rounded-lg shadow-lg z-50 w-[7rem] border border-slate-700/50">
                  <li
                    className="p-2 hover:bg-slate-700 cursor-pointer flex items-center"
                    onClick={() => handleLanguageChange("en")}
                  >
                    <img
                      src="https://upload.wikimedia.org/wikipedia/en/a/a4/Flag_of_the_United_States.svg"
                      alt="English"
                      className="w-5 h-5 mr-2"
                    />
                    English
                  </li>
                  <li
                    className="p-2 hover:bg-slate-700 cursor-pointer flex items-center"
                    onClick={() => handleLanguageChange("es")}
                  >
                    <img
                      src="https://upload.wikimedia.org/wikipedia/en/9/9a/Flag_of_Spain.svg"
                      alt="Español"
                      className="w-5 h-5 mr-2"
                    />
                    Español
                  </li>
                  <li
                    className="p-2 hover:bg-slate-700 cursor-pointer flex items-center"
                    onClick={() => handleLanguageChange("pt")}
                  >
                    <img
                      src="https://upload.wikimedia.org/wikipedia/en/0/05/Flag_of_Brazil.svg"
                      alt="Português"
                      className="w-5 h-5 mr-2"
                    />
                    Português
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </nav>

        <div className="flex gap-4 items-center">
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
                className="cursor-pointer text-white font-medium text-lg hover:text-slate-300 transition-colors"
                onClick={() => {
                  navigate("/benefits")
                  toggleMenu()
                }}
              >
                {t("Benefícios")}
              </li>
              <li
                className="cursor-pointer text-white font-medium text-lg hover:text-slate-300 transition-colors"
                onClick={() => {
                  navigate("/plans")
                  toggleMenu()
                }}
              >
                {t("Planos")}
              </li>
              <li
                className="cursor-pointer text-white font-medium text-lg hover:text-slate-300 transition-colors"
                onClick={() => {
                  navigate("/contact")
                  toggleMenu()
                }}
              >
                {t("Contato")}
              </li>
            </ul>
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
            {t(
              "Defina sua trajetória com clareza e alcance cada marco em sua carreira e vida pessoal. Com um planejamento de 20 anos, você pode transformar seus sonhos em conquistas tangíveis.",
            )}
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
                  <div className="flex items-center text-pink-400 text-xl">{"★".repeat(5)}</div>
                  <span className="ml-2 text-slate-400 text-sm">5.0</span>
                </div>

                <p className="text-slate-300 mb-6">{testimonial.text}</p>

                <div className="flex items-center mt-auto">
                  <img
                    src={`https://robohash.org/${testimonial.name}.png`}
                    alt={`Avatar de ${testimonial.name}`}
                    className="rounded-full w-10 h-10 mr-4 flex-shrink-0 border border-slate-700/50"
                  />
                  <div>
                    <p className="text-white font-semibold">{testimonial.name}</p>
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
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 relative z-10 border-t border-slate-700/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-10">
            <div className="flex items-center mb-6 md:mb-0">
              <IoCompassOutline className="text-2xl text-pink-400 mr-2" />
              <h3 className="text-xl font-bold text-white">{t("Plano de Vida")}</h3>
            </div>

            <nav className="flex flex-wrap justify-center gap-6">
              <a href="/benefits" className="text-slate-400 hover:text-white transition-colors">
                {t("Benefícios")}
              </a>
              <a href="/plans" className="text-slate-400 hover:text-white transition-colors">
                {t("Planos")}
              </a>
              <a href="/contact" className="text-slate-400 hover:text-white transition-colors">
                {t("Contato")}
              </a>
            </nav>
          </div>

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

          <div className="flex flex-col md:flex-row justify-between items-center pt-6 border-t border-slate-700/50">
            <p className="text-slate-400 text-sm mb-4 md:mb-0">
              © 2024 | {t("Desenvolvido por Dalacorte Innovations")}
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

