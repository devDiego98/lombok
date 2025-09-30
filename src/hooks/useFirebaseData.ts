// Custom hooks for Firebase data fetching
import { useState, useEffect } from "react";
import {
  ContactService,
  PackageService,
  FirebaseService,
  COLLECTIONS,
} from "../services/firebaseService";
import type {
  ContactInfo,
  Package,
  HeroContent,
  NavigationData,
  Review,
  GalleryImage,
  FAQItem,
  SponsorsData,
  FirebaseDocument,
} from "../types";

// Hook return type interfaces
interface UseFirebaseCollectionReturn<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

interface UseFirebaseDocumentReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

interface UseFirebaseRealtimeReturn<T> {
  data: T;
  loading: boolean;
  error: string | null;
}

interface UseContactInfoReturn {
  contactInfo: ContactInfo | null;
  loading: boolean;
  error: string | null;
}

interface UsePackagesReturn {
  packages: Package[];
  featuredPackage: Package | null;
  loading: boolean;
  error: string | null;
}

// Generic hook for any Firebase collection
export const useFirebaseCollection = <T = FirebaseDocument>(
  collectionName: string
): UseFirebaseCollectionReturn<T> => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (): Promise<void> => {
    try {
      setLoading(true);
      const result = await FirebaseService.getCollection<T>(collectionName);
      setData(result);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      console.error(`Error fetching ${collectionName}:`, err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [collectionName]);

  return { data, loading, error, refetch: fetchData };
};

// Generic hook for any Firebase document
export const useFirebaseDocument = <T = FirebaseDocument>(
  collectionName: string,
  docId: string
): UseFirebaseDocumentReturn<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (): Promise<void> => {
    try {
      setLoading(true);
      const result = await FirebaseService.getDocument<T>(
        collectionName,
        docId
      );
      setData(result);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      console.error(`Error fetching ${collectionName}/${docId}:`, err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (docId) {
      fetchData();
    }
  }, [collectionName, docId]);

  return { data, loading, error, refetch: fetchData };
};

// Real-time hook for collections
export const useFirebaseCollectionRealtime = <T = FirebaseDocument>(
  collectionName: string
): UseFirebaseRealtimeReturn<T[]> => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);

    const unsubscribe = FirebaseService.subscribeToCollection<T>(
      collectionName,
      (documents: T[]) => {
        setData(documents);
        setLoading(false);
        setError(null);
      }
    );

    return () => unsubscribe();
  }, [collectionName]);

  return { data, loading, error };
};

// Real-time hook for documents
export const useFirebaseDocumentRealtime = <T = FirebaseDocument>(
  collectionName: string,
  docId: string
): UseFirebaseRealtimeReturn<T | null> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!docId) return;

    setLoading(true);

    const unsubscribe = FirebaseService.subscribeToDocument<T>(
      collectionName,
      docId,
      (document: T | null) => {
        setData(document);
        setLoading(false);
        setError(null);
      }
    );

    return () => unsubscribe();
  }, [collectionName, docId]);

  return { data, loading, error };
};

// Specific hooks for each data type
export const useContactInfo = (): UseContactInfoReturn => {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContactInfo = async (): Promise<void> => {
      try {
        setLoading(true);
        const data = await ContactService.getContactInfo();
        setContactInfo(data);
        setError(null);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
        console.error("Error fetching contact info:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchContactInfo();
  }, []);

  return { contactInfo, loading, error };
};

export const useSurfPackages = (): UsePackagesReturn => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [featuredPackage, setFeaturedPackage] = useState<Package | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPackages = async (): Promise<void> => {
      try {
        setLoading(true);
        const [packagesData, featuredData] = await Promise.all([
          PackageService.getSurfPackages(),
          PackageService.getFeaturedSurfPackage(),
        ]);
        setPackages(packagesData);
        setFeaturedPackage(featuredData);
        setError(null);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
        console.error("Error fetching surf packages:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  return { packages, featuredPackage, loading, error };
};

export const useSnowboardPackages = (): UsePackagesReturn => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [featuredPackage, setFeaturedPackage] = useState<Package | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPackages = async (): Promise<void> => {
      try {
        setLoading(true);
        const [packagesData, featuredData] = await Promise.all([
          PackageService.getSnowboardPackages(),
          PackageService.getFeaturedSnowboardPackage(),
        ]);
        setPackages(packagesData);
        setFeaturedPackage(featuredData);
        setError(null);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
        console.error("Error fetching snowboard packages:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  return { packages, featuredPackage, loading, error };
};

// Convenience hooks using generic hooks with proper types
export const useHeroContent = (): UseFirebaseDocumentReturn<HeroContent> => {
  return useFirebaseDocument<HeroContent>(COLLECTIONS.HERO_CONTENT, "main");
};

export const useNavigationData =
  (): UseFirebaseDocumentReturn<NavigationData> => {
    return useFirebaseDocument<NavigationData>(COLLECTIONS.NAVIGATION, "main");
  };

export const useReviews = (): UseFirebaseCollectionReturn<Review> => {
  return useFirebaseCollection<Review>(COLLECTIONS.REVIEWS_DATA);
};

export const useGalleryImages =
  (): UseFirebaseCollectionReturn<GalleryImage> => {
    return useFirebaseCollection<GalleryImage>(COLLECTIONS.GALLERY_IMAGES);
  };

export const useFAQData = (): UseFirebaseCollectionReturn<FAQItem> => {
  return useFirebaseCollection<FAQItem>(COLLECTIONS.FAQ_DATA);
};

export const useSponsorsData = (): UseFirebaseDocumentReturn<SponsorsData> => {
  return useFirebaseDocument<SponsorsData>(COLLECTIONS.SPONSORS_DATA, "main");
};
