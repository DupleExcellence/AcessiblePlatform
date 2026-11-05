---
title: "PLATAFORMA WEB GAMIFICADA E ACESSÍVEL PARA O ENSINO DE INFORMÁTICA"
author: 
  - RAPHAEL BOTT RIQUETE
  - VANESSA DA SILVA
date: "Presidente Prudente - SP\n2026"
---

# UNIVERSIDADE VIRTUAL DO ESTADO DE SÃO PAULO

**RAPHAEL BOTT RIQUETE**
**VANESSA DA SILVA**

## PLATAFORMA WEB GAMIFICADA E ACESSÍVEL PARA O ENSINO DE INFORMÁTICA

Presidente Prudente - SP
2026

---

**RAPHAEL BOTT RIQUETE**
**VANESSA DA SILVA**

## PLATAFORMA WEB GAMIFICADA E ACESSÍVEL PARA O ENSINO DE INFORMÁTICA

Relatório Técnico-Científico apresentado na disciplina de Projeto Integrador para o curso de Engenharia da Computação da Universidade Virtual do Estado de São Paulo (UNIVESP). Tutor: (nome do tutor). Polo Presidente Prudente e Tarabai - SP.

Presidente Prudente - SP
2026

---

RIQUETE, Raphael Bott; SILVA, Vanessa da. **PLATAFORMA WEB GAMIFICADA E ACESSÍVEL PARA O ENSINO DE INFORMÁTICA**. 2026. Relatório Técnico-Científico. Curso de Engenharia da Computação -- Universidade Virtual do Estado de São Paulo. Tutor: (nome do tutor). Polo Presidente Prudente e Tarabai - SP, 2026.

## RESUMO

O presente trabalho aborda o desenvolvimento de uma plataforma web gamificada e acessível destinada ao ensino de informática, com foco em estudantes iniciantes que apresentam dificuldades na compreensão de conceitos técnicos, resolução de atividades e identificação de erros. A proposta utiliza Tecnologias Digitais de Informação e Comunicação (TDICs), metodologias ativas, elementos de gamificação e recursos de acessibilidade para favorecer a autonomia, o engajamento e a continuidade dos estudos. O projeto foi aplicado na Alfabits, localizada em Pirapozinho — SP, permitindo alinhar o desenvolvimento técnico às necessidades reais do público-alvo. A metodologia seguiu as etapas propostas pela UNIVESP (Ouvir, Criar e Implementar), contemplando análise do contexto, criação, prototipação, implementação e testes. A solução utiliza React e JavaScript no frontend, Python puro no backend, com API REST, e Firebase Authentication e Firestore para autenticação e persistência. O backend foi implantado no Render, com deploy automático e integração contínua. Como resultado, foi obtida uma plataforma funcional com autenticação por perfil, CRUD de lições e atividades, feedback automático, cálculo de progresso, sistema de XP, níveis e ranking, além de 15 testes automatizados e 19 evidências documentadas. Os próximos passos incluem validação com usuários reais e preparação para produção.

**PALAVRAS-CHAVE:** tecnologias educacionais; gamificação; acessibilidade; feedback automático; ensino de informática.

# 1 INTRODUÇÃO

As Tecnologias Digitais de Informação e Comunicação (TDICs) têm promovido transformações significativas nos processos educacionais contemporâneos, especialmente quando integradas a metodologias ativas de aprendizagem. Essas abordagens colocam o estudante como protagonista do próprio aprendizado, favorecendo a autonomia, a interação e a construção significativa do conhecimento (BACICH; MORAN, 2018).

Além disso, segundo Moran (2018), a educação contemporânea exige práticas pedagógicas que conectem o estudante com situações reais de aprendizagem, superando o modelo tradicional de transmissão de conteúdo. Para o autor, o uso intencional das tecnologias digitais potencializa a personalização do ensino e favorece a construção de trilhas individuais de aprendizagem.

