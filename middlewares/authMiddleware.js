const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Make sure you have the User model to verify the refresh token

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const refreshToken = req.cookies.refreshToken; // Assuming the refresh token is stored in cookies

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authorization token required' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_SECRET_KEY);
        req.user = decoded; // Add the decoded user info to the request object

        // Extract and log user id and userType from the decoded token
        const { id, userType } = decoded;
        //console.log(`User ID: ${id}, User Type: ${userType}`);

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError' && refreshToken) {
            try {
                const refreshDecoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY);
                const user = await User.findById(refreshDecoded.id);

                if (!user) {
                    return res.status(401).json({ message: 'User not found' });
                }

                // Generate new access token
                const newAccessToken = jwt.sign({ id: user._id, userType: user.userType }, process.env.ACCESS_SECRET_KEY, { expiresIn: '1h' });

                //console.log('new access token created by the help of refreshToken');

                // Set new access token in header
                res.setHeader('Authorization', `Bearer ${newAccessToken}`);

                // Attach new token to req.user and continue
                req.user = jwt.verify(newAccessToken, process.env.ACCESS_SECRET_KEY);
                next();
            } catch (err) {
                console.error(err);
                return res.status(401).json({ message: 'Invalid refresh token' });
            }
        } else {
            console.error(error);
            return res.status(401).json({ message: 'Invalid or expired token' });
        }
    }
};

module.exports = authMiddleware;
