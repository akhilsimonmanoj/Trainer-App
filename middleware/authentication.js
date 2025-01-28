const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticateUser = (req, res, next) => {
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1]; // Extract token from 'Bearer <token>'
    let tokenData;

    try {
        tokenData = jwt.verify(token, process.env.JWT_SECRET);
        User.findById(tokenData._id)
            .then((user) => {
                if (!user) {
                    return res.status(401).json({ message: 'Unauthorized: User not found' });
                }
                req.user = user; // Attach user to the request object
                next(); // Proceed to the next middleware or route handler
            })
            .catch((err) => {
                res.status(500).json({ message: 'Error fetching user', error: err.message });
            });
    } catch (error) {
        res.status(401).json({ message: 'Invalid or expired token', error: error.message });
    }
};

module.exports = { authenticateUser };
