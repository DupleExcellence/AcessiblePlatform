
import { apiGet, apiPost } from "./api";

export async function listarNotas(filtros = {}) {
  const params = new URLSearchParams();

  if (filtros.atividadeId) {
    params.set("atividadeId", filtros.atividadeId);
  }

  const query = params.toString();

  return apiGet(`/api/notas${query ? `?${query}` : ""}`);
}

export async function buscarNotaPorId(id) {
  if (!id) {
    throw new Error("O ID da nota é obrigatório.");
  }

  return apiGet(`/api/notas/${encodeURIComponent(id)}`);
}

export async function corrigirEntrega({
  entregaId,
  alunoId,
  atividadeId,
  pontuacao,
  pontuacaoMaxima,
  feedback = "",
}) {
  if (!entregaId || !alunoId || !atividadeId) {
    throw new Error(
      "Os IDs da entrega, do aluno e da atividade são obrigatórios."
    );
  }

  if (
    !Number.isInteger(pontuacao) ||
    !Number.isInteger(pontuacaoMaxima) ||
    pontuacao < 0 ||
    pontuacaoMaxima <= 0 ||
    pontuacao > pontuacaoMaxima
  ) {
    throw new Error(
      "Informe uma pontuação inteira entre zero e a pontuação máxima."
    );
  }

  return apiPost("/api/notas", {
    entregaId,
    alunoId,
    atividadeId,
    pontuacao,
    pontuacaoMaxima,
    feedback,
  });
}

  
