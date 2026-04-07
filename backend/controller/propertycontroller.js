import User from "../tables/usertable.js";
import properties from "../tables/propertiestable.js";

async function getAllProperties(req, res) {
  try {
    const allProperties = await properties.findAll({
      include: [{ model: User, attributes: ["id", "name", "email"] }],
    });
    res.status(200).json({ properties: allProperties });
  } catch (error) {
    console.error("Failed to load properties", error);
    res.status(500).json({ error: "Failed to load properties" });
  }
}

async function getPropertyById(req, res) {
  const { id } = req.params;
  try {
    const property = await properties.findByPk(id, {
      include: [{ model: User, attributes: ["id", "name", "email"] }],
    });
    if (!property) return res.status(404).json({ error: "Property not found" });
    res.status(200).json({ property });
  } catch (error) {
    console.error("Failed to load property", error);
    res.status(500).json({ error: "Failed to load property" });
  }
}

async function createProperty(req, res) {
  const { title, price, description, image, location } = req.body;
  const user_id = req.user.id;

  if (!title || !price || !description || !image) {
    return res
      .status(400)
      .json({ error: "title, price, description and image are required" });
  }

  try {
    const newProperty = await properties.create({
      title,
      price,
      description,
      image,
      location,
      user_id,
    });
    res
      .status(201)
      .json({ message: "Property created", property: newProperty });
  } catch (error) {
    console.error("Failed to create property", error);
    res.status(500).json({ error: "Failed to create property" });
  }
}

async function updatePropertyById(req, res) {
  const { id } = req.params;
  const { title, price, description, image, location } = req.body;

  try {
    const property = await properties.findByPk(id);
    if (!property) return res.status(404).json({ error: "Property not found" });

    if (property.user_id !== req.user.id) {
      return res
        .status(403)
        .json({ error: "Not authorized to update this property" });
    }

    await property.update({ title, price, description, image, location });
    res.status(200).json({ message: "Property updated", property });
  } catch (error) {
    console.error("Failed to update property", error);
    res.status(500).json({ error: "Failed to update property" });
  }
}

async function deletePropertyById(req, res) {
  const { id } = req.params;
  console.log("Delete request for property ID:", id);
  console.log("Delete request for property ID:", req.user.id);
  try {
    const property = await properties.findByPk(id);
    if (!property) return res.status(404).json({ error: "Property not found" });

    if (property.user_id !== req.user.id) {
      return res
        .status(403)
        .json({ error: "Not authorized to delete this property" });
    }

    await property.destroy();
    res.status(200).json({ message: "Property deleted" });
  } catch (error) {
    console.error("Failed to delete property", error);
    res.status(500).json({ error: "Failed to delete property" });
  }
}

export {
  getAllProperties,
  getPropertyById,
  createProperty,
  updatePropertyById,
  deletePropertyById,
};
