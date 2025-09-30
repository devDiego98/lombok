// Constants for SurfTrip page - All hardcoded text and UI elements
import {
  ArrowLeft,
  Calendar,
  Play,
  Waves,
  Users,
  Award,
  Home,
  Utensils,
  Shield,
  BookOpen,
  Activity,
  AlertTriangle,
  LucideIcon
} from "lucide-react";

// Feature interface
interface SurfFeature {
  id: number;
  title: string;
  description: string;
  icon: string;
  gradient: string;
  textColor: string;
}

// Icon mapping for features and categories
export const SURF_ICON_MAP: Record<string, LucideIcon> = {
  Waves,
  Users,
  Award,
  Home,
  Utensils,
  Shield,
  BookOpen,
  Activity,
  AlertTriangle,
  ArrowLeft,
  Calendar,
  Play
};

// Main constants object
export const SURF_PAGE_CONSTANTS = {
  // Navigation and Header
  navigation: {
    backToHome: "Volver a Inicio",
    logoAlt: "Lombok",
  },

  // Hero Section
  hero: {
    title: {
      line1: "Aventuras de",
      line2: "Surf"
    },
    subtitle: "Cabalga las olas más perfectas del planeta con nuestros viajes de surf.",
    highlightText: "Breaks legendarios, spots secretos",
    description: " y aventuras inolvidables te esperan.",
    buttons: {
      viewPackages: "Ver Paquetes",
      watchVideo: "Ver Video",
      moreInfo: "Más Información"
    }
  },

  // Features Section (fallback when Firebase data is not available)
  features: [
    {
      id: 1,
      title: 'Olas Perfectas',
      description: 'Las mejores condiciones de surf durante todo el año',
      icon: 'Waves',
      gradient: 'from-teal-500 to-cyan-500',
      textColor: 'text-teal-300'
    },
    {
      id: 2,
      title: 'Instructores Expertos',
      description: 'Guías locales con años de experiencia',
      icon: 'Users',
      gradient: 'from-blue-500 to-teal-500',
      textColor: 'text-blue-300'
    },
    {
      id: 3,
      title: 'Equipo Premium',
      description: 'Material de surf de última generación',
      icon: 'Award',
      gradient: 'from-emerald-500 to-teal-500',
      textColor: 'text-emerald-300'
    }
  ] as SurfFeature[],

  // Note: Package Detail Categories are now managed through Firebase
  // Styling for categories is handled by src/constants/categoryStyles.ts

  // Package Section
  packages: {
    title: "Paquete de Surf Premium",
    subtitle: "La experiencia definitiva de surf con todo incluido. Desde principiantes hasta surfistas avanzados.",
    detailsTitle: "Detalles del Paquete",
    buttons: {
      bookNow: "Reservar Ahora",
    },
    dateRanges: {
      availableDates: "Fechas Disponibles",
      available: "Disponible",
      maxParticipants: "Máximo",
      participants: "participantes",
      enrolled: "inscritos",
      spotsAvailable: "lugares disponibles",
      full: "Completo",
      noAvailableDates: "No hay fechas disponibles en este momento",
      contactForInfo: "Contáctanos para más información"
    },
    details: {
      fallbackText: "Información disponible próximamente"
    }
  },

  // Footer
  footer: {
    copyright: "© 2024 Lombok. Todas las aventuras de surf están esperándote.",
    moreInfoLink: "Ver más información"
  },

  // Video Modal
  videoModal: {
    loadingText: "Cargando video...",
    videoNotSupported: "Tu navegador no soporta el elemento de video.",
    errorFallback: {
      title: "¡Aventuras Épicas de Surf!",
      subtitle: "Descubre las mejores olas del mundo"
    }
  },

  // Loading and Error States
  states: {
    loading: "Cargando información de surf...",
    errorTitle: "Viajes de Surf",
    errorMessage: "La información estará disponible pronto."
  },

  // Assets
  assets: {
    logos: {
      mini: "/assets/lombok-mini.png",
      fullRow: "/assets/lombok-full-row.png"
    },
    videos: {
      surf: "/assets/videos/REEL1.mp4"
    },
    images: {
      surfBanner: "/assets/surfBanner.jpg",
      videoPoster: "https://images.unsplash.com/photo-1530549387789-4c1017266635?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
    }
  },

  // External Links
  links: {
    moreInfo: "https://share.google/Wk5BvUjKm48lAzY3a"
  },

  // Animation and Styling
  animations: {
    parallaxSpeed: 0.1,
    waveAnimationDelays: ["0s", "1s", "2s"],
    waveTransforms: ["translateY(0px)", "translateY(4px)", "translateY(8px)"]
  },

  // Default Theme (fallback when Firebase data is not available)
  defaultTheme: {
    gradients: {
      main: "from-blue-900 to-cyan-900",
      hero: "from-teal-900 via-blue-900 to-indigo-900",
      heroWaves: [
        "from-teal-500/20 to-cyan-500/20",
        "from-teal-400/30 to-cyan-400/30",
        "from-teal-300/40 to-cyan-300/40",
        "from-teal-200/50 to-cyan-200/50",
      ],
      info: "from-blue-900 to-teal-900",
      packages: "from-teal-900 to-blue-900",
      footer: "from-blue-900 to-teal-900",
    },
    buttons: {
      primary: "from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700",
      secondary: "from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700",
      package: "from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700",
    }
  },

  // Wave Clip Paths for CSS animations
  waveClipPaths: {
    wave1: "polygon(0% 100%, 0% 65%, 5% 62%, 10% 68%, 15% 64%, 20% 58%, 25% 62%, 30% 68%, 35% 65%, 40% 55%, 45% 58%, 50% 65%, 55% 62%, 60% 48%, 65% 52%, 70% 58%, 75% 55%, 80% 45%, 85% 48%, 90% 52%, 95% 48%, 100% 40%, 100% 100%)",
    wave2: "polygon(0% 100%, 0% 75%, 5% 72%, 10% 68%, 15% 65%, 20% 62%, 25% 68%, 30% 72%, 35% 68%, 40% 58%, 45% 62%, 50% 68%, 55% 65%, 60% 55%, 65% 58%, 70% 62%, 75% 58%, 80% 48%, 85% 52%, 90% 58%, 95% 55%, 100% 50%, 100% 100%)",
    wave3: "polygon(0% 100%, 0% 82%, 5% 78%, 10% 75%, 15% 72%, 20% 68%, 25% 72%, 30% 75%, 35% 72%, 40% 65%, 45% 68%, 50% 72%, 55% 68%, 60% 62%, 65% 65%, 70% 68%, 75% 65%, 80% 58%, 85% 62%, 90% 65%, 95% 62%, 100% 55%, 100% 100%)"
  }
} as const;

// Helper functions for easy access
export const getSurfText = (path: string): string | undefined => {
  return path.split('.').reduce((obj: any, key: string) => obj?.[key], SURF_PAGE_CONSTANTS);
};

export const getSurfAsset = (type: keyof typeof SURF_PAGE_CONSTANTS.assets, name: string): string | undefined => {
  return (SURF_PAGE_CONSTANTS.assets[type] as any)?.[name];
};

export const getSurfTheme = (category: keyof typeof SURF_PAGE_CONSTANTS.defaultTheme, item: string): string | undefined => {
  return (SURF_PAGE_CONSTANTS.defaultTheme[category] as any)?.[item];
};

export const getSurfFeature = (id: number): SurfFeature | undefined => {
  return SURF_PAGE_CONSTANTS.features.find(feature => feature.id === id);
};

export const getSurfIcon = (iconName: string): LucideIcon => {
  return SURF_ICON_MAP[iconName] || SURF_ICON_MAP.Home;
};
