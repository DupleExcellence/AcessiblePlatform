"""
Rotas de entregas.
"""
from app.services import entrega_service
from app.middlewares.auth_middleware import autenticar, exigir_perfil


def rotear(metodo, caminho, corpo, headers, query=None):
    partes = caminho.strip("/").split("/")
    usuario = autenticar(headers)
    query = query or {}

    if len(partes) == 2:
        if metodo == "GET":
            perfil = (usuario.get("perfil") or {}).get("id")
            if perfil == "aluno":
                return 200, entrega_service.listar_entregas(aluno_id=usuario["id"])
            return 200, entrega_service.listar_entregas(
                aluno_id=query.get("alunoId"),
                atividade_id=query.get("atividadeId"),
            )
        if metodo == "POST":
            exigir_perfil(usuario, ["aluno"])
            return 201, entrega_service.enviar_entrega(corpo, usuario["id"])

    if len(partes) == 3 and metodo == "GET":
        entrega = entrega_service.obter_entrega(partes[2])
        perfil = (usuario.get("perfil") or {}).get("id")
        if perfil == "aluno" and entrega["alunoId"] != f"alunos/{usuario['id']}":
            raise PermissionError("Voce so pode acessar suas proprias entregas.")
        return 200, entrega

    return 404, {"erro": "Rota de entregas nao encontrada."}