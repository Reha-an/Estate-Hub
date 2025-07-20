# EstateHub 🏠

A comprehensive real estate platform that connects property buyers, sellers, and renters with a seamless and secure experience. EstateHub provides an intuitive interface for property transactions, advanced search capabilities, and robust admin controls.

## 🌟 Features

### Authentication
- 🔐 Multi-level authentication (Users & Administrators)
- 🔒 Secure user registration and login
- 📧 Email verification and password recovery

### User Features
- 🏘️ Property Transactions - Buy, Sell, Rent properties with ease
- 🏢 Multiple Property Types - Houses, Apartments, Villas, Bungalows
- 📍 Location-based Discovery - Find properties in your preferred areas
- 🔍 Advanced Search & Filtering - Filter by price, type, location, and more
- ❤️ Favorites - Save and manage your favorite properties
- ⭐ Reviews & Ratings - Read and write property reviews
- 📋 Detailed Property Information - Complete property details and specifications

### Admin Features
- 📊 Property Management - Add, edit, and manage all property listings
- 👀 Review Monitoring - Moderate and manage user reviews
- 👥 Profile Management System - Manage user accounts and permissions

## 🛠️ Tech Stack

### Frontend
- React.js with TypeScript
- Tailwind CSS for styling
- Real-time chat interface
- Responsive design for all devices

### Backend
- Node.js/Express.js server
- MongoDB database
- RESTful API architecture
- JWT authentication
- WebSocket for real-time features

## 🚀 Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB

### Frontend Setup
```bash
# Clone the repository
git clone https://github.com/yourusername/estate-hub.git

# Navigate to project directory
cd estate-hub

# Install dependencies
npm install

# Start development server
npm run dev
```

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file and add your environment variables
cp .env.example .env

# Start the server
npm start
```

### Environment Variables
Create a `.env` file in the backend directory with the following variables:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_SERVICE=your_email_service
EMAIL_USER=your_email
EMAIL_PASSWORD=your_email_password
```

## 📝 API Documentation
API documentation is available at `/api-docs` when running the server locally.

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors
- Rehaan - Lead Developer & Project Maintainer
  - Implemented core features and system architecture
  - Designed and developed the user interface
  - Set up the backend infrastructure
  - Integrated real-time features and authentication

## 🙏 Acknowledgments

I would like to express my gratitude to:

- The React.js and Node.js communities for their excellent documentation and resources
- MongoDB for providing a robust and scalable database solution
- Tailwind CSS team for their utility-first CSS framework that made styling a breeze
- All the open-source libraries and tools that made this project possible:
  - Express.js for the backend framework
  - JWT for secure authentication
  - Socket.io for real-time features
  - TypeScript for type safety
  - Vite for the fast development experience
- Special thanks to the real estate professionals who provided valuable insights into the industry requirements
- Fellow developers who provided feedback and suggestions during the development process

This project wouldn't have been possible without the support and contributions of the open-source community.