Segundo Oliveira e Barros (2025), métodos que utilizam elementos de ludicidade podem contribuir para despertar a curiosidade e aumentar o interesse dos participantes, favorecendo a retenção dos conteúdos e tornando o processo de aprendizagem mais leve.

Apesar dos benefícios proporcionados por essas abordagens, o ensino de informática para iniciantes ainda apresenta desafios práticos. É comum que estudantes encontrem dificuldades na assimilação de conceitos técnicos, na resolução de problemas lógicos e na compreensão dos erros cometidos durante a execução de atividades. A ausência de um retorno imediato durante a realização de tarefas práticas pode gerar frustração e desmotivação, comprometendo a continuidade dos estudos.

Além disso, a acessibilidade digital constitui um aspecto relevante no contexto educacional, pois garante que estudantes com diferentes necessidades possam utilizar a plataforma em condições adequadas. Recursos como contraste adequado, navegação por teclado, uso de HTML semântico, textos alternativos em imagens e mensagens de erro claras contribuem para tornar a experiência de aprendizagem mais inclusiva (W3C, 2018).

Diante desse cenário, o projeto propõe a utilização da gamificação como recurso para aproximar teoria e prática em um ambiente educacional estruturado e acessível. A utilização de elementos como pontuação, atividades progressivas e acompanhamento de desempenho busca tornar a experiência mais interativa e estimular a participação contínua dos estudantes.

O projeto tem como objeto central o desenvolvimento de uma plataforma web gamificada e acessível voltada ao ensino de informática. A solução busca oferecer atividades, acompanhamento do desempenho, mecanismos de feedback automático e recursos de acessibilidade, auxiliando estudantes iniciantes na identificação de dificuldades e na construção gradual de seus conhecimentos.

# 2 DESENVOLVIMENTO

## 2.1 OBJETIVOS

**2.1.1 Objetivo geral**

Desenvolver uma plataforma web gamificada e acessível para o ensino de informática, aprimorando sua estrutura técnica e funcional, com foco na organização da arquitetura, banco de dados, funcionalidades do sistema, segurança, acessibilidade e preparação para testes e validação.

**2.1.2 Objetivos específicos**

Para alcançar o objetivo geral, foram estabelecidos os seguintes objetivos específicos:

a) identificar as principais dificuldades enfrentadas por estudantes iniciantes no aprendizado de informática;
b) estruturar a arquitetura da plataforma;
c) consolidar a modelagem do banco de dados;
d) definir as principais entidades e seus relacionamentos;
e) estruturar os endpoints necessários para comunicação com o sistema;
f) implementar mecanismos de autenticação e controle de acesso;
g) desenvolver funcionalidades destinadas aos alunos, professores e administradores;
h) aprimorar os mecanismos relacionados à pontuação, XP, níveis e ranking;
i) estruturar mecanismos de feedback automático;
j) aplicar requisitos mínimos de acessibilidade à interface;
k) realizar testes iniciais de integração, unidade e usabilidade;
l) preparar a plataforma para futuras validações com usuários reais.

## 2.2 JUSTIFICATIVA E DELIMITAÇÃO DO PROBLEMA

**2.2.1 Problema de pesquisa**

Como um sistema computacional com feedback automático em tempo real e recursos de acessibilidade pode auxiliar estudantes iniciantes a superar dificuldades no aprendizado de informática?

**2.2.2 Justificativa**

O ensino de informática apresenta desafios significativos, especialmente para estudantes iniciantes, que frequentemente enfrentam dificuldades na compreensão de conceitos técnicos e na resolução de problemas práticos.

A ausência de feedback imediato durante a execução de atividades pode comprometer o aprendizado, reduzir o engajamento e dificultar o desenvolvimento da autonomia. Nesse contexto, uma plataforma que combine atividades práticas, mecanismos de acompanhamento, elementos de gamificação e recursos de acessibilidade pode contribuir para tornar o processo de aprendizagem mais interativo e inclusivo.

