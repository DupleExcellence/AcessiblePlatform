
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import "../HomeAdm/HomeAdm.css";
import Button from "../../components/Button/Button";
import { useAuth } from "../../contexts/AuthContext";

import { buscarAlunos } from "../../services/alunoServices";
import { buscarCursos } from "../../services/cursoServices";
import { buscarLicoes } from "../../services/licaoServices";

function HomeAdm() {
  const { perfil, tipoPerfil, autenticado, logout } = useAuth();

  const [indicadores, setIndicadores] = useState({
    alunos: null,
    professores: null,
    cursos: null,
    licoes: null,
  });


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


  const [atividades, setAtividades] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);

  const itensPorPagina = 5;

  const totalPaginas = Math.max(
    1,
    Math.ceil(atividades.length / itensPorPagina)
  );

  const atividadesPaginadas = useMemo(() => {
    const inicio = (paginaAtual - 1) * itensPorPagina;

    return atividades.slice(
      inicio,
      inicio + itensPorPagina
    );
  }, [atividades, paginaAtual]);

  const carregarDados = useCallback(async () => {
    setCarregando(true);
    setErro("");

    try {
      const resultados = await Promise.allSettled([
        buscarAlunos(),
        buscarCursos(),
        buscarLicoes(),
      ]);

      const [resAlunos, resCursos, resLicoes] = resultados;

      const alunos =
        resAlunos.status === "fulfilled" &&
        Array.isArray(resAlunos.value)
          ? resAlunos.value
          : [];

      const cursos =
        resCursos.status === "fulfilled" &&
        Array.isArray(resCursos.value)
          ? resCursos.value
          : [];

      const licoes =
        resLicoes.status === "fulfilled" &&
        Array.isArray(resLicoes.value)
          ? resLicoes.value
          : [];

      setIndicadores({
        alunos:
          resAlunos.status === "fulfilled"
            ? alunos.length
            : null,

        // Não exibir uma quantidade inventada.
        professores: null,

        cursos:
          resCursos.status === "fulfilled"
            ? cursos.length
            : null,

        licoes:
          resLicoes.status === "fulfilled"
            ? licoes.length
            : null,
      });

      const falhas = resultados
        .filter((resultado) => resultado.status === "rejected")
        .map(
          (resultado) =>
            resultado.reason?.message ||
            "Falha ao consultar os dados."
        );

      setErro(falhas.join(" | "));

      // Monta uma lista a partir dos registros reais da API.
      // Esta lista não representa um histórico de eventos.
      const recentes = [
        ...alunos.map((item) => ({
          id: `aluno-${item.id || item.usuarioId}`,
          tipo: "aluno",
          titulo: `Aluno: ${
            item.nome ||
            item.nomeCompleto ||
            item.id ||
            "Cadastro existente"
          }`,
          detalhe: item.turma
            ? `Turma: ${item.turma}`
            : "Registro de aluno",
          data: item.criadoEm,
        })),

        ...cursos.map((item) => ({
          id: `curso-${item.id}`,
          tipo: "curso",
          titulo: `Curso: ${
            item.titulo ||
            item.nome ||
            item.id ||
            "Curso cadastrado"
          }`,
          detalhe: item.descricao || "Curso cadastrado na plataforma",
          data: item.criadoEm,
        })),

        ...licoes.map((item) => ({
          id: `licao-${item.id}`,
          tipo: "licao",
          titulo: `Lição: ${
            item.titulo || item.id || "Lição cadastrada"
          }`,
          detalhe: item.descricao || "Lição cadastrada na plataforma",
          data: item.criadoEm,
        })),
      ];

      recentes.sort((a, b) => {
        const dataA = obterTimestamp(a.data);
        const dataB = obterTimestamp(b.data);

        return dataB - dataA;
      });

      setAtividades(recentes);
      setPaginaAtual(1);
    } catch (erroCarregamento) {
      setErro(
        erroCarregamento.message ||
          "Não foi possível carregar os dados da plataforma."
      );
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  useEffect(() => {
    setPaginaAtual((pagina) =>
      Math.min(pagina, totalPaginas)
    );
  }, [totalPaginas]);

  const nomeUsuario =
    perfil?.nome ||
    perfil?.nomeCompleto ||
    perfil?.email ||
    "Administrador";

  const cards = [
    {
      titulo: "Alunos",
      valor: indicadores.alunos,
      icone: "♙",
      classe: "aluno",
    },
    {
      titulo: "Professores",
      valor: indicadores.professores,
      icone: "♙",
      classe: "professor",
    },
    {
      titulo: "Cursos",
      valor: indicadores.cursos,
      icone: "▣",
      classe: "curso",
    },
    {
      titulo: "Lições",
      valor: indicadores.licoes,
      icone: "▤",
      classe: "licao",
    },
  ];

  const iconesAtividade = {
    aluno: "♙",
    curso: "▣",
    licao: "▤",
  };

  function exibirValor(valor) {
    if (carregando) return "...";

    if (valor === null || valor === undefined) {
      return "—";
    }

    return valor;
  }

  function obterTimestamp(valor) {
    if (!valor) return 0;

    let data;

    if (typeof valor?.toDate === "function") {
      data = valor.toDate();
    } else if (typeof valor === "string") {
      data = new Date(valor);
    } else {
      data = new Date(valor);
    }

    const timestamp = data.getTime();

    return Number.isNaN(timestamp) ? 0 : timestamp;
  }

  function formatarData(valor) {
    const timestamp = obterTimestamp(valor);

    if (!timestamp) {
      return "Data não informada";
    }

    return new Date(timestamp).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div className="dashboard">
      <header className="topbar">
        <div className="logo">
          <span>◆</span>
          Alfabits
        </div>

        <div className="topbar-actions">
          <span className="admin-name">
            {nomeUsuario}
          </span>

          <Button aria-label="Perfil do usuário">
            👤
          </Button>
        </div>
      </header>

      <main className="dashboard-content">
        <div className="dashboard-header">
          <div>
            <h1>Dashboard</h1>
            <p>Visão geral da plataforma</p>

            <span className="admin-welcome">
              Bem-vindo(a), {nomeUsuario}!
            </span>
          </div>

          <Button
            onClick={carregarDados}
            disabled={carregando}
          >
            {carregando
              ? "Atualizando..."
              : "↻ Atualizar dados"}
          </Button>
        </div>

        {!autenticado && (
          <p role="alert">
            Sua sessão não está autenticada.
          </p>
        )}

        {tipoPerfil && (
          <p className="admin-role">
            Perfil: {tipoPerfil}
          </p>
        )}

        {erro && (
          <div
            className="dashboard-error"
            role="alert"
          >
            <strong>
              Alguns dados não puderam ser carregados.
            </strong>

            <p>{erro}</p>
          </div>
        )}

        <section
          className="statistics"
          aria-label="Indicadores da plataforma"
        >
          {cards.map((card) => (
            <article
              className="stat-card"
              key={card.titulo}
            >
              <div
                className={`stat-icon ${card.classe}`}
                aria-hidden="true"
              >
                {card.icone}
              </div>

              <div>
                <span>{card.titulo}</span>
                <strong>
                  {exibirValor(card.valor)}
                </strong>
              </div>
            </article>
          ))}
        </section>

        <section
          className="activities"
          aria-labelledby="activities-title"
        >
          <div className="activities-header">
            <div>
              <h2 id="activities-title">
                Atividades recentes
              </h2>

              <p>
                Registros encontrados na plataforma
              </p>
            </div>

            <span className="activities-count">
              {carregando ? "..." : atividades.length}
            </span>
          </div>

          {carregando ? (
            <p>Carregando registros...</p>
          ) : atividadesPaginadas.length === 0 ? (
            <p>
              Nenhum registro disponível para exibição.
            </p>
          ) : (
            <div className="activities-list">
              {atividadesPaginadas.map((atividade) => (
                <article
                  className="activity"
                  key={atividade.id}
                >
                  <div
                    className={`activity-icon ${atividade.tipo}`}
                    aria-hidden="true"
                  >
                    {iconesAtividade[atividade.tipo]}
                  </div>

                  <div className="activity-info">
                    <strong>{atividade.titulo}</strong>

                    <span>{atividade.detalhe}</span>

                    <small>
                      {formatarData(atividade.data)}
                    </small>
                  </div>
                </article>
              ))}
            </div>
          )}

          {!carregando &&
            atividades.length > itensPorPagina && (
              <div
                className="pagination"
                aria-label="Paginação das atividades"
              >
                <Button
                  className="pagination-button"
                  disabled={paginaAtual === 1}
                  onClick={() =>
                    setPaginaAtual((pagina) =>
                      Math.max(1, pagina - 1)
                    )
                  }
                >
                  ← Anterior
                </Button>

                <span
                  className="pagination-info"
                  aria-live="polite"
                >
                  Página {paginaAtual} de {totalPaginas}
                </span>

                <Button
                  className="pagination-button"
                  disabled={paginaAtual === totalPaginas}
                  onClick={() =>
                    setPaginaAtual((pagina) =>
                      Math.min(totalPaginas, pagina + 1)
                    )
                  }
                >
                  Próxima →
                </Button>
              </div>
            )}

          <p className="activities-note">
            A lista reúne registros existentes.
          </p>
        </section>
      </main>

      <nav
        className="bottom-menu"
        aria-label="Navegação administrativa"
      >
        <Button className="menu-item active">
          <span>⌂</span>
          <small>Início</small>
        </Button>

        <Button
          className="menu-item"
          onClick={() => {
            window.location.href = "/cadastro";
          }}
        >
          <span>♙</span>
          <small>Cadastro</small>
        </Button>

        

        
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

export default HomeAdm;
