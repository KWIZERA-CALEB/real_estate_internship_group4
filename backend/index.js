import express from 'express';
import conn from './config/db.js';
const app = express();

app.listen(3000, () => {
    console.log('Server is running on port 3000');
    conn();
});

