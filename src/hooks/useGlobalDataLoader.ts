// Global data loader hook - loads all Firebase data before showing the app
import { useState, useEffect, useRef } from "react";
import { FirebaseService, COLLECTIONS } from "../services/firebaseService";
import type { GlobalData } from "../types";

// Data source interface
interface DataSource {
  name: string;
  collection: string;
  doc?: string;
}

// Hook return type
interface UseGlobalDataLoaderReturn {
  loading: boolean;
  error: string | null;
  progress: number;
  currentTask: string;
  data: Partial<GlobalData>;
}

// Helper function to create consistent data keys
const getDataKey = (collection: string): keyof GlobalData => {
  const keyMap: Record<string, keyof GlobalData> = {
    [COLLECTIONS.CONTACT_INFO]: "contactInfo",
    [COLLECTIONS.HERO_CONTENT]: "heroContent",
    [COLLECTIONS.NAVIGATION]: "navigationData",
    [COLLECTIONS.SURF_INFO]: "surfInfo",
    [COLLECTIONS.SNOWBOARD_INFO]: "snowboardInfo",
    [COLLECTIONS.SURF_PACKAGES]: "surfPackages",
    [COLLECTIONS.SNOWBOARD_PACKAGES]: "snowboardPackages",
    [COLLECTIONS.REVIEWS_DATA]: "reviews",
    [COLLECTIONS.GALLERY_IMAGES]: "galleryImages",
    [COLLECTIONS.FAQ_DATA]: "faqData",
    [COLLECTIONS.SPONSORS_DATA]: "sponsorsData",
    [COLLECTIONS.PACKAGE_OPTIONS]: "packageOptions",
  };
  return keyMap[collection] || (collection as keyof GlobalData);
};

// Random loading messages
const randomLoadingMessages: string[] = [
  "Preparando las olas perfectas...",
  "Ajustando las tablas de snowboard...",
  "Revisando las condiciones del mar...",
  "Calentando los motores...",
  "Buscando la aventura perfecta...",
  "Organizando el equipo...",
  "Consultando el pronóstico...",
  "Preparando la experiencia...",
  "Cargando la diversión...",
  "Sincronizando con la naturaleza...",
  "Activando el modo aventura...",
  "Despertando la adrenalina...",
  "Conectando con el océano...",
  "Preparando las montañas...",
  "Calibrando la emoción...",
  "Iniciando la magia...",
  "Configurando la experiencia...",
  "Preparando momentos únicos...",
  "Activando los recuerdos...",
  "Cargando sonrisas...",
];

// Helper function to get random loading message
const getRandomLoadingMessage = (): string => {
  const randomIndex = Math.floor(Math.random() * randomLoadingMessages.length);
  return randomLoadingMessages[randomIndex];
};

// Module-level cache to persist data across component remounts
let cachedData: Partial<GlobalData> | null = null;
let isDataLoaded = false;
let loadingPromise: Promise<void> | null = null;

// SessionStorage keys for persistence
const CACHE_STORAGE_KEY = "__lombok_data_cache__";
const LOADED_FLAG_KEY = "__lombok_data_loaded__";

// Restore cache from sessionStorage on module load (in case of hot reload or module reload)
const restoreCacheFromStorage = (): void => {
  try {
    const storedData = sessionStorage.getItem(CACHE_STORAGE_KEY);
    const storedFlag = sessionStorage.getItem(LOADED_FLAG_KEY);

    if (storedData && storedFlag === "true") {
      cachedData = JSON.parse(storedData);
      isDataLoaded = true;
      console.log(
        "[useGlobalDataLoader] ✅ Restored cache from sessionStorage:",
        {
          keys: cachedData ? Object.keys(cachedData).length : 0,
        }
      );
    }
  } catch (error) {
    console.warn(
      "[useGlobalDataLoader] Failed to restore cache from sessionStorage:",
      error
    );
  }
};

// Initialize: restore cache if available
if (typeof window !== "undefined") {
  restoreCacheFromStorage();
}

