import { useContext } from "react"
import { ThemeContext } from "../../utils/ThemeContext.jsx"
import "./LoadingSpinner.css"

const LoadingSpinner = ({ isLoading }) => {
  const { darkMode } = useContext(ThemeContext)

  if (!isLoading) return null

  return (
    <div className="loading-spinner-overlay" id="loading-spinner-overlay">
      <div className={`loading-spinner ${darkMode ? "dark" : "light"}`} id="loading-spinner"></div>
    </div>
  )
}

export default LoadingSpinner
