import React, { useState, useEffect, useCallback } from "react";

const ImageCarousel = ({ photos, autoPlay = true, interval = 3000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlay);

  // Handle next/previous navigation
  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === photos.length - 1 ? 0 : prevIndex + 1
    );
  }, [photos.length]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? photos.length - 1 : prevIndex - 1
    );
  }, [photos.length]);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || photos.length <= 1) return;

    const timer = setInterval(goToNext, interval);
    return () => clearInterval(timer);
  }, [isAutoPlaying, goToNext, interval, photos.length]);

  return (
    <div className="relative w-full max-w-md mx-auto h-full bg-black rounded-lg overflow-hidden shadow-xl">
      {/* Main Image */}
      <div className="relative w-full h-full">
        <img
          src={photos[currentIndex]}
          alt={`Profile ${currentIndex + 1}`}
          className="w-full h-full object-cover"
          loading="lazy"
        />

        {photos.length > 1 && (
          <div className="absolute top-2 left-4 right-4 flex gap-1 z-10">
            {Array.from({ length: photos.length }).map((_, index) => (
              <div
                key={index}
                className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-emerald-600"
                    : "bg-gray-400 bg-opacity-50"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Navigation Arrows */}
      {photos.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/10 bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all duration-200 hover:scale-110"
            aria-label="Previous photo"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/10 bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all duration-200 hover:scale-110"
            aria-label="Next photo"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </>
      )}
    </div>
  );
};

export default ImageCarousel;
