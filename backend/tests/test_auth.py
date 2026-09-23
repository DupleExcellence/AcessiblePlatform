"""
Testes de autenticação.
"""
import pytest
from app.services import auth_service


def test_cadastro_sem_email_deve_falhar():
    with pytest.raises(ValueError, match="Nome, e-mail e senha"):
        auth_service.cadastrar_usuario({"nome": "Maria", "senha": "123"})


def test_cadastro_com_perfil_invalido_deve_falhar():
    with pytest.raises(ValueError, match="Perfil inválido"):
        auth_service.cadastrar_usuario({
            "nome": "Maria",
            "email": "maria@email.com",
            "senha": "123456",
            "perfil": "gerente",
        })