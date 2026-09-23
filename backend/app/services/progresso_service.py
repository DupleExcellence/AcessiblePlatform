"""
Serviço de progresso e resultados.

Consulta entregas e notas do aluno e calcula o progresso.
"""
from app.database.firebase import COLECAO_ENTREGAS, COLECAO_NOTAS


def obter_progresso(aluno_id):
    entregas = COLECAO_ENTREGAS.where("alunoId", "==", aluno_id).stream()

    total = 0
    corrigidas = 0
    pontuacao_total = 0

    for entrega in entregas:
        total += 1
        dados = entrega.to_dict()
        if dados.get("status") == "corrigida":
            corrigidas += 1

    notas = COLECAO_NOTAS.where("alunoId", "==", aluno_id).stream()
    for nota in notas:
        dados = nota.to_dict()
        pontuacao_total += dados.get("pontuacao", 0)

    return {
        "alunoId": aluno_id,
        "totalEntregas": total,
        "entregasCorrigidas": corrigidas,
        "pontuacaoTotal": pontuacao_total,
        "percentualConcluido": (corrigidas / total * 100) if total else 0,
    }