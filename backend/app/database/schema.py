"""
Definição do schema (estrutura) do banco de dados Firestore.

Como o Firestore é schemaless, este arquivo documenta formalmente
as coleções e seus campos, servindo como referência para a aplicação.
Alterações no banco devem ser refletidas aqui.
"""

SCHEMA = {
    "usuarios": {
        "campos": {
            "id": "string (UID do Firebase Auth)",
            "nome": "string",
            "email": "string",
            "perfil": "DocumentReference para perfis",
            "ativo": "boolean",
            "criadoEm": "timestamp",
            "atualizadoEm": "timestamp",
        },
        "obrigatorios": ["nome", "email", "perfil"],
    },
    "perfis": {
        "campos": {
            "id": "string (aluno | professor | administrador)",
            "nome": "string",
            "descricao": "string",
            "permissoes": "array de strings",
        },
        "obrigatorios": ["nome", "permissoes"],
    },
    "alunos": {
        "campos": {
            "id": "string",
            "usuarioId": "DocumentReference para usuarios",
            "idade": "number",
            "turma": "string",
            "professorId": "DocumentReference para professores",
            "pontuacaoTotal": "number",
            "xpTotal": "number",
            "criadoEm": "timestamp",
        },
        "obrigatorios": ["usuarioId", "idade", "pontuacaoTotal", "xpTotal"],
    },
    "professores": {
        "campos": {
            "id": "string",
            "usuarioId": "DocumentReference para usuarios",
            "disciplina": "string",
            "criadoEm": "timestamp",
        },
        "obrigatorios": ["usuarioId"],
    },
    "cursos": {
        "campos": {
            "id": "string",
            "titulo": "string",
            "descricao": "string",
            "ativo": "boolean",
            "criadoEm": "timestamp",
        },
        "obrigatorios": ["titulo"],
    },
    "licoes": {
        "campos": {
            "id": "string",
            "titulo": "string",
            "descricao": "string",
            "conteudo": "string",
            "cursoId": "DocumentReference para cursos",
            "professorId": "DocumentReference para professores",
            "ordem": "number",
            "ativa": "boolean",
            "criadoEm": "timestamp",
            "atualizadoEm": "timestamp",
        },
        "obrigatorios": ["titulo", "conteudo", "professorId"],
    },
    "atividades": {
        "campos": {
            "id": "string",
            "licaoId": "DocumentReference para licoes",
            "titulo": "string",
            "descricao": "string",
            "tipo": "string (multipla_escolha | resposta_aberta | verdadeiro_falso)",
            "alternativas": "array de objetos ({id, texto, correta})",
            "pontuacaoMaxima": "number",
            "prazo": "timestamp",
            "criadoEm": "timestamp",
            "criadoPor": "DocumentReference para usuarios (professor)",
        },
        "obrigatorios": ["licaoId", "titulo", "descricao", "tipo", "pontuacaoMaxima"],
    },
    "entregas": {
        "campos": {
            "id": "string",
            "atividadeId": "DocumentReference para atividades",
            "alunoId": "DocumentReference para alunos",
            "resposta": "string ou array",
            "status": "string (pendente | enviada | corrigida)",
            "enviadoEm": "timestamp",
        },
        "obrigatorios": ["atividadeId", "alunoId", "resposta"],
    },
    "notas": {
        "campos": {
            "id": "string",
            "entregaId": "DocumentReference para entregas",
            "alunoId": "DocumentReference para alunos",
            "atividadeId": "DocumentReference para atividades",
            "pontuacao": "number",
            "pontuacaoMaxima": "number",
            "feedback": "string",
            "corrigidoPor": "DocumentReference para professores",
            "corrigidoEm": "timestamp",
        },
        "obrigatorios": ["entregaId", "alunoId", "atividadeId", "pontuacao", "pontuacaoMaxima"],
    },
}


def listar_colecoes():
    """Retorna a lista de coleções definidas no schema."""
    return list(SCHEMA.keys())


def validar_schema():
    """
    Valida se todas as coleções do schema existem no Firestore.
    Útil para rodar como verificação no deploy.
    """
    from app.database.firebase import db

    colecoes_no_firestore = [c.id for c in db.collections()]
    faltando = [c for c in SCHEMA.keys() if c not in colecoes_no_firestore]

    if faltando:
        print(f"⚠️  Coleções faltando: {faltando}")
        return False

    print("✅ Todas as coleções estão presentes.")
    return True


if __name__ == "__main__":
    validar_schema()