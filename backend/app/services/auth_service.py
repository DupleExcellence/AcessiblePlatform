"""
Serviço de autenticação.

Cadastro e login são delegados ao Firebase Authentication (client SDK
no frontend). O backend apenas valida tokens e mantém dados complementares
no Firestore (coleção usuarios).
"""
from firebase_admin import auth, firestore
from app.database.firebase import (
    COLECAO_USUARIOS,
    COLECAO_PERFIS,
    COLECAO_ALUNOS,
    COLECAO_PROFESSORES,
)


def cadastrar_usuario(dados):
    """
    Cadastra o usuário no Firebase Auth e cria o documento complementar
    no Firestore (colecao usuarios + perfil específico).
    """
    nome = dados.get("nome")
    email = dados.get("email")
    senha = dados.get("senha")
    perfil_id = dados.get("perfil", "aluno")

    if not nome or not email or not senha:
        raise ValueError("Nome, e-mail e senha são obrigatórios.")

    if perfil_id not in ("aluno", "professor", "administrador"):
        raise ValueError("Perfil inválido.")

    # Cria usuário no Firebase Auth
    user = auth.create_user(email=email, password=senha, display_name=nome)
    uid = user.uid

    perfil_ref = COLECAO_PERFIS.document(perfil_id)

    # Documento base
    COLECAO_USUARIOS.document(uid).set({
        "nome": nome,
        "email": email,
        "perfil": perfil_ref,
        "ativo": True,
        "criadoEm": firestore.SERVER_TIMESTAMP,
    })

    # Documento complementar por perfil
    if perfil_id == "aluno":
        COLECAO_ALUNOS.document(uid).set({
            "usuarioId": COLECAO_USUARIOS.document(uid),
            "idade": dados.get("idade"),
            "turma": dados.get("turma"),
            "pontuacaoTotal": 0,
            "xpTotal": 0,
            "criadoEm": firestore.SERVER_TIMESTAMP,
        })
    elif perfil_id == "professor":
        COLECAO_PROFESSORES.document(uid).set({
            "usuarioId": COLECAO_USUARIOS.document(uid),
            "disciplina": dados.get("disciplina"),
            "criadoEm": firestore.SERVER_TIMESTAMP,
        })

    return {"id": uid, "nome": nome, "email": email, "perfil": perfil_id}