O projeto justifica-se pela necessidade de transformar o protótipo inicialmente desenvolvido em uma solução mais estruturada, organizada e preparada para evolução. Na etapa atual, buscou-se aprofundar a estrutura técnica da aplicação, especialmente em relação à modelagem do banco de dados, arquitetura do sistema, definição dos endpoints, segurança, acessibilidade e organização dos componentes.

**2.2.3 Regras de negócio**

As principais regras de negócio definidas para a plataforma são:

- o Aluno realiza atividades e consulta seus próprios resultados;
- o Professor gerencia lições, alunos e atividades, além de acompanhar resultados;
- o Administrador gerencia usuários e consulta informações gerais do sistema;
- existem três níveis de acesso: Aluno, Professor e Administrador.

**2.2.4 Escopo do MVP**

Dentro do escopo do MVP, estão:

- Cadastro e login (Firebase Authentication);
- Controle de acesso por perfil;
- Cadastro e gerenciamento de lições;
- Realização de atividades;
- Sistema de pontuação, XP, níveis e ranking;
- Registro e consulta de resultados;
- Recursos de acessibilidade;
- Integração via API REST;
- Banco de dados na nuvem (Firestore);
- Testes automatizados;
- Documentação contínua.

Ficam fora do escopo, sendo previstos para etapas posteriores:

- Aplicativo mobile;
- Pagamentos;
- Chat em tempo real;
- IA avançada;
- Gamificação complexa (conquistas, badges);
- Análise de dados avançada.

## 2.3 PÚBLICO-ALVO

O público-alvo principal da plataforma é composto por estudantes iniciantes em informática, que representam os usuários diretamente beneficiados pela solução. Também fazem parte do público de interesse:

- professores, responsáveis pelo acompanhamento dos estudantes e gerenciamento dos conteúdos;
- administradores, responsáveis pelo gerenciamento de usuários e consulta de informações gerais;
- instituições de ensino interessadas na utilização de recursos digitais como apoio ao ensino de informática.

## 2.4 FUNDAMENTAÇÃO TEÓRICA

**2.4.1 Metodologias ativas e tecnologias digitais**

As Tecnologias Digitais de Informação e Comunicação (TDICs) têm promovido transformações significativas no contexto educacional, especialmente quando associadas a metodologias ativas de aprendizagem. De acordo com Bacich e Moran (2018), metodologias ativas favorecem a participação do estudante no processo educacional, contribuindo para maior autonomia e protagonismo. Valente (2014) complementa que a utilização pedagógica das tecnologias digitais permite a criação de ambientes de aprendizagem mais dinâmicos e centrados no estudante.

**2.4.2 Letramento digital e dificuldades de aprendizagem**

O ensino de informática para iniciantes está inserido no campo mais amplo do letramento digital, que compreende não apenas a capacidade de operar dispositivos e softwares, mas também a competência para utilizar criticamente as tecnologias digitais (HAMMODA; FOLI, 2024). Pesquisas recentes indicam que mesmo pessoas com bom nível de alfabetização tradicional podem apresentar dificuldades em tarefas digitais (NIC.BR, 2025).

**2.4.3 Gamificação e motivação**

A gamificação tem se consolidado como estratégia para aumentar motivação e engajamento em ambientes de aprendizagem. Uma revisão sistemática sobre gamificação no ensino de programação revelou que estratégias personalizadas são essenciais para melhorar o engajamento e os resultados (DINIZ; MERLIN; PORTELA, 2024). Pesquisas empíricas indicam que a gamificação aumenta o engajamento em até 60% quando aplicada com objetivos pedagógicos claros (DICHEV; DICHEVA, 2017). Além disso, Alves (2015) destaca que a gamificação não se limita a recompensas extrínsecas, mas envolve a criação de experiências significativas que conectam o estudante com o conteúdo de forma emocional e cognitiva.

