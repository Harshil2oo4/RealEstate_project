import React, { useState, useRef, useEffect } from 'react';
import { Modal, Button, TextInput, NumberInput, Textarea, Group } from '@mantine/core';
import { MdCloudUpload, MdDelete } from 'react-icons/md';

const EditPropertyModal = ({ property, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: property?.title || '',
    description: property?.description || '',
    price: property?.price || 0,
    address: property?.address || '',
    city: property?.city || '',
    country: property?.country || '',
    image: property?.image || '',
    images: property?.images || []
  });

  const cloudinaryRef = useRef();
  const widgetRef = useRef();

  useEffect(() => {
    cloudinaryRef.current = window.cloudinary;
    widgetRef.current = cloudinaryRef.current.createUploadWidget(
      {
        cloudName: "dlrj9hmzj",
        uploadPreset: "LotusNest",
        maxFiles: 5,
      },
      (error, result) => {
        if (result.event === "success") {
          setFormData(prev => ({
            ...prev,
            images: [...prev.images, result.info.secure_url],
            image: prev.image || result.info.secure_url // Set as main image if none exists
          }));
        }
      }
    );
  }, []);

  const handleRemoveImage = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title="Edit Property"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Image Upload Section */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Property Images
          </label>
          <div className="flex flex-wrap gap-4 mb-4">
            {formData.images.map((url, index) => (
              <div key={index} className="relative">
                <img 
                  src={url} 
                  alt={`Property ${index + 1}`}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <MdDelete size={16} />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => widgetRef.current?.open()}
            className="w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 flex items-center justify-center gap-2"
          >
            <MdCloudUpload size={20} />
            Upload Images (up to 5)
          </button>
        </div>

        <TextInput
          label="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
        
        <Textarea
          label="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
          minRows={3}
        />

        <NumberInput
          label="Price"
          value={formData.price}
          onChange={(value) => setFormData({ ...formData, price: value })}
          required
          min={0}
        />

        <TextInput
          label="Address"
          value={formData.address || ''}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          placeholder="Enter full address"
          required
        />

        <TextInput
          label="City"
          value={formData.city || ''}
          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          placeholder="Enter city"
          required
        />

        <TextInput
          label="Country"
          value={formData.country || ''}
          onChange={(e) => setFormData({ ...formData, country: e.target.value })}
          placeholder="Enter country"
          required
        />

        <Group position="right" mt="md">
          <Button variant="subtle" onClick={onClose}>Cancel</Button>
          <Button type="submit" color="blue">Save Changes</Button>
        </Group>
      </form>
    </Modal>
  );
};

export default EditPropertyModal; 