// Migration script to move package detail categories from constants to Firebase
// This script should be run once to migrate existing category data

import { FirebaseService, COLLECTIONS } from "../services/firebaseService";

// Category interface for migration data
interface MigrationCategory {
  id: string;
  title: string;
  fields: string[];
  enabled: boolean;
}

// Original category data from constants (before removal)
const SURF_CATEGORIES: MigrationCategory[] = [
  {
    id: "accommodation",
    title: "Alojamiento",
    fields: ["tipo", "ubicacion", "servicios", "capacidad"],
    enabled: true,
  },
  {
    id: "food",
    title: "Comidas",
    fields: ["desayuno", "almuerzo", "cena", "dietasEspeciales"],
    enabled: true,
  },
  {
    id: "equipment",
    title: "Equipo",
    fields: ["tablasSurf", "trajes", "accesorios", "seguridad"],
    enabled: true,
  },
  {
    id: "instruction",
    title: "Instrucción",
    fields: ["nivel", "ratio", "clases", "certificacion"],
    enabled: true,
  },
  {
    id: "activities",
    title: "Actividades",
    fields: ["surfSessions", "excursiones", "entretenimiento", "tiempoLibre"],
    enabled: true,
  },
  {
    id: "safety",
    title: "Seguridad",
    fields: [
      "seguroAccidentes",
      "contactoEmergencia",
      "primeroAuxilios",
      "protocolos",
    ],
    enabled: true,
  },
];

const SNOWBOARD_CATEGORIES: MigrationCategory[] = [
  {
    id: "accommodation",
    title: "Alojamiento",
    fields: ["tipo", "ubicacion", "servicios", "capacidad"],
    enabled: true,
  },
  {
    id: "food",
    title: "Comidas",
    fields: ["desayuno", "almuerzo", "cena", "dietasEspeciales"],
    enabled: true,
  },
  {
    id: "equipment",
    title: "Equipo",
    fields: ["tabla", "botas", "fijaciones", "casco"],
    enabled: true,
  },
  {
    id: "instruction",
    title: "Instrucción",
    fields: ["nivel", "ratio", "clases", "certificacion"],
    enabled: true,
  },
  {
    id: "activities",
    title: "Actividades",
    fields: ["pistas", "excursiones", "apreSki", "tiempoLibre"],
    enabled: true,
  },
  {
    id: "safety",
    title: "Seguridad",
    fields: [
      "seguroAccidentes",
      "contactoEmergencia",
      "primeroAuxilios",
      "protocolos",
    ],
    enabled: true,
  },
];

async function migrateCategoriesToFirebase(): Promise<void> {
  try {
    console.log(
      "🚀 Starting migration of package detail categories to Firebase..."
    );

    // Check if surf info already exists
    const existingSurfInfo = await FirebaseService.getDocument(
      COLLECTIONS.SURF_INFO,
      "main"
    );

    if (
      !existingSurfInfo ||
      !(existingSurfInfo as any).packageDetailCategories
    ) {
      console.log("📦 Migrating surf categories...");
      const surfInfo = {
        ...existingSurfInfo,
        packageDetailCategories: SURF_CATEGORIES,
      };
      await FirebaseService.setDocument(
        COLLECTIONS.SURF_INFO,
        "main",
        surfInfo
      );
      console.log("✅ Surf categories migrated successfully");
    } else {
      console.log("ℹ️ Surf categories already exist in Firebase");
    }

    // Check if snowboard info already exists
    const existingSnowboardInfo = await FirebaseService.getDocument(
      COLLECTIONS.SNOWBOARD_INFO,
      "main"
    );

    if (
      !existingSnowboardInfo ||
      !(existingSnowboardInfo as any).packageDetailCategories
    ) {
      console.log("📦 Migrating snowboard categories...");
      const snowboardInfo = {
        ...existingSnowboardInfo,
        packageDetailCategories: SNOWBOARD_CATEGORIES,
      };
      await FirebaseService.setDocument(
        COLLECTIONS.SNOWBOARD_INFO,
        "main",
        snowboardInfo
      );
      console.log("✅ Snowboard categories migrated successfully");
    } else {
      console.log("ℹ️ Snowboard categories already exist in Firebase");
    }

    console.log("🎉 Migration completed successfully!");
    console.log("");
    console.log("📋 Next steps:");
    console.log("1. The categories are now stored in Firebase");
    console.log(
      "2. Visual styling is handled by src/constants/categoryStyles.ts"
    );
    console.log("3. You can now manage categories through the admin panel");
    console.log("4. Constants files no longer contain category data");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    throw error;
  }
}

// Run migration if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateCategoriesToFirebase()
    .then(() => {
      console.log("Migration completed successfully");
      process.exit(0);
    })
    .catch((error: Error) => {
      console.error("Migration failed:", error);
      process.exit(1);
    });
}

export { migrateCategoriesToFirebase };
