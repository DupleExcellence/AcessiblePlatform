"""
Serviço de cursos.

No MVP, os cursos são estáticos e servem para agrupar lições.
"""
from app.database.firebase import COLECAO_CURSOS


def listar_cursos():
    docs = COLECAO_CURSOS.stream()
    cursos = []
    for doc in docs:
        dados = doc.to_dict()
        dados["id"] = doc.id
        cursos.append(dados)
    return cursos


def obter_curso(curso_id):
    doc = COLECAO_CURSOS.document(curso_id).get()
    if not doc.exists:
        raise LookupError("Curso não encontrado.")
    dados = doc.to_dict()
    dados["id"] = doc.id
    return dados