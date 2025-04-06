import { useState, useRef, useEffect } from "react"
import { useContext } from "react"
import { ThemeContext } from "../../utils/ThemeContext.jsx"
import { IoSend, IoRefresh } from "react-icons/io5"

export default function AIAssistantPage() {
  const { darkMode } = useContext(ThemeContext)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Olá! Sou sua assistente de IA personalizada para ajudar a mover sua vida e mudar o futuro. Como posso ajudar você hoje?",
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = {
      role: "user",
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        role: "assistant",
        content: getAIResponse(input),
      }
      setMessages((prev) => [...prev, aiResponse])
      setIsLoading(false)
    }, 1000)
  }

  const getAIResponse = (query) => {
    // This is a simple simulation - in a real app, you would call an actual AI API
    const responses = [
      "Entendo sua situação. Para mover sua vida nessa direção, recomendo começar estabelecendo metas pequenas e alcançáveis.",
      "Excelente pergunta! Para mudar seu futuro financeiro, considere criar um plano de economia e investimento consistente.",
      "Baseado no que você compartilhou, sugiro focar em desenvolver novas habilidades que complementem sua experiência atual.",
      "Para transformar esse desafio em oportunidade, tente observá-lo de uma perspectiva diferente e identificar os aprendizados possíveis.",
      "Sua jornada é única! Lembre-se que pequenas mudanças consistentes podem levar a grandes transformações ao longo do tempo.",
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  const resetChat = () => {
    setMessages([
      {
        role: "assistant",
        content:
          "Olá! Sou sua assistente de IA personalizada para ajudar a mover sua vida e mudar o futuro. Como posso ajudar você hoje?",
      },
    ])
  }

  return (
    <div className="flex flex-col h-screen max-h-screen overflow-hidden">
      <div className={`p-4 border-b ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
        <div className="max-w-4xl mx-auto">
          <h1 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-slate-800"}`}>
            Inteligência Artificial
          </h1>
          <p className={`${darkMode ? "text-slate-300" : "text-slate-600"}`}>
            Converse com nossa IA personalizada para ajudar a mover sua vida e mudar o futuro
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="max-w-4xl mx-auto h-full flex flex-col">
          <div className="flex justify-end p-2">
            <button 
              onClick={resetChat} 
              className={`flex items-center gap-1 px-3 py-1 rounded-md text-sm ${
                darkMode ? "bg-slate-700 hover:bg-slate-600 text-slate-200" : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
            >
              <IoRefresh className="mr-1" />
              Nova conversa
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className="flex items-start max-w-[80%]">
                    {message.role === "assistant" && (
                      <div className="h-8 w-8 mr-2 mt-1 rounded-full flex items-center justify-center bg-violet-100 dark:bg-violet-900">
                        <span className="text-sm font-semibold text-violet-700 dark:text-violet-300">
                          IA
                        </span>
                      </div>
                    )}

                    <div
                      className={`p-3 rounded-lg ${
                        message.role === "user"
                          ? darkMode
                            ? "bg-blue-600 text-white"
                            : "bg-blue-500 text-white"
                          : darkMode
                            ? "bg-slate-700 text-slate-200"
                            : "bg-slate-100 text-slate-800"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>

                    {message.role === "user" && (
                      <div className="h-8 w-8 ml-2 mt-1 rounded-full flex items-center justify-center bg-blue-100 dark:bg-blue-900">
                        <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                          EU
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-start max-w-[80%]">
                    <div className="h-8 w-8 mr-2 mt-1 rounded-full flex items-center justify-center bg-violet-100 dark:bg-violet-900">
                      <span className="text-sm font-semibold text-violet-700 dark:text-violet-300">
                        IA
                      </span>
                    </div>

                    <div className={`p-3 rounded-lg ${darkMode ? "bg-slate-700" : "bg-slate-100"}`}>
                      <div className="flex space-x-1">
                        <div
                          className={`w-2 h-2 rounded-full ${darkMode ? "bg-slate-500" : "bg-slate-400"} animate-bounce`}
                          style={{ animationDelay: "0ms" }}
                        ></div>
                        <div
                          className={`w-2 h-2 rounded-full ${darkMode ? "bg-slate-500" : "bg-slate-400"} animate-bounce`}
                          style={{ animationDelay: "150ms" }}
                        ></div>
                        <div
                          className={`w-2 h-2 rounded-full ${darkMode ? "bg-slate-500" : "bg-slate-400"} animate-bounce`}
                          style={{ animationDelay: "300ms" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className={`p-4 border-t ${darkMode ? "border-slate-700" : "border-slate-200"}`}>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Digite sua mensagem..."
                className={`flex-1 px-3 py-2 rounded-md border ${
                  darkMode 
                    ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400" 
                    : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
                }`}
                disabled={isLoading}
              />
              <button 
                type="submit" 
                disabled={isLoading || !input.trim()}
                className={`px-4 py-2 rounded-md text-white ${
                  isLoading || !input.trim() 
                    ? "bg-blue-400 cursor-not-allowed" 
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                <IoSend />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
