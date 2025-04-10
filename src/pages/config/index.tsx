"use client"
import React from "react"
import { useContext, useState, useEffect, useRef } from "react"
import Sidebar from "../../components/sidebar"
import { ThemeContext } from "../../utils/ThemeContext.jsx"
import {
  IoPencil,
  IoSave,
  IoClose,
  IoCloudUploadOutline,
  IoShareSocialOutline,
  IoPersonCircleOutline,
  IoMailOutline,
  IoPhonePortraitOutline,
  IoCashOutline,
  IoCheckmarkOutline,
  IoTimeOutline,
  IoInformationCircleOutline,
  IoLockClosedOutline,
  IoEyeOutline,
  IoEyeOffOutline,
  IoAlertCircleOutline,
  IoCheckmarkCircleOutline,
} from "react-icons/io5"
import { MdContentCopy } from "react-icons/md"
import { useNavigate } from "react-router-dom"
import {
  getPicture,
  getName,
  getPhone,
  getEmail,
  saveImageUrl,
  getFromStorage,
  getReferralCount,
} from "../../utils/storage"
import { configBackendConnection, endpoints, getAuthHeaders, getFileUploadHeaders } from "../../utils/backendConnection"
import { toast } from "react-toastify"
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinnerNotTimer.jsx"
import { formatPhoneNumber, unformatPhoneNumber } from "../../utils/formatValues.js"
import { useTranslation } from "react-i18next"

interface Transaction {
  status: string
  name: string
  date: string
  value: string
}

