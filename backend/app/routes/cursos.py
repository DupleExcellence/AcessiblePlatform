"""
Rotas de cursos.

GET /api/cursos        - lista cursos (requer autenticacao)
GET /api/cursos/{id}   - consulta curso (requer autenticacao)
"""
from app.services import curso_service
from app.middlewares.auth_middleware import autenticar


def rotear(metodo, caminho, corpo, headers):
    partes = caminho.strip("/").split("/")
    autenticar(headers)

    if len(partes) == 2 and metodo == "GET":
        return 200, curso_service.listar_cursos()

    if len(partes) == 3 and metodo == "GET":
        return 200, curso_service.obter_curso(partes[2])

    return 404, {"erro": "Rota de cursos nao encontrada."}