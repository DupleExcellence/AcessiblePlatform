"""
Rotas de atividades.

GET    /api/atividades               — lista atividades (autenticado)
GET    /api/atividades/{id}          — consulta atividade (autenticado)
POST   /api/atividades               — cria atividade (professor/admin)
PUT    /api/atividades/{id}          — atualiza atividade (professor/admin)
DELETE /api/atividades/{id}          — remove atividade (professor/admin)
"""
from app.services import atividade_service
from app.middlewares.auth_middleware import autenticar, exigir_perfil


def rotear(metodo, caminho, corpo, headers, query=None):
    partes = caminho.strip("/").split("/")
    usuario = autenticar(headers)
    query = query or {}

    if len(partes) == 2:
        if metodo == "GET":
            return 200, atividade_service.listar_atividades(query.get("licaoId"))

        if metodo == "POST":
            exigir_perfil(usuario, ["professor", "administrador"])
            return 201, atividade_service.criar_atividade(corpo, usuario["id"])

    if len(partes) == 3:
        atividade_id = partes[2]

        if metodo == "GET":
            return 200, atividade_service.obter_atividade(atividade_id)

        if metodo == "PUT":
            exigir_perfil(usuario, ["professor", "administrador"])
            return 200, atividade_service.atualizar_atividade(atividade_id, corpo)

        if metodo == "DELETE":
            exigir_perfil(usuario, ["professor", "administrador"])
            return 200, atividade_service.remover_atividade(atividade_id)

    return 404, {"erro": "Rota de atividades não encontrada."}