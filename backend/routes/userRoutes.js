const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// Public routes
router.post('/register', userController.registerUser);

// Protected routes
router.use(authMiddleware);

router.get('/profile', userController.getUserProfile);
router.patch('/profile', userController.updateUserProfile);
router.get('/dashboard', userController.getUserDashboard);
router.get('/search', userController.searchUsers);

module.exports = router;
