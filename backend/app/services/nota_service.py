"""
Serviço de notas.

Uma nota é criada pelo professor ao corrigir uma entrega.
O aluno pode consultar as próprias notas.
"""
from firebase_admin import firestore
from app.database.firebase import (
    COLECAO_NOTAS,
    COLECAO_ENTREGAS,
    COLECAO_ALUNOS,
    COLECAO_ATIVIDADES,
    COLECAO_PROFESSORES,
)
from app.models.nota import Nota


def listar_notas(aluno_id=None, atividade_id=None):
    query = COLECAO_NOTAS
    if aluno_id:
        query = query.where("alunoId", "==", COLECAO_ALUNOS.document(aluno_id))
    if atividade_id:
        query = query.where("atividadeId", "==", COLECAO_ATIVIDADES.document(atividade_id))

    docs = query.stream()
    notas = []
    for doc in docs:
        dados = doc.to_dict()
        dados["id"] = doc.id
        notas.append(_serializar(dados))
    return notas


def obter_nota(nota_id):
    doc = COLECAO_NOTAS.document(nota_id).get()
    if not doc.exists:
        raise LookupError("Nota não encontrada.")
    dados = doc.to_dict()
    dados["id"] = doc.id
    return _serializar(dados)


def corrigir_entrega(dados, professor_id):
    """
    Cria uma nota a partir de uma entrega e atualiza o status da entrega
    para 'corrigida'. Também incrementa o XP e a pontuação do aluno.
    """
    Nota.validar(dados)

    entrega_id = dados["entregaId"]
    entrega_ref = COLECAO_ENTREGAS.document(entrega_id)
    entrega_doc = entrega_ref.get()
    if not entrega_doc.exists:
        raise LookupError("Entrega não encontrada.")

    # Normaliza o alunoId (aceita "abc123" ou "alunos/abc123")
    aluno_id_raw = dados["alunoId"]
    aluno_id = aluno_id_raw.split("/")[-1] if "/" in aluno_id_raw else aluno_id_raw

    # Normaliza o atividadeId (aceita "abc123" ou "atividades/abc123")
    atividade_id_raw = dados["atividadeId"]
    atividade_id = atividade_id_raw.split("/")[-1] if "/" in atividade_id_raw else atividade_id_raw

    # Evita correção duplicada
    existentes = COLECAO_NOTAS.where("entregaId", "==", entrega_ref).limit(1).stream()
    if any(existentes):
        raise ValueError("Esta entrega já foi corrigida.")

    doc_ref = COLECAO_NOTAS.document()
    doc_ref.set({
        "entregaId": entrega_ref,
        "alunoId": COLECAO_ALUNOS.document(aluno_id),
        "atividadeId": COLECAO_ATIVIDADES.document(atividade_id),
        "pontuacao": dados["pontuacao"],
        "pontuacaoMaxima": dados["pontuacaoMaxima"],
        "feedback": dados.get("feedback", ""),
        "corrigidoPor": COLECAO_PROFESSORES.document(professor_id),
        "corrigidoEm": firestore.SERVER_TIMESTAMP,
    })

    # Atualiza o status da entrega
    entrega_ref.update({"status": "corrigida"})

    # Atualiza o XP e a pontuação do aluno
    aluno_ref = COLECAO_ALUNOS.document(aluno_id)
    aluno_doc = aluno_ref.get()
    if aluno_doc.exists:
        # Garante que os campos existam
        dados_aluno = aluno_doc.to_dict()
        if "pontuacaoTotal" not in dados_aluno:
            aluno_ref.update({"pontuacaoTotal": 0})
        if "xpTotal" not in dados_aluno:
            aluno_ref.update({"xpTotal": 0})

        # Incrementa
        aluno_ref.update({
            "pontuacaoTotal": firestore.Increment(dados["pontuacao"]),
            "xpTotal": firestore.Increment(dados["pontuacao"] * 10),
        })
    else:
        # Se o documento não existir, cria com os valores iniciais
        aluno_ref.set({
            "pontuacaoTotal": dados["pontuacao"],
            "xpTotal": dados["pontuacao"] * 10,
            "criadoEm": firestore.SERVER_TIMESTAMP,
        })

    return obter_nota(doc_ref.id)


def _serializar(dados):
    for campo in ("entregaId", "alunoId", "atividadeId", "corrigidoPor"):
        if campo in dados and hasattr(dados[campo], "path"):
            dados[campo] = dados[campo].path
    return dados