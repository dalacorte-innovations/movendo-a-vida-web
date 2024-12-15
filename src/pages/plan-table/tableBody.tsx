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
    getMetaStyle: (meta: string) => string;
    editingCell: { id: number; date: string } | null;
    setEditingCell: Dispatch<SetStateAction<{ id: number; date: string } | null>>;
    setDataHasBeenAltered: Dispatch<SetStateAction<boolean>>;
}
const categories = [
    "receitas",
    "estudos",
    "custos",
    "lucroPrejuizo",
    "investimentos",
    "realizacoes",
    "intercambio",
    "empresas"
]

const TableBody: React.FC<TableBodyProps> = ({
    data,
    setData,
    category,
    darkMode,
    uniqueDates,
    formatValue,
    getMetaStyle,
    editingCell,
    setEditingCell,
    setDataHasBeenAltered
}) => {

    const handleEditClick = (id: number, date: string) => {
        setEditingCell({ id, date });
    }

    const handleChange = (e, id: number, date: string) => {
        const value = e.target.value;

        if (date === "name") {
            let nameOccurrences = 0
            Object.keys(data[category]).forEach((key) => {
                if (data[category][key].name === value) {
                    nameOccurrences++;
                }
            })
            console.log(nameOccurrences)
            if(nameOccurrences > 0) {
                toast.error('Este Nome já está sendo utilizado nesta categoria')
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

        setData((prev) => {
            const updatedData = { ...prev };
            if (date === "firstMeta") {
            updatedData[category][id].firstMeta = value;
            } else {
            updatedData[category][id].values[date] = value;
            }
            return updatedData;
        });
        setDataHasBeenAltered(true);
    };

    const handleBlur = () => {
        setEditingCell(null); // Exit edit mode
    };

    const handleAddItem = (category: string) => {
        let newIndex = 0;
        categories.forEach(category => (
            newIndex += Object.keys(data[category]).length
        ))
        setData({
            ...data,
            [category]: {
                ...data[category],
                [newIndex]: { name: "", values: {}, firstMeta: 0 }
            }
        })
        setDataHasBeenAltered(true);
    };

    const handleRemoveItem = (id: number) => {
        setData((prev) => {
            const updatedData = { ...prev };
            delete updatedData[category][id];
            return updatedData;
        });
        setDataHasBeenAltered(true);
    }

    const getUniqueDateSubtotal = (date: string) => {
        let subtotal = 0;
        Object.keys(data[category]).forEach((id) => {
            if (data[category][id].values[date]) {
                subtotal += parseFloat(data[category][id].values[date]);
            }
        });
        return subtotal;
    }

    return (
        <tbody>
            {Object.keys(data[category]).map((id, index) => (
                <tr key={index} className={`${darkMode ? 'bg-transparent text-white' : 'bg-white text-gray-900'}`}>
                    <div
                        className='py-2 flex justify-start items-center'
                        onClick={() => handleRemoveItem(parseInt(id))}
                    >
                        <IoTrashBin size={20} color='red'/>
                    </div>
                    <td className="px-4 py-2 border" onClick={() => handleEditClick(parseInt(id), 'name')}>{
                        editingCell?.id === parseInt(id) && editingCell?.date === "name" ? (
                            <input
                                type="text"
                                value={data[category][id].name || ""}
                                onChange={(e) => handleChange(e, parseInt(id), 'name')}
                                onBlur={handleBlur}
                                className="w-full bg-transparent text-center"
                                style={{width: '100px'}}
                            />
                        ):(
                            data[category][id].name
                        )}
                    </td>
                    {uniqueDates.map(date => (
                        <td key={date} className="px-4 py-2 border text-center" onClick={() => handleEditClick(parseInt(id), date)}>
                            {editingCell?.id === parseInt(id) && editingCell?.date === date ? (
                                <input
                                    type="text"
                                    value={data[category][parseInt(id)].values[date] || ""}
                                    onChange={(e) => handleChange(e, parseInt(id), date)}
                                    onBlur={handleBlur}
                                    className="w-full bg-transparent text-center" style={{width: '60px'}}
                                />
                            ) : (
                                data[category][ parseInt(id)].values[date] ? formatValue(data[category][ parseInt(id)].values[date]) : 'N/A'
                            )}
                        </td>
                    ))}
                    <td className="px-4 py-2 border text-center" style={{width: '60px'}} onClick={() => handleEditClick(parseInt(id), 'firstMeta')}>
                        {editingCell?.id === parseInt(id) && editingCell?.date === "firstMeta" ? (
                            <input
                                type="text"
                                value={data[category][ parseInt(id)].firstMeta || ""}
                                onChange={(e) => handleChange(e, parseInt(id), "firstMeta")}
                                onBlur={handleBlur}
                                className="w-full bg-transparent text-center"
                            />
                        ) : (
                            <span className={getMetaStyle(data[category][parseInt(id)].firstMeta)}>{formatValue(data[category][parseInt(id)].firstMeta)}</span>
                        )}
                    </td>
                </tr>
            ))}
            <button
                className="flex items-center justify-center text-green-600 hover:text-green-700 transition-colors my-2"
                onClick={() => handleAddItem(category)}
            >
                <IoAdd size={20} />
            </button>
            
            <tr className={`${darkMode ? 'bg-transparent text-white' : 'bg-white text-gray-900'}`}>
                <th className="" style={{width: '30px', backgroundColor: 'transparent'}}></th> {/**This is only a component to push the header one cell to the right */}
                                            
                <td className="px-4 py-2 border text-center">
                    Subtotal
                </td>
                {uniqueDates.map(date => (
                    <td key={date} className="px-4 py-2 border text-center">
                        {formatValue(getUniqueDateSubtotal(date))}    
                    </td>
                ))}
            </tr>
        </tbody>
    )
}

export default TableBody;