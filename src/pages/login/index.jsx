"use client"

import { useState, useEffect, useRef, useContext } from "react"
import { MdEmail } from "react-icons/md"
import { FaEye, FaEyeSlash } from "react-icons/fa"
import { RiLock2Fill } from "react-icons/ri"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { saveToStorage } from "../../utils/storage"
import { configBackendConnection, endpoints } from "../../utils/backendConnection"
import { useTranslation } from "react-i18next"
import LoginWithGoogle from "../../components/Google/loginGoogle.tsx"
import LoginWithFacebook from "../../components/Facebook/loginFacebook.tsx"
import { ThemeContext } from "../../utils/ThemeContext.jsx"

const LoginPage = ({ onLogin }) => {
  const { t } = useTranslation()
  const { darkMode } = useContext(ThemeContext)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [usernameError, setUsernameError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [animateIn, setAnimateIn] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const navigate = useNavigate()
  const canvasRef = useRef(null)
  const waveCanvasRef = useRef(null)
  const animationRef = useRef(null)
  const waveAnimationRef = useRef(null)

  useEffect(() => {
    setAnimateIn(true)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  // Wave animation
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

  // Particle animation
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

    const particles = []

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

  const handleUsernameChange = (event) => {
    setUsername(event.target.value)
    setUsernameError("")
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
    setPasswordError("")
  }

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible)
  }

  const handleRememberMeChange = (event) => {
    setRememberMe(event.target.checked)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    console.log("Submit triggered")

    setUsernameError("")
    setPasswordError("")

    let canSubmit = true

    if (username === "") {
      setUsernameError(t("Campo obrigatório*"))
      canSubmit = false
    }

    if (password === "") {
      setPasswordError(t("Campo obrigatório*"))
      canSubmit = false
    }

    if (!canSubmit) {
      return
    }

    setIsLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 400))

      const response = await fetch(`${configBackendConnection.baseURL}/${endpoints.loginToken}`, {
        method: "POST",
        headers: configBackendConnection.headersDefault,
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      })

      if (response.status === 200) {
        const data = await response.json()
        const {
          token,
          name,
          user_type,
          plan_name,
          last_payment,
          payment_made,
          phone,
          email,
          image_url,
          referral_code,
          referral_count,
        } = data

        const storageData = {
          token,
          name,
          user_type,
          plan_name,
          last_payment,
          payment_made,
          phone,
          email,
          image_url,
          referral_code,
          referral_count,
        }

        if (rememberMe) {
          localStorage.setItem("token", token)
        } else {
          sessionStorage.setItem("token", token)
        }

        saveToStorage(storageData)

        toast.success(t("Login bem-sucedido!"))
        onLogin(true)
        navigate("/")
      } else {
        toast.error(t("Credenciais inválidas"))
      }
    } catch (error) {
      toast.error(t("Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente mais tarde."))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center ${darkMode ? "bg-[#0F172A]" : "bg-[#f0f7ff]"} font-metropolis relative overflow-hidden`}
    >
      {/* Animated background canvases */}
      <canvas ref={waveCanvasRef} className="fixed inset-0 pointer-events-none z-0" />
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />

      <div className="flex w-full h-screen">
        {/* Left side - animated gradient */}
        <div className="hidden md:flex md:w-1/2 relative overflow-hidden">
          <div
            className={`absolute inset-0 ${
              darkMode
                ? "bg-gradient-to-br from-pink-900 via-purple-900 to-indigo-900"
                : "bg-gradient-to-br from-blue-900 via-indigo-800 to-blue-700"
            }`}
          >
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

          <div className="relative z-10 flex flex-col items-center justify-center w-full h-full p-12 text-white">
            <div
              className={`transform transition-all duration-1000 ${animateIn ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6">{t("Planeje seu futuro")}</h1>
              <p className={`text-xl md:text-2xl mb-8 ${darkMode ? "text-pink-200" : "text-blue-200"} max-w-md`}>
                {t("Organize suas finanças e alcance seus objetivos com nossa plataforma intuitiva.")}
              </p>
              <div className="flex space-x-4">
                <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-md rounded-lg px-4 py-3">
                  <div className={`w-2 h-2 rounded-full ${darkMode ? "bg-pink-400" : "bg-green-400"}`}></div>
                  <span>{t("Fácil de usar")}</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-md rounded-lg px-4 py-3">
                  <div className={`w-2 h-2 rounded-full ${darkMode ? "bg-purple-400" : "bg-blue-400"}`}></div>
                  <span>{t("Seguro")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - login form */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-6 md:p-12 relative">
          <div
            className={`relative ${
              darkMode ? "bg-slate-800/70 border border-slate-700/50" : "bg-white/80 border border-blue-100"
            } backdrop-blur-md rounded-3xl shadow-2xl p-8 max-w-md w-full transform transition-all duration-700 ${
              animateIn ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
          >
            <div
              className={`absolute -inset-0.5 ${
                darkMode
                  ? "bg-gradient-to-r from-pink-600 to-purple-600"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600"
              } rounded-3xl blur opacity-10`}
            ></div>

            <div className="relative">
              <h2 className={`${darkMode ? "text-white" : "text-slate-800"} text-3xl font-bold mb-2 text-center`}>
                {t("Bem-vindo de volta!")}
              </h2>
              <p className={`${darkMode ? "text-slate-400" : "text-slate-500"} text-sm text-center mb-8`}>
                {t("Por favor insira seus dados para acessar sua conta")}
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <div className="flex items-center mb-2">
                    <MdEmail className={`${darkMode ? "text-pink-500" : "text-blue-500"} mr-2`} size={20} />
                    <label htmlFor="username" className={`block ${darkMode ? "text-white" : "text-slate-800"} text-sm`}>
                      {t("E-mail")}
                    </label>
                  </div>
                  <div
                    className={`relative rounded-xl overflow-hidden transition-all duration-300 ${
                      usernameError
                        ? "ring-2 ring-red-500"
                        : darkMode
                          ? "focus-within:ring-2 focus-within:ring-pink-500"
                          : "focus-within:ring-2 focus-within:ring-blue-500"
                    }`}
                  >
                    <input
                      type="email"
                      id="username"
                      className={`w-full pl-4 pr-4 py-3 ${
                        darkMode
                          ? "bg-slate-700/50 text-white border-slate-600"
                          : "bg-white text-slate-800 border-slate-200"
                      } rounded-xl border focus:outline-none`}
                      placeholder={t("Insira seu e-mail")}
                      value={username}
                      onChange={handleUsernameChange}
                    />
                  </div>
                  {usernameError && <p className="text-red-500 text-sm mt-1">{usernameError}</p>}
                </div>

                <div>
                  <div className="flex items-center mb-2">
                    <RiLock2Fill className={`${darkMode ? "text-pink-500" : "text-blue-500"} mr-2`} size={20} />
                    <label htmlFor="password" className={`block ${darkMode ? "text-white" : "text-slate-800"} text-sm`}>
                      {t("Senha")}
                    </label>
                  </div>
                  <div
                    className={`relative rounded-xl overflow-hidden transition-all duration-300 ${
                      passwordError
                        ? "ring-2 ring-red-500"
                        : darkMode
                          ? "focus-within:ring-2 focus-within:ring-pink-500"
                          : "focus-within:ring-2 focus-within:ring-blue-500"
                    }`}
                  >
                    <input
                      type={isPasswordVisible ? "text" : "password"}
                      id="password"
                      className={`w-full pl-4 pr-10 py-3 ${
                        darkMode
                          ? "bg-slate-700/50 text-white border-slate-600"
                          : "bg-white text-slate-800 border-slate-200"
                      } rounded-xl border focus:outline-none`}
                      placeholder={t("Insira sua senha")}
                      value={password}
                      onChange={handlePasswordChange}
                    />
                    <button
                      type="button"
                      className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                        darkMode ? "text-slate-400 hover:text-slate-300" : "text-slate-500 hover:text-slate-700"
                      } transition-colors`}
                      onClick={togglePasswordVisibility}
                    >
                      {isPasswordVisible ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                    </button>
                  </div>
                  {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="rememberMe"
                      className={`mr-2 h-4 w-4 rounded border ${
                        darkMode
                          ? "border-slate-600 bg-slate-700 text-pink-600 focus:ring-pink-500"
                          : "border-slate-300 bg-white text-blue-600 focus:ring-blue-500"
                      }`}
                      onChange={handleRememberMeChange}
                      checked={rememberMe}
                    />
                    <label htmlFor="rememberMe" className={`${darkMode ? "text-slate-300" : "text-slate-600"} text-sm`}>
                      {t("Lembrar de mim")}
                    </label>
                  </div>
                  <a
                    href="/reset-password"
                    className={`text-sm ${
                      darkMode ? "text-pink-400 hover:text-pink-300" : "text-blue-500 hover:text-blue-600"
                    } transition-colors`}
                  >
                    {t("Esqueceu sua senha?")}
                  </a>
                </div>

                <button
                  type="submit"
                  className={`w-full py-3 px-4 ${
                    darkMode
                      ? "bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
                      : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  } text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] ${
                    isLoading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <svg
                        className="animate-spin h-5 w-5 mr-3 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.373A8.008 8.008 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.565z"
                        ></path>
                      </svg>
                      {t("Entrando...")}
                    </div>
                  ) : (
                    t("Fazer login")
                  )}
                </button>

                <div className="relative flex items-center justify-center my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className={`w-full border-t ${darkMode ? "border-slate-700" : "border-slate-200"}`}></div>
                  </div>
                  <div
                    className={`relative px-4 ${darkMode ? "bg-slate-800 text-slate-400" : "bg-white text-slate-500"} text-sm`}
                  >
                    {t("Ou continue com")}
                  </div>
                </div>

                <div className="flex justify-between items-center space-x-4">
                  <LoginWithFacebook onLogin={onLogin} type="button" onClick={(e) => e.preventDefault()} />
                  <LoginWithGoogle onLogin={onLogin} type="button" onClick={(e) => e.preventDefault()} />
                </div>
              </form>

              <p className={`${darkMode ? "text-slate-400" : "text-slate-500"} mt-8 text-center text-sm`}>
                {t("Não possui uma conta ainda?")}{" "}
                <a
                  href="/register"
                  className={`${
                    darkMode ? "text-pink-400 hover:text-pink-300" : "text-blue-500 hover:text-blue-600"
                  } transition-colors`}
                >
                  {t("Faça o cadastro")}
                </a>
              </p>

              <div className={`mt-6 pt-6 border-t ${darkMode ? "border-slate-700" : "border-slate-200"}`}>
                <p
                  className={`text-center text-sm ${
                    darkMode ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-800"
                  } cursor-pointer transition-colors`}
                  onClick={() => navigate("/landing-page")}
                >
                  {t("Voltar para o site")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage