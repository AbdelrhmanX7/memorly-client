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
  id: string;
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

export interface VerifyEmailDTO {
  email: string;
  otp: string;
}

export interface ResendOTPDTO {
  email: string;
}

export interface ForgotPasswordDTO {
  email: string;
}

export interface ResetPasswordDTO {
  email: string;
  otp: string;
  newPassword: string;
}

export interface ResetPasswordFormData extends ResetPasswordDTO {
  confirmPassword: string;
}
