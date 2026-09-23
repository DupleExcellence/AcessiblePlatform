"""
Rotas de progresso.

GET /api/progresso             - progresso do aluno autenticado
GET /api/progresso/{alunoId}   - progresso de um aluno (professor/administrador)
"""
from app.services import progresso_service
from app.middlewares.auth_middleware import autenticar, exigir_perfil


def rotear(metodo, caminho, corpo, headers):
    partes = caminho.strip("/").split("/")
    usuario = autenticar(headers)

    if len(partes) == 2 and metodo == "GET":
        exigir_perfil(usuario, ["aluno"])
        return 200, progresso_service.obter_progresso(usuario["id"])

    if len(partes) == 3 and metodo == "GET":
        exigir_perfil(usuario, ["professor", "administrador"])
        return 200, progresso_service.obter_progresso(partes[2])

    return 404, {"erro": "Rota de progresso nao encontrada."}