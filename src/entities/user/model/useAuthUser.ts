import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { authApi, AuthApiKeys } from "../api/auth-api";
// import Cookies from "js-cookie";
// import Cookies from "@node_modules/@types/js-cookie";
import * as Cookies from "js-cookie";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
  login: z.string().min(2, "Username must be at least 2 characters"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(20, "Password is too long")
    .regex(/[A-Z]/, "Пароль должен содержать хотя бы одну заглавную букву")
    .regex(/[0-9]/, "Пароль должен содержать хотя бы одну цифру"),
});

export type FormData = z.infer<typeof formSchema>;

// type AuthApiFunction = (data: FormData) => Promise<AuthDTO>;

export function useAuthUser(authFn: AuthApiKeys) {
  const navigate = useNavigate();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      login: "",
      password: "",
    },
  });

  async function authHandler(data: FormData) {
    try {
      const resp = await authApi[authFn](data);
      // const currentDate = new Date();
      // const expiresInHours = new Date(currentDate.getTime() + 60 * 60 * 1000);
      void (
        resp?.data?.token &&
        Cookies.default.set("token", resp.data.token, {
          expires: 1 / 24, // по дефолту в днях. Чтобы задать 1ч = 1/24
        })
      );
      toast("Вы авторизовались");

      navigate("/");
    } catch (error) {
      console.log((error as AxiosError).response?.data);

      console.log(
        (error as AxiosError<{ error: string }>).response?.data?.error
      );

      // console.log(error.response.data.error);

      // console.log((error as Error).message);
      toast.error(
        (error as AxiosError<{ error: string }>).response?.data?.error ||
          "Ошибка авторизации. Проверьте логин и пароль."
      );
    }
  }

  return { form, authHandler };
}
