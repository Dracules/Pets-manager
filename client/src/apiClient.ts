import axios from 'axios';
import { Dog } from './interfaces/dog.interface';
import { Cat } from './interfaces/cat.interface';

class ApiClient {
  async get<T>(Url: string): Promise<T> {
    return axios
      .get<T>(Url)
      .then((response) => response.data)
      .catch((error) => {
        console.log(error);
        throw error;
      });
  }
}

const api = new ApiClient();

export async function getDogs(): Promise<Dog[]> {
  return api.get<Dog[]>('/animals/dogs');
}

export async function getCats(): Promise<Cat[]> {
  return api.get<Cat[]>('/animals/cats');
}
