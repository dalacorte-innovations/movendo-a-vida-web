import React, { Dispatch, SetStateAction } from 'react';
import { OrganizedData } from "../../types/life-plan/lifePlan";

interface TableBodyProps {
    data: OrganizedData;
    setData: Dispatch<SetStateAction<OrganizedData>>;
    category: string;
    darkMode: boolean;
    uniqueDates: string[];
    formatValue: (value: any) => string;
    getMetaStyle: (meta: string) => string;
    editingCell: { name: string; date: string } | null;
    setEditingCell: Dispatch<SetStateAction<{ name: string; date: string } | null>>;
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

    const handleEditClick = (name: string, date: string) => {
        setEditingCell({ name, date });
    }

    const handleChange = (e, name, date) => {
        const value = e.target.value;

        setData((prev) => {
            const updatedData = { ...prev };
            if (date === "firstMeta") {
            updatedData[category][name].firstMeta = value;
            } else {
            updatedData[category][name].values[date] = value;
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
            {Object.keys(data[category]).map((name, index) => (
                <tr key={index} className={`${darkMode ? 'bg-transparent text-white' : 'bg-white text-gray-900'}`}>
                    <td className="px-4 py-2 border">{name}</td>
                    {uniqueDates.map(date => (
                        <td key={date} className="px-4 py-2 border text-center" onClick={() => handleEditClick(name, date)}>
                            {editingCell?.name === name && editingCell?.date === date ? (
                                <input
                                    type="text"
                                    value={data[category][name].values[date] || ""}
                                    onChange={(e) => handleChange(e, name, date)}
                                    onBlur={handleBlur}
                                    className="w-full bg-transparent text-center" style={{width: '60px'}}
                                />
                            ) : (
                                data[category][name].values[date] ? formatValue(data[category][name].values[date]) : 'N/A'
                            )}
                        </td>
                    ))}
                    <td className="px-4 py-2 border text-center" style={{width: '60px'}}>
                        {editingCell?.name === name && editingCell?.date === "firstMeta" ? (
                            <input
                                type="text"
                                value={data[category][name].firstMeta || ""}
                                onChange={(e) => handleChange(e, name, "firstMeta")}
                                onBlur={handleBlur}
                                className="w-full bg-transparent text-center"
                            />
                        ) : (
                            <span className={getMetaStyle(data[category][name].firstMeta)}>{formatValue(data[category][name].firstMeta)}</span>
                        )}
                    </td>
                </tr>
            ))}
        </tbody>
    )
}

export default TableBody;