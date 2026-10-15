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
import Ranking from "./pages/Ranking/Ranking";
import PerfilProfessorPage from "./pages/PerfilProfessor/PerfilProfessor";
import PerfilAlunoPage from "./pages/PerfilAluno/PerfilAluno";
import LicaoAlunoPage from "./pages/LicaoAluno/LicaoAluno";
import LicaoProfessorPage from "./pages/LicaoProfessor/LicaoProfessor";

function App() {
  return (
    <Routes>
      {/* Rota inicial */} 
      {/* <Route
        path="/"
        element={<Navigate to="/login" replace />}
      />

      {/* Acesso público */}
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />

      {/* Áreas dos usuários */}
      <Route path="/homeAluno" element={<HomeAluno />} />
      <Route path="/homeProfessor" element={<HomeProfessor />} />
      <Route path="/admin" element={<HomeAdm />} />
      <Route path="api/ranking" element={<Ranking />} /> 
      <Route path="/perfilProfessor" element={<PerfilProfessorPage/>}/>
      <Route path="/licaoAluno" element={<LicaoAlunoPage/>}/>
      <Route path="/licaoProfessor" element={<LicaoProfessorPage/>}/>
      <Route path="/PerfilAluno" element={<PerfilAlunoPage/>}/>
      {/* Página não encontrada */}
      {/* <Route
        path="*"
        element={<Navigate to="/login" replace />} */}
        
    
    </Routes>
    
    // <LicaoAluno/>
  
    
  );
}

export default App;
