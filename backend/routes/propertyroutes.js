import express from "express";
import {
  getAllProperties,
  getPropertyById,
  deletePropertyById,
  createProperty,
  updatePropertyById,
} from "../controller/propertycontroller.js";
import { requireAuth } from "../middleware/auth.js";

const route = express.Router();

route.get("/properties/all", getAllProperties);
route.get("/properties/:id", getPropertyById);
route.delete("/properties/:id", requireAuth, deletePropertyById);
route.post("/properties", requireAuth, createProperty);
route.put("/properties/:id", requireAuth, updatePropertyById);

export default route;
