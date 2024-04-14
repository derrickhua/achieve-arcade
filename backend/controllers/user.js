import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const generateTokens = (userId) => {
    const accessToken = jwt.sign({ _id: userId }, process.env.JWT_SECRET, { expiresIn: '30m' }); // 15 minutes for access token
    const refreshToken = jwt.sign({ _id: userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '60d' }); // 7 days for refresh token
    return { accessToken, refreshToken };
};

export const refreshAccessToken = async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(401).json({ error: "Refresh Token required" });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await User.findById(decoded._id);
        if (!user) {
            return res.status(404).json({ error: "No user found with this id" });
        }

        // Optionally check if the received refreshToken matches the one stored in the database
        if (user.refreshToken && user.refreshToken !== refreshToken) {
            return res.status(403).json({ error: "Invalid refresh token" });
        }
        
        // Issue new tokens
        const tokens = generateTokens(user._id);
        res.json(tokens);
    } catch (error) {
        res.status(403).json({ error: "Invalid or expired refresh token" });
    }
};

export const register = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ error: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        // Generate JWT tokens
        const { accessToken, refreshToken } = generateTokens(newUser._id);


        res.status(201).json({
            message: 'User registered successfully',
            accessToken,
            refreshToken
        });
    } catch (error) {
        res.status(500).json({ error: 'Error registering new user' });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && await bcrypt.compare(password, user.password)) {
            const { accessToken, refreshToken } = generateTokens(user._id);
            res.json({ accessToken, refreshToken });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error logging in user' });
    }
};

export const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching user profile' });
    }
};

export const updateUser = async (req, res) => {
    const { username, email } = req.body;
    try {
        const updatedUser = await User.findByIdAndUpdate(req.user._id, { username, email }, { new: true });
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: 'Error updating user profile' });
    }
};

export const deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.user._id);
        res.send('User deleted successfully');
    } catch (error) {
        res.status(500).json({ error: 'Error deleting user' });
    }
};
