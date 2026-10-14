import React from "react";
import "../HomeAdm/HomeAdm.css"
import Button from "../../components/Button/Button";

function HomeAdm() {
  return (
    <div className="dashboard">

      {/* Barra superior */}
      <header className="topbar">
        <div className="logo">
          <span>◆</span>
          Aprender
        </div>

        <div className="topbar-actions">
          <Button aria-label="Notificações">🔔</Button>
          <Button aria-label="Perfil do usuário">●</Button>
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="dashboard-content">

        <div className="dashboard-header">
          <div>
            <h1>Dashboard</h1>
            <p>Visão geral da plataforma</p>
          </div>
        </div>

        <div className="dashboard-grid">

          {/* Indicadores */}
          <section className="statistics">

            <div className="stat-card">
              <div className="stat-icon aluno">
                ♙
              </div>

              <div>
                <span>Alunos</span>
                <strong>120</strong>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon professor">
                ♙
              </div>

              <div>
                <span>Professores</span>
                <strong>15</strong>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon curso">
                ▣
              </div>

              <div>
                <span>Cursos</span>
                <strong>8</strong>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon licao">
                ▤
              </div>

              <div>
                <span>Lições</span>
                <strong>32</strong>
              </div>
            </div>

          </section>

          {/* Atividades recentes */}
          <section className="activities">

            <h2>Atividades recentes</h2>

            <div className="activity">
              <div className="activity-icon">
                ♙
              </div>

              <div>
                <strong>Novo aluno cadastrado</strong>
                <span>João, 14:30</span>
              </div>
            </div>

            <div className="activity">
              <div className="activity-icon">
                ♙
              </div>

              <div>
                <strong>Nova lição criada</strong>
                <span>Hoje, 09:15</span>
              </div>
            </div>

            <div className="activity">
              <div className="activity-icon">
                ▣
              </div>

              <div>
                <strong>Novo curso criado</strong>
                <span>Ontem, 16:42</span>
              </div>
            </div>

            <div className="activity">
              <div className="activity-icon">
                ♙
              </div>

              <div>
                <strong>Professor atualizado</strong>
                <span>Ontem, 14:30</span>
              </div>
            </div>

          </section>

        </div>
      </main>

      {/* Menu inferior */}
      <nav className="bottom-menu">

        <Button className="menu-item active">
          <span>⌂</span>
          <small>Início</small>
        </Button>

        <Button className="menu-item">
          <span>◫</span>
          <small>Gerenciar</small>
        </Button>

        <Button className="menu-item">
          <span>▤</span>
          <small>Relatórios</small>
        </Button>

        <Button className="menu-item">
          <span>⚙</span>
          <small>Configurações</small>
        </Button>

      </nav>

    </div>
  );
}

export default HomeAdm;