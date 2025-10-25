import { RegisterDTO, LoginDTO, AuthResponse } from "@/types/auth";

const API_URL = process.env.NEXT_PUBLIC_API || "http://localhost:3000/api";

export const authApi = {
  register: async (data: RegisterDTO): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();

      throw new Error(error.message || "Registration failed");
    }

    return response.json();
  },

  login: async (data: LoginDTO): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();

      throw new Error(error.message || "Login failed");
    }

    return response.json();
  },
};
