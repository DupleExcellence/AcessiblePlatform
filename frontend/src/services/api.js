

import { auth } from "./firebase";

const API_URL = import.meta.env.VITE_API_URL;

export async function apiRequest(
  caminho,
  {
    method = "GET",
    body,
    headers = {},
    token,
    ...opcoes
  } = {}
) {
  if (!API_URL) {
    throw new Error("Configure VITE_API_URL no arquivo .env");
  }

  const cabecalhos = {
    Accept: "application/json",
    ...headers,
  };

  if (body !== undefined) {
    cabecalhos["Content-Type"] = "application/json";
  }

  const usuario = auth.currentUser;
  const idToken = token
    ? token
    : usuario
      ? await usuario.getIdToken()
      : null;

  if (idToken) {
    cabecalhos.Authorization = `Bearer ${idToken}`;
  }

  const baseURL = API_URL.replace(/\/+$/, "");
  const endpoint = caminho.replace(/^\/+/, "");
  const url = `${baseURL}/${endpoint}`;

  let resposta;

  try {
    resposta = await fetch(url, {
      ...opcoes,
      method,
      headers: cabecalhos,
      body:
        body === undefined
          ? undefined
          : JSON.stringify(body),
    });
  } catch (erro) {
    throw new Error(
      `Não foi possível conectar à API: ${erro.message}`
    );
  }

  const texto = await resposta.text();
  let dados = null;

  if (texto) {
    try {
      dados = JSON.parse(texto);
    } catch {
      dados = texto;
    }
  }

  if (!resposta.ok) {
    const mensagem =
      typeof dados === "object" && dados !== null
        ? dados.erro || dados.detail || dados.message
        : dados;

    throw new Error(
      `API ${resposta.status}: ${
        mensagem || resposta.statusText
      }`
    );
  }

  return dados;
}

export function apiGet(caminho, token) {
  return apiRequest(caminho, {
    method: "GET",
    token,
  });
}

export function apiPost(caminho, body, token) {
  return apiRequest(caminho, {
    method: "POST",
    body,
    token,
  });
}

export async function testarConexaoAPI() {
  return apiGet("/api/cursos");
}
