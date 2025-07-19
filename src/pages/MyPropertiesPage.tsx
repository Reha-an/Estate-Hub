import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useProperty } from '../context/PropertyContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useToast } from '../components/ui/use-toast';
import { Edit, Trash2, Eye, Plus } from 'lucide-react';

const MyPropertiesPage = () => {
  const { currentUser, properties, deleteProperty } = useProperty();
  const { toast } = useToast();
  
  if (!currentUser) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-12 flex flex-1 items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle>Access Denied</CardTitle>
              <CardDescription>
                Please log in to view your properties
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button asChild>
                <Link to="/login">Go to Login</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  // Filter properties owned by current user
  const userProperties = properties.filter(property => property.owner.email === currentUser.email);

  const handleEdit = (propertyId: string) => {
    window.location.href = `/edit-property/${propertyId}`;
  };

  const handleDelete = async (propertyId: string) => {
    try {
      await deleteProperty(propertyId);
      toast({
        title: "Property Deleted",
        description: "Your property has been successfully deleted.",
      });
    } catch (error) {
      console.error("Failed to delete property:", error);
      toast({
        title: "Error",
        description: "Failed to delete property. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12 flex-1">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Properties</h1>
              <p className="text-gray-600 mt-2">Manage your property listings</p>
            </div>
            <Button className="bg-estate-primary hover:bg-estate-accent" asChild>
              <Link to="/sell">
                <Plus className="h-4 w-4 mr-2" />
                Add New Property
              </Link>
            </Button>
          </div>

          {userProperties.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <h3 className="text-lg font-medium mb-2">No Properties Listed</h3>
                <p className="text-gray-600 mb-4">
                  You haven't listed any properties yet. Start by adding your first property.
                </p>
                <Button className="bg-estate-primary hover:bg-estate-accent" asChild>
                  <Link to="/sell">
                    <Plus className="h-4 w-4 mr-2" />
                    List Your First Property
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userProperties.map((property) => (
                <Card key={property.id} className="overflow-hidden">
                  <div className="relative">
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge
                        variant={property.listingType === 'sell' ? 'default' : 'secondary'}
                        className={property.listingType === 'sell' ? 'bg-green-500' : 'bg-blue-500'}
                      >
                        For {property.listingType === 'sell' ? 'Sale' : 'Rent'}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg line-clamp-1">{property.title}</CardTitle>
                    <CardDescription className="line-clamp-1">{property.location}</CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-estate-primary">
                      ₹{property.price.toLocaleString()}
                        {property.listingType === 'rent' && <span className="text-sm text-gray-500">/month</span>}
                      </span>
                    </div>
                    
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{property.bedrooms} beds</span>
                      <span>{property.bathrooms} baths</span>
                      <span>{property.area} sqft</span>
                    </div>
                    
                    <div className="flex space-x-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        asChild
                      >
                        <Link to={`/property/${property.id}`}>
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleEdit(property.id)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-red-600 hover:text-red-700"
                        onClick={() => handleDelete(property.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default MyPropertiesPage;