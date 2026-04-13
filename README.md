# Real Estate Property Management System

A full-stack web application for managing real estate properties with user authentication, property listing, and advanced CRUD operations. Built with modern JavaScript stack.

## ✨ Features

### 🔐 User Authentication
- **JWT-based Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt password encryption (10 salt rounds)
- **User Registration**: Create account with email validation
- **User Login**: Secure login with JWT token generation
- **Profile Management**: View and update user profile information
- **Protected Routes**: Frontend and backend route protection with authentication middleware

### 🏠 Property Management
- **Property Listing**: Browse all available properties with advanced filtering
- **Property Details**: Comprehensive property information pages
- **Create Properties**: Add new properties with rich details
- **Update Properties**: Edit property information (owner only)
- **Delete Properties**: Remove properties from listing (owner only)
- **Property Features**: 
  - Bedrooms, Bathrooms, Area (sqft)
  - Property type (house, apartment, condo, townhouse, land)
  - Status tracking (available, sold, pending)
  - Price and location
  - Detailed descriptions
  - Image URLs

### 🔍 Search & Filter
- **Text Search**: Search by title, location, or description
- **Property Type Filter**: Filter by property type
- **Status Filter**: Filter by availability status
- **Combined Filters**: Apply multiple filters simultaneously

### 👤 User Dashboard
- **Owner Information**: View and edit profile details
- **Property Statistics**: See total properties, available count, and portfolio value
- **Property Management**: Manage all owned properties from one place
- **Quick Actions**: Edit or delete properties easily

### 📱 Responsive UI/UX
- **Mobile-First Design**: Fully responsive across all devices
- **Modern Interface**: Clean, professional design with smooth animations
- **Icon Integration**: Lucide icons for visual clarity
- **Accessibility**: Semantic HTML and proper ARIA labels
- **Loading States**: Loading spinners and states for better UX
- **Error Handling**: Comprehensive error messages and alerts
- **Success Feedback**: Confirmation messages for user actions

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js 5.x (ES modules)
- **Database**: MySQL with Sequelize ORM
- **Authentication**: JWT (jsonwebtoken), bcryptjs
- **Middleware**: CORS, Body Parser
- **Environment**: dotenv for configuration
- **Development**: Nodemon for auto-restart

### Frontend
- **Framework**: React 19.x
- **Build Tool**: Vite 7.x
- **Routing**: React Router DOM 7.x
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Styling**: Custom CSS with CSS variables
- **Development**: ESLint for code quality

### Database
- **System**: MySQL 8.x
- **ORM**: Sequelize 6.x
- **Associations**: User-Property one-to-many relationship

## 📋 Project Structure

```
real_estate_internship_group4/
├── backend/
│   ├── config/
│   │   └── db.js                 # Database connection
│   ├── controller/
│   │   ├── usercontroller.js     # User auth & profile logic
│   │   └── propertiescontroller.js # Property CRUD logic
│   ├── middleware/
│   │   └── auth.js               # JWT authentication middleware
│   ├── routes/
│   │   ├── userroutes.js         # User endpoints
│   │   └── propertiesroutes.js   # Property endpoints
│   ├── tables/
│   │   ├── usertable.js          # User model
│   │   ├── propertiestable.js    # Property model
│   │   └── foreignkeys.js        # Database relationships
│   ├── .env                      # Environment variables
│   ├── index.js                  # Express app setup
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── client.js         # API utilities
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # Navigation component
│   │   │   ├── PropertyCard.jsx  # Property card component
│   │   │   └── ProtectedRoute.jsx # Route protection
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Authentication context
│   │   ├── pages/
│   │   │   ├── Home.jsx          # Landing page
│   │   │   ├── managment/
│   │   │   │   └── Dashboard.jsx # User dashboard
│   │   │   ├── renters/
│   │   │   │   ├── PropertiesList.jsx   # Properties listing
│   │   │   │   └── PropertyDetail.jsx   # Property details
│   │   │   ├── shared/
│   │   │   │   ├── Login.jsx     # Login page
│   │   │   │   └── Signup.jsx    # Registration page
│   │   │   └── user/
│   │   │       ├── NewProperty.jsx # Create property
│   │   │       └── EditProperty.jsx # Edit property
│   │   ├── App.jsx               # Main app with router
│   │   ├── main.jsx              # Entry point
│   │   └── index.css             # Global styles
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18 or higher
- npm or yarn
- MySQL 8.0 or higher
- Git

### Installation

#### 1. Clone the repository
```bash
git clone <repository-url>
cd real_estate_internship_group4
```

#### 2. Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Create .env file with your configuration
# Example:
# DB_HOST=127.0.0.1
# DB_USER=root
# DB_PASSWORD=your_password
# DB_NAME=group4db
# DB_PORT=3306
# JWT_SECRET=your_secret_key
# JWT_EXPIRE=7d
# PORT=3000

# Start development server (requires nodemon)
npm run dev
```

