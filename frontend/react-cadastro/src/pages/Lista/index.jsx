import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

function ListarUsuarios() {
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadUsers() {
      const token = localStorage.getItem("token");

      try {
        const response = await api.get("/api/listar-usuarios", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAllUsers(response.data.users); // Atualizado para acessar `response.data.users`
        setError(""); // Limpa mensagens de erro, se houver
      } catch (err) {
        console.error("Erro ao carregar os usuários:", err);
        setError("Erro ao carregar os usuários.");
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, []);

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-8 border border-gray-300 rounded-md shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Lista de Usuários
      </h2>
      {loading ? (
        <p className="text-center">Carregando...</p>
      ) : error ? (
        <p className="text-red-600 text-center">{error}</p>
      ) : (
        <ul className="space-y-2">
          {allUsers.length > 0 ? (
            allUsers.map((user) => (
              <li key={user.id} className="bg-gray-100 p-4 rounded-md">
                <p className="font-semibold">ID: {user.id}</p>
                <p className="font-semibold">Nome: {user.name}</p>
                <p className="font-semibold">E-mail: {user.email}</p>
              </li>
            ))
          ) : (
            <p className="text-center">Nenhum usuário encontrado.</p>
          )}
        </ul>
      )}
      <Link
        to="/login"
        className="text-indigo-700 hover:underline mt-4 block text-center"
      >
        Voltar à página de login
      </Link>
    </div>
  );
}

export default ListarUsuarios;
