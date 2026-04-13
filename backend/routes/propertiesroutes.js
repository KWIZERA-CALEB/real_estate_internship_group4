import express from "express";
import {
  getAllProperties,
  getPropertyById,
  getUserProperties,
  createProperty,
  updateProperty,
  deletePropertyById,
} from "../controller/propertiescontroller.js";
import authMiddleware from "../middleware/auth.js";

const route = express.Router();

// Public routes
route.get("/properties/all", getAllProperties);
route.get("/properties/:id", getPropertyById);

// Protected routes (require authentication)
route.post("/properties", authMiddleware, createProperty);
route.put("/properties/:id", authMiddleware, updateProperty);
route.delete("/properties/:id", authMiddleware, deletePropertyById);
route.get("/properties/user/:userId", getUserProperties);

export default route;
