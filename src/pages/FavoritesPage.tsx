
import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import PropertyCard from '../components/PropertyCard';
import { Button } from '../components/ui/button';
import { useProperty } from '../context/PropertyContext';

const FavoritesPage = () => {
  const navigate = useNavigate();
  const { properties, favorites, currentUser, isLoading } = useProperty();
  
  // Get favorite properties
  const favoriteProperties = properties.filter((property: { id: string }) => favorites.includes(property.id));
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Favorite Properties</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            View and manage your saved properties
          </p>
        </div>
        
        {!currentUser ? (
          <div className="max-w-lg mx-auto bg-gray-50 rounded-lg p-8 text-center">
            <Heart size={48} className="mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-medium mb-2">You need to be logged in</h3>
            <p className="text-gray-600 mb-6">
              Please log in to view and manage your favorite properties.
            </p>
            <Button onClick={() => navigate('/login')}>Log In</Button>
          </div>
        ) : isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-estate-primary mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading favorites...</p>
          </div>
        ) : favoriteProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="max-w-lg mx-auto bg-gray-50 rounded-lg p-8 text-center">
            <Heart size={48} className="mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-medium mb-2">No favorites yet</h3>
            <p className="text-gray-600 mb-6">
              You haven't added any properties to your favorites list. Browse properties and click the heart icon to save them here.
            </p>
            <Button onClick={() => navigate('/buy')}>Browse Properties</Button>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default FavoritesPage;
