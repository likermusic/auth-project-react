import { api } from "@/shared/api/axios-instance";

interface AuthDTO {
  user: {
    id: string;
    login: string;
  };
  token: string;
}

interface AuthData {
  login: string;
  password: string;
}

interface AuthApi {
  signin: (data: AuthData) => Promise<AuthDTO>;
  signup: (data: AuthData) => Promise<AuthDTO>;
  logout: () => Promise<void>;
}

export const authApi: AuthApi = {
  signin: (data) => api.post("/auth/signin", data),
  signup: (data) => api.post("/auth/signup", data),
  logout: () => api.post("/auth/logout"),
};
