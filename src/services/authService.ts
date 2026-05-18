import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export interface RoleDTO {
  roleId: number;
  roleName: string;
}

export interface User {
  userId: number;
  username: string;
  roles: RoleDTO[];
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: User;
}

export const authService = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await axios.post<LoginResponse>(
      `${API_URL}auth/login`,
      data,
    );
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getToken: (): string | null => {
    return localStorage.getItem("token");
  },

  getUser: (): User | null => {
    try {
      const raw = localStorage.getItem("user");

      if (!raw || raw === "undefined") {
        return null;
      }

      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem("token");
  },

  isAdmin: (): boolean => {
    const user = authService.getUser();
    return user?.roles.some((r) => r.roleName === "admin") ?? false;
  },
};
