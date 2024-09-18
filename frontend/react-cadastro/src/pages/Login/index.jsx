import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";

function Login() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const emailRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();

    setError(""); // Limpa mensagens de erro
    setLoading(true); // Inicia o carregamento

    try {
      const { data } = await api.post("/api/login", {
        email: emailRef.current.value,
        password: passwordRef.current.value,
      });

      const { token } = data;

      localStorage.setItem("token", token);

      navigate("/listar-usuarios");
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false); // Termina o carregamento
    }
  }

  function handleError(err) {
    if (err.response) {
      // Erros de resposta do servidor
      const { status, data } = err.response;
      if (status === 400 || status === 401) {
        setError("E-mail ou senha incorretos");
      } else {
        setError(data.message || "Erro inesperado");
      }
    } else if (err.request) {
      // Erros relacionados à requisição que não obteve resposta
      setError("Falha na comunicação com o servidor. Tente novamente.");
    } else {
      // Outros erros
      setError(`Erro: ${err.message}`);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 border border-gray-300 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Log in</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <input
          name="email"
          ref={emailRef}
          placeholder="E-mail"
          type="email"
          aria-label="E-mail"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
          required
        />
        <input
          name="password"
          ref={passwordRef}
          placeholder="Senha"
          type="password"
          aria-label="Senha"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
          required
        />
        {error && (
          <p className="text-red-600 text-center">{error}</p>
        )}
        <button
          type="submit"
          className={`w-full bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-400 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          disabled={loading}
        >
          {loading ? "Carregando..." : "Log In"}
        </button>
      </form>
      <Link
        to="/"
        className="text-indigo-700 hover:underline mt-4 block text-center"
      >
        Não possui uma conta? Cadastre-se aqui
      </Link>
    </div>
  );
}

export default Login;
