import properties from "../tables/propertiestable.js";

async function getAllProperties(req, res) {
  try {
    const allProperties = await properties.findAll();
    res.status(200).json({ properties: allProperties });
  } catch (error) {
    console.error("Failed to load properties", error);
    res.status(500).json({ error: "Failed to load properties" });
  }
}

async function getPropertyById(req, res) {
  const { id } = req.params;

  try {
    const property = await properties.findByPk(id);
    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    res.status(200).json({ property });
  } catch (error) {
    console.error("Failed to load property", error);
    res.status(500).json({ error: "Failed to load property" });
  }
}

async function deletePropertyById(req, res) {
  const { id } = req.params;

  try {
    const property = await properties.findByPk(id);
    if (!property) {
      return res.status(404).json({ error: "Property not found" });
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
  deletePropertyById,
};
