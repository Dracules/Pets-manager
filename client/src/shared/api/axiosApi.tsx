import axios, { AxiosError } from 'axios';

const api = axios.create();

let getToken: () => string | null = () => null;
let handleLogout: () => void = () => {};

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      handleLogout();
    }
    return Promise.reject(error);
  },
);

export const setApiAuth = (
  getTokenFn: () => string | null,
  handleLogoutFn: () => void,
) => {
  getToken = getTokenFn;
  handleLogout = handleLogoutFn;
};

export default api;
