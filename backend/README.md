# Backend — Plataforma Web Gamificada e Acessível para o Ensino de Informática

API REST em Python puro responsável pelas regras de negócio da plataforma. Utiliza **Firebase Authentication** para autenticação e **Firebase Firestore** para persistência dos dados.

---

## 📋 Sumário

- [Tecnologias utilizadas](#-tecnologias-utilizadas)
- [Estrutura do projeto](#-estrutura-do-projeto)
- [Pré-requisitos](#-pré-requisitos)
- [Configuração do ambiente](#-configuração-do-ambiente)
- [Como rodar o servidor](#-como-rodar-o-servidor)
- [Como rodar os testes](#-como-rodar-os-testes)
- [Endpoints da API](#-endpoints-da-api)
- [Estrutura do banco](#-estrutura-do-banco-equivalente-a-migrations)
- [Gamificação](#-gamificação)
- [Regras de segurança do Firestore](#-regras-de-segurança-do-firestore)
- [Boas práticas adotadas](#-boas-práticas-adotadas)

---

## 🛠 Tecnologias utilizadas

| Camada | Tecnologia | Função |
|--------|-----------|--------|
| Linguagem | Python 3.12 | Regras de negócio e processamento |
| Autenticação | Firebase Authentication | Login, cadastro e identificação de usuário |
| Banco de dados | Firebase Firestore | Armazenamento NoSQL dos dados |
| Servidor HTTP | `http.server` (biblioteca padrão) | Servidor em Python puro |
| Testes | Pytest | Testes automatizados |
| Variáveis de ambiente | python-dotenv | Gerenciamento de credenciais |

---

## 📁 Estrutura do projeto

backend/
├── app/
│ ├── routes/ # Rotas da API REST
│ │ ├── auth.py
│ │ ├── alunos.py
│ │ ├── cursos.py
│ │ ├── licoes.py
│ │ ├── atividades.py
│ │ ├── entregas.py
│ │ ├── notas.py
│ │ ├── progresso.py
│ │ ├── xp.py
│ │ └── ranking.py
│ ├── services/ # Regras de negócio
│ │ ├── auth_service.py
│ │ ├── aluno_service.py
│ │ ├── curso_service.py
│ │ ├── licao_service.py
│ │ ├── atividade_service.py
│ │ ├── entrega_service.py
│ │ ├── nota_service.py
│ │ ├── progresso_service.py
│ │ ├── xp_service.py
│ │ └── ranking_service.py
│ ├── models/ # Modelos e validações
│ │ ├── aluno.py
│ │ ├── curso.py
│ │ ├── licao.py
│ │ ├── atividade.py
│ │ ├── entrega.py
│ │ ├── nota.py
│ │ └── progresso.py
│ ├── database/ # Conexão com Firestore + seed + schema
│ │ ├── firebase.py
│ │ ├── schema.py
│ │ └── seed.py
│ ├── middlewares/ # Autenticação e tratamento de erros
│ │ ├── auth_middleware.py
│ │ └── error_handler.py
│ └── main.py # Servidor HTTP (ponto de entrada)
├── tests/ # Testes automatizados
│ ├── test_auth.py
│ ├── test_alunos.py
│ ├── test_cursos.py
│ ├── test_licoes.py
│ ├── test_atividades.py
│ ├── test_entregas.py
│ └── test_notas.py
├── requirements.txt
├── .env.example # Modelo de variáveis de ambiente
└── README.md


---

## ✅ Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Python 3.10 ou superior** — [python.org](https://www.python.org/downloads/)
- **Git** — [git-scm.com](https://git-scm.com/)
- **Conta no Firebase** — [console.firebase.google.com](https://console.firebase.google.com/)

---

## ⚙️ Configuração do ambiente

### 1. Clonar o repositório

```bash
git clone https://github.com/DupleExcellence/AcessiblePlatform.git
cd AcessiblePlatform/backend