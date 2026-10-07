"""
Testes do serviço de cursos.
"""
from app.services import curso_service


def test_listar_cursos_vazio(monkeypatch):
    class Col:
        def stream(self):
            return []

    class FakeDB:
        def collection(self, _):
            return Col()

    monkeypatch.setattr(curso_service, "COLECAO_CURSOS", Col())

    assert curso_service.listar_cursos() == []