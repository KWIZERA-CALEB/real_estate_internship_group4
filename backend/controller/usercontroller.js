import User from "../tables/userstable.js";

const createUser = async (req, res) => {

    // receive our own data from request body
    const { name, email, password } = req.body


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
        console.log('failed to add user')
    }
}

export {
    createUser
}