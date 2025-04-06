import { useState } from "react"
import { useContext } from "react"
import { ThemeContext } from "../../utils/ThemeContext.jsx"

export default function CoachRecommendationPage() {
  const { darkMode } = useContext(ThemeContext)
  const [searchTerm, setSearchTerm] = useState("")
  const [specialtyFilter, setSpecialtyFilter] = useState("all")

  const coaches = [
    {
      id: 1,
      name: "Ana Silva",
      specialty: "Finanças Pessoais",
      experience: "10 anos",
      description:
        "Especialista em planejamento financeiro e investimentos para pessoas físicas. Ajudo você a organizar suas finanças e alcançar independência financeira.",
      photo: "/placeholder.svg?height=200&width=200",
      contact: {
        email: "ana.silva@exemplo.com",
        phone: "(11) 98765-4321",
        instagram: "@anasilvacoach",
      },
      rating: 4.9,
      reviews: 127,
    },
    {
      id: 2,
      name: "Carlos Mendes",
      specialty: "Desenvolvimento Pessoal",
      experience: "8 anos",
      description:
        "Coach de desenvolvimento pessoal focado em produtividade e equilíbrio entre vida pessoal e profissional. Metodologia baseada em neurociência e psicologia positiva.",
      photo: "/placeholder.svg?height=200&width=200",
      contact: {
        email: "carlos.mendes@exemplo.com",
        phone: "(11) 91234-5678",
        instagram: "@carlosmendescoach",
      },
      rating: 4.7,
      reviews: 98,
    },
    {
      id: 3,
      name: "Juliana Costa",
      specialty: "Carreira",
      experience: "12 anos",
      description:
        "Especialista em transição e desenvolvimento de carreira. Ajudo profissionais a encontrarem seu propósito e alcançarem posições de destaque em suas áreas.",
      photo: "/placeholder.svg?height=200&width=200",
      contact: {
        email: "juliana.costa@exemplo.com",
        phone: "(11) 97654-3210",
        instagram: "@julianacostacarreira",
      },
      rating: 4.8,
      reviews: 156,
    },
    {
      id: 4,
      name: "Roberto Almeida",
      specialty: "Empreendedorismo",
      experience: "15 anos",
      description:
        "Coach para empreendedores iniciantes e experientes. Especialista em estratégias de crescimento, gestão de equipes e inovação em negócios.",
      photo: "/placeholder.svg?height=200&width=200",
      contact: {
        email: "roberto.almeida@exemplo.com",
        phone: "(11) 98877-6655",
        instagram: "@robertoalmeidacoach",
      },
      rating: 4.9,
      reviews: 203,
    },
  ]

  const filteredCoaches = coaches.filter((coach) => {
    const matchesSearch =
      coach.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coach.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coach.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesSpecialty = specialtyFilter === "all" || coach.specialty === specialtyFilter

    return matchesSearch && matchesSpecialty
  })

  const specialties = ["all", ...new Set(coaches.map((coach) => coach.specialty))]
  
  const [activeTab, setActiveTab] = useState({});

  return (
    <div className={`min-h-screen ${darkMode ? "bg-slate-900" : "bg-slate-50"}`}>
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-8">
          <h1 className={`text-3xl font-bold ${darkMode ? "text-white" : "text-slate-800"}`}>
            Indicação de um Coach
          </h1>
          <p className={`mt-2 ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
            Encontre o coach ideal para ajudar em sua jornada de desenvolvimento pessoal e profissional
          </p>
        </div>

        <div className="mb-8">
          <div className={`rounded-lg shadow-md overflow-hidden ${darkMode ? "bg-slate-800" : "bg-white"}`}>
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className={`text-xl font-semibold ${darkMode ? "text-white" : "text-slate-800"}`}>Encontre seu Coach</h2>
              <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}>Filtre por especialidade ou busque por palavras-chave</p>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="search" className={`block text-sm font-medium mb-1 ${darkMode ? "text-slate-300" : "text-slate-700"}`}>Buscar</label>
                  <input
                    id="search"
                    type="text"
                    placeholder="Nome, especialidade ou palavra-chave..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full px-3 py-2 rounded-md border ${darkMode ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-gray-300"}`}
                  />
                </div>
                <div>
                  <label htmlFor="specialty" className={`block text-sm font-medium mb-1 ${darkMode ? "text-slate-300" : "text-slate-700"}`}>Especialidade</label>
                  <select
                    id="specialty"
                    value={specialtyFilter}
                    onChange={(e) => setSpecialtyFilter(e.target.value)}
                    className={`w-full px-3 py-2 rounded-md border ${darkMode ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-gray-300"}`}
                  >
                    <option value="all">Todas as especialidades</option>
                    {specialties
                      .filter((s) => s !== "all")
                      .map((specialty) => (
                        <option key={specialty} value={specialty}>
                          {specialty}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCoaches.map((coach) => (
            <div key={coach.id} className={`rounded-lg shadow-md overflow-hidden ${darkMode ? "bg-slate-800" : "bg-white"}`}>
              <div className="aspect-video relative">
                <div className="absolute inset-0 flex items-center justify-center bg-slate-200 dark:bg-slate-700">
                  <div className="h-32 w-32 rounded-full overflow-hidden">
                    <img src={coach.photo || "/placeholder.svg"} alt={coach.name} className="object-cover w-full h-full" />
                  </div>
                </div>
              </div>
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className={`text-lg font-semibold ${darkMode ? "text-white" : "text-slate-800"}`}>{coach.name}</h3>
                    <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}>{coach.specialty}</p>
                  </div>
                  <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${darkMode ? "bg-slate-700 text-slate-300" : "bg-slate-100 text-slate-700"}`}>
                    {coach.experience}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <p className={`text-sm mb-4 ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                  {coach.description}
                </p>

                <div className="flex items-center mb-4">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(coach.rating)
                            ? "text-yellow-400"
                            : i < coach.rating
                              ? "text-yellow-400"
                              : "text-gray-300 dark:text-gray-600"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className={`ml-2 text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                    {coach.rating} ({coach.reviews} avaliações)
                  </span>
                </div>

                <div>
                  <div className="flex border-b border-gray-200 dark:border-gray-700">
                    <button
                      className={`py-2 px-4 text-sm font-medium ${
                        activeTab[coach.id] !== 'schedule' 
                          ? `${darkMode ? "text-white border-b-2 border-blue-500" : "text-slate-800 border-b-2 border-blue-500"}`
                          : `${darkMode ? "text-slate-400" : "text-slate-600"}`
                      }`}
                      onClick={() => setActiveTab({...activeTab, [coach.id]: 'contact'})}
                    >
                      Contato
                    </button>
                    <button
                      className={`py-2 px-4 text-sm font-medium ${
                        activeTab[coach.id] === 'schedule' 
                          ? `${darkMode ? "text-white border-b-2 border-blue-500" : "text-slate-800 border-b-2 border-blue-500"}`
                          : `${darkMode ? "text-slate-400" : "text-slate-600"}`
                      }`}
                      onClick={() => setActiveTab({...activeTab, [coach.id]: 'schedule'})}
                    >
                      Agendar
                    </button>
                  </div>
                  
                  <div className="mt-3">
                    {activeTab[coach.id] !== 'schedule' ? (
                      <div className="space-y-2">
                        <div className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-1 text-sm">
                          <span className={`font-medium ${darkMode ? "text-slate-300" : "text-slate-700"}`}>Email:</span>
                          <span className={darkMode ? "text-slate-400" : "text-slate-600"}>{coach.contact.email}</span>

                          <span className={`font-medium ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                            Telefone:
                          </span>
                          <span className={darkMode ? "text-slate-400" : "text-slate-600"}>{coach.contact.phone}</span>

                          <span className={`font-medium ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                            Instagram:
                          </span>
                          <span className={darkMode ? "text-slate-400" : "text-slate-600"}>
                            {coach.contact.instagram}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-sm text-center">Agende uma sessão de avaliação gratuita</p>
                        <button className={`w-full py-2 px-4 rounded-md text-white font-medium ${darkMode ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"}`}>
                          Agendar Sessão
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <button className={`w-full py-2 px-4 rounded-md font-medium ${darkMode ? "bg-slate-700 text-white hover:bg-slate-600" : "bg-slate-100 text-slate-800 hover:bg-slate-200"}`}>
                  Ver Perfil Completo
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredCoaches.length === 0 && (
          <div className="text-center py-12">
            <p className={`text-lg ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
              Nenhum coach encontrado com os filtros atuais.
            </p>
            <button
              className={`mt-4 py-2 px-4 rounded-md font-medium ${darkMode ? "bg-slate-700 text-white hover:bg-slate-600" : "bg-slate-100 text-slate-800 hover:bg-slate-200"}`}
              onClick={() => {
                setSearchTerm("")
                setSpecialtyFilter("all")
              }}
            >
              Limpar Filtros
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
