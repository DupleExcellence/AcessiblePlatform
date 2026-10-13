"""
Rotas de Ranking.

GET /api/ranking             - Top 10 alunos por XP
GET /api/ranking/eu          - Posição do aluno logado
GET /api/ranking?limite=20   - Top N alunos
"""
from app.services import ranking_service
from app.middlewares.auth_middleware import autenticar, exigir_perfil


def rotear(metodo, caminho, corpo, headers, query=None):
    partes = caminho.strip("/").split("/")
    usuario = autenticar(headers)
    query = query or {}

    # GET /api/ranking
    if len(partes) == 2 and metodo == "GET":
        limite = int(query.get("limite", 10))
        return 200, ranking_service.obter_ranking(limite=limite)

    # GET /api/ranking/eu
    if len(partes) == 3 and partes[2] == "eu" and metodo == "GET":
        exigir_perfil(usuario, ["aluno"])
        return 200, ranking_service.obter_posicao_aluno(usuario["id"])

    return 404, {"erro": "Rota de ranking nao encontrada."}