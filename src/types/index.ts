
export type User = {
    id: string;
    name: string;
    email: string;
    isAdmin: boolean;
    avatar?: string;
    phoneNumber?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  address?: string;
  bio?: string;
  createdAt?: string;
  updatedAt?: string;
  };
  
  export type PropertyType = 'villa' | 'apartment' | 'house' | 'land' | 'commercial';
  export type ListingType = 'sell' | 'rent';
  
  export type Property = {
    id: string;
    title: string;
    description: string;
    price: number;
    location: string;
    bedrooms: number;
    bathrooms: number;
    area: number; // in square feet/meters
    images: string[];
    type: PropertyType;
    listingType: ListingType;
    features: string[];
    owner: User;
    createdAt: string;
    isFeatured?: boolean;
  };
  
  export type Comment = {
    id: string;
    propertyId: string;
    author: User;
    content: string;
    rating: number;
    createdAt: string;
  };
  
  export type FilterOptions = {
    type?: PropertyType;
    listingType?: ListingType;
    minPrice?: number;
    maxPrice?: number;
    minBedrooms?: number;
    minBathrooms?: number;
    minArea?: number;
    location?: string;
  };
  