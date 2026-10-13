import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import {
  type AuthState,
  type FullJwtToken,
} from '../../domains/login/model/jwtToken.interface';

const api = axios.create({
  baseURL: (import.meta.env.VITE_API_URL as string) || 'http://localhost:3000',
});

interface AuthActions {
  getToken: () => AuthState;
  refreshToken: () => Promise<FullJwtToken>;
  handleLogout: () => void;
  updateToken: (newToken: FullJwtToken) => void;
}

let authActions: AuthActions = {
  getToken: () => ({ access_token: null, refresh_token: null }),
  handleLogout: () => {},
  updateToken: () => {},
  refreshToken: () => {
    return Promise.reject(new Error('Auth not initialized'));
  },
};

export const setApiAuth = (actions: AuthActions) => {
  authActions = actions;
};

api.interceptors.request.use((config) => {
  const token = authActions.getToken();
  if (token.access_token) {
    config.headers.Authorization = `Bearer ${token.access_token}`;
  }
  return config;
});

let isRefreshing = false;
let failedQueue: Array<(error: any, token?: AuthState) => void> = [];

const processQueue = (error: unknown, token?: AuthState) => {
  failedQueue.forEach((prom) => prom(error, token));
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig;

    if (
      error.response?.status === 401 &&
      authActions.getToken().refresh_token
    ) {
      if (isRefreshing) {
        if (originalRequest.url?.includes('/auth/refresh'))
          return Promise.reject(error);
        return new Promise(function (resolve, reject) {
          failedQueue.push((err: Error, newToken) => {
            if (err) {
              reject(err);
            } else {
              resolve(
                api({
                  ...originalRequest,
                  headers: {
                    ...originalRequest.headers,
                    Authorization: `Bearer ${newToken!.access_token}`,
                  },
                }),
              );
            }
          });
        });
      }

      isRefreshing = true;

      try {
        const newToken = await authActions.refreshToken();
        authActions.updateToken(newToken);

        processQueue(null, newToken);
        isRefreshing = false;

        return api(originalRequest);
      } catch (e) {
        processQueue(e);
        isRefreshing = false;
        authActions.handleLogout();
        return Promise.reject(e as Error);
      }
    } else if (error.response?.status === 401) {
      authActions.handleLogout();
    }
    return Promise.reject(error);
  },
);

export default api;
