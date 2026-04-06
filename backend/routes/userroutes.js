import express from 'express';
import { createUser, getAllUsers } from '../controller/usercontroller.js';
const route = express();

route.post ('/users',createUser);
route.get('/users/all', getAllUsers)

export default route;