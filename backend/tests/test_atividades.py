"""
Testes do modelo de atividades.
"""
import pytest
from app.models.atividade import Atividade


def test_validar_sem_titulo_deve_falhar():
    with pytest.raises(ValueError, match="Campo obrigatório ausente: titulo"):
        Atividade.validar({
            "licaoId": "lic001",
            "descricao": "abc",
            "tipo": "resposta_aberta",
            "pontuacaoMaxima": 10,
        })


def test_tipo_invalido_deve_falhar():
    with pytest.raises(ValueError, match="Tipo inválido"):
        Atividade.validar({
            "licaoId": "lic001",
            "titulo": "Atividade 1",
            "descricao": "abc",
            "tipo": "dissertativa",
            "pontuacaoMaxima": 10,
        })


def test_multipla_escolha_sem_alternativas_deve_falhar():
    with pytest.raises(ValueError, match="ao menos 2 alternativas"):
        Atividade.validar({
            "licaoId": "lic001",
            "titulo": "Atividade 1",
            "descricao": "abc",
            "tipo": "multipla_escolha",
            "pontuacaoMaxima": 10,
            "alternativas": [{"texto": "A", "correta": True}],
        })


def test_pontuacao_negativa_deve_falhar():
    with pytest.raises(ValueError, match="pontuacaoMaxima"):
        Atividade.validar({
            "licaoId": "lic001",
            "titulo": "Atividade 1",
            "descricao": "abc",
            "tipo": "resposta_aberta",
            "pontuacaoMaxima": -1,
        })