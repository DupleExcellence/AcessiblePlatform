"""
Serviço de Ranking.

Lista os alunos ordenados por XP total (do maior para o menor).
"""
from app.database.firebase import COLECAO_ALUNOS


def obter_ranking(limite=10):
    """
    Retorna os top N alunos ordenados por XP.
    """
    docs = COLECAO_ALUNOS.stream()

    alunos = []
    for doc in docs:
        dados = doc.to_dict()
        alunos.append({
            "id": doc.id,
            "nome": obter_nome_aluno(dados),
            "xpTotal": dados.get("xpTotal", 0),
            "pontuacaoTotal": dados.get("pontuacaoTotal", 0),
            "turma": dados.get("turma", ""),
        })

    # Ordena por XP decrescente
    alunos.sort(key=lambda a: a["xpTotal"], reverse=True)

    # Adiciona posição
    for i, aluno in enumerate(alunos, start=1):
        aluno["posicao"] = i

    return alunos[:limite]


def obter_posicao_aluno(aluno_id):
    """
    Retorna a posição de um aluno específico no ranking geral.
    """
    ranking_completo = obter_ranking(limite=9999)

    for aluno in ranking_completo:
        if aluno["id"] == aluno_id:
            return {
                "alunoId": aluno_id,
                "posicao": aluno["posicao"],
                "xpTotal": aluno["xpTotal"],
                "totalAlunos": len(ranking_completo),
            }

    raise LookupError("Aluno não encontrado no ranking.")


def obter_nome_aluno(dados):
    """
    Extrai o nome do aluno. Se não tiver, retorna 'Aluno'.
    """
    # O nome real está no documento `usuarios`, mas como o serviço
    # de ranking é simplificado, usamos um fallback.
    return dados.get("nome", "Aluno")