"""
Módulo de integração com o Firebase.

Responsável por inicializar o Firebase Admin SDK (usado no backend
para validação de tokens e acesso ao Firestore) e expor as referências
às coleções utilizadas pela aplicação.
"""
import os
import firebase_admin
from firebase_admin import credentials, firestore, auth
from dotenv import load_dotenv

load_dotenv()

_cred_path = os.getenv("FIREBASE_CREDENTIALS_PATH")

if not firebase_admin._apps:
    cred = credentials.Certificate(_cred_path)
    firebase_admin.initialize_app(cred)

# Cliente Firestore (usado por todos os services)
db = firestore.client()

# Referências das coleções do MVP
COLECAO_USUARIOS = db.collection("usuarios")
COLECAO_PERFIS = db.collection("perfis")
COLECAO_ALUNOS = db.collection("alunos")
COLECAO_PROFESSORES = db.collection("professores")
COLECAO_CURSOS = db.collection("cursos")
COLECAO_LICOES = db.collection("licoes")
COLECAO_ATIVIDADES = db.collection("atividades")
COLECAO_ENTREGAS = db.collection("entregas")
COLECAO_NOTAS = db.collection("notas")
