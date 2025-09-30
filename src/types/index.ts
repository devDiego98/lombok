// TypeScript type definitions for the Lombok project

import { ReactNode } from "react";
import { User } from "firebase/auth";

// ============================================================================
// Common Types
// ============================================================================

export interface BaseDocument {
  id: string;
  createdAt?: string;
  updatedAt?: string;
}

// Firebase document type alias
export type FirebaseDocument = BaseDocument;

export interface LoadingState {
  loading: boolean;
  error: string | null;
}

// ============================================================================
// Auth Types
// ============================================================================

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<User>;
  signOut: () => Promise<void>;
  clearError: () => void;
  isAuthenticated: boolean;
}

export interface AuthProviderProps {
  children: ReactNode;
}

// ============================================================================
// Data Context Types
// ============================================================================

export interface GlobalData {
  contactInfo: ContactInfo | null;
  heroContent: HeroContent | null;
  navigationData: NavigationData | null;
  surfInfo: TripInfo | null;
  snowboardInfo: TripInfo | null;
  surfPackages: Package[];
  snowboardPackages: Package[];
  reviews: Review[];
  galleryImages: GalleryImage[];
  faqData: FAQItem[];
  sponsorsData: SponsorsData | null;
  packageOptions: PackageOptions | null;
}

export interface DataProviderProps {
  children: ReactNode;
  data: GlobalData;
}

export interface PreloadedDataHook<T> {
  data: T;
  loading: boolean;
  error: string | null;
}

// ============================================================================
// Contact Info Types
// ============================================================================

export interface ContactInfo {
  phone: {
    display: string;
    raw: string;
  };
  email: {
    primary: string;
    support?: string;
  };
  whatsapp: {
    number: string;
    defaultMessage: string;
    url?: string;
  };
  address: {
    street: string;
    city: string;
    province: string;
    country?: string;
  };
  businessHours: {
    weekdays: {
      days: string;
      hours: string;
    };
    weekends: {
      days: string;
      hours: string;
    };
    timezone: string;
  };
  servicePromises: {
    emergency: string;
    emailResponse: string;
    whatsappResponse: string;
    officeVisits: string;
  };
  social?: {
    instagram: string;
    tiktok: string;
  };
}

// ============================================================================
// Hero Content Types
// ============================================================================

export interface HeroContent {
  content: {
    title: {
      main: string;
      highlight: string;
    };
    subtitle: string;
    primaryButton: {
      text: string;
      href: string;
    };
    secondaryButton?: {
      text: string;
      href: string;
    };
  };
  adventureCards: AdventureCard[];
  backgrounds: {
    primary: {
      src: string;
      alt: string;
    };
    fallback: {
      src: string;
      alt: string;
    };
  };
}

export interface AdventureCard {
  id: number;
  title: string;
  description: string;
  icon: string;
  gradient: string;
  hoverColor: string;
  shadowColor: string;
}

// ============================================================================
// Navigation Types
// ============================================================================

export interface NavigationData {
  navItems: NavItem[];
}

export interface NavItem {
  name: string;
  href: string;
}

// ============================================================================
// Package Types
// ============================================================================

export interface Package extends BaseDocument {
  name: string;
  description: string;
  price?: number;
  featured?: boolean;
  categories?: Category[];
  dateRanges?: DateRange[];
  adventureType?: "surf" | "snowboard";
  image?: string;
  duration?: string;
  highlights?: string[];
  details?: Record<string, Record<string, string>>;
}

export interface Category {
  id: string;
  name: string;
  enabled: boolean;
  subcategories?: Subcategory[];
  iconName?: string;
  gradient?: string;
  textColor?: string;
  icon?: string;
  title?: string;
  fields?: string[];
}

export interface Subcategory {
  id: string;
  name: string;
  enabled: boolean;
}

export interface DateRange {
  id: string;
  startDate: string;
  endDate: string;
  availableSpots: number;
  totalSpots: number;
  available?: boolean;
  maxParticipants?: number;
  currentParticipants?: number;
  notes?: string;
}

// Package Date Range (extended version)
export interface PackageDateRange extends DateRange {
  id: string;
  available: boolean;
  maxParticipants: number;
  currentParticipants: number;
  notes: string;
  availableSpots: number;
  totalSpots: number;
}

// ============================================================================
// Trip Info Types
// ============================================================================

export interface TripInfo {
  title: string;
  description: string;
  features?: string[];
  images?: string[];
  heroBackground?: {
    primary: { src: string; alt: string };
    fallback: { src: string; alt: string };
  };
  packageDetailCategories?: Category[];
}

// ============================================================================
// Review Types
// ============================================================================

export interface Review extends BaseDocument {
  name: string;
  text: string;
  rating: number;
  location: string;
  trip: string;
}

// ============================================================================
// Gallery Types
// ============================================================================

export interface GalleryImage extends BaseDocument {
  src: string;
  alt: string;
  category: string;
}

// ============================================================================
// FAQ Types
// ============================================================================

export interface FAQItem extends BaseDocument {
  question: string;
  answer: string;
}

// ============================================================================
// Sponsors Types
// ============================================================================

export interface SponsorsData {
  title: string;
  message: string;
  sponsors: Sponsor[];
}

export interface Sponsor {
  id: string;
  name: string;
  logo: string;
  alt?: string;
  website?: string;
  publicId?: string; // Cloudinary public ID for deletion
}

// ============================================================================
// Package Options Types
// ============================================================================

export interface PackageOptions {
  options: PackageOption[];
}

export interface PackageOption {
  id: string;
  name: string;
  value: string;
}

// ============================================================================
// Component Props Types
// ============================================================================

export interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  text?: string;
  className?: string;
  fullScreen?: boolean;
}

export interface ErrorMessageProps {
  message?: string;
  onRetry?: (() => void) | null;
  className?: string;
}

export interface LombokLoaderProps {
  progress?: number;
  currentTask?: string;
  error?: string | null;
}

export interface ProtectedRouteProps {
  children: ReactNode;
}

// ============================================================================
// Form Types
// ============================================================================

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  package: string;
  message: string;
  adventureType?: string;
  dateRange?: string;
}

// ============================================================================
// Adventure Types
// ============================================================================

export interface AdventureType {
  id: number;
  value: string;
  name: string;
  emoji: string;
  description: string;
}

// ============================================================================
// Trip Member Types
// ============================================================================

export interface TripMember {
  id: string;
  name: string;
  phone: string;
  hasPaid: boolean;
  packageId: string;
  dateRangeId: string;
  adventureType: "surf" | "snowboard";
  registrationDate: string;
}
