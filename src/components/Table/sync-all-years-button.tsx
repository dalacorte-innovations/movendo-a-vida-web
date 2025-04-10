import React from "react"
import { IoGitCompare } from "react-icons/io5"
import { toast } from "react-toastify"

interface SyncAllYearsButtonProps {
  category: string
  id: number
  uniqueDates: string[]
  data: any
  setData: (data: any) => void
  setDataHasBeenAltered: (altered: boolean) => void
  darkMode: boolean
}

export const SyncAllYearsButton: React.FC<SyncAllYearsButtonProps> = ({
  category,
  id,
  uniqueDates,
  data,
  setData,
  setDataHasBeenAltered,
  darkMode,
}) => {
  // Skip for certain categories or the reserve initial row
  const isDisabled = 
    category === "lucroPrejuizo" || 
    (category === "investimentos" && id === 0);

  const handleSyncAllYears = () => {
    if (isDisabled) return;
    
    // Get the first date's value as reference
    const firstDate = uniqueDates[0];
    const referenceValue = data[category][id]?.values[firstDate] || 0;
    
    // Apply this value to all dates
    setData((prev) => {
      const updatedData = { ...prev };
      const updatedValues = { ...updatedData[category][id].values };
      
      uniqueDates.forEach((date) => {
        updatedValues[date] = referenceValue;
      });
      
      // Calculate new total
      let total = 0;
      if (category === "investimentos") {
        total = Number.parseFloat(updatedValues[uniqueDates[uniqueDates.length - 1]]);
      } else {
        uniqueDates.forEach((date) => {
          total += Number.parseFloat(updatedValues[date]);
        });
      }
      
      updatedData[category][id] = {
        ...updatedData[category][id],
        values: updatedValues,
        firstMeta: total,
      };
      
      return updatedData;
    });
    
    setDataHasBeenAltered(true);
    toast.success("Valores sincronizados para todos os anos!");
  };

  if (isDisabled) return null;

  return (
    <button
      onClick={handleSyncAllYears}
      title="Sincronizar valor para todos os anos"
      className={`flex items-center justify-center w-7 h-7 rounded-full transition-all duration-300 ${
        darkMode
          ? "hover:bg-indigo-900/30 text-slate-400 hover:text-indigo-400"
          : "hover:bg-indigo-100 text-slate-500 hover:text-indigo-600"
      }`}
    >
      <IoGitCompare size={16} />
    </button>
  );
};
