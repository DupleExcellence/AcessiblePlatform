
import { apiRequest } from "./api";

export async function buscarCursos() {
  const cursos = await apiRequest("/api/cursos");

  if (!Array.isArray(cursos)) {
    throw new Error("A API retornou uma lista de cursos inválida.");
  }

  return cursos;
}

export async function buscarCursoPorId(id) {
  if (!id) {
    throw new Error("O ID do curso é obrigatório.");
  }

  return apiRequest(`/api/cursos/${encodeURIComponent(id)}`);
}

export async function criarCurso(dados) {
  const titulo = dados?.titulo?.trim();

  if (!titulo) {
    throw new Error("O título do curso é obrigatório.");
  }

  return apiRequest("/api/cursos", {
    method: "POST",
    body: {
      titulo,
      descricao: dados.descricao?.trim() || "",
      ativo: dados.ativo ?? true,
    },
  });
}
