
import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "../LicaoAluno/LicaoAluno.css";
import Button from "../Button/Button";
import {
  buscarLicoes,
  buscarLicaoPorId,
} from "../../services/licaoServices";

function LicaoAluno() {

  const [searchParams] = useSearchParams();
  const navegar = useNavigate();

  const cursoId = searchParams.get("cursoId");

  const [licoes, setLicoes] = useState([]);
  const [licaoSelecionada, setLicaoSelecionada] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
    

  useEffect(() => {
  async function carregarLicoes() {
    setCarregando(true);
    setErro("");

    try {
      const resultado = await buscarLicoes(cursoId);
      setLicoes(resultado);
    } catch (error) {
      console.error("Erro ao carregar lições:", error);
      setErro(error.message || "Não foi possível carregar as lições.");
    } finally {
      setCarregando(false);
    }
    const resultado = await buscarLicoes(cursoId);

      console.log("Curso selecionado:", cursoId);
      console.log("Lições recebidas:", resultado);
      console.log("Primeira lição:", resultado[0]);
      console.table(
        resultado.map((licao) => ({
          id: licao.id,
          titulo: licao.titulo,
          descricao: licao.descricao,
          cursoId: licao.cursoId,
        }))
      );

      setLicoes(resultado);
      }

    carregarLicoes();
    }, [cursoId]);

    async function abrirLicao(licao) {
      setErro("");

      console.log("Lição selecionada:", licao);

      try {
        const completa = await buscarLicaoPorId(licao.id);
        console.log("Conteúdo retornado pela API:", completa);
        setLicaoSelecionada(completa);
      } catch (error) {
        console.error("Erro ao abrir lição:", error);
        setErro(error.message || "Não foi possível abrir a lição.");
      }
    }

    return (
      
    <div className="lessons-page">
      <header className="topbar">
        <div className="topbar-left">
          <span className="home-icon" aria-hidden="true">
            ◆
          </span>
        </div>

        <div className="topbar-right">
          <div className="profile-avatar" aria-label="Perfil do aluno">
            
          </div>
        </div>
      </header>

      <main className="lessons-content">
        <h1 className="page-title">Lições do aluno</h1>

        <div className="content-grid">
          <section className="lessons-section">
            <h2>Lições disponíveis</h2>

            {carregando && (
              <p role="status">Carregando lições...</p>
            )}

            {!carregando && erro && (
              <section className="lessons-error" role="alert">
                <p>{erro}</p>
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                >
                  Tentar novamente
                </button>
              </section>
            )}

            {!carregando && !erro && licoes.length === 0 && (
              <p>
                Nenhuma lição encontrada para este curso.
              </p>
            )}

            {!carregando && !erro && licoes.length > 0 && (
              <div className="lessons-list">
                {licoes.map((licao) => (
                  <article className="lesson-card" key={licao.id}>
                    <div className="lesson-icon" aria-hidden="true">
                      {"</>"}
                    </div>

                    <div className="lesson-info">
                      <h3>{licao.titulo || "Lição sem título"}</h3>
                      <p>
                        {licao.descricao || "Sem descrição disponível."}
                      </p>
                    </div>

                     <button
                      type="button"
                      className="access-button"
                      onClick={() => abrirLicao(licao)}
                    >
                      Acessar
                    </button>
                  </article>
                ))}
              </div>
            )}

            {licaoSelecionada && (
              <section
                className="material-section"
                aria-labelledby="titulo-conteudo"
              >
                <h2 id="titulo-conteudo">
                  {licaoSelecionada.titulo}
                </h2>

                <div className="lesson-content">
                  {licaoSelecionada.conteudo ? (
                    <p style={{ whiteSpace: "pre-wrap" }}>
                      {licaoSelecionada.conteudo}
                    </p>
                  ) : (
                    <p>
                      Esta lição ainda não possui conteúdo cadastrado.
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setLicaoSelecionada(null)}
                >
                  Voltar à lista
                </button>
              </section>
            )}
          </section>

          <aside className="ranking-card">
            <h2>Ranking / Pontos</h2>

            <div className="trophy" aria-hidden="true">
              🏆
            </div>

            <p className="ranking-label">
              Pontuação demonstrativa
            </p>

            <strong className="points">
              Dados reais ainda não integrados
            </strong>

            <button
              type="button"
              className="ranking-button"
              onClick={() => navegar("/ranking")}
            >
              Ver ranking
            </button>
          </aside>
        </div>
      </main>

      <nav className="bottom-navigation" aria-label="Navegação principal">
        <Button className="nav-item" onClick={() => navegar("/homeAluno")}>
          <span aria-hidden="true">⌂</span>
          <small>Início</small>
        </Button>

        <Button
          className="nav-item active"
          onClick={() => navegar("/licaoAluno")}
        >
          <span aria-hidden="true">▣</span>
          <small>Lições</small>
        </Button>

        <Button className="nav-item" onClick={() => navegar("/cursos")}>
          <span aria-hidden="true">▤</span>
          <small>Cursos</small>
        </Button>

        <Button className="nav-item" onClick={() => navegar("/ranking")}>
          <span aria-hidden="true">🏆</span>
          <small>Ranking</small>
        </Button>

        <Button
          className="nav-item"
          onClick={() => navegar("/perfilAluno")}
        >
          <span aria-hidden="true">♙</span>
          <small>Perfil</small>
        </Button>
      </nav>
    </div>
  );
}

 export default LicaoAluno;
