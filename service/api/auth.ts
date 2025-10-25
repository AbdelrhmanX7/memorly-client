import axios from "axios";

import {
  RegisterDTO,
  LoginDTO,
  AuthResponse,
  VerifyEmailDTO,
  ResendOTPDTO,
  ForgotPasswordDTO,
  ResetPasswordDTO,
} from "@/types/auth";

export const authApi = {
  register: async (data: RegisterDTO): Promise<AuthResponse> => {
    try {
      const response = await axios.post<AuthResponse>("/auth/register", data);

      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Registration failed");
    }
  },

  login: async (data: LoginDTO): Promise<AuthResponse> => {
    try {
      const response = await axios.post<AuthResponse>("/auth/login", data);

      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Login failed");
    }
  },

  verifyEmail: async (
    data: VerifyEmailDTO,
  ): Promise<{ message: string; success: boolean }> => {
    try {
      const response = await axios.post<{ message: string; success: boolean }>(
        "/auth/verify-email",
        data,
      );

      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Email verification failed",
      );
    }
  },

  resendVerificationOTP: async (
    data: ResendOTPDTO,
  ): Promise<{ message: string; success: boolean }> => {
    try {
      const response = await axios.post<{ message: string; success: boolean }>(
        "/auth/resend-verification-otp",
        data,
      );

      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to resend OTP");
    }
  },

  forgotPassword: async (
    data: ForgotPasswordDTO,
  ): Promise<{ message: string; success: boolean }> => {
    try {
      const response = await axios.post<{ message: string; success: boolean }>(
        "/auth/forgot-password",
        data,
      );

      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to send reset OTP",
      );
    }
  },

  resetPassword: async (
    data: ResetPasswordDTO,
  ): Promise<{ message: string; success: boolean }> => {
    try {
      const response = await axios.post<{ message: string; success: boolean }>(
        "/auth/reset-password",
        data,
      );

      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Password reset failed");
    }
  },
};
