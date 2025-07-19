import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, X, Home, MapPin, Bed, Bath, Square, Camera, Star, CheckCircle, Eye } from 'lucide-react';
import { ChangeEvent, useState } from 'react';
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import { z } from "zod";
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { Button } from '../components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '../components/ui/form';
import { Input } from '../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { toast } from '../components/ui/use-toast';
import { useProperty } from '../context/PropertyContext';
import { PropertyType } from '../types';

const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Please provide a detailed description"),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Price must be a valid number greater than 0",
  }),
  location: z.string().min(3, "Please provide a valid location"),
  bedrooms: z.string().optional(),
  bathrooms: z.string().optional(),
  area: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Area must be a valid number greater than 0",
  }),
  type: z.string(),
  listingType: z.string(),
  features: z.string(),
  images: z.array(z.any()).optional(),
});

const SellPage = () => {
  const { createProperty, currentUser } = useProperty();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviewUrls, setPhotoPreviewUrls] = useState<string[]>([]);
  const [step, setStep] = useState<'details' | 'review'>('details');
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      price: "",
      location: "",
      bedrooms: "1",
      bathrooms: "1",
      area: "",
      type: "house",
      listingType: "sell",
      features: "",
      images: [],
    },
  });
  
  const propertyType = form.watch("type");
  const isLand = propertyType === "land";
  
  const handlePhotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newPhotos = Array.from(e.target.files);
      const newPhotoUrls = newPhotos.map(photo => URL.createObjectURL(photo));
      
      setPhotos(prevPhotos => [...prevPhotos, ...newPhotos]);
      setPhotoPreviewUrls(prevUrls => [...prevUrls, ...newPhotoUrls]);
      
      toast({
        title: "Photos uploaded",
        description: `${newPhotos.length} photo${newPhotos.length > 1 ? 's' : ''} added successfully.`,
      });
    }
  };
  
  const removePhoto = (index: number) => {
    setPhotos(prevPhotos => prevPhotos.filter((_, i) => i !== index));
    URL.revokeObjectURL(photoPreviewUrls[index]);
    setPhotoPreviewUrls(prevUrls => prevUrls.filter((_, i) => i !== index));
  };
  
  const handleNext = async () => {
    const isValid = await form.trigger();
    if (!isValid) {
      toast({
        variant: "destructive",
        title: "Incomplete Form",
        description: "Please fill out all required fields correctly.",
      });
      return;
    }
    if (photos.length === 0) {
      toast({
        variant: "destructive",
        title: "Photos Required",
        description: "Please upload at least one photo of your property.",
      });
      return;
    }
    if (!form.getValues().features.trim()) {
      toast({
        variant: "destructive",
        title: "Features Required",
        description: "Please enter at least one feature for your property.",
      });
      return;
    }
    setStep('review');
  };
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!currentUser) {
      toast({
        variant: "destructive",
        title: "Login Required",
        description: "Please log in to list a property.",
      });
      navigate("/login");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('description', values.description);
      formData.append('price', values.price);
      formData.append('location', values.location);
      formData.append('bedrooms', isLand ? "0" : values.bedrooms || "0");
      formData.append('bathrooms', isLand ? "0" : values.bathrooms || "0");
      formData.append('area', values.area);
      formData.append('type', values.type);
      formData.append('listingType', values.listingType);
      formData.append('features', values.features.trim());
      photos.forEach(photo => {
        formData.append('images', photo);
      });
      const success = await createProperty(formData);
      if (success) {
        toast({
          title: "Property Listed Successfully",
          description: "Your property has been submitted.",
        });
        navigate("/");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was an error creating your listing. Please try again.",
      });
      console.error('Error submitting property:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12 flex-1">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
              <Home className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-200 dark:to-gray-400 bg-clip-text text-transparent">
              List Your Property
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Showcase your property to thousands of potential buyers and renters. 
              Fill out the details below to create an impressive listing.
            </p>
          </div>
          
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step === 'details' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}>
                  1
                </div>
                <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">Property Details</span>
              </div>
              <div className="w-16 h-1 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step === 'review' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}>
                  2
                </div>
                <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">Review</span>
              </div>
              <div className="w-16 h-1 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-full flex items-center justify-center text-sm font-medium">
                  3
                </div>
                <span className="ml-2 text-sm font-medium text-gray-500 dark:text-gray-400">Publish</span>
              </div>
            </div>
          </div>
          
          {/* Main Form Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border-0 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-6">
              <h2 className="text-2xl font-semibold text-white">{step === 'details' ? 'Property Information' : 'Review Your Listing'}</h2>
              <p className="text-blue-100 mt-1">
                {step === 'details' ? 'Provide detailed information about your property' : 'Review your property details before publishing'}
              </p>
            </div>
            
            <div className="p-8">
              {step === 'details' ? (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleNext)} className="space-y-8">
                    {/* Property Title */}
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                            <Star className="w-4 h-4 mr-2 text-amber-500" />
                            Property Title
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g. Luxurious Modern Villa with Swimming Pool" 
                              className="h-12 text-base border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Photo Upload Section */}
                    <div className="space-y-4">
                      <label className="text-base font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                        <Camera className="w-4 h-4 mr-2 text-blue-500" />
                        Property Photos <span className="text-red-500 ml-1">*</span>
                      </label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Upload high-quality photos to attract more buyers</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {photoPreviewUrls.map((url, index) => (
                          <div 
                            key={`photo-${index}`}
                            className="relative aspect-square border-2 border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden group hover:shadow-lg transition-all duration-200"
                          >
                            <img 
                              src={url} 
                              alt={`Property photo ${index + 1}`} 
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200" />
                            <button
                              type="button"
                              onClick={() => removePhoto(index)}
                              className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-600 hover:scale-110"
                              aria-label="Remove photo"
                            >
                              <X size={14} />
                            </button>
                            <div className="absolute bottom-2 left-2 bg-white dark:bg-gray-900 bg-opacity-90 rounded-full px-2 py-1 text-xs font-medium text-gray-700 dark:text-gray-300">
                              {index + 1}
                            </div>
                          </div>
                        ))}
                        
                        <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl aspect-square cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 transition-all duration-200 group">
                          <div className="flex flex-col items-center justify-center py-6 text-gray-500 dark:text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400">
                            <Upload className="w-8 h-8 mb-2" />
                            <p className="text-sm font-medium">Add Photos</p>
                            <p className="text-xs">JPG, PNG, WebP</p>
                          </div>
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={handlePhotoUpload} 
                            multiple 
                          />
                        </label>
                      </div>
                      
                      {photos.length === 0 && (
                        <div className="flex items-center p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg">
                          <div className="w-4 h-4 bg-red-500 rounded-full mr-3"></div>
                          <p className="text-sm text-red-700 dark:text-red-300">Please upload at least one photo of your property</p>
                        </div>
                      )}
                      
                      {photos.length > 0 && (
                        <div className="flex items-center p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-3" />
                          <p className="text-sm text-green-700 dark:text-green-300">{photos.length} photo{photos.length > 1 ? 's' : ''} uploaded successfully</p>
                        </div>
                      )}
                    </div>
                    
                    {/* Price and Location */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-semibold text-gray-800 dark:text-gray-200">Price (₹)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                className="h-12 text-base border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                                placeholder="Enter price"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                              <MapPin className="w-4 h-4 mr-2 text-red-500" />
                              Location
                            </FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="City, State" 
                                className="h-12 text-base border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    {/* Property Specifications */}
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Property Specifications</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {!isLand && (
                          <FormField
                            control={form.control}
                            name="bedrooms"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-base font-medium text-gray-700 dark:text-gray-300 flex items-center">
                                  <Bed className="w-4 h-4 mr-2 text-blue-500" />
                                  Bedrooms
                                </FormLabel>
                                <Select 
                                  onValueChange={field.onChange} 
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger className="h-12 border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
                                      <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100">
                                    <SelectItem value="0">0 Bedroom</SelectItem>
                                    <SelectItem value="1">1 Bedroom</SelectItem>
                                    <SelectItem value="2">2 Bedrooms</SelectItem>
                                    <SelectItem value="3">3 Bedrooms</SelectItem>
                                    <SelectItem value="4">4 Bedrooms</SelectItem>
                                    <SelectItem value="5">5+ Bedrooms</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}
                        
                        {!isLand && (
                          <FormField
                            control={form.control}
                            name="bathrooms"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-base font-medium text-gray-700 dark:text-gray-300 flex items-center">
                                  <Bath className="w-4 h-4 mr-2 text-cyan-500" />
                                  Bathrooms
                                </FormLabel>
                                <Select 
                                  onValueChange={field.onChange} 
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger className="h-12 border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
                                      <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100">
                                    <SelectItem value="0">0 Bathroom</SelectItem>
                                    <SelectItem value="1">1 Bathroom</SelectItem>
                                    <SelectItem value="2">2 Bathrooms</SelectItem>
                                    <SelectItem value="3">3 Bathrooms</SelectItem>
                                    <SelectItem value="4">4+ Bathrooms</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}
                        
                        <FormField
                          control={form.control}
                          name="area"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-base font-medium text-gray-700 dark:text-gray-300 flex items-center">
                                <Square className="w-4 h-4 mr-2 text-green-500" />
                                Area (sq ft)
                              </FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  className="h-12 border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                                  placeholder="Enter area"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      {isLand && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
                          Bedrooms and bathrooms are not applicable for land listings and will be set to 0.
                        </p>
                      )}
                    </div>
                    
                    {/* Property Type and Listing Type */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-semibold text-gray-800 dark:text-gray-200">Property Type</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="h-12 border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100">
                                <SelectItem value="villa">🏖️ Villa</SelectItem>
                                <SelectItem value="apartment">🏢 Apartment</SelectItem>
                                <SelectItem value="house">🏠 House</SelectItem>
                                <SelectItem value="land">🌱 Land</SelectItem>
                                <SelectItem value="commercial">🏪 Commercial</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="listingType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-semibold text-gray-800 dark:text-gray-200">Listing Type</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="h-12 border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100">
                                <SelectItem value="sell">💰 For Sale</SelectItem>
                                <SelectItem value="rent">🏡 For Rent</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    {/* Features */}
                    <FormField
                      control={form.control}
                      name="features"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-semibold text-gray-800 dark:text-gray-200">Property Features</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g. Swimming Pool, Garden, Parking, Gym, Security (comma separated)" 
                              className="h-12 text-base border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription className="text-gray-600 dark:text-gray-400">
                            Highlight the best features of your property to attract buyers
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Description */}
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-semibold text-gray-800 dark:text-gray-200">Detailed Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe your property in detail. Include information about the neighborhood, nearby amenities, and what makes this property special..."
                              className="min-h-32 text-base border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 rounded-lg resize-none bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription className="text-gray-600 dark:text-gray-400">
                            A compelling description helps buyers envision themselves living in your property
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Next Button */}
                    <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                      <Button 
                        type="submit" 
                        className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                      >
                        <div className="flex items-center">
                          <Eye className="w-5 h-5 mr-2" />
                          Review Your Listing
                        </div>
                      </Button>
                    </div>
                  </form>
                </Form>
              ) : (
                <div className="space-y-8">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                        <Star className="w-4 h-4 mr-2 text-amber-500" />
                        Property Title
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">{form.getValues().title}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                        <Camera className="w-4 h-4 mr-2 text-blue-500" />
                        Property Photos
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                        {photoPreviewUrls.map((url, index) => (
                          <img 
                            key={`review-photo-${index}`}
                            src={url} 
                            alt={`Property photo ${index + 1}`} 
                            className="aspect-square border-2 border-gray-200 dark:border-gray-700 rounded-xl object-cover"
                          />
                        ))}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Price (₹)</h3>
                        <p className="text-gray-600 dark:text-gray-400">{form.getValues().price}</p>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                          <MapPin className="w-4 h-4 mr-2 text-red-500" />
                          Location
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">{form.getValues().location}</p>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Property Specifications</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <h4 className="text-base font-medium text-gray-700 dark:text-gray-300 flex items-center">
                            <Bed className="w-4 h-4 mr-2 text-blue-500" />
                            Bedrooms
                          </h4>
                          <p className="text-gray-600 dark:text-gray-400">{isLand ? "0" : form.getValues().bedrooms || "0"}</p>
                        </div>
                        <div>
                          <h4 className="text-base font-medium text-gray-700 dark:text-gray-300 flex items-center">
                            <Bath className="w-4 h-4 mr-2 text-cyan-500" />
                            Bathrooms
                          </h4>
                          <p className="text-gray-600 dark:text-gray-400">{isLand ? "0" : form.getValues().bathrooms || "0"}</p>
                        </div>
                        <div>
                          <h4 className="text-base font-medium text-gray-700 dark:text-gray-300 flex items-center">
                            <Square className="w-4 h-4 mr-2 text-green-500" />
                            Area (sq ft)
                          </h4>
                          <p className="text-gray-600 dark:text-gray-400">{form.getValues().area}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Property Type</h3>
                        <p className="text-gray-600 dark:text-gray-400">{form.getValues().type}</p>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Listing Type</h3>
                        <p className="text-gray-600 dark:text-gray-400">{form.getValues().listingType}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Property Features</h3>
                      <p className="text-gray-600 dark:text-gray-400">{form.getValues().features}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Detailed Description</h3>
                      <p className="text-gray-600 dark:text-gray-400">{form.getValues().description}</p>
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-between gap-4">
                    <Button 
                      type="button" 
                      className="w-full h-14 text-lg font-semibold bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl shadow-lg hover:shadow-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200 transform hover:scale-[1.02]"
                      onClick={() => setStep('details')}
                    >
                      <div className="flex items-center">
                        <Eye className="w-5 h-5 mr-2" />
                        Edit Details
                      </div>
                    </Button>
                    <Button 
                      type="button" 
                      className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                      onClick={form.handleSubmit(onSubmit)}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                          Creating Your Listing...
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <CheckCircle className="w-5 h-5 mr-2" />
                          Publish Listing
                        </div>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default SellPage;