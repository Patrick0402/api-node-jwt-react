import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

// Funções de validação
function validarEmail(email) {
  if (!email) return false; // Verifica se é null, undefined ou uma string vazia
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailPattern.test(email);
}

function validarNome(name) {
  if (!name) return false; // Verifica se é null, undefined ou uma string vazia
  // Permite letras, números, espaços e alguns caracteres especiais
  const namePattern = /^[a-zA-ZÀ-ÖØ-ÿ0-9 .'-]+$/i;
  return namePattern.test(name.trim());
}

function validarSenha(password) {
  if (!password) return false; // Verifica se é null, undefined ou uma string vazia
  // Pelo menos uma letra minúscula, uma maiúscula, um número, um caractere especial e no mínimo 12 caracteres
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()_+])[A-Za-z\d@$!%*?&^#()_+]{12,}$/;
  return passwordPattern.test(password);
}

// Função para cadastrar usuário
async function cadastrarUsuario(name, email, password) {
  try {
    console.log("Dados recebidos para cadastro:", { name, email });

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
}

// Rota de cadastro
router.post("/cadastro", async (req, res) => {
  const { name, email, password } = req.body;

  // Validar dados
  if (!validarNome(name)) {
    return res.status(400).json({ message: "Nome inválido." });
  }
  if (!validarEmail(email)) {
    return res.status(400).json({ message: "E-mail inválido." });
  }
  if (!validarSenha(password)) {
    return res.status(400).json({ message: "Senha inválida." });
  }

  // Verificar se o e-mail já está registrado
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

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
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Senha inválida!" });
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "10m" });

    res.status(200).json({ token });
  } catch (err) {
    console.error("Erro no login:", err);
    res.status(500).json({ message: "Erro no servidor, tente novamente!" });
  }
});

// Verificar se o e-mail já foi utilizado
router.post("/api/isUserAlreadyRegistered", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

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
