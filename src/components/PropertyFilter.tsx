
import React, { useState } from 'react';
import { useProperty } from '../context/PropertyContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from './ui/select';
import { Slider } from './ui/slider';
import { formatCurrency } from '../utils/format';
const PropertyFilter: React.FC = () => {
  const { setFilterOptions } = useProperty();
  
  const [location, setLocation] = useState('');
  const [propertyType, setPropertyType] = useState('any');
  const [listingType, setListingType] = useState('any');
  const [priceRange, setPriceRange] = useState([0, 3000000]);
  const [bedrooms, setBedrooms] = useState('any');
  const [bathrooms, setBathrooms] = useState('any');
  
  const handleApplyFilters = () => {
    setFilterOptions({
      location: location || undefined,
      type: propertyType === 'any' ? undefined : propertyType as any,
      listingType: listingType === 'any' ? undefined : listingType as any,
      minPrice: priceRange[0] || undefined,
      maxPrice: priceRange[1] || undefined,
      minBedrooms: bedrooms === 'any' ? undefined : parseInt(bedrooms),
      minBathrooms: bathrooms === 'any' ? undefined : parseInt(bathrooms),
    });
  };
  
  const handleResetFilters = () => {
    setLocation('');
    setPropertyType('any');
    setListingType('any');
    setPriceRange([0, 50000000]);
    setBedrooms('any');
    setBathrooms('any');
    setFilterOptions({});
  };
  
  return (
    <div className="bg-card rounded-lg p-5 shadow-sm border">
      <h2 className="text-lg font-semibold mb-4 text-foreground">Filter Properties</h2>
      
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-foreground">Location</label>
          <Input 
            placeholder="Enter city, state" 
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="mt-1"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium text-foreground">Property Type</label>
            <Select value={propertyType} onValueChange={setPropertyType}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="villa">Villa</SelectItem>
                <SelectItem value="apartment">Apartment</SelectItem>
                <SelectItem value="house">House</SelectItem>
                <SelectItem value="land">Land</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium text-foreground">Listing Type</label>
            <Select value={listingType} onValueChange={setListingType}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="sell">Buy</SelectItem>
                <SelectItem value="rent">Rent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium text-foreground">Price Range</label>
            <span className="text-sm text-muted-foreground">
            ₹{priceRange[0].toLocaleString()} - ₹{priceRange[1].toLocaleString()}
            </span>
          </div>
          <Slider
            defaultValue={priceRange}
            max={50000000}
            step={50000}
            value={priceRange}
            onValueChange={setPriceRange}
            className="mt-1"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium text-foreground">Bedrooms</label>
            <Select value={bedrooms} onValueChange={setBedrooms}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="1">1+</SelectItem>
                <SelectItem value="2">2+</SelectItem>
                <SelectItem value="3">3+</SelectItem>
                <SelectItem value="4">4+</SelectItem>
                <SelectItem value="5">5+</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium text-foreground">Bathrooms</label>
            <Select value={bathrooms} onValueChange={setBathrooms}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="1">1+</SelectItem>
                <SelectItem value="2">2+</SelectItem>
                <SelectItem value="3">3+</SelectItem>
                <SelectItem value="4">4+</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex gap-3 pt-2">
          <Button 
            onClick={handleApplyFilters} 
            className="flex-1 bg-estate-primary hover:bg-estate-accent"
          >
            Apply Filters
          </Button>
          <Button 
            onClick={handleResetFilters} 
            variant="outline"
            className="flex-1"
          >
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PropertyFilter;