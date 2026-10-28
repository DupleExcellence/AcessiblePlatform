
import React, { useState } from "react";

import Form from "../../components/Form/Form";
import Label from "../../components/Label/Label";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import Radio from "../../components/Radio/Radio";
import Formgroup from "../../components/Formgroup/Formgroup";

import "../Cadastro/Cadastro.css";

import { apiPost } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";

// ===============================
// FUNÇÕES DE VALIDAÇÃO
// ===============================

function validarNome(nome) {
  const nomeLimpo = nome.trim();

  return (
    nomeLimpo.length >= 3 &&
    /^[\p{L}\s'-]+$/u.test(nomeLimpo)
  );
}

function validarEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validarSenha(senha) {
  return (
    senha.length >= 8 &&
    /[A-Z]/.test(senha) &&
    /[a-z]/.test(senha) &&
    /\d/.test(senha)
  );
}

function validarDataNascimento(data) {
  if (!data) return false;

  const nascimento = new Date(`${data}T00:00:00`);
  const hoje = new Date();

  hoje.setHours(0, 0, 0, 0);

  return (
    !Number.isNaN(nascimento.getTime()) &&
    nascimento <= hoje
  );
}

function calcularIdade(data) {
  const nascimento = new Date(`${data}T00:00:00`);
  const hoje = new Date();

  let idade = hoje.getFullYear() - nascimento.getFullYear();

  const aindaNaoFezAniversario =
    hoje.getMonth() < nascimento.getMonth() ||
    (hoje.getMonth() === nascimento.getMonth() &&
      hoje.getDate() < nascimento.getDate());

  if (aindaNaoFezAniversario) {
    idade--;
  }

  return idade;
}

function validarTelefone(telefone) {
  if (!telefone.trim()) return true;

  const digitos = telefone.replace(/\D/g, "");

  return digitos.length === 10 || digitos.length === 11;
}

// ===============================
// COMPONENTE CADASTRO
// ===============================

function Cadastro() {
  const { user, autenticado, tipoPerfil, loading } = useAuth();

  const [perfil, setPerfil] = useState("aluno");
  const [carregando, setCarregando] = useState(false);

  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [errosCampos, setErrosCampos] = useState({});

  // ===============================
  // ENVIO DO FORMULÁRIO
  // ===============================

  async function handleSubmit(event) {
    event.preventDefault();

    setErro("");
    setSucesso("");
    setErrosCampos({});

    // Verificação de acesso no frontend
    if (
      !user ||
      !autenticado ||
      tipoPerfil !== "administrador"
    ) {
      setErro(
        "Apenas administradores autenticados podem cadastrar usuários."
      );
      return;
    }

    const formularioElement = event.currentTarget;
    const formulario = new FormData(formularioElement);

    const nome = String(
      formulario.get("nome") || ""
    ).trim();

    const email = String(
      formulario.get("email") || ""
    ).trim().toLowerCase();

    const senha = String(
      formulario.get("senha") || ""
    );

    const dataNascimento = String(
      formulario.get("dataNascimento") || ""
    );

    const telefone = String(
      formulario.get("telefone") || ""
    ).trim();

    // ===============================
    // VALIDAÇÃO DOS CAMPOS
    // ===============================

    const novosErros = {};

    if (!nome) {
      novosErros.nome = "O nome completo é obrigatório.";
    } else if (!validarNome(nome)) {
      novosErros.nome =
        "Informe um nome com pelo menos 3 caracteres, usando apenas letras, espaços, apóstrofos ou hífens.";
    }

    if (!email) {
      novosErros.email = "O e-mail é obrigatório.";
    } else if (!validarEmail(email)) {
      novosErros.email =
        "Informe um endereço de e-mail válido.";
    }

    if (!senha) {
      novosErros.senha = "A senha é obrigatória.";
    } else if (!validarSenha(senha)) {
      novosErros.senha =
        "A senha deve ter pelo menos 8 caracteres, uma letra maiúscula, uma minúscula e um número.";
    }

    if (!dataNascimento) {
      novosErros.dataNascimento =
        "A data de nascimento é obrigatória.";
    } else if (!validarDataNascimento(dataNascimento)) {
      novosErros.dataNascimento =
        "Informe uma data válida que não seja futura.";
    }

    if (!validarTelefone(telefone)) {
      novosErros.telefone =
        "Informe um telefone com DDD, contendo 10 ou 11 dígitos.";
    }

    const perfisValidos = [
      "aluno",
      "professor",
      "administrador",
    ];

    if (!perfisValidos.includes(perfil)) {
      novosErros.perfil = "Selecione um perfil válido.";
    }

    if (Object.keys(novosErros).length > 0) {
      setErrosCampos(novosErros);
      setErro("Corrija os campos destacados antes de continuar.");
      return;
    }

    const idade = calcularIdade(dataNascimento);

    // ===============================
    // ENVIO PARA A API
    // ===============================

    setCarregando(true);

    try {
      await apiPost("/api/auth/cadastro", {
        nome,
        email,
        senha,
        perfil,
        idade,
        dataNascimento,
        telefone,
      });

      setSucesso(
        `Usuário ${nome} cadastrado com sucesso! Sua sessão administrativa foi mantida.`
      );

      formularioElement.reset();
      setPerfil("aluno");
      setErrosCampos({});
    } catch (erroCadastro) {
      console.error("Erro no cadastro:", erroCadastro);

      setErro(
        erroCadastro.message ||
          "Não foi possível realizar o cadastro. Tente novamente."
      );
    } finally {
      setCarregando(false);
    }
  }

  // ===============================
  // VALIDAÇÃO DE ACESSO
  // ===============================

  if (loading) {
    return <p>Validando autenticação...</p>;
  }

  if (
    !user ||
    !autenticado ||
    tipoPerfil !== "administrador"
  ) {
    return (
      <main className="cadastro-page">
        <section className="cadastro-container">
          <h1>Acesso restrito</h1>

          <p>
            Somente administradores autenticados podem
            cadastrar usuários.
          </p>
        </section>
      </main>
    );
  }

  // ===============================
  // INTERFACE
  // ===============================

  return (
    <main className="cadastro-page">
      <section className="cadastro-container">
        <header className="header-cadastro">
          <h1 className="cadastro-title">
            Cadastro
          </h1>

          <p className="cadastro-subtitle">
            Preencha os dados para criar uma conta no Alfabits.
          </p>
        </header>

        <Form
          className="cadastro-form"
          onSubmit={handleSubmit}
        >
          {/* NOME */}
          <Formgroup>
            <Label htmlFor="nome">
              Nome completo
            </Label>

            <Input
              id="nome"
              name="nome"
              type="text"
              required
              minLength={3}
              autoComplete="name"
              placeholder="Digite o nome completo"
              aria-invalid={Boolean(errosCampos.nome)}
            />

            {errosCampos.nome && (
              <p className="mensagem-erro" role="alert">
                {errosCampos.nome}
              </p>
            )}
          </Formgroup>

          {/* E-MAIL */}
          <Formgroup>
            <Label htmlFor="email">
              E-mail
            </Label>

            <Input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="Digite o e-mail"
              aria-invalid={Boolean(errosCampos.email)}
            />

            {errosCampos.email && (
              <p className="mensagem-erro" role="alert">
                {errosCampos.email}
              </p>
            )}
          </Formgroup>

          {/* SENHA */}
          <Formgroup>
            <Label htmlFor="senha">
              Senha
            </Label>

            <Input
              id="senha"
              name="senha"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              placeholder="Crie uma senha"
              aria-invalid={Boolean(errosCampos.senha)}
            />

            <small>
              Mínimo de 8 caracteres, incluindo maiúscula,
              minúscula e número.
            </small>

            {errosCampos.senha && (
              <p className="mensagem-erro" role="alert">
                {errosCampos.senha}
              </p>
            )}
          </Formgroup>

          {/* DATA DE NASCIMENTO */}
          <Formgroup>
            <Label htmlFor="dataNascimento">
              Data de nascimento
            </Label>

            <Input
              id="dataNascimento"
              name="dataNascimento"
              type="date"
              required
              max={new Date().toLocaleDateString("en-CA")}
              aria-invalid={Boolean(
                errosCampos.dataNascimento
              )}
            />

            {errosCampos.dataNascimento && (
              <p className="mensagem-erro" role="alert">
                {errosCampos.dataNascimento}
              </p>
            )}
          </Formgroup>

          {/* TELEFONE */}
          <Formgroup>
            <Label htmlFor="telefone">
              Telefone (opcional)
            </Label>

            <Input
              id="telefone"
              name="telefone"
              type="tel"
              autoComplete="tel"
              placeholder="DDD + número"
              aria-invalid={Boolean(errosCampos.telefone)}
            />

            {errosCampos.telefone && (
              <p className="mensagem-erro" role="alert">
                {errosCampos.telefone}
              </p>
            )}
          </Formgroup>

          {/* PERFIL */}
          <fieldset className="login-perfis">
            <legend>Perfil do usuário</legend>

            <div className="radio-opcao">
              <Radio
                id="perfil-aluno"
                name="perfil"
                value="aluno"
                checked={perfil === "aluno"}
                onChange={() => setPerfil("aluno")}
              />

              <Label htmlFor="perfil-aluno">
                Aluno
              </Label>
            </div>

            <div className="radio-opcao">
              <Radio
                id="perfil-professor"
                name="perfil"
                value="professor"
                checked={perfil === "professor"}
                onChange={() => setPerfil("professor")}
              />

              <Label htmlFor="perfil-professor">
                Professor
              </Label>
            </div>

            <div className="radio-opcao">
              <Radio
                id="perfil-administrador"
                name="perfil"
                value="administrador"
                checked={perfil === "administrador"}
                onChange={() => setPerfil("administrador")}
              />

              <Label htmlFor="perfil-administrador">
                Administrador
              </Label>
            </div>

            {errosCampos.perfil && (
              <p className="mensagem-erro" role="alert">
                {errosCampos.perfil}
              </p>
            )}
          </fieldset>

          {/* MENSAGENS GERAIS */}
          {erro && (
            <p className="mensagem-erro" role="alert">
              {erro}
            </p>
          )}

          {sucesso && (
            <p className="mensagem-sucesso" role="status">
              {sucesso}
            </p>
          )}

          {/* BOTÃO */}
          <Button
            type="submit"
            disabled={carregando}
          >
            {carregando
              ? "Cadastrando..."
              : "Cadastrar usuário"}
          </Button>
        </Form>
      </section>
    </main>
  );
}

export default Cadastro;
