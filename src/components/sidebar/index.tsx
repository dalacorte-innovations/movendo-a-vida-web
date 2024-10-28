import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaStar, FaSun, FaMoon } from 'react-icons/fa';
import { HiHome } from "react-icons/hi2";
import { MdExpandMore } from 'react-icons/md';
import { FaLongArrowAltLeft } from "react-icons/fa";
import { HiBuildingStorefront } from "react-icons/hi2";
import { IoMdHelpCircle } from "react-icons/io";
import { BsFillGearFill } from "react-icons/bs";
import { IoExitSharp } from "react-icons/io5";
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeContext } from '../../utils/ThemeContext.jsx';
import { getPicture, getName, getEmail, saveToStorage } from '../../utils/storage';
import { useTranslation } from 'react-i18next';

const Sidebar = () => {
    const { t, i18n } = useTranslation();
    const [selected, setSelected] = useState(null);
    const [isExpanded, setIsExpanded] = useState(window.innerWidth >= 1024);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState('pt');
    const { darkMode, toggleTheme } = useContext(ThemeContext);
    const location = useLocation();

    const options = [
        { id: 1, name: t('Home'), icon: HiHome, url: '/' },
        { id: 2, name: t('Planos'), icon: HiBuildingStorefront, url: '/plans', hasDropdown: false },
        // { id: 4, name: t('Favoritos'), icon: FaStar, url: '#' },
        { id: 5, name: t('Ajuda'), icon: IoMdHelpCircle, url: '#' },
        { id: 6, name: t('Configurações'), icon: BsFillGearFill, url: '/config' },
        { id: 7, name: t('Sair'), icon: IoExitSharp, url: '/logout' },
    ];

    const toggleSidebar = () => {
        setIsExpanded(!isExpanded);
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenuOnOutsideClick = (event) => {
        if (event.target.id === 'modal-background') {
            setIsMenuOpen(false);
        }
    };

    const handleButtonClick = (url) => {
        if (url === "#") {
            toast.info("Funcionalidade em desenvolvimento");
        }
    };

    useEffect(() => {
        const storedLanguage = localStorage.getItem('Language') || 'pt';
        setSelectedLanguage(storedLanguage);
        i18n.changeLanguage(storedLanguage);
    }, [i18n]);

    const handleLanguageChange = (language) => {
        i18n.changeLanguage(language);
        setSelectedLanguage(language);
        localStorage.setItem('Language', language);
    };

    useEffect(() => {
        if (window.innerWidth < 1024) {
            setIsExpanded(false);
        }
    }, [location]);

    const userPicture = getPicture() || "https://robohash.org/dalacorte.png";
    const userName = getName() || 'Nome desconhecido';
    const userEmail = getEmail() || 'email.desconhecido@gmail.com';

    return (
        <>
            <div className="block md:hidden fixed top-4 left-4 z-50">
                <button onClick={toggleMenu} className="text-white text-2xl">
                    {isMenuOpen ? "" : <AiOutlineMenu />}
                </button>
            </div>

            {isMenuOpen && (
                <div
                    id="modal-background"
                    className="fixed inset-0 bg-black bg-opacity-70 z-40"
                    onClick={closeMenuOnOutsideClick}
                >
                    <div className={`fixed top-0 left-0 h-full bg-primaryBlack w-64 z-50 p-8 ${darkMode ? 'bg-primaryBlack' : 'bg-white'}`}>
                        <div className="flex items-center justify-between mb-8">
                            <h1 className={`text-lg font-metropolis ${darkMode ? 'text-white' : 'text-black'} transition-opacity duration-300 ease-in-out`}>Plano de Vida</h1>
                            <button className="text-white text-2xl" onClick={toggleMenu}>
                                <AiOutlineClose />
                            </button>
                        </div>

                        <nav className="flex flex-col space-y-4 font-metropolis text-thirdGray text-sm">
                            {options.map(option => (
                                <Link
                                    to={option.url}
                                    key={option.id}
                                    className={`flex items-center p-2 rounded-md transition-all duration-300 ease-in-out ${
                                        selected === option.id
                                            ? 'bg-gray-700'
                                            : darkMode
                                            ? 'hover:bg-gray-600 text-white'
                                            : 'hover:bg-gray-300 text-black'
                                    }`}
                                    onClick={() => {
                                        setSelected(option.id);
                                        handleButtonClick(option.url);
                                        toggleMenu();
                                    }}
                                >
                                    <option.icon className="text-lg" />
                                    <span className="flex-grow ml-3 transition-all duration-300 ease-in-out">{option.name}</span>
                                    {option.hasDropdown && <MdExpandMore className="text-lg transition-all duration-300 ease-in-out" />}
                                </Link>
                            ))}
                        </nav>

                        <hr className="border-gray-400 my-4" />

                        <button
                            className="flex items-center justify-center p-2 rounded-md transition-all duration-300 ease-in-out bg-gray-600 hover:bg-gray-500 text-white"
                            onClick={toggleTheme}
                        >
                            {darkMode ? <FaSun className="text-lg mr-2" /> : <FaMoon className="text-lg mr-2 text-black" />}
                            <span className="transition-all duration-300 ease-in-out">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
                        </button>

                        <hr className="border-gray-400 my-4" />

                        <div className="flex items-center justify-between mt-4">
                            <span className={`text-sm ${darkMode ? 'text-white' : 'text-black'}`}>{t('Idioma')}:</span>
                            <div className="flex space-x-2">
                                <img
                                    src="https://upload.wikimedia.org/wikipedia/en/a/a4/Flag_of_the_United_States.svg"
                                    alt="English"
                                    className={`w-6 h-6 cursor-pointer ${selectedLanguage === 'en' && 'border-2 border-blue-500'}`}
                                    onClick={() => handleLanguageChange('en')}
                                />
                                <img
                                    src="https://upload.wikimedia.org/wikipedia/en/9/9a/Flag_of_Spain.svg"
                                    alt="Español"
                                    className={`w-6 h-6 cursor-pointer ${selectedLanguage === 'es' && 'border-2 border-blue-500'}`}
                                    onClick={() => handleLanguageChange('es')}
                                />
                                <img
                                    src="https://upload.wikimedia.org/wikipedia/en/0/05/Flag_of_Brazil.svg"
                                    alt="Português"
                                    className={`w-6 h-6 cursor-pointer ${selectedLanguage === 'pt' && 'border-2 border-blue-500'}`}
                                    onClick={() => handleLanguageChange('pt')}
                                />
                            </div>
                        </div>

                        <hr className="border-gray-400 my-4" />
                    </div>
                </div>
            )}

            <div className={`hidden md:flex flex-col h-[100%] bg-primaryBlack transition-all duration-300 ${isExpanded ? 'w-64 p-8' : 'w-16 p-4'} ${!darkMode && 'bg-white'}`}>
                <div className="flex items-center justify-between mb-8">
                    {isExpanded && <h1 className={`text-lg font-metropolis ${darkMode ? 'text-white' : 'text-black'} transition-opacity duration-300 ease-in-out`}>Plano de Vida</h1>}
                    <button
                        className={`bg-primaryPurple w-8 h-8 rounded-full flex items-center justify-center text-white ${!isExpanded && 'hidden lg:flex'}`}
                        onClick={toggleSidebar}
                    >
                        <FaLongArrowAltLeft className={`transition-transform duration-300 ease-in-out ${!isExpanded && 'rotate-180'}`} />
                    </button>
                </div>

                <nav className="flex flex-col space-y-2 font-metropolis text-thirdGray text-sm">
                    {options.slice(0, 4).map(option => (
                        <Link
                            to={option.url}
                            key={option.id}
                            className={`flex items-center p-2 rounded-md transition-all duration-300 ease-in-out ${
                                selected === option.id
                                    ? 'bg-gray-700'
                                    : darkMode
                                    ? 'hover:bg-gray-600 text-white'
                                    : 'hover:bg-gray-300 text-black'
                            }`}
                            onClick={() => {
                                setSelected(option.id);
                                handleButtonClick(option.url);
                            }}
                        >
                            <option.icon className="text-lg" />
                            {isExpanded && <span className="flex-grow ml-3 transition-all duration-300 ease-in-out">{option.name}</span>}
                            {option.hasDropdown && isExpanded && <MdExpandMore className="text-lg transition-all duration-300 ease-in-out" />}
                        </Link>
                    ))}
                </nav>

                <hr className="border-gray-400 my-4" />

                <nav className="flex flex-col space-y-2 font-metropolis text-sm">
                    {options.slice(4).map(option => (
                        <Link
                            to={option.url}
                            key={option.id}
                            className={`flex items-center p-2 rounded-md transition-all duration-300 ease-in-out ${
                                selected === option.id
                                    ? 'bg-gray-700'
                                    : darkMode
                                    ? 'hover:bg-gray-600 text-white'
                                    : 'hover:bg-gray-300 text-black'
                            }`}
                            onClick={() => {
                                setSelected(option.id);
                                handleButtonClick(option.url);
                            }}
                        >
                            <option.icon className="text-lg" />
                            {isExpanded && <span className="flex-grow ml-3 transition-all duration-300 ease-in-out">{option.name}</span>}
                            {option.hasDropdown && isExpanded && <MdExpandMore className="text-lg transition-all duration-300 ease-in-out" />}
                        </Link>
                    ))}
                </nav>

                <hr className="border-gray-400 my-4" />

                <button
                    className="flex items-center justify-center p-2 rounded-md transition-all duration-300 ease-in-out bg-gray-600 hover:bg-gray-500 text-white"
                    onClick={toggleTheme}
                >
                    {darkMode ? <FaSun className="text-lg mr-2" /> : <FaMoon className="text-lg mr-2 text-black" />}
                    {isExpanded && <span className="transition-all duration-300 ease-in-out">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>}
                </button>

                <hr className="border-gray-400 my-4" />

                <div className="flex items-center justify-between mt-4">
                    <span className={`text-sm ${darkMode ? 'text-white' : 'text-black'}`}>{t('Idioma')}:</span>
                    <div className="flex space-x-2">
                        <img
                            src="https://upload.wikimedia.org/wikipedia/en/a/a4/Flag_of_the_United_States.svg"
                            alt="English"
                            className={`w-6 h-6 cursor-pointer ${selectedLanguage === 'en' && 'border-2 border-blue-500'}`}
                            onClick={() => handleLanguageChange('en')}
                        />
                        <img
                            src="https://upload.wikimedia.org/wikipedia/en/9/9a/Flag_of_Spain.svg"
                            alt="Español"
                            className={`w-6 h-6 cursor-pointer ${selectedLanguage === 'es' && 'border-2 border-blue-500'}`}
                            onClick={() => handleLanguageChange('es')}
                        />
                        <img
                            src="https://upload.wikimedia.org/wikipedia/en/0/05/Flag_of_Brazil.svg"
                            alt="Português"
                            className={`w-6 h-6 cursor-pointer ${selectedLanguage === 'pt' && 'border-2 border-blue-500'}`}
                            onClick={() => handleLanguageChange('pt')}
                        />
                    </div>
                </div>

                <div className={`mt-auto flex flex-col items-center ${isExpanded ? 'mb-4' : 'my-4'} transition-all duration-300 ease-in-out`}>
                    <img
                        className="w-14 h-14 rounded-full mb-2"
                        src={userPicture}
                        alt="User"
                    />
                    {isExpanded && (
                        <>
                            <h2 className={`mt-2 text-sm font-metropolis ${darkMode ? 'text-white' : 'text-black'} transition-opacity duration-300 ease-in-out`}>{userName}</h2>
                            <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-800'} transition-opacity duration-300 ease-in-out`}>{userEmail}</span>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default Sidebar;
