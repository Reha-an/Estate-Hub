import { Search } from 'lucide-react';
import React, { useState } from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import PropertyCard from '../components/PropertyCard';
import PropertyFilter from '../components/PropertyFilter';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useProperty } from '../context/PropertyContext';

const SearchPage = () => {
  const { filteredProperties, isLoading, setFilterOptions } = useProperty();
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleSearch = (e) => {
    e.preventDefault();
    setFilterOptions({ location: searchQuery });
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <div className="py-12 bg-estate-primary">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h1 className="text-3xl md:text-4xl font-bold mb-6">Find Your Dream Property</h1>
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                placeholder="Search by location (city, state, neighborhood...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 h-12 bg-white text-gray-900 placeholder-gray-500 border-gray-300 focus:border-estate-accent focus:ring-estate-accent"
              />
              <Button type="submit" className="bg-estate-accent hover:bg-estate-accent/90 h-12">
                <Search size={20} className="mr-2" />
                Search
              </Button>
            </form>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar with filters */}
          <div>
            <PropertyFilter />
          </div>
          
          {/* Properties grid */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <h2 className="text-xl font-bold">
                {isLoading ? (
                  'Loading properties...'
                ) : (
                  `${filteredProperties.length} Properties Found`
                )}
              </h2>
            </div>
            
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-estate-primary mx-auto"></div>
                <p className="mt-4 text-gray-500">Loading properties...</p>
              </div>
            ) : filteredProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <h3 className="text-lg font-medium mb-2">No properties found</h3>
                <p className="text-gray-600">
                  Try adjusting your search filters or try a different location.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default SearchPage;