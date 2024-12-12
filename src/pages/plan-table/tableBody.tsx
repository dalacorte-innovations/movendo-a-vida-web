import React, { Dispatch, SetStateAction } from 'react';
import { OrganizedData } from "../../types/life-plan/lifePlan";
import { toast } from 'react-toastify';

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

    return (
        <tbody>
            {Object.keys(data[category]).map((id, index) => (
                <tr key={index} className={`${darkMode ? 'bg-transparent text-white' : 'bg-white text-gray-900'}`}>
                    <td className="px-4 py-2 border" onClick={() => handleEditClick(parseInt(id), 'name')}>{
                        editingCell?.id === parseInt(id) && editingCell?.date === "name" ? (
                            <input
                                    type="text"
                                    value={data[category][id].name || ""}
                                    onChange={(e) => handleChange(e, parseInt(id), 'name')}
                                    onBlur={handleBlur}
                                    className="w-full bg-transparent text-center" style={{width: '60px'}}
                                />
                        ):(
                            data[category][id].name
                        )}</td>
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
                    <td className="px-4 py-2 border text-center" style={{width: '60px'}}>
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
        </tbody>
    )
}

export default TableBody;