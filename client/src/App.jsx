import { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home'; // <-- add this
import Notebook from './features/ai-notepad/Notebook';
import AcademicOrganizer from './features/academic-notebook/AcademicOrganizer';
import SharedNotebook from './features/academic-notebook/SharedNotebook';

function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} /> {/* This is the default / route */}
          <Route path="academic-org" element={<AcademicOrganizer />} />
          <Route path="notebook" element={<Notebook/>} />
          {/* Add more routes as needed */}
        </Route>
        <Route path="/share/notebook/:shareId" element={<SharedNotebook />} />
      </Routes>
    </Router>
  );
}

export default App;
