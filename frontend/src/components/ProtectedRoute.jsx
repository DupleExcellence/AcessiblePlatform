import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ProtectedRoute({ perfisPermitidos }) {
  const {
    user,
    loading,
    autenticado,
    tipoPerfil,
  } = useAuth();

  const location = useLocation();

  // Aguarda a validação do Firebase e do backend.
  if (loading) {
    return <p>Validando autenticação...</p>;
  }

  // Sem sessão válida, redireciona para o login.
  if (!user || !autenticado) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  // Usuário autenticado, mas sem permissão para esta área.
  if (
    perfisPermitidos?.length &&
    !perfisPermitidos.includes(tipoPerfil)
  ) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