#### 3. Setup Frontend

```bash
cd ../frontend

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000/api

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+1234567890"
}

Response: 201 Created
{
  "message": "User registered successfully",
  "token": "jwt_token",
  "user": { id, name, email, phone }
}
```

#### Login User
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response: 200 OK
{
  "message": "Login successful",
  "token": "jwt_token",
  "user": { id, name, email, phone, profileImage }
}
```

#### Get User Profile (Protected)
```
GET /api/auth/profile
Authorization: Bearer {token}

Response: 200 OK
{
  "user": { id, name, email, phone, bio, profileImage, createdAt, updatedAt }
}
```

#### Update User Profile (Protected)
```
PUT /api/auth/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "John Updated",
  "phone": "+1234567890",
  "bio": "Real estate enthusiast"
}

Response: 200 OK
```

### Property Endpoints

#### Get All Properties
```
GET /api/properties/all

Response: 200 OK
{
  "properties": [
    {
      id, title, price, description, image, location,
      bedrooms, bathrooms, area, propertyType, status, user_id,
      User: { id, name, email, phone, profileImage }
    }
  ]
}
```

#### Get Property by ID
```
GET /api/properties/:id

Response: 200 OK
{
  "property": { ... }
}
```

#### Create Property (Protected)
```
POST /api/properties
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Beautiful 3BR House",
  "price": 550000,
  "description": "Detailed description...",
  "image": "https://...",
  "location": "123 Main St",
  "bedrooms": 3,
  "bathrooms": 2,
  "area": 2500,
  "propertyType": "house"
}

Response: 201 Created
```

#### Update Property (Protected - Owner Only)
```
PUT /api/properties/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Updated Title",
  "price": 600000,
  "status": "pending"
}

Response: 200 OK
```

#### Delete Property (Protected - Owner Only)
```
DELETE /api/properties/:id
Authorization: Bearer {token}

Response: 200 OK
```

## 🔒 Security Features

- **JWT Tokens**: Secure token-based authentication with 7-day expiration
- **Password Hashing**: Bcrypt with 10 salt rounds
- **CORS**: Configured for frontend-backend communication
- **Protected Routes**: Middleware-based protection for sensitive endpoints
- **Authorization Checks**: Verify user ownership before allowing mutations
- **SQL Injection Prevention**: Sequelize parameterized queries
- **Environment Variables**: Sensitive data stored in .env

## 📱 Responsive Design Breakpoints

- **Desktop**: 1200px+ (full features)
- **Tablet**: 768px - 1199px (optimized layout)
- **Mobile**: below 768px (single column, touch-friendly)

## 🎨 UI Components

- **Navigation Bar**: Sticky header with auth state display
- **Property Cards**: Responsive grid with hover effects
- **Form Components**: Validated input fields with error messages
- **Modals**: Overlay modals for confirmations
- **Alerts**: Success, error, warning, and info notifications
- **Loading States**: Spinner animations for async operations
- **Badges**: Status indicators for properties

## ⚡ Performance Optimizations

- **Image Optimization**: Lazy loading with fallback images
- **Code Splitting**: Router-based code splitting
- **Caching**: Browser caching for static assets
- **Efficient Queries**: Optimized database queries with includes
- **CSS Variables**: Dynamic theming with CSS variables

## 🐛 Error Handling

- **Validation**: Server-side input validation
- **Error Messages**: User-friendly error messages
- **Status Codes**: RESTful HTTP status codes
- **Try-Catch Blocks**: Comprehensive error catching
- **Fallback Images**: Default images for broken URLs

## 📦 Build & Deployment

### Build for Production

**Backend**:
```bash
cd backend
# Already optimized for production
```

**Frontend**:
```bash
cd frontend
npm run build
npm run preview  # Test production build
```

## 🔄 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  bio TEXT,
  profileImage VARCHAR(255),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Properties Table
```sql
CREATE TABLE properties (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  price DECIMAL(15,2) NOT NULL,
  description TEXT NOT NULL,
  image VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  bedrooms INT DEFAULT 1,
  bathrooms DECIMAL(3,1) DEFAULT 1,
  area DECIMAL(10,2),
  propertyType ENUM('house','apartment','condo','townhouse','land','other') DEFAULT 'house',
  status ENUM('available','sold','pending') DEFAULT 'available',
  user_id INT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👥 Team

- Group 4 - Real Estate Internship Project

## 📞 Support

For support, email support@realestate.local or create an issue in the repository.

## 🗺️ Roadmap

- [ ] Advanced filtering (price range, area range)
- [ ] Favorites/Wishlist system
- [ ] Property ratings and reviews
- [ ] Image upload functionality
- [ ] Google Maps integration
- [ ] Email notifications
- [ ] Admin dashboard
- [ ] SMS notifications
- [ ] Virtual property tours
- [ ] Payment integration

---

**Happy coding! 🚀**
