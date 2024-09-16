import { useRef } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

function Cadastro() {
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      await api.post("/cadastro", {
        name: nameRef.current.value,
        email: emailRef.current.value,
        password: passwordRef.current.value,
      });
      console.log("usuário cadastrado!");
    } catch (err) {
      console.log("erro no cadastro!");
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 border border-gray-300 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Cadastro
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <input
          ref={nameRef}
          placeholder="Nome"
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
        />
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
