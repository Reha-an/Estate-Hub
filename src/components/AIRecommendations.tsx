import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import PropertyCard from './PropertyCard';
import { useAIRecommendations } from '../hooks/useAIRecommendations';
import { useProperty } from '../context/PropertyContext';
import { Brain, RefreshCw, Star, TrendingUp, Sparkles } from 'lucide-react';

const AIRecommendations = () => {
  const { currentUser, favorites } = useProperty();
  const { recommendations, isLoading, refreshRecommendations } = useAIRecommendations();

  if (!currentUser) {
    return (
      <Card className="max-w-md mx-auto border-0 shadow-lg">
        <CardContent className="pt-8 pb-6 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <Brain className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-3">AI Recommendations</h3>
          <p className="text-muted-foreground mb-6 px-4">
            Sign in to get personalized property recommendations based on your preferences.
          </p>
          <Button asChild className="px-6 py-3 rounded-lg">
            <Link to="/login">Sign In</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (favorites.length === 0) {
    return (
      <Card className="max-w-md mx-auto border-0 shadow-lg">
        <CardContent className="pt-8 pb-6 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-amber-50">
            <Star className="h-8 w-8 text-amber-500" />
          </div>
          <h3 className="text-xl font-semibold mb-3">Start Building Your Preferences</h3>
          <p className="text-muted-foreground mb-6 px-4">
            Add properties to your favorites to get AI-powered recommendations tailored just for you.
          </p>
          <Button asChild className="px-6 py-3 rounded-lg bg-primary hover:bg-primary/90">
            <Link to="/buy">Browse Properties</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <Card className="border-0 shadow-lg overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold">AI Recommendations</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Personalized just for you
                </p>
              </div>
              <Badge variant="secondary" className="ml-2 bg-primary/10 text-primary border-primary/20">
                <TrendingUp className="h-4 w-4 mr-1.5" />
                Smart Picks
              </Badge>
            </div>
            
          </div>
        </CardHeader>
        
        <CardContent className="pt-6">
          <div className="flex items-center mb-6 px-2 py-3 bg-muted/30 rounded-lg">
            <Sparkles className="h-5 w-5 text-primary mr-3" />
            <p className="text-muted-foreground">
              Based on your <span className="font-semibold text-primary"></span> favorite properties, 
              we found <span className="font-semibold text-primary"></span> perfect matches
            </p>
          </div>
          
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground font-medium">Analyzing your preferences...</p>
              <p className="text-sm text-muted-foreground mt-1">This may take a moment</p>
            </div>
          ) : recommendations.length > 0 ? (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {recommendations.slice(0, 3).map(({ property, score }) => (
                  <div key={property.id} className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 blur-sm"></div>
                    <div className="relative h-full rounded-xl bg-background">
                      <PropertyCard property={property} />
                      <div className="absolute top-3 left-3 z-10">
                        <Badge className="bg-gradient-to-r from-primary to-purple-600 text-white shadow-md">
                          {score}% Match
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {recommendations.length > 3 && (
                <div className="text-center pt-2">
                  <Button 
                    asChild 
                    variant="outline" 
                    className="border-primary/30 hover:bg-primary/5 hover:border-primary/50 px-6 py-3 rounded-lg"
                  >
                    <Link to="/recommendations" className="flex items-center">
                      <Sparkles className="h-4 w-4 mr-2" />
                      View All {recommendations.length} Recommendations
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                <Brain className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No recommendations yet</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Try adding more properties to your favorites or adjusting your preferences to get better matches.
              </p>
              <Button variant="outline" className="mt-6 px-6 py-3 rounded-lg">
                <Link to="/buy" className="flex items-center">
                  <Star className="h-4 w-4 mr-2" />
                  Browse Properties
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AIRecommendations;