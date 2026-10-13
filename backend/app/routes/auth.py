"""
Rotas de autenticação.

Observação: login e logout são realizados diretamente pelo cliente
via Firebase Authentication SDK. O backend expõe apenas operações
administrativas (ex.: cadastro).
"""
from app.services import auth_service
from app.middlewares.auth_middleware import autenticar


def rotear(metodo, caminho, corpo, headers):
    if metodo == "POST" and caminho == "/api/auth/cadastro":
        return 201, auth_service.cadastrar_usuario(corpo)

    if metodo == "GET" and caminho == "/api/auth/me":
        usuario = autenticar(headers)
        return 200, usuario

    return 404, {"erro": "Rota de autenticação não encontrada."}