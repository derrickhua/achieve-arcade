import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const generateTokens = (userId) => {
    const accessToken = jwt.sign({ _id: userId }, process.env.JWT_SECRET, { expiresIn: '30m' }); 
    const refreshToken = jwt.sign({ _id: userId }, process.env.JWT_SECRET, { expiresIn: '60d' }); 
    return { accessToken, refreshToken };
};

export const refreshAccessToken = async (req, res, next) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        const error = new Error("Refresh Token required");
        error.status = 401; // Unauthorized
        return next(error);
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
        const user = await User.findById(decoded._id);
        if (!user) {
            const error = new Error("No user found with this id");
            error.status = 404; // Not Found
            throw error;
        }

        // Optionally check if the received refreshToken matches the one stored in the database
        if (user.refreshToken && user.refreshToken !== refreshToken) {
            const error = new Error("Invalid refresh token");
            error.status = 403; // Forbidden
            throw error;
        }

        // Issue new tokens
        const tokens = generateTokens(user._id);
        console.log('New tokens:', tokens);
        res.json(tokens);
    } catch (error) {
        if (!error.status) {
            error.status = 403; // Invalid or expired refresh token
            error.message = "Invalid or expired refresh token";
        }
        next(error);
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
            const error = new Error('User already exists');
            error.status = 409; // Conflict
            throw error;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            timezone
        });
        await newUser.save();

        // Generate JWT tokens
        const { accessToken, refreshToken } = generateTokens(newUser._id);

        res.status(201).json({
            message: 'User registered successfully',
            accessToken,
            refreshToken
        });
    } catch (error) {
        if (!error.status) {
            error.status = 500; // Internal Server Error
            error.message = 'Error registering new user';
        }
        next(error); // Pass the error to the error handling middleware
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
            const error = new Error('Invalid credentials');
            error.status = 401;
            throw error;
        }

        const passwordIsValid = await bcrypt.compare(password, user.password);
        if (!passwordIsValid) {
            const error = new Error('Invalid credentials');
            error.status = 401;
            throw error;
        }

        const { accessToken, refreshToken } = generateTokens(user._id);
        res.json({ accessToken, refreshToken });
    } catch (error) {
        if (!error.status) {
            error.status = 500;
            error.message = 'Error logging in user';
        }
        next(error);
    }
};

/**
 * Retrieves the user profile based on the user's ID stored in the request.
 * Throws an error if there is a problem fetching the user from the database.
 *
 * @param {Request} req - The request object containing the user's authentication information.
 * @param {Response} res - The response object used to send back the user's data.
 * @param {Function} next - The next middleware function in the stack for error handling.
 */
export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            const error = new Error('User not found');
            error.status = 404;
            throw error;
        }
        res.json(user);
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
