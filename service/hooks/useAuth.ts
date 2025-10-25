import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";

import { authApi } from "@/service/api/auth";
import { RegisterDTO, LoginDTO } from "@/types/auth";

export const useRegister = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: RegisterDTO) => authApi.register(data),
    onSuccess: (data) => {
      // Store token in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect to dashboard or home
      router.push("/");
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
