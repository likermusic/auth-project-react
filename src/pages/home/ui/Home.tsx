import { api } from "@/shared/api/axios-instance";
import { Button } from "@/shared/ui/button";
import Cookies from "js-cookie";
import React from "react";

export function Home() {
  function fetchWithAuth() {
    api.interceptors.request.use((config) => {
      const token = Cookies.get("token"); // Получаем токен из куки
      if (token) {
        config.headers.Authorization = `Bearer ${token}`; // Добавляем токен в заголовок
      }
      return config;
    });

    api
      .get("/protected")
      .then((resp) => console.log(resp.data))
      .catch((error) => console.log("Ошибка:", error));

    // .fetch("http://localhost:4000/auth/signin", {
    //   method: "POST",
    //   headers: {
    //     Authorization: `Bearer ${token}`,
    //   },
    // })
    // .then((response) => {
    //   return response.json();
    // })
    // .then((data) => console.log(data))
    // .catch((error) => console.log("Ошибка:", error));
  }

  return (
    <div>
      Home
      <Button onClick={fetchWithAuth}>Проверить доступ с помощью JWT</Button>
    </div>
  );
}
