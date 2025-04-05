import { Button, Group } from "@mantine/core";
import React, { useEffect, useRef, useState } from "react";
import { MdCloudUpload, MdDelete } from "react-icons/md";

const UploadImage = ({ propertyDetails, setPropertyDetails, prevStep, nextStep }) => {
    const [imageURLs, setImageURLs] = useState(propertyDetails.images || []);
    const cloudinaryRef = useRef();
    const widgetRef = useRef();

    const handleNext = () => {
        setPropertyDetails((prev) => ({ 
            ...prev, 
            images: imageURLs,
            image: imageURLs[0] || "" // Set the first image as the main image for backward compatibility
        }));
        nextStep();
    };

    const handleRemoveImage = (indexToRemove) => {
        setImageURLs(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    useEffect(() => {
        cloudinaryRef.current = window.cloudinary;
        widgetRef.current = cloudinaryRef.current.createUploadWidget(
            {
                cloudName: "dlrj9hmzj",
                uploadPreset: "LotusNest",
                maxFiles: 5, // Allow up to 5 images
            },
            (error, result) => {
                if (result.event === "success") {
                    setImageURLs(prev => [...prev, result.info.secure_url]);
                }
            }
        );
    }, []);

    return (
        <div className="mt-12 flexCenter flex-col">
            <div className="flex flex-wrap gap-4 w-3/4 mb-4">
                {imageURLs.map((url, index) => (
                    <div key={index} className="relative">
                        <img 
                            src={url} 
                            alt={`Property ${index + 1}`} 
                            className="w-[200px] h-[150px] object-cover rounded-lg"
                        />
                        <button
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                            <MdDelete size={20} />
                        </button>
                    </div>
                ))}
            </div>
            
            <div
                onClick={() => widgetRef.current?.open()}
                className="flexCenter flex-col w-3/4 h-[15rem] border-dashed border-2 cursor-pointer mb-4"
            >
                <MdCloudUpload size={44} color="grey" />
                <span>Upload Images (up to 5)</span>
            </div>

            <Group justify="center" mt="xl">
                <Button onClick={prevStep}>Go Back</Button>
                <Button onClick={handleNext} disabled={imageURLs.length === 0}>
                    Next
                </Button>
            </Group>
        </div>
    );
};

export default UploadImage;
