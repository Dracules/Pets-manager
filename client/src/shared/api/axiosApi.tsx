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
  if (token.access_token) {
    config.headers.Authorization = `Bearer ${token.access_token}`;
  }
  return config;
});

let isRefreshing = false;
let failedQueue: Array<(error: any, token: any) => void> = [];

const processQueue = (error: any, token = null as AuthState | null) => {
  failedQueue.forEach((prom) => prom(error, token));
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    if (error.response?.status === 401 && getToken().access_token) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push((err, newToken) => {
            if (err) {
              reject(err);
            } else {
              resolve(
                api({
                  ...originalRequest,
                  headers: {
                    ...originalRequest.headers,
                    Authorization: `Bearer ${newToken.access_token}`,
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
        processQueue(e, null);
        isRefreshing = false;
        handleLogout();
        return Promise.reject(e);
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
