# Backend — Plataforma Web Gamificada e Acessível para o Ensino de Informática

API REST em Python puro responsável pelas regras de negócio da plataforma. Utiliza **Firebase Authentication** para autenticação e **Firebase Firestore** para persistência dos dados.

---

## 📋 Sumário

- Tecnologias utilizadas
- Estrutura do projeto
- Pré-requisitos
- Configuração do ambiente
- Como rodar o servidor
- Como rodar os testes
- Endpoints da API
- Estrutura do banco
- Gamificação
- Regras de segurança do Firestore
- Boas práticas adotadas

---

## 🛠 Tecnologias utilizadas

| Camada | Tecnologia | Função |
|---|---|---|
| Linguagem | Python 3.12 | Regras de negócio e processamento |
| Autenticação | Firebase Auth | Login, cadastro e identificação |
| Banco de dados | Firebase Firestore | Armazenamento NoSQL |
| Servidor HTTP | http.server | Servidor em Python puro |
| Testes | Pytest | Testes automatizados |
| Variáveis de ambiente | python-dotenv | Credenciais |

---

## 📁 Estrutura do projeto

```text
backend/
├── app/
│   ├── routes/
│   ├── services/
│   ├── models/
│   ├── database/
│   ├── middlewares/
│   └── main.py
├── tests/
├── requirements.txt
├── .env.example
└── README.md
```

---

## ✅ Pré-requisitos

- **Python 3.10+**
- **Git**
- **Conta no Firebase**

---

## ⚙️ Configuração do ambiente

### 1. Clonar o repositório

```bash
git clone https://github.com/DupleExcellence/AcessiblePlatform.git
cd AcessiblePlatform/backend
```

### 2. Criar ambiente virtual

```bash
python -m venv venv
```

Ativar:
- Windows: `.\\venv\\Scripts\\Activate`
- Linux/Mac: `source venv/bin/activate`

### 3. Instalar dependências

```bash
pip install -r requirements.txt
```

### 4. Criar arquivo .env

Copie o `.env.example` para `.env` e preencha:

```env
FIREBASE_CREDENTIALS_PATH=./app/database/firebase-service-account.json
FIREBASE_API_KEY=sua_api_key
FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
FIREBASE_PROJECT_ID=seu_projeto_id
FIREBASE_STORAGE_BUCKET=seu_projeto.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=000000000000
FIREBASE_APP_ID=1:000000000000:web:xxxxxxxxxxxx
```

### 5. Popular o banco

```bash
python -m app.database.seed
```

---

## 🚀 Como rodar o servidor

```bash
python -m app.main
```

Saída esperada: `Servidor rodando em http://0.0.0.0:10000`

---

## 🧪 Como rodar os testes

```bash
pytest
```

Para cobertura: `pytest --cov=app --cov-report=html`

---

## 🔌 Endpoints da API

### Autenticação
| Método | Endpoint | Perfil |
|---|---|---|
| POST | /api/auth/cadastro | público |
| GET | /api/auth/me | autenticado |

> O cadastro aceita `nome`, `email`, `senha`, `perfil`, `telefone`, `idade`, `turma` (aluno) ou `disciplina` (professor).

### Alunos
| Método | Endpoint | Perfil |
|---|---|---|
| GET | /api/alunos | professor/admin |
| GET | /api/alunos/{id} | próprio/professor/admin |
| PUT | /api/alunos/{id} | professor/admin |
| DELETE | /api/alunos/{id} | admin |

### Cursos
| Método | Endpoint | Perfil |
|---|---|---|
| GET | /api/cursos | autenticado |
| GET | /api/cursos/{id} | autenticado |

### Lições
| Método | Endpoint | Perfil |
|---|---|---|
| GET | /api/licoes | autenticado |
| GET | /api/licoes/{id} | autenticado |
| POST | /api/licoes | professor/admin |
| PUT | /api/licoes/{id} | professor/admin |
| DELETE | /api/licoes/{id} | professor/admin |

**Campos da Lição:** `cursoId`, `titulo`, `conteudo`, `descricao`, `ordem`, `videoUrl`, `duracao`, `gabarito`, `arquivo`.

### Atividades, Entregas e Notas
| Método | Endpoint | Perfil |
|---|---|---|
| GET/POST | /api/atividades | autenticado / professor |
| POST | /api/entregas | aluno |
| POST | /api/notas | professor/admin |

### Progresso, XP e Ranking
| Método | Endpoint | Perfil |
|---|---|---|
| GET | /api/progresso | aluno |
| GET | /api/xp | aluno |
| GET | /api/ranking | autenticado |
| GET | /api/ranking/eu | aluno |

### Autenticação nas requisições
Todas as rotas exigem o cabeçalho: `Authorization: Bearer <token>`

---

## 🎮 Gamificação

- **XP:** 10 XP por ponto de pontuação;
- **Níveis:** Iniciante (0), Aprendiz (100), Praticante (300), Avançado (600), Mestre (1000);
- **Ranking:** Top 10 alunos por XP.

---

## 🔒 Segurança

- Firebase Authentication (JWT);
- Senhas gerenciadas pelo Firebase;
- Controle por perfil (Aluno, Professor, Administrador);
- Regras do Firestore;
- Credenciais em `.env`.

---

## 👥 Autores

- **Raphael Bott Riquete**
- **Vanessa da Silva**

**Projeto Integrador — UNIVESP — 2026.**
