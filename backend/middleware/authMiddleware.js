const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * @desc    Middleware to protect routes - Checks if JWT exists and is valid
 */
exports.protect = async (req, res, next) => {
    let token;

    // Check if token exists in the headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header (Format: Bearer <token>)
            token = req.headers.authorization.split(' ')[1];

            // Verify the token using the secret key
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from the database (excluding password) and attach to request object
            req.user = await User.findById(decoded.id).select('-password');

            next();
        } catch (error) {
            console.error(error);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token provided' });
    }
};

/**
 * @desc    Middleware to restrict access based on User Roles (Admin/Student)
 * @param   {...string} roles - Allowed roles for the route
 */
exports.authorize = (...roles) => {
    return (req, res, next) => {
        // Check if the logged-in user's role is included in the allowed roles
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ 
                message: `User role '${req.user?.role}' is not authorized to access this resource` 
            });
        }
        next();
    };
};