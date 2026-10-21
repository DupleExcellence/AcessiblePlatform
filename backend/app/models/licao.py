"""
Modelo de Lição.
"""

class Licao:
    COLECAO = "licoes"

    CAMPOS = {
        "id": str,
        "cursoId": str,          # ID do curso ou referência
        "titulo": str,
        "descricao": str,
        "conteudo": str,
        "ordem": int,
        "videoUrl": str,         # Campo novo
        "duracao": str,          # Campo novo
        "gabarito": str,         # Campo novo
        "arquivo": str,          # Campo novo
        "professorId": str,
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