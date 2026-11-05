"""
Modelo de Lição.
"""

class Licao:
    COLECAO = "licoes"

    CAMPOS = {
        "id": str,
        "cursoId": "DocumentReference", # Padronizado
        "titulo": str,
        "descricao": str,
        "conteudo": str,
        "ordem": int,
        "gabarito": str,
        "arquivo": str,
        "professorId": "DocumentReference", # Padronizado
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