
import React from "react";
import "./HomeProfessor.css";
import { useAuth } from "../../contexts/AuthContext";

function HomeProfessor() {
  const { perfil, tipoPerfil, autenticado } = useAuth();
         const { logout } = useAuth();
          console.log("Perfil:", perfil);
          console.log("Tipo normalizado:", tipoPerfil);
          console.log("Autenticado:", autenticado);
  return (
    <div className="professor-page">
      {/* HEADER */}
      <header className="top-header">
        <div className="logo">
          <span className="logo-icon">◆</span>
          <span>Aprender</span>
        </div>

        <div className="header-actions">
          <button  className="icon-button" aria-label="Notificações">
            🔔
          </button>

          <button className="profile-button" aria-label="Perfil">
            <a href="/PerfilProfessor"/>
            👤
          </button>
        </div>
      </header>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="main-content">

        {/* SAUDAÇÃO */}
        <section className="welcome">
          <div className="avatar">
            👤
          </div>

          <div>
            <h1>Olá, Maria!</h1>
            <p>Aqui está o que você precisa hoje.</p>
          </div>
        </section>

        {/* DASHBOARD */}
        <div className="dashboard">

          {/* CARDS */}
          <section className="cards">

            <div className="dashboard-card orange">
              <div className="card-icon">♧</div>

              <p>Lições a corrigir</p>

              <strong>8</strong>

              <a href="/licoes">
                Ver todas →
              </a>
            </div>

            <div className="dashboard-card blue">
              <div className="card-icon">♧</div>

              <p>Cursos lecionando</p>

              <strong>4</strong>

              <a href="#">
                Ver todos →
              </a>
            </div>

            <div className="dashboard-card purple">
              <div className="card-icon">♟</div>

              <p>Alunos</p>

              <strong>45</strong>

              <a href="/alunos">
                Ver todos →
              </a>
            </div>

          </section>

          {/* RANKING */}
          <section className="ranking">

            <h2>Ranking de alunos</h2>

            <div className="ranking-item">
              <span className="position">1</span>

              <div className="student-avatar">
                👨🏻
              </div>

              <span className="student-name">
                Lucas Silva
              </span>

              <strong>980</strong>
            </div>

            <div className="ranking-item">
              <span className="position">2</span>

              <div className="student-avatar">
                👩🏻
              </div>

              <span className="student-name">
                Ana Costa
              </span>

              <strong>870</strong>
            </div>

            <div className="ranking-item">
              <span className="position">3</span>

              <div className="student-avatar">
                👨🏻
              </div>

              <span className="student-name">
                Felipe Souza
              </span>

              <strong>760</strong>
            </div>

          </section>

        </div>
      </main>

      {/* MENU INFERIOR */}
      <nav className="bottom-menu" aria-label="Menu principal">

        <a href="/HomeProfessor" className="menu-item active">
          <span>⌂</span>
          <small>Início</small>
        </a>

        <a href="/licaoProfessor" className="menu-item">
          <span>▣</span>
          <small>Lições</small>
        </a>

        <a href="/cursos" className="menu-item">
          <span>▤</span>
          <small>Cursos</small>
        </a>

        <a href="/Alunos" className="menu-item">
          <span>♟</span>
          <small>Alunos</small>
        </a>

        <a href="/ranking" className="menu-item">
          <span>🏆</span>
          <small>Ranking</small>
        </a>

        <a href="/perfil" className="menu-item">
          <span>♙</span>
          <small>Perfil</small>
        </a>

        <a href="/configuracoes" className="menu-item">
          <span>⚙</span>
          <small>Configurações</small>
        </a>
        <button onClick={logout}>
          Sair da conta
        </button>
      </nav>

    </div>
  );
}

export default HomeProfessor;