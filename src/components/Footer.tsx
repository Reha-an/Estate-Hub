import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-estate-primary text-white mt-auto">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">RealEstateHub</h3>
            <p className="text-gray-300 mb-4">
              Find your dream property with the most comprehensive real estate platform.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-estate-accent transition-colors">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="#" className="text-white hover:text-estate-accent transition-colors">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-white hover:text-estate-accent transition-colors">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-white hover:text-estate-accent transition-colors">
                <i className="fab fa-linkedin"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/buy" className="text-gray-300 hover:text-white transition-colors">Properties For Sale</Link>
              </li>
              <li>
                <Link to="/rent" className="text-gray-300 hover:text-white transition-colors">Properties For Rent</Link>
              </li>
              <li>
                <Link to="/search" className="text-gray-300 hover:text-white transition-colors">Search</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Property Types</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/buy?type=villa" className="text-gray-300 hover:text-white transition-colors">Villas</Link>
              </li>
              <li>
                <Link to="/buy?type=apartment" className="text-gray-300 hover:text-white transition-colors">Apartments</Link>
              </li>
              <li>
                <Link to="/buy?type=house" className="text-gray-300 hover:text-white transition-colors">Houses</Link>
              </li>
              <li>
                <Link to="/buy?type=commercial" className="text-gray-300 hover:text-white transition-colors">Commercial</Link>
              </li>
              <li>
                <Link to="/buy?type=land" className="text-gray-300 hover:text-white transition-colors">Land</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Contact Us</h4>
            <p className="text-gray-300 mb-2">1-88,madullapalli</p>
            <p className="text-gray-300 mb-2">khammam,507170</p>
            <p className="text-gray-300 mb-2">revanthambati12@gmail.com</p>
            <p className="text-gray-300 mb-2">7989912857</p>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-sm text-gray-400">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p>&copy; {new Date().getFullYear()} RealEstateHub. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link to="/sitemap" className="hover:text-white transition-colors">Sitemap</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
