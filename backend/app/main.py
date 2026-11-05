"""
Ponto de entrada do backend.

Servidor HTTP mínimo em Python puro, responsável por receber as
requisições da API REST, rotear para os módulos correspondentes
e retornar respostas em JSON.
"""
import json
import os
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import urlparse, parse_qs

from app.routes import auth, alunos, cursos, licoes, atividades, entregas, notas, progresso, xp, ranking
from app.middlewares.error_handler import tratar_excecao

# Recursos que recebem "query" como parâmetro
RECURSOS_COM_QUERY = {"licoes", "atividades", "entregas", "notas", "ranking"}

ROTAS = {
    "auth": auth.rotear,
    "alunos": alunos.rotear,
    "cursos": cursos.rotear,
    "licoes": licoes.rotear,
    "atividades": atividades.rotear,
    "entregas": entregas.rotear,
    "notas": notas.rotear,
    "progresso": progresso.rotear,
    "xp": xp.rotear,
    "ranking": ranking.rotear,
}


class Handler(BaseHTTPRequestHandler):
    def _responder(self, status, corpo):
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Headers", "Authorization, Content-Type")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        self.end_headers()
        self.wfile.write(json.dumps(corpo, default=str).encode("utf-8"))

    def _processar(self, metodo):
        try:
            parsed = urlparse(self.path)
            caminho = parsed.path
            query = {k: v[0] for k, v in parse_qs(parsed.query).items()}

            headers = {k: v for k, v in self.headers.items()}

            corpo = {}
            tamanho = int(self.headers.get("Content-Length", 0) or 0)
            if tamanho > 0:
                corpo = json.loads(self.rfile.read(tamanho).decode("utf-8"))

            partes = caminho.strip("/").split("/")
            if len(partes) >= 2 and partes[0] == "api":
                recurso = partes[1]
                roteador = ROTAS.get(recurso)
                if roteador:
                    try:
                        if recurso in RECURSOS_COM_QUERY:
                            status, resposta = roteador(metodo, caminho, corpo, headers, query)
                        else:
                            status, resposta = roteador(metodo, caminho, corpo, headers)
                        return self._responder(status, resposta)
                    except Exception as exc:
                        info = tratar_excecao(exc)
                        return self._responder(info.get("status", 500), info)

            self._responder(404, {"erro": "Rota não encontrada."})

        except Exception as exc:
            info = tratar_excecao(exc)
            self._responder(info.get("status", 500), info)

    def do_GET(self):
        self._processar("GET")

    def do_POST(self):
        self._processar("POST")

    def do_PUT(self):
        self._processar("PUT")

    def do_DELETE(self):
        self._processar("DELETE")

    def do_OPTIONS(self):
        self._responder(204, {})


if __name__ == "__main__":
    import sys
    print(">>> Iniciando servidor...", flush=True)

    host = "0.0.0.0"
    porta = int(os.getenv("PORT", 10000))
    print(f">>> Host: {host} | Porta: {porta}", flush=True)

    try:
        servidor = HTTPServer((host, porta), Handler)
        print(f">>> Servidor rodando em http://{host}:{porta}", flush=True)
        servidor.serve_forever()
    except Exception as e:
        print(f">>> ERRO ao iniciar servidor: {e}", flush=True)
        sys.exit(1)