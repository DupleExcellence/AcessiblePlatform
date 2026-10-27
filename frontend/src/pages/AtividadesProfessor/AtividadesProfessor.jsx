
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Button from "../../components/Button/Button.jsx";

import {
  listarAtividades,
  buscarAtividadePorId,
} from "../../services/atividadeServices.js";

import { listarEntregas } from "../../services/entregaServices.js";
import { corrigirEntrega } from "../../services/notaServices.js";
import "./AtividadesProfessor.css";

const ATIVIDADES_POR_PAGINA = 5;

function extrairId(valor) {
  if (!valor) return "";
  return String(valor).split("/").filter(Boolean).pop() || "";
}

function formatarResposta(resposta) {
  if (resposta == null || resposta === "") {
    return "Resposta não informada.";
  }

  if (typeof resposta === "object") {
    return JSON.stringify(resposta, null, 2);
  }

  return String(resposta);
}

function AtividadesProfessor() {
  const [searchParams] = useSearchParams();

  const atividadeIdParam = searchParams.get("atividadeId");
  const visualizacaoParam = searchParams.get("visualizacao");

  const modoDetalhes =
    Boolean(atividadeIdParam) && visualizacaoParam === "detalhes";

  const modoEntregas =
    Boolean(atividadeIdParam) && visualizacaoParam === "entregas";

  const modoIndividual = modoDetalhes || modoEntregas;

  const [paginaAtual, setPaginaAtual] = useState(1);
  const [atividades, setAtividades] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");

  const [atividadeSelecionada, setAtividadeSelecionada] =
    useState(null);
  const [carregandoDetalhes, setCarregandoDetalhes] =
    useState(false);

  const [atividadeEntregas, setAtividadeEntregas] =
    useState(null);
  const [entregas, setEntregas] = useState([]);
  const [carregandoEntregas, setCarregandoEntregas] =
    useState(false);

  const [entregaSelecionada, setEntregaSelecionada] =
    useState(null);
  const [pontuacao, setPontuacao] = useState("");
  const [feedback, setFeedback] = useState("");
  const [salvandoCorrecao, setSalvandoCorrecao] =
    useState(false);

  // Lista completa somente na página principal.
  async function carregarAtividades() {
    if (modoIndividual) return;

    setCarregando(true);
    setErro("");
    setMensagem("");

    try {
      const resultado = await listarAtividades();

      if (!Array.isArray(resultado)) {
        throw new Error(
          "A API não retornou uma lista válida de atividades."
        );
      }

      setAtividades(resultado);
      setPaginaAtual(1);
    } catch (error) {
      console.error("Erro ao carregar atividades:", error);

      setErro(
        error instanceof Error
          ? error.message
          : "Não foi possível carregar as atividades."
      );
    } finally {
      setCarregando(false);
    }
  }

  // Busca uma atividade individual pelo ID.
  async function abrirDetalhes(id) {
    if (!id) {
      setErro("Não foi possível identificar a atividade.");
      return;
    }

    setCarregandoDetalhes(true);
    setErro("");
    setMensagem("");

    try {
      const resultado = await buscarAtividadePorId(extrairId(id));

      if (!resultado) {
        throw new Error("Atividade não encontrada.");
      }

      setAtividadeSelecionada(resultado);
    } catch (error) {
      console.error("Erro ao buscar detalhes:", error);

      setErro(
        error instanceof Error
          ? error.message
          : "Não foi possível carregar os detalhes."
      );
    } finally {
      setCarregandoDetalhes(false);
    }
  }

  // Carrega somente as entregas da atividade selecionada.
  async function carregarEntregas(atividade) {
    const atividadeId = extrairId(
      atividade?.id ?? atividade?._id
    );

    if (!atividadeId) {
      throw new Error(
        "Não foi possível identificar a atividade selecionada."
      );
    }

    setAtividadeEntregas(atividade);
    setEntregaSelecionada(null);
    setEntregas([]);
    setCarregandoEntregas(true);

    try {
      const resultado = await listarEntregas({ atividadeId });

      if (!Array.isArray(resultado)) {
        throw new Error(
          "A API não retornou uma lista válida de entregas."
        );
      }

      // Filtra novamente no frontend para exibir apenas
      // as entregas da atividade selecionada.
      const entregasFiltradas = resultado.filter(
        (entrega) =>
          extrairId(entrega.atividadeId) === atividadeId
      );

      setEntregas(entregasFiltradas);
    } finally {
      setCarregandoEntregas(false);
    }
  }

  async function abrirEntregas(atividade) {
    setErro("");
    setMensagem("");

    try {
      await carregarEntregas(atividade);
    } catch (error) {
      console.error("Erro ao carregar entregas:", error);

      setErro(
        error instanceof Error
          ? error.message
          : "Não foi possível carregar as entregas."
      );
    }
  }

  // Abre os detalhes ou as entregas em uma nova guia.
  function abrirEmNovaGuia(atividade, visualizacao) {
    const atividadeId = extrairId(
      atividade.id ?? atividade._id
    );

    if (!atividadeId) {
      setErro("Não foi possível identificar a atividade.");
      return;
    }

    const params = new URLSearchParams();
    params.set("atividadeId", atividadeId);
    params.set("visualizacao", visualizacao);

    const url =
      `${window.location.origin}${window.location.pathname}` +
      `?${params.toString()}`;

    window.open(url, "_blank", "noopener,noreferrer");
  }

  function iniciarCorrecao(entrega) {
    setErro("");
    setMensagem("");
    setEntregaSelecionada(entrega);
    setPontuacao("");
    setFeedback("");
  }

  async function salvarCorrecao(event) {
    event.preventDefault();

    if (!entregaSelecionada || !atividadeEntregas) return;

    const entregaId = extrairId(entregaSelecionada.id);
    const alunoId = extrairId(entregaSelecionada.alunoId);

    const atividadeId = extrairId(
      entregaSelecionada.atividadeId ??
      atividadeEntregas.id ??
      atividadeEntregas._id
    );

    const pontuacaoMaxima = Number(
      atividadeEntregas.pontuacaoMaxima
    );

    const notaInformada = Number(pontuacao);

    if (!entregaId || !alunoId || !atividadeId) {
      setErro(
        "Faltam dados para identificar a entrega, o aluno ou a atividade."
      );
      return;
    }

    if (
      !Number.isInteger(pontuacaoMaxima) ||
      pontuacaoMaxima <= 0
    ) {
      setErro(
        "A atividade não possui uma pontuação máxima válida."
      );
      return;
    }

    if (
      pontuacao.trim() === "" ||
      !Number.isInteger(notaInformada) ||
      notaInformada < 0 ||
      notaInformada > pontuacaoMaxima
    ) {
      setErro(
        `Informe uma pontuação inteira entre 0 e ${pontuacaoMaxima}.`
      );
      return;
    }

    setSalvandoCorrecao(true);
    setErro("");
    setMensagem("");

    try {
      await corrigirEntrega({
        entregaId,
        alunoId,
        atividadeId,
        pontuacao: notaInformada,
        pontuacaoMaxima,
        feedback: feedback.trim(),
      });

      setMensagem("Correção salva com sucesso!");

      // Atualiza somente as entregas da atividade aberta.
      await carregarEntregas(atividadeEntregas);
      setEntregaSelecionada(null);
    } catch (error) {
      console.error("Erro ao salvar correção:", error);

      setErro(
        error instanceof Error
          ? error.message
          : "Não foi possível salvar a correção."
      );
    } finally {
      setSalvandoCorrecao(false);
    }
  }

  // A página principal carrega a lista.
  // A nova guia carrega diretamente a atividade selecionada.
  useEffect(() => {
    if (modoIndividual) {
      setCarregando(false);
      return;
    }

    carregarAtividades();
  }, [modoIndividual]);

  useEffect(() => {
    if (!modoIndividual || !atividadeIdParam) return;

    let cancelado = false;

    async function carregarAtividadeIndividual() {
      setErro("");
      setMensagem("");
      setCarregandoDetalhes(true);

      try {
        const atividade = await buscarAtividadePorId(
          extrairId(atividadeIdParam)
        );

        if (cancelado) return;

        if (!atividade) {
          throw new Error("Atividade não encontrada.");
        }

        setAtividadeSelecionada(atividade);

        if (modoEntregas) {
          setAtividadeEntregas(atividade);
          setCarregandoEntregas(true);

          try {
            const resultado = await listarEntregas({
              atividadeId: extrairId(
                atividade.id ?? atividade._id
              ),
            });

            if (cancelado) return;

            if (!Array.isArray(resultado)) {
              throw new Error(
                "A API não retornou uma lista válida de entregas."
              );
            }

            const idSelecionado = extrairId(
              atividade.id ?? atividade._id
            );

            setEntregas(
              resultado.filter(
                (entrega) =>
                  extrairId(entrega.atividadeId) === idSelecionado
              )
            );
          } finally {
            if (!cancelado) setCarregandoEntregas(false);
          }
        }
      } catch (error) {
        if (!cancelado) {
          console.error(
            "Erro ao carregar atividade individual:",
            error
          );

          setErro(
            error instanceof Error
              ? error.message
              : "Não foi possível carregar a atividade."
          );
        }
      } finally {
        if (!cancelado) setCarregandoDetalhes(false);
      }
    }

    carregarAtividadeIndividual();

    return () => {
      cancelado = true;
    };
  }, [atividadeIdParam, modoIndividual, modoEntregas]);

  const totalPaginas = Math.max(
    1,
    Math.ceil(atividades.length / ATIVIDADES_POR_PAGINA)
  );

  const atividadesVisiveis = atividades.slice(
    (paginaAtual - 1) * ATIVIDADES_POR_PAGINA,
    paginaAtual * ATIVIDADES_POR_PAGINA
  );

  return (
    <main
      className={`criar-licao-container atividades-professor-container ${
      modoIndividual ? "atividade-individual-mode" : ""
    }`}
    >
      <h1>
        {modoDetalhes
          ? "Detalhes da atividade"
          : modoEntregas
            ? "Entregas da atividade"
            : "Atividades"}
      </h1>

      {!modoIndividual && (
        <>
          <p>
            Consulte atividades, respostas e correções dos alunos.
          </p>

          <Button type="button" onClick={carregarAtividades}>
            Atualizar lista
          </Button>
        </>
      )}

      {erro && (
        <div role="alert" aria-live="assertive">
          {erro}
        </div>
      )}

      {mensagem && (
        <p role="status" aria-live="polite">
          {mensagem}
        </p>
      )}

      {carregando && !modoIndividual && (
        <p role="status">Carregando atividades...</p>
      )}

      {carregandoDetalhes && (
        <p role="status">Carregando atividade...</p>
      )}

      {!modoIndividual &&
        !carregando &&
        atividades.length === 0 &&
        !erro && (
          <p>Nenhuma atividade cadastrada.</p>
        )}

      {/* Lista e paginação aparecem somente na página principal. */}
      {!modoIndividual &&
        !carregando &&
        atividades.length > 0 && (
          <>
            <section aria-label="Lista de atividades">
              {atividadesVisiveis.map((atividade, indice) => (
                <article
                  key={
                    atividade.id ??
                    atividade._id ??
                    indice
                  }
                  className="atividade-card"
                >
                  <h2>
                    {atividade.titulo ||
                      `Atividade ${
                        (paginaAtual - 1) *
                          ATIVIDADES_POR_PAGINA +
                        indice +
                        1
                      }`}
                  </h2>

                  {atividade.descricao && (
                    <p>{atividade.descricao}</p>
                  )}

                  {atividade.tipo && (
                    <p>
                      <strong>Tipo:</strong> {atividade.tipo}
                    </p>
                  )}

                  <p>
                    <strong>Pontuação máxima:</strong>{" "}
                    {atividade.pontuacaoMaxima ??
                      "Não informada"}
                  </p>

                  <Button
                    type="button"
                    onClick={() =>
                      abrirEmNovaGuia(atividade, "detalhes")
                    }
                  >
                    Ver detalhes
                  </Button>

                  <Button
                    type="button"
                    onClick={() =>
                      abrirEmNovaGuia(atividade, "entregas")
                    }
                  >
                    Ver entregas
                  </Button>
                </article>
              ))}
            </section>

            {totalPaginas > 1 && (
              <nav
                className="pagination"
                aria-label="Paginação das atividades"
              >
                <Button
                  type="button"
                  disabled={paginaAtual === 1}
                  onClick={() =>
                    setPaginaAtual((pagina) =>
                      Math.max(1, pagina - 1)
                    )
                  }
                >
                  Anterior
                </Button>

                <span aria-live="polite">
                  Página {paginaAtual} de {totalPaginas}
                </span>

                <Button
                  type="button"
                  disabled={paginaAtual === totalPaginas}
                  onClick={() =>
                    setPaginaAtual((pagina) =>
                      Math.min(totalPaginas, pagina + 1)
                    )
                  }
                >
                  Próxima
                </Button>
              </nav>
            )}
          </>
        )}

      {/* A guia de detalhes mostra apenas a atividade selecionada. */}
      {modoDetalhes &&
        atividadeSelecionada &&
        !carregandoDetalhes && (
          <section aria-label="Detalhes da atividade">
            <h2>
              {atividadeSelecionada.titulo ||
                "Atividade sem título"}
            </h2>

            <p>
              <strong>Descrição:</strong>{" "}
              {atividadeSelecionada.descricao ||
                "Não informada"}
            </p>

            <p>
              <strong>Tipo:</strong>{" "}
              {atividadeSelecionada.tipo || "Não informado"}
            </p>

            <p>
              <strong>Pontuação máxima:</strong>{" "}
              {atividadeSelecionada.pontuacaoMaxima ??
                "Não informada"}
            </p>

            {atividadeSelecionada.alternativas && (
              <div>
                <strong>Alternativas:</strong>
                <ul>
                  {atividadeSelecionada.alternativas.map(
                    (alternativa, indice) => (
                      <li
                        key={alternativa.id ?? indice}
                      >
                        {alternativa.texto ??
                          String(alternativa)}
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}
          </section>
        )}

      {/* A guia de entregas mostra somente a atividade selecionada. */}
      {modoEntregas &&
        atividadeEntregas &&
        !carregandoDetalhes && (
          <section aria-label="Entregas dos alunos">
            <h2>
              Entregas:{" "}
              {atividadeEntregas.titulo || "Atividade"}
            </h2>

            {carregandoEntregas && (
              <p role="status">Carregando entregas...</p>
            )}

            {!carregandoEntregas &&
              entregas.length === 0 &&
              !erro && (
                <p>
                  Nenhuma entrega encontrada para esta atividade.
                </p>
              )}

            {!carregandoEntregas &&
              entregas.map((entrega) => {
                const corrigida =
                  String(entrega.status || "").toLowerCase() ===
                  "corrigida";

                return (
                  <article key={entrega.id}>
                    <h3>
                      Entrega {extrairId(entrega.id)}
                    </h3>

                    <p>
                      <strong>Aluno:</strong>{" "}
                      {extrairId(entrega.alunoId) ||
                        "Não identificado"}
                    </p>

                    <p>
                      <strong>Status:</strong>{" "}
                      {entrega.status || "Não informado"}
                    </p>

                    <p>
                      <strong>Resposta:</strong>
                    </p>

                    <pre style={{ whiteSpace: "pre-wrap" }}>
                      {formatarResposta(entrega.resposta)}
                    </pre>

                    {corrigida ? (
                      <p>Esta entrega já foi corrigida.</p>
                    ) : (
                      <Button
                        type="button"
                        onClick={() => iniciarCorrecao(entrega)}
                      >
                        Corrigir
                      </Button>
                    )}
                  </article>
                );
              })}
          </section>
        )}

      {modoEntregas && entregaSelecionada && (
        <section aria-label="Formulário de correção">
          <h2>Corrigir entrega</h2>

          <p>
            <strong>Entrega:</strong>{" "}
            {extrairId(entregaSelecionada.id)}
          </p>

          <p>
            <strong>Resposta do aluno:</strong>
          </p>

          <pre style={{ whiteSpace: "pre-wrap" }}>
            {formatarResposta(entregaSelecionada.resposta)}
          </pre>

          <form onSubmit={salvarCorrecao}>
            <div className="form-group">
              <label htmlFor="pontuacao">Pontuação</label>

              <input
                id="pontuacao"
                name="pontuacao"
                type="number"
                min="0"
                max={atividadeEntregas?.pontuacaoMaxima}
                step="1"
                required
                value={pontuacao}
                onChange={(event) =>
                  setPontuacao(event.target.value)
                }
                disabled={salvandoCorrecao}
              />

              <p>
                Pontuação máxima:{" "}
                {atividadeEntregas?.pontuacaoMaxima ??
                  "Não informada"}
              </p>
            </div>

            <div className="form-group">
              <label htmlFor="feedback">
                Feedback (opcional)
              </label>

              <textarea
                id="feedback"
                name="feedback"
                rows={4}
                value={feedback}
                onChange={(event) =>
                  setFeedback(event.target.value)
                }
                disabled={salvandoCorrecao}
              />
            </div>

            <Button
              type="submit"
              disabled={salvandoCorrecao}
            >
              {salvandoCorrecao
                ? "Salvando correção..."
                : "Salvar correção"}
            </Button>

            <Button
              type="button"
              disabled={salvandoCorrecao}
              onClick={() => setEntregaSelecionada(null)}
            >
              Cancelar
            </Button>
          </form>
        </section>
      )}
    </main>
  );
}

export default AtividadesProfessor;
