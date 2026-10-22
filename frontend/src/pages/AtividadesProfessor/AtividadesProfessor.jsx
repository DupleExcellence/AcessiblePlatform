
import React, { useEffect, useState } from "react";
import Button from "../../components/Button/Button.jsx";
import {
  listarAtividades,
  buscarAtividadePorId,
} from "../../services/atividadeServices.js";

function AtividadesProfessor() {
  const [atividades, setAtividades] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [atividadeSelecionada, setAtividadeSelecionada] = useState(null);
  const [carregandoDetalhes, setCarregandoDetalhes] = useState(false);

  async function carregarAtividades() {
    setCarregando(true);
    setErro("");

    try {
      const resultado = await listarAtividades();

      if (!Array.isArray(resultado)) {
        throw new Error(
          "A API não retornou uma lista válida de atividades."
        );
      }

      setAtividades(resultado);
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

  async function abrirDetalhes(id) {
  setCarregandoDetalhes(true);
  setErro("");
  console.log("Solicitando detalhes da atividade:", id);

  try {
    const resultado = await buscarAtividadePorId(id);
    console.log("Detalhes retornados pela API:", resultado);
    setAtividadeSelecionada(resultado);
  } catch (error) {
    console.error("Erro ao buscar detalhes da atividade:", error);

    setErro(
      error instanceof Error
        ? error.message
        : "Não foi possível carregar os detalhes da atividade."
    );
  } finally {
    setCarregandoDetalhes(false);
  }
  }

  useEffect(() => {
    carregarAtividades();
  }, []);

  return (
    <main className="criar-licao-container">
      <h1>Atividades</h1>
      <p>Consulte as atividades cadastradas.</p>

      <Button type="button" onClick={carregarAtividades}>
        Atualizar lista
      </Button>

      {carregando && (
        <p role="status">Carregando atividades...</p>
      )}

      {erro && (
        <div role="alert">
          <p>Não foi possível carregar as atividades.</p>
          <p>{erro}</p>
        </div>
      )}

      {!carregando && !erro && atividades.length === 0 && (
        <p>Nenhuma atividade cadastrada.</p>
      )}

      {!carregando && !erro && atividades.length > 0 && (
        <section aria-label="Lista de atividades">
          {atividades.map((atividade, indice) => (
            <article
              key={atividade.id ?? atividade._id ?? indice}
            >
              <h2>
                {atividade.titulo || `Atividade ${indice + 1}`}
              </h2>

              {atividade.descricao && (
                <p>{atividade.descricao}</p>
              )}

              {atividade.tipo && (
                <p>
                  <strong>Tipo:</strong> {atividade.tipo}
                </p>
              )}

              {atividade.pontuacaoMaxima != null && (
                <p>
                  <strong>Pontuação máxima:</strong>{" "}
                  {atividade.pontuacaoMaxima}
                </p>
              )}

              <Button
                    type="button"
                    onClick={() => abrirDetalhes(atividade.id)}
                >
                    Ver detalhes
              </Button>
            </article>
          ))}
        </section>
      )}

            {carregandoDetalhes && (
        <p role="status">Carregando detalhes da atividade...</p>
        )}

        {atividadeSelecionada && !carregandoDetalhes && (
        <section aria-label="Detalhes da atividade">
            <h2>Detalhes da atividade</h2>

            <p>
            <strong>Título:</strong>{" "}
            {atividadeSelecionada.titulo || "Não informado"}
            </p>

            <Button
                type="button"
                onClick={() => setAtividadeSelecionada(null)}
            >
                Fechar detalhes
            </Button>

            <p>
            <strong>Descrição:</strong>{" "}
            {atividadeSelecionada.descricao || "Não informada"}
            </p>

            <p>
            <strong>Tipo:</strong>{" "}
            {atividadeSelecionada.tipo || "Não informado"}
            </p>

            <p>
            <strong>Pontuação máxima:</strong>{" "}
            {atividadeSelecionada.pontuacaoMaxima ?? "Não informada"}
            </p>

            <p>
            <strong>ID:</strong> {atividadeSelecionada.id}
            </p>
        </section>
        )}
    </main>
  );
}

export default AtividadesProfessor;
