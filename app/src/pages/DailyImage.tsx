import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";

// Define the expected structure of the APOD API response
interface ApodData {
  title: string;
  url: string;
  explanation: string;
  date: string;
  media_type: "image" | "video";
  copyright?: string;
}

const DailyImage: React.FC = () => {
  const [apod, setApod] = useState<ApodData | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(
    format(new Date(), "yyyy-MM-dd")
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Environment variable handling (for Vite & Next.js)
  const API_KEY =import.meta.env.VITE_NASA_API_KEY;

  const fetchAPOD = async (date: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<ApodData>(
        `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&date=${date}`
      );
      setApod(response.data);
    } catch (err) {
      setError("Failed to fetch APOD. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAPOD(selectedDate);
  }, [selectedDate]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-4">Astronomy Picture of the Day</h1>
      <div className="mb-6">
        <label htmlFor="apod-date" className="mr-2 text-lg">
          Select Date:
        </label>
        <input
          type="date"
          id="apod-date"
          value={selectedDate}
          onChange={handleDateChange}
          max={format(new Date(), "yyyy-MM-dd")}
          className="p-2 text-gray-900 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {loading && <p className="text-lg text-yellow-500">Loading...</p>}
      {error && <p className="text-lg text-red-500">{error}</p>}

      {apod && (
        <div className="max-w-4xl bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">{apod.title}</h2>
          {apod.media_type === "image" ? (
            <img
              src={apod.url}
              alt={apod.title}
              className="w-full rounded-lg shadow-md mb-4"
            />
          ) : (
            <iframe
              src={apod.url}
              title={apod.title}
              className="w-full h-64 rounded-lg shadow-md mb-4"
              allowFullScreen
            />
          )}
          <p className="text-gray-300 mb-2">{apod.explanation}</p>
          <p className="text-gray-400">
            <strong>Date:</strong> {apod.date}
          </p>
          {apod.copyright && (
            <p className="text-gray-400">
              <strong>Copyright:</strong> {apod.copyright}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default DailyImage;