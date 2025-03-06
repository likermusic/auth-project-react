import { toast } from "sonner";
import * as Cookies from "js-cookie";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { authApi, FormData, formSchema } from "@/entities/user";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export function useSignInUser() {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      login: "",
      password: "",
    },
  });

  const navigate = useNavigate();

  async function signInHandler(data: FormData) {
    try {
      const resp = await authApi.signin(data);
      // const currentDate = new Date();
      // const expiresInHours = new Date(currentDate.getTime() + 60 * 60 * 1000);

      if (!resp?.data?.token) {
        throw new Error("Сервер не вернул токен");
      }
      Cookies.default.set("token", resp.data.token, {
        expires: 1 / 24, // по дефолту в днях. Чтобы задать 1ч = 1/24
      });
      toast.success("Вы авторизовались");

      navigate("/");
    } catch (error) {
      // console.log((error as AxiosError).response?.data);

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

  return { signInHandler, form };
}
