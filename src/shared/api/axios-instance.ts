import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../constants/routes";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api",
  withCredentials: true, // Чтобы передавались cookies
});

// Автоматическое обновление токена при 401 (Unauthorized)
api.interceptors.response.use(
  //api.interceptors.response.use: Добавляет интерсептор для обработки ответов от сервера.
  (response) => response, //при успешном ответе. Она просто возвращает ответ без изменений
  async (error) => {
    // в сдучае ошибки
    const originalRequest = error.config; // копируем конфиг исходного запроса:
    // По сути, это набор настроек для запроса, включающий:
    // url — куда отправляется запрос
    // method — метод (GET, POST, PUT, DELETE и т. д.)
    // headers — заголовки запроса
    // params — параметры в URL (если есть)
    // data — тело запроса (если это POST/PUT)
    // Другие настройки, например timeout, auth и т. д.

    if (error.response.status === 401 && !originalRequest._retry) {
      // Проверяем, на ошибка ошибкой 401 Unauthorized. Это означает, что access-токен истёк или недействителен.
      // !originalRequest._retry: Проверяем, не был ли запрос уже повторно отправлен (чтобы избежать бесконечного цикла). То есть если уже был retry по этому запросу то Стоп
      originalRequest._retry = true; //устанавливаем флаг в true. Теперь повторного перезапроса не проихойдет
      const navigate = useNavigate();

      try {
        await api.post(
          "/auth/refresh", //Отправляем запрос на обновление токенов.
          {}
        );
        return api(originalRequest); // Если токен успешно обновлён, повторно отправляем оригинальный запрос с новым токеном
      } catch (refreshError) {
        // если не удалось обновить токены
        console.error("Ошибка обновления токена", refreshError);
        navigate(`/${ROUTES.SIGNIN}`); // Перенаправляем на страницу входа
        return Promise.reject(refreshError); // Прерываем цикл
      }
    }

    return Promise.reject(error);
  }
);
