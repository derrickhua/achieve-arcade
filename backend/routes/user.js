import express from 'express';
import { body } from 'express-validator';
import { register, login, getUserPreferences, getUser, updateUser, deleteUser, refreshAccessToken, getUserCoins } from '../controllers/user.js';
import authenticate from '../middleware/authenticate.js';

const router = express.Router();

router.post('/register', [
    body('username').notEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Must be a valid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    register
]);

router.post('/login', login);
router.post('/refresh-token', refreshAccessToken);
router.get('/profile/preferences', authenticate, getUserPreferences);
router.get('/profile', authenticate, getUser); // Added the new getUser route
router.put('/update', authenticate, updateUser);
router.delete('/delete', authenticate, deleteUser);
router.get('/coins', authenticate, getUserCoins); // Ensure this route is correct

export default router;
