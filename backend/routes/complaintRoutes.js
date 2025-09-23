const express = require('express');
const router = express.Router();
const complaintController = require('../controllers/complaintController');
const authMiddleware = require('../middleware/authMiddleware');
const { upload, handleUploadError } = require('../middleware/uploadMiddleware');

// Public routes (no authentication required)
router.get('/', complaintController.getAllComplaints);
router.get('/stats', complaintController.getComplaintStats);
router.get('/:id', complaintController.getComplaintById);
router.post('/', upload.array('media', 10), handleUploadError, complaintController.createComplaint);

// Protected routes (authentication required)
router.use(authMiddleware);
router.patch('/:id/status', complaintController.updateComplaintStatus);
router.post('/:id/upvote', complaintController.upvoteComplaint);
router.get('/my-complaints', complaintController.getComplaintsByUser);

module.exports = router;
