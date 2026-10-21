import React from "react";
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";

import { auth } from "../services/firebase";
import { apiGet } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [perfil, setPerfil] = useState(null);
  const [usuarioBackend, setUsuarioBackend] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    let ativo = true;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!ativo) return;

      setUser(firebaseUser);
      setPerfil(null);
      setUsuarioBackend(null);
      setAuthError(null);
      setLoading(true);

      if (!firebaseUser) {
        setLoading(false);
        return;
      }

      try {
        const token = await firebaseUser.getIdToken();
        const dados = await apiGet("/api/auth/me", token);

        if (!ativo) return;

        if (
          !dados ||
          typeof dados !== "object" ||
          !dados.perfil ||
          typeof dados.perfil !== "object"
        ) {
          throw new Error(
            "O usuário não possui um perfil válido cadastrado."
          );
        }

        setUsuarioBackend(dados);
        setPerfil(dados.perfil);
      } catch (erro) {
        if (!ativo) return;

        setPerfil(null);
        setUsuarioBackend(null);
        setAuthError(
          erro.message || "Não foi possível validar o perfil."
        );
      } finally {
        if (ativo) {
          setLoading(false);
        }
      }
    });

    return () => {
      ativo = false;
      unsubscribe();
    };
  }, []);

  async function login(email, senha) {
    const resultado = await signInWithEmailAndPassword(
      auth,
      email,
      senha
    );

    return resultado.user;
  }

  async function logout() {
    await signOut(auth);
  }

  async function recuperarSenha(email) {
    await sendPasswordResetEmail(auth, email);
  }

  const autenticado = Boolean(user && usuarioBackend && perfil);
  const tipoPerfil = normalizarPerfil(perfil);

  return (
    <AuthContext.Provider
      value={{
        user,
        perfil,
        tipoPerfil,
        usuarioBackend,
        loading,
        authError,
        autenticado,
        login,
        logout,
        recuperarSenha,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth deve ser utilizado dentro de AuthProvider."
    );
  }

  return context;
}

function normalizarPerfil(perfil) {
  const nome = (perfil?.id || perfil?.nome || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();

  const perfisConhecidos = {
    aluno: "aluno",
    professor: "professor",
    administrador: "administrador",
    admin: "administrador",
  };

  return perfisConhecidos[nome] || null;
}
