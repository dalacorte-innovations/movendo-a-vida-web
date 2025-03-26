import React from "react"
import { type Dispatch, type SetStateAction, useEffect, useMemo, useCallback } from "react"
import type { OrganizedData } from "../../types/life-plan/lifePlan"
import { toast } from "react-toastify"
import { IoAdd, IoTrashBin, IoCheckmarkCircleOutline } from "react-icons/io5"

interface TableBodyProps {
  data: OrganizedData
  setData: Dispatch<SetStateAction<OrganizedData>>
  category: string
  darkMode: boolean
  uniqueDates: string[]
  formatValue: (value: any) => string
  editingCell: { id: number; date: string } | null
  setEditingCell: Dispatch<SetStateAction<{ id: number; date: string } | null>>
  setDataHasBeenAltered: Dispatch<SetStateAction<boolean>>
  getNewIndex: () => number
  setupProfitLossCategoryData: () => void
}

const TableBody: React.FC<TableBodyProps> = ({
  data,
  setData,
  category,
  darkMode,
  uniqueDates,
  formatValue,
  editingCell,
  setEditingCell,
  setDataHasBeenAltered,
  getNewIndex,
  setupProfitLossCategoryData,
}) => {
  const EDIT_BLOCKED_CATEGORIES = ["lucroPrejuizo"]

  const categories = [
    "custos",
    "empresas",
    "estudos",
    "intercambio",
    "investimentos",
    "lucroPrejuizo",
    "pessoais",
    "realizacoes",
    "receitas",
  ]

  const getUniqueDateSubtotal = useCallback(
    (date: string, customCategory?: string) => {
      let subtotal = 0
      if (!customCategory) {
        customCategory = category
      }
      if (customCategory === "investimentos") {
        Object.keys(data[customCategory] || {})
          .slice(1)
          .forEach((id) => {
            if (data[customCategory]?.[id]?.values?.[date]) {
              subtotal += Number.parseFloat(data[customCategory]?.[id]?.values?.[date])
            }
          })
      } else {
        Object.keys(data[customCategory] || {}).forEach((id) => {
          if (data[customCategory]?.[id]?.values?.[date]) {
            subtotal += Number.parseFloat(data[customCategory]?.[id]?.values?.[date])
          }
        })
      }
      return subtotal
    },
    [data, category],
  )

  const subtotals = useMemo(() => {
    return categories.reduce(
      (acc, category) => {
        acc[category] = uniqueDates.reduce(
          (dateAcc, date) => {
            dateAcc[date] = getUniqueDateSubtotal(date, category)
            return dateAcc
          },
          {} as Record<string, number>,
        )
        return acc
      },
      {} as Record<string, Record<string, number>>,
    )
  }, [data, uniqueDates, getUniqueDateSubtotal])

  const handleEditClick = useCallback(
    (id: number, date: string) => {
      if (EDIT_BLOCKED_CATEGORIES.includes(category)) return
      if (category === "investimentos" && id === 0 && date !== uniqueDates[0]) {
        return
      }
      setEditingCell({ id, date })
    },
    [category, uniqueDates, setEditingCell],
  )

  const handleInvestmentChange = useCallback(
    (e, id: number, date: string) => {
      const value = e.target.value
      const subtotal = getUniqueDateSubtotal(date) - Number.parseFloat(data["investimentos"][id].values[date])
      const maximum = Number.parseFloat(data["investimentos"][0].values[date])
      if (Number.parseFloat(value) + subtotal > maximum) {
        toast.error(
          `A soma dos valores desta coluna não deve ultrapassar ${formatValue(Number.parseInt(data["investimentos"][0].values[date]))}`,
        )
        return
      }
      handleChange(e, id, date)
    },
    [data, getUniqueDateSubtotal, formatValue],
  )

  const handleChange = useCallback(
    (e, id: number, date: string) => {
      const value = e.target.value

      if (date === "name") {
        if (category === "investimentos" && data[category][id]?.name === "Reserva Inicial") {
          return
        }

        let nameOccurrences = 0
        Object.keys(data[category] || {}).forEach((key) => {
          if (data[category][key]?.name === value) {
            nameOccurrences++
          }
        })

        setData((prev) => {
          const updatedData = { ...prev }
          updatedData[category][id].name = value
          return updatedData
        })
        setDataHasBeenAltered(true)
        return
      }

      if (category === "estudos" || category === "custos" || category === "receitas") {
        setupProfitLossCategoryData()
      }
      setData((prev) => {
        const updatedData = { ...prev }
        updatedData[category][id].values[date] = value ? value : 0
        let total = 0
        if (category === "investimentos") {
          total = Number.parseFloat(updatedData[category][id].values[uniqueDates[uniqueDates.length - 1]])
        } else {
          uniqueDates.forEach((date) => {
            total += Number.parseFloat(updatedData[category][id].values[date])
          })
        }
        updatedData[category][id].firstMeta = total
        return updatedData
      })
      setDataHasBeenAltered(true)
    },
    [data, category, uniqueDates, setData, setDataHasBeenAltered, setupProfitLossCategoryData],
  )

  const handleBlur = useCallback(() => {
    setEditingCell(null)
  }, [setEditingCell])

  const handleAddItem = useCallback(
    (category: string) => {
      const newIndex = getNewIndex()
      setData((prev) => ({
        ...prev,
        [category]: {
          ...prev[category],
          [newIndex]: { name: "", values: {}, firstMeta: 0 },
        },
      }))
      setDataHasBeenAltered(true)

      // Show a success toast
      toast.success("Item adicionado com sucesso!")
    },
    [setData, setDataHasBeenAltered, getNewIndex],
  )

  const handleRemoveItem = useCallback(
    (id: number) => {
      setData((prev) => {
        const updatedData = { ...prev }
        delete updatedData[category][id]
        return updatedData
      })
      setDataHasBeenAltered(true)

      // Show a success toast
      toast.success("Item removido com sucesso!")
    },
    [category, setData, setDataHasBeenAltered],
  )

  useEffect(() => {
    if (data["lucroPrejuizo"]?.[0]?.values && data["investimentos"]?.[0]?.values) {
      const profitLossValues = data["lucroPrejuizo"][0].values
      const newReserveValues: number[] = []
      const totalReserveValue = 0

      uniqueDates.slice(1).forEach((date) => {
        const dateProfit = profitLossValues[date] || 0
        const previousDateReserve =
          newReserveValues[newReserveValues.length - 1] ||
          Number.parseFloat(data["investimentos"][0].values[uniqueDates[0]] || 0)
        const dateRealizations = subtotals["realizacoes"]?.[date] || 0
        const dateCompanyCosts = subtotals["empresas"]?.[date] || 0
        const datePersonalCosts = subtotals["pessoais"]?.[date] || 0
        const dateExchange = subtotals["intercambio"]?.[date] || 0
        const dateCosts = dateCompanyCosts + datePersonalCosts + dateExchange + dateRealizations

        if (date === uniqueDates[1]) {
          const firstRealization = subtotals["realizacoes"]?.[uniqueDates[0]] || 0
          const firstCompanyCost = subtotals["empresas"]?.[uniqueDates[0]] || 0
          const firstPersonalCost = subtotals["pessoais"]?.[uniqueDates[0]] || 0
          const firstExchange = subtotals["intercambio"]?.[uniqueDates[0]] || 0
          const firstDateCosts = firstCompanyCost + firstPersonalCost + firstExchange + firstRealization
          newReserveValues.push(previousDateReserve + Number.parseFloat(dateProfit) - firstDateCosts - dateCosts)
        } else {
          newReserveValues.push(previousDateReserve + Number.parseFloat(dateProfit) - dateCosts)
        }
      })

      const finalReserveValues = {}
      uniqueDates.slice(1).forEach((date) => {
        finalReserveValues[date] = newReserveValues.shift()
      })

      setData((prev) => ({
        ...prev,
        investimentos: {
          ...prev["investimentos"],
          0: {
            ...prev["investimentos"][0],
            firstMeta: prev["investimentos"][0].values[uniqueDates[uniqueDates.length - 1]],
            values: {
              [uniqueDates[0]]: prev["investimentos"][0].values[uniqueDates[0]],
              ...finalReserveValues,
            },
          },
        },
      }))
    }
  }, [
    data["lucroPrejuizo"]?.[0]?.values,
    subtotals["realizacoes"],
    subtotals["empresas"],
    subtotals["pessoais"],
    subtotals["intercambio"],
    uniqueDates,
  ])

  // Get category color based on category name
  const getCategoryColor = (categoryName: string) => {
    const colorMap = {
      receitas: {
        bg: "bg-emerald-500",
        text: "text-emerald-500",
        bgLight: "bg-emerald-100",
        bgDark: "bg-emerald-900/30",
      },
      estudos: { bg: "bg-blue-500", text: "text-blue-500", bgLight: "bg-blue-100", bgDark: "bg-blue-900/30" },
      custos: { bg: "bg-red-500", text: "text-red-500", bgLight: "bg-red-100", bgDark: "bg-red-900/30" },
      lucroPrejuizo: {
        bg: "bg-purple-500",
        text: "text-purple-500",
        bgLight: "bg-purple-100",
        bgDark: "bg-purple-900/30",
      },
      investimentos: { bg: "bg-amber-500", text: "text-amber-500", bgLight: "bg-amber-100", bgDark: "bg-amber-900/30" },
      realizacoes: { bg: "bg-pink-500", text: "text-pink-500", bgLight: "bg-pink-100", bgDark: "bg-pink-900/30" },
      intercambio: {
        bg: "bg-indigo-500",
        text: "text-indigo-500",
        bgLight: "bg-indigo-100",
        bgDark: "bg-indigo-900/30",
      },
      empresas: { bg: "bg-cyan-500", text: "text-cyan-500", bgLight: "bg-cyan-100", bgDark: "bg-cyan-900/30" },
      pessoais: { bg: "bg-orange-500", text: "text-orange-500", bgLight: "bg-orange-100", bgDark: "bg-orange-900/30" },
    }

    return (
      colorMap[categoryName] || {
        bg: "bg-gray-500",
        text: "text-gray-500",
        bgLight: "bg-gray-100",
        bgDark: "bg-gray-900/30",
      }
    )
  }

  const categoryColor = getCategoryColor(category)

  return (
    <tbody>
      {Object.keys(data[category] || {}).map((id, index) => {
        const isLucroPrejuizo = category === "lucroPrejuizo"
        const isInvestimentosReserva = category === "investimentos" && Number.parseInt(id) === 0
        const isEditable = !isLucroPrejuizo && !isInvestimentosReserva
        const isEven = index % 2 === 0

        return (
          <tr
            key={index}
            className={`transition-colors ${
              darkMode ? (isEven ? "bg-slate-800/30" : "bg-transparent") : isEven ? "bg-slate-50/70" : "bg-white/80"
            } hover:${darkMode ? "bg-slate-700/50" : "bg-slate-100/80"}`}
          >
            <td className="py-2 px-2 flex items-center justify-center" style={{ width: "50px" }}>
              {isEditable && (
                <button
                  onClick={() => handleRemoveItem(Number.parseInt(id))}
                  className={`flex items-center justify-center w-7 h-7 rounded-full transition-all duration-300 ${
                    darkMode
                      ? `hover:bg-${categoryColor.bgDark} text-slate-400 hover:${categoryColor.text}`
                      : `hover:${categoryColor.bgLight} text-slate-500 hover:${categoryColor.text}`
                  }`}
                >
                  <IoTrashBin size={16} />
                </button>
              )}
            </td>

            <td
              className={`px-4 py-3 border ${
                darkMode ? "border-slate-600/50 text-white" : "border-indigo-100 text-slate-700"
              } ${isEditable ? "cursor-pointer hover:bg-opacity-70" : ""}`}
              style={{ width: "200px", maxWidth: "200px", minWidth: "200px", textAlign: "left" }}
              onClick={() => {
                if (!isEditable) return
                handleEditClick(Number.parseInt(id), "name")
              }}
            >
              {editingCell?.id === Number.parseInt(id) && editingCell?.date === "name" ? (
                <div className="relative">
                  <input
                    type="text"
                    value={data[category]?.[id]?.name || ""}
                    onChange={(e) => handleChange(e, Number.parseInt(id), "name")}
                    onBlur={handleBlur}
                    className={`w-full py-1 px-2 rounded outline-none transition-all ${
                      darkMode
                        ? `bg-slate-700 text-white focus:ring-2 focus:ring-${categoryColor.bg}`
                        : `bg-white text-slate-800 focus:ring-2 focus:ring-${categoryColor.bg}`
                    }`}
                    autoFocus
                  />
                  <div
                    className={`absolute bottom-0 left-0 h-0.5 ${categoryColor.bg} transition-all duration-300 w-full`}
                  />
                </div>
              ) : (
                <div className={`font-medium ${isLucroPrejuizo ? "font-semibold" : ""} truncate`}>
                  {data[category]?.[id]?.name || " "}
                </div>
              )}
            </td>

            {uniqueDates.map((date, dateIndex) => {
              const value = Number.parseFloat(data[category]?.[id]?.values?.[date] || 0)
              const isPositive = value >= 0
              const isNegative = value < 0

              return (
                <td
                  key={date}
                  className={`px-4 py-3 border ${darkMode ? "border-slate-600/50" : "border-indigo-100"} ${
                    isEditable ? "cursor-pointer hover:bg-opacity-70" : ""
                  } ${
                    isLucroPrejuizo
                      ? isPositive
                        ? darkMode
                          ? "text-emerald-400 font-semibold"
                          : "text-emerald-600 font-semibold"
                        : darkMode
                          ? "text-red-400 font-semibold"
                          : "text-red-600 font-semibold"
                      : darkMode
                        ? "text-white"
                        : "text-slate-700"
                  }`}
                  style={{ width: "180px", maxWidth: "180px", minWidth: "180px", textAlign: "center" }}
                  onClick={() => {
                    if (!isEditable || (isInvestimentosReserva && date !== uniqueDates[0])) return
                    handleEditClick(Number.parseInt(id), date)
                  }}
                >
                  {editingCell?.id === Number.parseInt(id) && editingCell?.date === date ? (
                    <div className="relative">
                      <input
                        type="text"
                        value={data[category]?.[id]?.values?.[date] || ""}
                        onChange={(e) => {
                          if (category === "investimentos" && Number.parseInt(id) !== 0) {
                            handleInvestmentChange(e, Number.parseInt(id), date)
                          } else {
                            handleChange(e, Number.parseInt(id), date)
                          }
                        }}
                        onBlur={handleBlur}
                        className={`w-full py-1 px-2 rounded outline-none transition-all text-center ${
                          darkMode
                            ? `bg-slate-700 text-white focus:ring-2 focus:ring-${categoryColor.bg}`
                            : `bg-white text-slate-800 focus:ring-2 focus:ring-${categoryColor.bg}`
                        }`}
                        autoFocus
                      />
                      <div
                        className={`absolute bottom-0 left-0 h-0.5 ${categoryColor.bg} transition-all duration-300 w-full`}
                      />
                    </div>
                  ) : (
                    <div className="truncate">{formatValue(data[category]?.[id]?.values?.[date] || 0)}</div>
                  )}
                </td>
              )
            })}

            <td
              className={`px-4 py-3 border ${
                darkMode ? "border-slate-600/50 text-white" : "border-indigo-100 text-slate-700"
              } text-center font-semibold`}
              style={{ width: "180px", maxWidth: "180px", minWidth: "180px" }}
            >
              <div className="truncate">{formatValue(data[category]?.[id]?.firstMeta || 0)}</div>
            </td>
          </tr>
        )
      })}

      {category !== "lucroPrejuizo" && (
        <tr>
          <td colSpan={uniqueDates.length + 3} className="pt-3 pb-1">
            <button
              className={`group flex items-center justify-center py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
                darkMode
                  ? `bg-${categoryColor.bgDark} ${categoryColor.text} hover:bg-opacity-70 border border-${categoryColor.bg}/30`
                  : `${categoryColor.bgLight} hover:bg-opacity-70 ${categoryColor.text} border border-${categoryColor.bg}/30`
              }`}
              onClick={() => handleAddItem(category)}
            >
              <IoAdd className="mr-1.5" size={18} />
              <span>Adicionar Item</span>
            </button>
          </td>
        </tr>
      )}

      <tr className={`${darkMode ? "bg-slate-700/50 text-white" : "bg-indigo-50/80 text-slate-800"}`}>
        <td className="py-2 px-2" style={{ width: "50px" }}>
          <div
            className={`flex items-center justify-center w-7 h-7 rounded-full ${
              darkMode ? categoryColor.bgDark : categoryColor.bgLight
            }`}
          >
            <IoCheckmarkCircleOutline className={categoryColor.text} size={16} />
          </div>
        </td>
        <td className={`px-4 py-3 border ${darkMode ? "border-slate-600/50" : "border-indigo-100"} font-semibold`}>
          Subtotal
        </td>
        {uniqueDates.map((date) => (
          <td
            key={date}
            className={`px-4 py-3 border text-center font-semibold ${
              darkMode ? "border-slate-600/50" : "border-indigo-100"
            } ${
              category === "lucroPrejuizo"
                ? subtotals[category][date] >= 0
                  ? darkMode
                    ? "text-emerald-400"
                    : "text-emerald-600"
                  : darkMode
                    ? "text-red-400"
                    : "text-red-600"
                : ""
            }`}
          >
            <div className="truncate">{formatValue(subtotals[category][date])}</div>
          </td>
        ))}
        <td
          className={`px-4 py-3 border text-center font-semibold ${
            darkMode ? "border-slate-600/50" : "border-indigo-100"
          }`}
        >
          {formatValue(Object.values(subtotals[category]).reduce((acc, val) => acc + val, 0))}
        </td>
      </tr>
    </tbody>
  )
}

export default TableBody