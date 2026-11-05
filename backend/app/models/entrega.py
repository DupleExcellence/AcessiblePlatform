"""
Modelo de Entrega.

Representa a resposta enviada por um aluno a uma atividade.
"""


class Entrega:
    COLECAO = "entregas"

    STATUS = ("pendente", "enviada", "corrigida")

    CAMPOS = {
        "id": str,
        "atividadeId": "DocumentReference",
        "alunoId": "DocumentReference",
        "resposta": "string|list",
        "status": str,
        "enviadoEm": "timestamp",
    }

    OBRIGATORIOS = ["atividadeId", "alunoId", "resposta"]

    @staticmethod
    def validar(dados):
        for campo in Entrega.OBRIGATORIOS:
            if dados.get(campo) in (None, "", []):
                raise ValueError(f"Campo obrigatório ausente: {campo}")

        if dados.get("status") and dados["status"] not in Entrega.STATUS:
            raise ValueError(f"Status inválido. Use: {', '.join(Entrega.STATUS)}.")