**2.4.4 Feedback automático e aprendizagem**

O feedback constitui um dos elementos centrais da proposta. A Feedback Intervention Theory (FIT) oferece base teórica robusta para compreender como o timing do feedback afeta a motivação e os resultados. Estudos recentes demonstram que o feedback imediato fornece orientação corretiva em tempo real, fortalece a confiança e previne a internalização de erros (SCIENCEDIRECT, 2025). Sommerville (2018) reforça que sistemas capazes de fornecer feedback automático podem auxiliar o usuário na identificação de erros e na compreensão de seu desempenho.

**2.4.5 Acessibilidade e tecnologias assistivas**

A acessibilidade digital constitui um aspecto essencial em ambientes educacionais inclusivos. O Universal Design for Learning (UDL) propõe que ambientes de aprendizagem sejam projetados de forma flexível, contemplando múltiplos meios de engajamento, representação e expressão (REVATHI; DUDEKULA, 2026). Segundo o IBGE (2023), cerca de 18,6 milhões de brasileiros possuem algum tipo de deficiência, o que reforça a necessidade de plataformas educacionais acessíveis. A adoção de práticas de Design Universal para Aprendizagem (CAST, 2018) possibilita que esses estudantes tenham acesso equitativo aos recursos educacionais digitais.

## 2.5 METODOLOGIA

A metodologia adotada segue a abordagem proposta pela UNIVESP, estruturada nas etapas de Ouvir, Criar e Implementar.

**2.5.1 Ouvir e interpretar o contexto**

Na etapa inicial, foi realizada a análise do cenário do ensino de informática, com foco em estudantes iniciantes. A partir da revisão bibliográfica e da observação do contexto educacional, identificou-se que a ausência de feedback imediato durante a resolução de exercícios constitui uma dificuldade relevante. A aplicação da solução está sendo conduzida no ambiente da Alfabits, localizada na cidade de Pirapozinho — SP. Esse contexto institucional possibilita a validação da plataforma com estudantes iniciantes em informática, alinhando o desenvolvimento técnico às necessidades reais do público-alvo (GIL, 2017).

**2.5.2 Criar e prototipar**

Com base no problema identificado, foi proposta a criação de um sistema educacional. Inicialmente foram elaborados wireframes para representar a jornada do usuário e a organização das principais telas da plataforma, incluindo cadastro, login, menu, lições, atividades e progresso (ver Figuras 1 a 5 no Apêndice A).

A arquitetura tecnológica foi definida utilizando Python puro no backend, exposto por meio de uma API REST. A camada de apresentação foi estruturada com React e JavaScript, com Vite como ferramenta de build. Para autenticação, foi adotado o Firebase Authentication. Para persistência, o Firebase Firestore. Para acessibilidade, a Web Speech API. O versionamento é feito com Git e GitHub, e os testes são realizados com Pytest no backend e React Testing Library no frontend.

**2.5.3 Implementar e testar**

A etapa de implementação consistiu na evolução do protótipo para uma aplicação estruturada. A arquitetura foi organizada seguindo o fluxo:

Cliente (React) → API REST → Backend (Python) → Firebase (Auth + Firestore)

Foram considerados mecanismos de segurança, controle de acesso, validação de dados, autenticação por token e uso das regras de segurança do Firestore. O backend em Python concentra a lógica de negócio, autenticação, gerenciamento dos usuários e comunicação com o Firestore.

Também foram definidos procedimentos de testes de unidade, integração e usabilidade, utilizando Pytest no backend e React Testing Library no frontend, permitindo identificar pontos que necessitam de aperfeiçoamento antes da validação com usuários reais.

**2.5.4 Fluxo principal**

