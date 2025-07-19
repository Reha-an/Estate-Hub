import { ArrowLeft, Bath, Bed, Heart, MapPin, MessageSquare, Home, Ruler, Calendar } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import ContactOwnerModal from '../components/ContactOwnerModal';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Textarea } from '../components/ui/textarea';
import { useProperty } from '../context/PropertyContext';
import { formatCurrency, formatDate } from '../utils/format';

const PropertyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    properties,
    getPropertyById, 
    fetchPropertyById,
    addComment, 
    favorites, 
    toggleFavorite,
    currentUser,
    isLoading
  } = useProperty();
  
  const [property, setProperty] = useState(null);
  const [mainImage, setMainImage] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  
  useEffect(() => {
    const loadProperty = async () => {
      if (!id) return;
      
      const cachedProperty = getPropertyById(id);
      if (cachedProperty) {
        setProperty(cachedProperty);
        if (cachedProperty.images?.length > 0) {
          setMainImage(cachedProperty.images[0]);
        }
      }
      
      try {
        const freshProperty = await fetchPropertyById(id);
        if (freshProperty) {
          setProperty(freshProperty);
          if (freshProperty.images?.length > 0) {
            setMainImage(freshProperty.images[0]);
          }
        }
      } catch (error) {
        console.error('Error loading property:', error);
      }
    };
    
    loadProperty();
  }, [id, getPropertyById, fetchPropertyById]);
  
  if (isLoading && !property) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-950 dark:to-indigo-950">
        <Navbar />
        <div className="flex-1 flex items-center justify-center flex-col">
          <div className="relative">
            <div className="animate-spin rounded-full h-32 w-32 border-4 border-gray-200 dark:border-gray-700"></div>
            <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-estate-primary dark:border-estate-accent absolute top-0 left-0"></div>
          </div>
          <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-300 mt-6">Loading property details...</h2>
          <Button 
            onClick={() => navigate(-1)} 
            className="bg-gradient-to-r from-estate-primary to-estate-accent hover:from-estate-accent hover:to-estate-primary dark:from-estate-accent dark:to-estate-primary dark:hover:from-estate-primary dark:hover:to-estate-accent shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            <ArrowLeft size={16} className="mr-2" />
            Go Back
          </Button>
        </div>
        <Footer />
      </div>
    );
  }
  
  if (!property) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-950 dark:to-indigo-950">
        <Navbar />
        <div className="flex-1 flex items-center justify-center flex-col p-6 text-center">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md mx-auto border border-gray-200 dark:border-gray-700">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Home className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-2xl font-bold mb-3 text-gray-800 dark:text-gray-200">Property Not Found</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
              We couldn't find the property you're looking for. It may have been removed or the ID is incorrect.
            </p>
            <Button 
              onClick={() => navigate(-1)} 
              className="bg-gradient-to-r from-estate-primary to-estate-accent hover:from-estate-accent hover:to-estate-primary dark:from-estate-accent dark:to-estate-primary dark:hover:from-estate-primary dark:hover:to-estate-accent shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <ArrowLeft size={16} className="mr-2" />
              Return to Listings
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  const comments = property?.comments || [];
  const isFavorite = favorites.includes(property.id || property._id);
  
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || !property?.id) return;
    
    setIsSubmittingComment(true);
    try {
      const success = await addComment(property.id || property._id, comment);
      if (success) {
        setComment('');
        const updatedProperty = await fetchPropertyById(property.id || property._id);
        if (updatedProperty) {
          setProperty(updatedProperty);
        }
      }
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setIsSubmittingComment(false);
    }
  };
  
  const getUserDisplayName = (user) => {
    if (typeof user === 'string') return 'Anonymous User';
    return user?.name || 'Anonymous User';
  };
  
  const getUserAvatar = (user) => {
    if (typeof user === 'string') return '';
    return user?.avatar || '';
  };

  const hasOwnerContactInfo = property.owner?.email || property.owner?.phoneNumber;

  const handleSendMessage = async (message: string) => {
    try {
      console.log('Sending message to property owner:', {
        propertyId: property.id || property._id,
        ownerId: property.owner?.id || property.owner?._id,
        message,
        from: currentUser
      });
      
      setIsContactModalOpen(false);
      alert('Message sent successfully!');
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message. Please try again.');
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-950 dark:to-indigo-950 transition-colors">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 flex-1">
        {/* Property navigation */}
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)} 
            className="p-3 mr-4 hover:bg-white/80 dark:hover:bg-gray-800/80 rounded-xl backdrop-blur-sm shadow-sm border border-gray-200/50 dark:border-gray-700/50 transition-all duration-200 hover:scale-105"
          >
            <ArrowLeft size={18} className="mr-2 text-gray-600 dark:text-gray-400" /> 
            <span className="text-gray-600 dark:text-gray-400 font-medium">Back to listings</span>
          </Button>
          <div className="flex-1 flex items-center space-x-3">
            <Badge className={`${property.listingType === 'sell' ? 
              'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700' : 
              'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700'
            } text-white border-0 shadow-lg px-4 py-2 rounded-full font-semibold`}>
              {property.listingType === 'sell' ? 'For Sale' : 'For Rent'}
            </Badge>
            {property.isFeatured && (
              <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:from-yellow-500 hover:to-orange-600 border-0 shadow-lg px-4 py-2 rounded-full font-semibold">
                <Home className="h-3 w-3 mr-1" fill="currentColor" />
                Featured
              </Badge>
            )}
          </div>
          <Button
            variant={isFavorite ? "default" : "outline"}
            onClick={() => toggleFavorite(property.id || property._id)}
            className={`${isFavorite ? 
              "bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white shadow-lg" : 
              "bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 backdrop-blur-sm shadow-lg border-gray-200 dark:border-gray-700"
            } transition-all duration-200 hover:scale-105 rounded-xl px-6 py-3`}
          >
            <Heart size={16} className="mr-2" fill={isFavorite ? "white" : "none"} />
            {isFavorite ? 'Saved' : 'Save'}
          </Button>
        </div>
        
        {/* Property header */}
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-gray-100 leading-tight">{property.title}</h1>
          <div className="flex items-center text-gray-600 dark:text-gray-400 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl px-4 py-3 shadow-sm border border-gray-200/50 dark:border-gray-700/50 w-fit">
            <MapPin size={20} className="mr-3 text-estate-accent dark:text-estate-primary" />
            <span className="text-lg font-medium">{property.location}</span>
          </div>
        </div>
        
        {/* Property images */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            {mainImage && (
              <div className="rounded-2xl overflow-hidden h-[500px] mb-6 shadow-2xl relative group">
                <img 
                  src={mainImage} 
                  alt={property.title} 
                  className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            )}
            {property.images && property.images.length > 0 && (
              <div className="grid grid-cols-4 gap-4">
                {property.images.map((image: string, index: number) => (
                  <div 
                    key={index}
                    className={`cursor-pointer rounded-xl overflow-hidden h-28 border-3 transition-all duration-300 ${
                      mainImage === image ? 
                        'border-estate-accent dark:border-estate-primary scale-105 shadow-lg' : 
                        'border-transparent hover:border-gray-200 dark:hover:border-gray-600 hover:scale-102 shadow-md hover:shadow-lg'
                    }`}
                    onClick={() => setMainImage(image)}
                  >
                    <img 
                      src={image} 
                      alt={`Property ${index + 1}`} 
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" 
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Property info sidebar */}
          <div>
            <Card className="shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl overflow-hidden">
              <CardContent className="p-8">
                <div className="mb-8">
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-estate-primary to-estate-accent dark:from-estate-accent dark:to-estate-primary bg-clip-text text-transparent">
                    {formatCurrency(property.price)}
                    {property.listingType === 'rent' && (
                      <span className="text-xl text-gray-500 dark:text-gray-400 font-normal"> / month</span>
                    )}
                  </h2>
                </div>
                
                <div className="grid grid-cols-3 gap-6 py-8 border-y border-gray-200/50 dark:border-gray-600/50 mb-8">
                  <div className="text-center">
                    <div className="bg-gradient-to-br from-estate-primary/10 to-estate-accent/10 dark:from-estate-accent/10 dark:to-estate-primary/10 p-4 rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-3 shadow-lg">
                      <Bed size={24} className="text-estate-primary dark:text-estate-accent" />
                    </div>
                    <span className="block text-2xl font-bold text-gray-900 dark:text-gray-100">{property.bedrooms}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Bedrooms</span>
                  </div>
                  <div className="text-center">
                    <div className="bg-gradient-to-br from-estate-primary/10 to-estate-accent/10 dark:from-estate-accent/10 dark:to-estate-primary/10 p-4 rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-3 shadow-lg">
                      <Bath size={24} className="text-estate-primary dark:text-estate-accent" />
                    </div>
                    <span className="block text-2xl font-bold text-gray-900 dark:text-gray-100">{property.bathrooms}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Bathrooms</span>
                  </div>
                  <div className="text-center">
                    <div className="bg-gradient-to-br from-estate-primary/10 to-estate-accent/10 dark:from-estate-accent/10 dark:to-estate-primary/10 p-4 rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-3 shadow-lg">
                      <Ruler size={24} className="text-estate-primary dark:text-estate-accent" />
                    </div>
                    <span className="block text-2xl font-bold text-gray-900 dark:text-gray-100">{property.area}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">sq ft</span>
                  </div>
                </div>
                
                {property.owner && (
                  <div className="flex items-center mb-8 p-6 bg-gradient-to-r from-gray-50/80 to-blue-50/80 dark:from-gray-700/80 dark:to-gray-600/80 rounded-2xl shadow-inner border border-gray-200/50 dark:border-gray-600/50">
                    <Avatar className="h-16 w-16 mr-5 ring-4 ring-estate-primary/20 dark:ring-estate-accent/20 shadow-lg">
                      <AvatarImage src={property.owner.avatar} alt={property.owner.name} />
                      <AvatarFallback className="bg-gradient-to-br from-estate-primary/20 to-estate-accent/20 dark:from-estate-accent/20 dark:to-estate-primary/20 text-estate-primary dark:text-estate-accent text-xl font-bold">
                        {property.owner.name?.slice(0, 2) || 'O'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-bold text-lg text-gray-900 dark:text-gray-100">{property.owner.name || 'Property Owner'}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-3">Property Owner</p>
                      <div className="flex items-center space-x-3">
                        {property.owner.email && (
                          <span className="text-xs bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 text-blue-700 dark:text-blue-300 px-3 py-1.5 rounded-full font-semibold shadow-sm">
                            Email
                          </span>
                        )}
                        {property.owner.phoneNumber && (
                          <span className="text-xs bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900 dark:to-emerald-900 text-green-700 dark:text-green-300 px-3 py-1.5 rounded-full font-semibold shadow-sm">
                            Phone
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="mb-8 p-6 bg-gradient-to-r from-gray-50/80 to-blue-50/80 dark:from-gray-700/80 dark:to-gray-600/80 rounded-2xl shadow-inner border border-gray-200/50 dark:border-gray-600/50">
                  <div className="flex items-center text-gray-500 dark:text-gray-400 mb-2">
                    <Calendar className="h-5 w-5 mr-3 text-estate-accent dark:text-estate-primary" />
                    <span className="text-sm font-medium">Listed on</span>
                  </div>
                  <p className="font-bold text-lg text-gray-900 dark:text-gray-100">{formatDate(property.createdAt)}</p>
                </div>
                
                <div className="space-y-4">
                  {currentUser ? (
                    <Button 
                      className="w-full bg-gradient-to-r from-estate-primary to-estate-accent hover:from-estate-accent hover:to-estate-primary dark:from-estate-accent dark:to-estate-primary dark:hover:from-estate-primary dark:hover:to-estate-accent h-14 text-lg font-semibold shadow-xl rounded-xl transform hover:scale-105 transition-all duration-200"
                      onClick={() => setIsContactModalOpen(true)}
                      disabled={!hasOwnerContactInfo}
                    >
                      <MessageSquare size={20} className="mr-3" /> 
                      {hasOwnerContactInfo ? 'Contact Owner' : 'Contact Info Not Available'}
                    </Button>
                  ) : (
                    <Button 
                      className="w-full bg-gradient-to-r from-estate-primary to-estate-accent hover:from-estate-accent hover:to-estate-primary dark:from-estate-accent dark:to-estate-primary dark:hover:from-estate-primary dark:hover:to-estate-accent h-14 text-lg font-semibold shadow-xl rounded-xl transform hover:scale-105 transition-all duration-200"
                      onClick={() => navigate('/login')}
                    >
                      Log in to Contact Owner
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Property description and details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <div className="lg:col-span-2 space-y-8">
            <Card className="border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-estate-primary/5 to-estate-accent/5 dark:from-estate-accent/5 dark:to-estate-primary/5 border-b border-gray-200/50 dark:border-gray-600/50">
                <CardTitle className="text-2xl text-gray-900 dark:text-gray-100 font-bold">Description</CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line text-lg">
                  {property.description}
                </p>
              </CardContent>
            </Card>
            
            {property.features && property.features.length > 0 && (
              <Card className="border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-estate-primary/5 to-estate-accent/5 dark:from-estate-accent/5 dark:to-estate-primary/5 border-b border-gray-200/50 dark:border-gray-600/50">
                  <CardTitle className="text-2xl text-gray-900 dark:text-gray-100 font-bold">Features</CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {property.features.map((feature, index) => (
                      <div key={index} className="flex items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl shadow-sm border border-green-200/50 dark:border-green-800/50">
                        <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-2 rounded-full mr-4 shadow-lg">
                          <svg 
                            className="w-4 h-4 text-white" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-700 dark:text-gray-300 font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            
            <Card className="border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-estate-primary/5 to-estate-accent/5 dark:from-estate-accent/5 dark:to-estate-primary/5 border-b border-gray-200/50 dark:border-gray-600/50">
                <CardTitle className="text-2xl text-gray-900 dark:text-gray-100 font-bold">Property Details</CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                  <div className="text-center p-4 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-700 dark:to-gray-600 rounded-xl shadow-sm">
                    <CardDescription className="dark:text-gray-400 font-semibold mb-2">Property ID</CardDescription>
                    <p className="font-bold text-gray-900 dark:text-gray-100 text-lg">{property.id || property._id}</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-700 dark:to-gray-600 rounded-xl shadow-sm">
                    <CardDescription className="dark:text-gray-400 font-semibold mb-2">Property Type</CardDescription>
                    <p className="font-bold capitalize text-gray-900 dark:text-gray-100 text-lg">{property.type}</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-700 dark:to-gray-600 rounded-xl shadow-sm">
                    <CardDescription className="dark:text-gray-400 font-semibold mb-2">Price</CardDescription>
                    <p className="font-bold text-gray-900 dark:text-gray-100 text-lg">
                      {formatCurrency(property.price)}
                      {property.listingType === 'rent' && <span>/month</span>}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-700 dark:to-gray-600 rounded-xl shadow-sm">
                    <CardDescription className="dark:text-gray-400 font-semibold mb-2">Bedrooms</CardDescription>
                    <p className="font-bold text-gray-900 dark:text-gray-100 text-lg">{property.bedrooms}</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-700 dark:to-gray-600 rounded-xl shadow-sm">
                    <CardDescription className="dark:text-gray-400 font-semibold mb-2">Bathrooms</CardDescription>
                    <p className="font-bold text-gray-900 dark:text-gray-100 text-lg">{property.bathrooms}</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-700 dark:to-gray-600 rounded-xl shadow-sm">
                    <CardDescription className="dark:text-gray-400 font-semibold mb-2">Area</CardDescription>
                    <p className="font-bold text-gray-900 dark:text-gray-100 text-lg">{property.area} sq ft</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Comments section */}
            <div className="mt-12">
              <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100">
                Comments <span className="text-xl font-normal text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-full">({comments.length})</span>
              </h2>
              
              {currentUser ? (
                <Card className="mb-10 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden">
                <CardContent className="p-8">
                  <form onSubmit={handleCommentSubmit}>
                    <div className="mb-6">
                      <div className="flex items-center mb-4">
                        <Avatar className="h-12 w-12 mr-4 ring-4 ring-estate-primary/20 dark:ring-estate-accent/20 shadow-lg">
                          <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                          <AvatarFallback className="bg-gradient-to-br from-estate-primary/20 to-estate-accent/20 dark:from-estate-accent/20 dark:to-estate-primary/20 text-estate-primary dark:text-estate-accent font-bold">
                            {currentUser.name?.slice(0, 2) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-bold text-lg text-gray-900 dark:text-gray-100">{currentUser.name}</span>
                      </div>
                      <Textarea 
                        value={comment} 
                        onChange={e => setComment(e.target.value)}
                        placeholder="Share your thoughts about this property..."
                        className="w-full min-h-[140px] border-2 border-gray-300 dark:border-gray-600 focus:border-estate-primary dark:focus:border-estate-accent dark:bg-gray-700/50 dark:text-gray-100 rounded-xl p-4 text-lg backdrop-blur-sm"
                        required
                        disabled={isSubmittingComment}
                      />
                    </div>
              
                    <div className="flex justify-end">
                      <Button 
                        type="submit" 
                        disabled={isSubmittingComment || !comment.trim()}
                        className="bg-gradient-to-r from-estate-primary to-estate-accent hover:from-estate-accent hover:to-estate-primary dark:from-estate-accent dark:to-estate-primary dark:hover:from-estate-primary dark:hover:to-estate-accent px-8 py-3 rounded-xl font-semibold shadow-lg transform hover:scale-105 transition-all duration-200"
                      >
                        {isSubmittingComment ? 'Posting...' : 'Post Comment'}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
              
              ) : (
                <Card className="mb-10 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden">
                  <CardContent className="p-8">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-estate-primary/10 to-estate-accent/10 dark:from-estate-accent/10 dark:to-estate-primary/10 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                        <MessageSquare className="h-8 w-8 text-estate-primary dark:text-estate-accent" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                        Want to share your thoughts?
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg leading-relaxed max-w-md">
                        Log in to leave a comment and help others make better decisions.
                      </p>
                      <Button 
                        onClick={() => navigate('/login')}
                        className="bg-gradient-to-r from-estate-primary to-estate-accent hover:from-estate-accent hover:to-estate-primary dark:from-estate-accent dark:to-estate-primary dark:hover:from-estate-primary dark:hover:to-estate-accent px-8 py-3 rounded-xl font-semibold shadow-lg transform hover:scale-105 transition-all duration-200"
                      >
                        Log In
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {comments.length > 0 ? (
                <div className="space-y-6">
                  {comments.map((commentItem, index) => (
                    <Card key={commentItem._id || commentItem.id || index} className="border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300">
                      <CardContent className="p-8">
                        <div className="flex items-start">
                          <Avatar className="h-12 w-12 mr-4 ring-4 ring-estate-primary/20 dark:ring-estate-accent/20 shadow-lg">
                            <AvatarImage 
                              src={getUserAvatar(commentItem.user)} 
                              alt={getUserDisplayName(commentItem.user)} 
                            />
                            <AvatarFallback className="bg-gradient-to-br from-estate-primary/20 to-estate-accent/20 dark:from-estate-accent/20 dark:to-estate-primary/20 text-estate-primary dark:text-estate-accent font-bold">
                              {getUserDisplayName(commentItem.user).slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-3">
                              <p className="font-bold text-lg text-gray-900 dark:text-gray-100">
                                {getUserDisplayName(commentItem.user)}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full font-medium">
                                {formatDate(commentItem.createdAt)}
                              </p>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-700/50 dark:to-gray-600/50 p-4 rounded-xl">
                              {commentItem.text || commentItem.content}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-estate-primary/10 to-estate-accent/10 dark:from-estate-accent/10 dark:to-estate-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <MessageSquare className="h-8 w-8 text-estate-primary dark:text-estate-accent" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                      No Comments Yet
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                      Be the first to share your thoughts about this property.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
          
          {/* Empty column for layout consistency */}
          <div className="hidden lg:block"></div>
        </div>
      </div>
      
      {/* Contact Owner Modal */}
      <ContactOwnerModal
        onSendMessage={handleSendMessage}
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        property={property}
        currentUser={currentUser}
      />
      
      <Footer />
    </div>
  );
};

export default PropertyDetails;