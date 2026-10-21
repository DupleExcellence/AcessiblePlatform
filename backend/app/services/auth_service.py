"""
Serviço de autenticação.
"""
from firebase_admin import auth, firestore
from app.database.firebase import (
    COLECAO_USUARIOS,
    COLECAO_PERFIS,
    COLECAO_ALUNOS,
    COLECAO_PROFESSORES,
)

def cadastrar_usuario(dados):
    nome = dados.get("nome")
    email = dados.get("email")
    senha = dados.get("senha")
    perfil_id = dados.get("perfil", "aluno")
    telefone = dados.get("telefone", "") # <-- NOVO CAMPO AQUI

    if not nome or not email or not senha:
        raise ValueError("Nome, e-mail e senha são obrigatórios.")

    if perfil_id not in ("aluno", "professor", "administrador"):
        raise ValueError("Perfil inválido.")

    # Cria usuário no Firebase Auth
    user = auth.create_user(email=email, password=senha, display_name=nome)
    uid = user.uid

    perfil_ref = COLECAO_PERFIS.document(perfil_id)

    # Documento base (agora com telefone)
    COLECAO_USUARIOS.document(uid).set({
        "nome": nome,
        "email": email,
        "telefone": telefone, # <-- SALVANDO AQUI
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