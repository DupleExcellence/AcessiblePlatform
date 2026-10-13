"""
Modelo de Nota.

Registra o resultado da correção de uma entrega.
"""


class Nota:
    COLECAO = "notas"

    CAMPOS = {
        "id": str,
        "entregaId": str,          # referência: entregas/{id}
        "alunoId": str,            # referência: alunos/{uid}
        "atividadeId": str,        # referência: atividades/{id}
        "pontuacao": int,
        "pontuacaoMaxima": int,
        "feedback": str,
        "corrigidoPor": str,       # referência: professores/{uid}
        "corrigidoEm": "timestamp",
    }

    OBRIGATORIOS = ["entregaId", "alunoId", "atividadeId", "pontuacao", "pontuacaoMaxima"]

    @staticmethod
    def validar(dados):
        for campo in Nota.OBRIGATORIOS:
            if dados.get(campo) in (None, ""):
                raise ValueError(f"Campo obrigatório ausente: {campo}")

        if not isinstance(dados["pontuacao"], int) or dados["pontuacao"] < 0:
            raise ValueError("Pontuação deve ser um inteiro não negativo.")

        if dados["pontuacao"] > dados["pontuacaoMaxima"]:
            raise ValueError("Pontuação não pode exceder a pontuação máxima.")