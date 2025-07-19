import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PropertyCard from '../components/PropertyCard';
import PropertyFilter from '../components/PropertyFilter';
import { useProperty } from '../context/PropertyContext';
import { ListingType } from '../types';

interface PropertiesPageProps {
  listingType?: ListingType;
  title: string;
  description: string;
}

const PropertiesPage: React.FC<PropertiesPageProps> = ({ listingType, title, description }) => {
  const location = useLocation();
  const { filteredProperties, isLoading, setFilterOptions } = useProperty();
  
  // Apply URL query parameters as filters
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const type = query.get('type');
    
    const newFilters: any = {};
    
    // Add type from query params
    if (type) {
      newFilters.type = type;
    }
    
    // Add listingType from props
    if (listingType) {
      newFilters.listingType = listingType;
    }
    
    // Apply the filters
    setFilterOptions(newFilters);
  }, [location.search, listingType, setFilterOptions]);
  
  // Filter by the specific listing type if provided
  const properties = listingType
    ? filteredProperties.filter(p => p.listingType === listingType)
    : filteredProperties;
  
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-blue-900">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12 flex-1">
        {/* Enhanced Header with gradient background */}
        <div className="relative text-center mb-12">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-teal-600/10 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-teal-900/20 rounded-3xl blur-3xl"></div>
          <div className="relative bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 dark:border-slate-700/20">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 dark:from-blue-400 dark:via-purple-400 dark:to-teal-400 bg-clip-text text-transparent">
              {title}
            </h1>
            <p className="text-slate-600 dark:text-slate-300 text-lg max-w-3xl mx-auto leading-relaxed">
              {description}
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Enhanced Sidebar with filters */}
          <div className="lg:sticky lg:top-8 lg:self-start">
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-slate-700/20 p-6">
              <div className="flex items-center mb-4">
                <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-500 dark:from-blue-400 dark:to-purple-400 rounded-full mr-3"></div>
                <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Filters</h2>
              </div>
              <PropertyFilter />
            </div>
          </div>
          
          {/* Enhanced Properties grid */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="text-center py-16">
                <div className="relative">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-200 dark:border-slate-600 mx-auto"></div>
                  <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 dark:border-blue-400 mx-auto absolute inset-0"></div>
                </div>
                <div className="mt-6 space-y-2">
                  <p className="text-xl font-medium text-slate-700 dark:text-slate-200">Finding perfect properties</p>
                  <p className="text-slate-500 dark:text-slate-400">Please wait while we search...</p>
                </div>
              </div>
            ) : properties.length > 0 ? (
              <div className="space-y-6">
                {/* Results count */}
                <div className="flex items-center justify-between bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl p-4 border border-white/20 dark:border-slate-700/20">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 dark:bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-slate-700 dark:text-slate-200 font-medium">
                      {properties.length} {properties.length === 1 ? 'property' : 'properties'} found
                    </span>
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    Updated just now
                  </div>
                </div>
                
                {/* Properties grid with enhanced spacing */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {properties.map((property, index) => (
                    <div 
                      key={property.id}
                      className="transform transition-all duration-300 hover:scale-[1.02] hover:-translate-y-2"
                      style={{
                        animationDelay: `${index * 100}ms`
                      }}
                    >
                      <PropertyCard property={property} />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-slate-100/50 to-blue-100/50 dark:from-slate-900/50 dark:to-blue-900/50 rounded-3xl blur-3xl"></div>
                <div className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-12 text-center shadow-lg border border-white/20 dark:border-slate-700/20">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-slatearxiv
                    -200 to-slate-300 dark:from-slate-700 dark:to-slate-600 rounded-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-slate-400 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold mb-3 text-slate-700 dark:text-slate-200">No properties found</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed max-w-md mx-auto">
                    We couldn't find any properties matching your criteria. Try adjusting your search filters to discover more options.
                  </p>
                  <div className="mt-6 flex items-center justify-center space-x-2 text-sm text-slate-400 dark:text-slate-300">
                    <div className="w-2 h-2 bg-slate-300 dark:bg-slate-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-slate-300 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-slate-300 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PropertiesPage;