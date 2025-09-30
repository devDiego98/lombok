import React, { Suspense, useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere } from "@react-three/drei";
import {
  Mountain,
  Snowflake,
  ArrowLeft,
  Calendar,
  Users,
  Play,
  X,
  Home,
  Utensils,
  Shield,
  BookOpen,
  Activity,
  AlertTriangle,
  MessageCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

import {
  usePreloadedSnowboardPackages,
  usePreloadedSnowboardInfo,
} from "../contexts/DataContext";
import { useContactInfo } from "../hooks/useFirebaseData";
import { useVideoByType } from "../hooks/useVideoData";
import { mergeCategoriesWithStyles } from "../constants/categoryStyles";
import {
  SNOWBOARD_PAGE_CONSTANTS,
  getSnowboardIcon,
} from "../constants/snowboardPageConstants";

// Icon mapping for package detail categories
const getIconComponent = (iconName: string) => {
  const iconMap: { [key: string]: any } = {
    Home,
    Utensils,
    Shield,
    BookOpen,
    Activity,
    AlertTriangle,
  };

  // Handle both string names and actual icon components
  if (typeof iconName === "string") {
    return iconMap[iconName] || Home;
  }

  // If it's already a component, return it
  return iconName || Home;
};

// Copos de nieve con parallax - mucho más pequeños
const SnowFlakes = ({ layer = 1 }) => {
  const snowflakes = useMemo(() => {
    const count = layer === 1 ? 200 : layer === 2 ? 150 : 100;
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      position: [
        (Math.random() - 0.5) * 25,
        Math.random() * 20 + 15,
        (Math.random() - 0.5) * 25,
      ] as [number, number, number],
      scale: Math.random() * 0.03 + 0.01, // Mucho más pequeños
      speed: (Math.random() * 0.015 + 0.005) * layer,
      drift: Math.random() * 0.008 - 0.004,
    }));
  }, [layer]);

  return (
    <>
      {snowflakes.map((flake) => (
        <SnowFlake key={flake.id} {...flake} />
      ))}
    </>
  );
};

// Copo de nieve simple y pequeño
const SnowFlake = ({
  position,
  scale,
  speed,
  drift,
}: {
  position: [number, number, number];
  scale: number;
  speed: number;
  drift: number;
}) => {
  const ref = useRef<any>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y -= speed;
      ref.current.position.x += Math.sin(state.clock.elapsedTime * 2) * drift;
      ref.current.rotation.z += 0.02;

      if (ref.current.position.y < -15) {
        ref.current.position.y = 20;
        ref.current.position.x = (Math.random() - 0.5) * 25;
      }
    }
  });

  return (
    <Sphere ref={ref} args={[scale, 6, 6]} position={position}>
      <meshStandardMaterial
        color="#ffffff"
        transparent
        opacity={0.8}
        emissive="#ffffff"
        emissiveIntensity={0.1}
      />
    </Sphere>
  );
};

// Componente de parallax scrolling
const ParallaxSection = ({
  children,
  speed = 0.5,
  className = "",
}: {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}) => {
  const [offsetY, setOffsetY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setOffsetY(window.pageYOffset);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={className}
      style={{ transform: `translateY(${offsetY * speed}px)` }}
    >
      {children}
    </div>
  );
};

