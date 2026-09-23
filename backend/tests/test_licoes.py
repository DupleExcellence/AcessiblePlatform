"""
Testes do serviço de lições.
"""
import pytest
from app.services import licao_service


def test_criar_licao_sem_titulo_deve_falhar():
    with pytest.raises(ValueError, match="Título e conteúdo"):
        licao_service.criar_licao({"conteudo": "abc"}, "prof1")


def test_criar_licao_sem_conteudo_deve_falhar():
    with pytest.raises(ValueError, match="Título e conteúdo"):
        licao_service.criar_licao({"titulo": "Introdução"}, "prof1")