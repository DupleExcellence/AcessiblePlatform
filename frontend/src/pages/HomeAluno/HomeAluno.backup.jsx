import React from "react";
import "./HomeAluno.css";
import Button from "../../components/Button/Button"
import { useAuth } from "../../contexts/AuthContext";
function HomeAluno() {
 const { perfil, tipoPerfil, autenticado } = useAuth();
 const { logout } = useAuth();
  console.log("Perfil:", perfil);
  console.log("Tipo normalizado:", tipoPerfil);
  console.log("Autenticado:", autenticado);
  const licoes = [
    {
      icon: "â–£",
      titulo: "IntroduÃ§Ã£o ao HTML",
      progresso: 80,
      classe: "verde",
    },
    {
      icon: "â–¤",
      titulo: "CSS na prÃ¡tica",
      progresso: 50,
      classe: "azul",
    },
    {
      icon: "</>",
      titulo: "JavaScript bÃ¡sico",
      progresso: 0,
      classe: "azul",
    },
  ];

  return (
    <div className="home-aluno">
      {/* CabeÃ§alho */}
      <header className="home-header">
        <div className="logo-area">
          <div className="logo-icon">â—†</div>
          <span>Aprender</span>
        </div>

        <div className="header-icons">
          <Button className="header-button" aria-label="NotificaÃ§Ãµes">
            ðŸ””
          </Button>

          <Button className="profile-button" aria-label="Perfil">
            ðŸ‘¤
          </Button>
        </div>
      </header>

      {/* ConteÃºdo */}
      <main className="home-content">

        {/* SaudaÃ§Ã£o */}
        <section className="welcome-section">
          <div className="avatar">
            ðŸ‘¤
          </div>

          <div>
            <h1>OlÃ¡, JoÃ£o!</h1>
            <p>Continue firme nos seus objetivos!</p>
          </div>
        </section>

        {/* Cards de resumo */}
        <section className="summary-cards">

          <div className="summary-card green-card">
            <div className="summary-icon">â–£</div>

            <div>
              <span>LiÃ§Ãµes</span>
              <strong>5/10</strong>
            </div>
          </div>

          <div className="summary-card blue-card">
            <div className="summary-icon">ðŸ†</div>

            <div>
              <span>Ranking/Pontos</span>
              <strong>320</strong>
            </div>
          </div>

          <div className="summary-card purple-card">
            <div className="summary-icon">â™§</div>

            <div>
              <span>Cursos</span>
              <strong>2</strong>
            </div>
          </div>

        </section>

        {/* Minhas liÃ§Ãµes */}
        <section className="lessons-section">

          <div className="section-title">
            <h2>Minhas liÃ§Ãµes</h2>

            <button className="view-all">
              Ver todas â†’
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
          <span>âŒ‚</span>
          <small>InÃ­cio</small>
        </Button>

        <Button className="nav-item">
          <span>â–£</span>
          <small>LiÃ§Ãµes</small>
        </Button>

        <Button className="nav-item">
          <span>â–¤</span>
          <small>Cursos</small>
        </Button>

        <Button className="nav-item">
          <span>ðŸ†</span>
          <small>Ranking</small>
        </Button>

        <Button className="nav-item">
          <span>ðŸ‘¤</span>
          <small>Perfil</small>
        </Button>
        <button onClick={logout}>
          Sair da conta
        </button>
      </nav>
    </div>

  );
}

export default HomeAluno;
