import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react"; // For icons

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gray-900 text-white p-4 fixed w-full top-0 shadow-lg z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold">
          NASA Explorer
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6">
          <Link to="/" className="hover:text-blue-400 transition">Home</Link>
          <Link to="/dailyimages" className="hover:text-blue-400 transition">Daily Image</Link>
          <Link to="/rover" className="hover:text-blue-400 transition">Mars Rover</Link>
          <Link to="/earth" className="hover:text-blue-400 transition">Earth Images</Link>
          <Link to="/globalwarming" className="hover:text-blue-400 transition">Global Warming</Link>
        </div>

        {/* Mobile Menu Button */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden focus:outline-none">
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-gray-800 absolute w-full left-0 top-16 flex flex-col px-2 space-y-4 py-4 shadow-lg">
          <Link to="/" className="hover:text-blue-400 transition" onClick={() => setIsOpen(false)}>Home</Link>
          <Link to="/dailyimages" className="hover:text-blue-400 transition" onClick={() => setIsOpen(false)}>Daily Image</Link>
          <Link to="/rover" className="hover:text-blue-400 transition" onClick={() => setIsOpen(false)}>Mars Rover</Link>
          <Link to="/earth" className="hover:text-blue-400 transition" onClick={() => setIsOpen(false)}>Earth Images</Link>
          <Link to="/globalwarming" className="hover:text-blue-400 transition" onClick={() => setIsOpen(false)}>Global Warming</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
