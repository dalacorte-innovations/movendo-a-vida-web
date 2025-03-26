"use client"

import React, { useContext, useState, useEffect, useRef } from "react"
import { Line, Pie } from "react-chartjs-2"
import Sidebar from "../../components/sidebar"
import { useNavigate } from "react-router-dom"
import {
  IoAddCircleOutline,
  IoCalendarOutline,
  IoStatsChartOutline,
  IoEyeOutline,
  IoTrendingUpOutline,
  IoWalletOutline,
  IoBarChartOutline,
  IoSchoolOutline,
  IoBusinessOutline,
  IoAirplaneOutline,
  IoHomeOutline,
  IoCompassOutline,
} from "react-icons/io5"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js"
import { ThemeContext } from "../../utils/ThemeContext.jsx"
import { configBackendConnection, endpoints, getAuthHeaders } from "../../utils/backendConnection"
import { format, parseISO } from "date-fns"
import { toast } from "react-toastify"
import { useTranslation } from "react-i18next"
import "react-toastify/dist/ReactToastify.css"
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinnerNotTimer.jsx"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler)

const LifePlanDashboard = () => {
  const navigate = useNavigate()
  const { darkMode } = useContext(ThemeContext)
  const [plansData, setPlansData] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("receitas")
  const [isLoading, setIsLoading] = useState(true)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [animateIn, setAnimateIn] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(null)
  const { t } = useTranslation()

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
    const fetchPlans = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`${configBackendConnection.baseURL}/${endpoints.lifePlanAPI}`, {
          method: "GET",
          headers: getAuthHeaders(),
        })
        if (!response.ok) {
          toast.error(t("Erro ao carregar os planos de vida"))
          return
        }
        const data = await response.json()
        setPlansData(data)
        if (data.length > 0) {
          setSelectedPlan(data[0].id)
        }
      } catch (error) {
        toast.error(t("Erro ao carregar os planos de vida"))
      } finally {
        setIsLoading(false)
      }
    }
  
    // Adicione uma verificação para evitar chamadas repetidas
    if (plansData.length === 0) {
      fetchPlans()
    }
  }, [plansData, t])

  const getAvailableCategories = (items) => {
    return [...new Set(items.map((item) => item.category))]
  }

  const getCategoryIcon = (category) => {
    const icons = {
      receitas: IoTrendingUpOutline,
      custos: IoWalletOutline,
      estudos: IoSchoolOutline,
      investimentos: IoBarChartOutline,
      realizacoes: IoStatsChartOutline,
      intercambio: IoAirplaneOutline,
      empresas: IoBusinessOutline,
      pessoais: IoHomeOutline,
      lucro_prejuizo: IoTrendingUpOutline,
    }
    return icons[category] || IoStatsChartOutline
  }

  const getCategoryColor = (category) => {
    if (darkMode) {
      const colors = {
        receitas: { bg: "bg-emerald-900/30", text: "text-emerald-400", border: "border-emerald-800/30" },
        custos: { bg: "bg-red-900/30", text: "text-red-400", border: "border-red-800/30" },
        estudos: { bg: "bg-blue-900/30", text: "text-blue-400", border: "border-blue-800/30" },
        investimentos: { bg: "bg-amber-900/30", text: "text-amber-400", border: "border-amber-800/30" },
        realizacoes: { bg: "bg-pink-900/30", text: "text-pink-400", border: "border-pink-800/30" },
        intercambio: { bg: "bg-indigo-900/30", text: "text-indigo-400", border: "border-indigo-800/30" },
        empresas: { bg: "bg-cyan-900/30", text: "text-cyan-400", border: "border-cyan-800/30" },
        pessoais: { bg: "bg-orange-900/30", text: "text-orange-400", border: "border-orange-800/30" },
        lucro_prejuizo: { bg: "bg-purple-900/30", text: "text-purple-400", border: "border-purple-800/30" },
      }
      return colors[category] || colors.receitas
    } else {
      const colors = {
        receitas: { bg: "bg-emerald-100", text: "text-emerald-600", border: "border-emerald-200" },
        custos: { bg: "bg-red-100", text: "text-red-600", border: "border-red-200" },
        estudos: { bg: "bg-blue-100", text: "text-blue-600", border: "border-blue-200" },
        investimentos: { bg: "bg-amber-100", text: "text-amber-600", border: "border-amber-200" },
        realizacoes: { bg: "bg-blue-100", text: "text-blue-600", border: "border-blue-200" },
        intercambio: { bg: "bg-indigo-100", text: "text-indigo-600", border: "border-indigo-200" },
        empresas: { bg: "bg-cyan-100", text: "text-cyan-600", border: "border-cyan-200" },
        pessoais: { bg: "bg-blue-100", text: "text-blue-600", border: "border-blue-200" },
        lucro_prejuizo: { bg: "bg-purple-100", text: "text-purple-600", border: "border-purple-200" },
      }
      return colors[category] || colors.receitas
    }
  }

  const isPieChartCategory = [
    "estudos",
    "custos",
    "investimentos",
    "realizacoes",
    "intercambio",
    "empresas",
    "pessoais",
  ].includes(selectedCategory.toLowerCase())

  const getChartData = (items, profitLossByDate) => {
    if (selectedCategory === "lucro_prejuizo") {
      const labels = profitLossByDate.map((item) => format(parseISO(item.date), "MMM yyyy"))
      const data = profitLossByDate.map((item) => item.profit_loss)

      return {
        labels,
        datasets: [
          {
            label: t("Lucro/Prejuízo"),
            data: data,
            backgroundColor: darkMode
              ? data.map((value) => (value > 0 ? "rgba(52, 211, 153, 0.2)" : "rgba(248, 113, 113, 0.2)"))
              : data.map((value) => (value > 0 ? "rgba(16, 185, 129, 0.2)" : "rgba(239, 68, 68, 0.2)")),
            borderColor: darkMode
              ? data.map((value) => (value > 0 ? "rgb(52, 211, 153)" : "rgb(248, 113, 113)"))
              : data.map((value) => (value > 0 ? "rgb(16, 185, 129)" : "rgb(239, 68, 68)")),
            borderWidth: 2,
            tension: 0.3,
            fill: true,
            pointBackgroundColor: darkMode
              ? data.map((value) => (value > 0 ? "rgb(52, 211, 153)" : "rgb(248, 113, 113)"))
              : data.map((value) => (value > 0 ? "rgb(16, 185, 129)" : "rgb(239, 68, 68)")),
            pointBorderColor: "#FFFFFF",
            pointRadius: 4,
            pointHoverRadius: 6,
          },
        ],
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              labels: {
                color: darkMode ? "#fff" : "#333",
                font: {
                  size: 12,
                },
              },
            },
            tooltip: {
              backgroundColor: darkMode ? "rgba(30, 41, 59, 0.8)" : "rgba(255, 255, 255, 0.8)",
              titleColor: darkMode ? "#fff" : "#333",
              bodyColor: darkMode ? "#fff" : "#333",
              borderColor: darkMode ? "rgba(148, 163, 184, 0.2)" : "rgba(203, 213, 225, 0.8)",
              borderWidth: 1,
              padding: 10,
              displayColors: true,
              callbacks: {
                label: (context) => {
                  let label = context.dataset.label || ""
                  if (label) {
                    label += ": "
                  }
                  if (context.parsed.y !== null) {
                    label += new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                      context.parsed.y,
                    )
                  }
                  return label
                },
              },
            },
          },
          scales: {
            x: {
              grid: {
                color: darkMode ? "rgba(148, 163, 184, 0.1)" : "rgba(203, 213, 225, 0.3)",
              },
              ticks: {
                color: darkMode ? "#94a3b8" : "#64748b",
              },
            },
            y: {
              grid: {
                color: darkMode ? "rgba(148, 163, 184, 0.1)" : "rgba(203, 213, 225, 0.3)",
              },
              ticks: {
                color: darkMode ? "#94a3b8" : "#64748b",
                callback: (value) =>
                  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value),
              },
            },
          },
        },
      }
    } else if (isPieChartCategory) {
      const filteredItems = items
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5)
        .reduce((acc, item) => {
          if (!acc[item.name]) {
            acc[item.name] = Number.parseFloat(item.value)
          } else {
            acc[item.name] += Number.parseFloat(item.value)
          }
          return acc
        }, {})

      const labels = Object.keys(filteredItems)
      const data = Object.values(filteredItems)

      const backgroundColors = darkMode
        ? [
            "rgba(219, 39, 119, 0.7)",
            "rgba(139, 92, 246, 0.7)",
            "rgba(59, 130, 246, 0.7)",
            "rgba(16, 185, 129, 0.7)",
            "rgba(245, 158, 11, 0.7)",
          ]
        : [
            "rgba(219, 39, 119, 0.7)",
            "rgba(79, 70, 229, 0.7)",
            "rgba(37, 99, 235, 0.7)",
            "rgba(16, 185, 129, 0.7)",
            "rgba(245, 158, 11, 0.7)",
          ]

      return {
        labels,
        datasets: [
          {
            data,
            backgroundColor: backgroundColors.slice(0, labels.length),
            borderColor: darkMode ? "rgba(30, 41, 59, 0.8)" : "#FFFFFF",
            borderWidth: 2,
          },
        ],
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "right",
              labels: {
                color: darkMode ? "#fff" : "#333",
                font: {
                  size: 12,
                },
                padding: 15,
              },
            },
            tooltip: {
              backgroundColor: darkMode ? "rgba(30, 41, 59, 0.8)" : "rgba(255, 255, 255, 0.8)",
              titleColor: darkMode ? "#fff" : "#333",
              bodyColor: darkMode ? "#fff" : "#333",
              borderColor: darkMode ? "rgba(148, 163, 184, 0.2)" : "rgba(203, 213, 225, 0.8)",
              borderWidth: 1,
              padding: 10,
              callbacks: {
                label: (context) => {
                  let label = context.label || ""
                  if (label) {
                    label += ": "
                  }
                  if (context.parsed !== null) {
                    label += new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                      context.parsed,
                    )
                  }
                  return label
                },
              },
            },
          },
        },
      }
    } else {
      const labels = Array.from(new Set(items.map((item) => format(parseISO(item.date), "MMM yyyy"))))
      const incomeSources = Array.from(new Set(items.map((item) => item.name)))

      const colors = darkMode
        ? [
            "rgba(219, 39, 119, 1)",
            "rgba(139, 92, 246, 1)",
            "rgba(59, 130, 246, 1)",
            "rgba(16, 185, 129, 1)",
            "rgba(245, 158, 11, 1)",
          ]
        : [
            "rgba(219, 39, 119, 1)",
            "rgba(79, 70, 229, 1)",
            "rgba(37, 99, 235, 1)",
            "rgba(16, 185, 129, 1)",
            "rgba(245, 158, 11, 1)",
          ]

      const backgroundColors = darkMode
        ? [
            "rgba(219, 39, 119, 0.1)",
            "rgba(139, 92, 246, 0.1)",
            "rgba(59, 130, 246, 0.1)",
            "rgba(16, 185, 129, 0.1)",
            "rgba(245, 158, 11, 0.1)",
          ]
        : [
            "rgba(219, 39, 119, 0.1)",
            "rgba(79, 70, 229, 0.1)",
            "rgba(37, 99, 235, 0.1)",
            "rgba(16, 185, 129, 0.1)",
            "rgba(245, 158, 11, 0.1)",
          ]

      const datasets = incomeSources.map((source, index) => {
        const sourceData = items
          .filter((item) => item.name === source)
          .reduce((acc, item) => {
            const label = format(parseISO(item.date), "MMM yyyy")
            acc[label] = acc[label] ? acc[label] + Number.parseFloat(item.value) : Number.parseFloat(item.value)
            return acc
          }, {})

        return {
          label: source,
          data: labels.map((label) => sourceData[label] || 0),
          backgroundColor: backgroundColors[index % backgroundColors.length],
          borderColor: colors[index % colors.length],
          borderWidth: 2,
          tension: 0.4,
          fill: true,
          pointBackgroundColor: colors[index % colors.length],
          pointBorderColor: darkMode ? "#1e293b" : "#FFFFFF",
          pointRadius: 4,
          pointHoverRadius: 6,
        }
      })

      return {
        labels,
        datasets,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: "top",
              labels: {
                color: darkMode ? "#fff" : "#333",
                font: {
                  size: 12,
                },
                padding: 15,
              },
            },
            tooltip: {
              backgroundColor: darkMode ? "rgba(30, 41, 59, 0.8)" : "rgba(255, 255, 255, 0.8)",
              titleColor: darkMode ? "#fff" : "#333",
              bodyColor: darkMode ? "#fff" : "#333",
              borderColor: darkMode ? "rgba(148, 163, 184, 0.2)" : "rgba(203, 213, 225, 0.8)",
              borderWidth: 1,
              padding: 10,
              callbacks: {
                label: (context) => {
                  let label = context.dataset.label || ""
                  if (label) {
                    label += ": "
                  }
                  if (context.parsed.y !== null) {
                    label += new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                      context.parsed.y,
                    )
                  }
                  return label
                },
              },
            },
          },
          scales: {
            x: {
              grid: {
                color: darkMode ? "rgba(148, 163, 184, 0.1)" : "rgba(203, 213, 225, 0.3)",
              },
              ticks: {
                color: darkMode ? "#94a3b8" : "#64748b",
              },
            },
            y: {
              grid: {
                color: darkMode ? "rgba(148, 163, 184, 0.1)" : "rgba(203, 213, 225, 0.3)",
              },
              ticks: {
                color: darkMode ? "#94a3b8" : "#64748b",
                callback: (value) =>
                  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value),
              },
            },
          },
        },
      }
    }
  }

  const handleAddPlan = () => {
    navigate("/life-plan/create")
  }

  const handleViewDetailPlan = (plan) => {
    navigate(`/life-plan/${plan.id}/table`, { state: { plan } })
  }

  const handleViewPlan = (id) => {
    navigate(`/life-plan/${id}`)
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)
  }

  const calculateTotalByCategory = (plan, category) => {
    if (!plan || !plan.items) return 0

    return plan.items
      .filter((item) => item.category === category)
      .reduce((sum, item) => sum + Number.parseFloat(item.value), 0)
  }

  const getCurrentPlan = () => {
    if (!selectedPlan || !plansData.length) return null
    return plansData.find((plan) => plan.id === selectedPlan)
  }

  const currentPlan = getCurrentPlan()

  if (isLoading) {
    return <LoadingSpinner isLoading={isLoading} />
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
        <div className="max-w-7xl mx-auto">
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
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center">
                  <div
                    className={`relative flex items-center justify-center w-12 h-12 rounded-xl ${
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
                      {t("Dashboard de Planos")}
                    </h1>
                    <p className={`text-sm mt-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                      {t("Visualize e gerencie seus planos de vida")}
                    </p>
                  </div>
                </div>

                <button
                  className={`group relative flex items-center justify-center py-2.5 px-5 rounded-lg font-medium text-sm text-white overflow-hidden transition-all duration-300`}
                  onClick={handleAddPlan}
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
                    <IoAddCircleOutline className="mr-2" />
                    {t("Criar Novo Plano")}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {plansData.length === 0 ? (
            <div
              className={`relative overflow-hidden rounded-xl shadow-md backdrop-blur-md p-12 text-center ${
                darkMode ? "bg-slate-800/70 border border-slate-700/50" : "bg-white/80 border border-blue-100"
              } transform transition-all duration-500 ease-out ${animateIn ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
              style={{ transitionDelay: "100ms" }}
            >
              <div
                className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center ${
                  darkMode ? "bg-pink-900/30" : "bg-blue-100"
                } mb-4`}
              >
                <IoCalendarOutline className={`text-4xl ${darkMode ? "text-pink-400" : "text-blue-600"}`} />
              </div>
              <h2 className={`text-xl font-semibold mb-3 ${darkMode ? "text-white" : "text-slate-800"}`}>
                {t("Nenhum plano encontrado")}
              </h2>
              <p className={`text-base mb-6 max-w-md mx-auto ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                {t("Você ainda não criou nenhum plano de vida. Comece agora mesmo a planejar seu futuro!")}
              </p>
              <button
                className={`group relative inline-flex items-center justify-center py-3 px-6 rounded-lg font-medium text-white overflow-hidden transition-all duration-300`}
                onClick={handleAddPlan}
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
                  <IoAddCircleOutline className="mr-2" />
                  {t("Criar Meu Primeiro Plano")}
                </span>
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                {plansData.map((plan) => (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`transform transition-all duration-300 ease-out ${animateIn ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"} cursor-pointer`}
                    style={{ transitionDelay: "100ms" }}
                  >
                    <div
                      className={`relative overflow-hidden rounded-xl shadow-md backdrop-blur-md border-2 transition-all duration-300 ${
                        selectedPlan === plan.id
                          ? darkMode
                            ? "border-pink-500/50 bg-slate-800/90"
                            : "border-blue-500/50 bg-white/90"
                          : darkMode
                            ? "border-slate-700/50 bg-slate-800/70 hover:bg-slate-800/90"
                            : "border-blue-100 bg-white/80 hover:bg-white/90"
                      }`}
                    >
                      <div className="p-4">
                        <div className="flex items-center mb-2">
                          <div
                            className={`flex items-center justify-center w-10 h-10 rounded-lg ${
                              darkMode ? "bg-pink-900/30" : "bg-blue-100"
                            } mr-3`}
                          >
                            <IoCalendarOutline className={`text-lg ${darkMode ? "text-pink-400" : "text-blue-600"}`} />
                          </div>
                          <h3 className={`font-semibold truncate ${darkMode ? "text-white" : "text-slate-800"}`}>
                            {plan.name}
                          </h3>
                        </div>

                        <div className="flex justify-between items-center mt-3">
                          <button
                            className={`text-xs py-1 px-2 rounded-md ${
                              darkMode
                                ? "bg-slate-700/50 text-slate-300 hover:bg-slate-700"
                                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                            }`}
                            onClick={(e) => {
                              e.stopPropagation()
                              handleViewPlan(plan.id)
                            }}
                          >
                            {t("Editar")}
                          </button>

                          <button
                            className={`text-xs py-1 px-2 rounded-md ${
                              darkMode
                                ? "bg-pink-900/30 text-pink-300 hover:bg-pink-900/50"
                                : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                            }`}
                            onClick={(e) => {
                              e.stopPropagation()
                              handleViewDetailPlan(plan)
                            }}
                          >
                            <div className="flex items-center">
                              <IoEyeOutline className="mr-1" />
                              {t("Detalhes")}
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {currentPlan && (
                <>
                  <div
                    className={`relative overflow-hidden rounded-xl shadow-md backdrop-blur-md mb-6 ${
                      darkMode ? "bg-slate-800/70 border border-slate-700/50" : "bg-white/80 border border-blue-100"
                    } transform transition-all duration-500 ease-out ${animateIn ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
                    style={{ transitionDelay: "200ms" }}
                  >
                    <div className="p-6">
                      <div className="flex items-center mb-4">
                        <h2 className={`text-lg font-semibold ${darkMode ? "text-white" : "text-slate-800"}`}>
                          {currentPlan.name}
                        </h2>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                          {
                            category: "receitas",
                            label: t("Receitas"),
                            icon: IoTrendingUpOutline,
                            color: "emerald",
                          },
                          {
                            category: "custos",
                            label: t("Custos"),
                            icon: IoWalletOutline,
                            color: "red",
                          },
                          {
                            category: "investimentos",
                            label: t("Investimentos"),
                            icon: IoBarChartOutline,
                            color: "amber",
                          },
                          {
                            category: "lucro_prejuizo",
                            label: t("Lucro/Prejuízo"),
                            icon: IoTrendingUpOutline,
                            color: "purple",
                          },
                        ].map((item) => {
                          const colorClasses = getCategoryColor(item.category)
                          const value =
                            item.category === "lucro_prejuizo"
                              ? calculateTotalByCategory(currentPlan, "receitas") -
                                calculateTotalByCategory(currentPlan, "custos")
                              : calculateTotalByCategory(currentPlan, item.category)

                          return (
                            <div
                              key={item.category}
                              className={`p-4 rounded-xl ${colorClasses.bg} ${colorClasses.border} border`}
                              onClick={() => setSelectedCategory(item.category)}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <item.icon className={`text-xl mr-2 ${colorClasses.text}`} />
                                  <span className={`text-sm font-medium ${colorClasses.text}`}>{item.label}</span>
                                </div>
                                <span className={`font-bold ${colorClasses.text}`}>{formatCurrency(value)}</span>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>

                  <div
                    className={`relative overflow-hidden rounded-xl shadow-md backdrop-blur-md ${
                      darkMode ? "bg-slate-800/70 border border-slate-700/50" : "bg-white/80 border border-blue-100"
                    } transform transition-all duration-500 ease-out ${animateIn ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
                    style={{ transitionDelay: "300ms" }}
                  >
                    <div className="p-6">
                      <div className="flex flex-wrap items-center justify-between mb-6">
                        <div className="flex items-center mb-4 md:mb-0">
                          <div
                            className={`flex items-center justify-center w-10 h-10 rounded-lg ${
                              getCategoryColor(selectedCategory).bg
                            } mr-3`}
                          >
                            {React.createElement(getCategoryIcon(selectedCategory), {
                              className: `text-lg ${getCategoryColor(selectedCategory).text}`,
                            })}
                          </div>
                          <h3 className={`font-semibold ${darkMode ? "text-white" : "text-slate-800"}`}>
                            {selectedCategory === "lucro_prejuizo"
                              ? t("Lucro/Prejuízo")
                              : t(selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1))}
                          </h3>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {[...getAvailableCategories(currentPlan.items), "lucro_prejuizo"].map((category) => (
                            <button
                              key={category}
                              className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${
                                selectedCategory === category
                                  ? `${getCategoryColor(category).bg} ${getCategoryColor(category).text} ${getCategoryColor(category).border} border`
                                  : darkMode
                                    ? "bg-slate-700/50 text-slate-300 hover:bg-slate-700 border border-slate-600/50"
                                    : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                              }`}
                              onClick={() => setSelectedCategory(category)}
                            >
                              {t(
                                category === "lucro_prejuizo"
                                  ? "Lucro/Prejuízo"
                                  : category.charAt(0).toUpperCase() + category.slice(1),
                              )}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="h-[400px] w-full">
                        {isPieChartCategory ? (
                          <div className="flex items-center justify-center h-full">
                            <div className="w-[300px] h-[300px]">
                              <Pie
                                data={getChartData(
                                  currentPlan.items.filter((item) => item.category === selectedCategory),
                                  currentPlan.profit_loss_by_date,
                                )}
                                options={
                                  getChartData(
                                    currentPlan.items.filter((item) => item.category === selectedCategory),
                                    currentPlan.profit_loss_by_date,
                                  ).options
                                }
                              />
                            </div>
                          </div>
                        ) : (
                          <Line
                            data={getChartData(
                              currentPlan.items.filter((item) => item.category === selectedCategory),
                              currentPlan.profit_loss_by_date,
                            )}
                            options={
                              getChartData(
                                currentPlan.items.filter((item) => item.category === selectedCategory),
                                currentPlan.profit_loss_by_date,
                              ).options
                            }
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  )
}

export default LifePlanDashboard

