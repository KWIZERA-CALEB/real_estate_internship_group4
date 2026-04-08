import express from "express";
import {
  getAllProperties,
  getPropertyById,
  deletePropertyById,
} from "../controller/propertycontroller.js";

const route = express.Router();

route.get("/properties/all", getAllProperties);
route.get("/properties/:id", getPropertyById);
route.delete("/properties/:id", deletePropertyById);

export default route;
