"use client"

import React, { useContext, useState, useEffect, useRef } from 'react';
import Sidebar from '../../components/sidebar';
import { ThemeContext } from '../../utils/ThemeContext.jsx';
import { IoPencil, IoSave, IoClose, IoCloudUploadOutline, IoShareSocialOutline, IoPersonCircleOutline, IoMailOutline, IoPhonePortraitOutline } from "react-icons/io5";
import { MdContentCopy } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { getPicture, getName, getPhone, getEmail, saveImageUrl, getFromStorage, getReferralCount } from '../../utils/storage';
import { configBackendConnection, endpoints, getAuthHeaders, getFileUploadHeaders } from '../../utils/backendConnection';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinnerNotTimer.jsx';
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

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [animateIn, setAnimateIn] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const waveCanvasRef = useRef<HTMLCanvasElement>(null);
  const waveAnimationRef = useRef<number>();
  
  const referralCode = getFromStorage('referral_code') || 'default_code';
  const referralCount = getReferralCount() || 0;

  useEffect(() => {
    setAnimateIn(true);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const canvas = waveCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const waves = [
      { 
        amplitude: 50, 
        period: 0.02, 
        speed: 0.01, 
        phase: 0, 
        color: darkMode 
          ? 'rgba(219, 39, 119, 0.3)' // Pink in dark mode
          : 'rgba(59, 130, 246, 0.15)', // Blue in light mode
        lineWidth: 3 
      },
      { 
        amplitude: 30, 
        period: 0.03, 
        speed: 0.015, 
        phase: 2, 
        color: darkMode 
          ? 'rgba(139, 92, 246, 0.3)' // Purple in dark mode
          : 'rgba(37, 99, 235, 0.15)', // Darker blue in light mode
        lineWidth: 2 
      },
      { 
        amplitude: 70, 
        period: 0.01, 
        speed: 0.005, 
        phase: 4, 
        color: darkMode 
          ? 'rgba(236, 72, 153, 0.2)' // Pink in dark mode
          : 'rgba(96, 165, 250, 0.1)', // Lighter blue in light mode
        lineWidth: 4 
      }
    ];

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      waves.forEach(wave => {
        wave.phase += wave.speed;
        
        ctx.beginPath();
        ctx.lineWidth = wave.lineWidth;
        ctx.strokeStyle = wave.color;
        
        ctx.moveTo(0, canvas.height / 2 + Math.sin(wave.phase) * wave.amplitude);
        
        for (let x = 0; x < canvas.width; x++) {
          const y = canvas.height / 2 + Math.sin(wave.period * x + wave.phase) * wave.amplitude;
          ctx.lineTo(x, y);
        }
        
        ctx.stroke();
      });
      
      waveAnimationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (waveAnimationRef.current) {
        cancelAnimationFrame(waveAnimationRef.current);
      }
    };
  }, [darkMode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const particles: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      connections: Array<number>;
      opacity: number;
    }> = [];

    const particleCount = 50;
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        connections: [],
        opacity: Math.random() * 0.5 + 0.2
      });
    }

    const connectParticles = () => {
      const maxDistance = 150;
      
      particles.forEach(p => p.connections = []);
      
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < maxDistance) {
            particles[i].connections.push(j);
          }
        }
      }
    };

    connectParticles();

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((particle, index) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;
        
        particle.x = Math.max(0, Math.min(canvas.width, particle.x));
        particle.y = Math.max(0, Math.min(canvas.height, particle.y));
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = darkMode 
          ? `rgba(219, 39, 119, ${particle.opacity})` // Pink in dark mode
          : `rgba(59, 130, 246, ${particle.opacity * 0.7})`; // Blue in light mode
        ctx.fill();
        
        particle.connections.forEach(connectedIndex => {
          const connectedParticle = particles[connectedIndex];
          const dx = particle.x - connectedParticle.x;
          const dy = particle.y - connectedParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const opacity = 1 - distance / 150;
          
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(connectedParticle.x, connectedParticle.y);
          ctx.strokeStyle = darkMode 
            ? `rgba(236, 72, 153, ${opacity * 0.3})` // Pink in dark mode
            : `rgba(37, 99, 235, ${opacity * 0.15})`; // Blue in light mode
          ctx.lineWidth = 1;
          ctx.stroke();
        });
      });
      
      if (Math.random() < 0.05) {
        connectParticles();
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [darkMode]);

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
            'Content-Type': 'application/json',
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

  return (
    <div className={`flex h-screen overflow-hidden ${darkMode ? 'bg-[#0F172A]' : 'bg-[#f0f7ff]'}`}>
      <div className={`fixed md:relative ${
        darkMode ? 'bg-slate-800/70 border-r border-slate-700/50' : 'bg-white/80 border-r border-blue-100'
      } h-full z-10`}>
        <Sidebar />
      </div>

      <canvas 
        ref={waveCanvasRef} 
        className="fixed inset-0 pointer-events-none z-0"
      />
      
      <canvas 
        ref={canvasRef} 
        className="fixed inset-0 pointer-events-none z-0"
      />

      {loading && <LoadingSpinner isLoading={loading} />}

      <main className="flex-grow p-4 md:p-6 lg:p-8 md:ml-16 overflow-auto relative z-10">
        <div className="max-w-5xl mx-auto">
          <div 
            className={`relative overflow-hidden rounded-2xl shadow-xl backdrop-blur-md mb-6 ${
              darkMode ? 'bg-slate-800/70 border border-slate-700/50' : 'bg-white/80 border border-blue-100'
            } transform transition-all duration-500 ease-out ${animateIn ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
          >
            <div className="absolute inset-0 overflow-hidden">
              <div 
                className={`absolute -inset-[10px] rounded-full opacity-30 blur-3xl ${
                  darkMode ? 'bg-pink-500' : 'bg-blue-400'
                }`}
                style={{
                  top: mousePosition.y * 0.05,
                  left: mousePosition.x * 0.05,
                  transition: 'all 0.3s ease-out',
                  width: '50%',
                  height: '50%'
                }}
              />
            </div>

            <div className="relative p-6 md:p-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                  {t("Configurações da Conta")}
                </h1>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className={`group flex items-center justify-center py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
                      isEditing
                        ? darkMode
                          ? 'bg-emerald-900/30 text-emerald-400 hover:bg-emerald-900/50 border border-emerald-800/30'
                          : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                        : darkMode
                          ? 'bg-pink-900/30 text-pink-400 hover:bg-pink-900/50 border border-pink-800/30'
                          : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
                    }`}
                    onClick={handleSave}
                  >
                    {isEditing ? <IoSave className="mr-2" /> : <IoPencil className="mr-2" />}
                    <span>{isEditing ? t('Salvar') : t('Editar')}</span>
                  </button>
                  {isEditing && (
                    <button
                      type="button"
                      className={`group flex items-center justify-center py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
                        darkMode
                          ? 'bg-slate-700/50 text-slate-300 hover:bg-slate-700 border border-slate-600/50'
                          : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                      }`}
                      onClick={handleCancel}
                    >
                      <IoClose className="mr-2" />
                      <span>{t("Cancelar")}</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-1/3">
                  <div 
                    className={`relative overflow-hidden rounded-xl shadow-md backdrop-blur-md ${
                      darkMode ? 'bg-slate-800/50 border border-slate-700/50' : 'bg-white/90 border border-blue-100'
                    }`}
                  >
                    <div className="p-6 flex flex-col items-center">
                      <div className="relative group">
                        <div 
                          className={`w-32 h-32 rounded-full overflow-hidden border-4 ${
                            darkMode ? 'border-pink-500/30' : 'border-blue-500/30'
                          } transition-all duration-300 group-hover:border-opacity-100`}
                        >
                          <img 
                            src={profilePicUrl || "/placeholder.svg"} 
                            alt={t("Foto de perfil")} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div 
                          className={`absolute inset-0 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                            darkMode ? 'bg-slate-900/70' : 'bg-slate-700/50'
                          }`}
                        >
                          <label 
                            htmlFor="file-upload" 
                            className="cursor-pointer flex items-center justify-center w-full h-full"
                          >
                            <IoCloudUploadOutline className="text-3xl text-white" />
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            id="file-upload"
                            onChange={handleFileChange}
                          />
                        </div>
                      </div>
                      <h2 className={`mt-4 text-lg font-semibold ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                        {formData.nomeCompleto}
                      </h2>
                      <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        {formData.email}
                      </p>
                      <label 
                        htmlFor="file-upload" 
                        className={`mt-4 flex items-center justify-center py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer ${
                          darkMode
                            ? 'bg-pink-900/30 text-pink-400 hover:bg-pink-900/50 border border-pink-800/30'
                            : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
                        }`}
                      >
                        <IoCloudUploadOutline className="mr-2" />
                        {t("Alterar foto")}
                      </label>
                      <p className={`mt-3 text-xs text-center ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                        {t("A foto deve ter pelo menos 800x800px. JPG ou PNG são permitidos.")}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="w-full md:w-2/3 space-y-6">
                  <div 
                    className={`relative overflow-hidden rounded-xl shadow-md backdrop-blur-md ${
                      darkMode ? 'bg-slate-800/50 border border-slate-700/50' : 'bg-white/90 border border-blue-100'
                    }`}
                  >
                    <div className="p-6">
                      <h3 className={`text-lg font-semibold mb-4 flex items-center ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                        <IoPersonCircleOutline className={`mr-2 ${darkMode ? 'text-pink-400' : 'text-blue-600'}`} />
                        {t("Informações pessoais")}
                      </h3>

                      <div className="space-y-4">
                        <div>
                          <label className={`block mb-2 text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                            {t("Nome completo")}
                          </label>
                          {isEditing ? (
                            <input
                              type="text"
                              className={`w-full px-4 py-3 rounded-lg transition-colors ${
                                darkMode 
                                  ? 'bg-slate-700/50 text-white border border-slate-600/50 focus:border-pink-500/50' 
                                  : 'bg-white text-slate-800 border border-slate-200 focus:border-blue-300'
                              } focus:outline-none`}
                              value={formData.nomeCompleto}
                              onChange={(e) => setFormData({ ...formData, nomeCompleto: e.target.value })}
                            />
                          ) : (
                            <div className={`px-4 py-3 rounded-lg ${
                              darkMode ? 'bg-slate-700/30 text-white' : 'bg-slate-50 text-slate-800'
                            }`}>
                              {formData.nomeCompleto}
                            </div>
                          )}
                        </div>

                        <div>
                          <label className={`block mb-2 text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                            {t("Telefone")}
                          </label>
                          {isEditing ? (
                            <div className="relative">
                              <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${
                                darkMode ? 'text-slate-400' : 'text-slate-500'
                              }`}>
                                <IoPhonePortraitOutline />
                              </div>
                              <input
                                type="text"
                                className={`w-full pl-10 pr-4 py-3 rounded-lg transition-colors ${
                                  darkMode 
                                    ? 'bg-slate-700/50 text-white border border-slate-600/50 focus:border-pink-500/50' 
                                    : 'bg-white text-slate-800 border border-slate-200 focus:border-blue-300'
                                } focus:outline-none`}
                                value={formData.telefone}
                                onChange={handlePhoneChange}
                              />
                            </div>
                          ) : (
                            <div className={`px-4 py-3 rounded-lg flex items-center ${
                              darkMode ? 'bg-slate-700/30 text-white' : 'bg-slate-50 text-slate-800'
                            }`}>
                              <IoPhonePortraitOutline className={`mr-2 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                              {formData.telefone}
                            </div>
                          )}
                        </div>

                        <div>
                          <label className={`block mb-2 text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                            {t("E-mail")}
                          </label>
                          {isEditing ? (
                            <div className="relative">
                              <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${
                                darkMode ? 'text-slate-400' : 'text-slate-500'
                              }`}>
                                <IoMailOutline />
                              </div>
                              <input
                                type="email"
                                className={`w-full pl-10 pr-4 py-3 rounded-lg transition-colors ${
                                  darkMode 
                                    ? 'bg-slate-700/50 text-white border border-slate-600/50 focus:border-pink-500/50' 
                                    : 'bg-white text-slate-800 border border-slate-200 focus:border-blue-300'
                                } focus:outline-none`}
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              />
                            </div>
                          ) : (
                            <div className={`px-4 py-3 rounded-lg flex items-center ${
                              darkMode ? 'bg-slate-700/30 text-white' : 'bg-slate-50 text-slate-800'
                            }`}>
                              <IoMailOutline className={`mr-2 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                              {formData.email}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div 
                    className={`relative overflow-hidden rounded-xl shadow-md backdrop-blur-md ${
                      darkMode ? 'bg-slate-800/50 border border-slate-700/50' : 'bg-white/90 border border-blue-100'
                    }`}
                  >
                    <div className="p-6">
                      <h3 className={`text-lg font-semibold mb-4 flex items-center ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                        <IoShareSocialOutline className={`mr-2 ${darkMode ? 'text-pink-400' : 'text-blue-600'}`} />
                        {t("Programa de indicação")}
                      </h3>

                      <p className={`mb-4 text-sm ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                        {t("Convide seus amigos para criarem um plano de vida e ganhe bônus.")}
                      </p>

                      <div className={`p-4 rounded-lg mb-4 ${
                        darkMode ? 'bg-slate-700/30 border border-slate-600/30' : 'bg-blue-50/50 border border-blue-100'
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                            {t("Seu link de indicação")}
                          </span>
                          <span className={`text-xs ${darkMode ? 'text-pink-400' : 'text-blue-600'}`}>
                            {referralCount} {t("pessoas usaram")}
                          </span>
                        </div>
                        <div className="relative">
                          <input
                            type="text"
                            className={`w-full pl-4 pr-12 py-3 rounded-lg transition-colors ${
                              darkMode 
                                ? 'bg-slate-800/70 text-white border border-slate-600/50' 
                                : 'bg-white text-slate-800 border border-slate-200'
                            } focus:outline-none cursor-not-allowed`}
                            value={`${configBackendConnection.frontURL}/register/${referralCode}`}
                            readOnly
                          />
                          <button
                            type="button"
                            className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-md transition-colors ${
                              darkMode 
                                ? 'bg-slate-700 hover:bg-slate-600 text-slate-300' 
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                            }`}
                            onClick={handleCopyLink}
                            title={t("Copiar link")}
                          >
                            <MdContentCopy />
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          type="button"
                          className={`group relative flex items-center justify-center py-3 px-4 rounded-lg font-medium text-sm text-white overflow-hidden transition-all duration-300 flex-1`}
                        >
                          <div className={`absolute inset-0 ${
                            darkMode
                              ? 'bg-gradient-to-r from-pink-600 to-purple-600' 
                              : 'bg-gradient-to-r from-blue-600 to-indigo-600'
                          } transition-transform duration-300 group-hover:scale-105`} />
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-white transition-opacity duration-300" />
                          <span className="relative z-10 flex items-center">
                            {t("Retirar bônus")}
                          </span>
                        </button>
                        <button
                          type="button"
                          className={`flex items-center justify-center py-3 px-4 rounded-lg text-sm font-medium transition-colors flex-1 ${
                            darkMode 
                              ? 'bg-slate-700/50 text-slate-300 hover:bg-slate-700 border border-slate-600/50' 
                              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                          }`}
                          onClick={handleDiscard}
                        >
                          {t("Voltar para Home")}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ConfigPage;
