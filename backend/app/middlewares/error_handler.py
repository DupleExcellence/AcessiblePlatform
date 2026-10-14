"""
Tratamento centralizado de erros da aplicação.
"""
from app.middlewares.auth_middleware import AuthError, PermissionError


def resposta_erro(mensagem, status=400):
    return {"status": status, "erro": mensagem}


def tratar_excecao(exc):
    if isinstance(exc, AuthError):
        return resposta_erro(str(exc), 401)
    if isinstance(exc, PermissionError):
        return resposta_erro(str(exc), 403)
    if isinstance(exc, ValueError):
        return resposta_erro(str(exc), 400)
    if isinstance(exc, LookupError):
        return resposta_erro(str(exc), 404)
    return resposta_erro("Erro interno no servidor.", 500)