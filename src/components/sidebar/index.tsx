import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
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

const Sidebar = () => {
    const [selected, setSelected] = useState(null);
    const [isExpanded, setIsExpanded] = useState(true);

    const options = [
        { id: 1, name: 'Home', icon: HiHome, url: '/' },
        { id: 2, name: 'Planos', icon: HiBuildingStorefront, url: '/plans', hasDropdown: false },
        { id: 3, name: 'Notificações', icon: IoNotifications, url: '#' },
        { id: 4, name: 'Favoritos', icon: FaStar, url: '#' },
        { id: 5, name: 'Ajuda', icon: IoMdHelpCircle, url: '#' },
        { id: 6, name: 'Configurações', icon: BsFillGearFill, url: '#' },
        { id: 7, name: 'Sair', icon: IoExitSharp, url: '/logout'}
    ];

    const toggleSidebar = () => {
        setIsExpanded(!isExpanded);
    };

    const handleButtonClick = (url) => {
        if (url === "#") {
            toast.info("Funcionalidade em desenvolvimento");
        }
    };

    return (
        <div className={`flex flex-col h-[100%] bg-primaryBlack transition-all duration-300 ${isExpanded ? 'w-64 p-8' : 'w-16 p-4'}`}>
            <div className="flex items-center justify-between mb-8">
                {isExpanded && <h1 className="text-lg font-metropolis text-white transition-opacity duration-300 ease-in-out">Plano de Vida</h1>}
                <button 
                    className="bg-primaryPurple w-8 h-8 rounded-full flex items-center justify-center text-white"
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
                        className="w-full pl-4 pr-4 py-2 bg-primaryGray text-sm text-white rounded-xl border-2 border-gray-600 focus:outline-none"
                    />
                </div>
            )}

            <hr className="border-gray-400 mb-4" />

            <nav className="flex flex-col space-y-2 font-metropolis text-thirdGray text-sm">
                {options.slice(0, 4).map(option => (
                    <Link
                        to={option.url}
                        key={option.id}
                        className={`flex items-center p-2 rounded-md transition-all duration-300 ease-in-out ${
                            selected === option.id ? 'bg-gray-700' : 'hover:bg-secontGray hover:text-white'
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

            <nav className="flex flex-col space-y-2 font-metropolis text-thirdGray">
                {options.slice(4).map(option => (
                    <Link
                        to={option.url}
                        key={option.id}
                        className={`flex items-center p-2 rounded-md transition-all duration-300 ease-in-out ${
                            selected === option.id ? 'bg-gray-700' : 'hover:bg-secontGray hover:text-white'
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

            <div className={`mt-auto flex flex-col items-center ${isExpanded ? 'mb-4' : 'my-4'} transition-all duration-300 ease-in-out`}>
                <img
                    className="w-12 h-12 rounded-full mb-2"
                    src="https://robohash.org/dalacorte.png"
                    alt="User"
                />
                {isExpanded && (
                    <>
                        <h2 className="mt-2 text-sm font-metropolis text-white transition-opacity duration-300 ease-in-out">Gabriel Dalacorte</h2>
                        <span className="text-xs text-gray-500 transition-opacity duration-300 ease-in-out">gabrieldalacorte@gmail.com</span>
                    </>
                )}
            </div>
        </div>
    );
};

export default Sidebar;
