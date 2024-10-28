import React, { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import Sidebar from '../../components/sidebar';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../../utils/ThemeContext.jsx';
import { getAuthHeaders, endpoints, configBackendConnection } from '../../utils/backendConnection';
import { toast } from 'react-toastify';

const FeedbackPage = () => {
  const { darkMode } = useContext(ThemeContext);
  const { t } = useTranslation();
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [category, setCategory] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [charCount, setCharCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleRatingChange = (value) => setRating(value);
  const handleFeedbackChange = (e) => {
    setFeedback(e.target.value);
    setCharCount(e.target.value.length);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating || !feedback || !category) {
      toast.error(t("Por favor, preencha todos os campos obrigatórios."));
      return;
    }

    const feedbackData = {
      stars: rating,
      comment: feedback,
      category,
      feedback_mode: isPublic ? 'public' : 'private',
    };

    try {
      setIsSubmitting(true);
      const response = await fetch(`${configBackendConnection.baseURL}/${endpoints.feedbackAPI}`, {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedbackData),
      });

      if (response.ok) {
        toast.success(t("Feedback enviado com sucesso!"));
        navigate('/');
      } else {
        toast.error(t("Ocorreu um erro ao enviar o feedback."));
      }
    } catch (error) {
      toast.error(t("Erro de conexão. Tente novamente mais tarde."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`flex h-screen overflow-y-auto ${darkMode ? 'bg-primaryGray' : 'bg-white'}`}>
      <div className={`fixed md:relative h-screen ${darkMode ? 'bg-darkGray' : 'bg-gray-200'}`}>
        <Sidebar />
      </div>
      <main className={`ml-0 flex flex-col w-full mt-20 p-4 md:p-10`}>
        <div className="w-full max-w-2xl mx-auto">
          <h1 className={`text-2xl font-metropolis mb-4 ${darkMode ? 'text-white' : 'text-black'}`}>
            {t('Sua Opinião é Importante')}
          </h1>
          <p className={`text-md mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-700'}`}>
            {t('Compartilhe suas sugestões, elogios ou críticas para ajudar a melhorar nossos serviços.')}
          </p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className={`block mb-2 font-metropolis ${darkMode ? 'text-white' : 'text-black'}`}>
                {t('Como você avalia sua experiência?')}
              </label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => handleRatingChange(star)}
                    className={`text-xl ${star <= rating ? 'text-yellow-500' : 'text-gray-400'}`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className={`block mb-2 font-metropolis ${darkMode ? 'text-white' : 'text-black'}`}>
                {t('Deixe um comentário')}
              </label>
              <textarea
                maxLength={500}
                rows={5}
                className={`w-full p-3 rounded-lg border-2 focus:outline-none resize-none ${darkMode ? 'bg-primaryGray text-white border-gray-600' : 'bg-gray-100 text-black border-gray-400'}`}
                placeholder={t("Escreva seu feedback...")}
                value={feedback}
                onChange={handleFeedbackChange}
              />
              <p className="text-right text-sm text-gray-500">{charCount}/500</p>
            </div>

            <div>
              <label className={`block mb-2 font-metropolis ${darkMode ? 'text-white' : 'text-black'}`}>
                {t('Categoria')}
              </label>
              <select
                className={`w-full p-3 rounded-lg border-2 focus:outline-none ${darkMode ? 'bg-primaryGray text-white border-gray-600' : 'bg-gray-100 text-black border-gray-400'}`}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="" disabled>
                  {t("Selecione uma categoria")}
                </option>
                <option value="problema_tecnico">{t("Problema técnico")}</option>
                <option value="sugestao_melhoria">{t("Sugestão de melhoria")}</option>
                <option value="elogio">{t("Elogio")}</option>
              </select>
            </div>

            <div className="flex items-center space-x-4">
              <label className={`font-metropolis ${darkMode ? 'text-white' : 'text-black'}`}>{t("Modo de Feedback:")}</label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="visibility"
                  value="public"
                  checked={isPublic}
                  onChange={() => setIsPublic(true)}
                />
                <span className={`${darkMode ? 'text-gray-400' : 'text-gray-700'}`}>{t("Público")}</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="visibility"
                  value="private"
                  checked={!isPublic}
                  onChange={() => setIsPublic(false)}
                />
                <span className={`${darkMode ? 'text-gray-400' : 'text-gray-700'}`}>{t("Privado")}</span>
              </label>
            </div>

            <div className="flex justify-between mt-4">
              <button
                type="button"
                className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-600 text-white hover:bg-gray-700' : 'bg-gray-300 text-black hover:bg-gray-400'}`}
                onClick={() => navigate('/')}
              >
                {t("Cancelar")}
              </button>
              <button
                type="submit"
                className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                disabled={isSubmitting}
              >
                {t("Enviar Feedback")}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default FeedbackPage;
