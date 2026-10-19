
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "./contexts/AuthContext";

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

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />

        <Route path="/homeAluno" element={<HomeAluno />} />
        <Route path="/homeProfessor" element={<HomeProfessor />} />
        <Route path="/admin" element={<HomeAdm />} />
        <Route path="/ranking" element={<Ranking />} />
        <Route path="/perfilProfessor" element={<PerfilProfessorPage />} />
        <Route path="/perfilAluno" element={<PerfilAlunoPage />} />
        <Route path="/licaoAluno" element={<LicaoAlunoPage />} />
        <Route path="/licaoProfessor" element={<LicaoProfessorPage />} />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
