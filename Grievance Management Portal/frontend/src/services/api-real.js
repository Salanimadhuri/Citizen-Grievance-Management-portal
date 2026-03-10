import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

export const complaintAPI = {
  create: (complaintData) => {
    const formData = new FormData();
    Object.keys(complaintData).forEach(key => {
      if (key === 'location') {
        formData.append('location', JSON.stringify(complaintData[key]));
      } else if (key === 'image' && complaintData[key]) {
        formData.append('image', complaintData[key]);
      } else if (complaintData[key]) {
        formData.append(key, complaintData[key]);
      }
    });
    return api.post('/complaints', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getAll: () => api.get('/complaints'),
  getById: (id) => api.get(`/complaints/${id}`),
  getMy: () => api.get('/complaints/my'),
  getAssigned: () => api.get('/complaints/assigned'),
  updateStatus: (id, data) => api.patch(`/complaints/${id}/status`, data),
  delete: (id) => api.delete(`/complaints/${id}`),
};

export const feedbackAPI = {
  create: (feedbackData) => api.post('/feedback', feedbackData),
  getByComplaint: (complaintId) => api.get(`/feedback/${complaintId}`),
};

export const departmentAPI = {
  getAll: () => api.get('/departments'),
  create: (data) => api.post('/departments', data),
  update: (id, data) => api.patch(`/departments/${id}`, data),
  delete: (id) => api.delete(`/departments/${id}`),
};

export const adminAPI = {
  createOfficer: (data) => api.post('/admin/officers', data),
  getAllOfficers: () => api.get('/admin/officers'),
  getOfficersByDepartment: (deptId) => api.get(`/admin/officers/department/${deptId}`),
  assignComplaint: (data) => api.post('/admin/assign-complaint', data),
  getAnalytics: () => api.get('/admin/analytics'),
};

export default api;
