
import "../LicaoAluno/LicaoAluno.css";

function LicaoAluno() {
  const lessons = [
    {
      icon: "▣",
      title: "Introdução ao HTML",
      subtitle: "Curso: Desenvolvimento Web",
      progress: 80,
    },
    {
      icon: "▤",
      title: "CSS na prática",
      subtitle: "Curso: Desenvolvimento Web",
      progress: 50,
    },
    {
      icon: "▣",
      title: "JavaScript básico",
      subtitle: "Curso: Programação",
      progress: 0,
    },
  ];

  return (
    <div className="lessons-page">

      {/* Barra superior */}
      <header className="topbar">
        <div className="topbar-left">
          <span className="home-icon">◆</span>
          <span className="system-name">Aprender</span>
        </div>

        <div className="topbar-right">
          <button
            className="notification-button"
            aria-label="Notificações"
          >
            🔔
          </button>

          <div className="profile-avatar" aria-label="Perfil">
            V
          </div>
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="lessons-content">

        {/* Título */}
        <h1 className="page-title">6. Lições (Aluno)</h1>

        <div className="content-grid">

          {/* Coluna principal */}
          <section className="lessons-section">

            <h2>Lições</h2>

            {/* Lista de lições */}
            <div className="lessons-list">

              {lessons.map((lesson, index) => (
                <article className="lesson-card" key={index}>

                  <div className="lesson-icon">
                    {lesson.icon}
                  </div>

                  <div className="lesson-info">
                    <h3>{lesson.title}</h3>

                    <p>{lesson.subtitle}</p>

                    <div className="progress-row">
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{
                            width: `${lesson.progress}%`,
                          }}
                        />
                      </div>

                      <span className="progress-value">
                        {lesson.progress}%
                      </span>
                    </div>
                  </div>

                  <button className="access-button">
                    Acessar
                  </button>

                </article>
              ))}

            </div>

            {/* Material da lição */}
            <section className="material-section">

              <h3>Material da lição</h3>

              <div className="material-file">

                <div className="file-icon">
                  PDF
                </div>

                <div className="file-info">
                  <strong>exemplo.pdf</strong>
                  <span>2,4 KB</span>
                </div>

                <button
                  className="download-button"
                  aria-label="Baixar material"
                >
                  ↓
                </button>

              </div>

            </section>

            {/* Resposta */}
            <section className="answer-section">

              <h3>Sua resposta</h3>

              <textarea
                className="answer-input"
                placeholder="Digite sua resposta..."
                aria-label="Digite sua resposta"
              />

              <div className="answer-actions">
                <button className="send-button">
                  Enviar
                </button>
              </div>

            </section>

          </section>

          {/* Ranking */}
          <aside className="ranking-card">

            <h2>Ranking / Pontos</h2>

            <div className="trophy">
              🏆
            </div>

            <p className="ranking-label">
              Sua pontuação
            </p>

            <strong className="points">
              320 pontos
            </strong>

            <button className="ranking-button">
              Ver ranking
            </button>

          </aside>

        </div>
      </main>
    </div>
  );
}

export default LiçãoAluno;
