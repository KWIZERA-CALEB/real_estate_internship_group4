import express from "express";
import {
  getAllProperties,
} from "../controller/propertycontroller.js";

const route = express.Router();

route.get("/properties/all", getAllProperties);

export default route;