const ConfigPage = () => {
  const { darkMode } = useContext(ThemeContext)
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    nomeCompleto: getName() || t("Nome desconhecido"),
    telefone: formatPhoneNumber(getPhone() || "51999999999"),
    email: getEmail() || "email.desconhecido@gmail.com",
    pixKey: "",
  })

  const [profilePicUrl, setProfilePicUrl] = useState(() => {
    const imageUrl = getPicture()
    return imageUrl ? `${imageUrl}?timestamp=${new Date().getTime()}` : "https://robohash.org/dalacorte.png"
  })

  const [isEditing, setIsEditing] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [passwordValidation, setPasswordValidation] = useState({
    hasUppercase: false,
    hasLowercase: false,
    hasSpecialChar: false,
    hasNumber: false,
    minLength: false,
  })
  const [loading, setLoading] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [animateIn, setAnimateIn] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const waveCanvasRef = useRef<HTMLCanvasElement>(null)
  const waveAnimationRef = useRef<number>()

  const referralCode = getFromStorage("referral_code") || "default_code"
  const referralCount = getReferralCount() || 0

  const [referralStats, setReferralStats] = useState({
    totalReferrals: 0,
    completedContracts: 0,
    availableAmount: "R$ 0,00",
  })

  useEffect(() => {
    const fetchReferralStats = async () => {
      try {
        const response = await fetch(`${configBackendConnection.baseURL}/${endpoints.UserStats}`, {
          method: "GET",
          headers: getAuthHeaders(),
        })

        if (!response.ok) {
          throw new Error("Erro ao carregar estatísticas de indicações")
        }

        const data = await response.json()
        setReferralStats({
          totalReferrals: data.total_referrals || 0,
          completedContracts: data.completed_contracts || 0,
          availableAmount: data.available_amount || 0,
        })
      } catch (error) {
        console.error("Error fetching referral stats:", error)
        toast.error(t("Erro ao carregar estatísticas de indicações"))
      }
    }

    fetchReferralStats()
  }, [])

  const [transactions, setTransactions] = useState<Transaction[]>([])

  const mapStatusToDisplay = (status) => {
    switch (status) {
      case "PENDING":
        return "Pendente"
      case "APPROVED":
        return "Finalizado"
      case "REJECTED":
        return "Rejeitado"
      default:
        return status
    }
  }

  useEffect(() => {
    const fetchWithdrawals = async () => {
      try {
        const response = await fetch(`${configBackendConnection.baseURL}/${endpoints.UserListWithdrawals}`, {
          method: "GET",
          headers: getAuthHeaders(),
        })

        if (!response.ok) {
          throw new Error("Erro ao carregar histórico de saques")
        }

        const data = await response.json()
        setTransactions(
          data.map((item) => ({
            date: new Date(item.request_date).toLocaleDateString(),
            name: item.description || t("Saque"),
            status: mapStatusToDisplay(item.status),
            value: `R$ ${Number.parseFloat(item.amount).toFixed(2).replace(".", ",")}`,
          })),
        )
      } catch (error) {
        console.error("Error fetching withdrawals:", error)
        toast.error(t("Erro ao carregar histórico de saques"))
      }
    }

    fetchWithdrawals()
  }, [])

  const [showModal, setShowModal] = useState(false)
  const [withdrawalAmount, setWithdrawalAmount] = useState("")
  const [showCurrentPassword, setShowNewPassword] = useState(false)
  const [showNewPassword, setShowConfirmPassword] = useState(false)
  const [showConfirmPassword, setShowCurrentPassword] = useState(false)

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
    const password = passwordData.newPassword
    setPasswordValidation({
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasSpecialChar: /[.*@]/.test(password),
      hasNumber: /[0-9]/.test(password),
      minLength: password.length >= 6,
    })
  }, [passwordData.newPassword])

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
        color: darkMode ? "rgba(219, 39, 119, 0.3)" : "rgba(59, 130, 246, 0.15)",
        lineWidth: 3,
      },
      {
        amplitude: 30,
        period: 0.03,
        speed: 0.015,
        phase: 2,
        color: darkMode ? "rgba(139, 92, 246, 0.3)" : "rgba(37, 99, 235, 0.15)",
        lineWidth: 2,
      },
      {
        amplitude: 70,
        period: 0.01,
        speed: 0.005,
        phase: 4,
        color: darkMode ? "rgba(236, 72, 153, 0.2)" : "rgba(96, 165, 250, 0.1)",
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
          ? `rgba(219, 39, 119, ${particle.opacity})`
          : `rgba(59, 130, 246, ${particle.opacity * 0.7})`
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
          ctx.strokeStyle = darkMode ? `rgba(236, 72, 153, ${opacity * 0.3})` : `rgba(37, 99, 235, ${opacity * 0.15})`
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
    const updatedImageUrl = getPicture()
    if (updatedImageUrl) {
      setProfilePicUrl(`${updatedImageUrl}?timestamp=${new Date().getTime()}`)
    }
  }, [])

  useEffect(() => {
    const fetchUserConfig = async () => {
      try {
        const response = await fetch(`${configBackendConnection.baseURL}/${endpoints.userConfig}`, {
          method: "GET",
          headers: getAuthHeaders(),
        })

        if (!response.ok) {
          throw new Error("Erro ao carregar dados do usuário")
        }

        const data = await response.json()

        setFormData((prevData) => ({
          ...prevData,
          nomeCompleto: data.full_name || getName() || t("Nome desconhecido"),
          telefone: formatPhoneNumber(data.phone || getPhone() || "51999999999"),
          email: data.email || getEmail() || "email.desconhecido@gmail.com",
          pixKey: data.pix_key || "",
        }))
      } catch (error) {
        toast.error(t("Erro ao carregar dados do usuário"))
      }
    }

    fetchUserConfig()
  }, [])

  const handleCopyLink = () => {
    const referralLink = `${configBackendConnection.frontURL}/register/${referralCode}`
    navigator.clipboard.writeText(referralLink)
    toast.success(t("Link copiado para a área de transferência!"))
  }

  const handleDiscard = () => {
    navigate("/")
  }

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0]
    if (selectedFile) {
      const uploadFormData = new FormData()
      uploadFormData.append("image", selectedFile)
      setLoading(true)

      try {
        const response = await fetch(`${configBackendConnection.baseURL}/${endpoints.userConfig}`, {
          method: "PATCH",
          headers: getFileUploadHeaders(),
          body: uploadFormData,
        })

        if (response.ok) {
          const data = await response.json()
          const updatedImageUrl = String(data.image)

          saveImageUrl(JSON.stringify(updatedImageUrl))
          setProfilePicUrl(updatedImageUrl)
          toast.success(t("Imagem enviada com sucesso!"))
        } else {
          toast.error(t("Erro ao enviar imagem."))
        }
      } catch (error) {
        toast.error(t("Erro ao conectar com o servidor."))
      } finally {
        setLoading(false)
      }
    }
  }

  const handleSave = async () => {
    if (isEditing) {
      setLoading(true)
      try {
        const response = await fetch(`${configBackendConnection.baseURL}/${endpoints.userConfig}`, {
          method: "PATCH",
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            full_name: formData.nomeCompleto,
            phone: unformatPhoneNumber(formData.telefone),
            email: formData.email,
            pix_key: formData.pixKey,
          }),
        })

        if (response.ok) {
          toast.success(t("Configurações salvas com sucesso!"))
          setIsEditing(false)
        } else {
          toast.error(t("Erro ao salvar configurações."))
        }
      } catch (error) {
        toast.error(t("Erro ao conectar com o servidor."))
      } finally {
        setLoading(false)
      }
    } else {
      setIsEditing(true)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  const handlePhoneChange = (e) => {
    const input = e.target.value.replace(/\D/g, "").slice(0, 11)
    setFormData({ ...formData, telefone: formatPhoneNumber(input) })
  }

  const handleChangePassword = () => {
    setIsChangingPassword(!isChangingPassword)
    if (!isChangingPassword) {
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
      setPasswordValidation({
        hasUppercase: false,
        hasLowercase: false,
        hasSpecialChar: false,
        hasNumber: false,
        minLength: false,
      })
    }
  }

  const validatePassword = (password) => {
    const hasUppercase = /[A-Z]/.test(password)
    const hasLowercase = /[a-z]/.test(password)
    const hasSpecialChar = /[.*@]/.test(password)
    const hasNumber = /[0-9]/.test(password)
    const minLength = password.length >= 6

    return hasUppercase && hasLowercase && hasSpecialChar && hasNumber && minLength
  }

  const handleSavePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error(t("As senhas não coincidem."))
      return
    }

    if (!validatePassword(passwordData.newPassword)) {
      toast.error(t("A senha não atende aos requisitos de segurança."))
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`${configBackendConnection.baseURL}/${endpoints.UserPasswordChange}`, {
        method: "PATCH",
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          current_password: passwordData.currentPassword,
          password1: passwordData.newPassword,
          password2: passwordData.confirmPassword,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        if (result.detail === "Senha atual incorreta") {
          toast.error(t("Senha atual incorreta."))
        } else {
          toast.error(t(result.detail || "Erro ao atualizar senha"))
        }
        return
      }

      toast.success(t("Senha alterada com sucesso!"))
      setIsChangingPassword(false)
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    } catch (error) {
      toast.error(t("Erro ao alterar senha."))
    } finally {
      setLoading(false)
    }
  }

  const handleWithdraw = () => {
    // Open the modal to enter withdrawal amount
    setShowModal(true)
  }

  const closeModal = async () => {
    const amount = Number.parseFloat(withdrawalAmount)
    if (isNaN(amount) || amount <= 0) {
      toast.error(t("Por favor, informe um valor válido para saque."))
      return
    }

    const availableAmount =
      typeof referralStats.availableAmount === "string"
        ? Number.parseFloat(referralStats.availableAmount.replace("R$ ", "").replace(",", "."))
        : referralStats.availableAmount

    if (amount > availableAmount) {
      toast.error(t("O valor solicitado é maior que o disponível para saque."))
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`${configBackendConnection.baseURL}/${endpoints.UserRequestWithdrawals}`, {
        method: "POST",
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pix_key: formData.pixKey,
          amount: amount,
        }),
      })

      if (response.ok) {
        setShowModal(false)
        toast.success(t("Solicitação de saque enviada. O valor será processado em até 5 dias úteis."))

        fetchReferralStats()
      } else {
        const errorData = await response.json()
        if (errorData.user && errorData.user.length > 0) {
          toast.error(errorData.user[0])
        }
        if (errorData.amount && errorData.amount.length > 0) {
          toast.error(errorData.amount[0])
        }
      }
    } catch (error) {
      console.error("Error requesting withdrawal:", error)
      toast.error(t("Erro ao solicitar saque. Tente novamente mais tarde."))
    } finally {
      setLoading(false)
    }
  }

  const fetchReferralStats = async () => {
    try {
      const statsResponse = await fetch(`${configBackendConnection.baseURL}/${endpoints.UserStats}`, {
        method: "GET",
        headers: getAuthHeaders(),
      })

      if (statsResponse.ok) {
        const data = await statsResponse.json()
        setReferralStats({
          totalReferrals: data.total_referrals || 0,
          completedContracts: data.completed_contracts || 0,
          availableAmount: `R$ ${(data.available_amount || 0).toFixed(2).replace(".", ",")}`,
        })
      } else {
        toast.error(t("Erro ao carregar as estatísticas."))
      }
    } catch (error) {
      console.error("Error fetching stats:", error)
      toast.error(t("Erro ao carregar as estatísticas."))
    }
  }

  const renderPasswordRequirement = (isValid, text) => {
    return (
      <div className="flex items-center gap-2 text-xs">
        {isValid ? (
          <IoCheckmarkCircleOutline className={darkMode ? "text-emerald-400" : "text-emerald-600"} />
        ) : (
          <IoAlertCircleOutline className={darkMode ? "text-amber-400" : "text-amber-600"} />
        )}
        <span
          className={
            isValid
              ? darkMode
                ? "text-emerald-400"
                : "text-emerald-600"
              : darkMode
                ? "text-slate-400"
                : "text-slate-600"
          }
        >
          {text}
        </span>
      </div>
    )
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

      {loading && <LoadingSpinner isLoading={loading} />}

      <main className="flex-grow p-4 md:p-6 lg:p-8 md:ml-16 overflow-auto relative z-10">
        <div className="max-w-5xl mx-auto">
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
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <h1 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-slate-800"}`}>
                  {t("Configurações da Conta")}
                </h1>
                <div className="flex gap-2">
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
                    onClick={handleSave}
                  >
                    {isEditing ? <IoSave className="mr-2" /> : <IoPencil className="mr-2" />}
                    <span>{isEditing ? t("Salvar") : t("Editar")}</span>
                  </button>
                  {isEditing && (
                    <button
                      type="button"
                      className={`group flex items-center justify-center py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
                        darkMode
                          ? "bg-slate-700/50 text-slate-300 hover:bg-slate-700 border border-slate-600/50"
                          : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                      }`}
                      onClick={handleCancel}
                    >
                      <IoClose className="mr-2" />
                      <span>{t("Cancelar")}</span>
                    </button>
                  )}
                </div>
              </div>

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
                          <img
                            src={profilePicUrl || "/placeholder.svg"}
                            alt={t("Foto de perfil")}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div
                          className={`absolute inset-0 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                            darkMode ? "bg-slate-900/70" : "bg-slate-700/50"
                          }`}
                        >
                          <label
                            htmlFor="file-upload"
                            className="cursor-pointer flex items-center justify-center w-full h-full"
                          >
                            <IoCloudUploadOutline className="text-3xl text-white" />
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            id="file-upload"
                            onChange={handleFileChange}
                          />
                        </div>
                      </div>
                      <h2 className={`mt-4 text-lg font-semibold ${darkMode ? "text-white" : "text-slate-800"}`}>
                        {formData.nomeCompleto}
                      </h2>
                      <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>{formData.email}</p>
                      <label
                        htmlFor="file-upload"
                        className={`mt-4 flex items-center justify-center py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer ${
                          darkMode
                            ? "bg-pink-900/30 text-pink-400 hover:bg-pink-900/50 border border-pink-800/30"
                            : "bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200"
                        }`}
                      >
                        <IoCloudUploadOutline className="mr-2" />
                        {t("Alterar foto")}
                      </label>
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
                      <h3
                        className={`text-lg font-semibold mb-4 flex items-center ${darkMode ? "text-white" : "text-slate-800"}`}
                      >
                        <IoPersonCircleOutline className={`mr-2 ${darkMode ? "text-pink-400" : "text-blue-600"}`} />
                        {t("Informações pessoais")}
                      </h3>

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
                                onChange={handlePhoneChange}
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
                        <div>
                          <label
                            className={`block mb-2 text-sm font-medium ${darkMode ? "text-slate-300" : "text-slate-700"}`}
                          >
                            {t("Chave PIX")}
                          </label>
                          {isEditing ? (
                            <div className="relative">
                              <div
                                className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${
                                  darkMode ? "text-slate-400" : "text-slate-500"
                                }`}
                              >
                                <svg
                                  viewBox="0 0 24 24"
                                  className="w-5 h-5"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="M13.56,2.56l-1.17,1.17L10.22,1.55L11.39,0.38L13.56,2.56M20.69,7.31l-1.17,1.17l-2.17-2.17l1.17-1.17L20.69,7.31M7.31,3.44l-1.17,1.17L3.97,2.44L5.14,1.27L7.31,3.44M3.44,16.69l-1.17,1.17l-2.17-2.17l1.17-1.17L3.44,16.69M2.56,10.44l1.17-1.17l2.17,2.17l-1.17,1.17L2.56,10.44M21.44,13.56l-1.17,1.17l-2.17-2.17l1.17-1.17L21.44,13.56M13.56,21.44l-1.17,1.17l-2.17-2.17l1.17-1.17L13.56,21.44M16.69,20.69l-1.17,1.17l-2.17-2.17l1.17-1.17L16.69,20.69M12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5Z" />
                                </svg>
                              </div>
                              <input
                                type="text"
                                className={`w-full pl-10 pr-4 py-3 rounded-lg transition-colors ${
                                  darkMode
                                    ? "bg-slate-700/50 text-white border border-slate-600/50 focus:border-pink-500/50"
                                    : "bg-white text-slate-800 border border-slate-200 focus:border-blue-300"
                                } focus:outline-none`}
                                value={formData.pixKey}
                                onChange={(e) => setFormData({ ...formData, pixKey: e.target.value })}
                                placeholder={t("Digite sua chave PIX (CPF, e-mail, telefone ou chave aleatória)")}
                              />
                            </div>
                          ) : (
                            <div
                              className={`px-4 py-3 rounded-lg flex items-center ${
                                darkMode ? "bg-slate-700/30 text-white" : "bg-slate-50 text-slate-800"
                              }`}
                            >
                              <svg
                                viewBox="0 0 24 24"
                                className={`w-5 h-5 mr-2 ${darkMode ? "text-slate-400" : "text-slate-500"}`}
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M13.56,2.56l-1.17,1.17L10.22,1.55L11.39,0.38L13.56,2.56M20.69,7.31l-1.17,1.17l-2.17-2.17l1.17-1.17L20.69,7.31M7.31,3.44l-1.17,1.17L3.97,2.44L5.14,1.27L7.31,3.44M3.44,16.69l-1.17,1.17l-2.17-2.17l1.17-1.17L3.44,16.69M2.56,10.44l1.17-1.17l2.17,2.17l-1.17,1.17L2.56,10.44M21.44,13.56l-1.17,1.17l-2.17-2.17l1.17-1.17L21.44,13.56M13.56,21.44l-1.17,1.17l-2.17-2.17l1.17-1.17L13.56,21.44M16.69,20.69l-1.17,1.17l-2.17-2.17l1.17-1.17L16.69,20.69M12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5Z" />
                              </svg>
                              {formData.pixKey ? formData.pixKey : t("Nenhuma chave PIX configurada")}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

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
                          <IoLockClosedOutline className={`mr-2 ${darkMode ? "text-pink-400" : "text-blue-600"}`} />
                          {t("Segurança da Conta")}
                        </h3>
                        <button
                          type="button"
                          onClick={handleChangePassword}
                          className={`py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
                            darkMode
                              ? "bg-pink-900/30 text-pink-400 hover:bg-pink-900/50 border border-pink-800/30"
                              : "bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200"
                          }`}
                        >
                          {isChangingPassword ? t("Cancelar") : t("Alterar Senha")}
                        </button>
                      </div>

                      {isChangingPassword && (
                        <div className="space-y-4 mt-4">
                          <div>
                            <label
                              className={`block mb-2 text-sm font-medium ${darkMode ? "text-slate-300" : "text-slate-700"}`}
                            >
                              {t("Senha atual")}
                            </label>
                            <div className="relative">
                              <input
                                type={showCurrentPassword ? "text" : "password"}
                                className={`w-full px-4 py-3 pr-10 rounded-lg transition-colors ${
                                  darkMode
                                    ? "bg-slate-700/50 text-white border border-slate-600/50 focus:border-pink-500/50"
                                    : "bg-white text-slate-800 border border-slate-200 focus:border-blue-300"
                                } focus:outline-none`}
                                value={passwordData.currentPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                              />
                              <button
                                type="button"
                                className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                                  darkMode
                                    ? "text-slate-400 hover:text-slate-300"
                                    : "text-slate-500 hover:text-slate-700"
                                }`}
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                              >
                                {showCurrentPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
                              </button>
                            </div>
                          </div>
                          <div>
                            <label
                              className={`block mb-2 text-sm font-medium ${darkMode ? "text-slate-300" : "text-slate-700"}`}
                            >
                              {t("Nova senha")}
                            </label>
                            <div className="relative">
                              <input
                                type={showNewPassword ? "text" : "password"}
                                className={`w-full px-4 py-3 pr-10 rounded-lg transition-colors ${
                                  darkMode
                                    ? "bg-slate-700/50 text-white border border-slate-600/50 focus:border-pink-500/50"
                                    : "bg-white text-slate-800 border border-slate-200 focus:border-blue-300"
                                } focus:outline-none`}
                                value={passwordData.newPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                              />
                              <button
                                type="button"
                                className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                                  darkMode
                                    ? "text-slate-400 hover:text-slate-300"
                                    : "text-slate-500 hover:text-slate-700"
                                }`}
                                onClick={() => setShowNewPassword(!showNewPassword)}
                              >
                                {showNewPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
                              </button>
                            </div>

                            <div className={`mt-3 p-3 rounded-lg ${darkMode ? "bg-slate-700/30" : "bg-slate-50"}`}>
                              <p
                                className={`text-xs mb-2 font-medium ${darkMode ? "text-slate-300" : "text-slate-700"}`}
                              >
                                {t("Formato da senha:")}
                              </p>
                              <div className="grid grid-cols-1 gap-2">
                                {renderPasswordRequirement(passwordValidation.hasUppercase, t("Uma letra maiúscula"))}
                                {renderPasswordRequirement(passwordValidation.hasLowercase, t("Uma letra minúscula"))}
                                {renderPasswordRequirement(
                                  passwordValidation.hasSpecialChar,
                                  t("Caracteres especiais (. * @)"),
                                )}
                                {renderPasswordRequirement(passwordValidation.hasNumber, t("Um número"))}
                                {renderPasswordRequirement(passwordValidation.minLength, t("Mínimo de 6 caracteres"))}
                              </div>
                            </div>
                          </div>
                          <div>
                            <label
                              className={`block mb-2 text-sm font-medium ${darkMode ? "text-slate-300" : "text-slate-700"}`}
                            >
                              {t("Confirmar nova senha")}
                            </label>
                            <div className="relative">
                              <input
                                type={showConfirmPassword ? "text" : "password"}
                                className={`w-full px-4 py-3 pr-10 rounded-lg transition-colors ${
                                  darkMode
                                    ? "bg-slate-700/50 text-white border border-slate-600/50 focus:border-pink-500/50"
                                    : "bg-white text-slate-800 border border-slate-200 focus:border-blue-300"
                                } focus:outline-none`}
                                value={passwordData.confirmPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                              />
                              <button
                                type="button"
                                className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                                  darkMode
                                    ? "text-slate-400 hover:text-slate-300"
                                    : "text-slate-500 hover:text-slate-700"
                                }`}
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              >
                                {showConfirmPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
                              </button>
                            </div>
                          </div>
                          <div className="flex justify-end">
                            <button
                              type="button"
                              onClick={handleSavePassword}
                              className={`py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
                                darkMode
                                  ? "bg-emerald-900/30 text-emerald-400 hover:bg-emerald-900/50 border border-emerald-800/30"
                                  : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                              }`}
                            >
                              {t("Salvar Nova Senha")}
                            </button>
                          </div>
                        </div>
                      )}

                      {!isChangingPassword && (
                        <div
                          className={`p-4 rounded-lg ${
                            darkMode ? "bg-slate-700/30 text-slate-300" : "bg-slate-50 text-slate-600"
                          }`}
                        >
                          <p className="text-sm">{t("Mantenha sua conta segura alterando sua senha regularmente.")}</p>
                          <p className="text-xs mt-2">{t("Última alteração: 15/03/2023")}</p>
                          <p className="text-xs mt-2 font-medium">
                            {t(
                              "Formato da senha: Uma letra maiúscula, uma minúscula, caracteres especiais (. * @) e número",
                            )}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div
                    className={`relative overflow-hidden rounded-xl shadow-md backdrop-blur-md ${
                      darkMode ? "bg-slate-800/50 border border-slate-700/50" : "bg-white/90 border border-blue-100"
                    }`}
                  >
                    <div className="absolute inset-0 overflow-hidden">
                      <div
                        className={`absolute -inset-[10px] rounded-full opacity-30 blur-3xl ${
                          darkMode ? "bg-emerald-500" : "bg-emerald-400"
                        }`}
                        style={{
                          top: "20%",
                          left: "30%",
                          width: "60%",
                          height: "60%",
                        }}
                      />
                    </div>

                    <div className="relative p-6">
                      <div className="flex items-center mb-6">
                        <div
                          className={`flex items-center justify-center w-14 h-14 rounded-full ${
                            darkMode ? "bg-emerald-900/40" : "bg-emerald-100"
                          } mr-4`}
                        >
                          <IoCashOutline className={`text-2xl ${darkMode ? "text-emerald-400" : "text-emerald-600"}`} />
                        </div>
                        <div>
                          <h3 className={`text-lg font-semibold ${darkMode ? "text-white" : "text-slate-800"}`}>
                            {t("Renda Extra")}
                          </h3>
                          <p className={`text-sm ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                            {t("Ganhe dinheiro indicando amigos para o Plano de Vida")}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div
                          className={`p-4 rounded-lg ${
                            darkMode ? "bg-slate-700/30" : "bg-white"
                          } flex flex-col items-center justify-center`}
                        >
                          <div
                            className={`text-2xl font-bold mb-1 ${darkMode ? "text-emerald-400" : "text-emerald-600"}`}
                          >
                            {referralStats.totalReferrals}
                          </div>
                          <div className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                            {t("Total de Indicações")}
                          </div>
                        </div>

                        <div
                          className={`p-4 rounded-lg ${
                            darkMode ? "bg-slate-700/30" : "bg-white"
                          } flex flex-col items-center justify-center`}
                        >
                          <div
                            className={`text-2xl font-bold mb-1 ${darkMode ? "text-emerald-400" : "text-emerald-600"}`}
                          >
                            {referralStats.completedContracts}
                          </div>
                          <div className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                            {t("Contratos Finalizados")}
                          </div>
                        </div>

                        <div
                          className={`p-4 rounded-lg ${
                            darkMode ? "bg-slate-700/30" : "bg-white"
                          } flex flex-col items-center justify-center`}
                        >
                          <div
                            className={`text-2xl font-bold mb-1 ${darkMode ? "text-emerald-400" : "text-emerald-600"}`}
                          >
                            {referralStats.availableAmount}
                          </div>
                          <div className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                            {t("Valor Disponível")}
                          </div>
                        </div>
                      </div>

                      <div
                        className={`p-4 rounded-lg mb-6 ${
                          darkMode
                            ? "bg-slate-700/30 border border-slate-600/30"
                            : "bg-emerald-50/50 border border-emerald-100"
                        }`}
                      >
                        <div className="flex items-center mb-4">
                          <div
                            className={`flex items-center justify-center w-10 h-10 rounded-lg ${
                              darkMode ? "bg-emerald-900/30" : "bg-emerald-100"
                            } mr-3`}
                          >
                            <svg
                              viewBox="0 0 24 24"
                              className={`w-6 h-6 ${darkMode ? "text-emerald-400" : "text-emerald-600"}`}
                            >
                              <path
                                fill="currentColor"
                                d="M13.56,2.56l-1.17,1.17L10.22,1.55L11.39,0.38L13.56,2.56M20.69,7.31l-1.17,1.17l-2.17-2.17l1.17-1.17L20.69,7.31M7.31,3.44l-1.17,1.17L3.97,2.44L5.14,1.27L7.31,3.44M3.44,16.69l-1.17,1.17l-2.17-2.17l1.17-1.17L3.44,16.69M2.56,10.44l1.17-1.17l2.17,2.17l-1.17,1.17L2.56,10.44M21.44,13.56l-1.17,1.17l-2.17-2.17l1.17-1.17L21.44,13.56M13.56,21.44l-1.17,1.17l-2.17-2.17l1.17-1.17L13.56,21.44M16.69,20.69l-1.17,1.17l-2.17-2.17l1.17-1.17L16.69,20.69M12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5Z"
                              />
                            </svg>
                          </div>
                          <h4 className={`font-semibold ${darkMode ? "text-white" : "text-slate-800"}`}>
                            {t("Receba via PIX")}
                          </h4>
                        </div>

                        <div className="space-y-4">
                          <p className={`text-sm ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                            {t(
                              "Após acumular R$ 50,00 ou mais, você pode solicitar a transferência para sua conta via PIX.",
                            )}
                          </p>

                          <div className={`p-4 rounded-lg mb-6 ${darkMode ? "bg-slate-800/50" : "bg-white"}`}>
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                              <div>
                                <div
                                  className={`text-sm font-medium mb-1 ${darkMode ? "text-white" : "text-slate-800"}`}
                                >
                                  {t("Chave PIX para recebimento")}
                                </div>
                                {isEditing ? (
                                  <input
                                    type="text"
                                    className={`w-full px-4 py-2 rounded-lg transition-colors ${
                                      darkMode
                                        ? "bg-slate-700/50 text-white border border-slate-600/50 focus:border-emerald-500/50"
                                        : "bg-white text-slate-800 border border-slate-200 focus:border-emerald-300"
                                    } focus:outline-none`}
                                    value={formData.pixKey}
                                    onChange={(e) => setFormData({ ...formData, pixKey: e.target.value })}
                                    placeholder={t("Digite sua chave PIX (CPF, e-mail, telefone ou chave aleatória)")}
                                  />
                                ) : (
                                  <div className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                                    {formData.pixKey
                                      ? formData.pixKey
                                      : t("Informe sua chave PIX ao editar seu perfil")}
                                  </div>
                                )}
                              </div>
                              {!isEditing && (
                                <button
                                  onClick={handleWithdraw}
                                  disabled={!formData.pixKey || referralStats.availableAmount === "R$ 0,00"}
                                  className={`py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
                                    !formData.pixKey || referralStats.availableAmount === "R$ 0,00"
                                      ? darkMode
                                        ? "bg-slate-700/30 text-slate-500 cursor-not-allowed"
                                        : "bg-slate-100 text-slate-400 cursor-not-allowed"
                                      : darkMode
                                        ? "bg-emerald-900/30 text-emerald-400 hover:bg-emerald-900/50 border border-emerald-800/30"
                                        : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                                  }`}
                                >
                                  {t("Solicitar Saque")}
                                </button>
                              )}
                            </div>
                          </div>

                          <div
                            className={`p-4 rounded-lg ${darkMode ? "bg-amber-900/20" : "bg-amber-50"} border ${
                              darkMode ? "border-amber-800/30" : "border-amber-200"
                            }`}
                          >
                            <div className="flex items-start">
                              <IoInformationCircleOutline
                                className={`text-lg mt-0.5 mr-2 ${darkMode ? "text-amber-400" : "text-amber-600"}`}
                              />
                              <div>
                                <div
                                  className={`text-sm font-medium mb-1 ${darkMode ? "text-amber-400" : "text-amber-700"}`}
                                >
                                  {t("Prazo para pagamento")}
                                </div>
                                <div className={`text-xs ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                                  {t("O pagamento será processado em até 5 dias úteis após a solicitação de saque.")}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className={`text-sm font-medium mb-2 ${darkMode ? "text-white" : "text-slate-800"}`}>
                          {t("Extrato de Transações")}
                        </div>

                        {transactions.length > 0 ? (
                          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                            {transactions.map((transaction, index) => (
                              <div
                                key={index}
                                className={`flex items-center justify-between p-3 rounded-lg ${
                                  darkMode ? "bg-slate-700/30" : "bg-white"
                                }`}
                              >
                                <div className="flex items-center">
                                  <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                      transaction.status === "Finalizado"
                                        ? darkMode
                                          ? "bg-emerald-900/30 text-emerald-400"
                                          : "bg-emerald-100 text-emerald-600"
                                        : darkMode
                                          ? "bg-amber-900/30 text-amber-400"
                                          : "bg-amber-100 text-amber-600"
                                    } mr-3`}
                                  >
                                    {transaction.status === "Finalizado" ? <IoCheckmarkOutline /> : <IoTimeOutline />}
                                  </div>
                                  <div>
                                    <div
                                      className={`text-sm font-medium ${darkMode ? "text-white" : "text-slate-800"}`}
                                    >
                                      {transaction.name}
                                    </div>
                                    <div className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                                      {transaction.date}
                                    </div>
                                  </div>
                                </div>
                                <div
                                  className={`text-sm font-medium ${
                                    transaction.status === "Finalizado"
                                      ? darkMode
                                        ? "text-emerald-400"
                                        : "text-emerald-600"
                                      : darkMode
                                        ? "text-amber-400"
                                        : "text-amber-600"
                                  }`}
                                >
                                  {transaction.value}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div
                            className={`p-4 rounded-lg text-center ${
                              darkMode ? "bg-slate-700/30 text-slate-400" : "bg-slate-50 text-slate-500"
                            }`}
                          >
                            {t("Nenhuma transação encontrada")}
                          </div>
                        )}
                      </div>

                      <div className="mt-6">
                        <div
                          className={`p-4 rounded-xl ${
                            darkMode
                              ? "bg-emerald-900/20 border border-emerald-800/30"
                              : "bg-emerald-100/70 border border-emerald-200"
                          } flex items-center justify-between`}
                        >
                          <div className="flex items-center">
                            <div className="w-12 h-12 flex items-center justify-center mr-3">
                              <svg viewBox="0 0 100 100" className="w-full h-full">
                                <circle cx="50" cy="50" r="45" fill={darkMode ? "#064e3b" : "#d1fae5"} />
                                <path
                                  d="M50,5 A45,45 0 0,1 95,50 A45,45 0 0,1 50,95 A45,45 0 0,1 5,50 A45,45 0 0,1 50,5 Z"
                                  fill="none"
                                  stroke={darkMode ? "#10b981" : "#059669"}
                                  strokeWidth="2"
                                />
                                <text
                                  x="50"
                                  y="50"
                                  fontFamily="Arial"
                                  fontSize="40"
                                  fontWeight="bold"
                                  fill={darkMode ? "#10b981" : "#059669"}
                                  textAnchor="middle"
                                  dominantBaseline="middle"
                                >
                                  $
                                </text>
                              </svg>
                            </div>
                            <div>
                              <h4 className={`font-semibold ${darkMode ? "text-emerald-400" : "text-emerald-700"}`}>
                                {t("Comece a ganhar agora")}
                              </h4>
                              <p className={`text-sm ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                                {t("Compartilhe seu link único e acompanhe seus ganhos")}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`relative overflow-hidden rounded-xl shadow-md backdrop-blur-md ${
                      darkMode ? "bg-slate-800/50 border border-slate-700/50" : "bg-white/90 border border-blue-100"
                    }`}
                  >
                    <div className="p-6">
                      <h3
                        className={`text-lg font-semibold mb-4 flex items-center ${darkMode ? "text-white" : "text-slate-800"}`}
                      >
                        <IoShareSocialOutline className={`mr-2 ${darkMode ? "text-pink-400" : "text-blue-600"}`} />
                        {t("Programa de indicação")}
                      </h3>

                      <p className={`mb-4 text-sm ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                        {t("Convide seus amigos para criarem um plano de vida e ganhe bônus.")}
                      </p>

                      <div
                        className={`p-4 rounded-lg mb-4 ${
                          darkMode
                            ? "bg-slate-700/30 border border-slate-600/30"
                            : "bg-blue-50/50 border border-blue-100"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-sm font-medium ${darkMode ? "text-white" : "text-slate-800"}`}>
                            {t("Seu link de indicação")}
                          </span>
                          <span className={`text-xs ${darkMode ? "text-pink-400" : "text-blue-600"}`}>
                            {referralCount} {t("pessoas usaram")}
                          </span>
                        </div>
                        <div className="relative">
                          <input
                            type="text"
                            className={`w-full pl-4 pr-12 py-3 rounded-lg transition-colors ${
                              darkMode
                                ? "bg-slate-800/70 text-white border border-slate-600/50"
                                : "bg-white text-slate-800 border border-slate-200"
                            } focus:outline-none cursor-not-allowed`}
                            value={`${configBackendConnection.frontURL}/register/${referralCode}`}
                            readOnly
                          />
                          <button
                            type="button"
                            className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-md transition-colors ${
                              darkMode
                                ? "bg-slate-700 hover:bg-slate-600 text-slate-300"
                                : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                            }`}
                            onClick={handleCopyLink}
                            title={t("Copiar link")}
                          >
                            <MdContentCopy />
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          type="button"
                          className={`flex items-center justify-center py-3 px-4 rounded-lg text-sm font-medium transition-colors flex-1 ${
                            darkMode
                              ? "bg-slate-700/50 text-slate-300 hover:bg-slate-700 border border-slate-600/50"
                              : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                          }`}
                          onClick={handleDiscard}
                        >
                          {t("Voltar para Home")}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div
            className={`relative rounded-xl shadow-xl max-w-md w-full p-6 ${
              darkMode ? "bg-slate-800 border border-slate-700" : "bg-white border border-slate-200"
            }`}
          >
            <div className="flex items-start mb-4">
              <div
                className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                  darkMode ? "bg-amber-900/30" : "bg-amber-100"
                }`}
              >
                <IoInformationCircleOutline className={`text-xl ${darkMode ? "text-amber-400" : "text-amber-600"}`} />
              </div>
              <div>
                <h3 className={`text-lg font-semibold ${darkMode ? "text-white" : "text-slate-800"}`}>
                  {t("Confirmação de Saque")}
                </h3>
                <p className={`mt-1 text-sm ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                  {t("Informe o valor que deseja sacar")}
                </p>
              </div>
            </div>

            <div className={`p-4 rounded-lg mb-4 ${darkMode ? "bg-slate-700/50" : "bg-slate-50"}`}>
              <div className="mb-4">
                <label className={`block mb-2 text-sm font-medium ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                  {t("Valor disponível")}:
                  <span className="font-semibold ml-1">
                    {typeof referralStats.availableAmount === "string"
                      ? referralStats.availableAmount
                      : `R$ ${referralStats.availableAmount.toFixed(2).replace(".", ",")}`}
                  </span>
                </label>
                <div className="relative">
                  <div
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${darkMode ? "text-slate-400" : "text-slate-500"}`}
                  >
                    R$
                  </div>
                  <input
                    type="text"
                    className={`w-full pl-8 pr-4 py-3 rounded-lg transition-colors ${
                      darkMode
                        ? "bg-slate-700/50 text-white border border-slate-600/50 focus:border-emerald-500/50"
                        : "bg-white text-slate-800 border border-slate-200 focus:border-emerald-300"
                    } focus:outline-none`}
                    value={withdrawalAmount}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9.]/g, "")
                      const parts = value.split(".")
                      const formatted = parts.length > 1 ? `${parts[0]}.${parts.slice(1).join("")}` : value
                      setWithdrawalAmount(formatted)
                    }}
                    placeholder={t("Informe o valor para saque")}
                  />
                </div>
              </div>

              <p className={`text-sm ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                {t("O valor será enviado para a chave PIX:")}
              </p>
              <p className={`mt-1 font-medium ${darkMode ? "text-white" : "text-slate-800"}`}>{formData.pixKey}</p>
              <div className={`mt-3 flex items-start ${darkMode ? "text-amber-400" : "text-amber-600"}`}>
                <IoInformationCircleOutline className="text-lg flex-shrink-0 mt-0.5 mr-2" />
                <p className="text-sm">{t("O pagamento será processado em até 5 dias úteis após a confirmação.")}</p>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                className={`py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
                  darkMode
                    ? "bg-slate-700 text-slate-300 hover:bg-slate-600"
                    : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                }`}
                onClick={() => setShowModal(false)}
              >
                {t("Cancelar")}
              </button>
              <button
                type="button"
                className={`py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
                  darkMode
                    ? "bg-emerald-900/30 text-emerald-400 hover:bg-emerald-900/50 border border-emerald-800/30"
                    : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                }`}
                onClick={closeModal}
              >
                {t("Confirmar Saque")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ConfigPage
