import User from "../tables/usertable.js";
import jwt from 'jsonwebtoken';

// Generate JWT token
const generateToken = (userId) => {
    return jwt.sign({ userId, id: userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

// Register User
const registerUser = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({
                error: 'Name, email, and password are required'
            });
        }

        // Check if user exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({
                error: 'Email already registered'
            });
        }

        // Create user
        const newUser = await User.create({
            name,
            email,
            password,
            phone
        });

        const token = generateToken(newUser.id);

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                phone: newUser.phone
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Failed to register user' });
    }
};

// Login User
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                error: 'Email and password are required'
            });
        }

        // Find user
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({
                error: 'Invalid credentials'
            });
        }

        // Compare password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                error: 'Invalid credentials'
            });
        }

        const token = generateToken(user.id);

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                profileImage: user.profileImage
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Failed to login' });
    }
};

// Get User Profile
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.userId, {
            attributes: { exclude: ['password'] }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({
            user
        });
    } catch (error) {
        console.error('Profile fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
};

// Update User Profile
const updateUserProfile = async (req, res) => {
    try {
        const { name, phone, bio, profileImage } = req.body;

        const user = await User.findByPk(req.user.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Update fields
        if (name) user.name = name;
        if (phone) user.phone = phone;
        if (bio) user.bio = bio;
        if (profileImage) user.profileImage = profileImage;

        await user.save();

        res.status(200).json({
            message: 'Profile updated successfully',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                bio: user.bio,
                profileImage: user.profileImage
            }
        });
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
};

// Get All Users (for admin/demo purposes)
const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] }
        });
        res.status(200).json({ users });
    } catch (error) {
        console.error('Failed to load users', error);
        res.status(500).json({ error: 'Failed to load users' });
    }
};

// Create User (deprecated - use registerUser instead)
const createUser = async (req, res) => {
    return registerUser(req, res);
};

// Get User (deprecated - use getUserProfile instead)
const getUser = async (req, res) => {
    return getAllUsers(req, res);
};

export {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    getAllUsers,
    createUser,
    getUser
};