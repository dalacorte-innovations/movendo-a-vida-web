import React, { useEffect, useRef, useState } from 'react';
import { BsArrowRight } from 'react-icons/bs';
import { HiDocument } from "react-icons/hi2";
import { VscGraph } from "react-icons/vsc";
import { IoBriefcase, IoShieldCheckmark } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import BackgroundGif from '../../assets/gifs/gif-laddingpage.gif';
import BackgroundBeneficios from '../../assets/images/background-beneficios.png';
import BackgroundFutureButton from '../../assets/images/background-future-button.png';
import BackgroundFooter from '../../assets/images/background-footer.png';
import { useTranslation } from 'react-i18next';
import i18n from '../../../i18n';

const LandingPage = () => {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [selectedLanguage, setSelectedLanguage] = useState('pt');

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const storedLanguage = localStorage.getItem('Language') || 'pt';
    setSelectedLanguage(storedLanguage);
    i18n.changeLanguage(storedLanguage);
  }, []);

  const handleLanguageChange = (language) => {
    i18n.changeLanguage(language);
    setSelectedLanguage(language);
    localStorage.setItem('Language', language);
    setIsDropdownOpen(false);
  };

  const closeMenuOnOutsideClick = (event) => {
    if (event.target.id === 'modal-background') {
      setIsMenuOpen(false);
    }
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <div className="flex flex-col bg-primaryBlack min-h-screen relative">
      <header className="w-full py-6 bg-primaryGray flex justify-between items-center px-4 lg:px-16">
        <div className="text-primaryWhite text-xl lg:text-2xl font-metropolis cursor-pointer" onClick={() => navigate('/')}>
          {t('Plano de Vida')}
        </div>

        <nav className="hidden md:flex flex-1 justify-center space-x-4 md:space-x-8">
          <ul className="flex space-x-4 md:space-x-8">
            <li className="cursor-pointer text-thirdGray font-metropolis text-sm hover:text-white transition-colors" onClick={() => navigate('/beneficios')}>
              {t('Benefícios')}
            </li>
            <li className="cursor-pointer text-thirdGray font-metropolis text-sm hover:text-white transition-colors" onClick={() => navigate('/plans')}>
              {t('Planos')}
            </li>
            <li className="cursor-pointer text-thirdGray font-metropolis text-sm hover:text-white transition-colors" onClick={() => navigate('/contato')}>
              {t('Contato')}
            </li>
            <li
              className="relative group cursor-pointer text-thirdGray font-metropolis text-sm hover:text-white transition-colors"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              onMouseEnter={() => setIsDropdownOpen(true)}
              ref={dropdownRef}
            >
              <span>{t('Idioma')}</span>
              {isDropdownOpen && (
                <ul className="absolute left-0 mt-1 bg-white text-black rounded-lg shadow-lg z-50 w-[7rem]">
                  <li className="p-2 hover:bg-gray-200 cursor-pointer flex items-center" onClick={() => handleLanguageChange('en')}>
                    <img src="https://upload.wikimedia.org/wikipedia/en/a/a4/Flag_of_the_United_States.svg" alt="English" className="w-5 h-5 mr-2" />
                    English
                  </li>
                  <li className="p-2 hover:bg-gray-200 cursor-pointer flex items-center" onClick={() => handleLanguageChange('es')}>
                    <img src="https://upload.wikimedia.org/wikipedia/en/9/9a/Flag_of_Spain.svg" alt="Español" className="w-5 h-5 mr-2" />
                    Español
                  </li>
                  <li className="p-2 hover:bg-gray-200 cursor-pointer flex items-center" onClick={() => handleLanguageChange('pt')}>
                    <img src="https://upload.wikimedia.org/wikipedia/en/0/05/Flag_of_Brazil.svg" alt="Português" className="w-5 h-5 mr-2" />
                    Português
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </nav>

        <div className="flex gap-4 items-center">
          <button className="hidden md:block w-28 py-2 bg-blue-600 text-sm text-white rounded-xl font-semibold" onClick={() => navigate('/login')}>
            {t('Fazer login')}
          </button>
          <button className="hidden md:block w-28 py-2 bg-secontGray text-sm text-white rounded-xl font-semibold" onClick={() => navigate('/register')}>
            {t('Cadastre-se')}
          </button>

          <button className="block md:hidden text-white text-2xl" onClick={toggleMenu}>
            {isMenuOpen ? <AiOutlineClose /> : <AiOutlineMenu />}
          </button>
        </div>
      </header>

      {isMenuOpen && (
        <div
          id="modal-background"
          className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
          onClick={closeMenuOnOutsideClick}
        >
          <div className="bg-primaryGray p-8 rounded-lg w-4/5 max-w-lg text-center">
            <ul className="space-y-6">
              <li className="cursor-pointer text-white font-metropolis text-lg hover:text-thirdGray transition-colors" onClick={() => { navigate('/beneficios'); toggleMenu(); }}>
                {t('Benefícios')}
              </li>
              <li className="cursor-pointer text-white font-metropolis text-lg hover:text-thirdGray transition-colors" onClick={() => { navigate('/plans'); toggleMenu(); }}>
                {t('Planos')}
              </li>
              <li className="cursor-pointer text-white font-metropolis text-lg hover:text-thirdGray transition-colors" onClick={() => { navigate('/contato'); toggleMenu(); }}>
                {t('Contato')}
              </li>
            </ul>
            <div className="flex flex-col mt-8 space-y-4">
              <button className="w-full py-2 bg-blue-600 text-sm text-white rounded-xl font-semibold" onClick={() => { navigate('/login'); toggleMenu(); }}>
                {t('Fazer login')}
              </button>
              <button className="w-full py-2 bg-secontGray text-sm text-white rounded-xl font-semibold" onClick={() => { navigate('/register'); toggleMenu(); }}>
                {t('Cadastre-se')}
              </button>
            </div>
            <hr className="my-4 w-full border-gray-400" />
            <div className="flex justify-center space-x-4 mt-4">
              <button onClick={() => handleLanguageChange('en')} className="flex items-center space-x-2">
                <img src="https://upload.wikimedia.org/wikipedia/en/a/a4/Flag_of_the_United_States.svg" alt="English" className="w-6 h-6" />
              </button>
              <button onClick={() => handleLanguageChange('es')} className="flex items-center space-x-2">
                <img src="https://upload.wikimedia.org/wikipedia/en/9/9a/Flag_of_Spain.svg" alt="Español" className="w-6 h-6" />
              </button>
              <button onClick={() => handleLanguageChange('pt')} className="flex items-center space-x-2">
                <img src="https://upload.wikimedia.org/wikipedia/en/0/05/Flag_of_Brazil.svg" alt="Português" className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-center bg-primaryBlack">
        <div className="relative w-full h-[50vh] md:w-[90vw] md:h-[90vh] bg-primaryBlack rounded-3xl flex items-center justify-center">
          <section
            className="absolute w-[90%] h-[90%] bg-cover bg-no-repeat bg-center rounded-[2rem] md:rounded-[3.5rem] flex items-center justify-center"
            style={{
              backgroundImage: `url(${BackgroundGif})`,
            }}
          >
            <div className="text-white text-center max-w-xl md:max-w-4xl p-4 flex flex-col items-center justify-center -mt-16 lg:-mt-96">
              <h1 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6 leading-tight">
                {t('Transforme seus valores')} <br /> {t('em metas alcançáveis')}
              </h1>
              <p className="text-xs md:text-sm text-forthyGray mb-6 md:mb-8">
                {t('Defina sua trajetória com clareza e alcance cada marco em sua carreira e vida pessoal. Com um planejamento de 20 anos, você pode transformar seus sonhos em conquistas tangíveis.')}
              </p>
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl text-sm font-semibold" onClick={() => navigate('/plans')}>
                  {t('Ver planos')}
                </button>
                <button className="bg-secontGray hover:bg-gray-700 text-white px-6 py-2 rounded-xl text-sm font-semibold" onClick={() => navigate('/contato')}>
                  {t('Entre em contato')}
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>

      <section className="w-full bg-cover bg-center py-20" style={{ backgroundImage: `url(${BackgroundBeneficios})` }}>
        <div className="text-center mb-12 px-4">
          <h2 className="text-3xl md:text-5xl font-metropolis">{t('Benefícios')}</h2>
          <p className="text-base lg:text-lg text-gray-600 mt-4">
            {t('Conheça os principais benefícios de nossa plataforma e veja como cada recurso pode ajudar você a alcançar suas metas de forma eficiente e segura.')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-8 max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl p-6 shadow-md flex items-start space-x-4">
            <div className="bg-black text-white p-2 rounded-xl">
              <VscGraph size={20} />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">{t('Gráficos Personalizados')}</h3>
              <p className="text-gray-700 text-base">
                {t('Transforme dados em insights visuais com nossos gráficos personalizados. Acompanhe o progresso das suas metas e veja claramente cada conquista ao longo do tempo.')}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md flex items-start space-x-4">
            <div className="bg-black text-white p-2 rounded-xl">
              <HiDocument size={20} />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">{t('Planos Documentados')}</h3>
              <p className="text-gray-700 text-base">
                {t('Tenha seus objetivos documentados de forma organizada e acessível. Nosso portal permite que você registre cada etapa do seu planejamento de maneira clara e detalhada.')}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md flex items-start space-x-4">
            <div className="bg-black text-white p-2 rounded-xl">
              <IoBriefcase size={20} />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">{t('Investimento para o Futuro')}</h3>
              <p className="text-gray-700 text-base">
                {t('Construa um plano sólido para o futuro que você sempre sonhou. Nossas ferramentas de planejamento ajudam a definir metas claras e estratégias para alcançá-las.')}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md flex items-start space-x-4">
            <div className="bg-black text-white p-2 rounded-xl">
              <IoShieldCheckmark size={20} />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">{t('Segurança Garantida')}</h3>
              <p className="text-gray-700 text-base">
                {t('Mantenha suas informações seguras e acessíveis apenas para você. Nosso sistema utiliza as melhores práticas de segurança para proteger seus dados.')}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full bg-primaryBlack py-16 px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mx-auto">{t('O que nossos investidores estão falando')}</h2>
          <p className="text-base lg:text-lg text-gray-400 mt-4 max-w-2xl mx-auto">{t('Confira o que nossos usuários dizem e descubra como nossa plataforma tem ajudado a transformar metas em conquistas reais.')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[...Array(6)].map((_, index) => {
            const users = [
              { name: "Mariana Oliveira", profession: t("Empresária") },
              { name: "Paulo Ferreira", profession: t("Consultor Financeiro") },
              { name: "Ana Clara Souza", profession: t("Engenheira") },
              { name: "Rafael Menezes", profession: t("Advogado") },
              { name: "Júlia Albuquerque", profession: t("Médica") },
              { name: "Lucas Martins", profession: t("Desenvolvedor de Software") }
            ];

            const user = users[index];

            return (
              <div key={index} className="bg-gradient-to-b from-[#0A0A0A80] to-[#1C1C1C80] border border-gray-600 rounded-3xl p-6 shadow-lg flex flex-col justify-between">
                <div className="flex items-center mb-4">
                  <div className="flex items-center text-primaryPink text-xl">
                    {"★".repeat(5)}
                  </div>
                  <span className="ml-2 text-thirdGray text-sm">5.0</span>
                </div>
                <p className="text-thirdGray text-sm mb-2">
                  {index === 0 ? t("Esta plataforma mudou a maneira como planejo meu futuro. Agora posso acompanhar o progresso das minhas metas com muito mais clareza.") :
                    index === 1 ? t("Fantástico! Com esta ferramenta, consegui organizar minhas finanças e meus objetivos de uma forma prática e eficiente.") :
                      index === 2 ? t("Nunca foi tão fácil definir metas de longo prazo e trabalhar para alcançá-las. Recomendo para todos!") :
                        index === 3 ? t("Ferramenta excelente para quem quer ter controle sobre os objetivos de vida. Me ajudou a planejar melhor meu futuro.") :
                          index === 4 ? t("Recomendo esta plataforma a todos que buscam um planejamento eficiente e com foco em resultados. Excelente!") :
                            t("Muito fácil de usar e extremamente útil para manter o foco nas minhas metas pessoais e profissionais.")}
                </p>
                <div className="flex items-center">
                  <img src={`https://robohash.org/${user.name}.png`} alt={`Avatar de ${user.name}`} className="rounded-full w-10 h-10 mr-4 flex-shrink-0" />
                  <div className="min-h-[50px] flex flex-col justify-center">
                    <p className="text-white font-semibold">{user.name}</p>
                    <p className="text-thirdGray text-sm">{user.profession}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="w-[90%] mx-auto py-12 mb-16 flex justify-center items-center rounded-[2rem]" style={{ backgroundImage: `url(${BackgroundFutureButton})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="text-center max-w-3xl">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6">{t('Pronto para transformar seu futuro?')}</h2>
          <p className="text-sm text-white mb-6">{t('Não espere mais para começar sua jornada rumo ao sucesso. Com nossas ferramentas, você pode planejar, acompanhar e alcançar suas metas de forma eficiente. O futuro que você deseja está a um clique de distância.')}</p>
          <button className="bg-white text-black font-semibold py-2 px-6 rounded-full" onClick={() => navigate('/register')}>
            {t('Crie uma conta')}
          </button>
        </div>
      </section>

      <section className="w-full flex flex-col justify-center items-center" style={{ backgroundImage: `url(${BackgroundFooter})`, backgroundSize: 'cover', backgroundPosition: 'center', paddingTop: '4rem', paddingBottom: '2rem' }}>
        <div className="text-center mb-16">
          <h1 className="text-primaryWhite text-xl font-metropolis">{t('Plano de Vida')}</h1>
          <nav className="flex justify-center space-x-4 md:space-x-8 mt-4">
            <a href="/beneficios" className="text-thirdGray text-lg hover:text-white">{t('Benefícios')}</a>
            <a href="/plans" className="text-thirdGray text-lg hover:text-white">{t('Planos')}</a>
            <a href="/contato" className="text-thirdGray text-lg hover:text-white">{t('Contato')}</a>
          </nav>
        </div>

        <div className="text-center max-w-2xl">
          <h2 className="text-2xl font-semibold text-white mb-4">{t('Pronto para transformar seu futuro?')}</h2>
          <p className="text-thirdGray text-base mb-6">{t('Não espere mais para começar sua jornada rumo ao sucesso.')}</p>
          <div className="flex justify-center gap-4 mb-6">
            <button className="bg-blue-500 text-white font-semibold px-6 py-2 rounded-xl" onClick={() => navigate('/login')}>
              {t('Fazer login')}
            </button>
            <button className="bg-white text-black font-semibold px-6 py-2 rounded-xl" onClick={() => navigate('/register')}>
              {t('Cadastre-se')}
            </button>
          </div>
        </div>
        <footer className="w-[90%] md:w-[80%] flex flex-col justify-center items-center text-white text-sm px-4 mt-14">
          <hr className="border-gray-400 my-4 w-full" />
          <div className="w-full flex justify-between items-center">
            <span>© 2024 | {t('Desenvolvido por Dalacorte Innovations')}</span>
            <div className="flex gap-4">
              <a href="#" className="hover:underline">{t('Política de privacidade')}</a>
              <a href="#" className="hover:underline">{t('Política de cookies')}</a>
            </div>
          </div>
        </footer>
      </section>
    </div>
  );
};

export default LandingPage;
