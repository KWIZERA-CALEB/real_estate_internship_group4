import properties from "../tables/propertiestable.js";
import User from "../tables/usertable.js";

// Get All Properties
async function getAllProperties(req, res) {
  try {
    const allProperties = await properties.findAll({
      include: [{
        model: User,
        attributes: ['id', 'name', 'email', 'phone', 'profileImage']
      }]
    });
    res.status(200).json({ properties: allProperties });
  } catch (error) {
    console.error("Failed to load properties", error);
    res.status(500).json({ error: "Failed to load properties" });
  }
}

// Get Property By ID
async function getPropertyById(req, res) {
  const { id } = req.params;

  try {
    const property = await properties.findByPk(id, {
      include: [{
        model: User,
        attributes: ['id', 'name', 'email', 'phone', 'profileImage']
      }]
    });
    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    res.status(200).json({ property });
  } catch (error) {
    console.error("Failed to load property", error);
    res.status(500).json({ error: "Failed to load property" });
  }
}

// Get User Properties
async function getUserProperties(req, res) {
  const { userId } = req.params;

  try {
    const userProperties = await properties.findAll({
      where: { user_id: userId },
      include: [{
        model: User,
        attributes: ['id', 'name', 'email', 'phone', 'profileImage']
      }]
    });

    res.status(200).json({ properties: userProperties });
  } catch (error) {
    console.error("Failed to load user properties", error);
    res.status(500).json({ error: "Failed to load user properties" });
  }
}

// Create Property
async function createProperty(req, res) {
  const { title, price, description, image, location, bedrooms, bathrooms, area, propertyType } = req.body;
  const userId = req.user.userId;

  try {
    // Validation
    if (!title || !price || !description || !image) {
      return res.status(400).json({
        error: 'Title, price, description, and image are required'
      });
    }

    const newProperty = await properties.create({
      title,
      price,
      description,
      image,
      location,
      bedrooms: bedrooms || 1,
      bathrooms: bathrooms || 1,
      area,
      propertyType: propertyType || 'house',
      user_id: userId
    });

    res.status(201).json({
      message: 'Property created successfully',
      property: newProperty
    });
  } catch (error) {
    console.error('Failed to create property', error);
    res.status(500).json({ error: 'Failed to create property' });
  }
}

// Update Property
async function updateProperty(req, res) {
  const { id } = req.params;
  const userId = req.user.userId;
  const { title, price, description, image, location, bedrooms, bathrooms, area, propertyType, status } = req.body;

  try {
    const property = await properties.findByPk(id);
    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    // Check if user owns the property
    if (property.user_id !== userId) {
      return res.status(403).json({ error: "Not authorized to update this property" });
    }

    // Update fields
    if (title) property.title = title;
    if (price) property.price = price;
    if (description) property.description = description;
    if (image) property.image = image;
    if (location) property.location = location;
    if (bedrooms !== undefined) property.bedrooms = bedrooms;
    if (bathrooms !== undefined) property.bathrooms = bathrooms;
    if (area !== undefined) property.area = area;
    if (propertyType) property.propertyType = propertyType;
    if (status) property.status = status;

    await property.save();

    res.status(200).json({
      message: 'Property updated successfully',
      property
    });
  } catch (error) {
    console.error('Failed to update property', error);
    res.status(500).json({ error: 'Failed to update property' });
  }
}

// Delete Property
async function deletePropertyById(req, res) {
  const { id } = req.params;
  const userId = req.user.userId;

  try {
    const property = await properties.findByPk(id);
    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    // Check if user owns the property
    if (property.user_id !== userId) {
      return res.status(403).json({ error: "Not authorized to delete this property" });
    }

    await property.destroy();
    res.status(200).json({ message: "Property deleted successfully" });
  } catch (error) {
    console.error("Failed to delete property", error);
    res.status(500).json({ error: "Failed to delete property" });
  }
}

export {
  getAllProperties,
  getPropertyById,
  getUserProperties,
  createProperty,
  updateProperty,
  deletePropertyById,
};
