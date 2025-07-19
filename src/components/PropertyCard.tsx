import { Bath, Bed, Heart, SquareDot } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';
import { useProperty } from '../context/PropertyContext';
import type { Property } from '../types';
import { formatCurrency } from '../utils/format';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter } from './ui/card';

interface PropertyCardProps {
  property: Property;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const { favorites, toggleFavorite } = useProperty();
  console.log('PropertyCard ID:', property.id, 'Title:', property.title); // <--- ADD THIS LINE
  const isFavorite = favorites.includes(property.id);

  return (
    <Card className="property-card overflow-hidden h-full flex flex-col">
      <div className="relative">
        <Link to={`/property/${property.id}`} className="block overflow-hidden">
          <div className="h-48 overflow-hidden">
            <img 
              src={`http://localhost:3001${property.images[0]}`} 
              alt={property.title} 
              className="w-full h-full object-cover transition-transform duration-300"
            />
          </div>
        </Link>
        
        <div className="absolute top-2 left-2 flex gap-2">
          <Badge className={property.listingType === 'sell' ? 'bg-estate-primary' : 'bg-estate-accent'}>
            {property.listingType === 'sell' ? 'For Sale' : 'For Rent'}
          </Badge>
          
          {property.isFeatured && (
            <Badge variant="outline" className="bg-white">Featured</Badge>
          )}
        </div>
        
        <Button
          size="icon"
          variant="ghost"
          className={`absolute top-2 right-2 rounded-full bg-white/80 hover:bg-white ${
            isFavorite ? 'text-red-500' : 'text-gray-500'
          }`}
          onClick={(e) => {
            e.preventDefault();
            toggleFavorite(property.id);
          }}
        >
          <Heart fill={isFavorite ? "currentColor" : "none"} size={20} />
        </Button>
      </div>
      
      <CardContent className="p-4 flex-grow">
        <div className="mb-2">
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-lg line-clamp-1 hover:text-estate-primary transition-colors">
              <Link 
                to={`/property/${property.id}`} 
                className="block hover:text-estate-primary transition-colors"
                onClick={(e) => {
                  // Add this for debugging
                  console.log('Navigating to property:', property.id);
                }}
              >
                <h3 className="font-semibold text-lg mb-1 line-clamp-1">{property.title}</h3>
              </Link>
            </h3>
          </div>
          <p className="text-gray-500 text-sm">{property.location}</p>
        </div>
        
        <div>
          <p className="font-bold text-estate-primary text-xl">
            {formatCurrency(property.price)}
            {property.listingType === 'rent' && <span className="text-sm text-gray-500 font-normal">/month</span>}
          </p>
          
          <p className="text-gray-700 line-clamp-2 text-sm mt-2 mb-3">{property.description}</p>
        </div>
      </CardContent>
      
      <CardFooter className="px-4 py-3 border-t flex justify-between text-sm text-gray-500">
        <div className="flex items-center gap-1">
          <Bed size={16} />
          <span>{property.bedrooms}</span>
        </div>
        <div className="flex items-center gap-1">
          <Bath size={16} />
          <span>{property.bathrooms}</span>
        </div>
        <div className="flex items-center gap-1">
          <SquareDot size={16} />
          <span>{property.area} ft²</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PropertyCard;
