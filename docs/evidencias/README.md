# Evidências de Testes — Backend

Este diretório contém os prints das requisições feitas à API pública do backend, hospedada no Render.

**URL da API:** https://acessibleplatform.onrender.com

**Ferramenta utilizada:** Insomnia

---

## Índice de Evidências

### Fluxo básico (autenticação, listagens e validações)

| # | Arquivo | Descrição | Status |
|---|---------|-----------|--------|
| 01 | `01_api_no_ar_401.png` | Requisição sem token retorna 401 (autenticação obrigatória) | ✅ |
| 02 | `02_cadastro_aluno_201.png` | Cadastro de aluno via `POST /api/auth/cadastro` | ✅ |
| 03 | `03_login_aluno_idToken.png` | Login no Firebase Auth e obtenção do `idToken` | ✅ |
| 04 | `04_auth_me_200.png` | Consulta dos dados do usuário autenticado (`/api/auth/me`) | ✅ |
| 05 | `05_listar_licoes_200.png` | Listagem de lições autenticada | ✅ |
| 06 | `06_listar_cursos_200.png` | Listagem de cursos autenticada | ✅ |
| 07 | `07_progresso_200.png` | Consulta de progresso do aluno | ✅ |
| 08 | `08_validacao_400.png` | Validação de dados obrigatórios (POST sem body) | ✅ |
| 09 | `09_aluno_negado_403.png` | Aluno tentando criar lição — acesso negado (403) | ✅ |
| 10 | `10_cadastro_professor_201.png` | Cadastro de professor | ✅ |
| 11 | `11_login_professor_idToken.png` | Login do professor e obtenção do `idToken` | ✅ |
| 12 | `12_professor_cria_licao_201.png` | Professor cria lição com sucesso (201) | ✅ |

### Gamificação (XP e ranking)

| # | Arquivo | Descrição | Status |
|---|---------|-----------|--------|
| 13 | `13_api_xp_200.png` | Consulta de XP e nível do aluno | ✅ |
| 14 | `14_api_ranking_200.png` | Ranking de alunos por XP | ✅ |
| 15 | `15_api_ranking_eu_200.png` | Posição do aluno no ranking | ✅ |

### Fluxo end-to-end (aluno + professor)

| # | Arquivo | Descrição | Status |
|---|---------|-----------|--------|
| 16 | `16_professor_cria_atividade_201.png` | Professor cria atividade (201) | ✅ |
| 17 | `17_aluno_envia_resposta_201.png` | Aluno envia resposta a uma atividade (201) | ✅ |
| 18 | `18_professor_corrige_201.png` | Professor corrige a entrega e cria nota (201) | ✅ |
| 19 | `19_aluno_xp_100.png` | XP do aluno após a correção (100 XP) | ✅ |

---

## Como os testes foram executados

1. **Ferramenta:** Insomnia (Desktop);
2. **Endpoints testados:**
   - Autenticação: cadastro, login, consulta de dados;
   - Listagens: lições, cursos, progresso;
   - Criação: lições e atividades (professor);
   - Fluxo end-to-end: aluno envia entrega → professor corrige → XP é incrementado;
   - Validações: dados obrigatórios, duplicidade e controle de acesso;
   - Gamificação: XP, nível, ranking.
3. **Autenticação:** token JWT do Firebase (`Authorization: Bearer <idToken>`);
4. **Ambiente:** API pública hospedada no Render.

---

## O que as evidências comprovam

- ✅ **API pública está no ar** (responde 401 sem token);
- ✅ **Autenticação funciona** (Firebase Auth + JWT);
- ✅ **Validação de dados funciona** (rejeita requisições inválidas — 400);
- ✅ **Controle de acesso por perfil funciona:**
  - Aluno tentando criar lição → **403 (negado)**
  - Professor criando lição → **201 (criado)**
- ✅ **Firestore está conectado** (dados persistidos e recuperados);
- ✅ **CORS configurado** (integração frontend ↔ backend permitida);
- ✅ **Fluxo end-to-end funciona** (aluno responde → professor corrige → XP é incrementado);
- ✅ **Gamificação funciona** (XP é incrementado após a correção: 10 pontos = 100 XP);
- ✅ **Consistência de dados** (entrega → nota → XP → ranking).

---

## Uso no relatório

Os prints podem ser usados como **figuras** no relatório final, na seção de **Resultados preliminares** ou **Evidências do desenvolvimento**.

Sugestão de legendas (padrão ABNT):

- **Figura X** – Requisição sem autenticação retorna status 401
- **Figura Y** – Cadastro de aluno retorna status 201
- **Figura Z** – Controle de acesso: aluno não pode criar lição (status 403)
- **Figura W** – Fluxo end-to-end: aluno envia resposta e professor corrige
- **Figura V** – XP do aluno incrementado após a correção (100 XP)

**Fonte:** Elaborado pelos autores (2026).

---

## Observações importantes

- **Cold start:** no plano gratuito do Render, o serviço hiberna após 15 minutos sem uso. A primeira requisição após esse período pode demorar 30-60 segundos.
- **Tokens JWT:** expiram em 1 hora. Após esse prazo, é necessário fazer login novamente para obter um novo `idToken`.
- **Prints não versionados:** a pasta `docs/evidencias/` está no `.gitignore`, pois contém arquivos binários pesados. Os prints existem apenas localmente, e este `README.md` é a versão versionada do índice.

