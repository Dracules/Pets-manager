import axios, { AxiosError } from 'axios';
import { Auth } from './authApi';
import {
  AuthState,
  FullJwtToken,
} from '../../domains/login/model/jwtToken.interface';

const api = axios.create();

let getToken: () => AuthState = () => {
  return { access_token: null, refresh_token: null };
};
let handleLogout: () => void = () => {};
let updateToken: (newToken: FullJwtToken) => void = () => {};

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

const refresh = async () => {
  const tokens = getToken();
  if (!tokens.refresh_token) {
    throw new Error('Error: No refresh token');
  }

  const response = await Auth.refresh(tokens.refresh_token);

  updateToken(response);
};

export const setApiAuth = (
  getTokenFn: () => AuthState,
  handleLogoutFn: () => void,
  updateTokenFn: (newToken: FullJwtToken) => void,
) => {
  getToken = getTokenFn;
  handleLogout = handleLogoutFn;
  updateToken = updateTokenFn;
};

export default api;
