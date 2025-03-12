import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";

import cookieParser from "cookie-parser"; // Импортируем cookie-parser

const app = express();
const prisma = new PrismaClient();
app.use(express.json());
app.use(cookieParser()); // Подключаем middleware для работы с куками
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// const JWT_SECRET = "your_secret_key"; // JWT_SECRET нельзя хардкодить в коде! Он должен храниться в .env.

const formSchema = z.object({
  login: z.string().min(2, "Username must be at least 2 characters"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(20, "Password is too long")
    .regex(/[A-Z]/, "Пароль должен содержать хотя бы одну заглавную букву")
    .regex(/[0-9]/, "Пароль должен содержать хотя бы одну цифру"),
});

// Функция создания токенов
function generateTokens(userId, login) {
  const accessToken = jwt.sign({ userId, login }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
  return { accessToken, refreshToken };
}

app.post("/api/auth/signup", async (req, resp) => {
  const result = formSchema.safeParse(req.body);
  if (!result.success) {
    return resp
      .status(400)
      .json({ errors: result.error.flatten().fieldErrors });
  }

  const { login, password } = result.data;

  try {
    // 1. Проверяем, есть ли уже такой email в базе
    const existingUser = await prisma.user.findUnique({ where: { login } });
    if (existingUser) {
      return resp.status(400).json({ error: "Login уже занят" });
    }

    // 2. Хешируем пароль
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Создаём нового пользователя
    const newUser = await prisma.user.create({
      data: {
        login,
        password: hashedPassword,
      },
    });

    //Получаем сгенеренные токены
    const { accessToken, refreshToken } = generateTokens(
      newUser.id,
      newUser.login
    );

    //В тбл refreshToken доб нов запись
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: newUser.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    // 4. Генерируем JWT-токен
    // const token = jwt.sign(
    //   { userId: newUser.id, login: user.login },
    //   process.env.JWT_SECRET,
    //   {
    //     expiresIn: "1h",
    //   }
    // );

    // Отправляем токен в httpOnly Secure куки
    /*
    resp
      .cookie("token", token, {
        httpOnly: true,
        secure: true, // Отключите в dev-режиме, если используете HTTP
        sameSite: "strict",
        maxAge: 60 * 60 * 1000, // 1 час
      })
      .status(201)
      .json({ id: user.id, login: user.login, message: "Регистрация успешна" });
      */

    //Сохраняем оба токена в куки
    resp
      .cookie("token", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 60 * 60 * 1000,
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(201)
      .json({
        id: newUser.id,
        login: newUser.login,
        message: "Регистрация успешна",
      });
  } catch (error) {
    console.error(error);
    resp.status(500).json({ error: "Ошибка сервера" });
  }
});

app.post("/api/auth/signin", async (req, resp) => {
  const result = formSchema.safeParse(req.body);
  if (!result.success) {
    return resp
      .status(400)
      .json({ errors: result.error.flatten().fieldErrors });
  } else {
    const { login, password } = result.data;
    try {
      // 1. Проверяем, есть ли такой пользователь
      const user = await prisma.user.findUnique({ where: { login } });
      if (!user) {
        return resp.status(401).json({ error: "Неверный login" });
      }

      // 2. Сравниваем пароль с хешем в БД
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return resp.status(401).json({ error: "Неверный пароль" });
      }

      //Получаем сгенеренные токены
      const { accessToken, refreshToken } = generateTokens(user.id, user.login);

      // 3. Генерируем JWT-токен
      /*const token = jwt.sign(
        { userId: user.id, login: user.login },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h", // 7d
        }
      );
      */

      //upsert() - для обновления записи в тбл если она найдена или создания такой записи в тбл в случае её отсутствия:

      await prisma.refreshToken.upsert({
        where: { userId: user.id },
        update: {
          token: refreshToken,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
        create: {
          token: refreshToken,
          userId: user.id,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });

      // 4. токен
      /*  resp
        .cookie("token", token, {
          httpOnly: true,
          secure: true,
          sameSite: "strict",
          maxAge: 60 * 60 * 1000, // 1 час
        })
        .status(201)
        .json({
          id: user.id,
          login: user.login,
          message: "Вы успешно авторизованы",
        });*/
      resp
        .cookie("token", accessToken, {
          httpOnly: true,
          secure: true,
          sameSite: "strict",
          maxAge: 60 * 60 * 1000,
        })
        .cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: "strict",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        .status(201)
        .json({
          id: user.id,
          login: user.login,
          message: "Вы успешно авторизованы",
        });
    } catch (error) {
      console.error(error);
      resp.status(500).json({ error: "Ошибка сервера" });
    }
  }
});

// * Выход из системы *
app.post("/api/auth/signout", async (req, resp) => {
  const refreshToken = req.cookies.refreshToken;
  if (refreshToken) {
    await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
  }
  resp
    .clearCookie("token", { httpOnly: true, secure: true, sameSite: "strict" })
    .clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    })
    .json({ message: "Вы вышли" });
  /*
  resp
    .clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    })
    .json({ message: "Вы успешно вышли" });*/
});

app.get("/api/session", async (req, resp) => {
  const token = req.cookies.token;

  if (!token) {
    return resp.status(401).json({ error: "Не авторизован" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = { id: decoded.userId, login: decoded.login };
    resp.json(user);
  } catch (error) {
    resp.status(401).json({ error: "Токен недействителен" });
  }
});

// Обновление токена
app.post("/api/auth/refresh", async (req, resp) => {
  /*
  - Проверяет refresh-токен из куки.
  - Если токен валиден, генерирует новые access и refresh токены.
  - Обновляет refresh-токен в базе данных.
  - Отправляет новые токены в куки.
*/
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return resp.status(401).json({ error: "Не авторизован" });

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const dbToken = await prisma.refreshToken.findUnique({
      where: { userId: decoded.userId },
    });

    if (!dbToken || dbToken.token !== refreshToken)
      return resp.status(403).json({ error: "Недействительный refresh-токен" });

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(
      decoded.userId,
      decoded.login
    );

    await prisma.refreshToken.update({
      where: { userId: decoded.userId },
      data: {
        token: newRefreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    resp
      .cookie("token", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 60 * 60 * 1000,
      })
      .cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({ message: "Токены обновлены" });
  } catch (error) {
    resp.status(403).json({ error: "Недействительный токен" });
  }
});

app.listen(4000, () => console.log("Сервер запущен на порту 4000"));
