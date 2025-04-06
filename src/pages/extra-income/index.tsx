import { useState, useContext } from "react"
import { ThemeContext } from "../../utils/ThemeContext.jsx"
import { FaDollarSign, FaChartLine, FaBriefcase, FaBook, FaGlobe, FaClock, FaStar, FaUsers, FaArrowRight } from "react-icons/fa"

export default function ExtraIncomePage() {
  const { darkMode } = useContext(ThemeContext)
  const [activeTab, setActiveTab] = useState("opportunities")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [timeRange, setTimeRange] = useState(10)

  const opportunities = [
    {
      id: 1,
      title: "Freelancer de Design Gráfico",
      category: "freelance",
      difficulty: "medium",
      timeRequired: "10-20 horas/semana",
      potentialIncome: "R$ 2.000 - R$ 5.000/mês",
      description:
        "Crie designs para empresas e empreendedores que precisam de identidade visual, materiais de marketing e presença online.",
      skills: ["Adobe Photoshop", "Illustrator", "Design Thinking"],
      platforms: ["Workana", "99Designs", "Fiverr"],
      rating: 4.5,
    },
    {
      id: 2,
      title: "Consultor Financeiro Online",
      category: "consulting",
      difficulty: "high",
      timeRequired: "5-15 horas/semana",
      potentialIncome: "R$ 3.000 - R$ 8.000/mês",
      description:
        "Ofereça consultoria financeira personalizada para pessoas que desejam organizar suas finanças e investimentos.",
      skills: ["Conhecimento em Investimentos", "Planejamento Financeiro", "Comunicação"],
      platforms: ["Consultorias Independentes", "LinkedIn", "Hotmart"],
      rating: 4.8,
    },
    {
      id: 3,
      title: "Criador de Conteúdo Digital",
      category: "digital",
      difficulty: "medium",
      timeRequired: "8-15 horas/semana",
      potentialIncome: "R$ 1.500 - R$ 7.000/mês",
      description: "Produza conteúdo para blogs, redes sociais e plataformas de vídeo sobre temas que você domina.",
      skills: ["Redação", "SEO", "Edição de Vídeo"],
      platforms: ["YouTube", "Instagram", "Medium"],
      rating: 4.2,
    },
    {
      id: 4,
      title: "Professor de Idiomas Online",
      category: "teaching",
      difficulty: "low",
      timeRequired: "5-20 horas/semana",
      potentialIncome: "R$ 1.000 - R$ 4.000/mês",
      description: "Ensine idiomas que você domina para estudantes de todo o mundo através de plataformas online.",
      skills: ["Fluência em Idiomas", "Didática", "Paciência"],
      platforms: ["Preply", "iTalki", "Cambly"],
      rating: 4.6,
    },
    {
      id: 5,
      title: "Desenvolvimento de Aplicativos Mobile",
      category: "tech",
      difficulty: "high",
      timeRequired: "15-30 horas/semana",
      potentialIncome: "R$ 5.000 - R$ 15.000/mês",
      description: "Desenvolva aplicativos para smartphones sob demanda ou crie seus próprios apps para monetizar.",
      skills: ["Programação", "UI/UX Design", "Gestão de Projetos"],
      platforms: ["Upwork", "Toptal", "App Store", "Google Play"],
      rating: 4.7,
    },
    {
      id: 6,
      title: "Vendas de Produtos Artesanais",
      category: "ecommerce",
      difficulty: "low",
      timeRequired: "10-25 horas/semana",
      potentialIncome: "R$ 1.000 - R$ 5.000/mês",
      description: "Crie e venda produtos artesanais únicos através de marketplaces online e redes sociais.",
      skills: ["Habilidades Manuais", "Fotografia", "Marketing Digital"],
      platforms: ["Elo7", "Etsy", "Instagram"],
      rating: 4.0,
    },
  ]

  const courses = [
    {
      id: 1,
      title: "Marketing Digital para Iniciantes",
      instructor: "Ana Silva",
      duration: "8 horas",
      level: "Iniciante",
      price: "R$ 97,00",
      rating: 4.8,
      students: 1250,
      description: "Aprenda os fundamentos do marketing digital e como aplicá-los para gerar renda extra online.",
    },
    {
      id: 2,
      title: "Freelancer Profissional",
      instructor: "Carlos Mendes",
      duration: "12 horas",
      level: "Intermediário",
      price: "R$ 147,00",
      rating: 4.7,
      students: 980,
      description: "Descubra como se tornar um freelancer de sucesso e conquistar clientes internacionais.",
    },
    {
      id: 3,
      title: "Criação de Infoprodutos",
      instructor: "Juliana Costa",
      duration: "15 horas",
      level: "Intermediário",
      price: "R$ 197,00",
      rating: 4.9,
      students: 1560,
      description: "Aprenda a criar e vender cursos, e-books e outros produtos digitais do zero.",
    },
  ]

  const success_stories = [
    {
      id: 1,
      name: "Roberto Almeida",
      age: 34,
      profession: "Designer Gráfico",
      story:
        "Comecei a oferecer serviços de design como freelancer nas horas vagas e em 6 meses já estava ganhando mais do que no meu emprego formal. Hoje trabalho exclusivamente como freelancer e tenho clientes em todo o Brasil e exterior.",
      income_increase: "R$ 4.500/mês",
      time_investment: "15 horas/semana",
      photo: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 2,
      name: "Mariana Santos",
      age: 28,
      profession: "Professora",
      story:
        "Comecei a dar aulas de português para estrangeiros em plataformas online. No início era apenas para complementar minha renda, mas hoje já consigo ganhar o dobro do que ganhava como professora em escola tradicional, com muito mais flexibilidade.",
      income_increase: "R$ 3.200/mês",
      time_investment: "12 horas/semana",
      photo: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 3,
      name: "Felipe Oliveira",
      age: 42,
      profession: "Contador",
      story:
        "Criei um curso online sobre contabilidade para pequenos empreendedores. Nos primeiros 3 meses tive poucos alunos, mas com o tempo e algumas estratégias de marketing, consegui escalar e hoje tenho uma renda passiva significativa.",
      income_increase: "R$ 7.800/mês",
      time_investment: "5 horas/semana (manutenção)",
      photo: "/placeholder.svg?height=100&width=100",
    },
  ]

  const getDifficultyColor = (difficulty) => {
    const colors = {
      low: darkMode ? "text-green-400" : "text-green-600",
      medium: darkMode ? "text-amber-400" : "text-amber-600",
      high: darkMode ? "text-rose-400" : "text-rose-600",
    }
    return colors[difficulty] || colors.medium
  }

  const getDifficultyBgColor = (difficulty) => {
    const colors = {
      low: darkMode ? "bg-green-900/30" : "bg-green-100",
      medium: darkMode ? "bg-amber-900/30" : "bg-amber-100",
      high: darkMode ? "bg-rose-900/30" : "bg-rose-100",
    }
    return colors[difficulty] || colors.medium
  }

  const getCategoryIcon = (category) => {
    switch (category) {
      case "freelance":
        return <FaBriefcase className="h-4 w-4" />
      case "consulting":
        return <FaUsers className="h-4 w-4" />
      case "digital":
        return <FaGlobe className="h-4 w-4" />
      case "teaching":
        return <FaBook className="h-4 w-4" />
      case "tech":
        return <FaChartLine className="h-4 w-4" />
      case "ecommerce":
        return <FaDollarSign className="h-4 w-4" />
      default:
        return <FaStar className="h-4 w-4" />
    }
  }

  const getCategoryColor = (category) => {
    const colors = {
      freelance: darkMode ? "text-blue-400" : "text-blue-600",
      consulting: darkMode ? "text-purple-400" : "text-purple-600",
      digital: darkMode ? "text-indigo-400" : "text-indigo-600",
      teaching: darkMode ? "text-green-400" : "text-green-600",
      tech: darkMode ? "text-cyan-400" : "text-cyan-600",
      ecommerce: darkMode ? "text-amber-400" : "text-amber-600",
    }
    return colors[category] || colors.freelance
  }

  const getCategoryBgColor = (category) => {
    const colors = {
      freelance: darkMode ? "bg-blue-900/30" : "bg-blue-100",
      consulting: darkMode ? "bg-purple-900/30" : "bg-purple-100",
      digital: darkMode ? "bg-indigo-900/30" : "bg-indigo-100",
      teaching: darkMode ? "bg-green-900/30" : "bg-green-100",
      tech: darkMode ? "bg-cyan-900/30" : "bg-cyan-100",
      ecommerce: darkMode ? "bg-amber-900/30" : "bg-amber-100",
    }
    return colors[category] || colors.freelance
  }

  const filteredOpportunities = opportunities.filter((opp) => {
    const matchesCategory = selectedCategory === "all" || opp.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === "all" || opp.difficulty === selectedDifficulty
    const matchesSearch =
      opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.description.toLowerCase().includes(searchTerm.toLowerCase())
    const timeMatch = Number.parseInt(opp.timeRequired.split("-")[0]) <= timeRange

    return matchesCategory && matchesDifficulty && matchesSearch && timeMatch
  })

  return (
    <div className={`min-h-screen ${darkMode ? "bg-slate-900" : "bg-slate-50"}`}>
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-8">
          <h1 className={`text-3xl font-bold ${darkMode ? "text-white" : "text-slate-800"}`}>Renda Extra</h1>
          <p className={`mt-2 ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
            Descubra oportunidades para aumentar sua renda e alcançar seus objetivos financeiros mais rapidamente
          </p>
        </div>

        <div className="mb-6">
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              className={`py-2 px-4 font-medium ${
                activeTab === "opportunities"
                  ? `${darkMode ? "text-white border-b-2 border-blue-500" : "text-slate-800 border-b-2 border-blue-500"}`
                  : `${darkMode ? "text-slate-400" : "text-slate-600"}`
              }`}
              onClick={() => setActiveTab("opportunities")}
            >
              Oportunidades
            </button>
            <button
              className={`py-2 px-4 font-medium ${
                activeTab === "courses"
                  ? `${darkMode ? "text-white border-b-2 border-blue-500" : "text-slate-800 border-b-2 border-blue-500"}`
                  : `${darkMode ? "text-slate-400" : "text-slate-600"}`
              }`}
              onClick={() => setActiveTab("courses")}
            >
              Cursos
            </button>
            <button
              className={`py-2 px-4 font-medium ${
                activeTab === "success-stories"
                  ? `${darkMode ? "text-white border-b-2 border-blue-500" : "text-slate-800 border-b-2 border-blue-500"}`
                  : `${darkMode ? "text-slate-400" : "text-slate-600"}`
              }`}
              onClick={() => setActiveTab("success-stories")}
            >
              Histórias de Sucesso
            </button>
          </div>
        </div>

        {activeTab === "opportunities" && (
          <>
            <div className={`rounded-lg shadow-md overflow-hidden ${darkMode ? "bg-slate-800" : "bg-white"} mb-6`}>
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className={`text-xl font-semibold ${darkMode ? "text-white" : "text-slate-800"}`}>Encontre Oportunidades</h2>
                <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}>Filtre por categoria, dificuldade e tempo disponível</p>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="category" className={`block text-sm font-medium mb-1 ${darkMode ? "text-slate-300" : "text-slate-700"}`}>Categoria</label>
                    <select
                      id="category"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className={`w-full px-3 py-2 rounded-md border ${darkMode ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-gray-300"}`}
                    >
                      <option value="all">Todas as categorias</option>
                      <option value="freelance">Freelancer</option>
                      <option value="consulting">Consultoria</option>
                      <option value="digital">Conteúdo Digital</option>
                      <option value="teaching">Ensino</option>
                      <option value="tech">Tecnologia</option>
                      <option value="ecommerce">E-commerce</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="difficulty" className={`block text-sm font-medium mb-1 ${darkMode ? "text-slate-300" : "text-slate-700"}`}>Nível de Dificuldade</label>
                    <select
                      id="difficulty"
                      value={selectedDifficulty}
                      onChange={(e) => setSelectedDifficulty(e.target.value)}
                      className={`w-full px-3 py-2 rounded-md border ${darkMode ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-gray-300"}`}
                    >
                      <option value="all">Todos os níveis</option>
                      <option value="low">Baixa</option>
                      <option value="medium">Média</option>
                      <option value="high">Alta</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="search" className={`block text-sm font-medium mb-1 ${darkMode ? "text-slate-300" : "text-slate-700"}`}>Buscar</label>
                    <input
                      id="search"
                      type="text"
                      placeholder="Palavra-chave..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className={`w-full px-3 py-2 rounded-md border ${darkMode ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-gray-300"}`}
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                    Tempo Disponível (horas por semana): {timeRange}
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="40"
                    step="5"
                    value={timeRange}
                    onChange={(e) => setTimeRange(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOpportunities.length > 0 ? (
                filteredOpportunities.map((opportunity) => (
                  <div key={opportunity.id} className={`rounded-lg shadow-md overflow-hidden ${darkMode ? "bg-slate-800" : "bg-white"}`}>
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-2">
                          <div className={`p-2 rounded-full ${getCategoryBgColor(opportunity.category)}`}>
                            <div className={getCategoryColor(opportunity.category)}>
                              {getCategoryIcon(opportunity.category)}
                            </div>
                          </div>
                          <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${getCategoryBgColor(opportunity.category)} ${getCategoryColor(opportunity.category)}`}>
                            {opportunity.category === "freelance" && "Freelancer"}
                            {opportunity.category === "consulting" && "Consultoria"}
                            {opportunity.category === "digital" && "Conteúdo Digital"}
                            {opportunity.category === "teaching" && "Ensino"}
                            {opportunity.category === "tech" && "Tecnologia"}
                            {opportunity.category === "ecommerce" && "E-commerce"}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <FaStar className="h-4 w-4 text-amber-500 mr-1" />
                          <span className="text-sm">{opportunity.rating}</span>
                        </div>
                      </div>
                      <h3 className={`text-lg font-semibold mt-2 ${darkMode ? "text-white" : "text-slate-800"}`}>{opportunity.title}</h3>
                      <div className="flex items-center mt-1">
                        <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${getDifficultyBgColor(opportunity.difficulty)} ${getDifficultyColor(opportunity.difficulty)}`}>
                          {opportunity.difficulty === "low" && "Dificuldade Baixa"}
                          {opportunity.difficulty === "medium" && "Dificuldade Média"}
                          {opportunity.difficulty === "high" && "Dificuldade Alta"}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className={`text-sm mb-4 ${darkMode ? "text-slate-300" : "text-slate-600"}`}>{opportunity.description}</p>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-start">
                          <FaClock className={`h-4 w-4 mr-2 mt-0.5 ${darkMode ? "text-slate-400" : "text-slate-500"}`} />
                          <span className={darkMode ? "text-slate-300" : "text-slate-600"}>Tempo necessário: {opportunity.timeRequired}</span>
                        </div>
                        <div className="flex items-start">
                          <FaDollarSign className={`h-4 w-4 mr-2 mt-0.5 ${darkMode ? "text-slate-400" : "text-slate-500"}`} />
                          <span className={darkMode ? "text-slate-300" : "text-slate-600"}>Renda potencial: {opportunity.potentialIncome}</span>
                        </div>
                      </div>

                      <div className="mt-4">
                        <h4 className={`text-sm font-medium mb-1 ${darkMode ? "text-white" : "text-slate-800"}`}>Habilidades necessárias:</h4>
                        <div className="flex flex-wrap gap-1">
                          {opportunity.skills.map((skill, index) => (
                            <span key={index} className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${darkMode ? "bg-slate-700 text-slate-300" : "bg-slate-100 text-slate-700"}`}>
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4">
                        <h4 className={`text-sm font-medium mb-1 ${darkMode ? "text-white" : "text-slate-800"}`}>Plataformas recomendadas:</h4>
                        <div className="flex flex-wrap gap-1">
                          {opportunity.platforms.map((platform, index) => (
                            <span key={index} className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${darkMode ? "bg-slate-700 border border-slate-600 text-slate-300" : "bg-white border border-slate-200 text-slate-700"}`}>
                              {platform}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                      <button className={`w-full py-2 px-4 rounded-md ${darkMode ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-blue-500 hover:bg-blue-600 text-white"} flex items-center justify-center`}>
                        Saiba Mais
                        <FaArrowRight className="h-4 w-4 ml-2" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className={`text-lg ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                    Nenhuma oportunidade encontrada com os filtros atuais.
                  </p>
                  <button
                    className={`mt-4 py-2 px-4 rounded-md ${darkMode ? "bg-slate-700 hover:bg-slate-600 text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-800"}`}
                    onClick={() => {
                      setSelectedCategory("all")
                      setSelectedDifficulty("all")
                      setSearchTerm("")
                      setTimeRange(40)
                    }}
                  >
                    Limpar Filtros
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === "courses" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div key={course.id} className={`rounded-lg shadow-md overflow-hidden ${darkMode ? "bg-slate-800" : "bg-white"}`}>
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-start">
                      <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${darkMode ? "bg-blue-900/30 text-blue-400" : "bg-blue-100 text-blue-600"}`}>
                        {course.level}
                      </span>
                      <div className="flex items-center">
                        <FaStar className="h-4 w-4 text-amber-500 mr-1" />
                        <span className="text-sm">{course.rating}</span>
                      </div>
                    </div>
                    <h3 className={`text-lg font-semibold mt-2 ${darkMode ? "text-white" : "text-slate-800"}`}>{course.title}</h3>
                    <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}>Instrutor: {course.instructor}</p>
                  </div>
                  <div className="p-4">
                    <p className={`text-sm mb-4 ${darkMode ? "text-slate-300" : "text-slate-600"}`}>{course.description}</p>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-start">
                        <FaClock className={`h-4 w-4 mr-2 mt-0.5 ${darkMode ? "text-slate-400" : "text-slate-500"}`} />
                        <span className={darkMode ? "text-slate-300" : "text-slate-600"}>Duração: {course.duration}</span>
                      </div>
                      <div className="flex items-start">
                        <FaUsers className={`h-4 w-4 mr-2 mt-0.5 ${darkMode ? "text-slate-400" : "text-slate-500"}`} />
                        <span className={darkMode ? "text-slate-300" : "text-slate-600"}>{course.students} alunos</span>
                      </div>
                      <div className="flex items-start">
                        <FaDollarSign className={`h-4 w-4 mr-2 mt-0.5 ${darkMode ? "text-slate-400" : "text-slate-500"}`} />
                        <span className={darkMode ? "text-slate-300" : "text-slate-600"}>Investimento: {course.price}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <button className={`w-full py-2 px-4 rounded-md ${darkMode ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-blue-500 hover:bg-blue-600 text-white"} flex items-center justify-center`}>
                      Ver Detalhes do Curso
                      <FaArrowRight className="h-4 w-4 ml-2" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <div className={`rounded-lg shadow-md overflow-hidden ${darkMode ? "bg-slate-800" : "bg-white"}`}>
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <h2 className={`text-xl font-semibold ${darkMode ? "text-white" : "text-slate-800"}`}>Invista em Conhecimento</h2>
                  <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}>O conhecimento é o melhor investimento para aumentar sua renda</p>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex flex-col items-center text-center p-4">
                      <div className={`p-3 rounded-full ${darkMode ? "bg-green-900/30" : "bg-green-100"} mb-3`}>
                        <FaChartLine className={darkMode ? "text-green-400" : "text-green-600"} />
                      </div>
                      <h3 className={`font-medium mb-1 ${darkMode ? "text-white" : "text-slate-800"}`}>Retorno sobre Investimento</h3>
                      <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                        Os cursos selecionados têm alto ROI, ajudando você a recuperar o investimento rapidamente.
                      </p>
                    </div>
                    <div className="flex flex-col items-center text-center p-4">
                      <div className={`p-3 rounded-full ${darkMode ? "bg-purple-900/30" : "bg-purple-100"} mb-3`}>
                        <FaBook className={darkMode ? "text-purple-400" : "text-purple-600"} />
                      </div>
                      <h3 className={`font-medium mb-1 ${darkMode ? "text-white" : "text-slate-800"}`}>Conteúdo Prático</h3>
                      <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                        Foco em conhecimento aplicável que você pode usar imediatamente para gerar resultados.
                      </p>
                    </div>
                    <div className="flex flex-col items-center text-center p-4">
                      <div className={`p-3 rounded-full ${darkMode ? "bg-amber-900/30" : "bg-amber-100"} mb-3`}>
                        <FaUsers className={darkMode ? "text-amber-400" : "text-amber-600"} />
                      </div>
                      <h3 className={`font-medium mb-1 ${darkMode ? "text-white" : "text-slate-800"}`}>Comunidade de Apoio</h3>
                      <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                        Acesso a comunidades de alunos e mentores para networking e suporte contínuo.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <button className={`w-full py-2 px-4 rounded-md ${darkMode ? "bg-slate-700 hover:bg-slate-600 text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-800"}`}>
                    Ver Todos os Cursos Recomendados
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === "success-stories" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {success_stories.map((story) => (
                <div key={story.id} className={`rounded-lg shadow-md overflow-hidden ${darkMode ? "bg-slate-800" : "bg-white"}`}>
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-4">
                      <div className="rounded-full overflow-hidden w-16 h-16">
                        <img
                          src={story.photo || "/placeholder.svg"}
                          alt={story.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className={`text-lg font-semibold ${darkMode ? "text-white" : "text-slate-800"}`}>{story.name}</h3>
                        <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                          {story.age} anos, {story.profession}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="space-y-4">
                      <p className={`text-sm italic ${darkMode ? "text-slate-300" : "text-slate-600"}`}>"{story.story}"</p>

                      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between mb-1">
                          <span className={`text-sm font-medium ${darkMode ? "text-white" : "text-slate-800"}`}>Aumento de Renda:</span>
                          <span className="text-sm font-bold text-green-500">{story.income_increase}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className={`text-sm font-medium ${darkMode ? "text-white" : "text-slate-800"}`}>Investimento de Tempo:</span>
                          <span className={`text-sm ${darkMode ? "text-slate-300" : "text-slate-600"}`}>{story.time_investment}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <button className={`w-full py-2 px-4 rounded-md ${darkMode ? "bg-slate-700 hover:bg-slate-600 text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-800"}`}>
                      Ler História Completa
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <div className={`rounded-lg shadow-md overflow-hidden ${darkMode ? "bg-slate-800" : "bg-white"}`}>
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <h2 className={`text-xl font-semibold ${darkMode ? "text-white" : "text-slate-800"}`}>Compartilhe Sua História</h2>
                  <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}>Inspire outros usuários com sua jornada de sucesso</p>
                </div>
                <div className="p-4 text-center">
                  <p className={`mb-6 ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                    Você também tem uma história de sucesso sobre como aumentou sua renda? Compartilhe conosco e inspire
                    outros usuários da plataforma!
                  </p>
                  <button className={`py-2 px-4 rounded-md ${darkMode ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-blue-500 hover:bg-blue-600 text-white"}`}>
                    Enviar Minha História
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
