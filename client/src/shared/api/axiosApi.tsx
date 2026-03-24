import axios, { AxiosError } from 'axios';

const api = axios.create();
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwtToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('jwtToken');
    }
    return Promise.reject(error);
  },
);

export default api;
