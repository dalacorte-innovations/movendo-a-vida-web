"use client"

import { useState, useContext } from "react"
import { ThemeContext } from "../../utils/ThemeContext.jsx"
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, parseISO } from "date-fns"
import { pt } from "date-fns/locale"
import {
  FaCalendarAlt,
  FaClock,
  FaPlus,
  FaChevronLeft,
  FaChevronRight,
  FaEllipsisH,
  FaSyncAlt,
  FaGoogle,
} from "react-icons/fa"

export default function SmartCalendarPage() {
  const { darkMode } = useContext(ThemeContext)
  const [date, setDate] = useState(new Date())
  const [view, setView] = useState("week")
  const [isGoogleConnected, setIsGoogleConnected] = useState(false)
  const [isAddEventOpen, setIsAddEventOpen] = useState(false)
  const [currentWeek, setCurrentWeek] = useState(getWeekDays(new Date()))
  const [isConnectingGoogle, setIsConnectingGoogle] = useState(false)
  const [activeTab, setActiveTab] = useState("upcoming")

  const events = [
    {
      id: 1,
      title: "Revisão do Plano Financeiro",
      date: addDays(new Date(), 1).toISOString(),
      time: "10:00 - 11:00",
      category: "finance",
      description: "Revisão mensal do plano financeiro e ajustes de metas",
      location: "Online",
    },
    {
      id: 2,
      title: "Consulta com Coach de Carreira",
      date: new Date().toISOString(),
      time: "14:00 - 15:00",
      category: "coaching",
      description: "Sessão de coaching para desenvolvimento profissional",
      location: "Zoom",
    },
    {
      id: 3,
      title: "Planejamento de Viagem",
      date: addDays(new Date(), 2).toISOString(),
      time: "16:00 - 17:00",
      category: "travel",
      description: "Organizar detalhes da próxima viagem",
      location: "Casa",
    },
    {
      id: 4,
      title: "Curso de Investimentos",
      date: addDays(new Date(), -1).toISOString(),
      time: "19:00 - 20:30",
      category: "education",
      description: "Aula sobre investimentos em renda fixa",
      location: "Online",
    },
  ]

  function getWeekDays(date) {
    const start = startOfWeek(date, { weekStartsOn: 0 })
    const end = endOfWeek(date, { weekStartsOn: 0 })
    return eachDayOfInterval({ start, end })
  }

  function nextWeek() {
    const nextWeekDate = addDays(currentWeek[6], 1)
    setCurrentWeek(getWeekDays(nextWeekDate))
  }

  function prevWeek() {
    const prevWeekDate = addDays(currentWeek[0], -7)
    setCurrentWeek(getWeekDays(prevWeekDate))
  }

  function getCategoryColor(category) {
    const colors = {
      finance: "bg-green-500",
      coaching: "bg-purple-500",
      travel: "bg-blue-500",
      education: "bg-amber-500",
      default: "bg-slate-500",
    }
    return colors[category] || colors.default
  }

  function getCategoryTextColor(category) {
    const colors = {
      finance: "text-green-500",
      coaching: "text-purple-500",
      travel: "text-blue-500",
      education: "text-amber-500",
      default: "text-slate-500",
    }
    return colors[category] || colors.default
  }

  function getCategoryBgColor(category) {
    const colors = {
      finance: "bg-green-500/10",
      coaching: "bg-purple-500/10",
      travel: "bg-blue-500/10",
      education: "bg-amber-500/10",
      default: "bg-slate-500/10",
    }
    return colors[category] || colors.default
  }

  function getCategoryBorderColor(category) {
    const colors = {
      finance: "border-green-500/20",
      coaching: "border-purple-500/20",
      travel: "border-blue-500/20",
      education: "border-amber-500/20",
      default: "border-slate-500/20",
    }
    return colors[category] || colors.default
  }

  function handleConnectGoogle() {
    setIsConnectingGoogle(true)

    // Simulate API call to connect to Google Calendar
    setTimeout(() => {
      setIsGoogleConnected(true)
      setIsConnectingGoogle(false)
    }, 2000)
  }

  const eventsForDay = (day) => {
    return events.filter((event) => isSameDay(parseISO(event.date), day))
  }

  // Modal state
  const [showModal, setShowModal] = useState(false)
  const [modalEvent, setModalEvent] = useState(null)

  return (
    <div className={`min-h-screen ${darkMode ? "bg-slate-900" : "bg-slate-50"}`}>
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-8">
          <h1 className={`text-3xl font-bold ${darkMode ? "text-white" : "text-slate-800"}`}>Agenda Inteligente</h1>
          <p className={`mt-2 ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
            Gerencie seus compromissos e sincronize com o Google Calendar
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <div className={`rounded-lg shadow-md overflow-hidden ${darkMode ? "bg-slate-800" : "bg-white"}`}>
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className={`text-xl font-semibold ${darkMode ? "text-white" : "text-slate-800"}`}>Calendário</h2>
              </div>
              <div className="p-4">
                {/* Simple calendar display */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {["D", "S", "T", "Q", "Q", "S", "S"].map((day, i) => (
                    <div key={i} className="text-center text-xs font-medium text-gray-500 dark:text-gray-400">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: 35 }).map((_, i) => {
                    const day = new Date(date.getFullYear(), date.getMonth(), i - date.getDate() + 15)
                    const isToday = isSameDay(day, new Date())
                    const hasEvents = events.some((event) => isSameDay(parseISO(event.date), day))

                    return (
                      <button
                        key={i}
                        onClick={() => setDate(day)}
                        className={`h-8 w-8 rounded-full flex items-center justify-center text-sm ${
                          isToday
                            ? "bg-blue-500 text-white"
                            : hasEvents
                              ? darkMode
                                ? "bg-slate-700 text-white"
                                : "bg-blue-100 text-blue-700"
                              : darkMode
                                ? "text-slate-300 hover:bg-slate-700"
                                : "text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        {day.getDate()}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className={`rounded-lg shadow-md overflow-hidden ${darkMode ? "bg-slate-800" : "bg-white"}`}>
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className={`text-xl font-semibold ${darkMode ? "text-white" : "text-slate-800"}`}>Sincronização</h2>
                <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                  Conecte com o Google Calendar
                </p>
              </div>
              <div className="p-4 space-y-4">
                {isGoogleConnected ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                      <span className={`text-sm font-medium ${darkMode ? "text-white" : "text-slate-800"}`}>
                        Conectado ao Google Calendar
                      </span>
                    </div>
                    <div className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                      Última sincronização: {format(new Date(), "dd/MM/yyyy HH:mm")}
                    </div>
                    <button
                      className={`w-full py-2 px-4 rounded-md text-sm ${darkMode ? "bg-slate-700 hover:bg-slate-600 text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-800"} flex items-center justify-center`}
                    >
                      <FaSyncAlt className="h-4 w-4 mr-2" />
                      Sincronizar Agora
                    </button>
                  </div>
                ) : (
                  <button
                    className={`w-full py-2 px-4 rounded-md ${darkMode ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-blue-500 hover:bg-blue-600 text-white"} flex items-center justify-center`}
                    onClick={handleConnectGoogle}
                    disabled={isConnectingGoogle}
                  >
                    {isConnectingGoogle ? (
                      <>
                        <FaSyncAlt className="h-4 w-4 mr-2 animate-spin" />
                        Conectando...
                      </>
                    ) : (
                      <>
                        <FaGoogle className="h-4 w-4 mr-2" />
                        Conectar Google Calendar
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            <div className={`rounded-lg shadow-md overflow-hidden ${darkMode ? "bg-slate-800" : "bg-white"}`}>
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className={`text-xl font-semibold ${darkMode ? "text-white" : "text-slate-800"}`}>Categorias</h2>
              </div>
              <div className="p-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                      <span className={`text-sm ${darkMode ? "text-slate-300" : "text-slate-600"}`}>Finanças</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={true} className="sr-only peer" />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="h-3 w-3 rounded-full bg-purple-500"></div>
                      <span className={`text-sm ${darkMode ? "text-slate-300" : "text-slate-600"}`}>Coaching</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={true} className="sr-only peer" />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                      <span className={`text-sm ${darkMode ? "text-slate-300" : "text-slate-600"}`}>Viagens</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={true} className="sr-only peer" />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="h-3 w-3 rounded-full bg-amber-500"></div>
                      <span className={`text-sm ${darkMode ? "text-slate-300" : "text-slate-600"}`}>Educação</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={true} className="sr-only peer" />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-6">
            <div className={`rounded-lg shadow-md overflow-hidden ${darkMode ? "bg-slate-800" : "bg-white"}`}>
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-row items-center justify-between">
                <h2 className={`text-xl font-semibold ${darkMode ? "text-white" : "text-slate-800"}`}>Agenda</h2>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <button
                      className={`p-1 rounded-md ${darkMode ? "hover:bg-slate-700" : "hover:bg-slate-100"}`}
                      onClick={prevWeek}
                    >
                      <FaChevronLeft className={`h-4 w-4 ${darkMode ? "text-slate-300" : "text-slate-600"}`} />
                    </button>
                    <button
                      className={`p-1 rounded-md ${darkMode ? "hover:bg-slate-700" : "hover:bg-slate-100"}`}
                      onClick={nextWeek}
                    >
                      <FaChevronRight className={`h-4 w-4 ${darkMode ? "text-slate-300" : "text-slate-600"}`} />
                    </button>
                  </div>
                  <select
                    value={view}
                    onChange={(e) => setView(e.target.value)}
                    className={`px-3 py-1 rounded-md text-sm ${
                      darkMode ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-gray-300 text-slate-800"
                    } border`}
                  >
                    <option value="day">Dia</option>
                    <option value="week">Semana</option>
                    <option value="month">Mês</option>
                  </select>
                  <button
                    className={`px-3 py-1 rounded-md text-sm flex items-center ${
                      darkMode ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-blue-500 hover:bg-blue-600 text-white"
                    }`}
                    onClick={() => setShowModal(true)}
                  >
                    <FaPlus className="h-3 w-3 mr-1" />
                    Novo Evento
                  </button>
                </div>
              </div>
              <div className="p-4">
                {view === "week" && (
                  <div className="grid grid-cols-7 gap-2">
                    {currentWeek.map((day) => (
                      <div key={day.toString()} className="space-y-1">
                        <div
                          className={`text-center p-2 rounded-md ${
                            isSameDay(day, new Date())
                              ? darkMode
                                ? "bg-blue-900/30 text-blue-300"
                                : "bg-blue-100 text-blue-800"
                              : ""
                          }`}
                        >
                          <div className={`text-xs uppercase ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                            {format(day, "EEE", { locale: pt })}
                          </div>
                          <div className={`text-lg font-semibold ${darkMode ? "text-white" : "text-slate-800"}`}>
                            {format(day, "d")}
                          </div>
                        </div>
                        <div className="space-y-1 h-[calc(100vh-350px)] overflow-auto">
                          {eventsForDay(day).map((event) => (
                            <div
                              key={event.id}
                              className={`p-2 rounded-md border text-xs ${getCategoryBgColor(event.category)} ${getCategoryBorderColor(event.category)} cursor-pointer hover:opacity-80`}
                              onClick={() => {
                                setModalEvent(event)
                                setShowModal(true)
                              }}
                            >
                              <div className={`font-medium ${darkMode ? "text-white" : "text-slate-800"}`}>
                                {event.title}
                              </div>
                              <div className="flex items-center mt-1">
                                <FaClock className="h-3 w-3 mr-1" />
                                <span>{event.time}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {view === "day" && (
                  <div className="space-y-4">
                    <div className="text-center">
                      <h3 className={`text-lg font-semibold ${darkMode ? "text-white" : "text-slate-800"}`}>
                        {format(date, "EEEE, d 'de' MMMM", { locale: pt })}
                      </h3>
                    </div>
                    <div className="space-y-2">
                      {eventsForDay(date).length > 0 ? (
                        eventsForDay(date).map((event) => (
                          <div
                            key={event.id}
                            className={`rounded-lg shadow-sm overflow-hidden ${darkMode ? "bg-slate-700" : "bg-white border border-slate-200"} cursor-pointer hover:opacity-90`}
                            onClick={() => {
                              setModalEvent(event)
                              setShowModal(true)
                            }}
                          >
                            <div className="p-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <div className="flex items-center">
                                    <div
                                      className={`h-3 w-3 rounded-full ${getCategoryColor(event.category)} mr-2`}
                                    ></div>
                                    <h4 className={`font-medium ${darkMode ? "text-white" : "text-slate-800"}`}>
                                      {event.title}
                                    </h4>
                                  </div>
                                  <div className="flex items-center mt-2 text-sm text-muted-foreground">
                                    <FaClock className="h-4 w-4 mr-1" />
                                    <span>{event.time}</span>
                                  </div>
                                  <p className={`mt-2 text-sm ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                                    {event.description}
                                  </p>
                                  <div className={`mt-2 text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                                    Local: {event.location}
                                  </div>
                                </div>
                                <button
                                  className={`p-1 rounded-md ${darkMode ? "hover:bg-slate-600" : "hover:bg-slate-100"}`}
                                >
                                  <FaEllipsisH
                                    className={`h-4 w-4 ${darkMode ? "text-slate-300" : "text-slate-600"}`}
                                  />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-12">
                          <p className={`${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                            Nenhum evento para este dia
                          </p>
                          <button
                            className={`mt-4 px-4 py-2 rounded-md ${darkMode ? "bg-slate-700 hover:bg-slate-600 text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-800"} flex items-center mx-auto`}
                            onClick={() => setShowModal(true)}
                          >
                            <FaPlus className="h-3 w-3 mr-2" />
                            Adicionar Evento
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {view === "month" && (
                  <div className="text-center py-12">
                    <p className={`${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                      Visualização mensal em desenvolvimento
                    </p>
                    <button
                      className={`mt-4 px-4 py-2 rounded-md ${darkMode ? "bg-slate-700 hover:bg-slate-600 text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-800"}`}
                      onClick={() => setView("week")}
                    >
                      Voltar para Visualização Semanal
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className={`rounded-lg shadow-md overflow-hidden ${darkMode ? "bg-slate-800" : "bg-white"}`}>
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className={`text-xl font-semibold ${darkMode ? "text-white" : "text-slate-800"}`}>
                  Próximos Eventos
                </h2>
                <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                  Eventos agendados para os próximos dias
                </p>
              </div>
              <div className="p-4">
                <div className="space-y-4">
                  {events
                    .filter((event) => new Date(event.date) >= new Date())
                    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                    .slice(0, 3)
                    .map((event) => (
                      <div key={event.id} className="flex items-start space-x-4">
                        <div
                          className={`w-12 h-12 rounded-md flex items-center justify-center ${getCategoryBgColor(event.category)} ${getCategoryBorderColor(event.category)} border`}
                        >
                          <span className={`text-lg font-bold ${getCategoryTextColor(event.category)}`}>
                            {format(parseISO(event.date), "dd")}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h4 className={`font-medium ${darkMode ? "text-white" : "text-slate-800"}`}>{event.title}</h4>
                          <div
                            className={`flex items-center mt-1 text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}
                          >
                            <FaClock className="h-3 w-3 mr-1" />
                            <span>{event.time}</span>
                            <span className="mx-2">•</span>
                            <span>{format(parseISO(event.date), "EEEE, d 'de' MMMM", { locale: pt })}</span>
                          </div>
                        </div>
                        <span
                          className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${getCategoryBgColor(event.category)} ${getCategoryTextColor(event.category)}`}
                        >
                          {event.category === "finance" && "Finanças"}
                          {event.category === "coaching" && "Coaching"}
                          {event.category === "travel" && "Viagens"}
                          {event.category === "education" && "Educação"}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  className={`w-full py-2 px-4 rounded-md ${darkMode ? "bg-slate-700 hover:bg-slate-600 text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-800"}`}
                >
                  Ver Todos os Eventos
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Event Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div
            className={`relative rounded-lg shadow-xl max-w-md w-full ${darkMode ? "bg-slate-800 text-white" : "bg-white text-slate-800"}`}
          >
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-bold">{modalEvent ? "Editar Evento" : "Adicionar Novo Evento"}</h2>
              <button
                onClick={() => {
                  setShowModal(false)
                  setModalEvent(null)
                }}
                className={`p-1 rounded-full ${darkMode ? "hover:bg-slate-700" : "hover:bg-slate-100"}`}
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
            <div className="p-4">
              <div className="grid gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                    Título
                  </label>
                  <input
                    type="text"
                    placeholder="Título do evento"
                    defaultValue={modalEvent?.title || ""}
                    className={`w-full px-3 py-2 rounded-md border ${darkMode ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-gray-300"}`}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      className={`block text-sm font-medium mb-1 ${darkMode ? "text-slate-300" : "text-slate-700"}`}
                    >
                      Data
                    </label>
                    <button
                      className={`w-full flex justify-start items-center px-3 py-2 rounded-md border ${darkMode ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-gray-300"}`}
                    >
                      <FaCalendarAlt className="mr-2 h-4 w-4" />
                      {format(modalEvent ? parseISO(modalEvent.date) : date, "dd/MM/yyyy")}
                    </button>
                  </div>
                  <div>
                    <label
                      className={`block text-sm font-medium mb-1 ${darkMode ? "text-slate-300" : "text-slate-700"}`}
                    >
                      Horário
                    </label>
                    <input
                      type="text"
                      placeholder="14:00 - 15:00"
                      defaultValue={modalEvent?.time || ""}
                      className={`w-full px-3 py-2 rounded-md border ${darkMode ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-gray-300"}`}
                    />
                  </div>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                    Categoria
                  </label>
                  <select
                    defaultValue={modalEvent?.category || ""}
                    className={`w-full px-3 py-2 rounded-md border ${darkMode ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-gray-300"}`}
                  >
                    <option value="">Selecione uma categoria</option>
                    <option value="finance">Finanças</option>
                    <option value="coaching">Coaching</option>
                    <option value="travel">Viagens</option>
                    <option value="education">Educação</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                    Local
                  </label>
                  <input
                    type="text"
                    placeholder="Local ou link da reunião"
                    defaultValue={modalEvent?.location || ""}
                    className={`w-full px-3 py-2 rounded-md border ${darkMode ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-gray-300"}`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                    Descrição
                  </label>
                  <textarea
                    placeholder="Detalhes do evento"
                    defaultValue={modalEvent?.description || ""}
                    className={`w-full px-3 py-2 rounded-md border ${darkMode ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-gray-300"} min-h-[100px]`}
                  ></textarea>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-2">
              <button
                className={`px-4 py-2 rounded-md ${darkMode ? "bg-slate-700 hover:bg-slate-600 text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-800"}`}
                onClick={() => {
                  setShowModal(false)
                  setModalEvent(null)
                }}
              >
                Cancelar
              </button>
              <button
                className={`px-4 py-2 rounded-md ${darkMode ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-blue-500 hover:bg-blue-600 text-white"}`}
                onClick={() => {
                  setShowModal(false)
                  setModalEvent(null)
                }}
              >
                {modalEvent ? "Atualizar" : "Salvar"} Evento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

