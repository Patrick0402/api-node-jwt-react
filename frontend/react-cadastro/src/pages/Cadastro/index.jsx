import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

function Cadastro() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [messageError, setMessageError] = useState("");
  const [messageSuccess, setMessageSuccess] = useState("");

  // Função de validação de e-mail
  function isEmailValid(email) {
    if (!email) return false;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }

  // Função de validação de nome
  function isNameValid(name) {
    if (!name) return false;
    const namePattern = /^[a-zA-ZÀ-ÖØ-ÿ0-9 .'-]+$/i;
    return namePattern.test(name.trim());
  }

  // Função de validação de senha
  function isPasswordValid(password) {
    if (!password) return false;
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()_+])[A-Za-z\d@$!%*?&^#()_+]{12,}$/;
    return passwordPattern.test(password);
  }

  // Verifica se o usuário já está registrado
  async function isUserAlreadyRegistered() {
    try {
      const response = await api.post("/api/isUserAlreadyRegistered", { email });
      if (response.status === 200) {
        setMessageError("");
        setMessageSuccess("");
        return true;
      } else {
        setMessageError("Algo inesperado ocorreu");
        setMessageSuccess("");
        return false;
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          setMessageError("E-mail já está em uso");
        } else {
          setMessageError("Erro na verificação do e-mail. Tente novamente.");
        }
      } else {
        setMessageError("Erro na verificação do e-mail. Tente novamente.");
      }
      setMessageSuccess("");
      return false;
    }
  }

  // Função de submissão do formulário
  async function handleSubmit(event) {
    event.preventDefault();

    // Verifique se todos os campos estão preenchidos
    if (!name || !email || !password) {
      setMessageError("Todos os campos são obrigatórios.");
      setMessageSuccess("");
      return;
    }

    // Verifique se o e-mail é válido
    if (!isEmailValid(email)) {
      setMessageError("E-mail inválido.");
      setMessageSuccess("");
      return;
    }

    // Verifique se o nome é válido
    if (!isNameValid(name)) {
      setMessageError("Nome inválido.");
      setMessageSuccess("");
      return;
    }

    // Verifique se a senha é válida
    if (!isPasswordValid(password)) {
      setMessageError("Senha inválida. Deve ter pelo menos 12 caracteres, incluindo letras maiúsculas, minúsculas, números e caracteres especiais.");
      setMessageSuccess("");
      return;
    }

    try {
      const isAvailable = await isUserAlreadyRegistered();

      if (!isAvailable) {
        return;
      }

      await api.post("/api/cadastro", { name, email, password });
      setMessageSuccess("Usuário cadastrado com sucesso!");
      setMessageError("");
    } catch (err) {
      console.error("Erro no cadastro:", err); // Adicionando log para depuração
      setMessageError("Erro no cadastro. Tente novamente.");
      setMessageSuccess("");
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 border border-gray-300 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Cadastro</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <input
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nome"
          type="text"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
        />
        <input
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail"
          type="email"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
        />
        <input
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Senha"
          type="password"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
        />

        {messageError && <p className="text-red-600 text-center">{messageError}</p>}
        {messageSuccess && <p className="text-green-600 text-center">{messageSuccess}</p>}

        <button
          type="submit"
          className="w-full bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-400"
        >
          Cadastrar-se
        </button>
      </form>

      <Link
        to="/login"
        className="text-indigo-700 hover:underline mt-4 block text-center"
      >
        Já tem uma conta? Entre aqui
      </Link>
    </div>
  );
}

export default Cadastro;
