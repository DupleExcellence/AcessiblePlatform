"""
Rotas de alunos.
"""
from app.services import aluno_service
from app.middlewares.auth_middleware import autenticar, exigir_perfil


def rotear(metodo, caminho, corpo, headers):
    partes = caminho.strip("/").split("/")

    if len(partes) == 2:
        usuario = autenticar(headers)
        if metodo == "GET":
            exigir_perfil(usuario, ["professor", "administrador"])
            return 200, aluno_service.listar_alunos()

    if len(partes) == 3:
        aluno_id = partes[2]
        usuario = autenticar(headers)

        if metodo == "GET":
            if usuario["id"] != aluno_id:
                exigir_perfil(usuario, ["professor", "administrador"])
            return 200, aluno_service.obter_aluno(aluno_id)

        if metodo == "PUT":
            exigir_perfil(usuario, ["professor", "administrador"])
            return 200, aluno_service.atualizar_aluno(aluno_id, corpo)

        if metodo == "DELETE":
            exigir_perfil(usuario, ["administrador"])
            return 200, aluno_service.remover_aluno(aluno_id)

    return 404, {"erro": "Rota de alunos nao encontrada."}