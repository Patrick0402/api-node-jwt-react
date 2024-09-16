import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Cadastro from "./pages/Cadastro";
import Login from "./pages/Login";
import ListarUsuarios from "./pages/Lista";

function App() {
  return (
    <BrowserRouter>
      <header className="bg-indigo-500 text-white p-4 shadow-md">
        <h1 className="text-2xl font-bold text-center">Sistema de Cadastro</h1>
      </header>
      <Routes>
        <Route path="/" element={<Cadastro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/listar-usuarios" element={<ListarUsuarios />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
