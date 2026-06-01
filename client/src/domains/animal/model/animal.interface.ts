export interface Animal {
  _id: string;
  name: string;
  readonly age: string;
  birthDate: Date;
  owner: { _id: string; login: string };
}
