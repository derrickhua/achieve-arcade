import express from 'express';
import { body } from 'express-validator';
import { register, login, getUser, updateUser, deleteUser } from '../controllers/user.js';
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
router.get('/profile', authenticate, getUser);
router.put('/update', authenticate, updateUser);
router.delete('/delete', authenticate, deleteUser);

export default router;
