import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Login/Login.css"
import Input from "../../components/Input/Input";
import Label from "../../components/Label/Label";
import Radio from "../../components/Radio/Radio";
import Button from "../../components/Button/Button";
import Formgroup from "../../components/Formgroup/Formgroup";
import { useAuth } from "../../contexts/AuthContext";

function Login() {
  const { login, recuperarSenha } = useAuth();
  const navigate = useNavigate();

  const [perfil, setPerfil] = useState("aluno");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setErro("");
    setMensagem("");
    setCarregando(true);

    try {
      const usuario = await login(email.trim(), senha);

      // Confere o perfil cadastrado no documento do usuário.
      // O login do Firebase, sozinho, não valida o perfil selecionado.
      const token = await usuario.getIdToken();

      const resposta = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          dados.erro || "Não foi possível validar o usuário no servidor."
        );
      }

      const perfilUsuario =
        typeof dados.perfil === "string"
          ? dados.perfil
          : dados.perfil?.id || dados.perfil?.nome;

      if (
        perfilUsuario &&
        perfilUsuario.toLowerCase() !== perfil
      ) {
        throw new Error(
          `Esta conta não possui o perfil selecionado (${perfil}).`
        );
      }

     setMensagem("Login realizado com sucesso!");

      const perfilNormalizado = String(perfilUsuario || perfil).toLowerCase();

      if (perfilNormalizado === "aluno") {
        navigate("/homeAluno", { replace: true });
      } else if (perfilNormalizado === "professor") {
        navigate("/homeProfessor", { replace: true });
      } else if (
        perfilNormalizado === "administrador" ||
        perfilNormalizado === "admin"
      ) {
        navigate("/admin", { replace: true });
      } else {
        setErro("Perfil de usuário não reconhecido.");
      }
    } catch (erroLogin) {
      console.error("Erro no login:", erroLogin);

      setErro(
        erroLogin.code === "auth/invalid-credential"
          ? "E-mail ou senha incorretos."
          : erroLogin.code === "auth/too-many-requests"
            ? "Muitas tentativas. Aguarde e tente novamente."
            : erroLogin.message || "Não foi possível realizar o login."
      );
    } finally {
      setCarregando(false);
    }
  }

  async function handleRecuperarAcesso() {
    setErro("");
    setMensagem("");

    if (!email.trim()) {
      setErro("Informe seu e-mail para recuperar o acesso.");
      return;
    }

    try {
      await recuperarSenha(email.trim());
      setMensagem("Se o e-mail estiver cadastrado, você receberá as instruções de recuperação.");
    } catch (erroRecuperacao) {
      console.error("Erro ao recuperar acesso:", erroRecuperacao);
      setErro(
        erroRecuperacao.message ||
          "Não foi possível solicitar a recuperação de acesso."
      );
    }
  }

  return (
    <main className="login">
      <section className="login-card">
        <div className="header-login">
          <h1 className="login-title">Bem vindo(a) de volta</h1>
          <h2 className="login-subtitle">Faça login para continuar</h2>
        </div>

        <div className="login-perfis">
          <Radio
            id="aluno"
            name="perfil"
            value="aluno"
            checked={perfil === "aluno"}
            onChange={(event) => setPerfil(event.target.value)}
          >
            Aluno
          </Radio>

          <Radio
            id="professor"
            name="perfil"
            value="professor"
            checked={perfil === "professor"}
            onChange={(event) => setPerfil(event.target.value)}
          >
            Professor
          </Radio>

          <Radio
            id="administrador"
            name="perfil"
            value="administrador"
            checked={perfil === "administrador"}
            onChange={(event) => setPerfil(event.target.value)}
          >
            Administrador
          </Radio>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <Formgroup>
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />
          </Formgroup>

          <Formgroup>
            <Label htmlFor="senha">Senha</Label>
            <Input
              id="senha"
              name="senha"
              type="password"
              value={senha}
              onChange={(event) => setSenha(event.target.value)}
              autoComplete="current-password"
              required
            />
          </Formgroup>

          {erro && (
            <p className="login-mensagem erro" role="alert">
              {erro}
            </p>
          )}

          {mensagem && (
            <p className="login-mensagem sucesso" role="status">
              {mensagem}
            </p>
          )}

          <Button
            type="submit"
            variant="success"
            disabled={carregando}
          >
            {carregando ? "Entrando..." : "Entrar"}
          </Button>

          <button
            type="button"
            className="login-recover"
            onClick={handleRecuperarAcesso}
          >
            Recuperar acesso
          </button>
        </form>
      </section>
    </main>
  );
}

export default Login;
