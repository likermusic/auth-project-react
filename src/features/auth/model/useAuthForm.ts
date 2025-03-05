import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { AuthDTO } from "../../../entities/user/api/types";

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

type AuthApiFunction = (data: FormData) => Promise<AuthDTO>;

export function useAuthForm(authApi: AuthApiFunction) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      login: "",
      password: "",
    },
  });

  async function authHandler(data: FormData) {
    toast("Вы авторизовались");
    const resp = await authApi(data);
    console.log(resp);
  }

  return { form, authHandler };
}
