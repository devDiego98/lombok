// Global data context to provide preloaded Firebase data to all components
import React, { createContext, useContext } from "react";
import { GlobalData, DataProviderProps } from "../types";

const DataContext = createContext<GlobalData | undefined>(undefined);

export const useDataContext = (): GlobalData => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useDataContext must be used within a DataProvider");
  }
  return context;
};

export const DataProvider: React.FC<DataProviderProps> = ({
  children,
  data,
}) => {
  return <DataContext.Provider value={data}>{children}</DataContext.Provider>;
};

// Convenience hooks for specific data types
export const usePreloadedHeroContent = () => {
  const data = useDataContext();
  return {
    data: data.heroContent,
    loading: false,
    error: null,
  };
};

export const usePreloadedNavigationData = () => {
  const data = useDataContext();
  return {
    data: data.navigationData,
    loading: false,
    error: null,
  };
};

export const usePreloadedContactInfo = () => {
  const data = useDataContext();
  return {
    data: data.contactInfo,
    loading: false,
    error: null,
  };
};

export const usePreloadedSurfPackages = () => {
  const data = useDataContext();
  return {
    packages: data.surfPackages || [],
    featuredPackage:
      data.surfPackages?.find((pkg) => pkg.featured) ||
      data.surfPackages?.[0] ||
      null,
    loading: false,
    error: null,
  };
};

export const usePreloadedSnowboardPackages = () => {
  const data = useDataContext();
  return {
    packages: data.snowboardPackages || [],
    featuredPackage:
      data.snowboardPackages?.find((pkg) => pkg.featured) ||
      data.snowboardPackages?.[0] ||
      null,
    loading: false,
    error: null,
  };
};

export const usePreloadedSurfInfo = () => {
  const data = useDataContext();
  return {
    data: data.surfInfo,
    loading: false,
    error: null,
  };
};

export const usePreloadedSnowboardInfo = () => {
  const data = useDataContext();
  return {
    data: data.snowboardInfo,
    loading: false,
    error: null,
  };
};

export const usePreloadedReviews = () => {
  const data = useDataContext();
  return {
    data: data.reviews || [],
    loading: false,
    error: null,
  };
};

export const usePreloadedGalleryImages = () => {
  const data = useDataContext();
  return {
    data: data.galleryImages || [],
    loading: false,
    error: null,
  };
};

export const usePreloadedFAQData = () => {
  const data = useDataContext();
  return {
    data: data.faqData || [],
    loading: false,
    error: null,
  };
};

export const usePreloadedSponsorsData = () => {
  const data = useDataContext();
  return {
    data: data.sponsorsData,
    loading: false,
    error: null,
  };
};

export const usePreloadedPackageOptions = () => {
  const data = useDataContext();
  return {
    data: data.packageOptions,
    loading: false,
    error: null,
  };
};
