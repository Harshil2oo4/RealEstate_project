import React, { useState } from 'react';
import useProperties from '../hooks/useProperties';
import Item from '../components/Item';
import { VscSettings } from "react-icons/vsc";

const Listing = () => {
  const [filter, setFilter] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [facilities, setFacilities] = useState({ beds: 0, baths: 0 });
  const [showFilters, setShowFilters] = useState(false);

  const { data = [], isError, isLoading } = useProperties();

  const filteredProperties = data.filter((property) => {
    // Text search filter
    const searchMatch = !filter || 
      (property.title && property.title.toLowerCase().includes(filter.toLowerCase())) ||
      (property.city && property.city.toLowerCase().includes(filter.toLowerCase())) ||
      (property.country && property.country.toLowerCase().includes(filter.toLowerCase()));

    // Price filter
    const priceMatch = (!priceRange.min || property.price >= parseInt(priceRange.min)) &&
      (!priceRange.max || property.price <= parseInt(priceRange.max));

    // Beds and baths filter
    const bedsMatch = !facilities.beds || (property.facilities && property.facilities.bedrooms >= facilities.beds);
    const bathsMatch = !facilities.baths || (property.facilities && property.facilities.bathrooms >= facilities.baths);

    return searchMatch && priceMatch && bedsMatch && bathsMatch;
  });

  const handleResetFilters = () => {
    setFilter('');
    setPriceRange({ min: '', max: '' });
    setFacilities({ beds: 0, baths: 0 });
    setShowFilters(false);
  };

  const FilterPanel = () => (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="space-y-4">
        {/* Price Range */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Price Range</h3>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min Price"
              value={priceRange.min}
              onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#70B944]"
            />
            <input
              type="number"
              placeholder="Max Price"
              value={priceRange.max}
              onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#70B944]"
            />
          </div>
        </div>

        {/* Facilities */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Facilities</h3>
          <div className="flex gap-2">
            <div className="w-1/2">
              <label className="text-xs text-gray-500">Bedrooms</label>
              <select
                value={facilities.beds}
                onChange={(e) => setFacilities(prev => ({ ...prev, beds: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#70B944]"
              >
                <option value={0}>Any</option>
                {[1, 2, 3, 4, 5].map(num => (
                  <option key={num} value={num}>{num}+</option>
                ))}
              </select>
            </div>
            <div className="w-1/2">
              <label className="text-xs text-gray-500">Bathrooms</label>
              <select
                value={facilities.baths}
                onChange={(e) => setFacilities(prev => ({ ...prev, baths: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#70B944]"
              >
                <option value={0}>Any</option>
                {[1, 2, 3, 4, 5].map(num => (
                  <option key={num} value={num}>{num}+</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Reset Filters */}
        <button
          onClick={handleResetFilters}
          className="w-full px-4 py-2 text-sm text-[#70B944] border border-[#70B944] rounded-md hover:bg-[#70B944] hover:text-white transition-colors"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );

  return (
    <main className="max-pad-container my-[99px]">
      <div className="max-pad-container py-10 xl:py-22 bg-primary rounded-3xl">
        <div>
          {/* Search and Filter Header */}
          <div className="flex items-center justify-between mb-8 px-4">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Search by name, city, or country..."
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#70B944]"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="ml-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <VscSettings size={24} className="text-[#70B944]" />
            </button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mb-6 px-4">
              <FilterPanel />
            </div>
          )}

          {/* Property Grid */}
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 mt-10 px-4">
            {isLoading ? (
              <div className="col-span-full text-center">Loading properties...</div>
            ) : isError ? (
              <div className="col-span-full text-center text-red-500">Error loading properties</div>
            ) : filteredProperties.length > 0 ? (
              filteredProperties.map((property) => (
                <Item 
                  key={property.id || property._id} 
                  property={{
                    ...property,
                    id: property.id || property._id // Ensure id is consistently available
                  }} 
                />
              ))
            ) : (
              <div className="col-span-full text-center">No properties found matching your criteria</div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Listing;


