
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./PerfilAdm.css";

import { useAuth } from "../../contexts/AuthContext";

import {
  atualizarPerfilUsuario,
  buscarPerfilUsuario,
} from "../../services/usuarioServices";

function obterDadosPerfil(perfil, usuarioBackend, user) {
  const dados = {
    ...(usuarioBackend || {}),
    ...(perfil || {}),
  };

  return {
    nome:
      dados.nome ||
      dados.nomeCompleto ||
      dados.displayName ||
      user?.displayName ||
      "",
    email: dados.email || user?.email || "",
    dataNascimento: dados.dataNascimento || dados.nascimento || "",
    telefone: dados.telefone || "",
  };
}

function normalizarData(data) {
  if (!data) return "";

  const valor = String(data);

  if (/^\d{4}-\d{2}-\d{2}$/.test(valor)) {
    return valor;
  }

  const brasileira = valor.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);

  if (brasileira) {
    return `${brasileira[3]}-${brasileira[2]}-${brasileira[1]}`;
  }

  return "";
}

export default function PerfilAdm() {
  const { user, perfil, usuarioBackend } = useAuth();

  const dadosIniciais = obterDadosPerfil(
    perfil,
    usuarioBackend,
    user
  );

  const [administrador, setAdministrador] = useState(dadosIniciais);
  const [dadosOriginais, setDadosOriginais] = useState(dadosIniciais);

  const [editando, setEditando] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [carregandoPerfil, setCarregandoPerfil] = useState(true);
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    if (!user?.uid) {
      setCarregandoPerfil(false);
      return;
    }

    let ativo = true;

    async function carregarPerfil() {
      setCarregandoPerfil(true);
      setMensagem("");

      try {
        const dados = await buscarPerfilUsuario(user.uid);

        if (!ativo) return;

        const dadosCarregados = {
          nome:
            dados?.nome ||
            dados?.nomeCompleto ||
            dados?.displayName ||
            perfil?.nome ||
            perfil?.nomeCompleto ||
            usuarioBackend?.nome ||
            usuarioBackend?.nomeCompleto ||
            user.displayName ||
            "",
          email:
            dados?.email ||
            perfil?.email ||
            usuarioBackend?.email ||
            user.email ||
            "",
          dataNascimento: normalizarData(
            dados?.dataNascimento ||
              dados?.nascimento ||
              perfil?.dataNascimento ||
              usuarioBackend?.dataNascimento ||
              ""
          ),
          telefone:
            dados?.telefone ||
            perfil?.telefone ||
            usuarioBackend?.telefone ||
            "",
        };

        setAdministrador(dadosCarregados);
        setDadosOriginais(dadosCarregados);
      } catch (erro) {
        console.error("Erro ao carregar perfil do administrador:", erro);

        if (ativo) {
          setMensagem(
            erro?.message ||
              "Não foi possível carregar os dados do perfil."
          );
        }
      } finally {
        if (ativo) {
          setCarregandoPerfil(false);
        }
      }
    }

    carregarPerfil();

    return () => {
      ativo = false;
    };
  }, [user?.uid, user?.email, user?.displayName]);

  const atualizarCampo = (evento) => {
    const { name, value } = evento.target;

    setAdministrador((atual) => ({
      ...atual,
      [name]: value,
    }));
  };

  const iniciarEdicao = (evento) => {
    evento?.preventDefault();
    evento?.stopPropagation();

    setDadosOriginais({ ...administrador });
    setMensagem("");
    setEditando(true);
  };

  const cancelarEdicao = () => {
    setAdministrador({ ...dadosOriginais });
    setMensagem("");
    setEditando(false);
  };

  const salvarPerfil = async (evento) => {
    evento.preventDefault();

    if (salvando) return;

    setMensagem("");

    if (!user?.uid) {
      setMensagem(
        "Sua sessão não foi identificada. Entre novamente."
      );
      return;
    }

    if (!administrador.nome.trim()) {
      setMensagem("Informe o nome do administrador.");
      return;
    }

    try {
      setSalvando(true);

      const dadosAtualizados = await atualizarPerfilUsuario(
        user.uid,
        {
          nome: administrador.nome.trim(),
          telefone: administrador.telefone.trim(),
          dataNascimento: administrador.dataNascimento.trim(),
        }
      );

      const dadosSalvos = {
        ...administrador,
        nome:
          dadosAtualizados?.nome ??
          dadosAtualizados?.nomeCompleto ??
          administrador.nome.trim(),
        telefone:
          dadosAtualizados?.telefone ??
          administrador.telefone.trim(),
        dataNascimento: normalizarData(
          dadosAtualizados?.dataNascimento ??
            administrador.dataNascimento
        ),
      };

      setAdministrador(dadosSalvos);
      setDadosOriginais(dadosSalvos);
      setEditando(false);
      setMensagem("Perfil atualizado com sucesso!");
    } catch (erro) {
      console.error("Erro ao salvar perfil:", erro);

      setMensagem(
        erro?.message ||
          "Não foi possível salvar as alterações."
      );
    } finally {
      setSalvando(false);
    }
  };

  const menu = [
    { icone: "⌂", texto: "Início", rota: "/HomeAdm" },
    { icone: "▣", texto: "Cadastro", rota: "/cadastro" },
    { icone: "●", texto: "Perfil", rota: "/PerfilAdm" },
  ];

  return (
    <main className="perfil-aluno">
      <aside className="perfil-sidebar">
        <div className="perfil-logo">
          <span className="logo-icone">◈</span>
          <span>Aprender</span>
        </div>

        <nav className="perfil-menu" aria-label="Menu principal">
          {menu.map((item) => (
            <Link
              key={item.texto}
              to={item.rota}
              className={`perfil-menu-item ${
                item.texto === "Perfil" ? "ativo" : ""
              }`}
              aria-current={
                item.texto === "Perfil" ? "page" : undefined
              }
            >
              <span className="menu-icone" aria-hidden="true">
                {item.icone}
              </span>
              <span>{item.texto}</span>
            </Link>
          ))}
        </nav>
      </aside>

      <section className="perfil-conteudo">
        <header className="perfil-topbar">
          <div>
            <span>Área administrativa</span>
          </div>

          <div
            className="perfil-avatar-mini"
            aria-label="Avatar do administrador"
          >
            👤
          </div>
        </header>

        <div className="perfil-card">
          <h1>Perfil do administrador</h1>

          <div className="perfil-foto-container">
            <div
              className="perfil-foto"
              aria-label="Foto do administrador"
            >
              👤
            </div>
          </div>

          <h2>Dados pessoais</h2>

          {mensagem && (
            <p
              className="perfil-mensagem"
              role="status"
              aria-live="polite"
            >
              {mensagem}
            </p>
          )}

          {carregandoPerfil ? (
            <p role="status">Carregando dados do perfil...</p>
          ) : (
            <form
              className="perfil-formulario"
              onSubmit={salvarPerfil}
              onKeyDown={(evento) => {
                if (
                  evento.key === "Enter" &&
                  evento.target.tagName !== "TEXTAREA"
                ) {
                  evento.preventDefault();
                }
              }}
            >
              <div className="perfil-campo">
                <label htmlFor="nome">Nome</label>
                <input
                  id="nome"
                  name="nome"
                  type="text"
                  value={administrador.nome}
                  onChange={atualizarCampo}
                  readOnly={!editando || salvando}
                  required
                />
              </div>

              <div className="perfil-campo">
                <label htmlFor="email">E-mail</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={administrador.email}
                  readOnly
                  aria-describedby="email-ajuda"
                />
                <small id="email-ajuda">
                  O e-mail não pode ser alterado por este formulário.
                </small>
              </div>

              <div className="perfil-campo">
                <label htmlFor="dataNascimento">
                  Data de nascimento
                </label>
                <input
                  id="dataNascimento"
                  name="dataNascimento"
                  type={editando ? "date" : "text"}
                  value={
                    editando
                      ? administrador.dataNascimento
                      : administrador.dataNascimento
                        ? administrador.dataNascimento
                            .split("-")
                            .reverse()
                            .join("/")
                        : ""
                  }
                  onChange={atualizarCampo}
                  readOnly={!editando || salvando}
                />
              </div>

              <div className="perfil-campo">
                <label htmlFor="telefone">Telefone</label>
                <input
                  id="telefone"
                  name="telefone"
                  type="tel"
                  value={administrador.telefone}
                  onChange={atualizarCampo}
                  readOnly={!editando || salvando}
                />
              </div>

              <div className="perfil-acoes">
                {editando && (
                  <button
                    type="button"
                    className="perfil-botao cancelar"
                    onClick={cancelarEdicao}
                    disabled={salvando}
                  >
                    Cancelar
                  </button>
                )}

                {!editando ? (
                  <button
                    type="button"
                    className="perfil-botao"
                    onClick={iniciarEdicao}
                    disabled={salvando || carregandoPerfil}
                  >
                    Editar perfil
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="perfil-botao"
                    disabled={salvando}
                  >
                    {salvando
                      ? "Salvando..."
                      : "Salvar alterações"}
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
