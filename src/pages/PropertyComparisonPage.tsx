import React, { useState } from 'react';
import { useProperty } from '../context/PropertyContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PropertyComparison from '../components/PropertyComparison';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Property } from '../types';
import { formatCurrency } from '../utils/format';
import { Plus, GitCompare, X, Eye, MapPin, Home, DollarSign } from 'lucide-react';

const PropertyComparisonPage = () => {
  const { properties } = useProperty();
  const [selectedProperties, setSelectedProperties] = useState<Property[]>([]);
  const [showPropertySelector, setShowPropertySelector] = useState(false);
  const maxProperties = 4;

  const handleAddProperty = (property: Property) => {
    if (selectedProperties.length < maxProperties && !selectedProperties.find(p => p.id === property.id)) {
      setSelectedProperties([...selectedProperties, property]);
    }
  };

  const handleRemoveProperty = (propertyId: string) => {
    setSelectedProperties(selectedProperties.filter(p => p.id !== propertyId));
  };

  const availableProperties = properties.filter(
    property => !selectedProperties.find(p => p.id === property.id)
  );

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Enhanced Header */}
          <div className="text-center relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-blue-600/10 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-blue-900/20 rounded-3xl -z-10"></div>
            <div className="py-12 px-8">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-2xl mr-4">
                  <GitCompare className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
                  Property Comparison
                </h1>
              </div>
              <p className="text-gray-600 dark:text-slate-300 max-w-3xl mx-auto text-lg leading-relaxed">
                Compare multiple properties side by side to make informed decisions. 
                Select up to <span className="font-semibold text-blue-600 dark:text-blue-400">{maxProperties} properties</span> to see detailed comparisons.
              </p>
              
              {/* Stats Bar */}
              <div className="flex justify-center items-center gap-8 mt-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{selectedProperties.length}</div>
                  <div className="text-sm text-gray-500 dark:text-slate-400">Selected</div>
                </div>
                <div className="w-px h-8 bg-gray-300 dark:bg-slate-600"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">{availableProperties.length}</div>
                  <div className="text-sm text-gray-500 dark:text-slate-400">Available</div>
                </div>
                <div className="w-px h-8 bg-gray-300 dark:bg-slate-600"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{properties.length}</div>
                  <div className="text-sm text-gray-500 dark:text-slate-400">Total</div>
                </div>
              </div>
            </div>
          </div>

          {/* Selected Properties Quick View */}
          {selectedProperties.length > 0 && (
            <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-slate-200">
                    <Eye className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    Selected Properties ({selectedProperties.length}/{maxProperties})
                  </CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedProperties([])}
                    className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 border-gray-300 dark:border-slate-600"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Clear All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {selectedProperties.map((property) => (
                    <div 
                      key={property.id} 
                      className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/50 dark:to-purple-900/50 border border-blue-200 dark:border-blue-700/50 rounded-lg px-3 py-2 group hover:shadow-md transition-all"
                    >
                      <img
                        src={property.images[0]}
                        alt={property.title}
                        className="w-8 h-8 rounded object-cover"
                      />
                      <span className="text-sm font-medium text-gray-700 dark:text-slate-200 max-w-32 truncate">
                        {property.title}
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRemoveProperty(property.id)}
                        className="h-6 w-6 p-0 hover:bg-red-100 dark:hover:bg-red-900/50 hover:text-red-600 dark:hover:text-red-400"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Enhanced Property Selector */}
          {(selectedProperties.length === 0 || showPropertySelector) && (
            <Card className="border-0 shadow-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/50 dark:to-purple-900/50 border-b dark:border-slate-700">
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2 text-xl text-gray-800 dark:text-slate-200">
                    <Plus className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    Select Properties to Compare
                  </CardTitle>
                  {selectedProperties.length > 0 && (
                    <Button 
                      variant="outline" 
                      onClick={() => setShowPropertySelector(false)}
                      className="hover:bg-blue-50 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 border-gray-300 dark:border-slate-600"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Comparison
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {availableProperties.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="bg-gray-100 dark:bg-slate-700 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <Home className="h-8 w-8 text-gray-400 dark:text-slate-300" />
                    </div>
                    <p className="text-gray-500 dark:text-slate-400 text-lg">
                      No more properties available to add to comparison.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {availableProperties.map((property) => (
                      <Card 
                        key={property.id} 
                        className="group cursor-pointer hover:shadow-xl transition-all duration-300 border-0 bg-white dark:bg-slate-800 hover:-translate-y-1 overflow-hidden"
                      >
                        <div className="relative overflow-hidden">
                          <img
                            src={property.images[0]}
                            alt={property.title}
                            className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          <div className="absolute top-3 left-3">
                            <Badge className={`${
                              property.listingType === 'sell' 
                                ? 'bg-gradient-to-r from-green-500 to-emerald-500 dark:from-green-600 dark:to-emerald-600 shadow-lg' 
                                : 'bg-gradient-to-r from-blue-500 to-cyan-500 dark:from-blue-600 dark:to-cyan-600 shadow-lg'
                            } text-white border-0`}>
                              {property.listingType === 'sell' ? 'For Sale' : 'For Rent'}
                            </Badge>
                          </div>
                          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur rounded-full p-2">
                              <Plus className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            </div>
                          </div>
                        </div>
                        <CardContent className="p-4 space-y-3">
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-slate-200 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {property.title}
                            </h3>
                            <div className="flex items-center text-gray-500 dark:text-slate-400 text-sm mt-1">
                              <MapPin className="h-3 w-3 mr-1" />
                              <span className="line-clamp-1">{property.location}</span>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center pt-2 border-t border-gray-100 dark:border-slate-700">
                            <div className="flex items-center">
                              
                              <span className="font-bold text-green-600 dark:text-green-400 text-lg">
                                {formatCurrency(property.price)}
                              </span>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => handleAddProperty(property)}
                              disabled={selectedProperties.length >= maxProperties}
                              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 dark:from-blue-500 dark:to-purple-500 dark:hover:from-blue-600 dark:hover:to-purple-600 text-white border-0 shadow-md hover:shadow-lg transition-all"
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              Add
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Property Comparison Component */}
          <PropertyComparison
            selectedProperties={selectedProperties}
            onRemoveProperty={handleRemoveProperty}
            onAddProperty={() => setShowPropertySelector(true)}
            maxProperties={maxProperties}
          />

          {/* Enhanced Add More Button */}
          {selectedProperties.length > 0 && !showPropertySelector && (
            <div className="text-center">
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => setShowPropertySelector(true)}
                disabled={availableProperties.length === 0}
                className="bg-white/80 dark:bg-slate-800/80 backdrop-blur border-2 border-dashed border-blue-300 dark:border-blue-700 hover:border-blue-500 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-500 transition-all duration-300"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add More Properties ({availableProperties.length} available)
              </Button>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PropertyComparisonPage;