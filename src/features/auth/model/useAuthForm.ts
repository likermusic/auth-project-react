import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

interface Props {
  authApi: (data: AuthData) => Promise<AxiosResponse<any, any>>;
}

export function useAuthForm(authApi: Props) {
  const formSchema = z.object({
    login: z.string().min(2, "Username must be at least 2 characters"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(20, "Password is too long")
      .regex(/[A-Z]/, "Пароль должен содержать хотя бы одну заглавную букву")
      .regex(/[0-9]/, "Пароль должен содержать хотя бы одну цифру"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      login: "",
      password: "",
    },
  });

  async function authHandler(data: z.infer<typeof formSchema>) {
    toast("Event has been created.");
    const resp = await authApi(data);
    console.log(resp);
  }

  return { form, authHandler };
}
