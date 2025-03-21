import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaPlane } from "react-icons/fa";
import { FaBagShopping } from "react-icons/fa6";
import React from 'react';
import Sidebar from '../../components/sidebar';
import { ThemeContext } from '../../utils/ThemeContext.jsx';
import { useTranslation } from 'react-i18next';

function HomePage() {
    const [hoveredButton, setHoveredButton] = useState(null);
    const { darkMode } = useContext(ThemeContext);
    const { t } = useTranslation();

    const buttons = [
        { id: 1, icon: FaPlane, name: t('Plano de Viagem'), url: '#' },
        { id: 2, icon: FaBagShopping, name: t('Plano de Vida'), url: '/life-plan/dashboard' },
    ];

    const handleButtonClick = (url) => {
        if (url === "#") {
            toast.info(t("Funcionalidade em desenvolvimento"));
        }
    };

    return (
        <div className={`flex h-screen ${darkMode ? 'bg-primaryGray' : 'bg-gray-100'}`}>
            <Sidebar />
            <main className="h-screen flex flex-col items-center justify-center w-full">
                <nav className="w-full flex flex-col items-center justify-center">
                    <div className="flex flex-col md:mt-20 mt-10 mb-10 w-full items-center">
                        <div className="flex flex-col md:flex-row justify-center items-center w-full gap-6 md:gap-20" id="home-page-button-content">
                            {buttons.map(button => (
                                <Link to={button.url} key={button.id} className="mt-4 w-full md:w-auto" id={`home-page-button-link-${button.id}`}>
                                    <button
                                        className={`w-full md:w-48 h-16 rounded-lg flex items-center justify-center transition-colors duration-300 ${
                                            hoveredButton === button.id
                                                ? 'bg-gray-700'
                                                : darkMode
                                                ? 'bg-primaryGray'
                                                : 'bg-primaryBlack'
                                        } hover:bg-gray-700 text-sm`}
                                        onMouseEnter={() => setHoveredButton(button.id)}
                                        onMouseLeave={() => setHoveredButton(null)}
                                        onClick={() => handleButtonClick(button.url)}
                                        id={`home-page-button-${button.id}`}
                                    >
                                        <div className="flex items-center justify-center gap-2 m-1" id={`home-page-button-icon-container-${button.id}`}>
                                            <button.icon
                                                className={`${darkMode ? 'text-white' : 'text-white'}`}
                                                id={`home-page-button-icon-${button.id}`}
                                            />
                                            <span
                                                className={`text-sm ${hoveredButton === button.id ? 'font-metropolis' : 'font-metropolis'} ${
                                                    darkMode ? 'text-white' : 'text-white'
                                                }`}
                                                id={`home-page-button-text-${button.id}`}
                                            >
                                                {button.name}
                                            </span>
                                        </div>
                                    </button>
                                </Link>
                            ))}
                        </div>
                    </div>
                </nav>
            </main>
        </div>
    );
}

export default HomePage;
