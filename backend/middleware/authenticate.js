import jwt from 'jsonwebtoken';

const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        console.log("Authorization header is missing");
        return res.sendStatus(401); // No token provided
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') { // Check if the format is "Bearer <token>"
        console.log("Authorization header format is not 'Bearer <token>'");
        return res.sendStatus(401); // Incorrect or malformed token
    }

    const token = parts[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.log(`JWT Error: ${err.message}`);
            return res.sendStatus(403); // Invalid token
        }
        req.user = decoded;
        req.refreshToken = decoded.refreshToken; // Extract the refreshToken from the decoded JWT token
        next();
    });
};

export default authenticate;
