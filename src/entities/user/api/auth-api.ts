import { api } from "@/shared/api/axios-instance";
// import { FormData } from "../model/useAuthUser";
import { z } from "zod";

export interface AuthDTO {
  data: {
    user: {
      id: string;
      login: string;
    };
    token: string;
  };
}

export const formSchema = z.object({
  login: z.string().min(2, "Username must be at least 2 characters"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(20, "Password is too long")
    .regex(/[A-Z]/, "Пароль должен содержать хотя бы одну заглавную букву")
    .regex(/[0-9]/, "Пароль должен содержать хотя бы одну цифру"),
});

export type FormData = z.infer<typeof formSchema>;

interface AuthApi {
  signin: (data: FormData) => Promise<AuthDTO>;
  signup: (data: FormData) => Promise<AuthDTO>;
  logout: () => Promise<void>;
}

export type AuthApiKeys = keyof typeof authApi;

export const authApi: AuthApi = {
  signin: (data) => api.post("/auth/signin", data),
  signup: (data) => api.post("/auth/signup", data),
  logout: () => api.post("/auth/logout"),
};
