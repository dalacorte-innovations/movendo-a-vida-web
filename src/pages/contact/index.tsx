"use client"

import { useContext, useState, useEffect, useRef } from "react"
import { FaWhatsapp, FaPaperPlane, FaChevronLeft } from "react-icons/fa"
import { IoArrowBack } from "react-icons/io5"
import { ThemeContext } from "../../utils/ThemeContext"
import { configBackendConnection, endpoints } from "../../utils/backendConnection"
import { toast } from "react-toastify"
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner.jsx"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { motion } from "framer-motion"

const ContactPage = () => {
  const { darkMode } = useContext(ThemeContext)
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })
  const canvasRef = useRef(null)
  const particlesRef = useRef([])
  const mouseRef = useRef({ x: 0, y: 0 })

  // Initialize particles
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    const particles = []
    const particleCount = 100

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1,
        color: darkMode
          ? `rgba(${Math.floor(Math.random() * 100 + 155)}, ${Math.floor(Math.random() * 50)}, ${Math.floor(Math.random() * 100 + 155)}, ${Math.random() * 0.5 + 0.1})`
          : `rgba(${Math.floor(Math.random() * 50)}, ${Math.floor(Math.random() * 100 + 100)}, ${Math.floor(Math.random() * 100 + 155)}, ${Math.random() * 0.5 + 0.1})`,
        speedX: Math.random() * 1 - 0.5,
        speedY: Math.random() * 1 - 0.5,
      })
    }

    particlesRef.current = particles

    // Animation function
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw particles
      particlesRef.current.forEach((particle) => {
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        ctx.fillStyle = particle.color
        ctx.fill()

        // Update position
        particle.x += particle.speedX
        particle.y += particle.speedY

        // Boundary check
        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1

        // Mouse interaction
        const dx = mouseRef.current.x - particle.x
        const dy = mouseRef.current.y - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < 100) {
          const angle = Math.atan2(dy, dx)
          const force = 0.1
          particle.speedX -= Math.cos(angle) * force
          particle.speedY -= Math.sin(angle) * force
        }
      })

      // Draw waves
      drawWaves(ctx, canvas.width, canvas.height, darkMode)

      requestAnimationFrame(animate)
    }

    // Draw waves function
    const drawWaves = (ctx, width, height, isDark) => {
      const time = Date.now() * 0.001
      const waveCount = 3

      for (let i = 0; i < waveCount; i++) {
        ctx.beginPath()

        const amplitude = 20 + i * 10
        const period = 0.01 - i * 0.002
        const yOffset = height * 0.5 + i * 50
        const opacity = 0.1 - i * 0.02

        ctx.moveTo(0, yOffset)

        for (let x = 0; x < width; x += 5) {
          const y = yOffset + Math.sin(x * period + time) * amplitude
          ctx.lineTo(x, y)
        }

        ctx.strokeStyle = isDark ? `rgba(255, 100, 255, ${opacity})` : `rgba(100, 150, 255, ${opacity})`
        ctx.lineWidth = 2
        ctx.stroke()
      }
    }

    // Track mouse position
    const handleMouseMove = (e) => {
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY,
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [darkMode])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`${configBackendConnection.baseURL}/${endpoints.emailMessageAPI}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success(t("Mensagem enviada com sucesso!"))
        setFormData({
          name: "",
          email: "",
          message: "",
        })
      } else {
        toast.error(t("Erro ao enviar a mensagem. Tente novamente."))
      }
    } catch (error) {
      toast.error(t("Erro ao conectar com o servidor. Tente novamente mais tarde."))
    } finally {
      setLoading(false)
    }
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  }

  return (
    <div
      className={`min-h-screen flex items-center justify-center relative overflow-hidden ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}
    >
      {/* Back button - Fixed position */}
      <button
        onClick={() => navigate(-1)}
        className={`fixed top-6 left-6 z-50 flex items-center justify-center w-10 h-10 rounded-full shadow-lg transition-all ${
          darkMode ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-blue-500 hover:bg-blue-600 text-white"
        }`}
        aria-label={t("Voltar")}
      >
        <FaChevronLeft />
      </button>

      {/* Animated background */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }} />

      {/* Decorative elements */}
      <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 blur-xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-80 h-80 rounded-full bg-gradient-to-r from-blue-500/10 to-cyan-500/10 blur-xl animate-pulse" />

      <div className="container mx-auto z-10 px-4">
        <motion.div
          className="flex flex-col md:flex-row items-center gap-8 max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Left side - Info */}
          <motion.div className="w-full md:w-1/2 mb-8 md:mb-0" variants={itemVariants}>
            <div
              className={`p-8 rounded-2xl ${
                darkMode
                  ? "bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-lg border border-gray-700/50"
                  : "bg-gradient-to-br from-white/90 to-gray-100/90 backdrop-blur-lg border border-gray-200/50"
              } shadow-xl`}
            >
              <h1 className={`text-4xl font-bold mb-6 ${darkMode ? "text-white" : "text-gray-800"}`}>
                {t("Contato Movendo a Vida para Mudar o Futuro")}
              </h1>

              <p className={`text-lg mb-8 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                {t("Entre em contato conosco para esclarecer dúvidas. Estamos aqui para ajudar!")}
              </p>

              <div className="space-y-6">
                <div
                  className={`flex items-center p-4 rounded-xl ${
                    darkMode ? "bg-gray-800/50 border border-gray-700/50" : "bg-white/50 border border-gray-200/50"
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      darkMode ? "bg-purple-500/20 text-purple-400" : "bg-blue-500/20 text-blue-500"
                    }`}
                  >
                    <FaWhatsapp size={24} />
                  </div>
                  <div className="ml-4">
                    <h3 className={`font-medium ${darkMode ? "text-white" : "text-gray-800"}`}>{t("WhatsApp")}</h3>
                    <a
                      href="https://wa.me/19998742217"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-sm ${darkMode ? "text-purple-400 hover:text-purple-300" : "text-blue-500 hover:text-blue-600"} transition-colors`}
                    >
                      +55 19 99874-2217
                    </a>
                  </div>
                </div>

                <div
                  className={`flex items-center p-4 rounded-xl ${
                    darkMode ? "bg-gray-800/50 border border-gray-700/50" : "bg-white/50 border border-gray-200/50"
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      darkMode ? "bg-pink-500/20 text-pink-400" : "bg-cyan-500/20 text-cyan-500"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className={`font-medium ${darkMode ? "text-white" : "text-gray-800"}`}>{t("Email")}</h3>
                    <a
                      href="mailto:contato@planodevida.com"
                      className={`text-sm ${darkMode ? "text-pink-400 hover:text-pink-300" : "text-cyan-500 hover:text-cyan-600"} transition-colors`}
                    >
                      contato@planodevida.com
                    </a>
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
          </motion.div>

          {/* Right side - Form */}
          <motion.div className="w-full md:w-1/2" variants={itemVariants}>
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <LoadingSpinner />
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className={`p-8 rounded-2xl shadow-xl ${
                  darkMode
                    ? "bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-lg border border-gray-700/50"
                    : "bg-gradient-to-br from-white/90 to-gray-100/90 backdrop-blur-lg border border-gray-200/50"
                }`}
              >
                <h2 className={`text-2xl font-bold mb-6 ${darkMode ? "text-white" : "text-gray-800"}`}>
                  {t("Envie sua mensagem")}
                </h2>

                <div className="space-y-6">
                  <div>
                    <label
                      htmlFor="name"
                      className={`block mb-2 text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                    >
                      {t("Seu nome completo")}
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full p-3 rounded-lg focus:outline-none focus:ring-2 transition-all ${
                        darkMode
                          ? "bg-gray-800/50 border border-gray-700 text-white focus:ring-blue-500/50"
                          : "bg-white/80 border border-gray-300 text-gray-900 focus:ring-blue-500/50"
                      }`}
                      placeholder={t("Digite seu nome aqui")}
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className={`block mb-2 text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                    >
                      {t("Seu e-mail*")}
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full p-3 rounded-lg focus:outline-none focus:ring-2 transition-all ${
                        darkMode
                          ? "bg-gray-800/50 border border-gray-700 text-white focus:ring-blue-500/50"
                          : "bg-white/80 border border-gray-300 text-gray-900 focus:ring-blue-500/50"
                      }`}
                      placeholder={t("Digite seu e-mail aqui")}
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className={`block mb-2 text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                    >
                      {t("Sua mensagem*")}
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      className={`w-full p-3 h-32 rounded-lg focus:outline-none focus:ring-2 transition-all ${
                        darkMode
                          ? "bg-gray-800/50 border border-gray-700 text-white focus:ring-blue-500/50"
                          : "bg-white/80 border border-gray-300 text-gray-900 focus:ring-blue-500/50"
                      }`}
                      placeholder={t("Escreva sua mensagem aqui")}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className={`w-full py-3 px-6 rounded-lg flex items-center justify-center gap-2 font-medium transition-all ${
                      darkMode
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                        : "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white"
                    }`}
                  >
                    <FaPaperPlane />
                    {t("Enviar mensagem")}
                  </button>

                  <a
                    href="https://wa.me/19998742217"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-center gap-2 py-3 px-6 rounded-lg w-full transition-all ${
                      darkMode
                        ? "bg-green-600/20 text-green-400 hover:bg-green-600/30 border border-green-600/30"
                        : "bg-green-500/10 text-green-600 hover:bg-green-500/20 border border-green-500/30"
                    }`}
                  >
                    <FaWhatsapp size={20} />
                    <span>{t("Entre em contato via WhatsApp")}</span>
                  </a>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative circles */}
      <div className="absolute bottom-0 left-0 w-full h-1/3 pointer-events-none overflow-hidden">
        <div
          className={`absolute -bottom-16 -left-16 w-32 h-32 rounded-full ${darkMode ? "bg-purple-600/10" : "bg-blue-500/10"}`}
        />
        <div
          className={`absolute -bottom-32 left-32 w-64 h-64 rounded-full ${darkMode ? "bg-pink-600/5" : "bg-cyan-500/5"}`}
        />
      </div>
    </div>
  )
}

export default ContactPage

