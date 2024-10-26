const User = require('../models/User');

const isAdmin = async (req, res, next) => {
    try {
        console.log('isAdmin middleware - req.user:', req.user);
        if (!req.user || !req.user._id) {
            console.log('isAdmin middleware - No user ID found in request');
            return res.status(401).json({ error: 'No user ID found in request' });
        }

        const user = await User.findById(req.user._id);
        console.log('isAdmin middleware - found user:', user);

        if (!user) {
            console.log('isAdmin middleware - User not found in database');
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.role !== 'admin') {
            console.log('isAdmin middleware - User is not an admin');
            return res.status(403).json({ error: 'Access denied. Admin rights required.' });
        }

        console.log('isAdmin middleware - User is admin, proceeding');
        next();
    } catch (error) {
        console.error('isAdmin middleware error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = isAdmin;
