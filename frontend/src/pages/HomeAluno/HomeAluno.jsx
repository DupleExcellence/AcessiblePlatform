import React, { useEffect, useState } from "react";
import "./HomeAluno.css";
import Button from "../../components/Button/Button";
import { useAuth } from "../../contexts/AuthContext";
import { buscarMinhaPosicao } from "../../services/rankingServices";
import { useNavigate } from "react-router-dom";


function HomeAluno() {
  const { perfil, tipoPerfil, autenticado, logout } = useAuth();

  const [dadosAluno, setDadosAluno] = useState(null);
  const [erroRanking, setErroRanking] = useState("");
  const navigate = useNavigate();

  const licoes = [
    {
      icon: "▣",
      titulo: "Introdução ao HTML",
      progresso: 80,
      classe: "verde",
    },
    {
      icon: "▤",
      titulo: "CSS na prática",
      progresso: 50,
      classe: "azul",
    },
    {
      icon: "</>",
      titulo: "JavaScript básico",
      progresso: 0,
      classe: "azul",
    },
  ];

  useEffect(() => {
    let ativo = true;

    async function carregarDados() {
      try {
        const dados = await buscarMinhaPosicao();

        if (ativo) {
          console.log("Dados reais do ranking:", dados);
          setDadosAluno(dados);
          setErroRanking("");
        }
      } catch (error) {
        console.error("Erro ao carregar pontuação e XP:", error);

        if (ativo) {
          setErroRanking("Não foi possível carregar os pontos.");
        }
      }
    }

    carregarDados();

    return () => {
      ativo = false;
    };
  }, []);

  const dados =
    dadosAluno?.aluno ??
    dadosAluno?.usuario ??
    dadosAluno;

  const pontuacao =
    dados?.pontuacaoTotal ??
    dados?.pontuacao ??
    dados?.pontos;

  const xp =
    dados?.xpTotal ??
    dados?.xp;

  console.log("Perfil:", perfil);
  console.log("Tipo normalizado:", tipoPerfil);
  console.log("Autenticado:", autenticado);

  return (
    <div className="home-aluno">
      <header className="home-header">
        <div className="logo-area">
          <div className="logo-icon">◆</div>
          <span>Aprender</span>
        </div>

        <div className="header-icons">
          <Button
            className="header-button"
            aria-label="Notificações"
          >
            🔔
          </Button>

          <Button
            className="profile-button"
            aria-label="Perfil"
          >
            👤
          </Button>
        </div>
      </header>

      <main className="home-content">
        <section className="welcome-section">
          <div className="avatar">👤</div>

          <div>
            <h1>Olá, {perfil?.nome ?? "aluno"}!</h1>
            <p>Continue firme nos seus objetivos!</p>
          </div>
        </section>

        <section className="summary-cards">
          <div className="summary-card green-card">
            <div className="summary-icon">▣</div>
            <div>
              <span>Lições</span>
              <strong>5/10</strong>
            </div>
          </div>

          <div className="summary-card blue-card">
            <div className="summary-icon">🏆</div>
            <div>
              <span>Pontuação</span>
              <strong>
                {pontuacao ?? (erroRanking ? "Indisponível" : "—")}
              </strong>
            </div>
          </div>

          <div className="summary-card purple-card">
            <div className="summary-icon">⭐</div>
            <div>
              <span>XP</span>
              <strong>
                {xp ?? (erroRanking ? "Indisponível" : "—")}
              </strong>
            </div>
          </div>

          <div className="summary-card purple-card">
            <div className="summary-icon">♣</div>
            <div>
              <span>Cursos</span>
              <strong>2</strong>
            </div>
          </div>
        </section>

        {erroRanking && (
          <p role="alert">{erroRanking}</p>
        )}

        <section className="lessons-section">
          <div className="section-title">
            <h2>Minhas lições</h2>

            <button className="view-all" type="button">
              Ver todas →
            </button>
          </div>

          <div className="lessons-list">
            {licoes.map((licao, index) => (
              <div className="lesson" key={index}>
                <div className={`lesson-icon ${licao.classe}`}>
                  {licao.icon}
                </div>

                <div className="lesson-content">
                  <div className="lesson-info">
                    <span>{licao.titulo}</span>
                    <strong>{licao.progresso}%</strong>
                  </div>

                  <div className="progress-background">
                    <div
                      className="progress-bar"
                      style={{
                        width: `${licao.progresso}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <nav className="bottom-navigation">
        <Button
          className="nav-item active"
          onClick={() => navigate("/homeAluno")}
        >
          <span>⌂</span>
          <small>Início</small>
        </Button>

        <Button
          className="nav-item"
          onClick={() => navigate("/licaoAluno")}
        >
          <span>▣</span>
          <small>Lições</small>
        </Button>

        <Button
          className="nav-item"
          onClick={() => navigate("/cursos")}
        >
          <span>▤</span>
          <small>Cursos</small>
        </Button>

        <Button
          className="nav-item"
          onClick={() => navigate("/ranking")}
        >
          <span>🏆</span>
          <small>Ranking</small>
        </Button>

        <Button
          className="nav-item"
          onClick={() => navigate("/perfilAluno")}
        >
          <span>👤</span>
          <small>Perfil</small>
        </Button>

        <button type="button" onClick={logout}>
          Sair da conta
        </button>
      </nav>
      
    </div>
  );
}

export default HomeAluno;