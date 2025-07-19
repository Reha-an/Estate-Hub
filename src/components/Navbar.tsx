import { Search, Menu, X, User, Building, Heart, LogOut } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useProperty } from '../context/PropertyContext';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from './ui/dropdown-menu';
import { ThemeToggle } from './ThemeToggle';

const Navbar = () => {
  const { currentUser, logout } = useProperty();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Buy', path: '/buy' },
    { label: 'Rent', path: '/rent' },
    { label: 'Sell', path: '/sell' },
    { label: 'Favorites', path: '/favorites' },
  ];

  const isActivePath = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-background shadow-sm border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="text-estate-primary font-bold text-2xl">
              Estate<span className="text-estate-accent">Hub</span>
            </Link>
            <div className="hidden md:flex ml-8 space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`font-medium transition-colors hover:text-estate-primary ${
                    isActivePath(item.path)
                      ? 'text-estate-primary border-b-2 border-estate-primary pb-1'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              {currentUser?.isAdmin && (
                <Link 
                  to="/admin" 
                  className={`font-medium transition-colors hover:text-estate-primary ${
                    isActivePath('/admin')
                      ? 'text-estate-primary border-b-2 border-estate-primary pb-1'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Admin
                </Link>
              )}
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/search" className="flex items-center text-muted-foreground hover:text-estate-primary transition-colors">
              <Search size={18} className="mr-1" />
              <span>Search</span>
            </Link>
            
            <ThemeToggle />
            
            {currentUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar>
                      <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                      <AvatarFallback>{currentUser.name.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium text-foreground">{currentUser.name}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">{currentUser.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="w-full cursor-pointer flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/my-properties" className="w-full cursor-pointer flex items-center">
                      <Building className="mr-2 h-4 w-4" />
                      My Properties
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/favorites" className="w-full cursor-pointer flex items-center">
                      <Heart className="mr-2 h-4 w-4" />
                      Favorites
                    </Link>
                  </DropdownMenuItem>
                  {currentUser.isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="w-full cursor-pointer flex items-center">
                        <Building className="mr-2 h-4 w-4" />
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer flex items-center">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="outline" asChild>
                  <Link to="/login">Log In</Link>
                </Button>
                <Button className="bg-estate-primary hover:bg-estate-accent" asChild>
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-foreground focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-3 pb-3 border-t border-border">
            <div className="flex flex-col space-y-3 pt-3">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`font-medium transition-colors hover:text-estate-primary block px-2 py-1 ${
                    isActivePath(item.path)
                      ? 'text-estate-primary'
                      : 'text-muted-foreground'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <Link 
                to="/search" 
                className="text-muted-foreground hover:text-estate-primary transition-colors block px-2 py-1 flex items-center"
                onClick={() => setIsMenuOpen(false)}
              >
                <Search className="mr-2 h-4 w-4" />
                Search
              </Link>
              {currentUser?.isAdmin && (
                <Link 
                  to="/admin" 
                  className={`font-medium transition-colors hover:text-estate-primary block px-2 py-1 ${
                    isActivePath('/admin')
                      ? 'text-estate-primary'
                      : 'text-muted-foreground'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin
                </Link>
              )}
              
              {currentUser ? (
                <>
                  <hr className="border-border my-2" />
                  <div className="flex items-center space-x-3 px-2 py-1">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                      <AvatarFallback>{currentUser.name.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-foreground">{currentUser.name}</p>
                      <p className="text-sm text-muted-foreground">{currentUser.email}</p>
                    </div>
                  </div>
                  <Link 
                    to="/profile" 
                    className="text-muted-foreground hover:text-estate-primary transition-colors block px-2 py-1 flex items-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                  <Link 
                    to="/my-properties" 
                    className="text-muted-foreground hover:text-estate-primary transition-colors block px-2 py-1 flex items-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Building className="mr-2 h-4 w-4" />
                    My Properties
                  </Link>
                  <Link 
                    to="/favorites" 
                    className="text-muted-foreground hover:text-estate-primary transition-colors block px-2 py-1 flex items-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Heart className="mr-2 h-4 w-4" />
                    Favorites
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="text-muted-foreground hover:text-destructive transition-colors block px-2 py-1 text-left w-full flex items-center"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <hr className="border-border my-2" />
                  <div className="flex flex-col space-y-2 px-2">
                    <Button variant="outline" asChild className="w-full justify-start">
                      <Link to="/login" onClick={() => setIsMenuOpen(false)}>Log In</Link>
                    </Button>
                    <Button className="bg-estate-primary hover:bg-estate-accent w-full justify-start" asChild>
                      <Link to="/signup" onClick={() => setIsMenuOpen(false)}>Sign Up</Link>
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;