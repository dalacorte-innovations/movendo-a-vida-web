"use client"

import { useState, useContext, useRef, useEffect } from "react"
import { useTranslation } from "react-i18next"
import Sidebar from "../../components/sidebar"
import { useNavigate } from "react-router-dom"
import { ThemeContext } from "../../utils/ThemeContext.jsx"
import { getAuthHeaders, endpoints, configBackendConnection } from "../../utils/backendConnection"
import { toast } from "react-toastify"
import {
  IoSend,
  IoArrowBack,
  IoStar,
  IoStarOutline,
  IoHappyOutline,
  IoDocumentTextOutline,
  IoCodeSlashOutline,
} from "react-icons/io5"

const FeedbackPage = () => {
  const { darkMode } = useContext(ThemeContext)
  const { t } = useTranslation()
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [feedback, setFeedback] = useState("")
  const [category, setCategory] = useState("")
  const [isPublic, setIsPublic] = useState(true)
  const [charCount, setCharCount] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [animateIn, setAnimateIn] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const waveCanvasRef = useRef<HTMLCanvasElement>(null)
  const waveAnimationRef = useRef<number>()
  const [profession, setProfession] = useState("")

  const navigate = useNavigate()

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

  const handleRatingChange = (value) => setRating(value)
  const handleFeedbackChange = (e) => {
    setFeedback(e.target.value)
    setCharCount(e.target.value.length)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!rating || !feedback || !category) {
      toast.error(t("Por favor, preencha todos os campos obrigatórios."))
      return
    }

    const feedbackData = {
      stars: rating,
      comment: feedback,
      category,
      feedback_mode: isPublic ? "public" : "private",
      profession: profession,
    }

    try {
      setIsSubmitting(true)
      const response = await fetch(`${configBackendConnection.baseURL}/${endpoints.feedbackAPI}`, {
        method: "POST",
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(feedbackData),
      })

      if (response.ok) {
        toast.success(t("Feedback enviado com sucesso!"))
        navigate("/")
      } else {
        toast.error(t("Ocorreu um erro ao enviar o feedback."))
      }
    } catch (error) {
      toast.error(t("Erro de conexão. Tente novamente mais tarde."))
    } finally {
      setIsSubmitting(false)
    }
  }

  const getCategoryIcon = (categoryValue) => {
    switch (categoryValue) {
      case "problema_tecnico":
        return <IoCodeSlashOutline className="text-xl" />
      case "sugestao_melhoria":
        return <IoDocumentTextOutline className="text-xl" />
      case "elogio":
        return <IoHappyOutline className="text-xl" />
      default:
        return null
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
        <div className="max-w-3xl mx-auto">
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

            <div className="relative p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
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
                      {t("Sua Opinião é Importante")}
                    </h1>
                    <p className={`text-sm mt-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                      {t("Compartilhe suas sugestões, elogios ou críticas para ajudar a melhorar nossos serviços.")}
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div
                  className={`transform transition-all duration-500 ease-out ${animateIn ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
                  style={{ transitionDelay: "100ms" }}
                >
                  <label className={`block mb-3 font-medium ${darkMode ? "text-white" : "text-slate-800"}`}>
                    {t("Como você avalia sua experiência?")}
                  </label>
                  <div className="flex space-x-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => handleRatingChange(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        className={`text-2xl transition-transform hover:scale-110 ${
                          star <= (hoveredRating || rating)
                            ? darkMode
                              ? "text-pink-400"
                              : "text-blue-500"
                            : "text-gray-400"
                        }`}
                      >
                        {star <= (hoveredRating || rating) ? <IoStar /> : <IoStarOutline />}
                      </button>
                    ))}
                    <span className={`ml-2 ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                      {rating > 0 ? `${rating}/5` : ""}
                    </span>
                  </div>
                </div>

                <div
                  className={`transform transition-all duration-500 ease-out ${animateIn ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
                  style={{ transitionDelay: "200ms" }}
                >
                  <label className={`block mb-3 font-medium ${darkMode ? "text-white" : "text-slate-800"}`}>
                    {t("Categoria")}
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {[
                      { value: "problema_tecnico", label: t("Problema técnico") },
                      { value: "sugestao_melhoria", label: t("Sugestão de melhoria") },
                      { value: "elogio", label: t("Elogio") },
                    ].map((option) => (
                      <button
                        type="button"
                        key={option.value}
                        onClick={() => setCategory(option.value)}
                        className={`flex items-center p-3 rounded-lg border-2 transition-colors ${
                          category === option.value
                            ? darkMode
                              ? "bg-pink-900/30 border-pink-800/50 text-pink-300"
                              : "bg-blue-100 border-blue-300 text-blue-700"
                            : darkMode
                              ? "bg-slate-700/30 border-slate-600/50 text-white hover:bg-slate-700/50"
                              : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <div
                          className={`mr-3 ${
                            category === option.value
                              ? darkMode
                                ? "text-pink-400"
                                : "text-blue-600"
                              : darkMode
                                ? "text-slate-400"
                                : "text-slate-500"
                          }`}
                        >
                          {getCategoryIcon(option.value)}
                        </div>
                        <span>{option.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div
                  className={`transform transition-all duration-500 ease-out ${animateIn ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
                  style={{ transitionDelay: "250ms" }}
                >
                  <label className={`block mb-3 font-medium ${darkMode ? "text-white" : "text-slate-800"}`}>
                    {t("Profissão")}
                  </label>
                  <input
                    type="text"
                    className={`w-full p-4 rounded-lg border-2 focus:outline-none ${
                      darkMode
                        ? "bg-slate-700/30 text-white placeholder-slate-400 border-slate-600/50 focus:border-pink-800/50"
                        : "bg-white text-slate-800 placeholder-slate-400 border-slate-200 focus:border-blue-300"
                    } transition-colors`}
                    placeholder={t("Digite sua profissão...")}
                    value={profession}
                    onChange={(e) => setProfession(e.target.value)}
                  />
                </div>

                <div
                  className={`transform transition-all duration-500 ease-out ${animateIn ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
                  style={{ transitionDelay: "300ms" }}
                >
                  <label className={`block mb-3 font-medium ${darkMode ? "text-white" : "text-slate-800"}`}>
                    {t("Deixe um comentário")}
                  </label>
                  <div
                    className={`relative rounded-lg overflow-hidden border-2 ${
                      darkMode
                        ? "border-slate-600/50 focus-within:border-pink-800/50"
                        : "border-slate-200 focus-within:border-blue-300"
                    } transition-colors`}
                  >
                    <textarea
                      maxLength={500}
                      rows={5}
                      className={`w-full p-4 focus:outline-none resize-none ${
                        darkMode
                          ? "bg-slate-700/30 text-white placeholder-slate-400"
                          : "bg-white text-slate-800 placeholder-slate-400"
                      }`}
                      placeholder={t("Escreva seu feedback...")}
                      value={feedback}
                      onChange={handleFeedbackChange}
                    />
                    <div
                      className={`absolute bottom-2 right-3 text-xs ${
                        charCount > 400
                          ? charCount > 450
                            ? "text-red-500"
                            : "text-yellow-500"
                          : darkMode
                            ? "text-slate-400"
                            : "text-slate-500"
                      }`}
                    >
                      {charCount}/500
                    </div>
                  </div>
                </div>

                <div
                  className={`transform transition-all duration-500 ease-out ${animateIn ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
                  style={{ transitionDelay: "400ms" }}
                >
                  <div
                    className={`p-4 rounded-lg ${
                      darkMode ? "bg-slate-700/30 border border-slate-600/50" : "bg-blue-50/50 border border-blue-100"
                    }`}
                  >
                    <div className="flex items-center mb-3">
                      <h3 className={`font-medium ${darkMode ? "text-white" : "text-slate-800"}`}>
                        {t("Visibilidade do Feedback")}
                      </h3>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        type="button"
                        onClick={() => setIsPublic(true)}
                        className={`flex-1 flex items-center justify-center p-3 rounded-lg border-2 transition-colors ${
                          isPublic
                            ? darkMode
                              ? "bg-pink-900/30 border-pink-800/50 text-pink-300"
                              : "bg-blue-100 border-blue-300 text-blue-700"
                            : darkMode
                              ? "bg-slate-700/30 border-slate-600/50 text-white hover:bg-slate-700/50"
                              : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <span>{t("Público")}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsPublic(false)}
                        className={`flex-1 flex items-center justify-center p-3 rounded-lg border-2 transition-colors ${
                          !isPublic
                            ? darkMode
                              ? "bg-pink-900/30 border-pink-800/50 text-pink-300"
                              : "bg-blue-100 border-blue-300 text-blue-700"
                            : darkMode
                              ? "bg-slate-700/30 border-slate-600/50 text-white hover:bg-slate-700/50"
                              : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <span>{t("Privado")}</span>
                      </button>
                    </div>
                    <p className={`mt-2 text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                      {isPublic
                        ? t("Seu feedback poderá ser exibido publicamente (sem identificação).")
                        : t("Seu feedback será visível apenas para nossa equipe.")}
                    </p>
                  </div>
                </div>

                <div
                  className={`flex justify-between mt-8 transform transition-all duration-500 ease-out ${animateIn ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
                  style={{ transitionDelay: "500ms" }}
                >
                  <button
                    type="button"
                    className={`flex items-center justify-center py-3 px-5 rounded-lg transition-colors ${
                      darkMode
                        ? "bg-slate-700/50 text-slate-300 hover:bg-slate-700 border border-slate-600/50"
                        : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                    }`}
                    onClick={() => navigate("/")}
                  >
                    <IoArrowBack className="mr-2" />
                    {t("Voltar")}
                  </button>
                  <button
                    type="submit"
                    className={`group relative flex items-center justify-center py-3 px-6 rounded-lg font-medium text-white overflow-hidden transition-all duration-300 ${
                      isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                    disabled={isSubmitting}
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
                      {isSubmitting ? t("Enviando...") : t("Enviar Feedback")}
                      <IoSend className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default FeedbackPage

