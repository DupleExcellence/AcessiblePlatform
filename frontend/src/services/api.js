
import { auth } from "./firebase";

const API_URL = import.meta.env.VITE_API_URL;
console.log("URL da API:", API_URL);

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
    throw new Error(
      "Configure VITE_API_URL no arquivo .env"
    );
  }

  const cabecalhos = {
    Accept: "application/json",
    ...headers,
  };

  if (body !== undefined) {
    cabecalhos["Content-Type"] = "application/json";
  }

  // Permite token explícito ou usa o usuário Firebase atual.
  const usuario = auth.currentUser;

  if (token) {
    cabecalhos.Authorization = `Bearer ${token}`;
  } else if (usuario) {
    const idToken = await usuario.getIdToken();
    cabecalhos.Authorization = `Bearer ${idToken}`;
  }

  let resposta;

  try {
    resposta = await fetch(
      `${API_URL.replace(/\/+$/, "")}/${caminho.replace(/^\/+/, "")}`,
      {
        ...opcoes,
        method,
        headers: cabecalhos,
        body:
          body === undefined
            ? undefined
            : JSON.stringify(body),
      }
    );
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
  const resultado = await apiGet("/api/cursos");

  console.log("Resposta da API:", resultado);

  return resultado;
}
