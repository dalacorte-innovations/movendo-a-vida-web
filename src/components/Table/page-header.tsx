import React from "react"

interface PageHeaderProps {
  darkMode: boolean
}

const PageHeader: React.FC<PageHeaderProps> = ({ darkMode }) => {
  return (
    <div
      className={`relative overflow-hidden rounded-xl shadow-md backdrop-blur-md mb-6 ${
        darkMode ? "bg-slate-800/70 border border-slate-700/50" : "bg-white/80 border border-indigo-100"
      }`}
    >
      <div className="relative p-5">
        <h2 className={`text-center text-2xl font-bold ${darkMode ? "text-white" : "text-slate-800"}`}>
          Movendo a Vida para mover o Futuro
        </h2>
        <div className={`w-24 h-1 mx-auto mt-3 rounded-full ${darkMode ? "bg-pink-500" : "bg-pink-400"}`}></div>
      </div>
    </div>
  )
}

export default PageHeader
