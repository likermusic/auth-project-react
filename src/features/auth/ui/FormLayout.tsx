import { useState } from "react";
import { Button } from "@/shared/ui/button";
import { Eye, EyeOff } from "lucide-react"; // Импортируйте иконки глаза
import { Toaster } from "sonner";
import { authApi, FormData } from "@/entities/user";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";
import { UseFormReturn } from "react-hook-form";
import { Link } from "react-router-dom";
import { GoogleAuthButton } from "@/shared/ui/google-auth-button/google-auth-button";

interface FormLayoutProps {
  form: UseFormReturn<
    {
      login: string;
      password: string;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any,
    undefined
  >;
  onSubmit: (data: FormData) => Promise<void>;
  link: {
    to: string;
    title: string;
  };
  buttonTitle: string;
  forgotPassword?: React.ReactElement;
}

export function FormLayout({
  form,
  onSubmit,
  link,
  buttonTitle,
  forgotPassword,
}: FormLayoutProps) {
  const [showPassword, setShowPassword] = useState(false); // Состояние для переключения видимости пароля

  return (
    <Form {...form}>
      <Toaster />
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="login"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Login</FormLabel>
              <FormControl>
                <Input placeholder="Login" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />{" "}
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
                    placeholder="Password"
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
        <Button type="submit">{buttonTitle}</Button>
        <Button variant={"link"}>
          <Link to={link.to}>{link.title}</Link>
        </Button>
      </form>
      <GoogleAuthButton onClick={authApi.google_auth} />
      {forgotPassword ?? ""}
    </Form>
  );
}
