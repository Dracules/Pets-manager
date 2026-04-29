import axios, { AxiosError, AxiosRequestConfig } from 'axios';
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

    if (error.response?.status === 401 && getToken().access_token) {
      if (isRefreshing) {
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
        await refresh();
        const newToken = getToken();

        processQueue(null, newToken);
        isRefreshing = false;

        return api(originalRequest);
      } catch (e) {
        processQueue(e);
        isRefreshing = false;
        handleLogout();
        return Promise.reject(e as Error);
      }
    } else if (error.response?.status === 401) {
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
