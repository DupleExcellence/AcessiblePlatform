"""
Modelo de Progresso (derivado).

Não é uma coleção própria no MVP — é calculado a partir de entregas e notas.
Este modelo serve para padronizar a resposta da API.
"""


class Progresso:
    CAMPOS = {
        "alunoId": str,
        "totalEntregas": int,
        "entregasCorrigidas": int,
        "pontuacaoTotal": int,
        "percentualConcluido": float,
    }

    @staticmethod
    def montar(aluno_id, total, corrigidas, pontuacao):
        return {
            "alunoId": aluno_id,
            "totalEntregas": total,
            "entregasCorrigidas": corrigidas,
            "pontuacaoTotal": pontuacao,
            "percentualConcluido": round((corrigidas / total * 100), 2) if total else 0.0,
        }