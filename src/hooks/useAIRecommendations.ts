
import { useState, useEffect } from 'react';
import { Property } from '../types';
import { useProperty } from '../context/PropertyContext';

interface RecommendationScore {
  property: Property;
  score: number;
  reasons: string[];
}

export const useAIRecommendations = () => {
  const { properties, favorites, currentUser } = useProperty();
  const [recommendations, setRecommendations] = useState<RecommendationScore[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const generateRecommendations = () => {
    if (!currentUser || favorites.length === 0) {
      setRecommendations([]);
      return;
    }

    setIsLoading(true);

    // Get favorite properties
    const favoriteProperties = properties.filter(p => favorites.includes(p.id));
    
    // Analyze preferences from favorites
    const preferences = analyzeFavorites(favoriteProperties);
    
    // Score all non-favorite properties
    const scoredProperties = properties
      .filter(p => !favorites.includes(p.id))
      .map(property => scoreProperty(property, preferences))
      .filter(scored => scored.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6); // Top 6 recommendations

    setRecommendations(scoredProperties);
    setIsLoading(false);
  };

  const analyzeFavorites = (favoriteProperties: Property[]) => {
    const analysis = {
      preferredTypes: {} as Record<string, number>,
      preferredListingTypes: {} as Record<string, number>,
      avgPrice: 0,
      avgBedrooms: 0,
      avgBathrooms: 0,
      avgArea: 0,
      commonLocations: {} as Record<string, number>,
      commonFeatures: {} as Record<string, number>,
    };

    favoriteProperties.forEach(property => {
      // Type preferences
      analysis.preferredTypes[property.type] = (analysis.preferredTypes[property.type] || 0) + 1;
      
      // Listing type preferences
      analysis.preferredListingTypes[property.listingType] = (analysis.preferredListingTypes[property.listingType] || 0) + 1;
      
      // Location preferences
      const location = property.location.split(',')[0].trim(); // Get city
      analysis.commonLocations[location] = (analysis.commonLocations[location] || 0) + 1;
      
      // Feature preferences
      property.features.forEach(feature => {
        analysis.commonFeatures[feature] = (analysis.commonFeatures[feature] || 0) + 1;
      });
    });

    // Calculate averages
    analysis.avgPrice = favoriteProperties.reduce((sum, p) => sum + p.price, 0) / favoriteProperties.length;
    analysis.avgBedrooms = favoriteProperties.reduce((sum, p) => sum + p.bedrooms, 0) / favoriteProperties.length;
    analysis.avgBathrooms = favoriteProperties.reduce((sum, p) => sum + p.bathrooms, 0) / favoriteProperties.length;
    analysis.avgArea = favoriteProperties.reduce((sum, p) => sum + p.area, 0) / favoriteProperties.length;

    return analysis;
  };

  const scoreProperty = (property: Property, preferences: any): RecommendationScore => {
    let score = 0;
    const reasons: string[] = [];

    // Type matching (weight: 30)
    const typeScore = (preferences.preferredTypes[property.type] || 0) * 30;
    if (typeScore > 0) {
      score += typeScore;
      reasons.push(`Matches your preferred property type (${property.type})`);
    }

    // Listing type matching (weight: 20)
    const listingTypeScore = (preferences.preferredListingTypes[property.listingType] || 0) * 20;
    if (listingTypeScore > 0) {
      score += listingTypeScore;
      reasons.push(`Matches your preferred listing type (${property.listingType})`);
    }

    // Price similarity (weight: 25)
    const priceDiff = Math.abs(property.price - preferences.avgPrice) / preferences.avgPrice;
    if (priceDiff < 0.3) { // Within 30% of average
      const priceScore = (1 - priceDiff) * 25;
      score += priceScore;
      reasons.push('Similar price range to your favorites');
    }

    // Bedroom similarity (weight: 10)
    const bedroomDiff = Math.abs(property.bedrooms - preferences.avgBedrooms);
    if (bedroomDiff <= 1) {
      score += (2 - bedroomDiff) * 10;
      reasons.push('Similar bedroom count to your preferences');
    }

    // Bathroom similarity (weight: 10)
    const bathroomDiff = Math.abs(property.bathrooms - preferences.avgBathrooms);
    if (bathroomDiff <= 1) {
      score += (2 - bathroomDiff) * 10;
      reasons.push('Similar bathroom count to your preferences');
    }

    // Area similarity (weight: 15)
    const areaDiff = Math.abs(property.area - preferences.avgArea) / preferences.avgArea;
    if (areaDiff < 0.4) { // Within 40% of average
      const areaScore = (1 - areaDiff) * 15;
      score += areaScore;
      reasons.push('Similar size to your favorite properties');
    }

    // Location matching (weight: 20)
    const propertyLocation = property.location.split(',')[0].trim();
    if (preferences.commonLocations[propertyLocation]) {
      score += preferences.commonLocations[propertyLocation] * 20;
      reasons.push(`Located in ${propertyLocation} (your preferred area)`);
    }

    // Feature matching (weight: 10)
    const matchingFeatures = property.features.filter(feature => 
      preferences.commonFeatures[feature]
    );
    if (matchingFeatures.length > 0) {
      score += matchingFeatures.length * 5;
      reasons.push(`Has features you love: ${matchingFeatures.slice(0, 2).join(', ')}`);
    }

    return { property, score: Math.round(score), reasons };
  };

  useEffect(() => {
    generateRecommendations();
  }, [favorites, properties, currentUser]);

  return {
    recommendations,
    isLoading,
    refreshRecommendations: generateRecommendations,
  };
};
