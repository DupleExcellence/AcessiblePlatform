"""
Modelo de Progresso (derivado).
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