# Session-Based Authentication Implementation Guide

## Overview
This document explains the session-based authentication system implemented in your Real Estate Management application.

---

## What is Session-Based Authentication?

Session-based authentication uses **server-side sessions** to track logged-in users:

1. User logs in with email/password
2. Server validates credentials and creates a session
3. Session ID is stored in a cookie sent to browser
4. Browser automatically sends cookie with each request
5. Server validates the session cookie to identify the user
6. User logs out, server destroys the session

**Key Advantage**: Session state is maintained on the server, making it stateless from the client perspective.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                         │
│  ┌──────────────┐  ┌────────────────┐  ┌──────────────────┐ │
│  │   Login.jsx  │  │  Signup.jsx    │  │  Dashboard.jsx   │ │
│  └──────────────┘  └────────────────┘  └──────────────────┘ │
│         │                   │                  │              │
│         └───────────────────┴──────────────────┘              │
│                      │                                        │
│            HTTP Requests + Cookies                           │
└────────────┬────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND (Node.js)                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │    Express + Express-Session Middleware              │  │
│  │  ┌──────────────────────────────────────────────┐   │  │
│  │  │  POST /api/login  ← Validate & Create Session   │  │
│  │  │  POST /api/logout ← Destroy Session            │  │
│  │  │  GET /api/current-user ← Check Session         │  │
│  │  │  POST /api/users  ← Create User (hashed pwd)   │  │
│  │  └──────────────────────────────────────────────┘   │  │
│  └──────────────────────────────────────────────────────┘  │
│             │              │              │                │
│             ▼              ▼              ▼                │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Sequelize ORM + MySQL Database              │  │
│  │  ┌──────────────┐  ┌──────────────┐               │  │
│  │  │ users table  │  │ sessions tbl │               │  │
│  │  │ (bcrypt pwd) │  │ (session IDs)│               │  │
│  │  └──────────────┘  └──────────────┘               │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## Backend Implementation

### 1. Session Configuration (backend/index.js)

```javascript
import session from 'express-session';
import SequelizeStore from 'connect-session-sequelize';

// Create session store that uses database
const SessionStore = SequelizeStore(session.Store);
const sessionStore = new SessionStore({
    db: sequelize,  // Your Sequelize instance
});

// Configure session middleware
app.use(session({
    secret: 'your_secret_key_change_this_in_production',
    store: sessionStore,              // Store sessions in database
    resave: false,                    // Don't resave unmodified sessions
    saveUninitialized: false,         // Don't create empty sessions
    cookie: {
        secure: false,                // Set to true with HTTPS
        httpOnly: true,               // Prevent JS access to cookie
        maxAge: 24 * 60 * 60 * 1000,  // 24 hour expiration
        sameSite: 'lax'               // CSRF protection
    }
}));
```

**What this does**:
- Creates a session store in your database
- Each logged-in user gets a unique session ID
- Sessions expire after 24 hours of inactivity
- Sessions are stored securely (httpOnly + sameSite)

### 2. User Model with Password Hashing

**Before**: Passwords stored as plain text ❌
**Now**: Passwords hashed with bcryptjs ✅

```javascript
// In usercontroller.js
import bcrypt from 'bcryptjs';

const createUser = async (req, res) => {
    const { name, email, password } = req.body;
    
    // Hash password before storing
    const hashedPassword = await bcrypt.hash(password, 10);
    // bcrypt.hash(password, saltRounds)
    // Higher number = more secure but slower
    
    const newuser = await User.create({
        name: name,
        email: email,
        password: hashedPassword  // Store hashed version, not original
    });
    
    res.status(201).json({ message: "User created successfully" });
};
```

**Benefits**:
- Even if database is compromised, passwords aren't exposed
- Same password always produces different hash (due to salt)
- Impossible to reverse hash back to original password

### 3. Login Endpoint (backend/controller/usercontroller.js)

