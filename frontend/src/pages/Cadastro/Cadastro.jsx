
import React, { useEffect, useState } from "react";

import Form from "../../components/Form/Form";
import Label from "../../components/Label/Label";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import Radio from "../../components/Radio/Radio";
import Formgroup from "../../components/Formgroup/Formgroup";

import "../Cadastro/Cadastro.css";

import { apiPost } from "../../services/api";
import { buscarCursos } from "../../services/cursoServices";
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
  const [cursoId, setCursoId] = useState("");
  const [cursos, setCursos] = useState([]);
  const [carregandoCursos, setCarregandoCursos] = useState(false);
  const [erroCursos, setErroCursos] = useState("");

  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [errosCampos, setErrosCampos] = useState({});

  // ===============================
  // CARREGAR CURSOS
  // ===============================

  useEffect(() => {
    let ativo = true;

    async function carregarListaCursos() {
      setCarregandoCursos(true);
      setErroCursos("");

      try {
        const resultado = await buscarCursos();

        if (ativo) {
          setCursos(resultado);
        }
      } catch (erro) {
        console.error("Erro ao carregar cursos:", erro);

        if (ativo) {
          setErroCursos(
            "Não foi possível carregar os cursos. Tente novamente."
          );
        }
      } finally {
        if (ativo) {
          setCarregandoCursos(false);
        }
      }
    }

    if (
      !loading &&
      user &&
      autenticado &&
      tipoPerfil === "administrador"
    ) {
      carregarListaCursos();
    }

    return () => {
      ativo = false;
    };
  }, [loading, user, autenticado, tipoPerfil]);

  // ===============================
  // ALTERAR PERFIL
  // ===============================

  function handlePerfilChange(novoPerfil) {
    setPerfil(novoPerfil);
    setCursoId("");
    setErro("");
    setSucesso("");

    setErrosCampos((anteriores) => {
      const novos = { ...anteriores };
      delete novos.perfil;
      delete novos.cursoId;
      return novos;
    });
  }

  // ===============================
  // ENVIAR FORMULÁRIO
  // ===============================

  async function handleSubmit(event) {
    event.preventDefault();

    setErro("");
    setSucesso("");
    setErrosCampos({});

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

    const nome = String(formulario.get("nome") || "").trim();
    const email = String(formulario.get("email") || "")
      .trim()
      .toLowerCase();
    const senha = String(formulario.get("senha") || "");
    const dataNascimento = String(
      formulario.get("dataNascimento") || ""
    );
    const telefone = String(
      formulario.get("telefone") || ""
    ).trim();

    const novosErros = {};

    if (!nome) {
      novosErros.nome = "O nome completo é obrigatório.";
    } else if (!validarNome(nome)) {
      novosErros.nome =
        "Informe um nome com pelo menos 3 caracteres, usando letras, espaços, apóstrofos ou hífens.";
    }

    if (!email) {
      novosErros.email = "O e-mail é obrigatório.";
    } else if (!validarEmail(email)) {
      novosErros.email = "Informe um endereço de e-mail válido.";
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

    if (perfil === "professor") {
      if (!cursoId) {
        novosErros.cursoId =
          "Selecione o curso que será vinculado ao professor.";
      } else if (
        !cursos.some((curso) => curso.id === cursoId)
      ) {
        novosErros.cursoId =
          "O curso selecionado não está disponível. Atualize a lista.";
      }
    }

    if (Object.keys(novosErros).length > 0) {
      setErrosCampos(novosErros);
      setErro("Corrija os campos destacados antes de continuar.");
      return;
    }

    const idade = calcularIdade(dataNascimento);

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

        // Enviado quando o perfil selecionado é professor.
        // A API precisa aceitar e persistir este campo
        // para que o vínculo seja efetivamente salvo.
        ...(perfil === "professor" ? { cursoId } : {}),
      });

      setSucesso(
        perfil === "professor"
          ? `Usuário ${nome} cadastrado. O curso selecionado foi enviado na solicitação; confirme a persistência do vínculo antes de considerá-lo concluído.`
          : `Usuário ${nome} cadastrado com sucesso! Sua sessão administrativa foi mantida.`
      );

      formularioElement.reset();
      setPerfil("aluno");
      setCursoId("");
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
          <h1 className="cadastro-title">Cadastro</h1>

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
            <Label htmlFor="nome">Nome completo</Label>

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
            <Label htmlFor="email">E-mail</Label>

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
            <Label htmlFor="senha">Senha</Label>

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
                onChange={() => handlePerfilChange("aluno")}
              />

              <Label htmlFor="perfil-aluno">Aluno</Label>
            </div>

            <div className="radio-opcao">
              <Radio
                id="perfil-professor"
                name="perfil"
                value="professor"
                checked={perfil === "professor"}
                onChange={() => handlePerfilChange("professor")}
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
                onChange={() =>
                  handlePerfilChange("administrador")
                }
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

          {/* CURSO DO PROFESSOR */}
          {perfil === "professor" && (
            <Formgroup>
              <Label htmlFor="cursoId">
                Curso vinculado ao professor
              </Label>

              <select
                id="cursoId"
                name="cursoId"
                value={cursoId}
                onChange={(event) => {
                  setCursoId(event.target.value);

                  setErrosCampos((anteriores) => {
                    const novos = { ...anteriores };
                    delete novos.cursoId;
                    return novos;
                  });
                }}
                disabled={
                  carregandoCursos ||
                  Boolean(erroCursos) ||
                  cursos.length === 0
                }
                required
                aria-invalid={Boolean(errosCampos.cursoId)}
                aria-describedby="curso-ajuda"
              >
                <option value="">
                  {carregandoCursos
                    ? "Carregando cursos..."
                    : erroCursos
                      ? "Erro ao carregar cursos"
                      : cursos.length === 0
                        ? "Nenhum curso disponível"
                        : "Selecione um curso"}
                </option>

                {cursos.map((curso) => (
                  <option key={curso.id} value={curso.id}>
                    {curso.titulo}
                  </option>
                ))}
              </select>

              <small id="curso-ajuda">
                Selecione o curso que deseja associar ao professor.
              </small>

              {erroCursos && (
                <p className="mensagem-erro" role="alert">
                  {erroCursos}
                </p>
              )}

              {errosCampos.cursoId && (
                <p className="mensagem-erro" role="alert">
                  {errosCampos.cursoId}
                </p>
              )}
            </Formgroup>
          )}

          {/* MENSAGENS */}
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
            disabled={
              carregando ||
              (perfil === "professor" &&
                (carregandoCursos ||
                  Boolean(erroCursos) ||
                  cursos.length === 0))
            }
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
