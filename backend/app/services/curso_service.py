"""
Serviço de cursos.

No MVP, os cursos agrupam lições. A listagem e a consulta são abertas
a usuários autenticados; a criação é restrita a professor e administrador.
"""
from app.database.firebase import COLECAO_CURSOS, firestore


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


def criar_curso(dados, criado_por):
    """
    Cria um curso no Firestore.

    - Valida campos obrigatórios (titulo).
    - Define 'ativo' como True por padrão.
    - Grava 'criadoEm' com timestamp do servidor.
    - Retorna o curso criado (com id).
    """
    if not dados or not dados.get("titulo"):
        raise ValueError("Campo obrigatorio ausente: titulo")

    titulo = str(dados["titulo"]).strip()
    if not titulo:
        raise ValueError("Campo obrigatorio ausente: titulo")

    doc_ref = COLECAO_CURSOS.document()
    doc_ref.set({
        "titulo": titulo,
        "descricao": dados.get("descricao", ""),
        "ativo": bool(dados.get("ativo", True)),
        "criadoEm": firestore.SERVER_TIMESTAMP,
        "criadoPor": criado_por,
    })

    return obter_curso(doc_ref.id)