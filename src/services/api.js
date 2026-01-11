import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
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

export default api;
