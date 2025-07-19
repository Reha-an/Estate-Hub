// frontend/src/context/PropertyContext.tsx
import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { toast } from '../components/ui/use-toast';
import { Comment, FilterOptions, Property, User } from '../types';

const PropertyContext = createContext(null);
const API_BASE_URL = 'http://localhost:3001/api';

export const PropertyProvider = ({ children }) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({});
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Add refs to track loading states and prevent duplicate calls
  const isLoadingProperties = useRef(false);
  const isApplyingFilters = useRef(false);
  const lastFilterKey = useRef('');

  const getAuthToken = () => localStorage.getItem('authToken');
  const setAuthToken = (token: string) => localStorage.setItem('authToken', token);
  const removeAuthToken = () => localStorage.removeItem('authToken');

  // Generate a key from filter options to detect actual changes
  const getFilterKey = useCallback((filters: FilterOptions) => {
    return JSON.stringify({
      type: filters.type || '',
      listingType: filters.listingType || '',
      minPrice: filters.minPrice || 0,
      maxPrice: filters.maxPrice || 0,
      minBedrooms: filters.minBedrooms || 0,
      minBathrooms: filters.minBathrooms || 0,
      minArea: filters.minArea || 0,
      location: filters.location || ''
    });
  }, []);

  // Memoized function to apply filters
  const applyFilters = useCallback(async (filters: FilterOptions, allProperties: Property[]) => {
    const filterKey = getFilterKey(filters);
    
    // Skip if already applying filters or no actual change in filters
    if (isApplyingFilters.current || filterKey === lastFilterKey.current) {
      return;
    }
    
    isApplyingFilters.current = true;
    lastFilterKey.current = filterKey;
    
    try {
      setIsLoading(true);
      
      // Check if we have any filters applied
      const hasFilters = Object.values(filters).some(value => 
        value !== undefined && value !== '' && value !== 0
      );
      
      if (!hasFilters) {
        // No filters, just return all properties
        setFilteredProperties(allProperties);
        return;
      }
      
      // Build query string from filter options
      const params = new URLSearchParams();
      if (filters.type) params.append('type', filters.type);
      if (filters.listingType) params.append('listingType', filters.listingType);
      if (filters.minPrice !== undefined && filters.minPrice > 0) params.append('minPrice', filters.minPrice.toString());
      if (filters.maxPrice !== undefined && filters.maxPrice > 0) params.append('maxPrice', filters.maxPrice.toString());
      if (filters.minBedrooms !== undefined && filters.minBedrooms > 0) params.append('minBedrooms', filters.minBedrooms.toString());
      if (filters.minBathrooms !== undefined && filters.minBathrooms > 0) params.append('minBathrooms', filters.minBathrooms.toString());
      if (filters.minArea !== undefined && filters.minArea > 0) params.append('minArea', filters.minArea.toString());
      if (filters.location) params.append('location', filters.location);
      
      const queryString = params.toString();
      
      if (!queryString) {
        // No meaningful filters, return all properties
        setFilteredProperties(allProperties);
        return;
      }
      
      const url = `${API_BASE_URL}/properties?${queryString}`;
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setFilteredProperties(data);
      } else {
        throw new Error('Failed to fetch filtered properties');
      }
    } catch (error) {
      console.error('Error applying filters:', error);
      // Fallback to client-side filtering if API filtering fails
      let filtered = [...allProperties];
      if (filters.type) filtered = filtered.filter(p => p.type === filters.type);
      if (filters.listingType) filtered = filtered.filter(p => p.listingType === filters.listingType);
      if (filters.minPrice !== undefined && filters.minPrice > 0) filtered = filtered.filter(p => p.price >= filters.minPrice);
      if (filters.maxPrice !== undefined && filters.maxPrice > 0) filtered = filtered.filter(p => p.price <= filters.maxPrice);
      if (filters.minBedrooms !== undefined && filters.minBedrooms > 0) filtered = filtered.filter(p => p.bedrooms >= filters.minBedrooms);
      if (filters.minBathrooms !== undefined && filters.minBathrooms > 0) filtered = filtered.filter(p => p.bathrooms >= filters.minBathrooms);
      if (filters.minArea !== undefined && filters.minArea > 0) filtered = filtered.filter(p => p.area >= filters.minArea);
      if (filters.location) filtered = filtered.filter(p => p.location.toLowerCase().includes(filters.location.toLowerCase()));
      setFilteredProperties(filtered);
    } finally {
      setIsLoading(false);
      isApplyingFilters.current = false;
    }
  }, [getFilterKey]);

  // Load properties from API - only once
  useEffect(() => {
    const loadProperties = async () => {
      if (isLoadingProperties.current) return;
      
      try {
        isLoadingProperties.current = true;
        setIsLoading(true);
        
        const response = await fetch(`${API_BASE_URL}/properties`);
        
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error(`Expected JSON response but got ${contentType}`);
        }
        
        if (response.ok) {
          const data = await response.json();
          setProperties(data);
          setFilteredProperties(data);
        } else {
          throw new Error('Failed to fetch properties');
        }
      } catch (error) {
        console.error('Error loading properties:', error);
        toast({ title: 'Error', description: 'Failed to load properties.', variant: 'destructive' });
        // Fallback to mock data if needed
        try {
          const { mockProperties } = await import('../data/mockData');
          setProperties(mockProperties);
          setFilteredProperties(mockProperties);
        } catch (mockError) {
          console.error('Failed to load mock data:', mockError);
        }
      } finally {
        setIsLoading(false);
        isLoadingProperties.current = false;
      }
    };
    
    // Only load if we don't have properties yet
    if (properties.length === 0) {
      loadProperties();
    }
  }, []); // Remove properties dependency

  // Auth check on app load - UPDATED to include all profile fields
  useEffect(() => {
  const checkAuth = async () => {
    const token = getAuthToken();
    if (token) {
      try {
        setIsLoading(true); // Set loading state
        console.log('Starting auth check...');
        
        const response = await fetch(`${API_BASE_URL}/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log('Auth check response:', data);
          
          // Include ALL profile fields from the response
          const userData = {
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            isAdmin: data.user.role === 'admin',
            avatar: data.user.avatar || '',
            phoneNumber: data.user.phoneNumber || '',
            gender: data.user.gender,
            address: data.user.address || '',
            bio: data.user.bio || '',
            createdAt: data.user.createdAt,
            updatedAt: data.user.updatedAt
          };
          
          setCurrentUser(userData);
          console.log('Auth check: Current user with full profile:', userData);
          
          const storedFavs = localStorage.getItem(`favorites_${userData.id}`);
          console.log('Auth check: Stored favorites from localStorage:', storedFavs);
          if (storedFavs) setFavorites(JSON.parse(storedFavs));
        } else {
          console.log('Auth check failed, removing token');
          removeAuthToken();
          setCurrentUser(null);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        removeAuthToken();
        setCurrentUser(null);
      } finally {
        setIsLoading(false); // Always clear loading state
        console.log('Auth check completed');
      }
    } else {
      // No token found, not authenticated
      setCurrentUser(null);
      setIsLoading(false);
      console.log('No auth token found');
    }
  };
  
  checkAuth();
}, []);

  // Apply filters - with debouncing and change detection
  useEffect(() => {
    if (properties.length > 0) {
      const timeoutId = setTimeout(() => {
        applyFilters(filterOptions, properties);
      }, 300); // 300ms debounce
      
      return () => clearTimeout(timeoutId);
    }
  }, [filterOptions, properties, applyFilters]);
  

  // ✅ FIXED: Fetch property by ID
  const fetchPropertyById = async (id: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/properties/${id}`);
      if (response.ok) {
        const data = await response.json();
        // Update the property in the properties array
        setProperties(prev => {
          const index = prev.findIndex(p => String(p.id) === String(id));
          if (index >= 0) {
            const updated = [...prev];
            updated[index] = { ...data, id: data._id || data.id };
            return updated;
          }
          return [...prev, { ...data, id: data._id || data.id }];
        });
        return { ...data, id: data._id || data.id };
      } else {
        throw new Error('Failed to fetch property');
      }
    } catch (error) {
      console.error('Error fetching property:', error);
      return properties.find(p => String(p.id) === String(id)) || null;
    } finally {
      setIsLoading(false);
    }
  };
  
  const getPropertyById = useCallback((id: string) => {
    return properties.find(p => String(p.id) === String(id)) || null;
  }, [properties]);

  // ✅ FIXED: Add comment function
  const addComment = async (propertyId: string, text: string, rating: number = 5) => {
    try {
      if (!currentUser) {
        toast({ title: 'Error', description: 'You must be logged in to add a comment.', variant: 'destructive' });
        return false;
      }

      const token = getAuthToken();
      if (!token) {
        toast({ title: 'Error', description: 'Authentication token not found.', variant: 'destructive' });
        return false;
      }

      const response = await fetch(`${API_BASE_URL}/properties/${propertyId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ text, rating }),
      });

      if (response.ok) {
        const updatedProperty = await response.json();
        
        // Update the property in both properties arrays
        const propertyWithId = { ...updatedProperty, id: updatedProperty._id || updatedProperty.id };
        
        setProperties(prevProperties =>
          prevProperties.map(p =>
            String(p.id) === String(propertyId) ? propertyWithId : p
          )
        );
        
        setFilteredProperties(prevProperties =>
          prevProperties.map(p =>
            String(p.id) === String(propertyId) ? propertyWithId : p
          )
        );
        
        toast({ title: 'Success', description: 'Comment added successfully.' });
        return true;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add comment');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({ title: 'Error', description: `Failed to add comment: ${error.message}`, variant: 'destructive' });
      return false;
    }
  };

  const toggleFavorite = useCallback((propertyId: string) => {
    if (!currentUser) {
      toast({ title: 'Error', description: 'You must be logged in to save favorites.', variant: 'destructive' });
      return;
    }

    console.log('Toggling favorite for propertyId:', propertyId);
    console.log('Current user ID for localStorage key:', currentUser.id);
    console.log('Current favorites before toggle:', favorites);

    setFavorites(prev => {
      const newFavorites = prev.includes(propertyId)
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId];
      
      console.log('New favorites after toggle:', newFavorites);
      localStorage.setItem(`favorites_${currentUser.id}`, JSON.stringify(newFavorites));
      
      return newFavorites;
    });
  }, [currentUser, favorites]);

  const signup = async (name: string, email: string, password: string, role: string = 'user') => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }
  
      const data = await response.json();
      setAuthToken(data.token);
  
      setCurrentUser({
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        isAdmin: data.user.role === 'admin',
        avatar: data.user.avatar || '',
        phoneNumber: data.user.phoneNumber || '',
        gender: data.user.gender,
        address: data.user.address || '',
        bio: data.user.bio || '',
        createdAt: data.user.createdAt,
        updatedAt: data.user.updatedAt
      });
  
      toast({ title: 'Success', description: 'Account created successfully!' });
      return true;
    } catch (error: any) {
      console.error('Signup error:', error);
      toast({ title: 'Error', description: error.message || 'Failed to create account.', variant: 'destructive' });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
  
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error(`Expected JSON response but got ${contentType}`);
      }
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }
  
      const data = await response.json();
      setAuthToken(data.token);
      
      setCurrentUser({
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        isAdmin: data.user.role === 'admin',
        avatar: data.user.avatar || '',
        phoneNumber: data.user.phoneNumber || '',
        gender: data.user.gender,
        address: data.user.address || '',
        bio: data.user.bio || '',
        createdAt: data.user.createdAt,
        updatedAt: data.user.updatedAt
      });
  
      const storedFavs = localStorage.getItem(`favorites_${data.user.id}`);
      if (storedFavs) setFavorites(JSON.parse(storedFavs));
  
      toast({ title: 'Success', description: 'Logged in successfully!' });
      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast({ title: 'Error', description: error.message || 'Failed to log in.', variant: 'destructive' });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = useCallback(() => {
    removeAuthToken();
    setCurrentUser(null);
    setFavorites([]);
    toast({ title: 'Success', description: 'Logged out successfully!' });
  }, []);

  const createProperty = async (propertyData: FormData) => {
    try {
      if (!currentUser) {
        toast({ title: 'Error', description: 'You must be logged in to create a property.', variant: 'destructive' });
        return false;
      }
  
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/properties`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: propertyData
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create property');
      }
  
      const data = await response.json();
      const propertyWithId = { ...data, id: data._id || data.id };
      
      setProperties(prev => [...prev, propertyWithId]);
      setFilteredProperties(prev => [...prev, propertyWithId]);
  
      toast({ title: 'Success', description: 'Property created successfully!' });
      return true;
    } catch (error) {
      console.error('Error creating property:', error);
      toast({ title: 'Error', description: (error as Error).message || 'Failed to create property.', variant: 'destructive' });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProperty = async (propertyId: string) => {
    try {
      if (!currentUser) {
        toast({ title: 'Error', description: 'You must be logged in to delete a property.', variant: 'destructive' });
        return false;
      }

      setIsLoading(true);
      const token = getAuthToken();
      if (!token) {
        toast({ title: 'Error', description: 'Authentication token not found.', variant: 'destructive' });
        return false;
      }

      const response = await fetch(`${API_BASE_URL}/properties/${propertyId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete property');
      }

      setProperties(prev => prev.filter(p => p.id !== propertyId));
      setFilteredProperties(prev => prev.filter(p => p.id !== propertyId));

      toast({ title: 'Success', description: 'Property deleted successfully!' });
      return true;
    } catch (error) {
      console.error('Error deleting property:', error);
      toast({ title: 'Error', description: (error as Error).message || 'Failed to delete property.', variant: 'destructive' });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // UPDATED: Use the /me endpoint for profile updates
  const updateUser = async (userData: {
    name: string;
    email: string;
    phoneNumber?: string;
    gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
    address?: string;
    bio?: string;
  }) => {
    try {
      if (!currentUser) {
        toast({ title: 'Error', description: 'You must be logged in to update your profile.', variant: 'destructive' });
        return false;
      }
  
      setIsLoading(true);
      const token = getAuthToken();
      if (!token) {
        toast({ title: 'Error', description: 'Authentication token not found.', variant: 'destructive' });
        return false;
      }
  
      const response = await fetch(`${API_BASE_URL}/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }
  
      const data = await response.json();
      
      // Update the current user in state with ALL fields
      setCurrentUser({
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        isAdmin: data.user.role === 'admin',
        avatar: data.user.avatar || '',
        phoneNumber: data.user.phoneNumber || '',
        gender: data.user.gender,
        address: data.user.address || '',
        bio: data.user.bio || '',
        createdAt: data.user.createdAt,
        updatedAt: data.user.updatedAt
      });
  
      toast({ title: 'Success', description: 'Profile updated successfully!' });
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({ title: 'Error', description: error.message || 'Failed to update profile.', variant: 'destructive' });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProperty = async (propertyId: string, propertyData: FormData) => {
    try {
      if (!currentUser) {
        toast({ title: 'Error', description: 'You must be logged in to update a property.', variant: 'destructive' });
        return false;
      }

      setIsLoading(true);
      const token = getAuthToken();
      if (!token) {
        toast({ title: 'Error', description: 'Authentication token not found.', variant: 'destructive' });
        return false;
      }

      const response = await fetch(`${API_BASE_URL}/properties/${propertyId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: propertyData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update property');
      }

      const data = await response.json();
      const propertyWithId = { ...data, id: data._id || data.id };
      
      setProperties(prev => prev.map(p => (p.id === propertyId ? propertyWithId : p)));
      setFilteredProperties(prev => prev.map(p => (p.id === propertyId ? propertyWithId : p)));

      toast({ title: 'Success', description: 'Property updated successfully!' });
      return true;
    } catch (error) {
      console.error('Error updating property:', error);
      toast({ title: 'Error', description: (error as Error).message || 'Failed to update property.', variant: 'destructive' });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const contextValue = {
    properties,
    currentUser,
    favorites,
    filteredProperties,
    filterOptions,
    isLoading,
    getPropertyById,
    toggleFavorite,
    setFilterOptions,
    signup,
    login,
    logout,
    createProperty,
    fetchPropertyById,
    setProperties,
    setFavorites,
    setCurrentUser,
    setFilteredProperties,
    setIsLoading,
    deleteProperty,
    updateProperty,
    addComment,
    updateUser,
  };

  return (
    <PropertyContext.Provider value={contextValue}>
      {children}
    </PropertyContext.Provider>
  );
};

export const useProperty = () => useContext(PropertyContext);