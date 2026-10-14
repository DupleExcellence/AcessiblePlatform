import React from "react";
import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";


import Login from "./pages/Login/Login";
import HomeAdm from "./pages/HomeAdm/HomeAdm";
import HomeAluno from "./pages/HomeAluno/HomeAluno";
import Cadastro from "./pages/Cadastro/Cadastro";
import HomeProfessor from "./pages/HomeProfessor/HomeProfessor";



function App() {
  return (
    <Routes>
      {/* Rota inicial */}
      {/* <Route
        path="/"
        element={<Navigate to="/login" replace />}
      /> */}

      {/* Acesso público */}
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />

      {/* Áreas dos usuários */}
      <Route path="/HomeAluno" element={<HomeAluno />} />
      <Route path="/HomeProfessor" element={<HomeProfessor />} />
      <Route path="/admin" element={<HomeAdm />} />

      {/* Página não encontrada */}
      {/* <Route
        path="*"
        element={<Navigate to="/login" replace />}
      /> */}
    </Routes>
  );
}

export default App;
