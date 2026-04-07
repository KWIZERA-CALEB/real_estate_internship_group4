import proprties from "../tables/usertable.js";

const createProperty = async (req, res) => {

    // receive our own data from request body
    const { title, price, description, image, location } = req.body


    console.log('data sent from frontend', title)
    console.log('data sent from frontend', price)
    console.log('data sent from frontend', description)
    console.log('data sent from frontend', image)
    console.log('data sent from frontend', location)

    try {
        // create property

        const newProperty = await Property.create({
            title: title,
            price: price,
            description: description,
            image: image,
            location: location
        })

        // send message that we created a property
        res.status(201).json({
            message: "Property created"
        })
    } catch(error) {
        console.log('failed to add property', error)
        res.status(500).json({ error: 'Failed to create property' })
    }
}


async function getAllProperties(req, res) {
    try {
        const properties = await Property.findAll()

        res.status(200).json({
            properties: properties
        })
    } catch(error) {
        console.log('failed to get all properties', error)
    }   
}


export {
    createProperty,
    getAllProperties
}