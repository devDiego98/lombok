// Constants for SnowboardTrip page - All hardcoded text and UI elements
import {
  ArrowLeft,
  Calendar,
  Play,
  Snowflake,
  Mountain,
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
interface SnowboardFeature {
  id: number;
  title: string;
  description: string;
  icon: string;
  gradient: string;
  textColor: string;
}

// Icon mapping for features and categories
export const SNOWBOARD_ICON_MAP: Record<string, LucideIcon> = {
  Mountain,
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
  Play,
  Snowflake
};

// Main constants object
export const SNOWBOARD_PAGE_CONSTANTS = {
  // Navigation and Header
  navigation: {
    backToHome: "Volver a Inicio",
    logoAlt: "Lombok",
  },

  // Hero Section
  hero: {
    title: {
      line1: "Aventuras de",
      line2: "Snowboard"
    },
    subtitle: "Conquista las montañas más épicas del mundo con nuestros viajes de snowboard.",
    highlightText: "Pistas legendarias, nieve fresca",
    description: " y aventuras inolvidables en cada descenso.",
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
      title: 'Nieve Fresca',
      description: 'Las mejores condiciones de nieve en los Andes',
      icon: 'Snowflake',
      gradient: 'from-blue-500 to-cyan-500',
      textColor: 'text-cyan-300'
    },
    {
      id: 2,
      title: 'Instructores Certificados',
      description: 'Profesionales con certificación internacional',
      icon: 'Users',
      gradient: 'from-emerald-500 to-teal-500',
      textColor: 'text-emerald-300'
    },
    {
      id: 3,
      title: 'Equipo de Calidad',
      description: 'Tablas y equipos de las mejores marcas',
      icon: 'Award',
      gradient: 'from-purple-500 to-pink-500',
      textColor: 'text-purple-300'
    }
  ] as SnowboardFeature[],

  // Note: Package Detail Categories are now managed through Firebase
  // Styling for categories is handled by src/constants/categoryStyles.ts

  // Package Section
  packages: {
    title: "Paquete de Snowboard Premium",
    subtitle: "La experiencia definitiva de snowboard con todo incluido. Desde principiantes hasta riders expertos.",
    buttons: {
      bookNow: "Reservar Ahora",
      moreDetails: "Más Detalles"
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
    copyright: "© 2024 Lombok. Todas las aventuras de snowboard están esperándote.",
    moreInfoLink: "Ver más información"
  },

  // Video Modal
  videoModal: {
    loadingText: "Cargando video...",
    videoNotSupported: "Tu navegador no soporta el elemento de video.",
    errorFallback: {
      title: "¡Aventuras Épicas de Snowboard!",
      subtitle: "Descubre las mejores montañas del mundo"
    }
  },

  // Loading and Error States
  states: {
    loading: "Cargando información de snowboard...",
    errorTitle: "Viajes de Snowboard",
    errorMessage: "La información estará disponible pronto."
  },

  // Assets
  assets: {
    logos: {
      mini: "/assets/lombok-mini.png",
      fullRow: "/assets/lombok-full-row.png"
    },
    videos: {
      snowboard: "/assets/videos/FILM1.mp4"
    },
    images: {
      snowboardBanner: "/assets/snowboardBanner.jpg",
      videoPoster: "https://images.unsplash.com/photo-1551524164-6cf2ac2d8c9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
    }
  },

  // External Links
  links: {
    moreInfo: "https://share.google/Wk5BvUjKm48lAzY3a"
  },

  // Animation and Styling
  animations: {
    parallaxSpeed: 0.1,
    snowflakeConfig: {
      layers: 3,
      particlesPerLayer: 50,
      speeds: [0.02, 0.03, 0.04],
      drifts: [0.001, 0.002, 0.003],
      scales: [0.05, 0.08, 0.12]
    }
  },

  // Default Theme (fallback when Firebase data is not available)
  defaultTheme: {
    gradients: {
      main: "from-slate-900 via-blue-900 to-indigo-900",
      hero: "from-slate-900 via-blue-900 to-indigo-900",
      info: "from-blue-900 to-indigo-900",
      packages: "from-indigo-900 to-blue-900",
      footer: "from-slate-900 to-blue-900",
    },
    buttons: {
      primary: "from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700",
      secondary: "from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700",
      package: "from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700",
    }
  },

  // Three.js Snow Animation Settings
  snowAnimation: {
    camera: {
      position: [0, 0, 8] as [number, number, number]
    },
    lighting: {
      ambient: {
        intensity: 0.3
      },
      directional: {
        position: [10, 10, 5] as [number, number, number],
        intensity: 0.6,
        color: "#e0f2fe"
      },
      point: {
        position: [-10, -10, -5] as [number, number, number],
        intensity: 0.2,
        color: "#ffffff"
      }
    },
    snowflake: {
      geometry: [6, 6] as [number, number], // sphere args
      material: {
        color: "#ffffff",
        transparent: true,
        opacity: 0.8,
        emissive: "#ffffff",
        emissiveIntensity: 0.1
      },
      resetHeight: 20,
      fallHeight: -15,
      spreadWidth: 25
    }
  }
} as const;

// Helper functions for easy access
export const getSnowboardText = (path: string): string | undefined => {
  return path.split('.').reduce((obj: any, key: string) => obj?.[key], SNOWBOARD_PAGE_CONSTANTS);
};

export const getSnowboardAsset = (type: keyof typeof SNOWBOARD_PAGE_CONSTANTS.assets, name: string): string | undefined => {
  return (SNOWBOARD_PAGE_CONSTANTS.assets[type] as any)?.[name];
};

export const getSnowboardTheme = (category: keyof typeof SNOWBOARD_PAGE_CONSTANTS.defaultTheme, item: string): string | undefined => {
  return (SNOWBOARD_PAGE_CONSTANTS.defaultTheme[category] as any)?.[item];
};

export const getSnowboardFeature = (id: number): SnowboardFeature | undefined => {
  return SNOWBOARD_PAGE_CONSTANTS.features.find(feature => feature.id === id);
};

export const getSnowboardIcon = (iconName: string): LucideIcon => {
  return SNOWBOARD_ICON_MAP[iconName] || SNOWBOARD_ICON_MAP.Home;
};
