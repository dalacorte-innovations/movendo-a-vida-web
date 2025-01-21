import React, { useState, useEffect, useContext } from 'react';
import Sidebar from '../../components/sidebar';
import { ThemeContext } from '../../utils/ThemeContext.jsx';
import { configBackendConnection, endpoints, getAuthHeaders } from '../../utils/backendConnection';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { IoCaretBack, IoCaretForward } from 'react-icons/io5';
import { useTranslation } from 'react-i18next';
import Slider from '@mui/material/Slider';
import { Typography } from '@mui/material';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinnerNotTimer.jsx';

interface Plan {
    name: string;
    term: number;
}

const LifePlanPage = () => {
    const { darkMode } = useContext(ThemeContext);
    const navigate = useNavigate();
    const { id } = useParams();
    const { t } = useTranslation();
    const [plan, setPlan] = useState<Plan>({ name: '', term: 1 });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (id) {
            const fetchPlanDetails = async () => {
                try {
                    const response = await fetch(`${configBackendConnection.baseURL}/${endpoints.lifePlanAPI}${id}/`, {
                        method: 'GET',
                        headers: getAuthHeaders(),
                    });
                    if (!response.ok) throw new Error(t('Erro ao carregar o plano de vida'));
                    const data = await response.json();
                    setPlan(data); 
                } catch (error) {
                    console.error(error);
                }
            };
            fetchPlanDetails();
        }
    }, [id]);

    const handleSubmitPlan = async () => {
        if (!plan.name) {
            toast.error(t('O nome do plano é obrigatório'));
            return;
        }
    
        try {
            setIsLoading(true);
            const method = id ? 'PATCH' : 'POST';
            const url = id
                ? `${configBackendConnection.baseURL}/${endpoints.lifePlanAPI}${id}/`
                : `${configBackendConnection.baseURL}/${endpoints.lifePlanAPI}`;
            
            const currentYear = new Date().getFullYear();
            const years = Array.from({ length: plan.term }, (_, i) => currentYear + i);

            const payload = id
                ? { name: plan.name }
                : { name: plan.name, years };

            const response = await fetch(url, {
                method,
                headers: {
                    ...getAuthHeaders(),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
    
            if (!response.ok) {
                throw new Error(id ? t('Erro ao atualizar o plano de vida') : t('Erro ao criar o plano de vida'));
            }
    
            const data = await response.json();
            toast.success(id ? t('Plano de vida atualizado com sucesso!') : t('Plano de vida criado com sucesso!'));
            navigate(`/life-plan/${data.id}/table`, { state: { plan: data } });
        } catch (error) {
            console.error(error);
            toast.error(id ? t('Erro ao atualizar o plano de vida.') : t('Erro ao criar o plano de vida.'));
        } finally {
            setIsLoading(false);
        }
    };
        
    return (
        <div className={`flex h-screen overflow-y-auto ${darkMode ? 'bg-primaryGray' : 'bg-gray-100'}`}>
            <Sidebar />
            <LoadingSpinner isLoading={isLoading} />
            <main
                className="flex flex-col flex-grow p-6 overflow-y-scroll m-auto justify-between items-center"
                style={{ maxHeight: '90vh', maxWidth: '500px', minHeight: '400px', overflowY: 'hidden'}}
            >
                <h1 className={`text-3xl font-semibold  ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{id ? t('Editar Plano de Vida') : t('Criar Plano de Vida')}</h1>
                <input
                    type="text"
                    id="name"
                    placeholder={t('Nome do plano')}
                    className={`w-full p-2 mb-2 border border-secontGray rounded-lg text-sm bg-transparent ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}
                    value={plan.name}
                    onChange={(e) => setPlan({ ...plan, name: e.target.value })}
                />
                <div className="w-full flex flex-col">
                    <Typography className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`} >{t("Prazo em anos")}</Typography>
                    <div className="flex flex-col px-2">
                        <Slider
                            aria-label="Prazo"
                            value={plan.term}
                            onChange={(e, value) => setPlan({ ...plan, term: value as number })}
                            valueLabelDisplay="auto"
                            step={1}
                            min={1}
                            max={20}
                            marks={Array.from({ length: 20 }, (_, i) => ({ value: i + 1, label: `${i + 1}` }))}
                            sx={{
                                '& .MuiSlider-markLabel': {
                                    color: darkMode ? '#9CA3AF' : '#4B5563',
                                },
                                '& .MuiSlider-thumb': {
                                    color: darkMode ? '#9CA3AF' : '#4B5563',
                                },
                                '& .MuiSlider-track': {
                                    color: darkMode ? '#9CA3AF' : '#4B5563',
                                },
                                '& .MuiSlider-rail': {
                                    color: darkMode ? '#9CA3AF' : '#4B5563',
                                },
                            }}
                        />
                    </div>
                </div>
                <div className="relative flex justify-center gap-2">
                    <button
                        className={`flex-1 flex items-center justify-center font-semibold text-base py-4 px-6 transition-colors rounded-xl ${
                            darkMode ? 'bg-primaryBlack text-white hover:bg-gray-600' : 'bg-gray-200 text-black hover:bg-gray-300'
                        }`}
                        onClick={() => navigate('/life-plan/dashboard')}
                    >
                        <IoCaretBack className="mr-2" size={20} />
                        {t('Voltar')}
                    </button>
                    <button
                        className={`flex-1 flex items-center justify-center font-semibold text-base py-4 px-6 transition-colors rounded-xl ${
                            darkMode ? 'bg-primaryBlack text-white hover:bg-[#1a1a1a]' : 'bg-gray-300 text-black hover:bg-gray-400'
                        }`}
                        onClick={handleSubmitPlan}
                    >
                        {t('Avançar')}
                        <IoCaretForward className="ml-2" size={20} />
                    </button>
                </div>
            </main>
        </div>
    );
};

export default LifePlanPage;
