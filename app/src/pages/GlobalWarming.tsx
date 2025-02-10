import React, { useState, useEffect } from "react";
import axios from "axios";
import Slider from "@mui/material/Slider";

const GlobalWarmingVisualizer = () => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [year, setYear] = useState(new Date().getFullYear());
  const API_KEY =import.meta.env.VITE_NASA_API_KEY;


  // Use a fixed location where satellite images are available (Example: San Francisco)
  const LAT = 37.7749;
  const LON = -122.4194;

  useEffect(() => {
    fetchImages();
  }, [year]);

  const fetchImages = async () => {
    setLoading(true);
    setError(null);
    setImage(null);
    
    try {
      const response = await axios.get(
        `https://api.nasa.gov/planetary/earth/assets?lon=${LON}&lat=${LAT}&date=${year}-06-01&dim=0.2&api_key=${API_KEY}`
      );

      if (response.data.url) {
        setImage(response.data.url);
      } else {
        setError("No satellite image available for this year.");
      }
    } catch (err) {
      setError("Failed to fetch images. Please try a different year.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-4">Global Warming Visualizer</h1>
      <p className="mb-2">Use the slider to see Earth images from different years.</p>
      
      <Slider
        value={year}
        min={2000}
        max={new Date().getFullYear()}
        step={1}
        onChange={(e, newValue) => setYear(newValue)}
        className="w-3/4"
      />

      <p className="mt-2">Year: {year}</p>

      {loading && <p className="text-lg text-yellow-500">Loading...</p>}
      {error && <p className="text-lg text-red-500">{error}</p>}

      <div className="mt-6">
        {image ? (
          <img src={image} alt={`Earth ${year}`} className="w-full max-w-lg rounded-lg shadow-md" />
        ) : (
          <p className="text-lg text-gray-400">No images available for the selected year.</p>
        )}
      </div>
    </div>
  );
};

export default GlobalWarmingVisualizer;
