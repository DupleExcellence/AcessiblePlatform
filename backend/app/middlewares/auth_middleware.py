"""
Middleware de autenticação.

Valida o token enviado no cabeçalho Authorization (Bearer) usando o
Firebase Authentication e injeta o usuário autenticado na requisição.
"""
from firebase_admin import auth
from app.database.firebase import COLECAO_USUARIOS, COLECAO_PERFIS


class AuthError(Exception):
    """Erro de autenticação — mapeado para HTTP 401 pelo error_handler."""
    pass


class PermissionError(Exception):
    """Erro de permissão — mapeado para HTTP 403 pelo error_handler."""
    pass


def autenticar(headers):
    """
    Valida o token do cabeçalho Authorization e retorna o usuário
    com dados do Firestore (usuarios + perfis).
    """
    auth_header = headers.get("Authorization") or headers.get("authorization")

    if not auth_header or not auth_header.startswith("Bearer "):
        raise AuthError("Token de autenticação ausente ou inválido.")

    token = auth_header.split(" ", 1)[1]

    try:
        decoded = auth.verify_id_token(token)
    except Exception:
        raise AuthError("Token inválido ou expirado.")

    uid = decoded["uid"]
    doc = COLECAO_USUARIOS.document(uid).get()

    if not doc.exists:
        raise AuthError("Usuário não encontrado.")

    usuario = doc.to_dict()
    usuario["id"] = uid

    # Carrega dados do perfil
    perfil_ref = usuario.get("perfil")
    if perfil_ref:
        perfil_doc = perfil_ref.get()
        usuario["perfil"] = perfil_doc.to_dict() if perfil_doc.exists else None

    return usuario


def exigir_perfil(usuario, perfis_permitidos):
    """
    Verifica se o usuário possui um dos perfis permitidos.
    Ex.: exigir_perfil(usuario, ["professor", "administrador"])
    """
    perfil = usuario.get("perfil") or {}
    nome_perfil = perfil.get("id") or perfil.get("nome", "").lower()

    if nome_perfil not in perfis_permitidos:
        raise PermissionError("Acesso negado ao recurso.")