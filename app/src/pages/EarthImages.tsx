import React, { useState, useEffect } from "react";
import axios from "axios";

const EPIC = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [date, setDate] = useState("");
  const API_KEY =import.meta.env.VITE_NASA_API_KEY;

  useEffect(() => {
    if (date) {
      fetchImages();
    }
  }, [date]);

  const fetchImages = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `https://api.nasa.gov/EPIC/api/natural/date/${date}?api_key=${API_KEY}`
      );
      setImages(response.data);
    } catch (err) {
      setError("Failed to fetch EPIC images.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-4">Earth Polychromatic Imaging Camera (EPIC)</h1>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        max={new Date().toISOString().split("T")[0]}
        className="p-2 text-gray-900 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {loading && <p className="text-lg text-yellow-500">Loading...</p>}
      {error && <p className="text-lg text-red-500">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {images.map((img) => (
          <img
            key={img.identifier}
            src={`https://epic.gsfc.nasa.gov/archive/natural/${date.replace(/-/g, "/")}/png/${img.image}.png`}
            alt={img.caption}
            className="w-full rounded-lg shadow-md"
          />
        ))}
      </div>
    </div>
  );
};

export default EPIC;