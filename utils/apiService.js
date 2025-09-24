// utils/apiService.js
// API service for backend communication
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://localhost:3000/api';
const USE_MOCK_API = false; // Set to false to use real API

// Mock data for issues
const MOCK_ISSUES = [
  {
    id: "1",
    title: "Broken Street Light on Main Road",
    description: "The street light has been flickering for weeks and now completely stopped working. This creates safety concerns for pedestrians and vehicles during night time. The area becomes very dark and dangerous.",
    shortDescription: "Street light not working, safety concern for pedestrians...",
    category: "Electricity",
    location: {
      address: "Main Road, Vengavasal",
      coords: { lat: 12.9716, lng: 77.5946 },
    },
    images: ["https://via.placeholder.com/300x200?text=Broken+Street+Light"],
    reportedBy: {
      id: "user123",
      name: "You",
      avatar: null,
    },
    assignedTo: {
      authority: "Chennai Electricity Board",
      officer: "Mr. Kumar",
      contact: "+91 98765 43210",
    },
    status: "reported",
    createdAt: new Date("2024-01-15T10:30:00Z"),
    updatedAt: new Date("2024-01-15T10:30:00Z"),
    escalationCount: 0,
    supportCount: 12,
    viewCount: 45,
    priority: "medium",
  },
  {
    id: "2",
    title: "Water Pipeline Leak",
    description: "Major water pipeline leak causing water wastage and creating potholes on the road. The leak has been ongoing for 3 days and is getting worse. Water is flooding the nearby houses during peak hours.",
    shortDescription: "Major pipeline leak causing flooding and road damage...",
    category: "Water & Sanitation",
    location: {
      address: "Gandhi Street, Vengavasal",
      coords: { lat: 12.9716, lng: 77.5946 },
    },
    images: ["https://via.placeholder.com/300x200?text=Water+Leak"],
    reportedBy: {
      id: "user456",
      name: "Priya Sharma",
      avatar: null,
    },
    assignedTo: {
      authority: "Chennai Metro Water",
      officer: "Ms. Lakshmi",
      contact: "+91 87654 32109",
    },
    status: "in_progress",
    createdAt: new Date("2024-01-12T14:20:00Z"),
    updatedAt: new Date("2024-01-14T09:15:00Z"),
    escalationCount: 3,
    supportCount: 28,
    viewCount: 89,
    priority: "high",
  },
  {
    id: "3",
    title: "Garbage Collection Missed",
    description: "Garbage has not been collected for the past week in our area. The bins are overflowing and creating hygiene issues. Stray dogs are spreading garbage around.",
    shortDescription: "Weekly garbage collection missed, overflowing bins...",
    category: "Garbage & Waste",
    location: {
      address: "Temple Street, Vengavasal",
      coords: { lat: 12.9716, lng: 77.5946 },
    },
    images: ["https://via.placeholder.com/300x200?text=Garbage+Overflow"],
    reportedBy: {
      id: "user123",
      name: "You",
      avatar: null,
    },
    assignedTo: {
      authority: "Greater Chennai Corporation",
      officer: "Mr. Rajesh",
      contact: "+91 76543 21098",
    },
    status: "resolved",
    createdAt: new Date("2024-01-10T08:45:00Z"),
    updatedAt: new Date("2024-01-13T16:30:00Z"),
    escalationCount: 1,
    supportCount: 15,
    viewCount: 56,
    priority: "medium",
  },
  {
    id: "4",
    title: "Pothole on Highway",
    description: "Large pothole formed on the highway causing vehicle damage. Multiple accidents have been reported. Needs immediate attention.",
    shortDescription: "Dangerous pothole causing accidents on highway...",
    category: "Road & Transport",
    location: {
      address: "NH-48, Vengavasal",
      coords: { lat: 12.9716, lng: 77.5946 },
    },
    images: ["https://via.placeholder.com/300x200?text=Large+Pothole"],
    reportedBy: {
      id: "user789",
      name: "Amit Kumar",
      avatar: null,
    },
    assignedTo: {
      authority: "National Highway Authority",
      officer: "Mr. Singh",
      contact: "+91 65432 10987",
    },
    status: "closed",
    createdAt: new Date("2024-01-08T12:00:00Z"),
    updatedAt: new Date("2024-01-12T14:45:00Z"),
    escalationCount: 0,
    supportCount: 42,
    viewCount: 134,
    priority: "high",
  },
  {
    id: "5",
    title: "Public Park Maintenance",
    description: "The public park needs maintenance. Play equipment is broken and grass needs cutting.",
    shortDescription: "Park equipment broken, grass overgrown...",
    category: "Others",
    location: {
      address: "Central Park, Vengavasal",
      coords: { lat: 12.9716, lng: 77.5946 },
    },
    images: ["https://via.placeholder.com/300x200?text=Park+Maintenance"],
    reportedBy: {
      id: "user101",
      name: "Sarah Johnson",
      avatar: null,
    },
    assignedTo: {
      authority: "Parks Department",
      officer: "Ms. Meera",
      contact: "+91 54321 09876",
    },
    status: "in_progress",
    createdAt: new Date("2024-01-14T16:20:00Z"),
    updatedAt: new Date("2024-01-15T11:10:00Z"),
    escalationCount: 0,
    supportCount: 8,
    viewCount: 23,
    priority: "low",
  },
];

