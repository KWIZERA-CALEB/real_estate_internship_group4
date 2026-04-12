import properties from "../tables/propertiestable.js";
import { Op } from "sequelize";

async function getAllProperties(req, res) {
  try {
    const allProperties = await properties.findAll();
    res.status(200).json({ properties: allProperties });
  } catch (error) {
    console.error("Failed to load properties", error);
    res.status(500).json({ error: "Failed to load properties" });
  }
}

async function createProperty(req, res) {
  try {
    const { title, price, description, location, bedrooms, bathrooms, area, image } = req.body;
    const userId = req.session.userId;

    console.log('Create property attempt:', { title, price, description, location, userId });

    if (!userId) {
      console.log('No user ID in session');
      return res.status(401).json({ error: 'Not authenticated' });
    }

    if (!title || !price || !description || !location) {
      console.log('Missing required fields:', { title, price, description, location });
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newProperty = await properties.create({
      title: title,
      price: parseFloat(price),
      description: description,
      location: location,
      bedrooms: parseInt(bedrooms) || 0,
      bathrooms: parseInt(bathrooms) || 0,
      area: parseFloat(area) || 0,
      image: image || '',
      user_id: userId
    });

    console.log('Property created successfully:', newProperty.id);
    res.status(201).json({
      message: 'Property created successfully',
      property: newProperty
    });
  } catch (error) {
    console.error('Failed to create property:', error.message, error);
    res.status(500).json({ error: 'Failed to create property: ' + error.message });
  }
}

async function deleteProperty(req, res) {
  try {
    const { id } = req.params;
    const userId = req.session.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const property = await properties.findOne({
      where: { id: id, user_id: userId }
    });

    if (!property) {
      return res.status(404).json({ error: 'Property not found or unauthorized' });
    }

    await property.destroy();
    res.status(200).json({ message: 'Property deleted successfully' });
  } catch (error) {
    console.error('Failed to delete property:', error);
    res.status(500).json({ error: 'Failed to delete property' });
  }
}

async function searchPropertyByTitle(req, res) {
  try {
    const { title } = req.query;

    if (!title) {
      return res.status(400).json({ error: 'Please provide a property title to search' });
    }

    const matchedProperties = await properties.findAll({
      where: {
        title: {
          [Op.like]: `%${title}%`
        }
      }
    });

    if (matchedProperties.length === 0) {
      return res.status(404).json({ error: 'No properties found with that title' });
    }

    res.status(200).json({ properties: matchedProperties });
  } catch (error) {
    console.error('Failed to search properties:', error);
    res.status(500).json({ error: 'Failed to search properties' });
  }
}

async function getPropertyById(req, res) {
  try {
    const { id } = req.params;

    const property = await properties.findByPk(id);

    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    res.status(200).json({ property: property });
  } catch (error) {
    console.error('Failed to get property:', error);
    res.status(500).json({ error: 'Failed to get property' });
  }
}

export {
  getAllProperties,
  createProperty,
  deleteProperty,
  getPropertyById,
  searchPropertyByTitle
};
