import express from "express";
import publicRoutes from "./routes/public.js";
import privateRoutes from "./routes/private.js";
import auth from "./middlewares/auth.js";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors('http://localhost/5173'));

app.use("/", publicRoutes);
app.use("/", auth, privateRoutes);

/*No mínimo três rotas:
Públicas
    -Cadastro
    -Login

Privadas
    -Listar usuários
*/

app.listen(3000, () => console.log("Servidor rodando!"));
