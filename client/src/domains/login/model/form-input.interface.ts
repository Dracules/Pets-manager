export interface LoginFormInput {
  login: string;
  password: string;
}

export interface RegistrationFormInput extends LoginFormInput {
  confirmPassword: string;
}
