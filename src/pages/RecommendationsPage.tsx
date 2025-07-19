import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PropertyCard from '../components/PropertyCard';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useAIRecommendations } from '../hooks/useAIRecommendations';
import { useProperty } from '../context/PropertyContext';
import { Brain, ArrowLeft, Star, RefreshCw, Sparkles, ChevronRight } from 'lucide-react';

const RecommendationsPage = () => {
  const { currentUser, favorites } = useProperty();
  const { recommendations, isLoading, refreshRecommendations } = useAIRecommendations();

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" asChild className="border-muted-foreground/30 hover:bg-muted/50">
              <Link to="/" className="flex items-center">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Link>
            </Button>
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Your AI Recommendations</h1>
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                Smart Picks
              </Badge>
            </div>
          </div>
          
          
        </div>

        {!currentUser ? (
          <div className="max-w-lg mx-auto bg-background rounded-xl border border-muted p-8 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Brain className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Personalized Recommendations</h3>
            <p className="text-muted-foreground mb-6">
              Sign in to unlock AI-powered property recommendations tailored to your unique preferences.
            </p>
            <Button asChild className="px-6">
              <Link to="/login" className="flex items-center">
                Sign In <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </div>
        ) : favorites.length === 0 ? (
          <div className="max-w-lg mx-auto bg-background rounded-xl border border-muted p-8 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-50">
              <Star className="h-8 w-8 text-amber-500" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Build Your Preferences</h3>
            <p className="text-muted-foreground mb-6">
              Start by saving properties you love to receive intelligent recommendations.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild className="px-6">
                <Link to="/buy">Browse Properties</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/favorites" className="flex items-center">
                  View Favorites <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </div>
          </div>
        ) : isLoading ? (
          <div className="text-center py-16">
            <div className="mx-auto mb-6 flex justify-center">
              <div className="animate-spin rounded-full h-14 w-14 border-4 border-primary border-t-transparent"></div>
            </div>
            <h3 className="text-lg font-medium mb-2">Analyzing Your Preferences</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Our AI is carefully selecting properties that match your unique taste...
            </p>
          </div>
        ) : recommendations.length > 0 ? (
          <div className="space-y-8">
            <div className="bg-background rounded-xl border border-muted p-6 shadow-sm">
              <div className="flex items-center mb-3">
                <Sparkles className="h-5 w-5 text-primary mr-2" />
                <h2 className="text-lg font-semibold">Your Recommendation Profile</h2>
              </div>
              <p className="text-muted-foreground">
                Based on analysis of your <span className="font-medium text-primary"> favorites</span>, 
                we've found <span className="font-medium text-primary"> perfect matches</span>.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map(({ property, score, reasons }) => (
                <div key={property.id} className="group relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 blur-sm"></div>
                  <div className="relative h-full bg-background rounded-xl border border-muted overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <PropertyCard property={property} />
                    <div className="absolute top-3 left-3 z-10">
                      <Badge className="bg-gradient-to-r from-primary to-purple-600 text-white font-medium shadow-md">
                        {score}% Match
                      </Badge>
                    </div>
                    <div className="p-4 border-t border-muted">
                      <div className="flex items-center mb-2">
                        <Brain className="h-4 w-4 text-primary mr-2" />
                        <h4 className="text-sm font-semibold">Why we recommend this</h4>
                      </div>
                      <ul className="text-sm text-muted-foreground space-y-2">
                        {reasons.slice(0, 3).map((reason, index) => (
                          <li key={index} className="flex">
                            <span className="text-primary mr-2">•</span>
                            <span>{reason}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-lg mx-auto bg-background rounded-xl border border-muted p-8 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Brain className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-3">No Matches Found</h3>
            <p className="text-muted-foreground mb-6">
              We couldn't find properties matching your current preferences. Try expanding your favorites or adjusting your criteria.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild className="px-6">
                <Link to="/search">Explore Properties</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/favorites" className="flex items-center">
                  Manage Favorites <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default RecommendationsPage;