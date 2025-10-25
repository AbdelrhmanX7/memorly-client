import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";

import { authApi } from "@/service/api/auth";
import {
  RegisterDTO,
  LoginDTO,
  VerifyEmailDTO,
  ResendOTPDTO,
  ForgotPasswordDTO,
  ResetPasswordDTO,
} from "@/types/auth";

export const useRegister = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: RegisterDTO) => authApi.register(data),
    onSuccess: (_data, variables) => {
      // Don't store token yet - user needs to verify email first
      // Store email for verification page
      localStorage.setItem("pendingVerificationEmail", variables.email);

      // Redirect to verify email page
      router.push(`/verify-email?email=${encodeURIComponent(variables.email)}`);
    },
  });
};

export const useLogin = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: LoginDTO) => authApi.login(data),
    onSuccess: (data) => {
      // Store token in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect to dashboard or home
      router.push("/");
    },
  });
};

export const useVerifyEmail = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: VerifyEmailDTO) => authApi.verifyEmail(data),
    onSuccess: () => {
      // Clear pending verification email
      localStorage.removeItem("pendingVerificationEmail");

      // Redirect to login
      router.push("/login?verified=true");
    },
  });
};

export const useResendOTP = () => {
  return useMutation({
    mutationFn: (data: ResendOTPDTO) => authApi.resendVerificationOTP(data),
  });
};

export const useForgotPassword = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: ForgotPasswordDTO) => authApi.forgotPassword(data),
    onSuccess: (_data, variables) => {
      // Redirect to reset password page with email
      router.push(
        `/reset-password?email=${encodeURIComponent(variables.email)}`,
      );
    },
  });
};

export const useResetPassword = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: ResetPasswordDTO) => authApi.resetPassword(data),
    onSuccess: () => {
      // Redirect to login with success message
      router.push("/login?reset=true");
    },
  });
};
