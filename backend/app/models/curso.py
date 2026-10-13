"""
Modelo de Curso.
"""


class Curso:
    COLECAO = "cursos"

    CAMPOS = {
        "id": str,
        "titulo": str,
        "descricao": str,
        "ativo": bool,
        "criadoEm": "timestamp",
    }

    OBRIGATORIOS = ["titulo"]

    @staticmethod
    def validar(dados):
        if not dados.get("titulo"):
            raise ValueError("Título do curso é obrigatório.")