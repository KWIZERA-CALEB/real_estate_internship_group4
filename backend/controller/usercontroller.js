import User from "../tables/usertable.js";

const createUser = async (req, res) => {

    // receive our own data from request body
    const { name, email, password } = req.body


    console.log('data sent from frontend', name)
    console.log('data sent from frontend', password)
    console.log('data sent from frontend', email)

    try {
        // create user

        const newuser = await User.create({
            name: name,
            email: email,
            password: password
        })

        // send message that we created a user
        res.status(201).json({
            message: "User created"
        })
    } catch(error) {
        console.log('failed to add user', error)
        res.status(500).json({ error: 'Failed to create user' })
    }
}


async function getAllUsers(req, res) {
    try {
        const users = await User.findAll()

        res.status(200).json({
            users: users
        })
    } catch(error) {
        console.log('failed to get all users')
    }   
}


export {
    createUser,
    getAllUsers
}