const MOCK_USER_ID = "user123";

// Simulate network delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Real API calls
const makeApiCall = async (endpoint, options = {}) => {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        ...options.headers,
      },
      mode: 'cors', // Explicitly set CORS mode
      credentials: 'include', // Include credentials for CORS
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API call failed:', {
      endpoint,
      error: error.message,
      url: `${API_BASE_URL}${endpoint}`
    });
    
    // Handle CORS errors specifically
    if (error.message.includes('CORS') || error.message.includes('cors')) {
      throw new Error('CORS Error: Unable to connect to backend server. Please check if the server is running and CORS is configured properly.');
    }
    
    throw error;
  }
};

// Mock API functions
const mockApi = {
  // Get issues reported by current user
  getMyIssues: async () => {
    await delay(1000);
    return {
      success: true,
      data: MOCK_ISSUES.filter((issue) => issue.reportedBy.id === MOCK_USER_ID),
      total: MOCK_ISSUES.filter((issue) => issue.reportedBy.id === MOCK_USER_ID).length,
    };
  },

  // Get all issues for discover page
  getAllIssues: async (filters = {}) => {
    await delay(1200);
    let filteredIssues = [...MOCK_ISSUES];

    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredIssues = filteredIssues.filter(
        (issue) =>
          issue.title.toLowerCase().includes(searchTerm) ||
          issue.description.toLowerCase().includes(searchTerm) ||
          issue.category.toLowerCase().includes(searchTerm) ||
          issue.location.address.toLowerCase().includes(searchTerm)
      );
    }

    // Apply category filter
    if (filters.category && filters.category !== "All") {
      filteredIssues = filteredIssues.filter(
        (issue) => issue.category === filters.category
      );
    }

    // Apply status filter
    if (filters.status && filters.status !== "All") {
      filteredIssues = filteredIssues.filter(
        (issue) => issue.status === filters.status
      );
    }

    // Apply priority filter
    if (filters.priority && filters.priority !== "All") {
      filteredIssues = filteredIssues.filter(
        (issue) => issue.priority === filters.priority
      );
    }

    // Apply sorting
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case "newest":
          filteredIssues.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          break;
        case "oldest":
          filteredIssues.sort(
            (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
          );
          break;
        case "priority":
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          filteredIssues.sort(
            (a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]
          );
          break;
        case "support":
          filteredIssues.sort((a, b) => b.supportCount - a.supportCount);
          break;
        default:
          break;
      }
    }

    return {
      success: true,
      data: filteredIssues,
      total: filteredIssues.length,
      filters: filters,
    };
  },

  // Get single issue details
  getIssueById: async (issueId) => {
    await delay(800);
    const issue = MOCK_ISSUES.find((issue) => issue.id === issueId);

    if (!issue) {
      return {
        success: false,
        error: "Issue not found",
      };
    }

    return {
      success: true,
      data: {
        ...issue,
        timeline: [
          {
            status: "reported",
            date: issue.createdAt,
            message: "Issue reported successfully",
            active: true,
          },
          {
            status: "under_review",
            date:
              issue.status !== "reported"
                ? new Date(issue.createdAt.getTime() + 24 * 60 * 60 * 1000)
                : null,
            message: "Issue under review by authorities",
            active: issue.status !== "reported",
          },
          {
            status: "in_progress",
            date:
              issue.status === "in_progress" ||
              issue.status === "resolved" ||
              issue.status === "closed"
                ? new Date(issue.createdAt.getTime() + 48 * 60 * 60 * 1000)
                : null,
            message: "Work in progress",
            active:
              issue.status === "in_progress" ||
              issue.status === "resolved" ||
              issue.status === "closed",
          },
          {
            status: "resolved",
            date:
              issue.status === "resolved" || issue.status === "closed"
                ? issue.updatedAt
                : null,
            message: "Issue has been resolved",
            active: issue.status === "resolved" || issue.status === "closed",
          },
          {
            status: "closed",
            date: issue.status === "closed" ? issue.updatedAt : null,
            message: "Issue closed and verified",
            active: issue.status === "closed",
          },
        ],
      },
    };
  },

  // Escalate an issue
  escalateIssue: async (issueId) => {
    await delay(1500);
    const issueIndex = MOCK_ISSUES.findIndex((issue) => issue.id === issueId);

    if (issueIndex === -1) {
      return {
        success: false,
        error: "Issue not found",
      };
    }

    MOCK_ISSUES[issueIndex].escalationCount += 1;
    MOCK_ISSUES[issueIndex].updatedAt = new Date();

    return {
      success: true,
      message: "Issue escalated successfully",
      data: MOCK_ISSUES[issueIndex],
    };
  },

  // Report an issue as spam/inappropriate
  reportIssue: async (issueId, reason) => {
    await delay(1000);
    return {
      success: true,
      message: "Issue reported successfully. Our team will review it.",
    };
  },

  // Support/upvote an issue
  supportIssue: async (issueId) => {
    await delay(800);
    const issueIndex = MOCK_ISSUES.findIndex((issue) => issue.id === issueId);

    if (issueIndex === -1) {
      return {
        success: false,
        error: "Issue not found",
      };
    }

    MOCK_ISSUES[issueIndex].supportCount += 1;

    return {
      success: true,
      message: "Thank you for supporting this issue!",
      data: MOCK_ISSUES[issueIndex],
    };
  },
};

