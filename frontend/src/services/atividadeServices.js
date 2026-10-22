
import { apiGet, apiPost, apiRequest } from "./api";

// Lista atividades, opcionalmente filtradas por lição
export async function listarAtividades(licaoId) {
  const query = licaoId
    ? `?licaoId=${encodeURIComponent(licaoId)}`
    : "";

  return apiGet(`/api/atividades${query}`);
}

// Consulta uma atividade pelo ID
export async function buscarAtividadePorId(id) {
  if (!id) {
    throw new Error("O ID da atividade é obrigatório.");
  }

  return apiGet(
    `/api/atividades/${encodeURIComponent(id)}`
  );
}

// Cria uma atividade (professor/administrador)
export async function criarAtividade(dados) {
  if (!dados || typeof dados !== "object") {
    throw new Error("Os dados da atividade são obrigatórios.");
  }

  return apiPost("/api/atividades", dados);
}

// Atualiza uma atividade (professor/administrador)
export async function atualizarAtividade(id, dados) {
  if (!id) {
    throw new Error("O ID da atividade é obrigatório.");
  }

  if (!dados || typeof dados !== "object") {
    throw new Error("Os dados para atualização são obrigatórios.");
  }

  return apiRequest(
    `/api/atividades/${encodeURIComponent(id)}`,
    {
      method: "PUT",
      body: dados,
    }
  );
}

// Remove uma atividade (professor/administrador)
export async function removerAtividade(id) {
  if (!id) {
    throw new Error("O ID da atividade é obrigatório.");
  }

  return apiRequest(
    `/api/atividades/${encodeURIComponent(id)}`,
    {
      method: "DELETE",
    }
  );
}


