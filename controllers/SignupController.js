const User = require('../models/User');
const bcrypt = require('bcrypt');


// signup controller
const signup = async (req, res) => {
    try {
       
        const { name, userType,phone, email, password } = req.body;

        // Check if required fields are provided
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if password length is adequate
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password length should be more than 6.' });
        }

        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create and save new user
        const newUser = new User({ email, name,phone, userType, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'User Registered', user: newUser });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error occurred' });
    }
};

module.exports = signup;
