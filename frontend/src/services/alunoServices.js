
import { apiGet } from "./api";

export async function buscarAlunos() {
  const alunos = await apiGet("/api/alunos");

  if (!Array.isArray(alunos)) {
    throw new Error("A API retornou uma lista de alunos inválida.");
  }

  return alunos;
}
