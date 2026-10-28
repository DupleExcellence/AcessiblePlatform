
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { atualizarPerfilUsuario } from "../../services/usuarioServices";
import { listarAtividades } from "../../services/atividadeServices";
import { listarEntregas } from "../../services/entregaServices";
import "./PerfilProfessor.css";

const formularioInicial = {
  nome: "",
  email: "",
  dataNascimento: "",
  telefone: "",
};

function primeiroValor(...valores) {
  return (
    valores.find(
      (valor) => typeof valor === "string" && valor.trim() !== ""
    ) || ""
  );
}

function extrairId(valor) {
  if (!valor) return "";

  if (typeof valor === "object") {
    if (valor.id) return extrairId(valor.id);
    if (valor.path) return extrairId(valor.path);

    if (Array.isArray(valor._path?.segments)) {
      return valor._path.segments.at(-1) || "";
    }
  }

  return String(valor).split("/").filter(Boolean).pop() || "";
}

function formatarDataParaInput(valor) {
  if (!valor) return "";

  if (typeof valor !== "string") {
    if (typeof valor.toDate === "function") {
      valor = valor.toDate().toISOString().slice(0, 10);
    } else if (valor instanceof Date) {
      valor = valor.toISOString().slice(0, 10);
    } else {
      return "";
    }
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(valor)) {
    return valor;
  }

  const brasileira = valor.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);

  if (brasileira) {
    return `${brasileira[3]}-${brasileira[2]}-${brasileira[1]}`;
  }

  return "";
}

function obterDadosPerfil(usuarioBackend, user) {
  const dados = usuarioBackend || {};
  const usuario = dados.usuario || dados.user || {};
  const perfilUsuario = dados.dadosUsuario || {};

  const dataNascimento = primeiroValor(
    dados.dataNascimento,
    dados.data_nascimento,
    usuario.dataNascimento,
    usuario.data_nascimento,
    perfilUsuario.dataNascimento,
    perfilUsuario.data_nascimento
  );

  return {
    nome: primeiroValor(
      dados.nomeCompleto,
      dados.nome_completo,
      dados.nome,
      usuario.nomeCompleto,
      usuario.nome_completo,
      usuario.nome,
      perfilUsuario.nomeCompleto,
      perfilUsuario.nome,
      user?.displayName
    ),
    email: primeiroValor(
      dados.email,
      usuario.email,
      perfilUsuario.email,
      user?.email
    ),
    dataNascimento: formatarDataParaInput(dataNascimento),
    telefone: primeiroValor(
      dados.telefone,
      dados.celular,
      dados.numeroTelefone,
      dados.numero_telefone,
      usuario.telefone,
      usuario.celular,
      perfilUsuario.telefone,
      perfilUsuario.celular
    ),
  };
}

