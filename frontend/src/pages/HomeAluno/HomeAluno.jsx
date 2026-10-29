
import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "./HomeAluno.css";
import Button from "../../components/Button/Button";
import { useAuth } from "../../contexts/AuthContext";

import { buscarCursos } from "../../services/cursoServices";
import { buscarMinhaPosicao } from "../../services/rankingServices";
import { buscarLicoes } from "../../services/licaoServices";

function HomeAluno() {
  const { perfil, tipoPerfil, autenticado, logout } = useAuth();
  const navigate = useNavigate();

  const [cursos, setCursos] = useState([]);
  const [licoes, setLicoes] = useState([]);
  const [ranking, setRanking] = useState(null);

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [erroLogout, setErroLogout] = useState("");

  const nomeAluno =
    perfil?.nome ||
    perfil?.nomeCompleto ||
    perfil?.displayName ||
    perfil?.usuario?.nome ||
    "Estudante";

  const primeiroNome = nomeAluno.trim().split(/\s+/)[0];

  const carregarDashboard = useCallback(async () => {
    setCarregando(true);
    setErro("");

    try {
      const resultados = await Promise.allSettled([
        buscarCursos(),
        buscarLicoes(),
        buscarMinhaPosicao(),
      ]);

      const [resultadoCursos, resultadoLicoes, resultadoRanking] =
        resultados;

      if (resultadoCursos.status === "fulfilled") {
        const dados = resultadoCursos.value;

        setCursos(
          Array.isArray(dados)
            ? dados
            : dados?.cursos || []
        );
      } else {
        setCursos([]);
        console.error("Erro ao carregar cursos:", resultadoCursos.reason);
      }

      if (resultadoLicoes.status === "fulfilled") {
        const dados = resultadoLicoes.value;

        setLicoes(
          Array.isArray(dados)
            ? dados
            : dados?.licoes || dados?.lições || []
        );
      } else {
        setLicoes([]);
        console.error("Erro ao carregar lições:", resultadoLicoes.reason);
      }

      if (resultadoRanking.status === "fulfilled") {
        setRanking(resultadoRanking.value);
      } else {
        setRanking(null);
        console.error("Erro ao carregar ranking:", resultadoRanking.reason);
      }

      if (resultados.every((resultado) => resultado.status === "rejected")) {
        setErro("Não foi possível carregar os dados do dashboard.");
      }
    } catch (error) {
      console.error("Erro ao carregar dashboard:", error);
      setErro("Ocorreu um erro ao carregar suas informações.");
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregarDashboard();
  }, [carregarDashboard]);

  async function handleLogout() {
    setErroLogout("");

    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Erro ao sair da conta:", error);
      setErroLogout("Não foi possível encerrar a sessão.");
    }
  }

  const pontuacao =
    ranking?.xpTotal ??
    ranking?.pontuacaoTotal ??
    ranking?.pontuacao ??
    ranking?.pontos ??
    ranking?.xp ??
    null;

  const posicao = ranking?.posicao ?? ranking?.posicaoRanking ?? null;

  const cursosAtivos = cursos.filter(
    (curso) => curso.ativo !== false
  );

  const licoesAtivas = licoes.filter(
    (licao) => licao.ativa !== false
  );

  const licoesRecentes = licoesAtivas.slice(0, 3);

  if (!autenticado) {
    return (
      <main className="home-aluno estado-acesso">
        <section className="estado-card">
          <span className="estado-icon" aria-hidden="true">🔐</span>
          <h1>Entre na sua conta</h1>
          <p>Faça login para acessar seu aprendizado.</p>
          <Button
            type="button"
            className="primary-button"
            onClick={() => navigate("/login")}
          >
            Ir para o login
          </Button>
        </section>
      </main>
    );
  }

  return (
    <div className="home-aluno">
      <header className="home-header">
        <Link to="/homeAluno" className="logo-area" aria-label="Alfabits, início">
          
         
        </Link>

        <div className="header-icons">

          <Link
            to="/perfilAluno"
            className="profile-button"
            aria-label="Meu perfil"
            title="Meu perfil"
          >
            👤
          </Link>
        </div>
      </header>

      <main className="home-content">
        <section className="welcome-section">
          <div className="avatar" aria-hidden="true">
            <p>👤</p>
          </div>

          <div className="welcome-text">
            <h1>Olá, {primeiroNome}!</h1>
            
          </div>
        </section>

        {erro && (
          <div className="dashboard-alert" role="alert">
            <span>{erro}</span>
            <Button
              type="button"
              className="retry-button"
              onClick={carregarDashboard}
            >
              Tentar novamente
            </Button>
          </div>
        )}

        {erroLogout && (
          <p className="dashboard-alert" role="alert">
            {erroLogout}
          </p>
        )}

        <section className="summary-cards" aria-label="Resumo do aprendizado">
          <article className="summary-card green-card">
            <div className="summary-icon" aria-hidden="true">▤</div>
            <div className="summary-info">
              <span>Lições disponíveis</span>
              <strong>
                {carregando ? "…" : licoesAtivas.length}
              </strong>
              
            </div>
          </article>

          <article className="summary-card blue-card">
            <div className="summary-icon" aria-hidden="true">🏆</div>
            <div className="summary-info">
              <span>Minha pontuação</span>
              <strong>
                {carregando ? "…" : pontuacao ?? "—"}
              </strong>
              <small>
                {posicao != null
                  ? `${posicao}º lugar no ranking`
                  : "Consulte sua classificação"}
              </small>
            </div>
          </article>

          <article className="summary-card purple-card">
            <div className="summary-icon" aria-hidden="true">▣</div>
            <div className="summary-info">
              <span>Cursos disponíveis</span>
              <strong>
                {carregando ? "…" : cursosAtivos.length}
              </strong>
              
            </div>
          </article>
        </section>

        <section className="lessons-section">
          <div className="section-title">
            <div>
              
              <h2>Minhas lições</h2>
            </div>

            <Link to="/licaoAluno" className="view-all">
              Ver todas <span aria-hidden="true">→</span>
            </Link>
          </div>

          {carregando ? (
            <div className="dashboard-state" role="status">
              Carregando suas lições...
            </div>
          ) : licoesRecentes.length > 0 ? (
            <div className="lessons-list">
              {licoesRecentes.map((licao, index) => (
                <article
                  className="lesson"
                  key={licao.id || index}
                >
                  <div
                    className={`lesson-icon ${index % 2 === 0 ? "verde" : "azul"}`}
                    aria-hidden="true"
                  >
                    {index + 1}
                  </div>

                  <div className="lesson-content">
                    <div className="lesson-info">
                      <h3>{licao.titulo || "Lição sem título"}</h3>
                      <span className="lesson-status">
                        Disponível
                      </span>
                    </div>

                    {licao.descricao && (
                      <p className="lesson-description">
                        {licao.descricao}
                      </p>
                    )}

                    <div className="lesson-actions">
                      <Button
                        type="button"
                        className="lesson-button"
                        onClick={() => {
                          const cursoId =
                            typeof licao.cursoId === "string"
                              ? licao.cursoId
                              : licao.cursoId?.id;

                          const destino = cursoId
                            ? `/licaoAluno?cursoId=${encodeURIComponent(cursoId)}`
                            : "/licaoAluno";

                          navigate(destino);
                        }}
                      >
                        Acessar lições
                        <span aria-hidden="true"> →</span>
                      </Button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="dashboard-state empty-state">
              <span aria-hidden="true">📚</span>
              <h3>Nenhuma lição disponível</h3>
              
              <Link to="/cursos" className="empty-state-link">
                Explorar cursos
              </Link>
            </div>
          )}
        </section>

       
          
           

       
      </main>

      
      <nav className="bottom-navigation" aria-label="Menu principal">
        <Link
          to="/homeAluno"
          className="nav-item active"
          aria-current="page"
        >
          <span aria-hidden="true">⌂</span>
          <small>Início</small>
        </Link>

        <Link to="/licaoAluno" className="nav-item">
          <span aria-hidden="true">▤</span>
          <small>Lições</small>
        </Link>

        <Link to="/cursos" className="nav-item">
          <span aria-hidden="true">▣</span>
          <small>Cursos</small>
        </Link>

        <Link to="/notasAluno" className="nav-item">
          <span aria-hidden="true">📝</span>
          <small>Notas</small>
        </Link>

        <Link to="/progressoAluno" className="nav-item">
          <span aria-hidden="true">📈</span>
          <small>Progresso</small>
        </Link>

        <Link to="/ranking" className="nav-item">
          <span aria-hidden="true">🏆</span>
          <small>Ranking</small>
        </Link>

        <Link to="/perfilAluno" className="nav-item">
          <span aria-hidden="true">👤</span>
          <small>Perfil</small>
        </Link>

        <button
          type="button"
          className="nav-item logout-item"
          onClick={handleLogout}
        >
          <span aria-hidden="true">↪</span>
          <small>Sair</small>
        </button>
      </nav>

    </div>
  );
}

export default HomeAluno;
