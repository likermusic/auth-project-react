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

    // 4. Генерируем JWT-токен
    const token = jwt.sign(
      { userId: newUser.id, login: user.login },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    // Отправляем токен в httpOnly Secure куки
    resp
      .cookie("token", token, {
        httpOnly: true,
        secure: true, // Отключите в dev-режиме, если используете HTTP
        sameSite: "strict",
        maxAge: 60 * 60 * 1000, // 1 час
      })
      .status(201)
      .json({ message: "Регистрация успешна" });
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
        return resp.status(401).json({ error: "Неверный login или пароль" });
      }

      // 2. Сравниваем пароль с хешем в БД
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return resp.status(401).json({ error: "Неверный login или пароль" });
      }

      // 3. Генерируем JWT-токен
      const token = jwt.sign(
        { userId: user.id, login: user.login },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h", // 7d
        }
      );

      // 4. токен
      resp
        .cookie("token", token, {
          httpOnly: true,
          secure: true,
          sameSite: "strict",
          maxAge: 60 * 60 * 1000, // 1 час
        })
        .status(201)
        .json({ message: "Вы успешно авторизованы" });
    } catch (error) {
      console.error(error);
      resp.status(500).json({ error: "Ошибка сервера" });
    }
  }
});

// * Выход из системы *
app.post("/api/auth/logout", (req, resp) => {
  resp
    .clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    })
    .json({ message: "Вы успешно вышли" });
});

// * Проверка аутентификации *
app.get("/api/protected", async (req, resp) => {
  const token = req.cookies.token;
  console.log(token);

  if (!token) {
    return resp.status(401).json({ error: "Не авторизован" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, login: true },
    });

    if (!user) {
      return resp.status(401).json({ error: "Пользователь не найден" });
    }

    resp.json(user);
  } catch (error) {
    resp.status(401).json({ error: "Токен недействителен" });
  }
});

app.listen(4000, () => console.log("Сервер запущен на порту 4000"));
