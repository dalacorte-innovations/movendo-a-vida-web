"use client"

import { useContext, useEffect, useState, useMemo, useCallback, useRef } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import Sidebar from "../../components/sidebar"
import { ThemeContext } from "../../utils/ThemeContext.jsx"
import { IoCaretBack, IoSave, IoTrash, IoCompassOutline } from "react-icons/io5"
import { FaFilePdf, FaFileCsv } from "react-icons/fa6"
import { configBackendConnection, endpoints, getAuthHeaders } from "../../utils/backendConnection.js"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import type { OrganizedData } from "../../types/life-plan/lifePlan.js"
import TableBody from "./tableBody.js"
import { t } from "i18next"
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinnerNotTimer.jsx"

const months = [
  { full: "Janeiro", abbr: "jan" },
  { full: "Fevereiro", abbr: "fev" },
  { full: "Março", abbr: "mar" },
  { full: "Abril", abbr: "abr" },
  { full: "Maio", abbr: "mai" },
  { full: "Junho", abbr: "jun" },
  { full: "Julho", abbr: "jul" },
  { full: "Agosto", abbr: "ago" },
  { full: "Setembro", abbr: "set" },
  { full: "Outubro", abbr: "out" },
  { full: "Novembro", abbr: "nov" },
  { full: "Dezembro", abbr: "dez" },
]

const categories = [
  "receitas",
  "estudos",
  "custos",
  "lucroPrejuizo",
  "investimentos",
  "realizacoes",
  "intercambio",
  "empresas",
  "pessoais",
]