```javascript
const login = async (req, res) => {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findOne({ where: { email: email } });
    if (!user) return res.status(401).json({ error: 'User not found' });
    
    // Compare provided password with stored hash
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ error: 'Invalid password' });
    
    // ✅ Password is correct - create session
    req.session.userId = user.id;
    req.session.userName = user.name;
    req.session.userEmail = user.email;
    
    res.status(200).json({
        message: 'Login successful',
        user: { id: user.id, name: user.name, email: user.email }
    });
};
```

**Flow**:
1. User submits email/password
2. Check if user exists in database
3. Use bcrypt.compare() to safely check password
4. If valid, set `req.session` properties (stored in database)
5. Browser receives session cookie automatically

### 4. Logout Endpoint

```javascript
const logout = async (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).json({ error: 'Logout failed' });
        
        res.clearCookie('connect.sid');  // Remove session cookie
        res.status(200).json({ message: 'Logout successful' });
    });
};
```

**What happens**:
- Session is deleted from database
- Client-side cookie is cleared
- User is no longer authenticated

### 5. Protected Route (Get Current User)

```javascript
const getCurrentUser = async (req, res) => {
    // Check if session exists
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Not authenticated' });
    }
    
    // Session is valid, return user info
    const user = await User.findByPk(req.session.userId);
    res.status(200).json({ user: { id: user.id, name: user.name, email: user.email } });
};
```

**Key Point**: 
- `req.session.userId` only exists if user logged in successfully
- This protects endpoints from unauthorized access

---

## Frontend Implementation

### 1. Login Component (frontend/src/Login.jsx)

```javascript
const handleLogin = async (e) => {
    e.preventDefault();
    
    const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",  // ⭐ IMPORTANT: Send cookies
        body: JSON.stringify({
            email: email,
            password: password,
        }),
    });
    
    const data = await response.json();
    
    if (response.ok) {
        // Login successful, show dashboard
        onLoginSuccess();  // Switch to authenticated view
    } else {
        setError(data.error);
    }
};
```

**Key `credentials: "include"`**:
- Without it: Cookies are NOT sent with request
- With it: Browser automatically includes session cookie
- This is HOW the browser "remembers" the user

### 2. App.jsx - Authentication Gate

```javascript
function App() {
    const [authState, setAuthState] = useState("login");  // "login", "signup", "dashboard"
    const [currentUser, setCurrentUser] = useState(null);
    
    // Check if already logged in when app loads
    useEffect(() => {
        checkAuthStatus();
    }, []);
    
    const checkAuthStatus = async () => {
        const response = await fetch("http://localhost:3000/api/current-user", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",  // Send session cookie
        });
        
        if (response.ok) {
            // Session is valid
            const data = await response.json();
            setCurrentUser(data.user);
            setAuthState("dashboard");  // Show dashboard
        } else {
            // No session, show login
            setAuthState("login");
        }
    };
    
    return (
        <>
            {authState === "login" && <Login onLoginSuccess={handleLoginSuccess} />}
            {authState === "signup" && <Signup onSignupSuccess={handleSignupSuccess} />}
            {authState === "dashboard" && <Dashboard user={currentUser} onLogout={handleLogout} />}
        </>
    );
}
```

**Authentication Flow**:
1. App loads → calls `checkAuthStatus()`
2. If session valid → show dashboard
3. If no session → show login
4. User logs in → session created → dashboard shown
5. User closes browser → cookie persists (24 hours max)
6. User returns → `checkAuthStatus()` finds session → dashboard shown
7. User logs out → session destroyed → back to login

### 3. Signup Component (frontend/src/Signup.jsx)

```javascript
const handleSignup = async (e) => {
    e.preventDefault();
    
    const response = await fetch("http://localhost:3000/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: name,
            email: email,
            password: password,
        }),
    });
    
    if (response.ok) {
        setMessage("Sign up successful! You can now log in.");
        // Switch to login page
        onSignupSuccess();
    }
};
```

**Note**: Signup does NOT create session - must login after signup.

---

## Security Features

### 1. Password Security
- ✅ Passwords hashed with bcryptjs (10 salt rounds)
- ✅ Never stored as plain text
- ✅ Cannot be reversed

