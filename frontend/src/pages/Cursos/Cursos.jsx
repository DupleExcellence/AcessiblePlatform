
import React, { useEffect, useState } from "react";
import { buscarCursos } from "../../services/cursoServices";
import "./Cursos.css";

function Cursos() {
  const [cursos, setCursos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let ativo = true;

    async function carregarCursos() {
      try {
        setCarregando(true);
        setErro("");

        const resultado = await buscarCursos();

        if (ativo) {
          setCursos(resultado);
        }
      } catch (error) {
        if (ativo) {
          setErro(
            error.message || "Nao foi possivel carregar os cursos."
          );
        }
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }

    carregarCursos();

    return () => {
      ativo = false;
    };
  }, []);

  return (
    <main className="cursos-page">
      <header className="cursos-header">
        <div>
          <h1>Meus cursos</h1>
          <p className="cursos-subtitulo">
            Explore os cursos disponiveis e continue aprendendo.
          </p>
        </div>
      </header>

      {carregando && (
        <p className="cursos-status" role="status">
          Carregando cursos...
        </p>
      )}

      {!carregando && erro && (
        <section className="cursos-erro" role="alert">
          <p>{erro}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
          >
            Tentar novamente
          </button>
        </section>
      )}

      {!carregando && !erro && cursos.length === 0 && (
        <p className="cursos-vazio">
          Nenhum curso disponivel no momento.
        </p>
      )}

      {!carregando && !erro && cursos.length > 0 && (
        <section className="cursos-lista" aria-label="Cursos disponíveis">
          {cursos.map((curso) => (
            <article className="curso-card" key={curso.id}>
              <div className="curso-card-icon" aria-hidden="true">
                {"</>"}
              </div>

              <div className="curso-card-conteudo">
                <h2>{curso.titulo || "Curso sem titulo"}</h2>
                <p>
                  {curso.descricao || "Descricao nao disponivel."}
                </p>

                <span
                  className={`curso-status-badge ${
                    curso.ativo === false ? "inativo" : "ativo"
                  }`}
                >
                  {curso.ativo === false ? "Indisponivel" : "Disponivel"}
                </span>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

export default Cursos;
