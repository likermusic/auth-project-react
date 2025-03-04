import { api } from "@/shared/api/axios-instance";
import { FormData } from "../model/useAuthForm";
import { AuthDTO } from "./types";

interface AuthApi {
  signin: (data: FormData) => Promise<AuthDTO>;
  signup: (data: FormData) => Promise<AuthDTO>;
  logout: () => Promise<void>;
}

export const authApi: AuthApi = {
  signin: (data) => api.post("/auth/signin", data),
  signup: (data) => api.post("/auth/signup", data),
  logout: () => api.post("/auth/logout"),
};