### 2. Session Security
- ✅ Sessions stored in database (not file system)
- ✅ Session ID is cryptographically secure
- ✅ `httpOnly` cookie: JavaScript can't access it (prevents XSS)
- ✅ `sameSite: 'lax'`: Prevents CSRF attacks
- ✅ 24-hour expiration: Reduces exposure window

### 3. CORS Configuration
```javascript
app.use(cors({
    origin: 'http://localhost:5173',      // Only your frontend
    credentials: true                      // Allow cookies
}))
```

- ✅ Only your frontend domain can access API
- ✅ Credentials (cookies) are allowed

---

## Testing the Authentication

### Test 1: Signup
```
1. Go to http://localhost:5173
2. Click "Sign Up"
3. Fill in form (Name: John, Email: john@example.com, Password: password123)
4. Click "Sign Up"
5. Should see success message
```

### Test 2: Login
```
1. Click "Log In"
2. Enter email: john@example.com
3. Enter password: password123
4. Should see dashboard with welcome message
```

### Test 3: Session Persistence
```
1. Close browser completely
2. Reopen http://localhost:5173
3. Should still see dashboard (session persisted in database)
4. Browser will remember for 24 hours
```

### Test 4: Logout
```
1. Click "Logout" button
2. Should return to login page
3. Session is destroyed in database
```

### Test 5: Wrong Password
```
1. Try login with wrong password
2. Should see error message
3. Not logged in
```

---

## File Structure

```
real_estate_internship_group4/
├── backend/
│   ├── controller/
│   │   └── usercontroller.js          ← Login/Logout logic
│   ├── routes/
│   │   └── userroutes.js              ← Auth endpoints
│   ├── tables/
│   │   └── usertable.js               ← User model
│   ├── index.js                       ← Session config
│   └── package.json                   ← Dependencies
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx                    ← Auth gate
│   │   ├── Login.jsx                  ← Login form
│   │   ├── Signup.jsx                 ← Signup form
│   │   ├── Dashboard.jsx              ← Protected page
│   │   └── styles.css                 ← Blue/white theme
│   └── package.json
```

---

## Troubleshooting

### Issue: "Not authenticated" error
- Make sure to include `credentials: "include"` in fetch calls
- Check that you're logged in first

### Issue: Session expires too quickly
- Increase `maxAge` in session configuration (in milliseconds)
- Default is 24 hours: `24 * 60 * 60 * 1000`

### Issue: CORS error
- Check `cors` configuration matches your frontend URL
- Make sure `credentials: true` is enabled

### Issue: Password always fails
- Make sure bcryptjs is installed: `npm list bcryptjs`
- Check password hash rounds (currently 10)

### Issue: Sessions table not created
- Make sure `sessionStore.sync()` is called in index.js
- Check database connection is working

---

## How It's Different From Token-Based Auth

| Feature | Session-Based | Token-Based (JWT) |
|---------|---------------|-------------------|
| Storage | Server database | Client (browser) |
| Statefulness | Stateful | Stateless |
| CSRF | Low risk | Higher risk |
| Revocation | Instant | After expiry |
| Performance | Database lookups | Cryptographic verification |
| Complexity | Easier setup | More flexibility |

Your implementation uses **Session-Based** because it's:
- Simpler to implement
- More secure for web apps
- Better for monolithic architecture
- Supports instant logout

---

## Next Steps

1. **Test everything** - Follow the testing section above
2. **Deploy backend** - Host Node.js server
3. **Deploy frontend** - Host React app
4. **Update session secret** - NEVER use default in production
5. **Enable HTTPS** - Set `secure: true` in cookie
6. **Add password requirements** - Enforce strong passwords
7. **Add email verification** - Confirm user email on signup

---

## Additional Resources

- **Express-Session Docs**: https://github.com/expressjs/session
- **Bcryptjs Docs**: https://github.com/dcodeIO/bcrypt.js
- **OWASP Authentication**: https://owasp.org/www-community/attacks/Session_fixation
- **HTTP Cookies**: https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies

Good luck! Questions? Review the code in usercontroller.js and compare with this guide.
