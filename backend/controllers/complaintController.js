const Complaint = require('../models/Complaint');
const User = require('../models/User');
const mongoose = require('mongoose');

// Check if database is connected
const isDbConnected = () => {
  return mongoose.connection.readyState === 1;
};

// Get all complaints with filtering and pagination
const getAllComplaints = async (req, res) => {
  try {
    // Check if database is connected
    if (!isDbConnected()) {
      return res.status(503).json({
        success: false,
        message: 'Database connection not available. Please check MongoDB Atlas IP whitelist settings.',
        data: []
      });
    }
    const {
      search = '',
      category = 'All',
      status = 'All',
      priority = 'All',
      sortBy = 'newest',
      page = 1,
      limit = 10
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (category !== 'All') {
      filter.category = category;
    }
    
    if (status !== 'All') {
      filter.status = status;
    }
    
    if (priority !== 'All') {
      filter.priority = priority;
    }

    // Build sort object
    let sort = {};
    switch (sortBy) {
      case 'newest':
        sort = { createdDate: -1 };
        break;
      case 'oldest':
        sort = { createdDate: 1 };
        break;
      case 'support':
        sort = { upvotes: -1, createdDate: -1 };
        break;
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        sort = { priority: -1, createdDate: -1 };
        break;
      default:
        sort = { createdDate: -1 };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const complaints = await Complaint.find(filter)
      .populate('reportedBy', 'name email')
      .populate({
        path: 'department',
        select: 'name',
        options: { strictPopulate: false }
      })
      .populate({
        path: 'branch',
        select: 'name',
        options: { strictPopulate: false }
      })
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Complaint.countDocuments(filter);

    res.json({
      success: true,
      data: complaints,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching complaints:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch complaints',
      error: error.message
    });
  }
};

// Get complaint by ID
const getComplaintById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const complaint = await Complaint.findById(id)
      .populate('reportedBy', 'name email phone')
      .populate({
        path: 'department',
        select: 'name contact',
        options: { strictPopulate: false }
      })
      .populate({
        path: 'branch',
        select: 'name contact',
        options: { strictPopulate: false }
      });

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    res.json({
      success: true,
      data: complaint
    });
  } catch (error) {
    console.error('Error fetching complaint:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch complaint',
      error: error.message
    });
  }
};

// Create new complaint
const createComplaint = async (req, res) => {
  try {
    // Check if database is connected
    if (!isDbConnected()) {
      return res.status(503).json({
        success: false,
        message: 'Database connection not available. Please check MongoDB Atlas IP whitelist settings.'
      });
    }
    const {
      title,
      description,
      category,
      location,
      coordinates,
      priority = 'medium',
      media = []
    } = req.body;

    // Debug logging
    console.log('Received complaint data:', {
      title,
      description,
      category,
      location,
      coordinates,
      priority,
      media
    });

    // Validate required fields
    if (!title || !description || !category) {
      console.log('Validation failed:', { title: !!title, description: !!description, category: !!category });
      return res.status(400).json({
        success: false,
        message: 'Title, description, and category are required'
      });
    }

    // Use coordinates if location is not specified
    const finalLocation = location && location !== 'Location not specified' 
      ? location 
      : coordinates 
        ? `Lat: ${coordinates.latitude}, Lng: ${coordinates.longitude}`
        : 'Location not specified';

    // Get user ID from request (assuming authentication middleware sets req.user)
    const userId = req.user?.id;
    
    // For testing purposes, create a default user if no authentication
    let finalUserId = userId;
    if (!userId) {
      // Create a default test user for demo purposes
      const User = require('../models/User');
      let testUser = await User.findOne({ email: 'test@civicsolve.com' });
      if (!testUser) {
        testUser = new User({
          name: 'Test User',
          phone: '9999999999',
          citizenId: 'TEST123456',
          dob: new Date('1990-01-01'),
          location: 'Test City',
          gender: 'male',
          email: 'test@civicsolve.com'
        });
        await testUser.save();
      }
      finalUserId = testUser._id;
    }

    const complaintData = {
      title,
      description,
      category,
      location: finalLocation,
      coordinates,
      priority,
      media,
      reportedBy: finalUserId
    };

    const complaint = new Complaint(complaintData);
    await complaint.save();

    // Populate the created complaint
    await complaint.populate('reportedBy', 'name email');

    res.status(201).json({
      success: true,
      message: 'Complaint created successfully',
      data: complaint
    });
  } catch (error) {
    console.error('Error creating complaint:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create complaint',
      error: error.message
    });
  }
};

// Update complaint status
const updateComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, workOrderNumber } = req.body;

    const updateData = { status };
    if (workOrderNumber) {
      updateData.workOrderNumber = workOrderNumber;
    }
    if (status === 'resolved' || status === 'closed') {
      updateData.resolvedDate = new Date();
    }

    const complaint = await Complaint.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('reportedBy', 'name email');

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    res.json({
      success: true,
      message: 'Complaint status updated successfully',
      data: complaint
    });
  } catch (error) {
    console.error('Error updating complaint:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update complaint',
      error: error.message
    });
  }
};

// Upvote complaint
const upvoteComplaint = async (req, res) => {
  try {
    const { id } = req.params;

    const complaint = await Complaint.findByIdAndUpdate(
      id,
      { $inc: { upvotes: 1 } },
      { new: true }
    );

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    res.json({
      success: true,
      message: 'Complaint upvoted successfully',
      data: { upvotes: complaint.upvotes }
    });
  } catch (error) {
    console.error('Error upvoting complaint:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upvote complaint',
      error: error.message
    });
  }
};

// Get complaints by user
const getComplaintsByUser = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User authentication required'
      });
    }

    const { page = 1, limit = 10, status } = req.query;
    const filter = { reportedBy: userId };
    
    if (status && status !== 'All') {
      filter.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const complaints = await Complaint.find(filter)
      .populate({
        path: 'department',
        select: 'name',
        options: { strictPopulate: false }
      })
      .populate({
        path: 'branch',
        select: 'name',
        options: { strictPopulate: false }
      })
      .sort({ createdDate: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Complaint.countDocuments(filter);

    res.json({
      success: true,
      data: complaints,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching user complaints:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user complaints',
      error: error.message
    });
  }
};

// Get statistics for dashboard
const getComplaintStats = async (req, res) => {
  try {
    const stats = await Complaint.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          reported: { $sum: { $cond: [{ $eq: ['$status', 'reported'] }, 1, 0] } },
          inProgress: { $sum: { $cond: [{ $eq: ['$status', 'in_progress'] }, 1, 0] } },
          resolved: { $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] } },
          closed: { $sum: { $cond: [{ $eq: ['$status', 'closed'] }, 1, 0] } }
        }
      }
    ]);

    const categoryStats = await Complaint.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        overall: stats[0] || { total: 0, reported: 0, inProgress: 0, resolved: 0, closed: 0 },
        byCategory: categoryStats
      }
    });
  } catch (error) {
    console.error('Error fetching complaint stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch complaint statistics',
      error: error.message
    });
  }
};

module.exports = {
  getAllComplaints,
  getComplaintById,
  createComplaint,
  updateComplaintStatus,
  upvoteComplaint,
  getComplaintsByUser,
  getComplaintStats
};
