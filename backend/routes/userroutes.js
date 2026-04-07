import express from "express";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  loginUser,
  updateUser,
} from "../controller/usercontroller.js";
import { requireAuth } from "../middleware/auth.js";
const route = express();

route.post("/users", createUser);
route.get("/users/all", requireAuth, getAllUsers);
route.post("/users/login", loginUser);
route.put("/:id", requireAuth, updateUser);
route.delete("/:id", requireAuth, deleteUser);
route.get("/:id", requireAuth, getUserById);

export default route;
