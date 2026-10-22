"""
Serviço de atividades.
"""
from firebase_admin import firestore
from app.database.firebase import COLECAO_ATIVIDADES, COLECAO_LICOES
from app.models.atividade import Atividade


def listar_atividades(licao_id=None):
    query = COLECAO_ATIVIDADES
    if licao_id:
        query = query.where("licaoId", "==", COLECAO_LICOES.document(licao_id))

    docs = query.stream()
    atividades = []
    for doc in docs:
        dados = doc.to_dict()
        dados["id"] = doc.id
        atividades.append(_serializar(dados))
    return atividades


def obter_atividade(atividade_id):
    doc = COLECAO_ATIVIDADES.document(atividade_id).get()
    if not doc.exists:
        raise LookupError("Atividade não encontrada.")
    dados = doc.to_dict()
    dados["id"] = doc.id
    return _serializar(dados)


def criar_atividade(dados, professor_id):
    Atividade.validar(dados)

    licao_id = dados["licaoId"]
    if not COLECAO_LICOES.document(licao_id).get().exists:
        raise LookupError("Lição associada não encontrada.")

    doc_ref = COLECAO_ATIVIDADES.document()
    doc_ref.set({
        "licaoId": COLECAO_LICOES.document(licao_id),
        "titulo": dados["titulo"],
        "descricao": dados["descricao"],
        "tipo": dados["tipo"],
        "alternativas": _normalizar_alternativas(dados.get("alternativas", [])),
        "pontuacaoMaxima": dados["pontuacaoMaxima"],
        "prazo": dados.get("prazo"),
        "criadoEm": firestore.SERVER_TIMESTAMP,
        "criadoPor": professor_id,
    })
    return obter_atividade(doc_ref.id)


def atualizar_atividade(atividade_id, dados):
    ref = COLECAO_ATIVIDADES.document(atividade_id)
    if not ref.get().exists:
        raise LookupError("Atividade não encontrada.")

    campos_permitidos = {"titulo", "descricao", "tipo", "alternativas", "pontuacaoMaxima", "prazo"}
    atualizacao = {k: v for k, v in dados.items() if k in campos_permitidos}

    if "alternativas" in atualizacao:
        atualizacao["alternativas"] = _normalizar_alternativas(atualizacao["alternativas"])

    if not atualizacao:
        raise ValueError("Nenhum campo válido para atualização.")

    ref.update(atualizacao)
    return obter_atividade(atividade_id)


def remover_atividade(atividade_id):
    ref = COLECAO_ATIVIDADES.document(atividade_id)
    if not ref.get().exists:
        raise LookupError("Atividade não encontrada.")
    ref.delete()
    return {"id": atividade_id, "removido": True}


def _serializar(dados):
    if "licaoId" in dados and hasattr(dados["licaoId"], "path"):
        dados["licaoId"] = dados["licaoId"].path
    return dados

def _normalizar_alternativas(alternativas):
    """
    Aceita alternativas em dois formatos:
    - Lista de strings: ["a", "b"]
    - Lista de objetos: [{"id": "A", "texto": "a", "correta": false}, ...]
    Retorna sempre lista de objetos {id, texto, correta}.
    """
    if not alternativas:
        return []

    normalizadas = []
    for i, alt in enumerate(alternativas):
        if isinstance(alt, dict):
            normalizadas.append({
                "id": alt.get("id", chr(65 + i)),  # A, B, C...
                "texto": alt.get("texto", ""),
                "correta": bool(alt.get("correta", False)),
            })
        else:
            normalizadas.append({
                "id": chr(65 + i),
                "texto": str(alt),
                "correta": False,
            })
    return normalizadas