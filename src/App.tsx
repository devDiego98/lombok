import { Routes, Route, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SnowboardTrip from "./pages/SnowboardTrip";
import SurfTrip from "./pages/SurfTrip";
import Privacidad from "./pages/Privacidad";
import AdminPanel from "./components/AdminPanel";
import ProtectedRoute from "./components/ProtectedRoute";
import LombokLoader from "./components/LombokLoader";
import { useGlobalDataLoader } from "./hooks/useGlobalDataLoader";
import { DataProvider } from "./contexts/DataContext";
import { AuthProvider } from "./contexts/AuthContext";
import type { GlobalData } from "./types";

function App() {
  const { loading, error, progress, currentTask, data } = useGlobalDataLoader();
  const location = useLocation();

  // Debug logging
  console.log("Current route:", location.pathname);

  // Show global loader while loading all Firebase data
  if (loading) {
    return (
      <LombokLoader
        progress={progress}
        currentTask={currentTask}
        error={error}
      />
    );
  }

  // Show main app once all data is loaded, wrapped in DataProvider and AuthProvider
  return (
    <AuthProvider>
      <DataProvider data={data as GlobalData}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/snowboard" element={<SnowboardTrip />} />
          <Route path="/surf" element={<SurfTrip />} />
          <Route path="/privacidad" element={<Privacidad />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminPanel />
              </ProtectedRoute>
            }
          />
        </Routes>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