const SnowboardTrip = () => {
  // Debug logging
  console.log("SnowboardTrip component rendered");

  // Estado para el modal de video
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Get video data from Firebase
  const {
    videoUrl,
    loading: videoLoading,
    error: videoError,
  } = useVideoByType("snowboard");

  // Get preloaded snowboard data from context
  const {
    packages: snowboardPackages,
    featuredPackage,
    error: packagesError,
  } = usePreloadedSnowboardPackages();

  // Get preloaded snowboard info (including package detail categories) from context
  const { data: snowboardInfo, error: snowboardInfoError } =
    usePreloadedSnowboardInfo();

  // Get contact info for WhatsApp functionality
  const { contactInfo } = useContactInfo();

  // Extract hero background with fallbacks
  const heroBackground = snowboardInfo?.heroBackground || {
    primary: {
      src: "/assets/snowboardBanner.jpg",
      alt: "Snow-covered mountain landscape",
    },
    fallback: {
      src: "/assets/snowboardBanner.jpg",
      alt: "Winter mountain scene",
    },
  };

  // Extract data with fallbacks
  const snowboardPackage =
    featuredPackage ||
    (snowboardPackages && snowboardPackages.length > 0
      ? snowboardPackages[0]
      : null);
  const snowboardFeatures = SNOWBOARD_PAGE_CONSTANTS.features;
  const packageDetailCategories = mergeCategoriesWithStyles(
    snowboardInfo?.packageDetailCategories || []
  );

  const error = packagesError || snowboardInfoError;

  // Función para abrir el modal de video
  const openVideoModal = () => {
    setIsVideoModalOpen(true);
    document.body.style.overflow = "hidden"; // Prevenir scroll
  };

  // Función para cerrar el modal de video
  const closeVideoModal = () => {
    setIsVideoModalOpen(false);
    document.body.style.overflow = "unset"; // Restaurar scroll
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  // Cerrar modal con tecla Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isVideoModalOpen) {
        closeVideoModal();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isVideoModalOpen]);

  // WhatsApp handler function
  const handleWhatsAppReservation = () => {
    console.log("WhatsApp reservation clicked - Snowboard");
    console.log("Contact info:", contactInfo);

    if (!contactInfo) {
      alert(
        "Información de contacto no disponible. Por favor intenta más tarde."
      );
      return;
    }

    // Create a prefilled message for snowboard adventure
    const message = `¡Hola! Estoy interesado en reservar una aventura de snowboard.

🏂 *Tipo de Aventura:* Ski/Snowboard
${snowboardPackage ? `🎒 *Paquete:* ${snowboardPackage.name}` : ""}

Me gustaría obtener más información sobre fechas disponibles y precios.

¡Gracias!`;

    // Build WhatsApp URL
    let whatsappUrl;
    if (contactInfo.whatsapp?.url) {
      if (contactInfo.whatsapp.url.includes("wa.me/")) {
        // Extract phone number from wa.me URL
        const phoneMatch = contactInfo.whatsapp.url.match(/wa\.me\/([^?]+)/);
        if (phoneMatch) {
          const phoneNumber = phoneMatch[1];
          whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
            message
          )}`;
        } else {
          // Fallback: use the URL as is but replace any existing text parameter
          const baseUrl = contactInfo.whatsapp.url.split("?")[0];
          whatsappUrl = `${baseUrl}?text=${encodeURIComponent(message)}`;
        }
      } else {
        // For other WhatsApp URL formats
        const baseUrl = contactInfo.whatsapp.url.split("?")[0];
        whatsappUrl = `${baseUrl}?text=${encodeURIComponent(message)}`;
      }
    } else {
      alert(
        "Información de WhatsApp no disponible. Por favor intenta más tarde."
      );
      return;
    }

    // Debug logging
    console.log("Final WhatsApp URL:", whatsappUrl);

    // Open WhatsApp
    window.open(whatsappUrl, "_blank");
  };

  // No loading state needed since data is preloaded

  // Show error state with fallback content
  if (error || !snowboardPackage) {
    if (error) {
      console.warn("Snowboard data not available:", error);
    }

    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold mb-4">
            {SNOWBOARD_PAGE_CONSTANTS.states.errorTitle}
          </h1>
          <p className="text-xl mb-8">
            {SNOWBOARD_PAGE_CONSTANTS.states.errorMessage}
          </p>
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-cyan-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>{SNOWBOARD_PAGE_CONSTANTS.navigation.backToHome}</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header con navegación */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-lg border-b border-white/10">
        <div className="container-max py-3 sm:py-4 px-3 sm:px-4 md:px-0">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="flex items-center space-x-1 sm:space-x-2 text-white hover:text-cyan-300 transition-colors group min-w-0"
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 group-hover:-translate-x-1 transition-transform flex-shrink-0" />
              <span className="font-medium text-sm sm:text-base truncate">
                {SNOWBOARD_PAGE_CONSTANTS.navigation.backToHome}
              </span>
            </Link>
            <div className="flex items-center flex-shrink-0">
              {/* Mobile Logo - Mini version */}
              <img
                src={SNOWBOARD_PAGE_CONSTANTS.assets.logos.mini}
                alt={SNOWBOARD_PAGE_CONSTANTS.navigation.logoAlt}
                className="h-8 sm:h-10 w-auto md:hidden filter invert brightness-0 contrast-100"
              />
              {/* Desktop Logo - Full row version */}
              <img
                src={SNOWBOARD_PAGE_CONSTANTS.assets.logos.fullRow}
                alt={SNOWBOARD_PAGE_CONSTANTS.navigation.logoAlt}
                className="h-8 sm:h-10 w-auto hidden md:block filter invert brightness-0 contrast-100"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Hero con animaciones mejoradas */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Fondo de montañas reales */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/70 via-blue-900/60 to-indigo-900/70 z-10"></div>
          <img
            src={heroBackground.primary.src}
            alt={heroBackground.primary.alt}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback to secondary image
              const target = e.target as HTMLImageElement;
              if (
                heroBackground.fallback &&
                target.src !== heroBackground.fallback.src
              ) {
                target.src = heroBackground.fallback.src;
                target.alt = heroBackground.fallback.alt;
              }
            }}
          />
        </div>

        {/* Fondo Three.js para nieve */}
        <div className="absolute inset-0 z-10">
          <Canvas camera={{ position: [0, 0, 8] }}>
            <Suspense fallback={null}>
              <ambientLight intensity={0.3} />
              <directionalLight
                position={[10, 10, 5]}
                intensity={0.6}
                color="#e0f2fe"
              />
              <pointLight
                position={[-10, -10, -5]}
                intensity={0.2}
                color="#ffffff"
              />

              {/* Capas de nieve con parallax */}
              <group position={[0, 0, -1]}>
                <SnowFlakes layer={1} />
              </group>
              <group position={[0, 0, 1]}>
                <SnowFlakes layer={2} />
              </group>
              <group position={[0, 0, 3]}>
                <SnowFlakes layer={3} />
              </group>

              <OrbitControls
                enableZoom={false}
                enablePan={false}
                enableRotate={false}
              />
            </Suspense>
          </Canvas>
        </div>

        {/* Contenido del hero */}
        <ParallaxSection
          speed={0.1}
          className="relative z-20 text-center text-white container-max px-3 sm:px-4 md:px-0"
        >
          <div className="max-w-5xl mx-auto">
            <h1 className="mt-20 sm:mt-16 md:mt-12 text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-display font-bold mb-4 sm:mb-6 md:mb-8 leading-tight">
              <span className="bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
                {SNOWBOARD_PAGE_CONSTANTS.hero.title.line1}
              </span>
              <span className="block bg-gradient-to-r from-cyan-300 via-blue-300 to-indigo-300 bg-clip-text text-transparent">
                {SNOWBOARD_PAGE_CONSTANTS.hero.title.line2}
              </span>
            </h1>

            <p className="text-sm sm:text-base md:text-xl lg:text-2xl mb-6 sm:mb-8 md:mb-10 text-slate-200 max-w-3xl mx-auto leading-relaxed px-2 sm:px-4 md:px-0">
              {SNOWBOARD_PAGE_CONSTANTS.hero.subtitle}
              <span className="text-cyan-300 font-medium">
                {SNOWBOARD_PAGE_CONSTANTS.hero.highlightText}
              </span>{" "}
              {SNOWBOARD_PAGE_CONSTANTS.hero.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 justify-center items-center px-2 sm:px-4 md:px-0">
              <a
                href="#packages"
                className="group bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-3 px-6 sm:py-3 sm:px-8 md:py-4 md:px-10 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl w-full sm:w-auto"
              >
                <span className="flex items-center justify-center text-sm sm:text-base">
                  {SNOWBOARD_PAGE_CONSTANTS.hero.buttons.viewPackages}
                  <Mountain className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </a>
              <button
                onClick={openVideoModal}
                className="group bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold py-3 px-6 sm:py-3 sm:px-8 md:py-4 md:px-10 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl w-full sm:w-auto"
              >
                <span className="flex items-center justify-center text-sm sm:text-base">
                  {SNOWBOARD_PAGE_CONSTANTS.hero.buttons.watchVideo}
                  <Play className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:scale-110 transition-transform" />
                </span>
              </button>
              <a
                href="#info"
                className="group bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-semibold py-3 px-6 sm:py-3 sm:px-8 md:py-4 md:px-10 rounded-2xl transition-all duration-300 border border-white/20 hover:border-white/40 w-full sm:w-auto"
              >
                <span className="flex items-center justify-center text-sm sm:text-base">
                  {SNOWBOARD_PAGE_CONSTANTS.hero.buttons.moreInfo}
                  <Calendar className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </a>
            </div>
          </div>
        </ParallaxSection>
      </section>

      {/* Sección de información con parallax */}
      <section
        id="info"
        className="relative py-16 md:py-24 bg-gradient-to-b from-slate-900 to-blue-900"
      >
        <div className="container-max px-4 md:px-0">
          <div className="grid md:grid-cols-3 gap-8 md:gap-12 text-white">
            {snowboardFeatures.map((feature) => (
              <div key={feature.id} className="text-center group px-4 md:px-0">
                <div
                  className={`w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 md:mb-6 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300`}
                >
                  {React.createElement(getSnowboardIcon(feature.icon), {
                    className: "h-6 w-6 md:h-8 md:w-8 text-white",
                  })}
                </div>
                <h3
                  className={`text-xl md:text-2xl font-bold mb-3 md:mb-4 ${feature.textColor}`}
                >
                  {feature.title}
                </h3>
                <p className="text-slate-200 leading-relaxed text-sm md:text-base">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Paquete único de snowboard */}
      <section
        id="packages"
        className="py-16 md:py-20 bg-gradient-to-b from-blue-900 to-indigo-900"
      >
        <div className="container-max px-3 sm:px-4 md:px-0">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-3 sm:mb-4 md:mb-6">
              {SNOWBOARD_PAGE_CONSTANTS.packages.title}
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-blue-100 max-w-3xl mx-auto px-2 sm:px-4 md:px-0">
              {SNOWBOARD_PAGE_CONSTANTS.packages.subtitle}
            </p>
          </div>

          {/* Paquete principal */}
          <div className="max-w-4xl mx-auto mb-8 sm:mb-12 md:mb-16">
            <div className="group bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-lg rounded-2xl sm:rounded-3xl overflow-hidden border border-white/20 hover:border-cyan-300/50 transition-all duration-500 shadow-2xl hover:shadow-cyan-500/20">
              <div className="relative overflow-hidden">
                <img
                  src={snowboardPackage.image}
                  alt={snowboardPackage.name}
                  className="w-full h-48 sm:h-64 md:h-80 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-3 sm:bottom-4 md:bottom-6 left-3 sm:left-4 md:left-6 right-3 sm:right-4 md:right-6">
                  <h3 className="text-xl sm:text-2xl md:text-4xl font-bold text-white mb-1 md:mb-2">
                    {snowboardPackage.name}
                  </h3>
                  <p className="text-cyan-200 text-sm sm:text-base md:text-lg">
                    {snowboardPackage.description}
                  </p>
                </div>
              </div>

              <div className="p-4 sm:p-6 md:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 md:mb-8 gap-3 sm:gap-4">
                  <span className="text-cyan-300 font-bold text-base sm:text-lg md:text-xl bg-cyan-500/20 px-3 py-2 sm:px-3 sm:py-2 md:px-4 rounded-full text-center sm:text-left">
                    {snowboardPackage.duration}
                  </span>
                  <span className="text-2xl sm:text-3xl md:text-5xl font-bold bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent text-center sm:text-right">
                    ${snowboardPackage.price}
                  </span>
                </div>

                {/* Highlights principales */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
                  {snowboardPackage.highlights?.map((highlight, i) => (
                    <div
                      key={i}
                      className="text-slate-200 flex items-center text-sm sm:text-base"
                    >
                      <div className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Snowflake className="h-2 w-2 sm:h-3 sm:w-3 text-white" />
                      </div>
                      {highlight}
                    </div>
                  ))}
                </div>

                {/* Date Ranges Display */}
                {snowboardPackage.dateRanges &&
                  snowboardPackage.dateRanges.length > 0 && (
                    <div className="mb-4 sm:mb-6 md:mb-8 p-3 sm:p-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl sm:rounded-2xl border border-cyan-300/30">
                      <div className="flex items-center mb-2 sm:mb-3 md:mb-4">
                        <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-300 mr-2 flex-shrink-0" />
                        <h4 className="text-sm sm:text-base md:text-lg font-semibold text-cyan-300">
                          Fechas Disponibles
                        </h4>
                      </div>
                      <div className="space-y-2 sm:space-y-3">
                        {snowboardPackage.dateRanges
                          .filter((dr) => {
                            // Only show available date ranges that haven't passed
                            const endDate = new Date(dr.endDate);
                            return dr.available && endDate >= new Date();
                          })
                          .sort(
                            (a, b) =>
                              new Date(a.startDate).getTime() -
                              new Date(b.startDate).getTime()
                          )
                          .map((dateRange, index) => (
                            <div
                              key={dateRange.id || index}
                              className="bg-white/10 rounded-lg p-2 sm:p-3"
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2">
                                <div className="text-white text-xs sm:text-sm md:text-base font-medium leading-tight">
                                  {new Date(
                                    dateRange.startDate
                                  ).toLocaleDateString("es-ES", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                  })}{" "}
                                  -{" "}
                                  {new Date(
                                    dateRange.endDate
                                  ).toLocaleDateString("es-ES", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                  })}
                                </div>
                                <span className="bg-green-500/20 text-green-300 px-2 py-1 rounded text-xs sm:text-sm self-start sm:self-center flex-shrink-0">
                                  Disponible
                                </span>
                              </div>
                              {dateRange.maxParticipants && (
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-cyan-200 text-xs md:text-sm gap-2">
                                  <div className="flex items-center">
                                    <Users className="h-3 w-3 md:h-4 md:w-4 mr-1 flex-shrink-0" />
                                    <span className="leading-tight">
                                      Máximo {dateRange.maxParticipants}{" "}
                                      participantes
                                    </span>
                                    {(dateRange.currentParticipants || 0) >
                                      0 && (
                                      <span className="ml-1 md:ml-2">
                                        ({dateRange.currentParticipants}{" "}
                                        inscritos)
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center">
                                    <span
                                      className={`px-2 py-1 rounded text-xs font-medium ${
                                        dateRange.maxParticipants -
                                          (dateRange.currentParticipants ||
                                            0) ===
                                        0
                                          ? "bg-red-500/20 text-red-300"
                                          : dateRange.maxParticipants -
                                              (dateRange.currentParticipants ||
                                                0) <=
                                            2
                                          ? "bg-yellow-500/20 text-yellow-300"
                                          : "bg-green-500/20 text-green-300"
                                      }`}
                                    >
                                      {dateRange.maxParticipants -
                                        (dateRange.currentParticipants || 0) ===
                                      0
                                        ? "Completo"
                                        : `${
                                            dateRange.maxParticipants -
                                            (dateRange.currentParticipants || 0)
                                          } lugares disponibles`}
                                    </span>
                                  </div>
                                </div>
                              )}
                              {dateRange.notes && (
                                <div className="text-cyan-200 text-xs md:text-sm mt-1">
                                  <AlertTriangle className="h-3 w-3 md:h-4 md:w-4 inline mr-1" />
                                  {dateRange.notes}
                                </div>
                              )}
                            </div>
                          ))}
                        {snowboardPackage.dateRanges.filter((dr) => {
                          const endDate = new Date(dr.endDate);
                          return dr.available && endDate >= new Date();
                        }).length === 0 && (
                          <div className="text-cyan-200 text-center py-4">
                            <Calendar className="h-6 w-6 md:h-8 md:w-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm md:text-base">
                              No hay fechas disponibles en este momento
                            </p>
                            <p className="text-xs md:text-sm opacity-75">
                              Contáctanos para más información
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                <button
                  onClick={handleWhatsAppReservation}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl mb-3 sm:mb-4 md:mb-6 text-sm sm:text-base flex items-center justify-center cursor-pointer"
                >
                  <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 mr-2 flex-shrink-0" />
                  <span className="truncate">
                    Reservar Aventura de Snowboard
                  </span>
                </button>

                <div className="text-center">
                  <button
                    onClick={() => {
                      document.getElementById("pack-details")?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                    }}
                    className="text-cyan-300 hover:text-cyan-200 font-semibold underline transition-colors cursor-pointer text-xs sm:text-sm md:text-base"
                  >
                    Ver detalles completos del paquete ↓
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Detalles completos en formato JSON organizado */}
          <div id="pack-details" className="max-w-6xl mx-auto">
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-white/20">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-6 md:mb-8 text-center">
                Detalles Completos del Paquete
              </h3>

              {/* Dynamic Package Details */}
              {packageDetailCategories.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                  {packageDetailCategories
                    .filter((category) => category.enabled)
                    .map((category) => {
                      console.log(category);
                      return (
                        <div
                          key={category.id}
                          className="bg-white/5 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 border border-white/10"
                        >
                          <div
                            className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br ${category.gradient} rounded-lg sm:rounded-xl flex items-center justify-center mb-2 sm:mb-3 md:mb-4`}
                          >
                            {React.createElement(
                              getIconComponent(
                                category.iconName || category.icon || "Home"
                              ),
                              {
                                className:
                                  "h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white",
                              }
                            )}
                          </div>
                          <h4 className="text-sm sm:text-base md:text-lg font-bold text-cyan-300 mb-2 md:mb-3">
                            {category.title}
                          </h4>
                          <ul
                            className={`space-y-1 sm:space-y-1 md:space-y-2 text-xs sm:text-sm ${category.textColor}`}
                          >
                            {category.fields?.map((field) => (
                              <li key={field} className="leading-relaxed">
                                •{" "}
                                {snowboardPackage?.details?.[category.id]?.[
                                  field
                                ] || "No disponible"}
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                </div>
              ) : (
                <div className="text-center text-slate-300 px-4">
                  <p className="text-sm md:text-base">
                    Los detalles del paquete se configurarán pronto.
                  </p>
                  <p className="text-xs md:text-sm mt-2">
                    Contacta con nosotros para más información sobre este
                    paquete.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/40 backdrop-blur-md py-4 sm:py-6 md:py-8 text-center text-white">
        <div className="container-max px-3 sm:px-4 md:px-0">
          <p className="mb-2 sm:mb-3 md:mb-4 text-xs sm:text-sm md:text-base leading-relaxed">
            {SNOWBOARD_PAGE_CONSTANTS.footer.copyright}
          </p>
          <div className="flex justify-center items-center space-x-3 sm:space-x-4">
            <a
              href={SNOWBOARD_PAGE_CONSTANTS.links.moreInfo}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-300 hover:text-cyan-200 transition-colors underline font-medium text-xs sm:text-sm md:text-base"
            >
              {SNOWBOARD_PAGE_CONSTANTS.footer.moreInfoLink}
            </a>
          </div>
        </div>
      </footer>

      {/* Modal de Video Fullscreen */}
      {isVideoModalOpen && (
        <div
          className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center p-2 sm:p-4 animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closeVideoModal();
            }
          }}
        >
          <div className="relative w-full max-w-6xl aspect-video bg-black rounded-lg overflow-hidden shadow-2xl animate-scale-in">
            {/* Botón de cerrar */}
            <button
              onClick={closeVideoModal}
              className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 sm:p-2 transition-all duration-300 hover:scale-110"
            >
              <X className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>

            {/* Video */}
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              autoPlay
              controls
              playsInline
              poster="https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
              onLoadedData={() => {
                if (videoRef.current) {
                  videoRef.current.play();
                }
                // Ocultar overlay de carga
                const loadingOverlay = document.getElementById("video-loading");
                if (loadingOverlay) {
                  loadingOverlay.style.display = "none";
                }
              }}
              onError={() => {
                // En caso de error, mostrar imagen estática
                const loadingOverlay = document.getElementById("video-loading");
                if (loadingOverlay) {
                  loadingOverlay.innerHTML = `
                    <div class="text-white text-center">
                      <img src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
                           alt="Snowboard Adventure"
                           class="w-full h-full object-cover rounded-lg" />
                      <div class="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div class="text-center">
                          <h3 class="text-2xl font-bold mb-2">¡Aventuras Épicas de Snowboard!</h3>
                          <p class="text-lg">Descubre las mejores pistas del mundo</p>
                        </div>
                      </div>
                    </div>
                  `;
                }
              }}
            >
              {/* Fuentes de video de snowboard */}
              <source src={videoUrl} type="video/mp4" />
              <source src={videoUrl} type="video/mp4" />
              {SNOWBOARD_PAGE_CONSTANTS.videoModal.videoNotSupported}
            </video>

            {/* Overlay de carga */}
            <div
              className="absolute inset-0 bg-slate-900 rounded-lg flex items-center justify-center"
              id="video-loading"
            >
              <div className="text-white text-center px-4">
                <div className="w-8 h-8 sm:w-12 sm:h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-3 sm:mb-4"></div>
                <p className="text-sm sm:text-lg">
                  {SNOWBOARD_PAGE_CONSTANTS.videoModal.loadingText}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SnowboardTrip;
