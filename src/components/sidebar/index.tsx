"use client"

import { useState, useEffect, useContext } from "react"
import { Link, useLocation } from "react-router-dom"
import { FaSun, FaMoon } from "react-icons/fa"
import { MdFeedback } from "react-icons/md"
import { HiHome } from "react-icons/hi2"
import { MdExpandMore } from "react-icons/md"
import { FaLongArrowAltLeft } from "react-icons/fa"
import { HiBuildingStorefront } from "react-icons/hi2"
import { IoMdHelpCircle } from "react-icons/io"
import { BsFillGearFill } from "react-icons/bs"
import { IoExitSharp } from "react-icons/io5"
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { ThemeContext } from "../../utils/ThemeContext.jsx"
import { getPicture, getName, getEmail } from "../../utils/storage"
import { useTranslation } from "react-i18next"

const Sidebar = () => {
  const { t, i18n } = useTranslation()
  const [selected, setSelected] = useState(null)
  const [isExpanded, setIsExpanded] = useState(window.innerWidth >= 1024)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState("pt")
  const { darkMode, toggleTheme } = useContext(ThemeContext)
  const location = useLocation()

  const options = [
    { id: 1, name: t("Home"), icon: HiHome, url: "/" },
    { id: 2, name: t("Planos"), icon: HiBuildingStorefront, url: "/plans", hasDropdown: false },
    { id: 4, name: t("Feedback"), icon: MdFeedback, url: "/feedback" },
    { id: 5, name: t("Ajuda"), icon: IoMdHelpCircle, url: "/onboarding" },
    { id: 6, name: t("Configurações"), icon: BsFillGearFill, url: "/config" },
    { id: 7, name: t("Sair"), icon: IoExitSharp, url: "/logout" },
  ]

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded)
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenuOnOutsideClick = (event) => {
    if (event.target.id === "modal-background") {
      setIsMenuOpen(false)
    }
  }

  const handleButtonClick = (url) => {
    if (url === "#") {
      toast.info("Funcionalidade em desenvolvimento")
    }
  }

  useEffect(() => {
    const storedLanguage = localStorage.getItem("Language") || "pt"
    setSelectedLanguage(storedLanguage)
    i18n.changeLanguage(storedLanguage)
  }, [i18n])

  const handleLanguageChange = (language) => {
    i18n.changeLanguage(language)
    setSelectedLanguage(language)
    localStorage.setItem("Language", language)
  }

  useEffect(() => {
    if (window.innerWidth < 1024) {
      setIsExpanded(false)
    }
  }, [location])

  const userPicture = getPicture() || "https://robohash.org/dalacorte.png"
  const userName = getName() || "Nome desconhecido"
  const userEmail = getEmail() || "email.desconhecido@gmail.com"

  return (
    <>
      <div className="block md:hidden fixed top-4 left-4 z-50">
        <button onClick={toggleMenu} className={`text-2xl ${darkMode ? "text-pink-400" : "text-blue-600"}`}>
          {isMenuOpen ? "" : <AiOutlineMenu />}
        </button>
      </div>

      {isMenuOpen && (
        <div
          id="modal-background"
          className="fixed inset-0 bg-black bg-opacity-70 z-40"
          onClick={closeMenuOnOutsideClick}
        >
          <div
            className={`fixed top-0 left-0 h-full w-64 z-50 p-8 ${
              darkMode ? "bg-slate-800/90 border-r border-slate-700/50" : "bg-white/90 border-r border-blue-100"
            }`}
          >
            <div className="flex items-center justify-between mb-8">
              <h1
                className={`text-lg font-metropolis ${darkMode ? "text-white" : "text-slate-800"} transition-opacity duration-300 ease-in-out`}
              >
                Plano de Vida
              </h1>
              <button className={`text-2xl ${darkMode ? "text-pink-400" : "text-blue-600"}`} onClick={toggleMenu}>
                <AiOutlineClose />
              </button>
            </div>

            <nav className="flex flex-col space-y-4 font-metropolis text-sm">
              {options.map((option) => (
                <Link
                  to={option.url}
                  key={option.id}
                  className={`flex items-center p-2 rounded-md transition-all duration-300 ease-in-out ${
                    selected === option.id
                      ? darkMode
                        ? "bg-pink-900/50 text-pink-300"
                        : "bg-blue-100 text-blue-700"
                      : darkMode
                        ? "hover:bg-slate-700/70 text-white"
                        : "hover:bg-blue-50 text-slate-700"
                  }`}
                  onClick={() => {
                    setSelected(option.id)
                    handleButtonClick(option.url)
                    toggleMenu()
                  }}
                >
                  <option.icon
                    className={`text-lg ${
                      selected === option.id
                        ? darkMode
                          ? "text-pink-400"
                          : "text-blue-600"
                        : darkMode
                          ? "text-slate-300"
                          : "text-slate-600"
                    }`}
                  />
                  <span className="flex-grow ml-3 transition-all duration-300 ease-in-out">{option.name}</span>
                  {option.hasDropdown && <MdExpandMore className="text-lg transition-all duration-300 ease-in-out" />}
                </Link>
              ))}
            </nav>

            <hr className={`my-4 ${darkMode ? "border-slate-700" : "border-blue-100"}`} />

            <button
              className={`flex items-center justify-center p-2 rounded-md transition-all duration-300 ease-in-out w-full ${
                darkMode
                  ? "bg-pink-900/30 text-pink-300 hover:bg-pink-900/50 border border-pink-800/30"
                  : "bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200"
              }`}
              onClick={toggleTheme}
            >
              {darkMode ? (
                <FaSun className="text-lg mr-2 text-pink-400" />
              ) : (
                <FaMoon className="text-lg mr-2 text-blue-600" />
              )}
              <span className="transition-all duration-300 ease-in-out">{darkMode ? "Modo Blue" : "Modo Pink"}</span>
            </button>

            <hr className={`my-4 ${darkMode ? "border-slate-700" : "border-blue-100"}`} />

            <div className="flex items-center justify-between mt-4">
              <span className={`text-sm ${darkMode ? "text-white" : "text-slate-800"}`}>{t("Idioma")}:</span>
              <div className="flex space-x-2">
                <img
                  src="https://upload.wikimedia.org/wikipedia/en/a/a4/Flag_of_the_United_States.svg"
                  alt="English"
                  className={`w-6 h-6 cursor-pointer ${selectedLanguage === "en" && `border-2 ${darkMode ? "border-pink-500" : "border-blue-500"}`}`}
                  onClick={() => handleLanguageChange("en")}
                />
                <img
                  src="https://upload.wikimedia.org/wikipedia/en/9/9a/Flag_of_Spain.svg"
                  alt="Español"
                  className={`w-6 h-6 cursor-pointer ${selectedLanguage === "es" && `border-2 ${darkMode ? "border-pink-500" : "border-blue-500"}`}`}
                  onClick={() => handleLanguageChange("es")}
                />
                <img
                  src="https://upload.wikimedia.org/wikipedia/en/0/05/Flag_of_Brazil.svg"
                  alt="Português"
                  className={`w-6 h-6 cursor-pointer ${selectedLanguage === "pt" && `border-2 ${darkMode ? "border-pink-500" : "border-blue-500"}`}`}
                  onClick={() => handleLanguageChange("pt")}
                />
              </div>
            </div>

            <hr className={`my-4 ${darkMode ? "border-slate-700" : "border-blue-100"}`} />

            <div className="flex items-center mt-4">
              <div
                className={`relative w-12 h-12 rounded-full overflow-hidden border-2 ${
                  darkMode ? "border-pink-500/50" : "border-blue-500/50"
                }`}
              >
                <img className="w-full h-full object-cover" src={userPicture || "/placeholder.svg"} alt="User" />
              </div>
              <div className="ml-3">
                <h2 className={`text-sm font-medium ${darkMode ? "text-white" : "text-slate-800"}`}>{userName}</h2>
                <span className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>{userEmail}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div
        className={`hidden md:flex flex-col h-[100%] transition-all duration-300 ${
          isExpanded ? "w-64 p-8" : "w-16 p-4"
        } ${darkMode ? "bg-slate-800/90 border-r border-slate-700/50" : "bg-white/90 border-r border-blue-100"}`}
      >
        <div className="flex items-center justify-between mb-8">
          {isExpanded && (
            <h1
              className={`text-lg font-metropolis ${
                darkMode ? "text-white" : "text-slate-800"
              } transition-opacity duration-300 ease-in-out`}
            >
              Plano de Vida
            </h1>
          )}
          <button
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              darkMode
                ? "bg-pink-900/50 text-pink-300 hover:bg-pink-900/70"
                : "bg-blue-100 text-blue-700 hover:bg-blue-200"
            } ${!isExpanded && "hidden lg:flex"}`}
            onClick={toggleSidebar}
          >
            <FaLongArrowAltLeft
              className={`transition-transform duration-300 ease-in-out ${!isExpanded && "rotate-180"}`}
            />
          </button>
        </div>

        <nav className="flex flex-col space-y-2 font-metropolis text-sm">
          {options.slice(0, 4).map((option) => (
            <Link
              to={option.url}
              key={option.id}
              className={`flex items-center p-2 rounded-md transition-all duration-300 ease-in-out ${
                selected === option.id
                  ? darkMode
                    ? "bg-pink-900/50 text-pink-300"
                    : "bg-blue-100 text-blue-700"
                  : darkMode
                    ? "hover:bg-slate-700/70 text-white"
                    : "hover:bg-blue-50 text-slate-700"
              }`}
              onClick={() => {
                setSelected(option.id)
                handleButtonClick(option.url)
              }}
            >
              <option.icon
                className={`text-lg ${
                  selected === option.id
                    ? darkMode
                      ? "text-pink-400"
                      : "text-blue-600"
                    : darkMode
                      ? "text-slate-300"
                      : "text-slate-600"
                }`}
              />
              {isExpanded && (
                <span className="flex-grow ml-3 transition-all duration-300 ease-in-out">{option.name}</span>
              )}
              {option.hasDropdown && isExpanded && (
                <MdExpandMore className="text-lg transition-all duration-300 ease-in-out" />
              )}
            </Link>
          ))}
        </nav>

        <hr className={`my-4 ${darkMode ? "border-slate-700" : "border-blue-100"}`} />

        <nav className="flex flex-col space-y-2 font-metropolis text-sm">
          {options.slice(4).map((option) => (
            <Link
              to={option.url}
              key={option.id}
              className={`flex items-center p-2 rounded-md transition-all duration-300 ease-in-out ${
                selected === option.id
                  ? darkMode
                    ? "bg-pink-900/50 text-pink-300"
                    : "bg-blue-100 text-blue-700"
                  : darkMode
                    ? "hover:bg-slate-700/70 text-white"
                    : "hover:bg-blue-50 text-slate-700"
              }`}
              onClick={() => {
                setSelected(option.id)
                handleButtonClick(option.url)
              }}
            >
              <option.icon
                className={`text-lg ${
                  selected === option.id
                    ? darkMode
                      ? "text-pink-400"
                      : "text-blue-600"
                    : darkMode
                      ? "text-slate-300"
                      : "text-slate-600"
                }`}
              />
              {isExpanded && (
                <span className="flex-grow ml-3 transition-all duration-300 ease-in-out">{option.name}</span>
              )}
              {option.hasDropdown && isExpanded && (
                <MdExpandMore className="text-lg transition-all duration-300 ease-in-out" />
              )}
            </Link>
          ))}
        </nav>

        <hr className={`my-4 ${darkMode ? "border-slate-700" : "border-blue-100"}`} />

        <button
          className={`flex items-center justify-center p-2 rounded-md transition-all duration-300 ease-in-out ${
            darkMode
              ? "bg-pink-900/30 text-pink-300 hover:bg-pink-900/50 border border-pink-800/30"
              : "bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200"
          }`}
          onClick={toggleTheme}
        >
          {darkMode ? <FaSun className="text-lg text-pink-400" /> : <FaMoon className="text-lg text-blue-600" />}
          {isExpanded && (
            <span className="ml-2 transition-all duration-300 ease-in-out">
              {darkMode ? "Modo Claro" : "Modo Escuro"}
            </span>
          )}
        </button>

        <hr className={`my-4 ${darkMode ? "border-slate-700" : "border-blue-100"}`} />

        {isExpanded && (
          <div className="flex items-center justify-between mt-4">
            <span className={`text-sm ${darkMode ? "text-white" : "text-slate-800"}`}>{t("Idioma")}:</span>
            <div className="flex space-x-2">
              <img
                src="https://upload.wikimedia.org/wikipedia/en/a/a4/Flag_of_the_United_States.svg"
                alt="English"
                className={`w-6 h-6 cursor-pointer ${selectedLanguage === "en" && `border-2 ${darkMode ? "border-pink-500" : "border-blue-500"}`}`}
                onClick={() => handleLanguageChange("en")}
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/en/9/9a/Flag_of_Spain.svg"
                alt="Español"
                className={`w-6 h-6 cursor-pointer ${selectedLanguage === "es" && `border-2 ${darkMode ? "border-pink-500" : "border-blue-500"}`}`}
                onClick={() => handleLanguageChange("es")}
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/en/0/05/Flag_of_Brazil.svg"
                alt="Português"
                className={`w-6 h-6 cursor-pointer ${selectedLanguage === "pt" && `border-2 ${darkMode ? "border-pink-500" : "border-blue-500"}`}`}
                onClick={() => handleLanguageChange("pt")}
              />
            </div>
          </div>
        )}

        <div
          className={`mt-auto flex flex-col items-center ${isExpanded ? "mb-4" : "my-4"} transition-all duration-300 ease-in-out`}
        >
          <div
            className={`relative w-14 h-14 rounded-full overflow-hidden border-2 ${
              darkMode ? "border-pink-500/50" : "border-blue-500/50"
            }`}
          >
            <img className="w-full h-full object-cover" src={userPicture || "/placeholder.svg"} alt="User" />
          </div>
          {isExpanded && (
            <>
              <h2 className={`mt-2 text-sm font-medium ${darkMode ? "text-white" : "text-slate-800"}`}>{userName}</h2>
              <span className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>{userEmail}</span>
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default Sidebar