"""
Modelo de Atividade.

Uma atividade pertence a uma lição e é criada por um professor.
Pode conter alternativas (múltipla escolha) ou resposta aberta.
"""


class Atividade:
    COLECAO = "atividades"

    TIPOS = ("multipla_escolha", "resposta_aberta", "verdadeiro_falso")

    CAMPOS = {
        "id": str,
        "licaoId": str,
        "titulo": str,
        "descricao": str,
        "tipo": str,
        "alternativas": list,
        "pontuacaoMaxima": int,
        "prazo": "timestamp",
        "criadoEm": "timestamp",
    }

    OBRIGATORIOS = ["licaoId", "titulo", "descricao", "tipo", "pontuacaoMaxima"]

    @staticmethod
    def validar(dados):
        for campo in Atividade.OBRIGATORIOS:
            if dados.get(campo) in (None, "", []):
                raise ValueError(f"Campo obrigatorio ausente: {campo}")

        if dados["tipo"] not in Atividade.TIPOS:
            raise ValueError(f"Tipo invalido. Use: {', '.join(Atividade.TIPOS)}.")

        if not isinstance(dados["pontuacaoMaxima"], int) or dados["pontuacaoMaxima"] <= 0:
            raise ValueError("pontuacaoMaxima deve ser um inteiro positivo.")

        if dados["tipo"] == "multipla_escolha":
            alternativas = dados.get("alternativas") or []
        if len(alternativas) < 2:
            raise ValueError("Atividades de multipla escolha exigem ao menos 2 alternativas.")

        # Normaliza: aceita tanto strings ("a") quanto objetos ({id, texto, correta})
        def _get_correta(alt):
            if isinstance(alt, dict):
                return bool(alt.get("correta"))
            return False  # string simples não tem como marcar correta

        def _get_texto(alt):
            if isinstance(alt, dict):
                return alt.get("texto", "")
            return str(alt)

        if not any(_get_correta(a) for a in alternativas):
            raise ValueError(
                "E necessario marcar ao menos uma alternativa correta "
                "(envie o campo 'correta': true em uma das alternativas)."
            )