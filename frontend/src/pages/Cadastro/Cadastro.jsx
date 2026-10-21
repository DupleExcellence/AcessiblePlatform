
import React, { useState } from "react";
import Form from "../../components/Form/Form";
import Label from "../../components/Label/Label";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import Radio from "../../components/Radio/Radio";
import "../Cadastro/Cadastro.css";
import Formgroup from "../../components/Formgroup/Formgroup";

import { apiPost } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";

function Cadastro() {
  const { login } = useAuth();

  const [perfil, setPerfil] = useState("aluno");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    const formularioElement = event.currentTarget;

    setErro("");
    setSucesso("");
    setCarregando(true);

    const formulario = new FormData(event.currentTarget);

    const nome = String(formulario.get("nome") || "").trim();
    const email = String(formulario.get("email") || "")
      .trim()
      .toLowerCase();
    const senha = String(formulario.get("senha") || "");
    const dataNascimento = String(
      formulario.get("dataNascimento") || ""
    );
    const telefone = String(formulario.get("telefone") || "").trim();

    // Calcula a idade a partir da data de nascimento.
    let idade = null;

    if (dataNascimento) {
      const nascimento = new Date(`${dataNascimento}T00:00:00`);
      const hoje = new Date();

      idade = hoje.getFullYear() - nascimento.getFullYear();

      const aindaNaoFezAniversario =
        hoje.getMonth() < nascimento.getMonth() ||
        (hoje.getMonth() === nascimento.getMonth() &&
          hoje.getDate() < nascimento.getDate());

      if (aindaNaoFezAniversario) {
        idade--;
      }

      if (idade < 0 || nascimento > hoje) {
        setErro("Informe uma data de nascimento válida.");
        setCarregando(false);
        return;
      }
    }

    try {
      // 1. Cria a conta e os documentos complementares no backend.
      await apiPost("/api/auth/cadastro", {
        nome,
        email,
        senha,
        perfil,
        idade,
        dataNascimento,
        telefone,
      });

      // 2. Autentica a conta criada usando o Firebase Client SDK.
      try {
        await login(email, senha);
        setSucesso("Cadastro realizado com sucesso!");
      } catch (erroLogin) {
        console.error("Erro ao iniciar sessão:", erroLogin);

        setSucesso(
          "Cadastro realizado! Não foi possível iniciar a sessão automaticamente. Tente entrar pela tela de login."
        );
      }

      formularioElement.reset();
      setPerfil("aluno");
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

  return (
    <main className="cadastro-page">
      <section className="cadastro-container">
        <header className="header-cadastro">
          <h1 className="cadastro-title">Cadastro</h1>
          <p className="cadastro-subtitle">
            Preencha os dados para criar a conta
          </p>
        </header>

        {/* Formulário */}
        <Form
          className="cadastro-form"
          onSubmit={handleSubmit}
        >
          {/* Nome */}
          <Formgroup>
            <Label htmlFor="nome">Nome</Label>
            <Input
              type="text"
              id="nome"
              name="nome"
              placeholder="Insira o nome"
              required
            />
          </Formgroup>

          {/* E-mail */}
          <Formgroup>
            <Label htmlFor="email">E-mail</Label>
            <Input
              type="email"
              id="email"
              name="email"
              placeholder="Insira o e-mail"
              required
            />
          </Formgroup>

          {/* Senha */}
          <Formgroup>
            <Label htmlFor="senha">Senha</Label>

            <div className="input-password">
              <Input
                type="password"
                id="senha"
                name="senha"
                placeholder="Insira a senha"
                required
                minLength={6}
              />

              <Button
                type="button"
                className="toggle-password"
                aria-label="Mostrar senha"
              >
                👁
              </Button>
            </div>
          </Formgroup>

          {/* Data de nascimento */}
          <Formgroup>
            <Label htmlFor="dataNascimento">
              Data de nascimento
            </Label>

            <Input
              type="date"
              id="dataNascimento"
              name="dataNascimento"
              required
            />
          </Formgroup>

          {/* Telefone */}
          <Formgroup>
            <Label htmlFor="telefone">Telefone</Label>

            <Input
              type="tel"
              id="telefone"
              name="telefone"
              placeholder="Insira o telefone"
            />
          </Formgroup>

          {/* Perfil */}
          <div className="login-perfis">
            <Radio
              id="aluno"
              name="perfil"
              value="aluno"
              checked={perfil === "aluno"}
              onChange={(event) => setPerfil(event.target.value)}
              required
            >
              Aluno
            </Radio>

            <Radio
              id="professor"
              name="perfil"
              value="professor"
              checked={perfil === "professor"}
              onChange={(event) => setPerfil(event.target.value)}
              required
            >
              Professor
            </Radio>
            
            <Radio
              id="adm"
              name="perfil"
              value="administrador"
              checked={perfil === "administrador"}
              onChange={(event) => setPerfil(event.target.value)}
              required
            >
              ADM
            </Radio>

          </div>

          {/* Mensagens de resultado */}
          {erro && (
            <p className="cadastro-mensagem erro" role="alert">
              {erro}
            </p>
          )}

          {sucesso && (
            <p className="cadastro-mensagem sucesso" role="status">
              {sucesso}
            </p>
          )}

          {/* Botão */}
          <button
            type="submit"
            className="btn-cadastrar"
            disabled={carregando}
          >
            {carregando ? "Cadastrando..." : "Cadastrar"}
          </button>
        </Form>
      </section>
    </main>
  );
}

export default Cadastro;
