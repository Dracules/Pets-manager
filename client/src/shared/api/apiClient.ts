import axios, { AxiosError } from 'axios';
import api from './axiosApi';

export function isApiError(e: unknown): e is AxiosError {
  return axios.isAxiosError(e);
}

class ApiClient {
  async get<T>(Url: string): Promise<T> {
    return api
      .get<T>(Url)
      .then((response) => response.data)
      .catch((error) => {
        console.log(error);
        throw error;
      });
  }

  async delete(Url: string): Promise<string> {
    return api
      .delete<string>(Url)
      .then((response) => response.data)
      .catch((error) => {
        console.log(error);
        throw error;
      });
  }

  async post<T>(Url: string, data: object): Promise<T> {
    return api
      .post<T>(Url, data)
      .then((response) => response.data)
      .catch((error) => {
        console.log(error);
        throw error;
      });
  }

  async put<T>(Url: string, data: object): Promise<T> {
    return api
      .put<T>(Url, data)
      .then((response) => response.data)
      .catch((error) => {
        console.log(error);
        throw error;
      });
  }
}

const apiClient = new ApiClient();

export default apiClient;
