import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaHeart } from 'react-icons/fa';
import { IoArrowBack, IoArrowForward } from 'react-icons/io5';

const Property = ({ property }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  // Get all available images
  const allImages = Array.isArray(property?.images) && property?.images.length > 0
    ? property.images
    : property?.image
    ? [property.image]
    : [];

  const handlePrevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  const handleClick = () => {
    const isAdminPage = location.pathname.includes('/admin');
    if (!isAdminPage) {
      navigate(`/properties/${property.id}`);
    }
  };

  return (
    <div
      className="relative bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer overflow-hidden"
      onClick={handleClick}
    >
      <div className="relative h-[200px] w-full">
        {allImages.length > 0 ? (
          <>
            <img
              src={allImages[currentImageIndex]}
              alt={property.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/400x200?text=No+Image';
              }}
            />
            {allImages.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-1.5 hover:bg-white transition-colors"
                >
                  <IoArrowBack className="text-gray-700" size={20} />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-1.5 hover:bg-white transition-colors"
                >
                  <IoArrowForward className="text-gray-700" size={20} />
                </button>
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
                  {allImages.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full bg-gray-50 flex items-center justify-center">
            <span className="text-gray-400 text-sm">No Image Available</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{property.title}</h3>
        <p className="text-gray-600 text-sm mb-2">
          {property.city}, {property.country}
        </p>
        <div className="flex justify-between items-center">
          <span className="text-blue-600 font-semibold">
            ₹{property.price.toLocaleString()}
          </span>
          {location.pathname.includes('/favorites') && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemoveFromFavorites(property.id);
              }}
              className="text-red-500 hover:text-red-600 transition-colors"
            >
              <FaHeart size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Property; 