import { toast } from "sonner";

// import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { FormData, formSchema, useUserStore } from "@/entities/user";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export function useSignUpUser() {
  const signup = useUserStore((state) => state.signup);
  const navigate = useNavigate();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      login: "",
      password: "",
    },
  });

  async function signUpHandler(data: FormData) {
    const resp = await signup(data);
    void (resp
      ? navigate("/")
      : toast.error("Ошибка регистрации. Проверьте логин и пароль"));
    // toast.success("Вы авторизовались");
  }

  return { signUpHandler, form };

  /*
  void (
    resp?.data?.token &&
    Cookies.set("token", resp.data.token, {
      expires: 1 / 24, // по дефолту в днях. Чтобы задать 1ч = 1/24
    })
  );
  */
}
