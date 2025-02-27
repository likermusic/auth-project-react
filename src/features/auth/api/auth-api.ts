import { api } from "@/shared/api/axios-instance";

interface AuthData {
  username: string;
  password: string;
}

export const authApi = {
  login: (data: AuthData) => api.post("/auth/signin", data),
  register: (data: AuthData) => api.post("/auth/signup", data),
  logout: () => api.post("/auth/logout"),
};
