
import {
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { auth } from "../firebase";
import { apiRequest } from "./api";

// Login diretamente pelo Firebase Authentication
export async function login(email, senha) {
  try {
    const credencial =
      await signInWithEmailAndPassword(
        auth,
        email.trim(),
        senha
      );

    // Confirma que conseguimos obter o ID token
    await credencial.user.getIdToken();

    return credencial.user;
  } catch (erro) {
    console.error(
      "Falha no login:",
      erro.code,
      erro.message
    );

    throw erro;
  }
}

// Logout pelo Firebase Authentication
export async function logout() {
  await signOut(auth);
}

// Cadastro pelo endpoint existente no backend
export async function cadastrarUsuario(dados) {
  return apiRequest("/api/auth/cadastro", {
    method: "POST",
    body: dados,
  });
}
