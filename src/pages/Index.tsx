import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PropertyCard from '../components/PropertyCard';
import { useProperty } from '../context/PropertyContext';
import { Button } from '../components/ui/button';
import { Search, GitCompare, Star, TrendingUp, Shield, Clock } from 'lucide-react';
import AIRecommendations from '../components/AIRecommendations';

const Index = () => {
  const { properties, isLoading, currentUser, favorites } = useProperty();

  // Get featured properties
  const featuredProperties = properties.filter(p => p.isFeatured);

  // Get latest properties (limit to 6)
  const latestProperties = [...properties]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900">
          <img 
            src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1500&q=70" 
            alt="Real Estate Hero" 
            className="w-full h-full object-cover opacity-30 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
        </div>
        
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-6 border border-white/20">
              <Star className="w-4 h-4 mr-2 text-yellow-400" />
              Trusted by 10,000+ Happy Customers
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-white leading-tight">
              Find Your 
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"> Dream Home</span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-12 text-white/80 max-w-3xl mx-auto leading-relaxed">
              Discover thousands of premium properties with AI-powered recommendations 
              and cutting-edge technology
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto mb-16">
              <Button 
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-lg py-6 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0"
                asChild
              >
                <Link to="/buy" className="flex items-center justify-center">
                  <Search className="mr-2 h-5 w-5" />
                  Buy Properties
                </Link>
              </Button>
              
              <Button 
                className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white text-lg py-6 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0"
                asChild
              >
                <Link to="/rent" className="flex items-center justify-center">
                  <Clock className="mr-2 h-5 w-5" />
                  Rent Properties
                </Link>
              </Button>
              
              <Button 
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white text-lg py-6 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0"
                asChild
              >
                <Link to="/sell" className="flex items-center justify-center">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Sell Property
                </Link>
              </Button>
              
              <Button 
                className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white text-lg py-6 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0"
                asChild
              >
                <Link to="/compare" className="flex items-center justify-center">
                  <GitCompare className="mr-2 h-5 w-5" />
                  Compare
                </Link>
              </Button>
            </div>
            
            {/* Enhanced Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">15,000+</div>
                <div className="text-white/80">Premium Properties</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">120+</div>
                <div className="text-white/80">Cities Covered</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">10,000+</div>
                <div className="text-white/80">Happy Customers</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Recommendations Section */}
      {currentUser && favorites.length > 0 && (
        <section className="py-16 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/20 dark:via-indigo-950/20 dark:to-purple-950/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50">
              <AIRecommendations />
            </div>
          </div>
        </section>
      )}
      
      {/* Smart Features Section */}
      <section className="py-20 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/20 via-transparent to-purple-100/20 dark:from-blue-900/10 dark:to-purple-900/10"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-full text-blue-600 dark:text-blue-400 text-sm font-medium mb-6 border border-blue-200 dark:border-blue-800">
              <Shield className="w-4 h-4 mr-2" />
              Smart Technology
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              Smart Features for Smart Decisions
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
              Estate Hub combines cutting-edge technology with real estate expertise
              to make your property journey seamless and successful.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="group bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl text-center border border-white/50 dark:border-slate-700/50 transition-all duration-300 hover:transform hover:scale-105">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-slate-800 dark:text-white">AI Recommendations</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Get personalized property suggestions based on your preferences and browsing history.
              </p>
            </div>
            
            <div className="group bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl text-center border border-white/50 dark:border-slate-700/50 transition-all duration-300 hover:transform hover:scale-105">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-slate-800 dark:text-white">Real-time Updates</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Stay informed with instant notifications about new listings and price changes.
              </p>
            </div>
            
            <div className="group bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl text-center border border-white/50 dark:border-slate-700/50 transition-all duration-300 hover:transform hover:scale-105">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-slate-800 dark:text-white">Chatbot Assistance</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Get answers to your questions 24/7 with our intelligent chatbot assistant.
              </p>
            </div>
            
            <Link 
              to="/compare" 
              className="group bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl text-center border border-white/50 dark:border-slate-700/50 transition-all duration-300 hover:transform hover:scale-105 cursor-pointer"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                <GitCompare className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Property Comparison</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Compare multiple properties side by side to make informed decisions.
              </p>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Featured Properties */}
      {featuredProperties.length > 0 && (
        <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white mb-4">Featured Properties</h2>
                <p className="text-slate-600 dark:text-slate-400 text-lg">Handpicked premium properties just for you</p>
              </div>
              <Link to="/search" className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                View all 
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
            
            {isLoading ? (
              <div className="text-center py-16">
                <div className="relative">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
                  <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-r-purple-600 mx-auto animate-spin" style={{animationDirection: 'reverse'}}></div>
                </div>
                <p className="mt-6 text-slate-600 dark:text-slate-400 text-lg">Loading amazing properties...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredProperties.map((property) => (
                  <div key={property.id} className="transform hover:scale-105 transition-all duration-300">
                    <PropertyCard property={property} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}
      
      {/* Latest Properties */}
      <section className="py-20 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white mb-4">Latest Properties</h2>
              <p className="text-slate-600 dark:text-slate-400 text-lg">Fresh listings updated daily</p>
            </div>
            <Link to="/search" className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              View all 
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
          
          {isLoading ? (
            <div className="text-center py-16">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-200 border-t-emerald-600 mx-auto"></div>
                <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-r-teal-600 mx-auto animate-spin" style={{animationDirection: 'reverse'}}></div>
              </div>
              <p className="mt-6 text-slate-600 dark:text-slate-400 text-lg">Loading latest properties...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {latestProperties.map((property) => (
                <div key={property.id} className="transform hover:scale-105 transition-all duration-300">
                  <PropertyCard property={property} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">Ready to Find Your Dream Property?</h2>
            <p className="text-xl mb-10 max-w-3xl mx-auto text-white/80 leading-relaxed">
              Join thousands of satisfied customers who found their perfect home through our platform. 
              Start your journey today with our AI-powered recommendations.
            </p>
            
            <div className="flex flex-wrap justify-center gap-6">
              <Button 
                className="bg-white text-blue-900 hover:bg-blue-50 text-lg py-6 px-10 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-semibold"
                asChild
              >
                <Link to="/signup" className="flex items-center">
                  <Star className="mr-2 h-5 w-5" />
                  Create Account
                </Link>
              </Button>
            </div>
            
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-2">Free</div>
                <div className="text-white/80">Account Creation</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-2">24/7</div>
                <div className="text-white/80">Customer Support</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-2">100%</div>
                <div className="text-white/80">Satisfaction Guarantee</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;