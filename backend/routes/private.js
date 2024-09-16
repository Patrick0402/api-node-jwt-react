import express from "express";
import { Prisma, PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient({
  omit: {
    user: {
      password: true,
    },
  },
});

router.get("/listar-usuarios", async (req, res) => {
  try {
    const users = await prisma.user.findMany();

    res.status(200).json({ message: "Usuários listados com sucesso", users });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Falha no servidor!" });
  }
});

export default router;
