"""
Testes do modelo de entregas.
"""
import pytest
from app.models.entrega import Entrega


def test_entrega_sem_resposta_deve_falhar():
    with pytest.raises(ValueError, match="Campo obrigatório ausente: resposta"):
        Entrega.validar({
            "atividadeId": "atv001",
            "alunoId": "aluno001",
            "resposta": "",
        })


def test_status_invalido_deve_falhar():
    with pytest.raises(ValueError, match="Status inválido"):
        Entrega.validar({
            "atividadeId": "atv001",
            "alunoId": "aluno001",
            "resposta": "Teclado",
            "status": "reprovada",
        })