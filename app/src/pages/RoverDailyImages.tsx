import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";

const MarsRoverPhotos = () => {
  const [photos, setPhotos] = useState([]);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [rover, setRover] = useState("curiosity");
  const [camera, setCamera] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_KEY =import.meta.env.VITE_NASA_API_KEY;

  const fetchPhotos = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos`,
        {
          params: {
            earth_date: selectedDate,
            camera: camera || undefined,
            api_key: API_KEY,
          },
        }
      );
      setPhotos(response.data.photos);
    } catch (err) {
      setError("Failed to fetch Mars Rover photos. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, [selectedDate, rover, camera]);

  return (
    <div className="flex flex-col items-center p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-4">Mars Rover Photos</h1>
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <label className="text-lg">Select Date:
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            max={format(new Date(), "yyyy-MM-dd")}
            className="p-2 text-gray-900 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ml-2"
          />
        </label>
        <label className="text-lg">Select Rover:
          <select
            value={rover}
            onChange={(e) => setRover(e.target.value)}
            className="p-2 text-gray-900 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ml-2"
          >
            <option value="curiosity">Curiosity</option>
            <option value="opportunity">Opportunity</option>
            <option value="spirit">Spirit</option>
          </select>
        </label>
        <label className="text-lg">Select Camera:
          <input
            type="text"
            placeholder="Optional"
            value={camera}
            onChange={(e) => setCamera(e.target.value)}
            className="p-2 text-gray-900 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ml-2"
          />
        </label>
      </div>

      {loading && <p className="text-lg text-yellow-500">Loading...</p>}
      {error && <p className="text-lg text-red-500">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {photos.length > 0 ? (
          photos.map((photo) => (
            <img
              key={photo.id}
              src={photo.img_src}
              alt={`Mars Rover ${rover}`}
              className="w-full rounded-lg shadow-md"
            />
          ))
        ) : (
          !loading && <p className="text-lg text-gray-400">No photos available for this date.</p>
        )}
      </div>
    </div>
  );
};

export default MarsRoverPhotos;