// Real API functions
const realApi = {
  // Get issues reported by current user
  getMyIssues: async (filters = {}) => {
    return await makeApiCall('/complaints/my-complaints', {
      method: 'GET',
    });
  },

  // Get all issues for discover page
  getAllIssues: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    return await makeApiCall(`/complaints?${queryParams}`, {
      method: 'GET',
    });
  },

  // Get single issue details
  getIssueById: async (issueId) => {
    return await makeApiCall(`/complaints/${issueId}`, {
      method: 'GET',
    });
  },

  // Create new complaint
  createComplaint: async (complaintData) => {
    return await makeApiCall('/complaints', {
      method: 'POST',
      body: JSON.stringify(complaintData),
    });
  },

  // Escalate an issue
  escalateIssue: async (issueId) => {
    const token = await AsyncStorage.getItem('authToken');
    return await makeApiCall(`/complaints/${issueId}/escalate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  // Report an issue as spam/inappropriate
  reportIssue: async (issueId, reason) => {
    const token = await AsyncStorage.getItem('authToken');
    return await makeApiCall(`/complaints/${issueId}/report`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ reason }),
    });
  },

  // Support/upvote an issue
  supportIssue: async (issueId) => {
    const token = await AsyncStorage.getItem('authToken');
    return await makeApiCall(`/complaints/${issueId}/upvote`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  // Get complaint statistics
  getComplaintStats: async () => {
    return await makeApiCall('/complaints/stats', {
      method: 'GET',
    });
  },

  // User registration
  registerUser: async (userData) => {
    return await makeApiCall('/users/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Get user profile
  getUserProfile: async () => {
    const token = await AsyncStorage.getItem('authToken');
    return await makeApiCall('/users/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  // Update user profile
  updateUserProfile: async (profileData) => {
    const token = await AsyncStorage.getItem('authToken');
    return await makeApiCall('/users/profile', {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    });
  },

  // Get user dashboard
  getUserDashboard: async () => {
    const token = await AsyncStorage.getItem('authToken');
    return await makeApiCall('/users/dashboard', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },
};

// Export the appropriate API based on configuration
export const apiService = USE_MOCK_API ? mockApi : realApi;

// Export both for flexibility
export { mockApi, realApi };

