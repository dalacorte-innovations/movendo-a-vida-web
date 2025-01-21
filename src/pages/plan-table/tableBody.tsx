import React, { Dispatch, SetStateAction, useEffect, useMemo, useCallback } from 'react';
import { OrganizedData } from "../../types/life-plan/lifePlan";
import { toast } from 'react-toastify';
import { IoAdd, IoTrashBin } from 'react-icons/io5';

interface TableBodyProps {
    data: OrganizedData;
    setData: Dispatch<SetStateAction<OrganizedData>>;
    category: string;
    darkMode: boolean;
    uniqueDates: string[];
    formatValue: (value: any) => string;
    editingCell: { id: number; date: string } | null;
    setEditingCell: Dispatch<SetStateAction<{ id: number; date: string } | null>>;
    setDataHasBeenAltered: Dispatch<SetStateAction<boolean>>;
    getNewIndex: () => number;
    setupProfitLossCategoryData: () => void;
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
    setupProfitLossCategoryData
}) => {
    const EDIT_BLOCKED_CATEGORIES = ["lucroPrejuizo"];

    const categories = [
        "custos",
        "empresas",
        "estudos",
        "intercambio",
        "investimentos",
        "lucroPrejuizo",
        "pessoais",
        "realizacoes",
        "receitas"
    ];

    const getUniqueDateSubtotal = useCallback((date: string, customCategory?: string) => {
        let subtotal = 0;
        if (!customCategory) {
            customCategory = category;
        }
        if (customCategory === "investimentos") {
            Object.keys(data[customCategory] || {}).slice(1).forEach((id) => {
                if (data[customCategory]?.[id]?.values?.[date]) {
                    subtotal += parseFloat(data[customCategory]?.[id]?.values?.[date]);
                }
            });
        } else {
            Object.keys(data[customCategory] || {}).forEach((id) => {
                if (data[customCategory]?.[id]?.values?.[date]) {
                    subtotal += parseFloat(data[customCategory]?.[id]?.values?.[date]);
                }
            });
        }
        return subtotal;
    }, [data, category]);

    const subtotals = useMemo(() => {
        return categories.reduce((acc, category) => {
            acc[category] = uniqueDates.reduce((dateAcc, date) => {
                dateAcc[date] = getUniqueDateSubtotal(date, category);
                return dateAcc;
            }, {} as Record<string, number>);
            return acc;
        }, {} as Record<string, Record<string, number>>);
    }, [data, uniqueDates, getUniqueDateSubtotal]);

    const handleEditClick = useCallback((id: number, date: string) => {
        if (EDIT_BLOCKED_CATEGORIES.includes(category)) return;
        if (category === "investimentos" && id === 0 && date !== uniqueDates[0]) {
            return;
        }
        setEditingCell({ id, date });
    }, [category, uniqueDates, setEditingCell]);

    const handleInvestmentChange = useCallback((e, id: number, date: string) => {
        const value = e.target.value;
        const subtotal = getUniqueDateSubtotal(date) - parseFloat(data['investimentos'][id].values[date]);
        const maximum = parseFloat(data['investimentos'][0].values[date]);
        if ((parseFloat(value) + subtotal) > maximum) {
            toast.error(`A soma dos valores desta coluna não deve ultrapassar ${formatValue(parseInt(data['investimentos'][0].values[date]))}`);
            return;
        }
        handleChange(e, id, date);
    }, [data, getUniqueDateSubtotal, formatValue]);

    const handleChange = useCallback((e, id: number, date: string) => {
        const value = e.target.value;

        if (date === "name") {
            if (category === "investimentos" && data[category][id]?.name === "Reserva Inicial") {
                return;
            }

            let nameOccurrences = 0;
            Object.keys(data[category] || {}).forEach((key) => {
                if (data[category][key]?.name === value) {
                    nameOccurrences++;
                }
            });

            setData((prev) => {
                const updatedData = { ...prev };
                updatedData[category][id].name = value;
                return updatedData;
            });
            setDataHasBeenAltered(true);
            return;
        }

        if (category === "estudos" || category === "custos" || category === "receitas") {
            setupProfitLossCategoryData();
        }
        setData((prev) => {
            const updatedData = { ...prev };
            updatedData[category][id].values[date] = value ? value : 0;
            let total = 0;
            if (category === "investimentos") {
                total = parseFloat(updatedData[category][id].values[uniqueDates[uniqueDates.length - 1]]);
            } else {
                uniqueDates.forEach((date) => {
                    total += parseFloat(updatedData[category][id].values[date]);
                });
            }
            updatedData[category][id].firstMeta = total;
            return updatedData;
        });
        setDataHasBeenAltered(true);
    }, [data, category, uniqueDates, setData, setDataHasBeenAltered, setupProfitLossCategoryData]);

    const handleBlur = useCallback(() => {
        setEditingCell(null);
    }, [setEditingCell]);

    const handleAddItem = useCallback((category: string) => {
        let newIndex = getNewIndex();
        setData((prev) => ({
            ...prev,
            [category]: {
                ...prev[category],
                [newIndex]: { name: "", values: {}, firstMeta: 0 }
            }
        }));
        setDataHasBeenAltered(true);
    }, [setData, setDataHasBeenAltered, getNewIndex]);

    const handleRemoveItem = useCallback((id: number) => {
        setData((prev) => {
            const updatedData = { ...prev };
            delete updatedData[category][id];
            return updatedData;
        });
        setDataHasBeenAltered(true);
    }, [category, setData, setDataHasBeenAltered]);

    useEffect(() => {
        if (data['lucroPrejuizo']?.[0]?.values && data['investimentos']?.[0]?.values) {
            const profitLossValues = data['lucroPrejuizo'][0].values;
            const newReserveValues: number[] = [];
            let totalReserveValue = 0;
    
            uniqueDates.slice(1).forEach((date) => {
                const dateProfit = profitLossValues[date] || 0;
                const previousDateReserve = newReserveValues[newReserveValues.length - 1] || parseFloat(data['investimentos'][0].values[uniqueDates[0]] || 0);
                const dateRealizations = subtotals['realizacoes']?.[date] || 0;
                const dateCompanyCosts = subtotals['empresas']?.[date] || 0;
                const datePersonalCosts = subtotals['pessoais']?.[date] || 0;
                const dateExchange = subtotals['intercambio']?.[date] || 0;
                const dateCosts = dateCompanyCosts + datePersonalCosts + dateExchange + dateRealizations;
    
                if (date === uniqueDates[1]) {
                    const firstRealization = subtotals['realizacoes']?.[uniqueDates[0]] || 0;
                    const firstCompanyCost = subtotals['empresas']?.[uniqueDates[0]] || 0;
                    const firstPersonalCost = subtotals['pessoais']?.[uniqueDates[0]] || 0;
                    const firstExchange = subtotals['intercambio']?.[uniqueDates[0]] || 0;
                    const firstDateCosts = firstCompanyCost + firstPersonalCost + firstExchange + firstRealization;
                    newReserveValues.push(previousDateReserve + parseFloat(dateProfit) - firstDateCosts - dateCosts);
                } else {
                    newReserveValues.push(previousDateReserve + parseFloat(dateProfit) - dateCosts);
                }
            });
    
            const finalReserveValues = {};
            uniqueDates.slice(1).forEach((date) => {
                finalReserveValues[date] = newReserveValues.shift();
            });
    
            setData((prev) => ({
                ...prev,
                investimentos: {
                    ...prev['investimentos'],
                    0: {
                        ...prev['investimentos'][0],
                        firstMeta: prev['investimentos'][0].values[uniqueDates[uniqueDates.length - 1]],
                        values: {
                            [uniqueDates[0]]: prev['investimentos'][0].values[uniqueDates[0]],
                            ...finalReserveValues
                        }
                    }
                }
            }));
        }
    }, [
        data['lucroPrejuizo']?.[0]?.values,
        subtotals['realizacoes'],
        subtotals['empresas'],
        subtotals['pessoais'],
        subtotals['intercambio'],
        uniqueDates
    ]);

    return (
        <tbody>
            {Object.keys(data[category] || {}).map((id, index) => (
                <tr key={index} className={`${darkMode ? 'bg-transparent text-white' : 'bg-white text-gray-900'}`}>
                    <td
                        className="py-2 flex items-center"
                        style={{ width: '50px', justifyContent: 'start' }}
                        onClick={() => handleRemoveItem(parseInt(id))}
                    >
                        {category !== "lucroPrejuizo" && !(category === "investimentos" && parseInt(id) === 0) && (
                            <IoTrashBin size={20} className="text-red-500 cursor-pointer" />
                        )}
                    </td>

                    <td
                        className="px-4 py-2 border"
                        style={{ width: '200px', maxWidth: '200px', minWidth: '200px', textAlign: 'left' }}
                        onClick={() => {
                            if (EDIT_BLOCKED_CATEGORIES.includes(category)) return;
                            handleEditClick(parseInt(id), 'name');
                        }}
                    >
                        {editingCell?.id === parseInt(id) && editingCell?.date === "name" ? (
                            <input
                                type="text"
                                value={data[category]?.[id]?.name || ""}
                                onChange={(e) => handleChange(e, parseInt(id), 'name')}
                                onBlur={handleBlur}
                                className="w-full bg-transparent text-center"
                            />
                        ) : (
                            <div>
                                {data[category]?.[id]?.name
                                    ? data[category]?.[id]?.name.length > 21
                                        ? `${data[category][id].name.slice(0, 21)}...`
                                        : data[category]?.[id]?.name
                                    : " "}
                            </div>
                        )}
                    </td>

                    {uniqueDates.map(date => (
                        <td
                            key={date}
                            style={{ width: '200px', maxWidth: '200px', minWidth: '200px', textAlign: 'center', }}
                            className={`px-4 py-2 border ${
                                category === "lucroPrejuizo"
                                    ? parseFloat(data[category]?.[id]?.values?.[date] || 0) < 0
                                        ? "text-red-500 font-bold"
                                        : "text-green-500 font-bold"
                                    : ""
                            }`}
                            onClick={() => {
                                if (EDIT_BLOCKED_CATEGORIES.includes(category)) return;
                                handleEditClick(parseInt(id), date);
                            }}
                        >
                            {editingCell?.id === parseInt(id) && editingCell?.date === date ? (
                                <input
                                    type="text"
                                    value={data[category]?.[id]?.values?.[date] || ""}
                                    onChange={(e) => {
                                        if (category === "investimentos" && parseInt(id) !== 0) {
                                            handleInvestmentChange(e, parseInt(id), date);
                                        } else {
                                            handleChange(e, parseInt(id), date);
                                        }
                                    }}
                                    onBlur={handleBlur}
                                    className="w-full bg-transparent text-center"
                                />
                            ) : (
                                data[category]?.[id]?.values?.[date] !== undefined
                                    ? formatValue(data[category]?.[id]?.values?.[date]).length > 21
                                        ? `${formatValue(data[category]?.[id]?.values?.[date]).slice(0, 21)}...`
                                        : formatValue(data[category]?.[id]?.values?.[date])
                                    : 0
                            )}
                        </td>
                    ))}

                    {category !== "lucroPrejuizo" && (
                        <td
                            className="px-4 py-2 border text-center"
                            style={{ width: '200px', maxWidth: '200px', minWidth: '200px' }}
                            onClick={() => handleEditClick(parseInt(id), 'firstMeta')}
                        >
                            <span className={'font-bold'}>
                                {formatValue(data[category]?.[id]?.firstMeta || 0)}
                            </span>
                        </td>
                    )}
                </tr>
            ))}

            {category !== "lucroPrejuizo" && (
                <button
                    className="flex items-center justify-start text-green-600 hover:text-green-700 transition-colors my-2"
                    onClick={() => handleAddItem(category)}
                >
                    <IoAdd size={20} className="mr-1" />
                </button>
            )}

            {category !== "lucroPrejuizo" && (
                <tr className={`${darkMode ? 'bg-transparent text-white' : 'bg-white text-gray-900'}`}>
                    <th className="" style={{ width: '30px', backgroundColor: 'transparent' }}></th>
                    <td className="px-4 py-2 border text-center">Subtotal</td>
                    {uniqueDates.map(date => (
                        <td key={date} className="px-4 py-2 border text-center">
                            {formatValue(subtotals[category][date]).length > 21
                                ? `${formatValue(subtotals[category][date]).slice(0, 21)}...`
                                : formatValue(subtotals[category][date])}
                        </td>
                    ))}
                </tr>
            )}
        </tbody>
    );
};

export default TableBody;