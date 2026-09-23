"""
Script de seed inicial do Firestore.

Cria os documentos essenciais para o funcionamento do MVP:
- perfis: aluno, professor, administrador
- cursos: um curso de exemplo
- licoes: uma lição de exemplo

Uso:
    python -m app.database.seed
"""
from firebase_admin import firestore
from app.database.firebase import (
    db,
    COLECAO_PERFIS,
    COLECAO_CURSOS,
    COLECAO_LICOES,
)


def criar_perfis():
    """Cria os três perfis do sistema."""
    perfis = [
        {
            "id": "aluno",
            "nome": "Aluno",
            "descricao": "Usuário que realiza atividades e consulta resultados.",
            "permissoes": ["ler_licao", "realizar_atividade", "ver_proprio_progresso"],
        },
        {
            "id": "professor",
            "nome": "Professor",
            "descricao": "Usuário que gerencia lições, atividades e corrige entregas.",
            "permissoes": ["criar_licao", "criar_atividade", "corrigir_entrega", "ver_alunos"],
        },
        {
            "id": "administrador",
            "nome": "Administrador",
            "descricao": "Usuário que gerencia usuários e configurações do sistema.",
            "permissoes": ["gerenciar_usuarios", "ver_relatorios", "configurar_sistema"],
        },
    ]

    for perfil in perfis:
        COLECAO_PERFIS.document(perfil["id"]).set({
            "nome": perfil["nome"],
            "descricao": perfil["descricao"],
            "permissoes": perfil["permissoes"],
        })
        print(f"Perfil criado: {perfil['id']}")


def criar_curso_exemplo():
    """Cria um curso de exemplo."""
    curso_ref = COLECAO_CURSOS.document("informatica-basica")
    curso_ref.set({
        "titulo": "Informática Básica",
        "descricao": "Curso introdutório de informática para iniciantes.",
        "ativo": True,
        "criadoEm": firestore.SERVER_TIMESTAMP,
    })
    print("Curso criado: informatica-basica")
    return curso_ref


def criar_licao_exemplo(curso_ref):
    """Cria uma lição de exemplo vinculada ao curso."""
    licao_ref = COLECAO_LICOES.document("licao-01-introducao")
    licao_ref.set({
        "titulo": "Introdução ao Computador",
        "descricao": "Conceitos básicos de hardware e software.",
        "conteudo": "Um computador é composto por hardware e software...",
        "cursoId": curso_ref,
        "ordem": 1,
        "ativa": True,
        "criadoEm": firestore.SERVER_TIMESTAMP,
    })
    print("Lição criada: licao-01-introducao")


def executar():
    print("Iniciando seed do Firestore...")
    criar_perfis()
    curso_ref = criar_curso_exemplo()
    criar_licao_exemplo(curso_ref)
    print("Seed concluído com sucesso.")


if __name__ == "__main__":
    executar()