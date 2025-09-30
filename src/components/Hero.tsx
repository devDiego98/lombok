import React from "react";
import { ChevronDown, Snowflake, Waves } from "lucide-react";
import { Link } from "react-router-dom";
import { usePreloadedHeroContent } from "../contexts/DataContext";

const Hero = () => {
  // Get preloaded hero content from context
  const { data: heroData, error } = usePreloadedHeroContent();

  // Extract data with fallbacks
  const heroContent = heroData?.content || {
    title: { main: "Aventuras Épicas", highlight: "Te Esperan" },
    subtitle:
      "Vive la emoción del snowboard y surf con Lombok. Guías profesionales, equipo premium y recuerdos inolvidables.",
    primaryButton: { text: "Comenzar Aventura", href: "#about" },
    secondaryButton: { text: "Ver Paquetes", href: "#packages" },
  };

  const adventureCards = heroData?.adventureCards || [
    {
      id: 1,
      title: "Viajes de Snowboard",
      description: "Conquista las montañas más épicas con nieve polvo perfecta",
      icon: "Snowflake",
      gradient: "from-cyan-400 to-blue-500",
      hoverColor: "cyan-300",
      shadowColor: "cyan-500/20",
    },
    {
      id: 2,
      title: "Viajes de Surf",
      description:
        "Cabalga las olas perfectas en los mejores spots del planeta",
      icon: "Waves",
      gradient: "from-emerald-400 to-teal-500",
      hoverColor: "emerald-300",
      shadowColor: "emerald-500/20",
    },
  ];

  const heroBackgrounds = heroData?.backgrounds || {
    primary: {
      src: "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      alt: "Mountain landscape meeting the ocean - perfect for snowboard and surf adventures",
    },
    fallback: {
      src: "https://images.unsplash.com/photo-1464822759844-d150baec0494?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      alt: "Coastal mountain landscape",
    },
  };

  const handleSmoothScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ): void => {
    e.preventDefault();
    const targetId = href.replace("#", "");
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      const headerHeight = 80; // Approximate header height
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  // Parallax effect for background
  React.useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const parallaxElement = document.querySelector(
        ".parallax-bg"
      ) as HTMLElement;
      if (parallaxElement) {
        parallaxElement.style.transform = `translateY(${scrolled * 0.5}px)`;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // No loading state needed since data is preloaded

  // Show error state with fallback content
  if (error) {
    console.warn("Hero content not available, using fallbacks:", error);
  }

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden home-mobile-padding"
    >
      {/* Background Video/Image */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/70 via-blue-900/60 to-indigo-900/70 z-10"></div>

        {/* Primary Background - Mountain meets Ocean */}
        <img
          src={heroBackgrounds.primary.src}
          alt={heroBackgrounds.primary.alt}
          className="parallax-bg w-full h-full object-cover scale-110"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            // Fallback to coastal mountain image
            target.src = heroBackgrounds.fallback.src;
            target.alt = heroBackgrounds.fallback.alt;
            target.onerror = () => {
              // Final fallback to gradient
              target.style.display = "none";
              if (target.parentElement) {
                (target.parentElement as HTMLElement).style.background =
                  "linear-gradient(135deg, #1e293b 0%, #1e40af 50%, #4338ca 100%)";
              }
            };
          }}
        />

        {/* Optional: Video Background (uncomment to use) */}
        {/*
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        >
          <source src="/path-to-your-video.mp4" type="video/mp4" />
        </video>
        */}
      </div>

      {/* Contenido */}
      <div className="relative z-20 text-center text-white container-max">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-7xl font-display font-bold mb-6 animate-fade-in">
            {heroContent.title.main}
            <span className="block text-secondary-400">
              {heroContent.title.highlight}
            </span>
          </h1>
          <p className="text-lg md:text-2xl mb-8 text-gray-200 max-w-2xl mx-auto">
            {heroContent.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <a
              href={heroContent.primaryButton.href}
              onClick={(e) =>
                handleSmoothScroll(e, heroContent.primaryButton.href)
              }
              className="btn-primary text-lg px-8 py-4 group flex items-center justify-center space-x-3 cursor-pointer"
            >
              {heroContent.primaryButton.text}
              <ChevronDown className="ml-2 h-5 w-5 group-hover:translate-y-1 transition-transform" />
            </a>
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-3 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-secondary-400">
                100+
              </div>
              <div className="text-gray-300">Aventureros Felices</div>
            </div>

            <div>
              <div className="text-3xl md:text-4xl font-bold text-secondary-400">
                +5
              </div>
              <div className="text-gray-300">Años de Experiencia</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-secondary-400">
                24/7
              </div>
              <div className="text-gray-300">Soporte</div>
            </div>
          </div>

          {/* Enlaces a aventuras específicas */}
          <div className="mt-20 grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {adventureCards.map((card) => {
              const IconComponent =
                card.icon === "Snowflake" ? Snowflake : Waves;
              const route = card.icon === "Snowflake" ? "/snowboard" : "/surf";

              return (
                <Link
                  key={card.id}
                  to={route}
                  className={`group bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-lg rounded-2xl md:rounded-3xl p-4 md:p-8 hover:from-white/25 hover:to-white/10 transition-all duration-500 transform hover:scale-105 border border-white/20 hover:border-${card.hoverColor}/50 shadow-xl md:shadow-2xl hover:shadow-${card.shadowColor}`}
                >
                  <div className="flex items-center space-x-3 md:space-x-6">
                    <div
                      className={`w-12 h-12 md:w-20 md:h-20 bg-gradient-to-br ${card.gradient} rounded-xl md:rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg md:shadow-xl`}
                    >
                      <IconComponent
                        className={`h-6 w-6 md:h-10 md:w-10 text-white ${
                          card.icon === "Snowflake"
                            ? "animate-spin"
                            : "group-hover:translate-y-1"
                        } transition-transform duration-300`}
                        style={
                          card.icon === "Snowflake"
                            ? { animationDuration: "8s" }
                            : {}
                        }
                      />
                    </div>
                    <div className="text-left">
                      <h3
                        className={`text-lg md:text-2xl font-bold text-white group-hover:text-${card.hoverColor} transition-colors mb-1 md:mb-2`}
                      >
                        {card.title}
                      </h3>
                      <p className="text-sm md:text-base text-slate-200 leading-relaxed">
                        {card.description}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Indicador de Scroll */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30">
        <div className="animate-bounce">
          <ChevronDown className="h-8 w-8 text-white" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
