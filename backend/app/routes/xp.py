"""
Rotas de XP.

GET /api/xp             - XP e nível do aluno logado
GET /api/xp/{alunoId}   - XP e nível de um aluno específico (professor/admin)
"""
from app.services import xp_service
from app.middlewares.auth_middleware import autenticar, exigir_perfil


def rotear(metodo, caminho, corpo, headers):
    partes = caminho.strip("/").split("/")
    usuario = autenticar(headers)

    if len(partes) == 2 and metodo == "GET":
        exigir_perfil(usuario, ["aluno"])
        return 200, xp_service.obter_xp(usuario["id"])

    if len(partes) == 3 and metodo == "GET":
        exigir_perfil(usuario, ["professor", "administrador"])
        return 200, xp_service.obter_xp(partes[2])

    return 404, {"erro": "Rota de XP nao encontrada."}