import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./PerfilAluno.css";

import { useAuth } from "../../contexts/AuthContext";
import { listarNotas } from "../../services/notaServices";

import {
  atualizarPerfilUsuario,
  buscarPerfilUsuario,
} from "../../services/usuarioServices";

function obterId(valor) {
  if (!valor) return "";

  if (typeof valor === "string") return valor;

  if (typeof valor === "object") {
    return valor.id || valor.uid || valor._id || valor.path || "";
  }

  return "";
}

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

  // O input type="date" precisa receber AAAA-MM-DD.
  if (/^\d{4}-\d{2}-\d{2}$/.test(valor)) return valor;

  const brasileira = valor.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);

  if (brasileira) {
    return `${brasileira[3]}-${brasileira[2]}-${brasileira[1]}`;
  }

  return "";
}

export default function PerfilAluno() {
  const { user, perfil, usuarioBackend } = useAuth();

  const dadosIniciais = obterDadosPerfil(perfil, usuarioBackend, user);

  const [aluno, setAluno] = useState(dadosIniciais);
  const [dadosOriginais, setDadosOriginais] = useState(dadosIniciais);

  const [editando, setEditando] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [carregandoPerfil, setCarregandoPerfil] = useState(true);
  const [mensagem, setMensagem] = useState("");

  const [notificacoesAbertas, setNotificacoesAbertas] = useState(false);
  const [notas, setNotas] = useState([]);
  const [carregandoNotas, setCarregandoNotas] = useState(false);
  const [erroNotas, setErroNotas] = useState("");

  const alunoId =
    obterId(perfil?.alunoId) ||
    obterId(perfil?.id) ||
    obterId(perfil?.uid) ||
    obterId(usuarioBackend?.alunoId) ||
    obterId(usuarioBackend?.id) ||
    user?.uid ||
    "";

  // Carrega o perfil salvo no Firestore.
  useEffect(() => {
    if (!user?.uid) {
      setCarregandoPerfil(false);
      return;
    }

    let ativo = true;

    async function carregarPerfil() {
      setCarregandoPerfil(true);

      try {
        const dados = await buscarPerfilUsuario(user.uid);

        if (!ativo) return;

        const dadosCarregados = {
          nome:
            dados.nome ||
            dados.nomeCompleto ||
            dados.displayName ||
            user.displayName ||
            "",
          email: dados.email || user.email || "",
          dataNascimento: normalizarData(
            dados.dataNascimento || dados.nascimento || ""
          ),
          telefone: dados.telefone || "",
        };

        setAluno(dadosCarregados);
        setDadosOriginais(dadosCarregados);
      } catch (erro) {
        console.error("Erro ao carregar perfil:", erro);

        if (ativo) {
          setMensagem(
            erro?.message || "Não foi possível carregar o perfil."
          );
        }
      } finally {
        if (ativo) setCarregandoPerfil(false);
      }
    }

    carregarPerfil();

    return () => {
      ativo = false;
    };
  }, [user?.uid, user?.email, user?.displayName]);

  // Carrega as notas e correções disponíveis.
  const carregarNotas = useCallback(async () => {
    setCarregandoNotas(true);
    setErroNotas("");

    try {
      const resposta = await listarNotas();

      const lista = Array.isArray(resposta)
        ? resposta
        : Array.isArray(resposta?.notas)
          ? resposta.notas
          : Array.isArray(resposta?.dados)
            ? resposta.dados
            : Array.isArray(resposta?.results)
              ? resposta.results
              : [];

      // Quando as notas contêm identificação do aluno, mostra apenas as dele.
      const notasDoAluno = lista.filter((nota) => {
        const idNota =
          obterId(nota?.alunoId) ||
          obterId(nota?.aluno?.id) ||
          obterId(nota?.aluno?.uid);

        return !idNota || idNota === alunoId;
      });

      setNotas(notasDoAluno);
    } catch (erro) {
      console.error("Erro ao carregar notas:", erro);
      setErroNotas(erro?.message || "Não foi possível carregar as notas.");
    } finally {
      setCarregandoNotas(false);
    }
  }, [alunoId]);

  useEffect(() => {
    if (notificacoesAbertas) {
      carregarNotas();
    }
  }, [notificacoesAbertas, carregarNotas]);

  // Atualiza somente o campo alterado.
  const atualizarCampo = (evento) => {
    const { name, value } = evento.target;

    setAluno((atual) => ({
      ...atual,
      [name]: value,
    }));
  };

  // Habilita os campos sem enviar o formulário.
  const iniciarEdicao = (evento) => {
    evento?.preventDefault();
    evento?.stopPropagation();

    setDadosOriginais({ ...aluno });
    setMensagem("");
    setEditando(true);
  };

  const cancelarEdicao = () => {
    setAluno({ ...dadosOriginais });
    setMensagem("");
    setEditando(false);
  };

  const salvarPerfil = async (evento) => {
    evento.preventDefault();

    if (salvando) return;

    setMensagem("");

    if (!user?.uid) {
      setMensagem("Sua sessão não foi identificada. Entre novamente.");
      return;
    }

    if (!aluno.nome.trim()) {
      setMensagem("Informe seu nome.");
      return;
    }

    try {
      setSalvando(true);

      const dadosAtualizados = await atualizarPerfilUsuario(user.uid, {
        nome: aluno.nome.trim(),
        telefone: aluno.telefone.trim(),
        dataNascimento: aluno.dataNascimento.trim(),
      });

      const dadosSalvos = {
        ...aluno,
        nome:
          dadosAtualizados?.nome ??
          dadosAtualizados?.nomeCompleto ??
          aluno.nome.trim(),
        telefone: dadosAtualizados?.telefone ?? aluno.telefone.trim(),
        dataNascimento:
          normalizarData(
            dadosAtualizados?.dataNascimento ?? aluno.dataNascimento
          ),
      };

      setAluno(dadosSalvos);
      setDadosOriginais(dadosSalvos);
      setEditando(false);
      setMensagem("Perfil atualizado com sucesso!");
    } catch (erro) {
      console.error("Erro ao salvar perfil:", erro);

      setMensagem(
        erro?.message || "Não foi possível salvar as alterações."
      );
    } finally {
      setSalvando(false);
    }
  };

  const obterTitulo = (nota) =>
    nota?.atividadeTitulo ||
    nota?.tituloAtividade ||
    nota?.atividade?.titulo ||
    nota?.titulo ||
    "Atividade corrigida";

  const obterPontuacao = (nota) => {
    const pontuacao = nota?.pontuacao ?? nota?.nota ?? nota?.pontos;
    const maxima = nota?.pontuacaoMaxima ?? nota?.notaMaxima;

    if (pontuacao === undefined || pontuacao === null) {
      return "Pontuação disponível";
    }

    return maxima !== undefined && maxima !== null
      ? `${pontuacao} / ${maxima} pontos`
      : `${pontuacao} pontos`;
  };

  const obterFeedback = (nota) =>
    nota?.feedback || nota?.comentario || nota?.observacao || "";

  const menu = [
    { icone: "⌂", texto: "Início", rota: "/HomeAluno" },
    { icone: "▣", texto: "Lições", rota: "/licaoAluno" },
    { icone: "▤", texto: "Cursos", rota: "/cursos" },
    { icone: "🏆", texto: "Ranking/Pontos", rota: "/Ranking" },
    { icone: "●", texto: "Perfil", rota: "/PerfilAluno" },
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
              aria-current={item.texto === "Perfil" ? "page" : undefined}
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
          <div className="perfil-notificacoes-container">
            <button
              type="button"
              className="perfil-notificacao"
              aria-label={`Notificações: ${notas.length} notas disponíveis`}
              aria-expanded={notificacoesAbertas}
              onClick={() =>
                setNotificacoesAbertas((abertas) => !abertas)
              }
            >
              🔔

              {notas.length > 0 && (
                <span className="perfil-notificacao-badge">
                  {notas.length > 99 ? "99+" : notas.length}
                </span>
              )}
            </button>

            {notificacoesAbertas && (
              <section
                className="perfil-notificacoes-painel"
                aria-label="Notas e correções"
              >
                <div className="perfil-notificacoes-cabecalho">
                  <h2>Notas e correções</h2>

                  <button
                    type="button"
                    className="perfil-notificacoes-atualizar"
                    onClick={carregarNotas}
                    disabled={carregandoNotas}
                  >
                    {carregandoNotas ? "Atualizando..." : "Atualizar"}
                  </button>
                </div>

                {carregandoNotas && (
                  <p role="status">Carregando notas...</p>
                )}

                {!carregandoNotas && erroNotas && (
                  <p role="alert">{erroNotas}</p>
                )}

                {!carregandoNotas &&
                  !erroNotas &&
                  notas.length === 0 && (
                    <p>Você ainda não possui notas disponíveis.</p>
                  )}

                {!carregandoNotas &&
                  !erroNotas &&
                  notas.length > 0 && (
                    <ul className="perfil-notificacoes-lista">
                      {notas.map((nota, indice) => (
                        <li
                          key={
                            nota.id ||
                            nota.notaId ||
                            `${obterTitulo(nota)}-${indice}`
                          }
                          className="perfil-notificacao-item"
                        >
                          <strong>{obterTitulo(nota)}</strong>
                          <span>{obterPontuacao(nota)}</span>

                          {obterFeedback(nota) && (
                            <p>
                              <strong>Feedback:</strong>{" "}
                              {obterFeedback(nota)}
                            </p>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
              </section>
            )}
          </div>

          <div className="perfil-avatar-mini" aria-label="Avatar do aluno">
            👤
          </div>
        </header>

        <div className="perfil-card">
          <h1>Perfil</h1>

          <div className="perfil-foto-container">
            <div className="perfil-foto" aria-label="Foto do aluno">
              👤
            </div>

            <button
              type="button"
              className="perfil-camera"
              aria-label="Selecionar foto do perfil"
              title="Selecionar foto do perfil"
              onClick={() =>
                document.getElementById("foto-aluno")?.click()
              }
            >
              📷
            </button>

            <input
              id="foto-aluno"
              type="file"
              accept="image/*"
              hidden
              onChange={(evento) => {
                const arquivo = evento.target.files?.[0];

                if (arquivo) {
                  setMensagem(
                    `Foto selecionada: ${arquivo.name}. O envio da foto ainda não está integrado.`
                  );
                }
              }}
            />
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
                if (evento.key === "Enter" && evento.target.tagName !== "TEXTAREA") {
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
                  value={aluno.nome}
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
                  value={aluno.email}
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
                      ? aluno.dataNascimento
                      : aluno.dataNascimento
                        ? aluno.dataNascimento.split("-").reverse().join("/")
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
                  value={aluno.telefone}
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
                    {salvando ? "Salvando..." : "Salvar alterações"}
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