- **Aluno:** Login → Acessa lição → Realiza atividade → Recebe pontuação → Resultado é salvo → Consulta desempenho.
- **Professor:** Login → Gerencia lições → Consulta alunos → Corrige/acompanha atividades → Consulta resultados.
- **Administrador:** Login → Gerencia usuários → Consulta informações gerais.

## 2.6 REQUISITOS DO SISTEMA

**2.6.1 Histórias de usuário (resumo)**

As histórias foram organizadas por perfil (Aluno, Professor, Administrador) e por requisitos transversais de acessibilidade. As principais são:

- **Aluno:** acessar perfil, visualizar atividades, realizar atividade, consultar resultado, consultar pontuação, utilizar a plataforma de forma acessível;
- **Professor:** acessar área do professor, criar/editar lição, gerenciar alunos, corrigir atividades, acompanhar resultados, criar conteúdo acessível;
- **Administrador:** acessar área administrativa, gerenciar usuários, controlar acesso, utilizar o painel de forma acessível;
- **Acessibilidade (transversal):** navegação por teclado, compatibilidade com tecnologias assistivas, imagens acessíveis, controles identificados, contraste e legibilidade, feedback acessível.

**2.6.2 Requisitos funcionais**

As funcionalidades essenciais do MVP são:

- **RF01 — Cadastro de usuários:** permitir o cadastro de usuários.
- **RF02 — Autenticação:** permitir que os usuários realizem autenticação.
- **RF03 — Perfis de usuário:** diferenciar Aluno, Professor e Administrador.
- **RF04 — Gerenciamento de lições:** cadastro, edição e disponibilização.
- **RF05 — Atividades:** criação e realização de atividades.
- **RF06 — Envio de respostas:** registrar respostas dos alunos.
- **RF07 — Correção e notas:** registrar notas das atividades.
- **RF08 — Feedback:** fornecer feedback após as atividades.
- **RF09 — Pontuação:** controlar a pontuação obtida.
- **RF10 — XP, níveis e ranking:** gamificação completa.
- **RF11 — Registro e consulta de resultados:** pelos alunos e professores.
- **RF12 — Gerenciamento de conteúdo:** professor gerencia lições e atividades.
- **RF13 — Gerenciamento de usuários (Administrador):** gerenciar usuários e consultar informações.

**2.6.3 Requisitos não funcionais**

- **RNF01 — Segurança:** mecanismos seguros de autenticação.
- **RNF02 — Senhas:** gerenciadas pelo Firebase Authentication.
- **RNF03 — Controle de acesso:** baseado no perfil do usuário.
- **RNF04 — Segurança na comunicação:** autenticação por token + regras do Firestore.
- **RNF05 — Validação:** dados validados no backend.
- **RNF06 — Manutenibilidade:** código organizado em camadas.
- **RNF07 — Escalabilidade:** arquitetura permite ampliações.
- **RNF08 — Acessibilidade:** contraste, navegação por teclado, HTML semântico, alt em imagens, aria-label em ícones, leitura em voz alta (Web Speech API).
- **RNF09 — Usabilidade:** interface intuitiva para iniciantes.
- **RNF10 — Integridade da API:** requisições validadas no backend.

## 2.7 TECNOLOGIAS UTILIZADAS

| Camada             | Tecnologia                     | Função                                  |
| :----------------- | :----------------------------- | :-------------------------------------- |
| Frontend           | React + Vite                   | Construção das interfaces e componentes |
| Linguagem Frontend | JavaScript                     | Lógica e interatividade                 |
| Backend            | Python 3.12 (puro)             | Regras de negócio e API REST            |
| Autenticação       | Firebase Authentication        | Login, cadastro e tokens JWT            |
| Banco de dados     | Firebase Firestore             | Persistência NoSQL                      |
| Acessibilidade     | Web Speech API                 | Leitura em voz alta                     |
| Comunicação        | API REST                       | Integração frontend e backend           |
| Versionamento      | Git + GitHub                   | Controle de versão                      |
| Testes             | Pytest + React Testing Library | Testes de backend e frontend            |
| Deploy Backend     | Render                         | Hospedagem em produção                  |
| Deploy Frontend    | Vercel                         | Hospedagem do frontend                  |

