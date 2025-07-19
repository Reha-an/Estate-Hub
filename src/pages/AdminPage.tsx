// Enhanced AdminPage.tsx - Modern admin dashboard with improved UI
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useProperty } from '../context/PropertyContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { useToast } from '../components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../components/ui/alert-dialog';
import { Input } from '../components/ui/input';
import { 
  Edit, 
  Trash2, 
  Plus, 
  User, 
  Home, 
  MessageSquare, 
  Eye, 
  ShieldCheck, 
  Search, 
  Filter, 
  TrendingUp, 
  Users, 
  Building, 
  Star,
  Calendar,
  MapPin,
  DollarSign,
  MoreVertical,
  Activity,
  ChevronRight,
  Settings
} from 'lucide-react';

const AdminPage = () => {
  const navigate = useNavigate();
  const { currentUser, properties, isLoading, deleteProperty } = useProperty();
  const { toast } = useToast();
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [selectedTab, setSelectedTab] = useState('overview');
  
  // Auth check
  useEffect(() => {
    console.log('AdminPage: Auth check running');
    console.log('AdminPage: currentUser:', currentUser);
    
    const checkAuth = setTimeout(() => {
      if (!currentUser) {
        console.log('AdminPage: No current user, redirecting to login');
        toast({
          title: 'Login required',
          description: 'Please log in to access the admin area',
        });
        navigate('/login');
        return;
      }
      
      if (!currentUser.isAdmin) {
        console.log('AdminPage: User is not admin, redirecting to home');
        toast({
          title: 'Access denied',
          description: 'You do not have permission to access the admin area',
          variant: 'destructive',
        });
        navigate('/');
        return;
      }
      
      console.log('AdminPage: Auth check passed');
      setIsCheckingAuth(false);
    }, 100);
    
    return () => clearTimeout(checkAuth);
  }, [currentUser, navigate, toast]);

  // Generate mock users data from property owners and current user
  useEffect(() => {
    const generateUsersData = () => {
      if (!currentUser || !currentUser.isAdmin) return;
      
      try {
        setIsLoadingData(true);
        
        // Create a Set to store unique users
        const uniqueUsers = new Map();
        
        // Add current user
        uniqueUsers.set(currentUser.id, {
          _id: currentUser.id,
          id: currentUser.id,
          name: currentUser.name,
          email: currentUser.email,
          role: currentUser.isAdmin ? 'admin' : 'user',
          createdAt: currentUser.createdAt || new Date().toISOString(),
          updatedAt: currentUser.updatedAt || new Date().toISOString()
        });
        
        // Add property owners
        properties.forEach(property => {
          if (property.owner && property.owner.email) {
            const ownerId = property.owner.id || property.owner.email;
            if (!uniqueUsers.has(ownerId)) {
              uniqueUsers.set(ownerId, {
                _id: ownerId,
                id: ownerId,
                name: property.owner.name || 'Unknown User',
                email: property.owner.email,
                role: property.owner.role || 'user',
                createdAt: property.createdAt || new Date().toISOString(),
                updatedAt: property.updatedAt || new Date().toISOString()
              });
            }
          }
        });
        
        // Convert Map to array
        const usersArray = Array.from(uniqueUsers.values());
        setUsers(usersArray);

        // Extract comments from properties
        const allComments = [];
        properties.forEach(property => {
          if (property.comments && property.comments.length > 0) {
            property.comments.forEach(comment => {
              allComments.push({
                id: comment._id || `${property.id}-${comment.createdAt}`,
                propertyId: property.id,
                content: comment.text,
                author: {
                  name: comment.user?.name || 'Anonymous',
                  email: comment.user?.email || 'Unknown'
                },
                rating: comment.rating,
                createdAt: comment.createdAt,
                propertyTitle: property.title
              });
            });
          }
        });
        setComments(allComments);

      } catch (error) {
        console.error('Error processing admin data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load admin data',
          variant: 'destructive',
        });
      } finally {
        setIsLoadingData(false);
      }
    };

    if (!isCheckingAuth && currentUser && currentUser.isAdmin) {
      generateUsersData();
    }
  }, [currentUser, isCheckingAuth, properties, toast]);
  
  // Show loading state during auth check
  if (isCheckingAuth) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-200 border-t-blue-500 mx-auto"></div>
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-300 animate-pulse"></div>
            </div>
            <p className="mt-6 text-slate-600 font-medium">Authenticating admin access...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  // Don't render if not authenticated or not admin
  if (!currentUser || !currentUser.isAdmin) {
    console.log('AdminPage: Not rendering - user not authenticated or not admin');
    return null;
  }
  
  const handleAddProperty = () => {
    navigate('/sell');
  };
  
  const handleEditProperty = (propertyId) => {
    navigate(`/edit-property/${propertyId}`);
    toast({
      title: 'Admin Override',
      description: 'Editing property as administrator',
    });
  };
  
  const handleViewProperty = (propertyId) => {
    navigate(`/property/${propertyId}`);
  };
  
  const handleDeleteProperty = async (propertyId) => {
    try {
      const success = await deleteProperty(propertyId);
      if (success) {
        toast({
          title: 'Success',
          description: 'Property deleted successfully by administrator.',
        });
      }
    } catch (error) {
      console.error('Error deleting property:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete property.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteComment = async (commentId, propertyId) => {
    try {
      const token = localStorage.getItem('token') || 
                    localStorage.getItem('authToken') || 
                    localStorage.getItem('accessToken') ||
                    sessionStorage.getItem('token') ||
                    sessionStorage.getItem('authToken');

      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }

      const response = await fetch(`http://localhost:3001/api/properties/${propertyId}/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete comment');
      }

      setComments(comments.filter(comment => comment.id !== commentId));
      
      toast({
        title: 'Success',
        description: 'Comment deleted successfully.',
      });
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete comment.',
        variant: 'destructive',
      });
      
      if (error.message.includes('Authentication token not found')) {
        navigate('/login');
      }
    }
  };
  
  const getPropertyStatusBadge = (property) => {
    const isOwnProperty = property.owner?.email === currentUser?.email;
    return (
      <div className="flex gap-2">
        <Badge 
          variant={property.listingType === 'sell' ? 'default' : 'secondary'} 
          className="capitalize font-medium"
        >
          {property.listingType}
        </Badge>
        {isOwnProperty && (
          <Badge variant="outline" className="text-xs border-blue-200 text-blue-700">
            <User className="h-3 w-3 mr-1" />
            Your Property
          </Badge>
        )}
      </div>
    );
  };

  // Filter functions
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const filteredProperties = properties.filter(property =>
    property.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredComments = comments.filter(comment =>
    comment.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    comment.author?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Stats calculations
  const totalRevenue = properties.reduce((sum, property) => sum + (property.price || 0), 0);
  const averagePrice = properties.length > 0 ? totalRevenue / properties.length : 0;
  const propertiesForSale = properties.filter(p => p.listingType === 'sell').length;
  const propertiesForRent = properties.filter(p => p.listingType === 'rent').length;
  
  if (isLoading || isLoadingData) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-200 border-t-blue-500 mx-auto"></div>
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-300 animate-pulse"></div>
            </div>
            <p className="mt-6 text-slate-600 font-medium">Loading admin dashboard...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 flex-1">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg">
                <ShieldCheck className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-slate-600 mt-1">
                  Welcome back, {currentUser.name}. Here's what's happening with your platform.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button onClick={handleAddProperty} className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg gap-2">
                <Plus className="h-4 w-4" />
                Add Property
              </Button>
            </div>
          </div>
        </div>
        
        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardDescription className="text-blue-600 font-medium">Total Users</CardDescription>
                  <CardTitle className="text-3xl font-bold text-blue-900">{users.length}</CardTitle>
                </div>
                <div className="p-3 bg-blue-500 rounded-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-green-600 font-medium">+12%</span>
                <span className="text-slate-600">from last month</span>
              </div>
            </CardContent>
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 opacity-10 rounded-full -mr-16 -mt-16"></div>
          </Card>
          
          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-emerald-100 hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardDescription className="text-emerald-600 font-medium">Properties</CardDescription>
                  <CardTitle className="text-3xl font-bold text-emerald-900">{properties.length}</CardTitle>
                </div>
                <div className="p-3 bg-emerald-500 rounded-lg">
                  <Building className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-emerald-600 font-medium">{propertiesForSale} for sale</span>
                <span className="text-slate-400">•</span>
                <span className="text-emerald-600 font-medium">{propertiesForRent} for rent</span>
              </div>
            </CardContent>
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500 opacity-10 rounded-full -mr-16 -mt-16"></div>
          </Card>
          
          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardDescription className="text-purple-600 font-medium">Avg. Price</CardDescription>
                  <CardTitle className="text-3xl font-bold text-purple-900">
                    ₹{(averagePrice / 100000).toFixed(1)}L
                  </CardTitle>
                </div>
                <div className="p-3 bg-purple-500 rounded-lg">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-green-600 font-medium">+8%</span>
                <span className="text-slate-600">market growth</span>
              </div>
            </CardContent>
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500 opacity-10 rounded-full -mr-16 -mt-16"></div>
          </Card>
          
          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100 hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardDescription className="text-orange-600 font-medium">Comments</CardDescription>
                  <CardTitle className="text-3xl font-bold text-orange-900">{comments.length}</CardTitle>
                </div>
                <div className="p-3 bg-orange-500 rounded-lg">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm">
                <Activity className="h-4 w-4 text-orange-500" />
                <span className="text-orange-600 font-medium">Active discussions</span>
              </div>
            </CardContent>
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500 opacity-10 rounded-full -mr-16 -mt-16"></div>
          </Card>
        </div>
        
        {/* Enhanced Management Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList className="grid w-auto grid-cols-4 bg-white shadow-lg border-0 p-1">
              <TabsTrigger 
                value="overview" 
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white"
              >
                <Activity className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="properties" 
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white"
              >
                <Home className="h-4 w-4" />
                Properties
              </TabsTrigger>
              <TabsTrigger 
                value="users" 
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white"
              >
                <User className="h-4 w-4" />
                Users
              </TabsTrigger>
              <TabsTrigger 
                value="comments" 
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white"
              >
                <MessageSquare className="h-4 w-4" />
                Comments
              </TabsTrigger>
            </TabsList>
            
            {/* Search and Filter */}
            <div className="flex gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64 border-0 shadow-lg"
                />
              </div>
              {selectedTab === 'users' && (
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="px-4 py-2 border-0 rounded-lg shadow-lg bg-white"
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admins</option>
                  <option value="user">Users</option>
                </select>
              )}
            </div>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Properties */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Home className="h-5 w-5 text-blue-500" />
                      Recent Properties
                    </CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedTab('properties')}>
                      View All <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {properties.slice(0, 5).map((property) => (
                      <div key={property.id} className="flex items-center gap-4 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                        <img 
                          className="h-12 w-12 rounded-lg object-cover" 
                          src={property.images?.[0] ? `http://localhost:3001${property.images[0]}` : '/placeholder.jpg'} 
                          alt="" 
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder.jpg';
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-slate-900 truncate">{property.title}</p>
                          <p className="text-sm text-slate-500 flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {property.location}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-slate-900">₹{property.price?.toLocaleString()}</p>
                          <Badge variant="outline" className="text-xs">
                            {property.listingType}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Comments */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-orange-500" />
                      Recent Comments
                    </CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedTab('comments')}>
                      View All <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {comments.slice(0, 5).map((comment) => (
                      <div key={comment.id} className="p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
                            <span className="text-xs font-medium text-orange-600">
                              {comment.author?.name?.slice(0, 2).toUpperCase() || 'A'}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-slate-900 text-sm">{comment.author?.name}</p>
                            <p className="text-xs text-slate-500">{comment.propertyTitle}</p>
                          </div>
                        </div>
                        <p className="text-sm text-slate-600 line-clamp-2">{comment.content}</p>
                        {comment.rating && (
                          <div className="flex items-center gap-1 mt-2">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-3 w-3 ${i < comment.rating ? 'text-yellow-400 fill-current' : 'text-slate-300'}`} 
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Properties Management */}
          <TabsContent value="properties" className="space-y-4">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-xl">Property Management</CardTitle>
                    <CardDescription>Manage all properties with admin privileges</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-slate-50">
                      <TableRow>
                        <TableHead className="font-semibold">Property</TableHead>
                        <TableHead className="font-semibold">Type</TableHead>
                        <TableHead className="font-semibold">Price</TableHead>
                        <TableHead className="font-semibold">Location</TableHead>
                        <TableHead className="font-semibold">Owner</TableHead>
                        <TableHead className="font-semibold">Status</TableHead>
                        <TableHead className="font-semibold">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProperties.map((property) => (
                        <TableRow key={property.id || property._id} className="hover:bg-slate-50">
                          <TableCell>
                            <div className="flex items-center gap-4">
                              <img 
                                className="h-14 w-14 rounded-lg object-cover shadow-md" 
                                src={property.images?.[0] ? `http://localhost:3001${property.images[0]}` : '/placeholder.jpg'} 
                                alt="" 
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = '/placeholder.jpg';
                                }}
                              />
                              <div>
                                <div className="font-semibold text-slate-900">{property.title}</div>
                                <div className="text-sm text-slate-500">ID: {property.id || property._id}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize font-medium border-blue-200 text-blue-700">
                              {property.type}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-bold text-slate-900">
                            ₹{property.price?.toLocaleString() || 'N/A'}
                          </TableCell>
                          <TableCell className="text-slate-600">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4 text-slate-400" />
                              {property.location}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
                                <span className="text-xs font-medium text-slate-600">
                                  {property.owner?.name?.slice(0, 2).toUpperCase() || 'U'}
                                </span>
                              </div>
                              <div>
                                <div className="font-medium text-slate-900">{property.owner?.name || 'Unknown'}</div>
                                <div className="text-sm text-slate-500">{property.owner?.email || 'Unknown'}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {getPropertyStatusBadge(property)}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewProperty(property.id || property._id)}
                                className="hover:bg-blue-50 hover:border-blue-200"
                                title="View Property"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditProperty(property.id || property._id)}
                                title="Edit Property (Admin Override)"
                                className="hover:bg-green-50 hover:border-green-200 text-green-600 hover:text-green-700"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="hover:bg-red-50 hover:border-red-200 text-red-600 hover:text-red-700"
                                    title="Delete Property (Admin Override)"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="border-0 shadow-xl">
                                  <AlertDialogHeader>
                                    <AlertDialogTitle className="text-xl">Delete Property</AlertDialogTitle>
                                    <AlertDialogDescription className="text-slate-600">
                                      Are you sure you want to delete this property? As an administrator, you can delete any property. This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel className="hover:bg-slate-100">Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDeleteProperty(property.id || property._id)}
                                      className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                                    >
                                      Delete Property
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                {filteredProperties.length === 0 && (
                  <div className="p-12 text-center">
                    <Building className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500 text-lg font-medium">No properties found</p>
                    <p className="text-slate-400">Try adjusting your search criteria</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Users Management */}
          <TabsContent value="users" className="space-y-4">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-xl">User Management</CardTitle>
                    <CardDescription>Manage user accounts and permissions</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {filteredUsers.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-slate-50">
                        <TableRow>
                          <TableHead className="font-semibold">User</TableHead>
                          <TableHead className="font-semibold">Email</TableHead>
                          <TableHead className="font-semibold">Role</TableHead>
                          <TableHead className="font-semibold">Properties</TableHead>
                          <TableHead className="font-semibold">Joined</TableHead>
                        
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUsers.map((user) => (
                          <TableRow key={user._id || user.id} className="hover:bg-slate-50">
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
                                  <span className="text-sm font-bold text-white">
                                    {user.name?.slice(0, 2).toUpperCase() || 'U'}
                                  </span>
                                </div>
                                <div>
                                  <div className="font-semibold text-slate-900">{user.name}</div>
                                  <div className="text-sm text-slate-500">ID: {user._id || user.id}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-slate-600">{user.email}</TableCell>
                            <TableCell>
                              <Badge 
                                variant={user.role === 'admin' ? "default" : "secondary"}
                                className={user.role === 'admin' ? 
                                  "bg-gradient-to-r from-purple-500 to-purple-600 text-white font-medium" : 
                                  "bg-slate-100 text-slate-700 font-medium"
                                }
                              >
                                {user.role === 'admin' ? (
                                  <>
                                    <ShieldCheck className="h-3 w-3 mr-1" />
                                    Admin
                                  </>
                                ) : (
                                  <>
                                    <User className="h-3 w-3 mr-1" />
                                    User
                                  </>
                                )}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Home className="h-4 w-4 text-slate-400" />
                                <span className="font-medium">
                                  {properties.filter(p => p.owner?.email === user.email).length}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="text-slate-500">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                              </div>
                            </TableCell>
                            
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="p-12 text-center">
                    <Users className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500 text-lg font-medium">No users found</p>
                    <p className="text-slate-400">Try adjusting your search or filter criteria</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Comments Management */}
          <TabsContent value="comments" className="space-y-4">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-xl">Comment Management</CardTitle>
                <CardDescription>Monitor and moderate user comments</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {filteredComments && filteredComments.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-slate-50">
                        <TableRow>
                          <TableHead className="font-semibold">Comment</TableHead>
                          <TableHead className="font-semibold">Author</TableHead>
                          <TableHead className="font-semibold">Property</TableHead>
                          <TableHead className="font-semibold">Rating</TableHead>
                          <TableHead className="font-semibold">Date</TableHead>
                          <TableHead className="font-semibold">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredComments.map((comment) => (
                          <TableRow key={comment.id} className="hover:bg-slate-50">
                            <TableCell className="max-w-xs">
                              <div className="p-3 bg-slate-50 rounded-lg">
                                <p className="text-sm text-slate-700 line-clamp-3">{comment.content}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-orange-400 to-pink-400 flex items-center justify-center">
                                  <span className="text-sm font-medium text-white">
                                    {comment.author?.name?.slice(0, 2).toUpperCase() || 'A'}
                                  </span>
                                </div>
                                <div>
                                  <div className="font-medium text-slate-900">{comment.author?.name || 'Anonymous'}</div>
                                  <div className="text-sm text-slate-500">{comment.author?.email || 'Unknown'}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="max-w-xs">
                                <div className="font-medium text-slate-900 truncate">
                                  {comment.propertyTitle || 'Unknown Property'}
                                </div>
                                <div className="text-sm text-slate-500">ID: {comment.propertyId}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              {comment.rating && (
                                <div className="flex items-center gap-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star 
                                      key={i} 
                                      className={`h-4 w-4 ${i < comment.rating ? 'text-yellow-400 fill-current' : 'text-slate-300'}`} 
                                    />
                                  ))}
                                  <span className="ml-2 text-sm font-medium text-slate-600">
                                    {comment.rating}/5
                                  </span>
                                </div>
                              )}
                            </TableCell>
                            <TableCell className="text-slate-500">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : 'Unknown'}
                              </div>
                            </TableCell>
                            <TableCell>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="hover:bg-red-50 hover:border-red-200 text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="border-0 shadow-xl">
                                  <AlertDialogHeader>
                                    <AlertDialogTitle className="text-xl">Delete Comment</AlertDialogTitle>
                                    <AlertDialogDescription className="text-slate-600">
                                      Are you sure you want to delete this comment? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel className="hover:bg-slate-100">Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDeleteComment(comment.id, comment.propertyId)}
                                      className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                                    >
                                      Delete Comment
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="p-12 text-center">
                    <MessageSquare className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500 text-lg font-medium">No comments found</p>
                    <p className="text-slate-400">Comments will appear here as users interact with properties</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <Footer />
    </div>
  );
};

export default AdminPage;