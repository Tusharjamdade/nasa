import React from "react";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  // Routes with working Unsplash/NASA Images
  const routes = [
    {
      path: "/dailyimages",
      title: "Daily NASA Image",
      image: "./img1.jpg",
    },
    {
      path: "/rover",
      title: "Mars Rover Photos",
      image: "/img2.jpg",
    },
    {
      path: "/earth",
      title: "Earth Images",
      image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=800&q=80",
    },
    {
      path: "/globalwarming",
      title: "Global Warming Visualizer",
      image: "/img4.jpg",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-4xl font-bold mb-6 text-center">Explore NASA Data  {}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {routes.map((route, index) => (
          <Link to={route.path} key={index} className="group">
            <div className="relative bg-gray-800 rounded-lg shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-105">
              <img
                src={route.image}
                alt={route.title}
                className="w-full h-48 object-cover opacity-90 group-hover:opacity-100 transition-opacity"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-lg font-semibold">{route.title}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