// Helper to check if data is valid (also attempts to restore from storage if needed)
const hasValidCachedData = (): boolean => {
  // If cache is empty but we haven't checked storage yet in this session, try restoring
  if (!isDataLoaded && typeof window !== "undefined" && cachedData === null) {
    restoreCacheFromStorage();
  }

  const result =
    isDataLoaded && cachedData !== null && Object.keys(cachedData).length > 0;
  console.log("[useGlobalDataLoader] hasValidCachedData check:", {
    isDataLoaded,
    cachedDataExists: cachedData !== null,
    cachedDataKeys: cachedData ? Object.keys(cachedData).length : 0,
    result,
  });
  return result;
};

export const useGlobalDataLoader = (): UseGlobalDataLoaderReturn => {
  // Initialize loading state: false if data is already loaded, true otherwise
  // Re-check cache in the lazy initializer to ensure we have the latest state
  const [loading, setLoading] = useState<boolean>(() => {
    const isCached = hasValidCachedData();
    const initialLoading = !isCached;
    console.log("[useGlobalDataLoader] Hook & useState(loading) initialized:", {
      isCached,
      isDataLoaded,
      cachedDataKeys: cachedData ? Object.keys(cachedData).length : 0,
      hasLoadingPromise: loadingPromise !== null,
      initialLoading,
    });
    return initialLoading;
  });
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [currentTask, setCurrentTask] = useState<string>("");
  const [data, setData] = useState<Partial<GlobalData>>(() => {
    const isCached = hasValidCachedData();
    const initialData = isCached && cachedData ? cachedData : {};
    console.log("[useGlobalDataLoader] useState(data) initialized:", {
      isCached,
      hasCachedData: !!cachedData,
      initialDataKeys: Object.keys(initialData).length,
    });
    return initialData;
  });
  const hasCheckedCacheRef = useRef<boolean>(false);

  useEffect(() => {
    const hasValidCache = hasValidCachedData();
    console.log("[useGlobalDataLoader] useEffect running:", {
      hasCheckedCache: hasCheckedCacheRef.current,
      currentLoading: loading,
      hasCachedData: hasValidCache,
      hasLoadingPromise: loadingPromise !== null,
      isDataLoaded_module: isDataLoaded,
      cachedData_module: cachedData
        ? `exists (${Object.keys(cachedData).length} keys)`
        : "null",
    });

    // CRITICAL: Check for valid cache FIRST, before checking ref
    // This prevents race conditions when component remounts but cache exists
    if (hasValidCache) {
      console.log(
        "[useGlobalDataLoader] ✅ Found valid cached data, setting loading to false immediately"
      );
      // Use a synchronous update if possible to prevent any flash
      if (loading) {
        setLoading(false);
      }
      if (cachedData && (!data || Object.keys(data).length === 0)) {
        setData(cachedData);
      }
      // Mark as checked after successfully using cache
      hasCheckedCacheRef.current = true;
      return;
    }

    // If loading is true but we somehow missed the cache check, check again
    if (loading && hasValidCachedData() && cachedData) {
      console.log(
        "[useGlobalDataLoader] 🔧 CORRECTING: loading is true but cache exists, fixing now"
      );
      setLoading(false);
      setData(cachedData);
      hasCheckedCacheRef.current = true;
      return;
    }

    // Prevent multiple checks only if we don't have valid cache
    if (hasCheckedCacheRef.current) {
      console.log(
        "[useGlobalDataLoader] Already checked cache (and no valid cache), skipping"
      );
      return;
    }
    hasCheckedCacheRef.current = true;

    // If a load is already in progress, wait for it
    if (loadingPromise) {
      console.log(
        "[useGlobalDataLoader] Loading promise exists, waiting for it"
      );
      loadingPromise.then(() => {
        console.log("[useGlobalDataLoader] Loading promise resolved");
        if (hasValidCachedData()) {
          console.log(
            "[useGlobalDataLoader] Setting loading to false after promise"
          );
          setLoading(false);
          setData(cachedData!);
        }
      });
      return;
    }

    // Create and store the loading promise
    console.log("[useGlobalDataLoader] Creating new loading promise");
    loadingPromise = (async (): Promise<void> => {
      try {
        // Double-check cache hasn't been loaded while we were waiting
        if (hasValidCachedData()) {
          console.log(
            "[useGlobalDataLoader] Cache found in async function, skipping load"
          );
          setLoading(false);
          if (cachedData) {
            setData(cachedData);
          }
          loadingPromise = null;
          return;
        }

        console.log(
          "[useGlobalDataLoader] ⚠️ SETTING LOADING TO TRUE - Starting data load"
        );
        setLoading(true);
        setError(null);
        setProgress(0);

        // Define all data sources to load
        const dataSources: DataSource[] = [
          {
            name: "Información de contacto",
            collection: COLLECTIONS.CONTACT_INFO,
            doc: "main",
          },
          {
            name: "Contenido del hero",
            collection: COLLECTIONS.HERO_CONTENT,
            doc: "main",
          },
          {
            name: "Datos de navegación",
            collection: COLLECTIONS.NAVIGATION,
            doc: "main",
          },
          {
            name: "Información de surf",
            collection: COLLECTIONS.SURF_INFO,
            doc: "main",
          },
          {
            name: "Información de snowboard",
            collection: COLLECTIONS.SNOWBOARD_INFO,
            doc: "main",
          },
          { name: "Paquetes de surf", collection: COLLECTIONS.SURF_PACKAGES },
          {
            name: "Paquetes de snowboard",
            collection: COLLECTIONS.SNOWBOARD_PACKAGES,
          },
          { name: "Reseñas", collection: COLLECTIONS.REVIEWS_DATA },
          {
            name: "Galería de imágenes",
            collection: COLLECTIONS.GALLERY_IMAGES,
          },
          { name: "Preguntas frecuentes", collection: COLLECTIONS.FAQ_DATA },
          {
            name: "Datos de patrocinadores",
            collection: COLLECTIONS.SPONSORS_DATA,
            doc: "main",
          },
          {
            name: "Opciones de paquetes",
            collection: COLLECTIONS.PACKAGE_OPTIONS,
            doc: "main",
          },
        ];

        const totalTasks = dataSources.length;
        let completedTasks = 0;
        const loadedData: Partial<GlobalData> = {};

        // Load each data source
        for (const source of dataSources) {
          setCurrentTask(getRandomLoadingMessage());

          try {
            let result: any;
            if (source.doc) {
              // Load document
              result = await FirebaseService.getDocument(
                source.collection,
                source.doc
              );
            } else {
              // Load collection
              result = await FirebaseService.getCollection(source.collection);
            }

            // Store the loaded data with a consistent key
            const dataKey = getDataKey(source.collection);
            (loadedData as any)[dataKey] = result;
          } catch (sourceError) {
            console.warn(`Failed to load ${source.name}:`, sourceError);
            // Continue loading other sources even if one fails
          }

          completedTasks++;
          setProgress((completedTasks / totalTasks) * 100);

          // Add a small delay to show progress (optional, for UX)
          await new Promise((resolve) => setTimeout(resolve, 100));
        }

        // Store all loaded data
        console.log("[useGlobalDataLoader] Data load completed, caching data");
        setData(loadedData);
        cachedData = loadedData;
        isDataLoaded = true;

        // Persist to sessionStorage as backup
        try {
          if (typeof window !== "undefined") {
            sessionStorage.setItem(
              CACHE_STORAGE_KEY,
              JSON.stringify(cachedData)
            );
            sessionStorage.setItem(LOADED_FLAG_KEY, "true");
            console.log(
              "[useGlobalDataLoader] ✅ Cache persisted to sessionStorage"
            );
          }
        } catch (error) {
          console.warn(
            "[useGlobalDataLoader] Failed to persist cache to sessionStorage:",
            error
          );
        }

        console.log("[useGlobalDataLoader] Cache updated:", {
          isDataLoaded,
          cachedDataKeys: Object.keys(cachedData).length,
        });

        setCurrentTask("¡Listo para la aventura!");

        // Add a final delay to show completion
        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (err) {
        console.error("[useGlobalDataLoader] Global data loading failed:", err);
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
      } finally {
        console.log(
          "[useGlobalDataLoader] Setting loading to false in finally block"
        );
        setLoading(false);
        loadingPromise = null; // Clear the promise when done
      }
    })();

    // Cleanup function to prevent memory leaks (though this shouldn't run normally)
    return () => {
      // Don't clear loadingPromise here as other instances might be waiting for it
    };
  }, []);

  return {
    loading,
    error,
    progress,
    currentTask,
    data,
  };
};
