


import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import DailyImage from "./pages/DailyImage";
import MarsRoverPhotos from "./pages/RoverDailyImages";
import EarthImages from "./pages/EarthImages";
import GlobalWarmingVisualizer from "./pages/GlobalWarming";
import Home from "./pages/Home";

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dailyimages" element={<DailyImage />} />
        <Route path="/rover" element={<MarsRoverPhotos />} />
        <Route path="/earth" element={<EarthImages />} />
        <Route path="/globalwarming" element={<GlobalWarmingVisualizer />} />
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </Router>
  );
};

export default App;
