import Suggestion from '../models/suggestion.js';
import User from '../models/user.js';

/**
 * Creates a new suggestion.
 * This function validates the request body, fetches the user's email, creates a new suggestion, and saves it to the database.
 * If successful, it responds with a success message. If there's an error, it responds with the error message.
 *
 * @param {Request} req - The Express request object, which contains the suggestion details.
 * @param {Response} res - The response object used to send back the status and message.
 * @param {Function} next - The next middleware function in the stack for error handling.
 */
export const createSuggestion = async (req, res, next) => {
    const { subject, description } = req.body;

    if (!subject || !description) {
        return res.status(400).json({ error: "Subject and description are required" });
    }

    try {
        const user = await User.findById(req.user._id).select('email');
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const newSuggestion = new Suggestion({
            email: user.email,
            subject,
            description
        });

        await newSuggestion.save();
        res.status(201).json({ message: 'Suggestion submitted successfully' });
    } catch (error) {
        console.error("Error creating suggestion:", error);
        next(error);
    }
};

/**
 * Retrieves all suggestions.
 * This function fetches all suggestions from the database and returns them in the response.
 * If there's an error, it responds with the error message.
 *
 * @param {Request} req - The Express request object.
 * @param {Response} res - The response object used to send back the suggestions.
 * @param {Function} next - The next middleware function in the stack for error handling.
 */
export const getSuggestions = async (req, res, next) => {
    try {
        const suggestions = await Suggestion.find();
        res.status(200).json(suggestions);
    } catch (error) {
        console.error("Error fetching suggestions:", error);
        next(error);
    }
};
