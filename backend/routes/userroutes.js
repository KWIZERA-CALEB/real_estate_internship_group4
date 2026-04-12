import express from 'express';
import { createUser, getAllUsers, login, logout, getCurrentUser } from '../controller/usercontroller.js';
const route = express();

route.post('/users', createUser);
route.get('/users/all', getAllUsers);
route.post('/login', login);
route.post('/logout', logout);
route.get('/current-user', getCurrentUser);

export default route;