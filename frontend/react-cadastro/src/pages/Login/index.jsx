import { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";

function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const { data: token } = await api.post("/login", {
        email: emailRef.current.value,
        password: passwordRef.current.value,
      });

      localStorage.setItem("token", token);

      navigate("/listar-usuarios");
    } catch (err) {
      alert("Senha ou e-mail incorretos");
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 border border-gray-300 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Log in
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <input
          ref={emailRef}
          placeholder="E-mail"
          type="email"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
        />
        <input
          ref={passwordRef}
          placeholder="Senha"
          type="password"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
        />
        <button className="w-full bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-400 ">
          Log In
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
