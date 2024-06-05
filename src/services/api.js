import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:8500', // Replace with your backend URL
    headers: {
        'Content-Type': 'application/json',
    },
});

export const fetchAdvertisements = async (query) => {
    const response = await apiClient.get('/advertisements', { params: { query } });
    return response.data;
};
