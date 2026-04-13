import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { conn, sequelize } from './config/db.js';
import properties from './tables/propertiestable.js';   
import User from './tables/usertable.js';
import './tables/foreignkeys.js'; 
import userroutes from './routes/userroutes.js';
import propertiesroutes from './routes/propertiesroutes.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use("/api", userroutes);
app.use("/api", propertiesroutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'Server is running' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    conn();
});

