import React, { Dispatch, SetStateAction, useEffect } from 'react';
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

    const getUniqueDateSubtotal = (date: string, customCategory?: string) => {
        let subtotal = 0;
        if(!customCategory){
            customCategory = category
        }
        if(customCategory === "investimentos") {
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
    };

    const [subtotals, setSubtotals] = React.useState(() => 
        categories.reduce((acc, category) => {
            acc[category] = uniqueDates.reduce((dateAcc, date) => {
                dateAcc[date] = getUniqueDateSubtotal(date, category);
                return dateAcc;
            }, {} as Record<string, number>);
            return acc;
        }, {} as Record<string, Record<string, number>>)
    );

    const handleEditClick = (id: number, date: string) => {
        if (EDIT_BLOCKED_CATEGORIES.includes(category)) return;
        if (category === "investimentos" && id === 0 && date !== uniqueDates[0]) {
            return;
        }
        setEditingCell({ id, date });
    };
    
    const handleInvestmentChange = (e, id: number, date: string) => {
        const value = e.target.value
        const subtotal = getUniqueDateSubtotal(date) - parseFloat(data['investimentos'][id].values[date])
        const maximum = parseFloat(data['investimentos'][0].values[date])
        if((parseFloat(value) + subtotal) > maximum) {
            toast.error(`A soma dos valores desta coluna não deve ultrapassar ${formatValue(parseInt(data['investimentos'][0].values[date]))}`)
            return
        }
        handleChange(e, id, date)
    }

    const handleChange = (e, id: number, date: string) => {
        const value = e.target.value;

        if (date === "name") {
            //user cant edit row name "Reserva" from "Investimentos" category
            if (category === "investimentos" && data[category][id]?.name === "Reserva Inicial") {
                return;
            }

            let nameOccurrences = 0;
            Object.keys(data[category] || {}).forEach((key) => {
                if (data[category][key]?.name === value) {
                    nameOccurrences++;
                }
            });
            if (nameOccurrences > 0) {
                toast.error('Este Nome já está sendo utilizado nesta categoria');
                return;
            }

            setData((prev) => {
                const updatedData = { ...prev };
                updatedData[category][id].name = value;
                return updatedData;
            });
            setDataHasBeenAltered(true);
            setSubtotals((prev) => {
                const updatedSubtotals = { ...prev };
                updatedSubtotals[category][date] = getUniqueDateSubtotal(date, category);
                return updatedSubtotals;
            })
            return;
        }

        if (category === "estudos" || category === "custos" || category === "receitas") {
            setupProfitLossCategoryData();
        }
        setData((prev) => {
            const updatedData = { ...prev };
            updatedData[category][id].values[date] = value ? value : 0;
            let total = 0
            if(category === "investimentos") {
                total = parseFloat(updatedData[category][id].values[uniqueDates[uniqueDates.length - 1]])
            } else {
                uniqueDates.forEach((date) => {
                    total += parseFloat(updatedData[category][id].values[date])
                })
            }
            updatedData[category][id].firstMeta = total
            
            return updatedData;
        });
        setSubtotals((prev) => {
            const updatedSubtotals = { ...prev };
            updatedSubtotals[category][date] = getUniqueDateSubtotal(date, category);
            return updatedSubtotals;
        })
        setDataHasBeenAltered(true);
    };

    const handleBlur = () => {
        setEditingCell(null);
    };

    const handleAddItem = (category: string) => {
        let newIndex = getNewIndex();
        setData({
            ...data,
            [category]: {
                ...data[category],
                [newIndex]: { name: "", values: {}, firstMeta: 0 }
            }
        });
        setDataHasBeenAltered(true);
    };

    const handleRemoveItem = (id: number) => {
        setData((prev) => {
            const updatedData = { ...prev };
            delete updatedData[category][id];
            return updatedData;
        });
        setDataHasBeenAltered(true);
    };

    if (!data[category]) {
        console.warn(`Category "${category}" does not exist in data.`);
        return null;
    }

    useEffect(() => {
        if(data['lucroPrejuizo'][0]){
            const profitLossValues = data['lucroPrejuizo'][0].values;
            const newReserveValues: number[] = []
            let totalReserveValue = 0
            uniqueDates.slice(1).forEach((date) => {
                let dateProfit = profitLossValues[date]
                let previousDateReserve = newReserveValues[newReserveValues.length - 1] || parseFloat(data['investimentos'][0].values[uniqueDates[0]])
                let dateRealizations = subtotals['realizacoes'][date]
                let dateCompanyCosts = subtotals['empresas'][date]
                let datePersonalCosts = subtotals['pessoais'][date]
                let dateExchange = subtotals['intercambio'][date]
                const dateCosts = dateCompanyCosts + datePersonalCosts + dateExchange + dateRealizations
                if(date === uniqueDates[1]) {
                    let firstRealization = subtotals['realizacoes'][uniqueDates[0]]
                    let firstCompanyCost = subtotals['empresas'][uniqueDates[0]]
                    let firstPersonalCost = subtotals['pessoais'][uniqueDates[0]]
                    let firstExchange = subtotals['intercambio'][uniqueDates[0]]
                    const firstDateCosts = firstCompanyCost + firstPersonalCost + firstExchange + firstRealization 
                    newReserveValues.push( previousDateReserve + parseFloat(dateProfit) - firstDateCosts - dateCosts)
                } else {
                    newReserveValues.push(previousDateReserve + parseFloat(dateProfit) - dateCosts)
                }
            })
            const finalReserveValues = {}
            uniqueDates.slice(1).forEach((date) => {
                finalReserveValues[date] = newReserveValues.shift()
            })
            setData({
                ...data,
                investimentos: {
                    ...data['investimentos'],
                    0: {
                        ...data['investimentos'][0],
                        firstMeta: data['investimentos'][0].values[uniqueDates[uniqueDates.length - 1]],
                        values: {
                            [uniqueDates[0]]: data['investimentos'][0].values[uniqueDates[0]],
                            ...finalReserveValues
                        }
                    }
                }
            })
        }
    },[data['investimentos']?.[0]?.values?.[uniqueDates[0]], subtotals['realizacoes'], subtotals['empresas'], subtotals['pessoais'], subtotals['intercambio']])

    useEffect(() => {
        setSubtotals(
            categories.reduce((acc, category) => {
                acc[category] = uniqueDates.reduce((dateAcc, date) => {
                    dateAcc[date] = getUniqueDateSubtotal(date, category);
                    return dateAcc;
                }, {} as Record<string, number>);
                return acc;
            }, {} as Record<string, Record<string, number>>)
        )
    },[data])

    return (
        <tbody>
            {Object.keys(data[category] || {}).map((id, index) => (
                <tr key={index} className={`${darkMode ? 'bg-transparent text-white' : 'bg-white text-gray-900'}`}>
                    <div
                        className='py-2 flex justify-start items-center'
                        onClick={() => handleRemoveItem(parseInt(id))}
                        style={{width: category ==="lucroPrejuizo" ?  '20px' : ''}}
                    >
                        { category !== "lucroPrejuizo" &&
                            <IoTrashBin size={20} color='red' />
                        }
                    </div>
                    
                    <td
                        className="px-4 py-2 border"
                        style={{ width: '200px', maxWidth: '200px', minWidth: '200px' }}
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
                                    ? data[category]?.[id]?.name.length > 21 ?
                                            `${data[category][id].name.slice(0, 21)}...`
                                        :   data[category]?.[id]?.name
                                    : ""}
                            </div>
                        )}
                    </td>
                    {uniqueDates.map(date => (
                        <td
                            key={date}
                            style={{ width: '200px', maxWidth: '200px', minWidth: '200px' }}
                            className={`px-4 py-2 border text-center ${
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
                                        if(category === "investimentos" && parseInt(id) !== 0) {
                                            handleInvestmentChange(e, parseInt(id), date)
                                        } else {
                                            handleChange(e, parseInt(id), date)
                                        }
                                    }}
                                    onBlur={handleBlur}
                                    className="w-full bg-transparent text-center"
                                />
                            ) : (
                                data[category]?.[id]?.values?.[date] !== undefined
                                    ? formatValue(data[category]?.[id]?.values?.[date]).length > 21 ?
                                        `${formatValue(data[category]?.[id]?.values?.[date]).slice(0, 21)}...`
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
            {category !== "lucroPrejuizo" &&
                <button
                    className="flex items-center justify-center text-green-600 hover:text-green-700 transition-colors my-2"
                    onClick={() => handleAddItem(category)}
                >
                    <IoAdd size={20} />
                </button>
            }
            {category !== "lucroPrejuizo" && (
                <tr className={`${darkMode ? 'bg-transparent text-white' : 'bg-white text-gray-900'}`}>
                    <th className="" style={{ width: '30px', backgroundColor: 'transparent' }}></th>
                    <td className="px-4 py-2 border text-center">Subtotal</td>
                    {uniqueDates.map(date => (
                        <td key={date} className="px-4 py-2 border text-center">
                            {
                                formatValue(subtotals[category][date]).length > 21 ?
                                    `${formatValue(subtotals[category][date]).slice(0, 21)}...`
                                    : formatValue(subtotals[category][date])
                            }
                        </td>
                    ))}
                </tr>
            )}
        </tbody>
    );
};

export default TableBody;
