import React, { useState, useContext } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import Sidebar from '../../components/sidebar';
import { ThemeContext } from '../../utils/ThemeContext';
import Plans1 from '../../assets/tutorials/plans1.png';
import Plans2 from '../../assets/tutorials/plans2.png';
import Plans3 from '../../assets/tutorials/plans3.png';
import Invite1 from '../../assets/tutorials/invite1.png';
import Invite2 from '../../assets/tutorials/invite2.png';
import Invite3 from '../../assets/tutorials/invite3.png';
import EditInfo1 from '../../assets/tutorials/editinfo1.png';
import EditInfo2 from '../../assets/tutorials/editinfo2.png';
import EditInfo3 from '../../assets/tutorials/editinfo3.png';

const TutorialPage = () => {
  const { darkMode } = useContext(ThemeContext);
  const [openSection, setOpenSection] = useState(null);

  const tutorials = [
    {
      id: 1,
      title: "Plano de Vida",
      description: "Aprenda como gerenciar seu Plano de Vida, organizar suas metas e seguir um planejamento eficiente.",
      image: "/images/tutorial-plan-life.png",
      content: "Aqui você pode gerenciar seu plano de vida, definir objetivos e ajustar o tempo de duração do plano. Utilize essa seção para visualizar seu progresso e organizar suas metas pessoais."
    },
    {
      id: 2,
      title: "Planos",
      description: "Saiba como contratar um plano ou alterar o seu atual.",
      images: [Plans1, Plans2, Plans3],
      content: (
        <>
          <p className={`text-sm ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
            Para contratar um plano ou alterar o seu atual siga os passos abaixo:
          </p>
          <ol className="list-decimal pl-4 my-4">
            <li className={`text-sm ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
              Selecione o plano desejado (imagem abaixo).
            </li>
            <img src={Plans1} alt="Selecione o Plano" className="rounded-md shadow-lg my-2 mx-auto" style={{ maxWidth: '100%', width: '100%', maxHeight: 'auto' }} />
            <li className={`text-sm ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
              Clique em <strong>Realizar pagamento</strong> para ir para a página de pagamento (imagem abaixo).
            </li>
            <img src={Plans2} alt="Página de Pagamento" className="rounded-md shadow-lg my-2 mx-auto" style={{ maxWidth: '100%', width: '100%', maxHeight: 'auto' }} />
            <li className={`text-sm ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
              Você será redirecionado para a página de pagamento onde poderá pagar por cartão de crédito e boleto. Após o pagamento bem-sucedido,
              você será redirecionado para o site com seu plano já ativo.
            </li>
            <img src={Plans3} alt="Pagamento Bem-Sucedido" className="rounded-md shadow-lg my-2 mx-auto" style={{ maxWidth: '100%', width: '100%', maxHeight: 'auto' }} />
          </ol>
        </>
      ),
    },
    {
      id: 3,
      title: "Gráficos",
      description: "Veja como acessar gráficos e relatórios detalhados para acompanhar seu progresso.",
      image: "/images/tutorial-graphics.png",
      content: "Acompanhe seus avanços através dos gráficos disponíveis. Veja relatórios detalhados de progresso, comparações de períodos e muito mais."
    },
    {
      id: 4,
      title: "Invite de Usuários",
      description: "Convide outros usuários para participar e compartilhar seus planos de vida com eles.",
      images: [Invite1, Invite2, Invite3],
      content: (
        <>
          <p className={`text-sm ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
            Convite seus amigos e receba prêmios por isso. Como realizar essa ação?
          </p>
          <ol className="list-decimal pl-4 my-4">
            <li className={`text-sm ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
              Clique em <strong>Configurações na side bar</strong> (imagem 1).
            </li>
            <img src={Invite1} alt="Configurações na Side Bar" className="rounded-md shadow-lg my-2 mx-auto" style={{ maxWidth: '100%', width: '100%', maxHeight: 'auto' }} />
            <li className={`text-sm ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
              Vá até o campo de <strong>Convide amigos</strong> e copie o link abaixo destacado na imagem (imagem 2).
            </li>
            <img src={Invite2} alt="Convide Amigos" className="rounded-md shadow-lg my-2 mx-auto" style={{ maxWidth: '100%', width: '100%', maxHeight: 'auto' }} />
            <li className={`text-sm ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
              Envie esse link para seu amigo e espere que ele efetue o cadastro, após efetuar suas pontuações começarão a aumentar e você poderá retirar seu prêmio (imagem 3).
            </li>
            <img src={Invite3} alt="Retirar Prêmio" className="rounded-md shadow-lg my-2 mx-auto" style={{ maxWidth: '100%', width: '100%', maxHeight: 'auto' }} />
          </ol>
        </>
      ),
    },
    {
      id: 5,
      title: "Alterar Informações Pessoais",
      description: "Veja como alterar suas informações pessoais, como foto, nome, telefone e email.",
      images: [EditInfo1, EditInfo2, EditInfo3],
      content: (
        <>
          <p className={`text-sm ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
            Veja como alterar suas informações pessoais.
          </p>
          <ol className="list-decimal pl-4 my-4">
            <li className={`text-sm ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
              Você pode alterar sua foto clicando em <strong>Alterar foto</strong> e selecionando sua imagem de preferência (imagem 1).
              Siga as instruções abaixo do botão para que a imagem receba uma resolução melhor.
            </li>
            <img src={EditInfo1} alt="Alterar Foto" className="rounded-md shadow-lg my-2 mx-auto" style={{ maxWidth: '100%', width: '100%', maxHeight: 'auto' }} />
            <li className={`text-sm ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
              Após clicar em editar, você pode alterar seu nome, telefone ou e-mail (imagem 2).
            </li>
            <img src={EditInfo2} alt="Alterar Campos" className="rounded-md shadow-lg my-2 mx-auto" style={{ maxWidth: '100%', width: '100%', maxHeight: 'auto' }} />
            <li className={`text-sm ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
              Após editar os campos, basta clicar em salvar para alterar as informações ou cancelar (imagem 3).
            </li>
            <img src={EditInfo3} alt="Salvar Informações" className="rounded-md shadow-lg my-2 mx-auto" style={{ maxWidth: '100%', width: '100%', maxHeight: 'auto' }} />
          </ol>
        </>
      ),
    }
  ];

  const toggleSection = (id) => {
    setOpenSection(openSection === id ? null : id);
  };

  return (
    <div className={`flex h-screen ${darkMode ? 'bg-primaryGray' : 'bg-white'}`}>
      <div className="fixed md:relative h-screen">
        <Sidebar />
      </div>
      <main className="flex-grow flex mt-10 flex-col p-4 sm:p-6 overflow-auto">
        <h1 className={`text-2xl font-bold mb-6 text-center ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
          Como usar o Sistema Plano de Vida
        </h1>
        
        {tutorials.map((tutorial) => (
          <div key={tutorial.id} className={`mb-4 ${darkMode ? 'bg-darkGray' : 'bg-gray-50'} shadow-lg rounded-lg`}>
            <button 
              className={`w-full text-left p-4 rounded-lg focus:outline-none flex items-center justify-between ${darkMode ? 'bg-darkGray' : 'bg-gray-200'}`}
              onClick={() => toggleSection(tutorial.id)}
            >
              <div>
                <h2 className={`text-xl font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                  {tutorial.title}
                </h2>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {tutorial.description}
                </p>
              </div>
              {openSection === tutorial.id ? <FaChevronUp className={`text-lg ${darkMode ? 'text-gray-200' : 'text-gray-700'}`} /> : <FaChevronDown className={`text-lg ${darkMode ? 'text-gray-200' : 'text-gray-700'}`} />}
            </button>
            {openSection === tutorial.id && (
              <div className="p-4 sm:p-6">
                <div className="flex flex-col items-center">
                  {typeof tutorial.content === "string" ? (
                    <>
                      <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {tutorial.content}
                      </p>
                      <div className="flex justify-center mt-2">
                        <img
                          src={tutorial.image}
                          alt={tutorial.title}
                          className="rounded-md shadow-lg"
                          style={{ maxWidth: '100%', width: '100%', maxHeight: 'auto' }}
                        />
                      </div>
                    </>
                  ) : (
                    tutorial.content
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </main>
    </div>
  );
};

export default TutorialPage;
