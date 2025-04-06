"use client"

import { useContext, useState, useEffect, useRef } from "react"
import { ThemeContext } from "../../utils/ThemeContext"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import {
  IoMedalOutline,
  IoHappyOutline,
  IoLeafOutline,
  IoHeartOutline,
  IoArrowBack,
  IoShieldCheckmarkOutline,
  IoRocketOutline,
  IoTrendingUpOutline,
  IoChevronBackOutline,
} from "react-icons/io5"

const BenefitsPage = () => {
  const { darkMode } = useContext(ThemeContext)
  const { t } = useTranslation()
  const navigate = useNavigate()
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

    // Different wave colors based on theme
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

  const benefits = [
    {
      id: 1,
      icon: IoMedalOutline,
      title: t("Qualidade de Vida"),
      description: t(
        "Nosso plano é desenhado para melhorar sua qualidade de vida com acesso a melhores serviços e acompanhamento constante.",
      ),
      color: "emerald",
    },
    {
      id: 2,
      icon: IoHappyOutline,
      title: t("Bem-Estar Mental"),
      description: t("Conte com apoio psicológico e recursos que promovem o bem-estar mental e emocional."),
      color: "blue",
    },
    {
      id: 3,
      icon: IoLeafOutline,
      title: t("Sustentabilidade"),
      description: t("Benefícios pensados para promover um estilo de vida sustentável e saudável."),
      color: "amber",
    },
    {
      id: 4,
      icon: IoHeartOutline,
      title: t("Apoio ao Cliente"),
      description: t("Apoio completo e constante para todas as suas necessidades e dúvidas relacionadas ao plano."),
      color: "pink",
    },
    {
      id: 5,
      icon: IoShieldCheckmarkOutline,
      title: t("Segurança Financeira"),
      description: t("Ferramentas e orientações para garantir sua segurança financeira a longo prazo."),
      color: "purple",
    },
    {
      id: 6,
      icon: IoRocketOutline,
      title: t("Crescimento Pessoal"),
      description: t("Recursos para impulsionar seu desenvolvimento pessoal e profissional."),
      color: "indigo",
    },
    {
      id: 7,
      icon: IoTrendingUpOutline,
      title: t("Planejamento Eficiente"),
      description: t("Metodologias comprovadas para um planejamento de vida eficiente e realista."),
      color: "cyan",
    },
  ]

  const getColorClasses = (color) => {
    const colorMap = {
      emerald: {
        bg: darkMode ? "bg-emerald-900/30" : "bg-emerald-100",
        text: darkMode ? "text-emerald-400" : "text-emerald-600",
        border: darkMode ? "border-emerald-800/30" : "border-emerald-200",
        gradient: darkMode ? "from-emerald-500 to-teal-600" : "from-emerald-500 to-teal-600",
      },
      blue: {
        bg: darkMode ? "bg-blue-900/30" : "bg-blue-100",
        text: darkMode ? "text-blue-400" : "text-blue-600",
        border: darkMode ? "border-blue-800/30" : "border-blue-200",
        gradient: darkMode ? "from-blue-500 to-indigo-600" : "from-blue-500 to-indigo-600",
      },
      amber: {
        bg: darkMode ? "bg-amber-900/30" : "bg-amber-100",
        text: darkMode ? "text-amber-400" : "text-amber-600",
        border: darkMode ? "border-amber-800/30" : "border-amber-200",
        gradient: darkMode ? "from-amber-500 to-orange-600" : "from-amber-500 to-orange-600",
      },
      pink: {
        bg: darkMode ? "bg-pink-900/30" : "bg-pink-100",
        text: darkMode ? "text-pink-400" : "text-pink-600",
        border: darkMode ? "border-pink-800/30" : "border-pink-200",
        gradient: darkMode ? "from-pink-500 to-rose-600" : "from-pink-500 to-rose-600",
      },
      purple: {
        bg: darkMode ? "bg-purple-900/30" : "bg-purple-100",
        text: darkMode ? "text-purple-400" : "text-purple-600",
        border: darkMode ? "border-purple-800/30" : "border-purple-200",
        gradient: darkMode ? "from-purple-500 to-violet-600" : "from-purple-500 to-violet-600",
      },
      indigo: {
        bg: darkMode ? "bg-indigo-900/30" : "bg-indigo-100",
        text: darkMode ? "text-indigo-400" : "text-indigo-600",
        border: darkMode ? "border-indigo-800/30" : "border-indigo-200",
        gradient: darkMode ? "from-indigo-500 to-blue-600" : "from-indigo-500 to-blue-600",
      },
      cyan: {
        bg: darkMode ? "bg-cyan-900/30" : "bg-cyan-100",
        text: darkMode ? "text-cyan-400" : "text-cyan-600",
        border: darkMode ? "border-cyan-800/30" : "border-cyan-200",
        gradient: darkMode ? "from-cyan-500 to-teal-600" : "from-cyan-500 to-teal-600",
      },
    }

    return (
      colorMap[color] ||
      (darkMode
        ? {
            bg: "bg-pink-900/30",
            text: "text-pink-400",
            border: "border-pink-800/30",
            gradient: "from-pink-500 to-purple-600",
          }
        : {
            bg: "bg-blue-100",
            text: "text-blue-600",
            border: "border-blue-200",
            gradient: "from-blue-500 to-indigo-600",
          })
    )
  }

  return (
    <div className={`min-h-screen overflow-hidden ${darkMode ? "bg-[#0F172A]" : "bg-[#f0f7ff]"}`}>
      <canvas ref={waveCanvasRef} className="fixed inset-0 pointer-events-none z-0" />
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />

      {/* Back button in the top left corner */}
      <div className="fixed top-4 left-4 z-20">
        <button
          onClick={() => navigate("/")}
          className={`flex items-center justify-center w-10 h-10 rounded-full shadow-lg transition-colors ${
            darkMode ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
          aria-label={t("Voltar")}
        >
          <IoChevronBackOutline className="text-xl" />
        </button>
      </div>

      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <div
          className={`relative overflow-hidden rounded-2xl shadow-xl backdrop-blur-md mb-10 ${
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

          <div className="relative p-6 md:p-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div className="flex items-center">
                <div>
                  <h1 className={`text-2xl md:text-3xl font-bold ${darkMode ? "text-white" : "text-slate-800"}`}>
                    {t("Benefícios do Plano de Vida")}
                  </h1>
                  <p className={`text-sm mt-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                    {t("Descubra como nosso plano pode transformar sua vida")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => {
            const colorClasses = getColorClasses(benefit.color)

            return (
              <div
                key={benefit.id}
                className={`relative overflow-hidden rounded-xl shadow-md backdrop-blur-md border transition-all duration-300 ${
                  colorClasses.border
                } ${darkMode ? "bg-slate-800/70" : "bg-white/80"} transform transition-all duration-500 ease-out ${
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
                    <h2 className={`text-xl font-bold ${darkMode ? "text-white" : "text-slate-800"}`}>
                      {benefit.title}
                    </h2>
                  </div>

                  <p className={`text-sm ${darkMode ? "text-slate-300" : "text-slate-600"}`}>{benefit.description}</p>
                </div>
              </div>
            )
          })}
        </div>

        <div
          className={`relative overflow-hidden rounded-xl shadow-md backdrop-blur-md mt-10 ${
            darkMode ? "bg-slate-800/70 border border-slate-700/50" : "bg-white/80 border border-blue-100"
          } transform transition-all duration-500 ease-out ${
            animateIn ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
          style={{ transitionDelay: "700ms" }}
        >
          <div className="relative p-6 text-center">
            <p className={`text-lg italic ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
              {t('"Investir em qualidade de vida hoje é garantir um futuro mais próspero e feliz."')}
            </p>
            <p className={`mt-2 font-medium ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
              {t("Equipe Plano de Vida")}
            </p>
          </div>
        </div>

        <div className="flex justify-center mt-10">
          <button
            onClick={() => navigate("/")}
            className={`group relative flex items-center justify-center py-3.5 px-6 rounded-xl font-medium text-sm text-white overflow-hidden transition-all duration-300`}
          >
            <div
              className={`absolute inset-0 ${
                darkMode
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600"
              } transition-transform duration-300 group-hover:scale-105`}
            />
            <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-white transition-opacity duration-300" />
            <span className="relative z-10 flex items-center">
              <IoArrowBack className="mr-2 transition-transform duration-300 group-hover:-translate-x-1" />
              {t("Voltar para o site")}
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default BenefitsPage

