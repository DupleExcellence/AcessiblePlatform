
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { buscarCursos } from "../../services/cursoServices";
import { useAuth } from "../../contexts/AuthContext";
import "./Cursos.css";

function Cursos() {
  const navegar = useNavigate();
  const [cursos, setCursos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const { tipoPerfil, loading } = useAuth();

  useEffect(() => {
    let ativo = true;

    async function carregarCursos() {
      try {
        setCarregando(true);
        setErro("");

        const resultado = await buscarCursos();

        if (ativo) {
          setCursos(
            Array.isArray(resultado)
              ? resultado
              : resultado?.cursos ?? []
          );
        }
      } catch (error) {
        if (ativo) {
          setErro(
            error.message ||
              "Não foi possível carregar os cursos."
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
            Explore os cursos disponíveis e continue aprendendo.
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
          Nenhum curso disponível no momento.
        </p>
      )}

      {!carregando && !erro && cursos.length > 0 && (
        <section
          className="cursos-lista"
          aria-label="Cursos disponíveis"
        >
          {cursos.map((curso) => (
            <article className="curso-card" key={curso.id}>
              <div className="curso-card-icon" aria-hidden="true">
                {"</>"}
              </div>

              <div className="curso-card-conteudo">
                <h2>{curso.titulo || "Curso sem título"}</h2>

                <p>
                  {curso.descricao ||
                    "Descrição não disponível."}
                </p>

                <span
                  className={`curso-status-badge ${
                    curso.ativo === false
                      ? "inativo"
                      : "ativo"
                  }`}
                >
                  {curso.ativo === false
                    ? "Indisponível"
                    : "Disponível"}
                </span>

                {!loading && tipoPerfil === "aluno" && (
                  <button
                    type="button"
                    disabled={curso.ativo === false}
                    onClick={() =>
                      navegar(
                        `/licaoAluno?cursoId=${encodeURIComponent(
                          curso.id
                        )}`
                      )
                    }
                  >
                    Ver lições
                  </button>
                )}
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

export default Cursos;
