# Group 4 Project - Complete Backend Documentation

---

## TABLE OF CONTENTS
1. [Executive Summary](#executive-summary)
2. [Project Structure](#project-structure)
3. [Technology Stack](#technology-stack)
4. [Database Models](#database-models)
5. [Database Relationships](#database-relationships)
6. [Server Configuration](#server-configuration)
7. [Key Components](#key-components)
8. [Project Progression](#project-progression)
9. [How to Run](#how-to-run)
10. [Current Status](#current-status)
11. [Next Steps](#next-steps)

---

## Executive Summary

This is a **Node.js Express backend** application for a comprehensive property management system with **user authentication and property listing features**. The database uses MySQL with Sequelize ORM for relational data management and enforcement of business logic through foreign key relationships.

**Key Features:**
- User registration and authentication
- Property listing management
- User-to-property relationships with cascading deletes
- Relational database with MySQL
- Auto-syncing database schema on server startup

---

## Project Structure

```
backend/
├── index.js                 # Main application entry point
├── package.json             # Project dependencies & scripts
├── config/
│   └── db.js               # MySQL database configuration & connection
├── tables/
│   ├── usertable.js        # User model schema
│   ├── propertiestable.js  # Properties model schema
│   └── foreignkeys.js      # Database relationships & constraints
└── node_modules/           # Installed npm packages
```

---

## Technology Stack

| Category | Technology | Version |
|----------|-----------|---------|
| **Runtime** | Node.js | v22.15.0 |
| **Framework** | Express.js | v5.2.1 |
| **ORM** | Sequelize | v6.37.8 |
| **Database Driver** | MySQL2 | v3.20.0 |
| **Dev Tool** | Nodemon | v3.1.14 |
| **Middleware** | CORS | v2.8.6 |
| **Module System** | ES6 Modules | - |

---

## Database Models

### User Model (tables/usertable.js)

**Table Name:** `users`
**Timestamps:** Enabled (auto createdAt, updatedAt)

**Fields:**
- `id` - INTEGER, AUTO_INCREMENT, PRIMARY KEY
- `name` - STRING, required
- `email` - STRING, required, unique
- `password` - STRING, required
- `createdAt` - TIMESTAMP (auto-managed)
- `updatedAt` - TIMESTAMP (auto-managed)

**Purpose:** Stores user account information for authentication and property ownership

**Schema Definition:**
```javascript
const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING, 
        allowNull: false
    }
}, {
    timestamps: true,
    tableName: 'users'
});
```

---

### Properties Model (tables/propertiestable.js)

**Table Name:** `properties`
**Timestamps:** Disabled

**Fields:**
- `id` - INTEGER, AUTO_INCREMENT, PRIMARY KEY
- `title` - STRING, required (property name/heading)
- `price` - INTEGER, required (listing price)
- `description` - STRING, required (property details)
- `image` - STRING, required (image URL/path)
- `location` - STRING, optional (address/location)
- `user_id` - INTEGER, required, **FOREIGN KEY** (links to User table)

**Purpose:** Stores property listings associated with users

**Schema Definition:**
```javascript
const properties = sequelize.define("properties", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    title :{
        type : DataTypes.STRING,
        allowNull : false
    },
    price :{
        type : DataTypes.INTEGER,
        allowNull : false
    },
    description :{
        type : DataTypes.STRING,
        allowNull : false
    },
    image :{
        type : DataTypes.STRING,
        allowNull : false
    },
    location :{
        type : DataTypes.STRING,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName : "properties",
    timestamps : false
})
```

---

## Database Relationships

### One-to-Many Relationship: User → Properties

**Relationship Diagram:**
```
┌─────────────────────────────────────────────────────┐
│                    One User                         │
│  (has many properties)                              │
└─────────────────────████████████───────────────────┘
                         │ 1:N │
┌─────────────────────────█████████───────────────────┐
│           Many Properties                           │
│  (each belonging to one user)                       │
└─────────────────────────────────────────────────────┘
```

**Configuration (tables/foreignkeys.js):**

```javascript
// One User can have many Properties
User.hasMany(properties, {
    foreignKey: "user_id",
    onDelete: 'CASCADE'  // Delete all properties when user is deleted
})

// Each Property belongs to one User
properties.belongsTo(User, {
    foreignKey: "user_id",
})
```

**Key Features:**
- **Foreign Key:** `user_id` in properties table
- **Cascade Delete:** When a user is deleted, all their properties are automatically deleted
- **Type:** One-to-Many (1:N)
- **Exported Models:** User, properties, and sequelize instance available for import

---

## Server Configuration

### Main Server File (index.js)

**Port:** 3000

**Startup Process:**
1. Import Express framework
2. Import database connection and sequelize ORM
3. Import User and Properties models
4. Import relationship configurations
5. Create Express app instance
6. Start server on port 3000
7. Sync database models with `{ alter: true }` flag
8. Establish MySQL connection

**Server Code:**
```javascript
import express from 'express';
import { conn, sequelize } from './config/db.js';
import properties from './tables/propertiestable.js';   
import User from './tables/usertable.js';
import './tables/foreignkeys.js';

const app = express();

app.listen(3000, () => {
    console.log('Server is running on port 3000');
    sequelize.sync({ alter: true });
    conn();
});
```

### Database Configuration (config/db.js)

**Connection Details:**
- **Host:** localhost
- **Port:** 3306
- **Dialect:** mysql
- **Database:** group4db
- **Username:** root
- **Password:** (empty/default XAMPP)

**Features:**
- Sequelize ORM initialization
- Async `conn()` function for database authentication
- Error handling with console logging
- Named exports: `sequelize`, `conn`

**Database Code:**
```javascript
import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
    host: "localhost",
    username: "root",
    password: "",
    database: "group4db",
    dialect: "mysql",
    port: 3306
})

async function conn() {
    try {
        await sequelize.authenticate();
        console.log("Connection has been established successfully.");
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
}

export { sequelize, conn };
```

---

## Key Components

### 1. Express Server Setup
- Framework for handling HTTP requests
- Listening on port 3000
- Auto-database synchronization on startup
- Connection establishment

### 2. Sequelize ORM
- Database abstraction layer
- Model definitions (User, Properties)
- Automatic schema management
- Relationship enforcement

### 3. MySQL Database
- Relational database storage
- Foreign key constraints
- Cascade delete operations
- Data persistence

### 4. Model Relationships
- User-to-Properties linking
- Cascade operations
- Data integrity enforcement

---

## Project Progression

### Phase 1: ✅ Initial Setup
- [x] Node.js project initialization
- [x] npm dependencies installation
- [x] Express server configuration
- [x] Sequelize ORM setup
- [x] MySQL database configuration on XAMPP

### Phase 2: ✅ Data Modeling
- [x] Properties table schema created
- [x] User table schema created
- [x] All fields and constraints defined
- [x] Primary keys configured
- [x] Unique constraints added (email)

### Phase 3: ✅ Relationship Implementation
- [x] One-to-Many relationship established
- [x] Foreign key constraints configured
- [x] Cascade delete operations implemented
- [x] Models exported and integrated
- [x] All models imported in main server

### Phase 4: ✅ Bug Fixes & Integration
- [x] Resolved "sequelize.sync is not a function" error
- [x] Fixed export/import issues between modules
- [x] Implemented named exports correctly
- [x] Verified all models are accessible
- [x] Database synchronization operational

### Phase 5: ⏳ (TODO) API Route Development
- [ ] User authentication routes (signup, login, logout)
- [ ] Property listing routes (create, read, update, delete)
- [ ] User profile routes (get, update)
- [ ] Search and filter endpoints
- [ ] Validation and error handling

### Phase 6: ⏳ (TODO) Middleware & Security
- [ ] CORS configuration
- [ ] JWT token authentication
- [ ] Password hashing (bcrypt)
- [ ] Input validation
- [ ] Error handling middleware
- [ ] User session management

### Phase 7: ⏳ (TODO) Advanced Features
- [ ] Image upload handling
- [ ] Advanced search/filtering
- [ ] Pagination for listings
- [ ] User reviews/ratings
- [ ] Email verification
- [ ] Password reset functionality

---

## Database Schema (SQL Equivalent)

### Users Table
```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Properties Table
```sql
CREATE TABLE properties (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    price INT NOT NULL,
    description VARCHAR(255) NOT NULL,
    image VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

---

## How to Run

### Prerequisites
1. **XAMPP** installed and running
   - MySQL service must be started
   - Port 3306 should be available
2. **Database created:**
   - Open phpMyAdmin (http://localhost/phpmyadmin)
   - Create new database named `group4db`
3. **Node.js** v18 or higher installed
4. **npm** installed

### Installation

```bash
# Navigate to backend directory
cd backend

# Install dependencies (if not already installed)
npm install

# Or if using yarn
yarn install
```

### Running the Server

```bash
# Development mode (with auto-restart on file changes)
npm run dev

# Production mode
npm start
```

### Expected Output
```
Server is running on port 3000
Connection has been established successfully.
```

---

## Current Status

| Component | Status | Notes |
|-----------|--------|-------|
| Node.js Setup | ✅ Complete | v22.15.0 |
| Express Server | ✅ Operational | Port 3000 |
| MySQL Connection | ✅ Configured | group4db |
| Sequelize ORM | ✅ Configured | v6.37.8 |
| User Model | ✅ Implemented | With timestamps |
| Properties Model | ✅ Implemented | With user_id FK |
| Relationships | ✅ Configured | 1:N with CASCADE |
| Database Sync | ✅ Automatic | Syncs on startup |
| API Routes | ⏳ Pending | Not yet implemented |
| Authentication | ⏳ Pending | JWT needed |
| Error Handling | ⏳ Basic | Enhanced needed |
| Input Validation | ⏳ Pending | Not implemented |
| Middleware (CORS) | ⏳ Pending | Installed but not used |

---

## Files Summary

| File | Purpose | Status | Last Updated |
|------|---------|--------|--------------|
| `index.js` | Application entry point | ✅ Complete | - |
| `config/db.js` | Database connection | ✅ Complete | - |
| `tables/usertable.js` | User model schema | ✅ Complete | - |
| `tables/propertiestable.js` | Properties model schema | ✅ Complete | - |
| `tables/foreignkeys.js` | Database relationships | ✅ Complete | - |
| `package.json` | Dependencies & scripts | ✅ Complete | - |

---

## Next Steps & Recommendations

### Immediate (Priority 1)
1. **Create API Routes** - Implement REST endpoints:
   - `POST /api/users/register` - User signup
   - `POST /api/users/login` - User login
   - `GET /api/properties` - Get all properties
   - `POST /api/properties` - Create new property

2. **Add Middleware:**
   - Body parser for JSON
   - CORS configuration
   - Error handling

### Short-term (Priority 2)
1. **Authentication:**
   - JWT token implementation
   - Password hashing with bcrypt
   - Token validation middleware

2. **Input Validation:**
   - Email format validation
   - Password strength requirements
   - Required field validation

### Medium-term (Priority 3)
1. **Advanced Features:**
   - Search and filter properties
   - User profile management
   - Property image handling

2. **Security:**
   - Rate limiting
   - SQL injection prevention (Sequelize handles this)
   - HTTPS in production

### Testing & Deployment (Priority 4)
1. Test all endpoints with Postman
2. Set up environment variables (.env)
3. Deploy to production server

---

## Troubleshooting

### Issue: "Connection has been established successfully" but then crash
**Solution:** Ensure all model files are imported before `sequelize.sync()`

### Issue: "Access denied for user 'root'"
**Solution:** Check XAMPP MySQL credentials - default is root/empty password

### Issue: "Database 'group4db' doesn't exist"
**Solution:** Create the database in phpMyAdmin before running server

### Issue: "Cannot find module"
**Solution:** Ensure ES6 module is enabled - check `"type": "module"` in package.json

---

## Useful Commands

```bash
# Development server with auto-reload
npm run dev

# Production server
npm start

# Install new package
npm install <package-name>

# View npm scripts
npm run

# Check Node version
node --version

# Check npm version
npm --version
```

---

## Contact & Support

For issues with:
- **Database:** Check XAMPP MySQL logs or phpMyAdmin
- **Dependencies:** Review package.json and run `npm install`
- **Server:** Check Terminal output for error messages
- **Relationships:** Verify foreignkeys.js is imported in index.js

---

**Last Updated:** April 4, 2026
**Project Status:** Active Development (Phase 4 Complete)
**Next Phase:** API Route Development
