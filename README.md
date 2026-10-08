# Plataforma Web Gamificada e Acessível para o Ensino de Informática

**Projeto Integrador — UNIVESP — Curso de Engenharia da Computação — 2026**

Plataforma web gamificada e acessível destinada ao ensino de informática para estudantes iniciantes, com foco em feedback automático, elementos de gamificação e recursos de acessibilidade.

---

## 📖 Sobre o projeto

O projeto tem como objetivo auxiliar estudantes iniciantes a superar dificuldades no aprendizado de informática, oferecendo:

- Atividades educacionais progressivas;
- Mecanismos de feedback automático;
- Acompanhamento de progresso e pontuação;
- Recursos de acessibilidade (contraste, navegação por teclado, leitura em voz alta);
- Diferentes perfis de acesso: **Aluno**, **Professor** e **Administrador**.

**Problema de pesquisa:** como um sistema computacional com feedback automático em tempo real e recursos de acessibilidade pode auxiliar estudantes iniciantes a superar dificuldades no aprendizado de informática?

---

## 🏗 Arquitetura

```
┌─────────────────┐      HTTP/JSON      ┌─────────────────┐      SDK      ┌─────────────────┐
│                 │ ──────────────────► │                 │ ────────────► │  Firebase       │
│   Frontend      │                     │    Backend      │               │  Auth +         │
│   (React + JS)  │ ◄────────────────── │  (Python + API  │ ◄──────────── │  Firestore      │
│                 │      HTTP/JSON      │      REST)      │     SDK       │                 │
└─────────────────┘                     └─────────────────┘               └─────────────────┘
```

- **Frontend:** React + Vite (deploy: Vercel)
- **Backend:** Python puro (deploy: Render)
- **Autenticação:** Firebase Authentication
- **Banco de dados:** Firebase Firestore (NoSQL)
- **Comunicação:** API REST

---

## 🌐 URLs em produção

| Serviço | URL |
|---------|-----|
| **API (backend)** | https://acessibleplatform.onrender.com |
| **Frontend** | (a definir — Vercel) |

⚠️ **Cold start:** no plano gratuito do Render, a primeira requisição após 15 minutos de inatividade pode demorar 30-60 segundos.

---

## 🛠 Tecnologias

| Camada | Tecnologia |
|--------|-----------|
| Frontend | React + Vite + JavaScript |
| Backend | Python 3.12 (puro) |
| Autenticação | Firebase Authentication |
| Banco de dados | Firebase Firestore |
| Comunicação | API REST |
| Testes Backend | Pytest |
| Testes Frontend | React Testing Library |
| Deploy Backend | Render |
| Deploy Frontend | Vercel |
| Versionamento | Git + GitHub |

---

## 📁 Estrutura do repositório

```
AcessiblePlatform/
├── backend/                  # API REST em Python puro
│   ├── app/                  # Código da aplicação
│   ├── tests/                # Testes automatizados
│   ├── requirements.txt
│   └── README.md             # 📘 Documentação do backend
│
├── frontend/                 # Aplicação React
│   ├── src/
│   │   ├── components/       # Componentes reutilizáveis acessíveis
│   │   ├── pages/            # Telas da aplicação
│   │   ├── services/         # Comunicação com a API
│   │   ├── hooks/
│   │   └── contexts/
│   └── package.json
│
├── docs/                     # Documentação técnica
│   ├── evidencias/           # Prints dos testes + índice
│   │   └── README.md         # 📘 Índice das evidências
│   ├── requisitos/
│   ├── arquitetura/
│   ├── api/
│   └── banco/
│
├── firestore.rules           # Regras de segurança do Firestore
└── README.md                 # Este arquivo
```

---

## 🚀 Como rodar o projeto

### Backend

Veja a documentação completa em **[backend/README.md](backend/README.md)**.

**Resumo:**

```bash
cd backend
python -m venv venv
.\venv\Scripts\Activate      # Windows
pip install -r requirements.txt
python -m app.database.seed  # popular o banco
python -m app.main           # rodar o servidor
pytest                       # rodar os testes
```

### Frontend

```bash
cd frontend
npm install
npm run dev                  # rodar em desenvolvimento
npm test                     # rodar os testes
```

---

## 🔌 Endpoints principais da API

A API está disponível em: `https://acessibleplatform.onrender.com`

**Autenticação:** todas as rotas (exceto cadastro) exigem o cabeçalho:

```
Authorization: Bearer <idToken>
```

O `idToken` é obtido via **Firebase Authentication** no frontend.

### Endpoints disponíveis

| Recurso | Rotas |
|---------|-------|
| **Autenticação** | `POST /api/auth/cadastro`, `GET /api/auth/me` |
| **Alunos** | `GET/PUT/DELETE /api/alunos`, `GET /api/alunos/{id}` |
| **Cursos** | `GET /api/cursos`, `GET /api/cursos/{id}` |
| **Lições** | `GET/POST /api/licoes`, `GET/PUT/DELETE /api/licoes/{id}` |
| **Atividades** | `GET/POST /api/atividades`, `GET/PUT/DELETE /api/atividades/{id}` |
| **Entregas** | `GET/POST /api/entregas`, `GET /api/entregas/{id}` |
| **Notas** | `GET/POST /api/notas`, `GET /api/notas/{id}` |
| **Progresso** | `GET /api/progresso`, `GET /api/progresso/{alunoId}` |

📘 **Documentação completa:** [backend/README.md](backend/README.md)

---

## ✅ Testes e evidências

O backend possui **15 testes automatizados** com Pytest, cobrindo validação de modelos e regras de negócio.

Além disso, foram executados testes manuais da API pública com o Insomnia, cobrindo:

- Autenticação (cadastro, login, token);
- Controle de acesso por perfil (aluno vs. professor);
- Validação de dados;
- Listagens e criação de recursos.

📸 **Índice das evidências:** [docs/evidencias/README.md](docs/evidencias/README.md)

---

## 🔒 Segurança

- Autenticação via **Firebase Authentication** (tokens JWT);
- Senhas gerenciadas pelo Firebase (nunca armazenadas diretamente);
- Controle de acesso por perfil (**Aluno**, **Professor**, **Administrador**);
- **Regras de segurança do Firestore** publicadas ([firestore.rules](firestore.rules));
- Credenciais sensíveis em variáveis de ambiente (`.env`, não versionado).

---

## 📋 Escopo do MVP

### ✅ Dentro do escopo
- Cadastro e login (Firebase Authentication);
- Controle de acesso por perfil;
- Cadastro e gerenciamento de lições;
- Realização de atividades;
- Sistema de pontuação;
- Registro e consulta de resultados;
- Recursos de acessibilidade;
- Integração via API REST;
- Banco de dados na nuvem (Firestore);
- Testes automatizados;
- Documentação contínua.

### ❌ Fora do escopo (evolução futura)
- Aplicativo mobile;
- Pagamentos;
- Chat em tempo real;
- IA avançada;
- Gamificação complexa;
- Ranking complexo e gráficos avançados;
- Análise de dados avançada;
- Tradução automática;
- Comunicação via WhatsApp.

---

## 👥 Autores

- **Raphael Bott Riquete**
- **Vanessa da Silva**

**Projeto Integrador — UNIVESP** — Curso de Engenharia da Computação — 2026.

---

## 📄 Licença

Uso acadêmico.
