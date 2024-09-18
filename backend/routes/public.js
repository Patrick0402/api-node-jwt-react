import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { validarCadastro, validarLogin, validarEmail } from '../middlewares/auth.js'; // Corrigido o caminho e importações

const prisma = new PrismaClient();
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

// Função para cadastrar usuário
const cadastrarUsuario = async (name, email, password) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    return await prisma.user.create({
      data: {
        email,
        name,
        password: hashPassword,
      },
    });
  } catch (err) {
    console.error("Erro no cadastro:", err);
    throw new Error("Erro ao cadastrar usuário");
  }
};

// Rota de cadastro
router.post("/cadastro", validarCadastro, async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return res.status(400).json({ message: "O e-mail já está em uso!" });
    }

    const newUser = await cadastrarUsuario(name, email, password);
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Erro ao verificar e-mail ou cadastrar usuário:", error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
});

// Rota de login
router.post("/login", validarLogin, async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Senha inválida!" });
    }

    if (!JWT_SECRET) {
      return res.status(500).json({ message: "JWT Secret não está configurado." });
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "10m" });
    res.status(200).json({ token });
  } catch (err) {
    console.error("Erro no login:", err);
    res.status(500).json({ message: "Erro no servidor, tente novamente!" });
  }
});

// Rota para verificar se o e-mail já está registrado
router.post("/isUserAlreadyRegistered", async (req, res) => {
  const { email } = req.body;

  if (!validarEmail(email)) {
    return res.status(400).json({ message: "E-mail inválido." });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (user) {
      return res.status(400).json({ message: "O e-mail já está em uso!" });
    }

    res.status(200).json({ message: "O e-mail está disponível" });
  } catch (error) {
    console.error("Erro ao verificar e-mail:", error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
});

export default router;
