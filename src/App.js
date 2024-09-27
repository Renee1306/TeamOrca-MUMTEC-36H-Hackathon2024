import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import CodeOptimizationPage from './pages/CodeOptimizationPage';
import PredictiveMaintenancePage from './pages/PredictiveMaintenancePage';
import PerformanceBenchmarkPage from './pages/PerformanceBenchmarkPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="main-content">
          <Sidebar />
          <div className="content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/code-optimization" element={<CodeOptimizationPage />} />
              <Route path="/predictive-maintenance" element={<PredictiveMaintenancePage />} />
              <Route path="/performance-benchmark" element={<PerformanceBenchmarkPage />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
