import express from 'express';
import {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    getAllUsers,
    createUser,
    getUser
} from '../controller/usercontroller.js';
import authMiddleware from '../middleware/auth.js';

const route = express.Router();

// Auth routes
route.post('/auth/register', registerUser);
route.post('/auth/login', loginUser);
route.get('/auth/profile', authMiddleware, getUserProfile);
route.put('/auth/profile', authMiddleware, updateUserProfile);

// Legacy routes
route.post('/users', createUser);
route.get('/users/all', getAllUsers);

export default route;