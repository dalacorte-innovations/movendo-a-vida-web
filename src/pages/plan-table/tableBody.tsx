import React, { Dispatch, SetStateAction } from 'react';
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
    
    const handleEditClick = (id: number, date: string) => {
        setEditingCell({ id, date });
    };

    const handleChange = (e, id: number, date: string) => {
        const value = e.target.value;

        if (date === "name") {
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
            return;
        }

        if (category === "estudos" || category === "custos" || category === "receitas") {
            setupProfitLossCategoryData();
        }
        setData((prev) => {
            const updatedData = { ...prev };
            updatedData[category][id].values[date] = value ? value : 0;
            let total = 0
            uniqueDates.forEach((date) => {
                total += parseFloat(updatedData[category][id].values[date])
            })
            updatedData[category][id].firstMeta = total
            return updatedData;
        });
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

    const getUniqueDateSubtotal = (date: string) => {
        let subtotal = 0;
        Object.keys(data[category] || {}).forEach((id) => {
            if (data[category]?.[id]?.values?.[date]) {
                subtotal += parseFloat(data[category]?.[id]?.values?.[date]);
            }
        });
        return subtotal;
    };

    if (!data[category]) {
        console.warn(`Category "${category}" does not exist in data.`);
        return null;
    }

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
                                    ? data[category]?.[id]?.name.length >= 12 ?
                                            `${data[category][id].name.slice(0, 15)}...`
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
                                    onChange={(e) => handleChange(e, parseInt(id), date)}
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
                                formatValue(getUniqueDateSubtotal(date)).length > 21 ?
                                    `${formatValue(getUniqueDateSubtotal(date)).slice(0, 21)}...`
                                    : formatValue(getUniqueDateSubtotal(date))
                            }
                        </td>
                    ))}
                </tr>
            )}
        </tbody>
    );
};

export default TableBody;
