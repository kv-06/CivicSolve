const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  complaintId: {
    type: String,
    unique: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  coordinates: {
    latitude: {
      type: Number,
      required: true
    },
    longitude: {
      type: Number,
      required: true
    }
  },
  status: {
    type: String,
    enum: ['reported', 'in_progress', 'resolved', 'closed'],
    default: 'reported'
  },
  priority: {
    type: String,
    enum: ['high', 'medium', 'low'],
    default: 'medium'
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Road & Transport',
      'Water & Sanitation',
      'Electricity',
      'Garbage & Waste',
      'Public Safety',
      'Health & Medical',
      'Education',
      'Others'
    ]
  },
  department: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Department' 
  },
  branch: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Branch' 
  },
  reportedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },
  createdDate: {
    type: Date,
    default: Date.now
  },
  resolvedDate: {
    type: Date
  },
  workOrderNumber: {
    type: String,
    trim: true
  },
  images: [{
    type: String,
    trim: true
  }],
  upvotes: {
    type: Number,
    default: 0
  },
  comments: {
    type: Number,
    default: 0
  },
  media: [{
    type: {
      type: String,
      enum: ['image', 'video', 'audio', 'document']
    },
    uri: String,
    name: String
  }]
}, {
  timestamps: true
});

// Index for better query performance
complaintSchema.index({ status: 1, createdDate: -1 });
complaintSchema.index({ category: 1, status: 1 });
complaintSchema.index({ location: 'text', title: 'text', description: 'text' });
complaintSchema.index({ coordinates: '2dsphere' });

// Generate complaintId before saving
complaintSchema.pre('save', function(next) {
  if (this.isNew && !this.complaintId) {
    this.complaintId = 'CMP-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();
  }
  next();
});

module.exports = mongoose.model('Complaint', complaintSchema);
