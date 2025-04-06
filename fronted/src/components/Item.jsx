import React, { useState } from 'react'
import HeartBtn from './HeartBtn'
import { MdOutlineBathtub, MdOutlineBed, MdOutlineGarage, MdNavigateNext, MdNavigateBefore } from 'react-icons/md'
import { Link, useNavigate } from 'react-router-dom'
import { CgRuler } from 'react-icons/cg'

const Item = ({property}) => {
    const navigate = useNavigate();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    
    const handleClick = (e) => {
        // Prevent navigation if clicking on the heart button or navigation buttons
        if (e.target.closest('.heart-btn') || e.target.closest('.nav-btn')) {
            return;
        }
        navigate(`/listing/${property.id}`);
    };

    const images = property.images || [property.image].filter(Boolean);

    const nextImage = (e) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = (e) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <div onClick={handleClick} className="group rounded-xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
            <div className="relative">
                {images.length > 0 ? (
                    <>
                        <img 
                            src={images[currentImageIndex]} 
                            alt={property.title} 
                            className='w-full h-[280px] object-cover transition-transform duration-300 group-hover:scale-105'
                        />
                        {images.length > 1 && (
                            <>
                                <button 
                                    onClick={prevImage}
                                    className="nav-btn absolute left-3 top-1/2 transform -translate-y-1/2 bg-white/90 rounded-full p-2 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                >
                                    <MdNavigateBefore size={20} className="text-gray-700" />
                                </button>
                                <button 
                                    onClick={nextImage}
                                    className="nav-btn absolute right-3 top-1/2 transform -translate-y-1/2 bg-white/90 rounded-full p-2 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                >
                                    <MdNavigateNext size={20} className="text-gray-700" />
                                </button>
                                <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1.5">
                                    {images.map((_, index) => (
                                        <div 
                                            key={index}
                                            className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                                                index === currentImageIndex ? 'bg-white w-3' : 'bg-white/60'
                                            }`}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </>
                ) : (
                    <div className='w-full h-[280px] bg-gray-50 border border-gray-100 flex items-center justify-center'>
                        <span className="text-gray-400">No Image Available</span>
                    </div>
                )}
                {/* like btn */}
                <div className='absolute top-4 right-4 heart-btn'>
                    <HeartBtn id={property?.id} />
                </div>
            </div>
            <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                    <h5 className="text-sm font-medium text-[#70B944]">{property.city}</h5>
                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">For Sale</span>
                </div>
                <h6 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-1">{property.title}</h6>
                {/* info */}
                <div className='grid grid-cols-4 gap-3 py-3 border-t border-b border-gray-100'>
                    <div className='flex items-center gap-1.5 text-gray-700'>
                        <MdOutlineBed className="text-lg" /> 
                        <span className="text-sm">{property.facilities?.bedrooms || 0}</span>
                    </div>
                    <div className='flex items-center gap-1.5 text-gray-700'>
                        <MdOutlineBathtub className="text-lg" /> 
                        <span className="text-sm">{property.facilities?.bathrooms || 0}</span>
                    </div>
                    <div className='flex items-center gap-1.5 text-gray-700'>
                        <MdOutlineGarage className="text-lg" /> 
                        <span className="text-sm">{property.facilities?.parkings || 0}</span>
                    </div>
                    <div className='flex items-center gap-1.5 text-gray-700'>
                        <CgRuler className="text-lg" /> 
                        <span className="text-sm">{property.facilities?.area || 400}</span>
                    </div>
                </div>
                <p className="text-sm text-gray-600 mt-3 mb-4 line-clamp-2">{property.description}</p>
                <div className='flex items-center justify-between'>
                    <div className="text-xl font-bold text-[#70B944]">₹{property.price?.toLocaleString() || 0}</div>
                    <button className='px-4 py-2 text-sm font-medium text-white bg-[#70B944] hover:bg-[#5fa338] transition-colors rounded-lg'>View Details</button>
                </div>
            </div>
        </div>
    );
};

export default Item;