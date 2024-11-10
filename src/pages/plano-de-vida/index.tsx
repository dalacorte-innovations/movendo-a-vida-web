import React, { useState, useEffect, useContext } from 'react';
import Sidebar from '../../components/sidebar';
import { ThemeContext } from '../../utils/ThemeContext.jsx';
import { FaTrash } from 'react-icons/fa';
import { configBackendConnection, endpoints, getAuthHeaders } from '../../utils/backendConnection';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { RiAddBoxFill } from 'react-icons/ri';
import { IoCaretBack } from 'react-icons/io5';
import { IoIosExpand } from "react-icons/io";
import { differenceInMonths, format, startOfMonth } from 'date-fns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import ptBR from 'date-fns/locale/pt-BR';
import { TextField } from '@mui/material';

const isValidDate = (date) => date && !isNaN(new Date(date).getTime());

const ReplicateModal = ({ isOpen, onClose, onConfirm, category }) => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    const handleConfirm = () => {
        if (!startDate || !endDate) {
            setErrorMessage("Por favor, selecione ambas as datas.");
            return;
        }

        if (endDate < startDate) {
            setErrorMessage("A data final não pode ser anterior à data inicial.");
            return;
        }

        onConfirm(category, startDate, endDate);
        onClose();
    };

    const handleClickOutside = (e) => {
        if (e.target.className && e.target.className.toString().includes('modal-background')) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div onClick={handleClickOutside} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center modal-background">
            <div className="bg-white p-6 rounded-lg max-w-[19rem] w-full">
                <h2 className="text-lg font-bold mb-4 text-center">Selecione o período</h2>
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
                    <DatePicker
                        label="De"
                        views={['year', 'month']}
                        value={startDate}
                        onChange={(newValue) => {
                            setStartDate(newValue);
                            setErrorMessage('');
                        }}
                        renderInput={(params) => <TextField {...params} className="w-full mb-4" />}
                    />
                    <DatePicker
                        label="Até"
                        views={['year', 'month']}
                        value={endDate}
                        onChange={(newValue) => {
                            setEndDate(newValue);
                            setErrorMessage('');
                        }}
                        renderInput={(params) => <TextField {...params} className="w-full mb-4" />}
                    />
                </LocalizationProvider>
                {errorMessage && <p className="text-red-500 text-sm text-center">{errorMessage}</p>}
                <div className="flex justify-center gap-4 mt-5">
                    <button onClick={onClose} className="text-gray-500">Cancelar</button>
                    <button onClick={handleConfirm} className="bg-blue-500 text-white px-4 py-2 rounded">Confirmar</button>
                </div>
            </div>
        </div>
    );
};

