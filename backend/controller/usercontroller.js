import User from "../tables/usertable.js";
import bcrypt from 'bcryptjs';

const createUser = async (req, res) => {

    // receive our own data from request body
    const { name, email, password } = req.body


    console.log('data sent from frontend', name)
    console.log('data sent from frontend', password)
    console.log('data sent from frontend', email)

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // create user
        const newuser = await User.create({
            name: name,
            email: email,
            password: hashedPassword
        })

        // send message that we created a user
        res.status(201).json({
            message: "User created successfully"
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

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ where: { email: email } });

        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        // Set session
        req.session.userId = user.id;
        req.session.userName = user.name;
        req.session.userEmail = user.email;

        res.status(200).json({
            message: 'Login successful',
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.log('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
};

const logout = async (req, res) => {
    try {
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({ error: 'Logout failed' });
            }
            res.clearCookie('connect.sid');
            res.status(200).json({ message: 'Logout successful' });
        });
    } catch (error) {
        console.log('Logout error:', error);
        res.status(500).json({ error: 'Logout failed' });
    }
};

const getCurrentUser = async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        const user = await User.findByPk(req.session.userId);
        res.status(200).json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.log('Get current user error:', error);
        res.status(500).json({ error: 'Failed to get user' });
    }
};

export {
    createUser,
    getAllUsers,
    login,
    logout,
    getCurrentUser
}