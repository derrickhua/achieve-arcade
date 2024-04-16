import jwt from 'jsonwebtoken';

const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.sendStatus(401); // No token provided
    }

    const token = authHeader.split(' ')[1]; // Assume Bearer <token>
    if (!token) {
        return res.sendStatus(401); // No token provided
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.log(err)
            return res.sendStatus(403); // Invalid token
        }
        req.user = decoded;
        next();
    });
};

export default authenticate;
