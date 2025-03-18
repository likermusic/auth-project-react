import { authApi } from "@/entities/user";
import {
  ResetPasswordFormData,
  resetPasswordSchema,
} from "@/entities/user/api/auth-api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function useResetPassword() {
  const [showPassword, setShowPassword] = useState(false); // Состояние для переключения видимости пароля
  const navigate = useNavigate();
  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
    },
  });

  async function resetPasswordHandler(data: ResetPasswordFormData) {
    // e.preventDefault();
    // if (user.login) {
    if (data.password) {
      try {
        await authApi.reset_password({
          newPassword: data.password,
        });
        navigate("/signin");
      } catch {
        toast.error("Can't reset password. Try later");
      }
    }
    // }
    // await axios.post("/api/auth/forgot-password", { email });
    // alert("Письмо отправлено!");
  }

  return { resetPasswordHandler, form, showPassword, setShowPassword };
}
