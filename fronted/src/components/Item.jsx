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
        <div onClick={handleClick} className="rounded-2xl p-5 bg-white cursor-pointer">
            <div className="pb-2 relative">
                {images.length > 0 ? (
                    <>
                        <img 
                            src={images[currentImageIndex]} 
                            alt={property.title} 
                            className='rounded-xl w-full h-[200px] object-cover'
                        />
                        {images.length > 1 && (
                            <>
                                <button 
                                    onClick={prevImage}
                                    className="nav-btn absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-1 hover:bg-white"
                                >
                                    <MdNavigateBefore size={24} />
                                </button>
                                <button 
                                    onClick={nextImage}
                                    className="nav-btn absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-1 hover:bg-white"
                                >
                                    <MdNavigateNext size={24} />
                                </button>
                                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
                                    {images.map((_, index) => (
                                        <div 
                                            key={index}
                                            className={`h-1.5 w-1.5 rounded-full ${
                                                index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                                            }`}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </>
                ) : (
                    <div className='rounded-xl w-full h-[200px] bg-gray-50 border border-gray-100 flex items-center justify-center'>
                        <span className="text-gray-400">No Image Available</span>
                    </div>
                )}
                {/* like btn */}
                <div className='absolute top-4 right-6 heart-btn'>
                    <HeartBtn id={property?.id} />
                </div>
            </div>
            <h5 className="bold-16 my-1 text-secondary">{property.city}</h5>
            <h6 className="medium-18 line-clamp-1">{property.title}</h6>
            {/* info */}
            <div className='flex gap-x-2 py-2'>
                <div className='flexCenter gap-x-1 border-r border-slate-900/50 pr-3 font-[520]'>
                    <MdOutlineBed /> {property.facilities?.bedrooms || 0}
                </div>
                <div className='flexCenter gap-x-1 border-r border-slate-900/50 pr-3 font-[520]'>
                    <MdOutlineBathtub /> {property.facilities?.bathrooms || 0}
                </div>
                <div className='flexCenter gap-x-1 border-r border-slate-900/50 pr-3 font-[520]'>
                    <MdOutlineGarage /> {property.facilities?.parkings || 0}
                </div>
                <div className='flexCenter gap-x-1 border-r border-slate-900/50 pr-3 font-[520]'>
                    <CgRuler /> {property.facilities?.area || 400}
                </div>
            </div>
            <p className="pt-2 mb-4 line-clamp-2">{property.description}</p>
            <div className='flexBetween'>
                <div className="bold-20">₹{property.price?.toLocaleString() || 0}.00</div>
                <button className='btn-secondary rounded-xl !py-[7px] !px-5 shadow-sm'>View Details</button>
            </div>
        </div>
    );
};

export default Item;