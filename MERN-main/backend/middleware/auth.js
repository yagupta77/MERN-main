const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Get token from header
    console.log('Token received:', token); // Log the token

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
        req.user = decoded; // Attach user info to the request
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error('Token verification error:', error); // Log the error
        return res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = authMiddleware; // Export the middleware