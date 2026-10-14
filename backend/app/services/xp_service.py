"""
Serviço de XP (pontos de experiência).

Cada aluno possui um campo `xpTotal` na coleção `alunos`.
O XP é incrementado automaticamente quando uma nota é criada,
e pode ser consultado por meio da rota /api/xp.
"""
from app.database.firebase import COLECAO_ALUNOS


# Tabela de níveis por faixa de XP
NIVEIS = [
    {"nivel": 1, "xpMinimo": 0, "titulo": "Iniciante"},
    {"nivel": 2, "xpMinimo": 100, "titulo": "Aprendiz"},
    {"nivel": 3, "xpMinimo": 300, "titulo": "Praticante"},
    {"nivel": 4, "xpMinimo": 600, "titulo": "Avançado"},
    {"nivel": 5, "xpMinimo": 1000, "titulo": "Mestre"},
]


def obter_xp(aluno_id):
    """
    Retorna o XP total e o nível do aluno.
    """
    doc = COLECAO_ALUNOS.document(aluno_id).get()
    if not doc.exists:
        raise LookupError("Aluno não encontrado.")

    dados = doc.to_dict()
    xp_total = dados.get("xpTotal", 0)
    nivel_info = calcular_nivel(xp_total)

    return {
        "alunoId": aluno_id,
        "xpTotal": xp_total,
        "nivel": nivel_info["nivel"],
        "titulo": nivel_info["titulo"],
        "proximoNivel": nivel_info.get("proximoNivel"),
        "xpParaProximoNivel": nivel_info.get("xpFaltando"),
    }


def calcular_nivel(xp_total):
    """
    Retorna as informações do nível com base no XP total.
    """
    nivel_atual = NIVEIS[0]

    for nivel in NIVEIS:
        if xp_total >= nivel["xpMinimo"]:
            nivel_atual = nivel
        else:
            break

    # Verifica se há próximo nível
    indice = NIVEIS.index(nivel_atual)
    if indice + 1 < len(NIVEIS):
        proximo = NIVEIS[indice + 1]
        xp_faltando = proximo["xpMinimo"] - xp_total
        return {
            "nivel": nivel_atual["nivel"],
            "titulo": nivel_atual["titulo"],
            "proximoNivel": proximo["nivel"],
            "xpFaltando": xp_faltando,
        }

    return {
        "nivel": nivel_atual["nivel"],
        "titulo": nivel_atual["titulo"],
    }