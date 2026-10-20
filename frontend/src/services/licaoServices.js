
import { apiGet, apiPost, apiRequest } from "./api";

export async function buscarLicoes(cursoId) {
  const caminho = cursoId
    ? `/api/licoes?cursoId=${encodeURIComponent(cursoId)}`
    : "/api/licoes";

  const resultado = await apiGet(caminho);

  if (!Array.isArray(resultado)) {
    throw new Error("A API retornou uma lista de lições inválida.");
  }

  return resultado;
}

export async function buscarLicaoPorId(id) {
  if (!id) throw new Error("O ID da lição é obrigatório.");

  return apiGet(`/api/licoes/${encodeURIComponent(id)}`);
}

export async function criarLicao(dados) {
  return apiPost("/api/licoes", dados);
}

export async function atualizarLicao(id, dados) {
  if (!id) throw new Error("O ID da lição é obrigatório.");

  return apiRequest(`/api/licoes/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: dados,
  });
}

export async function excluirLicao(id) {
  if (!id) throw new Error("O ID da lição é obrigatório.");

  return apiRequest(`/api/licoes/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}
