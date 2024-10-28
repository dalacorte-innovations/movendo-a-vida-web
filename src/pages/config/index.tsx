import React, { useContext, useState, useEffect } from 'react';
import Sidebar from '../../components/sidebar';
import { ThemeContext } from '../../utils/ThemeContext.jsx';
import { IoPencil } from "react-icons/io5";
import { FcShare } from "react-icons/fc";
import { MdContentCopy } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { getPicture, getName, getPhone, getEmail, saveImageUrl, getFromStorage, getReferralCount } from '../../utils/storage';
import { configBackendConnection, endpoints, getAuthHeaders, getFileUploadHeaders } from '../../utils/backendConnection';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner.jsx';
import { formatPhoneNumber, unformatPhoneNumber } from '../../utils/formatValues.js';
import { useTranslation } from 'react-i18next';

const ConfigPage = () => {
    const { darkMode } = useContext(ThemeContext);
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nomeCompleto: getName() || t('Nome desconhecido'),
        telefone: formatPhoneNumber(getPhone() || '51999999999'),
        email: getEmail() || 'email.desconhecido@gmail.com',
    });

    const [profilePicUrl, setProfilePicUrl] = useState(() => {
        const imageUrl = getPicture();
        return imageUrl ? `${imageUrl}?timestamp=${new Date().getTime()}` : "https://robohash.org/dalacorte.png";
    });

    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const referralCode = getFromStorage('referral_code') || 'default_code';
    const referralCount = getReferralCount() || 0;

    useEffect(() => {
        const updatedImageUrl = getPicture();
        if (updatedImageUrl) {
            setProfilePicUrl(`${updatedImageUrl}?timestamp=${new Date().getTime()}`);
        }
    }, []);

    const handleCopyLink = () => {
        const referralLink = `${configBackendConnection.frontURL}/register/${referralCode}`;
        navigator.clipboard.writeText(referralLink);
        toast.success(t("Link copiado para a área de transferência!"));
    };

    const handleDiscard = () => {
        navigate('/');
    };

    const handleFileChange = async (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            const uploadFormData = new FormData();
            uploadFormData.append('image', selectedFile);
            setLoading(true);

            try {
                const response = await fetch(`${configBackendConnection.baseURL}/${endpoints.userConfig}`, {
                    method: 'PATCH',
                    headers: getFileUploadHeaders(),
                    body: uploadFormData,
                });

                if (response.ok) {
                    const data = await response.json();
                    const updatedImageUrl = String(data.image);

                    saveImageUrl(JSON.stringify(updatedImageUrl));
                    setProfilePicUrl(updatedImageUrl);
                    toast.success(t('Imagem enviada com sucesso!'));
                } else {
                    toast.error(t('Erro ao enviar imagem.'));
                }
            } catch (error) {
                toast.error(t('Erro ao conectar com o servidor.'));
            } finally {
                setLoading(false);
            }
        }
    };

    const handleSave = async () => {
        if (isEditing) {
            setLoading(true);
            try {
                const response = await fetch(`${configBackendConnection.baseURL}/${endpoints.userConfig}`, {
                    method: 'PATCH',
                    headers: {
                        ...getAuthHeaders(),
                    },
                    body: JSON.stringify({
                        full_name: formData.nomeCompleto,
                        phone: unformatPhoneNumber(formData.telefone),
                        email: formData.email,
                    }),
                });

                if (response.ok) {
                    toast.success(t('Configurações salvas com sucesso!'));
                    setIsEditing(false);
                } else {
                    toast.error(t('Erro ao salvar configurações.'));
                }
            } catch (error) {
                toast.error(t('Erro ao conectar com o servidor.'));
            } finally {
                setLoading(false);
            }
        } else {
            setIsEditing(true);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    const handlePhoneChange = (e) => {
        const input = e.target.value.replace(/\D/g, "").slice(0, 11);
        setFormData({ ...formData, telefone: formatPhoneNumber(input) });
    };

    useEffect(() => {
        const checkScreenSize = () => {
            setIsSmallScreen(window.innerWidth < 768);
        };

        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    return (
        <div className={`flex h-screen overflow-y-auto ${darkMode ? 'bg-primaryGray' : 'bg-white'}`}>
            <div className={`fixed md:relative h-screen ${darkMode ? 'bg-darkGray' : 'bg-gray-200'}`}>
                <Sidebar />
            </div>

            <main className={`ml-0 lg:ml-20 flex flex-col ${isSmallScreen ? 'items-center mt-5' : 'md:flex-row'} h-full w-full`}>
                {loading && <LoadingSpinner />}
                <div className={`flex flex-col justify-center w-full md:w-4/5 p-4 md:p-10 ${isSmallScreen ? 'text-center' : ''}`}>
                    <section className={`rounded-3xl p-10 mb-6 ${darkMode ? 'bg-primaryGray' : 'bg-gray-100'} border-2 border-secontGray`} style={{ height: isSmallScreen ? 'auto' : '24rem' }}>
                        <div className={`flex flex-row items-center mb-6`}>
                            <img
                                src={profilePicUrl}
                                alt={t("Foto de perfil")}
                                className="rounded-full w-24 h-24 md:w-32 md:h-32"
                                key={profilePicUrl}
                            />
                            <div className="ml-4 flex flex-col items-start">
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    id="file-upload"
                                    onChange={handleFileChange}
                                />
                                <label
                                    htmlFor="file-upload"
                                    className={`bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl text-sm md:text-base cursor-pointer`}
                                >
                                    {t("Subir nova foto")}
                                </label>
                                <p className="mt-2 max-w-full md:max-w-[282px] text-sm text-gray-400 text-center md:text-left">
                                    {t("A foto deve ter pelo menos 800x800px. JPG ou PNG são permitidos.")}
                                </p>
                            </div>
                        </div>

                        <hr className="border-gray-600 my-4" />

                        <div className="flex justify-between items-center mb-4">
                            <h2 className={`text-lg font-metropolis ${darkMode ? 'text-white' : 'text-black'}`}>{t("Informações pessoais")}</h2>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    className={`bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl text-sm md:text-base flex items-center`}
                                    onClick={handleSave}
                                >
                                    <IoPencil className="mr-2" />
                                    {isEditing ? t('Salvar') : t('Editar')}
                                </button>
                                {isEditing && (
                                    <button
                                        type="button"
                                        className={`bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-xl text-sm md:text-base flex items-center`}
                                        onClick={handleCancel}
                                    >
                                        {t("Cancelar")}
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className={`flex flex-col md:flex-row justify-between mt-8 w-full`}>
                            <div className="flex flex-col mb-4 md:mb-0 w-full md:w-1/3">
                                <label className={`${darkMode ? 'text-white' : 'text-gray-700'}`}>{t("Nome completo")}</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        className={`w-11/12 pl-4 pr-4 py-2 bg-primaryGray text-sm text-white rounded-xl border-2 focus:outline-none ${darkMode ? 'border-gray-600' : 'border-gray-400'}`}
                                        value={formData.nomeCompleto}
                                        onChange={(e) => setFormData({ ...formData, nomeCompleto: e.target.value })}
                                    />
                                ) : (
                                    <p className={`font-medium mt-2 ${darkMode ? 'text-forthyGray' : 'text-black'}`}>{formData.nomeCompleto}</p>
                                )}
                            </div>
                            <div className="flex flex-col mb-4 md:mb-0 w-full md:w-1/3">
                                <label className={`${darkMode ? 'text-white' : 'text-gray-700'}`}>{t("Telefone")}</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        className={`w-11/12 pl-4 pr-4 py-2 bg-primaryGray text-sm text-white rounded-xl border-2 focus:outline-none ${darkMode ? 'border-gray-600' : 'border-gray-400'}`}
                                        value={formData.telefone}
                                        onChange={handlePhoneChange}
                                    />
                                ) : (
                                    <p className={`font-medium mt-2 ${darkMode ? 'text-forthyGray' : 'text-black'}`}>{formData.telefone}</p>
                                )}
                            </div>
                            <div className="flex flex-col mb-4 md:mb-0 w-full md:w-1/3">
                                <label className={`${darkMode ? 'text-white' : 'text-gray-700'}`}>{t("E-mail")}</label>
                                {isEditing ? (
                                    <input
                                        type="email"
                                        className={`w-11/12	pl-4 pr-4 py-2 bg-primaryGray text-sm text-white rounded-xl border-2 focus:outline-none ${darkMode ? 'border-gray-600' : 'border-gray-400'}`}
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                ) : (
                                    <p className={`font-medium mt-2 ${darkMode ? 'text-forthyGray' : 'text-black'}`}>{formData.email}</p>
                                )}
                            </div>
                        </div>
                    </section>

                    <section className={`rounded-3xl p-10 ${darkMode ? 'bg-primaryGray' : 'bg-gray-100'} border-2 border-secontGray`} style={{ height: isSmallScreen ? 'auto' : '20rem' }}>
                        <h2 className={`text-md md:text-lg font-metropolis mb-2 ${darkMode ? 'text-white' : 'text-gray-700'}`}>
                            {t("Convide amigos")}
                        </h2>
                        <p className="text-sm text-gray-400 mb-4">
                            {t("Convide seus amigos para criarem um plano de vida e ganhe bônus.")}
                        </p>
                        <div className="flex items-center gap-2 mb-2">
                            <FcShare className="text-xl" />
                            <p className="text-gray-400">{t("Compartilhe seu link")}</p>
                        </div>
                        <div className="relative flex items-center">
                            <input
                                type="text"
                                className={`w-full pl-4 pr-12 py-2 text-sm rounded-xl border-2 focus:outline-none cursor-not-allowed ${darkMode ? 'bg-primaryGray text-white border-gray-600' : 'bg-gray-100 text-black border-gray-400'}`}
                                value={`${configBackendConnection.frontURL}/register/${referralCode}`}
                                readOnly
                            />
                            <MdContentCopy
                                className="absolute right-4 cursor-pointer text-gray-400 hover:text-gray-600"
                                onClick={handleCopyLink}
                                title={t("Copiar link")}
                            />
                        </div>
                        <div className="flex flex-col md:flex-row justify-between mt-4 gap-4">
                            <button
                                type="button"
                                className={`rounded-xl w-full md:w-[49%] px-4 py-2 text-sm md:text-base ${darkMode ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
                            >
                                {t("Retirar bônus")}
                            </button>
                            <button
                                type="button"
                                className={`rounded-xl w-full md:w-[49%] px-4 py-2 text-sm md:text-base ${darkMode ? 'bg-gray-600 text-white hover:bg-gray-700' : 'bg-gray-300 text-black hover:bg-gray-400'}`}
                                onClick={handleDiscard}
                            >
                                {t("Descartar")}
                            </button>
                        </div>
                        <p className={`mt-4 ${darkMode ? 'text-white' : 'text-black'}`}>{t("Pessoas que usaram o link")}: {referralCount}</p>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default ConfigPage;
