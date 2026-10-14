import React from "react";
import "./HomeAluno.css";
import Button from "../../components/Button/Button"
function HomeAluno() {
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

  return (
    <div className="home-aluno">
      {/* Cabeçalho */}
      <header className="home-header">
        <div className="logo-area">
          <div className="logo-icon">◆</div>
          <span>Aprender</span>
        </div>

        <div className="header-icons">
          <Button className="header-button" aria-label="Notificações">
            🔔
          </Button>

          <Button className="profile-button" aria-label="Perfil">
            👤
          </Button>
        </div>
      </header>

      {/* Conteúdo */}
      <main className="home-content">

        {/* Saudação */}
        <section className="welcome-section">
          <div className="avatar">
            👤
          </div>

          <div>
            <h1>Olá, João!</h1>
            <p>Continue firme nos seus objetivos!</p>
          </div>
        </section>

        {/* Cards de resumo */}
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
              <span>Ranking/Pontos</span>
              <strong>320</strong>
            </div>
          </div>

          <div className="summary-card purple-card">
            <div className="summary-icon">♧</div>

            <div>
              <span>Cursos</span>
              <strong>2</strong>
            </div>
          </div>

        </section>

        {/* Minhas lições */}
        <section className="lessons-section">

          <div className="section-title">
            <h2>Minhas lições</h2>

            <button className="view-all">
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
                      style={{ width: `${licao.progresso}%` }}
                    />
                  </div>

                </div>

              </div>
            ))}

          </div>
        </section>

      </main>

      {/* Menu inferior */}
      <nav className="bottom-navigation">

        <Button className="nav-item active">
          <span>⌂</span>
          <small>Início</small>
        </Button>

        <Button className="nav-item">
          <span>▣</span>
          <small>Lições</small>
        </Button>

        <Button className="nav-item">
          <span>▤</span>
          <small>Cursos</small>
        </Button>

        <Button className="nav-item">
          <span>🏆</span>
          <small>Ranking</small>
        </Button>

        <Button className="nav-item">
          <span>👤</span>
          <small>Perfil</small>
        </Button>

      </nav>

    </div>
  );
}

export default HomeAluno;