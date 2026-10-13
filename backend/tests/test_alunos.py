"""
Testes do serviço de alunos.
"""
import pytest
from app.services import aluno_service


def test_obter_aluno_inexistente_deve_falhar(monkeypatch):
    class Doc:
        exists = False

    class Ref:
        def get(self):
            return Doc()

    class Col:
        def document(self, _id):
            return Ref()

    monkeypatch.setattr(aluno_service, "COLECAO_ALUNOS", Col())

    with pytest.raises(LookupError, match="Aluno não encontrado"):
        aluno_service.obter_aluno("invalido")