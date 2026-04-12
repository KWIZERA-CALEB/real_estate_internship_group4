# Quick Start Guide - Running the Application

## Prerequisites
- **Node.js** installed (https://nodejs.org)
- **MySQL** installed and running
- **Git** installed (for GitHub)

---

## Starting the Application

### Terminal 1: Backend Server

```powershell
cd c:\Users\Miguel\Documents\real_estate_internship_group4\backend
npm install    # Only needed first time
npm start      # Starts on port 3000
```

Expected output:
```
Server is running on port 3000
```

### Terminal 2: Frontend Development Server

```powershell
cd c:\Users\Miguel\Documents\real_estate_internship_group4\frontend
npm install    # Only needed first time
npm run dev    # Starts on port 5173
```

Expected output:
```
VITE v5.0.10  ready in 234 ms

Local:    http://localhost:5173/
Press q to quit; Press r to reload; Press c to clear screen
```

---

## Opening the Application

**URL**: Open browser and go to `http://localhost:5173`

You should see the login page with blue and white styling.

---

## Test Credentials (After First Signup)

### Option 1: Create New Account
1. Click "Sign Up"
2. Fill in: Name, Email, Password
3. Click "Sign Up"
4. Login with those credentials

### Option 2: Use Test Account (If Already Created)
- **Email**: test@example.com
- **Password**: password123

---

## What You Can Do

✅ **Sign Up** - Create new team member accounts
✅ **Log In** - Access dashboard with credentials
✅ **View Team Members** - See all registered users
✅ **Add Team Members** - Add more users/
✅ **View Properties** - See all real estate listings
✅ **Search Properties** - Find properties by ID
✅ **Manage Properties** - Delete properties
✅ **Log Out** - End session securely

---

## Project Structure

```
real_estate_internship_group4/
├── backend/                           # Node.js/Express server
│   ├── controller/usercontroller.js   # Login/signup logic
│   ├── routes/userroutes.js           # API endpoints
│   ├── tables/usertable.js            # User database model
│   ├── config/db.js                   # Database config
│   └── index.js                       # Main server file
│
├── frontend/                          # React application
│   ├── src/
│   │   ├── App.jsx                    # Main app component
│   │   ├── Login.jsx                  # Login page
│   │   ├── Signup.jsx                 # Registration page
│   │   ├── Dashboard.jsx              # Main app page
│   │   ├── styles.css                 # Blue/white theme
│   │   └── main.jsx                   # Entry point
│   ├── vite.config.js                 # Build config
│   └── package.json                   # Dependencies
│
├── GITHUB_SETUP_GUIDE.md              # How to push to GitHub
├── AUTHENTICATION_GUIDE.md            # How auth works
└── QUICK_START_GUIDE.md               # This file
```

---

## Common Issues & Solutions

### Issue: "Cannot find module 'express'"
**Solution**: 
```powershell
cd backend
npm install
```

### Issue: "Port 3000 already in use"
**Solution**: 
```powershell
# Kill the process using port 3000
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F
```

### Issue: "Cannot connect to database"
**Solution**: 
- Check MySQL is running
- Verify credentials in `backend/config/db.js`
- Ensure database is created

### Issue: "CORS error" in browser console
**Solution**: 
- Make sure backend is running on port 3000
- Frontend must be on port 5173
- Check CORS config in `backend/index.js`

### Issue: "Session not persisting"
**Solution**: 
- Make sure `credentials: "include"` in fetch calls
- Check browser cookies are enabled
- Verify database sessions table exists

---

## Stopping the Application

### To stop backend:
```powershell
Press Ctrl + C in backend terminal
```

### To stop frontend:
```powershell
Press Ctrl + C in frontend terminal
```

---

## Database Check

To verify your data is being saved:

```powershell
# In MySQL, check users table
SELECT * FROM users;   # Should show registered users
SELECT * FROM sessions;  # Should show active sessions
```

---

## Environment Variables (For Later)

Create `backend/.env` file (optional, for production):

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=real_estate_db
SESSION_SECRET=your_super_secret_key_change_this
NODE_ENV=production
```

---

## Next Steps

1. **Test the app** - Follow the test credentials above
2. **Understand auth** - Read AUTHENTICATION_GUIDE.md
3. **Set up GitHub** - Follow GITHUB_SETUP_GUIDE.md
4. **Start collaborating** - Push changes to GitHub

---

## Need Help?

- Check logs in the terminal for error messages
- Look at the browser console (F12 → Console tab)
- Review the AUTHENTICATION_GUIDE.md for technical details
- Check backend/config/db.js for database settings

Happy coding! 🚀
