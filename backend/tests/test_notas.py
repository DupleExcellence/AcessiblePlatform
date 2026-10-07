"""
Testes do modelo de notas.
"""
import pytest
from app.models.nota import Nota


def test_nota_sem_pontuacao_deve_falhar():
    with pytest.raises(ValueError, match="Campo obrigatório ausente: pontuacao"):
        Nota.validar({
            "entregaId": "ent001",
            "alunoId": "aluno001",
            "atividadeId": "atv001",
            "pontuacaoMaxima": 10,
        })


def test_pontuacao_maior_que_maxima_deve_falhar():
    with pytest.raises(ValueError, match="não pode exceder"):
        Nota.validar({
            "entregaId": "ent001",
            "alunoId": "aluno001",
            "atividadeId": "atv001",
            "pontuacao": 15,
            "pontuacaoMaxima": 10,
        })


def test_pontuacao_negativa_deve_falhar():
    with pytest.raises(ValueError, match="inteiro não negativo"):
        Nota.validar({
            "entregaId": "ent001",
            "alunoId": "aluno001",
            "atividadeId": "atv001",
            "pontuacao": -3,
            "pontuacaoMaxima": 10,
        })