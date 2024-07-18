const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');


const loginController = async (req, res) => {
    const { email, password } = req.body;
    // console.log(req.body);
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'User not Registered.' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid username/email or password' });
        }

        // Generate access token
        const accessToken = jwt.sign({ id: user._id, userType: user.userType }, process.env.ACCESS_SECRET_KEY, { expiresIn: '30s' });

        // Generate refresh token
        const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_SECRET_KEY, { expiresIn: '1y' });

        // Set refresh token in cookie
        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });

        // Set access token in header
        res.setHeader('Authorization', `Bearer ${accessToken}`);

        return res.status(200).json({ message: 'User Logged In', accessToken, refreshToken });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};


module.exports =  loginController;