## 2.8 ARQUITETURA DO SISTEMA

A arquitetura segue o modelo cliente-servidor, com separação entre três camadas: Frontend, Backend e Banco de Dados.

**Cliente (React) → API REST → Backend (Python) → Firebase (Auth + Firestore)**

O Frontend consome os recursos do backend via HTTP. O Backend processa as regras de negócio e se comunica com o Firebase. O Firebase concentra autenticação (Authentication) e persistência de dados (Firestore). A separação em camadas traz vantagens como manutenibilidade, testabilidade, reutilização e escalabilidade.

## 2.9 BANCO DE DADOS

Foi adotado o Firebase Firestore, banco NoSQL orientado a documentos. As coleções foram definidas com base nos requisitos do MVP.

As coleções prioritárias são: usuarios, perfis, alunos, professores, cursos, licoes, atividades, entregas e notas.

Os principais relacionamentos são: usuarios → perfis (1:1); usuarios → alunos e professores (1:1); professores → licoes (1:N); licoes → atividades (1:N); atividades → entregas (1:N); entregas → notas (1:1).

O dicionário completo está no Apêndice C. O schema e as "migrations" foram documentados em schema.py, seed.py e firestore.rules.

[INSERIR IMAGEM — DER (Diagrama Entidade-Relacionamento) — conforme docs/arquitetura/der.png]
Figura 6 — Diagrama Entidade-Relacionamento (DER) da plataforma
Fonte: Elaborado pelos autores (2026).

## 2.10 UX/UI, GAMIFICAÇÃO E ACESSIBILIDADE

A interface foi planejada para ser intuitiva, com elementos de gamificação e requisitos mínimos de acessibilidade.

Foram implementados: pontuação, XP (10 XP por ponto), níveis (Iniciante, Aprendiz, Praticante, Avançado, Mestre) e ranking de alunos.

Os requisitos de acessibilidade aplicados incluem: contraste adequado, navegação por teclado, HTML semântico, textos alternativos em imagens, aria-label em botões com ícones e leitura em voz alta (Web Speech API).

[INSERIR IMAGEM — Tela de Login do frontend]
Figura 7 — Tela de Login da plataforma
Fonte: Elaborado pelos autores (2026).

[INSERIR IMAGEM — Tela de Lições do frontend]
Figura 8 — Tela de Lições da plataforma
Fonte: Elaborado pelos autores (2026).

## 2.11 API REST E COMUNICAÇÃO

Foi definida uma API REST com rotas organizadas por domínio funcional, incluindo autenticação, alunos, cursos, lições, atividades, entregas, notas, progresso, XP e ranking. O formato das respostas é JSON, e a autenticação é feita via Bearer Token (JWT).

**Estrutura de recursos:** `/api/auth` (autenticação), `/api/users` (usuários), `/api/courses` (cursos), `/api/lessons` (lições), `/api/activities` (atividades), `/api/submissions` (entregas), `/api/progress` (progresso), `/api/xp` (experiência), `/api/ranking` (ranking).

**Métodos HTTP:** GET (consultar), POST (criar), PUT/PATCH (atualizar) e DELETE (excluir).

**Formato das respostas:** As respostas são padronizadas em JSON. Em caso de erro, são retornados códigos HTTP apropriados: 200 OK (sucesso), 201 Created (criado), 400 Bad Request (dados inválidos), 401 Unauthorized (falta de token), 403 Forbidden (acesso negado), 404 Not Found (não encontrado) e 500 Internal Server Error (erro no servidor).

A adoção de uma API REST permite a padronização da comunicação, a separação de responsabilidades, a facilidade de testes e a escalabilidade da aplicação.

## 2.12 SEGURANÇA

