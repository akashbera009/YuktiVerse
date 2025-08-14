import { useState, useEffect } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Layout from "./components/Layout";
import Notebook from "./features/ai-notepad/Notebook";
import AcademicOrganizer from "./features/academic-notebook/AcademicOrganizer";
import SharedNotebook from "./features/academic-notebook/SharedNotebook";
import Dashboard from "./features/dashboard/Dashboard";
import { LayoutDashboard, LogIn } from "lucide-react";
import SplashScreen from "./components/SplashScreen";
import ResumeAnalyzer from "./features/resume-analyzer/ResumeAnalyzer";
import Pdf_main from "./features/pdf-summarizer/Pdf_main";
import Login from "./Authentication/Login";
import Register from "./Authentication/Register";

import ProtectedRoute from "./components/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import ErrorPage from "./pages/ErrorPage";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track login status

  useEffect(() => {
    const token = localStorage.getItem("token"); // Or however you store auth
    if (token) setIsAuthenticated(true);
    
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <SplashScreen onLoaded={() => setIsLoading(false)} />;
  }

  return (
    <Router>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<LandingPage isAuthenticated={isAuthenticated} />} />

        {/* Auth Routes */}
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/register" element={<Register />} />

        {/* Feature Routes */}
        <Route
          path="/feature"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="academic-org" element={<AcademicOrganizer />} />
          <Route path="resume-analyzer" element={<ResumeAnalyzer />} />
          <Route path="pdf-summarizer" element={<Pdf_main />} />
        </Route>

        {/* Public Share Route */}
        <Route path="/share/notebook/:shareId" element={<SharedNotebook />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>

    </Router>
  );
}
export default App;
