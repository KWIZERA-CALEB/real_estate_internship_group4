import express from 'express';
import { conn, sequelize } from './config/db.js';
import properties from './tables/propertiestable.js';   
import User from './tables/usertable.js';
import './tables/foreignkeys.js'; 
import userroutes from './routes/userroutes.js';
import propertyroutes from './routes/propertyroutes.js';
import cors from 'cors'
import session from 'express-session';
import SequelizeStore from 'connect-session-sequelize';


const app = express();

// Configure session store
const SessionStore = SequelizeStore(session.Store);
const sessionStore = new SessionStore({
    db: sequelize,
});

// allow frontend to make request using cors with credentials
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))

// Session configuration
app.use(session({
    secret: 'your_secret_key_change_this_in_production',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // set to true if using HTTPS
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        sameSite: 'lax'
    }
}));

// to allow sending data using json with increased limit for base64 images
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))
app.use("/api", userroutes )
app.use("/api", propertyroutes )

app.listen(3000, () => {
    console.log('Server is running on port 3000');
    sequelize.sync({ alter: true }).then(() => {
        sessionStore.sync(); // Sync sessions table
    });
    conn();
});

