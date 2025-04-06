import React, { useState, useEffect } from 'react'
import HeartBtn from './HeartBtn'
import { MdOutlineBathtub, MdOutlineBed, MdOutlineGarage, MdNavigateNext, MdNavigateBefore } from 'react-icons/md'
import { Link, useNavigate } from 'react-router-dom'
import { CgRuler } from 'react-icons/cg'

const Item = ({property}) => {
    const navigate = useNavigate();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    
    useEffect(() => {
        console.log("Property data:", property);
        console.log("Images array:", property.images);
        console.log("Single image:", property.image);
    }, [property]);

    const handleClick = (e) => {
        // Prevent navigation if clicking on the heart button or navigation buttons
        if (e.target.closest('.heart-btn') || e.target.closest('.nav-btn')) {
            return;
        }
        navigate(`/listing/${property.id}`);
    };

    // Use images array if available, otherwise fallback to single image
    const images = property.images?.length ? property.images : [property.image].filter(Boolean);
    console.log("Processed images array:", images);

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
                        <div className="relative w-full" style={{ paddingBottom: '75%' }}> {/* 4:3 aspect ratio */}
                            <div className="absolute inset-0 overflow-hidden group">
                                {/* Image with fade transition */}
                                {images.map((img, index) => {
                                    console.log(`Rendering image ${index}:`, img);
                                    return (
                                        <img 
                                            key={index}
                                            src={img} 
                                            alt={`${property.title} - Image ${index + 1}`} 
                                            className={`absolute top-0 left-0 w-full h-full object-cover transition-all duration-700 ${
                                                index === currentImageIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
                                            } group-hover:scale-110`}
                                            onError={(e) => {
                                                console.error(`Error loading image ${index}:`, e);
                                                e.target.src = "https://placehold.co/600x400?text=Error+Loading+Image";
                                            }}
                                            onLoad={() => console.log(`Image ${index} loaded successfully`)}
                                            loading="lazy"
                                        />
                                    );
                                })}

                                {/* Add overlay gradient */}
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            </div>
                        </div>
                        
                        {images.length > 1 && (
                            <>
                                {/* Navigation buttons */}
                                <button 
                                    onClick={prevImage}
                                    className="nav-btn absolute left-3 top-1/2 transform -translate-y-1/2 bg-white/90 rounded-full p-2 hover:bg-white opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-md z-10"
                                >
                                    <MdNavigateBefore size={24} className="text-gray-700" />
                                </button>
                                <button 
                                    onClick={nextImage}
                                    className="nav-btn absolute right-3 top-1/2 transform -translate-y-1/2 bg-white/90 rounded-full p-2 hover:bg-white opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-md z-10"
                                >
                                    <MdNavigateNext size={24} className="text-gray-700" />
                                </button>

                                {/* Image counter */}
                                <div className="absolute bottom-3 right-3 bg-black/50 text-white px-2 py-1 rounded-md text-sm z-10">
                                    {currentImageIndex + 1} / {images.length}
                                </div>

                                {/* Dots indicator */}
                                <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1.5 z-10">
                                    {images.map((_, index) => (
                                        <button 
                                            key={index}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setCurrentImageIndex(index);
                                            }}
                                            className={`h-1.5 rounded-full transition-all duration-300 ${
                                                index === currentImageIndex 
                                                    ? 'w-4 bg-white' 
                                                    : 'w-1.5 bg-white/60 hover:bg-white/80'
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
                <div className='absolute top-4 right-4 heart-btn z-20'>
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