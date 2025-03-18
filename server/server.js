import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";

import cookieParser from "cookie-parser"; // Импортируем cookie-parser

import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import nodemailer from "nodemailer";

const app = express();
const prisma = new PrismaClient();
app.use(express.json());
app.use(cookieParser()); // Подключаем middleware для работы с куками
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use(passport.initialize()); // Инициализация Passport чтобы подключить ниже стратегии аутентификации

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

// Настройка Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:4000/api/auth/google/callback", // URL-адрес, на который Google перенаправит пользователя после завершения аутентификации (это ниже метод есть) чтобы там сохранить токены
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("Google profile:", profile); // Данные о юзере от Гугла

        // Проверяем, что profile.id существует
        if (!profile.id) {
          throw new Error("Google ID не получен");
        }

        // Поиск пользователя по googleId в prisma
        let user = await prisma.user.findUnique({
          where: { googleId: profile.id },
        });

        if (!user) {
          // Если в БД юзера не нашли то в итоге нужно создать такого юзера в БД
          // Проверяем, что email существует
          if (!profile.emails || !profile.emails[0]?.value) {
            throw new Error("Email не получен от Google");
          }

          // Проверяем, не занят ли login другим пользователем
          const existingUser = await prisma.user.findUnique({
            where: { login: profile.emails[0].value },
          });

          if (existingUser) {
            // Если пользователь с таким email уже есть в БД, но без googleId,
            // можно либо связать аккаунты, либо вернуть ошибку
            throw new Error("Email уже используется другим аккаунтом");
          }

          user = await prisma.user.create({
            // Перезаписываем перем user и кладем в нее созданного сейчас юзера
            data: {
              googleId: profile.id,
              login: profile.emails[0].value,
              displayName:
                profile.displayName || profile.emails[0].value.split("@")[0],
              // password не нужен для Google auth
            },
          });
        }

        // Генерируем токены авт-и. Сюда придет по-любому user или найденный сразу или созданный
        const tokens = generateTokens(user.id, user.login);

        return done(null, { user, tokens }); //done уведомляет Passport.js о результате аутентификации пользователя. 1й парам null - если нет ошибки, 2й -аутентифицир-й юзер
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// Сериализация пользователя
passport.serializeUser((user, done) => {
  // определяет какую информацию о пользователе будет хранить сессия. В данном случае user.id. Вызывается в момент, когда пользователь успешно аутентифицируется
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  // для извлечения полной информации о пользователе. Вызывается каждый раз, когда запрашивается маршрут, защищенный аутентификацией когда нужно аутентифицир юзера
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Роуты Google авторизации
app.get(
  "/api/auth/google", // это роут который дергаем с фронта
  passport.authenticate("google", {
    // перенаправляет пользователя на страницу аутентификации Google
    scope: ["profile", "email"], //какую информацию мы запрашиваем у Google
    session: false, // Отключаем сессии, мы ее не исп
  })
);

app.get(
  "/api/auth/google/callback",
  passport.authenticate("google", {
    //запускается когда юзер перенаправлен обратно из Google
    failureRedirect: "http://localhost:5173", // куда редирект если фейл
    session: false,
  }),
  async (req, resp) => {
    try {
      const { user, tokens } = req.user; // вытягиваются данные которые вернул гугл и сгенеренные нами токены

      // Сохранение refresh token в базе
      await prisma.refreshToken.upsert({
        where: { userId: user.id },
        update: {
          token: tokens.refreshToken,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
        create: {
          token: tokens.refreshToken,
          userId: user.id,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });

      // Установка кук и отправка ответа
      resp
        .cookie("token", tokens.accessToken, {
          httpOnly: true,
          // secure: process.env.NODE_ENV === "production",
          secure: true,
          sameSite: "strict",
          maxAge: 60 * 60 * 1000,
        })
        .cookie("refreshToken", tokens.refreshToken, {
          httpOnly: true,
          // secure: process.env.NODE_ENV === "production",
          secure: true,
          sameSite: "strict",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        .status(201)
        .redirect("http://localhost:5173");
    } catch (error) {
      console.error(error);
      resp.status(500).json({ error: "Ошибка сервера" });
    }
  }
);

/*
app.post("/api/auth/google", async (req, resp) => {
  const token = req.cookies.token;
  console.log(token);

  return;
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    console.log(ticket);

    const { email, name, sub } = ticket.getPayload();

    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      user = await prisma.user.create({
        data: { login: name, email, googleId: sub },
      });
    }

    const { accessToken, refreshToken } = generateTokens(user.id, user.login);

    // Сохраняем токены в куки
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
      .status(200)
      .json({ id: user.id, login: user.login, message: "Авторизация успешна" });
  } catch (error) {
    console.error("Ошибка авторизации через Google:", error);
    resp.status(401).json({ error: "Ошибка авторизации" });
  }
});
*/
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
  // if (!refreshToken) return resp.status(400).json({ error: "Не авторизован" });

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

// Функция для отправки писем
export const sendEmail = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST, //В Настройка почты берем Имя сервера исходящей почты
    port: 465, // В Настройка почты SMTP SSL/TLS порт
    secure: true,
    auth: {
      // user: process.env.SMTP_USER,
      user: process.env.SMTP_USER, //В Настройка почты отправитель
      // pass: process.env.SMTP_PASS,
      pass: process.env.SMTP_pass, //В Настройка почты
    },
    tls: {
      rejectUnauthorized: false, // Отключает проверку сертификата
    },
  });

  await transporter.sendMail({
    from: `"Support" <${process.env.SMTP_USER}>`, // адрес должен совпадать с user
    to,
    subject,
    html,
  });
};

// 1. Endpoint для запроса восстановления пароля
app.post("/api/auth/forgot-password", async (req, resp) => {
  //Здесь должна б вализация на Пароль

  //const { login, email } = req.body; // вместо логинов будет почта и тогда сюда будет приходить только почта

  const login = "user1";
  const email = "drumliker@mail.ru";
  const user = await prisma.user.findUnique({ where: { login } });

  if (!user) return resp.status(404).json({ error: "Пользователь не найден" });

  // const resetToken = crypto.randomBytes(32).toString("hex");
  // const resetTokenHash = crypto
  //   .createHash("sha256")
  //   .update(resetToken)
  //   .digest("hex");

  // await prisma.user.update({
  //   where: { login },
  //   data: {
  //     resetToken: resetTokenHash,
  //     resetTokenExpires: new Date(Date.now() + 3600000),
  //   },
  // });

  // const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}&email=${login}`;
  const resetToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
  const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
  await sendEmail(
    email, // сюда подставится email юзера который он введет
    "Восстановление пароля",
    `<p>Перейдите по ссылке, чтобы сбросить пароль: <a href="${resetLink}">Сбросить пароль</a></p>`
  );

  resp
    .cookie("resetToken", resetToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    })
    .json({ message: "Ссылка для восстановления пароля отправлена" });
});

// 2. Endpoint для сброса пароля
app.post("/api/auth/reset-password", async (req, resp) => {
  const { newPassword } = req.body;
  const token = req.cookies.resetToken;

  if (!token) {
    return resp.status(401).json({ error: "Токен не найден" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    }); // нашли этого юзера в БД
    if (!user) {
      return resp.status(404).json({ error: "Пользователь не найден" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: decoded.userId },
      data: { password: hashedPassword },
    });

    //обнулить временный токен
    resp
      .clearCookie("resetToken", {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      })
      .json({ message: "Пароль успешно обновлен" });
    //редирект на авторизацию
  } catch (error) {
    resp.status(400).json({ error: "Неверный или истёкший токен" });
  }
});

app.listen(4000, () => console.log("Сервер запущен на порту 4000"));
