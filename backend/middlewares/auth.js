// Funções de validação
const validarEmail = (email) => {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailPattern.test(email);
};

const validarNome = (name) => {
  if (typeof name !== 'string') return false;
  const namePattern = /^[a-zA-ZÀ-ÖØ-ÿ0-9 .'-]+$/i;
  return namePattern.test(name.trim());
};

const validarSenha = (password) => {
  const passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()_+])[A-Za-z\d@$!%*?&^#()_+]{12,}$/;
  return passwordPattern.test(password);
};

// Middleware para validar o corpo da requisição
const validarCadastro = (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Dados de cadastro incompletos." });
  }

  if (!validarNome(name)) {
    return res.status(400).json({ message: "Nome inválido." });
  }
  if (!validarEmail(email)) {
    return res.status(400).json({ message: "E-mail inválido." });
  }
  if (!validarSenha(password)) {
    return res.status(400).json({ message: "Senha inválida." });
  }

  next();
};

// Middleware para validar o corpo da requisição no login
const validarLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!validarEmail(email)) {
    return res.status(400).json({ message: "E-mail inválido." });
  }
  if (!validarSenha(password)) {
    return res.status(400).json({ message: "Senha inválida." });
  }

  next();
};

export { validarCadastro, validarLogin, validarEmail };
