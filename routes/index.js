const router = require('express').Router();
const postRouter = require('./post'); // Assuming post.js exists
const authRouter = require('./auth'); // Assuming auth.js exists

const authMiddleware=require('../middlewares/authMiddleware');

router.use('/notes',authMiddleware, postRouter); // Mount the postRouter at /notes

router.use('/auth', authRouter); // Mount the authRouter at /auth

module.exports = router;
