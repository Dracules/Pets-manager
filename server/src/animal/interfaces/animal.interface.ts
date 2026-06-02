export interface AnimalResponse {
  _id: string;
  name: string;
  age: string;
  birthDate: Date;
  owner: { _id: string; login: string };
  description?: string;
}
