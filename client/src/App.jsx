import { useState, useEffect } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home"; // <-- add this
import Notebook from "./features/ai-notepad/Notebook";
import AcademicOrganizer from "./features/academic-notebook/AcademicOrganizer";
import SharedNotebook from "./features/academic-notebook/SharedNotebook";
import Dashboard from "./features/dashboard/Dashboard";
import { LayoutDashboard, LogIn } from "lucide-react";

import ResumeAnalyzer from "./features/resume-analyzer/ResumeAnalyzer";
import Pdf_main from "./features/pdf-summarizer/Pdf_main";
import Login from "./Authentication/Login";
import Register from "./Authentication/Register";

import ProtectedRoute from "./components/ProtectedRoute";
import LandingPage from "./pages/LandingPage";

function App() {
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000); // 3 seconds splash screen

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    // Render splash screen while loading
    // return <SplashScreen onLoaded={() => setIsLoading(false)} />;
  }

  return (<>
    <Router>
      {/* 
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LogIn />} />
       
      
      </Routes> */}

      <Routes>
        {/* Redirect root to login */}
        {/* <Route path="/" element={<Navigate to="/login" />} /> */}
        <Route path="/" element={<LandingPage />} />

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* academic org Routes */}
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
          {/* <Route path="notebook" element={<Notebook />} /> */}
        </Route>

        {/* Public Share Route */}
        <Route path="/share/notebook/:shareId" element={<SharedNotebook />} />
      </Routes>
    </Router>





      </>
  );
}

export default App;
