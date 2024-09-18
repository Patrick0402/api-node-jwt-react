import jwt from "jsonwebtoken";

const authJWT = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Assumindo que o token está no formato "Bearer token"

  if (!token) {
    return res.status(401).json({ message: "Token não fornecido" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Token inválido" });
    }

    req.user = decoded; // Adiciona o usuário decodificado ao objeto de requisição
    next();
  });
};

export default authJWT;
