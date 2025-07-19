import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Mail, Phone, X, Copy, ExternalLink, MapPin, Home, Bed, Bath } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { useToast } from './ui/use-toast';

const contactFormSchema = z.object({
  subject: z.string().min(1, 'Subject is required').max(100, 'Subject must be less than 100 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000, 'Message must be less than 1000 characters'),
});

interface ContactOwnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendMessage: (subject: string, message: string, propertyId: string, receiverId: string) => Promise<void>;
  property: any;
  currentUser: any;
}

const ContactOwnerModal: React.FC<ContactOwnerModalProps> = ({
  isOpen,
  onClose,
  onSendMessage,
  property,
  currentUser
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contactMethod, setContactMethod] = useState<'email' | 'phone'>('email');

  const form = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      subject: `Inquiry about ${property?.title || 'Property'}`,
      message: `Hi ${property?.owner?.name || 'there'},\n\nI'm interested in your property "${property?.title}" located at ${property?.location}. Could you please provide more information?\n\nBest regards,\n${currentUser?.name}\n${currentUser?.email}${currentUser?.phoneNumber ? `\n${currentUser.phoneNumber}` : ''}`,
    },
  });

  // Function to copy text to clipboard
  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: `${type} copied to clipboard`,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  // Function to open Gmail compose with pre-filled content
  const openGmailCompose = (subject: string, message: string) => {
    const gmailUrl = `https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(property?.owner?.email || '')}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
    window.open(gmailUrl, '_blank');
  };

  // Function to initiate phone call
  const initiatePhoneCall = (phoneNumber: string) => {
    window.open(`tel:${phoneNumber}`, '_self');
  };

  const onSubmit = async (values: z.infer<typeof contactFormSchema>) => {
    setIsSubmitting(true);
    try {
      if (contactMethod === 'email') {
        // Open Gmail with pre-filled content
        openGmailCompose(values.subject, values.message);
        
        // Also call the original onSendMessage function to log the interaction
        await onSendMessage(values.subject, values.message, property?.id || '', property?.owner?.id || '');
        
        toast({
          title: "Gmail Opened",
          description: "Gmail has been opened with your message. Please send it from there.",
        });
      } else {
        // For phone contact, just initiate the call
        initiatePhoneCall(property?.owner?.phoneNumber || '');
        toast({
          title: "Phone Call Initiated",
          description: "Your phone app should open to call the property owner.",
        });
      }
      
      onClose();
    } catch (error) {
      console.error('Failed to process contact:', error);
      toast({
        title: "Error",
        description: "Failed to open contact method. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg font-semibold">Contact Property Owner</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X size={16} />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Property Summary */}
          {property && (
            <div className="border rounded-lg p-4 bg-muted/50">
              <div className="flex gap-4">
                {property.images?.[0] && (
                  <img 
                    src={property.images[0]} 
                    alt={property.title}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm mb-1 truncate">{property.title}</h3>
                  <div className="flex items-center text-xs text-muted-foreground mb-2">
                    <MapPin className="h-3 w-3 mr-1" />
                    {property.location}
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    {property.bedrooms && (
                      <div className="flex items-center">
                        <Bed className="h-3 w-3 mr-1" />
                        {property.bedrooms}
                      </div>
                    )}
                    {property.bathrooms && (
                      <div className="flex items-center">
                        <Bath className="h-3 w-3 mr-1" />
                        {property.bathrooms}
                      </div>
                    )}
                    {property.area && (
                      <div className="flex items-center">
                        <Home className="h-3 w-3 mr-1" />
                        {property.area} sq ft
                      </div>
                    )}
                  </div>
                  <div className="mt-2 text-xs">
                    <span className="font-medium">
                      {property.listingType === 'sell' ? 'For Sale' : 'For Rent'} - {property.price}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Owner Info with Contact Methods */}
          {property?.owner && (
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={property.owner.avatar} alt={property.owner.name} />
                  <AvatarFallback>{property.owner.name?.slice(0, 2).toUpperCase() || 'O'}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{property.owner.name || 'Property Owner'}</p>
                  <p className="text-sm text-muted-foreground">Property Owner</p>
                </div>
              </div>

              {/* Contact Methods */}
              <div className="space-y-3">
                {property.owner.email && (
                  <div className="flex items-center justify-between p-3 border rounded-lg bg-blue-50">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-sm">Email</p>
                        <p className="text-sm text-muted-foreground">{property.owner.email}</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(property.owner.email, 'Email')}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                {property.owner.phoneNumber && (
                  <div className="flex items-center justify-between p-3 border rounded-lg bg-green-50">
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium text-sm">Phone</p>
                        <p className="text-sm text-muted-foreground">{property.owner.phoneNumber}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(property.owner.phoneNumber, 'Phone number')}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => initiatePhoneCall(property.owner.phoneNumber)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Phone className="h-4 w-4 mr-1" />
                        Call Now
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Email Form (only show if email is available) */}
          {property?.owner?.email && (
            <div className="border-t pt-4">
              <h4 className="font-medium mb-3">Compose Email Message</h4>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter subject" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter your message"
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Sender Info */}
                  {currentUser && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <span>Sending as:</span>
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                        <AvatarFallback>{currentUser.name?.slice(0, 2) || 'U'}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{currentUser.name}</span>
                    </div>
                  )}

                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <Mail className="h-4 w-4 inline mr-1" />
                      This will open Gmail in a new tab with your message pre-filled. 
                      You can review and send it from there.
                    </p>
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={onClose}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
                      {isSubmitting ? 'Opening Gmail...' : 'Open in Gmail'}
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          )}

          {/* Quick Actions */}
          <div className="border-t pt-4">
            <p className="text-sm text-muted-foreground mb-3">Quick Actions:</p>
            <div className="flex flex-wrap gap-2">
              {property?.owner?.email && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openGmailCompose(
                    `Inquiry about ${property.title}`,
                    `Hi ${property.owner.name},\n\nI'm interested in your property "${property.title}" located at ${property.location}. Could you please provide more information?\n\nBest regards,\n${currentUser?.name || 'Interested Buyer'}`
                  )}
                >
                  <Mail className="h-4 w-4 mr-1" />
                  Quick Email
                </Button>
              )}
              {property?.owner?.phoneNumber && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => initiatePhoneCall(property.owner.phoneNumber)}
                >
                  <Phone className="h-4 w-4 mr-1" />
                  Call Owner
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactOwnerModal;