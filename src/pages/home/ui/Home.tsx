import { api } from "@/shared/api/axios-instance";
import { Button } from "@/shared/ui/button";
import Cookies from "js-cookie";
import React from "react";

export function Home() {
  function fetchWithAuth() {
    // api.interceptors.request.use((config) => {
    //   const token = Cookies.get("token"); // Получаем токен из куки
    //   if (token) {
    //     config.headers.Authorization = `Bearer ${token}`; // Добавляем токен в заголовок
    //   }
    //   return config;
    // });

    // api
    //   .get("/protected")
    //   .then((resp) => console.log(resp))
    //   .catch((error) => console.log("Ошибка:", error));

    // api
    //   .get("/session")
    //   .then((resp) => console.log(resp))
    //   .catch((error) => console.log("Ошибка:", error));

    // api.post("/auth/google").then((resp) => console.log(resp));
    window.location.href = "http://localhost:4000/api/auth/google";
  }

  return (
    <div>
      Home
      <Button onClick={fetchWithAuth}>Проверить доступ с помощью JWT</Button>
    </div>
  );
}
