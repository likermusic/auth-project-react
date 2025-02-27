import express from "express";
import cors from "cors";
// import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";

const app = express();
// const prisma = new PrismaClient();
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// const JWT_SECRET = "your_secret_key";

const formSchema = z.object({
  login: z.string().min(2, "Username must be at least 2 characters"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(20, "Password is too long")
    .regex(/[A-Z]/, "Пароль должен содержать хотя бы одну заглавную букву")
    .regex(/[0-9]/, "Пароль должен содержать хотя бы одну цифру"),
});

app.post("/api/auth/signin", async (req, resp) => {
  const result = formSchema.safeParse(req.body);
  if (!result.success) {
    // console.log(result.error.flatten().fieldErrors);

    // return resp.status(400).json({ errors: result.error.flatten() });
    // Метод .flatten() преобразует сложный объект ошибок в более простой и удобный для использования формат.
    // Он возвращает объект с двумя свойствами: formErrors — ошибки, связанные с формой в целом (например, если форма не прошла валидацию на уровне всей структуры).
    // fieldErrors — ошибки, связанные с конкретными полями формы.
    return resp
      .status(400)
      .json({ errors: result.error.flatten().fieldErrors });
  } else {
    return resp.status(200).json("ok boy");
  }
  const { login, password } = result.body;
  console.log(login, password);

  // const hashedPassword = await bcrypt.hash(password, 10);

  // try {
  //   const user = await prisma.user.create({
  //     data: { email, password: hashedPassword },
  //   });
  //   res.json(user);
  // } catch (error) {
  //   res.status(400).json({ message: "Email уже зарегистрирован" });
  // }
});

// app.post("/api/auth/login", async (req, res) => {
//   const { email, password } = req.body;
//   const user = await prisma.user.findUnique({ where: { email } });

//   if (!user || !(await bcrypt.compare(password, user.password))) {
//     return res.status(401).json({ message: "Неверные данные" });
//   }

//   const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1h" });
//   res.json({ token });
// });

app.listen(4000, () => console.log("Сервер запущен на порту 4000"));
