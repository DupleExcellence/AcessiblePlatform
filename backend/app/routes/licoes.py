"""
Rotas de licoes.
"""
from app.services import licao_service
from app.middlewares.auth_middleware import autenticar, exigir_perfil


def rotear(metodo, caminho, corpo, headers, query=None):
    partes = caminho.strip("/").split("/")
    usuario = autenticar(headers)
    query = query or {}

    if len(partes) == 2:
        if metodo == "GET":
            return 200, licao_service.listar_licoes(query.get("cursoId"))
        if metodo == "POST":
            exigir_perfil(usuario, ["professor", "administrador"])
            return 201, licao_service.criar_licao(corpo, usuario["id"])

    if len(partes) == 3:
        licao_id = partes[2]
        if metodo == "GET":
            return 200, licao_service.obter_licao(licao_id)
        if metodo == "PUT":
            exigir_perfil(usuario, ["professor", "administrador"])
            return 200, licao_service.atualizar_licao(licao_id, corpo, usuario["id"])
        if metodo == "DELETE":
            exigir_perfil(usuario, ["professor", "administrador"])
            return 200, licao_service.remover_licao(licao_id, usuario["id"])

    return 404, {"erro": "Rota de licoes nao encontrada."}