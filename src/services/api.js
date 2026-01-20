import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me')
};

// User APIs
export const userAPI = {
  getAllUsers: () => api.get('/users'),
  searchUsers: (query) => api.get(`/users/search?query=${query}`)
};

// Chat APIs
export const chatAPI = {
  getAllChats: () => api.get('/chats'),
  createOrGetChat: (userId) => api.post('/chats', { userId })
};

// Message APIs
export const messageAPI = {
  getMessages: (chatId) => api.get(`/messages/${chatId}`),
  sendMessage: (data) => api.post('/messages', data),
  uploadFile: (formData) => api.post('/messages/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateMessageStatus: (messageId, status) => 
    api.patch(`/messages/${messageId}/status`, { status })
};

export default api;