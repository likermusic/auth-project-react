import { api } from "@/shared/api/axios-instance";
import { AxiosResponse } from "axios";
// import { FormData } from "../model/useAuthUser";
import { z } from "zod";

export interface UserDTO {
  id: number;
  login: string;
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
  signin: (data: FormData) => Promise<AxiosResponse<UserDTO>>;
  signup: (data: FormData) => Promise<AxiosResponse<UserDTO>>;
  google_auth: () => void;
  signout: () => Promise<AxiosResponse>;
  session: () => Promise<AxiosResponse<UserDTO>>;
}

export type AuthApiKeys = keyof typeof authApi;

export const authApi: AuthApi = {
  signin: (data) => api.post("/auth/signin", data),
  signup: (data) => api.post("/auth/signup", data),
  google_auth: () => {
    window.location.href = "http://localhost:4000/api/auth/google";
  },
  signout: () => api.post("/auth/signout"),
  session: () => api.get("/session"),
};
