import express from 'express';
import publicRoutes from './routes/public.js'; // Rotas públicas (cadastro, login, verificação de e-mail)
import privateRoutes from './routes/private.js'; // Rotas privadas (listar usuários)
import authJWT from './middlewares/authJWT.js'; // Middleware de autenticação JWT
import cors from 'cors';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config();

const app = express();

// Configuração do middleware
app.use(express.json());

// Configuração do CORS
app.use(cors({
    origin: 'http://localhost:5173' // Permitir requisições apenas do frontend local
}));

// Rotas Públicas
app.use('/api', publicRoutes); // Aplica as rotas públicas sem autenticação

// Rotas Privadas
app.use('/api', authJWT, privateRoutes); // Prefixo /api para rotas privadas com autenticação

// Inicialização do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
