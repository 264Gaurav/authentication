const express = require('express');
const router = express.Router();
const signupController = require('../controllers/SignupController');
const loginController = require('../controllers/LoginController');
const refreshTokenController=require('../controllers/RefreshTokenController');
const validateTokenContrller=require('../controllers/validateTokenController');

// Login route
router.post('/login', loginController);

// Signup route
router.post('/signup', signupController);

// Refresh token route  
router.post('/refresh', refreshTokenController);

// validate-token route 
router.get('/validate-token' , validateTokenContrller);


module.exports = router;
