const axios = require('axios');

class ApiService {
  constructor(baseURL = 'http://localhost:3000/api') {
    this.baseURL = baseURL;
    this.client = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Add request interceptor for authentication
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.clearAuthToken();
          // Redirect to login or handle unauthorized access
        }
        return Promise.reject(error);
      }
    );
  }

  // Token management
  setAuthToken(token) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
    }
  }

  getAuthToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken');
    }
    return null;
  }

  clearAuthToken() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
    }
  }

  // Complaint API methods
  async getAllComplaints(filters = {}) {
    try {
      const response = await this.client.get('/complaints', { params: filters });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getComplaintById(id) {
    try {
      const response = await this.client.get(`/complaints/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createComplaint(complaintData) {
    try {
      const response = await this.client.post('/complaints', complaintData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateComplaintStatus(id, statusData) {
    try {
      const response = await this.client.patch(`/complaints/${id}/status`, statusData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async upvoteComplaint(id) {
    try {
      const response = await this.client.post(`/complaints/${id}/upvote`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getComplaintsByUser(filters = {}) {
    try {
      const response = await this.client.get('/complaints/my-complaints', { params: filters });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getComplaintStats() {
    try {
      const response = await this.client.get('/complaints/stats');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // User API methods
  async getUserProfile() {
    try {
      const response = await this.client.get('/users/profile');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateUserProfile(profileData) {
    try {
      const response = await this.client.patch('/users/profile', profileData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async registerUser(userData) {
    try {
      const response = await this.client.post('/users/register', userData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getUserDashboard() {
    try {
      const response = await this.client.get('/users/dashboard');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async searchUsers(searchParams = {}) {
    try {
      const response = await this.client.get('/users/search', { params: searchParams });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // File upload methods
  async uploadFile(file, type = 'image') {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      const response = await this.client.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async uploadMultipleFiles(files, type = 'image') {
    try {
      const formData = new FormData();
      files.forEach((file, index) => {
        formData.append(`files`, file);
      });
      formData.append('type', type);

      const response = await this.client.post('/upload/multiple', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Error handling
  handleError(error) {
    if (error.response) {
      // Server responded with error status
      return {
        message: error.response.data?.message || 'An error occurred',
        status: error.response.status,
        data: error.response.data
      };
    } else if (error.request) {
      // Request was made but no response received
      return {
        message: 'Network error - please check your connection',
        status: 0,
        data: null
      };
    } else {
      // Something else happened
      return {
        message: error.message || 'An unexpected error occurred',
        status: 0,
        data: null
      };
    }
  }
}

// Create singleton instance
const apiService = new ApiService();

module.exports = apiService;
