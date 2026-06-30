import axios from 'axios';
import { mockComplaints, mockDepartments, mockOfficers, mockAnalytics } from './mockData';

const API_BASE_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const USE_MOCK_DATA = false;

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Set Content-Type to application/json only for non-FormData requests
api.interceptors.request.use((config) => {
  if (!(config.data instanceof FormData)) {
    config.headers['Content-Type'] = 'application/json';
  }
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Unwrap Spring Boot ApiResponse wrapper automatically
// Backend always returns: { success, message, data: <payload> }
// After this interceptor, response.data IS the payload directly
api.interceptors.response.use(
  (response) => {
    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      response.data = response.data.data;
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Mock API responses
const mockAPI = {
  get: (url) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (url.includes('/complaints')) {
          resolve({ data: mockComplaints });
        } else if (url.includes('/departments')) {
          resolve({ data: mockDepartments });
        } else if (url.includes('/officers')) {
          resolve({ data: mockOfficers });
        } else if (url.includes('/analytics/stats')) {
          resolve({ data: mockAnalytics.stats });
        } else if (url.includes('/analytics/charts')) {
          resolve({ data: mockAnalytics });
        } else {
          resolve({ data: [] });
        }
      }, 300);
    });
  },
  post: (url, data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: { success: true, ...data } });
      }, 300);
    });
  },
  patch: (url, data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: { success: true, ...data } });
      }, 300);
    });
  },
  delete: (url) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: { success: true } });
      }, 300);
    });
  },
};

const apiClient = USE_MOCK_DATA ? mockAPI : api;

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
};

export const complaintAPI = {
  create: (complaintData) => apiClient.post('/complaints', complaintData),
  getAll: (params) => api.get('/complaints', { params }),
  getById: (id) => apiClient.get(`/complaints/${id}`),
  getOfficerById: (id) => api.get(`/complaints/officer/${id}`),
  getMy: () => apiClient.get('/complaints/my'),
  getOfficerComplaints: () => api.get('/complaints/officer'),
  update: (id, data) => api.patch(`/complaints/${id}/status`, data),
  assign: (id, data) => api.patch(`/complaints/${id}/assign`, data),
  getLocations: (params) => api.get('/complaints/locations', { params }),
  getEscalationRisks: () => api.get('/complaints/ai/risks'),
  getAIInsights: () => api.get('/complaints/ai/insights'),
};

export const feedbackAPI = {
  create: (feedbackData) => api.post('/feedback', feedbackData),
  getRecent: () => api.get('/feedback/recent'),
  getOfficer: () => api.get('/feedback/officer'),
};

export const communicationAPI = {
  sendMessage: (data) => api.post('/communications', data),
  getMessages: (complaintId) => api.get(`/communications/${complaintId}`),
  getConversations: () => api.get('/communications/conversations'),
};

export const departmentAPI = {
  getAll: () => apiClient.get('/departments'),
  create: (data) => apiClient.post('/departments', data),
  update: (id, data) => apiClient.patch(`/departments/${id}`, data),
  delete: (id) => apiClient.delete(`/departments/${id}`),
};

export const officerAPI = {
  getAll: () => api.get('/users/officers'),
  create: (data) => api.post('/admin/create-officer', data),
  update: (id, data) => api.patch(`/admin/officers/${id}`, data),
  getByDepartment: (deptId) => api.get(`/users/officers?department=${deptId}`),
};

export const analyticsAPI = {
  getStats: () => api.get('/admin/analytics'),
  getChartData: () => api.get('/admin/analytics'),
  getHeatmapData: (params) => api.get('/complaints/locations', { params }),
};

export const pdfAPI = {
  downloadComplaint: (id) => api.get(`/pdf/complaint/${id}`, { responseType: 'blob' }),
  downloadMyComplaints: () => api.get('/pdf/my-complaints', { responseType: 'blob' }),
};

export const complaintReopenAPI = {
  reopen: (id, reason) => api.patch(`/complaints/${id}/reopen`, { reason }),
};

export default api;
