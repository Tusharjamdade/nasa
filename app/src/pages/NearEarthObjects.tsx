import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";

interface NEOData {
  id: string;
  name: string;
  close_approach_data: { close_approach_date: string; relative_velocity: { kilometers_per_second: string }; miss_distance: { kilometers: string } }[];
  estimated_diameter: { kilometers: { estimated_diameter_max: number } };
  is_potentially_hazardous_asteroid: boolean;
  predicted_hazard?: boolean;
}

const NEODataFetcher: React.FC = () => {
  const [startDate, setStartDate] = useState<string>(format(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"));
  const [endDate, setEndDate] = useState<string>(format(new Date(), "yyyy-MM-dd"));
  const [neoData, setNeoData] = useState<NEOData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const API_KEY = import.meta.env.VITE_NASA_API_KEY;
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const MODEL_API_URL = `${BACKEND_URL}/predict`;

  const fetchNEOData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `https://api.nasa.gov/neo/rest/v1/feed?start_date=${startDate}&end_date=${endDate}&api_key=${API_KEY}`
      );
      const fetchedData: NEOData[] = Object.values(response.data.near_earth_objects).flat();
      
      const enrichedData = await Promise.all(
        fetchedData.map(async (neo) => {
          if (!neo.close_approach_data[0]) return neo;
          
          const size = neo.estimated_diameter.kilometers.estimated_diameter_max;
          const velocity = parseFloat(neo.close_approach_data[0].relative_velocity.kilometers_per_second);
          const distance = parseFloat(neo.close_approach_data[0].miss_distance.kilometers);
          
          try {
            const modelResponse = await axios.post(MODEL_API_URL, { size, velocity, distance });
            return { ...neo, predicted_hazard: modelResponse.data.hazardous };
          } catch (modelError) {
            console.error("Error fetching prediction:", modelError);
            return { ...neo, predicted_hazard: null };
          }
        })
      );
      setNeoData(enrichedData);
    } catch (err) {
      setError("Failed to fetch NEO data. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNEOData();
  }, [startDate, endDate]);

  return (
    <div className="flex flex-col items-center p-8 bg-gray-900 min-h-screen text-white mt-15">
      <h1 className="text-4xl font-bold mb-6 text-center text-blue-400">Near Earth Object Tracker</h1>
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <div className="flex flex-col">
          <label htmlFor="start-date" className="text-lg mb-1">Start Date:</label>
          <input
            type="date"
            id="start-date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            max={endDate}
            className="p-2 text-gray-100 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="end-date" className="text-lg mb-1">End Date:</label>
          <input
            type="date"
            id="end-date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            max={format(new Date(), "yyyy-MM-dd")}
            className="p-2 text-gray-100 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {loading && <p className="text-lg text-yellow-500">Loading...</p>}
      {error && <p className="text-lg text-red-500">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {neoData.map((neo) => (
          <div key={neo.id} className="border border-gray-700 p-6 rounded-lg shadow-lg bg-gray-800">
            <h3 className="text-xl font-semibold text-blue-300 mb-2">{neo.name}</h3>
            <p className="text-sm text-gray-400">Close Approach Date: <span className="text-white">{neo.close_approach_data[0]?.close_approach_date}</span></p>
            <p className="text-sm text-gray-400">Estimated Diameter (km): <span className="text-white">{neo.estimated_diameter.kilometers.estimated_diameter_max.toFixed(3)}</span></p>
            <p className={`text-sm font-semibold ${neo.is_potentially_hazardous_asteroid ? "text-red-500" : "text-green-400"}`}>
              {neo.is_potentially_hazardous_asteroid ? "Hazardous" : "Non-Hazardous"}
            </p>
            <p className={`text-sm font-semibold ${neo.predicted_hazard ? "text-red-500" : "text-green-400"}`}>
              ML Prediction: {neo.predicted_hazard === null ? "Unknown" : neo.predicted_hazard ? "Hazardous" : "Non-Hazardous"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NEODataFetcher;
