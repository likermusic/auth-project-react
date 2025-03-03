import React, { useState } from "react";
import { Button } from "@/shared/ui/button";
import { Eye, EyeOff } from "lucide-react"; // Импортируйте иконки глаза

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";
import { toast, Toaster } from "sonner";
import { authApi } from "../api/auth-api";

const formSchema = z.object({
  login: z.string().min(2, "Username must be at least 2 characters"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(20, "Password is too long")
    .regex(/[A-Z]/, "Пароль должен содержать хотя бы одну заглавную букву")
    .regex(/[0-9]/, "Пароль должен содержать хотя бы одну цифру"),
});

export function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false); // Состояние для переключения видимости пароля

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      login: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    toast("Event has been created.");
    const resp = await authApi.signup(data);
    console.log(resp);
  }

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
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
