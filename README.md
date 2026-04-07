# Real Estate Property Management App 🚀

[![Backend](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express%20%7C%20Sequelize-brightgreen)](https://nodejs.org/)
[![Frontend](https://img.shields.io/badge/Frontend-React%2019%20%7C%20Vite-blue)](https://react.dev/)
[![Database](https://img.shields.io/badge/Database-MySQL-orange)](https://www.mysql.com/)

## 📖 Overview

A full-stack web application for managing real estate properties. Users can register/login, view all properties, and create/update/delete their own properties. Properties are linked to owners. Built with modern JavaScript stack.

## ✨ Features

- **User Authentication**: JWT-based auth with bcrypt password hashing (login/register/profile management).
- **Property CRUD**: List all properties, view details, create/update/delete own properties.
- **Protected Routes**: Frontend protects property pages; backend requires auth for mutations.
- **Responsive UI**: React Router for navigation, AuthContext for state.
- **Database Associations**: Properties belong to Users (includes owner info in listings).

## 🛠️ Tech Stack

| Part         | Technologies                                    |
| ------------ | ----------------------------------------------- |
| **Backend**  | Node.js, Express.js (ES modules), Sequelize ORM |
| **Frontend** | React 19, Vite, React Router DOM 7              |
| **Database** | MySQL (via mysql2/Sequelize)                    |
| **Auth**     | JWT, bcrypt                                     |
| **Other**    | CORS, nodemon (dev)                             |

## 📁 File Structure

```
real_estate_internship_group4/
├── README.md                  # This file
├── TODO.md                    # Task progress
├── COMPLETE_DOCUMENTATION.md  # Additional docs (if any)
├── backend/
│   ├── index.js               # Server entry (port 3000)
│   ├── package.json           # Backend deps/scripts
│   ├── config/db.js           # Sequelize config (hardcoded creds)
│   ├── controller/            # Business logic
│   │   ├── usercontroller.js
│   │   └── propertycontroller.js
│   ├── middleware/auth.js     # JWT middleware
│   ├── routes/                # API routes
│   │   ├── userroutes.js
│   │   └── propertyroutes.js
│   └── tables/                # Sequelize models
│       ├── usertable.js
│       ├── propertiestable.js
│       └── foreignkeys.js
└── frontend/
    ├── package.json           # Frontend deps/scripts
    ├── vite.config.js
    ├── src/
    │   ├── App.jsx            # Main app w/ routes
    │   ├── main.jsx           # Entry point
    │   ├── components/
    │   │   ├── AuthContext.jsx
    │   │   └── ProtectedRoute.jsx
    │   └── pages/
    │       ├── Login.jsx
    │       ├── SignupPage.jsx
    │       ├── PropertyPage.jsx (list)
    │       ├── SinglePropertyPage.jsx
    │       └── Notfound.jsx
    └── public/
```

## 📋 Prerequisites

- [ ] Node.js (v20+)
- [ ] MySQL 8+ (localhost:3306)
- [ ] npm/yarn/pnpm

## 🚀 Quick Start

### 1. Clone & Install

```bash
# From project root
cd backend && npm install
cd ../frontend && npm install
```

### 2. Database Setup

- Start MySQL server.
- Create database: `CREATE DATABASE group4db;`
- Update `backend/config/db.js` creds if needed (host: localhost, user: root, pass: '', port: 3306).

### 3. Environment Variables (Recommended)

Create `backend/.env`:

```
JWT_SECRET=your-super-secret-key-change-this
DB_HOST=localhost
DB_USER=root
DB_PASS=yourpassword
DB_NAME=group4db
DB_PORT=3306
```

Update `db.js` to use `process.env`.

### 4. Run Backend

```bash
cd backend
npm run dev  # nodemon index.js (auto-restart, syncs DB tables)
```

- Server: http://localhost:3000
- On start: DB connection tested, tables synced (`sequelize.sync({ alter: true })`.

### 5. Run Frontend

```bash
cd frontend
npm run dev  # Vite dev server (usually http://localhost:5173)
```

- Auto-opens browser.
- Routes proxy to backend? Add to `vite.config.js` if CORS issues:
  ```js
  server: { proxy: { '/api': 'http://localhost:3000' } }
  ```

### 6. Test

- Register: POST /api/users
- Login: POST /api/users/login -> get token.
- Use token: `Authorization: Bearer <token>` for protected.

## 📚 API Documentation

**Base URL:** `http://localhost:3000/api`

### Users

| Method   | Endpoint       | Auth      | Body                         | Response                             |
| -------- | -------------- | --------- | ---------------------------- | ------------------------------------ |
| `POST`   | `/users`       | No        | `{name, email, password}`    | 201 `{message: "User created"}`      |
| `POST`   | `/users/login` | No        | `{email, password}`          | 200 `{token, user: {id,name,email}}` |
| `GET`    | `/users/all`   | Yes       | -                            | 200 `{users: [...]}`                 |
| `GET`    | `/users/:id`   | Yes       | -                            | 200 `{user}`                         |
| `PUT`    | `/users/:id`   | Yes (own) | `{name?, email?, password?}` | 200 `{message: "User updated"}`      |
| `DELETE` | `/users/:id`   | Yes (own) | -                            | 200 `{message: "User deleted"}`      |

### Properties

| Method   | Endpoint          | Auth      | Body                                           | Response                                                        |
| -------- | ----------------- | --------- | ---------------------------------------------- | --------------------------------------------------------------- |
| `GET`    | `/properties/all` | No        | -                                              | 200 `{properties: [{id,title,price,... , User: {name,email}}]}` |
| `GET`    | `/properties/:id` | No        | -                                              | 200 `{property}`                                                |
| `POST`   | `/properties`     | Yes       | `{title, price, description, image, location}` | 201 `{property}`                                                |
| `PUT`    | `/properties/:id` | Yes (own) | `{title?, ...}`                                | 200 `{property}`                                                |
| `DELETE` | `/properties/:id` | Yes (own) | -                                              | 200 `{message: "Property deleted"}`                             |

**Errors:** 400 (validation), 401 (auth), 403 (unauth), 404 (not found), 500 (server).

## 🌐 Frontend Routes

| Path              | Component                 | Protected |
| ----------------- | ------------------------- | --------- |
| `/login`          | Login                     | No        |
| `/signup`         | SignupPage                | No        |
| `/properties`     | PropertyPage (list)       | Yes       |
| `/properties/:id` | SinglePropertyPage        | Yes       |
| `*`               | Redirect to `/properties` | -         |

## 🗄️ Database Schema

- **Users**: `id` (PK), `name`, `email` (unique), `password` (hashed), `createdAt`.
- **Properties**: `id` (PK), `title`, `price`, `description`, `image`, `location`, `user_id` (FK), `createdAt`.
- Associations: Property belongsTo User (owner).

## 🔧 Development

- Backend: `npm run dev` (nodemon), `npm start` (prod).
- Frontend: `npm run dev` (HMR), `npm run build` (dist), `npm run lint`.
- DB Changes: Restart backend (auto-sync alters tables).

## 🚀 Deployment

1. **Backend**: PM2/Docker, env vars, RDS/MySQL prod DB, HTTPS.
2. **Frontend**: Vercel/Netlify (build + proxy API).
3. **Full**: Railway/Render (monorepo).
   Update DB creds/JWT_SECRET for prod!

## 🤝 Contributing

1. Fork & PR.
2. Follow ES modules, async/await patterns.
3. Add tests (none yet).

## ⚠️ Security Notes

- Hardcoded DB creds/JWT secret - move to .env!
- No rate limiting/input validation (add helmet/express-rate-limit).
- Password reset/forgot missing.


---

_Built for real_estate_internship_group4_">