const PlanoDeVidaPage = () => {
    const { darkMode } = useContext(ThemeContext);
    const navigate = useNavigate();
    const { id } = useParams();
    const [canEdit, setCanEdit] = useState(false);
    const [isAdding, setIsAdding] = useState({});
    const [expandedCategory, setExpandedCategory] = useState(null);
    const [planName, setPlanName] = useState(id ? "" : "Nome do Plano de Vida");
    const [categories, setCategories] = useState({
        receitas: { items: [], total: 0, newItem: { name: '', value: '', meta: '', replicateMonths: 0 } },
        estudos: { items: [], total: 0, newItem: { name: '', value: '', meta: '', replicateMonths: 0 } },
        custos: { items: [], total: 0, newItem: { name: '', value: '', meta: '', replicateMonths: 0 } },
        lucroPrejuizo: { items: [], total: 0, newItem: { name: '', value: '', meta: '', replicateMonths: 0 } },
        investimentos: { items: [], total: 0, newItem: { name: '', value: '', meta: '', replicateMonths: 0 } },
        realizacoes: { items: [], total: 0, newItem: { name: '', value: '', meta: '', replicateMonths: 0 } },
        intercambio: { items: [], total: 0, newItem: { name: '', value: '', meta: '', replicateMonths: 0 } },
        empresas: { items: [], total: 0, newItem: { name: '', value: '', meta: '', replicateMonths: 0 } }
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentCategory, setCurrentCategory] = useState(null);
    const [replicateMonthsByCategory, setReplicateMonthsByCategory] = useState({});

    useEffect(() => {
        if (id) {
            const fetchPlanDetails = async () => {
                try {
                    const response = await fetch(`${configBackendConnection.baseURL}/${endpoints.lifePlanAPI}${id}/`, {
                        method: 'GET',
                        headers: getAuthHeaders(),
                    });
                    if (!response.ok) throw new Error('Erro ao carregar o plano de vida');
                    const data = await response.json();

                    const formattedItems = { ...categories };
                    Object.keys(formattedItems).forEach(categoryKey => {
                        formattedItems[categoryKey].items = [];
                    });

                    Object.keys(data.total_per_category).forEach(categoryKey => {
                        if (formattedItems[categoryKey]) {
                            formattedItems[categoryKey].total = data.total_per_category[categoryKey];
                        }
                    });

                    data.items.forEach(item => {
                        if (formattedItems[item.category]) {
                            formattedItems[item.category].items.push({
                                name: item.name,
                                value: parseFloat(item.value),
                                meta: parseFloat(item.meta),
                                date: isValidDate(item.date) ? item.date : null
                            });
                        }
                    });

                    setPlanName(data.name);
                    setCategories(formattedItems);
                    setCanEdit(true);
                } catch (error) {
                    console.error(error);
                }
            };
            fetchPlanDetails();
        }
    }, [id]);

    const formatCurrency = (value) => {
        const numericValue = parseFloat(value);
        return isNaN(numericValue) ? 'R$ 0,00' : numericValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    const handleAddItem = (category) => {
        const { name, value, meta } = categories[category].newItem;
        const replicationDates = replicateMonthsByCategory[category] || [];
    
        if (!name || !value) {
            toast.error("Por favor, preencha os campos obrigatórios antes de confirmar.");
            return;
        }
    
        const valorNumerico = parseCurrencyValue(value);
        const metaNumerica = meta ? parseCurrencyValue(meta) : null;
    
        const items = replicationDates.length > 0 
            ? replicationDates.map(date => ({ name, value: valorNumerico, meta: metaNumerica, date }))
            : [{ name, value: valorNumerico, meta: metaNumerica, date: null }];
    
        setCategories((prevCategories) => {
            const updatedItems = [...prevCategories[category].items, ...items];
            const updatedTotal = updatedItems.reduce((acc, item) => acc + item.value, 0);
    
            return {
                ...prevCategories,
                [category]: { ...prevCategories[category], items: updatedItems, total: updatedTotal, newItem: { name: '', value: '', meta: '', replicateMonths: 0 } },
            };
        });
    
        setIsAdding((prev) => ({ ...prev, [category]: false }));
        setReplicateMonthsByCategory((prev) => ({ ...prev, [category]: [] }));
        toast.success("Item adicionado com sucesso!");
    };

    const handleDeleteItem = (category, index) => {
        setCategories((prevCategories) => {
            const updatedItems = prevCategories[category].items.filter((_, i) => i !== index);
            const updatedTotal = updatedItems.reduce((acc, item) => acc + item.value, 0);

            return {
                ...prevCategories,
                [category]: { ...prevCategories[category], items: updatedItems, total: updatedTotal },
            };
        });
    };

    const handleNewItemChange = (e, category) => {
        const { id, value } = e.target;
        setCategories((prevCategories) => ({
            ...prevCategories,
            [category]: {
                ...prevCategories[category],
                newItem: {
                    ...prevCategories[category].newItem,
                    [id]: value,
                },
            },
        }));
    };

    const handleNameChange = (e) => {
        setPlanName(e.target.value);
    };

    const toggleExpandCategory = (categoryKey) => {
        setExpandedCategory(expandedCategory === categoryKey ? null : categoryKey);
    };

    const handleSubmitPlan = async () => {
        try {
            const itemsForPlan = {};
            for (const [categoryKey, category] of Object.entries(categories)) {
                itemsForPlan[categoryKey] = {
                    total: category.total,
                    items: category.items.map(item => ({
                        name: item.name,
                        value: item.value,
                        meta: item.meta,
                        date: item.date || ""
                    }))
                };
            }

            const payload = {
                name: planName,
                items_for_plan: itemsForPlan
            };
            console.log(payload)
            const method = id ? 'PATCH' : 'POST';
            const url = id
                ? `${configBackendConnection.baseURL}/${endpoints.lifePlanAPI}${id}/`
                : `${configBackendConnection.baseURL}/${endpoints.lifePlanAPI}`;

            const response = await fetch(url, {
                method,
                headers: {
                    ...getAuthHeaders(),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error(id ? "Erro ao atualizar o plano de vida" : "Erro ao criar o plano de vida");
            navigate('/life-plan/dashboard');
            toast.success(id ? "Plano de vida atualizado com sucesso!" : "Plano de vida criado com sucesso!");
        } catch (error) {
            console.error(error);
            toast.error(id ? "Erro ao atualizar o plano de vida." : "Erro ao criar o plano de vida.");
        }
    };

    const openModal = (category) => {
        setCurrentCategory(category);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentCategory(null);
    };

    const handleConfirmModal = (category, startDate, endDate) => {
        const replicationDates = [];
        const currentDate = startOfMonth(new Date(startDate));
        const monthsToReplicate = differenceInMonths(endDate, startDate);

        for (let i = 0; i <= monthsToReplicate; i++) {
            const replicateDate = new Date(currentDate);
            replicateDate.setMonth(currentDate.getMonth() + i);
            const formattedDate = `01;${format(replicateDate, 'MM;yyyy')}`;
            replicationDates.push(formattedDate);
        }

        setReplicateMonthsByCategory((prev) => ({ ...prev, [category]: replicationDates }));
    };

    const handleCurrencyInput = (e, category, field) => {
        let value = e.target.value.replace(/\D/g, '');
        value = (parseInt(value) / 100).toFixed(2);
        value = value.toString().replace(".", ",");

        const formattedValue = value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        setCategories((prevCategories) => ({
            ...prevCategories,
            [category]: {
                ...prevCategories[category],
                newItem: {
                    ...prevCategories[category].newItem,
                    [field]: formattedValue,
                },
            },
        }));
    };

    const parseCurrencyValue = (value) => parseFloat(value.replace(/\./g, '').replace(',', '.'));

    return (
        <div className={`flex h-screen overflow-y-auto ${darkMode ? 'bg-primaryGray' : 'bg-gray-100'}`}>
            <Sidebar />
            <main className="flex flex-col mt-20 flex-grow p-6 overflow-y-scroll" style={{ maxHeight: '90vh' }}>
                <div className="flex justify-start items-center mb-6">
                    {canEdit ? (
                        <input
                            type="text"
                            value={planName}
                            onChange={handleNameChange}
                            onBlur={() => setCanEdit(!canEdit)}
                            className={`text-2xl font-bold bg-transparent border-b-2 border-transparent focus:border-gray-500 focus:outline-none transition duration-200 ${darkMode ? 'text-white' : 'text-black'}`}
                            placeholder="Nome do Plano de Vida"
                        />
                    ) : (
                        <h1
                            className={`text-2xl font-bold cursor-pointer ${darkMode ? 'text-white' : 'text-black'}`}
                            onClick={() => setCanEdit(!canEdit)}
                        >
                            {planName}
                        </h1>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Object.keys(categories)
                        .filter(categoryKey => categoryKey !== 'lucroPrejuizo')
                        .map((categoryKey) => {
                            const category = categories[categoryKey];
                            const displayCategoryKey = 
                                categoryKey === 'realizacoes' ? 'Realizações' :
                                categoryKey === 'intercambio' ? 'Intercâmbio' :
                                categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1).replace(/([A-Z])/g, ' $1');

                            const uniqueNames = [...new Set(category.items.map(item => item.name))];

                            return (
                                <div key={categoryKey} className="flex flex-col p-4 border border-secontGray rounded-lg">
                                    <div className="flex justify-between items-center">
                                        <h2 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                            {displayCategoryKey}
                                        </h2>
                                        <IoIosExpand
                                            className="cursor-pointer text-gray-500"
                                            onClick={() => toggleExpandCategory(categoryKey)}
                                        />
                                    </div>
                                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm mb-4`}>
                                        Total: R$ {formatCurrency(category.total)}
                                    </p>
                                    {expandedCategory === categoryKey && (
                                        <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-rounded">
                                            {category.items.map((item, itemIndex) => (
                                                <div key={itemIndex} className="p-2 rounded-lg border border-secontGray flex flex-col md:flex-row md:justify-between items-center md:items-start">
                                                <div className={`${darkMode ? 'text-gray-200' : 'text-gray-800'} text-sm`}>{item.name}</div>
                                                    <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-xs`}>
                                                        {item.date && isValidDate(item.date) ? 
                                                            (() => {
                                                                const [day, month, year] = item.date.split(';');
                                                                const parsedDate = new Date(`${year}-${month}-${day}`);
                                                                return format(parsedDate, 'MMM yyyy', { locale: ptBR }).toUpperCase();
                                                            })()
                                                            : 'Mês'
                                                        }
                                                    </span>
                                                    <div className="flex items-center gap-2">
                                                        <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-xs`}>{formatCurrency(item.value)}</span>
                                                        <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-xs`}>Meta: {formatCurrency(item.meta)}</span>
                                                        <FaTrash
                                                            className="text-red-500 cursor-pointer"
                                                            onClick={() => handleDeleteItem(categoryKey, itemIndex)}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {isAdding[categoryKey] ? (
                                        <div className="mt-4">
                                            <select
                                                onChange={(e) => handleNewItemChange({ target: { id: 'name', value: e.target.value } }, categoryKey)}
                                                className={`w-full p-2 mb-2 border border-secontGray rounded-lg text-sm bg-transparent ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}
                                            >
                                                <option value="">Selecionar item existente</option>
                                                {uniqueNames.map((name, index) => (
                                                    <option key={index} value={name}>{name}</option>
                                                ))}
                                            </select>
                                            <input
                                                type="text"
                                                id="name"
                                                placeholder="Nome do item"
                                                className={`w-full p-2 mb-2 border border-secontGray rounded-lg text-sm bg-transparent ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}
                                                value={category.newItem.name}
                                                onChange={(e) => handleNewItemChange(e, categoryKey)}
                                            />
                                            <input
                                                type="text"
                                                id="value"
                                                placeholder="Valor"
                                                className={`w-full p-2 mb-2 border border-secontGray rounded-lg text-sm bg-transparent ${darkMode ? 'text-gray-200' : 'text-gray-800'} no-arrows`}
                                                value={category.newItem.value}
                                                onChange={(e) => handleCurrencyInput(e, categoryKey, 'value')}
                                                />
                                            <input
                                                type="text"
                                                id="meta"
                                                placeholder="Meta"
                                                className={`w-full p-2 mb-2 border border-secontGray rounded-lg text-sm bg-transparent ${darkMode ? 'text-gray-200' : 'text-gray-800'} no-arrows`}
                                                value={category.newItem.meta}
                                                onChange={(e) => handleCurrencyInput(e, categoryKey, 'meta')}
                                                />
                                            <button
                                                className="w-full mb-2 bg-gray-400 text-white p-2 rounded-lg text-sm transition hover:bg-gray-500"
                                                onClick={() => openModal(categoryKey)}
                                            >
                                                Data
                                            </button>
                                            <button
                                                className="w-full bg-blue-500 text-white p-2 rounded-lg text-sm"
                                                onClick={() => handleAddItem(categoryKey)}
                                            >
                                                Confirmar
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg text-sm transition"
                                            onClick={() => setIsAdding({ ...isAdding, [categoryKey]: true })}
                                        >
                                            Adicionar
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                </div>

                <ReplicateModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    onConfirm={handleConfirmModal}
                    category={currentCategory}
                />
                <div className="relative flex justify-center gap-2 mt-6 lg:mt-[10.5rem]">
                    <button
                        className={`flex-1 flex items-center justify-center font-semibold text-base py-4 px-6 transition-colors rounded-xl ${
                            darkMode ? 'bg-primaryBlack text-white hover:bg-[#1a1a1a]' : 'bg-gray-300 text-black hover:bg-gray-400'
                        }`}
                        onClick={handleSubmitPlan}
                    >
                        <RiAddBoxFill className="mr-2" size={20} />
                        {id ? "Editar Plano de Vida" : "Criar Plano de Vida"}
                    </button>
                    <button
                        className={`flex-1 flex items-center justify-center font-semibold text-base py-4 px-6 transition-colors rounded-xl ${
                            darkMode ? 'bg-primaryBlack text-white hover:bg-gray-600' : 'bg-gray-200 text-black hover:bg-gray-300'
                        }`}
                        onClick={() => navigate('/life-plan/dashboard')}
                    >
                        <IoCaretBack className="mr-2" size={20} />
                        Voltar
                    </button>
                </div>

            </main>
        </div>
    );
};

export default PlanoDeVidaPage;
