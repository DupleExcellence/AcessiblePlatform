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