import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { formatCurrency } from '../utils/format';
import { X, Plus } from 'lucide-react';
import { Property } from '../types';
import PropertyCard from './PropertyCard';

interface PropertyComparisonProps {
  selectedProperties: Property[];
  onRemoveProperty: (propertyId: string) => void;
  onAddProperty: () => void;
  maxProperties?: number;
}

const PropertyComparison: React.FC<PropertyComparisonProps> = ({
  selectedProperties,
  onRemoveProperty,
  onAddProperty,
  maxProperties = 4
}) => {
  if (selectedProperties.length === 0) {
    return (
      <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
        <CardContent className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-800 dark:text-slate-200 mb-2">No Properties Selected</h3>
          <p className="text-gray-600 dark:text-slate-400 mb-4">
            Select properties to compare them side by side.
          </p>
          <Button
            onClick={onAddProperty}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 dark:from-blue-500 dark:to-purple-500 dark:hover:from-blue-600 dark:hover:to-purple-600 text-white border-0 shadow-md hover:shadow-lg"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Properties to Compare
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-200">Property Comparison</h2>
        {selectedProperties.length < maxProperties && (
          <Button
            onClick={onAddProperty}
            variant="outline"
            className="text-blue-600 dark:text-blue-400 border-blue-300 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/50 hover:text-blue-700 dark:hover:text-blue-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Property
          </Button>
        )}
      </div>

      {/* Mobile View - Cards */}
      <div className="block md:hidden space-y-4">
        {selectedProperties.map((property) => (
          <div key={property.id} className="relative">
            <Button
              size="icon"
              variant="ghost"
              className="absolute top-2 right-2 z-10 bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-700"
              onClick={() => onRemoveProperty(property.id)}
            >
              <X className="h-4 w-4 text-gray-600 dark:text-slate-200" />
            </Button>
            <PropertyCard property={property} />
          </div>
        ))}
      </div>

      {/* Desktop View - Table */}
      <div className="hidden md:block">
        <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-200 dark:border-slate-700">
                  <TableHead className="w-32 text-gray-800 dark:text-slate-200 font-semibold">Property</TableHead>
                  {selectedProperties.map((property) => (
                    <TableHead key={property.id} className="text-center relative">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="absolute top-1 right-1 h-6 w-6 hover:bg-red-100 dark:hover:bg-red-900/50 hover:text-red-600 dark:hover:text-red-400"
                        onClick={() => onRemoveProperty(property.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                      <div className="pr-8">
                        <img
                          src={property.images[0]}
                          alt={property.title}
                          className="w-full h-32 object-cover rounded mb-2"
                        />
                        <p className="font-medium text-sm line-clamp-2 text-gray-700 dark:text-slate-200">{property.title}</p>
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="border-b border-gray-200 dark:border-slate-700">
                  <TableCell className="font-medium text-gray-800 dark:text-slate-200">Price</TableCell>
                  {selectedProperties.map((property) => (
                    <TableCell key={property.id} className="text-center text-gray-700 dark:text-slate-200">
                      <span className="font-bold text-blue-600 dark:text-blue-400">
                        {formatCurrency(property.price)}
                        {property.listingType === 'rent' && (
                          <span className="text-sm text-gray-500 dark:text-slate-400 font-normal">/month</span>
                        )}
                      </span>
                    </TableCell>
                  ))}
                </TableRow>
                
                <TableRow className="border-b border-gray-200 dark:border-slate-700">
                  <TableCell className="font-medium text-gray-800 dark:text-slate-200">Type</TableCell>
                  {selectedProperties.map((property) => (
                    <TableCell key={property.id} className="text-center">
                      <Badge
                        className={`${
                          property.listingType === 'sell'
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500 dark:from-green-600 dark:to-emerald-600'
                            : 'bg-gradient-to-r from-blue-500 to-cyan-500 dark:from-blue-600 dark:to-cyan-600'
                        } text-white border-0`}
                      >
                        {property.listingType === 'sell' ? 'For Sale' : 'For Rent'}
                      </Badge>
                    </TableCell>
                  ))}
                </TableRow>
                
                <TableRow className="border-b border-gray-200 dark:border-slate-700">
                  <TableCell className="font-medium text-gray-800 dark:text-slate-200">Location</TableCell>
                  {selectedProperties.map((property) => (
                    <TableCell key={property.id} className="text-center text-sm text-gray-700 dark:text-slate-200">
                      {property.location}
                    </TableCell>
                  ))}
                </TableRow>
                
                <TableRow className="border-b border-gray-200 dark:border-slate-700">
                  <TableCell className="font-medium text-gray-800 dark:text-slate-200">Property Type</TableCell>
                  {selectedProperties.map((property) => (
                    <TableCell key={property.id} className="text-center capitalize text-gray-700 dark:text-slate-200">
                      {property.type}
                    </TableCell>
                  ))}
                </TableRow>
                
                <TableRow className="border-b border-gray-200 dark:border-slate-700">
                  <TableCell className="font-medium text-gray-800 dark:text-slate-200">Bedrooms</TableCell>
                  {selectedProperties.map((property) => (
                    <TableCell key={property.id} className="text-center text-gray-700 dark:text-slate-200">
                      {property.bedrooms || '0'}
                    </TableCell>
                  ))}
                </TableRow>
                
                <TableRow className="border-b border-gray-200 dark:border-slate-700">
                  <TableCell className="font-medium text-gray-800 dark:text-slate-200">Bathrooms</TableCell>
                  {selectedProperties.map((property) => (
                    <TableCell key={property.id} className="text-center text-gray-700 dark:text-slate-200">
                      {property.bathrooms || '0'}
                    </TableCell>
                  ))}
                </TableRow>
                
                <TableRow className="border-b border-gray-200 dark:border-slate-700">
                  <TableCell className="font-medium text-gray-800 dark:text-slate-200">Area (sq ft)</TableCell>
                  {selectedProperties.map((property) => (
                    <TableCell key={property.id} className="text-center text-gray-700 dark:text-slate-200">
                      {property.area.toLocaleString()}
                    </TableCell>
                  ))}
                </TableRow>
                
                <TableRow className="border-b border-gray-200 dark:border-slate-700">
                  <TableCell className="font-medium text-gray-800 dark:text-slate-200">Price per sq ft</TableCell>
                  {selectedProperties.map((property) => (
                    <TableCell key={property.id} className="text-center text-gray-700 dark:text-slate-200">
                      {formatCurrency(Math.round(property.price / property.area))}
                    </TableCell>
                  ))}
                </TableRow>
                
                <TableRow className="border-b border-gray-200 dark:border-slate-700">
                  <TableCell className="font-medium text-gray-800 dark:text-slate-200">Owner</TableCell>
                  {selectedProperties.map((property) => (
                    <TableCell key={property.id} className="text-center text-sm text-gray-700 dark:text-slate-200">
                      {property.owner.name}
                    </TableCell>
                  ))}
                </TableRow>
                
                <TableRow className="border-b border-gray-200 dark:border-slate-700">
                  <TableCell className="font-medium text-gray-800 dark:text-slate-200">Features</TableCell>
                  {selectedProperties.map((property) => (
                    <TableCell key={property.id} className="text-center">
                      <div className="space-y-1">
                        {property.features.slice(0, 3).map((feature, index) => (
                          <div
                            key={index}
                            className="text-xs bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-200 px-2 py-1 rounded"
                          >
                            {feature}
                          </div>
                        ))}
                        {property.features.length > 3 && (
                          <div className="text-xs text-gray-500 dark:text-slate-400">
                            +{property.features.length - 3} more
                          </div>
                        )}
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PropertyComparison;