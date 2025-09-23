const User = require('../models/User');
const Complaint = require('../models/Complaint');

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User authentication required'
      });
    }

    const user = await User.findById(userId).select('-__v');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user profile',
      error: error.message
    });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User authentication required'
      });
    }

    const { name, phone, location, email } = req.body;
    const updateData = {};

    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (location) updateData.location = location;
    if (email) updateData.email = email;

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-__v');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user profile',
      error: error.message
    });
  }
};

// Register new user
const registerUser = async (req, res) => {
  try {
    const { name, phone, citizenId, dob, location, gender, email } = req.body;

    // Validate required fields
    if (!name || !phone || !citizenId || !dob || !location || !gender || !email) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { phone }, { citizenId }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email, phone, or citizen ID already exists'
      });
    }

    const user = new User({
      name,
      phone,
      citizenId,
      dob: new Date(dob),
      location,
      gender,
      email
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone
      }
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to register user',
      error: error.message
    });
  }
};

// Get user dashboard data
const getUserDashboard = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User authentication required'
      });
    }

    // Get user's complaint statistics
    const complaintStats = await Complaint.aggregate([
      { $match: { reportedBy: userId } },
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

    // Get recent complaints
    const recentComplaints = await Complaint.find({ reportedBy: userId })
      .populate('department', 'name')
      .sort({ createdDate: -1 })
      .limit(5);

    // Get user profile
    const user = await User.findById(userId).select('name email location');

    res.json({
      success: true,
      data: {
        user,
        stats: complaintStats[0] || { total: 0, reported: 0, inProgress: 0, resolved: 0, closed: 0 },
        recentComplaints
      }
    });
  } catch (error) {
    console.error('Error fetching user dashboard:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user dashboard',
      error: error.message
    });
  }
};

// Search users (for admin purposes)
const searchUsers = async (req, res) => {
  try {
    const { search = '', page = 1, limit = 10 } = req.query;

    const filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { citizenId: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const users = await User.find(filter)
      .select('name email phone citizenId location createdDate')
      .sort({ createdDate: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(filter);

    res.json({
      success: true,
      data: users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search users',
      error: error.message
    });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  registerUser,
  getUserDashboard,
  searchUsers
};
