"""
Serviço de gerenciamento de alunos.
"""
from firebase_admin import firestore
from app.database.firebase import COLECAO_ALUNOS, COLECAO_USUARIOS


def listar_alunos():
    docs = COLECAO_ALUNOS.stream()
    alunos = []
    for doc in docs:
        dados = doc.to_dict()
        dados["id"] = doc.id
        alunos.append(_serializar(dados))
    return alunos


def obter_aluno(aluno_id):
    doc = COLECAO_ALUNOS.document(aluno_id).get()
    if not doc.exists:
        raise LookupError("Aluno não encontrado.")
    dados = doc.to_dict()
    dados["id"] = doc.id
    return _serializar(dados)


def atualizar_aluno(aluno_id, dados):
    ref = COLECAO_ALUNOS.document(aluno_id)
    if not ref.get().exists:
        raise LookupError("Aluno não encontrado.")

    campos_permitidos = {"idade", "turma", "professorId", "pontuacaoTotal"}
    atualizacao = {k: v for k, v in dados.items() if k in campos_permitidos}

    if not atualizacao:
        raise ValueError("Nenhum campo válido para atualização.")

    ref.update(atualizacao)
    return obter_aluno(aluno_id)


def remover_aluno(aluno_id):
    ref = COLECAO_ALUNOS.document(aluno_id)
    if not ref.get().exists:
        raise LookupError("Aluno não encontrado.")
    ref.delete()
    COLECAO_USUARIOS.document(aluno_id).update({"ativo": False})
    return {"id": aluno_id, "removido": True}


def _serializar(dados):
    """Converte referências do Firestore em strings para serialização JSON."""
    for campo in ("usuarioId", "professorId"):
        if campo in dados and hasattr(dados[campo], "path"):
            dados[campo] = dados[campo].path
    return dados