import express from 'express';
import { conn, sequelize } from './config/db.js';
import properties from './tables/propertiestable.js';   
import User from './tables/usertable.js';
import './tables/foreignkeys.js'; 

const app = express();


// to allow sending data using json
app.use(express.json())

app.listen(3000, () => {
    console.log('Server is running on port 3000');
    sequelize.sync({ alter: true });
    conn();
});

