import { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route ,Navigate } from "react-router-dom";
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

function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>

{/* 
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LogIn />} />
       
      
      </Routes> */}


      <Routes>
        {/* Redirect root to login */}
        {/* <Route path="/" element={<Navigate to="/login" />} /> */}
        <Route path="/" element={<Home/>} />

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
          }>
            <Route path="academic-org" element={<AcademicOrganizer />} />
            <Route path="resume-analyzer" element={<ResumeAnalyzer />} />
            <Route path="pdf-summarizer" element={ <Pdf_main />} />
            {/* <Route path="notebook" element={<Notebook />} /> */}

        </Route>

        {/* Public Share Route */}
        <Route path="/share/notebook/:shareId" element={<SharedNotebook />} />
  

        {/* Protected Routes */}
        {/* <Route
          path="/feature/resume-analyzer"
          element={
            <ProtectedRoute>
              <ResumeAnalyzer />
            </ProtectedRoute>
          }
        /> */}
        {/* <Route
          path="/feature/pdf-summarizer"
          element={
            <ProtectedRoute>
              <Pdf_main />
            </ProtectedRoute>
          }
        /> */}

        {/* Fallback - if route not found, go to login */}
        {/* <Route path="*" element={<Navigate to="/login" />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
