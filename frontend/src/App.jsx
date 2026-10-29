
import React from "react";
import {
  Routes,
  Route,
  Navigate,
  Link,
} from "react-router-dom";

import { AuthProvider, useAuth } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Cursos from "./pages/Cursos/Cursos";
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
import AtividadeProfessor from "./pages/AtividadeProfessor/AtividadeProfessor";
import AtividadesProfessor from "./pages/AtividadesProfessor/AtividadesProfessor";
import PerfilAdm from "./components/PerfilAdm/PerfilAdm";
import CadastroCurso from "./pages/CadastroCurso/CadastroCurso";
import NotasAluno from "./pages/NotasAluno/NotasAluno";
import ProgressoAluno from "./pages/ProgressoAluno/ProgressoAluno";
import EscutaGlobal from "./components/EscutaGlobal/EscutaGlobal";
function AppHomeRedirect() {
  const { user, loading, autenticado, tipoPerfil } = useAuth();

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

  const destino = paginasPorPerfil[tipoPerfil];

  if (!destino) {
    return (
      <main>
        <h1>Perfil não identificado</h1>
        <p>
          Não foi possível identificar seu perfil de acesso.
          Entre novamente ou solicite suporte.
        </p>
        <Link to="/login">Ir para o login</Link>
      </main>
    );
  }

  return <Navigate to={destino} replace />;
}

function PaginaNaoEncontrada() {
  const { user, autenticado, tipoPerfil, loading } = useAuth();

  if (loading) {
    return <p>Validando autenticação...</p>;
  }

  const paginasPorPerfil = {
    aluno: "/homeAluno",
    professor: "/homeProfessor",
    administrador: "/admin",
  };

  const inicio =
    user && autenticado
      ? paginasPorPerfil[tipoPerfil] || "/"
      : "/login";

  return (
    <main
      style={{
        maxWidth: "600px",
        margin: "80px auto",
        padding: "24px",
        textAlign: "center",
      }}
    >
      <h1>404 — Página não encontrada</h1>
      <p>
        O endereço acessado não corresponde a uma página
        disponível no Alfabits.
      </p>
      <Link to={inicio}>Voltar para a página inicial</Link>
    </main>
  );
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Rota pública */}
        <Route path="/login" element={<Login />} />

        {/* Redirecionamento inicial */}
        <Route path="/" element={<AppHomeRedirect />} />

        
        {/* Área do aluno */}
        <Route element={<ProtectedRoute perfisPermitidos={["aluno"]} />}>
          <Route path="/homeAluno" element={<HomeAluno />} />
          <Route path="/perfilAluno" element={<PerfilAlunoPage />} />
          <Route path="/licaoAluno" element={<LicaoAlunoPage />} />
          <Route path="/notasAluno" element={<NotasAluno />} />
          <Route path="/progressoAluno" element={<ProgressoAluno />} />
        </Route>


        {/* Cursos: aluno, professor e administrador */}
        <Route
          element={
            <ProtectedRoute
              perfisPermitidos={["aluno", "professor", "administrador"]}
            />
          }
        >
          <Route path="/cursos" element={<Cursos />} />
        </Route>

        {/* Área do professor */}
        <Route element={<ProtectedRoute perfisPermitidos={["professor"]} />}>
          <Route path="/homeProfessor" element={<HomeProfessor />} />
          <Route path="/perfilProfessor" element={<PerfilProfessorPage />} />
          <Route path="/licaoProfessor" element={<LicaoProfessorPage />} />
          <Route
            path="/atividadeProfessor"
            element={<AtividadeProfessor />}
          />
          <Route
            path="/atividadesProfessor"
            element={<AtividadesProfessor />}
          />
        </Route>

        {/* Área administrativa */}
        <Route
          element={
            <ProtectedRoute perfisPermitidos={["administrador"]} />
          }
        >
          <Route path="/admin" element={<HomeAdm />} />
          <Route path="/perfilAdm" element={<PerfilAdm />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/cadastro-curso" element={<CadastroCurso />} />
        </Route>

        {/* Ranking: qualquer usuário autenticado */}
        <Route element={<ProtectedRoute />}>
          <Route path="/ranking" element={<Ranking />} />
        </Route>

        {/* Endereços inexistentes */}
        <Route path="*" element={<PaginaNaoEncontrada />} />
      </Routes>
     <EscutaGlobal />
    </AuthProvider>
  );
}

export default App;
