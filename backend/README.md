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
