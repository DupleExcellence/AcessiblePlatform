
import React, { useEffect, useState } from "react";
import "./HomeProfessor.css";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

import { buscarCursos } from "../../services/cursoServices";
import { buscarAlunos } from "../../services/alunoServices";
import { buscarRanking } from "../../services/rankingServices";
import { buscarNomeUsuario } from "../../services/usuarioServices";
import { listarAtividades } from "../../services/atividadeServices";
import { listarEntregas } from "../../services/entregaServices";

function extrairId(valor) {
  if (!valor) return "";

  if (typeof valor === "object") {
    valor = valor.id ?? valor._id ?? valor.path ?? "";
  }

  return String(valor).split("/").filter(Boolean).pop() || "";
}

function obterNomeExistente(aluno) {
  return (
    aluno?.nomeCompleto ??
    aluno?.nome ??
    aluno?.nomeAluno ??
    aluno?.alunoNome ??
    null
  );
}

function HomeProfessor() {
  const { perfil, logout } = useAuth();
  const navigate = useNavigate();

  const [cursos, setCursos] = useState([]);
  const [alunos, setAlunos] = useState([]);
  const [ranking, setRanking] = useState([]);
  const [entregasPendentes, setEntregasPendentes] = useState(0);

  const [carregandoDashboard, setCarregandoDashboard] = useState(true);
  const [erroDashboard, setErroDashboard] = useState("");

  const [notificacoesAbertas, setNotificacoesAbertas] = useState(false);

  useEffect(() => {
    let cancelado = false;

    async function carregarDashboard() {
      setCarregandoDashboard(true);
      setErroDashboard("");

      try {
        const [
          cursosResultado,
          alunosResultado,
          rankingResultado,
          atividadesResultado,
        ] = await Promise.all([
          buscarCursos(),
          buscarAlunos(),
          buscarRanking(),
          listarAtividades(),
        ]);

        if (
          !Array.isArray(cursosResultado) ||
          !Array.isArray(alunosResultado) ||
          !Array.isArray(atividadesResultado)
        ) {
          throw new Error(
            "A API retornou dados inválidos para o dashboard."
          );
        }

        const rankingArray = Array.isArray(rankingResultado)
          ? rankingResultado
          : Array.isArray(rankingResultado?.ranking)
            ? rankingResultado.ranking
            : [];

        // Busca os nomes dos alunos no Firestore quando
        // o ranking não disponibiliza um nome real.
        const rankingComNomes = await Promise.all(
          rankingArray.slice(0, 3).map(async (aluno) => {
            const nomeExistente = obterNomeExistente(aluno);

            if (nomeExistente && nomeExistente !== "Aluno") {
              return aluno;
            }

            try {
              const usuarioId = extrairId(
                aluno.usuarioId ?? aluno.id ?? aluno._id
              );

              const nomeFirestore = await buscarNomeUsuario(usuarioId);

              return {
                ...aluno,
                nome: nomeFirestore || "Nome não cadastrado",
              };
            } catch (error) {
              console.error(
                "Erro ao buscar nome do aluno:",
                error
              );

              return {
                ...aluno,
                nome: "Nome indisponível",
              };
            }
          })
        );

        // Busca as entregas associadas a cada atividade.
        const resultadosEntregas = await Promise.all(
          atividadesResultado.map(async (atividade) => {
            const atividadeId = extrairId(
              atividade.id ?? atividade._id
            );

            if (!atividadeId) return [];

            const resultado = await listarEntregas({ atividadeId });

            if (!Array.isArray(resultado)) {
              throw new Error(
                `A API retornou entregas inválidas para a atividade ${atividadeId}.`
              );
            }

            return resultado.filter(
              (entrega) =>
                extrairId(entrega.atividadeId) === atividadeId
            );
          })
        );

        // Evita contar a mesma entrega mais de uma vez.
        const entregasPorId = new Map();

        resultadosEntregas.flat().forEach((entrega, indice) => {
          const entregaId = extrairId(
            entrega.id ?? entrega._id
          );

          const chave = entregaId || `sem-id-${indice}`;

          if (!entregasPorId.has(chave)) {
            entregasPorId.set(chave, entrega);
          }
        });

        const todasEntregas = Array.from(entregasPorId.values());

        const totalPendentes = todasEntregas.filter((entrega) => {
          const status = String(entrega.status ?? "")
            .trim()
            .toLowerCase();

          return status !== "corrigida";
        }).length;

        if (cancelado) return;

        setCursos(cursosResultado);
        setAlunos(alunosResultado);
        setRanking(rankingComNomes);
        setEntregasPendentes(totalPendentes);
      } catch (error) {
        console.error(
          "Erro ao carregar dashboard do professor:",
          error
        );

        if (!cancelado) {
          setErroDashboard(
            error instanceof Error
              ? error.message
              : "Não foi possível carregar os indicadores."
          );
        }
      } finally {
        if (!cancelado) {
          setCarregandoDashboard(false);
        }
      }
    }

    carregarDashboard();

    return () => {
      cancelado = true;
    };
  }, []);

  async function handleLogout() {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Erro ao sair da conta:", error);

      setErroDashboard(
        "Não foi possível encerrar a sessão."
      );
    }
  }

  const nomeProfessor =
    perfil?.nomeCompleto ??
    perfil?.nome ??
    perfil?.nomeProfessor ??
    "Professor";

  function abrirNotificacoes() {
    setNotificacoesAbertas((aberto) => !aberto);
  }

  function abrirEntregasPendentes() {
    setNotificacoesAbertas(false);
    navigate("/atividadesProfessor");
  }

  return (
    <div className="professor-page">
      {/* CABEÇALHO */}
      <header className="top-header">
        <div className="logo">
          <span className="logo-icon">◆</span>
          <span>Aprender</span>
        </div>

        <div className="header-actions">
          {/* NOTIFICAÇÕES */}
          <div className="notification-container">
            <button
              type="button"
              className="icon-button"
              aria-label={
                entregasPendentes > 0
                  ? `Notificações: ${entregasPendentes} entregas pendentes`
                  : "Notificações"
              }
              aria-expanded={notificacoesAbertas}
              aria-controls="painel-notificacoes"
              onClick={abrirNotificacoes}
            >
              🔔

              {entregasPendentes > 0 && (
                <span
                  className="notification-badge"
                  aria-hidden="true"
                >
                  {entregasPendentes > 99
                    ? "99+"
                    : entregasPendentes}
                </span>
              )}
            </button>

            {notificacoesAbertas && (
              <section
                id="painel-notificacoes"
                className="notification-panel"
                aria-label="Painel de notificações"
              >
                <div className="notification-header">
                  <h2>Notificações</h2>

                  <button
                    type="button"
                    className="notification-close"
                    aria-label="Fechar notificações"
                    onClick={() =>
                      setNotificacoesAbertas(false)
                    }
                  >
                    ×
                  </button>
                </div>

                {carregandoDashboard ? (
                  <p role="status">
                    Carregando notificações...
                  </p>
                ) : erroDashboard ? (
                  <p className="notification-empty">
                    Não foi possível carregar as notificações.
                  </p>
                ) : entregasPendentes > 0 ? (
                  <button
                    type="button"
                    className="notification-item"
                    onClick={abrirEntregasPendentes}
                  >
                    <span
                      className="notification-icon"
                      aria-hidden="true"
                    >
                      📝
                    </span>

                    <span className="notification-text">
                      <strong>
                        Entregas aguardando correção
                      </strong>

                      <small>
                        Você tem {entregasPendentes}{" "}
                        {entregasPendentes === 1
                          ? "entrega pendente"
                          : "entregas pendentes"}
                        .
                      </small>
                    </span>

                    <span aria-hidden="true">→</span>
                  </button>
                ) : (
                  <p className="notification-empty">
                    Você não tem entregas pendentes de correção.
                  </p>
                )}
              </section>
            )}
          </div>

          <button
            type="button"
            className="profile-button"
            aria-label="Abrir perfil do professor"
            onClick={() => navigate("/perfilProfessor")}
          >
            👤
          </button>
        </div>
      </header>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="main-content">
        <section className="welcome">
          <div className="avatar" aria-hidden="true">
            👤
          </div>

          <div>
            <h1>Olá, {nomeProfessor}!</h1>
            <p>Aqui está o que você precisa hoje.</p>
          </div>
        </section>

        {erroDashboard && (
          <div
            role="alert"
            aria-live="assertive"
            className="dashboard-error"
          >
            Não foi possível atualizar o dashboard:{" "}
            {erroDashboard}
          </div>
        )}

        {/* DASHBOARD */}
        <div className="dashboard">
          {/* CARDS */}
          <section className="cards">
            <div className="dashboard-card orange">
              <div className="card-icon" aria-hidden="true">
                ♧
              </div>

              <p>Entregas a corrigir</p>

              <strong>
                {carregandoDashboard ? "..." : entregasPendentes}
              </strong>

              <button
                type="button"
                className="dashboard-link"
                onClick={() => navigate("/atividadesProfessor")}
              >
                Ver entregas →
              </button>
            </div>

            <div className="dashboard-card blue">
              <div className="card-icon" aria-hidden="true">
                ♧
              </div>

              <p>Cursos disponíveis</p>

              <strong>
                {carregandoDashboard ? "..." : cursos.length}
              </strong>

              
            </div>

            <div className="dashboard-card purple">
              <div className="card-icon" aria-hidden="true">
                ♟
              </div>

              <p>Alunos cadastrados</p>

              <strong>
                {carregandoDashboard ? "..." : alunos.length}
              </strong>

              
            </div>
          </section>

          {/* RANKING */}
          <section className="ranking">
            <h2>Ranking de alunos</h2>

            {carregandoDashboard ? (
              <p role="status">Carregando ranking...</p>
            ) : ranking.length === 0 ? (
              <p>Nenhum aluno no ranking.</p>
            ) : (
              ranking.slice(0, 3).map((aluno, indice) => {
                const nome =
                  obterNomeExistente(aluno) ??
                  "Nome não cadastrado";

                const xp =
                  aluno.xpTotal ??
                  aluno.xp ??
                  aluno.pontuacao ??
                  0;

                return (
                  <div
                    className="ranking-item"
                    key={
                      aluno.id ??
                      aluno._id ??
                      aluno.alunoId ??
                      indice
                    }
                  >
                    <span className="position">
                      {indice + 1}
                    </span>

                    <div
                      className="student-avatar"
                      aria-hidden="true"
                    >
                      👤
                    </div>

                    <span className="student-name">
                      {nome}
                    </span>

                    <strong>{xp} XP</strong>
                  </div>
                );
              })
            )}
          </section>
        </div>
      </main>

      {/* MENU INFERIOR */}
      <nav
        className="bottom-menu"
        aria-label="Menu principal"
      >
        <button
          type="button"
          className="menu-item active"
          onClick={() => navigate("/homeProfessor")}
        >
          <span aria-hidden="true">⌂</span>
          <small>Início</small>
        </button>

        <button
          type="button"
          className="menu-item"
          onClick={() => navigate("/licaoProfessor")}
        >
          <span aria-hidden="true">▣</span>
          <small>Criar Lições</small>
        </button>
        <button type="button" className="menu-item" onClick={() => navigate("/atividadeProfessor")}>
            <span aria-hidden="true">▣</span>
            <small>Criar atividades</small>
        </button>

        <button
          type="button"
          className="menu-item"
          onClick={() => navigate("/cursos")}
        >
          <span aria-hidden="true">▤</span>
          <small>Cursos</small>
        </button>

        

      
        <button
          type="button"
          className="menu-item"
          onClick={() => navigate("/perfilProfessor")}
        >
          <span aria-hidden="true">👤</span>
          <small>Perfil</small>
        </button>


        <button
          type="button"
          className="menu-item"
          onClick={handleLogout}
        >
          <span aria-hidden="true">↪</span>
          <small>Sair</small>
        </button>
      </nav>
    </div>
  );
}

export default HomeProfessor;
