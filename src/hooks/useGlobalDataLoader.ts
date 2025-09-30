// Global data loader hook - loads all Firebase data before showing the app
import { useState, useEffect } from "react";
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

export const useGlobalDataLoader = (): UseGlobalDataLoaderReturn => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [currentTask, setCurrentTask] = useState<string>("");
  const [data, setData] = useState<Partial<GlobalData>>({});

  useEffect(() => {
    const loadAllData = async (): Promise<void> => {
      try {
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
        setData(loadedData);

        setCurrentTask("¡Listo para la aventura!");

        // Add a final delay to show completion
        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (err) {
        console.error("Global data loading failed:", err);
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadAllData();
  }, []);

  return {
    loading,
    error,
    progress,
    currentTask,
    data,
  };
};
