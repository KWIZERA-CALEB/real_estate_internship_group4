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

export {
  getAllProperties,
};
