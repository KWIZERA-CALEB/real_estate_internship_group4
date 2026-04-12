import express from "express";
import {
  getAllProperties,
  createProperty,
  deleteProperty,
  getPropertyById,
  searchPropertyByTitle
} from "../controller/propertycontroller.js";

const route = express.Router();

// More specific routes first
route.get("/properties/all", getAllProperties);
route.get("/properties/search", searchPropertyByTitle);

// Generic routes last
route.get("/properties/:id", getPropertyById);
route.post("/properties", createProperty);
route.delete("/properties/:id", deleteProperty);

export default route;
