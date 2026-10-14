"""
Modelo de Aluno.

Representa a estrutura de dados de um aluno no Firestore.
Serve como referência para validação e documentação.
"""


class Aluno:
    COLECAO = "alunos"

    CAMPOS = {
        "id": str,
        "usuarioId": str,          # referência: usuarios/{uid}
        "idade": int,
        "turma": str,
        "professorId": str,        # referência: professores/{uid}
        "pontuacaoTotal": int,
        "criadoEm": "timestamp",
    }

    OBRIGATORIOS = ["usuarioId", "idade", "pontuacaoTotal"]

    @staticmethod
    def validar(dados):
        for campo in Aluno.OBRIGATORIOS:
            if campo not in dados:
                raise ValueError(f"Campo obrigatório ausente: {campo}")

        if not isinstance(dados.get("idade"), int) or dados["idade"] < 0:
            raise ValueError("Idade inválida.")