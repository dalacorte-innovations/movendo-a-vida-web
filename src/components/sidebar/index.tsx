import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaStar, FaSun, FaMoon } from 'react-icons/fa';
import { HiHome } from "react-icons/hi2";
import { MdExpandMore } from 'react-icons/md';
import { FaLongArrowAltLeft } from "react-icons/fa";
import { IoNotifications } from "react-icons/io5";
import { HiBuildingStorefront } from "react-icons/hi2";
import { IoMdHelpCircle } from "react-icons/io";
import { BsFillGearFill } from "react-icons/bs";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { IoExitSharp } from "react-icons/io5";
import { ThemeContext } from '../../utils/ThemeContext.jsx';

const Sidebar = () => {
    const [selected, setSelected] = useState(null);
    const [isExpanded, setIsExpanded] = useState(window.innerWidth >= 1024);
    const { darkMode, toggleTheme } = useContext(ThemeContext);

    const location = useLocation();

    const options = [
        { id: 1, name: 'Home', icon: HiHome, url: '/' },
        { id: 2, name: 'Planos', icon: HiBuildingStorefront, url: '/plans', hasDropdown: false },
        { id: 3, name: 'Notificações', icon: IoNotifications, url: '#' },
        { id: 4, name: 'Favoritos', icon: FaStar, url: '#' },
        { id: 5, name: 'Ajuda', icon: IoMdHelpCircle, url: '#' },
        { id: 6, name: 'Configurações', icon: BsFillGearFill, url: '#' },
        { id: 7, name: 'Sair', icon: IoExitSharp, url: '/logout' }
    ];

    const toggleSidebar = () => {
        setIsExpanded(!isExpanded);
    };

    const handleButtonClick = (url) => {
        if (url === "#") {
            toast.info("Funcionalidade em desenvolvimento");
        }
    };

    useEffect(() => {
        if (window.innerWidth < 1024) {
            setIsExpanded(false);
        }
    }, [location]);

    return (
        <div className={`flex flex-col h-[100%] bg-primaryBlack transition-all duration-300 ${isExpanded ? 'w-64 p-8' : 'w-16 p-4'} ${!darkMode && 'bg-white'}`}>
            <div className="flex items-center justify-between mb-8">
                {isExpanded && <h1 className={`text-lg font-metropolis ${darkMode ? 'text-white' : 'text-black'} transition-opacity duration-300 ease-in-out`}>Plano de Vida</h1>}
                <button
                    className={`bg-primaryPurple w-8 h-8 rounded-full flex items-center justify-center text-white ${!isExpanded && 'hidden lg:flex'}`}
                    onClick={toggleSidebar}
                >
                    <FaLongArrowAltLeft className={`transition-transform duration-300 ease-in-out ${!isExpanded && 'rotate-180'}`} />
                </button>
            </div>

            {isExpanded && (
                <div className="flex items-center mb-6 text-sm transition-opacity duration-300 ease-in-out">
                    <input
                        type="text"
                        placeholder="Pesquise"
                        className={`w-full pl-4 pr-4 py-2 ${darkMode ? 'bg-primaryGray text-white' : 'bg-gray-200 text-black'} text-sm rounded-xl border-2 ${darkMode ? 'border-gray-600' : 'border-gray-400'} focus:outline-none`}
                    />
                </div>
            )}

            <hr className="border-gray-400 mb-4" />

            <nav className="flex flex-col space-y-2 font-metropolis text-thirdGray text-sm">
                {options.slice(0, 4).map(option => (
                    <Link
                        to={option.url}
                        key={option.id}
                        className={`flex items-center p-2 rounded-md transition-all duration-300 ease-in-out ${selected === option.id ? 'bg-gray-700' : `hover:${darkMode ? 'bg-secontGray text-white' : 'bg-gray-200 text-black'}`}`}
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

            <nav className="flex flex-col space-y-2 font-metropolis">
                {options.slice(4).map(option => (
                    <Link
                        to={option.url}
                        key={option.id}
                        className={`flex items-center p-2 rounded-md transition-all duration-300 ease-in-out ${selected === option.id ? 'bg-gray-700' : `hover:${darkMode ? 'bg-secontGray text-white' : 'bg-gray-200 text-black'}`}`}
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

            <div className={`mt-auto flex flex-col items-center ${isExpanded ? 'mb-4' : 'my-4'} transition-all duration-300 ease-in-out`}>
                <img
                    className="w-12 h-12 rounded-full mb-2"
                    src="https://robohash.org/dalacorte.png"
                    alt="User"
                />
                {isExpanded && (
                    <>
                        <h2 className={`mt-2 text-sm font-metropolis ${darkMode ? 'text-white' : 'text-black'} transition-opacity duration-300 ease-in-out`}>Gabriel Dalacorte</h2>
                        <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-800'} transition-opacity duration-300 ease-in-out`}>gabrieldalacorte@gmail.com</span>
                    </>
                )}
            </div>
        </div>
    );
};

export default Sidebar;
