import { toast } from "sonner";

import * as Cookies from "js-cookie";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { authApi, FormData, formSchema } from "@/entities/user";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export function useSignUpUser() {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      login: "",
      password: "",
    },
  });

  const navigate = useNavigate();

  async function signUpHandler(data: FormData) {
    try {
      const resp = await authApi.signup(data);

      void (
        resp?.data?.token &&
        Cookies.default.set("token", resp.data.token, {
          expires: 1 / 24, // по дефолту в днях. Чтобы задать 1ч = 1/24
        })
      );
      toast.success("Вы зарегистрированы");

      navigate("/");
    } catch (error) {
      // console.log((error as AxiosError).response?.data);

      console.log((error as AxiosError<{ error: string }>).response?.data);

      // console.log(error.response.data.error);

      // console.log((error as Error).message);
      toast.error(
        (error as AxiosError<{ error: string }>).response?.data?.error ||
          "Ошибка регистрации. Проверьте логин и пароль."
      );
    }
  }

  return { signUpHandler, form };
}