A segurança foi considerada em todas as camadas da aplicação:

- **Autenticação:** via Firebase Authentication, com geração de tokens JWT.
- **Senhas:** gerenciadas de forma segura pelo Firebase Authentication (hash).
- **Controle de acesso:** baseado no perfil do usuário (aluno, professor ou administrador). As rotas da API validam o token e o perfil antes de permitir qualquer operação.
- **Regras de segurança do Firestore:** restringem operações de leitura e escrita com base no usuário autenticado e no perfil associado.
- **Variáveis de ambiente:** utilizadas para armazenar credenciais sensíveis (como as chaves do Firebase).
- **Validação de dados:** todas as requisições são validadas no backend antes de qualquer operação de leitura ou escrita no banco.
- **Identificador do professor:** obtido exclusivamente do usuário autenticado no backend, ignorando qualquer valor enviado pelo cliente.

## 2.13 DESENVOLVIMENTO REALIZADO

Foram realizadas as seguintes atividades: definição da arquitetura, modelagem do banco (9 coleções), elaboração do DER e do schema, implementação das 10 rotas da API, implementação dos 10 serviços de negócio, criação dos 7 modelos com validação, implementação dos middlewares, configuração do Firebase, publicação das regras de segurança, implementação do sistema de XP/níveis/ranking, criação de 15 testes automatizados, execução de 19 testes manuais, deploy no Render e documentação completa.

## 2.14 TESTES

A estratégia de testes adotada buscou garantir a qualidade da aplicação em diferentes níveis, dividindo-se entre testes automatizados (no código) e testes manuais (na API).

**Testes Automatizados:**
Foram implementados 15 testes automatizados com Pytest no backend, cobrindo validação de modelos, regras de negócio e tratamento de dados inválidos. Para o frontend, foi adotado o React Testing Library para validar a renderização e o comportamento dos componentes, com execução via Vitest. Além disso, utilizou-se o Firestore Emulator para simular o banco de dados de forma segura durante os testes.

**Testes Manuais:**
Foram executados 19 testes manuais utilizando a ferramenta Insomnia, com o objetivo de validar a comunicação real entre a API e o banco de dados. Esses testes cobriram:

- O fluxo de autenticação (login, geração de token e controle de acesso);
- A listagem e criação de cursos e lições;
- O envio de respostas pelos alunos e a correção de notas pelos professores;
- A validação de dados obrigatórios e erros (ex: requisições sem token ou sem body);
- O funcionamento do fluxo de gamificação (XP, níveis e ranking).

Durante a execução dos testes de integração, foram identificadas divergências nos contratos de dados entre frontend e backend — especialmente no formato das alternativas de atividades de múltipla escolha e no tipo dos identificadores (str versus DocumentReference). Esses achados motivaram a padronização descrita na seção 2.17 e reforçam o papel dos testes de integração na detecção precoce de inconsistências.

As 19 evidências (prints) dos testes manuais no Insomnia estão documentadas em docs/evidencias/ e incluídas no Apêndice D.

## 2.15 RESULTADOS

Os objetivos foram alcançados: arquitetura estruturada, banco modelado, 10 rotas implementadas, autenticação e controle de acesso funcionando, gamificação completa, acessibilidade aplicada, 15 testes automatizados, deploy em produção e documentação completa. A validação com usuários reais fica para a próxima etapa.

## 2.16 EVIDÊNCIAS DO DESENVOLVIMENTO

As evidências incluem wireframes, DER, dicionário de dados, schema, 19 prints de teste, URL pública da API e repositório no GitHub.

Os testes manuais foram realizados com o auxílio da ferramenta Insomnia, permitindo validar a comunicação entre a API REST e o banco de dados Firestore, além das regras de negócio e permissões de acesso.

[INSERIR IMAGEM — Painel do Render com deploy "Live"]
Figura 9 — Deploy do backend no Render
Fonte: Elaborado pelos autores (2026).