const LifePlanTable = () => {
  const { darkMode } = useContext(ThemeContext)
  const [isLoading, setIsLoading] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const plan = location.state?.plan || { items: [] }
  const [resetData, setResetData] = useState(false)
  const [dataHasBeenAltered, setDataHasBeenAltered] = useState(false)
  const [editingCell, setEditingCell] = useState<{ id: number; date: string } | null>(null)
  const allDates: string[] = plan.items.map((item) => item.date.split("-").slice(0, 2).join("-"))
  const uniqueDates: string[] = useMemo(() => Array.from(new Set(allDates)).sort(), [allDates])
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const waveCanvasRef = useRef<HTMLCanvasElement>(null)
  const waveAnimationRef = useRef<number>()

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
        color: darkMode ? "rgba(219, 39, 119, 0.3)" : "rgba(219, 39, 119, 0.15)",
        lineWidth: 3,
      },
      {
        amplitude: 30,
        period: 0.03,
        speed: 0.015,
        phase: 2,
        color: darkMode ? "rgba(139, 92, 246, 0.3)" : "rgba(139, 92, 246, 0.15)",
        lineWidth: 2,
      },
      {
        amplitude: 70,
        period: 0.01,
        speed: 0.005,
        phase: 4,
        color: darkMode ? "rgba(236, 72, 153, 0.2)" : "rgba(236, 72, 153, 0.1)",
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
          : `rgba(219, 39, 119, ${particle.opacity * 0.7})`
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
          ctx.strokeStyle = darkMode ? `rgba(236, 72, 153, ${opacity * 0.3})` : `rgba(236, 72, 153, ${opacity * 0.15})`
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

  const formatCategoryName = (category: string) => {
    const formattedCategories: { [key: string]: string } = {
      receitas: "Receitas",
      estudos: "Estudos",
      custos: "Custos",
      lucroPrejuizo: "Lucro/Prejuízo",
      investimentos: "Investimentos",
      realizacoes: "Realizações",
      intercambio: "Intercâmbio",
      empresas: "Empresas",
      pessoais: "Pessoais",
    }
    return formattedCategories[category] || category
  }

  const generateEmptyOrganizedData = (): OrganizedData => {
    return {
      receitas: {},
      estudos: {},
      custos: {},
      lucroPrejuizo: {},
      investimentos: {},
      realizacoes: {},
      intercambio: {},
      empresas: {},
      pessoais: {},
    }
  }

  const generateEmptyValues = () => {
    const returnalValue = {}
    uniqueDates.forEach((date) => {
      returnalValue[date] = 0
    })
    return returnalValue
  }

  const defaultCategoryRows: { [key: string]: { name: string; values: any; firstMeta: number }[] } = {
    investimentos: [
      { name: "Reserva Inicial", values: generateEmptyValues(), firstMeta: 0 },
      { name: "Investimentos Planos de 12 meses", values: generateEmptyValues(), firstMeta: 0 },
      { name: "Investimentos Planos de 10 Anos", values: generateEmptyValues(), firstMeta: 0 },
      { name: "Investimentos Planos de Aposentadoria", values: generateEmptyValues(), firstMeta: 0 },
      { name: "Poupança Intercâmbio", values: generateEmptyValues(), firstMeta: 0 },
    ],
    empresas: [
      { name: "Criar Empresas", values: generateEmptyValues(), firstMeta: 0 },
      { name: "Comprar Empresas", values: generateEmptyValues(), firstMeta: 0 },
    ],
    pessoais: [
      { name: "Reforma no Apartamento", values: generateEmptyValues(), firstMeta: 0 },
      { name: "Casamento", values: generateEmptyValues(), firstMeta: 0 },
      { name: "Novo Apartamento", values: generateEmptyValues(), firstMeta: 0 },
      { name: "Carro Novo", values: generateEmptyValues(), firstMeta: 0 },
      { name: "Filhos", values: generateEmptyValues(), firstMeta: 0 },
      { name: "Casa na Praia", values: generateEmptyValues(), firstMeta: 0 },
    ],
  }

  const [organizedData, setOrganizedData] = useState<OrganizedData>(generateEmptyOrganizedData())

  const getNewIndex = () => {
    let newIndex = 0
    categories.forEach((category) => (newIndex += Object.keys(organizedData[category]).length))
    return newIndex
  }

  const sumAllValuesByDate = (date: string, category: string) => {
    let sum = 0
    Object.keys(organizedData[category]).forEach((id) => {
      if (organizedData[category][id].values[date]) {
        sum += Number.parseFloat(organizedData[category][id].values[date])
      }
    })
    return sum
  }

  const getTotalMonthProfit = (date: string) => {
    const totalMonthProfitEstudos = sumAllValuesByDate(date, "estudos")
    const totalMonthProfitReceitas = sumAllValuesByDate(date, "receitas")
    const totalMonthProfitCustos = sumAllValuesByDate(date, "custos")

    return totalMonthProfitReceitas - totalMonthProfitCustos - totalMonthProfitEstudos
  }

  const setupProfitLossCategoryData = useCallback(() => {
    const newProfitLossCategoryData = {}
    const index = getNewIndex()
    const newProfitLossValues: { [key: string]: number } = {}
    uniqueDates.forEach((date) => {
      newProfitLossValues[date] = getTotalMonthProfit(date)
    })
    let totalProfit = 0
    Object.values(newProfitLossValues).forEach((value) => {
      totalProfit += value
    })
    newProfitLossCategoryData[index] = {
      name: totalProfit > 0 ? "Lucro" : "Prejuízo",
      values: newProfitLossValues,
      firstMeta: 0,
    }
    setOrganizedData((prev) => ({
      ...prev,
      lucroPrejuizo: {
        ...newProfitLossCategoryData,
      },
    }))
  }, [uniqueDates, organizedData])

  useEffect(() => {
    setupProfitLossCategoryData()
  }, [setupProfitLossCategoryData])

  useEffect(() => {
    const newOrganizedData = generateEmptyOrganizedData()
    plan.items.forEach((item) => {
      const [year, month] = item.date.split("-")
      const monthKey = `${year}-${month.padStart(2, "0")}`

      if (!newOrganizedData[item.category]) {
        newOrganizedData[item.category] = {}
      }
      if (!newOrganizedData[item.category][item.name]) {
        newOrganizedData[item.category][item.name] = { values: {}, firstMeta: item.meta }
      }

      newOrganizedData[item.category][item.name].values[monthKey] = item.value
    })

    const finalOrganizedData: OrganizedData = generateEmptyOrganizedData()
    let rowIndex = 0

    // Adiciona os dados do plano ao organizedData
    categories.forEach((category) => {
      Object.keys(newOrganizedData[category]).forEach((name) => {
        let rowTotal = 0
        uniqueDates.forEach((date) => {
          if (newOrganizedData[category][name].values[date]) {
            rowTotal += Number.parseFloat(newOrganizedData[category][name].values[date])
          } else {
            newOrganizedData[category][name].values[date] = 0
          }
        })

        finalOrganizedData[category][rowIndex] = {
          name: name,
          values: newOrganizedData[category][name].values,
          firstMeta: rowTotal,
        }
        rowIndex++
      })
    })

    const profitLossValues: { [key: string]: number } = {}
    uniqueDates.forEach((date) => {
      const totalReceitas = Object.values(newOrganizedData["receitas"] || {}).reduce(
        (acc, item) => acc + (Number.parseFloat(item.values[date]) || 0),
        0,
      )
      const totalCustos = Object.values(newOrganizedData["custos"] || {}).reduce(
        (acc, item) => acc + (Number.parseFloat(item.values[date]) || 0),
        0,
      )
      const totalEstudos = Object.values(newOrganizedData["estudos"] || {}).reduce(
        (acc, item) => acc + (Number.parseFloat(item.values[date]) || 0),
        0,
      )

      profitLossValues[date] = totalReceitas - totalCustos - totalEstudos
    })

    const totalProfit = Object.values(profitLossValues).reduce((acc, value) => acc + value, 0)
    finalOrganizedData["lucroPrejuizo"][0] = {
      name: totalProfit > 0 ? "Lucro" : "Prejuízo",
      values: profitLossValues,
      firstMeta: 0,
    }

    setOrganizedData(finalOrganizedData)
  }, [plan, resetData])

  const formatValue = (value) => {
    return Number.parseFloat(value).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  const handleGeneratePDF = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(
        `${configBackendConnection.baseURL}/${endpoints.lifePlanAPI}${plan.id}/export-pdf/`,
        {
          method: "GET",
          headers: getAuthHeaders(),
        },
      )
      if (!response.ok) {
        toast.error("Erro ao gerar PDF")
        return
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `life_plan_${plan.id}.pdf`
      link.click()
      window.URL.revokeObjectURL(url)
      toast.success("PDF gerado com sucesso!")
    } catch (error) {
      console.error("Erro ao baixar o PDF:", error)
      toast.error("Erro ao baixar o PDF")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerateCSV = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(
        `${configBackendConnection.baseURL}/${endpoints.lifePlanAPI}${plan.id}/export-csv/`,
        {
          method: "GET",
          headers: getAuthHeaders(),
        },
      )
      if (!response.ok) {
        toast.error("Erro ao gerar CSV")
        return
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `life_plan_${plan.id}.csv`
      link.click()
      window.URL.revokeObjectURL(url)
      toast.success("CSV gerado com sucesso!")
    } catch (error) {
      console.error("Erro ao baixar o CSV:", error)
      toast.error("Erro ao baixar o CSV")
    } finally {
      setIsLoading(false)
    }
  }

  const [isSaving, setIsSaving] = useState(false)

  const handleSaveEdit = async () => {
    try {
      if (!dataHasBeenAltered) {
        toast.info("Nenhuma alteração para salvar.")
        return
      }

      setIsLoading(true)
      setIsSaving(true)

      const itemsForPlan = {}

      categories.forEach((category) => {
        itemsForPlan[category] = {
          items: Object.keys(organizedData[category]).flatMap((id) => {
            const item = organizedData[category][id]
            return uniqueDates.map((date) => ({
              category: category,
              name: item.name,
              value: Number.parseFloat(item.values[date] || 0),
              date: `${date}-01`,
              meta: item.firstMeta,
            }))
          }),
        }
      })

      const response = await fetch(`${configBackendConnection.baseURL}/${endpoints.lifePlanAPI}${plan.id}/`, {
        method: "PATCH",
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: plan.name,
          items_for_plan: itemsForPlan,
        }),
      })

      if (!response.ok) {
        throw new Error("Erro ao salvar as alterações.")
      }

      setDataHasBeenAltered(false)
      toast.success("Alterações salvas com sucesso!")
    } catch (error) {
      console.error("Erro ao salvar as alterações:", error)
      toast.error("Erro ao salvar as alterações.")
    } finally {
      setIsLoading(false)
      setIsSaving(false)
    }
  }

  const handleResetEdit = () => {
    setResetData(!resetData)
    setDataHasBeenAltered(false)
    toast.info("Alterações descartadas.")
  }

  return (
    <div className={`flex h-screen overflow-hidden ${darkMode ? "bg-[#0F172A]" : "bg-[#f8f9ff]"}`}>
      <LoadingSpinner isLoading={isLoading} />

      <canvas ref={waveCanvasRef} className="fixed inset-0 pointer-events-none z-0" />

      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />

      <div
        className={`fixed md:relative ${darkMode ? "bg-slate-800/70 border-r border-slate-700/50" : "bg-white/80 border-r border-indigo-100"} h-full z-10`}
      >
        <Sidebar />
      </div>

      <main className="flex-grow p-4 md:p-6 lg:p-8 md:ml-16 overflow-auto relative z-10">
        <div
          className={`relative overflow-hidden rounded-2xl shadow-xl backdrop-blur-md mb-6 ${darkMode ? "bg-slate-800/70 border border-slate-700/50" : "bg-white/80 border border-indigo-100"}`}
        >
          <div className="absolute inset-0 overflow-hidden">
            <div
              className={`absolute -inset-[10px] rounded-full opacity-30 blur-3xl ${darkMode ? "bg-pink-500" : "bg-indigo-400"}`}
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
                  className={`relative flex items-center justify-center w-12 h-12 rounded-xl ${darkMode ? "bg-pink-900/30" : "bg-pink-100"} mr-4 overflow-hidden group`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <IoCompassOutline
                    className={`text-2xl relative z-10 ${darkMode ? "text-pink-400 group-hover:text-white" : "text-pink-600 group-hover:text-white"} transition-colors duration-500`}
                  />
                  <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 to-purple-600 blur opacity-30 group-hover:opacity-70 transition-opacity duration-500" />
                </div>
                <div>
                  <h2 className={`text-xl font-bold ${darkMode ? "text-white" : "text-slate-800"}`}>
                    {plan.name || "Plano de Vida"}
                  </h2>
                  <p className={`text-sm mt-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                    {t("Visualize e gerencie seu planejamento financeiro")}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  className={`group flex items-center justify-center py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
                    darkMode
                      ? "bg-emerald-900/30 text-emerald-400 hover:bg-emerald-900/50 border border-emerald-800/30"
                      : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                  }`}
                  onClick={handleGenerateCSV}
                >
                  <FaFileCsv className="mr-2" />
                  <span>Exportar CSV</span>
                </button>
                <button
                  className={`group flex items-center justify-center py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
                    darkMode
                      ? "bg-red-900/30 text-red-400 hover:bg-red-900/50 border border-red-800/30"
                      : "bg-red-50 text-red-700 hover:bg-red-100 border border-red-200"
                  }`}
                  onClick={handleGeneratePDF}
                >
                  <FaFilePdf className="mr-2" />
                  <span>Exportar PDF</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {dataHasBeenAltered && (
          <div
            className={`relative overflow-hidden rounded-xl shadow-md backdrop-blur-md mb-6 ${darkMode ? "bg-slate-800/70 border border-slate-700/50" : "bg-white/80 border border-indigo-100"}`}
          >
            <div className="relative p-4 flex flex-wrap items-center justify-between gap-3">
              <div className={`text-sm ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                Você tem alterações não salvas
              </div>
              <div className="flex gap-3">
                <button
                  className={`group flex items-center justify-center py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
                    darkMode
                      ? "bg-pink-900/30 text-pink-400 hover:bg-pink-900/50 border border-pink-800/30"
                      : "bg-pink-50 text-pink-700 hover:bg-pink-100 border border-pink-200"
                  } ${isSaving ? "opacity-70 cursor-not-allowed" : ""}`}
                  onClick={handleSaveEdit}
                  disabled={isSaving}
                >
                  <IoSave className="mr-2" />
                  <span>{isSaving ? "Salvando..." : "Salvar Alterações"}</span>
                </button>
                <button
                  className={`group flex items-center justify-center py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
                    darkMode
                      ? "bg-slate-700/50 text-slate-300 hover:bg-slate-700 border border-slate-600/50"
                      : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                  }`}
                  onClick={handleResetEdit}
                >
                  <IoTrash className="mr-2" />
                  <span>Descartar Alterações</span>
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {categories.map((category) => (
            <div
              key={category}
              className={`relative overflow-hidden rounded-xl shadow-md backdrop-blur-md ${darkMode ? "bg-slate-800/70 border border-slate-700/50" : "bg-white/80 border border-indigo-100"}`}
            >
              <div className="relative p-5">
                <h3
                  className={`text-lg font-semibold mb-4 ${darkMode ? "text-white" : "text-slate-800"} flex items-center`}
                >
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-lg ${darkMode ? "bg-pink-900/30" : "bg-pink-100"} mr-3`}
                  >
                    <span className={`${darkMode ? "text-pink-400" : "text-pink-600"}`}>
                      {category.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  {formatCategoryName(category)}
                </h3>

                <div className="overflow-x-auto" style={{ paddingBottom: "20px" }}>
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr>
                        <th className="" style={{ width: "30px", backgroundColor: "transparent" }}></th>
                        <th
                          className={`px-4 py-3 border ${darkMode ? "bg-slate-700/70 text-white border-slate-600/50" : "bg-indigo-50/70 text-slate-800 border-indigo-100"} rounded-tl-lg`}
                        >
                          Nome
                        </th>
                        {uniqueDates.map((date, index) => {
                          const [year, month] = date.split("-")
                          const isLast = index === uniqueDates.length - 1
                          return (
                            <th
                              key={date}
                              className={`px-4 py-3 border text-center ${darkMode ? "bg-slate-700/70 text-white border-slate-600/50" : "bg-indigo-50/70 text-slate-800 border-indigo-100"} ${isLast ? "rounded-tr-lg" : ""}`}
                              style={{ minWidth: "180px" }}
                            >
                              {months[Number.parseInt(month, 10) - 1].abbr} - {year}
                            </th>
                          )
                        })}
                        <th
                          className={`px-4 py-3 border text-center ${darkMode ? "bg-slate-700/70 text-white border-slate-600/50" : "bg-indigo-50/70 text-slate-800 border-indigo-100"} rounded-tr-lg`}
                        >
                          Total
                        </th>
                      </tr>
                    </thead>
                    <TableBody
                      data={organizedData}
                      setData={setOrganizedData}
                      category={category}
                      formatValue={formatValue}
                      darkMode={darkMode}
                      uniqueDates={uniqueDates}
                      editingCell={editingCell}
                      setEditingCell={setEditingCell}
                      setDataHasBeenAltered={setDataHasBeenAltered}
                      getNewIndex={getNewIndex}
                      setupProfitLossCategoryData={setupProfitLossCategoryData}
                    />
                  </table>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-8 mb-6">
          <button
            className={`group relative flex items-center justify-center py-3 px-6 rounded-xl font-medium text-sm overflow-hidden transition-all duration-300`}
            onClick={() => navigate("/life-plan/dashboard")}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-slate-600 to-slate-800 dark:from-slate-800 dark:to-slate-900 transition-transform duration-300 group-hover:scale-105" />
            <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-white transition-opacity duration-300" />
            <span className="relative z-10 flex items-center text-white">
              <IoCaretBack className="mr-2 transition-transform duration-300 group-hover:-translate-x-1" />
              Voltar para Dashboard
            </span>
          </button>
        </div>
      </main>
    </div>
  )
}

export default LifePlanTable