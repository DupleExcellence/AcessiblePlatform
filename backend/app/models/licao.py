"""
Modelo de Lição.
"""


class Licao:
    COLECAO = "licoes"

    CAMPOS = {
        "id": str,
        "titulo": str,
        "descricao": str,
        "conteudo": str,
        "cursoId": str,
        "professorId": str,
        "ordem": int,
        "ativa": bool,
        "criadoEm": "timestamp",
        "atualizadoEm": "timestamp",
    }

    OBRIGATORIOS = ["titulo", "conteudo", "professorId"]

    @staticmethod
    def validar(dados):
        for campo in Licao.OBRIGATORIOS:
            if not dados.get(campo):
                raise ValueError(f"Campo obrigatório ausente: {campo}")