import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Lead API calls
export const leadAPI = {
    // Get all leads
    getAll: async () => {
        const response = await api.get('/leads');
        return response.data;
    },

    // Get single lead
    getById: async (id) => {
        const response = await api.get(`/leads/${id}`);
        return response.data;
    },

    // Create new lead
    create: async (leadData) => {
        const response = await api.post('/leads', leadData);
        return response.data;
    },

    // Update lead
    update: async (id, leadData) => {
        const response = await api.put(`/leads/${id}`, leadData);
        return response.data;
    },

    // Delete lead
    delete: async (id) => {
        const response = await api.delete(`/leads/${id}`);
        return response.data;
    },

    // Add activity log
    addLog: async (id, logData) => {
        const response = await api.post(`/leads/${id}/log`, logData);
        return response.data;
    }
};

// Stats API calls
export const statsAPI = {
    get: async () => {
        const response = await api.get('/stats');
        return response.data;
    }
};

// Auth API calls
export const authAPI = {
    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    },

    login: async (credentials) => {
        const response = await api.post('/auth/login', credentials);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getMe: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    }
};

// Admin API calls
export const adminAPI = {
    // User management
    getAllUsers: async () => {
        const response = await api.get('/admin/users');
        return response.data;
    },

    createUser: async (userData) => {
        const response = await api.post('/admin/users', userData);
        return response.data;
    },

    updateUser: async (id, userData) => {
        const response = await api.put(`/admin/users/${id}`, userData);
        return response.data;
    },

    deleteUser: async (id) => {
        const response = await api.delete(`/admin/users/${id}`);
        return response.data;
    },

    // Analytics
    getAnalytics: async () => {
        const response = await api.get('/admin/analytics');
        return response.data;
    },

    // Activity logs
    getActivityLogs: async () => {
        const response = await api.get('/admin/activity-logs');
        return response.data;
    }
};

export default api;
