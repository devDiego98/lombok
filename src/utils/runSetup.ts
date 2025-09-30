// Script to run package categories setup
import { migrateCategoriesToFirebase } from "../scripts/migrateCategoriesToFirebase";

// Run the setup
migrateCategoriesToFirebase()
  .then(() => {
    console.log("🎉 Setup completed successfully!");
    process.exit(0);
  })
  .catch((error: Error) => {
    console.error("💥 Setup failed:", error);
    process.exit(1);
  });
