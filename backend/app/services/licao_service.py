"""
Serviço de lições.
"""
from firebase_admin import firestore
from app.database.firebase import COLECAO_LICOES, COLECAO_PROFESSORES, COLECAO_CURSOS

def listar_licoes(curso_id=None):
    query = COLECAO_LICOES
    if curso_id:
        # Agora espera o ID do curso e converte para referência
        query = query.where("cursoId", "==", COLECAO_CURSOS.document(curso_id))

    docs = query.stream()
    licoes = []
    for doc in docs:
        dados = doc.to_dict()
        dados["id"] = doc.id
        licoes.append(_serializar(dados))
    return licoes

def obter_licao(licao_id):
    doc = COLECAO_LICOES.document(licao_id).get()
    if not doc.exists:
        raise LookupError("Lição não encontrada.")
    dados = doc.to_dict()
    dados["id"] = doc.id
    return _serializar(dados)

def criar_licao(dados, professor_id):
    titulo = dados.get("titulo")
    conteudo = dados.get("conteudo")

    if not titulo or not conteudo:
        raise ValueError("Título e conteúdo são obrigatórios.")

    # Pega o ID do curso (aceita 'cursoId' ou 'curso')
    curso_id = dados.get("cursoId", dados.get("curso", ""))
    
    doc_ref = COLECAO_LICOES.document()
    doc_ref.set({
        "titulo": titulo,
        "descricao": dados.get("descricao", ""),
        "conteudo": conteudo,
        "cursoId": COLECAO_CURSOS.document(curso_id) if curso_id else None,
        "professorId": COLECAO_PROFESSORES.document(professor_id),
        "ordem": dados.get("ordem", 1),
        "gabarito": dados.get("gabarito", ""),
        "arquivo": dados.get("arquivo", ""),
        "ativa": True,
        "criadoEm": firestore.SERVER_TIMESTAMP,
    })

    return obter_licao(doc_ref.id)

def atualizar_licao(licao_id, dados, professor_id):
    ref = COLECAO_LICOES.document(licao_id)
    doc = ref.get()
    if not doc.exists:
        raise LookupError("Lição não encontrada.")

    # Verifica se o professor é o dono da lição
    dados_atuais = doc.to_dict()
    professor_ref = dados_atuais.get("professorId")
    if professor_ref and professor_ref.id != professor_id:
        raise PermissionError("Você só pode editar suas próprias lições.")

    campos_permitidos = {
        "titulo", "descricao", "conteudo", "ordem", "ativa", "cursoId", "curso",
        "gabarito", "arquivo"
    }
    atualizacao = {k: v for k, v in dados.items() if k in campos_permitidos}

    if "cursoId" in atualizacao and atualizacao["cursoId"]:
        atualizacao["cursoId"] = COLECAO_CURSOS.document(atualizacao["cursoId"])
    elif "curso" in atualizacao and atualizacao["curso"]:
        atualizacao["cursoId"] = COLECAO_CURSOS.document(atualizacao["curso"])
        del atualizacao["curso"]

    if not atualizacao:
        raise ValueError("Nenhum campo válido para atualização.")

    atualizacao["atualizadoEm"] = firestore.SERVER_TIMESTAMP
    ref.update(atualizacao)
    return obter_licao(licao_id)

def remover_licao(licao_id, professor_id):
    ref = COLECAO_LICOES.document(licao_id)
    doc = ref.get()
    if not doc.exists:
        raise LookupError("Lição não encontrada.")

    dados_atuais = doc.to_dict()
    professor_ref = dados_atuais.get("professorId")
    if professor_ref and professor_ref.id != professor_id:
        raise PermissionError("Você só pode remover suas próprias lições.")

    ref.delete()
    return {"id": licao_id, "removido": True}

def _serializar(dados):
    for campo in ("professorId", "cursoId"):
        if campo in dados and hasattr(dados[campo], "path"):
            dados[campo] = dados[campo].path
    return dados