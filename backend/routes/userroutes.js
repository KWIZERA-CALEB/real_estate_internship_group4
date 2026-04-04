import express from 'express';
import { createUser } from '../controller/usercontroller.js';
const route = express();

route.post ('/users',createUser);

export default route;