"""
Rotas de notas.

GET  /api/notas             — lista notas (aluno vê as próprias; professor/admin veem todas)
GET  /api/notas/{id}        — consulta nota
POST /api/notas             — corrige entrega e cria nota (professor/admin)
"""
from app.services import nota_service
from app.middlewares.auth_middleware import autenticar, exigir_perfil


def rotear(metodo, caminho, corpo, headers, query=None):
    partes = caminho.strip("/").split("/")
    usuario = autenticar(headers)
    query = query or {}

    if len(partes) == 2:
        if metodo == "GET":
            perfil = (usuario.get("perfil") or {}).get("id")
            if perfil == "aluno":
                return 200, nota_service.listar_notas(aluno_id=usuario["id"])
            return 200, nota_service.listar_notas(
                aluno_id=query.get("alunoId"),
                atividade_id=query.get("atividadeId"),
            )

        if metodo == "POST":
            exigir_perfil(usuario, ["professor", "administrador"])
            return 201, nota_service.corrigir_entrega(corpo, usuario["id"])

    if len(partes) == 3 and metodo == "GET":
        nota = nota_service.obter_nota(partes[2])
        perfil = (usuario.get("perfil") or {}).get("id")
        if perfil == "aluno" and nota["alunoId"] != f"alunos/{usuario['id']}":
            raise PermissionError("Você só pode acessar suas próprias notas.")
        return 200, nota

    return 404, {"erro": "Rota de notas nao encontrada."}