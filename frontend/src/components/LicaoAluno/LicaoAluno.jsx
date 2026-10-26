
import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "../LicaoAluno/LicaoAluno.css";
import Button from "../Button/Button";

import {
  buscarLicoes,
  buscarLicaoPorId,
} from "../../services/licaoServices";

import { listarAtividades } from "../../services/atividadeServices";

import {
  listarEntregas,
  enviarEntrega,
} from "../../services/entregaServices";

import { listarNotas } from "../../services/notaServices";
import { buscarMinhaPosicao } from "../../services/rankingServices";

const LICOES_POR_PAGINA = 5;

function LicaoAluno() {
  const [searchParams] = useSearchParams();
  const navegar = useNavigate();

  const cursoId = searchParams.get("cursoId");
  const licaoIdParam = searchParams.get("licaoId");
  const modoResposta = Boolean(licaoIdParam);

  const [paginaAtual, setPaginaAtual] = useState(1);
  const [licoes, setLicoes] = useState([]);
  const [licaoSelecionada, setLicaoSelecionada] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const [atividades, setAtividades] = useState([]);
  const [entregas, setEntregas] = useState([]);
  const [notas, setNotas] = useState([]);
  const [respostas, setRespostas] = useState({});

  const [carregandoAtividades, setCarregandoAtividades] =
    useState(false);
  const [enviandoId, setEnviandoId] = useState(null);
  const [abrindoLicaoId, setAbrindoLicaoId] = useState(null);

  const [erroAtividades, setErroAtividades] = useState("");
  const [mensagemAtividades, setMensagemAtividades] = useState("");
  const [dadosRanking, setDadosRanking] = useState(null);
  const [erroRanking, setErroRanking] = useState("");

  function normalizarId(valor) {
    if (typeof valor !== "string") return "";
    return valor.split("/").pop();
  }

  function entregaDaAtividade(atividadeId) {
    return entregas.find(
      (entrega) =>
        normalizarId(entrega.atividadeId) ===
        normalizarId(atividadeId)
    );
  }

  function notaDaAtividade(atividadeId, entrega = null) {
    const entregaId = normalizarId(
      entrega?.id ?? entrega?.entregaId
    );

    if (entregaId) {
      const notaPorEntrega = notas.find(
        (nota) =>
          normalizarId(nota.entregaId) === entregaId
      );

      if (notaPorEntrega) return notaPorEntrega;
    }

    return notas.find(
      (nota) =>
        normalizarId(nota.atividadeId) ===
        normalizarId(atividadeId)
    );
  }

  async function carregarAtividades(licaoId) {
    if (!licaoId) {
      setErroAtividades("Não foi possível identificar a lição.");
      return;
    }

    setCarregandoAtividades(true);
    setErroAtividades("");
    setMensagemAtividades("");

    try {
      const resultados = await Promise.allSettled([
        listarAtividades(licaoId),
        listarEntregas(),
        listarNotas(),
      ]);

      const [
        resultadoAtividades,
        resultadoEntregas,
        resultadoNotas,
      ] = resultados;

      if (resultadoAtividades.status === "rejected") {
        throw resultadoAtividades.reason;
      }

      if (!Array.isArray(resultadoAtividades.value)) {
        throw new Error(
          "A API não retornou uma lista de atividades."
        );
      }

      const atividadesUnicas = [
        ...new Map(
          resultadoAtividades.value.map((atividade) => [
            normalizarId(atividade.id),
            atividade,
          ])
        ).values(),
      ];

      setAtividades(atividadesUnicas);

      if (resultadoEntregas.status === "fulfilled") {
        setEntregas(
          Array.isArray(resultadoEntregas.value)
            ? resultadoEntregas.value
            : []
        );
      } else {
        setEntregas([]);
        console.error(
          "Erro ao carregar entregas:",
          resultadoEntregas.reason
        );
      }

      if (resultadoNotas.status === "fulfilled") {
        setNotas(
          Array.isArray(resultadoNotas.value)
            ? resultadoNotas.value
            : []
        );
      } else {
        setNotas([]);
        console.error(
          "Erro ao carregar notas:",
          resultadoNotas.reason
        );
      }
    } catch (error) {
      console.error("Erro ao carregar atividades:", error);

      setErroAtividades(
        error?.message ||
          "Não foi possível carregar as atividades."
      );
    } finally {
      setCarregandoAtividades(false);
    }
  }

  // Na lista principal, carrega as lições do curso.
  // Na nova guia, não carrega a lista novamente.
  useEffect(() => {
    if (modoResposta) {
      setCarregando(false);
      return;
    }

    let cancelado = false;

    async function carregarListaLicoes() {
      setCarregando(true);
      setErro("");

      try {
        const resultado = await buscarLicoes(cursoId);

        if (cancelado) return;

        if (!Array.isArray(resultado)) {
          throw new Error(
            "A API não retornou uma lista de lições no formato esperado."
          );
        }

        setLicoes(resultado);
        setPaginaAtual(1);
      } catch (error) {
        if (cancelado) return;

        console.error("Erro ao carregar lições:", error);
        setErro(
          error?.message ||
            "Não foi possível carregar as lições."
        );
      } finally {
        if (!cancelado) setCarregando(false);
      }
    }

    carregarListaLicoes();

    return () => {
      cancelado = true;
    };
  }, [cursoId, modoResposta]);

  // Na nova guia, busca somente a lição indicada na URL.
  useEffect(() => {
    if (!licaoIdParam) return;

    let cancelado = false;

    async function carregarLicaoDireta() {
      setCarregando(true);
      setErro("");
      setLicaoSelecionada(null);

      try {
        const licao = await buscarLicaoPorId(licaoIdParam);

        if (cancelado) return;

        if (!licao) {
          throw new Error("Lição não encontrada.");
        }

        setLicaoSelecionada(licao);

        await carregarAtividades(
          licao.id || licaoIdParam
        );
      } catch (error) {
        if (!cancelado) {
          console.error("Erro ao abrir lição:", error);
          setErro(
            error?.message ||
              "Não foi possível abrir a lição."
          );
        }
      } finally {
        if (!cancelado) setCarregando(false);
      }
    }

    carregarLicaoDireta();

    return () => {
      cancelado = true;
    };
  }, [licaoIdParam]);

  // Abre a lição em uma nova guia sem alterar a lista atual.
  function abrirLicaoEmNovaGuia(licao) {
    const params = new URLSearchParams();

    if (cursoId) params.set("cursoId", cursoId);
    params.set("licaoId", licao.id);

    const url = `${window.location.origin}/licaoAluno?${params.toString()}`;

    window.open(url, "_blank", "noopener,noreferrer");
  }

  // Mantém a abertura dentro da página quando necessário.
  async function abrirLicao(licao) {
    if (abrindoLicaoId !== null) return;

    setAbrindoLicaoId(licao.id);
    setErro("");
    setErroAtividades("");
    setMensagemAtividades("");
    setLicaoSelecionada(null);
    setAtividades([]);
    setEntregas([]);
    setNotas([]);

    try {
      const completa = await buscarLicaoPorId(licao.id);

      setLicaoSelecionada(completa);

      await carregarAtividades(
        completa.id || licao.id
      );
    } catch (error) {
      console.error("Erro ao abrir lição:", error);
      setErro(
        error?.message || "Não foi possível abrir a lição."
      );
    } finally {
      setAbrindoLicaoId(null);
    }
  }

  async function enviarResposta(atividade) {
    const atividadeId = atividade.id;
    const resposta = respostas[atividadeId];

    const respostaVazia =
      resposta === undefined ||
      resposta === null ||
      resposta === "" ||
      (Array.isArray(resposta) && resposta.length === 0);

    if (respostaVazia) {
      setErroAtividades(
        "Responda à atividade antes de enviar."
      );
      return;
    }

    if (entregaDaAtividade(atividadeId)) {
      setErroAtividades(
        "Você já enviou uma resposta para esta atividade."
      );
      return;
    }

    setEnviandoId(atividadeId);
    setErroAtividades("");
    setMensagemAtividades("");

    try {
      await enviarEntrega({
        atividadeId,
        resposta,
      });

      setMensagemAtividades(
        `Resposta enviada: ${atividade.titulo}`
      );

      setRespostas((atuais) => ({
        ...atuais,
        [atividadeId]: "",
      }));

      if (licaoSelecionada?.id) {
        await carregarAtividades(licaoSelecionada.id);
      }
    } catch (error) {
      console.error("Erro ao enviar resposta:", error);

      setErroAtividades(
        error?.message ||
          "Não foi possível enviar sua resposta."
      );

      try {
        const atualizadas = await listarEntregas();

        if (Array.isArray(atualizadas)) {
          setEntregas(atualizadas);
        }
      } catch (erroAtualizacao) {
        console.error(
          "Erro ao atualizar entregas:",
          erroAtualizacao
        );
      }
    } finally {
      setEnviandoId(null);
    }
  }

  function voltarParaLista() {
    setLicaoSelecionada(null);
    setAtividades([]);
    setEntregas([]);
    setNotas([]);
    setRespostas({});
    setErroAtividades("");
    setMensagemAtividades("");
    setErro("");
  }

  // O ranking só é carregado na página principal.
  useEffect(() => {
    if (modoResposta) return;

    let ativo = true;

    async function carregarRanking() {
      try {
        setErroRanking("");

        const dados = await buscarMinhaPosicao();

        if (ativo) setDadosRanking(dados);
      } catch (error) {
        console.error("Erro ao carregar ranking:", error);

        if (ativo) {
          setErroRanking(
            "Não foi possível carregar o ranking."
          );
        }
      }
    }

    carregarRanking();

    return () => {
      ativo = false;
    };
  }, [modoResposta]);

  const totalPaginas = Math.max(
    1,
    Math.ceil(licoes.length / LICOES_POR_PAGINA)
  );

  const licoesVisiveis = licoes.slice(
    (paginaAtual - 1) * LICOES_POR_PAGINA,
    paginaAtual * LICOES_POR_PAGINA
  );

  return (
    <div
      className={`lessons-page ${
        modoResposta ? "clean-response-mode" : ""
      }`}
    >
      {!modoResposta && (
        <header className="topbar">
          <div className="topbar-left">
            <span className="home-icon" aria-hidden="true">
              ◆
            </span>
          </div>

          <div className="topbar-right">
            <div
              className="profile-avatar"
              aria-label="Perfil do aluno"
            />
          </div>
        </header>
      )}

      <main className="lessons-content">
        <h1 className="page-title">
          {modoResposta ? "Responder lição" : "Lições do aluno"}
        </h1>

        <div className="content-grid">
          <section className="lessons-section">
            {!modoResposta && <h2>Lições disponíveis</h2>}

            {carregando && (
              <p role="status">
                {modoResposta
                  ? "Carregando lição..."
                  : "Carregando lições..."}
              </p>
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

            {!modoResposta &&
              !carregando &&
              !erro &&
              licoes.length === 0 && (
                <p>Nenhuma lição encontrada para este curso.</p>
              )}

            {!modoResposta &&
              !carregando &&
              !erro &&
              licoes.length > 0 && (
                <>
                  <div className="lessons-list">
                    {licoesVisiveis.map((licao) => (
                      <article
                        className="lesson-card"
                        key={licao.id}
                      >
                        <div
                          className="lesson-icon"
                          aria-hidden="true"
                        >
                          {"</>"}
                        </div>

                        <div className="lesson-info">
                          <h3>
                            {licao.titulo || "Lição sem título"}
                          </h3>

                          <p>
                            {licao.descricao ||
                              "Sem descrição disponível."}
                          </p>
                        </div>

                        <button
                          type="button"
                          className="access-button"
                          onClick={() =>
                            abrirLicaoEmNovaGuia(licao)
                          }
                        >
                          Acessar
                        </button>
                      </article>
                    ))}
                  </div>

                  {totalPaginas > 1 && (
                    <nav
                      className="pagination"
                      aria-label="Paginação das lições"
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setPaginaAtual((pagina) =>
                            Math.max(1, pagina - 1)
                          )
                        }
                        disabled={paginaAtual === 1}
                      >
                        Anterior
                      </button>

                      <span aria-live="polite">
                        Página {paginaAtual} de {totalPaginas}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          setPaginaAtual((pagina) =>
                            Math.min(totalPaginas, pagina + 1)
                          )
                        }
                        disabled={paginaAtual === totalPaginas}
                      >
                        Próxima
                      </button>
                    </nav>
                  )}
                </>
              )}

            {licaoSelecionada && (
              <>
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
                        Esta lição ainda não possui conteúdo
                        cadastrado.
                      </p>
                    )}
                  </div>
                </section>

                <section
                  className="activities-section"
                  aria-labelledby="titulo-atividades"
                >
                  <h3 id="titulo-atividades">
                    Atividades da lição
                  </h3>

                  {carregandoAtividades && (
                    <p role="status">
                      Carregando atividades...
                    </p>
                  )}

                  {erroAtividades && (
                    <p role="alert">{erroAtividades}</p>
                  )}

                  {mensagemAtividades && (
                    <p role="status">
                      {mensagemAtividades}
                    </p>
                  )}

                  {!carregandoAtividades &&
                    !erroAtividades &&
                    atividades.length === 0 && (
                      <p>
                        Esta lição ainda não possui atividades.
                      </p>
                    )}

                  {!carregandoAtividades &&
                    atividades.map((atividade) => {
                      const entrega = entregaDaAtividade(
                        atividade.id
                      );

                      const nota = notaDaAtividade(
                        atividade.id,
                        entrega
                      );

                      const resposta =
                        respostas[atividade.id] ?? "";

                      const statusEntrega = String(
                        entrega?.status || "enviada"
                      ).toLowerCase();

                      return (
                        <article
                          className="activity-card"
                          key={atividade.id}
                        >
                          <h4>{atividade.titulo}</h4>
                          <p>{atividade.descricao}</p>

                          <p>
                            <strong>Tipo:</strong>{" "}
                            {atividade.tipo}
                          </p>

                          <p>
                            <strong>Pontuação máxima:</strong>{" "}
                            {atividade.pontuacaoMaxima}
                          </p>

                          {entrega ? (
                            <div>
                              <p role="status">
                                Resposta enviada. Status:{" "}
                                {entrega.status || "enviada"}.
                              </p>

                              {nota ? (
                                <div>
                                  <p>
                                    <strong>Nota:</strong>{" "}
                                    {nota.pontuacao} /{" "}
                                    {nota.pontuacaoMaxima}
                                  </p>

                                  {nota.feedback && (
                                    <p>
                                      <strong>Feedback:</strong>{" "}
                                      {nota.feedback}
                                    </p>
                                  )}
                                </div>
                              ) : statusEntrega === "corrigida" ? (
                                <p role="status">
                                  Entrega corrigida, mas a nota
                                  não foi localizada. Clique em
                                  "Atualizar atividades e notas"
                                  para tentar novamente.
                                </p>
                              ) : (
                                <p role="status">
                                  Aguardando correção do professor.
                                </p>
                              )}
                            </div>
                          ) : (
                            <form
                              onSubmit={(event) => {
                                event.preventDefault();
                                enviarResposta(atividade);
                              }}
                            >
                              {atividade.tipo ===
                                "multipla_escolha" && (
                                <fieldset>
                                  <legend>
                                    Selecione uma alternativa
                                  </legend>

                                  {(atividade.alternativas || []).map(
                                    (alternativa, index) => {
                                      const valor =
                                        alternativa.id ??
                                        alternativa.texto;

                                      return (
                                        <label
                                          key={
                                            alternativa.id ?? index
                                          }
                                          className="activity-option"
                                        >
                                          <input
                                            type="radio"
                                            name={`atividade-${atividade.id}`}
                                            value={valor}
                                            checked={resposta === valor}
                                            onChange={(event) =>
                                              setRespostas(
                                                (atuais) => ({
                                                  ...atuais,
                                                  [atividade.id]:
                                                    event.target.value,
                                                })
                                              )
                                            }
                                            disabled={
                                              enviandoId ===
                                              atividade.id
                                            }
                                            required
                                          />

                                          {alternativa.texto ??
                                            String(alternativa)}
                                        </label>
                                      );
                                    }
                                  )}
                                </fieldset>
                              )}

                              {atividade.tipo ===
                                "verdadeiro_falso" && (
                                <fieldset>
                                  <legend>
                                    Escolha uma resposta
                                  </legend>

                                  {["verdadeiro", "falso"].map(
                                    (opcao) => (
                                      <label
                                        key={opcao}
                                        className="activity-option"
                                      >
                                        <input
                                          type="radio"
                                          name={`atividade-${atividade.id}`}
                                          value={opcao}
                                          checked={resposta === opcao}
                                          onChange={(event) =>
                                            setRespostas((atuais) => ({
                                              ...atuais,
                                              [atividade.id]:
                                                event.target.value,
                                            }))
                                          }
                                          disabled={
                                            enviandoId ===
                                            atividade.id
                                          }
                                          required
                                        />

                                        {opcao === "verdadeiro"
                                          ? "Verdadeiro"
                                          : "Falso"}
                                      </label>
                                    )
                                  )}
                                </fieldset>
                              )}

                              {atividade.tipo ===
                                "resposta_aberta" && (
                                <label>
                                  Sua resposta

                                  <textarea
                                    value={resposta}
                                    onChange={(event) =>
                                      setRespostas((atuais) => ({
                                        ...atuais,
                                        [atividade.id]:
                                          event.target.value,
                                      }))
                                    }
                                    rows={4}
                                    required
                                    disabled={
                                      enviandoId === atividade.id
                                    }
                                  />
                                </label>
                              )}

                              <button
                                type="submit"
                                disabled={
                                  enviandoId === atividade.id
                                }
                              >
                                {enviandoId === atividade.id
                                  ? "Enviando..."
                                  : "Enviar resposta"}
                              </button>
                            </form>
                          )}
                        </article>
                      );
                    })}

                  <button
                    type="button"
                    onClick={() =>
                      carregarAtividades(licaoSelecionada.id)
                    }
                    disabled={carregandoAtividades}
                  >
                    {carregandoAtividades
                      ? "Atualizando..."
                      : "Atualizar atividades e notas"}
                  </button>
                </section>

                {!modoResposta && (
                  <button
                    type="button"
                    onClick={voltarParaLista}
                  >
                    Voltar à lista
                  </button>
                )}
              </>
            )}
          </section>

          {!modoResposta && (
            <aside className="ranking-card">
              <h2>Ranking / Pontos</h2>

              <div className="trophy" aria-hidden="true">
                🏆
              </div>

              {erroRanking ? (
                <p role="alert">{erroRanking}</p>
              ) : dadosRanking ? (
                <>
                  <p className="ranking-label">Minha posição</p>
                  <strong className="points">
                    {dadosRanking.posicao ?? "—"}º lugar
                  </strong>

                  <p className="ranking-label">XP acumulado</p>
                  <strong className="points">
                    {dadosRanking.xpTotal ?? 0} XP
                  </strong>

                  <p>
                    Total de alunos:{" "}
                    {dadosRanking.totalAlunos ?? "—"}
                  </p>
                </>
              ) : (
                <p role="status">Carregando ranking...</p>
              )}

              <button
                type="button"
                className="ranking-button"
                onClick={() => navegar("/ranking")}
              >
                Ver ranking
              </button>
            </aside>
          )}
        </div>
      </main>

      {!modoResposta && (
        <nav
          className="bottom-navigation"
          aria-label="Navegação principal"
        >
          <Button
            className="nav-item"
            onClick={() => navegar("/homeAluno")}
          >
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

          <Button
            className="nav-item"
            onClick={() => navegar("/cursos")}
          >
            <span aria-hidden="true">▤</span>
            <small>Cursos</small>
          </Button>

          <Button
            className="nav-item"
            onClick={() => navegar("/ranking")}
          >
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
      )}
    </div>
  );
}

export default LicaoAluno;
