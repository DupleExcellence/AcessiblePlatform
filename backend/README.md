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

```text
backend/
├── app/
│   ├── routes/                  # Rotas da API REST
│   │   ├── auth.py
│   │   ├── alunos.py
│   │   ├── cursos.py
│   │   ├── licoes.py
│   │   ├── atividades.py
│   │   ├── entregas.py
│   │   ├── notas.py
│   │   ├── progresso.py
│   │   ├── xp.py
│   │   └── ranking.py
│   ├── services/                # Regras de negócio
│   │   ├── auth_service.py
│   │   ├── aluno_service.py
│   │   ├── curso_service.py
│   │   ├── licao_service.py
│   │   ├── atividade_service.py
│   │   ├── entrega_service.py
│   │   ├── nota_service.py
│   │   ├── progresso_service.py
│   │   ├── xp_service.py
│   │   └── ranking_service.py
│   ├── models/                  # Modelos e validações
│   │   ├── aluno.py
│   │   ├── curso.py
│   │   ├── licao.py
│   │   ├── atividade.py
│   │   ├── entrega.py
│   │   ├── nota.py
│   │   └── progresso.py
│   ├── database/                # Conexão com Firestore + seed + schema
│   │   ├── firebase.py
│   │   ├── schema.py
│   │   └── seed.py
│   ├── middlewares/             # Autenticação e tratamento de erros
│   │   ├── auth_middleware.py
│   │   └── error_handler.py
│   └── main.py                  # Servidor HTTP (ponto de entrada)
├── tests/                       # Testes automatizados
│   ├── test_auth.py
│   ├── test_alunos.py
│   ├── test_cursos.py
│   ├── test_licoes.py
│   ├── test_atividades.py
│   ├── test_entregas.py
│   └── test_notas.py
├── requirements.txt
├── .env.example                 # Modelo de variáveis de ambiente
└── README.md

✅ Pré-requisitos
Antes de começar, certifique-se de ter instalado:

Python 3.10 ou superior — python.org

Git — git-scm.com

Conta no Firebase — console.firebase.google.com

⚙️ Configuração do ambiente
1. Clonar o repositório
bash
git clone https://github.com/DupleExcellence/AcessiblePlatform.git
cd AcessiblePlatform/backend
2. Criar ambiente virtual
bash
python -m venv venv
Ativar:

Windows (PowerShell): .\venv\Scripts\Activate

Linux/Mac: source venv/bin/activate

3. Instalar dependências
bash
pip install -r requirements.txt
4. Configurar o Firebase
4.1. Criar o projeto no Firebase
Acesse console.firebase.google.com;

Clique em Adicionar projeto e dê um nome;

Desative o Google Analytics (opcional).

4.2. Ativar o Firestore
Menu lateral → Firestore Database → Criar banco de dados;

Escolha o modo Produção;

Localização: southamerica-east1 (São Paulo).

4.3. Ativar o Authentication
Menu lateral → Authentication → Vamos começar;

Aba Sign-in method → ativar E-mail/senha.

4.4. Gerar a chave de serviço
Engrenagem → Configurações do projeto → aba Contas de serviço;

Clique em Gerar nova chave privada → Gerar chave;

Renomeie o arquivo baixado para firebase-service-account.json;

Mova para backend/app/database/.

5. Criar o arquivo .env
Copie o .env.example e renomeie para .env:

bash
cp .env.example .env
Preencha com suas credenciais:

env
FIREBASE_CREDENTIALS_PATH=./app/database/firebase-service-account.json
FIREBASE_API_KEY=sua_api_key
FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
FIREBASE_PROJECT_ID=seu_projeto_id
FIREBASE_STORAGE_BUCKET=seu_projeto.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=000000000000
FIREBASE_APP_ID=1:000000000000:web:xxxxxxxxxxxx

HOST=0.0.0.0
PORT=10000
⚠️ Atenção: o arquivo .env NÃO deve ser versionado no Git. Ele já está no .gitignore.

6. Popular o banco com dados iniciais
bash
python -m app.database.seed
Isso cria:

3 perfis: aluno, professor, administrador;

1 curso de exemplo: informatica-basica;

1 lição de exemplo: licao-01-introducao.

🚀 Como rodar o servidor
Com o ambiente virtual ativo:

bash
python -m app.main
Saída esperada:

text
Servidor rodando em http://0.0.0.0:10000
Testar a API
Em outro terminal:

bash
curl http://localhost:10000/api/cursos
Como a rota exige autenticação, o retorno esperado é:

json
{"status": 401, "erro": "Token de autenticação ausente ou inválido."}
Isso significa que o servidor está funcionando corretamente.

Para parar o servidor: Ctrl + C.

🧪 Como rodar os testes
bash
pytest
Saída esperada:

text
============================= test session starts =============================
collected 15 items
...
============================== 15 passed in 1.40s =============================
Para ver a cobertura de testes:

bash
pytest --cov=app --cov-report=html
O relatório HTML é gerado em htmlcov/index.html.

🔌 Endpoints da API
Autenticação
Método	Endpoint	Perfil	Descrição
POST	/api/auth/cadastro	público	Cadastra um novo usuário
GET	/api/auth/me	autenticado	Retorna dados do usuário logado
Nota sobre o cadastro: O endpoint de cadastro aceita os campos nome, email, senha, perfil (aluno/professor/administrador), telefone, e campos específicos por perfil: idade e turma (aluno) ou disciplina (professor).

Alunos
Método	Endpoint	Perfil	Descrição
GET	/api/alunos	professor/admin	Lista todos os alunos
GET	/api/alunos/{id}	próprio/professor/admin	Consulta um aluno
PUT	/api/alunos/{id}	professor/admin	Atualiza dados de um aluno
DELETE	/api/alunos/{id}	admin	Remove/desativa um aluno
Cursos
Método	Endpoint	Perfil	Descrição
GET	/api/cursos	autenticado	Lista cursos
GET	/api/cursos/{id}	autenticado	Consulta um curso
Lições
Método	Endpoint	Perfil	Descrição
GET	/api/licoes	autenticado	Lista lições
GET	/api/licoes/{id}	autenticado	Consulta uma lição
POST	/api/licoes	professor/admin	Cria uma lição
PUT	/api/licoes/{id}	professor/admin	Atualiza uma lição
DELETE	/api/licoes/{id}	professor/admin	Remove uma lição
Campos aceitos na criação/edição de Lição (POST / PUT):

json
{
  "cursoId": "string (obrigatório)",
  "titulo": "string (obrigatório)",
  "conteudo": "string (obrigatório)",
  "descricao": "string (opcional)",
  "ordem": "int (opcional, padrão 1)",
  "videoUrl": "string (opcional)",
  "duracao": "string (opcional)",
  "gabarito": "string (opcional)",
  "arquivo": "string (opcional)"
}
Atividades
Método	Endpoint	Perfil	Descrição
GET	/api/atividades	autenticado	Lista atividades
GET	/api/atividades/{id}	autenticado	Consulta uma atividade
POST	/api/atividades	professor/admin	Cria uma atividade
PUT	/api/atividades/{id}	professor/admin	Atualiza uma atividade
DELETE	/api/atividades/{id}	professor/admin	Remove uma atividade
Entregas
Método	Endpoint	Perfil	Descrição
GET	/api/entregas	aluno/professor	Lista entregas
GET	/api/entregas/{id}	próprio/professor	Consulta uma entrega
POST	/api/entregas	aluno	Envia resposta a uma atividade
Notas
Método	Endpoint	Perfil	Descrição
GET	/api/notas	aluno/professor	Lista notas
GET	/api/notas/{id}	próprio/professor	Consulta uma nota
POST	/api/notas	professor/admin	Corrige entrega e cria nota
Progresso
Método	Endpoint	Perfil	Descrição
GET	/api/progresso	aluno	Progresso do aluno logado
GET	/api/progresso/{alunoId}	professor/admin	Progresso de um aluno específico
XP e Gamificação
Método	Endpoint	Perfil	Descrição
GET	/api/xp	aluno	XP e nível do aluno logado
GET	/api/xp/{alunoId}	professor/admin	XP de um aluno específico
GET	/api/ranking	autenticado	Top 10 alunos por XP
GET	/api/ranking?limite=20	autenticado	Top N alunos
GET	/api/ranking/eu	aluno	Posição do aluno logado no ranking
Autenticação nas requisições
Todas as rotas autenticadas exigem o cabeçalho:

text
Authorization: Bearer <token>
O token é obtido pelo Firebase Authentication no frontend (via SDK JS).

🗄 Estrutura do banco (equivalente a migrations)
Como o Firestore é schemaless (não possui esquema fixo, diferente de bancos relacionais), o "schema" do banco está definido em três artefatos complementares:

1. backend/app/database/schema.py — definição declarativa
Contém a estrutura formal de cada coleção (campos, tipos, campos obrigatórios). Serve como referência para a aplicação e como fonte da verdade sobre o modelo de dados.

2. backend/app/database/seed.py — criação dos dados iniciais
Script que cria as coleções e popula com dados iniciais:

bash
python -m app.database.seed
3. firestore.rules — regras de segurança
Define quem pode ler e escrever em cada coleção, com base no perfil do usuário.

Verificação do schema
Para verificar se todas as coleções estão criadas no Firestore:

bash
python -m app.database.schema
Coleções do sistema
Coleção	Descrição
usuarios	Dados base de autenticação e identificação (inclui telefone)
perfis	Tipos de perfil (aluno, professor, administrador)
alunos	Dados complementares do aluno (idade, turma, XP, pontuação)
professores	Dados complementares do professor (disciplina)
cursos	Cursos disponibilizados
licoes	Lições associadas aos cursos (com vídeo, arquivo, gabarito)
atividades	Atividades associadas às lições
entregas	Respostas enviadas pelos alunos
notas	Resultados das correções
📘 Dicionário de dados completo: consulte a seção 2.9 do relatório técnico.

🎮 Gamificação
A plataforma possui um sistema simplificado de gamificação, com XP, níveis e ranking.

Como o XP é calculado
10 XP por ponto de pontuação obtido em uma atividade;

O XP é incrementado automaticamente quando o professor corrige uma entrega.

Níveis
Nível	XP mínimo	Título
1	0	Iniciante
2	100	Aprendiz
3	300	Praticante
4	600	Avançado
5	1000	Mestre
Ranking
Ordenado por XP total (decrescente);

Limite padrão: top 10 alunos;

Personalizável via query string (?limite=20).

🔒 Regras de segurança do Firestore
As regras de segurança estão no arquivo firestore.rules (raiz do projeto). Elas devem ser publicadas no console do Firebase em:

Firestore Database → Regras → Publicar

As regras garantem que:

Alunos só leem/escrevem seus próprios dados;

Professores podem ler dados de alunos e gerenciar lições/atividades;

Administradores podem gerenciar usuários;

Qualquer outra coleção fica bloqueada por padrão.

📐 Boas práticas adotadas
Arquitetura em camadas
Routes — recebem as requisições HTTP;

Services — contêm as regras de negócio;

Models — definem a estrutura e validações;

Middlewares — autenticação e tratamento de erros;

Database — comunicação com o Firestore.

Segurança
Autenticação via Firebase Authentication;

Senhas nunca armazenadas diretamente;

Controle de acesso por perfil;

Regras de segurança do Firestore publicadas;

Credenciais sensíveis em variáveis de ambiente.

Qualidade
15 testes automatizados com Pytest;

Validação de dados no backend;

Tratamento centralizado de erros.

Versionamento
Padrão Conventional Commits;

Estratégia de branches: main, develop, feature/*.

👥 Autores
Raphael Bott Riquete

Vanessa da Silva

Projeto Integrador — UNIVESP — Curso de Engenharia da Computação — 2026.
