"""
Rotas de cursos.

GET  /api/cursos        - lista cursos (requer autenticacao)
GET  /api/cursos/{id}   - consulta curso (requer autenticacao)
POST /api/cursos        - cria curso (professor/admin)
"""
from app.services import curso_service
from app.middlewares.auth_middleware import autenticar, exigir_perfil


def rotear(metodo, caminho, corpo, headers):
    partes = caminho.strip("/").split("/")
    usuario = autenticar(headers)

    if len(partes) == 2:
        if metodo == "GET":
            return 200, curso_service.listar_cursos()
        if metodo == "POST":
            exigir_perfil(usuario, ["professor", "administrador"])
            return 201, curso_service.criar_curso(corpo, usuario["id"])

    if len(partes) == 3 and metodo == "GET":
        return 200, curso_service.obter_curso(partes[2])

    return 404, {"erro": "Rota de cursos nao encontrada."}