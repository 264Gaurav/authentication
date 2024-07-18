const User = require('../models/User');
const jwt = require('jsonwebtoken');


// Refresh Token function to generate Access Token 
const refreshTokenController = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies || !cookies.refreshToken) {
        return res.status(403).json({ message: 'Unauthorized, Refresh Token Required' });
    }
    const refreshToken = cookies.refreshToken;

    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY);

        if (!decoded) {
            return res.status(401).json({ message: 'Invalid refresh token' });
        }

        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate access token
        const accessToken = jwt.sign({ id: user._id, userType: user.userType }, process.env.ACCESS_SECRET_KEY, { expiresIn: '30s' });

        // Set access token in header
        res.setHeader('Authorization', `Bearer ${accessToken}`);

        return res.status(200).json({ accessToken });
    } catch (error) {
        console.error(error);
        return res.status(401).json({ message: 'Invalid refresh token' });
    }
}


module.exports=refreshTokenController;