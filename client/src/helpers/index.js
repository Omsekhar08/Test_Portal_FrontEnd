import axios from 'axios';

// Base API URL configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Common API methods
export const apiHelper = {
  // GET request
  get: async (endpoint) => {
    try {
      const response = await api.get(endpoint);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  // POST request
  post: async (endpoint, data) => {
    try {
      const response = await api.post(endpoint, data);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  // PUT request
  put: async (endpoint, data) => {
    try {
      const response = await api.put(endpoint, data);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  // DELETE request
  delete: async (endpoint) => {
    try {
      const response = await api.delete(endpoint);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  // File upload
  upload: async (endpoint, file, onProgress) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(percentCompleted);
          }
        },
      });
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  }
};

// Error handler
const handleError = (error) => {
  if (error.response) {
    // Server responded with error
    const message = error.response.data?.message || 'An error occurred';
    const status = error.response.status;
    
    // Handle 401 Unauthorized
    if (status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    return {
      message,
      status,
      data: error.response.data
    };
  } else if (error.request) {
    // Request made but no response
    return {
      message: 'No response from server',
      status: 503
    };
  } else {
    // Request setup error
    return {
      message: error.message,
      status: 500
    };
  }
};

// Common API endpoints
export const endpoints = {
  auth: {
    login: '/users/login',
    register: '/users/register',
    profile: '/users/profile',
  },
  tests: {
    all: '/users/test',
    byId: (id) => `/users/test/${id}`,
    register: (id) => `/tests/${id}/register`,
  },
  admin: {
    tests: '/admin/tests',
    mcq: '/admin/mcq',
    codingChallenges: '/coding-challenges',
    users: '/admin/users',
  }
};

// Usage examples:
/*
import { apiHelper, endpoints } from '../helpers';

// Get user profile
const getUserProfile = async () => {
  try {
    const profile = await apiHelper.get(endpoints.auth.profile);
    return profile;
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
};

// Create new test
const createTest = async (testData) => {
  try {
    const response = await apiHelper.post(endpoints.admin.tests, testData);
    return response;
  } catch (error) {
    console.error('Error creating test:', error);
    throw error;
  }
};
*/