---

**Última atualização:** 2026-10-14

---
### Testes Funcionais — Front-end


## 2. Escopo dos testes

Foram avaliados os seguintes componentes e funcionalidades:

- Autenticação, login e logout.
- Persistência de sessão.
- Proteção de rotas por perfil.
- Dashboards de aluno, professor e administrador.
- Listagem e paginação de cursos, alunos, lições e atividades.
- Criação e persistência de lições.
- Associação entre cursos, lições e atividades.
- Envio e consulta de atividades.
- Visualização e correção de entregas.
- Validação de respostas e pontuações.
- Persistência de notas e status.
- Atualização e consistência do XP e ranking.
- Histórico de atividades do aluno.
- Integridade dos dados após atualizar a página.

---

| Teste | Cenário | Resultado |
|---:|---|---|
| 1–24 | Testes funcionais anteriores | Aprovados; detalhamento individual não disponível neste registro. |
| 25 | Integridade e isolamento dos dados do aluno | Aprovado |
| 26 | Criação e persistência de lição | Aprovado |
| 27 | Exclusão de lição | Não aplicável — opção inexistente na interface. |
| 28 | Edição de lição | Não aplicável — opção inexistente na interface. |
| 29 | Validação de título obrigatório da lição | Aprovado |
| 30 | Validação de conteúdo obrigatório da lição | Aprovado |
| 31 | Seleção obrigatória de curso para criar lição | Aprovado |
| 32 | Acesso do aluno à lição | Aprovado |
| 33 | Associação entre atividade e lição | Aprovado |
| 34 | Prevenção de envio duplicado de atividade | Aprovado na interface |
| 35 | Recorreção de entrega já corrigida | Não aplicável — opção inexistente na interface. |
| 36 | Identificação de entregas pendentes | Aprovado |
| 37 | Atualização do status após correção | Aprovado |
| 38 | Validação da pontuação máxima da atividade | Aprovado |
| 39 | Consistência do XP entre perfil e ranking | Aprovado |
| 40 | Ordenação do ranking por XP | Aprovado |
| 41 | Empate no ranking | Aprovado com ressalva — regra de desempate a confirmar. |
| 42 | Atualização da quantidade de alunos após cadastro | Aprovado |
| 43 | Consistência dos indicadores administrativos de cursos e lições | Aprovado |
| 44 | Paginação da lista de alunos | Aprovado |
| 45 | Pesquisa ou filtro de alunos | Funcionalidade ausente — não há campo de pesquisa/filtro. |
| 46 | Paginação da lista de cursos | Aprovado |
| 47 | Integridade dos cursos entre páginas | Aprovado |
| 48 | Cadastro de cursos pelo dashboard administrativo | Não aplicável — formulário inexistente. |
| 49 | Consistência dos cursos entre administração e professor | Aprovado |
| 50 | Acesso do aluno aos cursos e lições | Aprovado |
| 51 | Aluno acessa `/HomeAdm` diretamente | Aprovado — acesso bloqueado ou redirecionado. |
| 52 | Aluno acessa `/AtividadesProfessor` diretamente | Aprovado — acesso bloqueado ou redirecionado. |
| 53 | Professor acessa `/HomeAdm` diretamente | Aprovado — acesso bloqueado ou redirecionado. |
| 54 | Professor acessa `/HomeAluno` diretamente | Aprovado — acesso bloqueado ou redirecionado. |
| 55 | Persistência da sessão do aluno após atualizar a página | Aprovado |
| 56 | Persistência da sessão do professor após atualizar a página | Aprovado |
| 57 | Persistência da sessão do administrador após atualizar a página | Aprovado |
| 58 | Botão Voltar após logout administrativo | Aprovado — dashboard permaneceu protegido. |
| 59 | Acesso do aluno à rota protegida após logout | Aprovado — acesso bloqueado ou redirecionado. |
| 60 | Acesso do professor à rota protegida após logout | Aprovado — acesso bloqueado ou redirecionado. |
| 61 | Acesso do administrador à rota protegida após logout | Aprovado — acesso bloqueado ou redirecionado. |
| 62 | Consistência da lista e quantidade de alunos após atualização | Aprovado |
| 63 | Consistência da lista e quantidade de lições após atualização | Aprovado |
| 64 | Consistência da lista e quantidade de atividades após atualização | Aprovado |
| 65 | Persistência do histórico, status e notas do aluno | Aprovado |
| 66 | Persistência do XP e posição após novo login | Aprovado |
| 67 | Ordenação do histórico de atividades | Aprovado com ressalva — regra exata de ordenação a confirmar. |
| 68 | Envio de atividade sem selecionar alternativa | Aprovado — envio bloqueado com mensagem clara. |
| 69 | Novo envio de atividade já respondida | Aprovado — novo envio impedido na interface. |
| 70 | Correção de resposta incorreta | Aprovado |
| 71 | Correção de resposta correta | Aprovado |
| 72 | Registro de nota zero para resposta incorreta | Aprovado |
| 73 | Consistência do XP após correção com zero pontos | Aprovado |
| 74 | Tentativa de atribuir nota acima do máximo | Aprovado — sistema impediu a operação. |
| 75 | Correção sem informar pontuação | Aprovado — operação bloqueada com mensagem clara. |
| Complementar | Persistência da correção após atualizar a página | Aprovado — nota e status permaneceram corretos. |

**Última atualização:** 2026-10-29
