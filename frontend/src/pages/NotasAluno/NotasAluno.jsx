
import React, { useEffect, useState } from "react";
import { listarNotas } from "../../services/notaServices";
import "./NotasAluno.css";

function extrairLista(resposta, chave) {
  if (Array.isArray(resposta)) return resposta;
  if (Array.isArray(resposta?.[chave])) return resposta[chave];
  if (Array.isArray(resposta?.dados)) return resposta.dados;
  return [];
}

function formatarId(valor) {
  if (!valor) return "Não informado";
  return String(valor).split("/").pop();
}

export default function NotasAluno() {
  const [notas, setNotas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let ativo = true;

    async function carregarNotas() {
      try {
        setCarregando(true);
        setErro("");

        // O backend identifica o aluno pelo token de autenticação.
        const resposta = await listarNotas();
        const lista = extrairLista(resposta, "notas");

        if (ativo) {
          setNotas(lista);
        }
      } catch (error) {
        if (ativo) {
          setErro(
            error?.message ||
              "Não foi possível carregar suas notas. Tente novamente."
          );
        }
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    carregarNotas();

    return () => {
      ativo = false;
    };
  }, []);

  const totalNotas = notas.length;
  const somaPontos = notas.reduce(
    (total, nota) => total + (Number(nota.pontuacao) || 0),
    0
  );
  const somaMaxima = notas.reduce(
    (total, nota) => total + (Number(nota.pontuacaoMaxima) || 0),
    0
  );

  const percentual =
    somaMaxima > 0 ? Math.round((somaPontos / somaMaxima) * 100) : null;

  return (
    <main className="notas-aluno">
      <header className="notas-aluno__cabecalho">
        <div>
          <h1>Minhas notas</h1>
          <p>
            Consulte suas avaliações, pontuações e os comentários dos
            professores.
          </p>
        </div>
      </header>

      {!carregando && !erro && (
        <section className="notas-aluno__resumo" aria-label="Resumo das notas">
          <article className="notas-aluno__indicador">
            <span>Atividades corrigidas</span>
            <strong>{totalNotas}</strong>
          </article>

          <article className="notas-aluno__indicador">
            <span>Pontos conquistados</span>
            <strong>
              {somaPontos}
              {somaMaxima > 0 ? ` / ${somaMaxima}` : ""}
            </strong>
          </article>

          <article className="notas-aluno__indicador">
            <span>Desempenho geral</span>
            <strong>{percentual === null ? "—" : `${percentual}%`}</strong>
          </article>
        </section>
      )}

      {carregando && (
        <p className="notas-aluno__estado" role="status">
          Carregando suas notas...
        </p>
      )}

      {!carregando && erro && (
        <section className="notas-aluno__estado notas-aluno__estado--erro">
          <p role="alert">{erro}</p>
          <button
            type="button"
            className="notas-aluno__botao"
            onClick={() => window.location.reload()}
          >
            Tentar novamente
          </button>
        </section>
      )}

      {!carregando && !erro && notas.length === 0 && (
        <section className="notas-aluno__vazio">
          <h2>Nenhuma nota disponível</h2>
          <p>
            Suas notas aparecerão aqui depois que uma atividade for corrigida
            pelo professor.
          </p>
        </section>
      )}

      {!carregando && !erro && notas.length > 0 && (
        <section className="notas-aluno__lista" aria-label="Histórico de notas">
          {notas.map((nota, indice) => {
            const pontuacao = Number(nota.pontuacao) || 0;
            const maxima = Number(nota.pontuacaoMaxima) || 0;
            const aproveitamento =
              maxima > 0 ? Math.round((pontuacao / maxima) * 100) : null;

            return (
              <article
                className="notas-aluno__card"
                key={nota.id || nota.notaId || `${nota.atividadeId}-${indice}`}
              >
                <div className="notas-aluno__card-topo">
                  <div>
                    <h2>
                      {nota.titulo ||
                        nota.atividadeTitulo ||
                        `Atividade ${formatarId(nota.atividadeId)}`}
                    </h2>
                    <p className="notas-aluno__identificador">
                      Entrega: {formatarId(nota.entregaId)}
                    </p>
                  </div>

                  <span className="notas-aluno__status">Corrigida</span>
                </div>

                <div className="notas-aluno__pontuacao">
                  <strong>
                    {pontuacao} / {maxima || "—"}
                  </strong>
                  {aproveitamento !== null && (
                    <span>{aproveitamento}% de aproveitamento</span>
                  )}
                </div>

                {aproveitamento !== null && (
                  <div
                    className="notas-aluno__barra"
                    role="progressbar"
                    aria-label="Aproveitamento da atividade"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={aproveitamento}
                  >
                    <div
                      className="notas-aluno__barra-preenchimento"
                      style={{ width: `${aproveitamento}%` }}
                    />
                  </div>
                )}

                <div className="notas-aluno__feedback">
                  <h3>Feedback do professor</h3>
                  <p>
                    {nota.feedback?.trim()
                      ? nota.feedback
                      : "Nenhum comentário foi registrado nesta correção."}
                  </p>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
}