export default function PerfilProfessor() {
  const { user, usuarioBackend, loading } = useAuth();

  const [formData, setFormData] = useState(formularioInicial);
  const [dadosOriginais, setDadosOriginais] = useState(formularioInicial);
  const [editando, setEditando] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState("");

  const [notificacoesAbertas, setNotificacoesAbertas] = useState(false);
  const [notificacoes, setNotificacoes] = useState([]);
  const [carregandoNotificacoes, setCarregandoNotificacoes] = useState(false);
  const [erroNotificacoes, setErroNotificacoes] = useState("");

  // Carrega os dados do perfil sem sobrescrever alterações em andamento.
  useEffect(() => {
    if (loading || editando || !user?.uid) return;

    const dados = obterDadosPerfil(usuarioBackend, user);

    setFormData(dados);
    setDadosOriginais(dados);
  }, [
    loading,
    editando,
    user?.uid,
    user?.email,
    user?.displayName,
    usuarioBackend,
  ]);

  async function carregarNotificacoes() {
    setCarregandoNotificacoes(true);
    setErroNotificacoes("");

    try {
      const [resultadoAtividades, resultadoEntregas] = await Promise.all([
        listarAtividades(),
        listarEntregas(),
      ]);

      if (!Array.isArray(resultadoAtividades)) {
        throw new Error("Não foi possível obter a lista de atividades.");
      }

      if (!Array.isArray(resultadoEntregas)) {
        throw new Error("Não foi possível obter a lista de entregas.");
      }

      const mapaAtividades = new Map();

      resultadoAtividades.forEach((atividade) => {
        const id = extrairId(atividade.id ?? atividade._id);

        if (id) {
          mapaAtividades.set(id, atividade);
        }
      });

      const pendentes = resultadoEntregas
        .filter((entrega) => {
          const status = String(entrega.status || "")
            .trim()
            .toLowerCase();

          return status !== "corrigida";
        })
        .map((entrega) => {
          const idEntrega = extrairId(entrega.id ?? entrega._id);
          const atividadeId = extrairId(entrega.atividadeId);
          const atividade = mapaAtividades.get(atividadeId);

          return {
            id: idEntrega || `${atividadeId}-${extrairId(entrega.alunoId)}`,
            atividadeId,
            titulo: atividade?.titulo || "Atividade sem título",
            alunoId: extrairId(entrega.alunoId),
            status: entrega.status || "Pendente",
          };
        })
        .filter((notificacao) => notificacao.atividadeId);

      setNotificacoes(pendentes);
    } catch (erro) {
      console.error("Erro ao carregar notificações:", erro);

      setErroNotificacoes(
        erro instanceof Error
          ? erro.message
          : "Não foi possível carregar as notificações."
      );
    } finally {
      setCarregandoNotificacoes(false);
    }
  }

  useEffect(() => {
    if (!loading && user?.uid) {
      carregarNotificacoes();
    }
  }, [loading, user?.uid]);

  async function alternarNotificacoes() {
    const abrir = !notificacoesAbertas;
    setNotificacoesAbertas(abrir);

    if (abrir) {
      await carregarNotificacoes();
    }
  }

  function abrirEntrega(notificacao) {
    if (!notificacao.atividadeId) return;

    const params = new URLSearchParams({
      atividadeId: notificacao.atividadeId,
      visualizacao: "entregas",
    });

    window.open(
      `/atividadesProfessor?${params.toString()}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((anterior) => ({
      ...anterior,
      [name]: value,
    }));

    setMensagem("");
    setTipoMensagem("");
  }

  function iniciarEdicao(event) {
  event.preventDefault();
  event.stopPropagation();

  console.log("Clique em Editar perfil");
  console.log("Antes:", {
    editando,
    caminho: window.location.pathname,
  });

  setMensagem("");
  setTipoMensagem("");
  setDadosOriginais({ ...formData });
  setEditando(true);
  }

  function cancelarEdicao() {
    setFormData({ ...dadosOriginais });
    setEditando(false);
    setMensagem("");
    setTipoMensagem("");
  }

  
async function handleSubmit(event) {
  event.preventDefault();

  try {
    setSalvando(true);
    setMensagem("");
    setTipoMensagem("");

    const dadosAtualizados = {
      nome: formData.nome,
      telefone: formData.telefone,
      dataNascimento: formData.dataNascimento,
    };

    console.log("UID do usuário:", user?.uid);
    console.log("Dados para salvar:", dadosAtualizados);

   const resultado = await atualizarPerfilUsuario(
      user.uid,
      dadosAtualizados
    );

    const dadosSalvos = {
      ...formData,
      nome: resultado.nome ?? dadosAtualizados.nome,
      telefone: resultado.telefone ?? dadosAtualizados.telefone,
      dataNascimento:
        resultado.dataNascimento ?? dadosAtualizados.dataNascimento,
    };

    setFormData(dadosSalvos);
    setDadosOriginais(dadosSalvos);
    setEditando(false);
    setMensagem("Perfil atualizado com sucesso!");
    setTipoMensagem("sucesso");
      } finally {
        setSalvando(false);
      }
    }


  return (
    <div className="perfil-professor">
      <aside className="menu-professor">
        <div className="logo-professor">
          <span className="logo-icone" aria-hidden="true">◈</span>
          <span>Aprender</span>
        </div>

        <nav className="menu-links" aria-label="Menu do professor">
          <Link to="/homeProfessor" className="menu-link">
            <span aria-hidden="true">⌂</span> Início
          </Link>

          <Link to="/atividadesProfessor" className="menu-link">
            <span aria-hidden="true">▣</span> Lições a corrigir
          </Link>

          <Link to="/cursos" className="menu-link">
            <span aria-hidden="true">▤</span> Cursos lecionando
          </Link>

          <Link
            to="/perfilProfessor"
            className="menu-link ativo"
            aria-current="page"
          >
            <span aria-hidden="true">◉</span> Perfil
          </Link>
        </nav>
      </aside>

      <main className="conteudo-professor">
        <header className="topbar-professor">
          <div className="topbar-acoes">
            <button
              type="button"
              className="icone-topbar"
              aria-label={`Notificações: ${notificacoes.length} entregas pendentes`}
              aria-expanded={notificacoesAbertas}
              onClick={alternarNotificacoes}
            >
              🔔
              {notificacoes.length > 0 && (
                <span className="contador-notificacoes">
                  {notificacoes.length > 99 ? "99+" : notificacoes.length}
                </span>
              )}
            </button>

            <button
              type="button"
              className="avatar-pequeno"
              aria-label="Minha conta"
            >
              👤
            </button>
          </div>

          {notificacoesAbertas && (
            <section
              className="painel-notificacoes"
              aria-label="Notificações de entregas"
            >
              <div className="cabecalho-notificacoes">
                <h2>Entregas pendentes</h2>

                <button
                  type="button"
                  className="atualizar-notificacoes"
                  onClick={carregarNotificacoes}
                  disabled={carregandoNotificacoes}
                >
                  {carregandoNotificacoes ? "Atualizando..." : "Atualizar"}
                </button>
              </div>

              {carregandoNotificacoes ? (
                <p role="status">Carregando notificações...</p>
              ) : erroNotificacoes ? (
                <p role="alert" className="erro-notificacoes">
                  {erroNotificacoes}
                </p>
              ) : notificacoes.length > 0 ? (
                <ul className="lista-notificacoes">
                  {notificacoes.map((notificacao) => (
                    <li key={notificacao.id}>
                      <button
                        type="button"
                        className="item-notificacao"
                        onClick={() => abrirEntrega(notificacao)}
                      >
                        <span className="ponto-notificacao" aria-hidden="true">
                          ●
                        </span>

                        <span className="texto-notificacao">
                          <strong>{notificacao.titulo}</strong>
                          <span>
                            Aluno: {notificacao.alunoId || "Não identificado"}
                          </span>
                          <span>Status: {notificacao.status}</span>
                          <small>Abrir entregas para corrigir</small>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="sem-notificacoes">
                  Não há entregas pendentes de correção.
                </p>
              )}
            </section>
          )}
        </header>

        <section className="cartao-perfil">
          <h1>Perfil do professor</h1>

          {loading ? (
            <p role="status">Carregando dados do perfil...</p>
          ) : (
            <>
              <div className="avatar-container">
                <div
                  className="avatar-professor"
                  role="img"
                  aria-label="Avatar do professor"
                >
                  👤
                </div>
              </div>

              <h2>Dados pessoais</h2>

              {mensagem && (
                <p
                  role={tipoMensagem === "erro" ? "alert" : "status"}
                  className={`mensagem-perfil ${tipoMensagem}`}
                >
                  {mensagem}
                </p>
              )}

              <form
                className="formulario-perfil"
                onSubmit={handleSubmit}
              >
                <div className="campo-perfil">
                  <label htmlFor="nome-professor">Nome</label>
                  <input
                    id="nome-professor"
                    name="nome"
                    type="text"
                    value={formData.nome}
                    onChange={handleChange}
                    placeholder="Nome não informado"
                    disabled={!editando || salvando}
                    required
                  />
                </div>

                <div className="campo-perfil">
                  <label htmlFor="email-professor">E-mail</label>
                  <input
                    id="email-professor"
                    name="email"
                    type="email"
                    value={formData.email}
                    placeholder="E-mail não informado"
                    disabled
                  />
                </div>

                <div className="campo-perfil">
                  <label htmlFor="nascimento-professor">
                    Data de nascimento
                  </label>
                  <input
                    id="nascimento-professor"
                    name="dataNascimento"
                    type="date"
                    value={formData.dataNascimento}
                    onChange={handleChange}
                    disabled={!editando || salvando}
                  />
                </div>

                <div className="campo-perfil">
                  <label htmlFor="telefone-professor">Telefone</label>
                  <input
                    id="telefone-professor"
                    name="telefone"
                    type="tel"
                    value={formData.telefone}
                    onChange={handleChange}
                    placeholder="Telefone não informado"
                    disabled={!editando || salvando}
                  />
                </div>

                <div className="acoes-perfil">
                  {!editando ? (
                    <button
                      type="button"
                      className="botao-editar-perfil"
                      onClick={iniciarEdicao}
                      disabled={salvando}
                    >
                      Editar perfil
                    </button>
                  ) : (
                    <>
                      <button
                        type="submit"
                        className="botao-editar-perfil"
                        disabled={salvando}
                      >
                        {salvando ? "Salvando..." : "Salvar alterações"}
                      </button>

                      <button
                        type="button"
                        className="botao-cancelar-perfil"
                        onClick={cancelarEdicao}
                        disabled={salvando}
                      >
                        Cancelar
                      </button>
                    </>
                  )}
                </div>
              </form>
            </>
          )}
        </section>
      </main>
    </div>
  );
}
