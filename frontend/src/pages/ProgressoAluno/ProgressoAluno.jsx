
import React, { useEffect, useState } from "react";
import { listarEntregas } from "../../services/entregaServices";
import { listarNotas } from "../../services/notaServices";
import "./ProgressoAluno.css";

function extrairLista(resposta, chave) {
  if (Array.isArray(resposta)) return resposta;
  if (Array.isArray(resposta?.[chave])) return resposta[chave];
  if (Array.isArray(resposta?.dados)) return resposta.dados;
  return [];
}

function normalizarId(valor) {
  if (!valor) return "";
  return String(valor).split("/").pop();
}

export default function ProgressoAluno() {
  const [entregas, setEntregas] = useState([]);
  const [notas, setNotas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let ativo = true;

    async function carregarProgresso() {
      try {
        setCarregando(true);
        setErro("");

        // O backend filtra os registros pelo aluno autenticado.
        const [respostaEntregas, respostaNotas] = await Promise.all([
          listarEntregas(),
          listarNotas(),
        ]);

        if (!ativo) return;

        setEntregas(extrairLista(respostaEntregas, "entregas"));
        setNotas(extrairLista(respostaNotas, "notas"));
      } catch (error) {
        if (ativo) {
          setErro(
            error?.message ||
              "Não foi possível carregar seu progresso. Tente novamente."
          );
        }
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    carregarProgresso();

    return () => {
      ativo = false;
    };
  }, []);

  const idsEntregasCorrigidas = new Set(
    notas.map((nota) => normalizarId(nota.entregaId)).filter(Boolean)
  );

  const entregasCorrigidas = entregas.filter((entrega) => {
    const id = normalizarId(entrega.id || entrega.entregaId);

    return (
      entrega.status === "corrigida" ||
      (id && idsEntregasCorrigidas.has(id))
    );
  }).length;

  const totalEntregas = entregas.length;
  const pendentes = Math.max(totalEntregas - entregasCorrigidas, 0);

  const percentual =
    totalEntregas > 0
      ? Math.round((entregasCorrigidas / totalEntregas) * 100)
      : 0;

  const pontuacaoTotal = notas.reduce(
    (total, nota) => total + (Number(nota.pontuacao) || 0),
    0
  );

  const pontuacaoMaxima = notas.reduce(
    (total, nota) => total + (Number(nota.pontuacaoMaxima) || 0),
    0
  );

  return (
    <main className="progresso-aluno">
      <header className="progresso-aluno__cabecalho">
        <h1>Meu progresso</h1>
        <p>
          Acompanhe suas entregas, correções e pontuação nas atividades.
        </p>
      </header>

      {carregando && (
        <p className="progresso-aluno__estado" role="status">
          Carregando seu progresso...
        </p>
      )}

      {!carregando && erro && (
        <section className="progresso-aluno__estado progresso-aluno__estado--erro">
          <p role="alert">{erro}</p>
          <button
            type="button"
            className="progresso-aluno__botao"
            onClick={() => window.location.reload()}
          >
            Tentar novamente
          </button>
        </section>
      )}

      {!carregando && !erro && (
        <>
          <section
            className="progresso-aluno__indicadores"
            aria-label="Resumo do progresso"
          >
            <article className="progresso-aluno__card">
              <span>Entregas realizadas</span>
              <strong>{totalEntregas}</strong>
              <p>Atividades enviadas</p>
            </article>

            <article className="progresso-aluno__card">
              <span>Entregas corrigidas</span>
              <strong>{entregasCorrigidas}</strong>
              <p>Com avaliação registrada</p>
            </article>

            <article className="progresso-aluno__card">
              <span>Aguardando correção</span>
              <strong>{pendentes}</strong>
              <p>Entregas ainda não corrigidas</p>
            </article>

            <article className="progresso-aluno__card">
              <span>Pontos conquistados</span>
              <strong>{pontuacaoTotal}</strong>
              <p>
                {pontuacaoMaxima > 0
                  ? `De ${pontuacaoMaxima} pontos avaliados`
                  : "Nenhuma pontuação registrada"}
              </p>
            </article>
          </section>

          <section className="progresso-aluno__detalhes">
            <div className="progresso-aluno__detalhes-topo">
              <div>
                <h2>Correção das atividades</h2>
                <p>
                  Percentual das suas entregas que já receberam correção.
                </p>
              </div>
              <strong>{percentual}%</strong>
            </div>

            <div
              className="progresso-aluno__barra"
              role="progressbar"
              aria-label="Percentual de entregas corrigidas"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={percentual}
            >
              <div
                className="progresso-aluno__barra-preenchimento"
                style={{ width: `${percentual}%` }}
              />
            </div>

            <p className="progresso-aluno__legenda">
              {entregasCorrigidas} de {totalEntregas} entrega(s) corrigida(s).
            </p>
          </section>

          {totalEntregas === 0 && (
            <section className="progresso-aluno__vazio">
              <h2>Seu progresso começa aqui!</h2>
              <p>
                Quando você enviar respostas às atividades, poderá acompanhar
                seus resultados nesta página.
              </p>
            </section>
          )}
        </>
      )}
    </main>
  );
}
