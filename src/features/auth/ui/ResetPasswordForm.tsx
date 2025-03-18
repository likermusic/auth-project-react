import { Eye, EyeOff } from "lucide-react"; // Импортируйте иконки глаза

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";
import { ResetFormLayout } from "./layouts/ResetFormLayout";
import { useResetPassword } from "../model/useResetPassword";

export function ResetPasswordForm() {
  const { resetPasswordHandler, form, showPassword, setShowPassword } =
    useResetPassword();

  // const user = useUserStore((state) => state.user);

  return (
    <ResetFormLayout
      form={form}
      onSubmit={resetPasswordHandler}
      buttonTitle="Save"
      formField={
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"} // Переключаем тип поля ввода
                    placeholder="Enter a new password"
                    {...field}
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)} // Переключаем видимость пароля
                  >
                    {showPassword ? (
                      <EyeOff className="h-3 w-3 text-gray-500" /> // Иконка "глаз закрыт"
                    ) : (
                      <Eye className="h-3 w-3 text-gray-500" /> // Иконка "глаз открыт"
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      }
    />
  );
}
