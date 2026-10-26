
import { apiGet, apiPost } from "./api";

// Lista entregas. Para alunos, o backend filtra pelo usuário autenticado.
export async function listarEntregas(filtros = {}) {
  const params = new URLSearchParams();

  if (filtros.atividadeId) {
    params.set("atividadeId", filtros.atividadeId);
  }

  if (filtros.alunoId) {
    params.set("alunoId", filtros.alunoId);
  }

  const query = params.toString();

  return apiGet(`/api/entregas${query ? `?${query}` : ""}`);
}

// Consulta uma entrega pelo ID.
export async function buscarEntregaPorId(id) {
  if (!id) {
    throw new Error("O ID da entrega é obrigatório.");
  }

  return apiGet(`/api/entregas/${encodeURIComponent(id)}`);
}

// Envia a resposta do aluno.
export async function enviarEntrega({ atividadeId, resposta }) {
  if (!atividadeId) {
    throw new Error("O ID da atividade é obrigatório.");
  }

  const respostaVazia =
    resposta == null ||
    resposta === "" ||
    (Array.isArray(resposta) && resposta.length === 0);

  if (respostaVazia) {
    throw new Error("Informe uma resposta antes de enviar.");
  }

  return apiPost("/api/entregas", {
    atividadeId,
    resposta,
  });
}