[INSERIR IMAGEM — Print do Insomnia com teste de XP = 100]
Figura 10 — Teste do sistema de XP após correção de atividade no Insomnia
Fonte: Elaborado pelos autores (2026).

As capturas de tela detalhadas dos testes manuais podem ser consultadas no Apêndice D.

## 2.17 DIFICULDADES ENCONTRADAS

Durante a continuidade do desenvolvimento e, especialmente, na fase de integração entre frontend e backend, foram identificadas inconsistências nos contratos de dados que demandaram correções antes da realização dos testes completos. Entre as principais dificuldades encontradas, destacam-se:

a) **Campos da interface sem integração com o backend:** os campos videoUrl, duracao, gabarito e arquivo, presentes no formulário de lições, não estavam sendo persistidos no Firestore. Após análise, optou-se por remover videoUrl e duracao do escopo da entrega atual, enquanto gabarito e arquivo foram implementados no backend para garantir a persistência.

b) **Divergência no tipo de identificadores:** os modelos Atividade, Entrega e Nota declaravam identificadores como strings simples, enquanto o serviço e o schema trabalhavam com referências do Firestore (DocumentReference). Foi necessário padronizar os tipos de licaoId, atividadeId, alunoId e entregaId em todas as camadas.

c) **Inconsistência no formato das alternativas:** o backend esperava alternativas como lista de strings (["a", "b"]), enquanto o frontend enviava objetos ([{id, texto, correta}]). A solução adotada foi ajustar o backend para aceitar e normalizar os dois formatos, preservando o id e o campo correta para a correção automática.

d) **Definição do professorId e permissões:** o identificador do professor passou a ser obtido exclusivamente do usuário autenticado no backend, ignorando qualquer valor enviado pelo cliente. As rotas foram revisadas para garantir que alunos só acessem seus próprios dados e que apenas professores possam criar atividades e corrigir notas.

Essas correções foram organizadas por prioridade (P0 e P1) e concluídas antes da realização dos testes de integração no Insomnia. A identificação dessas inconsistências faz parte do processo de amadurecimento da arquitetura e reforça a importância da padronização dos contratos de dados entre as camadas.

## 2.18 PRÓXIMOS PASSOS

Os próximos passos incluem: validar a plataforma com usuários reais, aplicar o questionário de avaliação, publicar o frontend na Vercel, ampliar testes de usabilidade, adicionar recursos de acessibilidade avançados e preparar a aplicação para produção.

## 2.19 CONSIDERAÇÕES FINAIS

O desenvolvimento da plataforma web gamificada e acessível representa uma proposta de aplicação das tecnologias digitais ao processo de ensino de informática. O projeto foi aplicado na Alfabits, em Pirapozinho — SP, permitindo alinhar o desenvolvimento técnico às necessidades reais do público-alvo.

A arquitetura definida utilizando React, JavaScript, Python puro, API REST, Firebase Authentication e Firestore proporciona uma base tecnológica sólida para a evolução da aplicação. A padronização dos contratos de dados entre as camadas, realizada durante a fase de integração, contribuiu para a robustez do backend e para a clareza do código.

Os resultados obtidos ainda possuem caráter inicial, e a validação com usuários reais permitirá verificar a efetividade da solução no contexto educacional. Como contribuições, destacam-se a organização da arquitetura, a implementação dos mecanismos de segurança e a documentação detalhada do processo de desenvolvimento. Como limitação, aponta-se a necessidade de ampliar os testes de usabilidade e acessibilidade com o público-alvo.

# REFERÊNCIAS

(Manter as referências que já estão no seu documento original)

# APÊNDICE A — WIREFRAMES DO PROTÓTIPO

(Manter como está no seu documento)

# APÊNDICE B — QUESTIONÁRIO DE VALIDAÇÃO DA PLATAFORMA

(Manter como está no seu documento)