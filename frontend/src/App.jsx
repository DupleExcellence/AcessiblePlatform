
import React from "react";
import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { AuthProvider, useAuth } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login/Login";
import Cadastro from "./pages/Cadastro/Cadastro";
import HomeAdm from "./pages/HomeAdm/HomeAdm";
import HomeAluno from "./pages/HomeAluno/HomeAluno";
import HomeProfessor from "./pages/HomeProfessor/HomeProfessor";
import Ranking from "./pages/Ranking/Ranking";
import PerfilProfessorPage from "./pages/PerfilProfessor/PerfilProfessor";
import PerfilAlunoPage from "./pages/PerfilAluno/PerfilAluno";
import LicaoAlunoPage from "./pages/LicaoAluno/LicaoAluno";
import LicaoProfessorPage from "./pages/LicaoProfessor/LicaoProfessor";

function AppHomeRedirect() {
  const {
    user,
    loading,
    autenticado,
    tipoPerfil,
  } = useAuth();

  if (loading) {
    return <p>Validando autenticação...</p>;
  }

  if (!user || !autenticado) {
    return <Navigate to="/login" replace />;
  }

  const paginasPorPerfil = {
    aluno: "/homeAluno",
    professor: "/homeProfessor",
    administrador: "/admin",
  };

  return (
    <Navigate
      to={paginasPorPerfil[tipoPerfil] || "/login"}
      replace
    />
  );
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />

        {/* Página inicial conforme o perfil */}
        <Route path="/" element={<AppHomeRedirect />} />

        {/* Área do aluno */}
        <Route element={<ProtectedRoute perfisPermitidos={["aluno"]} />}>
          <Route path="/homeAluno" element={<HomeAluno />} />
          <Route path="/perfilAluno" element={<PerfilAlunoPage />} />
          <Route path="/licaoAluno" element={<LicaoAlunoPage />} />
        </Route>

        {/* Área do professor */}
        <Route element={<ProtectedRoute perfisPermitidos={["professor"]} />}>
          <Route path="/homeProfessor" element={<HomeProfessor />} />
          <Route path="/perfilProfessor" element={<PerfilProfessorPage />} />
          <Route path="/licaoProfessor" element={<LicaoProfessorPage />} />
        </Route>

        {/* Área administrativa */}
        <Route element={<ProtectedRoute perfisPermitidos={["administrador"]} />}>
          <Route path="/admin" element={<HomeAdm />} />
        </Route>

        {/* Ranking: qualquer perfil autenticado */}
        <Route element={<ProtectedRoute />}>
          <Route path="/ranking" element={<Ranking />} />
        </Route>

        {/* Rotas inexistentes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
