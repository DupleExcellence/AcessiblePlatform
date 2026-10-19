
import { apiRequest } from "./api";

export async function buscarRanking() {
  return apiRequest("/api/ranking");
}

export async function buscarMinhaPosicao() {
  return apiRequest("/api/ranking/eu");
}
