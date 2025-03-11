import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { FormData, formSchema, useUserStore } from "@/entities/user";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export function useSignInUser() {
  const signin = useUserStore((state) => state.signin);
  const navigate = useNavigate();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      login: "",
      password: "",
    },
  });

  async function signInHandler(data: FormData) {
    const resp = await signin(data);
    void (resp
      ? navigate("/")
      : toast.error("Ошибка авторизации. Проверьте логин и пароль"));
    // toast.success("Вы авторизовались");
  }
  return { signInHandler, form };
}
