"""
Serviço de entregas.

O aluno envia uma resposta para uma atividade. O professor visualiza
as entregas e dispara o processo de correção (criando uma nota).
"""
from firebase_admin import firestore
from app.database.firebase import (
    COLECAO_ENTREGAS,
    COLECAO_ATIVIDADES,
    COLECAO_ALUNOS,
)
from app.models.entrega import Entrega


def listar_entregas(aluno_id=None, atividade_id=None):
    query = COLECAO_ENTREGAS

    if aluno_id:
        query = query.where("alunoId", "==", COLECAO_ALUNOS.document(aluno_id))
    if atividade_id:
        query = query.where("atividadeId", "==", COLECAO_ATIVIDADES.document(atividade_id))

    docs = query.stream()
    entregas = []
    for doc in docs:
        dados = doc.to_dict()
        dados["id"] = doc.id
        entregas.append(_serializar(dados))
    return entregas


def obter_entrega(entrega_id):
    doc = COLECAO_ENTREGAS.document(entrega_id).get()
    if not doc.exists:
        raise LookupError("Entrega não encontrada.")
    dados = doc.to_dict()
    dados["id"] = doc.id
    return _serializar(dados)


def enviar_entrega(dados, aluno_id):
    Entrega.validar(dados)

    atividade_id = dados["atividadeId"]
    atividade_ref = COLECAO_ATIVIDADES.document(atividade_id)
    if not atividade_ref.get().exists:
        raise LookupError("Atividade associada não encontrada.")

    aluno_ref = COLECAO_ALUNOS.document(aluno_id)
    if not aluno_ref.get().exists:
        raise LookupError("Aluno não encontrado.")

    # Verifica se o aluno já enviou essa atividade
    existentes = COLECAO_ENTREGAS.where("alunoId", "==", aluno_ref) \
                                  .where("atividadeId", "==", atividade_ref) \
                                  .limit(1).stream()

    if any(existentes):
        raise ValueError("Você já enviou uma resposta para esta atividade.")

    doc_ref = COLECAO_ENTREGAS.document()
    doc_ref.set({
        "atividadeId": atividade_ref,
        "alunoId": aluno_ref,
        "resposta": dados["resposta"],
        "status": "enviada",
        "enviadoEm": firestore.SERVER_TIMESTAMP,
    })
    return obter_entrega(doc_ref.id)


def _serializar(dados):
    for campo in ("atividadeId", "alunoId"):
        if campo in dados and hasattr(dados[campo], "path"):
            dados[campo] = dados[campo].path
    return dados