import { useState, useEffect } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Layout from "./components/Layout";
import AcademicOrganizer from "./features/academic-notebook/AcademicOrganizer";
import SharedNotebook from "./features/academic-notebook/SharedNotebook";
import ResumeAnalyzer from "./features/resume-analyzer/ResumeAnalyzer";
import Pdf_main from "./features/pdf-summarizer/Pdf_main";
import CodingContest from "./features/codefiles/CodingContest";
import CodeFilesDashboard from "./features/codefiles/CodeFilesDashboard";

import Login from "./Authentication/Login";
import Register from "./Authentication/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import ErrorPage from "./pages/ErrorPage";
import SplashScreen from "./components/SplashScreen";
import MobileNotSupported from "./pages/MobileNotSupported";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track login status

  useEffect(() => {
    const checkDevice = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      // Skip loader on mobile
      if (mobile) setIsLoading(false);
      else setIsLoading(true); // optional: reset loader on desktop resize
    };
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token"); 
    if (token) setIsAuthenticated(true);

    if (!isMobile) {
      const timer = setTimeout(() => setIsLoading(false), 3000);
      return () => clearTimeout(timer);
    }

    return () => clearTimeout(timer);
  }, []);

  // if (isLoading) {
  //   return <SplashScreen onLoaded={() => setIsLoading(false)} />;
  // }
  if (isMobile) return <MobileNotSupported />;
  
  return (
    <Router>
      <Routes>
        {/* Landing Page */}
        <Route
          path="/"
          element={<LandingPage isAuthenticated={isAuthenticated} />}
        />

        {/* Auth Routes */}
        <Route
          path="/login"
          element={<Login setIsAuthenticated={setIsAuthenticated} />}
        />
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
          <Route path="code-editor" element={<CodeFilesDashboard />} />
          <Route path="code-contest" element={<CodingContest />} />
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
