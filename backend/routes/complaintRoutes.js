const express = require('express');
const router = express.Router();
const complaintController = require('../controllers/complaintController');
const authMiddleware = require('../middleware/authMiddleware');
const { upload, handleUploadError } = require('../middleware/uploadMiddleware');

// Public routes (no authentication required)
router.get('/', complaintController.getAllComplaints);
router.get('/stats', complaintController.getComplaintStats);
router.get('/my-complaints', complaintController.getComplaintsByUser);
router.post('/', upload.array('media', 10), handleUploadError, complaintController.createComplaint);

// Protected routes (authentication required)
router.use(authMiddleware);
router.get('/:id', complaintController.getComplaintById);
router.patch('/:id/status', complaintController.updateComplaintStatus);
router.post('/:id/upvote', complaintController.upvoteComplaint);

module.exports = router;
