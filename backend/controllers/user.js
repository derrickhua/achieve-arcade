import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const generateTokens = (userId) => {
    const accessTokenExpiresIn = 15 * 60 * 1000; // 15 minutes in milliseconds
    const accessToken = jwt.sign({ _id: userId }, process.env.JWT_SECRET, { expiresIn: '15m' }); // Access token expires in 2 minutes
    const refreshToken = jwt.sign({ _id: userId }, process.env.JWT_SECRET, { expiresIn: '60d' }); // Refresh token expires in 60 days

    return {
        accessToken,
        refreshToken,
        accessTokenExpires: Date.now() + accessTokenExpiresIn  
    };
};

/**
 * Refreshes an access token using a refresh token 
 * This function verifies the refresh token, checks its validity against the user's stored token,
 * and if valid, issues a new access token and a new refresh token. The new refresh token replaces the old one
 * to maintain security through token rotation. This function handles various errors such as missing token,
 * invalid token, expired token, or token mismatch by responding with appropriate HTTP status codes.
 *
 * @param {Request} req - The Express request object, which should contain the refresh token cookie.
 * @param {Response} res - The response object used to send back the new access token and set the new refresh token cookie.
 * @param {Function} next - The next middleware function in the stack for error handling.
 */
export const refreshAccessToken = async (req, res, next) => {
    const refreshToken = req.body.refreshToken;
    if (!refreshToken) {
        console.log("No refresh token provided");
        return res.status(401).json({ error: "Refresh Token required" });
    }

    try {
        console.log("Verifying refresh token");
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
        const user = await User.findById(decoded._id);
        if (!user) {
            console.log(`No user found with ID: ${decoded._id}`);
            return res.status(404).json({ error: "No user found with this id" });
        }

        if (user.refreshToken !== refreshToken) {
            console.log("Refresh token does not match user's stored token");
            return res.status(403).json({ error: "Invalid refresh token" });
        }

        const tokens = generateTokens(user._id);

        if (!tokens.accessTokenExpires) {
            console.error("accessTokenExpires calculation failed, received:", tokens.accessTokenExpires);
            return res.status(500).json({ error: "Failed to generate valid token expiration" });
        }

        res.json({
            accessToken: tokens.accessToken,
            accessTokenExpires: tokens.accessTokenExpires  // Ensure this is a valid number
        });
    } catch (error) {
        console.error("Error in refreshAccessToken", error);
        res.status(403).json({ error: "Invalid or expired refresh token" });
    }
};

/**
 * Registers a new user with the provided credentials.
 * If the user already exists or there's an issue with user creation, it throws errors
 * that are handled by centralized error handling middleware to maintain consistency.
 *
 * @param {Request} req - The request object containing username, email, password, and timezone.
 * @param {Response} res - The response object used to send back the registration status.
 * @param {Function} next - The next middleware function in the stack for error handling.
 */
export const register = async (req, res, next) => {
    const { username, email, password, timezone } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ error: 'User already exists' });  // Use res.status().json() for proper error handling
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            timezone
        });

        const tokens = generateTokens(newUser._id);
        newUser.refreshToken = tokens.refreshToken;  // Save the refresh token in the user's record
        await newUser.save();

        res.status(201).json({
            message: 'User registered successfully',
            refreshToken: tokens.refreshToken,
            accessToken: tokens.accessToken,
            accessTokenExpires: tokens.accessTokenExpires
        });
    } catch (error) {
        console.error("Registration error:", error);
        next(error);
    }
};


/**
 * Authenticates a user based on email and password.
 * If authentication is successful, it generates and returns access and refresh tokens.
 * If authentication fails, it throws an error that is handled by centralized error handling middleware.
 *
 * @param {Request} req - The request object, containing user's email and password.
 * @param {Response} res - The response object used to send back the tokens.
 * @param {Function} next - The next middleware function in the stack for error handling.
 */
export const login = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const passwordIsValid = await bcrypt.compare(password, user.password);
        if (!passwordIsValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const tokens = generateTokens(user._id);
        user.refreshToken = tokens.refreshToken;  // Update the refresh token in the user's record
        await user.save();  // Don't forget to save the updated user record

        res.json({
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            accessTokenExpires: tokens.accessTokenExpires
        });
    } catch (error) {
        console.error("Login error:", error);
        next(error);
    }
};

/**
 * Retrieves the user's preferences based on the user's ID stored in the request.
 * Throws an error if there is a problem fetching the user from the database.
 *
 * @param {Request} req - The request object containing the user's authentication information.
 * @param {Response} res - The response object used to send back the user's data.
 * @param {Function} next - The next middleware function in the stack for error handling.
 */
export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).select('preferences');
        if (!user) {
            const error = new Error('User not found');
            error.status = 404;
            throw error;
        }
        res.json(user.preferences);
    } catch (error) {
        next(error);
    }
};

/**
 * Updates the user profile with new data provided in the request body.
 * If there's an error during the update, it throws an error to be handled by the middleware.
 *
 * @param {Request} req - The request object containing the user's data to update.
 * @param {Response} res - The response object used to send back the updated user's data.
 * @param {Function} next - The next middleware function in the stack for error handling.
 */
export const updateUser = async (req, res, next) => {
    const { username, email } = req.body;
    try {
        const updatedUser = await User.findByIdAndUpdate(req.user._id, { username, email }, { new: true });
        if (!updatedUser) {
            const error = new Error('User not found');
            error.status = 404;
            throw error;
        }
        res.json(updatedUser);
    } catch (error) {
        next(error);
    }
};

/**
 * Deletes the user based on the user's ID from the authentication information.
 * If there's an issue during deletion, it throws an error to be handled by the middleware.
 *
 * @param {Request} req - The request object containing the user's authentication information.
 * @param {Response} res - The response object used to confirm the deletion.
 * @param {Function} next - The next middleware function in the stack for error handling.
 */
export const deleteUser = async (req, res, next) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.user._id);
        if (!deletedUser) {
            const error = new Error('User not found');
            error.status = 404;
            throw error;
        }
        res.send('User deleted successfully');
    } catch (error) {
        next(error);
    }
};
