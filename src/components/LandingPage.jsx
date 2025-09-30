import React from "react";
import { Link } from "react-router-dom";
import { APP_BG } from "../utils/constant";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      {/* Background Image with Dark Overlay */}
      <div className="absolute inset-0">
        <img
          src={APP_BG}
          alt="Background"
          className="w-full h-full object-cover opacity-50"
        />
        {/* Dark Vignette Effect */}
        <div className="absolute inset-0 bg-gradient-to-t opacity-50 from-black/90 via-black/40 to-black/90"></div>
        {/* Additional Radial Gradient for Center Focus */}
        <div className="absolute inset-0 bg-radial-gradient(circle at center, transparent 0%, black 70%)"></div>
      </div>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-6 relative z-10">
        <div className="text-center max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Find Your
            <span className="block bg-gradient-to-r from-emerald-500 to-blue-400 bg-clip-text text-transparent">
              Perfect Match
            </span>
          </h1>
          <p className="text-gray-200 mb-8 text-lg p-4">
            Meaningful connections start here. Join Stumble today.
          </p>
          <Link
            to="/login"
            className="inline-block px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-300 hover:from-blue-700 hover:to-blue-400 rounded-full font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-2xl"
          >
            Start Your Journey
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
