export interface RegisterDTO {
  username: string;
  email: string;
  password: string;
  dateOfBirth: string;
  acceptPrivacyPolicy: boolean;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export type User = {
  _id: string;
  username: string;
  email: string;
  dateOfBirth: string;
};

export interface AuthResponse {
  token: string;
  user: User;
}

export interface RegisterFormData extends RegisterDTO {
  confirmPassword: string;
}

export interface LoginFormData extends LoginDTO {}
