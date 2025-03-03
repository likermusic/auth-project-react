import { api } from "@/shared/api/axios-instance";

interface AuthData {
  login: string;
  password: string;
}

export const authApi = {
  signin: (data: AuthData) => api.post("/auth/signin", data),
  signup: (data: AuthData) => api.post("/auth/signup", data),
  logout: () => api.post("/auth/logout"),
};
