import { authApi } from "@/entities/user";
import {
  ResetPasswordFormData,
  resetPasswordSchema,
} from "@/entities/user/api/auth-api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function useEmailToReset() {
  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function emailHandler(data: ResetPasswordFormData) {
    // e.preventDefault();
    // if (user.login) {
    if (data.email) {
      try {
        await authApi.forgot_password({ email: data.email });
        toast.success("We sent the link on your email to reset password");
      } catch {
        toast.error("Can't find your email");
      }
    }
    // }
    // await axios.post("/api/auth/forgot-password", { email });
    // alert("Письмо отправлено!");
  }

  return { emailHandler, form };
}
